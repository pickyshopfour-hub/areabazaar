# AreaBazaar & UwanBUY: Comprehensive Stakeholder Components & Departmental Blueprint

> **System Overview:**  
> This document maps all functional components across each platform stakeholder role, based on an audit of the codebase (`public/`, `uwanbuy/admin/`, `whm/`, `frm/`, and backend core).
> 
> - **`@@@@@@@@@@@@@@@@@@@@@`** signifies each **Stakeholder Role / Domain Boundary**.
> - **`@@`** signifies each **Department / Operational Module** under that role.
> - **`-`** lists individual **Components, Tools, and Workflows** under each department.

---

ADM & sADM
@@@@@@@@@@@@@@@@@@@@@

@@ Products & Variants
  - Products Loading (Bulk CSV/Excel ingestion with category mapping & asset linking)
  - Variants Loading (Bulk variant ingestion linked to parent Base Products)
  - Product Register (Base Product CRUD, 3-level categories, brands, specifications)
  - Variants Register (SKU generation, pack sizes, quantity values, unit types: kg/pcs/pack)
  - Show-Products Register (Storefront visibility, hero spotlights, category featured items)
  - Stock Schedule (Sellable capacity quotas committed per auction session/schedule)
  - SBA Price Schedule (Target benchmark purchasing unit prices negotiated with SBAs)
  - Handling Cost (Cost schedule per unit: transport, wash, sort, bag, label, labor, overhead)
  - Selling Base Price Schedule (Cost floor calculation + target margin 15% + rounding rules + price guardrails)
  - Product Sourcing Schedule (SBA allocation mapping, priority tiers 1-2-3, daily capacity, target markets)
  - Batch Action Operations (Multi-select price adjust, stock status toggle, publish/unpublish)

@@ Auction Sessions & Waves
  - Auction Session Management (Session lifecycle: create, schedule, open, pause, close per WHZ)
  - Wave Product Management (Configure 5 deal formats: Price Wave, Stock Cap, Time Cap, Flat-Rate Pool, Bid & Win)
  - Show Products Loading (Adopting prepared product-variant lots into active broadcast rosters)
  - Wave Curve Engine (Automatic step-down price curve generator and custom interval builder)
  - Real-Time Auction Controller (Live broadcast stage, active lot controls, force step-down, pause/resume)
  - MOQ & Format Guardrails (Enforce minimum order quantities and validation rules during customer checkout)
  - Live Event Stream & Diagnostic Log (Surveillance of live viewer counts, bid feeds, step transitions)

@@ Orders
  - Orders Management (Unified view: web storefront, FRM field agent proxy, and institutional orders)
  - Order-Item Approval Desk (Review and approve incoming order lines: `placed` -> `requested`)
  - Order Allocation & Fulfillment Overrides (Senior Admin manual overrides for re-routing and hung orders)
  - Incoming Customer Shopping Lists Desk (Direct farmgate/wholesale pricing desk for customer-uploaded lists)
  - Cart Expiration & Reservation Eviction (Automatic cart eviction policies for expired auction reservations)

@@ Shipping
  - SBA Acquisition Authorization (Review and approve bulk procurement assignments suggested by WHM)
  - Hanging & QA-Risk Resolution Desk (Intervene in `QArisk` and `QArejected` batches; approve partial intakes)
  - ZBD Dispatch Clearance Desk (Security auth to verify transporter manifests, check billing, clear departure)
  - Inter-Zone Transit Surveillance (Monitor line-haul trucks from Central Warehouse Hub to regional Area Outlets)
  - Reverse Logistics Oversight (Manage returns, defective goods return-to-vendor, and customer refund routing)

@@ Payments
  - Bank Sync & Automated Ingestion (Sync bank credit notifications via Gmail scraping & webhooks)
  - Customer Payment Reconciliation (Dual engine: match bank transfer receipts & references to release orders)
  - Wallet Top-Up Reconciliation (Audit and approve wallet balance deposits for customer accounts)
  - Agent (FRM) Remittance Audit (Verify bulk cash/transfer batches remitted by field agents with teller slips)
  - Partner Disbursements & Payouts (Senior Admin authorization for SBA sourcing and ZBDP freight bills)
  - Payment Requests Queue (Track pending withdrawal requests, merchant credits, and refund vouchers)
  - Orphan & Disputed Transaction Resolution (Investigate and manually link unassigned bank receipts)

