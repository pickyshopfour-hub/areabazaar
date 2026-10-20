# Architecture Overview - AreaBazaar

This document outlines the high-level technical architecture for the AreaBazaar hyperlocal e-commerce platform.

## 1. System Layers

### A. Frontend Layer (The Client)
- **Framework**: Bootstrap 5 for responsive layout.
- **Core Logic**: jQuery for DOM manipulation and AJAX operations.
- **Interactive Components**:
    - **Izimodal**: Handles all user input prompts, payment confirmation windows, and "Quick View" product details.
    - **IziToast**: Real-time non-blocking notifications for cart updates, wallet alerts, and validation errors.
    - **Swiper**: Dynamic carousels for Auction product lists and SBA product displays.
- **State Management**: LocalStorage used for persisting Cart data between sessions until purchase confirmation.

### B. Application Layer (The API)
- **Backend Language**: PHP (7.4+ or 8.x).
- **Architecture**: Modified MVC structure.
- **REST API**: Serves JSON responses to the frontend. 
- **Key Modules**:
    - `AuthService`: Handles user/staff logins and `DeliveryPassCode` verification.
    - `WalletService`: Manages ledger entries, surveillance flags, and threshold checks.
    - `ProductInventoryService`: Core engine for product lifecycle (base products, variants, show products). Handles submissions from WHM/SBA with Admin approval workflows.
    - `AuctionEngine`: Manages pricing "waves" and stock reservation.
    - `LogisticsManager`: Coordinates data between WHM, ZBDp, and FRM.

### C. Data Layer (The Storage)
- **Database**: MySQL.
- **Transactional Consistency**: Use of SQL transactions for all wallet and inventory operations to prevent race conditions.

### D. Directory Structure
Target layout for `areabazaar/`:
```text
areabazaar/
  core/           # Models, Controllers, Helpers
    Models/       # User, Staff, Partner (inherited from base Model)
    Controllers/
    includes/
    helpers/
  api/            # REST API Routes
    Auth/, Wallet/, Store/, Logistics/, Partners/, Products/
  webhook/        # Appscript/Bank hooks
  admin/          # Private Admin dashboard
  public/         # Entry point (index.php)
  assets/         # Static files (images, js, css)
```

---

## 2. External Integrations (Bridge)

### Google Appscript Library Ecosystem
Operational Bridge utilizes standard libraries categorized as:
- **EmailMessageHandlers**: Urgent/non-urgent messaging, logging, and time-based queuing (max 5 per block, 5m intervals).
- **AccessControlHandlers**: Authentication and permission checks.
- **FolderOperationsHandlers**: General workspace file/folder CRUD.
- **FileExportHandlers**: Export to .PDF, .DOCX, .XLSX, .CSV, .PNG, .JSON.
- **FileContentManipulateHandlers**: Regex-based CRUD using A1 references or placeholders.
- **TemplateFilesHandlers**: Management of "Master Templates" for docs/sheets/slides.
- **BulkDataImportHandlers**: Cross-format data ingestion (JSON, CSV, Sheets -> MySQL).

### Trigger Profiles
Frequencies vary by system state (Auction vs. Normal):
- **Orders/Sync**: 5m / 30m.
- **Bank Sync/Security**: 5m / 15m.
- **Email Queue**: 5m / 15m.
- **Event-Based**: Immediate sync upon Form/Side-panel submission.

---

## 3. Core Data Flows

### A. Fulfillment Path
1. **Purchase**: Customer pays via Wallet → Order Created.
2. **Procurement**: WHM resolves bulk total → Sent to **SBA Portal**.
3. **Dispatch**: WHM assigns **ZBDp** → Transport Bill generated → Batch sent to Area Zone.
4. **Final Ack**: Agent receives → Package scanned/Acked → Customer notifies via SMS/Push → Pickup authenticated by `DeliveryPassCode`.

### B. Accounting Path
- **Wallet Credit**: Payment Reported → Admin Traces → System/Admin Credits Wallet → Customer Acknowledges (Audit Log recorded).
- **Commission**: Order Acknowledged → Ref-code lookup → FRM Wallet Credited.
- **SBA/ZBDp Dues**: Supplier Supply/Dispatch Ack → Payable Created → Senior Admin Remittance → Bank Transfer → SBA/ZBDp Acknowledge Remittance.

---

## 4. Security & Compliance
- **Wallet Auth**: All wallet transactions and status acknowledgments require the user's secret four-digit PIN or login credentials.
- **Admin Surveillance**: Manual oversight for transactions exceeding `MAX_AUTO_LIMIT`.
- **Audit Logging**: Every sensitive change (Payment, Stock, Delivery) records: `timestamp`, `user_id`, `ip_address`, `action_type`, `old_value`, `new_value`.
