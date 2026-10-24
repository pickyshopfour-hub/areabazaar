/**
 * AB_UI_Engine.gs
 * UwanBuy Google Workspace UI Engine:
 * - Dynamic custom menus (UwanBuy Admin, UwanBuy WHM, UwanBuy FRM, UwanBuy DB-Master)
 * - onOpen(e) role & workbook detection
 * - onEdit(e) Column A checkbox listener with elevated permissions
 * - Interactive HTML Sidebar and Modal dialog routers
 * - Action cell click handlers
 * - Sheet protection enforcer
 */

/**
 * Global onOpen trigger: inspects workbook role and attaches custom menu.
 */
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  const role = abDetectWorkbookRole_();

  if (role === 'ADM') {
    ui.createMenu('UwanBuy Admin')
      .addItem('New Base Product (Sidebar Form)', 'abOpenNewProductSidebar')
      .addItem('Open Variant Specs Editor', 'abOpenVariantSpecsSidebar')
      .addItem('Open Product Ingest Loading Sheet', 'abOpenProductIngestLoading')
      .addItem('Open Variant Ingest Loading Sheet', 'abOpenVariantIngestLoading')
      .addItem('📥 Ingest Products from Loading Sheet to Master', 'abIngestProductsFromLoadingSheet')
      .addItem('📥 Ingest Variants from Loading Sheet to Master', 'abIngestVariantsFromLoadingSheet')
      .addItem('Archive Current Product Ingest Batch', 'abArchiveCurrentProductIngest')
      .addItem('Restore Archived Ingest Batch...', 'abPromptRestoreIngestBatch')
      .addSeparator()
      .addItem('Open Price Update Loading Sheet', 'abOpenPriceUpdateLoading')
      .addItem('Archive Price Update Batch', 'abArchivePriceBatch')
      .addItem('Restore Archived Price Batch...', 'abPromptRestorePriceBatch')
      .addSeparator()
      .addItem('Provision Staff (Tab or Workbook)', 'abOpenStaffProvisioningSidebar')
      .addItem('Audit Staff Personal Workspaces', 'abAuditStaffWorkspaces')
      .addSeparator()
      .addItem('Sync Live Wave with Storefront', 'abSyncLiveWaveShowProducts')
      .addItem('Sync Approved Catalog to DB-Sheet (UwanBuy_DB_Master)', 'abSyncApprovedCatalogToDbMaster')
      .addItem('Publish Authorized Prices to Storefront API', 'abPublishPricesToApi')
      .addToUi();
  } else if (role === 'WHM') {
    ui.createMenu('UwanBuy WHM')
      .addItem('Pull Approved Orders from DB-Sheet', 'abPullOrdersFromDbMaster')
      .addItem('Run Sourcing Demand Resolution', 'abExecuteOrderResolution')
      .addSeparator()
      .addItem('Open Intake Receiving Terminal', 'abOpenIntakeQASidebar')
      .addItem('Open Manual Order Ingest Loading Sheet', 'abOpenManualOrderLoading')
      .addItem('Archive Current Receiving Log', 'abArchiveReceivingBatch')
      .addItem('Restore Archived Receiving Log...', 'abPromptRestoreReceivingBatch')
      .addSeparator()
      .addItem('Print Ready Package Labels (Thermal)', 'abBatchPrintLabels')
      .addItem('Transfer Labeled Parcels to Staging', 'abAdvanceToStagingBay')
      .addSeparator()
      .addItem('Build Line-Haul Carrier Manifest', 'abOpenCarrierDispatchSidebar')
      .addItem('Sync Completed Manifests & Bills to DB-Sheet', 'abSyncDispatchesToDbMaster')
      .addToUi();
  } else if (role === 'FRM') {
    ui.createMenu('UwanBuy FRM')
      .addItem('Open Walk-In POS Terminal', 'abOpenPosTerminalSidebar')
      .addItem('Enroll New Customer (Sidebar)', 'abOpenCustomerEnrollmentSidebar')
      .addSeparator()
      .addItem('Open Customer Enrollment Loading Sheet', 'abOpenCustomerLoadingSheet')
      .addItem('Open Bulk Orders Loading Sheet', 'abOpenBulkOrdersLoadingSheet')
      .addItem('Archive Current Field Signup Roster', 'abArchiveCustomerRoster')
      .addItem('Restore Archived Field Roster...', 'abPromptRestoreCustomerRoster')
      .addSeparator()
      .addItem('Build Batch Bank Remittance Package', 'abOpenRemittanceBuilderSidebar')
      .addItem('Audit Unremitted Cash-on-Hand', 'abAuditCashOnHand')
      .addSeparator()
      .addItem('Launch Handover OTP Verification Terminal', 'abOpenHandoverOtpSidebar')
      .addItem('Scan Inbound Carrier Shipment', 'abOpenParcelInboundLoadingSheet')
      .addItem('Sync Field Orders & Remittances to DB-Sheet', 'abSyncFieldDispatchesToDbMaster')
      .addItem('Refresh Commercial Catalog from DB-Sheet', 'abRefreshCommercialCatalogFromDbMaster')
      .addToUi();
  } else {
    // Default / DB-Master menu
    ui.createMenu('UwanBuy DB-Master')
      .addItem('Dispatch Outbound Queue to Backend', 'abDispatchDbSheetQueueNow')
      .addItem('Pull Live Inbound Orders from Backend', 'abPullLiveInboundOrdersNow')
      .addItem('Sync Catalog to All Personal Workbooks', 'abDistributeCatalogDownstream')
      .addItem('View System Sync Status & Health', 'abShowSyncHealthDialog')
      .addToUi();
  }
}