@@ ZBD (monitor)
  - MON-ZBD Mid-Mile Transit Tracker (Live monitoring of in-transit freight batches assigned to ZBDP carriers)
  - Transit SLA & Delay Alert (Flags line-haul shipments exceeding benchmark transit delivery windows)
  - Cargo Manifest & Bill Audit (Cross-reference loaded package counts with carrier freight billing)

@@ Staging (monitor)
  - MON-STAGING Bay Dwell Monitor (Real-time surveillance of packed orders dwelling in warehouse staging bays)
  - 6-Hour Dwell SLA Alert (Automatic alert trigger when sorted cargo dwells in staging beyond 6 hours)
  - Bay Congestion & Sorting Monitor (Visual tracking of outlet staging bays: Tanke, Fate, Sanrab, Offa Garage)

@@ LMD (monitor)
  - MON-LMD Area Outlet Parcel Dwell Monitor (Tracks parcels landed at regional Area Outlets awaiting delivery)
  - 24-Hour Outlet SLA Alert (Automatic escalation when orders remain uncollected/undelivered past 24 hours)
  - Outlet Staging Capacity & Shelf Clearance (Monitors outlet storage density and shelf turnaround speed)

@@ Delivery & Pickup (monitor)
  - MON-DELIVERY Handover Tracker (Surveillance of final customer package handovers and doorstep drop-offs)
  - Passcode / OTP Authentication Monitor (Verifies that secret customer passcodes were validated at handover)
  - Delivery Dispute & Exception Monitor (Tracks failed delivery attempts, customer rejections, and damaged parcels)

@@ Area Outlets
  - Coverage Areas Registry (Define geographic zones: Tanke, Fate, Sanrab, Offa Garage, etc.)
  - Area Outlet Facilities Management (Configure outlet locations, storage lockers, operating hours, charge officers)
  - Outlet Performance Metrics (Track throughput, footfall, pickup turnaround time, cash collection limits)

@@ Warehouse Zones
  - Warehouse Zone (WHZ) Registry (Configure central warehouse facilities, zone boundaries, and regional links)
  - Packing & Staging Station Mapping (Manage physical packing bays, QA stations, and collation hub pigeon-holes)
  - Zone Capacity Ceilings (Set maximum daily tonnage and package processing limits per warehouse hub)

@@ Delivery Routes & Benchmarks *(Suggested: previously blank)*
  - Delivery Routes Registry (Define standard transit corridors between Central WHZ and Area Outlets)
  - Route Benchmark Freight Rates (Configure standardized haulage cost per load/unit per transit corridor)
  - Transporter Haulage Billing Algorithms (Formulas calculating ZBDP pay based on weight, volume, and route)

@@ Customers
  - Customer Account Registry (Customer directory, contact details, identity verification, account status)
  - Customer Order & Purchase History (Track historical auction claims, order frequency, and lifetime spend)
  - Passcode Audit & Identity Security (Audit delivery passcode issuance, resend credentials, fraud safeguards)

@@ Staff
  - Staff Personnel Enrollment (Hire, deploy, and manage administrative, warehouse, and field staff)
  - Role-Based Access Control (Assign role profiles: SeniorAdmin, Admin, WHM, FieldAgent, FinanceAuditor)
  - Security Credential & Session Management (Manage password resets, active login sessions, access metric logs)

@@ Partners & Contractors
  - Partner Onboarding & KYC (Review applications, identity documents, and business verification)
  - SBA Partner Registry (Approve buying agents, assign local supply markets, configure commission rates)
  - ZBDP Transporter Registry (Approve carrier logistics companies, vehicle fleet types, driver verification)
  - Partner Performance & Suspension (Track SLA delivery rates, QA pass rates, issue suspensions or terminations)

