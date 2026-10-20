/**
 * WHM_PrepCheck.gs
 * Operational Tool for Warehouse Manager Sign-offs
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AB WHM PrepCheck')
    .addItem('Open PrepCheck Panel', 'showPrepCheckPanel')
    .addToUi();
}

/**
 * Panel Launcher
 */
function showPrepCheckPanel() {
  const html = HtmlService.createHtmlOutputFromFile('WHM_SidePanel')
    .setTitle('AB WHM PrepCheck')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * START REPORT: Populate sheet from live backend show_products / default_wave
 */
function startReport(sessionId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  sheet.clear();
  
  const headers = [
    'session_id', 'variant_id', 'Product Name', 'Select', 
    'Available Qty', 'QA Status', 'Current Unit Price', 'QA Comments'
  ];
  sheet.appendRow(headers);
  
  // Real world UrlFetchApp call to the PHP Backend API 
  try {
    const url = "https://your-domain.com/api/whm/prepcheck-pull?session_id=" + sessionId;
    /*
    const options = { 'method' : 'get', 'headers': { 'X_AB_KEY': 'AB-GS-INGEST-KEY-2026' } };
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    if (result.status === 'success' && result.data && result.data.length > 0) {
      let items = result.data.map(item => [
        item.session_id, item.variant_id, item.product_name, true, item.current_stock, 'good', item.current_price, ''
      ]);
      sheet.getRange(2, 1, items.length, headers.length).setValues(items);
    }
    */
    
    // Fallback Mock while debugging
    const mockItems = [
      [sessionId, 501, 'Indomie Onion 40ct', true, 100, 'excellent', 4500, ''],
      [sessionId, 502, 'Indomie Chicken 40ct', true, 120, 'good', 4200, '']
    ];
    sheet.getRange(2, 1, mockItems.length, headers.length).setValues(mockItems);
    
    sheet.setFrozenRows(1);
    return { status: 'success', message: 'Report initialized for Session ' + sessionId };
  } catch(e) {
    return { status: 'error', message: "API Error: " + e.toString() };
  }
}

/**
 * CLEAR ALL
 */
function clearAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getActiveSheet().clear();
  return { status: 'success' };
}

/**
 * SUBMIT PREPCHECK: Archive and Push to Backend
 */
function submitPrepCheck(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getActiveSheet();
  const itemsData = getSheetDataAsObjects(sourceSheet);
  
  // 1. Create Archive Folder PREP-CHECKS
  const parentFolder = getParentFolder();
  const archiveFolder = FolderOperationsHandlers.getOrCreateFolder('PREP-CHECKS', parentFolder);
  
  // 2. Create Archive File
  const fileName = `PREP_CHEK_${formData.warehouse_zone_id}_${formData.auction_session_id}`;
  const archiveFile = SpreadsheetApp.create(fileName);
  
  // 3. Sheet: REPORT (Metadata)
  const reportSheet = archiveFile.insertSheet('REPORT');
  reportSheet.appendRow(['Field', 'Value']);
  for (let key in formData) {
    reportSheet.appendRow([key, formData[key]]);
  }
  archiveFile.deleteSheet(archiveFile.getSheets()[0]); // Delete default Sheet1
  
  // 4. Sheet: ITEMS_LIST
  const itemsSheet = archiveFile.insertSheet('ITEMS_LIST');
  const headers = sourceSheet.getRange(1, 1, 1, sourceSheet.getLastColumn()).getValues()[0];
  itemsSheet.appendRow(headers);
  const data = sourceSheet.getRange(2, 1, sourceSheet.getLastRow() - 1, sourceSheet.getLastColumn()).getValues();
  itemsSheet.getRange(2, 1, data.length, headers.length).setValues(data);
  
  // 5. Move to Drive folder
  const driveFile = DriveApp.getFileById(archiveFile.getId());
  driveFile.moveTo(archiveFolder);
  const archiveUrl = driveFile.getUrl();
  
  // 6. Push to Backend
  const payload = {
    session_id: formData.auction_session_id,
    whm_staff_id: formData.whm_staff_id,
    check_type: 'Overall', // Final WHM Submission
    status: 'Verified',
    report_url: archiveUrl,
    report_metadata: formData,
    items: itemsData
  };
  
  try {
    const url = "https://your-domain.com/api/whm/prepcheck-ingest";
    /*
    const options = {
      'method' : 'post',
      'contentType': 'application/json',
      'headers': { 'X_AB_KEY': 'AB-GS-INGEST-KEY-2026' },
      'payload' : JSON.stringify(payload)
    };
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    if(json.status === 'success') return { status: 'success', archiveUrl: archiveUrl };
    */
    Logger.log('Mocking push to backend: ' + JSON.stringify(payload));
    return { status: 'success', archiveUrl: archiveUrl };
  } catch(e) {
    return { status: 'error', message: e.toString() };
  }
}
