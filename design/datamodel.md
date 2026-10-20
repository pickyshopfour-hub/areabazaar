# Data Model & Schema Design - AreaBazaar (v2)

This document outlines the core database entities and their relationships for the AreaBazaar platform, refined for strict operational separation and advanced accounting.

## 1. User & Identity Management (Model Inheritance)
> [!NOTE]
> All user entities inherit from a **baseline `Model` class** containing common properties (`id`, `name`, `phone_number`, `password_hash`, `contact_info`, `status`, `added_by`, `time_created`) and common methods for CRUD and state management.

- **customers**: (Inherits Model) + `location_area_id`, `associated_ref_code`, `verification_status`, `delivery_passcode`, `auth_pin`.
- **staff_users**: (Inherits Model) + `role` (Admin, SeniorAdmin, WHM). (Restricted to internal management).
- **partners**: (Inherits Model) + `partner_type` (SBA, ZBDp, FRM/Agent), `commission_rate`, `region_id`.
- **areas**: `id`, `area_name`, `region_id`, `coverage_status`.
- **customer_kyc / partner_kyc**: `id`, `entity_type`, `entity_id`, `id_type`, `id_number`, `document_url`, `verification_status`, `verified_by`.

## 2. Wallet & Financial Systems
- **wallets** (Customer): `id`, `customer_id`, `balance`, `last_updated`, `surveillance_flag`.
- **partner_wallets** (FRM, ZBDp, SBA): `id`, `partner_id`, `partner_type`, `balance`, `threshold_limit`, `last_updated`.
- **payment_requests**: `id`, `user_id`, `amount`, `invoice_refindex` (generated for narration), `status` (Pending, Expired), `time_created`.
- **payment_reports**: `id`, `request_id`, `sender_name`, `amount_reported`, `bank_ref`, `time_reported`, `status`.
- **bank_reports**: `id`, `transaction_date`, `raw_narration`, `amount`, `bank_ref`, `extraction_source`, `status` (Unreconciled, Reconciled).
- **bank_sync**: `id`, `report_id`, `bank_report_id`, `sync_method` (`auto`, `manual`), `synced_by`, `sync_time`.
- **commissions**: `id`, `frm_id`, `transaction_id`, `amount`, `status`, `time_credited`.

## 3. Three-Tier Product System
- **base_products**: `id`, `product_name`, `brand`, `category`, `bulk_purchase_price`, `bulk_purchase_unit`, `unit_handling_cost`, `description`, `added_by`.
- **product_variants**: `id`, `base_product_id`, `variant_name` (e.g., 500g Pack, Quality-A), `quantity_value`, `quantity_unit`, `presentation_type` (Split-pack, Auction-unit).
- **show_products**: `id`, `session_id` (Auction or Split-pack), `variant_id`, `display_name`, `starting_price`, `current_price`, `stock_available`, `status`.

## 4. Logistics & Supply Chain
- **shipping**: `id`, `order_id`, `origin_warehouse_id`, `destination_area_id`, `zbdp_id`, `transport_bill_amount`, `current_status`, `dispatch_time`, `delivery_time`, `received_by_agent_at`.
- **SBA_Acquisitions**: `id`, `sba_id`, `variant_id`, `total_qty`, `total_cost`, `ack_status` (SBA_Ack, Paid), `remittance_ref`.
- **zbdp_logistics**: `id`, `zbdp_id`, `bill_amount`, `bill_status` (Acked, Paid), `remittance_ref`.

## 5. Audit & Surveillance
- **AuditLogs**: `id`, `user_id`, `user_type` (Customer/Staff), `action`, `entity_affected`, `old_data` (JSON), `new_data` (JSON), `ip_address`, `timestamp`.
- **SystemAlerts**: `id`, `type`, `severity`, `message`, `status`.

---

## 6. Entity Relationships (ERD Summary)
- **1:1**: `customer` <-> `wallet`
- **1:1**: `staff_user` / `partner` <-> `partner_wallet`
- **1:N**: `base_product` -> `product_variants`
- **1:N**: `product_variant` -> `show_products`
- **1:N**: `bank_report` -> `bank_sync`
- **N:1**: `shipping` -> `areas`