@@ Query Hub & Operational Ticketing *(Suggested Extension)*
  - Global Cross-Stakeholder Query Desk (Central ticketing queue connecting Admin, WHM, FRM, SBA, and ZBDP)
  - Ticket Categorization & Priority (Triage disputes: Supply Deficit, Transit Damage, Payment Mismatch, App Bug)
  - Escalation & SLA Resolution Tracker (Assign responsible officers, set resolution timers, record audit log)

@@ Security Audit & Compliance *(Suggested Extension)*
  - Immutable Activity Audit Log (Log all elevated admin actions, price changes, stage overrides, bill approvals)
  - Re-Authentication Log (Track all password-confirmed security gates across dispatch and finance)

@@ System Banks & Google Workspace Hub *(Suggested Extension)*
  - Bank Accounts Master Registry (Configure corporate bank accounts for incoming customer transfers)
  - Google Hub & Gmail Scraper Config (Manage Google Apps Script webhooks, bank alert scrapers, sync status)

@@@@@@@@@@@@@@@@@@@@@




WHM
@@@@@@@@@@@@@@@@@@@@@

@@ Command Center
  - Warehouse Operations Dashboard (High-level command console with real-time operational feeds)
  - Warehouse KPI Surveillance (Managed SKUs, stock deficits, active collation totes, urgent orders)
  - Emergency Alert & Exception Feed (Instant alerts for quality failures, supply delays, bay overflows)

@@ Catalog & Pricing Update
  - Products Price Update (WHM view of base prices, variant specs, and target benchmark ceilings)
  - Benchmark Cost Floor Lookup (Inspect SBA baseline procurement targets and handling allowances)
  - Product Handling Cost Configuration (Update physical handling cost breakdowns: bagging, washing, sorting)

@@ Inventory & Stock Management
  - Product Inventory Update (Monitor sellable capacity quotas committed per auction session)
  - Low Stock & Deficit Detection (Automatic trigger calculating stock deficit against approved order demand)
  - SKU & Unit Packaging Spec Registry (Verify pack weights, volume dimensions, and storage requirements)

@@ Order Resolution & Demand Aggregation
  - Order-Items Resolution (`abResolveOrders`) (Pull approved `requested` order items and aggregate by Base Product)
  - Formula-Driven Demand Calculator ($\text{Total Base Qty} = \sum (\text{Order Item Qty} \times \text{Variant Qty Value})$)
  - Sourcing Demand Manifest Generator (Consolidate item demand into structured procurement demand batches)
  - Priority & Urgent Item Queue (Flag high-priority orders and categorize demand by product segment)

@@ SBA Sourcing Management
  - SBA Sourcing Batch Allocation (`abSuggestSbaBatches`) (Split demand across approved SBAs by priority & capacity)
  - Pending Base Products Assignment Queue (Review unassigned aggregated lines and assign primary SBA partners)
  - SBA Acquisition Tickets Dispatch (Issue formal purchase tickets with target volume, benchmark price, deadline)
  - SBA Progress Surveillance (Track real-time SBA task status: Pending -> Accepted -> In Sourcing -> Cargo Dispatched)

@@ Inbound Intake & Quality Assurance (QA)
  - Inbound Receiving Bay Check-In (Log SBA delivery arrival, driver credentials, and physical cargo receipt)
  - Category-Specific QA Inspection Desk (`qa.html`):
    - Foodstuff & Groceries (Moisture, cleanliness, foreign matter, firm condition, weight scale check)
    - Gadgets & Electronics (Factory seal, model verification, serial recording, cosmetic inspection)
    - Fashion & Apparel (Fabric condition, seam stitching, accurate size & color tags)
    - Home & Kitchen Essentials (Component completeness, scratch/dent inspection, operational check)
  - QA Status Assignment (`QApassed`, `QArisk`, `QArejected`) with inspector notes and photo uploads
  - Sourcing Cost Variance Calculator (Calculate $\%$ deviation from benchmark budget; trigger alert if $> 10\%$)

