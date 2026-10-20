// ─── Global State ───────────────────────────────────────────────
let partnerCache = [];

// ─── DOM Ready ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    initSearch();
    loadDashboard();
});

function loadDashboard() {
    fetchPartners();
    fetchStats();
}

function fetchPartners() {
    fetch('index.php/api/partner/list')
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                partnerCache = res.data;
                renderPartners(res.data);
            }
        });
}

function fetchStats() {
    fetch('index.php/api/partner/stats')
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                const s = res.data;
                document.getElementById('count-pending').textContent = s.Pending || 0;
                document.getElementById('count-approved').textContent = s.Approved || 0;
                document.getElementById('count-rejected').textContent = s.Rejected || 0;
                document.getElementById('tab-count-pending').textContent = s.Pending || 0;
            }
        });
}

function renderPartners(partners) {
    const pendingBody = document.getElementById('pendingTableBody');
    const allBody = document.getElementById('allTableBody');
    if (!pendingBody || !allBody) return;

    let pendingHtml = '';
    let allHtml = '';

    partners.forEach(p => {
        try {
            const typeBadgeClass = p.partner_type === 'SBA' ? 'type-badge-sba' : 'type-badge-zbdp';
            const typeIcon = p.partner_type === 'SBA' ? 'fa-handshake' : 'fa-truck';
            const statusBadge = getStatusBadge(p.approval_status);
            const createdDate = new Date(p.time_created).toLocaleDateString();

            // Unified Action Menu Helper
            const buildActionMenu = (partner, isPendingTab) => {
                return `
                    <div class="dropdown action-dropdown">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill px-2" data-bs-toggle="dropdown"><i class="fa fa-ellipsis-v"></i></button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                            <li><a class="dropdown-item" href="#" onclick="viewPartnerDetail(${partner.id})"><i class="fa fa-eye me-2 text-primary"></i>View Details</a></li>
                            ${partner.approval_status === 'Pending' && !window.isWHM ? `<li><a class="dropdown-item text-success" href="#" onclick="approveAction(${partner.id}, 'Approved', '109', 'Direct Approval')"><i class="fa fa-check me-2"></i>Quick Approve</a></li>` : ''}
                            ${(isPendingTab && partner.approval_status === 'Pending' && !window.isWHM) ? `<li><a class="dropdown-item text-danger" href="#" onclick="approveAction(${partner.id}, 'Rejected')"><i class="fa fa-times me-2"></i>Reject Action</a></li>` : ''}
                            <li><a class="dropdown-item" href="#" onclick="approveAction(${partner.id}, 'Queried')"><i class="fa fa-question-circle me-2 text-info"></i>Query Record</a></li>
                            <li><a class="dropdown-item" href="#" onclick="approveAction(${partner.id}, 'Flagged')"><i class="fa fa-flag me-2 text-dark"></i>Flag Alert</a></li>
                        </ul>
                    </div>
                `;
            };

            // Pending Approvals Tab Row
            if (p.approval_status === 'Pending') {
                pendingHtml += `
                    <tr class="partner-row" data-id="${p.id}" data-type="${p.partner_type}" data-status="${p.approval_status}">
                        <td class="ps-4">
                            <div class="fw-bold text-dark">${p.name}</div>
                            <div class="small text-muted"><i class="fa fa-phone me-1"></i>${p.phone_number}</div>
                        </td>
                        <td><span class="badge rounded-pill px-3 py-2 ${typeBadgeClass}"><i class="fa ${typeIcon} me-1"></i>${p.partner_type}</span></td>
                        <td>
                            <div class="fw-semibold small">${p.business_name || ''}</div>
                            <div class="text-muted small">${p.partner_type === 'SBA' ? (p.supply_categories || '') : (p.vehicle_count + ' vehicles')}</div>
                        </td>
                        <td class="small text-muted">${p.onboarded_by_name || 'System'}</td>
                        <td class="small text-muted">${createdDate}</td>
                        <td class="text-end pe-4">${buildActionMenu(p, true)}</td>
                    </tr>
                `;
            }

            // All Partners Tab Row
            allHtml += `
                <tr class="partner-row" data-id="${p.id}" data-type="${p.partner_type}" data-status="${p.approval_status}">
                    <td class="ps-4"><div class="fw-bold text-dark">${p.name}</div><div class="small text-muted">${p.phone_number}</div></td>
                    <td><span class="badge rounded-pill px-3 py-1 ${typeBadgeClass}">${p.partner_type}</span></td>
                    <td class="small">${p.business_name || ''}</td>
                    <td><span class="badge bg-${statusBadge}">${p.approval_status}</span></td>
                    <td class="small text-muted">${createdDate}</td>
                    <td class="text-end pe-4">${buildActionMenu(p, false)}</td>
                </tr>
            `;
        } catch (e) {
            console.error('Error rendering partner row', e, p);
        }
    });

    pendingBody.innerHTML = pendingHtml || '<tr><td colspan="6" class="text-center py-5 text-muted">No pending approvals found.</td></tr>';
    allBody.innerHTML = allHtml || '<tr><td colspan="6" class="text-center py-5 text-muted">No partners registered yet.</td></tr>';
}

