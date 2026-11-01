# Prompt 05: AppSheet Mobile Deployment, Webhooks & Backend Integration Sync

## Objective
Configure AppSheet mobile applications, barcode scanner interfaces, automated webhooks, and the central DB-Sheet (`UwanBuy_DB_Master`) intermediate synchronization engine connecting Google Workspace operational workbooks (ADM, WHM, FRM) with the central AreaBazaar & UwanBuy backend database.

---

## 1. Context & Operational Ground Rules
Refer to [GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md](file:///c:/xampp/htdocs/areabazaar/GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md):
- **Central DB-Sheet (`UwanBuy_DB_Master`) as Single Source of Truth:**
  Rather than having multiple personal workbooks call external backend REST endpoints directly, all operational workbooks synchronize through `UwanBuy_DB_Master`. AppSheet connects to `UwanBuy_DB_Master` tables as its primary mobile database backend.
- **Two-Way Data Flow Architecture:**
  - **Workspace-Originated Data (Outbound Pipeline):**
    Products, Variants + Specs (Col I JSON), SBA Prices, Sourcing Schedules, ZBDP Partners, and Outlets originate in Google Workspace workbooks, sync to `UwanBuy_DB_Master` (`DB_PRODUCTS`, `DB_VARIANTS`, `DB_SBA_PRICES`), and then dispatch to the backend database via REST API.
  - **Database-Originated Data (Inbound Pipeline):**
    Live customer orders, bank credit feeds, and payment reconciliation statuses flow from the backend database into `UwanBuy_DB_Master` (`DB_ORDERS_FEED`), and then distribute down to personal staff workbooks (`ORDER-ITEMS-INGEST`, `BANK-FEED-SYNC`).
- **Configurable Sync Policy:**
  - `INSTANT`: Dispatches changes immediately from `UwanBuy_DB_Master!DB_DISPATCH_QUEUE` to the backend endpoints defined in `AB.ENDPOINTS`.
  - `DEFERRED`: Changes are stamped with `Sync: Pending` and buffered in `DB_DISPATCH_QUEUE` awaiting batch cron synchronization.
- **Strict Personal Workbook Isolation:** Every staff member owns their *own personal workbook* inside their dedicated Google Drive folder (zero shared sheet files). AppSheet mobile users interact with their assigned rows via UserEmail() filtering.

---

## 2. Step-by-Step Implementation Instructions

### Step 2.1: AppSheet Data Sources & Table Mapping
1. Link AppSheet to the Central DB-Sheet (`UwanBuy_DB_Master`):
   - **Warehouse Operations App:** Connect to `UwanBuy_DB_Master` tables (`DB_ORDERS_FEED`, `DB_DISPATCH_QUEUE`, `DB_VARIANTS`) and facility personal workbooks.
   - **Field Sales & Outlet App:** Connect to `UwanBuy_DB_Master` tables (`DB_PRODUCTS`, `DB_VARIANTS`, `DB_ORDERS_FEED`, `DB_DISPATCH_QUEUE`).
2. Configure AppSheet Column Types:
   - `Order Item ID`, `Parcel Barcode Ref`: Set type to `Text` with `Searchable` enabled.
   - `QR Barcode / Label Code`: Set type to `Scannable Barcode` (enables camera barcode scanning on mobile devices).
   - `Specifications`: Set type to `LongText` or structured view (renders parsed JSON key-value pairs).
   - `Proof of Delivery`: Set type to `Image` or `Signature`.
   - `WHM Status`, `Delivery Lifecycle State`: Set type to `Enum` with values matching the schema.

### Step 2.2: Configure AppSheet Views & User Experiences
1. **Warehouse Inbound Receiving View:**
   - Form View linked to dock receiving. Allows dock worker to scan SBA batch QR code, enter weight, count sample defects, take a photo of damaged items, and submit.
2. **Pack Bay Scan View:**
   - Table View grouped by `Destination Area Outlet` and sorted by `Urgent Priority = TRUE`.
   - Card Action: `[Mark Packed]` advances status to `packed` and displays the thermal label preview.
3. **Outlet Delivery Handover View:**
   - Search/Scan View linked to parcel handover.
   - Action: `[Verify OTP & Handover]` opens a secure prompt for the 6-digit OTP, compares against backend verification endpoint, and requires customer signature upon success.

### Step 2.3: Central DB-Sheet REST Dispatcher
1. In Google Apps Script (`AB_API.gs`), configure the central webhook dispatcher reading from `UwanBuy_DB_Master`:
   ```javascript
   function abApi(endpointKey, payload) {
     const endpoint = AB.ENDPOINTS[endpointKey];
     if (!endpoint) throw new Error('Unknown endpoint: ' + endpointKey);
     
     const url = abGetProp_(AB.PROPS.API_BASE, 'https://api.areabazaar.com/v1') + endpoint.path;
     const apiKey = abGetProp_(AB.PROPS.API_KEY, '');
     
     const options = {
       method: endpoint.method,
       contentType: 'application/json',
       headers: {
         'X-AB-KEY': apiKey,
         'X-AB-STORE': AB.STORE,
         'X-AB-WORKSPACE-USER': Session.getActiveUser().getEmail()
       },
       muteHttpExceptions: true
     };
     
     if (payload && (endpoint.method === 'post' || endpoint.method === 'put')) {
       options.payload = JSON.stringify(payload);
     }
     
     if (abIsMock()) {
       return AB_Mock.handle(endpointKey, payload);
     }
     
     const response = UrlFetchApp.fetch(url, options);
     const code = response.getResponseCode();
     if (code < 200 || code >= 300) {
       throw new Error('API Error (' + code + '): ' + response.getContentText());
     }
     return JSON.parse(response.getContentText());
   }
   ```
2. In AppSheet Automation / Bots:
   - Trigger: `Data Change` on `CUSTOMER-DELIVERY-HANDOVER` when `Delivery State` becomes `Handed Over & Completed`.
   - Action: `Call a Webhook` to endpoint `/frm/delivery/completed` with payload containing Parcel ID, Timestamp, and Proof of Delivery URL.

### Step 2.4: Sync Queue Batch Processing from `UwanBuy_DB_Master`
In `AB_Core.gs` and `AB_UI_Engine.gs`, create a time-driven trigger executing every 15 minutes in `UwanBuy_DB_Master`:
```javascript
function abScheduledDbMasterBatchSync() {
  const syncMode = abGetSyncMode();
  if (syncMode !== AB.SYNC_MODES.DEFERRED) return;
  
  const ss = SpreadsheetApp.openById(abGetDbMasterId());
  const queueSheet = ss.getSheetByName(AB.SHEETS.DB_DISPATCH_QUEUE);
  if (!queueSheet) return;
  
  const rows = queueSheet.getDataRange().getValues();
  if (rows.length <= 1) return; // Header only
  
  const pendingRows = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][3] === 'PENDING') {
      pendingRows.push({ 
        rowIndex: i + 1, 
        endpoint: rows[i][1], 
        payload: JSON.parse(rows[i][2]) 
      });
    }
  }
  
  pendingRows.forEach(item => {
    try {
      abApi(item.endpoint, item.payload);
      queueSheet.getRange(item.rowIndex, 4).setValue('SYNCED');
      queueSheet.getRange(item.rowIndex, 5).setValue(new Date().toISOString());
    } catch (err) {
      queueSheet.getRange(item.rowIndex, 4).setValue('FAILED: ' + err.message);
    }
  });
}
```

---

## 3. End-to-End Verification Test Suite
Execute the automated test runner in Node.js:
```bash
node scratch/verify_gws_uwanbuy.js
```

The verification suite must validate:
1. **Catalog & Show Products:** Catalog prices calculate properly above cost floors, active auction wave variants correctly project into `SHOW-PRODUCTS-REGISTER`, and variant specifications parse and format valid JSON objects.
2. **Order-Driven Resolution:** 100 customer order items resolve into discrete bulk SBA procurement demand lines without holding ground inventory.
3. **Sequential WHM Transitions:** Illegal stage skips and reversals are blocked by `abCanTransition()`.
4. **Secret OTP Handover:** Delivery handover strictly requires matching the 6-digit OTP.
5. **Loading Sheets Integrity:** Existing IDs are preserved across loading sheet cycles, and batch archiving/restoration succeeds without data loss.
6. **Strict Personal Workbook Isolation:** Staff members receive their own isolated workbooks; Tier 1 adds a tab inside *their personal workbook*; Tier 2 creates a new standalone workbook.
7. **DB-Sheet Staging Relay:** Staging records format cleanly for `UwanBuy_DB_Master` and dispatch queues properly manage two-way data pipelines.
