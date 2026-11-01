# Google Workspace Implementation Architecture & Operational Sheet Specification
## ADM (Admin/sADM), WHM (Warehouse Operations), and FRM (Field Regional Marketing)

> **Core Operating Principles:**  
> 1. **No Ground Standing Inventory:** The warehouse holds **no standing stock**. Goods are not pre-stocked; they are dynamically resolved into bulk demand and sourced from Strategic Buying Agents (SBAs) strictly upon customer order approval. "Stock" in all schedules and storefront views represents **session capacity commitments**, not warehouse balance.
> 2. **Total Sheet Protection & Zero In-Cell Editing:** All cells in operational sheets are locked against direct keyboard typing. Google Apps Script runs with elevated script-owner authorization to commit validated changes.
> 3. **Column A Checkbox Trigger (`[ ]`):** Checking a row's checkbox in Column A triggers an interactive HTML Sidebar or Modal Dialog displaying row details and permitting role-validated modifications.
> 4. **Loading Sheet Staging, ID Preservation & Archiving Architecture:** Dedicated companion staging sheets (e.g. `PRICE-UPDATE-LOADING`, `PRODUCT-INGEST-LOADING`, `STOCK-CAPACITY-LOADING`) stage, validate, and bulk-populate master registers.
>    - **Mandatory Entity ID Column:** Every loading sheet **MUST always contain the Entity ID column** for every row (e.g. `product_id`, `variant_id`, `schedule_id`, `order_item_id`).
>    - **ID Preservation & Assignment Logic:** If a row already contains an existing ID, the system **MUST use that existing ID directly** (preventing duplicates, key churn, or broken foreign references). If an item is new and lacks an ID (or requires a new ID), the system assigns/auto-generates a new unique ID.
>    - **Batch Archiving & Menu Restoration:** Loading sheets are stateful and can be **archived** after ingestion or on demand (stamped with a Batch ID and timestamp). Archived batches can be retrieved, reviewed, and **restored at any time directly from the custom Menu** to re-run, audit, or template future loads.
> 5. **Configurable Sync Policy (`INSTANT` vs `DEFERRED`):** Configurable per sheet/workbook to determine whether changes push immediately to the central REST backend or buffer locally in Google Workspace awaiting scheduled or manual batch sync.
> 6. **Highlighted Action Cells:** Every operational action is represented by a visually styled, high-contrast action pill (e.g. `[⚡ Quick Edit]`, `[📦 Assign SBA]`, `[🏷️ Print Label]`, `[🔐 Authenticate OTP]`).
> 7. **Dynamic Two-Tier Staff Workspace Provisioning (Personal Workbook Isolation):**
>    To prevent concurrent write locks, latency, and permission leaks, **every staff member owns their own personal Google Sheet workbook** in Google Drive. Multiple staff members **never share or edit the same file**.
>    - **Tier 1 (Personal Workbook Tab Provisioning for Lightweight / Focused Duties):** When a staff member is assigned an additional single-purpose or lightweight duty (e.g. dedicated receiving inspector, pack station operator, local area runner), the system generates a **new dedicated, protected Sheet Tab inside THAT staff member's personal workbook** (e.g. `TAB-INTAKE-STF008` inside `Staff_Workspace_JohnDoe`). This avoids file sprawl while preserving strict personal workbook isolation.
>    - **Tier 2 (Dedicated Multi-Dependency Workbook Provisioning):** When an employee or partner is assigned a heavy, multi-step operational pipeline with extensive interdependent workflows that must be cleared sequentially (e.g. Lead WHM Operations clearing order resolution -> SBA batching -> intake QA -> pack allocation -> line-haul staging manifests -> bill compilation; or Regional Outlet Lead managing commercial catalog -> customer registration -> POS intake -> cash collection -> bank remittance -> OTP delivery handover), the system dynamically provisions a **separate, full-blown standalone Google Sheet Workbook** containing all required tabs, inter-tab formulas, loading sheets, and personal configuration parameters.
> 8. **Show Products Merchandising Engine:** Dynamic auction projection where the active wave in `WAVE-SCHEDULE` (`wave_status = 'LIVE_SHOWING'`) defines the real-time "Show Products" displayed on the storefront.
> 9. **Central DB-Sheet (`UwanBuy_DB_Master`) Staging Hub & Relay Architecture:**
>    - Personal staff workbooks do not hold master backend API keys or make uncoordinated direct calls to the production database.
>    - Instead, all operational sheets sync internally to a dedicated central Google Workspace database workbook: **`UwanBuy_DB_Master`** (`CENTRAL_DB_SHEET`).
>    - The DB-Sheet serves as the single source of truth, staging buffer, and audit log within Google Workspace. It holds canonical tables (`DB_PRODUCTS`, `DB_VARIANTS`, `DB_SBA_PRICES`, `DB_ORDERS_FEED`, `DB_PAYMENTS_FEED`, `DB_DISPATCH_QUEUE`).
>    - Only the DB-Sheet script holds production REST credentials and coordinates batch synchronization to the central backend (MariaDB/MySQL).
> 10. **Product Variant Specifications (JSON Object Key-Value Storage):**
>     - In addition to standard units, quantities, and packaging types, product variants include structured technical specifications (e.g., `RAM`, `Storage`, `Color`, `Processor`, `Battery`, `Net Weight`, `Shelf Life`, `Material`).
>     - Specifications are stored in a dedicated cell as a clean JSON key-value string (e.g. `{"RAM":"8GB","Storage":"256GB","Color":"Midnight Black"}`).
>     - Interactive sidebars (`Sidebar_VariantSpecs.html`) provide an intuitive visual form with dynamic key-value row builders and category presets, automatically serializing to/from JSON.

---

## 1. System Topology & Two-Way Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CENTRAL DB-SHEET RELAY ARCHITECTURE                             │
└────────────────────────────────────────────────────────────────────────────────────────┘

 [MAIN PRODUCTION BACKEND] (MariaDB / MySQL / REST API)
       ▲                                     │
       │ (Batch Outbound Sync)               │ (Inbound Orders & Bank Feeds)
       │ Products, Specs, SBA Prices,        │ Approved Orders, Invoices,
       │ Schedules, Partners, Outlets        │ Bank Credits, Cancellations
       │                                     ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────┐
 │                      CENTRAL DB-SHEET [UwanBuy_DB_Master]                            │
 │  (Intermediate Staging Hub & Single Source of Truth in Google Workspace)             │
 │                                                                                      │
 │  ├── DB_PRODUCTS & DB_VARIANTS (with JSON Specifications)                            │
 │  ├── DB_SBA_PRICES & DB_STOCK_QUOTAS                                                 │
 │  ├── DB_PARTNERS & DB_FACILITIES                                                     │
 │  ├── DB_ORDERS_FEED (Inbound Stream from Main DB)                                    │
 │  ├── DB_PAYMENTS_FEED (Inbound Stream from Main DB)                                  │
 │  ├── DB_DISPATCH_QUEUE (Outbound Manifests from WHM)                                 │
 │  └── DB_SYNC_LOG & AUDIT_VAULT                                                       │
 └──────────────────────────────────────────────────────────────────────────────────────┘
       ▲                                     ▲                                    ▲
       │                                     │                                    │
  (Internal Sync)                       (Internal Sync)                      (Internal Sync)
       │                                     │                                    │
 ┌──────────────────────┐              ┌──────────────────────┐             ┌─────────────────────┐
 │ ADM Control Center   │              │ WHM Personal Ops     │             │ FRM Personal Ops    │
 │ Workbook [ADM]       │              │ Workbooks [WHM]      │             │ Workbooks [FRM]     │
 │                      │              │                      │             │                     │
 │ • Catalog & Variants │              │ • Demand Resolution  │             │ • Catalog Mirror    │
 │ • JSON Specs Builder │              │ • Intake QA Dock     │             │ • POS Walk-In Orders│
 │ • SBA Price Schedules│              │ • Packing & Labels   │             │ • Cash Remittances  │
 │ • Staff Registry     │              │ • Carrier Dispatch   │             │ • Secret OTP Handover
 └──────────────────────┘              └──────────────────────┘             └─────────────────────┘
