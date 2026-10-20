# AreaBazaar Implementation Roadmap (Refined)

This roadmap organizes the remaining features from [dev_features.md](file:///C:/Users/MTR/.gemini/antigravity/brain/d5a3c929-981d-44ee-b405-db39012050a9/dev_features.md) into 12 granular, sequential implementation chunks to ensure thorough full-stack execution.

## Implementation Chunks

### Chunk 1: Product & Variant Definition Lifecycle
**Focus**: Core data structures and manual management for products and variants.
- **Features**: ADM-IV-02, ADM-IV-03, WHM-SP-03 to WHM-SP-05.
- **Technical Layers**: 
  - **Backend**: Product/Variant CRUD logic with parent-child auto-creation logic.
  - **Database**: Constraints for variant relationships.

### Chunk 2: High-Volume Product Ingestion (GS Bridge)
**Focus**: The Google Workspace bridge for batching ShowProducts and variants into the system.
- **Features**: ADM-SP-02, WHM-SP-06.
- **Technical Layers**:
  - **Google Workspace**: AppScript side-panels for template-based data push.
  - **Backend**: Webhook receiver for batch JSON product data.

### Chunk 3: Active Wave & Session Logic
**Focus**: The manual control layer for Auction Sessions and Price Waves.
- **Features**: ADM-AS-01 to ADM-AS-03, ADM-AS-07.
- **Technical Layers**:
  - **Backend**: Wave replacement logic and state management (Active/Replaced).
  - **Frontend**: SeniorAdmin approval dashboard for wave changes.

### Chunk 4: Wave Automation & Autoswitch
**Focus**: Automation and internal triggers for scheduled price transitions.
- **Features**: ADM-AS-04 to ADM-AS-06.
- **Technical Layers**:
  - **Automation**: System-level trigger for autoswitching based on scheduled time.
  - **Frontend**: Admin override alerts and countdown logic.

### Chunk 5: Partner Onboarding (SBA & ZBDp)
**Focus**: The recruitment and approval workflow for key business partners.
- **Features**: ADM-PT-01, ADM-PT-02, ADM-PT-05, ADM-PT-06, WHM-SP-01, WHM-SP-02.
- **Technical Layers**:
  - **Google Workspace**: Recruitment template and side-panel submission form.
  - **Backend**: Multi-stage approval status for new partners.

### Chunk 6: Essential Entity & Staff Management
**Focus**: System-wide administrative entities (WHZ, Areas, Routes, Banks).
- **Features**: ADM-EE-01 to ADM-EE-06.
- **Technical Layers**:
  - **Backend**: Management logic for operational zones and staff deployment.
  - **Frontend**: SeniorAdmin-only entity dashboards.

### Chunk 7: BankSync Automation (GS Extraction)
**Focus**: The front-end of the financial integration—extracting bank reports from Gmail.
- **Features**: ADM-RP-01, ADM-RP-02.
- **Technical Layers**:
  - **Google Workspace**: Gmail-to-Sheet extraction script with periodic triggers.
  - **Infrastructure**: Secure hook to push extracted bank reports to the PHP backend.

### Chunk 8: Reconciliation & Orphan Tracking
**Focus**: The matching engine and manual resolution of bank-to-payment discrepancies.
- **Features**: ADM-RP-03 to ADM-RP-08.
- **Technical Layers**:
  - **Backend**: Reconciliation engine matching `invoice_refindex`. 
  - **Frontend**: Manual tracking UI for "Orphan" bank transactions.

### Chunk 9: Financial Settlements (Commissions & Bills)
**Focus**: Calculation and approval of partner payouts and logistics bills.
- **Features**: ADM-RP-16 to ADM-RP-18, WHM-AS-08 to WHM-AS-12.
- **Technical Layers**:
  - **Backend**: Settlement logic for SBA acquisitions and FRM commissions.
  - **Frontend**: SeniorAdmin payout approval dashboard.

### Chunk 10: Query & Help Ticket Engine
**Focus**: The internal and external communication loop for issue resolution.
- **Features**: ADM-RP-22 to ADM-RP-24, CUS-MI-01, CUS-MI-02.
- **Technical Layers**:
  - **Backend**: Query trail logic, threaded replies, and resolution status management.
  - **Frontend**: Ticket submission and response views for Customers and Partners.

### Chunk 11: Agent Customer Service Portal
**Focus**: Tools for Agents to manage customer payments and orders directly.
- **Features**: AGT-CS-01 to AGT-CS-07.
- **Technical Layers**:
  - **Frontend**: Dedicated portal for Agents to facilitate customer "Charge Orders".
  - **Backend**: Security logic for Agent-mediated customer actions.

### Chunk 12: Non-Auction Commerce & Custom Invoicing
**Focus**: Handling arbitrary purchase lists and direct billing.
- **Features**: ADM-NA-01 to ADM-NA-03, CUS-NA-01 to CUS-NA-04.
- **Technical Layers**:
  - **Frontend**: Purchase List upload and manual invoice review.
  - **Backend**: Logic to transform arbitrary items into actionable system orders.

---

## Technical Audit Status
| Layer | Readiness | Notes |
| :--- | :--- | :--- |
| **Database** | 85% | Core tables ready; need `queries` and `bank_reports` mapping. |
| **Backend** | 70% | Established pattern; needs batch-reconciliation engine. |
| **Frontend** | 60% | Main portals structured; needs granular Partner/Agent sub-views. |
| **G-Workspace**| 40% | Base library done; needs specific sidebar & template implementations. |
