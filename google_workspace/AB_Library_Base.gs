/**
 * AB_Library_Base
 * AreaBazaar Google Workspace Integration Layer (v2.0 - Fully Restored)
 * Operational Folder Sync
 */

/**
 * MODULE A: EMAIL MESSAGE HANDLERS
 */
const EmailMessageHandlers = {
  sendUrgentEmail: function(to, subject, body, attachments = []) {
    MailApp.sendEmail({
      to: to,
      subject: "[URGENT] " + subject,
      body: body,
      attachments: attachments
    });
  },

  queueEmail: function(to, subject, body, attachments = []) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('EmailQueue') || ss.insertSheet('EmailQueue');
    sheet.appendRow([new Date(), to, subject, body, 'Pending', JSON.stringify(attachments)]);
  },

  processEmailQueue: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('EmailQueue');
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    let sentCount = 0;
    const maxPerBlock = 5;

    for (let i = 1; i < data.length; i++) {
      if (data[i][4] === 'Pending' && sentCount < maxPerBlock) {
        try {
          MailApp.sendEmail(data[i][1], data[i][2], data[i][3]);
          sheet.getRange(i + 1, 5).setValue('Sent');
          sentCount++;
        } catch (e) {
          sheet.getRange(i + 1, 5).setValue('Error: ' + e.message);
        }
      }
    }
  },

  getQuotaStatus: function() {
    return MailApp.getRemainingDailyQuota();
  }
};

/**
 * MODULE B: ACCESS CONTROL & FOLDER OPERATIONS
 */
const FolderOperationsHandlers = {
  verifyPartnerAccess: function(userId, partnerType) {
    // Logic to check partner permissions in a dedicated permission sheet
    Logger.log("Verifying access for " + userId + " as " + partnerType);
    return true; // Placeholder
  },

  setUserPermissions: function(fileId, email, role) {
    const file = DriveApp.getFileById(fileId);
    if (role === 'viewer') file.addViewer(email);
    else if (role === 'editor') file.addEditor(email);
  },

  getOrCreateFolder: function(name, parent) {
    const folders = parent.getFoldersByName(name);
    return folders.hasNext() ? folders.next() : parent.createFolder(name);
  },

  getOrCreateFolderByPath: function(path, parentId) {
    // Path-based folder creation logic
    const parts = path.split('/');
    let parent = parentId ? DriveApp.getFolderById(parentId) : DriveApp.getRootFolder();
    parts.forEach(part => {
      parent = this.getOrCreateFolder(part, parent);
    });
    return parent;
  },

  cloneTemplate: function(templateId, destinationFolderId, newName) {
    const file = DriveApp.getFileById(templateId);
    const destFolder = DriveApp.getFolderById(destinationFolderId);
    return file.makeCopy(newName, destFolder);
  }
};

/**
 * MODULE C: FILE EXPORT HANDLERS
 */
const FileExportHandlers = {
  exportToPDF: function(fileId, folderId) {
    const file = DriveApp.getFileById(fileId);
    const folder = DriveApp.getFolderById(folderId);
    const blob = file.getAs(MimeType.PDF);
    return folder.createFile(blob);
  },

  exportDocsTablesToJSON: function(docId) {
    const doc = DocumentApp.openById(docId);
    const tables = doc.getBody().getTables();
    const result = [];
    tables.forEach(table => {
      const rows = [];
      for (let i = 0; i < table.getNumRows(); i++) {
        const cols = [];
        for (let j = 0; j < table.getRow(i).getNumCells(); j++) {
          cols.push(table.getRow(i).getCell(j).getText());
        }
        rows.push(cols);
      }
      result.push(rows);
    });
    return result;
  },

  exportToJSON: function(data, fileName, folderId) {
    const folder = DriveApp.getFolderById(folderId);
    const jsonString = JSON.stringify(data, null, 2);
    return folder.createFile(fileName + '.json', jsonString, MimeType.PLAIN_TEXT);
  },

  exportToCSV: function(sheetId, folderId, fileName) {
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    const data = sheet.getDataRange().getValues();
    let csv = "";
    data.forEach(row => { csv += row.join(",") + "\n"; });
    const folder = DriveApp.getFolderById(folderId);
    return folder.createFile(fileName + '.csv', csv, MimeType.PLAIN_TEXT);
  }
};

/**
 * MODULE D: FILE CONTENT MANIPULATION
 */
const FileContentManipulateHandlers = {
  readDocBetweenMarkers: function(docId, startMarker, endMarker) {
    const doc = DocumentApp.openById(docId);
    const text = doc.getBody().getText();
    const startIdx = text.indexOf(startMarker);
    const endIdx = text.indexOf(endMarker);
    if (startIdx === -1 || endIdx === -1) return null;
    return text.substring(startIdx + startMarker.length, endIdx).trim();
  },

  substituteDocBetweenMarkers: function(docId, startMarker, endMarker, newContent) {
    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();
    const fullText = body.getText();
    const startIdx = fullText.indexOf(startMarker);
    const endIdx = fullText.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1) {
      body.replaceText(fullText.substring(startIdx + startMarker.length, endIdx), newContent);
    }
  },

  readSheetByA1: function(sheetId, a1Key) {
    const ss = SpreadsheetApp.openById(sheetId);
    return ss.getRange(a1Key).getValue();
  },

  replacePlaceholders: function(docId, replacementMap) {
    const body = DocumentApp.openById(docId).getBody();
    for (let key in replacementMap) {
      body.replaceText("{{" + key + "}}", replacementMap[key]);
    }
  },

  appendRow: function(sheetId, values) {
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    sheet.appendRow(values);
  }
};

/**
 * MODULE E: BULK DATA IMPORT HANDLERS
 */
const BulkDataImportHandlers = {
  importCSVToSheet: function(fileId, sheetId, range) {
    const csvFile = DriveApp.getFileById(fileId).getBlob().getDataAsString();
    const csvData = Utilities.parseCsv(csvFile);
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    sheet.getRange(range).setValues(csvData);
  },

  importJSONToSheet: function(jsonData, sheetId, targetRange) {
    // Basic implementation - assumes jsonData is array of arrays
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    sheet.getRange(targetRange).setValues(jsonData);
  }
};

/**
 * CORE CORE UTILITIES (Used by all modules)
 */

function getSheetDataAsObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const objects = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    headers.forEach((h, j) => { if (h) obj[h] = data[i][j]; });
    if (Object.keys(obj).length > 0) objects.push(obj);
  }
  return objects;
}

function getColIndex(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const index = headers.indexOf(headerName);
  return index !== -1 ? index + 1 : 1;
}

function getParentFolder() {
  const ssFile = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  return ssFile.getParents().next();
}

function moveFiles(source, target) {
  const files = source.getFiles();
  while (files.hasNext()) {
    files.next().moveTo(target);
  }
}

/**
 * AUTH & RESPONSE HANDLERS
 */
const AuthManager = {
  getService: function() {
    // Logic for OAuth2 or local credentials
  }
};

const ResponseHandler = {
  standardize: function(response) {
    const text = response.getContentText();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { status: 'error', message: 'Invalid JSON response from server' };
    }
  }
};