```

### 1.1 Two-Way Synchronization Classification
1. **Workspace-Originated Data (Outbound Pipeline):**
   - **Entities:** Master Base Products, Product Variants (with JSON specifications), SBA Negotiated Benchmark Prices, Session Capacity Commitments, Partner Profiles (SBAs, ZBDP Carriers), and Regional Outlets.
   - **Flow:** Created, edited, or loaded in Admin/WHM/FRM personal sheets $\rightarrow$ staged and consolidated in `UwanBuy_DB_Master` $\rightarrow$ dispatched in batch via REST API to the main backend database.
2. **Database-Originated Data (Inbound Pipeline):**
   - **Entities:** Customer Online Orders, Invoices, Storefront Cancellations, Bank Statement Credit Alerts, Payment Gateway Callbacks.
   - **Flow:** Generated by customer activity in the web app or payment webhooks $\rightarrow$ ingested into `UwanBuy_DB_Master` (`DB_ORDERS_FEED`, `DB_PAYMENTS_FEED`) $\rightarrow$ distributed down into WHM personal operational sheets (`ORDER-ITEMS-INGEST`) and FRM sheets (`CUSTOMER-DELIVERY-HANDOVER`).
                            ├── FIELD-PAYMENTS-REPORT (Cash collection ledger)
                            ├── BATCH-REMITTANCES (Bank teller deposit bundles)
                            └── AREA-INBOUND-RECEIVING & CUSTOMER-DELIVERY-HANDOVER (Secret OTP)
```

---

## 2. Global Operational Standards: The 7 Mandated Dimensions

Every operational sheet across the ecosystem is rigorously structured according to **7 functional dimensions**:
1. **Columns:** Complete header layout, data types, system-locking, formulas, and Column A Checkbox (`[ ]`).
2. **Sidebar / Modal:** Responsive HTML interface launched on Column A selection or action trigger.
3. **Action Cell:** Distinct, high-contrast visual pill within the row triggering immediate operations.
4. **Mass Action with Checkbox:** Batch capabilities enabled when multiple Column A checkboxes are checked.
5. **Loading Sheet (Staging, ID Integrity & Archiving):**
   - **Always contains the Entity ID column.**
   - **ID Reuse:** If an ID exists, the system uses that ID directly without generating a new one.
   - **ID Assignment:** If an ID is blank/new, the system generates/assigns a new unique ID.
   - **Archiving & Menu Retrieval:** Batches can be archived to storage sheets and restored at any time via menu items.
6. **Config:** Parameters defined in the sheet's `CONFIG` block (Base URL, API keys, sync mode, threshold tags).
7. **Menu Items:** Custom Google Apps Script top-level dropdown items (`UwanBuy Admin`, `UwanBuy WHM`, `UwanBuy FRM`) including batch archiving, restoration, and publishing.

---

## 3. Domain A: ADM Control Center Specification (Senior Admin & Admin)

### 3.1 Sheet: `PRODUCT-REGISTER`
* **Owning Stakeholder:** Senior Admin (sADM) & Admin (ADM)
* **Purpose:** Canonical catalog of Base Products (parent items).

1. **Columns:**
   - **Col A:** `[ ]` Select / Edit Checkbox (Boolean)
   - **Col B:** `Product ID` (String, e.g. `uw_prd_1001`, System Locked)
   - **Col C:** `Product Name` (String, Locked)
   - **Col D:** `Category` (`groceries`, `gadgets`, `fashion`, `home`, Locked)
   - **Col E:** `Sub-Category` (Locked)
   - **Col F:** `Sub-Sub-Category` (Locked)
   - **Col G:** `Brand` (String, Locked)
   - **Col H:** `Description` (Text, Locked)
   - **Col I:** `Has Variants?` (Boolean, Locked)
   - **Col J:** `Modal View Type` (`variant_list`, `attribute_options`, `standard_preview`, Formula Locked)
   - **Col K:** `Status` (`Approved`, `Draft`, `Deactivated`, Locked)
   - **Col L:** `[⚡ Quick Edit]` **(Action Cell - Highlighted Amber)**
2. **Sidebar (`Sidebar_ProductEdit.html`):**
   - Opened automatically when Col A checkbox is checked.
   - Form fields: Product Name, Category dropdowns, Brand, Rich Description, Media URL, Modal View Type selector, and Status radio buttons.
   - Action buttons: `[Save Changes]` (validates input and commits via elevated Apps Script), `[Cancel]`.
3. **Action Cell (Col L):**
   - High-contrast amber badge: `[⚡ Quick Edit]`. Single click opens the edit sidebar for that row.
4. **Mass Action with Checkbox:**
   - Checking multiple Col A checkboxes opens floating bar: `[✓ Approve Selected Products]`, `[Deactivate Selected]`, `[Export Selected to CSV]`.
5. **Loading Sheet (`PRODUCT-INGEST-LOADING`):**
   - Staging sheet for supplier bulk uploads and catalog dumps.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Product ID` (**Mandatory ID Column** — if existing ID like `uw_prd_1001` is provided, it is preserved and used directly for updates; if blank, a new ID is assigned)
     - **Col C:** `Product Name`
     - **Col D:** `Category`
     - **Col E:** `Sub-Category`
     - **Col F:** `Sub-Sub-Category`
     - **Col G:** `Brand`
     - **Col H:** `Description`
     - **Col I:** `Validation Status` (`VALID`, `MISSING_REQUIRED_FIELDS`, `DUPLICATE_ID`)
   - **Header Actions:** `[🚀 Validate & Populate PRODUCT-REGISTER]`, `[📦 Archive Ingest Batch]`.
6. **Config (`CONFIG` Tab):**
   - `BASE_API_URL: https://api.areabazaar.com/v1`, `SYNC_MODE: INSTANT`, `AUTO_APPROVE_CATALOG: FALSE`.
7. **Menu Items (`UwanBuy Admin` Menu):**
   - `New Base Product (Sidebar Form)`
   - `Open Product Ingest Loading Sheet`
   - `Archive Current Product Ingest Batch`
   - `Restore Archived Ingest Batch...`
   - `Publish Approved Products to Storefront API`

---

### 3.2 Sheet: `VARIANT-REGISTER`
* **Owning Stakeholder:** Senior Admin (sADM) & Admin (ADM)
* **Purpose:** Derived variations of Base Products (discrete sizes, pack sizes, attributes, technical specifications, SKUs).

1. **Columns:**
   - **Col A:** `[ ]` Select / Edit Checkbox (Boolean)
   - **Col B:** `Variant ID` (String, e.g. `var_rice_50kg`, `var_redmi13c_8_256`, System Locked)
   - **Col C:** `Base Product Ref` (String, foreign key to `PRODUCT-REGISTER!B:B`, Locked)
   - **Col D:** `Variant Name` (String, e.g. `50kg Bag`, `8GB/256GB Black`, Locked)
   - **Col E:** `Master SKU` (String, e.g. `MAM-50KG`, `RED-13C-8-256-BLK`, Formula/System Locked)
   - **Col F:** `Quantity Value in Base Unit` (Number, e.g. `50` for 50kg, `1` for single gadget, Locked)
   - **Col G:** `Quantity Unit` (`kg`, `litres`, `pcs`, `pack`, `tubers`, `units`, Locked)
   - **Col H:** `Packaging Type` (`Woven Poly Bag`, `Carton Box`, `Jerrycan`, `Sachet Bundle`, Locked)
   - **Col I:** `Specifications (JSON / Key-Value Pairs)` (String/Object, e.g. `{"RAM":"8GB","Storage":"256GB","Color":"Midnight Black","Battery":"5000mAh"}` or `{"Net Weight":"50kg","Grain Type":"Long Grain Parboiled","Packaging Date":"2026-10"}`, Locked)
   - **Col J:** `Active Status` (`Active`, `Discontinued`, `Hidden`, Locked)
   - **Col K:** `[⚙️ Edit Variant Specs]` **(Action Cell - Highlighted Blue)**
2. **Sidebar (`Sidebar_VariantSpecs.html`):**
   - Displays parent product name and Variant ID.
   - Form controls for Variant Name, SKU override, Pack Multiplier, Unit, Packaging Type, and Status.
   - **Dynamic Specifications Builder:**
     - Interactive table of key-value attribute rows (e.g., Key: `RAM`, Value: `8GB`).
     - Category preset buttons:
       - **Gadgets/Tech:** RAM, Storage, Screen Size, Processor, Battery, Color, Network, OS.
       - **Groceries:** Net Weight, Grain Type, Moisture Content, Processing Date, Shelf Life, Packaging Standard.
       - **Fashion:** Size, Color, Fabric Material, Gender, Care Instructions.
       - **Appliances/Home:** Wattage, Capacity, Voltage, Material, Energy Rating.
     - `[+ Add Spec Attribute]` button adds an arbitrary custom key-value pair.
     - Serializes cleanly into formatted JSON before committing to Col I.
