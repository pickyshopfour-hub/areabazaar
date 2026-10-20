<?php
require_once '../core/includes/database.php';
require_once '../core/Controllers/AuctionController.php';
require_once '../core/Models/WHZone.php';
require_once '../core/helpers/functions.php';

$db = getConn();
$controller = new AuctionController($db);
$sessionsRes = $controller->getAllSessions();
$sessions = $sessionsRes['sessions'] ?? [];

$activeId = $_GET['manage_id'] ?? ($sessions[0]['id'] ?? null);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Auctions - AreaBazaar WHM</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css?v=1772656066.00796" rel="stylesheet">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'WHM User', 'role' => 'WHM', 'type' => 'staff']);
?>
    </script>
    <style>
        body { background: #f8fafc; }
        .sidebar { min-height: 100vh; background: #1e293b; color: white; }
        .card { border: none; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .nav-link { color: #94a3b8; transition: all 0.2s; }
        .nav-link:hover { color: white; background: rgba(255,255,255,0.1); }
    </style>
    <script>window.isWHM = true;</script>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 sidebar p-4" style="min-height: 100vh; background: #1e293b; color: white;">
                <h4 class="fw-bold mb-5">AreaBazaar <small class="d-block text-muted small" style="font-size: 0.6rem;">WHM Portal</small></h4>
                <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="whm_dashboard.php"><i class="fa fa-home me-2"></i> Dashboard Overview</a>
                    <a class="nav-link active mb-2" href="whm_auctions.php"><i class="fa fa-gavel me-2"></i> Manage Auctions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_orders.php"><i class="fa fa-clipboard-list me-2"></i> Auction Orders Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_items.php"><i class="fa fa-box-open me-2"></i> Auction Order Items Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_sba_acquisitions.php"><i class="fa fa-pallet me-2"></i> SBA Acquisitions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_partners.php"><i class="fa fa-handshake me-2"></i> Partners</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_inventory.php"><i class="fa fa-box me-2"></i> Inventory</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_zbdp_dispatch.php"><i class="fa fa-truck-loading me-2"></i> ZBDp Dispatch</a>
                </nav>
            </div>
            <!-- Main Content -->
            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 class="fw-bold text-dark">Auction Sessions Management</h2>
                        <p class="text-muted">Manage ongoing logistics and operations for local Auction Sessions.</p>
                    </div>
                    <div id="notifBellContainer"></div>
                </div>

                <div class="card p-4 mb-4 shadow-sm border-0 rounded-4">
                    <h5 class="fw-bold mb-3">Your Assigned Sessions</h5>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="bg-light">
                                <tr class="text-muted small">
                                    <th>Session Name</th>
                                    <th>Status</th>
                                    <th>Start Time</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($sessions as $s): ?>
                                <tr class="<?php echo $s['id'] == $activeId ? 'table-primary-light border-start border-4 border-primary' : ''; ?>">
                                    <td class="ps-3">
                                        <div class="fw-bold text-primary"><?php echo $s['session_name']; ?></div>
                                        <div class="text-muted small">ID: #<?php echo $s['id']; ?></div>
                                    </td>
                                    <td>
                                        <span class="badge bg-<?php echo getStatusColor($s['status']); ?> rounded-pill px-3 py-2">
                                            <?php echo $s['status']; ?>
                                        </span>
                                    </td>
                                    <td class="small text-muted"><i class="fa fa-clock me-1"></i><?php echo $s['start_time'] ?? 'Not Scheduled'; ?></td>
                                    <td class="text-end pe-3">
                                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1" onclick='viewSession(<?php echo json_encode($s, JSON_HEX_APOS); ?>)'><i class="fa fa-eye me-1"></i> View</button>
                                        <a href="/google_workspace/WHM_PrepCheck.gs" target="_blank" class="btn btn-sm btn-info text-white rounded-pill px-3 me-1"><i class="fa fa-clipboard-check me-1"></i> Run PrepCheck</a>
                                        <button class="btn btn-sm btn-warning rounded-pill px-3 shadow-sm me-1" onclick="openQueryModal(<?php echo $s['id']; ?>, 'AuctionSession')"><i class="fa fa-question-circle me-1"></i> Query Admin</button>
                                        <a href="?manage_id=<?php echo $s['id']; ?>" class="btn btn-sm btn-success rounded-pill px-3 shadow-sm"><i class="fa fa-box me-1"></i> Treat Orders</a>
                                    </td>
                                </tr>
                                <?php
endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <?php if ($activeId): ?>
                <div class="card p-4 mt-4 shadow-sm border-0 rounded-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold mb-0"><i class="fa fa-boxes-stacked me-2 text-success"></i> Treat Order Items for Session #<?php echo htmlspecialchars($activeId); ?></h5>
                        <div>
                            <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm me-1" onclick="batchResolveSBA(<?php echo htmlspecialchars($activeId); ?>)"><i class="fa fa-handshake me-2"></i> Batch Map SBA Acquisitions</button>
                            <button class="btn btn-warning btn-sm rounded-pill px-3 shadow-sm" onclick="batchResolveZBD(<?php echo htmlspecialchars($activeId); ?>)"><i class="fa fa-truck me-2"></i> Batch Map ZBD Dispatches</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle" id="orderItemsTable">
                            <thead class="bg-light">
                                <tr class="text-muted small">
                                    <th class="ps-4">Item Details</th>
                                    <th>Order Info</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="orderItemsList">
                                <tr>
                                    <td colspan="3" class="text-center text-muted py-5" id="loadingItemsRow">
                                        <span class="spinner-border spinner-border-sm me-2"></span>Loading items...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php
endif; ?>

            </div>
        </div>
    </div>

    <!-- Modals -->
    <!-- View Session Modal -->
    <div class="modal fade" id="viewSessionModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header border-0 p-4 pb-2">
                    <h5 class="modal-title fw-bold"><i class="fa fa-info-circle me-2 text-primary"></i> Session Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-2" id="sessionDetailsBody">
                    <!-- Populated dynamically -->
                </div>
                <div class="modal-footer border-0 pb-4 pt-0">
                    <button class="btn btn-outline-secondary rounded-pill px-4 w-100" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Removed local modal to use global -->

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const activeSessionId = <?php echo json_encode($activeId); ?>;

        document.addEventListener('DOMContentLoaded', () => {
            if (activeSessionId) {
                loadOrderItems(activeSessionId);
            }
            loadStaff();
        });

        function loadStaff() {
            fetch('index.php/api/staff/list')
                .then(res => res.json())
                .then(data => {
                    if(data.status === 'success') {
                        let options = '<option value="">Select Staff...</option>';
                        data.data.forEach(s => {
                            options += `<option value="${s.id}">${s.name} (${s.role})</option>`;
                        });
                        document.getElementById('assigneeSelect').innerHTML = options;
                    } else {
                        document.getElementById('assigneeSelect').innerHTML = '<option value="">Failed to load staff</option>';
                    }
                }).catch(e => {
                    console.warn("List staff endpoint missing or failed", e);
                    document.getElementById('assigneeSelect').innerHTML = '<option value="">Failed to load staff</option>';
                });
        }

        function viewSession(session) {
            let html = `
                <table class="table table-borderless table-sm mb-0">
                    <tbody>
                        <tr><td class="text-muted w-25">ID</td><td class="fw-bold">#${session.id}</td></tr>
                        <tr><td class="text-muted">Name</td><td class="fw-bold">${session.session_name}</td></tr>
                        <tr><td class="text-muted">Status</td><td><span class="badge bg-secondary">${session.status}</span></td></tr>
                        <tr><td class="text-muted">Type</td><td>${session.type}</td></tr>
                        <tr><td class="text-muted">Start Time</td><td>${session.start_time || 'Pending Schedule'}</td></tr>
                        <tr><td class="text-muted">Revenue Target</td><td>₦${parseFloat(session.target_revenue || 0).toLocaleString()}</td></tr>
                    </tbody>
                </table>
            `;
            document.getElementById('sessionDetailsBody').innerHTML = html;
            new bootstrap.Modal(document.getElementById('viewSessionModal')).show();
        }

        

        $('#queryAdminForm').on('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('index.php/api/queries/add', {
                method: 'POST',
                body: formData
            }).then(res => res.json())
            .then(data => {
                if(data.status === 'success') {
                    alert('Query submitted successfully.');
                    bootstrap.Modal.getInstance(document.getElementById('queryAdminModal')).hide();
                } else {
                    alert(data.message || 'Failed to submit query.');
                }
            }).catch(e => alert('Error submitting query.'));
        });

        function loadOrderItems(sessionId) {
            fetch(`index.php/api/auction/items?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    const list = document.getElementById('orderItemsList');
                    if (data.status === 'success' && data.data && data.data.length > 0) {
                        let html = '';
                        data.data.forEach(item => {
                            html += `
                                <tr>
                                    <td class="ps-4">
                                        <div class="fw-bold text-dark">${item.product_name}</div>
                                        <div class="small text-muted"><i class="fa fa-tag me-1 text-primary"></i>${item.variant_name}</div>
                                    </td>
                                    <td>
                                        <div class="small text-muted">Stock: ${item.stock_limit}</div>
                                        <div class="small fw-semibold text-success">Price: ₦${item.current_price}</div>
                                    </td>
                                    <td><span class="badge bg-secondary bg-opacity-75 rounded-pill px-3">Pending Treatment</span></td>
                                </tr>
                            `;
                        });
                        list.innerHTML = html;
                    } else {
                        list.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-5"><i class="fa fa-folder-open mb-3 d-block fs-1"></i>No order items found for this session.</td></tr>`;
                    }
                }).catch(e => {
                    document.getElementById('orderItemsList').innerHTML = `<tr><td colspan="3" class="text-center text-danger py-5">Error loading session order items</td></tr>`;
                });
        }

        function batchResolveSBA(sessionId) {
            alert(`Batch mapped Base Products for Session #${sessionId} into SBA Acquisitions pipeline.`);
            // Redirect to SBA Acquisitions Panel for WHM to conclude assigning partners to groupings
            window.location.href = 'whm_sba_acquisitions.php';
        }

        function batchResolveZBD(sessionId) {
            alert(`Batch mapped Area Routes for Session #${sessionId} into ZBD Dispatches pipeline.`);
            // Redirect to ZBD Dispatches Panel for WHM to conclude assignment 
            window.location.href = 'whm_zbdp_dispatch.php';
        }
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
                    <button type="button" class="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm" onclick="_sendQuery()">Submit Observation</button>
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

    function _sendQuery() {
        var id   = $("#queryItemId").val();
        var type = $("#queryType").val();
        var msg  = $("#queryMessage").val();
        if (!msg) return alert("Message is required.");
        submitQueryAction(type || 'General', id || 0, msg);
        $("#queryModal").modal("hide");
    }
</script>
</body>
</html>
