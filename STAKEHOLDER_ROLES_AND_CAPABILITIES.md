# AreaBazaar & UwanBuy: Comprehensive Stakeholder Capabilities & Operating Matrix

> **Core Operating Principle:**  
> The warehouse holds **no standing inventory**. Items are sourced dynamically and strictly according to confirmed, approved customer orders. "Stock" in the system represents sellable capacity committed per auction session/schedule. Procurement from SBAs occurs only after order resolution.

---

## 1. Senior Admin (sADM) & Admin (ADM)

The administrative layer governs catalog integrity, pricing formulas, auction wave lifecycles, treasury reconciliation, partner approvals, and cross-departmental operations.

### Products & Variants Management
- **Products Loading:** Bulk CSV ingestion of base products with image asset mapping (`assets/prod_photo_upload/`).
- **Variants Loading:** Bulk ingestion and manual addition of derived product variants linked to parent base products.
- **Product Register (`PRODUCT-REGISTER`):** View, create, edit, and deactivate Base Products; assign 3-level categories (`category` $\rightarrow$ `subCategory` $\rightarrow$ `subSubCategory`), brands, media galleries, descriptions, and attribute dimensions.
- **Variants Register (`VARIANT-REGISTER`):** Manage derived variants, SKUs, pack sizes, quantity values, quantity units (e.g. `kg`, `pcs`, `pack`), and variant-specific attributes (color, size, storage, capacity).
- **Show-Products Register (`SHOW-PRODUCTS-REGISTER`):** Configure storefront display rules, hero spotlight items, category featured items, and trending recommendations.
- **Stock Schedule (`STOCK-SCHEDULE`):** Set and commit sellable capacity quotas per product/variant per auction session (*capacity commitment, not physically held inventory*).
- **SBA Price Schedule (`SBA-PRICE-SCHEDULE`):** Define, update, and approve target benchmark purchasing unit prices negotiated with Strategic Buying Agents.
- **Handling Cost Schedule (`HANDLING-COST`):** Configure granular handling cost components per sellable unit:
  - Transport allowance
  - Washing & cleaning
  - Splitting & sorting
  - Bagging & packaging
  - Labelling & tagging
  - Loading & handling labor
  - Facility overhead
- **Selling Base Price Schedule (`SELLING-BASE-PRICE-SCHEDULE`):**
  - Calculate unit cost floor:  
    $$\text{Cost Floor} = \text{SBA Benchmark Price} + \text{Handling Cost Total} + \text{Transport Benchmark}$$
  - Apply target margin percentage (default 15%) and rounding rules (nearest ₦50 / 5,000 kobo).
  - Enforce price guardrail: selling price can never fall below the calculated cost floor.
  - Approve and publish active selling prices to storefront channels (Senior Admin exclusive).
- **Product Sourcing Schedule (`PRODUCT-SOURCING-SCHEDULE`):** Map products to approved SBAs per warehouse zone, define priority ranking (1, 2, 3), daily bulk capacity limits, bulk unit sizes, and target local supply markets (e.g., Ipata, Mandate, Ago, Offa).

### Auction Sessions & Waves Engine
- **Auction Session Lifecycle:** Create, configure, schedule, pause, resume, and conclude auction sessions linked to specific Warehouse Zones (WHZ).
- **Pre-Flight Readiness Verification:** Complete pre-launch checklist auditing zone capacity commitment, SBA sourcing availability, carrier readiness, and benchmark locks.
- **Wave Architecture Configuration:** Configure and control the 5 core deal formats:
  - *Price Wave:* Scheduled price reductions with checkout price-locking.
  - *Stock Cap:* Volume-limited batch allocations with group discount thresholds.
  - *Time Cap:* Strict countdown flash deals.
  - *Flat-Rate Pool:* Standardized subsidized community pool rate.
  - *Bid & Win:* Competitive price deal claims.
- **Live Wave Monitoring:** Real-time surveillance of active wave countdowns, subscriber counts, and manual wave extensions or terminations.

