# Google Workspace Implementation: Master Setup Prompts Suite
## AreaBazaar & UwanBuy Operations Architecture

This directory contains the modular, sequential setup prompt markdown files required to fully configure, generate, protect, and deploy the entire Google Workspace operational system for **Admin (ADM/sADM)**, **Warehouse Hub Management (WHM)**, and **Field Regional Marketing (FRM)** as defined in [GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md](file:///c:/xampp/htdocs/areabazaar/GOOGLE_WORKSPACE_IMPLEMENTATION_SPEC.md).

---

## 1. Setup Sequence & Prompt Index

Execute these prompt files in chronological sequence:

| Prompt File | Domain / Scope | Key Deliverables & Responsibilities |
| :--- | :--- | :--- |
| **[`PROMPT_01_CORE_FRAMEWORK_AND_LIBRARIES.md`](file:///c:/xampp/htdocs/areabazaar/google_workspace/setup_prompts/PROMPT_01_CORE_FRAMEWORK_AND_LIBRARIES.md)** | Core Framework | Apps Script core libraries (`AB_Config.gs`, `AB_Core.gs`, `AB_UI_Engine.gs`), sheet locking protection engine, Column A checkbox `onEdit(e)` triggers, loading sheet validator & archiver, Central DB-Sheet (`UwanBuy_DB_Master`) relay sync methods, variant specs JSON serializer/parser, and two-tier personal tab/workbook dynamic generator. |
| **[`PROMPT_02_ADM_CONTROL_CENTER_SETUP.md`](file:///c:/xampp/htdocs/areabazaar/google_workspace/setup_prompts/PROMPT_02_ADM_CONTROL_CENTER_SETUP.md)** | ADM Control Center | Master Workbook provisioning (all 9 sheets + ARCHIVE vault), locked layout, highlighted action pills, loading sheets (`PRODUCT-INGEST`, `VARIANT-INGEST`, `WAVE-SWAP`, `STOCK-CAPACITY`, `PRICE-UPDATE`, `SELLING-PRICE-OVERRIDE`, `STAFF-ONBOARDING`, `AUCTION-PREP`, `BANK-STATEMENT`), Variant Specifications JSON cell + dynamic sidebar builder, 9 HTML sidebars, `UwanBuy Admin` menu. |
| **[`PROMPT_03_WHM_OPERATIONS_COMMAND_SETUP.md`](file:///c:/xampp/htdocs/areabazaar/google_workspace/setup_prompts/PROMPT_03_WHM_OPERATIONS_COMMAND_SETUP.md)** | WHM Warehouse Ops | Personal WHM Workbooks (Tier-1 personal staff tabs: `TAB-INTAKE`, `TAB-PACK-BAY`) and Multi-Dependency Lead Workbook (`ORDER-ITEMS-INGEST`, `SOURCING-DEMAND`, `SBA-ACQUISITIONS`, `INTAKE-QA`, `PACK-ALLOCATION`, `STAGING-AREA-SORT`, `ZBD-DISPATCH-MANIFEST`, `COMPILED-BILLS`), order-driven demand resolution formulas (*zero ground standing stock*), DB-Sheet sync, thermal labels, 5 HTML sidebars, `UwanBuy WHM` menu. |
| **[`PROMPT_04_FRM_FIELD_OPERATIONS_SETUP.md`](file:///c:/xampp/htdocs/areabazaar/google_workspace/setup_prompts/PROMPT_04_FRM_FIELD_OPERATIONS_SETUP.md)** | FRM Field Ops | Personal FRM Workbooks (Tier-1 personal staff tabs: `TAB-POS`, `TAB-RUNNER`) and Multi-Dependency Lead Workbook (`SELLING-CATALOG-VIEW`, `AREA-CUSTOMERS`, `PROXY-SPOT-ORDERS`, `FIELD-PAYMENTS-REPORT`, `BATCH-REMITTANCES`, `AREA-INBOUND-RECEIVING`, `CUSTOMER-DELIVERY-HANDOVER`), offline POS terminal, cash remittance builder, 6-digit Secret OTP handover modal, DB-Sheet sync, `UwanBuy FRM` menu. |
| **[`PROMPT_05_APPSHEET_AND_INTEGRATION_SYNC.md`](file:///c:/xampp/htdocs/areabazaar/google_workspace/setup_prompts/PROMPT_05_APPSHEET_AND_INTEGRATION_SYNC.md)** | AppSheet & Backend Sync | Central DB-Sheet (`UwanBuy_DB_Master`) intermediate relay hub, AppSheet mobile views for warehouse barcode scanners & field sales, two-way sync pipelines (Workspace-originated outbound vs Database-originated inbound), webhook integrations with central REST API, automated verification tests. |

---

## 2. Core Implementation Directives

Every prompt adheres to the operational ground rules:
1. **Zero Direct Cell Typing:** Operational sheets are 100% locked.
2. **Column A Checkbox Trigger (`[ ]`):** Checking a row's checkbox opens responsive HTML sidebars/modals; scripts write back validated changes with elevated script-owner permissions.
3. **Mandatory Row Entity IDs in Loading Sheets:** Every loading sheet must preserve existing IDs or assign new ones if missing.
4. **Batch Archiving & Menu Restoration:** Loading sheets can be archived and restored via menu items.
5. **Product Variant Specifications:** Stored in a single cell as formatted JSON key-value pairs (e.g. `{"RAM":"8GB","Storage":"256GB","Color":"Black"}`), supported by dynamic visual sidebar builders.
6. **Central DB-Sheet (`UwanBuy_DB_Master`) Staging Hub:** All operational workbooks sync internally to the central DB-Sheet first. The DB-Sheet serves as the single source of truth and controlled relay to the main production backend database.
7. **Two-Way Synchronization Pipeline:**
   - **Workspace-Originated:** Products, Specs, SBA Prices, Schedules, Partners sync *outward* from sheets $\rightarrow$ DB-Sheet $\rightarrow$ main backend API.
   - **Database-Originated:** Live customer orders, bank credit alerts, invoices sync *inward* from main backend $\rightarrow$ DB-Sheet $\rightarrow$ personal staff workbooks.
8. **Strict Staff Personal Workbook Ownership:** Every staff member owns their *own personal workbook*. Multiple staff never edit or share the same file. Adding a lightweight duty adds a tab *inside that employee's personal workbook*; multi-dependency workflows receive a dedicated standalone workbook.
9. **No Ground Standing Inventory:** Warehouses hold no standing inventory; items are dynamically sourced based on customer demand.
10. **Show Products Projection:** Dynamically projected from whichever wave is active in `WAVE-SCHEDULE` (`wave_status = 'LIVE_SHOWING'`).
