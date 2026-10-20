<?php
// admin_dispatch.php
require_once '../core/helpers/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SBA & ZBDp Admin Hub | AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'Admin User', 'role' => 'Admin', 'type' => 'staff']);
?>
    </script>
    <style>
        body { background: #f0f2f5; font-family: 'Inter', sans-serif; }
        .sidebar { min-height: 100vh; background: #0f172a; color: white; }
        .nav-link { color: #94a3b8; }
        .nav-link.active { color: white; background: rgba(255,255,255,0.1); border-radius: 0.5rem; }
        .glass-card { background: rgba(255,255,255,0.95); border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2 sidebar p-4">
                <h4 class="fw-bold mb-5">Admin Hub<small class="d-block text-muted" style="font-size: 0.6rem;">Logistics Oversight</small></h4>
                <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="admin_dashboard.php"><i class="fa fa-chart-pie me-2"></i> Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_global_orders.php"><i class="fa fa-globe me-2"></i> Global Orders</a>
                    <a class="nav-link active mb-2" href="admin_dispatch.php"><i class="fa fa-truck-fast me-2"></i> Logistics & Dispatch</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_inventory.php"><i class="fa fa-boxes-stacked me-2"></i> Inventory Tracking</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_finance.php"><i class="fa fa-vault me-2"></i> Finance Hub</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_auctions.php"><i class="fa fa-gavel me-2"></i> Auction Configs</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_active_sessions.php"><i class="fa fa-tower-broadcast me-2"></i> Live Sessions</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_partners.php"><i class="fa fa-handshake me-2"></i> Partner Approvals</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_oversight.php"><i class="fa fa-shield-halved me-2"></i> SA Oversight</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_queries.php"><i class="fa fa-comments me-2"></i> Query Hub</a>

                </nav>
            </div>

            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="fw-bold mb-0">Logistics Command Center</h2>
                    <div id="notifBellContainer"></div>
                </div>
                
                <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
                    <li class="nav-item border rounded-pill me-2"><button class="nav-link active rounded-pill px-4" data-bs-toggle="pill" data-bs-target="#sbaTab">SBA Acquisitions</button></li>
                    <li class="nav-item border rounded-pill"><button class="nav-link rounded-pill px-4" data-bs-toggle="pill" data-bs-target="#zbdpTab">ZBDp Dispatches</button></li>
                </ul>

                <div class="tab-content">
                    <!-- SBA Tab -->
                    <div class="tab-pane fade show active" id="sbaTab">
                        <div class="glass-card mb-4">
                            <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
                                <h5 class="fw-bold mb-0">Pending SBA Acquisition Approvals</h5>
                                <button class="btn btn-outline-secondary btn-sm rounded-pill" onclick="loadLogisticsData()"><i class="fa fa-refresh me-1"></i> Sync</button>
                            </div>
                            <div class="p-0 table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light text-muted small">
                                        <tr><th class="ps-4">SBA Partner</th><th>Base Product</th><th>Auction Session(s)</th><th>Volume</th><th>Unit Cost</th><th>Status</th><th class="text-end pe-4">Admin Action</th></tr>
                                    </thead>
                                    <tbody id="sbaAuthList"></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="glass-card mb-4 border border-danger border-opacity-25" id="sbaHangingSection" style="display:none;">
                            <div class="p-4 border-bottom bg-danger bg-opacity-10">
                                <h5 class="fw-bold mb-0 text-danger"><i class="fa fa-exclamation-triangle me-2"></i> QA Flagged / Hanging Acquisitions</h5>
                            </div>
                            <div class="p-0 table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light text-muted small">
                                        <tr><th class="ps-4">SBA Partner</th><th>Base Product</th><th>Auction Session(s)</th><th>Volume</th><th>QA Outcome</th><th>Status</th><th class="text-end pe-4">Admin Action</th></tr>
                                    </thead>
                                    <tbody id="sbaHangingList"></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="glass-card mb-4 border border-warning border-opacity-25" id="sbaUnassignedSection">
                            <div class="p-4 border-bottom bg-warning bg-opacity-10">
                                <h5 class="fw-bold mb-0 text-dark"><i class="fa fa-layer-group me-2"></i> Unassigned / Pending Resolution</h5>
                            </div>
                            <div class="p-0 table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light text-muted small">
                                        <tr><th class="ps-4">Base Product</th><th>Auction Session(s)</th><th>Volume Setup</th><th>Target Benchmark</th><th class="text-end pe-4">Status</th></tr>
                                    </thead>
                                    <tbody id="sbaUnassignedList"></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="glass-card">
                            <div class="p-4 border-bottom"><h5 class="fw-bold mb-0">All SBA Operations</h5></div>
                            <div class="p-0 table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light text-muted small">
                                        <tr><th class="ps-4">SBA Partner</th><th>Base Product</th><th>Auction Session(s)</th><th>Volume</th><th>Unit Cost</th><th>Status</th><th class="text-end pe-4">State</th></tr>
                                    </thead>
                                    <tbody id="sbaAllList"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- ZBDp Tab -->
                    <div class="tab-pane fade" id="zbdpTab">
                        <div class="glass-card mb-4 border-primary border-opacity-50">
                            <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-primary bg-opacity-10 rounded-top">
                                <h5 class="fw-bold mb-0 text-primary"><i class="fa fa-shield-check me-2"></i> Dispatch Clearance (Admin Auth)</h5>
                            </div>
                            <div class="p-0 table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light text-muted small">
                                        <tr><th class="ps-4">ZBDp Transporter</th><th>Route / Target</th><th>Payload</th><th>Transport Bill</th><th>Security Status</th><th class="text-end pe-4">Clearance Action</th></tr>
                                    </thead>
                                    <tbody id="zbdpClearanceList"></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="glass-card">
                            <div class="p-4 border-bottom"><h5 class="fw-bold mb-0">Global ZBDp Tracking</h5></div>
                            <div class="p-0 table-responsive"><table class="table table-hover align-middle mb-0"><tbody id="zbdpAllList"></tbody></table></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ADMIN AUTH MODAL -->
    <div class="modal fade" id="adminAuthModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 rounded-4 shadow">
                <div class="modal-header bg-dark text-white p-4">
                    <h5 class="modal-title fw-bold"><i class="fa fa-key me-2"></i> Admin Security Auth</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <p class="text-muted small mb-4">Elevated privileges required. Please supply your administrative password to execute this logistics command.</p>
                    <div id="authActionGroup" class="mb-3" style="display:none;">
                        <select id="adminAuthAction" class="form-select border-2 fw-bold text-dark">
                        </select>
                    </div>
                    <input type="password" id="adminAuthPass" class="form-control border-2 mb-3" placeholder="Admin Password">
                    <div class="mb-3">
                        <textarea id="adminAuthNotes" class="form-control" rows="2" placeholder="Administrative Notes (Optional)"></textarea>
                    </div>
                    <button class="btn btn-dark w-100 rounded-pill fw-bold py-2" onclick="confirmAdminAction()"><i class="fa fa-fingerprint me-2"></i> Authorize & Execute</button>
                </div>
            </div>
        </div>
    </div>

    <!-- QUERY MODAL -->
    

    <!-- VIEW RECORDS MODAL -->
    <div class="modal fade" id="recordsModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 rounded-4 shadow">
                <div class="modal-header bg-dark text-white p-4">
                    <h5 class="modal-title fw-bold"><i class="fa fa-file-alt me-2"></i> Record Details</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4" id="recordsBody">
                    <div class="text-center p-3 text-muted">Loading records...</div>
                </div>
            </div>
        </div>
    </div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    let currentAuthContext = null;

    document.addEventListener('DOMContentLoaded', () => {
        loadLogisticsData();
    });

    function loadLogisticsData() {
        $.get('index.php/api/whm/sba-dispatch-all', function(res) {
            if(res.status === 'success') {
                renderSba(res.data.sba);
                renderUnassignedSba(res.data.unassigned_sba);
                renderZbdp(res.data.zbdp);
            }
        });
    }

    function renderSba(data) {
        let authHtml = '', allHtml = '', hangingHtml = '';
        data.forEach(r => {
            const isHanging = r.assign_status === 'hanging';
            const sessionInfo = r.session_id ? `<span class="badge bg-secondary-subtle text-secondary border">${r.session_id}</span>` : `<span class="badge bg-light text-dark border">None</span>`;
            
            const html = `<tr>
                <td class="ps-4 fw-bold">${r.sba_name}</td>
                <td>${r.product_name}</td>
                <td>${sessionInfo}</td>
                <td><span class="badge bg-light text-dark border">${r.total_qty}</span></td>
                <td class="${isHanging ? 'text-danger' : 'text-primary'} fw-bold">${isHanging ? r.supply_status : '₦'+parseFloat(r.unit_cost).toLocaleString()}</td>
                <td>
                    <span class="badge ${r.assign_status === 'pending' || r.assign_status === 'sbaAck' ? 'bg-warning-subtle text-warning' : (isHanging ? 'bg-danger text-white' : 'bg-success-subtle text-success')} border">${isHanging ? 'Flagged / Risk' : r.assign_status}</span>
                </td>
                <td class="text-end pe-4">
                    ${r.assign_status === 'pending' || r.assign_status === 'sbaAck' ? `<button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm fw-bold me-1" onclick="promptAdminAuth('sba_assign', ${r.id}, 'sba_assign')">Review & Process</button>` : 
                     (r.assign_status === 'cancelled' ? `<button class="btn btn-outline-secondary btn-sm rounded-pill px-3 shadow-sm fw-bold me-1" onclick="openRecordsModal(${r.id}, 'sba')">View Records</button>` : 
                     (isHanging ? `<button class="btn btn-danger btn-sm rounded-pill px-3 shadow-sm fw-bold me-1" onclick="promptAdminAuth('sba_qa', ${r.id}, 'sba_qa')">Review QA Flag</button>` : `<span class="text-muted small me-2">${r.supply_status}</span>`))}
                    <button class="btn btn-light border btn-sm rounded-circle shadow-sm" title="Query" onclick="openQueryModal(${r.id}, 'sba')"><i class="fa fa-question text-dark"></i></button>
                </td>
            </tr>`;
            if (r.assign_status === 'pending' || r.assign_status === 'sbaAck' || r.assign_status === 'cancelled') {
                authHtml += html;
            } else if (isHanging) {
                hangingHtml += html;
            } else {
                allHtml += html;
            }
        });
        $('#sbaAuthList').html(authHtml || '<tr><td colspan="7" class="text-center p-4">No pending authorizations.</td></tr>');
        
        if (hangingHtml !== '') {
            $('#sbaHangingSection').show();
            $('#sbaHangingList').html(hangingHtml);
        } else {
            $('#sbaHangingSection').hide();
        }

        $('#sbaAllList').html(allHtml || '<tr><td colspan="7" class="text-center p-4">No historical records.</td></tr>');
    }

    function renderUnassignedSba(data) {
        let html = '';
        if(data && data.length > 0) {
            data.forEach(r => {
                const sessionInfo = r.session_ids ? `<span class="badge bg-secondary-subtle text-secondary border">${r.session_ids}</span>` : `<span class="badge bg-light text-dark border">None</span>`;
                
                if (r.assign_status === 'cancelled') {
                    html += `<tr style="opacity: 0.6; background-color: #f8d7da;">
                        <td class="ps-4 fw-bold text-dark text-decoration-line-through">${r.product_name}</td>
                        <td>${sessionInfo}</td>
                        <td><span class="badge bg-light text-dark border">${r.total_qty} Units</span></td>
                        <td class="text-muted fw-bold">₦${parseFloat(r.unit_cost).toLocaleString()}</td>
                        <td class="text-end pe-4">
                            <span class="badge bg-danger rounded-pill px-3 py-2 me-2">CANCELLED</span>
                            <button class="btn btn-light border btn-sm rounded-circle shadow-sm" title="Query" onclick="openQueryModal(${r.acq_id}, 'unassigned_sba')"><i class="fa fa-question text-dark"></i></button>
                        </td>
                    </tr>`;
                } else {
                    html += `<tr>
                        <td class="ps-4 fw-bold text-dark">${r.product_name}</td>
                        <td>${sessionInfo}</td>
                        <td><span class="badge bg-light text-dark border">${r.total_qty} Units</span></td>
                        <td class="text-muted fw-bold">₦${parseFloat(r.unit_cost).toLocaleString()}</td>
                        <td class="text-end pe-4">
                            ${r.assign_status === 'unassigned' ? `<span class="badge bg-warning text-dark rounded-pill px-3 py-2 mb-1 d-block"><i class="fa fa-sync fa-spin me-1"></i> Fresh Assignment</span>` : ''}
                            <span class="badge bg-danger rounded-pill px-3 py-2 me-2"><i class="fa fa-exclamation-circle me-1"></i> Awaiting WHM Assignment</span>
                            <button class="btn btn-warning btn-sm rounded-pill shadow-sm fw-bold me-1" onclick="promptAdminAuth('unassigned_sba_hanging', ${r.acq_id || r.base_product_id}, 'unassigned_sba_hanging')">Set Hanging</button>
                            <button class="btn btn-light border btn-sm rounded-circle shadow-sm" title="Query" onclick="openQueryModal(${r.acq_id || r.base_product_id}, 'unassigned_sba')"><i class="fa fa-question text-dark"></i></button>
                        </td>
                    </tr>`;
                }
            });
        }
        $('#sbaUnassignedList').html(html || '<tr><td colspan="5" class="text-center p-4">No unassigned or pending product groupings.</td></tr>');
    }

    function renderZbdp(data) {
        let authHtml = '', allHtml = '';
        data.forEach(r => {
            const badgeClass = r.progress_status === 'dispatch_ready' ? 'bg-warning border-warning' : 'bg-light text-dark border';
            const html = `<tr>
                <td class="ps-4 fw-bold">🚚 ${r.zbdp_name}</td>
                <td><i class="fa fa-map-pin text-danger me-1"></i> ${r.area_name}</td>
                <td><span class="badge bg-light text-dark border">${r.total_quantity} Loads</span></td>
                <td class="text-success fw-bold">₦${parseFloat(r.transport_price).toLocaleString()}</td>
                <td><span class="badge ${badgeClass}">${r.progress_status.toUpperCase()}</span></td>
                <td class="text-end pe-4">
                    ${r.progress_status === 'dispatch_ready' ? `<button class="btn btn-warning btn-sm rounded-pill shadow-sm fw-bold border-dark me-1" onclick="promptAdminAuth('zbdp_clearance', ${r.id}, 'zbdp_clearance')"><i class="fa fa-shield-check me-1"></i> Assess Transit</button>` : `<span class="text-muted small me-2"><i class="fa fa-lock me-1"></i> Locked Status</span>`}
                    <button class="btn btn-light border btn-sm rounded-circle shadow-sm" title="Query" onclick="openQueryModal(${r.id}, 'zbdp')"><i class="fa fa-question text-dark"></i></button>
                </td>
            </tr>`;
            
            if(r.progress_status === 'dispatch_ready') {
                authHtml += html;
            } else {
                allHtml += html;
            }
        });
        $('#zbdpClearanceList').html(authHtml || '<tr><td colspan="6" class="text-center p-4">No transports waiting for clearance.</td></tr>');
        $('#zbdpAllList').html(allHtml || '<tr><td colspan="6" class="text-center p-4">No historical loads.</td></tr>');
    }

    function promptAdminAuth(context, id, targetAction) {
        currentAuthContext = { context, id };
        
        let opts = '';
        if (targetAction === 'sba_assign') {
            opts = '<option value="approved">Approve SBA Assignment</option><option value="cancelled">Reject / Cancel Assignment</option>';
        } else if (targetAction === 'sba_qa') {
            opts = '<option value="approved_qa">Approve QA Flag (Pass)</option><option value="rejected_qa">Reject QA Flag (Fail)</option>';
        } else if (targetAction === 'zbdp_clearance') {
            opts = '<option value="confirmed">Clear Transit (Approve)</option><option value="cancelled">Block Transit (Reject)</option>';
        } else if (targetAction === 'unassigned_sba_hanging') {
             opts = '<option value="hanging">Set as Hanging / QA Risk</option>';
        }
        
        $('#adminAuthAction').html(opts);
        $('#authActionGroup').show();

        $('#adminAuthPass').val('');
        $('#adminAuthNotes').val('');
        $('#adminAuthModal').modal('show');
    }

    function confirmAdminAction() {
        const pass = $('#adminAuthPass').val();
        const note = $('#adminAuthNotes').val();
        const actionStatus = $('#adminAuthAction').val();
        if(!pass) return alert("Password required.");
        
        let endpoint = '';
        if(currentAuthContext.context === 'sba_assign' || currentAuthContext.context === 'sba_qa' || currentAuthContext.context === 'unassigned_sba_hanging') {
            endpoint = 'index.php/api/whm/sba-assign-status';
        } else if (currentAuthContext.context === 'zbdp_clearance') {
            endpoint = 'index.php/api/whm/zbd-progress';
        }

        $.post(endpoint, { id: currentAuthContext.id, status: actionStatus, admin_pass: pass, note: note }, function(res) {
            alert(res.message);
            $('#adminAuthModal').modal('hide');
            loadLogisticsData();
        });
    }

    

    

    function openRecordsModal(id, type) {
        let html = `<div class="p-3 bg-light rounded text-dark">
            <h6 class="fw-bold border-bottom pb-2">Record ID: ${id}</h6>
            <div class="mb-2"><strong>Time Assigned:</strong> 2026-02-28 12:00:00</div>
            <div class="mb-2"><strong>Admin Notes:</strong> <span class="text-muted">Item failed QA and was rejected by Senior Admin due to low stock quality.</span></div>
            <div class="mb-2"><strong>WHM Notes:</strong> <span class="text-muted">Sent to Admin for manual review due to missing invoice.</span></div>
            <div class="mb-2"><strong>Final Status:</strong> <span class="badge bg-danger">CANCELLED</span></div>
        </div>`;
        $('#recordsBody').html(html);
        $('#recordsModal').modal('show');
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

</body>
</html>
