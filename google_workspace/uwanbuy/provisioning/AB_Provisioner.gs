/**
 * AB_Provisioner.gs
 * UwanBuy Google Workspace Automated Workbook Provisioner:
 * Creates and formats sheets, establishes column headers, applies Sheet.protect() rules,
 * injects automated formulas, and sets color-coded action cell pills.
 */

const AB_SCHEMAS = {
  ADM: {
    name: 'ADM_Control_Center',
    sheets: [
      {
        name: 'PRODUCT-REGISTER',
        headers: ['[ ]', 'Product ID', 'Product Name', 'Category', 'Sub-Category', 'Sub-Sub-Category', 'Brand', 'Description', 'Has Variants?', 'Modal View Type', 'Status', '[⚡ Quick Edit]'],
        pillCol: 12, pillColor: '#FFF3CD', pillText: '#856404'
      },
      {
        name: 'VARIANT-REGISTER',
        headers: ['[ ]', 'Variant ID', 'Base Product Ref', 'Variant Name', 'Master SKU', 'Quantity Value in Base Unit', 'Quantity Unit', 'Packaging Type', 'Specifications (JSON / Key-Value Pairs)', 'Active Status', '[⚙️ Edit Variant Specs]'],
        pillCol: 11, pillColor: '#CCE5FF', pillText: '#004085'
      },
      {
        name: 'PRODUCT-INGEST-LOADING',
        headers: ['[ ]', 'Product ID', 'Product Name', 'Category', 'Sub-Category', 'Sub-Sub-Category', 'Brand', 'Description', 'Has Variants?', 'Modal View Type', 'Status', '[🚀 Ingest to Master]'],
        pillCol: 12, pillColor: '#D1E7DD', pillText: '#0F5132',
        initialRows: [
          ['', 'PRD-RIC-001', 'Royal Abakaliki Parboiled Rice', 'Food & Agriculture', 'Grains & Cereals', 'Rice', 'Abakaliki Best', 'Naturally stone-free parboiled long grain rice', 'TRUE', 'STANDARD_GRID', 'APPROVED', ''],
          ['', 'PRD-OIL-002', 'Pure Refined Vegetable Cooking Oil', 'Groceries & Staples', 'Cooking Oils', 'Vegetable Oil', 'Golden Harvest', 'Cholesterol-free triple refined vegetable oil', 'TRUE', 'STANDARD_GRID', 'APPROVED', ''],
          ['', '', 'Sweet Golden Garri Yellow (Ijebu Grade)', 'Food & Agriculture', 'Tubers & Cassava', 'Garri', 'Crown Agro', 'Crispy, dry-fried fermented cassava granules', 'TRUE', 'STANDARD_GRID', 'PENDING_REVIEW', '']
        ]
      },
      {
        name: 'VARIANT-INGEST-LOADING',
        headers: ['[ ]', 'Variant ID', 'Base Product Ref', 'Variant Name', 'Master SKU', 'Quantity Value in Base Unit', 'Quantity Unit', 'Packaging Type', 'Specifications (JSON / Key-Value Pairs)', 'Active Status', '[🚀 Ingest to Master]'],
        pillCol: 11, pillColor: '#D1E7DD', pillText: '#0F5132',
        initialRows: [
          ['', 'VAR-RIC-50KG', 'PRD-RIC-001', '50kg Jute Sack Bag', 'SKU-RIC-50KG', 50, 'kg', 'BAG', '{"Weight":"50kg","Grain Length":"Long Grain (6.8mm)","Broken Ratio":"Max 5%","Packaging":"Woven Polypropylene Sack"}', 'ACTIVE', ''],
          ['', 'VAR-RIC-25KG', 'PRD-RIC-001', '25kg Family Bag', 'SKU-RIC-25KG', 25, 'kg', 'BAG', '{"Weight":"25kg","Grain Length":"Long Grain (6.8mm)","Broken Ratio":"Max 5%","Packaging":"Handle Poly Bag"}', 'ACTIVE', ''],
          ['', 'VAR-OIL-25L', 'PRD-OIL-002', '25 Litre Commercial Jerrycan', 'SKU-OIL-25L', 25, 'L', 'JERRYCAN', '{"Volume":"25 Litres","Packaging":"Heavy-duty Jerrycan","Fortification":"Vitamin A Fortified"}', 'ACTIVE', ''],
          ['', '', 'PRD-OIL-002', '5 Litre Gallon Twin Pack', 'SKU-OIL-10L', 10, 'L', 'GALLON', '{"Volume":"10 Litres (2 x 5L)","Packaging":"Twin Pack Carton","Fortification":"Vitamin A Fortified"}', 'ACTIVE', '']
        ]
      },
      {
        name: 'SHOW-PRODUCTS-REGISTER',
        headers: ['[ ]', 'Live Showing Slot', 'Session Ref', 'Wave ID', 'Variant ID', 'Title', 'Auction Format', 'Ref Price (₦)', 'Showing Wave Price (₦)', 'MOQ', 'Timer Remaining (Mins)', 'Show Status', '[🔄 Swap Wave / Slot]'],
        pillCol: 13, pillColor: '#F8D7DA', pillText: '#721C24'
      },
      {
        name: 'STOCK-SCHEDULE',
        headers: ['[ ]', 'Schedule ID', 'Session Ref', 'Warehouse Zone ID', 'Variant ID', 'Title', 'Capacity Quota', 'MOQ', 'Live Orders Committed', 'Remaining Capacity', 'Capacity State', '[📊 Adjust Capacity Quota]'],
        pillCol: 12, pillColor: '#E0E7FF', pillText: '#3730A3'
      },
      {
        name: 'SBA-PRICE-SCHEDULE',
        headers: ['[ ]', 'Price Schedule ID', 'Zone ID', 'Variant ID', 'SBA ID', 'Benchmark Cost (₦)', 'Benchmark Cost (Kobo)', 'Effective Date', 'Approval State', '[⚖️ Review & Authorize]'],
        pillCol: 10, pillColor: '#D1E7DD', pillText: '#0F5132'
      },
      {
        name: 'HANDLING-COST',
        headers: ['Zone ID', 'Base Product Ref', 'Transport (₦)', 'Washing (₦)', 'Splitting (₦)', 'Bagging (₦)', 'Labelling (₦)', 'Loading (₦)', 'Overhead (₦)', 'Total Handling Cost (₦)']
      },
      {
        name: 'SELLING-BASE-PRICE-SCHEDULE',
        headers: ['[ ]', 'Variant ID', 'Zone ID', 'SBA Benchmark', 'Total Handling Cost', 'Transport Benchmark', 'Unit Cost Floor', 'Target Gross Margin %', 'Rounding Step', 'Calculated Selling Price', 'Compare-At Price', 'Authorization Status', '[🚀 Publish Live Price]'],
        pillCol: 13, pillColor: '#F8D7DA', pillText: '#721C24'
      },
      {
        name: 'STAFF-REGISTRY',
        headers: ['[ ]', 'Staff ID', 'Full Name', 'Email Address', 'Phone Number', 'Assigned Role(s)', 'Assigned Facility / Hub', 'Provisioning Tier', 'Generated Workspace / Tab URL', 'Account Status', '[⚡ Provision Tab / Workbook]'],
        pillCol: 11, pillColor: '#EDE9FE', pillText: '#5B21B6'
      },
      {
        name: 'AUCTION-SESSIONS',
        headers: ['[ ]', 'Session ID', 'Title', 'Zone ID', 'Start Time', 'End Time', 'Format', 'Readiness Audit Passed?', 'Session State', '[🎙️ Control Broadcast]'],
        pillCol: 10, pillColor: '#FFE5D0', pillText: '#994B00'
      },
      {
        name: 'BANK-FEED-SYNC',
        headers: ['[ ]', 'Bank Trx Ref', 'Timestamp', 'Credit Amount (₦)', 'Payer Narrative', 'Matched Order Ref', 'Depositor Phone', 'Reconciliation Status', 'Release Order to WHM?', '[🔍 Reconcile & Release]'],
        pillCol: 10, pillColor: '#D1ECF1', pillText: '#0C5460'
      },
      {
        name: 'ARCHIVE-LOADING-VAULT',
        headers: ['Batch ID', 'Source Sheet', 'Archived Timestamp', 'Archived By (Email)', 'Row Count', 'Payload JSON (Encrypted)']
      },
      {
        name: 'CONFIG',
        headers: ['Property Key', 'Property Value', 'Description']
      }
    ]
  },

  WHM: {
    name: 'WHM_Operations_Command',
    sheets: [
      {
        name: 'ORDER-ITEMS-INGEST',
        headers: ['[ ]', 'Order Item ID', 'Master Order ID', 'Session Ref', 'Base Product ID & Variant ID', 'Item Description', 'Quantity Ordered & Multiplier', 'Total Base Units Needed', 'Destination Area Outlet', 'Urgent Priority?', 'Admin Approved?', 'WHM Status', 'Allocated SBA Batch ID', '[⚡ Advance Lifecycle Stage]'],
        pillCol: 14, pillColor: '#CCE5FF', pillText: '#004085'
      },
      {
        name: 'SOURCING-DEMAND',
        headers: ['[ ]', 'Demand Code', 'Zone ID', 'Base Product ID & Name', 'Total Base Units Demanded', 'Bulk Pack Size', 'Bulk Units Needed to Source', 'Customer Orders Count', 'Urgent Orders Count', 'Sourcing Allocation State', '[📦 Assign SBA Batch]'],
        pillCol: 11, pillColor: '#E8DAEF', pillText: '#5B2C6F'
      },
      {
        name: 'SBA-ACQUISITIONS',
        headers: ['[ ]', 'Batch Code', 'SBA ID & Name', 'Product Ref', 'Bulk Quantity Ordered', 'Agreed Benchmark Cost (₦)', 'Target Delivery Dock', 'Procurement State', 'Voucher Released?', '[📋 Track SBA Delivery]'],
        pillCol: 10, pillColor: '#FFF3CD', pillText: '#856404'
      },
      {
        name: 'INTAKE-QA',
        headers: ['[ ]', 'Inspection ID', 'Batch Ref', 'Supplied Bulk Qty', 'Defective Qty', 'Net Accepted Qty', 'Actual Invoiced Cost (₦)', 'Benchmark Budget (₦)', 'Variance %', 'Variance Alert', 'QA Grading Outcome', 'Inspector Notes', '[🔬 Perform Intake QA]'],
        pillCol: 13, pillColor: '#D1F2EB', pillText: '#0E6251'
      },
      {
        name: 'PACK-ALLOCATION',
        headers: ['[ ]', 'Order Item ID', 'Order Ref', 'Customer Name', 'Masked Phone', 'Destination Outlet', 'Description & Qty', 'Packing Verified?', 'Tamper-Evident Label Code', 'Security Alert', 'Label Printed?', '[🏷️ Print Package Label]'],
        pillCol: 12, pillColor: '#F8D7DA', pillText: '#721C24'
      },
      {
        name: 'STAGING-AREA-SORT',
        headers: ['[ ]', 'Sorting Bay ID', 'Destination Regional Outlet', 'Consolidated Parcels Count', 'Order Items Included', 'Ready for Line Haul?', 'Assigned Carrier Manifest Ref', '[🔄 Transfer to Dispatch]'],
        pillCol: 7, pillColor: '#E0E7FF', pillText: '#3730A3'
      },
      {
        name: 'ZBD-DISPATCH-MANIFEST',
        headers: ['[ ]', 'Manifest ID', 'Destination Outlet', 'Category', 'Packages Count', 'Orders Count', 'Assigned ZBDP Carrier', 'Benchmark Haulage Rate (₦)', 'Total Freight Bill (₦)', 'Admin Clearance?', 'Vehicle Loading Confirmed?', 'Waybill Dispatched?', '[🚚 Dispatch Carrier Manifest]'],
        pillCol: 13, pillColor: '#FFF3CD', pillText: '#856404'
      },
      {
        name: 'COMPILED-BILLS',
        headers: ['Voucher ID', 'Partner Type (SBA/ZBDP)', 'Partner ID & Name', 'Total Billable Amount (₦)', 'Variance (₦)', 'Audit Status', 'sADM Approval State']
      },
      {
        name: 'ARCHIVE-LOADING-VAULT',
        headers: ['Batch ID', 'Source Sheet', 'Archived Timestamp', 'Archived By (Email)', 'Row Count', 'Payload JSON (Encrypted)']
      },
      {
        name: 'CONFIG',
        headers: ['Property Key', 'Property Value', 'Description']
      }
    ]
  },

  FRM: {
    name: 'FRM_Field_Operations',
    sheets: [
      {
        name: 'SELLING-CATALOG-VIEW',
        headers: ['Variant ID', 'Product Title', 'Category', 'Approved Selling Price (₦)', 'MOQ', 'Unit Description', 'Active State']
      },
      {
        name: 'AREA-CUSTOMERS',
        headers: ['[ ]', 'Customer ID', 'Full Name', 'Phone Number', 'Assigned Outlet', 'Delivery Street Address', 'Customer Type', 'Lifetime Orders Count', '[👤 Edit Customer Profile]'],
        pillCol: 9, pillColor: '#E0F2FE', pillText: '#0369A1'
      },
      {
        name: 'PROXY-SPOT-ORDERS',
        headers: ['[ ]', 'Proxy Order Line ID', 'Invoice Ref', 'Customer ID & Name', 'Variant ID Ordered', 'Unit Price (₦)', 'Quantity Ordered', 'Line Total Amount (₦)', 'Fulfillment Preference', 'Payment Status', 'Pushed to Backend?', '[🛒 Take New Order]'],
        pillCol: 12, pillColor: '#D1E7DD', pillText: '#0F5132'
      },
      {
        name: 'FIELD-PAYMENTS-REPORT',
        headers: ['[ ]', 'Receipt ID', 'Invoice Ref', 'Customer Name', 'Collection Timestamp', 'Payment Mode', 'Amount Collected (₦)', 'Remittance State', 'Linked Batch Remittance ID', '[💰 Batch for Bank Deposit]'],
        pillCol: 10, pillColor: '#FFF3CD', pillText: '#856404'
      },
      {
        name: 'BATCH-REMITTANCES',
        headers: ['Batch Remittance ID', 'Deposit Date', 'Depository Bank', 'Total Amount Remitted (₦)', 'Bank Teller Ref', 'Deposit Slip Photo Link', 'Admin Audit Status']
      },
      {
        name: 'AREA-INBOUND-RECEIVING',
        headers: ['Waybill Ref', 'Carrier Name', 'Origin Warehouse Zone', 'Total Packages Received', 'Damage / Discrepancy Flag', 'Intake Timestamp', 'Receiving Clerk']
      },
      {
        name: 'CUSTOMER-DELIVERY-HANDOVER',
        headers: ['[ ]', 'Parcel Barcode Ref', 'Customer Full Name', 'Customer Phone', 'Description & Qty', 'Delivery Channel', 'Entered Secret OTP', 'OTP Authentication Result', 'Delivery State', 'Proof of Delivery Link', 'Handover Timestamp', '[🔐 Authenticate Handover OTP]'],
        pillCol: 12, pillColor: '#D4EDDA', pillText: '#155724'
      },
      {
        name: 'ARCHIVE-LOADING-VAULT',
        headers: ['Batch ID', 'Source Sheet', 'Archived Timestamp', 'Archived By (Email)', 'Row Count', 'Payload JSON (Encrypted)']
      },
      {
        name: 'CONFIG',
        headers: ['Property Key', 'Property Value', 'Description']
      }
    ]
  },

  DB_MASTER: {
    name: 'UwanBuy_DB_Master',
    sheets: [
      {
        name: 'DB_PRODUCTS',
        headers: ['Product ID', 'Product Name', 'Category', 'Sub-Category', 'Brand', 'Description', 'Has Variants?', 'Modal Type', 'Status', 'Updated Timestamp']
      },
      {
        name: 'DB_VARIANTS',
        headers: ['Variant ID', 'Base Product ID', 'Variant Name', 'Master SKU', 'Quantity Value', 'Quantity Unit', 'Packaging Type', 'Specifications (JSON)', 'Active Status', 'Updated Timestamp']
      },
      {
        name: 'DB_SBA_PRICES',
        headers: ['Schedule ID', 'Zone ID', 'Variant ID', 'SBA ID', 'Benchmark Cost (₦)', 'Approval State', 'Effective Date', 'Updated Timestamp']
      },
      {
        name: 'DB_ORDERS_FEED',
        headers: ['Order Item ID', 'Master Order ID', 'Session Ref', 'Variant ID', 'Item Description', 'Quantity', 'Destination Hub', 'Urgent?', 'Payment Status', 'WHM Stage', 'Inbound Synced At']
      },
      {
        name: 'DB_DISPATCH_QUEUE',
        headers: ['Staging ID', 'Domain (ADM/WHM/FRM)', 'Entity Type', 'Sync Direction', 'Status (PENDING/SYNCED/FAILED)', 'Payload JSON', 'Staged Timestamp', 'Synced Timestamp', 'Error Message']
      },
      {
        name: 'DB_SYNC_LOG',
        headers: ['Log ID', 'Timestamp', 'Origin Workbook', 'User Email', 'Entity Count', 'Status', 'HTTP Code', 'Receipt ID']
      },
      {
        name: 'CONFIG',
        headers: ['Property Key', 'Property Value', 'Description']
      }
    ]
  }
};