@@ Lot Packing & Tamper-Evident Labeling
  - Order-Item Allocation (`abAllocateToOrderItems`) (Allocate QA-passed goods to customer orders: FIFO + 100% full item rule)
  - Physical Packing Station (`handling.html`) (Assemble items using thermal insulation, bubble wrap, sturdy cartons, branded poly bags)
  - Barcode & Package Label Generation (`LABELS`) (Print standard tamper-evident label: `UWB-{orderId}-{orderItemId}`)
  - Masked Identity & Security Rule (Print customer name, masked phone `0803****123`, destination outlet; omit OTP)
  - Order-Item Stage Advancement (`requested` -> `supplied` -> `QA-passed` -> `packed` -> `labelled`)

@@ Collation & Staging Area-Sort
  - Collation Totes & Pigeon-Hole Hub (`collation.html`) (Merge multiple items belonging to single customer order)
  - Staging Area-Sorting (`abAreaSort`) (Sort labeled packages into physical staging bays by destination Area Outlet)
  - Staging Bay Staging Hubs (Dedicated bays: Tanke Bay, Fate Bay, Sanrab Bay, Offa Garage Bay)
  - Staging Dwell SLA Monitor (Track timestamps: `staging-land` -> `staging-cleared` to avoid bay congestion)

@@ ZBD Transporter Dispatch
  - Build ZBD Assignments (`abBuildZbdAssignments`) (Group staged area cargo into transport loads per destination area)
  - Transport Benchmark Fee Calculator (Compute freight cost using pre-approved route benchmark rates)
  - Carrier Assignment Desk (Assign verified ZBDP transporter truck/van based on capacity and route)
  - Vehicle Loading Supervision & Departure (Verify package count against waybill; advance status to `zbd-transit`)
  - Transporter Transit Waybill Issuance (Generate and print physical/digital route transit manifest)

@@ Billing & Settlement Compilation
  - SBA Intake Bills Compilation (`abCompileBills`) (Compile accepted deliveries, QA weight, and cost variance into vouchers)
  - ZBD Haulage Bills Compilation (Compile completed transit trips, package payload count, and freight fees)
  - Submit Vouchers for Admin Approval (Transmit compiled partner bills to Senior Admin for payout release)

@@ Warehouse Queries & Incident Logging
  - Supplier Default & Shortage Tickets (Log instances of SBA failure, market unavailability, or delayed arrival)
  - Transit Damage & Return Logging (Record damaged items returned from outlets or carriers for disposal/credit)
  - Cross-Department Query Resolution (Coordinate with Admin and FRM regarding order tracking and missing lines)

@@@@@@@@@@@@@@@@@@@@@




FRM
@@@@@@@@@@@@@@@@@@@@@

@@ Command Center
  - Field Operations Center Dashboard (Regional agent command console for outlet activities)
  - Real-Time Commercial KPI Tiles (Active field orders, cash-on-hand, landed packages, pending deliveries)
  - Live Hub Network Status (Connectivity and operating status of Tanke, Fate, Sanrab, Offa Garage outlets)

@@ Customer Management & Onboarding
  - Walk-In & Offline Customer Registration (Enroll offline shoppers, market stall owners, community buying clubs)
  - Regional Customer Directory (Maintain directory of customers mapped to the specific Area Outlet)
  - Customer Account & Order Support (Assist local shoppers with auction participation, order status, app navigation)

@@ Field Commercials & Product Inquiry
  - Live Product Listing & Catalog (`product-listing.html`) (View base products, variant tiers, live selling prices)
  - Farmgate & Wholesale Price Guide (Inspect pre-approved wholesale rates and price schedules for walk-in shoppers)
  - Minimum Order Quantity (MOQ) Guide (Verify MOQ restrictions for auction deals and bulk grocery splits)

