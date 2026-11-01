/**
 * AB_Core.gs
 * Pure business logic for the UwanBuy back-office. NO Google services here,
 * so everything in this file is unit-testable in Node (scratch/verify_gws_uwanbuy.js).
 *
 * OPERATING RULE: sourcing is ORDER-DRIVEN. The warehouse holds no standing
 * inventory. "Stock" means sellable capacity committed per session (Stock Schedule),
 * and goods are bought from SBAs only after orders are resolved.
 *
 * Money: all calculations use integer kobo ("Minor"). Sheets display naira.
 */

// ---------------------------------------------------------------------------
// 1. ORDER-ITEM LIFECYCLE  (mirrors order_items.whm_status enum in schema.sql)
// ---------------------------------------------------------------------------
const AB_WHM_FLOW = [
  'requested', 'supplied', 'QA-passed', 'packed', 'labelled',
  'staging-land', 'staging-cleared', 'area-sorted',
  'loaded', 'zbd-transit',
  'area-land', 'area-cleared',
  'dispatched'
];

/** Which department owns each stage, and which ADM monitor shows it. */
const AB_STAGE_GROUPS = {
  WHM:      { owner: 'WHM',   statuses: ['requested', 'supplied', 'QA-passed', 'packed', 'labelled'] },
  STAGING:  { owner: 'WHM',   statuses: ['staging-land', 'staging-cleared', 'area-sorted'] },
  ZBD:      { owner: 'ZBDp',  statuses: ['loaded', 'zbd-transit'] },
  LMD:      { owner: 'FRM',   statuses: ['area-land', 'area-cleared'] },
  DELIVERY: { owner: 'FRM',   statuses: ['dispatched'] }
};

/**
 * Only forward, one-step transitions are allowed. Skipping or reversing a stage
 * needs an explicit ADM override (recorded with a reason by the backend).
 */
function abCanTransition(from, to) {
  const i = AB_WHM_FLOW.indexOf(from);
  const j = AB_WHM_FLOW.indexOf(to);
  if (i === -1 || j === -1) return { ok: false, reason: 'Unknown status: ' + (i === -1 ? from : to) };
  if (j !== i + 1) return { ok: false, reason: 'Illegal transition ' + from + ' -> ' + to + ' (next allowed: ' + (AB_WHM_FLOW[i + 1] || 'none') + ')' };
  return { ok: true };
}

function abStageGroupOf(status) {
  for (const key in AB_STAGE_GROUPS) {
    if (AB_STAGE_GROUPS[key].statuses.indexOf(status) !== -1) return key;
  }
  return null;
}

// ---------------------------------------------------------------------------
// 2. ROLE PERMISSIONS  (staff_users.role: Admin | SeniorAdmin | WHM | Sales)
// ---------------------------------------------------------------------------
const AB_PERMISSIONS = {
  // Generic row actions
  view:              ['Admin', 'SeniorAdmin', 'WHM'],
  query:             ['Admin', 'SeniorAdmin', 'WHM'],
  flag:              ['Admin', 'SeniorAdmin', 'WHM'],
  ack:               ['Admin', 'SeniorAdmin', 'WHM'],
  // Catalogue + schedules
  load_products:     ['Admin', 'SeniorAdmin', 'WHM'],
  propose_schedule:  ['Admin', 'SeniorAdmin', 'WHM'],
  approve_schedule:  ['SeniorAdmin'],
  approve_product:   ['SeniorAdmin'],
  publish_price:     ['SeniorAdmin'],
  // Orders + partners
  approve_order_item:['Admin', 'SeniorAdmin'],
  approve_sba_batch: ['SeniorAdmin'],
  approve_bill:      ['SeniorAdmin'],
  // WHM fulfilment
  resolve_orders:    ['WHM', 'Admin', 'SeniorAdmin'],
  assign_sba:        ['WHM'],
  record_intake:     ['WHM'],
  advance_item:      ['WHM'],
  assign_zbd:        ['WHM'],
  compile_bills:     ['WHM'],
  override_status:   ['SeniorAdmin']
};