3. **Action Cell (Col K):**
   - High-contrast blue badge: `[⚙️ Edit Variant Specs]`. Single click opens the variant specification sidebar.
4. **Mass Action with Checkbox:**
   - Multi-select triggers: `[Batch Activate]`, `[Batch Discontinue]`, `[Update Unit Multipliers]`.
5. **Loading Sheet (`VARIANT-INGEST-LOADING`):**
   - Companion staging tab for bulk importing SKUs against existing Base Product IDs.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Variant ID` (**Mandatory ID Column** — if populated with existing `var_...`, it updates that variant; if blank, auto-generates a new variant ID)
     - **Col C:** `Base Product ID` (Mandatory parent reference)
     - **Col D:** `Variant Name`
     - **Col E:** `Master SKU` (Optional custom SKU or auto-generated)
     - **Col F:** `Quantity Value in Base Unit`
     - **Col G:** `Quantity Unit`
     - **Col H:** `Packaging Type`
     - **Col I:** `Specifications (JSON String / Key-Value Pairs)` (**Mandatory Specs Column** — accepts formatted JSON or key-value list like `RAM=8GB; Storage=256GB; Color=Black`)
     - **Col J:** `Validation Status`
   - **Header Actions:** `[🚀 Ingest Variants into Master Register]`, `[📦 Archive Variant Loading Batch]`.
6. **Config:**
   - `AUTO_SKU_GENERATION: TRUE`, `DEFAULT_CURRENCY: NGN`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Add Variant to Active Product`
   - `Open Variant Ingest Loading Sheet`
   - `Archive Current Variant Batch`
   - `Restore Archived Variant Batch...`
   - `Regenerate Missing Master SKUs`

---

### 3.3 Sheet: `SHOW-PRODUCTS-REGISTER` (Wave-Driven Auction Showcase)
* **Owning Stakeholder:** Senior Admin (sADM) & Admin (ADM)
* **Purpose:** Live storefront showcase projection. Derived directly from whichever wave is active in `WAVE-SCHEDULE` where `wave_status = 'LIVE_SHOWING'`. When a wave is swapped or a single variant is added/removed, the show products update immediately.

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Live Showing Slot` (`Slot-01`, `Slot-02`, ..., `Slot-12`, Locked)
   - **Col C:** `Source Auction Session Ref` (`SESS-0042`, Locked)
   - **Col D:** `Active Wave ID` (`WAVE-01`, Locked)
   - **Col E:** `Variant ID` (`var_rice_50kg`, Locked)
   - **Col F:** `Product & Variant Title` (Locked)
   - **Col G:** `Auction Format` (`Price Wave`, `Stock Cap`, `Flat-Rate Pool`, Locked)
   - **Col H:** `Original Reference Price (₦)` (Locked)
   - **Col I:** `Live Showing Wave Price (₦)` (Locked)
   - **Col J:** `Min Order Qty (MOQ)` (Number, Locked)
   - **Col K:** `Wave Timer Remaining (Mins)` (Formula Locked: `CEILING((Wave_End - NOW())*1440, 1)`)
   - **Col L:** `Show Status` (`LIVE_SHOWING`, `SWAP_PENDING`, `OFF_AIR`, Locked)
   - **Col M:** `[🔄 Swap Wave / Slot]` **(Action Cell - Highlighted Red)**
2. **Sidebar (`Sidebar_WaveSwap.html`):**
   - Allows Admin to swap an entire wave, replace an individual variant slot, or schedule the next wave drop with live preview of customer prices.
3. **Action Cell (Col M):**
   - High-contrast brand red badge: `[🔄 Swap Wave / Slot]`. Triggers immediate slot replacement modal.
4. **Mass Action with Checkbox:**
   - Multi-select triggers: `[Broadcast Emergency Price Drop]`, `[Extend Wave Timer +15m]`, `[Take Wave Off-Air]`.
5. **Loading Sheet (`WAVE-SWAP-LOADING`):**
   - Staging table where the upcoming wave queue of variants and prices is arranged prior to go-live.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Slot Ref / Wave Item ID` (**Mandatory ID Column** — uses existing variant IDs; maintains slot placement)
     - **Col C:** `Target Wave ID`
     - **Col D:** `Variant ID` (Must exist in `VARIANT-REGISTER`)
     - **Col E:** `Showing Price (₦)`
     - **Col F:** `MOQ`
     - **Col G:** `Display Order`
     - **Col H:** `Staging Status`
   - **Header Actions:** `[🚀 Push Staged Wave to Live SHOW-PRODUCTS]`, `[📦 Archive Wave Drop Schedule]`.
6. **Config:**
   - `SHOW_REFRESH_INTERVAL_SECS: 30`, `AUTO_ROTATE_WAVES: TRUE`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Sync Live Wave with Storefront Show Products`
   - `Open Wave Swap Loading Sheet`
   - `Archive Wave Drop Schedule`
   - `Restore Archived Wave Schedule...`
   - `Schedule Next Wave Queue`

---

### 3.4 Sheet: `STOCK-SCHEDULE` (Session Commitment Quotas)
* **Owning Stakeholder:** Senior Admin (sADM) & Admin (ADM)
* **Purpose:** Defines the maximum sellable order capacity commitments accepted during an auction session per Warehouse Zone (*not physical inventory held on ground*).

1. **Columns:**
   - **Col A:** `[ ]` Select / Adjust Checkbox (Boolean)
   - **Col B:** `Schedule ID` (`SCH-STK-0101`, System Locked)
   - **Col C:** `Session Ref` (`SESS-0042`, Locked)
   - **Col D:** `Warehouse Zone ID` (`WHZ-01`, Locked)
   - **Col E:** `Variant ID` (`var_rice_50kg`, Locked)
   - **Col F:** `Product Title` (Locked)
   - **Col G:** `Session Capacity Quota` (Max units committed to sell, Locked)
   - **Col H:** `MOQ Requirement` (Locked)
   - **Col I:** `Live Orders Committed` (Formula locked from `ORDER-ITEMS-INGEST`: Sum of approved units)
   - **Col J:** `Remaining Capacity` (Formula: `Col G - Col I`, Locked)
   - **Col K:** `Capacity State` (Formula: `IF(Col J <= 0, "CAPPED", "OPEN")`, Locked)
   - **Col L:** `[📊 Adjust Capacity Quota]` **(Action Cell - Highlighted Indigo)**
2. **Sidebar (`Sidebar_StockQuota.html`):**
   - Adjusts session sellable capacity up or down based on supplier availability.
3. **Action Cell (Col L):**
   - High-contrast indigo badge: `[📊 Adjust Capacity Quota]`. Single click opens quota slider.
4. **Mass Action with Checkbox:**
   - `[Bulk Increase Quotas +20%]`, `[Cap All Selected Items]`.
5. **Loading Sheet (`STOCK-CAPACITY-LOADING`):**
   - Prepares capacity schedules across multiple variants for upcoming sessions.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Schedule ID` (**Mandatory ID Column** — if existing `SCH-STK-...` provided, updates existing quota; if blank, assigns a new schedule ID)
     - **Col C:** `Session Ref`
     - **Col D:** `Warehouse Zone ID`
     - **Col E:** `Variant ID` (Existing Variant ID)
     - **Col F:** `Planned Capacity Quota`
     - **Col G:** `Session MOQ`
     - **Col H:** `Status`
   - **Header Actions:** `[🚀 Apply Capacity Quotas to STOCK-SCHEDULE]`, `[📦 Archive Capacity Template]`.
6. **Config:**
   - `DEFAULT_CAPACITY_BUFFER_PCT: 10%`, `PREVENT_OVERSELLING: TRUE`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Audit Session Capacity vs Supplier Sourcing Limits`
   - `Open Stock Capacity Loading Sheet`
   - `Archive Capacity Template`
   - `Restore Archived Capacity Template...`

---

### 3.5 Sheet: `SBA-PRICE-SCHEDULE` & `HANDLING-COST`
* **Owning Stakeholder:** Senior Admin (sADM) & Admin (ADM)
* **Purpose:** Sourcing cost benchmarks negotiated with SBAs, handling components, and cost floor validation.

1. **Columns (`SBA-PRICE-SCHEDULE`):**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Price Schedule ID` (System Locked)
   - **Col C:** `Warehouse Zone ID` (Locked)
   - **Col D:** `Variant ID` (Locked)
   - **Col E:** `Assigned SBA ID` (Locked)
   - **Col F:** `Benchmark Unit Cost (₦)` (Locked)
   - **Col G:** `Benchmark Unit Cost (Kobo)` (Formula: `Col F * 100`, Locked)
   - **Col H:** `Effective Date` & `Expiry Date` (Locked)
   - **Col I:** `sADM Approval State` (`Approved`, `Under Review`, `Rejected`, Locked)
   - **Col J:** `[⚖️ Review & Authorize]` **(Action Cell - Highlighted Emerald)**