/**
 * Global onEdit trigger: Column A checkbox listener with elevated permissions.
 */
function onEdit(e) {
  if (!e || !e.range) return;
  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  const row = range.getRow();
  const col = range.getColumn();
  const value = e.value;

  // Header row is protected
  if (row <= 1) return;

  // Check if edited cell is Column A checkbox
  if (col === 1 && (value === 'TRUE' || value === true)) {
    // Determine user role and permissions
    const userEmail = Session.getActiveUser().getEmail();
    const role = abGetUserRole_(userEmail);

    // Read full row data
    const rowValues = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Route to appropriate sidebar/modal
    abRouteCheckboxAction_(sheetName, row, rowValues, role);

    // Reset checkbox to FALSE
    sheet.getRange(row, 1).setValue(false);
  } else if (col !== 1) {
    // Prevent direct cell typing if range is not designated editable range
    if (!abIsCellExplicitlyEditable_(sheetName, col)) {
      if (e.oldValue !== undefined) {
        range.setValue(e.oldValue);
      } else {
        range.setValue('');
      }
      SpreadsheetApp.getActiveSpreadsheet().toast(
        '⛔ Direct cell editing is locked to preserve formula and data integrity. Click Column A checkbox [ ] to open the interactive sidebar.',
        'UwanBuy Protection',
        6
      );
    }
  }
}

/**
 * Routes the row data to the matching HTML Sidebar or Modal Dialog.
 */