function abCan(role, action) {
  const allowed = AB_PERMISSIONS[action];
  return !!allowed && allowed.indexOf(role) !== -1;
}

function abAssertCan(role, action) {
  if (!abCan(role, action)) {
    throw new Error('Permission denied: role "' + (role || 'unknown') + '" cannot perform "' + action + '"');
  }
}

// ---------------------------------------------------------------------------
// 3. MONEY HELPERS
// ---------------------------------------------------------------------------
function abToMinor(naira) { return Math.round((Number(naira) || 0) * 100); }
function abToNaira(minor) { return Math.round(Number(minor) || 0) / 100; }
function abRoundUp(minor, step) {
  step = Number(step) || 0;
  if (step <= 0) return Math.round(minor);
  return Math.ceil(Math.round(minor) / step) * step;
}

// ---------------------------------------------------------------------------
// 4. PRICING  (Handling Cost P8 -> Selling Base Price Schedule P9)
// ---------------------------------------------------------------------------
const AB_HANDLING_COMPONENTS = ['transportMinor', 'washingMinor', 'splittingMinor', 'baggingMinor', 'labellingMinor', 'loadingMinor', 'overheadMinor'];

function abHandlingTotal(row) {
  return AB_HANDLING_COMPONENTS.reduce((s, k) => s + Math.round(Number(row[k]) || 0), 0);
}

/**
 * Selling base price per sellable unit.
 *   unitCost = sbaUnitPrice + handling + transportBenchmark   (cost floor)
 *   price    = roundUp(unitCost * (1 + margin%), roundTo)
 * The result can never be below the cost floor.
 */
function abDeriveSellingPrice(input) {
  const sba = Math.round(Number(input.sbaUnitPriceMinor) || 0);
  const handling = Math.round(Number(input.handlingMinor) || 0);
  const transport = Math.round(Number(input.transportMinor) || 0);
  const marginPct = (input.marginPct === undefined || input.marginPct === '' || input.marginPct === null)
    ? AB.DEFAULTS.MARGIN_PCT : Number(input.marginPct);
  const roundTo = (input.roundToMinor === undefined || input.roundToMinor === '') ? AB.DEFAULTS.ROUND_TO_MINOR : Number(input.roundToMinor);

  const warnings = [];
  if (sba <= 0) warnings.push('Missing SBA price');
  if (marginPct < 0) warnings.push('Negative margin');

  const costFloorMinor = sba + handling + transport;
  let priceMinor = abRoundUp(costFloorMinor * (1 + marginPct / 100), roundTo);
  if (priceMinor < costFloorMinor) priceMinor = abRoundUp(costFloorMinor, roundTo);

  const marginMinor = priceMinor - costFloorMinor;
  return {
    costFloorMinor,
    priceMinor,
    marginMinor,
    effectiveMarginPct: priceMinor > 0 ? Math.round((marginMinor / priceMinor) * 10000) / 100 : 0,
    warnings
  };
}

/**
 * Per-variant price from a base-product unit price.
 * Split packs: variant.quantityValue units of the base unit.
 */
function abVariantUnitCost(baseUnitCostMinor, quantityValue) {
  const q = Number(quantityValue) || 1;
  return Math.round(baseUnitCostMinor * q);
}

// ---------------------------------------------------------------------------
// 5. ORDER RESOLUTION  (WHM: sum all approved order items per product per WHZ)
// ---------------------------------------------------------------------------
/**
 * items: [{ orderItemId, orderId, productId, productName, variantId, variantName,
 *           quantity, quantityValue, quantityUnit, whzId, whmStatus, adminApproved,
 *           isUrgent, createdAt, destinationAreaId }]
 * Returns demand lines keyed by product+WHZ in BASE units (quantity * quantityValue).
 */
