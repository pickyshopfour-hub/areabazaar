<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Active Dashboard - AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
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
        body { background: #0f172a; color: #f8fafc; }
        .sidebar { min-height: 100vh; background: #1e293b; border-right: 1px solid #334155; }
        .card { background: #1e293b; border: 1px solid #334155; color: white; border-radius: 1rem; }
        .nav-link { color: #94a3b8; }
        .nav-link.active { color: #38bdf8; background: rgba(56, 189, 248, 0.1); }
        .wave-timeline { border-left: 2px dashed #475569; position: relative; }
        .wave-point { margin-left: -9px; margin-bottom: 2rem; }
        .wave-dot { width: 16px; height: 16px; border-radius: 50%; background: #475569; border: 4px solid #1e293b; }
        .wave-dot.active { background: #38bdf8; box-shadow: 0 0 10px #38bdf8; }


        .card h5.fw-bold {
            color: #ffc107 !important;
        }

        .card h3.fw-bold   {
            color: #ffc107 ;
        }

        h2.fw-bold {
            color: #ffc107 !important;
        }

    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 sidebar p-4">
                <h4 class="fw-bold mb-4 text-white">AreaBazaar</h4>
                <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="admin_dashboard.php"><i class="fa fa-chart-pie me-2"></i> Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_global_orders.php"><i class="fa fa-globe me-2"></i> Global Orders</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_dispatch.php"><i class="fa fa-truck-fast me-2"></i> Logistics & Dispatch</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_inventory.php"><i class="fa fa-boxes-stacked me-2"></i> Inventory Tracking</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_finance.php"><i class="fa fa-vault me-2"></i> Finance Hub</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_auctions.php"><i class="fa fa-gavel me-2"></i> Auction Configs</a>
                    <a class="nav-link active mb-2" href="admin_active_sessions.php"><i class="fa fa-tower-broadcast me-2"></i> Live Sessions</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_partners.php"><i class="fa fa-handshake me-2"></i> Partner Approvals</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_oversight.php"><i class="fa fa-shield-halved me-2"></i> SA Oversight</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_queries.php"><i class="fa fa-comments me-2"></i> Query Hub</a>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="col-md-10 p-5">
                <?php
$sessionId = $_GET['id'] ?? 1;
// Mock session data
$session = [
    'id' => $sessionId,
    'name' => 'Lagos Morning Wave - Feb 23',
    'status' => 'Active',
    'active_wave' => 'Wave 2 (High Mid)',
    'start_time' => '09:00:00',
    'elapsed' => '01:24:12'
];
?>
                <div class="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <span class="badge bg-success mb-2"><i class="fa fa-circle me-1 small"></i> LIVE SESSION</span>
                        <h2 class="fw-bold mb-0"><?php echo $session['name']; ?></h2>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div id="notifBellContainer"></div>
                        <div class="btn-group shadow">
                            <button class="btn btn-warning px-4" onclick="controlSession(<?php echo $session['id']; ?>, 'pause')"><i class="fa fa-pause me-2"></i> Pause</button>
                            <button class="btn btn-danger px-4" onclick="controlSession(<?php echo $session['id']; ?>, 'end')"><i class="fa fa-stop me-2"></i> Terminate</button>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <!-- Wave Status Monitor -->
                    <div class="col-md-4">
                        <div class="card p-4 h-100">
                            <h5 class="fw-bold mb-4"><i class="fa fa-water text-info me-2"></i> Wave Timeline</h5>
                            <div class="wave-timeline ms-3 ps-4">
                                <div class="wave-point">
                                    <div class="wave-dot active"></div>
                                    <div class="ms-3">
                                        <div class="fw-bold text-info">Current: <?php echo $session['active_wave']; ?></div>
                                        <div class="text-muted small">Ends in 08:45</div>
                                    </div>
                                </div>
                                <div class="wave-point">
                                    <div class="wave-dot"></div>
                                    <div class="ms-3">
                                        <div class="fw-bold">Next: Wave 3 (Critical Point)</div>
                                        <div class="text-muted small">Auto-switch: 10:45:00</div>
                                    </div>
                                </div>
                                <div class="wave-point mb-0">
                                    <div class="wave-dot"></div>
                                    <div class="ms-3">
                                        <div class="fw-bold">Scheduled: Wave 4 (End of Sale)</div>
                                        <div class="text-muted small">Auto-switch: 11:15:00</div>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-outline-info w-100 mt-4" data-bs-toggle="modal" data-bs-target="#manualSwitchModal">
                                <i class="fa fa-bolt-lightning me-2"></i> Manual Switch Override
                            </button>
                        </div>
                    </div>

                    <!-- Market Performance -->
                    <div class="col-md-8">
                        <div class="row g-4">
                            <div class="col-md-4">
                                <div class="card p-4 text-center">
                                    <div class="text-muted small mb-1">Total Orders</div>
                                    <h3 class="fw-bold mb-0">1,248</h3>
                                    <div class="text-success small"><i class="fa fa-caret-up me-1"></i> +12% vs last wave</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card p-4 text-center">
                                    <div class="text-muted small mb-1">Active Customers</div>
                                    <h3 class="fw-bold mb-0">842</h3>
                                    <div class="text-info small">Across 4 Zones</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card p-4 text-center border-info">
                                    <div class="text-muted small mb-1">Current Revenue</div>
                                    <h3 class="fw-bold mb-0 text-info">₦5.2M</h3>
                                    <div class="text-muted small">Target: ₦8.0M</div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="card p-4">
                                    <h5 class="fw-bold mb-4">Stock Pressure (Critical Items)</h5>
                                    <div class="table-responsive">
                                        <table class="table table-dark table-hover mb-0">
                                            <thead>
                                                <tr class="text-muted small">
                                                    <th>Variant</th>
                                                    <th>Price (W2)</th>
                                                    <th>Stock Left</th>
                                                    <th>Pressure</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Indomie Onion 40ct</td>
                                                    <td>₦4,200</td>
                                                    <td>12 cases</td>
                                                    <td><div class="progress" style="height: 6px;"><div class="progress-bar bg-danger" style="width: 85%"></div></div></td>
                                                </tr>
                                                <tr>
                                                    <td>Golden Penny Sugar</td>
                                                    <td>₦1,150</td>
                                                    <td>48 cases</td>
                                                    <td><div class="progress" style="height: 6px;"><div class="progress-bar bg-warning" style="width: 60%"></div></div></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Manual Switch Modal -->
    <div class="modal fade" id="manualSwitchModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow bg-dark text-white">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold text-info"><i class="fa fa-warning me-2"></i> Manual Wave Override</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <p class="text-muted small">Immediately force the session to transition to a selected wave. This will override schedules and pending approvals.</p>
                    <div class="mb-3">
                        <label class="form-label text-white-50">Select Target Wave</label>
                        <select class="form-select bg-dark text-white border-secondary">
                            <option>Wave 3 (Critical Point)</option>
                            <option>Wave 4 (End of Sale)</option>
                        </select>
                    </div>
                    <button class="btn btn-info w-100 py-2 mt-3 fw-bold text-dark">EXECUTE IMMEDIATE SWITCH</button>
                    <div class="text-center mt-3 small text-danger fw-bold">This action is logged for SeniorAdmin audit.</div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/AuctionManagement.js"></script>
<script src="../assets/js/global.js?v=1772652487"></script>
    <script>
    function openQueryModal(id, type) {
        $("#queryItemId").val(id);
        $("#queryType").val(type || "General");
        $("#queryMessage").val("");
        $("#queryModal").modal("show");
    }
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


</body>
</html>
