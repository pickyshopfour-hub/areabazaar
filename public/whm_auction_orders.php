<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auction Orders Management - WHM</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css?v=1772656066.00796" rel="stylesheet">
    <script>
        <?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
$__db = (new Database())->getConnection();
injectCurrentUserJs($__db, ['id' => 1, 'name' => 'WHM User', 'role' => 'WHM', 'type' => 'staff']);
?>
    </script>
    <style>
        body { background: #f1f5f9; }
        .sidebar { min-height: 100vh; background: #1e293b; color: white; }
        .nav-link { color: #94a3b8; }
        .nav-link.active { color: white; background: rgba(255,255,255,0.1); border-radius: 0.5rem; }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 sidebar p-4">
                <h4 class="fw-bold mb-5">AreaBazaar <small class="d-block text-muted small" style="font-size: 0.6rem;">WHM Portal</small></h4>
                <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="whm_dashboard.php"><i class="fa fa-home me-2"></i> Dashboard Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auctions.php"><i class="fa fa-gavel me-2"></i> Manage Auctions</a>
                    <a class="nav-link active mb-2" href="whm_auction_orders.php"><i class="fa fa-clipboard-list me-2"></i> Auction Orders Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_items.php"><i class="fa fa-box-open me-2"></i> Auction Order Items Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_sba_acquisitions.php"><i class="fa fa-pallet me-2"></i> SBA Acquisitions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_partners.php"><i class="fa fa-handshake me-2"></i> Partners</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_inventory.php"><i class="fa fa-box me-2"></i> Inventory</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_zbdp_dispatch.php"><i class="fa fa-truck-loading me-2"></i> ZBDp Dispatch</a>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 class="fw-bold">Auction Orders Management</h3>
                        <p class="text-muted mb-0">Manage orders, filter, and perform mass actions.</p>
                    </div>
                    <div id="notifBellContainer"></div>
                </div>

                <!-- Filters -->
                <div class="card p-4 shadow-sm border-0 mb-4 rounded-4">
                    <div class="row g-2 align-items-end">
                        <div class="col-md-2">
                            <label class="small text-muted fw-bold">Filter By</label>
                            <select id="filterFactor" class="form-select border-0 bg-light">
                                <option value="">Select Factor...</option>
                                <option value="destination_area">Origin Area (Destination)</option>
                                <option value="session_id">Session</option>
                                <option value="status">Order Status</option>
                                <option value="is_urgent">Urgency</option>
                                <option value="assigned_to">Assigned To</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted fw-bold">Value</label>
                            <input type="text" id="filterValue" class="form-control border-0 bg-light" placeholder="Enter value...">
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-primary w-100" onclick="loadOrders(1)">Filter</button>
                        </div>
                    </div>
                </div>

                <!-- Mass Actions Header -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex gap-2">
                        <select id="massActionHeader" class="form-select form-select-sm" style="width: auto;">
                            <option value="">Select Mass Action...</option>
                            <option value="export">Export to Sheet</option>
                            <option value="status">Set Status</option>
                        </select>
                        <button class="btn btn-sm btn-dark" onclick="applyMassAction('Header')">Apply to Selected</button>
                    </div>
                </div>

                <!-- Orders Table -->
                <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-3">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th class="ps-4"><input type="checkbox" id="selectAll"></th>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Destination</th>
                                    <th>Status</th>
                                    <th>Urgency</th>
                                    <th class="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="ordersBody">
                                <tr><td colspan="7" class="text-center py-5">Loading orders...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Mass Actions Footer & Pagination -->
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex gap-2">
                        <select id="massActionFooter" class="form-select form-select-sm" style="width: auto;">
                            <option value="">Select Mass Action...</option>
                            <option value="export">Export to Sheet</option>
                            <option value="status">Set Status</option>
                        </select>
                        <button class="btn btn-sm btn-dark" onclick="applyMassAction('Footer')">Apply to Selected</button>
                    </div>
                    
                    <nav>
                        <ul class="pagination pagination-sm mb-0" id="pagination">
                            <!-- Pagination injected here -->
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <!-- Order Details -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header border-0 pb-0">
                    <h5 class="fw-bold">Order Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4" id="orderDetailsContent"></div>
            </div>
        </div>
    </div>

    <!-- Mass Status / Individual Status Modal -->
    <div class="modal fade" id="statusModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header border-0 pb-0">
                    <h5 class="fw-bold">Update Order Status</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="statusOrderIds">
                    <select id="newStatusValue" class="form-select mb-3">
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <button class="btn btn-primary w-100 fw-bold" onclick="submitStatusUpdate()">Update Status</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Query/Flag Modal -->
    

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        let currentPage = 1;

        let staffCache = [];

        $(document).ready(function() {
            loadOrders(1);
            fetchStaffList();

            $('#selectAll').change(function() {
                $('.order-chk').prop('checked', $(this).prop('checked'));
            });

            // Auto-load details if view_order parameter exists
            const urlParams = new URLSearchParams(window.location.search);
            const viewOrder = urlParams.get('view_order');
            if (viewOrder) {
                setTimeout(() => viewDetails(viewOrder), 500);
            }
        });

        function loadOrders(page) {
            currentPage = page;
            const factor = $('#filterFactor').val();
            const val = $('#filterValue').val();
            
            $.get(`index.php/api/whm/orders-mgt?page=${page}&factor=${factor}&value=${val}`, function(res) {
                if(res.status === 'success') {
                    renderOrders(res.data.orders);
                    renderPagination(res.data.total_pages, page);
                }
            });
        }

        function renderOrders(orders) {
            let html = '';
            if (orders.length === 0) {
                html = '<tr><td colspan="7" class="text-center py-5 text-muted">No orders found.</td></tr>';
            } else {
                orders.forEach(o => {
                    html += `<tr >
                        <td class="ps-4"><input type="checkbox" class="order-chk" value="${o.id}"></td>
                        <td class="fw-bold"   onclick="viewDetails(${o.id})"   >#${o.id}</td>
                        <td   onclick="viewDetails(${o.id})"   >${o.customer_name}</td>
                        <td>${o.destination_area_name || 'N/A'}</td>
                        <td   onclick="viewDetails(${o.id})"   ><span class="badge bg-secondary">${o.status}</span></td>
                        <td>${o.is_urgent ? '<span class="text-danger"><i class="fa fa-bolt"></i> Urgent</span>' : 'Standard'}</td>
                        <td class="text-end pe-4">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-dark" onclick="openQueryModal(${o.id}, 'Order')" title="Query Order"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown">Actions</button>
                                <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                                    <li><a class="dropdown-item" href="javascript:void(0)" onclick="viewDetails(${o.id})">View Details</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0)" onclick="queryAdmin(${o.id})">Query Admin</a></li>
                                    <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="flagOrder(${o.id})">Flag</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>`;
                });
            }
            $('#ordersBody').html(html);
        }

        function renderPagination(total, current) {
            let html = '';
            for(let i=1; i<=total; i++) {
                html += `<li class="page-item ${i===current ? 'active' : ''}"><a class="page-link" href="javascript:void(0)" onclick="loadOrders(${i})">${i}</a></li>`;
            }
            $('#pagination').html(html);
        }

        function viewDetails(id) {
            $('#orderDetailsModal').modal('show');
            $('#orderDetailsContent').html('Loading...');
            $.get('index.php/api/order/details?id=' + id, function(res) {
                if(res.status === 'success') {
                    let o = res.data;
                    let html = `<div class="mb-3"><strong>Order:</strong> #${o.id} | <strong>Status:</strong> ${o.status}</div>`;
                    html += `<table class="table table-sm"><thead><tr><th>Item</th><th>Qty</th></tr></thead><tbody>`;
                    o.items.forEach(i => {
                        html += `<tr><td>${i.product_name} - ${i.variant_name}</td><td>${i.quantity}</td></tr>`;
                    });
                    html += `</tbody></table>`;
                    $('#orderDetailsContent').html(html);
                }
            });
        }

        function fetchStaffList() {
            $.get('index.php/api/staff/list', function(res) {
                if(res.status === 'success') {
                    staffCache = res.data;
                    let opts = '<option value="">Select Personnel...</option>';
                    staffCache.forEach(s => opts += `<option value="${s.id}">${s.name || s.first_name} [${s.role}]</option>`);
                    $('#queryAssignSelect').html(opts);
                }
            });
        }

        function queryAdmin(id) {
            $('#queryActionType').val('query');
            $('#querySubjectId').val(id);
            $('#queryModalTitle').text('Issue Query on Order #' + id);
            $('#flagTypeGroup').hide();
            $('#queryForm')[0].reset();
            $('#queryModal').modal('show');
        }

        function flagOrder(id) {
            $('#queryActionType').val('flag');
            $('#querySubjectId').val(id);
            $('#queryModalTitle').text('Flag Order #' + id);
            $('#flagTypeGroup').show();
            $('#queryForm')[0].reset();
            $('#queryModal').modal('show');
        }

        function executeInvestigationSubmit() {
            const formData = $('#queryForm').serialize();
            $.post('index.php/api/query/add', formData, function(res) {
                if (res.status === 'success') {
                    $('#queryModal').modal('hide');
                    alert(res.message);
                } else {
                    alert('Error: ' + res.message);
                }
            });
        }

        function applyMassAction(context) {
            const action = $('#massAction' + context).val();
            if(!action) return alert("Select an action first");
            
            const selected = [];
            $('.order-chk:checked').each(function() { selected.push($(this).val()); });
            
            if(selected.length === 0) return alert("Select at least one order.");

            if(action === 'export') {
                $.post('index.php/api/whm/export-orders-sheet', { ids: selected }, function(res) {
                    if(res.status === 'success') {
                        alert("Exported! URL: " + res.url);
                        window.open(res.url, '_blank');
                    } else alert(res.message);
                });
            } else if(action === 'status') {
                $('#statusOrderIds').val(selected.join(','));
                $('#statusModal').modal('show');
            }
        }

        function submitStatusUpdate() {
            const ids = $('#statusOrderIds').val().split(',');
            const newStatus = $('#newStatusValue').val();
            
            let promises = ids.map(id => {
                return $.post('index.php/api/auction/update-order', { id: id, action: newStatus });
            });
            
            Promise.all(promises).then(() => {
                $('#statusModal').modal('hide');
                loadOrders(currentPage);
            });
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
                    <button type="button" class="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm" onclick="_sendQuery()">Submit Observation</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Floating Global Query Button -->
    <button class="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 2000; border: 3px solid white;" onclick="openQueryModal(0, 'Global')" title="Global Query">
        <i class="fa fa-question fs-2"></i>
    </button>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../assets/js/global.js?v=999"></script>
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
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