### Orders & Fulfillment Oversight
- **Global Orders Control:** Unified view of orders from web storefronts, FRM field agent proxy orders, and institutional orders.
- **Order-Item Approval:** Review and approve incoming customer order items, transitioning status from `placed` to `requested`, which triggers warehouse collation.
- **Fulfillment Stage Overrides:** Elevated Senior Admin authority to manually override item lifecycle stages, re-route destination areas, or resolve hung allocations with mandatory audit rationale logging.
- **Cart Expiration & Abandonment Policies:** Enforce automatic cart eviction rules for expired auction reservations.

### Shipping & Logistics Dispatch Oversight
- **SBA Acquisition Authorization:** Review and approve bulk procurement assignments suggested by WHM, authorizing partner purchase budgets.
- **Hanging & QA-Risk Resolution:** Intervene in quality-flagged acquisitions (`QArisk`, `QArejected`), approve partial intakes, or mandate supplier replacement.
- **ZBD Dispatch Clearance:** Inspect transporter cargo manifests, verify transport billing calculations against benchmarks, and grant elevated security clearance for vehicle departure.
- **Logistics Surveillance:** Track inter-zone transit progress from Central Warehouse to Area Outlets.

### Payments, Treasury & Reconciliation
- **Automated Bank Sync:** Ingest and monitor live bank credit notifications (via Gmail scraping / bank webhooks).
- **Customer Payment Matching:** Match customer transaction receipts and bank transfer references against pending orders to reconcile and release orders for picking.
- **Agent (FRM) Remittance Audit:** Audit and verify bulk cash/transfer remittances submitted by Field Regional Marketing agents, cross-referencing bank teller references and deposit slips.
- **Partner Payout Approvals (Senior Admin exclusive):** Authorize compiled bills and disbursements for:
  - SBA procurement reimbursements
  - ZBDP transportation freight fees
  - FRM sales agent commission payouts
- **Orphaned & Disputed Transaction Resolution:** Investigate unmatched bank alerts or disputed customer payments.

### Operations Surveillance & Monitors (Real-Time Dwell Alerts)
- **`MON-WHM`:** Monitor order-item processing within the warehouse (intake $\rightarrow$ QA $\rightarrow$ pack $\rightarrow$ label).
- **`MON-STAGING`:** Monitor sorted cargo packages dwelling in the staging bay; triggers alert when dwell time exceeds **6 hours**.
- **`MON-ZBD`:** Monitor freight batches in transit with ZBDP carriers.
- **`MON-LMD`:** Monitor packages at Area Outlets awaiting last-mile collection/dispatch; triggers alert when dwell time exceeds **24 hours**.
- **`MON-DELIVERY`:** Monitor completed customer handovers, delivery confirmations, and dispute resolution.

### Entity & Governance Management
- **Area Outlets (Coverage Grid):** Manage geographical coverage zones, regional pickup points (e.g., Tanke, Fate, Sanrab, Offa Garage), and outlet operating hours.
- **Warehouse Zones (WHZ):** Configure warehouse facilities, zone boundaries, storage capacity limits, and packing stations.
- **Delivery Routes & Benchmarks:** Define standard transit routes, benchmark freight costs per unit, and transport billing algorithms.
- **Customer Registry:** Audit customer accounts, purchase frequencies, credit limits, and delivery verification passcodes.
- **Staff Registry:** Enroll staff, assign role profiles (`SeniorAdmin`, `Admin`, `WHM`, `Sales`), update privileges, and manage security credentials.
- **Partners Registry:** Review applications, execute KYC verification, approve SBA buying agents and ZBDP carriers, configure commission rates, and manage partner suspensions.
- **Query Hub:** Global ticketing system across all operations; assign queries, establish priorities, track SLA resolution times, and close resolved issues.
- **Security Audit & Compliance:** Immutable system log recording all elevated authorizations, password re-authentications, and administrative overrides.

---

## 2. WHM (Warehouse Hub Management / Warehouse Operations)

