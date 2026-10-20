# Operational Bridge Specification - AreaBazaar (Phase 4)

This final implementation phase connects the PHP/MySQL backend to the Google Workspace environment, providing the operational "Frontline" interfaces for WHMs, SBAs, and ZBDps.

## 1. Appscript Side-Panel UIs
To ensure data integrity, all updates to operational sheets are performed via custom **Side-Panel HTML/JS UIs** rather than direct cell editing.

### A. WHM Operations Panel
- **Inventory Intake**: Form to verify bulk arrivals from SBAs.
- **Split-Product Tool**: Calculates pack-out quantities based on variant targets.
- **Bulk Status Updater**: Simultaneous status change for selected rows.
- **Quality Verification**: Checklist logic that pushes results to `api/Logistics/verify`.

### B. SBA & ZBDp Management Panels
- **SBA Supply Ledger**: Displays current acquisition batches. Includes "Acknowledge Payment" button.
- **ZBDp Transport Hub**: Interface to input transport bills and track zonal dispatch status.
- **Bulk Adjustment**: Update bills or status by a percentage/fixed value for multiple rows.

---

## 2. Sheet & Form Schemas

### Operational Sheets
| Sheet Name | Key Columns (Schema) | Script Attachment |
| :--- | :--- | :--- |
| `WHM_Daily_Ops` | `id, variant_id, total_qty, status, quality_ack, added_at` | `AB_Operational_Scripts` |
| `SBA_Acquisition`| `id, sba_id, variant_id, qty, cost, pmt_status, remittance_id`| `AB_Operational_Scripts` |
| `ZBDp_Logistics` | `id, zbdp_id, shipment_id, bill_amount, status, pmt_ref` | `AB_Operational_Scripts` |
| `Sync_Logs` | `timestamp, endpoint, direction, status, payload_size` | `AB_Library_Base` |

### Entry Forms
- **Partner Registration Form**: Captures SBA/ZBDp/Agent contact and KYC details. Deployed to the `/Partners` folder.
- **Acquisition Detail Form**: Captures granular bulk data during warehouse intake.

---

## 3. Trigger Profiles
Configurations for `AB_Library_Base` orchestration.

| Trigger Category | Auction Mode (Active) | Normal Mode (Standby) | Parameters |
| :--- | :--- | :--- | :--- |
| **Order/Stock Sync** | Every 5 Minutes | Every 30 Minutes | From MySQL to `WHM_Daily_Ops` |
| **Bank Sync** | Every 5 Minutes | Every 15 Minutes | Reconciles `PaymentReports` |
| **Email Queue** | Every 5 Minutes | Every 15 Minutes | Max 5 msgs per block |
| **Surveillance** | Every 5 Minutes | Every 15 Minutes | Flagging large wallet moves |
| **Event-Based** | Immediate | Immediate | `onFormSubmit` / `onUiAction` |

---

## 4. Deployment Registry

### Workspace Structure
```text
AreaBazaar_Workspace/
├── Core_Logic/
│   └── AB_Library_Base (Standalone Script)
├── Operational_Sheets/
│   ├── WHM_Fulfillment_Hub (Script Attached)
│   ├── SBA_Global_Ledger (Script Attached)
│   └── ZBDp_Transport_Master (Script Attached)
├── Templates/
│   └── (Master Docs/Sheets for exporting)
└── Partners/
    └── (SBA/ZBDp/Agent specific subfolders)
```

### Deployment Checklist
1. Deploy `AB_Library_Base` and note its **Script ID**.
2. Initialize `WHM_Fulfillment_Hub` from the master template.
3. Link Shared Library to all operational scripts.
4. Set **Project-Specific Triggers** in the Appscript IDE for the Base Library.
5. Deploy Side-Panel HTML files within the Operational Script projects.
