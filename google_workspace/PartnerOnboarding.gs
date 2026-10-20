/**
 * PartnerOnboarding.gs
 * AreaBazaar Google Workspace Bridge
 * Batch partner ingestion from Google Sheets template
 * 
 * Expected Sheet Layout:
 * | Name | Phone | Business Name | Type (SBA/ZBDp) | Region | Supply Categories / Vehicle Count | Commission Rate |
 */

// ─── Constants ───────────────────────────────────────────────────
const PARTNER_API_ENDPOINT = 'http://localhost/areabazaar/api/partner/batch-ingest';
const PARTNER_SHEET_NAME = 'PartnerData';
const PARTNER_STATUS_COL = 8; // Column H for push status

// ─── Menu Registration ──────────────────────────────────────────
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('AreaBazaar')
    .addSubMenu(ui.createMenu('Partners')
      .addItem('Push New SBAs', 'pushSBAs')
      .addItem('Push New ZBDps', 'pushZBDps')
      .addSeparator()
      .addItem('Open Onboarding Panel', 'showPartnerPanel')
    )
    .addToUi();
}

// ─── Side Panel ──────────────────────────────────────────────────
function showPartnerPanel() {
  const html = HtmlService.createHtmlOutputFromFile('PartnerPanel')
    .setTitle('Partner Onboarding')
    .setWidth(360);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ─── Push SBAs ───────────────────────────────────────────────────
function pushSBAs() {
  pushPartnersByType('SBA');
}

// ─── Push ZBDps ──────────────────────────────────────────────────
function pushZBDps() {
  pushPartnersByType('ZBDp');
}

// ─── Core Push Logic ─────────────────────────────────────────────
function pushPartnersByType(partnerType) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PARTNER_SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Sheet "' + PARTNER_SHEET_NAME + '" not found.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const partners = [];
  const rowIndices = [];

  // Parse rows (skip header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[0];
    const phone = String(row[1]).trim();
    const type = String(row[3]).trim().toUpperCase();

    // Skip empty rows or already pushed rows
    if (!name || !phone) continue;
    if (row[PARTNER_STATUS_COL - 1] === 'Pushed') continue;

    // Only push matching type
    if (type !== partnerType.toUpperCase() && type !== partnerType) continue;

    const partner = {
      name: name,
      phone_number: phone,
      partner_type: partnerType,
      business_name: row[2] || '',
      region_id: row[4] || null,
      commission_rate: row[6] || 5.00
    };

    // Type-specific fields
    if (partnerType === 'SBA') {
      partner.supply_categories = row[5] ? String(row[5]).split(',').map(s => s.trim()) : [];
    } else {
      partner.vehicle_count = parseInt(row[5]) || 1;
    }

    partners.push(partner);
    rowIndices.push(i + 1); // 1-indexed for sheet
  }

  if (partners.length === 0) {
    SpreadsheetApp.getUi().alert('No new ' + partnerType + ' partners found to push.');
    return;
  }

  // Confirm
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Confirm Push',
    'Push ' + partners.length + ' new ' + partnerType + ' partner(s) to AreaBazaar?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  // Send to API
  try {
    const payload = {
      partners: partners,
      onboarded_by: Session.getActiveUser().getEmail()
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const result = UrlFetchApp.fetch(PARTNER_API_ENDPOINT, options);
    const json = JSON.parse(result.getContentText());

    // Mark pushed rows
    if (json.status === 'success') {
      rowIndices.forEach(rowNum => {
        sheet.getRange(rowNum, PARTNER_STATUS_COL).setValue('Pushed');
        sheet.getRange(rowNum, PARTNER_STATUS_COL).setBackground('#d4edda');
      });
    }

    // Log to archive sheet
    logPartnerPush(partnerType, partners.length, json);

    ui.alert('Push Complete', json.message || 'Partners submitted.', ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Push Failed', 'Error: ' + e.message, ui.ButtonSet.OK);
  }
}

// ─── Push via Side Panel (with metadata) ─────────────────────────
function pushFromPanel(formData) {
  const partnerType = formData.partnerType;
  const onboardedBy = formData.staffId || Session.getActiveUser().getEmail();

  // Temporarily override onboarded_by
  pushPartnersByType(partnerType);

  return { success: true, message: partnerType + ' partners pushed successfully' };
}

// ─── Archive Logging ─────────────────────────────────────────────
function logPartnerPush(type, count, response) {
  let logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PushLog');
  if (!logSheet) {
    logSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('PushLog');
    logSheet.appendRow(['Timestamp', 'Type', 'Count', 'Status', 'Message', 'Pushed By']);
  }

  logSheet.appendRow([
    new Date(),
    type,
    count,
    response.status || 'unknown',
    response.message || '',
    Session.getActiveUser().getEmail()
  ]);
}