The Warehouse Hub Manager executes order fulfillment, coordinates dynamic sourcing, conducts quality assurance, packs and labels orders, stages packages by route, and dispatches cargo to transport carriers.

> **Key Rule:** The warehouse does NOT stock ground inventory. When approved customer orders arrive, WHM resolves demand into bulk procurement batches.

### Order Resolution & Demand Aggregation
- **Pull Approved Order Items:** Fetch order items approved by Admin with status `requested`.
- **Order-Items Resolution (`abResolveOrders`):** Aggregate disparate customer line items into total base product demand per warehouse zone:
  $$\text{Total Base Quantity} = \sum (\text{Order Item Quantity} \times \text{Variant Quantity Value})$$
- **Demand Prioritization:** Automatically group demand lines by category, prioritizing urgent orders and flagging pack size or unit mismatches.
- **Generate Sourcing Demand Manifest (`SOURCING-DEMAND`):** Create consolidated demand lists ready for supplier assignment.

### SBA Sourcing Management
- **SBA Batch Allocation (`abSuggestSbaBatches`):**
  - Read active `PRODUCT-SOURCING-SCHEDULE` and `SBA-PRICE-SCHEDULE`.
  - Automatically split product demand across approved SBAs based on priority (1, 2, 3), daily bulk capacity, and target market.
  - Flag capacity deficits or unassigned sourcing shortfalls for administrative resolution.
- **Assign SBA Batches (`SBA-BATCHES`):** Issue official acquisition tickets to chosen SBAs with target volume, benchmark price, and expected delivery window.
- **Monitor SBA Sourcing:** Track SBA progress in real time (Pending $\rightarrow$ Accepted $\rightarrow$ Cargo Dispatched $\rightarrow$ Withdrawn/Rejected).

### Inbound Intake & Quality Assurance (QA)
- **Cargo Intake Receiving:** Receive physical deliveries from SBAs at warehouse loading bays.
- **Quality Assurance Inspection (`INTAKE-QA` / `qa.html`):** Execute strict inbound product inspection across categories:
  - *Foodstuff/Groceries:* Freshness, moisture level, foreign matter, firm condition, weight verification.
  - *Gadgets/Tech:* Sealed packaging, model accuracy, serial number recording, physical condition.
  - *Fashion:* Fabric quality, stitching integrity, correct sizing and color tags.
  - *Home Essentials:* Part completeness, operational testing, absence of transit damage.
- **Record QA Outcome:**
  - `QApassed`: Full acceptance; proceeds immediately to packing.
  - `QArisk`: Partial acceptance or minor defects; flagged for Admin risk approval.
  - `QArejected`: Rejected goods; documented with photographic evidence and inspector notes; returned to SBA.
- **Calculate Sourcing Variance:**
  - Compute variance between actual cost and benchmark budget:
    $$\text{Variance \%} = \frac{\text{Actual Cost} - \text{Benchmark Budget}}{\text{Benchmark Budget}} \times 100$$
  - Trigger cost variance alert if deviation exceeds **10%**.

### Lot Packing & Allocation
- **Pack Allocation (`abAllocateToOrderItems` / `PACK-ALLOCATION`):** Allocate accepted QA-passed goods to individual customer order items:
  - Strict rule: Urgent items allocated first, followed by oldest orders (FIFO).
  - No partial order items: items are allocated only when 100% of required quantity is covered.
- **Physical Packing (`handling.html`):** Assemble goods into customer order packages following handling protocols (thermal insulation, bubble wrap, sturdy cartons, branded poly bags).
- **Package Labeling (`LABELS`):**
  - Generate and print standardized tamper-evident package labels: `UWB-{orderId}-{orderItemId}`.
  - Display destination Area Outlet, customer name, masked customer phone (`0803****123`), and urgent tags.
  - **Security Rule:** The delivery confirmation passcode/OTP is **never** printed on labels.
- **Lifecycle Status Updates:** Advance items: `requested` $\rightarrow$ `supplied` $\rightarrow$ `QA-passed` $\rightarrow$ `packed` $\rightarrow$ `labelled`.