@@ Customer Order Fulfillment & Submission
  - Customer-Order Submit Desk (`order-submit.html`) (Place proxy orders on behalf of offline/cash-paying customers)
  - Product & Variant Selection (Select items, pack sizes, and quantities directly into customer order tickets)
  - Delivery Mode Selector (Choose between Outlet Self-Pickup or Doorstep Courier Delivery)
  - Shopping List Upload & Digitization Desk (Digitize paper shopping lists submitted by walk-in buyers)

@@ Field Payment Accounting & Cash Handling
  - Field Payment Receipt Logger (`payment-report.html`) (Record customer payments: Cash, POS, or Direct Transfer)
  - Unremitted Cash-on-Hand Ledger (Real-time accounting of physical cash balances held at the outlet)
  - Customer Payment Receipt Generation (Issue digital/printed receipts linked to customer order numbers)

@@ Bank Remittance Execution
  - Batch Remittance Compiler (`payment-remittance.html`) (Aggregate multiple cash receipts into a bank deposit batch)
  - Bank Deposit & Transfer Reconciliation (Pay compiled funds into AreaBazaar corporate bank accounts)
  - Remittance Package Submission (Submit unique bank teller reference, deposit slip photo, and linked receipts to Admin Finance)
  - Remittance Audit Status Tracker (Track remittance state: `Pending` -> `Approved & Credited`)

@@ Last-Mile Inbound Receiving & Staging (Area Outlet Hub)
  - Carrier Shipment Inbound Check-In (Receive inter-zone cargo arriving via ZBDP carrier from Central Warehouse)
  - Waybill Seal & Manifest Verification (Conduct joint package count verification against carrier transit waybill)
  - Outlet Inbound Stage Update (Advance package lifecycle: `area-land` -> `area-cleared`)
  - Distribution Staging (Sort parcels into Outlet Pickup Shelves or Courier Dispatch Bins)

