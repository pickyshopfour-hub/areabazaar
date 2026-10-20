// Global UI Scripts for AreaBazaar
document.addEventListener('DOMContentLoaded', () => {
    // Universal Interaction Highlighter for Table Rows
    // This listens for any clicks on actionable items within a table row, 
    // and correctly highlights that entire row universally. It also persists
    // when modals are opened and afterwards.

    document.body.addEventListener('click', function (e) {
        // Find if the click originated from anywhere inside a table row or card
        const row = e.target.closest('table tbody tr, .dispatch-card');

        if (row) {
            // Clear highlight from all other rows
            document.querySelectorAll('table tbody tr.active-interaction-row, .dispatch-card.active-interaction-row').forEach(r => {
                if (r !== row) {
                    r.classList.remove('active-interaction-row');
                }
            });

            // Add the persistent interaction highlight to the clicked row
            row.classList.add('active-interaction-row');
        } else {
            // Optional: If they click outside any table row (like on a modal or background), maybe remove it?
            // Actually, keep it so it persists when they are inside a modal. 
            // We only clear it if they click ANOTHER row.
        }
    }, true); // Use capture mode so it triggers before any e.stopPropagation() from Bootstrap dropdowns

    // Optional: Also highlight when a modal is opened related to a row
    // In our implementation, clicking the original button already highlights the row,
    // and since the `active-interaction-row` class persists, we don't need additional modal logic.
});

// ═══════════════════════════════════════════════
// NOTIFICATION BELL & QUERY THREAD SYSTEM
// Activated automatically on any page that sets window.currentUser
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    if (window.currentUser && window.currentUser.id) {
        renderNotificationBell();
        initNotifBell();
    }
});

function renderNotificationBell() {
    if (document.getElementById('ab-notif-bell')) return;
    const bellHtml = `
    <div id="ab-notif-bell" style="position:relative;display:inline-block;cursor:pointer;margin-left:12px;" title="Notifications">
        <span style="font-size:1.3rem;">&#128276;</span>
        <span id="ab-notif-badge" class="badge bg-danger rounded-pill"
              style="position:absolute;top:-6px;right:-8px;font-size:0.65rem;display:none;">0</span>
    </div>
    <div id="ab-notif-dropdown" class="card shadow"
         style="display:none;position:fixed;top:60px;right:18px;z-index:9999;width:340px;max-height:420px;overflow-y:auto;">
        <div class="card-header d-flex justify-content-between align-items-center py-2">
            <strong class="small">Notifications</strong>
            <button class="btn btn-link btn-sm p-0 text-muted" onclick="markAllNotifsRead()">Mark all read</button>
        </div>
        <ul id="ab-notif-list" class="list-group list-group-flush"></ul>
        <div class="card-footer text-center py-1"><small class="text-muted">Click to open thread</small></div>
    </div>`;

    const container = document.getElementById('notifBellContainer');
    const navbar = document.querySelector('.navbar-nav.ms-auto, .navbar');

    if (container) {
        container.innerHTML = bellHtml;
    } else if (navbar) {
        navbar.insertAdjacentHTML('beforeend', bellHtml);
    } else {
        const w = document.createElement('div');
        w.id = 'ab-notif-fixed-wrapper';
        w.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;';
        w.innerHTML = bellHtml;
        document.body.appendChild(w);
    }

    document.getElementById('ab-notif-bell').addEventListener('click', toggleNotifDropdown);
}

function toggleNotifDropdown() {
    const dd = document.getElementById('ab-notif-dropdown');
    if (!dd) return;
    const visible = dd.style.display !== 'none';
    dd.style.display = visible ? 'none' : 'block';
    if (!visible) pollNotifications();
}

function initNotifBell() {
    pollNotifications();
    setInterval(pollNotifications, window.notifPollInterval || 30000);
}