### Staging Area-Sort
- **Area-Based Sorting (`abAreaSort` / `STAGING-AREA-SORT` / `collation.html`):** Sort labeled packages into designated physical staging bays according to destination Area Outlets (e.g. Tanke Bay, Fate Bay, Sanrab Bay, Offa Garage Bay).
- **Consolidation Manifests:** Group all customer packages belonging to the same geographic drop point into consolidated transport lots.
- **Staging Dwell Monitoring:** Track dwell times (`staging-land` $\rightarrow$ `staging-cleared` $\rightarrow$ `area-sorted`) to prevent bay congestion.

### ZBD Transporter Dispatch
- **Build ZBD Assignments (`abBuildZbdAssignments` / `ZBD-ASSIGNMENTS`):**
  - Group staged packages by destination area and product.
  - Calculate total freight cost based on transport benchmark rates.
  - Assign approved Zone-Based Dispatch Partner (ZBDP) transporters.
- **Load Verification & Departure:**
  - Supervise physical loading of cargo into carrier vehicles.
  - Advance status: `loaded` $\rightarrow$ `zbd-transit`.
  - Issue carrier transit waybill with route manifest.

### Billing & Settlement Compilation
- **Compile SBA Intake Bills (`abCompileBills`):** Aggregate accepted deliveries, quantities, and cost variances into partner payment vouchers.
- **Compile ZBD Haulage Bills:** Calculate completed carrier transit trips and freight fees.
- **Submit Bills for Approval (`BILLS`):** Transmit compiled vouchers to Senior Admin for payout authorization.

### Warehouse Queries & Incident Management
- Raise internal query tickets on supplier defaults, transit damages, or packaging shortages.
- Respond to Admin and FRM queries regarding order status or fulfillment delays.

---

## 3. SBA (Strategic Buying Agent / Sourcing Partner)

Strategic Buying Agents are independent local sourcing contractors who procure bulk agricultural commodities, foodstuff, and wholesale goods directly from regional farmgates and open markets.

### Sourcing Request Intake
- **Receive Supply Acquisition Requests:** Access assigned procurement tickets via SBA Partner Portal (`sba_dashboard.php`).
- **Review Task Terms:** Inspect requested base product, required bulk volume, target benchmark price, and required warehouse delivery deadline.
- **Decision Execution:**
  - *Accept Task (`accept_task`):* Commit to fulfill the supply order within the stipulated budget and schedule.
  - *Reject Task (`reject_task`):* Decline request by specifying structured reason:
    - Product Unavailable in market
    - Logistics / Transport Issue
    - Price Mismatch (market price exceeds benchmark)
    - Quality Concern
    - Other / Operational constraint
  - Require password authentication to confirm acceptance or rejection.

### Market Procurement & Quality Verification
- **Hyperlocal Market Sourcing:** Source goods directly from designated regional trading hubs (e.g. Ipata Market, Mandate Market, Ago Market, Offa wholesale centers).
- **Commercial Negotiation:** Secure wholesale bulk rates aligned with or better than AreaBazaar benchmark targets.
- **Conformance & Grading:** Ensure commodities meet baseline specifications (e.g., moisture content, clean grains, uniform tuber sizes, unadulterated oils).

### Delivery to Warehouse Intake Bay
- **Cargo Dispatch:** Transport procured bulk commodities to the designated Warehouse Hub intake bay.
- **Mark Cargo Supplied (`supply_ready` / `supplied`):** Update portal with dispatch timestamp and driver contact details.
- **Inbound Inspection Attendance:** Be present or represented during WHM physical intake, weight verification, and QA assessment.
- **Address QA Feedback:** Provide explanations or rectify batches flagged with partial-pass (`QArisk`) or rejection (`QArejected`).