2. **Sidebar (`Sidebar_PriceCalculator.html`):**
   - Displays SBA benchmark, sum of 7 handling components (labor, repack, packaging, offloading, storage, overhead, QA), transport benchmark, and profit margin slider.
3. **Action Cell (Col J):**
   - High-contrast emerald badge: `[⚖️ Review & Authorize]`.
4. **Mass Action with Checkbox:**
   - `[sADM Bulk Authorize Prices]`, `[Reject Selected Price Submissions]`.
5. **Loading Sheet (`PRICE-UPDATE-LOADING`):**
   - Staging table where new negotiated supplier prices are entered in bulk.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Price Schedule ID` (**Mandatory ID Column** — if existing ID provided, updates active price schedule; if blank, assigns a new schedule ID)
     - **Col C:** `Warehouse Zone ID`
     - **Col D:** `Variant ID` (**Mandatory ID Column** — uses existing Variant ID directly)
     - **Col E:** `SBA ID`
     - **Col F:** `New Unit Benchmark Cost (₦)`
     - **Col G:** `Effective Date`
     - **Col H:** `Expiry Date`
     - **Col I:** `Validation State`
   - **Header Actions:** `[🚀 Load into SBA-PRICE-SCHEDULE]`, `[📦 Archive Price Update Batch]`.
6. **Config:**
   - `SYNC_MODE: DEFERRED`, `PRICE_EXPIRY_DAYS: 7`, `REQUIRE_SADM_APPROVAL: TRUE`.
7. **Menu Items:**
   - `Open Price Update Loading Sheet`
   - `Archive Price Update Batch`
   - `Restore Archived Price Batch...`
   - `Run Price Variance Audit`
   - `Compute Selling Prices into SELLING-BASE-PRICE-SCHEDULE`

---

### 3.6 Sheet: `SELLING-BASE-PRICE-SCHEDULE`
* **Owning Stakeholder:** Senior Admin (sADM)
* **Purpose:** Final customer-facing price book calculating cost floors, target margins, and rounding rules.

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Variant ID` (Locked)
   - **Col C:** `Warehouse Zone ID` (Locked)
   - **Col D:** `Approved SBA Benchmark (₦)` (Formula locked from `SBA-PRICE-SCHEDULE`)
   - **Col E:** `Total Handling Cost (₦)` (Formula locked from `HANDLING-COST`)
   - **Col F:** `Transport Benchmark (₦)` (Formula locked)
   - **Col G:** `Unit Cost Floor (₦)` (Formula locked: `Col D + Col E + Col F`)
   - **Col H:** `Target Gross Margin %` (Default: 15%, Locked)
   - **Col I:** `Rounding Step` (₦50, Locked)
   - **Col J:** `Calculated Selling Price (₦)` (Formula locked: `CEILING(Col G / (1 - Col H), Col I)`)
   - **Col K:** `Compare-At Reference Price (₦)` (Locked)
   - **Col L:** `Authorization Status` (`Authorized - Live`, `Draft`, Locked)
   - **Col M:** `[🚀 Publish Live Price]` **(Action Cell - Highlighted Brand Red)**
2. **Sidebar (`Sidebar_PricePublish.html`):**
   - Allows Senior Admin to override margins, verify cost floor integrity, and trigger immediate publishing to the storefront.
3. **Action Cell (Col M):**
   - High-contrast red badge: `[🚀 Publish Live Price]`. Pushes price directly to storefront API.
4. **Mass Action with Checkbox:**
   - `[Bulk Publish Selected to Storefront]`, `[Suspend Selected Live Prices]`.
