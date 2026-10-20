/**
 * AreaBazaar Product Ingestion Bridge (v2 - Refined)
 * Paste this into a Google Sheet script editor.
 */

const CONFIG = {
  BACKEND_URL: "https://your-domain.com/api/webhook/ingest", // UPDATE THIS
  API_KEY: "AB-GS-INGEST-KEY-2026",
  FOLDERS: {
    SUBMIT: "PHOTO-SUBMIT",
    SUCCESS: "PHOTO-SUCCESS",
    SUBFOLDERS: {
        PROD: "ProductPhotos",
        VAR: "VariantPhotos"
    }
  },
  SHEETS: {
    PROD_INPUT: "PROD-INPUT",
    VAR_INPUT: "VAR-INPUT",
    PROD_SUCCESS: "PROD-SUCCESS",
    VAR_SUCCESS: "VAR-SUCCESS",
    PROD_FAIL: "PROD-FAIL",
    VAR_FAIL: "VAR-FAIL"
  }
};

/**
 * Custom Menu
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('AreaBazaar')
    .addItem('1. Absorb Product Photos', 'absorbProductPhotos')
    .addItem('2. Push Products to Backend', 'pushProducts')
    .addSeparator()
    .addItem('3. Absorb Variant Photos', 'absorbVariantPhotos')
    .addItem('4. Push Variants to Backend', 'pushVariants')
    .addSeparator()
    .addItem('Finish Loading (Archive)', 'finishLoading')
    .addToUi();
}

/**
 * 1. Absorb Product Photos
 * RENAMES based on temp_ProductID and slug. Moves to SUCCESS/ProductPhotos.
 */
function absorbProductPhotos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.PROD_INPUT);
  const data = getSheetDataAsObjects(sheet);
  
  const parentFolder = getParentFolder();
  const submitFolder = getOrCreateFolder(CONFIG.FOLDERS.SUBMIT, parentFolder);
  const subProdFolder = getOrCreateFolder(CONFIG.FOLDERS.SUBFOLDERS.PROD, submitFolder);
  const successFolder = getOrCreateFolder(CONFIG.FOLDERS.SUCCESS, parentFolder);
  const targetFolder = getOrCreateFolder(CONFIG.FOLDERS.SUBFOLDERS.PROD, successFolder);

  let count = 0;
  data.forEach((row, index) => {
    const originalName = row.original_photo_filename;
    const tempId = row.temp_id;
    const nameSlug = row.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newName = `tmp_${tempId}_${nameSlug}.jpg`;

    if (originalName && tempId) {
      const files = subProdFolder.getFilesByName(originalName);
      if (files.hasNext()) {
        const file = files.next();
        file.setName(newName);
        file.moveTo(targetFolder);
        // Update Sheet Column (Photo Filename is Col 8 usually, check index)
        sheet.getRange(index + 2, getColIndex(sheet, 'photo_filename')).setValue(newName);
        count++;
      }
    }
  });

  SpreadsheetApp.getUi().alert(`Absorbed ${count} Product Photos.`);
}

/**
 * 2. Push Products
 */
function pushProducts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.PROD_INPUT);
  const products = getSheetDataAsObjects(sheet);

  if (products.length === 0) return;

  const payload = { products: products };
  const result = callBackend(payload);

  if (result.status === 'success') {
    handlePushSuccess(result.data.products, CONFIG.SHEETS.PROD_INPUT, CONFIG.SHEETS.PROD_SUCCESS);
    syncParentIds(result.data.products);
    SpreadsheetApp.getUi().alert("Products Pushed Successfully. Parent IDs updated in Variants sheet.");
  } else {
    SpreadsheetApp.getUi().alert("Failure: " + result.message);
  }
}

/**
 * Sync Actual IDs to Variants sheet
 */
function syncParentIds(mapping) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const varSheet = ss.getSheetByName(CONFIG.SHEETS.VAR_INPUT);
  const varData = varSheet.getDataRange().getValues();
  const parentCol = getColIndex(varSheet, 'base_product_id');
  const tempParentCol = getColIndex(varSheet, 'temp_parentProductID');

  for (let i = 1; i < varData.length; i++) {
    const tempParentId = varData[i][tempParentCol - 1];
    const match = mapping.find(m => m.temp_id.toString() === tempParentId.toString());
    if (match) {
      varSheet.getRange(i + 1, parentCol).setValue(match.actual_id);
    }
  }
}

