<?php
// whm_zbdp_dispatch.php
require_once '../core/helpers/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZBDp Dispatch | WHM AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/style.css?v=1772656066.00796">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'WHM User', 'role' => 'WHM', 'type' => 'staff']);
?>
    </script>
    <style>
        body { background: #f1f5f9; font-family: 'Inter', sans-serif; }
        .sidebar { min-height: 100vh; background: #1e293b; color: white; }
        .nav-link { color: #94a3b8; }
        .nav-link.active { color: white; background: rgba(255,255,255,0.1); border-radius: 0.5rem; }
        .card { border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2 sidebar p-4">
                <h4 class="fw-bold mb-5">AreaBazaar <small class="d-block text-muted small" style="font-size: 0.6rem;">WHM Portal</small></h4>
                <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="whm_dashboard.php"><i class="fa fa-home me-2"></i> Dashboard Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auctions.php"><i class="fa fa-gavel me-2"></i> Manage Auctions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_orders.php"><i class="fa fa-clipboard-list me-2"></i> Auction Orders Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_items.php"><i class="fa fa-box-open me-2"></i> Auction Order Items Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_sba_acquisitions.php"><i class="fa fa-pallet me-2"></i> SBA Acquisitions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_partners.php"><i class="fa fa-handshake me-2"></i> Partners</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_inventory.php"><i class="fa fa-box me-2"></i> Inventory</a>
                    <a class="nav-link active mb-2" href="whm_zbdp_dispatch.php"><i class="fa fa-truck-loading me-2"></i> ZBDp Dispatch</a>
                </nav>
            </div>

            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="fw-bold text-dark">ZBDp Dispatch Resolution</h2>
                    <div id="notifBellContainer"></div>
                </div>

                <!-- Unassigned Aggregation Panel -->
                <div class="card mb-5">
                    <div class="card-header bg-white p-4 border-bottom d-flex justify-content-between">
                        <h5 class="fw-bold mb-0 text-primary">Pending Area Dispatches (Unassigned)</h5>
                        <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="loadZbdData()"><i class="fa fa-sync me-2"></i> Refresh</button>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light text-muted small text-uppercase">
                                <tr>
                                    <th class="ps-4">Destination Area</th>
                                    <th>Base Product</th>
                                    <th>Auction Session(s)</th>
                                    <th>Total Loads (Qty)</th>
                                    <th class="text-end pe-4">Assign ZBDp Transporter</th>
                                </tr>
                            </thead>
                            <tbody id="unassignedList">
                                <tr><td colspan="5" class="text-center p-4">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Assigned Batches Tracking -->
                <div class="card">
                    <div class="card-header bg-white p-4 border-bottom">
                        <h5 class="fw-bold mb-0">Active ZBDp Tracking</h5>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light text-muted small text-uppercase">
                                <tr>
                                    <th class="ps-4">Transporter (ZBDp)</th>
                                    <th>Destination & Product</th>
                                    <th>Auction Session(s)</th>
                                    <th>Est. Transport Cost</th>
                                    <th>Progress Status</th>
                                    <th class="text-end pe-4">Actions / Actions</th>
                                </tr>
                            </thead>
                            <tbody id="assignedList">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Assign Modal -->
    <div class="modal fade" id="assignModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Select ZBDp Transporter</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="z_area_id">
                    <input type="hidden" id="z_bp_id">
                    <input type="hidden" id="z_qty">
                    <div class="mb-3 border p-3 rounded bg-light">
                        <div class="small fw-bold text-muted text-uppercase mb-1">Dispatch Core Detail:</div>
                        <div class="fs-6 fw-bold text-dark" id="z_dispatch_desc"></div>
                    </div>
                    <div class="mb-4">
                        <label class="form-label text-muted small fw-bold">Select Zone-Based Delivery Partner (ZBDp)</label>
                        <select id="z_zbdp_id" class="form-select border-2">
                            <!-- Populated -->
                        </select>
                    </div>
                    <button class="btn btn-primary w-100 py-2 rounded-pill fw-bold" onclick="submitZbdAssignment()"><i class="fa fa-truck-fast me-2"></i>Tentative Assignment</button>
                    <small class="text-muted d-block text-center mt-3">Transport Cost will strictly process based on dynamic benchmark.</small>
                </div>
            </div>
        </div>
    </div>
    </div>

    <!-- QUERY MODAL -->
    

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        loadZbdData();
        loadZbdps();
    });

    function loadZbdData() {
        $.get('index.php/api/whm/zbd-dispatch', function(res) {
            if(res.status === 'success') {
                renderUnassigned(res.data.unassigned);
                renderAssigned(res.data.assigned);
            }
        });
    }

    function loadZbdps() {
        $.get('index.php/api/partner/list?type=ZBDp', function(res) {
            if(res.status === 'success') {
                let options = '<option value="">-- Choose ZBDp Driver --</option>';
                res.data.forEach(s => {
                    options += `<option value="${s.id}">${s.name} (${s.business_name})</option>`;
                });
                $('#z_zbdp_id').html(options);
            }
        });
    }

    function renderUnassigned(data) {
        let html = '';
        if(data.length > 0) {
            data.forEach(row => {
                const sessionInfo = row.session_ids ? `<span class="badge bg-secondary-subtle text-secondary border">${row.session_ids}</span>` : `<span class="badge bg-light text-dark border">None</span>`;
                html += `
                <tr>
                    <td class="ps-4 fw-bold text-dark"><i class="fa fa-map-marker-alt text-danger me-2"></i>${row.area_name}</td>
                    <td class="fw-bold">${row.product_name}</td>
                    <td>${sessionInfo}</td>
                    <td><span class="badge bg-light text-dark shadow-sm px-3 py-2 border">${row.total_quantity} loads</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm fw-bold mb-1" onclick="openAssignModal(${row.destination_area_id}, ${row.base_product_id}, '${row.area_name}', '${row.product_name}', ${row.total_quantity})"><i class="fa fa-truck me-2"></i>Resolve Dispatch</button>
                        <button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" title="Query" onclick="openQueryModal(${row.base_product_id}, 'unassigned_dispatch')"><i class="fa fa-question text-dark"></i></button>
                    </td>
                </tr>`;
            });
        } else {
            html = '<tr><td colspan="5" class="text-center p-4 text-muted">No pending dispatches to resolve.</td></tr>';
        }
        $('#unassignedList').html(html);
    }

    function renderAssigned(data) {
        let html = '';
        if(data.length > 0) {
            data.forEach(row => {
                let badgeClass = 'warning';
                if(row.progress_status === 'accepted') badgeClass = 'primary';
                if(row.progress_status === 'loaded') badgeClass = 'secondary text-dark';
                if(row.progress_status === 'dispatch_ready') badgeClass = 'info text-dark';
                if(row.progress_status === 'confirmed') badgeClass = 'success';
                if(row.progress_status === 'completed') badgeClass = 'success border-success bg-opacity-10 text-success fw-bold';

                let actionHtml = '';
                if(row.progress_status === 'loaded') {
                    actionHtml = `<button class="btn btn-secondary btn-sm px-3 shadow-sm rounded-pill fw-bold" onclick="markReady(${row.id})"><i class="fa fa-check me-2"></i> Mark Dispatch Ready</button>`;
                } else if(row.progress_status === 'dispatch_ready') {
                    actionHtml = `<small class="text-muted me-2"><i class="fa fa-hourglass-half me-1"></i>Awaiting Admin Confirm</small>`;
                } else if(row.progress_status === 'pending') {
                    actionHtml = `<small class="text-muted me-2"><i class="fa fa-hourglass-half me-1"></i>Waiting on Driver Accept...</small>`;
                } else if(row.progress_status === 'confirmed') {
                    // Final WHM action to complete
                    actionHtml = `<button class="btn btn-success btn-sm px-3 shadow-sm rounded-pill fw-bold" onclick="markComplete(${row.id})"><i class="fa fa-flag-checkered me-2"></i> Finalize Trip Complete</button>`;
                }
                
                actionHtml += `<button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" title="Query" onclick="openQueryModal(${row.id}, 'assigned_dispatch')"><i class="fa fa-question text-dark"></i></button>`;

                const sessionInfo = row.session_id ? `<span class="badge bg-secondary-subtle text-secondary border">${row.session_id}</span>` : `<span class="badge bg-light text-dark border">None</span>`;

                html += `
                <tr>
                    <td class="ps-4 fw-bold">🚚 ${row.zbdp_name}</td>
                    <td>
                        <span class="d-block fw-bold"><i class="fa fa-map-marker-alt text-danger me-1"></i>${row.area_name}</span>
                        <span class="text-muted small">${row.total_quantity} loads of ${row.product_name}</span>
                    </td>
                    <td>${sessionInfo}</td>
                    <td class="fw-bold text-success">₦${parseFloat(row.transport_price).toLocaleString()}</td>
                    <td><span class="badge bg-${badgeClass} border">${row.progress_status.replace('_', ' ').toUpperCase()}</span></td>
                    <td class="text-end pe-4">${actionHtml}</td>
                </tr>`;
            });
        }
        $('#assignedList').html(html);
    }

    function openAssignModal(aId, pId, aName, pName, qty) {
        $('#z_area_id').val(aId);
        $('#z_bp_id').val(pId);
        $('#z_qty').val(qty);
        $('#z_dispatch_desc').text(`${qty} loads of [${pName}] to [${aName}]`);
        $('#assignModal').modal('show');
    }

    function submitZbdAssignment() {
        const driverId = $('#z_zbdp_id').val();
        if(!driverId) return alert("Select a Driver!");
        
        $.post('index.php/api/whm/zbd-assign', {
            destination_area_id: $('#z_area_id').val(),
            base_product_id: $('#z_bp_id').val(),
            zbdp_id: driverId,
            total_quantity: $('#z_qty').val()
        }, function(res) {
            if(res.status === 'success') {
                $('#assignModal').modal('hide');
                loadZbdData();
                alert(res.message);
            } else alert(res.message);
        });
    }

    function markReady(id) {
        if(!confirm("Are you confirming goods physically loaded and safe dispatch flag triggered? Admin handles next.")) return;
        $.post('index.php/api/whm/zbd-progress', {id: id, status: 'dispatch_ready'}, function(res) {
            if(res.status === 'success') loadZbdData();
        });
    }

    function markComplete(id) {
        if(!confirm("Driver arrived at Area & Trip concluded? Senior admin will fully credit transit funds once confirmed.")) return;
        $.post('index.php/api/whm/zbd-progress', {id: id, status: 'completed'}, function(res) {
            if(res.status === 'success') loadZbdData();
        });
    }

    

    

    </script>
<script src="../assets/js/global.js?v=1772652487"></script>

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
                    </div>
                    <button class="btn btn-primary w-100 py-2 rounded-pill fw-bold" onclick="submitZbdAssignment()"><i class="fa fa-truck-fast me-2"></i>Tentative Assignment</button>
                    <small class="text-muted d-block text-center mt-3">Transport Cost will strictly process based on dynamic benchmark.</small>
                </div>
            </div>
        </div>
    </div>
    </div>

    <!-- QUERY MODAL -->
    

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        loadZbdData();
        loadZbdps();
    });

    function loadZbdData() {
        $.get('index.php/api/whm/zbd-dispatch', function(res) {
            if(res.status === 'success') {
                renderUnassigned(res.data.unassigned);
                renderAssigned(res.data.assigned);
            }
        });
    }

    function loadZbdps() {
        $.get('index.php/api/partner/list?type=ZBDp', function(res) {
            if(res.status === 'success') {
                let options = '<option value="">-- Choose ZBDp Driver --</option>';
                res.data.forEach(s => {
                    options += `<option value="${s.id}">${s.name} (${s.business_name})</option>`;
                });
                $('#z_zbdp_id').html(options);
            }
        });
    }

    function renderUnassigned(data) {
        let html = '';
        if(data.length > 0) {
            data.forEach(row => {
                const sessionInfo = row.session_ids ? `<span class="badge bg-secondary-subtle text-secondary border">${row.session_ids}</span>` : `<span class="badge bg-light text-dark border">None</span>`;
                html += `
                <tr>
                    <td class="ps-4 fw-bold text-dark"><i class="fa fa-map-marker-alt text-danger me-2"></i>${row.area_name}</td>
                    <td class="fw-bold">${row.product_name}</td>
                    <td>${sessionInfo}</td>
                    <td><span class="badge bg-light text-dark shadow-sm px-3 py-2 border">${row.total_quantity} loads</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm fw-bold mb-1" onclick="openAssignModal(${row.destination_area_id}, ${row.base_product_id}, '${row.area_name}', '${row.product_name}', ${row.total_quantity})"><i class="fa fa-truck me-2"></i>Resolve Dispatch</button>
                        <button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" title="Query" onclick="openQueryModal(${row.base_product_id}, 'unassigned_dispatch')"><i class="fa fa-question text-dark"></i></button>
                    </td>
                </tr>`;
            });
        } else {
            html = '<tr><td colspan="5" class="text-center p-4 text-muted">No pending dispatches to resolve.</td></tr>';
        }
        $('#unassignedList').html(html);
    }

    function renderAssigned(data) {
        let html = '';
        if(data.length > 0) {
            data.forEach(row => {
                let badgeClass = 'warning';
                if(row.progress_status === 'accepted') badgeClass = 'primary';
                if(row.progress_status === 'loaded') badgeClass = 'secondary text-dark';
                if(row.progress_status === 'dispatch_ready') badgeClass = 'info text-dark';
                if(row.progress_status === 'confirmed') badgeClass = 'success';
                if(row.progress_status === 'completed') badgeClass = 'success border-success bg-opacity-10 text-success fw-bold';

                let actionHtml = '';
                if(row.progress_status === 'loaded') {
                    actionHtml = `<button class="btn btn-secondary btn-sm px-3 shadow-sm rounded-pill fw-bold" onclick="markReady(${row.id})"><i class="fa fa-check me-2"></i> Mark Dispatch Ready</button>`;
                } else if(row.progress_status === 'dispatch_ready') {
                    actionHtml = `<small class="text-muted me-2"><i class="fa fa-hourglass-half me-1"></i>Awaiting Admin Confirm</small>`;
                } else if(row.progress_status === 'pending') {
                    actionHtml = `<small class="text-muted me-2"><i class="fa fa-hourglass-half me-1"></i>Waiting on Driver Accept...</small>`;
                } else if(row.progress_status === 'confirmed') {
                    // Final WHM action to complete
                    actionHtml = `<button class="btn btn-success btn-sm px-3 shadow-sm rounded-pill fw-bold" onclick="markComplete(${row.id})"><i class="fa fa-flag-checkered me-2"></i> Finalize Trip Complete</button>`;
                }
                
                actionHtml += `<button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" title="Query" onclick="openQueryModal(${row.id}, 'assigned_dispatch')"><i class="fa fa-question text-dark"></i></button>`;

                const sessionInfo = row.session_id ? `<span class="badge bg-secondary-subtle text-secondary border">${row.session_id}</span>` : `<span class="badge bg-light text-dark border">None</span>`;

                html += `
                <tr>
                    <td class="ps-4 fw-bold">🚚 ${row.zbdp_name}</td>
                    <td>
                        <span class="d-block fw-bold"><i class="fa fa-map-marker-alt text-danger me-1"></i>${row.area_name}</span>
                        <span class="text-muted small">${row.total_quantity} loads of ${row.product_name}</span>
                    </td>
                    <td>${sessionInfo}</td>
                    <td class="fw-bold text-success">₦${parseFloat(row.transport_price).toLocaleString()}</td>
                    <td><span class="badge bg-${badgeClass} border">${row.progress_status.replace('_', ' ').toUpperCase()}</span></td>
                    <td class="text-end pe-4">${actionHtml}</td>
                </tr>`;
            });
        }
        $('#assignedList').html(html);
    }

    function openAssignModal(aId, pId, aName, pName, qty) {
        $('#z_area_id').val(aId);
        $('#z_bp_id').val(pId);
        $('#z_qty').val(qty);
        $('#z_dispatch_desc').text(`${qty} loads of [${pName}] to [${aName}]`);
        $('#assignModal').modal('show');
    }

    function submitZbdAssignment() {
        const driverId = $('#z_zbdp_id').val();
        if(!driverId) return alert("Select a Driver!");
        
        $.post('index.php/api/whm/zbd-assign', {
            destination_area_id: $('#z_area_id').val(),
            base_product_id: $('#z_bp_id').val(),
            zbdp_id: driverId,
            total_quantity: $('#z_qty').val()
        }, function(res) {
            if(res.status === 'success') {
                $('#assignModal').modal('hide');
                loadZbdData();
                alert(res.message);
            } else alert(res.message);
        });
    }

    function markReady(id) {
        if(!confirm("Are you confirming goods physically loaded and safe dispatch flag triggered? Admin handles next.")) return;
        $.post('index.php/api/whm/zbd-progress', {id: id, status: 'dispatch_ready'}, function(res) {
            if(res.status === 'success') loadZbdData();
        });
    }

    function markComplete(id) {
        if(!confirm("Driver arrived at Area & Trip concluded? Senior admin will fully credit transit funds once confirmed.")) return;
        $.post('index.php/api/whm/zbd-progress', {id: id, status: 'completed'}, function(res) {
            if(res.status === 'success') loadZbdData();
        });
    }

    

    

    </script>
<script src="../assets/js/global.js?v=1772652487"></script>

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

    // Inject logged-in user identity (dev: hardcoded WHM user)


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