function abResolveOrders(items, opts) {
  opts = opts || {};
  const whz = opts.whzId ? String(opts.whzId) : null;
  const groups = {};
  const skipped = [];

  items.forEach(it => {
    if (!it.adminApproved) { skipped.push({ orderItemId: it.orderItemId, reason: 'not_admin_approved' }); return; }
    if (it.whmStatus !== 'requested') { skipped.push({ orderItemId: it.orderItemId, reason: 'already_' + it.whmStatus }); return; }
    if (whz && String(it.whzId) !== whz) { skipped.push({ orderItemId: it.orderItemId, reason: 'other_whz' }); return; }

    const qty = Math.max(0, parseInt(it.quantity, 10) || 0);
    const perUnit = Number(it.quantityValue) || 1;
    const key = it.productId + '|' + it.whzId;

    if (!groups[key]) {
      groups[key] = {
        productId: it.productId,
        productName: it.productName,
        whzId: it.whzId,
        baseUnit: it.quantityUnit || 'unit',
        totalBaseQty: 0,
        orderedUnits: 0,
        orderItemIds: [],
        urgentCount: 0,
        variants: {},
        warnings: []
      };
    }
    const g = groups[key];
    if (it.quantityUnit && g.baseUnit !== it.quantityUnit) {
      g.warnings.push('Unit mismatch on item ' + it.orderItemId + ': ' + it.quantityUnit + ' vs ' + g.baseUnit);
    }
    g.totalBaseQty += qty * perUnit;
    g.orderedUnits += qty;
    g.orderItemIds.push(it.orderItemId);
    if (it.isUrgent) g.urgentCount++;
    g.variants[it.variantName || it.variantId] = (g.variants[it.variantName || it.variantId] || 0) + qty;
  });

  const demand = Object.keys(groups).map(k => {
    const g = groups[k];
    g.totalBaseQty = Math.round(g.totalBaseQty * 1000) / 1000;
    return g;
  }).sort((a, b) => (b.urgentCount - a.urgentCount) || String(a.productName).localeCompare(String(b.productName)));

  return { demand, skipped };
}

// ---------------------------------------------------------------------------
// 6. SBA ASSIGNMENT SUGGESTION  (uses Product Sourcing Schedule P10 + SBA Price P7)
// ---------------------------------------------------------------------------
/**
 * sourcing rows: [{ productId, whzId, sbaId, sbaName, priority, dailyCapacityBulk,
 *                   bulkUnitSize, bulkUnitLabel, market, active }]
 * prices: [{ productId, whzId, sbaId, bulkPriceMinor }]
 * Splits each demand line across SBAs by priority and capacity (in bulk units).
 */
function abSuggestSbaBatches(demand, sourcing, prices) {
  const batches = [];
  const shortfalls = [];

  demand.forEach(d => {
    const options = sourcing
      .filter(s => String(s.productId) === String(d.productId) && String(s.whzId) === String(d.whzId) && s.active !== false && String(s.active).toLowerCase() !== 'false')
      .sort((a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99));

    if (options.length === 0) {
      shortfalls.push({ productId: d.productId, productName: d.productName, whzId: d.whzId, missingBulk: null, reason: 'no_sourcing_schedule' });
      return;
    }

    // Bulk unit size is taken from the primary option; all options for one product must agree.
    const bulkSize = Number(options[0].bulkUnitSize) || 1;
    let remaining = Math.ceil(d.totalBaseQty / bulkSize - 1e-9);

    options.forEach(opt => {
      if (remaining <= 0) return;
      const cap = Number(opt.dailyCapacityBulk);
      const take = (isNaN(cap) || cap <= 0) ? remaining : Math.min(remaining, cap);
      if (take <= 0) return;
      const p = prices.find(x => String(x.productId) === String(d.productId) && String(x.whzId) === String(d.whzId) && String(x.sbaId) === String(opt.sbaId));
      const unitPrice = p ? Math.round(Number(p.bulkPriceMinor) || 0) : 0;
      batches.push({
        productId: d.productId,
        productName: d.productName,
        whzId: d.whzId,
        sbaId: opt.sbaId,
        sbaName: opt.sbaName,
        market: opt.market || '',
        bulkQty: take,
        bulkUnitLabel: opt.bulkUnitLabel || 'unit',
        benchmarkBulkPriceMinor: unitPrice,
        budgetMinor: unitPrice * take,
        orderItemIds: d.orderItemIds.slice(),
        priceMissing: !p
      });
      remaining -= take;
    });

    if (remaining > 0) {
      shortfalls.push({ productId: d.productId, productName: d.productName, whzId: d.whzId, missingBulk: remaining, reason: 'capacity_exceeded' });
    }
  });

  return { batches, shortfalls };
}

