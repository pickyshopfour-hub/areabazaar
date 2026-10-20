<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auction Order Items Management - WHM</title>
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
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_orders.php"><i class="fa fa-clipboard-list me-2"></i> Auction Orders Mgt</a>
                    <a class="nav-link active mb-2" href="whm_auction_items.php"><i class="fa fa-box-open me-2"></i> Auction Order Items Mgt</a>
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
                        <h3 class="fw-bold">Auction Order Items Management</h3>
                        <p class="text-muted mb-0">Track exact order items through the warehouse pipeline.</p>
                    </div>
                    <div id="notifBellContainer"></div>
                </div>

                <!-- Filters -->
                <div class="card p-4 shadow-sm border-0 mb-4 rounded-4 bg-white">
                    <div class="row g-2 align-items-end">
                        <div class="col-md-3">
                            <label class="small text-muted fw-bold">Filter By</label>
                            <select id="filterFactor" class="form-select border-0 bg-light">
                                <option value="">Select Factor...</option>
                                <option value="order_id">Order ID</option>
                                <option value="customer_id">Customer ID</option>
                                <option value="product">Product</option>
                                <option value="origin_area">Origin Area</option>
                                <option value="session_id">Session</option>
                                <option value="wave_id">Wave</option>
                                <option value="order_status">Order Status</option>
                                <option value="urgency">Urgency</option>
                                <option value="assigned_to">Assigned To</option>
                                <option value="approval_status">Approval Status</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="small text-muted fw-bold">Value</label>
                            <input type="text" id="filterValue" class="form-control border-0 bg-light" placeholder="Enter filter value...">
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-primary w-100" onclick="loadOrderItems(1)">Filter</button>
                        </div>
                    </div>
                </div>

                <!-- Mass Actions Header -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex gap-2">
                        <select id="massActionHeader" class="form-select form-select-sm" style="width: auto;">
                            <option value="">Select Mass Action...</option>
                            <option value="status">Set WHM Status</option>
                            <option value="hide">Hide</option>
                            <option value="export">Export to Sheet</option>
                        </select>
                        <button class="btn btn-sm btn-dark" onclick="applyMassAction('Header')">Apply to Selected</button>
                    </div>
                </div>

                <!-- Order Items Table -->
                <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-3">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0 bg-white">
                            <thead class="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th class="ps-4"><input type="checkbox" id="selectAllItems"></th>
                                    <th>Item Details</th>
                                    <th>Order Info</th>
                                    <th>WHM Status</th>
                                    <th>Qty</th>
                                    <th class="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="orderItemsBody">
                                <tr><td colspan="6" class="text-center py-5">Loading order items...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Mass Actions Footer & Pagination -->
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex gap-2">
                        <select id="massActionFooter" class="form-select form-select-sm" style="width: auto;">
                            <option value="">Select Mass Action...</option>
                            <option value="status">Set WHM Status</option>
                            <option value="hide">Hide</option>
                            <option value="export">Export to Sheet</option>
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
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header border-0 pb-0">
                    <h5 class="fw-bold"><i class="fa fa-info-circle me-2 text-primary"></i> Parent Order Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4" id="orderDetailsContent"></div>
            </div>
        </div>
    </div>

    <!-- Status Update Modal -->
    <div class="modal fade" id="itemWhmStatusModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header border-0 pb-0">
                    <h5 class="fw-bold">Set WHM Status</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="actionItemIds">
                    <select id="newWhmStatus" class="form-select mb-3">
                        <option value="requested">Requested</option>
                        <option value="supplied">Supplied</option>
                        <option value="QA-passed">QA Passed</option>
                        <option value="packed">Packed</option>
                        <option value="labelled">Labelled</option>
                        <option value="staging-land">Staging Land</option>
                        <option value="staging-cleared">Staging Cleared</option>
                        <option value="area-sorted">Area Sorted</option>
                        <option value="loaded">Loaded</option>
                        <option value="zbd-transit">ZBD Transit</option>
                        <option value="area-land">Area Land</option>
                        <option value="area-cleared">Area Cleared</option>
                        <option value="dispatched">Dispatched</option>
                    </select>
                    <button class="btn btn-primary w-100 fw-bold" onclick="submitWhmStatus()">Update Status</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Ship Notes Modal -->
    <div class="modal fade" id="shipNotesModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header border-0 pb-0">
                    <h5 class="fw-bold">Add Ship Notes</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="noteItemId">
                    <textarea id="shipNoteContent" class="form-control mb-3" rows="4" placeholder="Enter notes here..."></textarea>
                    <button class="btn btn-primary w-100 fw-bold" onclick="submitShipNote()">Save Notes</button>
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
            loadOrderItems(1);
            fetchStaffList();

            $('#selectAllItems').change(function() {
                $('.item-chk').prop('checked', $(this).prop('checked'));
            });
        });

        function loadOrderItems(page) {
            currentPage = page;
            const factor = $('#filterFactor').val();
            const val = $('#filterValue').val();
            
            $.get(`index.php/api/whm/order-items-mgt?page=${page}&factor=${factor}&value=${val}`, function(res) {
                if(res.status === 'success') {
                    renderItems(res.data.items);
                    renderPagination(res.data.total_pages, page);
                }
            });
        }

        function renderItems(items) {
            let html = '';
            if (items.length === 0) {
                html = '<tr   ><td colspan="6" class="text-center py-5 text-muted">No order items found.</td></tr>';
            } else {
                items.forEach(i => {
                    let hideOpt = i.whm_status === 'dispatched' ? `<li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="hideItem(${i.id})">Hide</a></li>` : '';
                    html += `<tr id="item-row-${i.id}"  >
                        <td class="ps-4"><input type="checkbox" class="item-chk" value="${i.id}"></td>
                        <td    onclick="viewDetails(${i.order_id}, ${i.id})"   >
                            <div class="fw-bold">${i.product_name}</div>
                            <div class="small text-muted">${i.variant_name}</div>
                        </td>
                        <td>
                            <div class="small">Ord: #${i.order_id}</div>
                            <div class="extra-small text-muted">${i.customer_name}</div>
                        </td>
                        <td    onclick="viewDetails(${i.order_id}, ${i.id})"   ><span class="badge bg-secondary">${i.whm_status || 'requested'}</span></td>
                        <td>${i.quantity}</td>
                        <td class="text-end pe-4">
                            <div class="d-flex justify-content-end gap-1">
                                <button class="btn btn-sm btn-outline-dark" onclick="openQueryModal(${i.id}, 'OrderItem')" title="Query Item"><i class="fa fa-question"></i></button>
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown">Actions</button>
                                <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                                    <li><a class="dropdown-item" href="javascript:void(0)" onclick="viewDetails(${i.order_id}, ${i.id})">View Details</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0)" onclick="openStatusModal([${i.id}])">Set WHM Status</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0)" onclick="queryAdmin(${i.id})">Query Admin</a></li>
                                    <li><a class="dropdown-item text-warning" href="javascript:void(0)" onclick="flagItem(${i.id})">Flag</a></li>
                                    ${hideOpt}
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="javascript:void(0)" onclick="openNotesModal(${i.id})">Add Ship Notes</a></li>
                                </ul>
                                </div>
                            </div>
                        </td>
                    </tr>`;
                });
            }
            $('#orderItemsBody').html(html);
        }

        function renderPagination(total, current) {
            let html = '';
            for(let i=1; i<=total; i++) {
                html += `<li class="page-item ${i===current ? 'active' : ''}"><a class="page-link" href="javascript:void(0)" onclick="loadOrderItems(${i})">${i}</a></li>`;
            }
            $('#pagination').html(html);
        }

        function viewDetails(orderId, itemId) {
            $('#orderDetailsModal').modal('show');
            $('#orderDetailsContent').html('<div class="text-center py-5 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading parent order details...</div>');
            $.get('index.php/api/order/details?id=' + orderId, function(res) {
                if(res.status === 'success') {
                    let o = res.data;
                    let html = `<div class="mb-3 p-3 bg-light rounded-3">
                                    <strong>Parent Order:</strong> #${o.id} &nbsp;|&nbsp; 
                                    <strong>Customer:</strong> ${o.customer_name || 'N/A'} &nbsp;|&nbsp; 
                                    <strong>Status:</strong> <span class="badge bg-secondary">${o.status}</span>
                                </div>`;
                    html += `<h6 class="fw-bold mt-4 mb-3">Order Items Roster</h6>`;
                    html += `<table class="table table-hover table-sm border align-middle">
                                <thead class="bg-light text-muted small">
                                    <tr><th>Item Details</th><th class="text-center">Qty</th><th class="text-end">Status</th></tr>
                                </thead>
                                <tbody>`;
                    o.items.forEach(i => {
                        let isHighlighted = (i.id == itemId) ? 'table-primary-light border-start border-4 border-primary' : '';
                        html += `<tr class="${isHighlighted}">
                                    <td class="ps-3">
                                        <div class="fw-bold text-dark">${i.product_name}</div>
                                        <div class="small text-muted"><i class="fa fa-tag me-1 text-primary"></i>${i.variant_name}</div>
                                    </td>
                                    <td class="text-center fw-bold">${i.quantity}</td>
                                    <td class="text-end"><span class="badge bg-light text-dark border">${i.whm_status || 'requested'}</span></td>
                                </tr>`;
                    });
                    html += `</tbody></table>`;
                    $('#orderDetailsContent').html(html);
                } else {
                    $('#orderDetailsContent').html(`<div class="alert alert-danger">Error loading parent order details.</div>`);
                }
            }).fail(function() {
                $('#orderDetailsContent').html(`<div class="alert alert-danger">Failed to fetch order details.</div>`);
            });
        }

        function applyMassAction(context) {
            const action = $('#massAction' + context).val();
            if(!action) return alert("Select an action");
            
            const selected = [];
            $('.item-chk:checked').each(function() { selected.push($(this).val()); });
            if(selected.length === 0) return alert("Select at least one item.");

            if(action === 'status') {
                openStatusModal(selected);
            } else if(action === 'hide') {
                $.post('index.php/api/whm/update-item-action', { action: 'hide', ids: selected }, function(res){
                    loadOrderItems(currentPage);
                });
            } else if(action === 'export') {
                $.post('index.php/api/whm/export-items-sheet', { ids: selected }, function(res) {
                    if(res.status === 'success') { window.open(res.url, '_blank'); }
                    else alert(res.message);
                });
            }
        }

        function openStatusModal(idsArray) {
            $('#actionItemIds').val(idsArray.join(','));
            $('#itemWhmStatusModal').modal('show');
        }

        function submitWhmStatus() {
            const ids = $('#actionItemIds').val().split(',');
            const status = $('#newWhmStatus').val();
            
            $.post('index.php/api/whm/update-item-status', { ids: ids, status: status }, function(res) {
                $('#itemWhmStatusModal').modal('hide');
                loadOrderItems(currentPage);
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
            $('#queryModalTitle').text('Issue Query on Order Item #' + id);
            $('#flagTypeGroup').hide();
            $('#queryForm')[0].reset();
            $('#queryModal').modal('show');
        }

        function flagItem(id) {
            $('#queryActionType').val('flag');
            $('#querySubjectId').val(id);
            $('#queryModalTitle').text('Flag Order Item #' + id);
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

        function hideItem(id) {
            if(confirm("Hide this item?")) {
                $.post('index.php/api/whm/update-item-action', { action: 'hide', ids: [id] }, function() {
                    loadOrderItems(currentPage);
                });
            }
        }

        function openNotesModal(id) {
            $('#noteItemId').val(id);
            $('#shipNoteContent').val('');
            $('#shipNotesModal').modal('show');
        }

        function submitShipNote() {
            const id = $('#noteItemId').val();
            const note = $('#shipNoteContent').val();
            $.post('index.php/api/whm/update-item-action', { action: 'add_note', ids: [id], note: note }, function(res) {
                $('#shipNotesModal').modal('hide');
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
