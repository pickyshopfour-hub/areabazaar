# Product Requirements Document (PRD) - AreaBazaar

**Version**: 1.0  
**Project**: Hyperlocal E-commerce for Nigeria  
**Architect**: Antigravity

---

## 1. Executive Summary
AreaBazaar is a specialized hyperlocal e-commerce platform operating in Nigeria. It leverages a "Warehouse-to-Agent" model, where bulk products are sourced from Associates (SBA), processed in regional warehouses (WHM), and delivered to regional hubs (FRM) for customer pickup. The system emphasizes wallet-based transactions, auction-based dynamic pricing, and a robust logistics chain.

## 2. User Personas
| Persona | Role Description |
| :--- | :--- |
| **Customer** | End-user who buys products during auctions using their wallet balance. |
| **FRM (Area Agent)** | Responsible for localized marketing, deposit facilitation, and last-mile pickup management. |
| **WHM (Warehouse Mgr)** | Handles inventory, bulk acquisition (SBA), packaging, labeling, and zonal dispatch (ZBDp). |
| **SBA (Source Associate)** | Suppliers of bulk products. Monitor accounting and acknowledge remittances. |
| **ZBDp (Zonal Dispatch)** | Contractors responsible for bulk transport from warehouses to regional hubs. |
| **Admin / Senior Admin** | Oversight, approval of large wallet deposits, user management, and auction setup. |

---

## 3. Product Modules

### Module 10: Customer Experience
- **Registration**: 
    - Must include a **Field-Ref-code** (FRM code). 
    - Admin can configure if the Ref-code is mandatory or optional.
    - Captures **Phone Number** as a unique identifier and basic KYC.
- **Wallet-Only Payments & Banking Sync**: 
    - Customers can only buy if their wallet balance ≥ order total.
    - **Deposit Workflow**: Customer creates `PaymentRequest` → provided with `InvoiceRefIndex` → Report Payment (`PaymentReport`) → System matches against `BankReport` via `BankSync` engine (or manual Admin reconciliation).
    - Authentication required for final wallet credit acknowledgment.
- **Auctions (Dynamic Pricing)**:
    - Driven by the **3-Tier Product System** (Base -> Variant -> Show).
    - Session-specific prices (`show_products`) change in "waves" during an active session.
    - "Add to Cart" disabled if balance < current price.
- **Delivery Acknowledgment**:
    - Customers use a **DeliveryPassCode** to authenticate ownership.
    - Final acknowledgment (ACK) via login details to confirm package quality.

### Module 11: Admin & Staff Operations
- **Auction & Inventory Management**:
    - **ProductInventoryService**: Orchestrates the submission of new products and inventory updates from WHMs/SBAs.
    - Centralized approval workflow for all product entries before they are "absorbed" into the system.
    - Setup "Price Waves" for `show_products`.
- **Automated Surveillance**:
    - System flags unusual wallet activity.
    - Flagged wallets (Customer or Partner) are suspended until authenticated.
- **Warehouse Workflow**:
    - Resolve bulk procurement totals based on `base_products` and `product_variants`.
    - Bulk acquisition resolution: Summing all daily buys for **SBA** procurement.

### Module 12: Area Agents (FRM)
- **Customer Association**: Track all customers registered via their Ref-code.
- **Partner Wallet**: Separate ledger for commissions and credit facilitation.
- **Commission System**: Automated tracking for commisionable transactions.

### Module 13: SBA & ZBDp Accounting [NEW]
- **SBA Portal**:
    - View accounts of products supplied (via `SBA_Acquisitions`).
    - Authenticate/Acknowledge due payments and bank remittances.
- **ZBDp Portal**:
    - Manage Transport Bills (recorded in `shipping` and `zbdp_logistics`).
    - Authenticate/Acknowledge bills and track bank remittances.

---

## 4. Logistics & Supply Chain
1. **Sourcing**: WHM identifies product needs → Resolves bulk total → Acquired from **SBA**.
2. **Processing**: Quality Check → Splitting → Packaging → Labeling.
3. **Dispatch**: WHM assigns **ZBDp** → Transport Bill recorded → Bulk dispatch to Zone.
4. **Last-Mile**: **FRM** receives batch → Sorts for regional customers → Customer enters **DeliveryPassCode** → Package delivered → ACK recorded.

---

## 5. Financial & Accounting Rules
- **Wallet Deposits**: Deposits > `MAX_AUTO_LIMIT` require Senior Admin approval.
- **SBA Remittances**: Automated calculation of dues based on daily acquisition totals.
- **Commissions**: Calculated and credited to FRM wallets post-delivery acknowledgment.
- **Audit Logs**: Every status change (Payment Reported → Confirmed → Acknowledged) must be time-stamped and user-stamped.

---

## 6. Technical & Frontend Requirements
- **Framework**: HTML5, Bootstrap 5, PHP (Modified MVC), MySQL.
- **Interactive UI**:
    - **Izimodal**: For all action confirmations and data entry modals.
    - **IziToast**: For feedback on button clicks (e.g., "Insufficient balance for this item").
    - **Swiper**: For product carousels and gallery displays.
- **Integrations**:
    - **Google Workspace (Sheets/Appscript)**: Projecting data for WHM operational daily use.
    - **REST API**: All frontend actions communicated via a secure API layer.
