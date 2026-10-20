<?php
/**
 * zbdp_dashboard.php - Transport & Logistics Portal
 * AreaBazaar Logistics System
 */
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
_initSession();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZBDp Portal | AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/style.css?v=1772656066.00796">
    <style>
        .portal-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
            border-bottom: 4px solid #f59e0b;
        }
        .dispatch-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            border-left: 5px solid #3b82f6;
            transition: transform 0.2s;
        }
        .dispatch-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body class="bg-light">

<div class="portal-header shadow-sm">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h2 class="fw-bold mb-0"><i class="fa fa-truck-fast me-2 text-warning"></i> ZBDp Partner Portal</h2>
                <p class="text-white-50 mb-0">Zone Batch Dispatch Partner | Last-Mile Logistics</p>
            </div>
            <div class="text-end d-flex align-items-center gap-3">
                <div id="notifBellContainer"></div>
                <div>
                    <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">Verified Carrier</span>
                    <div class="mt-2 small text-white-50">Logistics_ID: #ZB-404</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container mb-5">
    <div class="row g-4">
        <!-- Active Tasks -->
        <div class="col-md-7">
            <h5 class="fw-bold mb-4"><i class="fa fa-clipboard-list me-2 text-primary"></i> Active Dispatch Tasks</h5>
            <div id="zbdTaskList">
                <div class="text-center p-5 text-muted">Loading dispatch schedule...</div>
            </div>
        </div>

        <!-- Earnings & Logistics Stats -->
        <div class="col-md-5">
            <h5 class="fw-bold mb-4"><i class="fa fa-receipt text-warning me-2"></i> Payment Tracking</h5>
            <div class="card border-0 shadow-sm rounded-4 p-0 mb-4 overflow-hidden">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">Trip Payout</th>
                            <th>Status</th>
                            <th class="text-end pe-4">Action</th>
                        </tr>
                    </thead>
                    <tbody id="zbdRemitList">
                        <tr><td colspan="3" class="text-center p-4 text-muted">Loading financials...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- MODALS -->

<!-- ZBD ACTION MODAL -->
<div class="modal fade" id="zbdActionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header bg-dark text-white p-4">
                <h5 class="modal-title fw-bold" id="zbdActionTitle"><i class="fa fa-truck me-2"></i> Update Dispatch Mode</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <input type="hidden" id="zbd_task_id">
                <input type="hidden" id="zbd_task_context">
                <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">Determine Status Update</label>
                    <select id="zbd_task_action_select" class="form-select border-2"></select>
                </div>
                <div class="mb-4">
                    <label class="form-label text-muted small fw-bold">Logistics Report / Note (Required if Rejecting)</label>
                    <textarea id="zbd_task_note" class="form-control border-2" rows="3"></textarea>
                </div>
                <button class="btn btn-warning w-100 rounded-pill fw-bold py-2" onclick="submitZbdAction()">Execute Update</button>
            </div>
        </div>
    </div>
</div>

<!-- REMIT ACK MODAL -->
<div class="modal fade" id="authModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Authentication Required</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">Driver Account Password</label>
                    <input type="password" id="passwordAuthInput" class="form-control border-2">
                </div>
                <button class="btn btn-primary w-100 py-2 rounded-pill fw-bold" onclick="confirmAuthAndAck()">Verify & Confirm</button>
            </div>
        </div>
    </div>
</div>

<!-- GLOBAL QUERY MODAL -->
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

<!-- Floating Query Button -->
<button class="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 2000; border: 3px solid white;" onclick="openQueryModal(0, 'Global')" title="Global Query">
    <i class="fa fa-question fs-2"></i>
</button>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/global.js?v=999"></script>