function getStatusBadge(status) {
    const map = { 'Pending': 'warning', 'Approved': 'success', 'Rejected': 'danger', 'Queried': 'info', 'Flagged': 'dark' };
    return map[status] || 'secondary';
}

// ─── Partner Type Toggle (Add Modal) ─────────────────────────────
document.querySelectorAll('input[name="partner_type"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const isSBA = this.value === 'SBA';
        document.querySelectorAll('.sba-fields').forEach(el => el.style.display = isSBA ? '' : 'none');
        document.querySelectorAll('.zbdp-fields').forEach(el => el.style.display = isSBA ? 'none' : '');
    });
});

// ─── Pending Tab Filtering ───────────────────────────────────────
function filterPending(type, btn) {
    // Update active button
    const container = btn.closest('.card-header');
    container.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter rows
    document.querySelectorAll('#pendingTableBody .partner-row').forEach(row => {
        const matchesType = !type || row.dataset.type === type;
        const matchesSearch = row.classList.contains('search-match') || !document.getElementById('partnerSearch').value;

        if (matchesType && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ─── All Partners Tab Filtering ──────────────────────────────────
function filterAll(status, btn) {
    const container = btn.closest('.card-header');
    container.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('#allTableBody .partner-row').forEach(row => {
        const matchesStatus = !status || row.dataset.status === status;
        const matchesSearch = row.classList.contains('search-match') || !document.getElementById('partnerSearch').value;

        if (matchesStatus && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ─── Search Functionality ────────────────────────────────────────
function initSearch() {
    const searchInput = document.getElementById('partnerSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const term = this.value.toLowerCase();

        document.querySelectorAll('.partner-row').forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(term);

            if (matches) {
                row.classList.add('search-match');
            } else {
                row.classList.remove('search-match');
            }
        });

        // Trigger current filter to refresh visibility
        const activePendingFilter = document.querySelector('#pendingPane .card-header .btn.active');
        if (activePendingFilter) activePendingFilter.click();

        const activeAllFilter = document.querySelector('#allPane .card-header .btn.active');
        if (activeAllFilter) activeAllFilter.click();
    });
}

// ─── Approval Action Flow ────────────────────────────────────────
function approveAction(partnerId, action) {
    if (action === 'Rejected') {
        if (!confirm('Are you sure you want to REJECT this partner? This action is disruptive.')) return;
    }

    if (action === 'Queried' || action === 'Flagged') {
        openQueryModal(partnerId, action);
        return;
    }

    const actionLabels = {
        'Approved': { title: 'Approve Partner', desc: 'This will activate the partner for operations. SeniorAdmin authority required.', btn: 'btn-success', icon: 'fa-check' }
    };

    const config = actionLabels[action];
    if (!config) {
        // Fallback for other actions if any
        submitApproval(partnerId, action, '103', 'Automated trigger');
        return;
    }

    document.getElementById('approvalModalTitle').innerHTML = `<i class="fa ${config.icon} me-2"></i>${config.title}`;
    document.getElementById('approvalDesc').textContent = config.desc;
    document.getElementById('approvalPartnerId').value = partnerId;
    document.getElementById('approvalAction').value = action;
    document.getElementById('approvalNotes').value = '';
    document.getElementById('approvalAdminId').value = '';

    const confirmBtn = document.getElementById('approvalConfirmBtn');
    confirmBtn.className = `btn ${config.btn} rounded-pill px-4`;

    new bootstrap.Modal(document.getElementById('approvalModal')).show();
}

function submitApproval(pId, act, admId, nts) {
    const partnerId = pId || document.getElementById('approvalPartnerId').value;
    const action = act || document.getElementById('approvalAction').value;
    const adminId = admId || document.getElementById('approvalAdminId').value;
    const notes = nts || document.getElementById('approvalNotes').value;

    if (!adminId) return alert('Please enter your Admin Staff ID');

    fetch('index.php/api/partner/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            partner_id: parseInt(partnerId),
            action: action,
            admin_id: adminId,
            notes: notes
        })
    })
        .then(res => res.json())
        .then(res => {
            alert(res.message || 'Action completed');
            const modalEl = document.getElementById('approvalModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();

            const detailModalEl = document.getElementById('detailModal');
            const detailModal = bootstrap.Modal.getInstance(detailModalEl);
            if (detailModal) detailModal.hide();

            loadDashboard();
        })
        .catch(err => alert('Network error: ' + err.message));
}

// ─── Query / Flag Modal ──────────────────────────────────────────
function openQueryModal(partnerId, type) {
    const modal = document.getElementById('queryModal');
    if (!modal) return console.error('queryModal not found');

    const titleEl = document.getElementById('queryModalTitle');
    if (titleEl) titleEl.textContent = type === 'Flagged' ? 'Flag Record' : 'Submit Query';

    const sidEl = document.getElementById('querySubjectId') || document.getElementById('queryItemId');
    if (sidEl) sidEl.value = partnerId;

    const typeEl = document.getElementById('queryActionType') || document.getElementById('queryType');
    if (typeEl) typeEl.value = type;

    const msgEl = document.getElementById('queryMessage') || document.getElementById('note');
    if (msgEl) msgEl.value = '';

    const flagGroup = document.getElementById('flagTypeGroup');
    if (flagGroup) flagGroup.style.display = type === 'Flagged' ? '' : 'none';

    new bootstrap.Modal(modal).show();
}

function submitQuery() {
    const form = document.getElementById('queryForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Mapping fields for Router compatibility (handles both queries/add and query/add formats)
    const payload = {
        item_id: data.subject_id || data.item_id || document.getElementById('querySubjectId')?.value || document.getElementById('queryItemId')?.value,
        item_type: data.subject_type || data.item_type || document.getElementById('queryActionType')?.value || document.getElementById('queryType')?.value,
        note: data.note || data.message || document.getElementById('queryMessage')?.value,
        action_type: data.subject_type || 'Queried'
    };

    if (!payload.note) return alert('Please enter a note/description');

    // Use QueryController (plural) as it's the more robust one I just fixed
    fetch('index.php/api/queries/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert(res.message);

                // If it was a partner action, also trigger status update
                const pType = payload.item_type;
                if (pType === 'Partner' || pType === 'Queried' || pType === 'Flagged' || pType === 'SBA' || pType === 'ZBDp') {
                    return fetch('index.php/api/partner/approve', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            partner_id: payload.item_id,
                            action: payload.action_type || 'Queried',
                            admin_id: 'Admin', // Fallback
                            notes: payload.note
                        })
                    }).then(r => r.json());
                }
                return res;
            } else {
                throw new Error(res.message || 'Submission failed');
            }
        })
        .then(() => {
            const qModalEl = document.getElementById('queryModal');
            if (qModalEl) {
                const qModal = bootstrap.Modal.getInstance(qModalEl);
                if (qModal) qModal.hide();
            }
            if (typeof loadDashboard === 'function') loadDashboard();
        })
        .catch(err => alert('Error: ' + err.message));
}

