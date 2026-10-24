/**
 * AB_SyncRelay.gs
 * Two-way synchronization coordinator between:
 * Personal Workbooks <---> UwanBuy_DB_Master (Staging Hub) <---> Central Backend Database (REST API)
 */

/**
 * Pushes local personal workbook changes outward to UwanBuy_DB_Master.
 */
function abPushToDbMaster(domain, entityType, rowData) {
  const dbMasterId = abGetDbMasterId();
  if (!dbMasterId) {
    throw new Error('UwanBuy_DB_Master Spreadsheet ID is not configured (AB_DB_MASTER_SHEET_ID).');
  }

  const stagedRecord = abStageDbRecord(domain, entityType, rowData, 'OUTBOUND');

  try {
    const ss = SpreadsheetApp.openById(dbMasterId);
    const queueSheet = ss.getSheetByName(AB.SHEETS.DB_DISPATCH_QUEUE);
    if (!queueSheet) {
      throw new Error(`Target sheet [${AB.SHEETS.DB_DISPATCH_QUEUE}] not found in UwanBuy_DB_Master.`);
    }

    queueSheet.appendRow([
      stagedRecord.stagingId,
      stagedRecord.domain,
      stagedRecord.entityType,
      stagedRecord.syncDirection,
      stagedRecord.status,
      stagedRecord.payloadJson,
      stagedRecord.stagedAt,
      '', // Synced Timestamp
      ''  // Error Message
    ]);

    // If sync mode is INSTANT, trigger immediate dispatch
    if (abGetSyncMode() === AB.SYNC_MODES.INSTANT) {
      abDispatchSingleStagedRecord_(stagedRecord, queueSheet, queueSheet.getLastRow());
    }

    return { ok: true, stagingId: stagedRecord.stagingId, status: stagedRecord.status };
  } catch (err) {
    throw new Error(`Failed to stage record to UwanBuy_DB_Master: ${err.message}`);
  }
}

/**
 * Scheduled cron or manual batch dispatcher running inside UwanBuy_DB_Master.
 * Reads pending records from DB_DISPATCH_QUEUE and sends them to backend REST API.
 */
function abScheduledDbMasterBatchSync() {
  const dbMasterId = abGetDbMasterId();
  const ss = dbMasterId ? SpreadsheetApp.openById(dbMasterId) : SpreadsheetApp.getActiveSpreadsheet();
  const queueSheet = ss.getSheetByName(AB.SHEETS.DB_DISPATCH_QUEUE);
  if (!queueSheet) return { ok: false, reason: 'Queue sheet not found' };

  const data = queueSheet.getDataRange().getValues();
  if (data.length <= 1) return { ok: true, processed: 0 };

  let processedCount = 0;
  let successCount = 0;
  let failCount = 0;

  for (let i = 1; i < data.length; i++) {
    const status = data[i][4];
    if (status === 'PENDING') {
      processedCount++;
      const stagingId = data[i][0];
      const entityType = data[i][2];
      const payloadStr = data[i][5];
      let payload = {};
      try { payload = JSON.parse(payloadStr); } catch (e) {}

      // Resolve endpoint mapping
      const endpointKey = abResolveEndpointKey_(entityType);
      try {
        const res = abApi(endpointKey, payload);
        const timestamp = new Date().toISOString();
        queueSheet.getRange(i + 1, 5).setValue('SYNCED');
        queueSheet.getRange(i + 1, 8).setValue(timestamp);
        successCount++;

        // Log to DB_SYNC_LOG
        abLogSyncActivity_(ss, stagingId, entityType, 'SUCCESS', 200, res);
      } catch (err) {
        queueSheet.getRange(i + 1, 5).setValue('FAILED');
        queueSheet.getRange(i + 1, 9).setValue(err.message);
        failCount++;
        abLogSyncActivity_(ss, stagingId, entityType, 'FAILED', 500, { error: err.message });
      }
    }
  }

  return { ok: true, processed: processedCount, success: successCount, failed: failCount };
}

/**
 * Inbound pull: Reads live customer orders and payments from backend API and writes into DB_ORDERS_FEED.
 */
function abPullLiveInboundOrdersToDbMaster() {
  const dbMasterId = abGetDbMasterId();
  const ss = dbMasterId ? SpreadsheetApp.openById(dbMasterId) : SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = ss.getSheetByName(AB.SHEETS.DB_ORDERS_FEED);
  if (!ordersSheet) throw new Error('DB_ORDERS_FEED sheet not found in DB-Master');

  const response = abApi('ORDER_ITEMS_PULL');
  const items = response.data || [];
  let addedCount = 0;

  items.forEach(item => {
    ordersSheet.appendRow([
      item.orderItemId,
      item.orderId,
      item.sessionId || 'SESS-LIVE',
      item.variantId,
      (item.productName || '') + (item.variantName ? ' - ' + item.variantName : ''),
      item.quantity,
      item.destinationAreaName || item.destinationAreaId || 'MAIN',
      item.isUrgent ? 'TRUE' : 'FALSE',
      'PAID',
      item.whmStatus || 'requested',
      new Date().toISOString()
    ]);
    addedCount++;
  });

  return { ok: true, imported: addedCount };
}

/**
 * Internal helper to resolve endpoint from entity type.
 */
function abResolveEndpointKey_(entityType) {
  switch (String(entityType).toUpperCase()) {
    case 'PRODUCT':
    case 'PRODUCTS':
      return 'PRODUCTS_LIST';
    case 'VARIANT':
    case 'VARIANTS':
      return 'VARIANTS_LIST';
    case 'PRICE':
    case 'PRICES':
    case 'SELLING_PRICE':
      return 'SELLING_PRICE_PUBLISH';
    case 'ORDER':
    case 'ORDERS':
    case 'POS_ORDER':
      return 'POS_ORDERS_POST';
    case 'INTAKE':
      return 'INTAKE_POST';
    case 'WAYBILL':
    case 'MANIFEST':
      return 'ZBD_ASSIGN_POST';
    case 'REMITTANCE':
      return 'REMITTANCE_SUBMIT';
    case 'DELIVERY_COMPLETED':
      return 'DELIVERY_COMPLETED';
    default:
      return 'ROW_ACTION';
  }
}

/**
 * Logs synchronization results into DB_SYNC_LOG.
 */
function abLogSyncActivity_(ss, stagingId, entityType, status, httpCode, response) {
  const logSheet = ss.getSheetByName(AB.SHEETS.DB_SYNC_LOG);
  if (!logSheet) return;

  logSheet.appendRow([
    'LOG-' + Date.now(),
    new Date().toISOString(),
    'UwanBuy_DB_Master',
    'cron@areabazaar.com',
    1,
    status,
    httpCode,
    stagingId
  ]);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    abPushToDbMaster,
    abScheduledDbMasterBatchSync,
    abPullLiveInboundOrdersToDbMaster,
    abResolveEndpointKey_
  };
}