### Financial Tracking & Remittance Acknowledgment
- **Track Sourcing Reimbursements:** Monitor outstanding receivables for delivered and QA-passed supply batches.
- **Payment Remittance Tracking:** View remittance status (`Pending`, `Sent`, `Received`).
- **Remittance Acknowledgment (`remittance-ack`):** Verify bank payment credits and digitally acknowledge receipt using secure account password.

### Query Submission & Market Intelligence
- Submit operational observations and market alerts (e.g., seasonal price spikes, road closures, impending produce shortages).
- Respond to inquiries from WHM and Admin regarding supply batch variances.

---

## 4. FRM / Agent (Field Regional Marketing / Area Outlet Agent / Sales)

Field Regional Marketing agents operate Area Outlets and manage commercial field customer relationships, offline order intake, cash collections, bank remittances, and last-mile order handovers.

### Customer Management & Onboarding
- **Field Customer Enrollment:** Register offline shoppers, walk-in outlet visitors, and community buying groups.
- **Customer Account Support:** Assist customers with app navigation, order placement, and delivery preferences.
- **Assigned Regional Customers List:** Track customers within the outlet’s assigned geographical area.

### Field Commercials & Order Intake
- **Catalog & Price Inquiry (`product-listing.html`):** Access live selling base products, variants, price schedules, and minimum order quantities (MOQ).
- **Proxy Spot Order Submission (`order-submit.html`):** Place orders on behalf of offline, non-digital, or cash-paying customers:
  - Select customer identity and contact information.
  - Add base products and specific variants.
  - Specify delivery method: Self-Pickup at Area Outlet or Last-Mile Doorstep Delivery.
  - Submit order to central backend for inventory commitment and payment tracking.

### Payment Collection & Field Accounting
- **Cash & Transfer Intake:** Collect payments directly from customers for proxy orders or retail transactions.
- **Log Field Payment Receipt (`payment-report.html`):**
  - Record invoice reference, customer ID, payment mode, and amount collected.
  - System marks receipts as `Unremitted Cash-on-Hand`.
- **Payment Tracking Dashboard:** Maintain real-time accounting of all unremitted cash receipts held at the outlet.

### Bank Remittance Execution (`payment-remittance.html`)
- **Batch Remittance Compilation:** Aggregate multiple unremitted customer receipts into a single bank remittance package.
- **Bank Deposit / Transfer:** Pay aggregate collected funds into AreaBazaar’s designated bank account.
- **Submit Remittance Verification:**
  - Enter unique bank transfer narrative / teller reference number.
  - Enter total deposit amount.
  - Attach linked receipt references.
  - Transmit remittance package to Admin Finance for verification and ledger credit.

### Last-Mile Reception & Staging (Area Outlet Hub)
- **Receive Inbound Carrier Shipments:** Receive inter-zone cargo arriving via ZBDP carrier from the central warehouse.
- **Inspect Waybill Manifest:** Verify package count and physical seal integrity against the carrier waybill.
- **Advance Logistics Stage:** Mark packages as received at outlet: `area-land` $\rightarrow$ `area-cleared`.
- **Staging for Distribution:** Sort parcels into pickup shelves (for self-pickup) or dispatch bins (for last-mile bike/van couriers).

### Customer Delivery & Proof of Handover (`order-delivery.html`)
- **Order Tracking (`order-track.html`):** Monitor real-time status of orders from central warehouse sourcing to arrival at the outlet.
- **Customer Pickup Verification:**
  - Verify customer identity upon arrival at the outlet.
  - **Passcode Authentication:** Request and validate the customer’s secret delivery passcode / OTP.
  - Hand over verified package and mark order item as `dispatched` / `delivered`.
- **Doorstep Delivery Coordination:** Dispatch local couriers for home delivery; verify successful delivery upon return of validated customer OTP.
- **Disputes & Returns Management:** Log customer rejections, wrong variant claims, or damaged goods, initiating reverse logistics back to WHM.

### Field Queries & Reporting
- Raise field query tickets regarding damaged incoming goods, missing packages, or payment reconciliation discrepancies.
- Submit daily operations summaries to Regional Sales Leadership.

---