// ─── Add New Partner ─────────────────────────────────────────────
function submitNewPartner() {
    const form = document.getElementById('addPartnerForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || !data.phone_number || !data.partner_type) {
        return alert('Please fill in Name, Phone, and Partner Type');
    }

    fetch('index.php/api/partner/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert(res.message);
                const modal = bootstrap.Modal.getInstance(document.getElementById('addPartnerModal'));
                if (modal) modal.hide();
                loadDashboard();
            } else {
                alert('Error: ' + res.message);
            }
        })
        .catch(err => alert('Network error: ' + err.message));
}

// ─── Detail Modal ────────────────────────────────────────────────
function viewPartnerDetail(partnerId) {
    const p = partnerCache.find(x => x.id == partnerId);
    if (!p) return;

    const content = `
        <div class="row">
            <div class="col-md-4 text-center border-end">
                <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style="width:100px;height:100px;">
                    <i class="fa fa-user fa-3x text-primary"></i>
                </div>
                <h5 class="fw-bold mb-0">${p.name}</h5>
                <p class="text-muted small">${p.partner_type} Partner</p>
                <span class="badge bg-${getStatusBadge(p.approval_status)} mb-3">${p.approval_status}</span>
            </div>
            <div class="col-md-8">
                <div class="card border-0 bg-light rounded-3 p-3 mb-3">
                    <div class="small text-muted text-uppercase fw-bold mb-2">Business Information</div>
                    <table class="table table-sm table-borderless mb-0">
                        <tr><td class="text-muted" style="width:40%">Business Name</td><td class="fw-bold">${p.business_name || 'N/A'}</td></tr>
                        <tr><td class="text-muted">Phone Number</td><td class="fw-bold">${p.phone_number}</td></tr>
                        <tr><td class="text-muted">Status</td><td>${p.status || 'Active'}</td></tr>
                        <tr><td class="text-muted">Onboarded By</td><td>${p.onboarded_by_name || 'System'}</td></tr>
                    </table>
                </div>
                <div class="card border-0 bg-light rounded-3 p-3">
                    <div class="small text-muted text-uppercase fw-bold mb-2">Metrics & Assets</div>
                    <div class="row g-2">
                        <div class="col-6">
                            <div class="bg-white p-2 rounded border text-center">
                                <div class="extra-small text-muted">Commission</div>
                                <div class="fw-bold">${p.commission_rate}%</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="bg-white p-2 rounded border text-center">
                                <div class="extra-small text-muted">Wallet Bal</div>
                                <div class="fw-bold text-success">₦${parseFloat(p.wallet_balance || 0).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-4">
            ${(p.approval_status === 'Pending' && typeof window.isWHM === 'undefined') ? `
                <button class="btn btn-success rounded-pill px-4" onclick="approveAction(${p.id}, 'Approved')">Approve</button>
                <button class="btn btn-outline-danger rounded-pill px-4" onclick="approveAction(${p.id}, 'Rejected')">Reject</button>
            ` : ''}
            <button class="btn btn-info text-white rounded-pill px-4" onclick="approveAction(${p.id}, 'Queried')">Query</button>
            <button class="btn btn-dark rounded-pill px-4" onclick="approveAction(${p.id}, 'Flagged')">Flag</button>
        </div>
    `;

    document.getElementById('detailModalBody').innerHTML = content;
    new bootstrap.Modal(document.getElementById('detailModal')).show();
}