// ---------------------------------------------------------------------------
// 7. INTAKE + QA  (variance against SBA benchmark)
// ---------------------------------------------------------------------------
function abEvaluateIntake(batch, intake) {
  const supplied = Math.max(0, Number(intake.suppliedBulkQty) || 0);
  const rejected = Math.max(0, Number(intake.qaRejectedBulkQty) || 0);
  const actualTotal = Math.round(Number(intake.actualTotalCostMinor) || 0);
  const benchmarkTotal = Math.round(batch.benchmarkBulkPriceMinor * supplied);
  const variance = actualTotal - benchmarkTotal;
  const variancePct = benchmarkTotal > 0 ? Math.round((variance / benchmarkTotal) * 10000) / 100 : 0;
  const accepted = Math.max(0, supplied - rejected);

  let qaStatus = 'QApassed';
  if (accepted === 0 && supplied > 0) qaStatus = 'QArejected';
  else if (rejected > 0 || intake.qaRisk) qaStatus = 'QArisk';

  return {
    suppliedBulkQty: supplied,
    acceptedBulkQty: accepted,
    shortBulkQty: Math.max(0, batch.bulkQty - accepted),
    benchmarkTotalMinor: benchmarkTotal,
    actualTotalCostMinor: actualTotal,
    varianceMinor: variance,
    variancePct,
    varianceAlert: Math.abs(variancePct) > AB.DEFAULTS.COST_VARIANCE_ALERT_PCT,
    qaStatus
  };
}

// ---------------------------------------------------------------------------
// 8. PACK ALLOCATION  (accepted supply -> individual order items)
// ---------------------------------------------------------------------------
/**
 * acceptedBaseQty: { productId: baseQtyAvailable }
 * Urgent items first, then oldest first. Items are only packable when fully covered
 * (no partial order items).
 */
function abAllocateToOrderItems(items, acceptedBaseQty) {
  const pool = Object.assign({}, acceptedBaseQty);
  const sorted = items.slice().sort((a, b) =>
    ((b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0)) ||
    String(a.createdAt || '').localeCompare(String(b.createdAt || '')) ||
    String(a.orderItemId).localeCompare(String(b.orderItemId)));

  const allocated = [];
  const shortfall = [];
  sorted.forEach(it => {
    const need = (parseInt(it.quantity, 10) || 0) * (Number(it.quantityValue) || 1);
    const have = Number(pool[it.productId]) || 0;
    if (have + 1e-9 >= need) {
      pool[it.productId] = Math.round((have - need) * 1000) / 1000;
      allocated.push({ orderItemId: it.orderItemId, productId: it.productId, baseQty: need });
    } else {
      shortfall.push({ orderItemId: it.orderItemId, productId: it.productId, needBaseQty: need, availableBaseQty: have });
    }
  });
  return { allocated, shortfall, leftover: pool };
}

// ---------------------------------------------------------------------------
// 9. LABELS  (never print the delivery passcode)
// ---------------------------------------------------------------------------
function abBuildLabel(item) {
  return {
    labelCode: 'UWB-' + item.orderId + '-' + item.orderItemId,
    orderId: item.orderId,
    orderItemId: item.orderItemId,
    customerName: item.customerName || '',
    customerPhoneMasked: abMaskPhone_(item.customerPhone),
    itemDescription: (item.productName || '') + (item.variantName ? ' — ' + item.variantName : '') + ' x' + item.quantity,
    destinationArea: item.destinationAreaName || item.destinationAreaId || '',
    outlet: item.outletName || '',
    urgent: !!item.isUrgent
  };
}

