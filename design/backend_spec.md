# Backend Technical Specification - AreaBazaar (Phase 2)

This document outlines the server-side architecture, data persistence layer, and API design for the AreaBazaar platform.

## 1. Directory Structure Alignment
The codebase follows a strict modular structure under the `areabazaar/` root:
- `core/Models/`: Baseline `Model.php` and its sub-classes.
- `core/Controllers/`: Logic handlers (Auth, Wallet, Store, etc.).
- `api/`: Endpoint files that consume controllers and return JSON.
- `webhook/`: Listeners for Appscript and Bank sync events.

---

## 2. Model Inheritance Logic
All entity models extend a core `Model` class to ensure consistent database interaction using PDO.

### Base Class: `Model`
- **Properties**: `db` (PDO instance), `table_name`, `primary_key`.
- **Methods**: `findAll()`, `findById($id)`, `create($data)`, `update($id, $data)`, `delete($id)`, `where($conditions)`.

### Specialized Subclasses
- **`StaffUser`**: Extends `Model`. Handles `Admin`, `SeniorAdmin`, and `WHM` logic.
- **`Customer`**: Extends `Model`. Handles `Customer` registration and `DeliveryPassCode` generation.
- **`Partner`**: Extends `Model`. Specialized for `SBA` (Suppliers), `ZBDp` (Logistics), and `Agent` (FRM). Note: Uses `partner_type` to differentiate logic.
- **`Product`**: Orchestrates the 3-tier logic (`Base` -> `Variant` -> `Show`).

---

## 3. REST API Route Map
Routes are organized by category and accessed via `/api/{category}/{action}`.

| Category | Endpoints | Description |
| :--- | :--- | :--- |
| **Auth** | `login`, `register`, `logout`, `verify-pin` | User/Staff authentication and PIN verification. |
| **Wallet** | `balance`, `report-deposit`, `transfer`, `history` | Wallet operations and banking sync entry. |
| **Products**| `list-base`, `list-variants`, `get-active-auction` | Catalog and Auction data. |
| **Store** | `add-to-cart`, `checkout`, `get-order-status` | Transactional ecommerce logic. |
| **Logistics**| `dispatch-batch`, `receive-package`, `verify-delivery` | WHM to Agent lifecycle tracking. |
| **Partners** | `get-commissions`, `ack-remittance`, `post-transport-bill` | SBA/ZBDp/Agent specific accounting. |

---

## 4. Core Service Logic

### `ProductInventoryService`
- **Approval Workflow**: SBAs/WHMs submit variants via Appscript -> Set to `PENDING_APPROVAL` in MySQL -> Admin reviews via Backend Dashboard -> Set to `ACTIVE`.
- **Inheritance**: Manages the relationship between `base_products` and `product_variants`.

### `AuctionEngine`
- **Pricing Waves**: Pulls from `PriceWaveConfig` (queued changes) -> Updates `show_products.current_price` every X minutes during an active session.
- **Stock Guard**: Atomic decrements on `stock_available` using `FOR UPDATE` locks in PDO transactions.

### `WalletService` & `SurveillanceManager`
- **Surveillance**: Flags transactions if `amount > USER_LIMIT` or `frequency > THRESHOLD`.
- **Banking Sync**: Auto-matches `payment_reports` with `bank_reports` where `InvoiceRefIndex` is found in the bank narration.

---

## 5. Security & Optimization
- **PDO Prepared Statements**: Mandatory for all queries to prevent SQL injection.
- **Input Sanitization**: Global helper filtering all `$_POST`/`$_GET` data.
- **Audit Logging**: `AuditLogger::log($userId, $action, $oldData, $newData)` called in all `update`/`delete` model methods.