/**
 * 3. Absorb Variant Photos
 */
function absorbVariantPhotos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.VAR_INPUT);
  const data = getSheetDataAsObjects(sheet);
  
  const parentFolder = getParentFolder();
  const submitFolder = getOrCreateFolder(CONFIG.FOLDERS.SUBMIT, parentFolder);
  const subVarFolder = getOrCreateFolder(CONFIG.FOLDERS.SUBFOLDERS.VAR, submitFolder);
  const successFolder = getOrCreateFolder(CONFIG.FOLDERS.SUCCESS, parentFolder);
  const targetFolder = getOrCreateFolder(CONFIG.FOLDERS.SUBFOLDERS.VAR, successFolder);

  let count = 0;
  data.forEach((row, index) => {
    const originalName = row.original_photo_filename;
    const tempId = row.temp_id;
    const nameSlug = row.variant_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newName = `tmp_v_${tempId}_${nameSlug}.jpg`;

    if (originalName && tempId) {
      const files = subVarFolder.getFilesByName(originalName);
      if (files.hasNext()) {
        const file = files.next();
        file.setName(newName);
        file.moveTo(targetFolder);
        sheet.getRange(index + 2, getColIndex(sheet, 'photo_filename')).setValue(newName);
        count++;
      }
    }
  });

  SpreadsheetApp.getUi().alert(`Absorbed ${count} Variant Photos.`);
}

/**
 * 4. Push Variants
 */
function pushVariants() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.VAR_INPUT);
  const variants = getSheetDataAsObjects(sheet);

  if (variants.length === 0) return;

  const payload = { variants: variants };
  const result = callBackend(payload);

  if (result.status === 'success') {
    handlePushSuccess(result.data.variants, CONFIG.SHEETS.VAR_INPUT, CONFIG.SHEETS.VAR_SUCCESS);
    SpreadsheetApp.getUi().alert("Variants Pushed Successfully.");
  } else {
    SpreadsheetApp.getUi().alert("Failure: " + result.message);
  }
}

/**
 * Finish Loading (Archive)
 */
function finishLoading() {
  const parentFolder = getParentFolder();
  const successFolder = getOrCreateFolder(CONFIG.FOLDERS.SUCCESS, parentFolder);
  const dateStr = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd_HHmm");
  const archiveFolder = parentFolder.createFolder(`TRANSFER-PHOTOS_${dateStr}`);

  // Create subfolders in archive
  const arcProd = archiveFolder.createFolder(CONFIG.FOLDERS.SUBFOLDERS.PROD);
  const arcVar = archiveFolder.createFolder(CONFIG.FOLDERS.SUBFOLDERS.VAR);

  // Move Product Photos
  const prodF = getOrCreateFolder(CONFIG.FOLDERS.SUBFOLDERS.PROD, successFolder);
  moveFiles(prodF, arcProd);

  // Move Variant Photos
  const varF = getOrCreateFolder(CONFIG.FOLDERS.SUBFOLDERS.VAR, successFolder);
  moveFiles(varF, arcVar);

  SpreadsheetApp.getUi().alert(`Photos archived to TRANSFER-PHOTOS_${dateStr}. Ready for next batch.`);
}

// Internal Helpers
function callBackend(payload) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'X-AB-KEY': CONFIG.API_KEY },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(CONFIG.BACKEND_URL, options);
  return JSON.parse(response.getContentText());
}

function handlePushSuccess(mapping, inputSheetName, successSheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inputSheet = ss.getSheetByName(inputSheetName);
  const successSheet = ss.getSheetByName(successSheetName);
  const rows = inputSheet.getRange(2, 1, inputSheet.getLastRow() - 1, inputSheet.getLastColumn()).getValues();
  
  // Archiving
  successSheet.insertRowsBefore(2, rows.length);
  successSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  
  // Clear Input
  inputSheet.getRange(2, 1, inputSheet.getLastRow(), inputSheet.getLastColumn()).clearContent();
}

// Helper functions move to AB_Library_Base.gs