function abMaskPhone_(phone) {
  const p = String(phone || '');
  if (p.length < 7) return p ? '***' : '';
  return p.slice(0, 4) + '****' + p.slice(-3);
}

// ---------------------------------------------------------------------------
// 10. STAGING AREA-SORT + ZBD ASSIGNMENTS  (zbd_assignments: per area per product)
// ---------------------------------------------------------------------------
function abAreaSort(items) {
  const byArea = {};
  items.forEach(it => {
    const area = String(it.destinationAreaId || 'UNASSIGNED');
    if (!byArea[area]) byArea[area] = { destinationAreaId: area, destinationAreaName: it.destinationAreaName || area, packageCount: 0, orderIds: {}, items: [] };
    byArea[area].packageCount++;
    byArea[area].orderIds[it.orderId] = true;
    byArea[area].items.push(it.orderItemId);
  });
  return Object.keys(byArea).sort().map(k => {
    const a = byArea[k];
    a.orderCount = Object.keys(a.orderIds).length;
    delete a.orderIds;
    return a;
  });
}

/**
 * transport: [{ productId, routeId, areaId, pricePerUnitMinor }]  (transport_benchmark_cost)
 */
function abBuildZbdAssignments(items, transport) {
  const map = {};
  items.forEach(it => {
    const key = it.destinationAreaId + '|' + it.productId;
    if (!map[key]) map[key] = { destinationAreaId: it.destinationAreaId, productId: it.productId, productName: it.productName, totalQuantity: 0, orderItemIds: [] };
    map[key].totalQuantity += parseInt(it.quantity, 10) || 0;
    map[key].orderItemIds.push(it.orderItemId);
  });
  return Object.keys(map).sort().map(k => {
    const a = map[k];
    const t = (transport || []).find(x => String(x.productId) === String(a.productId) && String(x.areaId) === String(a.destinationAreaId));
    a.transportPricePerUnitMinor = t ? Math.round(Number(t.pricePerUnitMinor) || 0) : 0;
    a.transportPriceMinor = a.transportPricePerUnitMinor * a.totalQuantity;
    a.priceMissing = !t;
    a.progressStatus = 'unassigned';
    return a;
  });
}

// ---------------------------------------------------------------------------
// 11. BILLS  (SBA acquisitions + ZBDp transport, posted for sADM approval)
// ---------------------------------------------------------------------------
function abCompileBills(sbaIntakes, zbdAssignments) {
  const bills = [];
  const sbaTotals = {};
  sbaIntakes.forEach(x => {
    const k = x.sbaId;
    if (!sbaTotals[k]) sbaTotals[k] = { partnerType: 'SBA', partnerId: x.sbaId, partnerName: x.sbaName, lines: 0, amountMinor: 0, varianceMinor: 0 };
    sbaTotals[k].lines++;
    sbaTotals[k].amountMinor += Math.round(Number(x.actualTotalCostMinor) || 0);
    sbaTotals[k].varianceMinor += Math.round(Number(x.varianceMinor) || 0);
  });
  Object.keys(sbaTotals).forEach(k => bills.push(sbaTotals[k]));

  const zbdTotals = {};
  zbdAssignments.filter(z => z.zbdpId).forEach(z => {
    const k = z.zbdpId;
    if (!zbdTotals[k]) zbdTotals[k] = { partnerType: 'ZBDp', partnerId: z.zbdpId, partnerName: z.zbdpName || z.zbdpId, lines: 0, amountMinor: 0, varianceMinor: 0 };
    zbdTotals[k].lines++;
    zbdTotals[k].amountMinor += Math.round(Number(z.transportPriceMinor) || 0);
  });
  Object.keys(zbdTotals).forEach(k => bills.push(zbdTotals[k]));

  bills.forEach(b => { b.status = 'pending_sadm_approval'; });
  return bills;
}

