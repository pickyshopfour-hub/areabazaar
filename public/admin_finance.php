<?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';

$db = (new Database())->getConnection();

// Quick Summary Stats
$stats = [
    'pending_bank' => $db->query("SELECT COUNT(*) FROM bank_reports WHERE status = 'Unreconciled'")->fetchColumn(),
    'orphaned_bank' => $db->query("SELECT COUNT(*) FROM bank_reports WHERE status = 'orphaned'")->fetchColumn(),
    'pending_reports' => $db->query("SELECT COUNT(*) FROM payment_reports WHERE status = 'Pending'")->fetchColumn(),
    'pending_requests' => $db->query("SELECT COUNT(*) FROM payment_requests WHERE status = 'Pending'")->fetchColumn(),
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance & Payments | AreaBazaar Admin</title>
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
        body { background: #f8fafc; }
        .sidebar { min-height: 100vh; background: #0f172a; color: white; }
        .nav-link { color: #94a3b8; transition: all 0.2s; }
        .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
        .dash-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 1.5rem 0; margin-bottom: 1.5rem; border-bottom: 4px solid #10b981; }
        .stat-pill { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 0.4rem 1rem; font-size: 0.85rem; }
        .stat-pill .count { font-weight: 700; font-size: 1.1rem; }
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
                    <a class="nav-link text-white-50 mb-2" href="admin_dispatch.php"><i class="fa fa-truck-fast me-2"></i> Logistics & Dispatch</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_inventory.php"><i class="fa fa-boxes-stacked me-2"></i> Inventory Tracking</a>
                    <a class="nav-link active mb-2" href="admin_finance.php"><i class="fa fa-vault me-2"></i> Finance Hub</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_auctions.php"><i class="fa fa-gavel me-2"></i> Auction Configs</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_active_sessions.php"><i class="fa fa-tower-broadcast me-2"></i> Live Sessions</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_partners.php"><i class="fa fa-handshake me-2"></i> Partner Approvals</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_oversight.php"><i class="fa fa-shield-halved me-2"></i> SA Oversight</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_queries.php"><i class="fa fa-comments me-2"></i> Query Hub</a>
                </nav>
        </div>

        <!-- Main Content -->
        <div class="col-md-10">
            <div class="dash-header shadow-sm mt-0 px-4">
                <div class="container-fluid">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h2 class="fw-bold mb-1"><i class="fa fa-wallet me-2 text-success"></i> Finance Ops</h2>
                            <p class="text-white-50 mb-0">Bank Reconciliation, Reports & Verification</p>
                        </div>
                        <div class="d-flex gap-2 flex-wrap align-items-center">
                            <span class="stat-pill text-warning"><i class="fa fa-clock"></i> Pend. Reports <span class="count"><?php echo $stats['pending_reports']; ?></span></span>
                            <span class="stat-pill text-info"><i class="fa fa-file-invoice"></i> Pend. Requests <span class="count"><?php echo $stats['pending_requests']; ?></span></span>
                            <span class="stat-pill text-danger"><i class="fa fa-triangle-exclamation"></i> Orphaned Syncs <span class="count"><?php echo $stats['orphaned_bank']; ?></span></span>
                            <div id="notifBellContainer" class="ms-2"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-fluid p-4">
                <ul class="nav nav-tabs fw-semibold mb-4 border-bottom-0 shadow-sm bg-white rounded-top" role="tablist">
                    <li class="nav-item">
                        <button class="nav-link active px-4 py-3 text-dark border-0 border-bottom border-3 border-success" data-bs-toggle="tab" data-bs-target="#bankReports" type="button">
                            <i class="fa fa-building-columns me-2"></i> Bank Reports (Gmail Sync)
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link px-4 py-3 text-muted border-0" data-bs-toggle="tab" data-bs-target="#customerReports" type="button" onclick="loadCustomerReports()">
                            <i class="fa fa-users me-2"></i> Customer Payment Reports
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link px-4 py-3 text-muted border-0" data-bs-toggle="tab" data-bs-target="#agentReports" type="button" onclick="loadAgentReports()">
                            <i class="fa fa-user-tie me-2"></i> Agent (FRM) Remittances
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link px-4 py-3 text-muted border-0" data-bs-toggle="tab" data-bs-target="#paymentRequests" type="button" onclick="loadPaymentRequests()">
                            <i class="fa fa-file-invoice-dollar me-2"></i> Payment Requests
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link px-4 py-3 text-muted border-0" data-bs-toggle="tab" data-bs-target="#manualRecon" type="button" onclick="renderManualRecon()">
                            <i class="fa fa-link me-2"></i> Orphan Reconciliation
                        </button>
                    </li>
                </ul>

                <div class="tab-content bg-white p-4 shadow-sm rounded-bottom">
                    <!-- Bank Reports Sync -->
                    <div class="tab-pane fade show active" id="bankReports">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold mb-0">Synced Bank Reports</h5>
                            <div>
                                <button class="btn btn-outline-secondary rounded-pill px-3 shadow-sm me-2" onclick="loadBankReports()"><i class="fa fa-refresh"></i></button>
                                <button class="btn btn-success rounded-pill px-4 shadow-sm" onclick="syncBank()"><i class="fa fa-rotate me-2"></i> Sync from Gmail via Google Apps</button>
                            </div>
                        </div>
                        <div class="mb-3 d-flex gap-2 filter-tabs" id="bankFilter">
                            <button class="btn btn-sm btn-dark rounded-pill px-3" onclick="setFilter('bank', 'All')">All</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('bank', 'Unreconciled')">Unreconciled</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('bank', 'Reconciled')">Reconciled</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('bank', 'orphaned')">Orphaned</button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light text-secondary text-uppercase small">
                                    <tr>
                                        <th>Date</th>
                                        <th>Bank Ref</th>
                                        <th>Amount</th>
                                        <th>Narration (Details)</th>
                                        <th>Match Status</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="bankReportsBody">
                                    <tr><td colspan="6" class="text-center text-muted py-4"><span class="spinner-border spinner-border-sm me-2"></span>Loading synced data...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Customer Reports -->
                    <div class="tab-pane fade" id="customerReports">
                         <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold mb-0">Customer Declarations</h5>
                            <button class="btn btn-outline-secondary rounded-pill px-3 shadow-sm" onclick="loadCustomerReports()"><i class="fa fa-refresh"></i></button>
                        </div>
                        <div class="mb-3 d-flex gap-2 filter-tabs" id="custFilter" style="overflow-x: auto; white-space: nowrap;">
                            <button class="btn btn-sm btn-dark rounded-pill px-3" onclick="setFilter('customer', 'All')">All</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('customer', 'Pending')">Pending</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('customer', 'Matched')">Matched</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('customer', 'AwaitingAdminApproval')">Awaiting Oversight</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('customer', 'verified')">Verified</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('customer', 'Flagged')">Flagged</button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light text-secondary text-uppercase small">
                                    <tr>
                                        <th>Date</th>
                                        <th>Inv Ref</th>
                                        <th>Sender Name</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="customerReportsBody">
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Agent Reports -->
                    <div class="tab-pane fade" id="agentReports">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold mb-0">FRM Agent Declarations</h5>
                            <button class="btn btn-outline-secondary rounded-pill px-3 shadow-sm" onclick="loadAgentReports()"><i class="fa fa-refresh"></i></button>
                        </div>
                        <div class="mb-3 d-flex gap-2 filter-tabs" id="agentFilter" style="overflow-x: auto; white-space: nowrap;">
                            <button class="btn btn-sm btn-dark rounded-pill px-3" onclick="setFilter('agent', 'All')">All</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('agent', 'Pending')">Pending Check</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('agent', 'unremitted')">Unremitted</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('agent', 'Matched')">Matched</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('agent', 'AwaitingAdminApproval')">Awaiting Oversight</button>
                            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="setFilter('agent', 'verified')">Verified</button>
                        </div>
                         <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light text-secondary text-uppercase small">
                                    <tr>
                                        <th>Date</th>
                                        <th>Group Ref / Inv Ref</th>
                                        <th>Agent Name</th>
                                        <th>Remitted Amount</th>
                                        <th>Status</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="agentReportsBody">
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Payment Requests -->
                    <div class="tab-pane fade" id="paymentRequests">
                         <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold mb-0">Active Payment Requests</h5>
                            <button class="btn btn-outline-secondary rounded-pill px-3 shadow-sm" onclick="loadPaymentRequests()"><i class="fa fa-refresh"></i></button>
                        </div>
                         <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light text-secondary text-uppercase small">
                                    <tr>
                                        <th>Date Created</th>
                                        <th>Inv Ref</th>
                                        <th>User ID</th>
                                        <th>Target Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="paymentRequestsBody">
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Manual Reconciliation (Orphans) -->
                    <div class="tab-pane fade" id="manualRecon">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold mb-0">Manual Bank Reconciliation</h5>
                            <button class="btn btn-outline-secondary rounded-pill px-3 shadow-sm" onclick="loadBankReports(); loadCustomerReports(); loadAgentReports(); setTimeout(renderManualRecon, 1000)"><i class="fa fa-refresh"></i> Refresh Lists</button>
                        </div>
                        <div class="row gx-4">
                            <div class="col-md-6 border-end">
                                <h6 class="fw-bold text-danger mb-3"><i class="fa fa-triangle-exclamation me-2"></i>Orphaned / Unmatched Bank Syncs</h6>
                                <div class="bg-light p-3 rounded" style="max-height: 500px; overflow-y: auto;">
                                    <ul class="list-group" id="reconBankList">
                                        <!-- Rendered via JS -->
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6 class="fw-bold text-warning mb-3"><i class="fa fa-clock me-2"></i>Pending Declarations (Cust/Agent)</h6>
                                <div class="bg-light p-3 rounded" style="max-height: 500px; overflow-y: auto;">
                                    <ul class="list-group" id="reconReportList">
                                        <!-- Rendered via JS -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modals -->
<!-- Bank Report View Modal -->
<div class="modal fade" id="viewBankModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
            <div class="modal-header border-0 p-4">
                <h5 class="modal-title fw-bold">Bank Report Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4 pt-0">
                <div class="p-3 bg-light rounded mb-3">
                    <strong class="d-block mb-1 text-muted small text-uppercase">Bank Ref</strong>
                    <div id="vbRef" class="fs-5 mb-2"></div>
                    <strong class="d-block mb-1 text-muted small text-uppercase">Amount</strong>
                    <div id="vbAmount" class="fs-4 text-success fw-bold mb-2"></div>
                    <strong class="d-block mb-1 text-muted small text-uppercase">Date</strong>
                    <div id="vbDate" class="mb-2"></div>
                    <strong class="d-block mb-1 text-muted small text-uppercase">Status</strong>
                    <div id="vbStatus" class="mb-0"></div>
                </div>
                <strong class="d-block mb-1 text-muted small text-uppercase">Raw Narration</strong>
                <div id="vbNarration" class="p-3 bg-dark text-light rounded font-monospace small" style="word-break: break-all;"></div>
            </div>
        </div>
    </div>
</div>

<!-- Payment Report View Modal -->
<div class="modal fade" id="viewReportModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
            <div class="modal-header border-0 p-4">
                <h5 class="modal-title fw-bold">Payment Declaration Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4 pt-0">
                <div class="p-3 bg-light rounded mb-3">
                    <div class="row">
                        <div class="col-6 mb-3">
                            <strong class="text-muted small text-uppercase d-block">Invoice Ref</strong>
                            <span id="vrRef"></span>
                        </div>
                        <div class="col-6 mb-3">
                            <strong class="text-muted small text-uppercase d-block">Sender Name</strong>
                            <span id="vrSender"></span>
                        </div>
                        <div class="col-6 mb-3">
                            <strong class="text-muted small text-uppercase d-block">Amount</strong>
                            <span id="vrAmount" class="text-success fw-bold"></span>
                        </div>
                        <div class="col-6 mb-3">
                            <strong class="text-muted small text-uppercase d-block">Date Displayed</strong>
                            <span id="vrDate"></span>
                        </div>
                            <div class="col-6 mb-0">
                            <strong class="text-muted small text-uppercase d-block">Status</strong>
                            <span id="vrStatus"></span>
                        </div>
                    </div>
                </div>
                
                <div id="vrActions" class="d-flex gap-2">
                    <!-- actions populated by JS -->
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Verify Modal -->
<div class="modal fade" id="verifyModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
            <form id="verifyForm">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold text-success"><i class="fa fa-check-circle me-2"></i> Verify Payment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <div class="p-3 bg-success bg-opacity-10 text-success rounded mb-4">
                        <strong class="d-block mb-1">Verifying Invoice <span id="vfyRef"></span></strong>
                        <div class="fs-4 fw-bold">₦<span id="vfyAmount"></span></div>
                    </div>
                    <input type="hidden" id="vfyId">
                    <input type="hidden" id="vfyType">
                    <div class="mb-3">
                        <label class="form-label text-muted small text-uppercase fw-bold">Select Matching Bank Report (Optional)</label>
                        <select class="form-select" id="vfyBankMatch">
                            <option value="">-- No matching bank report / Verify manually --</option>
                        </select>
                        <small class="text-muted">Selecting an orphaned report will link and resolve both records.</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small text-uppercase fw-bold">Actual Bank Received Date</label>
                        <input type="date" class="form-control" required id="vfyDate">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small text-uppercase fw-bold">Reference / Narration Note</label>
                        <input type="text" class="form-control" required id="vfyNote" placeholder="e.g. Verified from Bank Statement">
                    </div>
                    <button type="submit" class="btn btn-success w-100 py-2">Confirm Verification</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Flag Modal -->
<div class="modal fade" id="flagModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
            <form id="flagForm">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold text-danger"><i class="fa fa-triangle-exclamation me-2"></i> Flag / Query Payment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <div class="p-3 bg-danger bg-opacity-10 text-danger rounded mb-4">
                        <strong class="d-block mb-1">Flagging Invoice <span id="flgRef"></span></strong>
                        <div class="fs-4 fw-bold">₦<span id="flgAmount"></span></div>
                    </div>
                    <input type="hidden" id="flgId">
                    <div class="mb-3">
                        <label class="form-label text-muted small text-uppercase fw-bold">Query Reason / Comment</label>
                        <textarea class="form-control" required id="flgReason" rows="3" placeholder="Explain why this is being flagged..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-danger w-100 py-2">Submit Query</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    let refreshInterval;
    window.finData = {
        bank: [], customer: [], agent: [], 
        filters: { bank: 'All', customer: 'All', agent: 'All' }
    };

    document.addEventListener('DOMContentLoaded', () => {
        loadBankReports();
        startAutoRefresh();
        
        // Tab stylings
        document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(btn => {
            btn.addEventListener('shown.bs.tab', event => {
                document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(b => {
                    b.classList.remove('text-dark', 'border-bottom', 'border-3', 'border-success');
                    b.classList.add('text-muted');
                });
                event.target.classList.remove('text-muted');
                event.target.classList.add('text-dark', 'border-bottom', 'border-3', 'border-success');
                refreshActiveTab();
            });
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAutoRefresh();
            else { refreshActiveTab(); startAutoRefresh(); }
        });

        // Form bindings
        $('#verifyForm').on('submit', function(e) {
            e.preventDefault();
            processVerification($('#vfyId').val(), 'Matched', $('#vfyNote').val());
            $('#verifyModal').modal('hide');
        });

        $('#flagForm').on('submit', function(e) {
            e.preventDefault();
            processVerification($('#flgId').val(), 'Flagged', $('#flgReason').val());
            $('#flagModal').modal('hide');
        });
    });

    function setFilter(type, val) {
        window.finData.filters[type] = val;
        
        // update unselected buttons
        const container = type === 'bank' ? '#bankFilter' : (type === 'customer' ? '#custFilter' : '#agentFilter');
        $(container).find('button').removeClass('btn-dark').addClass('btn-outline-dark');
        $(container).find(`button[onclick*="'${val}'"]`).removeClass('btn-outline-dark').addClass('btn-dark');

        if(type==='bank') renderBankReports();
        else if(type==='customer') renderReports(window.finData.customer, 'customerReportsBody', 'customer');
        else if(type==='agent') renderReports(window.finData.agent, 'agentReportsBody', 'agent');
    }

    function startAutoRefresh() {
        stopAutoRefresh();
        // 3 minutes refresh
        refreshInterval = setInterval(refreshActiveTab, 3 * 60 * 1000);
    }

    function stopAutoRefresh() {
        if(refreshInterval) clearInterval(refreshInterval);
    }

    function refreshActiveTab() {
        const activeTarget = document.querySelector('.nav-link.active').getAttribute('data-bs-target');
        if(activeTarget === '#bankReports') loadBankReports();
        else if(activeTarget === '#customerReports') loadCustomerReports();
        else if(activeTarget === '#agentReports') loadAgentReports();
        else if(activeTarget === '#paymentRequests') loadPaymentRequests();
        else if(activeTarget === '#manualRecon') renderManualRecon();
    }

    function getBadge(status) {
        if(status === 'Unreconciled' || status === 'Pending' || status === 'unremitted' || status === 'AwaitingAdminApproval') return 'warning';
        if(status === 'Reconciled' || status === 'Matched' || status === 'Resolved' || status === 'verified') return 'success';
        if(status === 'orphaned') return 'danger border border-danger text-danger bg-opacity-10';
        if(status === 'amount-mismatch' || status === 'Flagged') return 'danger';
        return 'secondary';
    }

    // --- BANK REPORTS ---
    function syncBank() {
        const btn = document.querySelector('button[onclick="syncBank()"]');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Syncing...';
        
        fetch('index.php/api/finance-admin/sync-bank', {method: 'POST'})
            .then(r => r.json())
            .then(res => {
                alert(res.message);
                setTimeout(loadBankReports, 2000); // Simulate time taken for webhook to return
            })
            .catch(e => alert('Error syncing'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa fa-rotate me-2"></i> Sync from Gmail via Google Apps';
            });
    }

    function loadBankReports() {
        document.getElementById('bankReportsBody').innerHTML = '<tr><td colspan="6" class="text-center text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading synced data...</td></tr>';
        fetch('index.php/api/finance-admin/bank-reports')
            .then(r => r.json())
            .then(res => {
                if(res.data) window.finData.bank = res.data;
                renderBankReports();
            });
    }

    function renderBankReports() {
        let html = '';
        let data = window.finData.bank;
        const filter = window.finData.filters.bank;
        
        if (filter !== 'All') {
            data = data.filter(r => r.status === filter);
        }

        if(data && data.length > 0) {
            data.forEach(r => {
                html += `
                    <tr>
                        <td class="small text-muted">${new Date(r.transaction_date).toLocaleDateString()}</td>
                        <td class="fw-bold">${r.bank_ref}</td>
                        <td class="fw-bold text-success">₦${parseFloat(r.amount).toLocaleString()}</td>
                        <td class="small text-muted" style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${r.raw_narration}">${r.raw_narration}</td>
                        <td><span class="badge bg-${getBadge(r.status)}">${r.status}</span></td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-info px-2 me-1" onclick="openQueryModal(${r.id}, 'BankReport')" title="Query Record"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-outline-primary" onclick="viewBank(${r.id})">View</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            html = '<tr><td colspan="6" class="text-center text-muted">No banked reports recorded. Hit Sync to fetch from Gmail.</td></tr>';
        }
        document.getElementById('bankReportsBody').innerHTML = html;
    }

    function viewBank(id) {
        const item = window.finData.bank.find(x => x.id == id);
        if(!item) return;
        $('#vbRef').text(item.bank_ref);
        $('#vbAmount').text('₦' + parseFloat(item.amount).toLocaleString());
        $('#vbDate').text(new Date(item.transaction_date).toLocaleString());
        $('#vbStatus').html(`<span class="badge bg-${getBadge(item.status)}">${item.status}</span>`);
        $('#vbNarration').text(item.raw_narration);
        $('#viewBankModal').modal('show');
    }

    // --- CUSTOMER REPORTS ---
    function loadCustomerReports() {
        document.getElementById('customerReportsBody').innerHTML = '<tr><td colspan="6" class="text-center text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading...</td></tr>';
        fetch('index.php/api/finance-admin/customer-reports')
            .then(r => r.json())
            .then(res => {
                if(res.data) window.finData.customer = res.data;
                renderReports(window.finData.customer, 'customerReportsBody', 'customer');
            });
    }

    // --- AGENT REPORTS ---
    function loadAgentReports() {
        document.getElementById('agentReportsBody').innerHTML = '<tr><td colspan="6" class="text-center text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading...</td></tr>';
        fetch('index.php/api/finance-admin/agent-reports')
            .then(r => r.json())
            .then(res => {
                if(res.data) window.finData.agent = res.data;
                renderReports(window.finData.agent, 'agentReportsBody', 'agent');
            });
    }

    function renderReports(dataList, tbodyId, type) {
        let html = '';
        const filter = window.finData.filters[type];
        let data = dataList;

        if (filter !== 'All') {
            data = data.filter(r => r.status === filter);
        }

        if(data && data.length > 0) {
            data.forEach(r => {
                html += `
                    <tr>
                        <td class="small text-muted">${new Date(r.time_reported).toLocaleDateString()}</td>
                        <td class="fw-bold">${r.invoice_refindex}</td>
                        <td>${r.sender_name}</td>
                        <td class="fw-bold text-success">₦${parseFloat(r.amount_reported).toLocaleString()}</td>
                        <td><span class="badge bg-${getBadge(r.status)}">${r.status === 'AwaitingAdminApproval' ? 'Awaiting Oversight' : r.status}</span></td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-2 me-1" onclick="openQueryModal(${r.id}, '${type === 'customer' ? 'CustomerReport' : 'AgentReport'}')" title="Query Record"><i class="fa fa-question"></i></button>${r.status === 'Matched' ? `<button class="btn btn-sm btn-success px-2 py-1 me-1 shadow-sm" onclick="processVerification(${r.id}, 'verified', '')" title="Quick Verify"><i class="fa fa-check"></i></button>` : ''}
                            <button class="btn btn-sm btn-outline-primary px-3 rounded-pill" onclick="viewPaymentReport(${r.id}, '${type}')">View & Action</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            html = `<tr><td colspan="6" class="text-center text-muted">No reports found.</td></tr>`;
        }
        document.getElementById(tbodyId).innerHTML = html;
    }

    function viewPaymentReport(id, type) {
        const item = window.finData[type].find(x => x.id == id);
        if(!item) return;

        $('#vrRef').text(item.invoice_refindex);
        $('#vrSender').text(item.sender_name);
        $('#vrAmount').text('₦' + parseFloat(item.amount_reported).toLocaleString());
        $('#vrDate').text(new Date(item.time_reported).toLocaleString());
        $('#vrStatus').html(`<span class="badge bg-${getBadge(item.status)}">${item.status}</span>`);

        let actionsHtml = '';
        if(item.status === 'Pending' || item.status === 'amount-mismatch' || item.status === 'unremitted') {
            actionsHtml = `
                <button class="btn btn-success flex-grow-1" onclick="openVerifyModal(${item.id}, '${type}')"><i class="fa fa-check me-2"></i>Verify Manually</button>
                <button class="btn btn-outline-danger" onclick="openFlagModal(${item.id}, '${type}')"><i class="fa fa-flag me-2"></i>Flag / Query</button>
            `;
        } else if(item.status === 'Matched') {
            actionsHtml = `
                <button class="btn btn-success flex-grow-1" onclick="$('#viewReportModal').modal('hide'); processVerification(${item.id}, 'verified', 'Verified by Admin')"><i class="fa fa-check-double me-2"></i>Final Verify & Credit Wallet</button>
            `;
        } else {
            actionsHtml = `<div class="alert alert-light border small text-center w-100 mb-0">No further actions available for this status.</div>`;
        }
        $('#vrActions').html(actionsHtml);

        $('#viewReportModal').modal('show');
    }

    function openVerifyModal(id, type) {
        const item = window.finData[type].find(x => x.id == id);
        if(!item) return;
        $('#viewReportModal').modal('hide');
        $('#vfyId').val(id);
        $('#vfyType').val(type); // Store type to allow proper API call route mapping later
        $('#vfyRef').text(item.invoice_refindex);
        $('#vfyAmount').text(parseFloat(item.amount_reported).toLocaleString());
        $('#vfyDate').val(new Date().toISOString().split('T')[0]);
        $('#vfyNote').val('');
        
        // Populate Bank MATCH Select with ONLY Orphaned / amount-mismatch Bank records mapping amount closely
        let matchOptions = '<option value="">-- No matching bank report / Verify manually --</option>';
        const orphans = window.finData.bank.filter(b => b.status === 'orphaned' || b.status === 'amount-mismatch');
        orphans.forEach(b => {
            const isAmountMatch = (parseFloat(b.amount) == parseFloat(item.amount_reported)) ? '✅' : '❌';
            matchOptions += `<option value="${b.id}">${isAmountMatch} Ref: ${b.bank_ref} | ₦${parseFloat(b.amount)} | ${new Date(b.transaction_date).toLocaleDateString()}</option>`;
        });
        $('#vfyBankMatch').html(matchOptions);

        $('#verifyModal').modal('show');
    }

    function openFlagModal(id, type) {
        const item = window.finData[type].find(x => x.id == id);
        if(!item) return;
        $('#viewReportModal').modal('hide');
        $('#flgId').val(id);
        $('#flgRef').text(item.invoice_refindex);
        $('#flgAmount').text(parseFloat(item.amount_reported).toLocaleString());
        $('#flgReason').val('');
        $('#flagModal').modal('show');
    }

    function processVerification(id, action, comment) {
        let bankMatchId = $('#vfyBankMatch').val() || null;
        fetch('index.php/api/finance-admin/verify-report', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: id, action: action, comment: comment, bank_match_id: bankMatchId})
        }).then(r => r.json())
        .then(res => {
            alert(res.message);
            // Refresh current tab
            const activeTab = document.querySelector('.nav-link.active').getAttribute('data-bs-target');
            if(activeTab === '#customerReports') loadCustomerReports();
            if(activeTab === '#agentReports') loadAgentReports();
            loadPaymentRequests(); // Sync requests
        });
    }

    // --- PAYMENT REQUESTS ---
    function loadPaymentRequests() {
        document.getElementById('paymentRequestsBody').innerHTML = '<tr><td colspan="6" class="text-center text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading requests...</td></tr>';
        
        fetch('index.php/api/finance-admin/payment-requests')
            .then(r => r.json())
            .then(res => {
                let html = '';
                if(res.data && res.data.length > 0) {
                    res.data.forEach(r => {
                        html += `
                            <tr>
                                <td class="small text-muted">${new Date(r.time_created).toLocaleDateString()}</td>
                                <td class="fw-bold text-primary">${r.invoice_refindex}</td>
                                <td>User #${r.user_id}</td>
                                <td class="fw-bold">₦${parseFloat(r.amount).toLocaleString()}</td>
                                <td><span class="badge bg-secondary">${r.method}</span></td>
                                <td><span class="badge bg-${getBadge(r.status)}">${r.status}</span></td>
                            </tr>
                        `;
                    });
                } else {
                    html = `<tr><td colspan="6" class="text-center text-muted">No requests found.</td></tr>`;
                }
                document.getElementById('paymentRequestsBody').innerHTML = html;
            });
    }

    // --- RECONCILIATION TAB ---
    function renderManualRecon() {
        const orphans = window.finData.bank.filter(b => b.status === 'orphaned' || b.status === 'amount-mismatch');
        const pendingReports = [...window.finData.customer, ...window.finData.agent].filter(r => r.status === 'Pending' || r.status === 'unremitted' || r.status === 'amount-mismatch');

        let bankHtml = '';
        if(orphans.length > 0) {
            orphans.forEach(b => {
                bankHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-start border-start-0 border-end-0 border-top-0 border-bottom border-secondary-subtle">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">${b.bank_ref} <span class="badge bg-${getBadge(b.status)} ms-1">${b.status}</span></div>
                            <small class="text-muted d-block" style="font-size: 0.75rem;">${new Date(b.transaction_date).toLocaleDateString()} - ${b.raw_narration}</small>
                        </div>
                        <span class="fs-5 fw-bold text-success">₦${parseFloat(b.amount).toLocaleString()}</span>
                    </li>
                `;
            });
        } else {
            bankHtml = '<li class="list-group-item text-center text-muted border-0">No orphaned bank reports found.</li>';
        }
        $('#reconBankList').html(bankHtml);

        let reportHtml = '';
        if(pendingReports.length > 0) {
            pendingReports.forEach(r => {
                const type = (r.submitter === 'agent' ? 'agent' : 'customer');
                reportHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-end-0 border-top-0 border-bottom border-secondary-subtle">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">${r.invoice_refindex} <span class="badge bg-${getBadge(r.status)} ms-1">${r.status}</span></div>
                            <small class="text-muted d-block" style="font-size: 0.75rem;">${r.sender_name} - ${new Date(r.time_reported).toLocaleDateString()}</small>
                        </div>
                        <div class="text-end">
                            <span class="fs-5 fw-bold text-success d-block mb-1">₦${parseFloat(r.amount_reported).toLocaleString()}</span>
                            <button class="btn btn-sm btn-success px-3 rounded-pill" onclick="openVerifyModal(${r.id}, '${type}')">Verify / Match</button>
                        </div>
                    </li>
                `;
            });
        } else {
            reportHtml = '<li class="list-group-item text-center text-muted border-0">No pending reports found.</li>';
        }
        $('#reconReportList').html(reportHtml);
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