## 5. ZBDP (Zone-Based Dispatch Partner / Transport & Logistics Carrier)

Zone-Based Dispatch Partners are verified third-party haulage and logistics contractors responsible for mid-mile transport of aggregated goods from the Central Warehouse Hub to regional Area Outlets.

### Dispatch Schedule Review & Acceptance
- **View Dispatch Requests (`zbdp_dashboard.php`):** Inspect active cargo manifests assigned by WHM.
- **Manifest Details:** Review destination Area Outlet, product types, total quantity, payload weight/volume, and route benchmark fee.
- **Task Decision:**
  - *Accept Dispatch (`accepted`):* Formally accept task and schedule transport vehicle/driver.
  - *Reject Dispatch (`rejected`):* Decline dispatch with required operational note (e.g. vehicle breakdown, capacity constraint, route hazard).

### Cargo Loading & Warehouse Departure
- **Loading Bay Check-In:** Arrive at Central Warehouse Staging Bay and present driver logistics credentials.
- **Loading Supervision:** Oversee physical cargo loading into truck/van, verifying package counts against waybill.
- **Record Cargo Loaded (`mark_loaded` $\rightarrow$ `loaded`):** Confirm cargo loading in partner portal.
- **Commence Transit (`zbd-transit`):** Depart warehouse and begin scheduled inter-zone route.

### Inter-Zone Transit & Area Delivery
- **Transit Execution:** Transport cargo along designated route, observing benchmark transit windows and cargo safety protocols.
- **Area Outlet Arrival:** Arrive at destination Area Outlet (e.g., Tanke Outlet, Fate Outlet, Offa Garage Outlet).
- **Cargo Unloading & Handover:**
  - Unload packages at outlet receiving bay in coordination with the FRM Agent.
  - Conduct joint package count verification against transit manifest.
  - Obtain signed physical waybill and digital receipt acknowledgment from FRM Agent.

### Financial Tracking & Haulage Remittance
- **Trip Payout Tracking:** Monitor accrued haulage earnings, mileage fees, and outstanding freight invoices.
- **Payment Remittance Tracking:** View payment vouchers processed by Admin Finance (`Sent`, `Received`, `Acknowledged`).
- **Acknowledge Freight Payment (`remittance-ack`):** Authenticate with account password to confirm receipt of trip freight disbursements into carrier bank account.

### Logistics Queries & Exception Reporting
- Submit immediate query alerts for road emergencies, transit delays, vehicle breakdowns, or cargo tampering.
- Cooperate with WHM and Admin during transport route audits.

---

## 6. Customer (End Shopper / Retail & Bulk Buyer)

The customer initiates demand on the platform through web storefronts or offline proxy channels, driving the order-driven sourcing workflow.

### Catalog Exploration & Deal Discovery
- **Hyperlocal Catalog Browsing:** Browse base products across Groceries, Gadgets & Tech, Fashion & Style, and Home Essentials.
- **Variant Selection:** Select derived variants (pack weights, colors, sizes, storage tiers) with transparent display of unit prices, price ranges (min–max), specifications, and minimum order quantities (MOQ).
- **Auction & Bazaar Deals:** Explore interactive auction deals (Price Waves, Stock Caps, Time Caps, Flat-Rate Pools, Bid & Win) with deal terms and countdown timers revealed on variant inspection.

### Shopping Cart & Reservation Policies
- **Add to Cart with Active Countdown:** Add auction deal items to cart with live expiration timestamps. Items are held during the countdown window and automatically evicted if unpaid upon timer expiry.
- **Instant Checkout ("Pay Immediately"):** Bypass cart waiting to immediately launch server-validated payment reconciliation.
- **Proxy Ordering:** Walk in to local Area Outlets to place orders through FRM field agents.

### Checkout & Payment Execution
- **Delivery Mode Selection:** Choose between convenient self-pickup at the nearest local Area Outlet (e.g. Tanke Central, Fate, Sanrab, Offa Garage) or last-mile doorstep delivery.
- **Payment Method Selection:**
  - Direct bank transfer (upload transfer receipt and narrative).
  - Online card / gateway payment.
  - Offline cash/transfer payment to verified FRM Agent at outlet.