// ---------------------------------------------------------------------------
// 12. MONITOR HELPERS  (dwell time per stage)
// ---------------------------------------------------------------------------
function abDwellHours(statusChangedAt, now) {
  const t = new Date(statusChangedAt).getTime();
  if (isNaN(t)) return null;
  const n = (now ? new Date(now) : new Date()).getTime();
  return Math.round(((n - t) / 3600000) * 10) / 10;
}

function abDwellAlert(group, hours) {
  if (hours === null) return false;
  if (group === 'STAGING') return hours > AB.DEFAULTS.STAGING_DWELL_ALERT_HOURS;
  if (group === 'LMD') return hours > AB.DEFAULTS.LMD_DWELL_ALERT_HOURS;
  return false;
}

// ---------------------------------------------------------------------------
// 13. VARIANT SPECIFICATIONS  (JSON / Key-Value Pairs for Col I)
// ---------------------------------------------------------------------------
/**
 * Safely parses a variant specifications string into a key-value object.
 * Accepts valid JSON strings, or semicolon-delimited key-value pairs (e.g. "RAM: 8GB; Storage: 256GB").
 * Returns empty object {} on invalid or empty input.
 */
function abParseVariantSpecs(specsCell) {
  if (!specsCell) return {};
  if (typeof specsCell === 'object' && !Array.isArray(specsCell)) return specsCell;
  const raw = String(specsCell).trim();
  if (!raw) return {};

  if ((raw.startsWith('{') && raw.endsWith('}')) || (raw.startsWith('[') && raw.endsWith(']'))) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Fall through to key-value string parsing
    }
  }

  // Parse "Key: Value; Key2: Value2"
  const result = {};
  const pairs = raw.split(/[;\n]+/);
  pairs.forEach(p => {
    const idx = p.indexOf(':');
    if (idx !== -1) {
      const k = p.substring(0, idx).trim();
      const v = p.substring(idx + 1).trim();
      if (k) result[k] = v;
    }
  });
  return result;
}

/**
 * Formats a key-value object into a clean JSON string for storage in Col I.
 */
function abFormatVariantSpecs(specsObj) {
  if (!specsObj || typeof specsObj !== 'object' || Array.isArray(specsObj)) return '{}';
  const clean = {};
  Object.keys(specsObj).sort().forEach(k => {
    const val = specsObj[k];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      clean[String(k).trim()] = String(val).trim();
    }
  });
  return JSON.stringify(clean);
}

// ---------------------------------------------------------------------------
// 14. SHOW PRODUCTS EVALUATOR  (Live wave projection)
// ---------------------------------------------------------------------------
/**
 * Projects active wave variants into SHOW-PRODUCTS-REGISTER format.
 */
function abEvaluateShowProducts(activeWave, allVariants) {
  if (!activeWave || activeWave.waveStatus !== 'LIVE_SHOWING') return [];
  const waveId = activeWave.waveId;
  const sessionRef = activeWave.sessionId || activeWave.sessionRef || '';
  const waveVariants = (allVariants || []).filter(v => 
    String(v.waveId) === String(waveId) || (activeWave.variantIds && activeWave.variantIds.indexOf(v.variantId) !== -1)
  );

  return waveVariants.map((v, idx) => {
    const refPrice = Math.round(Number(v.sellingPriceMinor || v.refPriceMinor || 0) / 100);
    const waveDiscountPct = Number(activeWave.discountPct) || 0;
    const wavePrice = waveDiscountPct > 0 ? Math.round(refPrice * (1 - waveDiscountPct / 100)) : refPrice;
    return {
      slot: idx + 1,
      sessionRef: sessionRef,
      waveId: waveId,
      variantId: v.variantId,
      title: (v.productTitle || v.productName || '') + (v.variantName ? ' - ' + v.variantName : ''),
      auctionFormat: activeWave.auctionFormat || 'DUTCH_AUCTION_DROP',
      refPrice: refPrice,
      wavePrice: wavePrice,
      moq: parseInt(v.moq, 10) || 1,
      timerRemainingMins: Math.max(0, parseInt(activeWave.timerMinutes, 10) || 0),
      showStatus: 'ACTIVE'
    };
  });
}

