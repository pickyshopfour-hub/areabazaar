<?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
_initSession();
$db = (new Database())->getConnection();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FRM Portal | AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="../assets/css/style.css?v=1772656019.24106" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background: #f8fafc; font-family: 'Inter', sans-serif; }
        .sidebar { min-height: 100vh; background: #3730A3; color: white; padding: 1.5rem; }
        .nav-link { color: #c7d2fe; transition: all 0.2s; border-radius: 0.5rem; }
        .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
        .top-hero { background: linear-gradient(135deg, #4338CA 0%, #312E81 100%); color: white; padding: 2rem; border-radius: 0 0 1.5rem 1.5rem; margin-bottom: 2rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .tab-content { background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
<div class="container-fluid p-0">
    <div class="row g-0">
        <!-- Sidebar -->
        <div class="col-md-2 sidebar">
            <h4 class="fw-bold mb-4"><i class="fa fa-user-shield me-2"></i> ABz FRM</h4>
            <nav class="nav flex-column" id="frmTabs" role="tablist">
                <button class="nav-link text-start border-0 bg-transparent active mb-2 fw-semibold" data-bs-toggle="pill" data-bs-target="#customers"><i class="fa fa-users me-2"></i> Area Customers</button>
                <button class="nav-link text-start border-0 bg-transparent mb-2 fw-semibold" data-bs-toggle="pill" data-bs-target="#payments"><i class="fa fa-money-bill-transfer me-2"></i> Payments & Remits</button>
                <button class="nav-link text-start border-0 bg-transparent fw-semibold" data-bs-toggle="pill" data-bs-target="#orders"><i class="fa fa-shopping-bag me-2"></i> Orders Mgt</button>
            </nav>
        </div>
        
        <!-- Main Content -->
        <div class="col-md-10 bg-light p-4">
            <div class="top-hero d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="fw-bold">Welcome, Area Agent</h3>
                    <p class="mb-0 text-white-50">Manage your region's customers, collect payments securely, and remit batch funds to AreaBazaar via verified channels.</p>
                </div>
                <div id="notifBellContainer"></div>
            </div>

            <div class="tab-content">
                <!-- Customers Tab -->
                <div class="tab-pane fade show active" id="customers">
                    <h5 class="fw-bold text-dark mb-4 border-bottom pb-2">Assigned Customers</h5>
                    <table class="table table-hover">
                        <thead><tr class="small text-muted text-uppercase"><th># ID</th><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
                        <tbody><tr><td colspan="4" class="text-center py-4">Loading area customers...</td></tr></tbody>
                    </table>
                </div>

                <!-- Payments & Remittances Tab -->
                <div class="tab-pane fade" id="payments">
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                        <h5 class="fw-bold text-dark mb-0">Payments Received</h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#reportPaymentModal"><i class="fa fa-receipt me-1"></i> Log Custom Receipt</button>
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#remittanceModal"><i class="fa fa-paper-plane me-1"></i> Batch Remittance</button>
                        </div>
                    </div>
                    <table class="table table-hover">
                        <thead><tr class="small text-muted text-uppercase"><th>Inv Ref</th><th>Customer ID</th><th>Amount</th><th>Status</th></tr></thead>
                        <tbody><tr><td colspan="4" class="text-center py-4 text-muted">No pending logged receipts.</td></tr></tbody>
                    </table>
                </div>

                <!-- Customer Orders -->
                <div class="tab-pane fade" id="orders">
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                        <h5 class="fw-bold text-dark mb-0">Customer Open Orders</h5>
                        <button class="btn btn-primary shadow-sm"><i class="fa fa-plus me-1"></i> Proxy Spot Order</button>
                    </div>
                    <div class="alert alert-info">Feature tracking pending global cart integration (Chunk 11).</div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- MODALS -->

<!-- Log Customer Payment -->
<div class="modal fade" id="reportPaymentModal" tabindex="-1">
    <div class="modal-dialog">
        <form class="modal-content" id="paymentForm">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Log Paid Receipt</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Invoice Ref</label>
                    <input type="text" name="invoice_refindex" class="form-control" required placeholder="AB-XXXXXXXX">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Amount Received (₦)</label>
                    <input type="number" name="amount_reported" class="form-control" required placeholder="0.00">
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="submit" class="btn btn-primary w-100 py-2">Log Receipt (Unremitted)</button>
            </div>
        </form>
    </div>
</div>

<!-- Batch Remittance -->
<div class="modal fade" id="remittanceModal" tabindex="-1">
    <div class="modal-dialog">
        <form class="modal-content" id="remitForm">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Bank Remittance</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body bg-light p-4">
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Bank Narrative (Unique Ref)</label>
                    <input type="text" id="bankRef" class="form-control" required placeholder="Remit-Ref-XXXXXXXX">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Total Amount Deposited (₦)</label>
                    <input type="number" id="remitTotal" class="form-control" required>
                </div>
                <div id="remitReceipts">
                    <div class="row g-2 mb-2 receipt-entry">
                        <div class="col-7"><input type="text" class="form-control r-ref" placeholder="Ref" required></div>
                        <div class="col-5"><input type="number" class="form-control r-val" placeholder="Amount" required></div>
                    </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill mt-2" onclick="addReceiptRow()">+ Include Another</button>
            </div>
            <div class="modal-footer border-0">
                <button type="submit" class="btn btn-success w-100 py-2">Push Batch Remittance</button>
            </div>
        </form>
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
injectCurrentUserJs($db, ['id' => 1, 'name' => 'Agent User', 'role' => 'Agent', 'type' => 'partner']);
?>

    $(document).ready(function() {
        loadCustomers();
        loadPayments();
        loadMyQueryInbox();
    });

    const AGENT_ID = 1;

    function loadCustomers() {
        fetch('index.php/api/agent/customers').then(r => r.json()).then(res => {
            let html = '';
            if(res.status==='success' && res.data.length > 0) {
                res.data.forEach(c => {
                    html += `<tr><td class="fw-bold">#${c.id}</td><td>${c.name}</td><td>${c.phone_number}</td><td><div class="d-flex align-items-center gap-2"><span class="badge bg-success">Active</span><button class="btn btn-light border btn-sm rounded-circle shadow-sm" onclick="openQueryModal(${c.id}, 'Agent_Customer')"><i class="fa fa-question text-dark"></i></button></div></td></tr>`;
                });
            }
            $('#customers tbody').html(html || '<tr><td colspan="4" class="text-center py-4">No customers.</td></tr>');
        });
    }

    function loadPayments() {
        fetch(`index.php/api/agent/payments?agent_id=${AGENT_ID}`).then(r => r.json()).then(res => {
            let html = '';
            if(res.status==='success' && res.data.length > 0) {
                res.data.forEach(p => {
                    const badge = p.status === 'unremitted' ? 'warning' : 'success';
                    html += `<tr><td class="fw-bold">${p.invoice_refindex}</td><td class="text-success fw-bold">₦${parseFloat(p.amount_reported).toLocaleString()}</td><td>${new Date(p.time_reported).toLocaleDateString()}</td><td><div class="d-flex align-items-center gap-2"><span class="badge rounded-pill bg-${badge}">${p.status}</span><button class="btn btn-light border btn-sm rounded-circle shadow-sm" onclick="openQueryModal(${p.id}, 'PaymentReport')"><i class="fa fa-question text-dark"></i></button></div></td></tr>`;
                });
            }
            $('#payments tbody').html(html || '<tr><td colspan="4" class="text-center py-4">No payments.</td></tr>');
        });
    }

    $('#paymentForm').submit(function(e) {
        e.preventDefault();
        fetch('index.php/api/agent/report', { method: 'POST', body: JSON.stringify({ invoice_refindex: this.invoice_refindex.value, amount_reported: this.amount_reported.value, agent_id: AGENT_ID }) })
            .then(r => r.json()).then(res => { alert(res.message); if(res.status==='success'){ $('#reportPaymentModal').modal('hide'); loadPayments(); } });
    });

    $('#remitForm').submit(function(e) {
        e.preventDefault();
        let invoices = []; $('.receipt-entry').each(function() { invoices.push({ ref: $(this).find('.r-ref').val(), amount: parseFloat($(this).find('.r-val').val()) }); });
        fetch('index.php/api/agent/remit', { method: 'POST', body: JSON.stringify({ bank_ref: $('#bankRef').val(), total_amount: parseFloat($('#remitTotal').val()), invoices: invoices, agent_id: AGENT_ID }) })
            .then(r => r.json()).then(res => { alert(res.message); if(res.status==='success'){ $('#remittanceModal').modal('hide'); loadPayments(); } });
    });

    function addReceiptRow() { $('#remitReceipts').append('<div class="row g-2 mb-2 receipt-entry"><div class="col-7"><input type="text" class="form-control r-ref" placeholder="Ref" required></div><div class="col-5"><input type="number" class="form-control r-val" placeholder="Amount" required></div></div>'); }

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