- **Payment Validation:** Receive order invoice reference number (`AB-XXXXXXXX`) to verify payment release.

### Order Tracking & Delivery Handover
- **Live Fulfillment Tracking:** Track order progress through the pipeline:  
  `Order Placed` $\rightarrow$ `Payment Validated` $\rightarrow$ `Sourced` $\rightarrow$ `Packed & Quality Passed` $\rightarrow$ `In Transit to Hub` $\rightarrow$ `Ready for Pickup / Out for Delivery`.
- **Receive Delivery Passcode / OTP:** Secure unique numerical delivery passcode sent via SMS/app.
- **Handover Authentication:**
  - Present delivery passcode/OTP to FRM agent or delivery rider.
  - Inspect goods upon handover.
  - Sign physical or digital proof of delivery.
- **Feedback & Disputes:** Submit feedback, query missing/damaged items, or request returns through the support desk.

---

## 7. Cross-Stakeholder Responsibility Matrix (RACI)

| Operational Stage | Senior Admin (sADM) | Admin (ADM) | WHM | SBA | FRM / Agent | ZBDP | Customer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Catalog Base & Variants Loading** | **A** | **R** | **C** | I | I | I | I |
| **SBA Benchmark Price Setting** | **A** | **R** | **C** | **C** | I | I | I |
| **Handling Cost Schedule Setup** | **A** | **R** | **C** | I | I | I | I |
| **Selling Base Price Publication** | **A** | **R** | I | I | I | I | I |
| **Auction Sessions & Waves Launch** | **A** | **R** | **C** | I | I | I | I |
| **Order Placement & Reservation** | I | I | I | I | **R** *(proxy)* | I | **R** |
| **Payment Validation & Reconciliation** | **A** | **R** | I | I | **R** *(field)* | I | **C** |
| **Order-Items Approval (`requested`)** | **A** | **R** | I | I | I | I | I |
| **Order Resolution & Demand Grouping** | **A** | **C** | **R** | I | I | I | I |
| **SBA Batch Allocation & Sourcing Dispatch**| **A** | **C** | **R** | **R** | I | I | I |
| **Wholesale Market Procurement** | I | I | **A** | **R** | I | I | I |
| **Inbound Cargo Delivery to Hub** | I | I | **A** | **R** | I | I | I |
| **Inbound Intake Quality Assurance (QA)**| **A** *(variance)*| **C** | **R** | **C** | I | I | I |
| **Pack Allocation & Package Labeling** | I | I | **R** | I | I | I | I |
| **Staging Area-Sorting (by Outlet)** | I | I | **R** | I | I | I | I |
| **ZBD Transporter Assignment & Clearance** | **A** | **R** | **R** | I | I | **C** | I |
| **Mid-Mile Transit to Area Outlet** | **A** | I | **C** | I | I | **R** | I |
| **Area Outlet Inbound Receiving** | I | I | I | I | **R** | **C** | I |
| **Field Cash Intake & Batch Remittance** | **A** | **R** | I | I | **R** | I | I |
| **Customer Handover & Passcode/OTP Verification**| I | I | I | I | **R** | I | **R** |
| **Partner Bills Compilation (SBA & ZBDP)** | I | I | **R** | I | I | I | I |
| **Partner Disbursements Authorization** | **A** | **R** | I | **C** *(ack)* | **C** *(ack)* | **C** *(ack)*| I |
| **Operations Dwell Surveillance (`MON-*`)**| **A** | **R** | **C** | I | **C** | **C** | I |

*Legend:*
- **R (Responsible):** The role that conducts the actual task.
- **A (Accountable):** The decision-maker with final approval and sign-off authority.
- **C (Consulted):** The role providing supporting data, inspections, or inputs.
- **I (Informed):** The role notified of outcomes or downstream status changes.
