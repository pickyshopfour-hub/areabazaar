/**
 * Thrift-Z Storefront Module
 * Handles Thrift-Z 4 Auction Arenas, condition verifications, bid actions, and quick specs modal.
 */
(function (window, $) {
    'use strict';

    const ThriftZStore = {
        name: 'ThriftZ',
        currency: 'NGN',

        init() {
            this.bindGlobalEvents();
        },

        bindGlobalEvents() {
            // Global quick view spec modal helper
            $(document).on('click', '[data-action="view-thriftz-specs"]', function (e) {
                e.preventDefault();
                const productId = $(this).data('id');
                ThriftZStore.openProductQuickView(productId);
            });
        },

        getProductById(id) {
            const catalog = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.THRIFTZ_PRODUCTS) || [];
            return catalog.find(item => String(item.id) === String(id)) || null;
        },

        openProductQuickView(id) {
            const item = this.getProductById(id);
            if (!item) return;

            const modalEl = document.getElementById('quickViewModal');
            if (!modalEl) return;

            let specsRows = '';
            if (item.specifications) {
                Object.entries(item.specifications).forEach(([k, v]) => {
                    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    specsRows += `<tr><th class="ps-3 py-2 text-muted small">${label}</th><td class="pe-3 py-2 text-dark small fw-semibold">${v}</td></tr>`;
                });
            }

            const conditionBadgeClass = item.condition === 'Like New' ? 'bg-success' : (item.condition === 'Refurbished' ? 'bg-info' : 'bg-warning text-dark');

            const html = `
                <div class="row g-4 align-items-center">
                    <div class="col-md-5 text-center">
                        <div class="p-3 bg-light rounded-4 border">
                            <img src="${item.image}" alt="${item.title}" class="img-fluid" style="max-height: 220px; object-fit: contain;">
                        </div>
                        <div class="mt-3 text-start">
                            <span class="badge ${conditionBadgeClass} px-2 py-1 rounded-pill mb-1">
                                ${item.condition} (Grade ${item.conditionGrade || 'A'})
                            </span>
                            <h6 class="fw-bold text-dark mb-1 mt-1">${item.title}</h6>
                            <p class="small text-muted mb-0">Seller: <strong>${item.seller || 'Verified Merchant'}</strong> (${item.sellerRating || '4.9 ★'})</p>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-dark">${item.categoryName || item.category}</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa fa-shield-check me-1"></i> 48-Hour Inspection Warranty</span>
                        </div>
                        <p class="text-secondary small mb-3">${item.description}</p>
                        <div class="table-responsive border rounded-3 mb-3 bg-white">
                            <table class="table table-sm table-striped mb-0">
                                <tbody>
                                    ${specsRows || '<tr><td colspan="2" class="p-2 text-center text-muted small">Verified inspection specs recorded.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <small class="text-muted d-block text-xs">Thrift-Z Verified Price</small>
                                <span class="fs-4 fw-extrabold text-dark">${window.AreaBazaarStorefront.formatNaira(item.price)}</span>
                                ${item.originalPrice ? `<del class="text-muted small ms-2">${window.AreaBazaarStorefront.formatNaira(item.originalPrice)}</del>` : ''}
                            </div>
                            <span class="badge bg-light text-muted border px-3 py-2 rounded-pill small">
                                <i class="fa fa-box-check me-1"></i> In Stock
                            </span>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="product-details.html?id=${item.id}" class="btn btn-dark flex-fill fw-bold py-2 shadow-sm text-center">
                                See Full Details & Buyer Protection <i class="fa fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            $('#quickViewModal').html(html);
            if ($.fn.iziModal) {
                $('#quickViewModal').iziModal('open');
            }
        }
    };

    window.ThriftZStore = ThriftZStore;

    $(document).ready(function () {
        ThriftZStore.init();
    });
})(window, window.jQuery);
