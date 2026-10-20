<?php
// whm_sba_acquisitions.php
require_once '../core/helpers/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SBA Acquisitions | WHM AreaBazaar</title>
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
                    <a class="nav-link active mb-2" href="whm_sba_acquisitions.php"><i class="fa fa-pallet me-2"></i> SBA Acquisitions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_partners.php"><i class="fa fa-handshake me-2"></i> Partners</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_inventory.php"><i class="fa fa-box me-2"></i> Inventory</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_zbdp_dispatch.php"><i class="fa fa-truck-loading me-2"></i> ZBDp Dispatch</a>
                </nav>
            </div>

            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="fw-bold text-dark">SBA Acquisitions (Supply Batching)</h2>
                    <div id="notifBellContainer"></div>
                </div>

                <!-- Unassigned Aggregation Panel -->
                <div class="card mb-5">
                    <div class="card-header bg-white p-4 border-bottom d-flex justify-content-between">
                        <h5 class="fw-bold mb-0 text-primary">Pending Base Products (Unassigned)</h5>
                        <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="loadSbaData()"><i class="fa fa-sync me-2"></i> Refresh</button>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light text-muted small text-uppercase">
                                <tr>
                                    <th class="ps-4">Base Product</th>
                                    <th>Auction Session(s)</th>
                                    <th>Total Qty Needed</th>
                                    <th>Unit Benchmark Price</th>
                                    <th>Estimated Total</th>
                                    <th class="text-end pe-4">Assign SBA</th>
                                </tr>
                            </thead>
                            <tbody id="unassignedList">
                                <tr><td colspan="6" class="text-center p-4">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Assigned Batches Tracking -->
                <div class="card">
                    <div class="card-header bg-white p-4 border-bottom">
                        <h5 class="fw-bold mb-0">Active SBA Assignments</h5>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light text-muted small text-uppercase">
                                <tr>
                                    <th class="ps-4">Assigned SBA</th>
                                    <th>Product & Qty</th>
                                    <th>Auction Session(s)</th>
                                    <th>Total Cost</th>
                                    <th>Admin Approval</th>
                                    <th>Supply Status</th>
                                    <th class="text-end pe-4">Actions</th>
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
                    <h5 class="modal-title fw-bold">Select SBA for Supply</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="a_bp_id">
                    <input type="hidden" id="a_qty">
                    <input type="hidden" id="a_cost">
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-bold">Target Product</label>
                        <input type="text" id="a_prod_name" class="form-control" readonly>
                    </div>
                    <div class="mb-4">
                        <label class="form-label text-muted small fw-bold">Select Small Business Agent (SBA)</label>
                        <select id="a_sba_id" class="form-select border-2">
                            <!-- Populated via typical partners endpoint -->
                        </select>
                    </div>
                    <button class="btn btn-primary w-100 py-2 rounded-pill fw-bold" onclick="submitSbaAssignment()">Confirm Assignment</button>
                </div>
            </div>
        </div>
    </div>

    <!-- QA Report Modal -->
    <div class="modal fade" id="qaModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Quality Assurance Form</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="qa_sba_id">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Assessment Outcome</label>
                        <select id="qa_assessment" class="form-select border-2">
                            <option value="QApassed">Full-Pass (Proceed to Admin)</option>
                            <option value="QArisk">Partial-Pass (Flag as Risk)</option>
                            <option value="QArejected">QA-Rejected (Reject Supply)</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="form-label small fw-bold">Inspector Notes</label>
                        <textarea id="qa_notes" rows="3" class="form-control" placeholder="Observations..."></textarea>
                    </div>
                    <button class="btn btn-primary w-100 py-2 rounded-pill fw-bold" onclick="submitQA()"><i class="fa fa-clipboard-check me-2"></i> Submit Assessment</button>
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
        loadSbaData();
        loadSbas();
    });

    function loadSbaData() {
        $.get('index.php/api/whm/sba-acquisitions', function(res) {
            if(res.status === 'success') {
                renderUnassigned(res.data.unassigned);
                renderAssigned(res.data.assigned);
            }
        });
    }

    function loadSbas() {
        $.get('index.php/api/partner/list?type=SBA', function(res) {
            if(res.status === 'success') {
                let options = '<option value="">-- Choose SBA --</option>';
                res.data.forEach(s => {
                    options += `<option value="${s.id}">${s.name} (${s.business_name})</option>`;
                });
                $('#a_sba_id').html(options);
            }
        });
    }

    function renderUnassigned(data) {
        let html = '';
        if(data.length > 0) {
            data.forEach(row => {
                const total = row.total_qty * row.unit_cost;
                const sessionInfo = row.session_ids ? `<span class="badge bg-secondary-subtle text-secondary border">${row.session_ids}</span>` : `<span class="badge bg-light text-dark border">None</span>`;
                if (row.assign_status === 'cancelled') {
                    html += `
                    <tr style="opacity: 0.6; background-color: #f8d7da;">
                        <td class="ps-4 fw-bold text-dark text-decoration-line-through">${row.product_name}</td>
                        <td>${sessionInfo}</td>
                        <td><span class="badge bg-light text-dark shadow-sm px-3 py-2 border">${row.total_qty} units</span></td>
                        <td class="text-muted">₦${parseFloat(row.unit_cost).toLocaleString()}</td>
                        <td class="fw-bold text-danger">CANCELLED / ${row.supply_status}</td>
                        <td class="text-end pe-4">
                            <button class="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold" onclick="openQueryModal(${row.id || row.base_product_id}, 'unassigned_sba')"><i class="fa fa-question-circle me-1"></i> Query</button>
                        </td>
                    </tr>`;
                } else {
                    html += `
                    <tr>
                        <td class="ps-4 fw-bold text-dark">${row.product_name}</td>
                        <td>${sessionInfo}</td>
                        <td><span class="badge bg-light text-dark shadow-sm px-3 py-2 border">${row.total_qty} units</span></td>
                        <td class="text-muted">₦${parseFloat(row.unit_cost).toLocaleString()}</td>
                        <td class="fw-bold text-success">₦${total.toLocaleString()}</td>
                        <td class="text-end pe-4">
                            ${row.assign_status === 'unassigned' ? `<span class="badge bg-warning mb-1 d-block text-dark">FRESH ASSIGNMENT</span>` : (row.assign_status === 'sbaRejected' || row.supply_status === 'QArejected' ? `<span class="badge bg-danger mb-1 d-block">REJECTED</span>` : '')}
                            <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold mb-1" onclick="openAssignModal(${row.base_product_id}, '${row.product_name}', ${row.total_qty}, ${row.unit_cost})">Resolve (Assign)</button>
                            <button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" title="Query" onclick="openQueryModal(${row.id || row.base_product_id}, 'unassigned_sba')"><i class="fa fa-question text-dark"></i></button>
                        </td>
                    </tr>`;
                }
            });
        } else {
            html = '<tr><td colspan="6" class="text-center p-4 text-muted">No pending product groupings.</td></tr>';
        }
        $('#unassignedList').html(html);
    }

    function renderAssigned(data) {
        let html = '';
        if(data.length > 0) {
            data.forEach(row => {
                const total = row.total_qty * row.unit_cost;
                const sessionInfo = row.session_id ? `<span class="badge bg-secondary-subtle text-secondary border">${row.session_id}</span>` : `<span class="badge bg-light text-dark border">None</span>`;
                const approveBadge = row.assign_status === 'approved' ? '<span class="badge bg-success">Approved</span>' : '<span class="badge bg-warning">Pending</span>';
                
                let supplyBadgeClass = 'warning';
                if(row.supply_status === 'supplied') supplyBadgeClass = 'info';
                if(row.supply_status === 'QApassed') supplyBadgeClass = 'primary';
                if(row.supply_status === 'QArisk') supplyBadgeClass = 'danger';
                if(row.supply_status === 'completed') supplyBadgeClass = 'success';

                let actionHtml = '';
                if(row.assign_status === 'approved' && row.supply_status === 'supplied') {
                    actionHtml = `<button class="btn btn-success btn-sm px-3 rounded-pill shadow-sm me-1" onclick="openQAModal(${row.id})"><i class="fa fa-check-double me-1"></i> QA Report</button>`;
                } else if(row.supply_status === 'QApassed') {
                    actionHtml = `<small class="text-muted me-2"><i class="fa fa-hourglass-half me-1"></i>Awaiting Admin Finance</small>`;
                } else if(row.supply_status === 'completed') {
                    actionHtml = `<span class="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 me-1"><i class="fa fa-check me-1"></i> Remittance Queued</span>`;
                } else if(row.assign_status === 'hanging') {
                    actionHtml = `<small class="text-danger fw-bold me-2"><i class="fa fa-flag me-1"></i>Hanging / Flagged</small>`;
                } else if(row.assign_status === 'pending' || row.assign_status === 'sbaAck') {
                    actionHtml = `<small class="text-muted me-2">Awaiting Admin Approval...</small>`;
                }
                
                actionHtml += `<button class="btn btn-light border btn-sm rounded-circle shadow-sm ms-1" title="Query" onclick="openQueryModal(${row.id}, 'assigned_sba')"><i class="fa fa-question text-dark"></i></button>`;

                html += `
                <tr class="${row.supply_status === 'completed' ? 'bg-success bg-opacity-10' : ''}">
                    <td class="ps-4 fw-bold">${row.sba_name}</td>
                    <td><span class="d-block fw-bold">${row.product_name}</span><span class="text-muted small">${row.total_qty} units @ ₦${row.unit_cost}</span></td>
                    <td>${sessionInfo}</td>
                    <td class="fw-bold text-success">₦${total.toLocaleString()}</td>
                    <td>${approveBadge}</td>
                    <td><span class="badge bg-${supplyBadgeClass} px-2 py-1">${row.supply_status}</span></td>
                    <td class="text-end pe-4">${actionHtml}</td>
                </tr>`;
            });
        }
        $('#assignedList').html(html);
    }

    function openAssignModal(bp_id, name, qty, cost) {
        $('#a_bp_id').val(bp_id);
        $('#a_qty').val(qty);
        $('#a_cost').val(cost);
        $('#a_prod_name').val(name);
        $('#assignModal').modal('show');
    }

    function openQAModal(id) {
        $('#qa_sba_id').val(id);
        $('#qaModal').modal('show');
    }

    function submitSbaAssignment() {
        const payload = {
            base_product_id: $('#a_bp_id').val(),
            sba_id: $('#a_sba_id').val(),
            total_qty: $('#a_qty').val(),
            unit_cost: $('#a_cost').val()
        };

        if(!payload.sba_id) return alert('Select SBA');

        $.post('index.php/api/whm/sba-assign', payload, function(res) {
            alert(res.message);
            $('#assignModal').modal('hide');
            loadSbaData();
        });
    }

    function submitQA() {
        const payload = {
            id: $('#qa_sba_id').val(),
            status: $('#qa_assessment').val(),
            note: $('#qa_notes').val()
        };

        $.post('index.php/api/whm/sba-supply-status', payload, function(res) {
            alert(res.message);
            $('#qaModal').modal('hide');
            loadSbaData();
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
