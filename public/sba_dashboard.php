<?php
// sba_dashboard.php
require_once '../core/helpers/functions.php';
_initSession();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SBA Partner Portal | AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css?v=1772656066.00796">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'SBA User', 'role' => 'SBA', 'type' => 'partner']);
?>
    </script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background: #f8fafc; font-family: 'Inter', sans-serif; }
        .sidebar { min-height: 100vh; background: #0f172a; color: white; }
        .nav-link { color: #94a3b8; }
        .nav-link.active { color: white; background: rgba(255,255,255,0.1); border-radius: 0.5rem; }
        .card { border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    </style>
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-2 sidebar p-4">
            <h4 class="fw-bold mb-5">AreaBazaar <small class="d-block text-muted" style="font-size: 0.6rem;">SBA Partner Portal</small></h4>
            <nav class="nav flex-column">
                <a class="nav-link active mb-2" href="#"><i class="fa fa-boxes-packing me-2"></i> Supply Tasks</a>
                <a class="nav-link text-white-50 mb-2" href="#"><i class="fa fa-wallet me-2"></i> Remittances</a>
                <a class="nav-link text-white-50 mb-2" href="#"><i class="fa fa-user me-2"></i> Profile Settings</a>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="col-md-10 p-5">
            <div class="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 class="fw-bold text-dark">Welcome back, John!</h2>
                    <p class="text-muted">Review your supply requests and track payments.</p>
                </div>
                <div id="notifBellContainer"></div>
            </div>

            <div class="row g-4">
                <!-- Supply Tasks -->
                <div class="col-md-12">
                    <div class="card p-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold mb-0">Active Supply Acquisition Requests</h5>
                            <button class="btn btn-outline-secondary btn-sm rounded-pill" onclick="loadTasks()">Refresh Focus</button>
                        </div>
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light text-muted small">
                                <tr>
                                    <th class="ps-4">Product Request</th>
                                    <th>Volume</th>
                                    <th>Hub Delivery Target</th>
                                    <th>Status (Admin / Supply)</th>
                                    <th class="text-end pe-4">Action</th>
                                </tr>
                            </thead>
                            <tbody id="sbaTaskList">
                                <tr><td colspan="5" class="text-center p-4">Loading ops...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Remittances Tracking -->
                <div class="col-md-12">
                    <div class="card p-4">
                        <h5 class="fw-bold mb-4">Payment & Remittance Tracking</h5>
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light text-muted small">
                                <tr>
                                    <th class="ps-4">Remittance Ref</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th class="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="sbaRemitList">
                                <tr><td colspan="4" class="text-center p-4">Loading history...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- MODALS -->

<!-- SBA ACTION MODAL -->
<div class="modal fade" id="sbaActionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header">
                <h5 class="modal-title fw-bold" id="sbaActionTitle">SBA Command</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <input type="hidden" id="task_id">
                <input type="hidden" id="task_context">
                <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">Select Action</label>
                    <select id="task_action_select" class="form-select border-2" onchange="toggleIssueField()"></select>
                </div>
                <div id="issue_field_container" class="mb-3" style="display:none;">
                    <label class="form-label text-danger small fw-bold">Issue / Reason Type</label>
                    <select id="task_issue_type" class="form-select border-2">
                        <option value="">-- Select Reason --</option>
                        <option value="Product Unavailable">Product Unavailable</option>
                        <option value="Logistics / Transport Issue">Logistics / Transport Issue</option>
                        <option value="Price Mismatch">Price Mismatch</option>
                        <option value="Quality Concern">Quality Concern</option>
                        <option value="Other / Personal">Other / Personal</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">Additional Notes (Required for Withdraw/Reject)</label>
                    <textarea id="task_note" class="form-control border-2" rows="3"></textarea>
                </div>
                <div class="mb-4">
                    <label class="form-label text-muted small fw-bold">Authenticate with Password</label>
                    <input type="password" id="task_password" class="form-control border-2" placeholder="Account password">
                </div>
                <button class="btn btn-dark w-100 py-2 rounded-pill fw-bold" onclick="submitSbaAction()">Submit Decision</button>
            </div>
        </div>
    </div>
</div>

<!-- REMITTANCE AUTH MODAL -->
<div class="modal fade" id="authModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Authentication Required</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">Account Password</label>
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
    $(document).ready(function() {
        loadTasks();
        loadRemittances();
        loadStats();
    });

    function loadTasks() {
        $.get('index.php/api/partner-portal/sba-tasks', function(res) {
            let html = '';
            if(res.status === 'success' && res.data.length > 0) {
                res.data.forEach(t => {
                    const finalizedStatuses = ['supplied', 'QApassed', 'QArejected', 'completed'];
                    if (t.assign_status === 'pending') {
                        action = `<button class="btn btn-warning btn-sm rounded-pill px-3 shadow fw-bold me-1" onclick="openSbaActionModal(${t.id}, 'acknowledge')">Acknowledge</button>`;
                    } else if (t.assign_status === 'approved' || t.assign_status === 'sbaAck') {
                        if (!finalizedStatuses.includes(t.supply_status)) {
                            action = `<button class="btn btn-primary btn-sm rounded-pill px-3 shadow fw-bold me-1" onclick="openSbaActionModal(${t.id}, 'supply')">Review / Supply</button>`;
                        } else {
                            action = `<span class="badge bg-light text-muted border me-1">${t.supply_status}</span>`;
                        }
                    } else {
                        action = `<span class="badge bg-light text-muted border me-1">${t.supply_status || t.assign_status}</span>`;
                    }
                    action += `<button class="btn btn-light border btn-sm rounded-circle shadow-sm" onclick="openQueryModal(${t.id}, 'SBA_Task')"><i class="fa fa-question text-dark"></i></button>`;

                    const aBadge = t.assign_status === 'pending' ? 'bg-warning' : (t.assign_status === 'approved' ? 'bg-success' : 'bg-danger');
                    const sBadge = t.supply_status === 'supplied' ? 'bg-success' : (t.supply_status === 'acknowledged' ? 'bg-info' : (t.supply_status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'));

                    html += `<tr>
                        <td class="ps-4 fw-bold">${t.product_name}</td>
                        <td>${t.total_qty}</td>
                        <td>Hub</td>
                        <td>
                            <span class="badge rounded-pill ${aBadge}">${t.assign_status}</span>
                            <span class="badge rounded-pill ${sBadge} ms-1">${t.supply_status || 'Pending'}</span>
                        </td>
                        <td class="text-end pe-4">${action}</td>
                    </tr>`;
                });
            }
            $('#sbaTaskList').html(html || '<tr><td colspan="5" class="text-center p-4">No active tasks.</td></tr>');
        });
    }

    function loadRemittances() {
        $.get('index.php/api/partner-portal/sba-remittances', function(res) {
            let html = '';
            if(res.status === 'success' && res.data.length > 0) {
                res.data.forEach(r => {
                    let action = r.status === 'Sent' ? `<button class="btn btn-success btn-sm rounded-pill px-3 shadow fw-bold me-1" onclick="openAuthModal(${r.id})">Ack Receipt</button>` : `<span class="badge bg-light text-muted border">${r.status}</span>`;
                    action += `<button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" onclick="openQueryModal(${r.id}, 'Remittance')"><i class="fa fa-question text-dark"></i></button>`;
                    
                    const rBadge = r.status === 'Sent' ? 'bg-primary' : (r.status === 'Received' || r.status === 'Acknowledged' ? 'bg-success' : 'bg-warning text-dark');
                    
                    html += `<tr>
                        <td class="ps-4">#REMIT-${r.id}</td>
                        <td class="fw-bold">₦${parseFloat(r.amount).toLocaleString()}</td>
                        <td><span class="badge rounded-pill ${rBadge}">${r.status}</span></td>
                        <td class="text-end pe-4">${action}</td>
                    </tr>`;
                });
            }
            $('#sbaRemitList').html(html || '<tr><td colspan="4" class="text-center p-4">No remittances.</td></tr>');
        });
    }

    function openSbaActionModal(id, context) {
        $('#task_id').val(id);
        $('#task_context').val(context);
        $('#task_note').val('');
        $('#task_password').val('');
        $('#task_issue_type').val('');
        
        let options = context === 'acknowledge' ? 
            `<option value="accept">Accept Assignment</option><option value="reject">Reject Assignment</option>` : 
            `<option value="supplied">Report as Supplied</option><option value="withdrawn">Withdraw Assignment</option>`;
        
        $('#task_action_select').html(options);
        $('#sbaActionModal').modal('show');
        toggleIssueField();
    }

    function toggleIssueField() {
        const action = $('#task_action_select').val();
        if (action === 'reject' || action === 'withdrawn') {
            $('#issue_field_container').show();
        } else {
            $('#issue_field_container').hide();
        }
    }

    function submitSbaAction() {
        const action = $('#task_action_select').val();
        const note = $('#task_note').val().trim();
        const pwm = $('#task_password').val();
        const issue = $('#task_issue_type').val();

        if ((action === 'reject' || action === 'withdrawn') && (!note || !issue)) {
            return alert("A note and issue type are required for Reject/Withdrawal.");
        }
        if (!pwm) return alert("Account password is required for authentication.");

        $.post('index.php/api/partner-portal/sba-action', { 
            id: $('#task_id').val(), 
            action, 
            note,
            password: pwm,
            issue_type: issue
        }, function(res) {
            alert(res.message); if(res.status==='success'){ $('#sbaActionModal').modal('hide'); loadTasks(); }
        });
    }

    let activeRemitId = null;
    function openAuthModal(id) { activeRemitId = id; $('#passwordAuthInput').val(''); $('#authModal').modal('show'); }
    function confirmAuthAndAck() {
        $.post('index.php/api/partner-portal/remittance-ack', {id: activeRemitId, password: $('#passwordAuthInput').val()}, function(res) {
            alert(res.message); $('#authModal').modal('hide'); loadRemittances();
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
            // Optional inbox logic
        });
    }
</script>
</body>
</html>