/**
 * Resolves target spreadsheet:
 * 1. Uses explicit spreadsheetId if provided.
 * 2. Uses bound active spreadsheet if available.
 * 3. Reuses saved spreadsheet ID from Script Properties.
 * 4. Searches Drive for existing file with exact defaultTitle to prevent duplicates.
 * 5. Only creates a new spreadsheet if no existing file is found.
 */
function abGetTargetSpreadsheet_(spreadsheetId, defaultTitle) {
  defaultTitle = defaultTitle || 'UwanBuy_Workbook';

  // 1. Explicit ID
  if (spreadsheetId) {
    try {
      return SpreadsheetApp.openById(spreadsheetId);
    } catch (e) {
      Logger.log(`Warning: Spreadsheet with ID "${spreadsheetId}" could not be opened: ${e.message}`);
    }
  }

  // 2. Bound active spreadsheet
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  // 3. Stored ID in Script Properties
  const propKey = 'AB_' + String(defaultTitle).toUpperCase().replace(/[^A-Z0-9_]/g, '_') + '_ID';
  try {
    const savedId = PropertiesService.getScriptProperties().getProperty(propKey);
    if (savedId) {
      try {
        const savedSheet = SpreadsheetApp.openById(savedId);
        Logger.log(`Reusing existing "${defaultTitle}" from Script Properties (ID: ${savedId}): ${savedSheet.getUrl()}`);
        return savedSheet;
      } catch (err) {
        Logger.log(`Stored spreadsheet ID was invalid or deleted, searching Google Drive...`);
      }
    }
  } catch (e) {}

  // 4. Search Google Drive for existing file with exact title
  try {
    const files = DriveApp.getFilesByName(defaultTitle);
    while (files.hasNext()) {
      const file = files.next();
      if (!file.isTrashed()) {
        const foundId = file.getId();
        Logger.log(`Found existing "${defaultTitle}" in Google Drive (ID: ${foundId}). Reusing existing workbook.`);
        try {
          PropertiesService.getScriptProperties().setProperty(propKey, foundId);
        } catch (pe) {}
        return SpreadsheetApp.open(file);
      }
    }
  } catch (err) {
    Logger.log(`DriveApp search notice: ${err.message}`);
  }

  // 5. Create new spreadsheet only when none exists
  Logger.log(`No existing "${defaultTitle}" found in Drive. Creating new spreadsheet...`);
  const created = SpreadsheetApp.create(defaultTitle);
  try {
    PropertiesService.getScriptProperties().setProperty(propKey, created.getId());
  } catch (pe) {}
  Logger.log(`Created new Google Sheet: ${created.getUrl()}`);
  return created;
}

