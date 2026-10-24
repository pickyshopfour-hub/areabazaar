# Prompt 04: FRM Field Operations & Regional Outlet Setup

## Objective
Provision and configure the **Field Regional Marketing (FRM)** workspace architecture, implementing strictly personal staff workbooks (Tier-1 staff tabs inside personal workbooks and Tier-2 Multi-Dependency Lead Outlet Workbooks), all operational registers, offline POS intake, cash remittance batching, secret OTP delivery handover authentication, HTML sidebars, central DB-Sheet relay staging, and the custom `UwanBuy FRM` menu.

---

## 1. Context & Operational Ground Rules
Refer to [GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md](file:///c:/xampp/htdocs/areabazaar/GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md) (Domain C):
- **Commercial Catalog Mirror:** `SELLING-CATALOG-VIEW` is a read-only mirror of approved storefront prices sourced from `UwanBuy_DB_Master` (`DB_PRODUCTS`, `DB_VARIANTS`); field agents cannot alter prices.
- **Offline POS Walk-In Orders:** Orders taken directly from walk-in customers are captured via `Sidebar_PosTerminal.html` and recorded in `PROXY-SPOT-ORDERS` with instantaneous cash logging.
- **Cash Remittance Bundling:** Field cash collections are batched into deposit envelopes, recorded with bank teller numbers in `BATCH-REMITTANCES`, and reconciled before releasing warehouse lines.
- **Secret OTP Delivery Handover:** Parcels arriving at regional outlets (`area-land`) cannot be released or marked completed until the customer provides their **6-digit secret numeric OTP**, validated via `Sidebar_HandoverOTP.html`.
- **Loading Sheets ID Preservation & Archiving:** Companion sheets (`CUSTOMER-ENROLLMENT-LOADING`, `BULK-ORDERS-LOADING`, `REMITTANCE-PREP-LOADING`, `PARCEL-INBOUND-LOADING`) strictly preserve existing IDs and offer menu archiving/restoration.
- **Strict Personal Workbook Ownership (Zero Shared Workbooks):**
  - Every field agent owns their *own personal workbook* inside their dedicated Google Drive folder (e.g. `FRM_STF020_Outlet_Ops.gsheet`). No multiple staff members ever share the same sheet file.
  - **Tier 1 (Lightweight / Focused Duty):** The system generates a dedicated, locked Sheet Tab inside *that agent's personal workbook* (e.g. `TAB-POS-STF020`, `TAB-RUNNER-STF022`).
  - **Tier 2 (Multi-Dependency Duty):** Standalone Lead Outlet workbook for regional hub managers overseeing sales, cash, remittances, and delivery handovers.
- **Intermediate Central DB-Sheet Relay (`UwanBuy_DB_Master`):**
  - **Inbound Data Stream:** Approved catalog prices (`DB_PRODUCTS`, `DB_VARIANTS`) and inbound shipments (`DB_ORDERS_FEED`) flow into FRM personal workbooks from `UwanBuy_DB_Master`.
  - **Outbound Data Stream:** Walk-in POS orders (`PROXY-SPOT-ORDERS`), field payments (`FIELD-PAYMENTS-REPORT`), bank deposit bundles (`BATCH-REMITTANCES`), and delivery handover confirmations buffer into `UwanBuy_DB_Master` (`DB_DISPATCH_QUEUE`) before syncing to the backend database.

---

## 2. Step-by-Step Implementation Instructions

### Step 2.1: Create Master FRM Sheets
In the FRM template spreadsheet (`FRM_Field_Operations`), create the following tabs:
1. `SELLING-CATALOG-VIEW` (Read-only price book mirrored from `UwanBuy_DB_Master`)
2. `AREA-CUSTOMERS` (Local customer registry)
3. `PROXY-SPOT-ORDERS` (Walk-in & community bulk orders)
4. `FIELD-PAYMENTS-REPORT` (Cash and POS receipt ledger)
5. `BATCH-REMITTANCES` (Bank teller deposit bundles)
6. `AREA-INBOUND-RECEIVING` (Inbound line-haul carrier intake)
7. `CUSTOMER-DELIVERY-HANDOVER` (Secret OTP authentication terminal)
8. `ARCHIVE-LOADING-VAULT`
9. `CONFIG`

### Step 2.2: Establish Column Headers, Locking & Highlighted Action Cells
Establish the exact column layout from Section 5 of the specification:
- **`SELLING-CATALOG-VIEW`:**
  - Col A to G: `Variant ID`, `Product Title`, `Category`, `Approved Selling Price (₦)`, `MOQ`, `Unit Description`, `Active State` (All Read-Only & Formula Locked).
- **`AREA-CUSTOMERS`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to H: `Customer ID`, `Full Name`, `Phone Number`, `Assigned Outlet`, `Delivery Street Address`, `Customer Type`, `Lifetime Orders Count` (Locked).
  - Col I: `[👤 Edit Customer Profile]` (Action Cell - Highlighted Sky Blue `#E0F2FE`, Text `#0369A1`).
- **`PROXY-SPOT-ORDERS`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to K: `Proxy Order Line ID`, `Invoice Ref`, `Customer ID & Name`, `Variant ID Ordered`, `Unit Price (₦)` (Formula), `Quantity Ordered`, `Line Total Amount (₦)` (Formula), `Fulfillment Preference`, `Payment Status`, `Pushed to Backend?` (Locked).
  - Col L: `[🛒 Take New Order]` (Action Cell - Highlighted Emerald `#D1E7DD`, Text `#0F5132`).
- **`FIELD-PAYMENTS-REPORT` & `BATCH-REMITTANCES`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to I: `Receipt ID`, `Invoice Ref`, `Customer Name`, `Collection Timestamp`, `Payment Mode`, `Amount Collected (₦)`, `Remittance State`, `Linked Batch Remittance ID` (Locked).
  - Col J: `[💰 Batch for Bank Deposit]` (Action Cell - Highlighted Amber `#FFF3CD`, Text `#856404`).
- **`CUSTOMER-DELIVERY-HANDOVER`:**
  - Col A: `[ ]` Select Checkbox.
  - Col B to K: `Parcel Barcode Ref`, `Customer Full Name`, `Customer Phone`, `Description & Qty`, `Delivery Channel`, `Entered Secret OTP`, `OTP Authentication Result` (Formula), `Delivery State`, `Proof of Delivery Link`, `Handover Timestamp` (Locked).
  - Col L: `[🔐 Authenticate Handover OTP]` (Action Cell - Highlighted Brand Green `#D4EDDA`, Text `#155724`).

### Step 2.3: Companion Loading Sheets Setup
Create dedicated companion loading sheets:
1. `CUSTOMER-ENROLLMENT-LOADING` (Includes Col B: `Customer ID` - preserves existing ID or auto-assigns new one).
2. `BULK-ORDERS-LOADING` (Includes Col B: `Proxy Order Line ID`, Col C: `Customer ID`, Col D: `Variant ID`).
3. `REMITTANCE-PREP-LOADING` (Includes Col B: `Batch Remittance ID`, Col C: `Receipt ID List`).
4. `PARCEL-INBOUND-LOADING` (Includes Col B: `Parcel Barcode Ref` - always uses existing scanned barcode).

Add header action buttons:
- `[🚀 Submit & Sync Field Data]`
- `[📦 Archive Current FRM Batch]`

### Step 2.4: Build FRM HTML Sidebars in `google_workspace/uwanbuy/ui/`
Create responsive HTML sidebars:
1. `Sidebar_CustomerEnrollment.html`: Walk-in registration form; collects customer name, phone number, residential street address, and preferred delivery channel.
2. `Sidebar_PosTerminal.html`: Responsive POS checkout; searches catalog items, validates MOQ, computes total amount, and records cash or POS receipt.
3. `Sidebar_RemittanceBuilder.html`: Cash deposit bundler; selects unremitted receipts, sums total cash amount, prompts for bank teller transaction number, and uploads bank deposit slip photo.
4. `Sidebar_HandoverOTP.html`: Security authentication console; prompts FRM agent for the customer's 6-digit OTP, validates against `UwanBuy_DB_Master` / backend API, unlocks parcel release upon match, and captures recipient signature/photo.

### Step 2.5: Build `UwanBuy FRM` Top Menu
In `AB_UI_Engine.gs`, construct the FRM menu:
```javascript
SpreadsheetApp.getUi().createMenu('UwanBuy FRM')
  .addItem('Open Walk-In POS Terminal', 'openPosTerminalSidebar')
  .addItem('Enroll New Customer (Sidebar)', 'openCustomerEnrollmentSidebar')
  .addSeparator()
  .addItem('Open Customer Enrollment Loading Sheet', 'openCustomerLoadingSheet')
  .addItem('Open Bulk Orders Loading Sheet', 'openBulkOrdersLoadingSheet')
  .addItem('Archive Current Field Signup Roster', 'archiveCustomerRoster')
  .addItem('Restore Archived Field Roster...', 'promptRestoreCustomerRoster')
  .addSeparator()
  .addItem('Build Batch Bank Remittance Package', 'openRemittanceBuilderSidebar')
  .addItem('Audit Unremitted Cash-on-Hand', 'auditCashOnHand')
  .addSeparator()
  .addItem('Launch Handover OTP Verification Terminal', 'openHandoverOtpSidebar')
  .addItem('Scan Inbound Carrier Shipment', 'openParcelInboundLoadingSheet')
  .addItem('Sync Field Orders & Remittances to DB-Sheet', 'syncFieldDispatchesToDbMaster')
  .addItem('Refresh Commercial Catalog from DB-Sheet', 'refreshCommercialCatalogFromDbMaster')
  .addToUi();
```

---

## 3. Verification & Acceptance Criteria
1. Entering an incorrect OTP in `Sidebar_HandoverOTP.html` must reject the handover and keep the status as `area-land`.
2. Entering the correct 6-digit OTP updates the parcel status to `Handed Over & Completed` and logs the handover timestamp.
3. Walk-in POS checkout accurately validates selling prices against `SELLING-CATALOG-VIEW` and records an immediate matching receipt in `FIELD-PAYMENTS-REPORT`.
4. Companion loading sheets preserve row IDs and can be archived to `ARCHIVE-LOADING-VAULT` and restored via menu.
5. In personal workbooks, Tier-1 tabs are generated and isolated strictly per field agent.
6. Field orders and remittance bundles successfully buffer into `UwanBuy_DB_Master!DB_DISPATCH_QUEUE`.
