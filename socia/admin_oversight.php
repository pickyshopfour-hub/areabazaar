<?php
/**
 * admin_oversight.php - Senior Admin Oversight Dashboard
 * AreaBazaar Identity Enforcement & Entity Management
 */
require_once '../core/helpers/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senior Oversight | AreaBazaar Admin</title>
    <!-- Premium UI dependencies -->
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
        :root {
            --oversight-bg: #0f172a;
            --oversight-accent: #f43f5e;
            --sidebar-width: 260px;
        }
        body { background-color: #f8fafc; font-family: 'Outfit', 'Inter', sans-serif; height: 100vh; overflow: hidden; }
        
        .main-wrapper { display: flex; height: 100vh; }
        
        /* Sidebar Styling */
        .sidebar {
            width: var(--sidebar-width);
            background: white;
            border-right: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }
        .sidebar-header { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; background: var(--oversight-bg); color: white; }
        .sidebar-nav { flex: 1; overflow-y: auto; padding: 1rem 0; }
        
        .nav-pills .nav-link {
            border-radius: 0;
            padding: 0.8rem 1.5rem;
            color: #64748b;
            font-weight: 500;
            display: flex;
            align-items: center;
            border-left: 4px solid transparent;
            transition: all 0.2s;
        }
        .nav-pills .nav-link i { width: 20px; text-align: center; margin-right: 12px; font-size: 1.1rem; }
        .nav-pills .nav-link:hover { background: #f8fafc; color: var(--oversight-bg); }
        .nav-pills .nav-link.active {
            background: #fff1f2;
            color: var(--oversight-accent);
            border-left-color: var(--oversight-accent);
        }

        /* Content Area */
        .content-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .top-bar { padding: 1rem 2rem; background: white; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .workspace { flex: 1; overflow-y: auto; padding: 2rem; }

        /* Component Aesthetics */
        .glass-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .table-custom thead { background: #f8fafc; border-bottom: 2px solid #f1f5f9; }
        .table-custom th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05rem; padding: 1rem; color: #94a3b8; }
        .table-custom td { padding: 1rem; vertical-align: middle; }
        
        .status-pill { padding: 0.35rem 0.75rem; border-radius: 50px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
        .status-active { background: #dcfce7; color: #15803d; }
        .status-suspended { background: #fee2e2; color: #b91c1c; }
        .status-deployed { background: #dbeafe; color: #1d4ed8; }
        
        .monitor-pane { background: #0f172a; border-radius: 12px; height: 350px; overflow-y: auto; padding: 1rem; color: #94a3b8; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
        .log-line { padding: 0.25rem 0; border-bottom: 1px solid #1e293b; }
        .log-time { color: #475569; margin-right: 8px; }
        .log-tag { color: #f43f5e; font-weight: bold; margin-right: 8px; }
    </style>
</head>
<body>

<div class="main-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <h5 class="mb-0 fw-bold"><i class="fa fa-shield-cat me-2"></i> AreaBazaar</h5>
            <small class="opacity-50">Oversight Panel</small>
        </div>
        <div class="sidebar-nav">
            <div class="px-4 mb-2 small text-muted text-uppercase fw-bold" style="font-size: 0.6rem;">Dashboards</div>
            <a href="admin_auctions.php" class="nav-link override-link"><i class="fa fa-gavel text-white-50"></i> Auctions</a>
            <a href="admin_global_orders.php" class="nav-link override-link"><i class="fa fa-shopping-cart text-white-50"></i> Global Orders</a>
            <a href="admin_inventory.php" class="nav-link override-link"><i class="fa fa-box text-white-50"></i> Inventory</a>
            <a href="admin_dispatch.php" class="nav-link override-link"><i class="fa fa-truck text-white-50"></i> Dispatch</a>
            <a href="admin_finance.php" class="nav-link override-link"><i class="fa fa-wallet text-white-50"></i> Finance</a>
            <a href="admin_queries.php" class="nav-link override-link"><i class="fa fa-comments text-white-50"></i> Query Hub</a>

            <div class="px-4 mt-4 mb-2 small text-muted text-uppercase fw-bold" style="font-size: 0.6rem;">Human Capital</div>
            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist">
                <button class="nav-link active" id="staff-tab" data-bs-toggle="pill" data-bs-target="#pane-staff" type="button" role="tab"><i class="fa fa-user-shield"></i> Staff Registry</button>
                
                <div class="px-4 mt-4 mb-2 small text-muted text-uppercase fw-bold" style="font-size: 0.6rem;">Logistics Grid</div>
                <button class="nav-link" id="whz-tab" data-bs-toggle="pill" data-bs-target="#pane-whz" type="button" role="tab" onclick="fetchGridList('whz')"><i class="fa fa-boxes-stacked"></i> Warehouse Zones</button>
                <button class="nav-link" id="area-tab" data-bs-toggle="pill" data-bs-target="#pane-area" type="button" role="tab" onclick="fetchGridList('area')"><i class="fa fa-map-location"></i> Coverage Areas</button>
                <button class="nav-link" id="route-tab" data-bs-toggle="pill" data-bs-target="#pane-route" type="button" role="tab" onclick="fetchGridList('route')"><i class="fa fa-route"></i> Delivery Routes</button>
                <button class="nav-link" id="benchmark-tab" data-bs-toggle="pill" data-bs-target="#pane-benchmark" type="button" role="tab" onclick="loadBenchmarks()"><i class="fa fa-money-bill-transfer"></i> Route Benchmarks</button>
                
                <div class="px-4 mt-4 mb-2 small text-muted text-uppercase fw-bold" style="font-size: 0.6rem;">Treasury & Sync</div>
                <button class="nav-link" id="bank-tab" data-bs-toggle="pill" data-bs-target="#pane-bank" type="button" role="tab" onclick="fetchGridList('bank')"><i class="fa fa-building-columns"></i> System Banks</button>
                <button class="nav-link" id="google-tab" data-bs-toggle="pill" data-bs-target="#pane-google" type="button" role="tab" onclick="fetchGridList('google')"><i class="fa fa-brands fa-google"></i> Google Hub</button>
                <div class="px-4 mt-4 mb-2 small text-muted text-uppercase fw-bold" style="font-size: 0.6rem;">Treasury Control</div>
                <button class="nav-link text-warning fw-bold" id="finance-tab" data-bs-toggle="pill" data-bs-target="#pane-finance" type="button" role="tab" onclick="loadOversightFinance()"><i class="fa fa-scale-balanced"></i> Finance Oversight</button>
                <button class="nav-link" id="remit-tab" data-bs-toggle="pill" data-bs-target="#pane-remit" type="button" role="tab" onclick="loadPartnerRemittances()"><i class="fa fa-money-bill-wave"></i> Partner Remittances</button>
                
                <div class="px-4 mt-4 mb-2 small text-muted text-uppercase fw-bold" style="font-size: 0.6rem;">External Registry</div>
                <a href="admin_partners.php" class="nav-link"><i class="fa fa-handshake"></i> Partners & SBAs</a>

                <div class="px-4 mt-4 mb-2 small text-muted text-uppercase fw-bold" style="font-size: 0.6rem;">Surveillance</div>
                <button class="nav-link" id="audit-tab" data-bs-toggle="pill" data-bs-target="#pane-audit" type="button" role="tab"><i class="fa fa-terminal"></i> Global Audit</button>
                <a href="admin_queries.php" class="nav-link"><i class="fa fa-comments"></i> Query Management</a>
            </div>
        </div>
    </aside>

    <!-- Content Workspace -->
    <main class="content-area">
        <header class="top-bar">
            <div>
                <h4 class="mb-0 fw-bold" id="current-page-title">Staff Registry</h4>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0 small"><li class="breadcrumb-item">Oversight</li><li class="breadcrumb-item active" id="breadcrumb-active">Staff</li></ol>
                </nav>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div id="notifBellContainer"></div>
                <div class="badge bg-danger-subtle text-danger px-3 py-2"><i class="fa fa-crown me-2"></i> SeniorAdmin Access</div>
                <div class="vr"></div>
                <button class="btn btn-sm btn-outline-dark rounded-pill" onclick="location.href='admin_auctions.php'"><i class="fa fa-arrow-left me-2"></i> Exit</button>
            </div>
        </header>

        <section class="workspace">
            <div class="tab-content" id="v-pills-tabContent">
                
                <!-- Staff Registry -->
                <div class="tab-pane fade show active" id="pane-staff" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-end mb-4">
                        <div><h5 class="fw-bold mb-0">Personnel Deployment</h5><p class="text-muted small mb-0">Hire, Monitor, and Manage administrative privileges</p></div>
                        <button class="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#hireModal"><i class="fa fa-plus-circle me-2"></i> Enroll Staff</button>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0">
                            <thead><tr><th class="ps-4">Full Identity</th><th>Role</th><th>Status</th><th>Access Metrics</th><th class="text-end pe-4">Privileged Actions</th></tr></thead>
                            <tbody id="staffList"></tbody>
                        </table>
                    </div>
                </div>

                <!-- Warehouse Zones -->
                <div class="tab-pane fade" id="pane-whz" role="tabpanel">
                    <div class="d-flex justify-content-between mb-4">
                        <h5 class="fw-bold">Warehouse Asset Registry (WHZ)</h5>
                        <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="openEntityModal('whz')"><i class="fa fa-plus me-2"></i> Create Zone</button>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0" id="whzList">
                            <thead><tr><th class="ps-4">Zone Descriptor</th><th>Region Code</th><th>Charge Officer</th><th>Status</th><th class="text-end pe-4">Actions</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- Operating Areas -->
                <div class="tab-pane fade" id="pane-area" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Operational Coverage Areas</h5>
                        <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="openEntityModal('area')"><i class="fa fa-plus me-2"></i> Add Area</button>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0" id="areaList">
                            <thead><tr><th class="ps-4">Area Descriptor</th><th>Parent WHZ</th><th>Charge Officer</th><th>Status</th><th class="text-end pe-4">Actions</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- Delivery Routes -->
                <div class="tab-pane fade" id="pane-route" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Delivery Route Definitions</h5>
                        <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="openEntityModal('route')"><i class="fa fa-plus me-2"></i> Add Route</button>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0" id="routeList">
                            <thead><tr><th class="ps-4">Route Pathway</th><th>Connectivity</th><th>Charge Officer</th><th>Status</th><th class="text-end pe-4">Actions</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- Transport Benchmarks -->
                <div class="tab-pane fade" id="pane-benchmark" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Transport Benchmark Costs</h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="loadBenchmarks()"><i class="fa fa-refresh me-2"></i> Sync</button>
                            <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="$('#csvUploadModal').modal('show')"><i class="fa fa-cloud-arrow-up me-2"></i> Upload CSV</button>
                        </div>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0" id="benchmarkList">
                            <thead><tr><th class="ps-4">Base Product</th><th>Route</th><th>Price per Unit (₦)</th><th>Last Updated</th><th class="text-end pe-4">Actions</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- Bank Section -->
                <div class="tab-pane fade" id="pane-bank" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Bank Collection Channels</h5>
                        <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="openEntityModal('bank')"><i class="fa fa-plus me-2"></i> Add Bank</button>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0" id="bankList">
                            <thead><tr><th class="ps-4">Bank Institution</th><th>Channel Identity</th><th>Custodian</th><th>Status</th><th class="text-end pe-4">Actions</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- Google Hub -->
                <div class="tab-pane fade" id="pane-google" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Enterprise Sync Accounts</h5>
                        <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="openEntityModal('google')"><i class="fa fa-plus me-2"></i> Add Account</button>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0" id="googleList">
                            <thead><tr><th class="ps-4">Endpoint Email</th><th>Service Purpose</th><th>Custodian</th><th>Status</th><th class="text-end pe-4">Actions</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- Finance Oversight -->
                <div class="tab-pane fade" id="pane-finance" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Senior Finance Verification</h5>
                        <button class="btn btn-outline-secondary btn-sm rounded-pill px-4" onclick="loadOversightFinance()"><i class="fa fa-refresh me-2"></i> Sync</button>
                    </div>
                    <div class="row g-4">
                        <div class="col-lg-6">
                            <div class="glass-card p-4 h-100 border-warning border-opacity-50">
                                <h6 class="fw-bold text-warning mb-3"><i class="fa fa-check-double me-2"></i> Pended Large Approvals</h6>
                                <p class="small text-muted mb-4">These reports matched system logic but breached the `<span id="ovDepositLimit">1,000,000</span>` threshold.</p>
                                <div id="ovPendingList" class="d-flex flex-column gap-2" style="max-height: 400px; overflow-y: auto;">
                                    <!-- Rendered by JS -->
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="glass-card p-4 h-100 border-danger border-opacity-50">
                                <h6 class="fw-bold text-danger mb-3"><i class="fa fa-triangle-exclamation me-2"></i> High-Value Orphans</h6>
                                <p class="small text-muted mb-4">Manual reconciliation required for unlinked bank syncs over the threshold.</p>
                                <div id="ovOrphanList" class="d-flex flex-column gap-2" style="max-height: 400px; overflow-y: auto;">
                                    <!-- Rendered by JS -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Partner Remittances -->
                <div class="tab-pane fade" id="pane-remit" role="tabpanel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Partner Remittances Oversight</h5>
                        <button class="btn btn-outline-secondary btn-sm rounded-pill px-4" onclick="loadPartnerRemittances()"><i class="fa fa-refresh me-2"></i> Sync</button>
                    </div>
                    <div class="glass-card overflow-hidden">
                        <table class="table table-custom mb-0" id="remitList">
                            <thead><tr><th class="ps-4">Partner Name</th><th>Role Type</th><th>Amount</th><th>Status</th><th class="text-end pe-4">Actions</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- Audit Monitoring -->
                <div class="tab-pane fade" id="pane-audit" role="tabpanel">
                    <div class="row g-4">
                        <div class="col-lg-7">
                            <div class="glass-card p-4 h-100">
                                <h6 class="fw-bold mb-3"><i class="fa fa-money-check-dollar text-danger me-2"></i> Priority Approvals (> ₦100k)</h6>
                                <div id="depositList"></div>
                            </div>
                        </div>
                        <div class="col-lg-5">
                            <div class="glass-card p-4 h-100">
                                <h6 class="fw-bold mb-3"><i class="fa fa-receipt text-primary me-2"></i> Global Operations Log</h6>
                                <div class="monitor-pane" id="globalAuditLog"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<!-- CSV UPLOAD MODAL -->
<div class="modal fade" id="csvUploadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header bg-light p-4">
                <h5 class="modal-title fw-bold"><i class="fa fa-file-csv me-2 text-primary"></i> Upload Benchmark CSV</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="benchmarkCsvForm" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label class="form-label fw-bold small text-muted">CSV File (Columns: base_product_id, route_id, price_per_unit)</label>
                        <input type="file" class="form-control" id="benchmarkCsvFile" name="csv_file" accept=".csv" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 rounded-pill py-2">Upload and Save</button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- PERSONNEL HIRE MODAL -->
<div class="modal fade" id="hireModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header bg-light p-4">
                <h5 class="modal-title fw-bold"><i class="fa fa-user-plus me-2 text-primary"></i> Personnel Enrollment</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="hireForm">
                    <div class="row g-3">
                        <div class="col-md-4"><label class="form-label small fw-bold">First Name</label><input type="text" class="form-control" name="first_name" required></div>
                        <div class="col-md-4"><label class="form-label small fw-bold">Middle Name</label><input type="text" class="form-control" name="middle_name"></div>
                        <div class="col-md-4"><label class="form-label small fw-bold">Surname</label><input type="text" class="form-control" name="last_name" required></div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Official Email</label><input type="email" class="form-control" name="email" required></div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Phone Number</label><input type="text" class="form-control" name="phone_number" required></div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Functional Role</label>
                            <select class="form-select" name="role" required>
                                <option value="Sales">Sales Staff</option>
                                <option value="Admin">Operations Admin</option>
                                <option value="WHM">Warehouse Manager</option>
                                <option value="SeniorAdmin">Senior Strategy Admin</option>
                            </select>
                        </div>
                        <div class="col-md-6"><label class="form-label small fw-bold">Master Password</label><input type="password" class="form-control" name="password" required></div>
                        <div class="col-12"><label class="form-label small fw-bold">Primary Residency / Contact Information</label><textarea class="form-control" name="address" rows="2"></textarea></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0 p-4 pt-0">
                <button class="btn btn-outline-secondary px-4 rounded-pill btn-sm" data-bs-dismiss="modal">Discard</button>
                <button class="btn btn-primary px-5 rounded-pill btn-sm fw-bold" onclick="handleHire()">Enroll & Deploy</button>
            </div>
        </div>
    </div>
</div>

<!-- ASSIGN / DEPLOY MODAL (Universal Placement) -->
<div class="modal fade" id="placementModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0"><h6 class="modal-title fw-bold" id="placementTitle">Placement Command</h6><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body p-4 pt-0">
                <form id="placementForm">
                    <input type="hidden" name="target_id" id="placementTargetId">
                    <input type="hidden" name="target_type" id="placementTargetType">
                    <input type="hidden" name="action_mode" id="placementActionMode">
                    
                    <div class="mb-3">
                        <label class="form-label small fw-bold" id="placementLabel">Designated Officer / Unit</label>
                        <select class="form-select" name="officer_id" id="placementSelect" required>
                            <!-- Populated via JS (Staff List) -->
                        </select>
                    </div>
                    <div class="mb-3" id="deploymentGroup">
                        <label class="form-label small fw-bold">Geographic Vector / Location</label>
                        <input type="text" class="form-control" name="location" id="placementLocation" placeholder="e.g. Lagos Island Hub">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Official Directive / Notes</label>
                        <textarea class="form-control" name="notes" rows="2"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0">
                <button class="btn btn-outline-secondary px-4 rounded-pill btn-sm" data-bs-dismiss="modal">Cancel</button>
                <button class="btn btn-dark px-4 rounded-pill btn-sm" onclick="executePlacement()">Execute Dispatch</button>
            </div>
        </div>
    </div>
</div>

<!-- QUERY / FLAG MODAL (Partner-style) -->


<!-- REMIT AUTH MODAL -->
<div class="modal fade" id="remitAuthModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header bg-dark text-white p-4">
                <h5 class="modal-title fw-bold"><i class="fa fa-key me-2"></i> Authorize Remittance</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <p class="text-muted small mb-4">Elevated privileges required. Please supply your administrative password to process this payout.</p>
                <input type="hidden" id="remitAuthId">
                <input type="hidden" id="remitAuthAction">
                <input type="password" id="remitAuthPass" class="form-control border-2 mb-3" placeholder="Admin Password">
                <div class="mb-3">
                    <textarea id="remitAuthNotes" class="form-control" rows="2" placeholder="Administrative Notes (Optional)"></textarea>
                </div>
                <button class="btn btn-dark w-100 rounded-pill fw-bold py-2" onclick="submitRemitAuth()"><i class="fa fa-fingerprint me-2"></i> Authorize & Execute</button>
            </div>
        </div>
    </div>
</div>

<!-- ENTITY CREATE MODAL -->
<div class="modal fade" id="entityModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0 p-4 pb-0">
                <h6 class="modal-title fw-bold" id="entityModalTitle">Command: Create New Asset</h6>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="entityForm">
                    <input type="hidden" name="type" id="entityTypeField">
                    <div id="entityFieldsContainer">
                        <!-- Dynamic via JS -->
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0 p-4 pt-0">
                <button class="btn btn-outline-secondary px-4 rounded-pill btn-sm" data-bs-dismiss="modal">Cancel</button>
                <button class="btn btn-primary px-4 rounded-pill btn-sm fw-bold" onclick="handleEntitySubmit()">Commission Asset</button>
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
const API_BASE = 'index.php/api'; // Corrected to use index.php/api for XAMPP compatibility
const ROOT_ADMIN = 103;
let staffCache = [];

$(document).ready(function() {
    // Nav Logic
    $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
        const id = $(e.target).attr('id').replace('-tab', '');
        $('#current-page-title').text($(e.target).text().trim());
        $('#breadcrumb-active').text($(e.target).text().trim());
        if(id === 'staff') fetchStaffList(); else fetchGridList(id);
    });

    // Initial sequence
    fetchStaffList();
    writeLog('SYSTEM', 'Dashboard sequence initiated. Strategic Oversight active.');
});

// --- Entity Creation Logic ---
function openEntityModal(type) {
    const titleMap = {
        'whz': 'Warehouse Zone',
        'area': 'Operating Area',
        'route': 'Delivery Route',
        'bank': 'System Bank Account',
        'google': 'Google Workspace Account'
    };
    
    $('#entityModalTitle').text('Commission New ' + titleMap[type]);
    $('#entityTypeField').val(type);
    
    let html = '';
    if (type === 'whz') {
        html = `
            <div class="mb-3"><label class="form-label small fw-bold">Zone Name</label><input type="text" class="form-control" name="zone_name" required></div>
            <div class="mb-3">
                <label class="form-label small fw-bold">Region (Sub-Zone)</label>
                <select class="form-select" name="region_id" id="regionSelect" required></select>
            </div>
            <div class="mb-3">
                <label class="form-label small fw-bold">Charge Officer</label>
                <select class="form-select" name="charge_officer_id" id="whzChargeOfficerSelect"></select>
            </div>
            <div class="mb-3"><label class="form-label small fw-bold">Location Address</label><textarea class="form-control" name="metadata[location_address]" rows="2"></textarea></div>
            <div class="mb-3"><label class="form-label small fw-bold">Description</label><textarea class="form-control" name="metadata[description]" rows="2"></textarea></div>
            <div class="mb-3"><label class="form-label small fw-bold">Available Categories</label><input type="text" class="form-control" name="metadata[available_categories]" placeholder="e.g. Dry, Cold, Bulk"></div>
        `;
        fetchGridData('area', (data) => {
            const regions = data.filter(a => a.type === 'sub-zone');
            let options = '<option value="">Select Region...</option>' + regions.map(r => `<option value="${r.id}">${r.area_name}</option>`).join('');
            $('#regionSelect').html(options || '<option value="1">Fallback/No Sub-Zones Found</option>');
        });
        setTimeout(() => {
            let staffOpts = '<option value="0">Assign Later...</option>';
            staffCache.forEach(s => staffOpts += `<option value="${s.id}">${findStaffName(s.id)} [${s.role}]</option>`);
            $('#whzChargeOfficerSelect').html(staffOpts);
        }, 100);
    } else if (type === 'area') {
        html = `
            <div class="mb-3"><label class="form-label small fw-bold">Area Name</label><input type="text" class="form-control" name="area_name" required></div>
            <div class="mb-3">
                <label class="form-label small fw-bold">Parent Zone</label>
                <select class="form-select" name="parent_zone_id" id="parentZoneSelect" required></select>
            </div>
        `;
        fetchGridData('whz', (data) => {
            let options = data.map(z => `<option value="${z.id}">${z.zone_name}</option>`).join('');
            $('#parentZoneSelect').html(options);
        });
    } else if (type === 'route') {
        html = `
            <div class="mb-3"><label class="form-label small fw-bold">Route Name</label><input type="text" class="form-control" name="route_name" required></div>
            <div class="mb-3">
                <label class="form-label small fw-bold">Start Location</label>
                <select class="form-select" name="start_area_id" id="startAreaSelect" required></select>
            </div>
            <div class="mb-3">
                <label class="form-label small fw-bold">End Location</label>
                <select class="form-select" name="end_area_id" id="endAreaSelect" required></select>
            </div>
            <div class="mb-3">
                <label class="form-label small fw-bold">Way Points</label>
                <textarea class="form-control" name="metadata[way_points]" rows="3" placeholder="Locations separated by comma..."></textarea>
            </div>
        `;
        fetchGridData('area', (data) => {
            let options = '<option value="">Select Location...</option>' + data.map(a => `<option value="${a.id}">${a.area_name}</option>`).join('');
            $('#startAreaSelect, #endAreaSelect').html(options);
        });
    } else if (type === 'bank') {
        html = `
            <div class="mb-3"><label class="form-label small fw-bold">Bank Name</label><input type="text" class="form-control" name="bank_name" required></div>
            <div class="mb-3"><label class="form-label small fw-bold">Account Name</label><input type="text" class="form-control" name="account_name" required></div>
            <div class="mb-3"><label class="form-label small fw-bold">Account Number</label><input type="text" class="form-control" name="account_number" required></div>
        `;
    } else if (type === 'google') {
        html = `
            <div class="mb-3"><label class="form-label small fw-bold">Email Address</label><input type="email" class="form-control" name="email" required></div>
            <div class="mb-3"><label class="form-label small fw-bold">Purpose</label><input type="text" class="form-control" name="purpose" placeholder="e.g. Sales Sync" required></div>
        `;
    }
    
    $('#entityFieldsContainer').html(html);
    $('#entityModal').modal('show');
}

function handleEntitySubmit() {
    const formData = $('#entityForm').serialize();
    const type = $('#entityTypeField').val();
    
    $.post('index.php/api/oversight/create', formData + '&admin_id=' + ROOT_ADMIN, function(res) {
        if (res.status === 'success') {
            $('#entityModal').modal('hide');
            fetchGridList(type);
            alert(res.message);
        } else {
            alert('Error: ' + res.message);
        }
    });
}

function fetchGridData(type, callback) {
    $.get(`index.php/api/oversight/list?type=${type}`, function(res) {
        if (res.status === 'success') callback(res.data);
    });
}

function fetchStaffList() {
    $.get(`${API_BASE}/staff/list`, function(res) {
        if(res.status === 'success') {
            staffCache = res.data;
            let html = '';
            res.data.forEach(s => {
                const name = s.first_name ? `${s.first_name} ${s.last_name}` : s.name;
                const roleClass = s.role === 'SeniorAdmin' ? 'text-danger fw-bold' : (s.role === 'Sales' ? 'text-primary' : '');
                const statusClass = s.status === 'Active' ? 'status-active' : (s.status === 'Suspended' ? 'status-suspended' : 'status-deployed');
                
                html += `<tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 32px; height: 32px; background: #f1f5f9; font-size: 10px;">${name.charAt(0)}</div>
                            <div><div class="fw-bold" style="font-size: 0.85rem;">${name}</div><div class="text-muted" style="font-size: 0.7rem;">${s.email || 'No-Email'}</div></div>
                        </div>
                    </td>
                    <td><span class="${roleClass}" style="font-size: 0.75rem;">${s.role}</span></td>
                    <td><span class="status-pill ${statusClass}">${s.status}</span></td>
                    <td class="small text-muted">${s.phone_number}<br>#ID-${s.id}</td>
                    <td class="text-end pe-4">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-light border dropdown-toggle" data-bs-toggle="dropdown">SA Access</button>
                            <ul class="dropdown-menu shadow-sm">
                                <li><a class="dropdown-item" onclick="openPlacement('staff', ${s.id}, 'deploy')"><i class="fa fa-truck-fast me-2"></i> Deploy / Redeploy</a></li>
                                <li><a class="dropdown-item" onclick="triggerImmediateOp('staff', ${s.id}, 'suspend')"><i class="fa fa-user-slash me-2"></i> Suspend Access</a></li>
                                <li><a class="dropdown-item" onclick="triggerImmediateOp('staff', ${s.id}, 'unsuspend')"><i class="fa fa-user-check me-2"></i> Unsuspend</a></li>
                                <li><a class="dropdown-item" onclick="triggerImmediateOp('staff', ${s.id}, 'hide')"><i class="fa fa-eye-slash me-2"></i> Hide Profile</a></li>
                                <li><a class="dropdown-item" onclick="triggerImmediateOp('staff', ${s.id}, 'unhide')"><i class="fa fa-eye me-2"></i> Unhide</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" onclick="triggerImmediateOp('staff', ${s.id}, 'remove')"><i class="fa fa-trash-can me-2"></i> Remove</a></li>
                            </ul>
                        </div>
                        <div class="btn-group btn-group-sm ms-2">
                            <button class="btn btn-light border dropdown-toggle" data-bs-toggle="dropdown">Audit</button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" onclick="popAuditModal('query', ${s.id}, 'staff')"><i class="fa fa-question-circle me-2"></i> Issue Query</a></li>
                                <li><a class="dropdown-item" onclick="popAuditModal('flag', ${s.id}, 'staff')"><i class="fa fa-flag me-2 text-danger"></i> Flag Identity</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>`;
            });
            $('#staffList').html(html || '<tr><td colspan="5" class="text-center p-5">Registry Empty</td></tr>');
            populateStaffSelects();
        }
    });
}

function fetchGridList(type) {
    $.get(`${API_BASE}/oversight/list?type=${type}`, function(res) {
        if(res.status === 'success') {
            const list = $(`#${type}List tbody`);
            let html = '';
            res.data.forEach(item => {
                const label = item.zone_name || item.area_name || item.route_name || item.bank_institution || item.email || item.bank_name;
                const connection = item.region_id || item.parent_zone_id || item.area_id || item.account_number || item.purpose || '-';
                html += `<tr>
                    <td class="ps-4 fw-bold" style="font-size: 0.85rem;">${levelChar(type)}${label}</td>
                    <td style="font-size: 0.8rem;">${connection}</td>
                    <td style="font-size: 0.8rem;">${item.charge_officer_id ? findStaffName(item.charge_officer_id) : '<span class="text-muted">Vacant</span>'}</td>
                    <td><span class="status-pill ${item.status === 'Active' ? 'status-active' : 'status-suspended'}">${item.status}</span></td>
                    <td class="text-end pe-4">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-light border dropdown-toggle" data-bs-toggle="dropdown">Manage</button>
                            <ul class="dropdown-menu shadow">
                                <li><a class="dropdown-item" onclick="openPlacement('${type}', ${item.id}, 'assign')"><i class="fa fa-user-tag me-2"></i> Assign Charge</a></li>
                                <li><a class="dropdown-item" onclick="triggerImmediateOp('${type}', ${item.id}, 'Active')"><i class="fa fa-check me-2"></i> Approve / Activate</a></li>
                                <li><a class="dropdown-item" onclick="triggerImmediateOp('${type}', ${item.id}, 'Suspended')"><i class="fa fa-ban me-2"></i> Suspend Asset</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" onclick="popAuditModal('query', ${item.id}, '${type}')"><i class="fa fa-question-circle me-2 text-primary"></i> Issue Query</a></li>
                                <li><a class="dropdown-item" onclick="popAuditModal('flag', ${item.id}, '${type}')"><i class="fa fa-flag me-2 text-danger"></i> Flag Asset</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" onclick="triggerImmediateOp('${type}', ${item.id}, 'remove')"><i class="fa fa-trash-can me-2"></i> Delete Asset</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>`;
            });
            list.html(html || '<tr><td colspan="5" class="text-center p-5">Registry Empty</td></tr>');
        }
    });
}

function levelChar(t) { return t==='whz' ? '• ' : (t==='area' ? '- ' : ''); }
function findStaffName(id) { const s = staffCache.find(x => x.id == id); return s ? (s.first_name ? `${s.first_name} ${s.last_name}` : s.name) : `#ID-${id}`; }

function populateStaffSelects() {
    let opts = '<option value="">Select Personnel...</option>';
    staffCache.forEach(s => opts += `<option value="${s.id}">${findStaffName(s.id)} [${s.role}]</option>`);
    $('#placementSelect, #queryAssignSelect').html(opts);
}

function openPlacement(type, id, mode) {
    $('#placementTargetId').val(id);
    $('#placementTargetType').val(type);
    $('#placementActionMode').val(mode);
    $('#placementTitle').text(mode === 'deploy' ? 'Strategic Personnel Dispatch' : 'Asset Responsibility Assignment');
    $('#placementLabel').text(mode === 'deploy' ? 'Operational Unit' : 'Designated Charge Officer');
    $('#deploymentGroup').toggleClass('d-none', mode !== 'deploy');
    $('#placementModal').modal('show');
}

function executePlacement() {
    const data = {
        id: $('#placementTargetId').val(),
        type: $('#placementTargetType').val(),
        action: $('#placementActionMode').val(),
        officer_id: $('#placementSelect').val(),
        location: $('#placementLocation').val(),
        admin_id: ROOT_ADMIN
    };
    
    let endpoint = (data.type === 'staff') ? `${API_BASE}/staff/update` : `${API_BASE}/oversight/assign-officer`;
    
    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res) {
            if(res.status === 'success') {
                $('#placementModal').modal('hide');
                data.type === 'staff' ? fetchStaffList() : fetchGridList(data.type);
                writeLog(data.type.toUpperCase(), `Dispatch successful for Target #${data.id}`);
            } else alert(res.message);
        }
    });
}

function popAuditModal(mode, id, type) {
    $('#querySubjectId').val(id);
    $('#querySubjectType').val(type);
    $('#queryActionType').val(mode);
    $('#queryModalTitle').text(mode === 'query' ? 'Issue Formal Query (Audit)' : 'Submit Investigation Flag');
    $('#flagTypeGroup').toggleClass('d-none', mode !== 'flag');
    $('#queryModal').modal('show');
}

function executeInvestigationSubmit() {
    const form = document.getElementById('queryForm');
    const fd = new FormData(form);
    const data = { flags: [] };
    fd.forEach((v, k) => {
        if(k === 'flag_types[]') data.flags.push(v);
        else data[k] = v;
    });
    
    data.item_id = data.subject_id;
    data.item_type = data.subject_type;
    data.staff_id = ROOT_ADMIN;

    $.ajax({
        url: `${API_BASE}/staff/query`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res) {
            if(res.status === 'success') {
                $('#queryModal').modal('hide');
                writeLog('AUDIT', `${data.action_type.toUpperCase()} recorded for ${data.item_type} #${data.item_id}`);
            } else alert(res.message);
        }
    });
}

function triggerImmediateOp(type, id, act) {
    if(!confirm(`Proceed with [${act}] command?`)) return;
    
    let endpoint, payload;
    if (type === 'staff') {
        endpoint = `${API_BASE}/staff/update`;
        payload = { id, action: act, admin_id: ROOT_ADMIN };
    } else {
        if (act === 'remove') {
            endpoint = `${API_BASE}/oversight/delete-entity`;
            payload = { type, id, admin_id: ROOT_ADMIN };
        } else {
            endpoint = `${API_BASE}/oversight/update-status`;
            payload = { type, id, status: act, admin_id: ROOT_ADMIN };
        }
    }
    
    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(res) {
            if(res.status === 'success') {
                type === 'staff' ? fetchStaffList() : fetchGridList(type);
                writeLog(type.toUpperCase(), `Operation ${act} executed on #${id}`);
            } else alert(res.message);
        }
    });
}

function handleHire() {
    const fd = new FormData(document.getElementById('hireForm'));
    const data = { admin_id: ROOT_ADMIN, contact_info: {} };
    fd.forEach((v, k) => {
        if(k === 'address') data.contact_info.address = v;
        else data[k] = v;
    });

    $.ajax({
        url: `${API_BASE}/staff/add`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res) {
            if(res.status === 'success') {
                $('#hireModal').modal('hide');
                fetchStaffList();
                writeLog('HR', `Identity Enrolled: ${data.first_name}`);
            } else alert(res.message);
        }
    });
}

function writeLog(tag, msg) {
    const t = new Date().toLocaleTimeString('en-GB');
    $('#globalAuditLog').prepend(`<div class="log-line"><span class="log-time">[${t}]</span><span class="log-tag">#${tag}</span><span>${msg}</span></div>`);
}

function auditStaff(staffId) {
    // Implementation for loading a specific staff's audit trail
    console.log("Loading audit specifically for staff", staffId);
}

// --- SENIOR ADMIN FINANCE OVERSIGHT ---
function loadOversightFinance() {
    $('#ovPendingList').html('<div class="text-center text-muted p-4"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</div>');
    $('#ovOrphanList').html('<div class="text-center text-muted p-4"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</div>');
    
    $.get('index.php/api/finance-admin/oversight', function(res) {
        if(res.status === 'success') {
            $('#ovDepositLimit').text('₦' + parseFloat(res.data.limit).toLocaleString());
            
            // Render Pended Approvals
            let pendingHtml = '';
            if(res.data.awaitingApproval.length > 0) {
                res.data.awaitingApproval.forEach(r => {
                    pendingHtml += `
                    <div class="p-3 bg-light rounded border border-warning border-opacity-25 pb-2">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="fw-bold text-dark">${r.invoice_refindex}</span>
                            <span class="badge bg-warning text-dark px-2">${r.status}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-end">
                            <div>
                                <small class="text-muted d-block">${r.sender_name}</small>
                                <strong class="fs-5 text-success">₦${parseFloat(r.amount_reported).toLocaleString()}</strong>
                            </div>
                            <button class="btn btn-warning btn-sm fw-bold shadow-sm" onclick="oversightApprove(${r.id})">Approve & Credit</button>
                        </div>
                    </div>`;
                });
            } else {
                pendingHtml = '<div class="alert alert-light text-center small text-muted border">No pending high-value reports.</div>';
            }
            $('#ovPendingList').html(pendingHtml);

            // Render High Value Orphans
            let orphanHtml = '';
            if(res.data.highValueOrphans.length > 0) {
                res.data.highValueOrphans.forEach(b => {
                    orphanHtml += `
                    <div class="p-3 bg-light rounded border border-danger border-opacity-25 pb-2">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="fw-bold text-dark">${b.bank_ref}</span>
                            <span class="badge bg-danger px-2">${b.status}</span>
                        </div>
                        <small class="text-muted d-block font-monospace mb-2" style="font-size:0.75rem">${b.raw_narration}</small>
                        <div class="d-flex justify-content-between align-items-end">
                            <strong class="fs-5 text-success">₦${parseFloat(b.amount).toLocaleString()}</strong>
                            <button class="btn btn-outline-danger btn-sm shadow-sm" onclick="alert('Proceed to Admin Dashboard - Finance - Manual Reconciliation tab to resolve this complex match.')">Manual Match</button>
                        </div>
                    </div>`;
                });
            } else {
                orphanHtml = '<div class="alert alert-light text-center small text-muted border">No high-value orphans found.</div>';
            }
            $('#ovOrphanList').html(orphanHtml);
        }
    });
}

function oversightApprove(reportId) {
    if(!confirm("Senior Oversight: Are you sure you wish to override and verify this high-value deposit? User wallet will be credited.")) return;
    
    // We can confidently push this to the standard verify-report endpoint with 'verified'
    $.ajax({
        url: 'index.php/api/finance-admin/verify-report',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: reportId, action: 'verified', comment: 'Senior Admin Oversight Override'}),
        success: function(res) {
            alert(res.message);
            loadOversightFinance(); // Reload lists
        }
    });
}

// --- PARTNER REMITTANCES ---
function loadPartnerRemittances() {
    $('#remitList tbody').html('<tr><td colspan="5" class="text-center p-4">Loading remittances...</td></tr>');
    $.get('index.php/api/finance-admin/remittances', function(res) {
        if(res.status === 'success') {
            let html = '';
            if(res.data.length > 0) {
                res.data.forEach(r => {
                    let actionHtml = '';
                    if(r.status === 'queued') {
                        actionHtml = `<button class="btn btn-success btn-sm rounded-pill px-3 shadow-sm fw-bold me-1" onclick="processRemit(${r.id}, 'Sent')">Approve / Pay</button><button class="btn btn-danger btn-sm rounded-pill px-3 shadow-sm fw-bold" onclick="processRemit(${r.id}, 'Cancelled')">Reject</button>`;
                    } else if (r.status === 'Acknowledge') {
                        actionHtml = `<span class="text-success small fw-bold"><i class="fa fa-check-double me-1"></i> Acknowledged</span>`;
                    } else {
                        actionHtml = `<span class="text-muted small">${r.status}</span>`;
                    }
                    html += `<tr>
                        <td class="ps-4 fw-bold text-dark">${r.partner_name}</td>
                        <td>${r.partner_type}</td>
                        <td class="text-success fw-bold">₦${parseFloat(r.amount).toLocaleString()}</td>
                        <td><span class="badge ${r.status === 'queued' ? 'bg-warning-subtle text-warning' : (r.status === 'Sent' ? 'bg-info-subtle text-info' : 'bg-success-subtle text-success')}">${r.status.toUpperCase()}</span></td>
                        <td class="text-end pe-4">${actionHtml} <button class="btn btn-outline-secondary btn-sm rounded-pill ms-2" onclick="popAuditModal('query', ${r.id}, 'Remittance')">Query</button></td>
                    </tr>`;
                });
            } else {
                html = '<tr><td colspan="5" class="text-center p-4">No remittance records available.</td></tr>';
            }
            $('#remitList tbody').html(html);
        }
    });
}

function processRemit(id, action) {
    $('#remitAuthId').val(id);
    $('#remitAuthAction').val(action);
    $('#remitAuthPass').val('');
    $('#remitAuthNotes').val('');
    $('#remitAuthModal').modal('show');
}

function submitRemitAuth() {
    const id = $('#remitAuthId').val();
    const action = $('#remitAuthAction').val();
    const pass = $('#remitAuthPass').val();
    const note = $('#remitAuthNotes').val();
    
    if(!pass) return alert("Password required.");
    
    $.ajax({
        url: 'index.php/api/finance-admin/remittance-action',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id, action: action, password: pass, note: note}),
        success: function(res) {
            alert(res.message);
            $('#remitAuthModal').modal('hide');
            loadPartnerRemittances();
        }
    });
}