function pollNotifications() {
    if (!window.currentUser || !window.currentUser.id) return;
    $.get('index.php/api/notifications/unread', { recipient_id: window.currentUser.id }, function (res) {
        if (res.status !== 'success') return;
        const count = res.data.count || 0;
        const badge = document.getElementById('ab-notif-badge');
        if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'inline-block' : 'none'; }
        const list = document.getElementById('ab-notif-list');
        if (!list) return;
        list.innerHTML = '';
        if (count === 0) {
            list.innerHTML = '<li class="list-group-item text-muted small text-center">No new notifications</li>';
        } else {
            res.data.notifications.forEach(n => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-action py-2';
                li.style.cursor = 'pointer';
                li.innerHTML = `<div class="d-flex justify-content-between">
                    <span class="badge bg-info text-dark me-2">${n.type}</span>
                    <small class="text-muted">${(n.created_at || '').substring(5, 16)}</small>
                </div>
                <div class="small mt-1">${n.message || ''}</div>`;
                li.addEventListener('click', () => { openQueryThreadModal(n.query_id); markOneNotifRead(n.id); });
                list.appendChild(li);
            });
        }
    });
}

function markAllNotifsRead() {
    if (!window.currentUser) return;
    $.post('index.php/api/notifications/mark-read', { recipient_id: window.currentUser.id }, () => {
        pollNotifications();
        const dd = document.getElementById('ab-notif-dropdown');
        if (dd) dd.style.display = 'none';
    });
}

function markOneNotifRead(notifId) {
    $.post('index.php/api/notifications/mark-read', { notif_id: notifId }, () => pollNotifications());
}

document.addEventListener('click', function (e) {
    const bell = document.getElementById('ab-notif-bell');
    const dd = document.getElementById('ab-notif-dropdown');
    if (bell && dd && !bell.contains(e.target) && !dd.contains(e.target)) dd.style.display = 'none';
});