/**
 * Ensures installable onOpen and onEdit triggers are attached to the spreadsheet
 * so that custom menus and interactive checkbox / protection sidebars work even
 * when running from a standalone Apps Script project.
 */
function abEnsureSpreadsheetTriggers_(spreadsheet) {
  try {
    const ssId = spreadsheet.getId();
    const triggers = ScriptApp.getProjectTriggers();
    let hasOpen = false;
    let hasEdit = false;

    triggers.forEach(t => {
      if (t.getTriggerSourceId() === ssId) {
        if (t.getHandlerFunction() === 'onOpen') hasOpen = true;
        if (t.getHandlerFunction() === 'onEdit') hasEdit = true;
      }
    });

    if (!hasOpen) {
      ScriptApp.newTrigger('onOpen').forSpreadsheet(spreadsheet).onOpen().create();
      Logger.log(`✓ Attached installable onOpen trigger to ${spreadsheet.getName()}`);
    }
    if (!hasEdit) {
      ScriptApp.newTrigger('onEdit').forSpreadsheet(spreadsheet).onEdit().create();
      Logger.log(`✓ Attached installable onEdit trigger to ${spreadsheet.getName()}`);
    }
  } catch (err) {
    Logger.log(`Trigger creation notice: ${err.message}`);
  }
}

