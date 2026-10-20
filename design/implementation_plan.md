# Implementation Plan - AreaBazaar Planning Documents Completion

Complete the architectural design and product requirements for AreaBazaar, a hyperlocal e-commerce platform in Nigeria.

## Proposed Documents

### 1. Comprehensive PRD [NEW]
A consolidated and expanded Product Requirements Document that covers:
- **User Personas**: Customer, FRM (Area Agent), WHM (Warehouse Manager), Admin, Senior Admin, SBA (Source Business Associate), ZBDp (Zonal Bulk Dispatch contractor).
- **Module 10 (Customer)**: Refined Auction logic, Wallet management, and Delivery Acknowledgment. Included **Ref-code logic** during registration (mandatory/optional per Admin config) for commission tracking.
- **Module 11 (Admin/Staff)**: Detailed Warehouse workflows, Pricing Waves for Auctions, and Automated Surveillance. Added **ZBDp management** and transport billing for WHM.
- **Module 12 (Area Agent)**: Commission tracking, Customer facilitation, and Pickup management.
- **Module 13 (SBA & ZBDp Interface) [NEW]**: 
    - **SBA**: Interfaces to track daily bulk supply, authenticate/acknowledge due payments, and monitor/acknowledge bank remittances.
    - **ZBDp**: Interfaces to authenticate/acknowledge Transport Bills, track pending payments, and monitor/acknowledge bank remittances.
- **New Section: Logistics & Supply Chain**: Bulk dispatch tracking using ZBDp and last-mile pickup via Area Agents.
- **New Section: Financial Rules**: Commission calculation (linked to Ref-codes), SBA payout automation, Wallet threshold verification, and Audit logs.

### 2. Architecture Overview [NEW]
A technical document describing:
- **System Layers**: Frontend (Bootstrap/jQuery + Plugins), Backend (PHP/MySQL REST API with specific `areabazaar/` directory structure), External (Google Workspace).
- **Directory Structure**: Adherence to the `core/`, `api/`, `public/`, `webhook/` layout.
- **Model Inheritance**: Use of a baseline `Model` class inherited by `Staff`, `Customer`, and `Partner` (SBA, ZBDp, Agent) subclasses.
- **Appscript Library Ecosystem**: Structured libraries for Email (throttled/queued), File Operations (Permissions, Exports), Marker-based Content Manipulation (Docs/Sheets), and Bulk Data (Auto-projection, Sorting).
- **Trigger Profiles**: Variable frequencies for Auctions (5m) vs. Normal periods (15-30m) for Sync, Surveillance, and Email delivery.

### 3. Data Model / Schema Design [NEW]
A detailed MySQL schema design including:
- **Separated User Tables**: `customers` vs. `staff_users` vs. `partners` with KYC integration.
- **Appscript UI Integration**: Use of side-panel data-entry interfaces for operational partners (WHM, SBA, ZBDp).
- **Three-Tier Product System**: `base_products`, `product_variants`, and `show_products`.
- **Banking Sync Engine**: Full ledger matching logic for `payment_requests` and `bank_reports`.
- Relationship mapping (ERD description).

### 4. Prompt Engineering Strategy [NEW]
Implementation will follow a **4-Phase Optimized Prompt Chain**:
1. **Frontend Architecture & UI Logic**
2. **Backend API & Data Persistence**
3. **Google Appscript Library Development**
4. **Google Workspace Operational Bridge**
This ensures deep concentration on modular code, model inheritance, and precise operational triggers.

## Verification Plan

### Manual Verification
- Review by the user of the `areabazaar/` folder structure alignment.
- Simulation of the Appscript Email Queuing logic (Throttling check).
- Logic walkthrough of the `Model` class inheritance and User/Partner segregation.

### Consistency Check
- Cross-reference the PRD modules with the Data Model to ensure all features have corresponding data storage capacity.
- Ensure the Architecture supports the "Wallet-only" payment constraint.