function abRouteCheckboxAction_(sheetName, row, rowValues, role) {
  if (sheetName === AB.SHEETS.PRODUCT_REGISTER || sheetName === 'PRODUCT-REGISTER' || sheetName === 'PRODUCT-INGEST-LOADING') {
    abOpenSidebar_('ui/Sidebar_ProductEdit', 'Edit Base Product', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.VARIANT_REGISTER || sheetName === 'VARIANT-REGISTER' || sheetName === 'VARIANT-INGEST-LOADING') {
    abOpenSidebar_('ui/Sidebar_VariantSpecs', 'Variant Specifications', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.SHOW_REGISTER || sheetName === 'SHOW-PRODUCTS-REGISTER') {
    abOpenSidebar_('ui/Sidebar_WaveSwap', 'Swap Wave / Slot', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.STOCK_SCHEDULE || sheetName === 'STOCK-SCHEDULE') {
    abOpenSidebar_('ui/Sidebar_StockQuota', 'Adjust Capacity Quota', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.SBA_PRICE_SCHEDULE || sheetName === 'SBA-PRICE-SCHEDULE') {
    abOpenSidebar_('ui/Sidebar_PriceCalculator', 'Review SBA Cost & Margins', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.SELLING_PRICE_SCHEDULE || sheetName === 'SELLING-BASE-PRICE-SCHEDULE') {
    abOpenSidebar_('ui/Sidebar_PricePublish', 'Publish Live Selling Price', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.STAFF_REGISTRY || sheetName === 'STAFF-REGISTRY') {
    abOpenSidebar_('ui/Sidebar_StaffProvisioning', 'Provision Staff Workspace', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.ORDER_ITEMS || sheetName === 'ORDER-ITEMS-INGEST') {
    abOpenSidebar_('ui/Sidebar_OrderLifecycle', 'Advance Order Item Lifecycle', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.DEMAND || sheetName === 'SOURCING-DEMAND') {
    abOpenSidebar_('ui/Sidebar_SbaDispatch', 'Assign Sourcing SBA Batch', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.INTAKE || sheetName === 'INTAKE-QA') {
    abOpenSidebar_('ui/Sidebar_QAReceiving', 'Dock Receiving QA Terminal', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.LABELS || sheetName === 'LABELS-GENERATOR' || sheetName === 'PACK-ALLOCATION') {
    abOpenSidebar_('ui/Sidebar_LabelPrint', 'Generate Thermal Shipping Label', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.ZBD || sheetName === 'ZBD-DISPATCH-MANIFEST') {
    abOpenSidebar_('ui/Sidebar_CarrierDispatch', 'Carrier Manifest & Waybill', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.AREA_CUSTOMERS || sheetName === 'AREA-CUSTOMERS') {
    abOpenSidebar_('ui/Sidebar_CustomerEnrollment', 'Customer Profile', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.PROXY_SPOT_ORDERS || sheetName === 'PROXY-SPOT-ORDERS') {
    abOpenSidebar_('ui/Sidebar_PosTerminal', 'Walk-In POS Terminal', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.FIELD_PAYMENTS || sheetName === 'FIELD-PAYMENTS-REPORT' || sheetName === 'BATCH-REMITTANCES') {
    abOpenSidebar_('ui/Sidebar_RemittanceBuilder', 'Batch Bank Remittance Package', { row: row, data: rowValues });
  } else if (sheetName === AB.SHEETS.DELIVERY_HANDOVER || sheetName === 'CUSTOMER-DELIVERY-HANDOVER') {
    abOpenSidebar_('ui/Sidebar_HandoverOTP', 'Authenticate Handover OTP', { row: row, data: rowValues });
  } else {
    // Default fallback
    SpreadsheetApp.getActiveSpreadsheet().toast('Row selected at line ' + row, 'UwanBuy Ops');
  }
}

/**
 * Opens an HTML Sidebar with contextual pre-filled parameters.
 */
function abOpenSidebar_(templateFile, title, context) {
  try {
    const template = HtmlService.createTemplateFromFile(templateFile);
    template.context = context || {};
    const html = template.evaluate()
      .setTitle(title)
      .setWidth(450);
    SpreadsheetApp.getUi().showSidebar(html);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Error Opening Sidebar: ' + err.message);
  }
}

/**
 * Detects the active workbook role from CONFIG tab or Script Properties.
 */
function abDetectWorkbookRole_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('CONFIG');
  if (configSheet) {
    const values = configSheet.getDataRange().getValues();
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === 'WORKBOOK_ROLE') return String(values[i][1]).trim().toUpperCase();
    }
  }
  const propRole = abGetProp_('AB_WORKBOOK_ROLE', '');
  if (propRole) return propRole.trim().toUpperCase();

  // Inspect sheets in active workbook
  if (ss.getSheetByName('PRODUCT-REGISTER') && ss.getSheetByName('STAFF-REGISTRY')) return 'ADM';
  if (ss.getSheetByName('ORDER-ITEMS-INGEST') || ss.getSheetByName('SOURCING-DEMAND')) return 'WHM';
  if (ss.getSheetByName('SELLING-CATALOG-VIEW') || ss.getSheetByName('CUSTOMER-DELIVERY-HANDOVER')) return 'FRM';
  if (ss.getSheetByName('DB_PRODUCTS') || ss.getSheetByName('DB_ORDERS_FEED')) return 'DB_MASTER';

  return 'ADM';
}

/**
 * Returns role assigned to a given user email from AB_ROLE_MAP.
 */
function abGetUserRole_(email) {
  const mapStr = abGetProp_(AB.PROPS.ROLE_MAP, '{}');
  try {
    const map = JSON.parse(mapStr);
    return map[email] || abGetProp_(AB.PROPS.DEV_ROLE, 'Admin');
  } catch (e) {
    return 'Admin';
  }
}

/**
 * Only designated columns in staging loading sheets are editable by users directly.
 */
function abIsCellExplicitlyEditable_(sheetName, col) {
  if (sheetName.indexOf('-LOADING') !== -1) {
    // In companion loading sheets, inputs are allowed except Col A (checkbox) and generated ID
    return col > 2;
  }
  return false;
}

// Sidebar Launcher Wrappers
function abOpenNewProductSidebar() { abOpenSidebar_('ui/Sidebar_ProductEdit', 'New Base Product', { row: null }); }
function abOpenVariantSpecsSidebar() { abOpenSidebar_('ui/Sidebar_VariantSpecs', 'Variant Specifications', { row: null }); }
function abOpenStaffProvisioningSidebar() { abOpenSidebar_('ui/Sidebar_StaffProvisioning', 'Provision Staff', { row: null }); }
function abOpenIntakeQASidebar() { abOpenSidebar_('ui/Sidebar_QAReceiving', 'Intake Receiving QA', { row: null }); }
function abOpenCarrierDispatchSidebar() { abOpenSidebar_('ui/Sidebar_CarrierDispatch', 'Carrier Dispatch', { row: null }); }
function abOpenPosTerminalSidebar() { abOpenSidebar_('ui/Sidebar_PosTerminal', 'Walk-In POS', { row: null }); }
function abOpenCustomerEnrollmentSidebar() { abOpenSidebar_('ui/Sidebar_CustomerEnrollment', 'Customer Enrollment', { row: null }); }
function abOpenRemittanceBuilderSidebar() { abOpenSidebar_('ui/Sidebar_RemittanceBuilder', 'Bank Remittance', { row: null }); }
function abOpenHandoverOtpSidebar() { abOpenSidebar_('ui/Sidebar_HandoverOTP', 'Handover OTP Verification', { row: null }); }

/**
 * Focuses / activates the PRODUCT-INGEST-LOADING sheet tab.
 */
function abOpenProductIngestLoading() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('PRODUCT-INGEST-LOADING');
  if (sheet) {
    ss.setActiveSheet(sheet);
  } else {
    SpreadsheetApp.getUi().alert('Notice', 'Sheet PRODUCT-INGEST-LOADING not found. Please provision the ADM workbook first.', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Focuses / activates the VARIANT-INGEST-LOADING sheet tab.
 */
function abOpenVariantIngestLoading() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('VARIANT-INGEST-LOADING');
  if (sheet) {
    ss.setActiveSheet(sheet);
  } else {
    SpreadsheetApp.getUi().alert('Notice', 'Sheet VARIANT-INGEST-LOADING not found. Please provision the ADM workbook first.', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Saves base product row data submitted from Sidebar_ProductEdit.
 */
function abSaveProductRow(payload) {
  if (!payload || !payload.row) throw new Error('Missing row reference in payload');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('PRODUCT-REGISTER');
  if (!sheet) sheet = ss.getSheetByName('PRODUCT-INGEST-LOADING');
  if (!sheet) throw new Error('Product sheet not found in active workbook');

  const row = Number(payload.row);
  sheet.getRange(row, 2).setValue(payload.productId || '');
  sheet.getRange(row, 3).setValue(payload.productName || '');
  sheet.getRange(row, 4).setValue(payload.category || '');
  sheet.getRange(row, 5).setValue(payload.subCategory || '');
  sheet.getRange(row, 6).setValue(payload.subSubCategory || '');
  sheet.getRange(row, 7).setValue(payload.brand || '');
  sheet.getRange(row, 8).setValue(payload.description || '');
  sheet.getRange(row, 9).setValue(payload.hasVariants ? 'TRUE' : 'FALSE');
  sheet.getRange(row, 10).setValue(payload.modalType || 'STANDARD_GRID');
  sheet.getRange(row, 11).setValue(payload.status || 'APPROVED');
  return { ok: true, row: row };
}

/**
 * Saves variant specifications submitted from Sidebar_VariantSpecs to Col I.
 */
function abSaveVariantSpecs(payload) {
  if (!payload || !payload.row) throw new Error('Missing row reference in payload');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('VARIANT-REGISTER');
  if (!sheet) sheet = ss.getSheetByName('VARIANT-INGEST-LOADING');
  if (!sheet) throw new Error('Variant sheet not found in active workbook');

  const row = Number(payload.row);
  const specsStr = typeof payload.specifications === 'string' ? payload.specifications : JSON.stringify(payload.specifications || {});
  sheet.getRange(row, 9).setValue(specsStr);
  return { ok: true, row: row, specifications: specsStr };
}

/**
 * Ingests rows from PRODUCT-INGEST-LOADING into PRODUCT-REGISTER:
 * - Preserves existing Product IDs; auto-generates IDs (PRD-xxxx) for blank rows.
 * - Archives batch into ARCHIVE-LOADING-VAULT.
 * - Clears ingested rows from the loading sheet.
 */
function abIngestProductsFromLoadingSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const loadingSheet = ss.getSheetByName('PRODUCT-INGEST-LOADING');
  const masterSheet = ss.getSheetByName('PRODUCT-REGISTER');
  const vaultSheet = ss.getSheetByName('ARCHIVE-LOADING-VAULT');

  if (!loadingSheet || !masterSheet) {
    SpreadsheetApp.getUi().alert('Error', 'Required sheets PRODUCT-INGEST-LOADING or PRODUCT-REGISTER not found.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const lastRow = loadingSheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No Data', 'PRODUCT-INGEST-LOADING has no data rows to ingest.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const data = loadingSheet.getRange(2, 1, lastRow - 1, 12).getValues();
  const rowsToIngest = [];

  const masterIds = new Set();
  if (masterSheet.getLastRow() >= 2) {
    const existing = masterSheet.getRange(2, 2, masterSheet.getLastRow() - 1, 1).getValues();
    existing.forEach(r => { if (r[0]) masterIds.add(String(r[0]).trim()); });
  }

  data.forEach((row) => {
    let [chk, id, name, cat, subCat, subSubCat, brand, desc, hasVar, modal, status, pill] = row;
    if (!name || String(name).trim() === '') return;

    id = String(id || '').trim();
    if (!id) {
      do {
        id = 'PRD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      } while (masterIds.has(id));
      masterIds.add(id);
    }

    rowsToIngest.push([
      false, // [ ]
      id,
      name,
      cat || 'Food & Agriculture',
      subCat || 'General',
      subSubCat || '',
      brand || '',
      desc || '',
      hasVar === true || String(hasVar).toUpperCase() === 'TRUE' ? 'TRUE' : 'FALSE',
      modal || 'STANDARD_GRID',
      status || 'APPROVED',
      '[⚡ Quick Edit]'
    ]);
  });

  if (rowsToIngest.length === 0) {
    SpreadsheetApp.getUi().alert('Notice', 'No valid product rows found to ingest (Product Name is required).', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const targetStartRow = masterSheet.getLastRow() + 1;
  masterSheet.getRange(targetStartRow, 1, rowsToIngest.length, 12).setValues(rowsToIngest);

  const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  masterSheet.getRange(targetStartRow, 1, rowsToIngest.length, 1).setDataValidation(rule);

  if (vaultSheet) {
    const batchId = 'BATCH-PRD-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd-HHmmss');
    const userEmail = Session.getActiveUser().getEmail() || 'admin@areabazaar.com';
    vaultSheet.appendRow([
      batchId,
      'PRODUCT-INGEST-LOADING',
      new Date(),
      userEmail,
      rowsToIngest.length,
      JSON.stringify(rowsToIngest)
    ]);
  }

  loadingSheet.getRange(2, 1, lastRow - 1, 12).clearContent();
  SpreadsheetApp.getUi().alert('Ingest Complete', `✓ Successfully ingested ${rowsToIngest.length} products into PRODUCT-REGISTER! Batch archived in vault.`, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Ingests rows from VARIANT-INGEST-LOADING into VARIANT-REGISTER:
 * - Preserves existing Variant IDs; auto-generates IDs (VAR-xxxx) for blank rows.
 * - Formats Column I specifications as canonical JSON.
 * - Archives batch into ARCHIVE-LOADING-VAULT.
 * - Clears ingested rows from the loading sheet.
 */
function abIngestVariantsFromLoadingSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const loadingSheet = ss.getSheetByName('VARIANT-INGEST-LOADING');
  const masterSheet = ss.getSheetByName('VARIANT-REGISTER');
  const vaultSheet = ss.getSheetByName('ARCHIVE-LOADING-VAULT');

  if (!loadingSheet || !masterSheet) {
    SpreadsheetApp.getUi().alert('Error', 'Required sheets VARIANT-INGEST-LOADING or VARIANT-REGISTER not found.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const lastRow = loadingSheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No Data', 'VARIANT-INGEST-LOADING has no data rows to ingest.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const data = loadingSheet.getRange(2, 1, lastRow - 1, 11).getValues();
  const rowsToIngest = [];

  const masterIds = new Set();
  if (masterSheet.getLastRow() >= 2) {
    const existing = masterSheet.getRange(2, 2, masterSheet.getLastRow() - 1, 1).getValues();
    existing.forEach(r => { if (r[0]) masterIds.add(String(r[0]).trim()); });
  }

  data.forEach((row) => {
    let [chk, varId, prodRef, varName, sku, qtyVal, qtyUnit, packType, specs, status, pill] = row;
    if (!varName || String(varName).trim() === '') return;

    varId = String(varId || '').trim();
    if (!varId) {
      do {
        varId = 'VAR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      } while (masterIds.has(varId));
      masterIds.add(varId);
    }

    let cleanSpecsJson = '{}';
    try {
      if (typeof abParseVariantSpecs === 'function' && typeof abFormatVariantSpecs === 'function') {
        cleanSpecsJson = abFormatVariantSpecs(abParseVariantSpecs(specs));
      } else {
        cleanSpecsJson = String(specs || '{}');
      }
    } catch (e) {
      cleanSpecsJson = String(specs || '{}');
    }

    rowsToIngest.push([
      false, // [ ]
      varId,
      prodRef || 'PRD-RIC-001',
      varName,
      sku || ('SKU-' + varId),
      Number(qtyVal) || 1,
      qtyUnit || 'unit',
      packType || 'BAG',
      cleanSpecsJson,
      status || 'ACTIVE',
      '[⚙️ Edit Variant Specs]'
    ]);
  });

  if (rowsToIngest.length === 0) {
    SpreadsheetApp.getUi().alert('Notice', 'No valid variant rows found to ingest (Variant Name is required).', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  const targetStartRow = masterSheet.getLastRow() + 1;
  masterSheet.getRange(targetStartRow, 1, rowsToIngest.length, 11).setValues(rowsToIngest);

  const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  masterSheet.getRange(targetStartRow, 1, rowsToIngest.length, 1).setDataValidation(rule);

  if (vaultSheet) {
    const batchId = 'BATCH-VAR-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd-HHmmss');
    const userEmail = Session.getActiveUser().getEmail() || 'admin@areabazaar.com';
    vaultSheet.appendRow([
      batchId,
      'VARIANT-INGEST-LOADING',
      new Date(),
      userEmail,
      rowsToIngest.length,
      JSON.stringify(rowsToIngest)
    ]);
  }

  loadingSheet.getRange(2, 1, lastRow - 1, 11).clearContent();
  SpreadsheetApp.getUi().alert('Ingest Complete', `✓ Successfully ingested ${rowsToIngest.length} variants into VARIANT-REGISTER! Specifications formatted to Col I.`, SpreadsheetApp.getUi().ButtonSet.OK);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    onOpen,
    onEdit,
    abRouteCheckboxAction_,
    abDetectWorkbookRole_,
    abGetUserRole_,
    abIsCellExplicitlyEditable_,
    abOpenProductIngestLoading,
    abOpenVariantIngestLoading,
    abSaveProductRow,
    abSaveVariantSpecs,
    abIngestProductsFromLoadingSheet,
    abIngestVariantsFromLoadingSheet
  };
}
