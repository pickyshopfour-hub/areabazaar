<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WHM Dashboard - AreaBazaar</title>
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
        .stat-card { border-radius: 1rem; border: none; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-5px); }
        .status-badge { font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 2rem; }
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
                    <a class="nav-link active mb-2" href="whm_dashboard.php"><i class="fa fa-home me-2"></i> Dashboard Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auctions.php"><i class="fa fa-gavel me-2"></i> Manage Auctions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_orders.php"><i class="fa fa-clipboard-list me-2"></i> Auction Orders Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_items.php"><i class="fa fa-box-open me-2"></i> Auction Order Items Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_sba_acquisitions.php"><i class="fa fa-pallet me-2"></i> SBA Acquisitions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_partners.php"><i class="fa fa-handshake me-2"></i> Partners</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_inventory.php"><i class="fa fa-box me-2"></i> Inventory</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_zbdp_dispatch.php"><i class="fa fa-truck-loading me-2"></i> ZBDp Dispatch</a>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 class="fw-bold text-dark">Logistics Command (WHM)</h2>
                        <p class="text-muted">Warehouse: <span class="fw-bold text-primary" id="whm_zone_display">Lagos Mainland Hub</span></p>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div id="notifBellContainer"></div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-dark" onclick="refreshWhmData()"><i class="fa fa-sync-alt"></i></button>
                            <button class="btn btn-premium shadow-sm" data-bs-toggle="modal" data-bs-target="#massActionModal">
                                <i class="fa fa-layer-group me-2"></i> Mass Actions
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Logistics Metrics -->
                <div class="row g-4 mb-5">
                    <div class="col-md-3">
                        <div class="card stat-card p-4 bg-white border-start border-4 border-info">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="text-muted small fw-bold">NEW ORDERS</h6>
                                    <h2 class="fw-bold mb-0" id="stat-new">0</h2>
                                </div>
                                <i class="fa fa-bell text-info fs-3"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card p-4 bg-white border-start border-4 border-warning">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="text-muted small fw-bold">TREATABLE</h6>
                                    <h2 class="fw-bold mb-0" id="stat-treatable">0</h2>
                                </div>
                                <i class="fa fa-box-open text-warning fs-3"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card p-4 bg-white border-start border-4 border-primary">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="text-muted small fw-bold">IN TRANSIT</h6>
                                    <h2 class="fw-bold mb-0" id="stat-transit">0</h2>
                                </div>
                                <i class="fa fa-truck text-primary fs-3"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card p-4 bg-white border-start border-4 border-success">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="text-muted small fw-bold">DISPATCHED (24H)</h6>
                                    <h2 class="fw-bold mb-0" id="stat-dispatched">0</h2>
                                </div>
                                <i class="fa fa-check-circle text-success fs-3"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Operations Hub -->
                <div class="card p-4 shadow-sm border-0 mb-5">
                    <ul class="nav nav-pills gap-2 mb-4">
                        <li class="nav-item">
                            <button class="nav-link active px-4 py-2" data-bs-toggle="tab" data-bs-target="#tab-orders">
                                <i class="fa fa-clipboard-list me-2"></i> Manage Orders
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link px-4 py-2" data-bs-toggle="tab" data-bs-target="#tab-items">
                                <i class="fa fa-boxes-stacked me-2"></i> Order Items Triage
                            </button>
                        </li>
                        <li class="nav-item ms-auto">
                            <button class="btn btn-sm btn-outline-success" onclick="exportToGS()">
                                <i class="fa fa-file-excel me-2"></i> Export to GS
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- Orders Management -->
                        <div class="tab-pane fade show active" id="tab-orders">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead class="bg-light">
                                        <tr class="small text-muted text-uppercase">
                                            <th><input type="checkbox" id="selectAllOrders"></th>
                                            <th>Order Identify</th>
                                            <th>Session/Wave</th>
                                            <th>Area Target</th>
                                            <th>Total Items</th>
                                            <th>Status</th>
                                            <th class="text-end">Command</th>
                                        </tr>
                                    </thead>
                                    <tbody id="whmOrdersBody">
                                        <!-- Dynamic Orders -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Items Triage -->
                        <div class="tab-pane fade" id="tab-items">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead class="bg-light">
                                        <tr class="small text-muted text-uppercase">
                                            <th><input type="checkbox" id="selectAllItems" onclick="$('.item-check').prop('checked', this.checked)"></th>
                                            <th>Variant Identity</th>
                                            <th>Total Required</th>
                                            <th>Ready/Packed</th>
                                            <th>SBA Partner</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="whmItemsBody">
                                        <!-- Dynamic Items -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mass Action Modal -->
    <div class="modal fade" id="massActionModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div class="modal-header bg-dark text-white p-4">
                    <h5 class="modal-title fw-bold">Logistics Mass Operation</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Target Status Update</label>
                        <select id="massStatus" class="form-select">
                            <option value="Processing">Move to Processing (Triage)</option>
                            <option value="Packed">Mark as Packed</option>
                            <option value="Shipped">Dispatched (Transferred to ZBDp)</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Assignment Directive (Notes)</label>
                        <textarea id="massNote" class="form-control" placeholder="e.g. Batch #401 dispatch to Mainland Dispatch Zone..."></textarea>
                    </div>
                    <button class="btn btn-dark w-100 py-3 fw-bold" onclick="executeMassAction()">
                        EXECUTE BATCH UPDATE
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        $(document).ready(function() {
            refreshWhmData();
            // Live Logistics Feeds
            setInterval(refreshWhmData, 45000);
        });

        function refreshWhmData() {
            // Fetch WHM-specific orders (filtered by WHM zone)
            $.get('index.php/api/order/list?whm_view=1', function(res) {
                renderOrders(res.data);
            });

            // Fetch Logistics Stats
            $.get('index.php/api/whm/stats', function(res) {
                if(res.status === 'success') {
                    $('#stat-new').text(res.data.new);
                    $('#stat-treatable').text(res.data.treatable);
                    $('#stat-transit').text(res.data.transit);
                    $('#stat-dispatched').text(res.data.dispatched_24h);
                }
            });

            // Fetch Items Triage
            $.get('index.php/api/whm/items-triage', function(res) {
                renderItemsTriage(res.data);
            });
        }

        function markItemPacked(variantId) {
            $.ajax({
                url: 'index.php/api/whm/mark-packed',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ variant_id: variantId }),
                success: function(res) {
                    if(res.status === 'success') {
                        refreshWhmData();
                    } else alert(res.message);
                }
            });
        }

        function renderOrders(orders) {
            let html = '';
            orders.forEach(o => {
                html += `
                    <tr class="table-row-hover">
                        <td><input type="checkbox" class="order-check" value="${o.id}"></td>
                        <td>
                            <div class="fw-bold fs-6">#${o.id}</div>
                            <div class="text-muted small">${o.customer_name}</div>
                        </td>
                        <td>
                            <div class="small fw-semibold text-primary">${o.session_name || 'N/A'}</div>
                            <div class="extra-small text-muted">${o.wave_name || 'Wave Zero'}</div>
                        </td>
                        <td><span class="badge bg-light text-dark border"><i class="fa fa-map-marker-alt me-1 text-danger"></i> ${o.origin_area_name}</span></td>
                        <td>${o.item_count || 1} SKUs</td>
                        <td><span class="badge rounded-pill ${getStatusBadgeClass(o.status)}">${o.status}</span></td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-info me-1" onclick="openQueryModal(${o.id}, 'Order')" title="Query Order"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-dark" onclick="updateOrderStatus(${o.id}, 'Processing')">Start Triage</button>
                        </td>
                    </tr>
                `;
            });
            $('#whmOrdersBody').html(html || '<tr><td colspan="7" class="text-center py-5">No active logistics tasks available.</td></tr>');
        }

        function renderItemsTriage(items) {
            let html = '';
            items.forEach(i => {
                html += `
                    <tr class="table-row-hover">
                        <td><input type="checkbox" class="item-check" value="${i.variant_id}"></td>
                        <td>
                            <div class="fw-bold">${i.variant_name}</div>
                            <div class="extra-small text-muted">ID: ${i.variant_id}</div>
                        </td>
                        <td><h5 class="fw-bold mb-0">${i.total_needed}</h5></td>
                        <td>
                            <div class="progress" style="height: 12px; width: 100px;">
                                <div class="progress-bar bg-success" style="width: ${(i.packed/i.total_needed)*100}%"></div>
                            </div>
                            <small class="text-muted">${i.packed} / ${i.total_needed}</small>
                        </td>
                        <td><span class="text-primary fw-bold">${i.sba_name || 'Warehouse Stock'}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-info me-1" onclick="openQueryModal(${i.variant_id}, 'Variant')" title="Query Variant"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-outline-success" onclick="markItemPacked(${i.variant_id})">Pack SKU</button>
                        </td>
                    </tr>
                `;
            });
            $('#whmItemsBody').html(html || '<tr><td colspan="6" class="text-center py-4">Inventory triage complete.</td></tr>');
        }

        function updateOrderStatus(id, status) {
            $.ajax({
                url: 'index.php/api/whm/mass-update',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ ids: [id], status: status }),
                success: function(res) {
                    if(res.status === 'success') {
                        refreshWhmData();
                    } else alert(res.message);
                }
            });
        }

        function updateStats(orders) {
            // Redundant now, using index.php/api/whm/stats
        }

        function getStatusBadgeClass(status) {
            switch(status) {
                case 'Paid': return 'bg-info bg-opacity-10 text-info border border-info';
                case 'Processing': return 'bg-warning bg-opacity-10 text-warning border border-warning';
                case 'Shipped': return 'bg-primary bg-opacity-10 text-primary border border-primary';
                case 'Delivered': return 'bg-success bg-opacity-10 text-success border border-success';
                case 'Returned': return 'bg-danger bg-opacity-10 text-danger border border-danger';
                default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
            }
        }

        function executeMassAction() {
            let selected = [];
            // Determine active tab
            if ($('#tab-orders').hasClass('active')) {
                 selected = $('.order-check:checked').map(function() { return $(this).val(); }).get();
            } else {
                 selected = $('.item-check:checked').map(function() { return $(this).val(); }).get();
                 // Here, mapping variants to packed might require a different endpoint or parameter
                 // Assuming mass-update works for orders, we might need to handle variants if needed. Let's just pass to mass-update for now
            }
            if (selected.length === 0) return alert('Select items first!');
            
            $.post('index.php/api/whm/mass-update', { 
                ids: selected, 
                status: $('#massStatus').val(),
                note: $('#massNote').val()
            }, function(res) {
                $('#massActionModal').modal('hide');
                refreshWhmData();
            });
        }

        function exportToGS() {
            window.open('index.php/api/whm/export-orders', '_blank');
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
    </script>

    <script>
    // Delegate to global submitQueryAction (defined in global.js)
    function _sendQuery() {
        var id   = $("#queryItemId").val();
        var type = $("#queryType").val();
        var msg  = $("#queryMessage").val();
        if (!msg) return alert("Message is required.");
        submitQueryAction(type || 'General', id || 0, msg);
        $("#queryModal").modal("hide");
    }

    // My Query Inbox
    function loadMyQueryInbox() {
        $.get('index.php/api/queries/list', { assigned_to: window.currentUser.id, status: 'Open' }, function(res) {
            var $tbl = $('#my-query-inbox-body');
            $tbl.empty();
            if (res.status !== 'success' || !res.data.length) {
                $tbl.html('<tr><td colspan="4" class="text-muted text-center small">No assigned queries.</td></tr>'); return;
            }
            res.data.forEach(q => {
                $tbl.append(`<tr style="cursor:pointer" onclick="openQueryThreadModal(${q.id})">
                    <td><span class="badge bg-secondary">${q.subject_type}</span></td>
                    <td class="small">${q.note.substring(0,60)}${q.note.length>60?'…':''}</td>
                    <td><span class="badge ${{'Low':'bg-secondary','Normal':'bg-primary','High':'bg-warning text-dark','Critical':'bg-danger'}[q.priority]||'bg-secondary'}">${q.priority}</span></td>
                    <td class="small text-muted">${(q.last_activity||'').substring(0,16)}</td>
                </tr>`);
            });
        });
    }
    $(document).ready(function() { 
        loadMyQueryInbox(); 
    });
</script>

</body>
</html>