@@ Customer Delivery & Proof of Handover
  - Customer-Order Tracking Queue (`order-track.html`) (15-minute dispatch tracking queue for local hub arrivals)
  - Customer Pickup Verification Desk (`order-delivery.html`) (Identify customer upon arrival at outlet)
  - Passcode / OTP Authentication Engine (Validate customer's secret delivery passcode before parcel release)
  - Handover Confirmation & Proof of Delivery (Sign physical/digital manifest and advance status to `delivered`)
  - Doorstep Delivery Coordination (Hand over packages to local bike/van couriers with OTP verification mandate)
  - Reverse Logistics & Return Desk (Log customer rejections, wrong variant complaints, and stage items for return)

@@ Field Queries & Exception Reporting
  - Inbound Discrepancy Ticket Desk (Report damaged packages, broken seals, or missing items from carrier delivery)
  - Payment Dispute & Ledger Adjustment Reports (Log customer payment mismatches or banking network delays)
  - Daily Regional Operations Summary (Submit end-of-day sales, cash balance, and inventory turnover reports)

@@@@@@@@@@@@@@@@@@@@@




SBA
@@@@@@@@@@@@@@@@@@@@@

@@ Sourcing Request Intake & Decisions
  - Active Supply Acquisition Requests (`sba_dashboard.php`) (Review official procurement tickets issued by WHM)
  - Procurement Task Inspection (Examine base product, bulk volume, target benchmark price, delivery deadline)
  - Task Decision Console:
    - Accept Task (`accept_task`) (Commit to procure and fulfill the requested batch under agreed terms)
    - Reject Task (`reject_task`) (Decline request with structured reason: Product Unavailable, Logistics Issue, Price Mismatch, Quality Concern)
  - Decision Security Gate (Require partner account password authentication to seal acceptance/rejection)

@@ Hyperlocal Market Procurement
  - Trading Hub Procurement (Execute sourcing across regional commodity centers: Ipata, Mandate, Ago, Offa)
  - Bulk Commercial Negotiation (Negotiate wholesale purchases aligned with or below benchmark price ceilings)
  - Commodity Grading & Conformance Check (Sort and grade goods at source for quality, moisture, freshness, and size)

@@ Inbound Warehouse Dispatch & Intake
  - Mark Cargo Supplied (`supply_ready` / `supplied`) (Update portal with dispatch timestamp, vehicle/driver info)
  - Warehouse Intake Bay Delivery (Deliver procured bulk produce to the designated Warehouse Hub loading bay)
  - Inbound Inspection Attendance (Attend physical intake, weight scale check, and QA inspection with WHM)
  - QA Outcome Reconciliation (Review inspection ratings: `QApassed`, address flags for `QArisk` and `QArejected`)

@@ Sourcing Financials & Remittances
  - Sourcing Receivables Ledger (Track accrued payouts for delivered and QA-passed supply batches)
  - Payment Remittance Tracker (Monitor status of payments processed by Admin Finance: `Pending` -> `Sent` -> `Received`)
  - Digital Remittance Acknowledgment (`remittance-ack`) (Verify bank credits and digitally acknowledge voucher with account password)

@@ Market Intelligence & Field Alerts
  - Market Price Alert Submissions (Notify WHM/Admin of upcoming commodity price spikes, fuel hikes, seasonal shifts)
  - Supply Availability Reports (Report impending crop shortages, harvest delays, or open-market gluts)
  - Query & Operational Feedback Desk (Submit operational tickets regarding intake delays, crate returns, or deductions)

@@@@@@@@@@@@@@@@@@@@@




ZBDp
@@@@@@@@@@@@@@@@@@@@@

@@ Dispatch Request Review & Scheduling
  - Active Cargo Manifests Desk (`zbdp_dashboard.php`) (View inter-zone haulage tasks assigned by WHM)
  - Manifest Specifications Review (Inspect destination Area Outlet, product types, package count, payload weight/volume, route fee)
  - Task Decision Console:
    - Accept Dispatch (`accepted`) (Confirm transit schedule and allocate transport vehicle/driver)
    - Reject Dispatch (`rejected`) (Decline with mandatory operational note: vehicle breakdown, capacity limit, road hazard)

@@ Central Hub Cargo Loading & Departure
  - Loading Bay Check-In (Present carrier logistics ID and driver credentials at Warehouse Staging Bay)
  - Physical Cargo Loading Supervision (Supervise vehicle loading, verifying package count and seals against waybill)
  - Confirm Cargo Loaded (`mark_loaded` -> `loaded`) (Digitally confirm payload loading in the partner portal)
  - Transit Waybill Manifest Possession (Obtain physical/digital signed cargo waybill for the scheduled route)

@@ Inter-Zone Transit & Transport Execution
  - Line-Haul Transit Execution (Drive designated transit corridor from Central Warehouse to destination Area Outlet)
  - In-Transit Status Tracking (`zbd-transit`) (Maintain active transit status and observe delivery window SLAs)
  - En-Route Incident & Emergency Reporting (Submit immediate notifications for road blocks, breakdowns, or transit delays)

@@ Outlet Cargo Unloading & Handover
  - Area Outlet Arrival Check-In (Arrive at destination Area Outlet: Tanke, Fate, Sanrab, Offa Garage)
  - Cargo Unloading Supervision (Unload packages at outlet receiving bay in coordination with the FRM Agent)
  - Joint Package Count Verification (Verify package barcode count and seal integrity against the transit waybill)
  - Signed Waybill & Digital Handover Acknowledgment (Obtain signed waybill and digital receipt acknowledgment from FRM)

@@ Haulage Payouts & Financial Remittance
  - Trip Earnings & Haulage Ledger (Track completed transit runs, mileage fees, and outstanding freight receivables)
  - Remittance Status Monitor (Track payment disbursements processed by Admin Finance: `Sent` -> `Received` -> `Acknowledged`)
  - Haulage Remittance Digital Acknowledgment (`remittance-ack`) (Verify bank credit and acknowledge freight payment with driver password)

@@ Transport Queries & Exception Management
  - Road Emergency & Breakdown Reporting (Submit urgent query alerts for vehicle breakdowns, accidents, or cargo tampering)
  - Route Benchmark & Rate Review Queries (Submit feedback regarding fuel price spikes, road tolls, or route changes)

@@@@@@@@@@@@@@@@@@@@@
