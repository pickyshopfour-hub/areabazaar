# Prompt 03: WHM Operations Command & Facility Hub Setup

## Objective
Provision and configure the **Warehouse Hub Management (WHM)** workspace architecture, implementing strictly personal staff workbooks (Tier-1 staff tabs inside personal workbooks and Tier-2 Multi-Dependency Lead Ops Workbooks), all operational registers, order-driven resolution logic, companion loading sheets, thermal label generators, HTML sidebars, central DB-Sheet relay staging, and the custom `UwanBuy WHM` menu.

---

## 1. Context & Operational Ground Rules
Refer to [GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md](file:///c:/xampp/htdocs/areabazaar/GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md) (Domain B):
- **Zero Ground Standing Inventory:** Warehouses hold **no pre-stocked goods**. Sourcing demand is dynamically resolved from approved customer order items in `ORDER-ITEMS-INGEST`.
- **Total Sheet Protection & Zero In-Cell Editing:** All cells are locked. Status transitions and lot allocations occur via Column A checkbox triggers and elevated Apps Script execution.
- **Strict Forward-Only State Transitions:** Order items advance strictly in sequence: `requested -> supplied -> QA-passed -> packed -> labelled -> staging-land -> area-sorted -> loaded -> zbd-transit -> area-land -> area-cleared -> dispatched`.
- **Loading Sheets ID Preservation & Archiving:** Companion loading sheets (`MANUAL-ORDER-INGEST-LOADING`, `INTAKE-RECEIVING-LOADING`, `PACKING-QUEUE-LOADING`, etc.) must always preserve the entity ID or assign a new one, with full menu-driven archiving and restoration.
- **Strict Personal Workbook Ownership (Zero Shared Workbooks):**
  - Every warehouse staff member owns their *own personal workbook* stored in their dedicated Google Drive folder (e.g. `WHM_STF008_Intake_Ops.gsheet`). No multiple staff members ever edit or share the same sheet file.
  - **Tier 1 (Lightweight / Focused Duty):** The system generates a dedicated, locked Sheet Tab inside *that employee's personal workbook* (e.g. `TAB-INTAKE-STF008`, `TAB-PACK-BAY1-STF012`).
  - **Tier 2 (Multi-Dependency Duty):** Standalone Lead Ops workbook for managers coordinating the entire order-to-dispatch pipeline.
- **Intermediate Central DB-Sheet Relay (`UwanBuy_DB_Master`):**
  - **Inbound Data Stream:** Approved customer order items flow from the backend database into `UwanBuy_DB_Master` (`DB_ORDERS_FEED`), which then synchronizes into the WHM personal workbooks (`ORDER-ITEMS-INGEST`).
  - **Outbound Data Stream:** Completed dock receiving records (`INTAKE-QA`), supplier vouchers (`COMPILED-BILLS`), and line-haul carrier manifests (`ZBD-DISPATCH-MANIFEST`) buffer into `UwanBuy_DB_Master` (`DB_DISPATCH_QUEUE`) before syncing to the central backend API.
- **Security Rule:** The customer delivery OTP/passcode must **never** be printed on the shipping label.

---

## 2. Step-by-Step Implementation Instructions

### Step 2.1: Create Master WHM Sheets
In the WHM template spreadsheet (`WHM_Operations_Command`), create the following tabs:
1. `ORDER-ITEMS-INGEST` (Inflow stream from `UwanBuy_DB_Master!DB_ORDERS_FEED`)
2. `SOURCING-DEMAND` (Order resolution: aggregated demand per Base Product)
3. `SBA-ACQUISITIONS` (Procurement batches assigned to SBAs)
4. `INTAKE-QA` (Dock receiving QC, weight verification, variance alert)
5. `PACK-ALLOCATION` (FIFO customer lot allocation, urgent priority first)
6. `LABELS-GENERATOR` (Tamper-evident thermal shipping labels)
7. `STAGING-AREA-SORT` (Outlet sorting bays)
8. `ZBD-DISPATCH-MANIFEST` (Line-haul carrier manifests)
9. `COMPILED-BILLS` (Settlement vouchers for sADM payout)
10. `ARCHIVE-LOADING-VAULT`
11. `CONFIG`

### Step 2.2: Establish Column Headers, Locking & Highlighted Action Cells
Establish the exact column layout from Section 4 of the specification:
- **`ORDER-ITEMS-INGEST`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to M: `Order Item ID`, `Master Order ID`, `Session Ref`, `Base Product ID & Variant ID`, `Item Description`, `Quantity Ordered & Multiplier`, `Total Base Units Needed` (Formula), `Destination Area Outlet`, `Urgent Priority?`, `Admin Approved?`, `WHM Status`, `Allocated SBA Batch ID` (All Locked).
  - Col N: `[⚡ Advance Lifecycle Stage]` (Action Cell - Highlighted Blue `#CCE5FF`, Text `#004085`).
- **`SOURCING-DEMAND`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to J: `Demand Code`, `Zone ID`, `Base Product ID & Name`, `Total Base Units Demanded` (Formula), `Bulk Pack Size`, `Bulk Units Needed to Source` (Formula), `Customer Orders Count`, `Urgent Orders Count`, `Sourcing Allocation State` (Locked).
  - Col K: `[📦 Assign SBA Batch]` (Action Cell - Highlighted Purple `#E8DAEF`, Text `#5B2C6F`).
- **`INTAKE-QA`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to L: `Inspection ID`, `Batch Ref`, `Supplied Bulk Qty`, `Defective Qty`, `Net Accepted Qty` (Formula), `Actual Invoiced Cost (₦)`, `Benchmark Budget (₦)`, `Variance %` (Formula), `Variance Alert` (Formula: alert if >10%), `QA Grading Outcome`, `Inspector Notes` (Locked).
  - Col M: `[🔬 Perform Intake QA]` (Action Cell - Highlighted Teal `#D1F2EB`, Text `#0E6251`).
- **`PACK-ALLOCATION` & `LABELS-GENERATOR`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to K: `Order Item ID`, `Order Ref`, `Customer Name`, `Masked Phone` (`0803****567`), `Destination Outlet`, `Description & Qty`, `Packing Verified?`, `Tamper-Evident Label Code`, `Security Alert` (`[DO NOT PRINT PASSCODE ON LABEL]`), `Label Printed?` (Locked).
  - Col L: `[🏷️ Print Package Label]` (Action Cell - Highlighted Brand Red `#F8D7DA`, Text `#721C24`).
- **`ZBD-DISPATCH-MANIFEST`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to L: `Manifest ID`, `Destination Outlet`, `Category`, `Packages Count` (Formula), `Orders Count` (Formula), `Assigned ZBDP Carrier`, `Benchmark Haulage Rate (₦)`, `Total Freight Bill (₦)`, `Admin Clearance?`, `Vehicle Loading Confirmed?`, `Waybill Dispatched?` (Locked).
  - Col M: `[🚚 Dispatch Carrier Manifest]` (Action Cell - Highlighted Yellow `#FFF3CD`, Text `#856404`).

### Step 2.3: Companion Loading Sheets Setup
Create dedicated companion loading sheets:
1. `MANUAL-ORDER-INGEST-LOADING` (Includes Col B: `Order Item ID` - existing ID preserved, missing ID assigned).
2. `ORDER-RESOLUTION-LOADING` (Includes Col B: `Demand Code / Resolution ID`).
3. `INTAKE-RECEIVING-LOADING` (Includes Col B: `Inspection ID`, Col C: `Batch Ref`).
4. `PACKING-QUEUE-LOADING` (Includes Col B: `Order Item ID` - always preserved).
5. `STAGING-CONSOLIDATION-LOADING` (Includes Col B: `Manifest ID`).

Add header action buttons:
- `[🚀 Execute Ingest & Allocation]`
- `[📦 Archive Current WHM Batch]`

### Step 2.4: Build WHM HTML Sidebars in `google_workspace/uwanbuy/ui/`
Create responsive HTML sidebars:
1. `Sidebar_OrderLifecycle.html`: Shows package history and validates forward-only stage transitions via `abCanTransition()`.
2. `Sidebar_SbaDispatch.html`: Sourcing dispatch modal; selects SBA from approved price schedules and generates procurement batch codes.
3. `Sidebar_QAReceiving.html`: Receiving terminal; records delivered bulk quantity, sample test weight, defect count, and flags >10% benchmark cost variance.
4. `Sidebar_LabelPrint.html`: Formats 4x6 thermal shipping labels with QR barcode, order item reference, destination hub, and masked phone numbers (strictly omitting the secret OTP).
5. `Sidebar_CarrierDispatch.html`: Carrier dispatch console; enters vehicle plate number, driver phone, verifies Admin departure clearance, and issues waybill.

### Step 2.5: Build `UwanBuy WHM` Top Menu
In `AB_UI_Engine.gs`, construct the WHM menu:
```javascript
SpreadsheetApp.getUi().createMenu('UwanBuy WHM')
  .addItem('Pull Approved Orders from DB-Sheet (UwanBuy_DB_Master)', 'pullOrdersFromDbMaster')
  .addItem('Run Sourcing Demand Resolution', 'executeOrderResolution')
  .addSeparator()
  .addItem('Open Intake Receiving Terminal', 'openIntakeQASidebar')
  .addItem('Open Manual Order Ingest Loading Sheet', 'openManualOrderLoading')
  .addItem('Archive Current Receiving Log', 'archiveReceivingBatch')
  .addItem('Restore Archived Receiving Log...', 'promptRestoreReceivingBatch')
  .addSeparator()
  .addItem('Print Ready Package Labels (Thermal)', 'batchPrintLabels')
  .addItem('Transfer Labeled Parcels to Staging', 'advanceToStagingBay')
  .addSeparator()
  .addItem('Build Line-Haul Carrier Manifest', 'openCarrierDispatchSidebar')
  .addItem('Sync Completed Manifests & Bills to DB-Sheet', 'syncDispatchesToDbMaster')
  .addToUi();
```

---

## 3. Verification & Acceptance Criteria
1. Order items pull cleanly from `UwanBuy_DB_Master!DB_ORDERS_FEED` without duplicate row ingestion.
2. Sourcing demand aggregates strictly from approved order items, producing exact bulk procurement lines with 0 ground stock.
3. Attempting to skip lifecycle stages (e.g. from `requested` directly to `packed`) is rejected by `abCanTransition()`.
4. Thermal label formatting never exposes the customer's delivery passcode or OTP.
5. Ingest loading sheets preserve existing IDs and support archive vault storage and menu restoration.
6. Dispatch manifests and compiled supplier bills successfully buffer into `UwanBuy_DB_Master!DB_DISPATCH_QUEUE`.
