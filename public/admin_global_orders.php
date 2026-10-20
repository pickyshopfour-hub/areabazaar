<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Order Management | AreaBazaar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
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
        body { background: #f8fafc; font-family: 'Outfit', sans-serif; }
        .sidebar { min-height: 100vh; background: #0f172a; color: white; position: sticky; top: 0; }
        .card { border: none; border-radius: 1.25rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .card:hover { transform: translateY(-2px); }
        .nav-link { color: #94a3b8; padding: 0.8rem 1.5rem; transition: all 0.2s; border-radius: 0.5rem; margin: 0.2rem 0; }
        .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
        .stat-card { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; }
        .badge-urgent { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; }
        .filter-pane { background: white; padding: 1.5rem; border-radius: 1.25rem; margin-bottom: 2rem; border: 1px solid #e2e8f0; }
        .table thead th { background: #f1f5f9; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: #64748b; padding: 1rem; border: none; }
        .table tbody td { padding: 1rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 sidebar p-4">
                <div class="d-flex align-items-center mb-5">
                    <div class="bg-primary rounded-3 p-2 me-3"><i class="fa fa-shopping-bag text-white"></i></div>
                    <h4 class="fw-bold mb-0">AreaBazaar</h4>
                </div>
                <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="admin_dashboard.php"><i class="fa fa-chart-pie me-2"></i> Overview</a>
                    <a class="nav-link active mb-2" href="admin_global_orders.php"><i class="fa fa-globe me-2"></i> Global Orders</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_dispatch.php"><i class="fa fa-truck-fast me-2"></i> Logistics & Dispatch</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_inventory.php"><i class="fa fa-boxes-stacked me-2"></i> Inventory Tracking</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_finance.php"><i class="fa fa-vault me-2"></i> Finance Hub</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_auctions.php"><i class="fa fa-gavel me-2"></i> Auction Configs</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_active_sessions.php"><i class="fa fa-tower-broadcast me-2"></i> Live Sessions</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_partners.php"><i class="fa fa-handshake me-2"></i> Partner Approvals</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_oversight.php"><i class="fa fa-shield-halved me-2"></i> SA Oversight</a>
                    <a class="nav-link text-white-50 mb-2" href="admin_queries.php"><i class="fa fa-comments me-2"></i> Query Hub</a>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 class="fw-bold text-dark mb-1">Global Logistics Dispatch</h2>
                        <p class="text-muted">High-velocity order oversight across all active sessions.</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <div id="notifBellContainer" class="me-3"></div>
                        <button class="btn btn-outline-dark" onclick="loadGlobalOrders()"><i class="fa fa-sync-alt"></i></button>
                        <button class="btn btn-premium px-4"><i class="fa fa-file-export me-2"></i> Export Data</button>
                    </div>
                </div>

                <!-- Stats Overview -->
                <div class="row g-4 mb-5">
                    <div class="col-md-3">
                        <div class="card p-4 stat-card">
                            <h6 class="text-white-50 small fw-bold">TOTAL REVENUE (24H)</h6>
                            <h2 class="fw-bold mb-0" id="stat-revenue">₦1,250,400</h2>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card p-4 bg-white">
                            <h6 class="text-muted small fw-bold">PENDING ORDERS</h6>
                            <h2 class="fw-bold mb-0 text-primary" id="stat-pending">142</h2>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card p-4 bg-white">
                            <h6 class="text-muted small fw-bold">URGENT (XPD)</h6>
                            <h2 class="fw-bold mb-0 text-danger" id="stat-urgent">18</h2>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card p-4 bg-white">
                            <h6 class="text-muted small fw-bold">COMPLETION RATE</h6>
                            <h2 class="fw-bold mb-0 text-success" id="stat-rate">94.2%</h2>
                        </div>
                    </div>
                </div>

                <!-- Global Filters -->
                <div class="filter-pane shadow-sm">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label small fw-bold text-muted">Auction Session</label>
                            <select id="filter-session" class="form-select border-0 bg-light rounded-3" onchange="loadGlobalOrders()">
                                <option value="">All Sessions</option>
                                <!-- Dynamic sessions -->
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-bold text-muted">Order Status</label>
                            <select id="filter-status" class="form-select border-0 bg-light rounded-3" onchange="loadGlobalOrders()">
                                <option value="">All Statuses</option>
                                <option value="Paid">Paid (Pending)</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-bold text-muted">Universal Search</label>
                            <div class="input-group">
                                <span class="input-group-text border-0 bg-light"><i class="fa fa-search text-muted"></i></span>
                                <input type="text" id="filter-search" class="form-control border-0 bg-light" placeholder="Order ID, Customer, or Product..." onkeyup="debounceLoad()">
                            </div>
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input" type="checkbox" id="filter-urgent" onchange="loadGlobalOrders()">
                                <label class="form-check-label fw-bold small" for="filter-urgent">Urgent Only</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Orders Table -->
                <div class="card shadow-sm overflow-hidden">
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Order Details</th>
                                    <th>Session/Wave</th>
                                    <th>Logistics Details</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                    <th class="text-end">Command</th>
                                </tr>
                            </thead>
                            <tbody id="globalOrdersBody">
                                <!-- Loaded via JS -->
                            </tbody>
                        </table>
                    </div>
                    <div class="p-4 border-top bg-light">
                        <nav class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Showing last 100 high-velocity orders</small>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">Next</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <h6 class="modal-title fw-bold">Order Details</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4" id="orderDetailsContent">
                    Loading details...
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="assignModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <h6 class="modal-title fw-bold">Assign Order</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="assignOrderId">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Assignee ID / Courier ID</label>
                        <select id="assignValue" class="form-select" required>
                            <option value="">Select Courier / Transport Partner...</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button class="btn btn-outline-secondary px-4 rounded-pill btn-sm" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary px-4 rounded-pill btn-sm fw-bold" onclick="submitAssign()">Assign</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        $(document).ready(function() {
            loadSessions();
            loadCouriers();
            loadGlobalOrders();
            // Live refresh for senior oversight
            setInterval(loadGlobalOrders, 60000);
        });

        function loadSessions() {
            $.get('index.php/api/auction/sessions', function(res) {
                if(res.status === 'success') {
                    res.sessions.forEach(s => {
                        $('#filter-session').append(`<option value="${s.id}">${s.session_name}</option>`);
                    });
                }
            });
        }

        function loadCouriers() {
            $.get('index.php/api/partner/list?type=ZBDp', function(res) {
                if(res.status === 'success') {
                    res.data.forEach(p => {
                        if(p.approval_status === 'Approved' || p.status === 'Active') {
                            $('#assignValue').append(`<option value="${p.id}">${p.name} [ZBDp]</option>`);
                        }
                    });
                }
            });
            // Fetch staff acting as dispatchers
            $.get('index.php/api/staff/list', function(res) {
                if(res.status === 'success') {
                    res.data.forEach(s => {
                        $('#assignValue').append(`<option value="${s.id}">${s.name || s.first_name} [${s.role}]</option>`);
                    });
                }
            });
        }

        function loadGlobalOrders() {
            const sid = $('#filter-session').val();
            const status = $('#filter-status').val();
            const urgent = $('#filter-urgent').is(':checked') ? 1 : 0;
            const search = $('#filter-search').val();

            $.get(`index.php/api/order/list?session_id=${sid}&status=${status}&is_urgent=${urgent}&search=${search}`, function(res) {
                let html = '';
                if(res.data && res.data.length > 0) {
                    res.data.forEach(order => {
                        const statusClass = getStatusBadgeClass(order.status);
                        html += `
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="fw-bold me-2">#${order.id}</div>
                                        ${order.is_urgent ? '<span class="badge badge-urgent"><i class="fa fa-bolt me-1"></i>XPD</span>' : ''}
                                    </div>
                                    <div class="text-dark small">${order.customer_name}</div>
                                    <div class="text-muted extra-small">${new Date(order.time_created).toLocaleString()}</div>
                                </td>
                                <td>
                                    <div class="small fw-bold text-primary">${order.session_name || 'N/A'}</div>
                                    <div class="extra-small text-muted">${order.wave_name || 'Spot Purchase'}</div>
                                </td>
                                <td>
                                    <div class="small"><i class="fa fa-map-marker-alt text-muted me-1"></i> ${order.origin_area_name || 'Lagos Central'}</div>
                                    <div class="extra-small text-truncate" style="max-width: 200px;">${order.item_summary || 'No items listed'}</div>
                                </td>
                                <td class="fw-bold">₦${parseFloat(order.total_amount).toLocaleString()}</td>
                                <td><span class="badge ${statusClass} rounded-pill">${order.status}</span></td>
                                <td class="text-end">
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-outline-info me-1" onclick="openQueryModal(${order.id}, 'Order')" title="Query Order"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-dark" onclick="viewOrderDetails(${order.id})">Details</button>
                                        <button class="btn btn-sm btn-outline-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                                            <li><a class="dropdown-item" href="javascript:void(0)" onclick="updateOrderStatus(${order.id}, 'Processing')">Mark Processing</a></li>
                                            <li><a class="dropdown-item" href="javascript:void(0)" onclick="updateOrderStatus(${order.id}, 'Shipped')">Mark Shipped</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item" href="javascript:void(0)" onclick="assignToCourier(${order.id})">Assign to Courier</a></li>
                                            <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="flagOrder(${order.id})">Flag Fraudulent</a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    html = '<tr><td colspan="6" class="text-center py-5 text-muted">No matching orders found across sessions.</td></tr>';
                }
                $('#globalOrdersBody').html(html);
            });
        }

        function getStatusBadgeClass(status) {
            switch(status) {
                case 'Paid': return 'bg-info-light text-info';
                case 'Processing': return 'bg-warning-light text-warning';
                case 'Shipped': return 'bg-primary-light text-primary';
                case 'Delivered': return 'bg-success-light text-success';
                case 'Returned': return 'bg-danger-light text-danger';
                default: return 'bg-secondary-light text-secondary';
            }
        }

        function updateOrderStatus(id, status) {
            $.post('index.php/api/auction/update-order', { id: id, action: status }, function(res) {
                if(res.status === 'success') loadGlobalOrders();
                else alert(res.message);
            });
        }

        let timeout = null;
        function debounceLoad() {
            clearTimeout(timeout);
            timeout = setTimeout(loadGlobalOrders, 500);
        }

        function viewOrderDetails(id) {
            $('#orderDetailsModal').modal('show');
            $('#orderDetailsContent').html('<div class="text-center"><i class="fa fa-spinner fa-spin"></i> Loading...</div>');
            $.get('index.php/api/order/details?id=' + id, function(res) {
                if(res.status === 'success') {
                    const o = res.data;
                    let html = `
                        <div class="row">
                            <div class="col-md-6 mb-3"><strong>Order ID:</strong> #${o.id}</div>
                            <div class="col-md-6 mb-3"><strong>Status:</strong> <span class="badge bg-secondary">${o.status}</span></div>
                            <div class="col-md-6 mb-3"><strong>Customer:</strong> ${o.customer_name}</div>
                            <div class="col-md-6 mb-3"><strong>Destination Area:</strong> ${o.destination_area_name || 'N/A'}</div>
                            <div class="col-md-6 mb-3"><strong>Time Created:</strong> ${new Date(o.time_created).toLocaleString()}</div>
                            <div class="col-md-6 mb-3"><strong>Total Amount:</strong> ₦${parseFloat(o.total_amount).toLocaleString()}</div>
                        </div>
                        <h6 class="fw-bold mt-4 border-bottom pb-2">Order Items</h6>
                        <table class="table table-sm mt-3">
                            <thead><tr><th>Item</th><th>Quantity</th><th>Price at Purchase</th><th>Total</th></tr></thead>
                            <tbody>
                    `;
                    o.items.forEach(item => {
                        html += `<tr>
                            <td>${item.product_name} - ${item.variant_name}</td>
                            <td>${item.quantity}</td>
                            <td>₦${parseFloat(item.price_at_purchase).toLocaleString()}</td>
                            <td>₦${(parseFloat(item.price_at_purchase) * parseInt(item.quantity)).toLocaleString()}</td>
                        </tr>`;
                    });
                    html += `</tbody></table>`;
                    $('#orderDetailsContent').html(html);
                } else {
                    $('#orderDetailsContent').html('<div class="alert alert-danger">Error loading details.</div>');
                }
            });
        }

        function assignToCourier(id) {
            $('#assignOrderId').val(id);
            $('#assignModal').modal('show');
        }

        function submitAssign() {
            const id = $('#assignOrderId').val();
            const val = $('#assignValue').val();
            if (!val) return alert("Please enter courier ID");
            $.post('index.php/api/auction/update-order', { id: id, action: 'Assign', value: val }, function(res) {
                if(res.status === 'success') { $('#assignModal').modal('hide'); loadGlobalOrders(); }
                else { alert(res.message); }
            });
        }

        function flagOrder(id) {
            if(confirm('Are you sure you want to flag this order as fraudulent?')) {
                $.post('index.php/api/auction/update-order', { id: id, action: 'Flag' }, function(res) {
                    if(res.status === 'success') loadGlobalOrders();
                    else alert(res.message);
                });
            }
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
