<?php
/**
 * admin_partners.php - Partner Management Dashboard
 * AreaBazaar Logistics System
 * Handles ADM-PT-01 through ADM-PT-06
 */
require_once '../core/helpers/functions.php';

$pendingPartners = [
    ['id' => 1, 'name' => 'Adebayo Foods Ltd', 'business_name' => 'Adebayo Foods', 'phone_number' => '08012345678', 'partner_type' => 'SBA', 'approval_status' => 'Pending', 'supply_categories' => 'Grains, Rice, Flour', 'time_created' => '2026-02-22 10:15:00', 'onboarded_by_name' => 'Admin Yusuf'],
    ['id' => 2, 'name' => 'Olamide Logistics', 'business_name' => 'Olamide Express', 'phone_number' => '08098765432', 'partner_type' => 'ZBDp', 'approval_status' => 'Pending', 'vehicle_count' => 5, 'time_created' => '2026-02-23 14:30:00', 'onboarded_by_name' => 'WHM Balogun'],
    ['id' => 3, 'name' => 'Chidera Farms', 'business_name' => 'Chidera Agro', 'phone_number' => '07011223344', 'partner_type' => 'SBA', 'approval_status' => 'Pending', 'supply_categories' => 'Vegetables, Poultry', 'time_created' => '2026-02-23 16:00:00', 'onboarded_by_name' => 'Admin Yusuf'],
    ['id' => 4, 'name' => 'Kwame Transport', 'business_name' => 'KT Haulage', 'phone_number' => '09055667788', 'partner_type' => 'ZBDp', 'approval_status' => 'Pending', 'vehicle_count' => 3, 'time_created' => '2026-02-24 08:00:00', 'onboarded_by_name' => 'WHM Balogun'],
];

$allPartners = array_merge($pendingPartners, [
    ['id' => 5, 'name' => 'Blessing Stores', 'business_name' => 'Blessing Wholesale', 'phone_number' => '08133445566', 'partner_type' => 'SBA', 'approval_status' => 'Approved', 'supply_categories' => 'Beverages, Oil', 'time_created' => '2026-02-10 09:00:00', 'approved_by_name' => 'SeniorAdmin'],
    ['id' => 6, 'name' => 'Emeka Movers Co.', 'business_name' => 'Emeka Express', 'phone_number' => '07066778899', 'partner_type' => 'ZBDp', 'approval_status' => 'Approved', 'vehicle_count' => 8, 'time_created' => '2026-01-28 11:00:00', 'approved_by_name' => 'SeniorAdmin'],
    ['id' => 7, 'name' => 'Uche Supplies', 'business_name' => 'Uche LLC', 'phone_number' => '09077889900', 'partner_type' => 'SBA', 'approval_status' => 'Rejected', 'supply_categories' => 'Frozen Foods', 'time_created' => '2026-02-05 15:00:00', 'approved_by_name' => 'SeniorAdmin'],
]);

$counts = ['Pending' => 4, 'Approved' => 2, 'Rejected' => 1, 'Queried' => 0, 'Flagged' => 0];