5. **Loading Sheet (`SELLING-PRICE-OVERRIDE-LOADING`):**
   - Staging tab for batch promotional price drops and holiday overrides.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Variant ID` (**Mandatory ID Column** — uses existing Variant ID directly)
     - **Col C:** `Warehouse Zone ID`
     - **Col D:** `Override Price (₦)`
     - **Col E:** `Override Margin %`
     - **Col F:** `Campaign Ref`
     - **Col G:** `Floor Check Passed?` (Formula locked: verifies override exceeds cost floor)
   - **Header Actions:** `[🚀 Commit Price Overrides]`, `[📦 Archive Override Campaign]`.
6. **Config:**
   - `SYNC_MODE: INSTANT`, `ENFORCE_COST_FLOOR: TRUE`, `DEFAULT_MARGIN_PCT: 15%`.
7. **Menu Items:**
   - `Open Selling Price Override Loading Sheet`
   - `Archive Price Override Campaign`
   - `Restore Archived Price Override Campaign...`
   - `Publish All Authorized Prices to Storefront API`
   - `Export Active Price List (PDF/CSV)`

---

### 3.7 Sheet: `STAFF-REGISTRY` (Dynamic Role Sheet & Tab Generator)
* **Owning Stakeholder:** Senior Admin (sADM) & Admin (ADM)
* **Purpose:** Central staff and partner register. Every staff member is provisioned their **own isolated personal workbook** (zero file-sharing between multiple staff members). Depending on operational duty complexity, generating or provisioning an assignee dynamically creates either a **dedicated Sheet Tab inside that staff member's personal workbook** (for lightweight duties) or an **entire standalone Google Sheet Workbook** (for roles with extensive sequential dependencies).

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Staff ID` (`STF-001`, System Locked)
   - **Col C:** `Full Name` (Locked)
   - **Col D:** `Email Address` (Locked)
   - **Col E:** `Phone Number` (Locked)
   - **Col F:** `Assigned Role(s)` (`SeniorAdmin`, `Admin`, `WHM`, `Sales/FRM`, `SBA-Partner`, `ZBDp-Driver`, Locked)
   - **Col G:** `Assigned Facility / Hub` (`WHZ-01` Tanke, `AREA-01`, Locked)
   - **Col H:** `Provisioning Tier` (`Sheet Tab (Personal Workbook)` vs `Full Dedicated Workbook (Multi-Dependency)`, Locked)
   - **Col I:** `Generated Workspace / Tab URL` (Hyperlink directly to staff member's personal sheet or specific personal tab, Locked)
   - **Col J:** `Account Status` (`Active`, `Suspended`, Locked)
   - **Col K:** `[⚡ Provision Tab / Workbook]` **(Action Cell - Highlighted Violet)**
2. **Sidebar (`Sidebar_StaffProvisioning.html`):**
   - Form to add/edit staff, assign role(s), facility, and select **Workload Dependency Scope**:
     - **Option 1: Lightweight / Focused Duty (Tier 1):** Generates a **new Sheet Tab** inside *that staff member's existing personal workbook* (e.g. `TAB-INTAKE-STF008` inside `Staff_Workspace_JohnDoe`). Prevents file sprawl while maintaining 100% file isolation from other staff.
     - **Option 2: Multi-Dependency Workflow (Tier 2):** Generates a **dedicated standalone Google Sheet Workbook** cloning the master role template with all interdependent tabs (e.g. Demand Resolution + SBA Acquisitions + Intake QA + Pack Allocation + Waybills + Bills). Sets personal configuration and grants isolated Google Drive permissions.
3. **Action Cell (Col K):**
   - High-contrast violet badge: `[⚡ Provision Tab / Workbook]`.
   - **Dynamic Execution:** Inspects `Col H (Provisioning Tier)`:
     - If `Sheet Tab`: Executes `abProvisionStaffTab()`, adding a protected tab to that staff member's personal workbook and outputting the tab URL (`#gid=...`) into Col I.
     - If `Full Workbook`: Executes `abGenerateStaffWorkbook()`, cloning the full template workbook and outputting the new document URL into Col I.
4. **Mass Action with Checkbox:**
   - `[Bulk Provision Selected Staff]`, `[Suspend Selected Staff Accounts]`, `[Sync Staff Access Permissions]`.
5. **Loading Sheet (`STAFF-ONBOARDING-LOADING`):**
   - Staging table for batch importing new hires, temporary intake hands, and field agents.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Staff ID` (**Mandatory ID Column** — if existing staff re-joining/transferring, uses existing `STF-...`; if blank, auto-generates next sequential Staff ID)
     - **Col C:** `Full Name`
     - **Col D:** `Email Address`
     - **Col E:** `Phone Number`
     - **Col F:** `Role(s)`
     - **Col G:** `Facility / Zone`
     - **Col H:** `Target Provisioning Tier` (`Sheet Tab` vs `Full Workbook`)
     - **Col I:** `Validation Status`
   - **Header Actions:** `[🚀 Onboard & Provision Staff Workspaces/Tabs]`, `[📦 Archive Onboarding Roster]`.
6. **Config:**
   - `FACILITY_SHARED_WORKBOOK_ID`, `WHM_LEAD_TEMPLATE_ID`, `FRM_LEAD_TEMPLATE_ID`, `GDRIVE_STAFF_FOLDER_ID`, `DEFAULT_PROVISION_TIER: AUTO`.
7. **Menu Items:**
   - `Provision Staff Member (Tab or Workbook)`
   - `Open Staff Onboarding Loading Sheet`
   - `Archive Staff Onboarding Batch`
   - `Restore Archived Staff Batch...`
   - `Audit Staff Tabs vs Dedicated Workbooks`
   - `Audit Staff Workspace Permissions`

---

### 3.8 Sheet: `AUCTION-SESSIONS` & `WAVE-SCHEDULE`
* **Owning Stakeholder:** Senior Admin (sADM) & Admin (ADM)
* **Purpose:** Auction broadcast schedule and wave timing orchestration.

1. **Columns (`AUCTION-SESSIONS`):**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Session ID` (`SESS-0042`, System Locked)
   - **Col C:** `Session Title` (Locked)
   - **Col D:** `Warehouse Zone ID` (Locked)
   - **Col E:** `Start Time (UTC)` & `End Time (UTC)` (Locked)
   - **Col F:** `Auction Format Type` (Locked)
   - **Col G:** `Pre-Flight Readiness Audit Passed?` (Formula locked: checks prices, capacity, and SBAs)
   - **Col H:** `Session State` (`Scheduled`, `Live`, `Paused`, `Concluded`, Locked)
   - **Col I:** `[🎙️ Control Broadcast]` **(Action Cell - Highlighted Orange)**
2. **Sidebar (`Sidebar_AuctionBroadcast.html`):**
   - Real-time broadcast controls: start session, pause wave, extend countdown, or trigger surprise drop prices.
3. **Action Cell (Col I):**
   - High-contrast orange badge: `[🎙️ Control Broadcast]`.
4. **Mass Action with Checkbox:**
   - `[Batch Conclude Sessions]`, `[Batch Audit Readiness]`.
5. **Loading Sheet (`AUCTION-PREP-LOADING`):**
   - Staging sheet to set up wave configurations and item lots.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Session ID / Wave ID` (**Mandatory ID Column** — uses existing session ID if scheduling extra waves; assigns new ID for brand new session)
     - **Col C:** `Session Title`
     - **Col D:** `Warehouse Zone ID`
     - **Col E:** `Start Time` & `End Time`
     - **Col F:** `Lot Variants List` (Comma-separated Variant IDs)
     - **Col G:** `Readiness Audit Status`
   - **Header Actions:** `[🚀 Commit Auction Schedule]`, `[📦 Archive Auction Prep Batch]`.
6. **Config:**
   - `SYNC_MODE: INSTANT`, `BROADCAST_WEBHOOK_URL`.
7. **Menu Items:**
   - `Launch Pre-Flight Readiness Audit`
   - `Open Auction Prep Loading Sheet`
   - `Archive Auction Prep Batch`
   - `Restore Archived Auction Schedule...`
   - `Broadcast Live Session State`

---

### 3.9 Sheet: `BANK-FEED-SYNC` & `PAYMENT-RECON`
* **Owning Stakeholder:** Senior Admin (sADM)
* **Purpose:** Ingests bank credit alerts (via Gmail/API) and reconciles against customer invoices and field agent remittances to release orders into WHM.

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Bank Trx Ref` (Locked)
   - **Col C:** `Timestamp` (Locked)
   - **Col D:** `Credit Amount (₦)` (Locked)
   - **Col E:** `Payer Narrative` (Locked)
   - **Col F:** `Matched Order / Remittance Ref` (Locked)
   - **Col G:** `Depositor Phone` (Locked)
   - **Col H:** `Reconciliation Status` (`Fully Matched`, `Discrepancy`, `Unreconciled`, Locked)
   - **Col I:** `Release Order to WHM?` (Boolean, Locked)
   - **Col J:** `[🔍 Reconcile & Release]` **(Action Cell - Highlighted Cyan)**
2. **Sidebar (`Sidebar_PaymentMatch.html`):**
   - Matches bank alerts to pending customer invoices or FRM remittances.
3. **Action Cell (Col J):**
   - High-contrast cyan badge: `[🔍 Reconcile & Release]`. On confirmation, updates order item status to `requested` in WHM.
4. **Mass Action with Checkbox:**
   - `[Auto-Match Selected Alerts]`, `[Flag Selected as Orphaned]`.
5. **Loading Sheet (`BANK-STATEMENT-CSV-LOADING`):**
   - Staging tab to paste manual bank statement extracts if automated Gmail sync is down.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Bank Trx Ref` (**Mandatory ID Column** — always uses the bank's original transaction reference to prevent double-crediting)
     - **Col C:** `Transaction Date`
     - **Col D:** `Amount (₦)`
     - **Col E:** `Narrative`
     - **Col F:** `Value Date`
   - **Header Actions:** `[🚀 Ingest Statement Transactions]`, `[📦 Archive Bank Statement]`.
6. **Config:**
   - `GMAIL_BANK_QUERY: "from:alerts@gtbank.com"`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Fetch Latest Bank Credit Emails`
   - `Open Bank Statement CSV Loading Sheet`
   - `Archive Current Bank Statement Batch`
   - `Restore Archived Statement Batch...`
   - `Auto-Reconcile Invoices`

---

## 4. Domain B: WHM Operations Command Specification (Warehouse Hub Management)

### 4.1 Sheet: `ORDER-ITEMS-INGEST` (Real-Time Inflow Stream)
* **Owning Stakeholder:** Warehouse Hub Manager (WHM)
* **Purpose:** Live inflow stream of order line items approved by Admin treasury. Central demand feeder for all warehouse operations.

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Order Item ID` (`UWB-ITEM-4011`, System Locked)
   - **Col C:** `Master Order ID` (`UWB-ORD-8821`, Locked)
   - **Col D:** `Session Ref` (Locked)
   - **Col E:** `Base Product ID` & `Variant ID` (Locked)
   - **Col F:** `Item Description` (Locked)
   - **Col G:** `Quantity Ordered` & `Multiplier` (Locked)
   - **Col H:** `Total Base Units Needed` (Formula locked: `Qty * Multiplier`)
   - **Col I:** `Destination Area Outlet` (`AREA-TANKE`, Locked)
   - **Col J:** `Urgent Priority?` (Boolean, Locked)
   - **Col K:** `Admin Approved?` (Boolean, Locked)
   - **Col L:** `WHM Status` (`requested`, `supplied`, `QA-passed`, `packed`, `labelled`, `staging-land`, `area-sorted`, `loaded`, `zbd-transit`, `dispatched`, Locked)
   - **Col M:** `Allocated SBA Batch ID` (Locked)
   - **Col N:** `[⚡ Advance Lifecycle Stage]` **(Action Cell - Highlighted Blue)**
2. **Sidebar (`Sidebar_OrderLifecycle.html`):**
   - Displays package history and allows advancing stage strictly through `abCanTransition` rules.
3. **Action Cell (Col N):**
   - High-contrast blue badge: `[⚡ Advance Lifecycle Stage]`.
4. **Mass Action with Checkbox:**
   - `[Batch Advance to Staging]`, `[Batch Flag as Packing Complete]`.
5. **Loading Sheet (`MANUAL-ORDER-INGEST-LOADING`):**
   - Backup tab for manual/offline order entries.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Order Item ID` (**Mandatory ID Column** — if existing ID from offline paper invoice exists, preserves it; if blank, auto-generates `UWB-ITEM-...`)
     - **Col C:** `Master Order ID`
     - **Col D:** `Variant ID` (Existing Variant ID)
     - **Col E:** `Quantity`
     - **Col F:** `Destination Outlet`
     - **Col G:** `Priority Tag`
   - **Header Actions:** `[🚀 Ingest Orders into ORDER-ITEMS-INGEST]`, `[📦 Archive Manual Order Batch]`.
6. **Config:**
   - `WAREHOUSE_ZONE_ID: WHZ-01`, `AUTO_INGEST_INTERVAL_MINS: 2`, `SYNC_MODE: INSTANT`.
7. **Menu Items (`UwanBuy WHM` Menu):**
   - `Sync Approved Orders from Admin`
   - `Open Manual Order Ingest Loading Sheet`
   - `Archive Manual Order Batch`
   - `Restore Archived Manual Order Batch...`
   - `Run Sourcing Demand Resolution`

---

### 4.2 Sheet: `SOURCING-DEMAND` (Order Resolution Engine)
* **Owning Stakeholder:** Warehouse Hub Manager (WHM)
* **Purpose:** Aggregates approved open orders into bulk procurement demand per Base Product (*zero ground stock*).

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Demand Code` (`DMD-WHZ-01-uw_prd_1001`, System Locked)
   - **Col C:** `Warehouse Zone ID` (Locked)
   - **Col D:** `Base Product ID` & `Name` (Locked)
   - **Col E:** `Total Base Units Demanded` (Formula locked: Sum of unfulfilled `requested` items)
   - **Col F:** `Bulk Unit Pack Size` (e.g. 50kg, Locked)
   - **Col G:** `Bulk Units Needed to Source` (Formula: `CEILING(Base Units / Pack Size, 1)`)
   - **Col H:** `Customer Orders Count` (Formula locked)
   - **Col I:** `Urgent Orders Count` (Formula locked)
   - **Col J:** `Sourcing Allocation State` (`Unassigned`, `Dispatched to SBA`, `Sourced`, Locked)
   - **Col K:** `[📦 Assign SBA Batch]` **(Action Cell - Highlighted Purple)**
2. **Sidebar (`Sidebar_SbaDispatch.html`):**
   - Recommends primary and backup SBAs from `PRODUCT-SOURCING-SCHEDULE`, displays capacity, and drafts procurement batches.
3. **Action Cell (Col K):**
   - High-contrast purple badge: `[📦 Assign SBA Batch]`.
4. **Mass Action with Checkbox:**
   - `[Auto-Allocate All Sourcing Demand across SBAs]`.
5. **Loading Sheet (`ORDER-RESOLUTION-LOADING`):**
   - Preview staging tab showing demand breakdown before committing to `SBA-ACQUISITIONS`.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Demand Code / Resolution ID` (**Mandatory ID Column** — uses existing demand code; preserves line references)
     - **Col C:** `Base Product ID`
     - **Col D:** `Total Units`
     - **Col E:** `Selected Primary SBA ID`
     - **Col F:** `Benchmark Rate (₦)`
     - **Col G:** `Calculated Budget (₦)`
   - **Header Actions:** `[🚀 Commit Sourcing Batches to SBA-ACQUISITIONS]`, `[📦 Archive Resolution Plan]`.
6. **Config:**
   - `DEFAULT_SOURCING_PRIORITY: STRICT_CAPACITY`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Resolve Open Orders into Sourcing Batches`
   - `Open Order Resolution Loading Sheet`
   - `Archive Resolution Plan`
   - `Restore Archived Resolution Plan...`

---

### 4.3 Sheet: `SBA-ACQUISITIONS` & `INTAKE-QA`
* **Owning Stakeholder:** Warehouse Hub Manager (WHM)
* **Purpose:** Receiving dock gate. Inbound delivery verification, weight check, defect grading, and cost variance check against benchmark.

1. **Columns (`INTAKE-QA`):**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Inspection ID` (`INSP-0054`, System Locked)
   - **Col C:** `Batch Ref` (`BATCH-0089`, Locked)
   - **Col D:** `Supplied Bulk Qty` (Delivered units, Locked)
   - **Col E:** `Defective / Rejected Qty` (Locked)
   - **Col F:** `Net Accepted Qty` (Formula: `Col D - Col E`, Locked)
   - **Col G:** `Actual Invoiced Cost (₦)` (Locked)
   - **Col H:** `Benchmark Budget (₦)` (Formula locked)
   - **Col I:** `Variance %` (Formula locked: `(Actual - Benchmark)/Benchmark`)
   - **Col J:** `Variance Alert` (`ACCEPTABLE` vs `ALERT: >10% VARIANCE`, Formula locked)
   - **Col K:** `QA Grading Outcome` (`QApassed`, `QArisk`, `QArejected`, Locked)
   - **Col L:** `Inspector Notes` (Locked)
   - **Col M:** `[🔬 Perform Intake QA]` **(Action Cell - Highlighted Teal)**
2. **Sidebar (`Sidebar_QAReceiving.html`):**
   - Receiving dock terminal: enter delivered count, weigh samples, grade condition, upload defect photo, compute variance.
3. **Action Cell (Col M):**
   - High-contrast teal badge: `[🔬 Perform Intake QA]`.
4. **Mass Action with Checkbox:**
   - `[Batch Release QA-Passed to Packing Bay]`, `[Batch Reject Substandard Lots]`.
5. **Loading Sheet (`INTAKE-RECEIVING-LOADING`):**
   - Receiving dock draft log before physical sign-off.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Inspection ID` (**Mandatory ID Column** — if re-inspecting or updating an existing intake, preserves original `INSP-...`; if new, assigns new ID)
     - **Col C:** `Batch Ref` (Existing Batch Ref from `SBA-ACQUISITIONS`)
     - **Col D:** `Sample Weight Check (kg)`
     - **Col E:** `Delivered Count`
     - **Col F:** `Rejected Count`
     - **Col G:** `SBA Invoice Amount (₦)`
     - **Col H:** `Grading Code`
   - **Header Actions:** `[🚀 Finalize Intake & Sign Off]`, `[📦 Archive Receiving Log]`.
6. **Config:**
   - `COST_VARIANCE_TOLERANCE_PCT: 10%`, `REQUIRE_DEFECT_PHOTO: TRUE`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Open Intake Receiving Dock Terminal`
   - `Open Intake Receiving Loading Sheet`
   - `Archive Current Receiving Log`
   - `Restore Archived Receiving Log...`
   - `Compile Daily Intake Bills for sADM`

---

### 4.4 Sheet: `PACK-ALLOCATION` & `LABELS-GENERATOR`
* **Owning Stakeholder:** Warehouse Hub Manager (WHM)
* **Purpose:** FIFO lot allocation to individual customer orders (urgent orders prioritized) and tamper-evident thermal shipping label generation.

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Order Item ID` (Locked)
   - **Col C:** `Order Reference` (Locked)
   - **Col D:** `Customer Name` (Locked)
   - **Col E:** `Masked Phone` (`0803****567`, Locked)
   - **Col F:** `Destination Area Outlet` (`AREA-TANKE`, Locked)
   - **Col G:** `Item Description & Qty` (Locked)
   - **Col H:** `Packing Verified?` (Boolean, Locked)
   - **Col I:** `Tamper-Evident Label Code` (`UWB-UWB-ORD-8821-UWB-ITEM-4011`, Locked)
   - **Col J:** `Security Alert` (`[DO NOT PRINT PASSCODE ON LABEL]`, System Locked)
   - **Col K:** `Label Printed?` (Boolean, Locked)
   - **Col L:** `[🏷️ Print Package Label]` **(Action Cell - Highlighted Brand Red)**
2. **Sidebar (`Sidebar_LabelPrint.html`):**
   - Formats label for thermal printer, generates QR/barcode, masks phone number.
3. **Action Cell (Col L):**
   - High-contrast brand red badge: `[🏷️ Print Package Label]`.
4. **Mass Action with Checkbox:**
   - `[Batch Print Selected Labels]`, `[Mark Selected as Packed & Staged]`.
5. **Loading Sheet (`PACKING-QUEUE-LOADING`):**
   - Real-time packing queue sorted by priority and order age.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Order Item ID` (**Mandatory ID Column** — always uses the existing Order Item ID; never assigns new IDs to preserve chain of custody)
     - **Col C:** `Customer Invoice Ref`
     - **Col D:** `Packing Bay Station`
     - **Col E:** `Packer Staff ID`
     - **Col F:** `Label Serial Number`
     - **Col G:** `Weight Verified (kg)`
   - **Header Actions:** `[🚀 Release Ready Lots to Staging]`, `[📦 Archive Packing Queue Batch]`.
6. **Config:**
   - `LABEL_PRINTER_TYPE: ZEBRA_THERMAL_4X6`, `MASK_PHONE_DIGITS: TRUE`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Print All Ready Package Labels`
   - `Open Packing Queue Loading Sheet`
   - `Archive Packing Queue Batch`
   - `Restore Archived Packing Queue Batch...`
   - `Transfer Labeled Parcels to Staging Area`

---

### 4.5 Sheet: `STAGING-AREA-SORT` & `ZBD-DISPATCH-MANIFEST`
* **Owning Stakeholder:** Warehouse Hub Manager (WHM)
* **Purpose:** Sorts parcels into destination area outlet bays and builds line-haul carrier manifests for ZBDP transport.

1. **Columns (`ZBD-DISPATCH-MANIFEST`):**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Manifest ID` (`DISP-MAN-0023`, System Locked)
   - **Col C:** `Destination Area Outlet` (e.g. `AREA-TANKE`, Locked)
   - **Col D:** `Product Category` (Locked)
   - **Col E:** `Packages Count` (Formula locked)
   - **Col F:** `Orders Count` (Formula locked)
   - **Col G:** `Assigned ZBDP Carrier` (Locked)
   - **Col H:** `Benchmark Haulage Rate (₦)` (Locked)
   - **Col I:** `Total Freight Bill (₦)` (Formula: `Packages * Rate`, Locked)
   - **Col J:** `Admin Departure Clearance?` (Boolean, Locked)
   - **Col K:** `Vehicle Loading Confirmed?` (Boolean, Locked)
   - **Col L:** `Carrier Waybill Dispatched?` (Boolean, Locked)
   - **Col M:** `[🚚 Dispatch Carrier Manifest]` **(Action Cell - Highlighted Yellow)**
2. **Sidebar (`Sidebar_CarrierDispatch.html`):**
   - Assigns ZBDP driver, verifies clearance, prints waybill, advances items to `zbd-transit`.
3. **Action Cell (Col M):**
   - High-contrast yellow badge: `[🚚 Dispatch Carrier Manifest]`.
4. **Mass Action with Checkbox:**
   - `[Batch Generate Transit Waybills]`, `[Confirm Vehicle Loading]`.
5. **Loading Sheet (`STAGING-CONSOLIDATION-LOADING`):**
   - Staging table sorting packages into outlet bays.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Manifest ID` (**Mandatory ID Column** — if consolidating into an existing manifest, uses existing `DISP-MAN-...`; if new truck, generates new Manifest ID)
     - **Col C:** `Destination Outlet`
     - **Col D:** `Order Item ID List`
     - **Col E:** `Carrier Partner ID`
     - **Col F:** `Driver Phone & Plate Number`
   - **Header Actions:** `[🚀 Generate Line-Haul Waybill]`, `[📦 Archive Dispatch Manifest]`.
6. **Config:**
   - `STAGING_DWELL_ALERT_HOURS: 6`, `REQUIRE_ADMIN_CLEARANCE: TRUE`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Consolidate Staging Bays into Manifests`
   - `Open Staging Consolidation Loading Sheet`
   - `Archive Dispatch Manifest Batch`
   - `Restore Archived Manifest Batch...`
   - `Compile Carrier Haulage Bills`

---

## 5. Domain C: FRM Field Operations Specification (Field Regional Marketing / Outlet Agents)

### 5.1 Sheet: `SELLING-CATALOG-VIEW`
* **Owning Stakeholder:** Field Regional Marketing (FRM)
* **Purpose:** Read-only mirror of approved customer prices for field agent sales reference.

1. **Columns:**
   - **Col A:** `Variant ID` (Read-only mirror, Locked)
   - **Col B:** `Product Title` (Locked)
   - **Col C:** `Category` (Locked)
   - **Col D:** `Approved Selling Price (₦)` (Locked)
   - **Col E:** `MOQ` (Locked)
   - **Col F:** `Unit Description` (Locked)
   - **Col G:** `Active State` (Locked)
2. **Sidebar:** Read-only product specification preview.
3. **Action Cell:** None (Reference catalog).
4. **Mass Action with Checkbox:** None.
5. **Loading Sheet:** Auto-synced from `SELLING-BASE-PRICE-SCHEDULE`.
6. **Config:** `SYNC_INTERVAL_MINS: 15`.
7. **Menu Items (`UwanBuy FRM` Menu):** `Refresh Commercial Catalog`.

---

### 5.2 Sheet: `AREA-CUSTOMERS`
* **Owning Stakeholder:** Field Regional Marketing (FRM)
* **Purpose:** Registry of local area consumers and wholesale buyers.

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Customer ID` (`CUST-00108`, System Locked)
   - **Col C:** `Full Name` (Locked)
   - **Col D:** `Phone Number` (Locked)
   - **Col E:** `Assigned Outlet` (`AREA-TANKE`, Locked)
   - **Col F:** `Delivery Street Address` (Locked)
   - **Col G:** `Customer Type` (`Retail`, `Community Bulk Club`, `Food Service`, Locked)
   - **Col H:** `Lifetime Orders Count` (Formula locked)
   - **Col I:** `[👤 Edit Customer Profile]` **(Action Cell - Highlighted Sky Blue)**
2. **Sidebar (`Sidebar_CustomerEnrollment.html`):**
   - Form to enroll walk-in customers, capture phone, home address, and buying preferences.
3. **Action Cell (Col I):**
   - High-contrast sky blue badge: `[👤 Edit Customer Profile]`.
4. **Mass Action with Checkbox:**
   - `[Send Community SMS Broadcast]`, `[Tag Selected as Wholesale]`.
5. **Loading Sheet (`CUSTOMER-ENROLLMENT-LOADING`):**
   - Staging tab for field customer sign-up paper forms and street mobilization lists.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Customer ID` (**Mandatory ID Column** — if customer already registered and updating profile/address, uses existing `CUST-...`; if new walk-in, auto-generates new ID)
     - **Col C:** `Full Name`
     - **Col D:** `Phone Number`
     - **Col E:** `Street Address`
     - **Col F:** `Customer Segment`
   - **Header Actions:** `[🚀 Enroll & Sync Customers]`, `[📦 Archive Field Signup List]`.
6. **Config:**
   - `DEFAULT_AREA_OUTLET: AREA-TANKE`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Enroll New Customer (Sidebar)`
   - `Open Customer Enrollment Loading Sheet`
   - `Archive Field Signup Roster`
   - `Restore Archived Signup Roster...`

---

### 5.3 Sheet: `PROXY-SPOT-ORDERS` (Offline Field Order Intake)
* **Owning Stakeholder:** Field Regional Marketing (FRM)
* **Purpose:** Walk-in order intake terminal for offline customers placing orders at regional outlets.

1. **Columns:**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Proxy Order Line ID` (`PORD-00341`, System Locked)
   - **Col C:** `Invoice Ref` (`AB-20261023-0341`, Locked)
   - **Col D:** `Customer ID` & `Name` (Locked)
   - **Col E:** `Variant ID Ordered` (Locked)
   - **Col F:** `Unit Price (₦)` (Formula locked from Catalog)
   - **Col G:** `Quantity Ordered` (Locked)
   - **Col H:** `Line Total Amount (₦)` (Formula: `Price * Qty`, Locked)
   - **Col I:** `Fulfillment Preference` (`Self-Pickup at Outlet` vs `Doorstep`, Locked)
   - **Col J:** `Payment Status` (`Cash Collected at Outlet`, `Unpaid`, Locked)
   - **Col K:** `Pushed to Central Backend?` (Boolean, Locked)
   - **Col L:** `[🛒 Take New Order]` **(Action Cell - Highlighted Emerald)**
2. **Sidebar (`Sidebar_PosTerminal.html`):**
   - Responsive POS terminal: select customer, search catalog items, enforce MOQ, calculate totals, record cash received.
3. **Action Cell (Col L):**
   - High-contrast emerald badge: `[🛒 Take New Order]`.
4. **Mass Action with Checkbox:**
   - `[Batch Push Selected Orders to Central Admin]`.
5. **Loading Sheet (`BULK-ORDERS-LOADING`):**
   - Batch intake sheet for community bulk purchases.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Proxy Order Line ID` (**Mandatory ID Column** — if re-entering or adjusting an existing order, preserves original `PORD-...`; if new, assigns new ID)
     - **Col C:** `Customer ID` (Existing Customer ID)
     - **Col D:** `Variant ID` (Existing Variant ID)
     - **Col E:** `Quantity`
     - **Col F:** `Amount Collected (₦)`
     - **Col G:** `Fulfillment Type`
   - **Header Actions:** `[🚀 Ingest Orders into Central Stream]`, `[📦 Archive Bulk Order Sheet]`.
6. **Config:**
   - `SYNC_MODE: INSTANT`, `OUTLET_CODE: AREA-TANKE`.
7. **Menu Items:**
   - `Open Walk-In POS Terminal`
   - `Open Bulk Orders Loading Sheet`
   - `Archive Bulk Orders Batch`
   - `Restore Archived Bulk Orders Batch...`
   - `Transmit Un-pushed Orders to Backend`

---

### 5.4 Sheet: `FIELD-PAYMENTS-REPORT` & `BATCH-REMITTANCES`
* **Owning Stakeholder:** Field Regional Marketing (FRM)
* **Purpose:** Cash ledger for offline receipts and teller deposit bundling for bank remittance.

1. **Columns (`FIELD-PAYMENTS-REPORT`):**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Receipt ID` (`RCPT-00412`, System Locked)
   - **Col C:** `Invoice Ref` (Locked)
   - **Col D:** `Customer Name` (Locked)
   - **Col E:** `Collection Timestamp` (Locked)
   - **Col F:** `Payment Mode` (`Cash`, `Direct Bank Transfer`, `POS`, Locked)
   - **Col G:** `Amount Collected (₦)` (Locked)
   - **Col H:** `Remittance State` (`Unremitted Cash-on-Hand`, `Batched for Remittance`, `Remitted & Cleared`, Locked)
   - **Col I:** `Linked Batch Remittance ID` (Locked)
   - **Col J:** `[💰 Batch for Bank Deposit]` **(Action Cell - Highlighted Amber)**
2. **Sidebar (`Sidebar_RemittanceBuilder.html`):**
   - Bundles unremitted cash receipts, calculates total deposit amount, prompts for bank teller reference and slip upload.
3. **Action Cell (Col J):**
   - High-contrast amber badge: `[💰 Batch for Bank Deposit]`.
4. **Mass Action with Checkbox:**
   - `[Bundle Selected into New Remittance Slip]`.
5. **Loading Sheet (`REMITTANCE-PREP-LOADING`):**
   - Staging table reconciling physical cash-in-drawer against recorded receipts.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Batch Remittance ID` (**Mandatory ID Column** — if adding receipts to an existing teller bundle, uses existing `REMIT-...`; if new deposit, assigns new Batch ID)
     - **Col C:** `Receipt ID List` (Comma-separated existing `RCPT-...` IDs)
     - **Col D:** `Total Cash Counted (₦)`
     - **Col E:** `Bank Teller Number`
     - **Col F:** `Deposit Slip Photo URL`
   - **Header Actions:** `[🚀 Submit Remittance Bundle to Admin]`, `[📦 Archive Remittance Package]`.
6. **Config:**
   - `DESIGNATED_COMPANY_BANK: GTBANK_ACC_0129384756`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Build Batch Bank Remittance Package`
   - `Open Remittance Prep Loading Sheet`
   - `Archive Remittance Package`
   - `Restore Archived Remittance Package...`
   - `Audit Unremitted Cash-on-Hand`

---

### 5.5 Sheet: `AREA-INBOUND-RECEIVING` & `CUSTOMER-DELIVERY-HANDOVER`
* **Owning Stakeholder:** Field Regional Marketing (FRM)
* **Purpose:** Reception of line-haul carrier shipments at the outlet and final delivery handover to customer via secret OTP authentication.

1. **Columns (`CUSTOMER-DELIVERY-HANDOVER`):**
   - **Col A:** `[ ]` Select Checkbox (Boolean)
   - **Col B:** `Parcel Barcode Ref` (`UWB-UWB-ORD-8821-UWB-ITEM-4011`, Locked)
   - **Col C:** `Customer Full Name` (Locked)
   - **Col D:** `Customer Phone` (Locked)
   - **Col E:** `Item Description & Qty` (Locked)
   - **Col F:** `Delivery Channel` (`Outlet Pickup` vs `Doorstep`, Locked)
   - **Col G:** `Entered Secret OTP` (Numeric string, Locked)
   - **Col H:** `OTP Authentication Result` (`VALIDATED` vs `PENDING_AUTH`, Formula locked)
   - **Col I:** `Delivery Lifecycle State` (`area-land`, `area-cleared`, `Handed Over & Completed`, Locked)
   - **Col J:** `Proof of Delivery Link` (Photo/signature URL, Locked)
   - **Col K:** `Handover Timestamp` (Locked)
   - **Col L:** `[🔐 Authenticate Handover OTP]` **(Action Cell - Highlighted Brand Green)**
2. **Sidebar (`Sidebar_HandoverOTP.html`):**
   - Secure customer authentication modal:
     - Prompts FRM agent to enter the 6-digit numeric OTP provided by customer.
     - Validates against central customer secret stored in database.
     - Unlocks handover completion only upon valid match.
     - Captures recipient signature or photo proof of delivery.
3. **Action Cell (Col L):**
   - High-contrast brand green badge: `[🔐 Authenticate Handover OTP]`.
4. **Mass Action with Checkbox:**
   - `[Batch Confirm Inbound Cargo Arrival (area-land)]`.
5. **Loading Sheet (`PARCEL-INBOUND-LOADING`):**
   - Barcode scanning staging table for receiving shipments from ZBDP trucks.
   - **Columns:**
     - **Col A:** `[ ]` Select Checkbox
     - **Col B:** `Parcel Barcode Ref` (**Mandatory ID Column** — always uses the existing parcel barcode scanned from the package label; never assigns new IDs)
     - **Col C:** `Waybill Manifest ID`
     - **Col D:** `Carrier Partner ID`
     - **Col E:** `Condition On Arrival` (`INTACT`, `DAMAGED_CARTON`, `SEAL_BROKEN`)
     - **Col F:** `Inbound Receiving Timestamp`
   - **Header Actions:** `[🚀 Mark All as Landed at Outlet (area-land)]`, `[📦 Archive Inbound Cargo Scan]`.
6. **Config:**
   - `LMD_DWELL_ALERT_HOURS: 24`, `REQUIRE_OTP_FOR_HANDOVER: TRUE`, `SYNC_MODE: INSTANT`.
7. **Menu Items:**
   - `Scan Inbound Carrier Shipment`
   - `Open Parcel Inbound Loading Sheet`
   - `Archive Inbound Cargo Scan`
   - `Restore Archived Cargo Scan...`
   - `Launch Handover OTP Verification Terminal`

---

## 6. Google Apps Script Architecture & Library Integration

The Google Workspace solution relies on modular Apps Script engines deployed to the Google Workspace projects:

### 6.1 `AB_Config.gs`
Defines operational constants, loading sheet mappings, sync modes, and role template IDs:
- `SYNC_MODES`: `INSTANT` (synchronous Webhook/REST) vs `DEFERRED` (buffered with sync queue).
- `LOADING_SHEET_MAP`: Maps master registers to companion staging sheets.
- `ROLE_TEMPLATES`: Template IDs for dynamic workbook generation per staff member.

### 6.2 `AB_Core.gs`
Business logic execution engine:
- `abEvaluateShowProducts()`: Evaluates active auction waves in `WAVE-SCHEDULE` and dynamically projects variants into `SHOW-PRODUCTS-REGISTER`.
- `abGenerateStaffWorkbook()`: Automatically clones role templates from `STAFF-REGISTRY`, creates personal configs, and grants isolated drive permissions.
- `abValidateLoadingSheet(loadingSheetType, rows)`: Validates companion loading sheet rows. Preserves existing row IDs if present; generates/assigns a new unique ID only if ID is missing.
- `abArchiveLoadingBatch(loadingSheetType, rows)`: Archives the current staging batch to the archive vault and clears the staging sheet for the next batch.
- `abRestoreLoadingBatch(archiveBatchId)`: Re-hydrates an archived batch back into the active loading sheet for re-execution or audit.
- `abProcessSyncQueue()`: Dispatches immediate HTTP requests or buffers rows into `SYNC_QUEUE`.

### 6.3 `AB_UI_Engine.gs`
UI presentation engine:
- `onEdit(e)`: Detects Column A checkbox selection on locked sheets and opens HTML sidebars.
- `onOpen()`: Builds custom stakeholder menus (`UwanBuy Admin`, `UwanBuy WHM`, `UwanBuy FRM`) with archiving and restore dialogs.
- `protectSheetRanges()`: Locks all rows/columns while allowing elevated script execution.
- Action cell click listeners and HTML sidebars (`Sidebar_ProductEdit`, `Sidebar_PriceCalculator`, `Sidebar_SbaDispatch`, `Sidebar_QAReceiving`, `Sidebar_HandoverOTP`).