// --- BENCHMARK MANAGEMENT ---
function loadBenchmarks() {
    $('#benchmarkList tbody').html('<tr><td colspan="5" class="text-center p-4">Loading benchmarks...</td></tr>');
    $.get('index.php/api/logistics/benchmarks', function(res) {
        if (res.status === 'success') {
            let html = '';
            if (res.data.length > 0) {
                res.data.forEach(b => {
                    const rowClass = b.is_hidden == 1 ? 'opacity-50 text-muted' : '';
                    const hideBtn = b.is_hidden == 1 
                        ? `<li><a class="dropdown-item" onclick="toggleBenchmark(${b.id}, 0)"><i class="fa fa-eye me-2"></i> Unhide</a></li>`
                        : `<li><a class="dropdown-item" onclick="toggleBenchmark(${b.id}, 1)"><i class="fa fa-eye-slash me-2"></i> Hide</a></li>`;
                    
                    html += `<tr class="${rowClass}">
                        <td class="ps-4 fw-bold">${b.product_name}</td>
                        <td>${b.route_name}</td>
                        <td class="text-success fw-bold">₦${parseFloat(b.price_per_unit).toLocaleString()}</td>
                        <td class="small">${b.time_updated}</td>
                        <td class="text-end pe-4">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-light border dropdown-toggle" data-bs-toggle="dropdown">Actions</button>
                                <ul class="dropdown-menu shadow">
                                    ${hideBtn}
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-danger" onclick="deleteBenchmark(${b.id})"><i class="fa fa-trash-can me-2"></i> Delete</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>`;
                });
            } else {
                html = '<tr><td colspan="5" class="text-center p-4 text-muted">No benchmark pricing records found.</td></tr>';
            }
            $('#benchmarkList tbody').html(html);
        }
    });
}