// ── Query Thread Modal ────────────────────────────
function openQueryThreadModal(queryId) {
    let modal = document.getElementById('ab-thread-modal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="ab-thread-modal" tabindex="-1">
          <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Query Thread</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" id="ab-thread-body">
                <div class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              </div>
              <div class="modal-footer d-block p-2" id="ab-thread-footer"></div>
            </div>
          </div>
        </div>`);
        modal = document.getElementById('ab-thread-modal');
    }
    new bootstrap.Modal(modal).show();
    $.get('index.php/api/queries/thread', { query_id: queryId }, function (res) {
        if (res.status !== 'success') {
            document.getElementById('ab-thread-body').innerHTML = '<div class="alert alert-danger">Failed to load thread.</div>';
            return;
        }
        _renderThreadModal(res.data.query, res.data.responses, queryId);
    });
}

function _priorityBadge(p) {
    return { Low: 'bg-secondary', Normal: 'bg-primary', High: 'bg-warning text-dark', Critical: 'bg-danger' }[p] || 'bg-secondary';
}

function _renderThreadModal(query, responses, queryId) {
    let html = `<div class="mb-3">
        <span class="badge bg-secondary me-1">${query.subject_type}</span>
        <span class="badge ${_priorityBadge(query.priority)} me-1">${query.priority}</span>
        <span class="badge bg-${query.status === 'Open' ? 'success' : 'dark'}">${query.status}</span>
        ${query.assigned_role ? `<span class="badge bg-info text-dark ms-1">Assigned: ${query.assigned_role}</span>` : ''}
    </div>
    <div class="card bg-light mb-3"><div class="card-body py-2">
        <small class="text-muted">Original &bull; ${query.creator_role} &bull; ${(query.created_at || '').substring(0, 16)}</small>
        <p class="mb-0 mt-1">${query.note}</p>
    </div></div>`;
    if (responses && responses.length) {
        html += '<h6 class="text-muted small fw-semibold mb-2">RESPONSES</h6>';
        responses.forEach(r => {
            html += `<div class="card mb-2"><div class="card-body py-2">
                <div class="d-flex justify-content-between">
                    <span class="fw-semibold small">${r.responder_role}</span>
                    <small class="text-muted">${(r.created_at || '').substring(0, 16)}</small>
                </div>
                <p class="mb-1 mt-1">${r.message}</p>
                ${r.forwarded_role ? `<small class="text-info">&#8618; ${r.forwarded_role}</small>` : ''}
                ${(r.notes && r.notes.length) ? r.notes.map(n => `<div class="ms-3 mt-1 ps-2 border-start border-warning">
                    <small class="fw-bold text-muted">${n.author_role}:</small> <span class="small">${n.note}</span></div>`).join('') : ''}
            </div></div>`;
        });
    } else {
        html += '<p class="text-muted small">No responses yet.</p>';
    }
    document.getElementById('ab-thread-body').innerHTML = html;
    _renderThreadFooter(query, queryId);
}

function _renderThreadFooter(query, queryId) {
    const u = window.currentUser;
    let footer = '';
    if (query.status === 'Open') {
        const canRespond = u && (u.role === 'Admin' || u.role === 'SeniorAdmin' ||
            parseInt(query.assigned_to) === u.id || parseInt(query.creator_id) === u.id);
        if (canRespond) {
            footer += `<textarea id="ab-resp-msg" class="form-control form-control-sm mb-2" rows="2" placeholder="Write a response..."></textarea>
            <div class="d-flex gap-2 flex-wrap align-items-center mb-2">
                <select id="ab-resp-forward-role" class="form-select form-select-sm" style="max-width:150px;">
                    <option value="">Forward to (optional)</option>
                    <option>SeniorAdmin</option><option>Admin</option><option>WHM</option>
                    <option>SBA</option><option>ZBDp</option><option>Agent</option>
                </select>
                <input id="ab-resp-forward-id" type="number" class="form-control form-control-sm" style="max-width:120px;" placeholder="User ID">
                <button class="btn btn-primary btn-sm" onclick="submitQueryResponse(${queryId})">Send</button>
            </div>`;
        }
        if (u && parseInt(query.creator_id) === u.id) {
            footer += `<button class="btn btn-outline-danger btn-sm" onclick="closeQueryThread(${queryId})">Close Thread</button>`;
        }
    } else {
        footer += `<div class="alert alert-secondary py-1 mb-0 small">Thread is ${query.status}.</div>`;
    }
    document.getElementById('ab-thread-footer').innerHTML = footer;
}

function submitQueryResponse(queryId) {
    const message = document.getElementById('ab-resp-msg')?.value?.trim();
    if (!message) { alert('Please enter a message.'); return; }
    const u = window.currentUser;
    $.post('index.php/api/queries/respond', {
        query_id: queryId, responder_id: u.id, responder_role: u.role, message,
        forwarded_to: document.getElementById('ab-resp-forward-id')?.value || '',
        forwarded_role: document.getElementById('ab-resp-forward-role')?.value || '',
    }, res => {
        if (res.status === 'success') openQueryThreadModal(queryId);
        else alert('Error: ' + res.message);
    });
}

function closeQueryThread(queryId) {
    if (!confirm('Close this query thread?')) return;
    const u = window.currentUser;
    $.post('index.php/api/queries/close', {
        query_id: queryId, closer_id: u.id, closer_role: u.role, reason: 'Resolved by originator',
    }, res => {
        if (res.status === 'success') { openQueryThreadModal(queryId); pollNotifications(); }
        else alert('Error: ' + res.message);
    });
}

/**
 * Submit a Query — used by existing "Query Admin" buttons on all dashboards.
 * Automatically picks up creator identity from window.currentUser.
 */
function submitQueryAction(subjectType, subjectId, note, flagTypes, assignedTo, assignedRole) {
    const u = window.currentUser || { id: 1, role: 'Admin' };
    $.post('index.php/api/queries/add', {
        subject_type: subjectType, subject_id: subjectId, note,
        flag_types: flagTypes || '', creator_id: u.id, creator_role: u.role,
        assigned_to: assignedTo || '', assigned_role: assignedRole || '',
    }, res => {
        alert(res.status === 'success' ? 'Query submitted.' : 'Error: ' + res.message);
    });
}