function getApprovalBadge($status)
{
    $map = [
        'Pending' => 'warning',
        'Approved' => 'success',
        'Rejected' => 'danger',
        'Queried' => 'info',
        'Flagged' => 'dark'
    ];
    return $map[$status] ?? 'secondary';
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partner Management | AreaBazaar Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/style.css?v=1772656066.00796">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'Admin User', 'role' => 'Admin', 'type' => 'staff']);
?>
    </script>
    <style>
        .dash-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 1.5rem 0; margin-bottom: 1.5rem; border-bottom: 4px solid #8b5cf6; }
        .stat-pill { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 0.4rem 1rem; font-size: 0.85rem; }
        .stat-pill .count { font-weight: 700; font-size: 1.1rem; }
        .nav-tabs .nav-link.active { font-weight: 600; border-bottom: 3px solid #8b5cf6; color: #1e293b; }
        .nav-tabs .nav-link { color: #64748b; }
        .partner-row:hover { background: #f8fafc; }
        .type-badge-sba { background: linear-gradient(135deg, #dbeafe, #eff6ff); color: #1e40af; border: 1px solid #93c5fd; }
        .type-badge-zbdp { background: linear-gradient(135deg, #fef3c7, #fffbeb); color: #92400e; border: 1px solid #fcd34d; }
        .action-dropdown .dropdown-toggle::after { display: none; }
        .detail-drawer { position: fixed; top: 0; right: -450px; width: 450px; height: 100vh; background: #fff; box-shadow: -4px 0 20px rgba(0,0,0,0.15); z-index: 1060; transition: right 0.3s ease; overflow-y: auto; }
        .detail-drawer.open { right: 0; }
        .drawer-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 1055; }
        .drawer-overlay.open { display: block; }
        .add-btn { background: linear-gradient(135deg, #8b5cf6, #7c3aed); border: none; color: white; }
        .add-btn:hover { background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; }
    </style>
</head>
<body class="bg-light">

<div class="container-fluid p-0">
    <div class="row g-0">
        <!-- Sidebar -->
        <div class="col-md-2 sidebar p-4" style="min-height: 100vh; background: #0f172a; color: white;">
            <h4 class="fw-bold mb-4">Admin Dashboard</h4>
            <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="admin_dashboard.php"><i class="fa fa-chart-pie me-2"></i> Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_global_orders.php"><i class="fa fa-globe me-2"></i> Global Orders</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_dispatch.php"><i class="fa fa-truck-fast me-2"></i> Logistics & Dispatch</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_inventory.php"><i class="fa fa-boxes-stacked me-2"></i> Inventory Tracking</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_finance.php"><i class="fa fa-vault me-2"></i> Finance Hub</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_auctions.php"><i class="fa fa-gavel me-2"></i> Auction Configs</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_active_sessions.php"><i class="fa fa-tower-broadcast me-2"></i> Live Sessions</a>
                    <a class="nav-link active mb-2" href="admin_partners.php"><i class="fa fa-handshake me-2"></i> Partner Approvals</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_oversight.php"><i class="fa fa-shield-halved me-2"></i> SA Oversight</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_queries.php"><i class="fa fa-comments me-2"></i> Query Hub</a>
                </nav>
        </div>

        <!-- Main Content -->
        <div class="col-md-10">
            <div class="dash-header shadow-sm mt-0 px-4">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
                <h2 class="fw-bold mb-1"><i class="fa fa-user-group me-2 text-warning"></i> Partner Management</h2>
                <p class="text-white-50 mb-0">Onboarding, Approvals &amp; Partner Registry</p>
            </div>
            <div class="d-flex gap-2 flex-wrap align-items-center">
                <a href="admin_oversight.php" class="btn btn-sm btn-outline-light rounded-pill me-2"><i class="fa fa-arrow-left me-1"></i> Oversight</a>
                <span class="stat-pill text-warning"><i class="fa fa-clock"></i> Pending <span class="count" id="count-pending">0</span></span>
                <span class="stat-pill text-success"><i class="fa fa-check-circle"></i> Approved <span class="count" id="count-approved">0</span></span>
                <span class="stat-pill text-danger"><i class="fa fa-times-circle"></i> Rejected <span class="count" id="count-rejected">0</span></span>
                <div id="notifBellContainer" class="ms-2"></div>
            </div>
        </div>
    </div>
</div>

<div class="container mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div class="d-flex gap-2">
            <button class="btn add-btn rounded-pill px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#addPartnerModal"><i class="fa fa-plus me-1"></i> Add Partner</button>
            <button class="btn btn-outline-secondary rounded-pill px-3" onclick="window.open('https://docs.google.com/spreadsheets/d/TEMPLATE_ID','_blank')"><i class="fa fa-table me-1"></i> Open GS Template</button>
        </div>
        <div class="input-group" style="max-width:320px;">
            <span class="input-group-text bg-white border-end-0"><i class="fa fa-search text-muted"></i></span>
            <input type="text" id="partnerSearch" class="form-control border-start-0" placeholder="Search name, phone, business...">
        </div>
    </div>

    <ul class="nav nav-tabs mb-0" id="partnerTabs" role="tablist">
        <li class="nav-item"><button class="nav-link active px-4" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pendingPane" type="button"><i class="fa fa-hourglass-half me-1"></i> Pending Approvals <span class="badge bg-warning text-dark ms-1" id="tab-count-pending">0</span></button></li>
        <li class="nav-item"><button class="nav-link px-4" id="all-tab" data-bs-toggle="tab" data-bs-target="#allPane" type="button"><i class="fa fa-users me-1"></i> All Partners</button></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade show active" id="pendingPane">
            <div class="card border-0 shadow-sm rounded-0 rounded-bottom-4">
                <div class="card-header bg-white border-bottom p-3 d-flex gap-2 align-items-center">
                    <span class="small text-muted fw-bold me-2">Filter:</span>
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3 active" onclick="filterPending(null, this)">All</button>
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="filterPending('SBA', this)">SBA Only</button>
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="filterPending('ZBDp', this)">ZBDp Only</button>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th class="ps-4">Partner</th><th>Type</th><th>Business Info</th><th>Onboarded By</th><th>Submitted</th><th class="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                             <tbody id="pendingTableBody">
                                <!-- Populated via JS -->
                             </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="allPane">
            <div class="card border-0 shadow-sm rounded-0 rounded-bottom-4">
                <div class="card-header bg-white border-bottom p-3 d-flex gap-2 align-items-center flex-wrap">
                    <span class="small text-muted fw-bold me-2">Status:</span>
                    <button class="btn btn-sm btn-outline-secondary rounded-pill px-3 active" onclick="filterAll(null, this)">All</button>
                    <button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="filterAll('Approved', this)">Approved</button>
                    <button class="btn btn-sm btn-outline-warning rounded-pill px-3" onclick="filterAll('Pending', this)">Pending</button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="filterAll('Rejected', this)">Rejected</button>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr><th class="ps-4">Partner</th><th>Type</th><th>Business</th><th>Status</th><th>Since</th><th class="text-end pe-4">Actions</th></tr>
                            </thead>
                             <tbody id="allTableBody">
                                <!-- Populated via JS -->
                             </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Add Partner Modal -->
<div class="modal fade" id="addPartnerModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold"><i class="fa fa-user-plus me-2 text-primary"></i> Register New Partner</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-2">
                <form id="addPartnerForm">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="btn-group w-100" role="group">
                                <input type="radio" class="btn-check" name="partner_type" id="typeSBA" value="SBA" checked>
                                <label class="btn btn-outline-primary" for="typeSBA"><i class="fa fa-handshake me-1"></i> SBA (Supplier)</label>
                                <input type="radio" class="btn-check" name="partner_type" id="typeZBDp" value="ZBDp">
                                <label class="btn btn-outline-warning" for="typeZBDp"><i class="fa fa-truck me-1"></i> ZBDp (Transport)</label>
                            </div>
                        </div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Contact Name *</label><input type="text" class="form-control" name="name" required></div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Phone Number *</label><input type="text" class="form-control" name="phone_number" placeholder="080XXXXXXXX" required></div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Business Name</label><input type="text" class="form-control" name="business_name"></div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Region / Area</label>
                            <select class="form-select" name="region_id"><option value="">Select Region...</option><option value="1">Ibadan Metro</option><option value="2">Lagos Island</option><option value="3">Lagos Mainland</option><option value="4">Abuja Central</option></select>
                        </div>
                        <div class="col-12 sba-fields"><label class="form-label small fw-bold">Supply Categories</label><input type="text" class="form-control" name="supply_categories" placeholder="e.g. Grains, Rice, Beverages"></div>
                        <div class="col-md-6 zbdp-fields" style="display:none;"><label class="form-label small fw-bold">Number of Vehicles</label><input type="number" class="form-control" name="vehicle_count" min="1"></div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Commission Rate (%)</label><input type="number" class="form-control" name="commission_rate" step="0.01" min="0" max="100" value="5.00"></div>
                        <div class="col-12"><label class="form-label small fw-bold">Onboarding Notes</label><textarea class="form-control" name="notes" rows="2" placeholder="Optional notes..."></textarea></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0 pt-0">
                <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn add-btn rounded-pill px-4 shadow-sm" onclick="submitNewPartner()"><i class="fa fa-check me-1"></i> Register Partner</button>
            </div>
        </div>
    </div>
</div>
<!-- Approval Confirmation Modal -->
<div class="modal fade" id="approvalModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold" id="approvalModalTitle">Confirm Action</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="approvalPartnerId">
                <input type="hidden" id="approvalAction">
                <div id="approvalDesc" class="text-muted mb-3"></div>
                <div class="mb-3"><label class="form-label small fw-bold">Admin Staff ID</label><input type="text" class="form-control" id="approvalAdminId" placeholder="Enter your Staff ID"></div>
                <div class="mb-3" id="approvalNotesGroup"><label class="form-label small fw-bold">Notes</label><textarea class="form-control" id="approvalNotes" rows="2" placeholder="Add a note (required for Query/Flag)..."></textarea></div>
            </div>
            <div class="modal-footer border-0 pt-0">
                <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary rounded-pill px-4" id="approvalConfirmBtn" onclick="submitApproval()">Confirm</button>
            </div>
        </div>
    </div>
</div>

<!-- Detail Modal -->
<div class="modal fade" id="detailModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold"><i class="fa fa-id-card me-2 text-primary"></i> Partner Profile</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="detailModalBody">
                <!-- Populated via JS -->
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Query/Flag Modal -->


        </div>
    </div>
</div>

    <!-- Global Query Modal -->
    <div class="modal fade" id="queryModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold">Submit Query</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="queryForm">
                        <input type="hidden" id="querySubjectId" name="subject_id">
                        <input type="hidden" id="queryActionType" name="subject_type">
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Description / Concern</label>
                            <textarea class="form-control border-2" id="queryMessage" name="note" rows="4" required placeholder="Describe the observation..."></textarea>
                        </div>
                    </form>
                    <button type="button" class="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm" onclick="submitQuery()">Submit Observation</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Floating Global Query Button -->
    <button class="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 2000; border: 3px solid white;" onclick="openQueryModal(0, 'Global')" title="Global Query">
        <i class="fa fa-question fs-2"></i>
    </button>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/global.js?v=999999"></script>
<script src="../assets/js/PartnerManagement.js?v=90002144"></script>

    <script>
    $(document).ready(function(){
        // Ensure Bootstrap tabs work
        var triggerTabList = [].slice.call(document.querySelectorAll('button[data-bs-toggle="tab"]'))
        triggerTabList.forEach(function (triggerEl) {
            var tabTrigger = new bootstrap.Tab(triggerEl)
            triggerEl.addEventListener('click', function (event) {
                event.preventDefault()
                tabTrigger.show()
            })
        });
    });
    </script>

</body>
</html>

