/**
 * Betasup Storefront Module
 * Handles Betasup cyber cloud kitchen interactions, pot variant pricing, swallow add-ons, and culinary modals.
 */
(function (window, $) {
    'use strict';

    const BetasupStore = {
        name: 'Betasup',
        currency: 'NGN',

        init() {
            this.bindGlobalEvents();
        },

        bindGlobalEvents() {
            // Global quick view spec modal helper
            $(document).on('click', '[data-action="view-betasup-specs"]', function (e) {
                e.preventDefault();
                const productId = Number($(this).data('id'));
                BetasupStore.openProductQuickView(productId);
            });
        },

        getProductById(id) {
            const catalog = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.BETASUP_PRODUCTS) || [];
            return catalog.find(item => Number(item.id) === Number(id)) || null;
        },

        calculatePotTotal(product, variantIndex = 0, swallowIndex = 0, quantity = 1) {
            if (!product) return 0;
            const variant = product.variants ? product.variants[variantIndex] : { price: product.basePrice };
            const swallow = product.swallows ? product.swallows[swallowIndex] : { price: 0 };
            return (variant.price + (swallow.price || 0)) * quantity;
        },

        openProductQuickView(id) {
            const p = this.getProductById(id);
            if (!p) return;

            const modalEl = document.getElementById('quickViewModal');
            if (!modalEl) return;

            let variantsHtml = '';
            if (p.variants) {
                p.variants.forEach(v => {
                    variantsHtml += `<span class="badge bg-light text-dark border me-1 mb-1 p-2">${v.size}: <strong>${window.AreaBazaarStorefront.formatNaira(v.price)}</strong></span>`;
                });
            }

            let proteinsHtml = '';
            if (p.proteins) {
                proteinsHtml = p.proteins.map(prot => `<span class="badge bg-light text-dark border me-1 mb-1">${prot}</span>`).join('');
            }

            const html = `
                <div class="row g-4 align-items-center">
                    <div class="col-md-5 text-center">
                        <div class="p-3 bg-light rounded-4 border">
                            <img src="${p.image}" alt="${p.name}" class="img-fluid" style="max-height: 220px; object-fit: contain;">
                        </div>
                        <div class="mt-3 text-start">
                            <span class="badge bg-warning-subtle text-warning fw-bold px-3 py-1 rounded-pill mb-1">
                                <i class="fa fa-star text-warning me-1"></i> ${p.rating} Rating
                            </span>
                            <h5 class="fw-bold text-dark mb-1 mt-1">${p.name}</h5>
                            <p class="small text-muted mb-0">${p.tagline}</p>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <span class="badge bg-dark mb-2">${p.categoryName || p.category}</span>
                        <p class="text-secondary small mb-3">${p.description}</p>

                        <div class="mb-3">
                            <div class="text-xs fw-bold text-muted text-uppercase mb-1">Available Pot Sizes:</div>
                            <div>${variantsHtml}</div>
                        </div>

                        <div class="mb-3">
                            <div class="text-xs fw-bold text-muted text-uppercase mb-1">Included Prime Proteins:</div>
                            <div>${proteinsHtml}</div>
                        </div>

                        <div class="p-3 bg-light rounded-3 mb-4 border">
                            <div class="d-flex align-items-center justify-content-between text-xs">
                                <span class="text-muted"><i class="fa fa-clock me-1"></i> Cooking Lead Time:</span>
                                <strong class="text-dark">${p.leadTime || '40 mins'}</strong>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <a href="product-details.html?id=${p.id}" class="btn btn-warning flex-fill fw-bold py-2 shadow-sm text-center text-dark" style="background: linear-gradient(135deg, #ff8c00, #f97316); color: #fff;">
                                Configure & Order Pot <i class="fa fa-arrow-right ms-1"></i>
                            </a>
                            <a href="product-details.html?id=${p.id}" class="btn btn-dark fw-bold py-2 px-3 text-nowrap">
                                See Full Details
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

    window.BetasupStore = BetasupStore;

    $(document).ready(function () {
        BetasupStore.init();
    });
})(window, window.jQuery);