function toggleBenchmark(id, hideState) {
    $.post('index.php/api/logistics/benchmark-toggle', {id: id, is_hidden: hideState}, function(res) {
        loadBenchmarks();
    });
}

function deleteBenchmark(id) {
    if(!confirm("Are you sure you want to delete this benchmark record?")) return;
    $.post('index.php/api/logistics/benchmark-delete', {id: id}, function(res) {
        loadBenchmarks();
    });
}

$('#benchmarkCsvForm').submit(function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    $.ajax({
        url: 'index.php/api/logistics/benchmark-upload',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
            alert(res.message);
            if(res.status === 'success') {
                $('#csvUploadModal').modal('hide');
                loadBenchmarks();
            }
        }
    });
});

</script>
<script src="../assets/js/global.js?v=1772652487"></script>
<script>

    </script>

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
                        <input type="hidden" id="queryItemId">
                        <input type="hidden" id="queryType">
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Description / Concern</label>
                            <textarea class="form-control border-2" id="queryMessage" rows="4" required placeholder="Describe the observation..."></textarea>
                        </div>
                    </form>
                    <button type="button" class="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm" onclick="submitQueryAction()">Submit Observation</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Floating Global Query Button -->
    <button class="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 2000; border: 3px solid white;" onclick="openQueryModal(0, 'Global')" title="Global Query">
        <i class="fa fa-question fs-2"></i>
    </button>

    <script>
    function openQueryModal(id, type) {
        $("#queryItemId").val(id);
        $("#queryType").val(type || "General");
        $("#queryMessage").val("");
        $("#queryModal").modal("show");
    }
    </script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