<script>
    <?php
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'ZBDp User', 'role' => 'ZBDp', 'type' => 'partner']);
?>

    $(document).ready(function() {
        loadZbdTasks();
        loadZbdRemittances();
        loadMyQueryInbox();
    });

    function loadZbdTasks() {
        $.get('index.php/api/partner-portal/zbd-tasks', function(res) {
            let html = '';
            if(res.status === 'success' && res.data.length > 0) {
                res.data.forEach(t => {
                    let actionHtml = '';
                    if(t.progress_status === 'pending') {
                        actionHtml = `<button class="btn btn-warning btn-sm rounded-pill px-4 shadow-sm fw-bold me-1" onclick="openZbdActionModal(${t.id}, 'accept_dispatch')">Review Dispatch</button>`;
                    } else if(t.progress_status === 'accepted') {
                        actionHtml = `<button class="btn btn-info btn-sm rounded-pill px-4 text-white shadow-sm fw-bold me-1" onclick="openZbdActionModal(${t.id}, 'mark_loaded')">Record Load</button>`;
                    } else {
                        const pBadge = t.progress_status === 'loaded' ? 'bg-success' : (t.progress_status === 'withdrawn' ? 'bg-danger' : 'bg-secondary');
                        actionHtml = `<span class="badge rounded-pill ${pBadge} me-1 px-3 py-2">${t.progress_status}</span>`;
                    }
                    actionHtml += `<button class="btn btn-light border btn-sm rounded-circle shadow-sm" onclick="openQueryModal(${t.id}, 'ZBDP_Task')"><i class="fa fa-question text-dark"></i></button>`;
                    
                    const statusBadge = t.progress_status === 'pending' ? 'bg-warning text-dark' : (t.progress_status === 'accepted' ? 'bg-info' : (t.progress_status === 'loaded' ? 'bg-success' : 'bg-secondary'));
                    
                    html += `<div class="dispatch-card mb-3 shadow-sm border-primary">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="fw-bold fs-5"><i class="fa fa-map-marker-alt text-danger me-2"></i>${t.area_name}</div>
                                <div class="text-muted small">${t.product_name} x ${t.total_quantity}</div>
                            </div>
                            <span class="badge rounded-pill ${statusBadge}">${t.progress_status}</span>
                        </div>
                        <div class="mt-3 text-end">${actionHtml}</div>
                    </div>`;
                });
            }
            $('#zbdTaskList').html(html || '<div class="text-center p-5 text-muted border rounded bg-white">No active schedules.</div>');
        });
    }

    function loadZbdRemittances() {
        $.get('index.php/api/partner-portal/zbd-remittances', function(res) {
            let html = '';
            if(res.status === 'success' && res.data.length > 0) {
                res.data.forEach(r => {
                    let action = r.status === 'Sent' ? `<button class="btn btn-success btn-sm rounded-pill px-3 shadow-sm fw-bold me-1" onclick="openAuthModal(${r.id})">Ack Receipt</button>` : `<span class="badge bg-light text-muted border">${r.status}</span>`;
                    action += `<button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" onclick="openQueryModal(${r.id}, 'Remittance')"><i class="fa fa-question text-dark"></i></button>`;
                    
                    const rBadge = r.status === 'Sent' ? 'bg-primary' : (r.status === 'Received' || r.status === 'Acknowledged' ? 'bg-success' : 'bg-warning text-dark');

                    html += `<tr>
                        <td class="ps-4 fw-bold">₦${parseFloat(r.amount).toLocaleString()}</td>
                        <td><span class="badge rounded-pill ${rBadge}">${r.status}</span></td>
                        <td class="text-end pe-4">${action}</td>
                    </tr>`;
                });
            }
            $('#zbdRemitList').html(html || '<tr><td colspan="3" class="text-center p-4">No payouts.</td></tr>');
        });
    }

    function openZbdActionModal(id, context) {
        $('#zbd_task_id').val(id); $('#zbd_task_context').val(context); $('#zbd_task_note').val('');
        let options = context === 'accept_dispatch' ? `<option value="accepted">Accept Dispatch</option><option value="rejected">Reject Dispatch</option>` : `<option value="loaded">Cargo Loaded</option><option value="withdrawn">Withdraw / Issue</option>`;
        $('#zbd_task_action_select').html(options); $('#zbdActionModal').modal('show');
    }

    function submitZbdAction() {
        $.post('index.php/api/whm/zbd-progress', { id: $('#zbd_task_id').val(), status: $('#zbd_task_action_select').val(), note: $('#zbd_task_note').val(), context: 'zbdp' }, function(res) {
            alert(res.message); $('#zbdActionModal').modal('hide'); loadZbdTasks();
        });
    }

    let activeRemitId = null;
    function openAuthModal(id) { activeRemitId = id; $('#passwordAuthInput').val(''); $('#authModal').modal('show'); }
    function confirmAuthAndAck() {
        $.post('index.php/api/partner-portal/remittance-ack', {id: activeRemitId, password: $('#passwordAuthInput').val()}, function(res) {
            alert(res.message); $('#authModal').modal('hide'); loadZbdRemittances();
        });
    }

    // Query System
    function openQueryModal(id, type) {
        $("#queryItemId").val(id); $("#queryType").val(type || "General"); $("#queryMessage").val(""); $("#queryModal").modal("show");
    }

    function _sendQuery() {
        var msg = $("#queryMessage").val(); if (!msg) return alert("Message required.");
        submitQueryAction($("#queryType").val(), $("#queryItemId").val(), msg);
        $("#queryModal").modal("hide");
    }

    function loadMyQueryInbox() {
        $.get('index.php/api/queries/list', { assigned_to: window.currentUser.id, status: 'Open' }, function(res) {
            // inbox
        });
    }
</script>
</body>
</html>