// ---------------------------------------------------------------------------
// 15. LOADING SHEET VALIDATOR & ID PRESERVATION
// ---------------------------------------------------------------------------
/**
 * Validates rows in a companion loading sheet:
 * - Preserves existing ID or generates a new one.
 * - Checks required fields and data constraints.
 */
function abValidateLoadingSheet(sheetType, rows, existingMasterIds, idGeneratorFn) {
  existingMasterIds = existingMasterIds || [];
  const masterIdSet = new Set(existingMasterIds.map(String));
  const validatedRows = [];
  const errors = [];

  rows.forEach((row, idx) => {
    const rowIndex = idx + 2; // Assuming 1 header row
    const rowCopy = Object.assign({}, row);
    let isUpdate = false;

    if (rowCopy.id && String(rowCopy.id).trim() !== '') {
      const idStr = String(rowCopy.id).trim();
      if (masterIdSet.has(idStr)) {
        isUpdate = true;
      }
      rowCopy.id = idStr;
    } else {
      rowCopy.id = idGeneratorFn ? idGeneratorFn(sheetType, idx) : ('GEN-' + sheetType + '-' + Date.now() + '-' + idx);
    }

    rowCopy._operation = isUpdate ? 'UPDATE' : 'NEW';

    // Specific sheet type validation
    if (sheetType === 'PRODUCT-INGEST' || sheetType === 'PRODUCT-REGISTER') {
      if (!rowCopy.productName || String(rowCopy.productName).trim() === '') {
        errors.push({ row: rowIndex, field: 'productName', message: 'Missing product name' });
      }
    } else if (sheetType === 'VARIANT-INGEST' || sheetType === 'VARIANT-REGISTER') {
      if (!rowCopy.baseProductRef || String(rowCopy.baseProductRef).trim() === '') {
        errors.push({ row: rowIndex, field: 'baseProductRef', message: 'Missing base product reference' });
      }
      if (rowCopy.specifications) {
        rowCopy.specifications = abFormatVariantSpecs(abParseVariantSpecs(rowCopy.specifications));
      }
    } else if (sheetType === 'PRICE-UPDATE') {
      if (Number(rowCopy.benchmarkCostMinor || rowCopy.priceMinor) < 0) {
        errors.push({ row: rowIndex, field: 'price', message: 'Price cannot be negative' });
      }
    }

    validatedRows.push(rowCopy);
  });

  return {
    valid: errors.length === 0,
    rows: validatedRows,
    errors: errors,
    summary: {
      total: rows.length,
      newCount: validatedRows.filter(r => r._operation === 'NEW').length,
      updateCount: validatedRows.filter(r => r._operation === 'UPDATE').length
    }
  };
}

// ---------------------------------------------------------------------------
// 16. BATCH ARCHIVING & RESTORATION
// ---------------------------------------------------------------------------
function abArchiveBatch(sheetType, rows, userEmail) {
  const batchId = 'BATCH-' + String(sheetType).toUpperCase() + '-' + Date.now();
  const archivedAt = new Date().toISOString();
  const archiveRecord = {
    batchId: batchId,
    sheetType: sheetType,
    archivedAt: archivedAt,
    archivedBy: userEmail || 'system@areabazaar.com',
    rowCount: rows.length,
    payloadJson: JSON.stringify(rows)
  };
  return archiveRecord;
}

function abRestoreBatch(archiveVaultRows, targetBatchId) {
  const match = (archiveVaultRows || []).find(r => String(r.batchId) === String(targetBatchId));
  if (!match) {
    return { ok: false, reason: 'Batch ID not found: ' + targetBatchId };
  }
  try {
    const rows = JSON.parse(match.payloadJson);
    return { ok: true, batchId: match.batchId, sheetType: match.sheetType, rows: rows };
  } catch (err) {
    return { ok: false, reason: 'Failed to parse archived JSON: ' + err.message };
  }
}

