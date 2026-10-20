<?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Query Management Hub | AreaBazaar Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css?v=1772656066.00796" rel="stylesheet">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'Admin User', 'role' => 'Admin', 'type' => 'staff']);
?>
    </script>
    <style>
        body { background: #f8fafc; }
        .sidebar { min-height: 100vh; background: #0f172a; color: white; }
        .nav-link { color: #94a3b8; transition: all 0.2s; }
        .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
        .query-card { background: white; border: none; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: box-shadow 0.2s; cursor: pointer; }
        .query-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
        .priority-critical { border-left: 4px solid #ef4444; }
        .priority-high     { border-left: 4px solid #f97316; }
        .priority-normal   { border-left: 4px solid #3b82f6; }
        .priority-low      { border-left: 4px solid #94a3b8; }
        .filter-bar { background: white; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.25rem; margin-bottom: 1.5rem; }
        .thread-msg { background: #f8fafc; border-radius: 0.75rem; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid #e2e8f0; }
        .thread-msg.own { background: #eff6ff; border-left-color: #3b82f6; }
        .badge-priority-Critical { background: #fee2e2; color: #b91c1c; }
        .badge-priority-High { background: #ffedd5; color: #c2410c; }
        .badge-priority-Normal { background: #dbeafe; color: #1d4ed8; }
        .badge-priority-Low { background: #f1f5f9; color: #64748b; }
        .stat-card { background: white; border-radius: 1rem; padding: 1.25rem 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    </style>
</head>
<body>
<div class="container-fluid p-0">
    <div class="row g-0">
        <!-- Sidebar -->
        <div class="col-md-2 sidebar p-4">
            <h4 class="fw-bold mb-4">Admin Dashboard</h4>
            <nav class="nav flex-column">
                <a class="nav-link text-white-50 mb-2" href="admin_dashboard.php"><i class="fa fa-chart-pie me-2"></i> Overview</a>
                <a class="nav-link text-white-50 mb-2" href="admin_global_orders.php"><i class="fa fa-globe me-2"></i> Global Orders</a>
                <a class="nav-link text-white-50 mb-2" href="admin_dispatch.php"><i class="fa fa-truck-fast me-2"></i> Logistics &amp; Dispatch</a>
                <a class="nav-link text-white-50 mb-2" href="admin_inventory.php"><i class="fa fa-boxes-stacked me-2"></i> Inventory Tracking</a>
                <a class="nav-link text-white-50 mb-2" href="admin_finance.php"><i class="fa fa-vault me-2"></i> Finance Hub</a>
                <a class="nav-link text-white-50 mb-2" href="admin_auctions.php"><i class="fa fa-gavel me-2"></i> Auction Configs</a>
                <a class="nav-link text-white-50 mb-2" href="admin_active_sessions.php"><i class="fa fa-tower-broadcast me-2"></i> Live Sessions</a>
                <a class="nav-link text-white-50 mb-2" href="admin_partners.php"><i class="fa fa-handshake me-2"></i> Partner Approvals</a>
                <a class="nav-link text-white-50 mb-2" href="admin_oversight.php"><i class="fa fa-shield-halved me-2"></i> SA Oversight</a>
                <a class="nav-link active mb-2" href="admin_queries.php"><i class="fa fa-comments me-2"></i> Query Hub</a>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="col-md-10 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 class="fw-bold text-dark mb-1"><i class="fa fa-comments text-primary me-2"></i>Query Management Hub</h3>
                    <p class="text-muted small mb-0">Manage, assign, respond to, and close query threads across all user types.</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary btn-sm" onclick="loadQueries()"><i class="fa fa-sync me-1"></i> Refresh</button>
                    <button class="btn btn-primary btn-sm" onclick="openAuditModal()"><i class="fa fa-scroll me-1"></i> Audit Log</button>
                </div>
            </div>

            <!-- Stats Row -->
            <div class="row g-3 mb-4" id="statsRow">
                <div class="col-md-3"><div class="stat-card"><div class="text-muted small fw-bold">OPEN QUERIES</div><h3 class="fw-bold mb-0 text-primary" id="stat-open">–</h3></div></div>
                <div class="col-md-3"><div class="stat-card"><div class="text-muted small fw-bold">CRITICAL / HIGH</div><h3 class="fw-bold mb-0 text-danger" id="stat-critical">–</h3></div></div>
                <div class="col-md-3"><div class="stat-card"><div class="text-muted small fw-bold">UNASSIGNED</div><h3 class="fw-bold mb-0 text-warning" id="stat-unassigned">–</h3></div></div>
                <div class="col-md-3"><div class="stat-card"><div class="text-muted small fw-bold">CLOSED (7 DAYS)</div><h3 class="fw-bold mb-0 text-success" id="stat-closed">–</h3></div></div>
            </div>

            <!-- Filters -->
            <div class="filter-bar">
                <div class="row g-3 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted mb-1">Status</label>
                        <select id="filterStatus" class="form-select form-select-sm border-0 bg-light" onchange="loadQueries()">
                            <option value="">All Statuses</option>
                            <option value="Open" selected>Open</option>
                            <option value="Closed">Closed</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted mb-1">Priority</label>
                        <select id="filterPriority" class="form-select form-select-sm border-0 bg-light" onchange="loadQueries()">
                            <option value="">All Priorities</option>
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Normal">Normal</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted mb-1">Subject Type</label>
                        <select id="filterType" class="form-select form-select-sm border-0 bg-light" onchange="loadQueries()">
                            <option value="">All Types</option>
                            <option value="Order">Order</option>
                            <option value="Product">Product</option>
                            <option value="Partner">Partner</option>
                            <option value="General">General</option>
                            <option value="Global">Global</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted mb-1">Search</label>
                        <input type="text" id="filterSearch" class="form-control form-control-sm border-0 bg-light" placeholder="Search queries..." oninput="debounceLoad()">
                    </div>
                </div>
            </div>

            <!-- Query List -->
            <div id="queryList">
                <div class="text-center py-5 text-muted"><i class="fa fa-spinner fa-spin me-2"></i> Loading queries...</div>
            </div>
        </div>
    </div>
</div>

<!-- === Thread Detail Modal === -->
<div class="modal fade" id="threadModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold"><i class="fa fa-comments text-primary me-2"></i>Query Thread</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="row g-4">
                    <!-- Thread Messages -->
                    <div class="col-md-8">
                        <div id="threadMessages" class="mb-3" style="max-height: 480px; overflow-y: auto;"></div>
                        <!-- Response Form -->
                        <div id="responseForm" class="border-top pt-3">
                            <label class="form-label small fw-bold text-muted">Your Response</label>
                            <textarea id="responseText" class="form-control border-2 mb-2" rows="3" placeholder="Type your response..."></textarea>
                            <div class="row g-2 mb-2">
                                <div class="col-md-6">
                                    <label class="form-label small text-muted">Assign Thread To</label>
                                    <select id="assignTo" class="form-select form-select-sm">
                                        <option value="">No assignment change</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small text-muted">Set Priority</label>
                                    <select id="setPriority" class="form-select form-select-sm">
                                        <option value="">No change</option>
                                        <option value="Low">Low</option>
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm px-4 fw-bold" onclick="submitResponse()"><i class="fa fa-reply me-1"></i> Send Response</button>
                                <button class="btn btn-success btn-sm px-3" onclick="closeThread()"><i class="fa fa-check-circle me-1"></i> Close Thread</button>
                                <button class="btn btn-outline-danger btn-sm px-3" onclick="forceCloseModal()"><i class="fa fa-bolt me-1"></i> Force Close</button>
                            </div>
                        </div>
                    </div>
                    <!-- Thread Meta Panel -->
                    <div class="col-md-4">
                        <div class="bg-light rounded-3 p-3 mb-3">
                            <h6 class="fw-bold small text-uppercase text-muted mb-3">Thread Details</h6>
                            <div id="threadMeta"></div>
                        </div>
                        <!-- Internal Notes -->
                        <div class="bg-light rounded-3 p-3">
                            <h6 class="fw-bold small text-uppercase text-muted mb-2">Internal Notes</h6>
                            <div id="threadNotes" class="mb-2" style="max-height: 150px; overflow-y: auto;"></div>
                            <textarea id="noteText" class="form-control form-control-sm border-0 mb-1" rows="2" placeholder="Add internal note..."></textarea>
                            <button class="btn btn-outline-secondary btn-sm w-100" onclick="addNote()"><i class="fa fa-sticky-note me-1"></i> Add Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Force Close Modal -->
<div class="modal fade" id="forceCloseModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0">
                <h5 class="modal-title fw-bold text-danger"><i class="fa fa-bolt me-2"></i>Force Close Cold Thread</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <p class="text-muted small">This will force-close the query thread with an audit log entry. Action requires your password verification.</p>
                <div class="mb-3">
                    <label class="form-label fw-bold small">Reason for Force Closure</label>
                    <textarea id="forceCloseReason" class="form-control border-2" rows="2" placeholder="Provide a brief reason..."></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold small">Your Password</label>
                    <input type="password" id="forceClosePassword" class="form-control border-2" placeholder="Confirm with your password">
                </div>
            </div>
            <div class="modal-footer border-0">
                <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                <button class="btn btn-danger fw-bold" onclick="submitForceClose()"><i class="fa fa-bolt me-1"></i> Execute Force Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Audit Log Modal -->
<div class="modal fade" id="auditModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-0">
                <h5 class="modal-title fw-bold"><i class="fa fa-scroll me-2 text-info"></i>Query Audit Log</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div id="auditBody"><div class="text-center py-4 text-muted"><i class="fa fa-spinner fa-spin"></i> Loading...</div></div>
            </div>
        </div>
    </div>
</div>

<!-- Global Query Modal (for floating button) -->
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

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/global.js?v=1772652487"></script>
    <script>
    window.notifPollInterval = 30000;

    let _activeQueryId = null;
    let _debTimer = null;

    function debounceLoad() { clearTimeout(_debTimer); _debTimer = setTimeout(loadQueries, 400); }

    function openQueryModal(id, type) {
        $("#queryItemId").val(id);
        $("#queryType").val(type || "General");
        $("#queryMessage").val("");
        $("#queryModal").modal("show");
    }

    function submitQueryAction() {
        var id = $("#queryItemId").val();
        var type = $("#queryType").val();
        var msg = $("#queryMessage").val();
        if (!msg) return alert("Message is required.");
        window.submitQueryAction(type || 'General', id || 0, msg);
        $("#queryModal").modal("hide");
    }

    // ---- Load Queries ----
    function loadQueries() {
        const status   = $('#filterStatus').val();
        const priority = $('#filterPriority').val();
        const type     = $('#filterType').val();
        const search   = $('#filterSearch').val();

        $('#queryList').html('<div class="text-center py-5 text-muted"><i class="fa fa-spinner fa-spin me-2"></i>Loading...</div>');

        $.get('index.php/api/queries/list', { status, priority, subject_type: type, search }, function(res) {
            if (res.status !== 'success') {
                $('#queryList').html('<div class="alert alert-danger">Failed to load queries.</div>');
                return;
            }
            const items = res.data || [];
            updateStats(items);

            if (!items.length) {
                $('#queryList').html('<div class="text-center py-5 text-muted"><i class="fa fa-comments fa-2x mb-3 d-block opacity-25"></i>No queries found matching your filters.</div>');
                return;
            }

            let html = '<div class="row g-3">';
            items.forEach(q => {
                const pClass = `priority-${q.priority || 'Normal'}`;
                const pBadge = `badge-priority-${q.priority || 'Normal'}`;
                const elapsed = q.last_activity ? timeSince(q.last_activity) : '—';
                html += `
                <div class="col-md-6 col-lg-4">
                    <div class="query-card p-3 ${pClass}" onclick="openThreadModal(${q.id})">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge ${pBadge} rounded-pill px-2 py-1 small">${q.priority || 'Normal'}</span>
                            <span class="badge bg-light text-dark border small">${q.subject_type || 'General'}</span>
                        </div>
                        <p class="small mb-2 text-dark">${(q.note || '').substring(0, 90)}${(q.note || '').length > 90 ? '…' : ''}</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <small class="text-muted"><i class="fa fa-clock me-1"></i>${elapsed}</small>
                            <small class="text-muted">${q.assigned_to_name ? '<i class="fa fa-user me-1"></i>' + q.assigned_to_name : '<span class="text-warning">Unassigned</span>'}</small>
                        </div>
                        <div class="mt-1"><span class="badge ${q.status === 'Open' ? 'bg-success' : q.status === 'Closed' ? 'bg-secondary' : 'bg-dark'} small">${q.status}</span></div>
                    </div>
                </div>`;
            });
            html += '</div>';
            $('#queryList').html(html);
        }).fail(() => {
            $('#queryList').html('<div class="alert alert-danger">Server error loading queries.</div>');
        });
    }

    function updateStats(items) {
        $('#stat-open').text(items.filter(q => q.status === 'Open').length);
        $('#stat-critical').text(items.filter(q => q.priority === 'Critical' || q.priority === 'High').length);
        $('#stat-unassigned').text(items.filter(q => !q.assigned_to).length);
        $('#stat-closed').text(items.filter(q => q.status === 'Closed').length);
    }

    // ---- Thread Modal ----
    function openThreadModal(qId) {
        _activeQueryId = qId;
        $('#threadMessages').html('<div class="text-center py-3 text-muted"><i class="fa fa-spinner fa-spin"></i></div>');
        $('#threadMeta').html('');
        $('#threadNotes').html('');
        $('#responseText').val('');
        $('#noteText').val('');
        $('#threadModal').modal('show');
        loadThreadDetail(qId);
        loadStaffList();
    }

    function loadThreadDetail(qId) {
        $.get('index.php/api/queries/thread', { query_id: qId }, function(res) {
            if (res.status !== 'success') {
                $('#threadMessages').html('<div class="alert alert-danger">Failed to load thread.</div>');
                return;
            }
            const q = res.data.query;
            const responses = res.data.responses || [];
            //const notes = res.data.responses.notes || []; // get notes from responses when needed.

            // Meta panel
            const metaHtml = `
                <div class="mb-2"><small class="text-muted fw-bold">ID:</small> <small>#${q.id}</small></div>
                <div class="mb-2"><small class="text-muted fw-bold">Type:</small> <small>${q.subject_type}</small></div>
                <div class="mb-2"><small class="text-muted fw-bold">Status:</small> <small><span class="badge ${q.status === 'Open' ? 'bg-success' : 'bg-secondary'}">${q.status}</span></small></div>
                <div class="mb-2"><small class="text-muted fw-bold">Priority:</small> <small><span class="badge badge-priority-${q.priority}">${q.priority || 'Normal'}</span></small></div>
                <div class="mb-2"><small class="text-muted fw-bold">Submitted by:</small> <small>${q.submitter_name || 'Unknown'} (${q.submitter_role || '—'})</small></div>
                <div class="mb-2"><small class="text-muted fw-bold">Assigned to:</small> <small>${q.assigned_to_name || '<span class="text-warning">Unassigned</span>'}</small></div>
                <div class="mb-2"><small class="text-muted fw-bold">Last Activity:</small> <small>${q.last_activity ? timeSince(q.last_activity) + ' ago' : '—'}</small></div>
                <div class="mb-0"><small class="text-muted fw-bold">Created:</small> <small>${(q.time_created || '').substring(0, 16)}</small></div>`;
            $('#threadMeta').html(metaHtml);

            // Show/hide response form based on status
            if (q.status !== 'Open') {
                $('#responseForm').html('<div class="alert alert-secondary py-2 small"><i class="fa fa-lock me-1"></i> Thread is closed. No further responses.</div>');
            }

            // Messages
            let msgHtml = `<div class="thread-msg own"><div class="d-flex justify-content-between mb-1"><small class="fw-bold text-primary">${q.submitter_name || 'User'}</small><small class="text-muted">${(q.time_created || '').substring(0, 16)}</small></div><p class="mb-0 small">${q.note}</p></div>`;
            responses.forEach(r => {
                const isOwn = (window.currentUser && r.responder_id === window.currentUser.id);
                msgHtml += `<div class="thread-msg${isOwn ? ' own' : ''}"><div class="d-flex justify-content-between mb-1"><small class="fw-bold ${isOwn ? 'text-primary' : 'text-dark'}">${r.responder_name || 'Staff'} <span class="text-muted fw-normal">(${r.responder_role || '—'})</span></small><small class="text-muted">${(r.time_created || '').substring(0, 16)}</small></div><p class="mb-0 small">${r.response_text}</p>${r.assigned_to_name ? `<small class="text-muted"><i class="fa fa-arrow-right me-1"></i>Assigned to: ${r.assigned_to_name}</small>` : ''}</div>`;
            });
            $('#threadMessages').html(msgHtml);

            // Notes

            // get notes from responses
            let notes = [];
            responses.forEach(r => {
                if (r.notes) {
                    notes = notes.concat(r.notes);
                }
            });
            let notesHtml = notes.length ? '' : '<p class="text-muted small">No internal notes yet.</p>';
            notes.forEach(n => {
                notesHtml += `<div class="bg-white rounded p-2 mb-1 border"><small class="text-muted">${n.author_name || 'Staff'}: </small><small>${n.note_text}</small></div>`;
            });
            $('#threadNotes').html(notesHtml);

        }).fail(() => $('#threadMessages').html('<div class="alert alert-danger">Server error.</div>'));
    }

    function loadStaffList() {
        $('#assignTo').html('<option value="">No assignment change</option>');
        $.get('index.php/api/staff/list', function(res) {
            if (res.status === 'success') {
                res.data.forEach(s => {
                    $('#assignTo').append(`<option value="${s.id}">${s.name || s.first_name} [${s.role}]</option>`);
                });
            }
        });
    }

    function submitResponse() {
        const text = $('#responseText').val().trim();
        if (!text) return alert('Response text is required.');
        const assignTo   = $('#assignTo').val();
        const priority   = $('#setPriority').val();

        $.post('index.php/api/queries/respond', {
            query_id:   _activeQueryId,
            response:   text,
            assign_to:  assignTo || null,
            priority:   priority || null
        }, function(res) {
            if (res.status === 'success') {
                $('#responseText').val('');
                loadThreadDetail(_activeQueryId);
                loadQueries();
            } else alert(res.message || 'Failed to send response.');
        }).fail(() => alert('Server error.'));
    }

    function closeThread() {
        if (!confirm('Close this query thread? The originating user will be notified.')) return;
        $.post('index.php/api/queries/close', { query_id: _activeQueryId }, function(res) {
            if (res.status === 'success') {
                $('#threadModal').modal('hide');
                loadQueries();
            } else alert(res.message || 'Failed to close thread.');
        });
    }

    function forceCloseModal() {
        $('#forceCloseReason').val('');
        $('#forceClosePassword').val('');
        $('#forceCloseModal').modal('show');
    }

    function submitForceClose() {
        const reason = $('#forceCloseReason').val().trim();
        const password = $('#forceClosePassword').val();
        if (!reason || !password) return alert('Reason and password are required.');
        $.post('index.php/api/queries/force-close', { query_id: _activeQueryId, reason, password }, function(res) {
            if (res.status === 'success') {
                $('#forceCloseModal').modal('hide');
                $('#threadModal').modal('hide');
                loadQueries();
                alert('Thread force-closed and audit logged.');
            } else alert(res.message || 'Force close failed.');
        }).fail(() => alert('Server error.'));
    }

    function addNote() {
        const note = $('#noteText').val().trim();
        if (!note) return;
        $.post('index.php/api/queries/add-note', { query_id: _activeQueryId, note }, function(res) {
            if (res.status === 'success') {
                $('#noteText').val('');
                loadThreadDetail(_activeQueryId);
            } else alert(res.message || 'Failed to add note.');
        });
    }

    // ---- Audit Log ----
    function openAuditModal() {
        $('#auditBody').html('<div class="text-center py-4 text-muted"><i class="fa fa-spinner fa-spin"></i> Loading...</div>');
        $('#auditModal').modal('show');
        $.get('index.php/api/queries/audit-log', function(res) {
            if (res.status !== 'success' || !res.data.length) {
                $('#auditBody').html('<p class="text-muted text-center py-4">No audit records found.</p>');
                return;
            }
            let html = '<table class="table table-sm table-hover"><thead><tr><th>Query #</th><th>Action</th><th>By</th><th>When</th><th>Notes</th></tr></thead><tbody>';
            res.data.forEach(a => {
                html += `<tr><td>#${a.query_id}</td><td><span class="badge bg-secondary">${a.action}</span></td><td>${a.actor_name || '—'}</td><td class="small text-muted">${(a.time_created || '').substring(0, 16)}</td><td class="small">${a.note || '—'}</td></tr>`;
            });
            html += '</tbody></table>';
            $('#auditBody').html(html);
        }).fail(() => $('#auditBody').html('<div class="alert alert-danger">Failed to load audit log.</div>'));
    }

    // ---- Utility ----
    function timeSince(dateStr) {
        const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (diff < 60) return diff + 's';
        if (diff < 3600) return Math.floor(diff / 60) + 'm';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h';
        return Math.floor(diff / 86400) + 'd';
    }

    $(document).ready(function() {
        loadQueries();
    });
</script>
</body>
</html>
