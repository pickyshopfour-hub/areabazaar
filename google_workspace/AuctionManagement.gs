/**
 * AuctionManagement.gs
 * Sub-bridge for Wave Data Preparation & Export
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AB Auction')
    .addItem('Selection: Summing', 'moveToSumming')
    .addItem('Wave Control: Side Panel', 'showSummingSidePanel')
    .addSeparator()
    .addItem('Webhook: Load Wave to Backend', 'pushWaveToBackend')
    .addToUi();
}

/**
 * Move selected variants to Summing sheet
 */
function moveToSumming() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getActiveSheet();
  const targetSheet = ss.getSheetByName('Summing') || ss.insertSheet('Summing');
  
  const data = sourceSheet.getDataRange().getValues();
  const selectionCol = getColIndex(sourceSheet, 'Select');
  const headers = data[0];
  
  let selectedData = [];
  if (targetSheet.getLastRow() === 0) {
    targetSheet.appendRow(headers);
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][selectionCol - 1] === true) {
      selectedData.push(data[i]);
    }
  }

  if (selectedData.length > 0) {
    targetSheet.getRange(targetSheet.getLastRow() + 1, 1, selectedData.length, headers.length).setValues(selectedData);
    SpreadsheetApp.getUi().alert(selectedData.length + ' items moved to Summing sheet.');
  } else {
    SpreadsheetApp.getUi().alert('No items selected. Use the "Select" checkbox column.');
  }
}

/**
 * Side Panel Launcher
 */
function showSummingSidePanel() {
  const html = HtmlService.createHtmlOutputFromFile('SidePanel')
    .setTitle('AB Summing Engine')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * MASS ADJUSTMENT LOGIC
 */
function applyMassAdjustment(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Summing');
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();
  
  const priceCol = getColIndex(sheet, 'Price');
  const type = params.type; // 'percentage' or 'absolute'
  const value = parseFloat(params.value);
  const operator = params.operator; // 'add' or 'subtract'

  // Backup current values for Revert (simplified)
  // TODO: Implement more robust multi-step undo if needed
  
  for (let i = 1; i < data.length; i++) {
    let currentPrice = parseFloat(data[i][priceCol - 1]);
    let newPrice = currentPrice;

    if (type === 'percentage') {
      let adjustment = currentPrice * (value / 100);
      newPrice = (operator === 'add') ? currentPrice + adjustment : currentPrice - adjustment;
    } else {
      newPrice = (operator === 'add') ? currentPrice + value : currentPrice - value;
    }

    sheet.getRange(i + 1, priceCol).setValue(newPrice);
  }
}

/**
 * RESET LOGIC
 */
function resetToVariantDefaults() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Summing');
  const basePriceCol = getColIndex(sheet, 'BasePrice');
  const priceCol = getColIndex(sheet, 'Price');
  
  const range = sheet.getRange(2, basePriceCol, sheet.getLastRow() - 1, 1);
  const baseValues = range.getValues();
  sheet.getRange(2, priceCol, baseValues.length, 1).setValues(baseValues);
}

/**
 * EXPORT WORKFLOW
 */
function exportWaveTemplate(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const summingSheet = ss.getSheetByName('Summing');
  
  // 1. Create Folder GEN-WAVES if not exists
  const parentFolder = getParentFolder();
  const genWavesFolder = FolderOperationsHandlers.getOrCreateFolder('GEN-WAVES', parentFolder);
  
  // 2. Clone the Summing sheet to a new file
  const fileName = `WAVE_${formData.wave_name}_${formData.session_id}_${new Date().toISOString().split('T')[0]}`;
  const newFile = SpreadsheetApp.create(fileName);
  const targetSheet = summingSheet.copyTo(newFile);
  targetSheet.setName('WaveData');
  newFile.deleteSheet(newFile.getSheets()[0]);
  
  // 3. Append JSON Metadata at bottom
  const jsonString = JSON.stringify(formData);
  targetSheet.appendRow(['--- METADATA ---']);
  targetSheet.appendRow([jsonString]);
  
  // 4. Move to folder
  const driveFile = DriveApp.getFileById(newFile.getId());
  driveFile.moveTo(genWavesFolder);
  
  return { status: 'success', fileUrl: driveFile.getUrl() };
}

/**
 * PUSH TO BACKEND (Webhook)
 */
function pushAdminWaveNow(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const summingSheet = ss.getSheetByName('Summing');
  
  if (!summingSheet) {
    return { status: 'error', message: 'Summing sheet not found. Please gather variants first.' };
  }
  
  if (!formData.session_id || !formData.wave_name) {
    return { status: 'error', message: 'Session ID and Wave Name are strictly required.' };
  }
  
  // Convert Summing Sheet rows to raw JSON objects
  const itemsData = getSheetDataAsObjects(summingSheet);
  
  if (itemsData.length === 0) {
    return { status: 'error', message: 'No items in Summing sheet to submit.' };
  }
  
  const payload = {
    metadata: formData,
    items: itemsData
  };
  
  // Real world UrlFetchApp call to the PHP Backend API 
  try {
    const url = "https://your-domain.com/api/auction/ingest-wave";  // For real production
    /* 
    const options = {
      'method' : 'post',
      'contentType': 'application/json',
      'headers': { 'X_AB_KEY': 'AB-GS-INGEST-KEY-2026' },
      'payload' : JSON.stringify(payload)
    };
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    if(json.status === 'success') return { status: 'success' };
    */
    
    // Simulate Success for Local Env:
    Logger.log("Mock PUSH to Backend Ingestion: " + JSON.stringify(payload));
    return { status: 'success' };
    
  } catch(e) {
    return { status: 'error', message: e.toString() };
  }
}
