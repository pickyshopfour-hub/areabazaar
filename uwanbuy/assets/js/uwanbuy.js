/**
 * UwanBuy Storefront Module
 * Handles UwanBuy-specific catalog interactions, quick specs modal, and cart operations.
 */
(function (window, $) {
    'use strict';

    const UwanBuyStore = {
        name: 'UwanBuy',
        currency: 'NGN',

        init() {
            this.bindGlobalEvents();
        },

        bindGlobalEvents() {
            // Global quick view spec modal helper
            $(document).on('click', '[data-action="view-uwanbuy-specs"]', function (e) {
                e.preventDefault();
                const productId = $(this).data('id');
                UwanBuyStore.openProductQuickView(productId);
            });
        },

        getProductById(id) {
            const catalog = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.UWANBUY_PRODUCTS) || [];
            return catalog.find(item => String(item.id) === String(id)) || null;
        },

        openProductQuickView(id) {
            if (window.UwanBuyEngine && typeof window.UwanBuyEngine.openQuickViewModal === 'function') {
                return window.UwanBuyEngine.openQuickViewModal(id);
            }
            const product = this.getProductById(id);
            if (!product) return;

            const modalEl = document.getElementById('quickViewModal');
            if (!modalEl) return;

            let specsRows = '';
            if (product.specifications) {
                Object.entries(product.specifications).forEach(([k, v]) => {
                    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    specsRows += `<tr><th class="ps-3 py-2 text-muted small">${label}</th><td class="pe-3 py-2 text-dark small fw-semibold">${v}</td></tr>`;
                });
            }

            const html = `
                <div class="row g-4 align-items-center">
                    <div class="col-md-5 text-center">
                        <div class="p-3 bg-light rounded-4 border">
                            <img src="${product.image}" alt="${product.name}" class="img-fluid" style="max-height: 220px; object-fit: contain;">
                        </div>
                        <div class="mt-3 text-start">
                            <span class="badge bg-danger-subtle text-danger fw-bold px-2 py-1 rounded-pill mb-1">
                                <i class="fa fa-star text-warning me-1"></i> ${product.rating || '4.8'} (${product.reviewsCount || 42} reviews)
                            </span>
                            <h6 class="fw-bold text-dark mb-1 mt-1">${product.name}</h6>
                            <p class="small text-muted mb-0">Brand: <strong>${product.brand || 'Verified'}</strong></p>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-dark">${product.categoryName || product.category}</span>
                            <span class="badge bg-light text-muted border">${product.subCategory || 'General'}</span>
                        </div>
                        <p class="text-secondary small mb-3">${product.description}</p>
                        <div class="table-responsive border rounded-3 mb-3 bg-white">
                            <table class="table table-sm table-striped mb-0">
                                <tbody>
                                    ${specsRows || '<tr><td colspan="2" class="p-2 text-center text-muted small">Standard specifications apply.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <small class="text-muted d-block text-xs">Unit Price</small>
                                <span class="fs-4 fw-extrabold text-danger">${window.AreaBazaarStorefront.formatNaira(product.price)}</span>
                            </div>
                            <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill small">
                                <i class="fa fa-truck-fast me-1"></i> 60-min Local Hub Delivery
                            </span>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="product-details.html?id=${product.id}" class="btn btn-danger flex-fill fw-bold py-2 shadow-sm text-center">
                                See Full Details <i class="fa fa-arrow-right ms-1"></i>
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

    window.UwanBuyStore = UwanBuyStore;

    $(document).ready(function () {
        UwanBuyStore.init();
    });
})(window, window.jQuery);