/**
 * Generic provisioner function for any role schema.
 */
function abProvisionWorkbookFromSchema(spreadsheet, schema) {
  schema = schema || AB_SCHEMAS.ADM;
  spreadsheet = spreadsheet || abGetTargetSpreadsheet_(null, schema.name || 'UwanBuy_Workbook');

  schema.sheets.forEach(sDef => {
    let sheet = spreadsheet.getSheetByName(sDef.name);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sDef.name);
    }
    sheet.clear();

    // 1. Set Column Headers
    const headerRange = sheet.getRange(1, 1, 1, sDef.headers.length);
    headerRange.setValues([sDef.headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0F172A');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontFamily('Inter');
    sheet.setFrozenRows(1);

    // 2. Populate Initial Dummy Data Rows if defined
    if (sDef.initialRows && sDef.initialRows.length > 0) {
      const dataRange = sheet.getRange(2, 1, sDef.initialRows.length, sDef.headers.length);
      dataRange.setValues(sDef.initialRows);
      dataRange.setFontFamily('Inter');
    }

    // 3. Format Column A Checkbox if present
    if (sDef.headers[0] === '[ ]') {
      const rowCount = Math.max(1, sheet.getMaxRows() - 1);
      const checkboxRange = sheet.getRange(2, 1, rowCount, 1);
      const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
      checkboxRange.setDataValidation(rule);
      sheet.setColumnWidth(1, 45);
    }

    // 4. Highlight Action Pill Column if present
    if (sDef.pillCol && sDef.pillColor) {
      const pillRange = sheet.getRange(1, sDef.pillCol, 1, 1);
      pillRange.setBackground(sDef.pillColor);
      pillRange.setFontColor(sDef.pillText || '#000000');
    }

    // 5. Protection Rules:
    // - In -LOADING companion sheets, data rows (columns 2..N) are open for data entry/pasting.
    //   Only header row (row 1) and Column A checkbox are protected.
    // - In master registers, the entire sheet is protected with setWarningOnly(true) so the Owner is
    //   warned upon editing, and other non-owner editors are completely blocked.
    if (sDef.name.indexOf('-LOADING') !== -1) {
      const headerProtect = sheet.getRange(1, 1, 1, sDef.headers.length).protect().setDescription('UwanBuy Header Lock - ' + sDef.name);
      headerProtect.setWarningOnly(true);
    } else {
      const protection = sheet.protect().setDescription('UwanBuy System Lock - ' + sDef.name);
      protection.setWarningOnly(true); // Prompts the owner if they attempt to type directly
      try {
        const me = Session.getEffectiveUser();
        protection.removeEditors(protection.getEditors().filter(e => e.getEmail() !== me.getEmail()));
        if (protection.canDomainEdit()) {
          protection.setDomainEdit(false);
        }
      } catch (pe) {}
    }
  });

  // Remove default 'Sheet1' if present
  const defaultSheet = spreadsheet.getSheetByName('Sheet1');
  if (defaultSheet && spreadsheet.getSheets().length > 1) {
    spreadsheet.deleteSheet(defaultSheet);
  }

  // Ensure triggers are installed so menus and interactive sidebars function properly
  abEnsureSpreadsheetTriggers_(spreadsheet);

  Logger.log(`✓ Successfully provisioned [${schema.name}] at URL:\n${spreadsheet.getUrl()}`);
  return spreadsheet.getUrl();
}

function abProvisionAdmWorkbook(spreadsheetId) {
  const ss = abGetTargetSpreadsheet_(spreadsheetId, 'ADM_Control_Center');
  return abProvisionWorkbookFromSchema(ss, AB_SCHEMAS.ADM);
}

function abProvisionWhmWorkbook(spreadsheetId) {
  const ss = abGetTargetSpreadsheet_(spreadsheetId, 'WHM_Operations_Command');
  return abProvisionWorkbookFromSchema(ss, AB_SCHEMAS.WHM);
}

function abProvisionFrmWorkbook(spreadsheetId) {
  const ss = abGetTargetSpreadsheet_(spreadsheetId, 'FRM_Field_Operations');
  return abProvisionWorkbookFromSchema(ss, AB_SCHEMAS.FRM);
}

function abProvisionDbMasterWorkbook(spreadsheetId) {
  const ss = abGetTargetSpreadsheet_(spreadsheetId, 'UwanBuy_DB_Master');
  return abProvisionWorkbookFromSchema(ss, AB_SCHEMAS.DB_MASTER);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AB_SCHEMAS, abProvisionWorkbookFromSchema };
}
