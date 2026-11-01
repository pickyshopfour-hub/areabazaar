# Prompt 02: ADM Control Center Workbook Provisioning & Setup

## Objective
Provision and configure the **ADM Control Center Workbook (`ADM_Control_Center`)**, implementing all 9 master administrative registers, their companion loading sheets, the archive vault, dynamic HTML sidebars (including the Variant Specifications builder), the central DB-Sheet relay synchronization, and the custom `UwanBuy Admin` menu.

---

## 1. Context & Operational Ground Rules
Refer to [GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md](file:///c:/xampp/htdocs/areabazaar/GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md) (Domain A):
- **All Cells Locked:** Direct in-sheet cell edits are forbidden.
- **Column A Checkbox:** Checking row `[ ]` opens an interactive HTML sidebar.
- **Product Variant Specifications (Col I):** In `VARIANT-REGISTER` and `VARIANT-INGEST-LOADING`, Col I holds product specifications as a structured JSON string / key-value pair object (e.g. `{"RAM":"8GB","Storage":"256GB","Color":"Midnight Black"}`). This is managed via `Sidebar_VariantSpecs.html`.
- **Loading Sheets ID Preservation & Archiving:** All companion loading sheets contain a mandatory ID column. Existing IDs are used directly; missing IDs are generated. Batches can be archived and restored via the `UwanBuy Admin` menu.
- **Show Products Engine:** `SHOW-PRODUCTS-REGISTER` dynamically projects active wave items from `WAVE-SCHEDULE` (`wave_status = 'LIVE_SHOWING'`).
- **Two-Tier Personal Staff Provisioning in `STAFF-REGISTRY`:** 
  - Every staff member owns their *own personal workbook* inside their dedicated Google Drive folder (zero shared sheet files).
  - **Tier 1:** Creates a dedicated Sheet Tab inside *that staff member's personal workbook* for lightweight / focused duties.
  - **Tier 2:** Clones a full standalone Google Sheet Workbook for multi-dependency operational leads.
- **Central DB-Sheet Relay (`UwanBuy_DB_Master`):** ADM catalog and pricing approvals (Products, Variants + Specs, SBA Prices, Sourcing Schedules, ZBDP Partners, Outlets) buffer into `UwanBuy_DB_Master` (`DB_PRODUCTS`, `DB_VARIANTS`, `DB_SBA_PRICES`) before syncing to the backend database. Inbound bank feeds and payment reconciliations sync into `BANK-FEED-SYNC` and `PAYMENT-RECON` via `UwanBuy_DB_Master`.

---

## 2. Step-by-Step Implementation Instructions

### Step 2.1: Create & Name the Master Sheets
In the `ADM_Control_Center` spreadsheet, create the following tabs:
1. `PRODUCT-REGISTER`
2. `VARIANT-REGISTER`
3. `SHOW-PRODUCTS-REGISTER`
4. `STOCK-SCHEDULE`
5. `SBA-PRICE-SCHEDULE`
6. `HANDLING-COST`
7. `SELLING-BASE-PRICE-SCHEDULE`
8. `STAFF-REGISTRY`
9. `AUCTION-SESSIONS`
10. `WAVE-SCHEDULE`
11. `BANK-FEED-SYNC`
12. `PAYMENT-RECON`
13. `ARCHIVE-LOADING-VAULT`
14. `CONFIG`

### Step 2.2: Apply Column Headers & Protection Rules
For each sheet, establish the exact headers from Section 3 of the specification:
- **`PRODUCT-REGISTER`:**
  - Col A: `[ ]` (Checkbox Data Validation)
  - Col B to K: `Product ID`, `Product Name`, `Category`, `Sub-Category`, `Sub-Sub-Category`, `Brand`, `Description`, `Has Variants?`, `Modal View Type`, `Status` (All System Locked).
  - Col L: `[⚡ Quick Edit]` (Action Cell - Highlighted Amber `#FFF3CD`, Text `#856404`).
- **`VARIANT-REGISTER`:**
  - Col A: `[ ]` Checkbox.
  - Col B to H: `Variant ID`, `Base Product Ref`, `Variant Name`, `Master SKU`, `Quantity Value in Base Unit`, `Quantity Unit`, `Packaging Type` (Locked).
  - Col I: `Specifications (JSON / Key-Value Pairs)` (Locked - stores e.g. `{"RAM":"8GB","Storage":"256GB","Color":"Midnight Black"}`).
  - Col J: `Active Status` (Locked).
  - Col K: `[⚙️ Edit Variant Specs]` (Action Cell - Highlighted Blue `#CCE5FF`, Text `#004085`).
- **`SHOW-PRODUCTS-REGISTER`:**
  - Col A: `[ ]` Checkbox.
  - Col B to L: `Live Showing Slot`, `Session Ref`, `Wave ID`, `Variant ID`, `Title`, `Auction Format`, `Ref Price (₦)`, `Showing Wave Price (₦)`, `MOQ`, `Timer Remaining (Mins)`, `Show Status` (Locked).
  - Col M: `[🔄 Swap Wave / Slot]` (Action Cell - Highlighted Brand Red `#F8D7DA`, Text `#721C24`).
- **`STOCK-SCHEDULE`:**
  - Col A: `[ ]` Checkbox.
  - Col B to K: `Schedule ID`, `Session Ref`, `Warehouse Zone ID`, `Variant ID`, `Title`, `Capacity Quota`, `MOQ`, `Live Orders Committed`, `Remaining Capacity`, `Capacity State` (Locked).
  - Col L: `[📊 Adjust Capacity Quota]` (Action Cell - Highlighted Indigo `#E0E7FF`, Text `#3730A3`).
- **`SBA-PRICE-SCHEDULE`:**
  - Col A: `[ ]` Checkbox.
  - Col B to I: `Price Schedule ID`, `Zone ID`, `Variant ID`, `SBA ID`, `Benchmark Cost (₦)`, `Benchmark Cost (Kobo)`, `Effective Date`, `Approval State` (Locked).
  - Col J: `[⚖️ Review & Authorize]` (Action Cell - Highlighted Emerald `#D1E7DD`, Text `#0F5132`).
- **`SELLING-BASE-PRICE-SCHEDULE`:**
  - Col A: `[ ]` Checkbox.
  - Col B to L: `Variant ID`, `Zone ID`, `SBA Benchmark`, `Total Handling Cost`, `Transport Benchmark`, `Unit Cost Floor`, `Target Gross Margin %`, `Rounding Step`, `Calculated Selling Price`, `Compare-At Price`, `Authorization Status` (Locked).
  - Col M: `[🚀 Publish Live Price]` (Action Cell - Highlighted Brand Red).
- **`STAFF-REGISTRY`:**
  - Col A: `[ ]` Checkbox.
  - Col B to J: `Staff ID`, `Full Name`, `Email Address`, `Phone Number`, `Assigned Role(s)`, `Assigned Facility / Hub`, `Provisioning Tier`, `Generated Workspace / Tab URL`, `Account Status` (Locked).
  - Col K: `[⚡ Provision Tab / Workbook]` (Action Cell - Highlighted Violet `#EDE9FE`, Text `#5B21B6`).
- **`AUCTION-SESSIONS`:**
  - Col A: `[ ]` Checkbox.
  - Col B to H: `Session ID`, `Title`, `Zone ID`, `Start Time`, `End Time`, `Format`, `Readiness Audit Passed?`, `Session State` (Locked).
  - Col I: `[🎙️ Control Broadcast]` (Action Cell - Highlighted Orange `#FFE5D0`, Text `#994B00`).
- **`BANK-FEED-SYNC`:**
  - Col A: `[ ]` Checkbox.
  - Col B to I: `Bank Trx Ref`, `Timestamp`, `Credit Amount (₦)`, `Payer Narrative`, `Matched Order Ref`, `Depositor Phone`, `Reconciliation Status`, `Release Order to WHM?` (Locked).
  - Col J: `[🔍 Reconcile & Release]` (Action Cell - Highlighted Cyan `#D1ECF1`, Text `#0C5460`).

### Step 2.3: Companion Loading Sheets Setup
Create dedicated companion loading sheets:
1. `PRODUCT-INGEST-LOADING` (Includes Col B: `Product ID` - existing ID preserved, missing ID assigned).
2. `VARIANT-INGEST-LOADING` (Includes Col B: `Variant ID`, Col C: `Base Product ID`, Col I: `Specifications (JSON / Key-Value Pairs)`).
3. `WAVE-SWAP-LOADING` (Includes Col B: `Slot Ref`, Col D: `Variant ID`).
4. `STOCK-CAPACITY-LOADING` (Includes Col B: `Schedule ID`, Col E: `Variant ID`).
5. `PRICE-UPDATE-LOADING` (Includes Col B: `Price Schedule ID`, Col D: `Variant ID`).
6. `SELLING-PRICE-OVERRIDE-LOADING` (Includes Col B: `Variant ID`).
7. `STAFF-ONBOARDING-LOADING` (Includes Col B: `Staff ID`, Col H: `Target Provisioning Tier`).
8. `AUCTION-PREP-LOADING` (Includes Col B: `Session ID / Wave ID`).
9. `BANK-STATEMENT-CSV-LOADING` (Includes Col B: `Bank Trx Ref`).

Add header action buttons:
- `[🚀 Validate & Populate Register]`
- `[📦 Archive Current Staging Batch]`

### Step 2.4: Build HTML Sidebars in `google_workspace/uwanbuy/ui/`
Create the following responsive HTML files with Google Fonts (Inter) and modern CSS styling:
1. `Sidebar_ProductEdit.html`: Edit Name, Category dropdowns, Description, Brand, Image URL, Modal Type.
2. `Sidebar_VariantSpecs.html`: **Dynamic Key-Value Pair Builder:**
   - Pre-fills with existing specifications parsed from Col I via `abParseVariantSpecs()`.
   - Allows adding, modifying, or deleting arbitrary key-value pairs (e.g. `RAM: 8GB`, `Storage: 256GB`, `Color: Black`).
   - Category Presets:
     - *Phones & Tablets:* Display Size, RAM, Storage, Battery, Front Camera, Rear Camera, OS, Network.
     - *Groceries & Staples:* Net Weight, Packaging Material, Shelf Life, Origin State, Storage Instructions.
     - *Fashion & Apparel:* Size, Color, Fabric Material, Care Guide, Gender.
   - Live JSON preview that writes back to Col I via `abFormatVariantSpecs()`.
3. `Sidebar_WaveSwap.html`: Select active wave, swap individual slot, adjust wave timer.
4. `Sidebar_StockQuota.html`: Adjust session capacity slider, cap sellable units.
5. `Sidebar_PriceCalculator.html`: Display SBA benchmark, 7 handling components, transport, and margin slider.
6. `Sidebar_PricePublish.html`: Verify cost floor, override margin, publish to `UwanBuy_DB_Master` and storefront.
7. `Sidebar_StaffProvisioning.html`: Select role, facility, and workload scope: `Sheet Tab in Personal Workbook (Tier 1)` vs `Full Dedicated Workbook (Tier 2)`.
8. `Sidebar_AuctionBroadcast.html`: Start broadcast, pause wave, trigger surprise drops.
9. `Sidebar_PaymentMatch.html`: Match bank alert to invoice reference, release order to WHM.

### Step 2.5: Build `UwanBuy Admin` Top Menu
In `AB_UI_Engine.gs`, construct the custom menu:
```javascript
SpreadsheetApp.getUi().createMenu('UwanBuy Admin')
  .addItem('New Base Product (Sidebar Form)', 'openNewProductSidebar')
  .addItem('Open Product Ingest Loading Sheet', 'openProductIngestLoading')
  .addItem('Open Variant Ingest Loading Sheet', 'openVariantIngestLoading')
  .addItem('Archive Current Product Ingest Batch', 'archiveCurrentProductIngest')
  .addItem('Restore Archived Ingest Batch...', 'promptRestoreIngestBatch')
  .addSeparator()
  .addItem('Open Price Update Loading Sheet', 'openPriceUpdateLoading')
  .addItem('Archive Price Update Batch', 'archivePriceBatch')
  .addItem('Restore Archived Price Batch...', 'promptRestorePriceBatch')
  .addSeparator()
  .addItem('Provision Staff (Tab or Workbook)', 'openStaffProvisioningSidebar')
  .addItem('Audit Staff Personal Workspaces', 'auditStaffWorkspaces')
  .addSeparator()
  .addItem('Sync Live Wave with Storefront', 'syncLiveWaveShowProducts')
  .addItem('Sync Approved Catalog to DB-Sheet (UwanBuy_DB_Master)', 'syncApprovedCatalogToDbMaster')
  .addItem('Publish Authorized Prices to Storefront API', 'publishPricesToApi')
  .addToUi();
```

---

## 3. Verification & Acceptance Criteria
1. When opening the workbook, all master registers must have protected ranges preventing direct typing.
2. Clicking any row's checkbox in Column A must open the corresponding HTML sidebar pre-filled with that row's data.
3. Editing variant specifications in `Sidebar_VariantSpecs.html` correctly formats and saves valid JSON into Col I of `VARIANT-REGISTER`.
4. Submitting the sidebar updates the locked row through script elevation.
5. Loading sheets accurately ingest data, preserving existing IDs or assigning new ones.
6. Ingest batches can be archived to `ARCHIVE-LOADING-VAULT` and restored via menu options.
7. Triggering staff provisioning correctly routes between creating a Sheet Tab in *that staff member's personal workbook* (Tier 1) and cloning a full dedicated Workbook (Tier 2).
8. Syncing approved catalog data successfully updates `UwanBuy_DB_Master` (`DB_PRODUCTS`, `DB_VARIANTS`).
