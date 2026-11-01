# Prompt 01: Core Apps Script Framework, Security & Library Setup

## Objective
Build and configure the central Google Apps Script library and core execution engine for AreaBazaar and UwanBuy in `google_workspace/uwanbuy/lib/` and deployable as a shared Apps Script project.

---

## 1. Context & Operational Ground Rules
Refer to [GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md](file:///c:/xampp/htdocs/areabazaar/GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md):
- **Zero Direct In-Cell Editing:** All cells are locked (`Sheet.protect()`). Direct keyboard input is prevented.
- **Column A Checkbox Trigger:** Clicking a checkbox in Column A triggers `onEdit(e)`, which opens an interactive HTML Sidebar pre-filled with that row's data.
- **Elevated Apps Script Execution:** All cell writes and status advances must occur via Apps Script executing with script-owner privileges to preserve formula and data integrity.
- **Strict Personal Workbook Ownership (Zero Shared Workbooks):** Every staff member owns their *own personal workbook* inside their dedicated Google Drive folder (no multi-user shared sheet files). 
  - **Tier 1 (Lightweight / Focused Duty):** The system generates a dedicated, locked Sheet Tab inside *that staff member's personal workbook* (e.g. `staffPersonalSpreadsheetId`).
  - **Tier 2 (Multi-Dependency Duty):** The system generates a brand new standalone Google Sheet Workbook cloned from the full role template.
- **Intermediate Central DB-Sheet (`UwanBuy_DB_Master`):** Personal workbooks do not call external backend REST endpoints directly. Instead, all Google Workspace workbooks sync with `UwanBuy_DB_Master`, which acts as an intermediate staging buffer:
  - **Workspace-Originated Data (Outbound):** Products, Variants + Specs, SBA Prices, Sourcing Schedules, ZBDP Partners, and Outlets originate in Google Workspace personal workbooks, buffer into `UwanBuy_DB_Master`, and then dispatch to the backend database.
  - **Database-Originated Data (Inbound):** Live customer orders, bank credit feeds, and payment reconciliation statuses flow from the backend database into `UwanBuy_DB_Master`, and then distribute down to personal staff workbooks.
- **Product Variant Specifications (JSON / Key-Value Pairs):** Variant specifications (RAM, Storage, Color, Display, Weight, Packaging, Shelf Life, etc.) are stored in a dedicated cell (`Col I`) in `VARIANT-REGISTER` and `VARIANT-INGEST-LOADING` as structured JSON strings and manipulated via dynamic key-value pair UI builders.
- **Loading Sheet ID Preservation & Archiving:** Loading sheets must always contain the entity ID. If an ID is present, use it directly; if missing, assign a new ID. Provide archiving and menu restoration routines.
- **Instant vs Deferred Sync Queue:** Dispatch REST calls immediately if `SYNC_MODE: INSTANT`, or buffer changes in `SYNC-QUEUE` if `DEFERRED`.

---

## 2. Detailed Technical Requirements

### Step 2.1: `AB_Config.gs` Updates
Ensure `AB_Config.gs` defines:
1. `AB.SYNC_MODES`: `{ INSTANT: 'INSTANT', DEFERRED: 'DEFERRED' }`.
2. `AB.PROPS`: Add `DB_MASTER_ID: 'AB_DB_MASTER_SHEET_ID'`.
3. `AB.DB_SHEETS`: Schema definition for `UwanBuy_DB_Master`:
   - `DB_PRODUCTS`: Staging catalog products.
   - `DB_VARIANTS`: Staging catalog variants including JSON specifications.
   - `DB_SBA_PRICES`: Staging approved SBA price schedules.
   - `DB_ORDERS_FEED`: Inbound customer orders received from central database.
   - `DB_DISPATCH_QUEUE`: Outbound queue buffering workspace updates before backend dispatch.
   - `DB_SYNC_LOG`: Audit log tracking timestamps, user emails, and sync receipts.
4. `AB.LOADING_SHEETS`: Mapping of master sheets to companion staging sheets (`PRODUCT-INGEST-LOADING`, `VARIANT-INGEST-LOADING`, `PRICE-UPDATE-LOADING`, etc.).
5. `AB.ROLE_TEMPLATES`: Template spreadsheet IDs for ADM, WHM, and FRM workbooks.
6. Configuration getters: `abGetProp_(key, fallback)`, `abGetSyncMode()`, `abGetDbMasterId()`, `abGetApiBase()`.

### Step 2.2: `AB_Core.gs` Core Business Functions
Implement and export the following pure functions:

1. **Variant Specifications Parser & Serializer:**
   ```javascript
   function abParseVariantSpecs(specsCell)
   function abFormatVariantSpecs(specsObj)
   ```
   - `abParseVariantSpecs`: Safely parses a JSON string or semicolon-delimited key-value string (`"RAM: 8GB; Storage: 256GB"`) into a normalized JavaScript object `{ RAM: '8GB', Storage: '256GB' }`. Returns `{}` on empty/invalid inputs without throwing.
   - `abFormatVariantSpecs`: Formats a key-value object into a clean, compact JSON string suitable for storage in `Col I` and rendering by storefront templates (`uwanbuy-engine.js`).

2. **Show Products Dynamic Evaluator:**
   ```javascript
   function abEvaluateShowProducts(activeWave, allVariants)
   ```
   - Matches variants assigned to the wave (`wave_status = 'LIVE_SHOWING'`).
   - Computes showing price, MOQ, countdown minutes, and slot assignments.

3. **Loading Sheet Validator & ID Preservation:**
   ```javascript
   function abValidateLoadingSheet(sheetType, rows, existingMasterIds, idGeneratorFn)
   ```
   - For every row in `rows`:
     - Checks if `row.id` is provided. If present, verifies it against `existingMasterIds` and flags as `UPDATE`.
     - If `row.id` is blank, calls `idGeneratorFn()` to assign a unique ID and flags as `NEW`.
     - Validates required fields, price floor limits, specifications JSON validity, and category constraints.

4. **Batch Archiving & Restoration Engine:**
   ```javascript
   function abArchiveBatch(sheetType, rows, userEmail)
   function abRestoreBatch(archiveVaultRows, targetBatchId)
   ```
   - Generates unique `batchId` (e.g. `BATCH-PRICE-20261023-001`).
   - Packages rows with metadata (`archivedAt`, `archivedBy`, `rowCount`).
   - Provides restoration re-hydration back into loading sheet format.

5. **Two-Tier Dynamic Staff Provisioning:**
   ```javascript
   function abProvisionStaffTab(staffPersonalSpreadsheetId, staffRecord, templateTabName)
   function abGenerateStaffWorkbook(staffRecord, templateSpreadsheetId, destinationFolderId)
   ```
   - `abProvisionStaffTab`: Targets **that employee's personal workbook** (strictly isolated, zero shared files). Clones the template tab into their personal spreadsheet, names it `TAB-{ROLE}-{StaffID}`, applies protection restricting edit triggers to that staff member's email, and returns the tab URL (`#gid=...`).
   - `abGenerateStaffWorkbook`: Clones the full role workbook template into the staff Google Drive folder, renames it `{ROLE}_Ops_{StaffName}_{StaffID}`, injects personal config properties into its `CONFIG` tab, and returns the document URL.

6. **Central DB-Sheet Relay & Staging Engine:**
   ```javascript
   function abStageDbRecord(domain, entityType, rowData, syncDirection)
   function abSyncToDbSheet(sourceSheetName, rows, dbSheetSpreadsheetId, targetDbTabName)
   function abDispatchDbSheetToBackend(dbSheetSpreadsheetId, queueTabName, endpointKey)
   ```
   - `abStageDbRecord`: Prepares a normalized staging row with tracking headers (`Staging ID`, `Origin Workbook`, `Sync Direction: OUTBOUND/INBOUND`, `Status: PENDING`, `Payload JSON`, `Timestamp`).
   - `abSyncToDbSheet`: Transmits local personal workbook rows to the central `UwanBuy_DB_Master` spreadsheet.
   - `abDispatchDbSheetToBackend`: Reads pending records from `UwanBuy_DB_Master!DB_DISPATCH_QUEUE` and calls `UrlFetchApp` (or mock handler) to update the backend database.

7. **Sync Queue & REST Dispatcher:**
   ```javascript
   function abProcessSyncQueue(syncMode, rows, endpointKey)
   ```
   - In `INSTANT` mode: dispatches immediate HTTP POST/PUT via `UrlFetchApp`.
   - In `DEFERRED` mode: appends rows to `SYNC-QUEUE` tab with `Sync: Pending` timestamp.

### Step 2.3: `AB_UI_Engine.gs` (Apps Script Presentation Layer)
Implement the UI listeners and dialog handlers:
1. **`onOpen()` Trigger:**
   - Detects workbook role (`ADM`, `WHM`, `FRM`) from script properties or `CONFIG` tab.
   - Builds custom top-level menu with sub-menus for loading sheets, batch archiving, batch restoration, specifications editor, and DB-Sheet synchronization.
2. **`onEdit(e)` Protection & Checkbox Listener:**
   - Validates if edited cell is in **Column A** (Column 1) and value is `TRUE`.
   - Checks user role against `AB_PERMISSIONS`.
   - Reads the corresponding row data.
   - Opens the appropriate HTML Sidebar or Modal Dialog (`HtmlService.createTemplateFromFile(...)`).
   - Resets the checkbox back to `FALSE` upon opening or dialog completion.
   - If a user attempts to edit any column other than designated input ranges, reverts the edit immediately and shows an alert.
3. **Action Cell Click Router:**
   - Detects clicks or checkbox selections on action cells (`[⚡ Quick Edit]`, `[⚙️ Edit Variant Specs]`, `[📦 Assign SBA]`, `[🏷️ Print Label]`, `[🔐 Authenticate OTP]`) and routes to the matching dialog.

---

## 3. Verification & Acceptance Criteria
1. Node.js unit tests (`scratch/verify_gws_uwanbuy.js`) must verify:
   - `abParseVariantSpecs()` and `abFormatVariantSpecs()` parse and serialize complex JSON specifications with 100% accuracy.
   - `abEvaluateShowProducts()` correctly mirrors active wave variants.
   - `abValidateLoadingSheet()` preserves existing row IDs and assigns new ones when missing.
   - `abArchiveBatch()` and `abRestoreBatch()` preserve data integrity across archive cycles.
   - `abCanTransition()` strictly enforces sequential forward-only WHM order lifecycle transitions.
   - `abStageDbRecord()` correctly formats staging records for `UwanBuy_DB_Master`.
2. Apps Script code must pass syntax validation with zero runtime reference errors.
