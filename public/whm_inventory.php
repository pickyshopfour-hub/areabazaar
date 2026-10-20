<?php
require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';
_initSession();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Management - AreaBazaar</title>
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
        body { background: #f8fafc; }
        .sidebar { min-height: 100vh; background: #0f172a; color: white; }
        .card { border: none; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .nav-link { color: #94a3b8; transition: all 0.2s; }
        .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
        .variant-row { background: #f1f5f9; display: none; }
        .row-orange { background-color: #fff7ed !important; border-left: 4px solid #f97316; }
    </style>
    <script>window.isWHM = true;</script>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
        <div class="col-md-2 sidebar p-4" style="min-height: 100vh; background: #1e293b; color: white;">
            <h4 class="fw-bold mb-5">AreaBazaar <small class="d-block text-muted small" style="font-size: 0.6rem;">WHM Portal</small></h4>
            <nav class="nav flex-column">
                    <a class="nav-link text-white-50 mb-2" href="whm_dashboard.php"><i class="fa fa-home me-2"></i> Dashboard Overview</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auctions.php"><i class="fa fa-gavel me-2"></i> Manage Auctions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_orders.php"><i class="fa fa-clipboard-list me-2"></i> Auction Orders Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_auction_items.php"><i class="fa fa-box-open me-2"></i> Auction Order Items Mgt</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_sba_acquisitions.php"><i class="fa fa-pallet me-2"></i> SBA Acquisitions</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_partners.php"><i class="fa fa-handshake me-2"></i> Partners</a>
                    <a class="nav-link active mb-2" href="whm_inventory.php"><i class="fa fa-box me-2"></i> Inventory</a>
                    <a class="nav-link text-white-50 mb-2" href="whm_zbdp_dispatch.php"><i class="fa fa-truck-loading me-2"></i> ZBDp Dispatch</a>
                </nav>
        </div>

            <!-- Main Content -->
            <div class="col-md-10 p-5">
                <div class="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 class="fw-bold text-dark">Inventory Command (WHM)</h2>
                        <p class="text-muted">Manage base products and their associated variants for logistics.</p>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div id="notifBellContainer"></div>
                        <div>
                            <button class="btn btn-dark px-4 me-2" data-bs-toggle="modal" data-bs-target="#importCsvModal">
                                <i class="fa fa-file-import me-2"></i> Bulk Import
                            </button>
                            <button class="btn btn-premium px-4 me-2" data-bs-toggle="modal" data-bs-target="#addProductModal">
                                <i class="fa fa-plus me-2"></i> Add Product
                            </button>
                            <button class="btn btn-outline-dark px-4" data-bs-toggle="modal" data-bs-target="#addVariantModal">
                                <i class="fa fa-layer-group me-2"></i> Add Variant
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card p-4">
                    <div class="table-responsive">
                        <table class="table align-middle">
                            <thead>
                                <tr class="text-muted small">
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Variants</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inventoryList">
                                <!-- Dynamic Content -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bulk Import Modal -->
    <div class="modal fade" id="importCsvModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold">Bulk Ingest Products (CSV)</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <div class="alert alert-info small rounded-4">
                        <strong>a&gt;</strong> Keep the photos in the <code>assets/prod_photo_upload/</code> folder BEFORE the import.<br>
                        <strong>b&gt;</strong> Ensure to put the photo file names with file format extensions against the corresponding product and variant items in the CSV.<br>
                        <strong>c&gt;</strong> Run the import when all is set.<br>
                        <i class="fa fa-info-circle me-1 mt-2"></i> CSV must include: product_name, category, brand, has_variants, add_to_session, add_to_showprod, stock, unit_price, product_photo, variant_photo.
                    </div>
                    <form id="importCsvForm">
                        <div class="mb-3">
                            <label class="form-label">Select CSV File</label>
                            <input type="file" name="csv_file" class="form-control" accept=".csv" required>
                        </div>
                        <button type="submit" class="btn btn-dark w-100 py-2 mt-3">Start Bulk Import</button>
                    </form>
                    <div id="importProgress" class="mt-4 d-none">
                        <div class="progress rounded-pill mb-2" style="height: 10px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" style="width: 100%"></div>
                        </div>
                        <p class="text-center small text-muted">Processing products... This may take a moment.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Product Modal -->
    <div class="modal fade" id="addProductModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold">Add Base Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <form id="productForm">
                        <div class="mb-3">
                            <label class="form-label">Product Name</label>
                            <input type="text" name="product_name" class="form-control" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Category</label>
                                <input type="text" name="category" class="form-control">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Brand</label>
                                <input type="text" name="brand" class="form-control">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Product Photo</label>
                            <input type="file" name="product_photo" class="form-control" accept="image/*">
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" name="has_variants" value="1">
                            <label class="form-check-label">Has custom variants?</label>
                            <div class="small text-muted">If off, a standard variant will be auto-created.</div>
                        </div>
                        <button type="submit" class="btn btn-premium w-100 py-2 mt-3">Create Product</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Variant Modal -->
    <div class="modal fade" id="addVariantModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold">Add Product Variant</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <form id="variantForm">
                        <div class="mb-3">
                            <label class="form-label">Parent Product</label>
                            <select id="parentProductSelect" name="base_product_id" class="form-select" required>
                                <option value="">Select Parent Product</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Variant Name</label>
                            <input type="text" name="variant_name" class="form-control" required placeholder="e.g. 5kg Bag, 70g Pack">
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Quantity Value</label>
                                <input type="number" name="quantity_value" class="form-control" value="1">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Unit</label>
                                <input type="text" name="quantity_unit" class="form-control" placeholder="kg, pcs, pack">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Variant Photo</label>
                            <input type="file" name="variant_photo" class="form-control" accept="image/*">
                        </div>
                        <button type="submit" class="btn btn-premium w-100 py-2 mt-3">Create Variant</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Variant Modal -->
    <div class="modal fade" id="editVariantModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold">Edit Variant</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <form id="editVariantForm">
                        <input type="hidden" name="id" id="editVarId">
                        <div class="mb-3">
                            <label class="form-label">Variant Name</label>
                            <input type="text" name="variant_name" id="editVarName" class="form-control" required placeholder="e.g. 5kg Bag">
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Quantity Value</label>
                                <input type="number" name="quantity_value" id="editVarQty" class="form-control" value="1">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Unit</label>
                                <input type="text" name="quantity_unit" id="editVarUnit" class="form-control" placeholder="kg, pcs, pack">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Update Photo</label>
                            <input type="file" name="variant_photo" class="form-control" accept="image/*">
                            <small class="text-muted">Leave blank to keep existing photo.</small>
                        </div>
                        <button type="submit" class="btn btn-premium w-100 py-2 mt-3">Update Variant</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Product Modal -->
    <div class="modal fade" id="editProductModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content border-0 shadow" style="border-radius: 1rem;">
                <div class="modal-header border-0 p-4">
                    <h5 class="modal-title fw-bold">Edit Base Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4 pt-0">
                    <form id="editProductForm">
                        <input type="hidden" name="id" id="editProdId">
                        <div class="mb-3">
                            <label class="form-label">Product Name</label>
                            <input type="text" name="product_name" id="editProdName" class="form-control" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Category</label>
                                <input type="text" name="category" id="editProdCategory" class="form-control">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Brand</label>
                                <input type="text" name="brand" id="editProdBrand" class="form-control">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Bulk Purchase Price (₦)</label>
                            <input type="number" name="bulk_purchase_price" id="editProdPrice" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea name="description" id="editProdDesc" class="form-control" rows="2"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Update Product Photo</label>
                            <input type="file" name="product_photo" class="form-control" accept="image/*">
                            <small class="text-muted">Leave blank to keep existing photo.</small>
                        </div>
                        <button type="submit" class="btn btn-premium w-100 py-2 mt-3">Update Product</button>
                    </form>
                </div>
            </div>
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

    <!-- Floating Global Query Button -->
    <button class="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 2000; border: 3px solid white;" onclick="openQueryModal(0, 'Global')" title="Global Query">
        <i class="fa fa-question fs-2"></i>
    </button>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/global.js?v=999"></script>
    <script>
        const inventory = {
            init() {
                this.loadProducts();
                this.bindEvents();
            },

            loadProducts() {
                fetch('index.php/api/products')
                    .then(res => res.json())
                    .then(data => {
                        if(data.status === 'success') {
                            this.renderProducts(data.data);
                            this.updateParentSelect(data.data);
                        }
                    });
            },

            renderProducts(products) {
                window.inventoryData = products;
                const list = $('#inventoryList');
                list.empty();
                products.forEach(p => {
                    const isAwaitingVariants = p.variants.length === 0;
                    list.append(`
                        <tr class="fw-bold ${isAwaitingVariants ? 'row-orange' : ''}">
                            <td>
                                ${p.product_name}
                                ${p.admin_approval === 'Pending' ? '<span class="badge bg-warning ms-2">Pending</span>' : (p.admin_approval === 'Rejected' ? '<span class="badge bg-danger ms-2">Rejected</span>' : '')}
                            </td>
                            <td><span class="badge bg-light text-dark">${p.category || 'N/A'}</span></td>
                            <td>${p.brand || 'N/A'}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-secondary" onclick="inventory.toggleVariants(${p.id})">
                                    <i class="fa fa-eye me-1"></i> ${p.variants.length} Variants
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-link text-primary" onclick="inventory.editProduct(${p.id})"><i class="fa fa-edit"></i></button><button class="btn btn-sm btn-link text-info" onclick="openQueryModal(${p.id}, 'Product')"><i class="fa fa-question-circle"></i></button>
                            </td>
                        </tr>
                        <tr class="variant-row" id="variants-${p.id}">
                            <td colspan="5" class="p-0">
                                <div class="p-3">
                                    <table class="table table-sm table-borderless mb-0">
                                        <thead>
                                            <tr class="text-muted small">
                                                <th>Variant Name</th>
                                                <th>Specs</th>
                                                <th>Type</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${p.variants.map(v => `
                                                <tr>
                                                    <td>
                                                        ${v.variant_name}
                                                        ${v.admin_approval === 'Pending' ? '<span class="badge bg-warning ms-2">Pending</span>' : (v.admin_approval === 'Rejected' ? '<span class="badge bg-danger ms-2">Rejected</span>' : '')}
                                                    </td>
                                                    <td>${v.quantity_value} ${v.quantity_unit}</td>
                                                    <td><small class="text-muted italic">${v.presentation_type || 'Standard'}</small></td>
                                                    <td>
                                                        <button class="btn btn-sm btn-link text-primary border-0 px-2 shadow-none" onclick="inventory.editVariant(${v.id}, ${p.id})"><i class="fa fa-edit"></i></button><button class="btn btn-sm btn-link text-info" onclick="event.stopImmediatePropagation(); openQueryModal(${v.id}, 'Variant')"><i class="fa fa-question-circle"></i></button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    `);
                });
            },

            toggleVariants(id) {
                $(`#variants-${id}`).toggle();
            },

            updateParentSelect(products) {
                const select = $('#parentProductSelect');
                select.find('option:not(:first)').remove();
                products.forEach(p => {
                    select.append(`<option value="${p.id}">${p.product_name}</option>`);
                });
            },

            editProduct(id) {
                const p = window.inventoryData.find(x => x.id == id);
                if(p) {
                    $('#editProdId').val(p.id);
                    $('#editProdName').val(p.product_name);
                    $('#editProdCategory').val(p.category);
                    $('#editProdBrand').val(p.brand);
                    $('#editProdPrice').val(p.bulk_purchase_price);
                    $('#editProdDesc').val(p.description);
                    $('#editProductModal').modal('show');
                }
            },

            editVariant(variantId, productId) {
                const p = window.inventoryData.find(x => x.id == productId);
                if(!p) return;
                const v = p.variants.find(x => x.id == variantId);
                if(v) {
                    $('#editVarId').val(v.id);
                    $('#editVarName').val(v.variant_name);
                    $('#editVarQty').val(v.quantity_value);
                    $('#editVarUnit').val(v.quantity_unit);
                    $('#editVariantModal').modal('show');
                }
            },

            bindEvents() {
                $('#importCsvForm').on('submit', (e) => {
                    e.preventDefault();
                    $('#importProgress').removeClass('d-none');
                    let formData = new FormData(e.target);
                    formData.append('admin_id', 1);
                    fetch('index.php/api/product/import-csv', { method: 'POST', body: formData })
                    .then(res => res.json()).then(res => {
                        $('#importProgress').addClass('d-none');
                        if(res.status === 'success') { $('#importCsvModal').modal('hide'); alert(res.message); this.loadProducts(); }
                        else { alert(res.message); }
                    }).catch(err => { $('#importProgress').addClass('d-none'); alert('Error processing CSV.'); });
                });

                $('#productForm').on('submit', (e) => {
                    e.preventDefault();
                    let formData = new FormData(e.target);
                    if (!formData.has('has_variants')) formData.append('has_variants', 0);
                    this.submitForm('index.php/api/product/add', formData, '#addProductModal');
                });

                $('#variantForm').on('submit', (e) => {
                    e.preventDefault();
                    let formData = new FormData(e.target);
                    this.submitForm('index.php/api/product/add-variant', formData, '#addVariantModal');
                });

                $('#editProductForm').on('submit', (e) => {
                    e.preventDefault();
                    let formData = new FormData(e.target);
                    this.submitForm('index.php/api/product/update', formData, '#editProductModal');
                });
                
                $('#editVariantForm').on('submit', (e) => {
                    e.preventDefault();
                    let formData = new FormData(e.target);
                    this.submitForm('index.php/api/product/update-variant', formData, '#editVariantModal');
                });
            },

            submitForm(endpoint, formData, modalId) {
                fetch(endpoint, { method: 'POST', body: formData })
                .then(res => res.json()).then(res => {
                    if(res.status === 'success') {
                        const hasVariants = formData.get('has_variants') === '1';
                        $(modalId).modal('hide');
                        this.loadProducts();
                        if (modalId === '#addProductModal' && hasVariants) {
                            setTimeout(() => { $('#addVariantModal').modal('show'); }, 500);
                        } else { alert(res.message); }
                    } else { alert(res.message); }
                });
            }
        };

        function openQueryModal(id, type) {
            $("#queryItemId").val(id); $("#queryType").val(type || "General"); $("#queryMessage").val(""); $("#queryModal").modal("show");
        }

        function _sendQuery() {
            var msg = $("#queryMessage").val(); if (!msg) return alert("Message is required.");
            submitQueryAction($("#queryType").val() || 'General', $("#queryItemId").val() || 0, msg);
            $("#queryModal").modal("hide");
        }

        $(document).ready(() => {
            inventory.init();
        });
    </script>

</body>
</html>