// ---------------------------------------------------------------------------
// 17. CENTRAL DB-SHEET RELAY & STAGING
// ---------------------------------------------------------------------------
/**
 * Stages a record for intermediate storage in UwanBuy_DB_Master.
 */
function abStageDbRecord(domain, entityType, rowData, syncDirection) {
  const stagingId = 'STG-' + String(entityType).toUpperCase() + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  return {
    stagingId: stagingId,
    domain: domain,
    entityType: entityType,
    syncDirection: syncDirection || 'OUTBOUND',
    status: 'PENDING',
    payloadJson: JSON.stringify(rowData),
    stagedAt: new Date().toISOString(),
    syncedAt: null,
    error: null
  };
}

/**
 * Prepares pending DB records for backend dispatch.
 */
function abPrepareDbBatchDispatch(pendingRecords) {
  return (pendingRecords || [])
    .filter(r => r.status === 'PENDING')
    .map(r => ({
      stagingId: r.stagingId,
      entityType: r.entityType,
      direction: r.syncDirection,
      payload: typeof r.payloadJson === 'string' ? JSON.parse(r.payloadJson) : r.payloadJson
    }));
}

// ---------------------------------------------------------------------------
// 18. DYNAMIC STAFF PROVISIONING EVALUATOR
// ---------------------------------------------------------------------------
/**
 * Determines whether a staff member receives a Tab (Tier 1) inside their personal workbook
 * or a full standalone Workbook (Tier 2).
 */
function abEvaluateStaffProvisioning(staffRecord) {
  const role = staffRecord.role || staffRecord.assignedRole || '';
  const facility = staffRecord.facility || staffRecord.assignedFacility || 'MAIN';
  const staffId = staffRecord.staffId || 'STF-UNKNOWN';
  const email = staffRecord.email || '';

  // Multi-dependency roles require a full standalone workbook
  const multiDependencyRoles = ['SeniorAdmin', 'LeadAdmin', 'LeadWHM', 'LeadFRM', 'WarehouseManager', 'RegionalManager'];
  const isTier2 = multiDependencyRoles.indexOf(role) !== -1 || staffRecord.provisioningTier === 'TIER_2' || staffRecord.provisioningTier === 2;

  if (isTier2) {
    return {
      tier: 'TIER_2',
      type: 'WORKBOOK',
      workbookName: role + '_Ops_' + (staffRecord.fullName || staffId).replace(/\s+/g, '_') + '_' + staffId,
      templateKey: role.toUpperCase() + '_TEMPLATE',
      targetOwnerEmail: email,
      description: 'Dedicated standalone Google Sheet workbook with complete multi-dependency register suite.'
    };
  } else {
    return {
      tier: 'TIER_1',
      type: 'TAB',
      tabName: 'TAB-' + role.toUpperCase() + '-' + staffId,
      targetPersonalWorkbookId: staffRecord.personalWorkbookId || null,
      targetOwnerEmail: email,
      description: 'Dedicated, locked Sheet Tab inside that staff member\'s personal isolated workbook.'
    };
  }
}

// ---------------------------------------------------------------------------
// EXPORTS (For Node test harness)
// ---------------------------------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AB_WHM_FLOW,
    AB_STAGE_GROUPS,
    AB_PERMISSIONS,
    abCanTransition,
    abStageGroupOf,
    abCan,
    abAssertCan,
    abToMinor,
    abToNaira,
    abRoundUp,
    abHandlingTotal,
    abDeriveSellingPrice,
    abVariantUnitCost,
    abResolveOrders,
    abSuggestSbaBatches,
    abEvaluateIntake,
    abAllocateToOrderItems,
    abBuildLabel,
    abAreaSort,
    abBuildZbdAssignments,
    abCompileBills,
    abDwellHours,
    abDwellAlert,
    abParseVariantSpecs,
    abFormatVariantSpecs,
    abEvaluateShowProducts,
    abValidateLoadingSheet,
    abArchiveBatch,
    abRestoreBatch,
    abStageDbRecord,
    abPrepareDbBatchDispatch,
    abEvaluateStaffProvisioning
  };
}

