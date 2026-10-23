/**
 * UwanBUY Hyperlocal Engine (October 2026)
 * Orchestrates:
 * - Product catalog loading from products.json
 * - Product section galleries on index.html
 * - Multi-facet filtering on category.html
 * - Detailed category specifications (gadget diagnostics, groceries, fashion) on product-details.html
 * - "Type Your List" modal with mandatory category check (red-glow animation) and custom item add
 * - Persistent cart management with pinned top-of-cart "Pending Orders Awaiting Payment"
 * - Asynchronous Checkout Validation Modal (Free Pickup Accordion vs Address + Express + VAT)
 * - Payment Request Modal (Agent vs Direct Transfer) & Payment Ref Generator
 * - Payment Report Form & Storefront Reconciliation routing (Wallet Top-Up vs Direct Order confirmation)
 */
(function (window, $) {
    'use strict';

    const DB_URL = 'assets/data/products.json';
    const ALT_DB_URL = '../assets/data/products.json';
    const CART_STORAGE_KEY = 'uwanbuy_cart_state';
    const PENDING_ORDERS_KEY = 'uwanbuy_pending_orders';
    const RECONCILIATIONS_KEY = 'uwanbuy_reconciliations';

    const UwanBuyEngine = {
        data: null,
        cart: [],
        pendingOrders: [],
        reconciliations: [],
        selectedCartLineIds: new Set(),
        activeCategoryForList: '',
        currentOrderId: null,
        currentPaymentRef: null,
        currentValidationState: {
            fulfillment: 'pickup', // 'pickup' | 'address'
            pickupPointId: 'pku_tanke_01',
            isExpress: false,
            address: '',
            subtotalMinor: 0,
            deliveryFeeMinor: 0,
            expressSurchargeMinor: 0,
            vatPercent: 7.5,
            vatAmountMinor: 0,
            totalMinor: 0
        },

        async init() {
            this.loadLocalState();
            await this.loadCatalog();
            this.bindEvents();
            this.syncCartUI();
            this.renderBoughtOrders();
            this.startTrackingBatchScheduler();
            this.startAuctionCartPruneScheduler();
            this.renderPageSpecifics();
        },

        loadLocalState() {
            try {
                this.cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
                this.pendingOrders = JSON.parse(localStorage.getItem(PENDING_ORDERS_KEY)) || [];
                this.reconciliations = JSON.parse(localStorage.getItem(RECONCILIATIONS_KEY)) || [];
                this.selectedCartLineIds = new Set(this.cart.map(c => c.lineId));
            } catch (e) {
                console.warn('Error reading local storage:', e);
                this.cart = [];
                this.pendingOrders = [];
                this.reconciliations = [];
            }
        },

        saveLocalState() {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
            localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(this.pendingOrders));
            localStorage.setItem(RECONCILIATIONS_KEY, JSON.stringify(this.reconciliations));
            this.syncCartUI();
        },

        async loadCatalog() {
            // Attempt to load from JSON, or use window.AreaBazaarStorefront fallback
            if (window.AreaBazaarStorefront && window.AreaBazaarStorefront.UWANBUY_PRODUCTS && window.AreaBazaarStorefront.UWANBUY_PRODUCTS.length) {
                this.data = {
                    products: window.AreaBazaarStorefront.UWANBUY_PRODUCTS,
                    categories: window.AreaBazaarStorefront.UWANBUY_CATEGORIES || [],
                    activeWaveVariants: window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS || {},
                    pickupPoints: window.AreaBazaarStorefront.AVAILABLE_HUBS || []
                };
            } else {
                try {
                    let res = await fetch(DB_URL);
                    if (!res.ok) res = await fetch(ALT_DB_URL);
                    if (res.ok) {
                        this.data = await res.json();
                    }
                } catch (err) {
                    console.warn('Fetch products.json failed, checking global fallback:', err);
                }

                if (!this.data && window.AreaBazaarStorefront && window.AreaBazaarStorefront.UWANBUY_PRODUCTS) {
                    this.data = {
                        products: window.AreaBazaarStorefront.UWANBUY_PRODUCTS,
                        categories: window.AreaBazaarStorefront.UWANBUY_CATEGORIES || [],
                        activeWaveVariants: window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS || {},
                        pickupPoints: window.AreaBazaarStorefront.AVAILABLE_HUBS || []
                    };
                }
            }
        },

        resolveAssetUrl(url) {
            if (!url) return 'assets/images/placeholders/gas-cooker.svg';
            const isInSubdir = window.location.pathname.includes('/auctions/') || window.location.pathname.includes('/admin/');
            if (isInSubdir) {
                if (url.startsWith('assets/')) return '../' + url;
                if (url.startsWith('../assetsecm/')) return '../' + url;
            }
            return url;
        },

        formatNaira(amountKoboOrNaira, isKobo = false) {
            const naira = isKobo ? (amountKoboOrNaira / 100) : amountKoboOrNaira;
            return '₦' + Number(naira || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },

        getBaseProductPriceRange(product) {
            if (!product) return '₦0.00';
            const variants = product.variants || [];
            if (variants.length > 0) {
                const prices = variants.map(v => v.priceMinor || (v.price ? v.price * 100 : 0)).filter(p => p > 0);
                if (prices.length > 0) {
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    if (min === max) {
                        return this.formatNaira(min, true);
                    }
                    return `${this.formatNaira(min, true)} - ${this.formatNaira(max, true)}`;
                }
            }
            const single = product.priceMinor || (product.price ? product.price * 100 : 0);
            return this.formatNaira(single, true);
        },

        getAllProducts() {
            const base = (this.data && this.data.products) || (window.AreaBazaarStorefront && window.AreaBazaarStorefront.UWANBUY_PRODUCTS) || [];
            try {
                const adminProds = JSON.parse(localStorage.getItem('uwanbuy_admin_products') || '[]');
                if (adminProds && adminProds.length) {
                    const idMap = new Map();
                    adminProds.forEach(p => idMap.set(p.id, p));
                    const merged = base.map(p => {
                        if (idMap.has(p.id)) {
                            const adm = idMap.get(p.id);
                            return {
                                ...p,
                                ...adm,
                                category: p.category || adm.categoryId || adm.category,
                                categoryId: p.categoryId || adm.categoryId,
                                subCategory: p.subCategory || adm.subCategory,
                                image: p.image || adm.image || (p.media && p.media[0] && p.media[0].url),
                                media: (p.media && p.media.length) ? p.media : adm.media,
                                variants: (p.variants && p.variants.length) ? p.variants : (adm.variants || [])
                            };
                        }
                        return p;
                    });
                    adminProds.forEach(p => {
                        if (!merged.some(m => m.id === p.id)) {
                            merged.unshift(p);
                        }
                    });
                    return merged;
                }
            } catch (e) {
                console.warn('Error reading admin products:', e);
            }
            return base;
        },

        getProductById(id) {
            return this.getAllProducts().find(p => String(p.id) === String(id)) || null;
        },

        getProductsBySection(sectionKey) {
            return this.getAllProducts().filter(p => {
                if (p.published === false) return false;
                if (sectionKey.includes('/')) {
                    const [cat, subcat] = sectionKey.split('/');
                    const catMatches = (p.category === cat || p.categoryId === cat || p.sectionKey === cat);
                    const subcatMatches = (p.subCategory === subcat || p.subCategoryId === subcat);
                    return catMatches && subcatMatches;
                }
                if (sectionKey === 'groceries') {
                    return (p.category === 'groceries' || p.categoryId === 'groceries' || p.categoryId === 'foodstuff' || p.sectionKey === 'groceries');
                }
                if (sectionKey === 'gadgets') {
                    return (p.category === 'gadgets' || p.categoryId === 'gadgets' || p.sectionKey === 'gadgets');
                }
                if (sectionKey === 'fashion') {
                    return (p.category === 'fashion' || p.categoryId === 'fashion' || p.sectionKey === 'fashion');
                }
                if (sectionKey === 'home') {
                    return (p.category === 'home' || p.categoryId === 'home' || p.sectionKey === 'home');
                }
                return (p.sectionKey === sectionKey || p.categoryId === sectionKey || p.category === sectionKey);
            });
        },

        getProductsByCategory(categoryId) {
            if (!categoryId || categoryId === 'all') return this.getAllProducts().filter(p => p.published !== false);
            return this.getAllProducts().filter(p => {
                if (p.published === false) return false;
                if (categoryId.includes('/')) {
                    const [cat, subcat] = categoryId.split('/');
                    const catMatches = (p.category === cat || p.categoryId === cat || p.sectionKey === cat);
                    const subcatMatches = (p.subCategory === subcat || p.subCategoryId === subcat);
                    return catMatches && subcatMatches;
                }
                if (categoryId === 'groceries') {
                    return (p.category === 'groceries' || p.categoryId === 'groceries' || p.categoryId === 'foodstuff' || p.sectionKey === 'groceries');
                }
                if (categoryId === 'gadgets') {
                    return (p.category === 'gadgets' || p.categoryId === 'gadgets' || p.sectionKey === 'gadgets');
                }
                if (categoryId === 'fashion') {
                    return (p.category === 'fashion' || p.categoryId === 'fashion' || p.sectionKey === 'fashion');
                }
                if (categoryId === 'home') {
                    return (p.category === 'home' || p.categoryId === 'home' || p.sectionKey === 'home');
                }
                return (p.categoryId === categoryId || p.sectionKey === categoryId || p.category === categoryId);
            });
        },

        bindEvents() {
            const self = this;

            // Type Your List: Category check handler
            $(document).on('change', '.list-category-radio', function () {
                self.activeCategoryForList = $(this).val();
                $('.list-category-selector-wrapper').removeClass('category-glow-alert');
                $('#listCategoryAlert').addClass('d-none');
                $('#typeListSearchInput').focus();
            });

            // Type Your List: Input keystroke with Red Glow validation
            $(document).on('input', '#typeListSearchInput', function () {
                const query = $(this).val().trim();
                if (!self.activeCategoryForList) {
                    // Trigger Red Glow Alert!
                    $('.list-category-selector-wrapper').addClass('category-glow-alert');
                    $('#listCategoryAlert').removeClass('d-none');
                    $('#listSuggestionsBox').addClass('d-none').empty();
                    return;
                }

                $('.list-category-selector-wrapper').removeClass('category-glow-alert');
                $('#listCategoryAlert').addClass('d-none');

                if (query.length < 2) {
                    $('#listSuggestionsBox').addClass('d-none').empty();
                    return;
                }

                self.renderListSuggestions(query, self.activeCategoryForList);
            });

            // Type Your List: Add custom item button
            $(document).on('click', '#btnAddToListCustom', function (e) {
                e.preventDefault();
                const rawName = $('#typeListSearchInput').val().trim();
                if (!rawName) return;

                if (!self.activeCategoryForList) {
                    $('.list-category-selector-wrapper').addClass('category-glow-alert');
                    $('#listCategoryAlert').removeClass('d-none');
                    return;
                }

                self.addCustomItemToScratchpad(rawName, self.activeCategoryForList);
                $('#typeListSearchInput').val('');
                $('#listSuggestionsBox').addClass('d-none').empty();
            });

            // Type Your List: Click suggestion item
            $(document).on('click', '.list-suggestion-item', function () {
                const prodId = $(this).data('id');
                const product = self.getProductById(prodId);
                if (product) {
                    self.addProductToScratchpad(product);
                    $('#typeListSearchInput').val('');
                    $('#listSuggestionsBox').addClass('d-none').empty();
                }
            });

            // Scratchpad Quantity change & Remove
            $(document).on('click', '.scratchpad-qty-btn', function () {
                const idx = $(this).data('index');
                const delta = parseInt($(this).data('delta'), 10);
                self.updateScratchpadQty(idx, delta);
            });

            $(document).on('click', '.scratchpad-remove-btn', function () {
                const idx = $(this).data('index');
                self.removeScratchpadItem(idx);
            });

            // Wallet Top-up from Navigation
            $(document).on('click', '#btnNavWallet, .btn-open-wallet-topup', function (e) {
                e.preventDefault();
                self.openFundWalletModal();
            });

            $(document).on('click', '.btn-wallet-preset', function () {
                const amt = $(this).data('amount');
                $('#topupAmountInput').val(amt);
                $('.btn-wallet-preset').removeClass('active btn-danger').addClass('btn-outline-secondary');
                $(this).addClass('active btn-danger').removeClass('btn-outline-secondary');
            });

            $(document).on('click', '#btnProceedFundWallet', function () {
                const amount = parseFloat($('#topupAmountInput').val()) || 0;
                if (amount < 500) {
                    if (window.iziToast) window.iziToast.warning({ title: 'Invalid Amount', message: 'Enter at least ₦500 to fund wallet.' });
                    return;
                }
                $('#modal-fund-wallet').modal('hide');
                self.openPaymentRequestModal('wallet_topup', amount * 100);
            });

            // Delivery Tracking Requests (15-min bulk batch)
            $(document).on('click', '.btn-request-tracking', function () {
                const orderId = $(this).data('order-id');
                self.openRequestTrackingModal(orderId);
            });

            $(document).on('click', '#btnSubmitTrackingRequest', function () {
                self.submitTrackingRequest();
            });

            $(document).on('click', '#btnTriggerTrackingBatch', function () {
                self.processTrackingBulkDispatch(true);
            });

            // Transfer list to active cart
            
            // Cart item checkbox change
            $(document).on('change', '.cart-item-check', function () {
                const lineId = $(this).data('line-id');
                if (this.checked) {
                    self.selectedCartLineIds.add(lineId);
                } else {
                    self.selectedCartLineIds.delete(lineId);
                }
                self.syncCartUI();
            });

            // Select All checkbox change
            $(document).on('change', '#selectAllCartCheck', function () {
                if (this.checked) {
                    self.cart.forEach(c => self.selectedCartLineIds.add(c.lineId));
                } else {
                    self.selectedCartLineIds.clear();
                }
                self.syncCartUI();
            });

            // Checkout Selected items
            $(document).on('click', '#btnCheckoutSelected', function () {
                self.openCheckoutValidateModal(null, null, true);
            });

            // Checkout All items
            $(document).on('click', '#btnCheckoutAll, #btnProceedToCheckout', function () {
                self.openCheckoutValidateModal(null, null, false);
            });

            // Submit Shopping List for Admin Pricing
            $(document).on('click', '#btnSubmitShoppingList', function () {
                self.submitShoppingList();
            });


            // Cart interactions
            $(document).on('click', '.cart-qty-btn', function () {
                const lineId = $(this).data('line-id');
                const delta = parseInt($(this).data('delta'), 10);
                self.updateCartQty(lineId, delta);
            });

            $(document).on('click', '.cart-remove-btn', function () {
                const lineId = $(this).data('line-id');
                self.removeCartLine(lineId);
            });

            // Add to cart from product cards
            $(document).on('click', '[data-action="add-to-cart"]', function (e) {
                e.preventDefault();
                const prodId = $(this).data('id');
                const moq = parseInt($(this).data('moq'), 10) || 1;
                const prod = self.getProductById(prodId);
                if (prod && prod.variants && prod.variants.length > 0) {
                    self.openQuickViewModal(prodId);
                } else {
                    self.addToCart(prodId, moq);
                }
            });

            // Quick View modal trigger
            $(document).on('click', '[data-action="quick-view"]', function (e) {
                e.preventDefault();
                const prodId = $(this).data('id');
                self.openQuickViewModal(prodId);
            });

            // Quick Add Autocomplete on index.html
            $(document).on('keyup input', '#quickAddInput', function () {
                const query = $(this).val().toLowerCase().trim();
                const $box = $('#suggestionsBox');
                if (!$box.length) return;
                $box.empty();

                if (query.length < 2) {
                    $box.addClass('d-none');
                    return;
                }

                const catFilter = $('#categorySelect').val();
                const allProducts = self.getAllProducts();
                const matches = [];

                allProducts.forEach(p => {
                    if (catFilter && p.category !== catFilter && p.categoryId !== catFilter) return;

                    const baseMatches = (p.title && p.title.toLowerCase().includes(query)) ||
                                        (p.name && p.name.toLowerCase().includes(query)) ||
                                        (p.category && p.category.toLowerCase().includes(query)) ||
                                        (p.categoryName && p.categoryName.toLowerCase().includes(query)) ||
                                        (p.subCategory && p.subCategory.toLowerCase().includes(query)) ||
                                        (p.subSubCategory && p.subSubCategory.toLowerCase().includes(query));

                    if (baseMatches) {
                        matches.push({ product: p, variant: null });
                    }

                    if (p.variants && p.variants.length > 0) {
                        p.variants.forEach(v => {
                            const varMatches = (v.name && v.name.toLowerCase().includes(query)) ||
                                               (v.sku && v.sku.toLowerCase().includes(query)) ||
                                               (v.color && v.color.toLowerCase().includes(query)) ||
                                               (v.memoryStorage && v.memoryStorage.toLowerCase().includes(query));
                            if (varMatches) {
                                if (!matches.some(m => m.product.id === p.id && m.variant && m.variant.id === v.id)) {
                                    matches.push({ product: p, variant: v });
                                }
                            }
                        });
                    }
                });

                if (matches.length > 0) {
                    matches.slice(0, 8).forEach(m => {
                        const p = m.product;
                        const v = m.variant;
                        const title = v ? `${p.title || p.name} &bull; <span class="text-danger">${v.name}</span>` : (p.title || p.name);
                        const priceText = v ? self.formatNaira(v.priceMinor || (v.price * 100), true) : self.getBaseProductPriceRange(p);
                        const img = self.resolveAssetUrl((v && v.image) || (p.media && p.media[0] && p.media[0].thumbnailUrl) || p.image);
                        const catBreadcrumb = [p.categoryName || p.category, p.subCategory].filter(Boolean).join(' &rsaquo; ');

                        $box.append(`
                            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center suggestion-item p-2 cursor-pointer" data-id="${p.id}" ${v ? `data-variant-id="${v.id}"` : ''} style="cursor: pointer;">
                                <div class="d-flex align-items-center gap-2 min-w-0">
                                    <img src="${img}" alt="${p.title || p.name}" style="width: 42px; height: 42px; object-fit: contain; background: #fff;" class="rounded border flex-shrink-0">
                                    <div class="text-truncate">
                                        <div class="fw-bold text-dark small lh-sm text-truncate">${title}</div>
                                        <small class="text-muted text-xs">${catBreadcrumb}</small>
                                    </div>
                                </div>
                                <span class="fw-bold text-danger small text-nowrap ms-2">${priceText}</span>
                            </div>
                        `);
                    });
                    $box.removeClass('d-none');
                } else {
                    $box.append('<div class="list-group-item text-muted small p-2 text-center">No matching products or variants found</div>');
                    $box.removeClass('d-none');
                }
            });

            // Clicking suggestion opens the modal
            $(document).on('click', '.suggestion-item', function () {
                const id = $(this).data('id');
                const variantId = $(this).data('variant-id');
                self.openQuickViewModal(id, variantId);
                $('#suggestionsBox').addClass('d-none');
                $('#quickAddInput').val('');
            });

            // Quick View Trigger (works for card buttons, thumbnails, and legacy view-details)
            $(document).on('click', '[data-action="quick-view"], .btn-view-details', function (e) {
                e.preventDefault();
                const id = $(this).data('id');
                const variantId = $(this).data('variant-id');
                self.openQuickViewModal(id, variantId);
            });

            $(document).on('click', function (e) {
                if (!$(e.target).closest('#quickAddInput, #suggestionsBox').length) {
                    $('#suggestionsBox').addClass('d-none');
                }
            });

            // Groceries Modal: Selecting a variant on the left panel
            $(document).on('click', '.grocery-variant-card', function () {
                const baseId = $(this).data('base-id');
                const varId = $(this).data('variant-id');
                const p = self.getProductById(baseId);
                if (!p || !p.variants) return;
                const v = p.variants.find(item => item.id === varId);
                if (!v) return;

                $('.grocery-variant-card').removeClass('border-danger bg-danger-subtle shadow-sm').addClass('border bg-white');
                $('.grocery-variant-card i.bi-check-circle-fill').removeClass('bi-check-circle-fill text-danger').addClass('bi-circle text-muted');
                $(this).removeClass('border bg-white').addClass('border-danger bg-danger-subtle shadow-sm');
                $(this).find('i.bi-circle').removeClass('bi-circle text-muted').addClass('bi-check-circle-fill text-danger');

                const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
                $('#groceryVariantDetailsRightPanel').html(self.renderGroceryVariantRightPanel(p, v, waveMap[v.id]));
            });

            // Fashion / Gadgets / Home Modal: Selecting attribute pills
            $(document).on('click', '.btn-attr-pill', function () {
                const baseId = $(this).data('base-id');
                const attrKey = $(this).data('attr-key');
                const attrVal = String($(this).data('attr-val'));
                const p = self.getProductById(baseId);
                if (!p || !p.variants) return;

                // Find variant that matches this attribute value
                const matchingVariant = p.variants.find(v => String(v[attrKey]) === attrVal) || p.variants[0];
                const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
                
                const newHtml = self.renderAttributeOptionsModal(p, matchingVariant, waveMap);
                $('#quickViewContent').html(newHtml);
                $('#quickViewModalBody').html(newHtml);
                $('#modal-quick-view .modal-body').html(newHtml);
            });

            // Modal: Variant Add-to-Cart
            $(document).on('click', '.btn-modal-add-variant', function (e) {
                e.preventDefault();
                const baseId = $(this).data('base-id');
                const varId = $(this).data('variant-id');
                const qty = parseInt($('#modalSelectedVariantQty').val(), 10) || 1;
                self.addVariantToCart(baseId, varId, qty);
                if (window.jQuery && $.fn.iziModal && $('#quickViewModal').length) {
                    $('#quickViewModal').iziModal('close');
                }
                const bModalEl = document.getElementById('modal-quick-view');
                if (bModalEl && window.bootstrap) {
                    const inst = bootstrap.Modal.getInstance(bModalEl);
                    if (inst) inst.hide();
                }
            });

            // Modal: Quantity Steppers
            $(document).on('click', '.btn-var-qty-minus', function () {
                const moq = parseInt($(this).data('moq'), 10) || 1;
                const $input = $('#modalSelectedVariantQty');
                let cur = parseInt($input.val(), 10) || moq;
                if (cur > moq) $input.val(cur - 1);
            });

            $(document).on('click', '.btn-var-qty-plus', function () {
                const $input = $('#modalSelectedVariantQty');
                let cur = parseInt($input.val(), 10) || 1;
                $input.val(cur + 1);
            });

            // Bazaar / Auction Modal Actions: "Pay Immediately" & "Add to Cart"
            $(document).on('click', '.btn-pay-immediately', function (e) {
                e.preventDefault();
                const varId = $(this).data('variant-id');
                const baseId = $(this).data('base-id');
                const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
                const wave = waveMap[varId];

                // Add to cart with zero delay and open validation immediately
                self.addVariantToCart(baseId, varId, wave ? (wave.moq || 1) : 1, false);
                if (window.jQuery && $.fn.iziModal) {
                    if ($('#modal-auction-inspect').length) $('#modal-auction-inspect').iziModal('close');
                    if ($('#quickViewModal').length) $('#quickViewModal').iziModal('close');
                }
                const bModalEl = document.getElementById('modal-quick-view');
                if (bModalEl && window.bootstrap) {
                    const inst = window.bootstrap.Modal.getInstance(bModalEl);
                    if (inst) inst.hide();
                }
                $('.modal').modal('hide');
                self.openCheckoutValidateModal();
            });

            $(document).on('click', '.btn-add-auction-to-cart', function (e) {
                e.preventDefault();
                const varId = $(this).data('variant-id');
                const baseId = $(this).data('base-id');
                const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
                const wave = waveMap[varId];
                self.addVariantToCart(baseId, varId, wave ? (wave.moq || 1) : 1, true);
                if (window.jQuery && $.fn.iziModal) {
                    if ($('#modal-auction-inspect').length) $('#modal-auction-inspect').iziModal('close');
                    if ($('#quickViewModal').length) $('#quickViewModal').iziModal('close');
                }
                const bModalEl = document.getElementById('modal-quick-view');
                if (bModalEl && window.bootstrap) {
                    const inst = window.bootstrap.Modal.getInstance(bModalEl);
                    if (inst) inst.hide();
                }
                $('.modal').modal('hide');
            });

            // Checkout Validation Trigger (From Cart)
            $(document).on('click', '#btnProceedToCheckout, .btn-trigger-checkout', function () {
                self.openCheckoutValidateModal();
            });

            // Asynchronous fulfillment calculation changes in validate modal
            $(document).on('change', 'input[name="fulfillmentChoice"]', function () {
                self.currentValidationState.fulfillment = $(this).val();
                if (self.currentValidationState.fulfillment === 'pickup') {
                    $('#pickupAccordionWrapper').removeClass('d-none');
                    $('#addressInputWrapper').addClass('d-none');
                } else {
                    $('#pickupAccordionWrapper').addClass('d-none');
                    $('#addressInputWrapper').removeClass('d-none');
                }
                self.recalculateValidationCosts();
            });

            $(document).on('change', '#expressDeliveryToggle', function () {
                self.currentValidationState.isExpress = $(this).is(':checked');
                self.recalculateValidationCosts();
            });

            $(document).on('change', 'input[name="pickupPointChoice"]', function () {
                self.currentValidationState.pickupPointId = $(this).val();
                self.recalculateValidationCosts();
            });

            $(document).on('input', '#deliveryAddressInput', function () {
                self.currentValidationState.address = $(this).val().trim();
            });

            // Pay with Wallet clicked inside Validate Modal
            $(document).on('click', '#btnPayWithWallet', function () {
                self.handleWalletCheckout();
            });

            // Pay with Wallet Confirmation (PIN entered)
            $(document).on('click', '#btnConfirmWalletPin', function () {
                self.executeWalletPayment();
            });

            // Create Payment Request Trigger (From Validate Modal or Wallet Insufficient prompt)
            $(document).on('click', '#btnCreatePaymentRequest, .btn-open-payment-request', function () {
                const purpose = $(this).data('purpose') || 'order_direct';
                self.openPaymentRequestModal(purpose);
            });

            // Generate Payment Ref button inside Payment Request Modal
            $(document).on('click', '#btnGeneratePaymentRef', function () {
                const channel = $('input[name="paymentChannelChoice"]:checked').val() || 'agent';
                self.generatePaymentReference(channel);
            });

            // Open Payment Report Form (directly or from generated ref)
            $(document).on('click', '#btnOpenPaymentReport, .btn-report-payment-trigger', function () {
                const orderId = $(this).data('order-id') || self.currentOrderId;
                const ref = $(this).data('ref') || self.currentPaymentRef;
                self.openPaymentReportModal(orderId, ref);
            });

            // Submit Payment Report Form
            $(document).on('submit', '#formPaymentReport', function (e) {
                e.preventDefault();
                self.submitPaymentReport();
            });

            // Complete Purchase trigger on pending order in cart
            $(document).on('click', '.btn-complete-pending-purchase', function () {
                const orderId = $(this).data('order-id');
                const order = self.pendingOrders.find(o => o.orderId === orderId);
                if (order) {
                    self.resumePendingOrderPayment(order);
                }
            });
        },

        /* ==========================================================================
           SCRATCHPAD / TYPE YOUR LIST MODAL LOGIC
           ========================================================================== */
        scratchpad: [],

        renderListSuggestions(query, categoryId) {
            const q = query.toLowerCase();
            const filtered = this.getAllProducts().filter(p => {
                const matchesCat = (p.categoryId === categoryId || p.sectionKey === categoryId);
                const matchesQuery = p.title.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)) || (p.sku && p.sku.toLowerCase().includes(q));
                return matchesCat && matchesQuery;
            }).slice(0, 6);

            const $box = $('#listSuggestionsBox');
            $box.empty();

            if (filtered.length === 0) {
                $box.html(`
                    <div class="p-3 text-center text-muted small">
                        <i class="bi bi-info-circle me-1"></i> No exact local match found in this category.
                        <div class="mt-2">
                            <button type="button" class="btn btn-sm btn-outline-danger" id="btnAddToListCustom">
                                <i class="bi bi-plus-circle me-1"></i> Add "<strong>${query}</strong>" as custom item
                            </button>
                        </div>
                    </div>
                `).removeClass('d-none');
                return;
            }

            let html = '';
            filtered.forEach(p => {
                const rawImg = (p.media && p.media[0] && (p.media[0].thumbnailUrl || p.media[0].url)) || p.image || 'assets/images/placeholders/gas-cooker.svg';
            const img = this.resolveAssetUrl(rawImg);
                html += `
                    <a href="javascript:void(0)" class="list-group-item list-group-item-action d-flex align-items-center gap-3 p-2 list-suggestion-item" data-id="${p.id}">
                        <img src="${img}" alt="${p.title}" class="rounded-3 border" style="width: 44px; height: 44px; object-fit: contain;">
                        <div class="flex-grow-1">
                            <div class="fw-bold text-dark small mb-0">${p.title}</div>
                            <small class="text-muted">${p.brand || 'Local Hub'} &bull; ${p.unitLabel || 'unit'}</small>
                        </div>
                        <div class="text-end">
                            <span class="text-danger fw-bold small">${this.formatNaira(p.priceMinor, true)}</span>
                            <span class="badge bg-danger-subtle text-danger d-block mt-1">+ Add</span>
                        </div>
                    </a>
                `;
            });

            $box.html(html).removeClass('d-none');
        },

        addProductToScratchpad(product) {
            const existing = this.scratchpad.find(item => item.productId === product.id);
            if (existing) {
                existing.quantity += (product.stock && product.stock.moq) || 1;
            } else {
                this.scratchpad.push({
                    productId: product.id,
                    title: product.title,
                    priceMinor: product.priceMinor,
                    quantity: (product.stock && product.stock.moq) || 1,
                    unitLabel: product.unitLabel || 'unit',
                    categoryName: product.categoryName || product.categoryId,
                    isCustom: false
                });
            }
            this.renderScratchpadUI();
        },

        addCustomItemToScratchpad(rawName, categoryId) {
            this.scratchpad.push({
                productId: 'custom_' + Date.now(),
                title: rawName,
                priceMinor: 0,
                quantity: 1,
                unitLabel: 'item',
                categoryName: categoryId,
                isCustom: true
            });
            this.renderScratchpadUI();
        },

        updateScratchpadQty(idx, delta) {
            if (this.scratchpad[idx]) {
                this.scratchpad[idx].quantity += delta;
                if (this.scratchpad[idx].quantity <= 0) {
                    this.scratchpad.splice(idx, 1);
                }
                this.renderScratchpadUI();
            }
        },

        removeScratchpadItem(idx) {
            this.scratchpad.splice(idx, 1);
            this.renderScratchpadUI();
        },

        renderScratchpadUI() {
            const $tbody = $('#scratchpadTableBody');
            const $count = $('#scratchpadItemCount');
            const $total = $('#scratchpadEstimatedTotal');

            if (!$tbody.length) return;

            $tbody.empty();
            let totalMinor = 0;
            let itemCount = 0;

            if (this.scratchpad.length === 0) {
                $tbody.html(`
                    <tr>
                        <td colspan="5" class="text-center text-muted py-4 small">
                            <i class="bi bi-card-checklist fs-3 d-block mb-1 text-secondary"></i>
                            Your typed list is empty. Check a category and start typing above!
                        </td>
                    </tr>
                `);
                $count.text('0 items');
                $total.text('₦0.00');
                $('#btnTransferListToCart').prop('disabled', true);
                return;
            }

            this.scratchpad.forEach((item, idx) => {
                const lineTotal = item.priceMinor * item.quantity;
                totalMinor += lineTotal;
                itemCount += item.quantity;

                $tbody.append(`
                    <tr>
                        <td class="small fw-semibold text-dark">
                            ${item.title}
                            ${item.isCustom ? '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle ms-1">Custom / Unlisted</span>' : '<span class="badge bg-success-subtle text-success border border-success-subtle ms-1">Catalog Match</span>'}
                        </td>
                        <td class="small text-muted">${item.categoryName}</td>
                        <td class="small fw-semibold text-dark text-nowrap">
                            ${item.isCustom ? '<em>TBD at Hub</em>' : this.formatNaira(item.priceMinor, true)}
                        </td>
                        <td>
                            <div class="input-group input-group-sm" style="width: 100px;">
                                <button class="btn btn-outline-secondary scratchpad-qty-btn" data-index="${idx}" data-delta="-1">-</button>
                                <span class="input-group-text bg-white fw-bold px-2">${item.quantity}</span>
                                <button class="btn btn-outline-secondary scratchpad-qty-btn" data-index="${idx}" data-delta="1">+</button>
                            </div>
                        </td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-link text-danger p-0 scratchpad-remove-btn" data-index="${idx}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });

            $count.text(`${this.scratchpad.length} item(s)`);
            $total.text(this.formatNaira(totalMinor, true));
            $('#btnTransferListToCart').prop('disabled', false);
        },

                submitShoppingList() {
            if (this.scratchpad.length === 0) return;

            const listId = 'LST-UWB-' + Math.floor(10000 + Math.random() * 90000);
            const submittedList = {
                listId: listId,
                customerName: 'Customer',
                customerPhone: '0803-123-4567',
                hub: (this.data && this.data.store && this.data.store.activeHub) || 'Tanke Hub, Ilorin',
                submittedAt: new Date().toISOString(),
                status: 'pending_admin_pricing',
                items: this.scratchpad.map(item => ({
                    productId: item.productId,
                    title: item.title,
                    categoryName: item.categoryName,
                    quantity: item.quantity,
                    unitLabel: item.unitLabel || 'item',
                    unitPriceMinor: item.isCustom ? 0 : item.priceMinor,
                    isCustom: item.isCustom
                }))
            };

            let submittedLists = [];
            try {
                submittedLists = JSON.parse(localStorage.getItem('uwanbuy_submitted_lists')) || [];
            } catch (e) {
                submittedLists = [];
            }
            submittedLists.unshift(submittedList);
            localStorage.setItem('uwanbuy_submitted_lists', JSON.stringify(submittedLists));

            const totalCount = this.scratchpad.length;
            this.scratchpad = [];
            this.renderScratchpadUI();

            if (window.iziToast) {
                window.iziToast.success({
                    title: 'Shopping List Submitted!',
                    message: `List ${listId} (${totalCount} items) sent to Hub Pricing Desk. Admin will calculate verified prices and add to your cart.`,
                    position: 'topRight',
                    timeout: 6000
                });
            }

            const modalEl = document.getElementById('modal-type-shopping-list');
            if (modalEl && window.bootstrap) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }

            this.syncCartUI();
        },

        /* ==========================================================================
           CART STATE & PERSISTENCE
           ========================================================================== */
        addToCart(productId, quantity = 1, showToast = true) {
            const product = this.getProductById(productId);
            if (!product) return;

            // If product has variants, open quick view modal for user to select variant
            if (product.variants && product.variants.length > 0) {
                this.openQuickViewModal(productId);
                return;
            }

            const moq = (product.stock && product.stock.moq) || 1;
            const finalQty = Math.max(quantity, moq);

            const existing = this.cart.find(c => c.productId === productId);
            if (existing) {
                existing.quantity += finalQty;
            } else {
                const newLineId = 'line_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
                this.selectedCartLineIds.add(newLineId);
                this.cart.push({
                    lineId: newLineId,
                    productId: product.id,
                    title: product.title || product.name,
                    priceMinor: product.priceMinor || (product.price ? product.price * 100 : 0),
                    unitLabel: product.unitLabel || 'unit',
                    image: this.resolveAssetUrl((product.media && product.media[0] && (product.media[0].thumbnailUrl || product.media[0].url)) || product.image || 'assets/images/placeholders/gas-cooker.svg'),
                    quantity: finalQty,
                    moq: moq
                });
            }

            this.saveLocalState();

            if (showToast && window.iziToast) {
                window.iziToast.success({
                    title: 'Added to Cart',
                    message: `${product.title || product.name} (x${finalQty})`,
                    position: 'topRight'
                });
            }
        },

        addVariantToCart(baseProductId, variantId, quantity = 1, showToast = true) {
            const baseProduct = this.getProductById(baseProductId);
            if (!baseProduct) return;

            const variant = (baseProduct.variants || []).find(v => v.id === variantId) || {
                id: variantId,
                name: baseProduct.title || baseProduct.name,
                priceMinor: baseProduct.priceMinor || (baseProduct.price ? baseProduct.price * 100 : 0),
                stock: baseProduct.stock || { moq: 1 }
            };

            const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
            const wave = waveMap[variant.id] || waveMap[baseProduct.id];

            let effectivePriceMinor = variant.priceMinor || (variant.price * 100);
            let isAuctionSurprise = false;
            let auctionExpiresAt = null;

            if (wave) {
                effectivePriceMinor = wave.wavePrice * 100;
                isAuctionSurprise = true;
                auctionExpiresAt = Date.now() + ((wave.timerMinutesLeft || 15) * 60 * 1000);
            }

            const moq = (variant.stock && variant.stock.moq) || 1;
            const finalQty = Math.max(quantity, moq);

            const existing = this.cart.find(c => c.variantId === variant.id || (c.productId === variant.id && !c.variantId));
            if (existing) {
                existing.quantity += finalQty;
                if (isAuctionSurprise) {
                    existing.isAuction = true;
                    existing.auctionExpiresAt = auctionExpiresAt;
                    existing.priceMinor = effectivePriceMinor;
                }
            } else {
                const newLineId = 'line_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
                this.selectedCartLineIds.add(newLineId);
                this.cart.push({
                    lineId: newLineId,
                    productId: baseProduct.id,
                    variantId: variant.id,
                    title: `${baseProduct.title || baseProduct.name} - ${variant.name || ''}`.replace(/ - $/, ''),
                    priceMinor: effectivePriceMinor,
                    unitLabel: baseProduct.unitLabel || 'unit',
                    image: this.resolveAssetUrl(variant.image || baseProduct.image || 'assets/images/placeholders/gas-cooker.svg'),
                    quantity: finalQty,
                    moq: moq,
                    isAuction: isAuctionSurprise,
                    auctionExpiresAt: auctionExpiresAt
                });
            }

            this.saveLocalState();

            if (showToast && window.iziToast) {
                window.iziToast.success({
                    title: isAuctionSurprise ? '⚡ Surprise Wave Price Applied!' : 'Added to Cart',
                    message: `${variant.name || baseProduct.title} (x${finalQty}) @ ${this.formatNaira(effectivePriceMinor, true)}`,
                    position: 'topRight'
                });
            }
        },

        checkAndEvictExpiredCartAuctions() {
            const now = Date.now();
            let evictedAny = false;
            const kept = [];
            (this.cart || []).forEach(item => {
                if (item.isAuction && item.auctionExpiresAt && now > item.auctionExpiresAt) {
                    evictedAny = true;
                    if (window.iziToast) {
                        window.iziToast.warning({
                            title: 'Auction Time Ended',
                            message: `Auction time ended for "${item.title}". It has been removed from your cart.`,
                            timeout: 7000,
                            position: 'topRight'
                        });
                    }
                } else {
                    kept.push(item);
                }
            });
            if (evictedAny) {
                this.cart = kept;
                this.saveLocalState();
                this.syncCartUI();
            }
        },

        startAuctionCartPruneScheduler() {
            if (this._auctionPruneTimer) clearInterval(this._auctionPruneTimer);
            const self = this;
            this._auctionPruneTimer = setInterval(() => {
                self.checkAndEvictExpiredCartAuctions();
                self.updateCartAuctionCountdowns();
            }, 1000);
        },

        updateCartAuctionCountdowns() {
            const self = this;
            document.querySelectorAll('.cart-auction-countdown').forEach(el => {
                const expiresAt = parseInt(el.getAttribute('data-expires'), 10);
                if (!expiresAt) return;
                const textEl = el.querySelector('.countdown-text');
                if (textEl) {
                    textEl.textContent = self.formatRemainingTime(expiresAt);
                }
            });
        },

        formatRemainingTime(expiresAt) {
            const diffMs = Math.max(0, expiresAt - Date.now());
            const totalSec = Math.floor(diffMs / 1000);
            const mins = Math.floor(totalSec / 60);
            const secs = totalSec % 60;
            return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
        },

        updateCartQty(lineId, delta) {
            const line = this.cart.find(c => c.lineId === lineId);
            if (!line) return;

            line.quantity += delta;
            const moq = line.moq || 1;
            if (line.quantity < moq) {
                if (delta < 0 && line.quantity <= 0) {
                    this.removeCartLine(lineId);
                    return;
                }
                line.quantity = moq;
                if (window.iziToast) {
                    window.iziToast.warning({
                        title: 'Minimum Order Quantity',
                        message: `Minimum order for this item is ${moq}`,
                        position: 'topRight'
                    });
                }
            }
            this.saveLocalState();
        },

        removeCartLine(lineId) {
            this.cart = this.cart.filter(c => c.lineId !== lineId);
            this.saveLocalState();
        },

                getCartTotals() {
            let subtotalMinor = 0;
            let totalItems = 0;
            let selectedSubtotalMinor = 0;
            let selectedItemsCount = 0;

            this.cart.forEach(c => {
                const lineTotal = c.priceMinor * c.quantity;
                subtotalMinor += lineTotal;
                totalItems += c.quantity;

                if (this.selectedCartLineIds && this.selectedCartLineIds.has(c.lineId)) {
                    selectedSubtotalMinor += lineTotal;
                    selectedItemsCount += c.quantity;
                }
            });

            return {
                subtotalMinor,
                totalItems,
                selectedSubtotalMinor,
                selectedItemsCount,
                selectedLinesCount: this.cart.filter(c => this.selectedCartLineIds && this.selectedCartLineIds.has(c.lineId)).length
            };
        },

        syncCartUI() {
            this.checkAndEvictExpiredCartAuctions();
            if (!this.selectedCartLineIds) this.selectedCartLineIds = new Set();
            if (this.selectedCartLineIds.size === 0 && this.cart.length > 0) {
                this.cart.forEach(c => this.selectedCartLineIds.add(c.lineId));
            }

            const { subtotalMinor, totalItems, selectedSubtotalMinor, selectedLinesCount } = this.getCartTotals();

            // Badges
            document.querySelectorAll('#cartBadge, #cart-count-badge, .cart-count-display').forEach(el => {
                el.textContent = String(totalItems);
                if (totalItems > 0) el.classList.remove('d-none');
                else el.classList.add('d-none');
            });

            // Cart Drawer Lines
            const $cartDrawerList = $('#cartDrawerItemsList');
            if ($cartDrawerList.length) {
                $cartDrawerList.empty();
                if (this.cart.length === 0) {
                    $cartDrawerList.html(`
                        <div class="text-center py-5 text-muted">
                            <i class="bi bi-cart-x display-4 text-secondary mb-2 d-block"></i>
                            <h6 class="fw-bold">Your Cart is Empty</h6>
                            <p class="small">Add staple groceries, gadgets, or type your shopping list to get started.</p>
                        </div>
                    `);
                    $('#btnCheckoutSelected, #btnCheckoutAll, #btnProceedToCheckout').prop('disabled', true);
                    $('#selectAllCartCheck').prop('checked', false);
                    $('#selectedCartSummary').text('0 selected');
                    $('#countSelectedBadge').text('0');
                    $('#countAllBadge').text('0');
                } else {
                    this.cart.forEach(c => {
                        const isSelected = this.selectedCartLineIds.has(c.lineId);
                        const imgSrc = this.resolveAssetUrl(c.image);
                        let auctionBadgeHtml = '';
                        if (c.isAuction && c.auctionExpiresAt) {
                            auctionBadgeHtml = `
                                <div class="cart-auction-countdown mt-1" data-expires="${c.auctionExpiresAt}">
                                    <span class="badge bg-warning-subtle text-danger border border-warning-subtle text-xs font-monospace py-1 px-2">
                                        <i class="bi bi-clock-history me-1"></i> Deal ends in: <span class="countdown-text">${this.formatRemainingTime(c.auctionExpiresAt)}</span>
                                    </span>
                                </div>
                            `;
                        }

                        $cartDrawerList.append(`
                            <div class="card border rounded-3 p-2 mb-2 shadow-sm cart-drawer-item-card ${isSelected ? 'border-danger-subtle bg-white' : 'bg-light opacity-75'}">
                                <!-- Top Row: Checkbox, Thumbnail, Title, Remove -->
                                <div class="cart-item-top-row">
                                    <div class="d-flex align-items-center ps-1">
                                        <input type="checkbox" class="form-check-input cart-item-check" data-line-id="${c.lineId}" ${isSelected ? 'checked' : ''} style="cursor: pointer; transform: scale(1.15);">
                                    </div>
                                    <img src="${imgSrc}" alt="${c.title}" class="rounded-2 border flex-shrink-0" style="width: 44px; height: 44px; object-fit: contain;">
                                    <div class="flex-grow-1 min-w-0" style="overflow: hidden;">
                                        <h6 class="cart-item-title mb-0" title="${c.title}">${c.title}</h6>
                                        <small class="text-muted text-xs">${this.formatNaira(c.priceMinor, true)} / ${c.unitLabel}</small>
                                        ${auctionBadgeHtml}
                                    </div>
                                    <button class="btn btn-sm btn-link text-muted cart-remove-btn p-0 flex-shrink-0" data-line-id="${c.lineId}" title="Remove item">
                                        <i class="bi bi-x-circle fs-6"></i>
                                    </button>
                                </div>
                                <!-- Bottom Row: Stepper and Line Total -->
                                <div class="cart-item-bottom-row">
                                    <div class="input-group input-group-sm" style="width: 86px;">
                                        <button class="btn btn-outline-secondary cart-qty-btn px-2 py-0" data-line-id="${c.lineId}" data-delta="-1">-</button>
                                        <span class="input-group-text bg-white px-2 py-0 fw-semibold text-center flex-grow-1">${c.quantity}</span>
                                        <button class="btn btn-outline-secondary cart-qty-btn px-2 py-0" data-line-id="${c.lineId}" data-delta="1">+</button>
                                    </div>
                                    <span class="fw-bold text-danger small">${this.formatNaira(c.priceMinor * c.quantity, true)}</span>
                                </div>
                            </div>
                        `);
                    });

                    // Select All Bar & Counts
                    const allSelected = (selectedLinesCount === this.cart.length && this.cart.length > 0);
                    $('#selectAllCartCheck').prop('checked', allSelected);
                    $('#selectedCartSummary').text(`${selectedLinesCount} of ${this.cart.length} selected`);
                    $('#countSelectedBadge').text(String(selectedLinesCount));
                    $('#countAllBadge').text(String(this.cart.length));

                    // Dual Buttons states
                    $('#btnCheckoutSelected').prop('disabled', selectedLinesCount === 0);
                    $('#btnCheckoutAll, #btnProceedToCheckout').prop('disabled', this.cart.length === 0);
                }
            }

            // Subtotal Displays
            $('#cartSelectedSubtotalDisplay').text(this.formatNaira(selectedSubtotalMinor, true));
            document.querySelectorAll('#cartSubtotalDisplay, #modalCartSubtotal').forEach(el => {
                el.textContent = this.formatNaira(subtotalMinor, true);
            });

            // Top of Cart: Pinned Pending Unpaid Orders
            this.renderTopCartPendingOrders();

            // Customer Submitted Shopping Lists Status
            this.renderSubmittedListsStatus();
        },

        renderSubmittedListsStatus() {
            const $container = $('#cart-submitted-lists-container');
            if (!$container.length) return;

            let submittedLists = [];
            try {
                submittedLists = JSON.parse(localStorage.getItem('uwanbuy_submitted_lists')) || [];
            } catch (e) {
                submittedLists = [];
            }

            $container.empty();
            const pending = submittedLists.filter(l => l.status === 'pending_admin_pricing');
            if (pending.length > 0) {
                let html = '<div class="alert alert-info border-info rounded-3 p-2 mb-2 shadow-sm">';
                html += '<div class="d-flex align-items-center gap-2 mb-1"><i class="bi bi-hourglass-split text-primary fs-5"></i><strong class="text-dark small">Submitted Lists (Awaiting Admin Pricing)</strong></div>';
                pending.forEach(l => {
                    html += `
                        <div class="bg-white rounded-2 p-2 border mb-1 small d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold text-dark">${l.listId}</span> &bull; ${l.items.length} items
                                <small class="d-block text-muted">Admin calculating verified prices</small>
                            </div>
                            <span class="badge bg-warning-subtle text-warning-emphasis border">Under Review</span>
                        </div>
                    `;
                });
                html += '</div>';
                $container.html(html);
            }
        },

        renderTopCartPendingOrders() {
            const $container = $('#cart-pending-orders-container');
            if (!$container.length) return;

            $container.empty();
            const unpaid = this.pendingOrders.filter(o => o.status === 'awaiting_payment' || o.status === 'payment_reported');

            if (unpaid.length > 0) {
                let html = '<div class="alert alert-warning border-warning rounded-3 p-3 mb-3 shadow-sm">';
                html += '<div class="d-flex align-items-center gap-2 mb-2"><i class="bi bi-clock-history fs-5 text-warning-emphasis"></i><strong class="text-dark small">Orders Awaiting Payment</strong></div>';

                unpaid.forEach(order => {
                    html += `
                        <div class="bg-white rounded-3 p-2 border mb-2 d-flex justify-content-between align-items-center">
                            <div>
                                <div class="fw-bold text-dark small">${order.orderId}</div>
                                <small class="text-muted">${this.formatNaira(order.totalMinor, true)} &bull; ${order.status === 'payment_reported' ? '<span class="text-info fw-bold">Reported (Reconciling)</span>' : '<span class="text-danger fw-bold">Unpaid</span>'}</small>
                            </div>
                            <button class="btn btn-sm btn-brand btn-complete-pending-purchase py-1 px-2 small fw-bold" data-order-id="${order.orderId}">
                                ${order.status === 'payment_reported' ? 'View Report' : 'Complete Purchase'} <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    `;
                });

                html += '</div>';
                $container.html(html);
            }
        },

        /* ==========================================================================
           CHECKOUT VALIDATION MODAL & ASYNCHRONOUS RECALCULATION
           ========================================================================== */
        openCheckoutValidateModal(customOrderId = null, customTotalMinor = null, onlySelected = false) {
            const { subtotalMinor, selectedSubtotalMinor, selectedLinesCount } = this.getCartTotals();
            if (onlySelected && selectedLinesCount === 0) {
                if (window.iziToast) window.iziToast.warning({ title: 'No Items Selected', message: 'Please check at least one item to checkout selected.' });
                return;
            }
            const effectiveSubtotal = (customTotalMinor !== null) ? customTotalMinor : (onlySelected ? selectedSubtotalMinor : subtotalMinor);
            this.currentValidationState.onlySelected = onlySelected;

            if (effectiveSubtotal <= 0 && this.cart.length === 0) {
                if (window.iziToast) {
                    window.iziToast.info({ title: 'Cart Empty', message: 'Add items before proceeding to checkout.' });
                }
                return;
            }

            // Assign or generate unique order ID
            this.currentOrderId = customOrderId || ('ORD-UWB-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000));
            this.currentValidationState.subtotalMinor = effectiveSubtotal;

            $('#validateOrderIdDisplay').text(this.currentOrderId);

            // Populate pickup points accordion
            const points = (this.data && this.data.pickupPoints) || [
                { id: 'pku_tanke_01', name: 'Tanke Central Hub Pickup', address: '14 University Road, Tanke, Ilorin', operatingHours: '8:00 AM - 7:30 PM', phone: '0803-123-9901' },
                { id: 'pku_sanrab_02', name: 'Sanrab Junction Center', address: 'Sanrab Junction, Tanke, Ilorin', operatingHours: '8:30 AM - 6:30 PM', phone: '0803-123-9902' }
            ];

            const $acc = $('#pickupPointsAccordionList');
            if ($acc.length) {
                $acc.empty();
                points.forEach((pt, i) => {
                    $acc.append(`
                        <div class="form-check p-2 border rounded-3 mb-2 bg-white">
                            <input class="form-check-input ms-1" type="radio" name="pickupPointChoice" id="pickup_${pt.id}" value="${pt.id}" ${i === 0 ? 'checked' : ''}>
                            <label class="form-check-label ms-2 d-block" for="pickup_${pt.id}">
                                <strong class="text-dark small d-block">${pt.name} <span class="badge bg-success-subtle text-success">FREE PICKUP</span></strong>
                                <span class="text-muted text-xs d-block">${pt.address}</span>
                                <span class="text-secondary text-xs"><i class="bi bi-clock me-1"></i>${pt.operatingHours} &bull; <i class="bi bi-telephone me-1"></i>${pt.phone}</span>
                            </label>
                        </div>
                    `);
                });
            }

            this.recalculateValidationCosts();

            // Open Modal
            const modalEl = document.getElementById('modal-checkout-validate');
            if (modalEl && window.bootstrap) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        },

        recalculateValidationCosts() {
            const state = this.currentValidationState;

            // Delivery Fee
            if (state.fulfillment === 'pickup') {
                state.deliveryFeeMinor = 0;
            } else {
                state.deliveryFeeMinor = (this.data && this.data.deliveryFeeStandardMinor) || 120000;
            }

            // Express surcharge
            if (state.isExpress) {
                state.expressSurchargeMinor = (this.data && this.data.deliveryFeeExpressSurchargeMinor) || 150000;
            } else {
                state.expressSurchargeMinor = 0;
            }

            const taxableMinor = state.subtotalMinor + state.deliveryFeeMinor + state.expressSurchargeMinor;
            state.vatAmountMinor = Math.round(taxableMinor * (state.vatPercent / 100));
            state.totalMinor = taxableMinor + state.vatAmountMinor;

            // Update UI elements asynchronously
            $('#summarySubtotal').text(this.formatNaira(state.subtotalMinor, true));
            $('#summaryDeliveryFee').text(state.deliveryFeeMinor === 0 ? 'FREE' : this.formatNaira(state.deliveryFeeMinor, true));
            $('#summaryExpressFee').text(this.formatNaira(state.expressSurchargeMinor, true));
            $('#summaryExpressRow').toggleClass('d-none', !state.isExpress);
            $('#summaryVat').text(this.formatNaira(state.vatAmountMinor, true));
            $('#summaryTotalAmount').text(this.formatNaira(state.totalMinor, true));

            // Check current user wallet balance
            const walletVal = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.getWalletValue()) || 25000;
            const walletMinor = walletVal * 100;
            const deficitMinor = state.totalMinor - walletMinor;

            $('#validateWalletBalanceText').text(this.formatNaira(walletMinor, true));

            if (walletMinor >= state.totalMinor) {
                $('#walletInsufficientAlert').addClass('d-none');
                $('#btnPayWithWallet').removeClass('d-none').prop('disabled', false);
            } else {
                $('#walletInsufficientAlert').removeClass('d-none');
                $('#walletDeficitAmount').text(this.formatNaira(deficitMinor, true));
                // Show options: top up deficit or pay directly
                $('#btnPayWithWallet').addClass('d-none');
            }
        },

        /* ==========================================================================
           WALLET PAYMENT FLOW
           ========================================================================== */
        handleWalletCheckout() {
            // Prompt for wallet PIN modal
            const modalEl = document.getElementById('modal-wallet-pin');
            if (modalEl && window.bootstrap) {
                $('#pinOrderIdDisplay').text(this.currentOrderId);
                $('#pinAmountDisplay').text(this.formatNaira(this.currentValidationState.totalMinor, true));
                const pinModal = new bootstrap.Modal(modalEl);
                pinModal.show();
            }
        },

        executeWalletPayment() {
            const pin = $('#walletPinInput').val().trim();
            if (pin.length < 4) {
                if (window.iziToast) window.iziToast.error({ title: 'Invalid PIN', message: 'Enter 4-digit security PIN.' });
                return;
            }

            const totalMinor = this.currentValidationState.totalMinor;
            const currentWallet = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.getWalletValue()) || 25000;
            const newWallet = currentWallet - (totalMinor / 100);

            // Update wallet in global storefront
            localStorage.setItem('uwanbuy_wallet_balance', String(newWallet));
            if (window.AreaBazaarStorefront) window.AreaBazaarStorefront.refresh();

            // Save confirmed order
            const confirmedOrder = {
                orderId: this.currentOrderId,
                totalMinor: totalMinor,
                items: [...this.cart],
                status: 'paid_and_confirmed',
                paymentMethod: 'wallet',
                deliveryPasscode: Math.floor(1000 + Math.random() * 9000),
                createdAt: new Date().toISOString()
            };

            // Remove from pending if was pending
            this.pendingOrders = this.pendingOrders.filter(o => o.orderId !== this.currentOrderId);
            this.pendingOrders.push(confirmedOrder);
            
            // Remove only checked-out items if onlySelected was used
            if (this.currentValidationState && this.currentValidationState.onlySelected) {
                this.cart = this.cart.filter(c => !this.selectedCartLineIds.has(c.lineId));
                this.selectedCartLineIds.clear();
                this.cart.forEach(c => this.selectedCartLineIds.add(c.lineId));
            } else {
                this.cart = [];
                this.selectedCartLineIds.clear();
            }

            this.saveLocalState();

            // Close modals
            $('.modal').modal('hide');

            if (window.iziToast) {
                window.iziToast.success({
                    title: 'Order Confirmed!',
                    message: `Order ${confirmedOrder.orderId} paid with wallet. Delivery Passcode: ${confirmedOrder.deliveryPasscode}`,
                    timeout: 8000
                });
            }

            this.syncCartUI();
        },

        /* ==========================================================================
           PAYMENT REQUEST & RECONCILIATION MODALS
           ========================================================================== */
        openPaymentRequestModal(purpose = 'order_direct', customAmountMinor = null) {
            let amountMinor = customAmountMinor;
            if (!amountMinor) {
                const state = this.currentValidationState;
                amountMinor = (purpose === 'wallet_topup')
                    ? Math.max(50000, (state.totalMinor - ((window.AreaBazaarStorefront && window.AreaBazaarStorefront.getWalletValue()) || 25000) * 100))
                    : state.totalMinor;
            }

            if (!this.currentOrderId || (purpose === 'wallet_topup' && customAmountMinor)) {
                this.currentOrderId = 'TOPUP-UWB-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000);
            }
            this.currentPaymentPurpose = purpose;
            this.currentCustomAmountMinor = amountMinor;

            $('#reqOrderIdDisplay').text(this.currentOrderId);
            $('#reqAmountDisplay').text(this.formatNaira(amountMinor, true));
            $('#reqPurposeInput').val(purpose);

            // Populate agent contact details
            const agents = (this.data && this.data.agentAccounts) || [];
            const agent = agents[0] || {
                agentName: 'Chukwuma Adebayo',
                phone: '0801-234-5678',
                whatsapp: '+2348012345678',
                hubCode: 'FRM-ILN-042',
                badge: 'Accredited Senior Agent'
            };

            $('#agentNameDisplay').text(agent.agentName);
            $('#agentPhoneDisplay').text(agent.phone);
            $('#agentHubCodeDisplay').text(agent.hubCode);
            $('#agentBadgeDisplay').text(agent.badge);
            $('#agentWhatsappBtn').attr('href', `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20want%20to%20make%20payment%20for%20order%20${this.currentOrderId}`);

            // Populate company bank details
            const bank = (this.data && this.data.companyBank) || {
                bankName: 'First Bank of Nigeria',
                accountNumber: '3109845210',
                accountName: 'UwanBUY Direct Settlement'
            };

            $('#bankNameDisplay').text(bank.bankName);
            $('#bankAccountDisplay').text(bank.accountNumber);
            $('#bankAccountNameDisplay').text(bank.accountName);

            // Close validation modal and open request modal
            $('#modal-checkout-validate').modal('hide');
            const modalEl = document.getElementById('modal-payment-request');
            if (modalEl && window.bootstrap) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        },

        generatePaymentReference(channel = 'agent') {
            this.currentPaymentRef = 'REF-UWB-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + Math.floor(10000 + Math.random() * 90000);

            // Persist order in pending orders list
            const amountMinor = this.currentCustomAmountMinor || this.currentValidationState.totalMinor;
            const existingOrderIdx = this.pendingOrders.findIndex(o => o.orderId === this.currentOrderId);
            const pendingRecord = {
                orderId: this.currentOrderId,
                paymentRef: this.currentPaymentRef,
                channel: channel,
                purpose: $('#reqPurposeInput').val() || this.currentPaymentPurpose || 'order_direct',
                totalMinor: amountMinor,
                status: 'awaiting_payment',
                items: (this.currentPaymentPurpose === 'wallet_topup') ? [] : [...this.cart],
                createdAt: new Date().toISOString()
            };

            if (existingOrderIdx >= 0) {
                this.pendingOrders[existingOrderIdx] = pendingRecord;
            } else {
                this.pendingOrders.push(pendingRecord);
            }

            this.saveLocalState();

            // Display ref on UI
            $('#generatedRefAlert').removeClass('d-none');
            $('#generatedRefText').text(this.currentPaymentRef);

            if (window.iziToast) {
                window.iziToast.info({
                    title: 'Payment Ref Generated',
                    message: `Ref: ${this.currentPaymentRef}. Proceed to report after transfer.`,
                    position: 'topRight'
                });
            }
        },

        openPaymentReportModal(orderId, ref) {
            this.currentOrderId = orderId || this.currentOrderId;
            this.currentPaymentRef = ref || this.currentPaymentRef;

            const order = this.pendingOrders.find(o => o.orderId === this.currentOrderId);
            const amountKobo = order ? order.totalMinor : this.currentValidationState.totalMinor;

            $('#reportOrderIdInput').val(this.currentOrderId);
            $('#reportPaymentRefInput').val(this.currentPaymentRef || '');
            $('#reportAmountPaidInput').val(amountKobo / 100);

            $('#modal-payment-request').modal('hide');
            const modalEl = document.getElementById('modal-payment-report');
            if (modalEl && window.bootstrap) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        },

        submitPaymentReport() {
            const orderId = $('#reportOrderIdInput').val();
            const ref = $('#reportPaymentRefInput').val();
            const amountNaira = parseFloat($('#reportAmountPaidInput').val()) || 0;
            const bankPaidFrom = $('#reportBankSelect').val();
            const payerName = $('#reportPayerNameInput').val().trim();
            const remarks = $('#reportRemarksInput').val().trim();

            const report = {
                reportId: 'REP-' + Date.now(),
                orderId: orderId,
                paymentRef: ref,
                amountPaidMinor: Math.round(amountNaira * 100),
                bankPaidFrom: bankPaidFrom,
                payerName: payerName,
                remarks: remarks,
                status: 'submitted_pending_reconciliation',
                createdAt: new Date().toISOString()
            };

            // Store in reconciliations list for admin review
            this.reconciliations.push(report);

            // Update pending order state
            const order = this.pendingOrders.find(o => o.orderId === orderId);
            if (order) {
                order.status = 'payment_reported';
                order.report = report;
            }

            this.saveLocalState();
            $('#modal-payment-report').modal('hide');

            if (window.iziToast) {
                window.iziToast.success({
                    title: 'Payment Reported!',
                    message: 'Hub administrators are reconciling your payment.',
                    timeout: 6000
                });
            }

            this.syncCartUI();
        },

        resumePendingOrderPayment(order) {
            this.currentOrderId = order.orderId;
            this.currentPaymentRef = order.paymentRef;
            this.currentValidationState.totalMinor = order.totalMinor;
            this.openPaymentReportModal(order.orderId, order.paymentRef);
        },

        /* ==========================================================================
           PAGE SPECIFIC RENDERERS
           ========================================================================== */
        renderPageSpecifics() {
            const path = window.location.pathname.toLowerCase();
            if ($('#bazaarVariantGalleryRow').length || $('#landingAuctionDealsRow').length || path.includes('auctions/index.html') || path.includes('/auctions/') || path.includes('index.html') || path.endsWith('/uwanbuy/') || path.endsWith('/uwanbuy')) {
                this.renderBazaarPage();
            }
            if ($('#groceriesGalleryRow').length || $('#gadgetsGalleryRow').length || path.includes('index.html') || path.endsWith('/uwanbuy/') || path.endsWith('/uwanbuy')) {
                this.renderHomePageGalleries();
            }
            if ($('#categoryProductsGrid').length || path.includes('category.html')) {
                this.renderCategoryPage();
            }
            if ($('#productSpecsTableBody').length || $('#detailTitle').length || path.includes('product-details.html')) {
                this.renderProductDetailsPage();
            }
        },

        renderHomePageGalleries() {
            const sections = [
                { key: 'groceries', container: '#groceriesGalleryRow' },
                { key: 'gadgets', container: '#gadgetsGalleryRow' },
                { key: 'fashion', container: '#fashionGalleryRow' },
                { key: 'fashion/mens-wear', container: '#fashionMensGalleryRow' },
                { key: 'fashion/womens-wear', container: '#fashionWomensGalleryRow' },
                { key: 'home', container: '#homeGalleryRow' }
            ];

            sections.forEach(sec => {
                const $container = $(sec.container);
                if (!$container.length) return;

                const products = this.getProductsBySection(sec.key).slice(0, 4);
                $container.empty();

                products.forEach(p => {
                    $container.append(`<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">${this.createProductCardHtml(p)}</div>`);
                });
            });

            // Populate Trending Hyperlocal Products Grid on index.html
            const $trending = $('#trendingProductsGrid');
            if ($trending.length) {
                const trendingProds = this.getAllProducts().slice(0, 8);
                $trending.empty();
                trendingProds.forEach(p => {
                    $trending.append(`<div class="col-6 col-md-4 col-lg-3">${this.createProductCardHtml(p)}</div>`);
                });
            }
        },

        renderCategoryPage() {
            const urlParams = new URLSearchParams(window.location.search);
            const activeCat = urlParams.get('category') || 'all';

            // Filter chips active state
            $('#categoryFilterBar .filter-chip').removeClass('active');
            $(`#categoryFilterBar .filter-chip[data-category="${activeCat}"]`).addClass('active');

            this.filterAndRenderCategoryProducts(activeCat);

            // Filter bindings on category.html
            const self = this;
            $('#categorySearchInput').on('input', function () {
                self.filterAndRenderCategoryProducts(activeCat);
            });
            $('#sortSelect').on('change', function () {
                self.filterAndRenderCategoryProducts(activeCat);
            });
        },

        filterAndRenderCategoryProducts(categoryId) {
            let products = this.getProductsByCategory(categoryId);
            const query = ($('#categorySearchInput').val() || '').toLowerCase().trim();
            const sort = $('#sortSelect').val() || 'featured';

            if (query) {
                products = products.filter(p => (p.title || p.name).toLowerCase().includes(query) || (p.brand && p.brand.toLowerCase().includes(query)));
            }

            if (sort === 'price_asc') {
                products.sort((a, b) => (a.priceMinor || a.price * 100) - (b.priceMinor || b.price * 100));
            } else if (sort === 'price_desc') {
                products.sort((a, b) => (b.priceMinor || b.price * 100) - (a.priceMinor || a.price * 100));
            } else if (sort === 'rating') {
                products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            }

            const $grid = $('#categoryProductsGrid');
            if (!$grid.length) return;

            $grid.empty();
            if (products.length === 0) {
                $grid.html(`
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-search display-4 text-muted mb-3 d-block"></i>
                        <h5 class="fw-bold">No Products Found</h5>
                        <p class="text-muted small">Try broadening your search or switching categories.</p>
                    </div>
                `);
                return;
            }

            products.forEach(p => {
                $grid.append(`<div class="col-6 col-md-4 col-lg-3">${this.createProductCardHtml(p)}</div>`);
            });
        },

        createProductCardHtml(p) {
            const img = this.resolveAssetUrl((p.media && p.media[0] && (p.media[0].thumbnailUrl || p.media[0].url)) || p.image || '../assetsecm/images/soups/egusi-soup-roundbowl.png');
            const priceDisplay = this.getBaseProductPriceRange(p);
            const badge = (p.badges && p.badges[0]) || (p.subCategory ? p.subCategory.replace('-', ' ') : '');
            const moq = (p.stock && p.stock.moq) || 1;
            const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
            const variantCount = hasVariants ? p.variants.length : 0;

            // Wave crossover surprise detection
            const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
            let hasActiveWave = false;
            let activeWaveBadge = '';
            if (hasVariants) {
                for (const v of p.variants) {
                    if (waveMap[v.id]) {
                        hasActiveWave = true;
                        activeWaveBadge = waveMap[v.id].badge || '⚡ Price Wave Dropping';
                        break;
                    }
                }
            } else if (waveMap[p.id]) {
                hasActiveWave = true;
                activeWaveBadge = waveMap[p.id].badge || '⚡ Live Auction';
            }

            return `
                <div class="card h-100 border rounded-4 shadow-sm product-card position-relative bg-white overflow-hidden">
                    ${hasActiveWave ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1 small animate-pulse"><i class="bi bi-lightning-fill me-1"></i>${activeWaveBadge}</span>` : (badge ? `<span class="badge bg-secondary position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1 small text-capitalize">${badge}</span>` : '')}
                    <div class="p-3 text-center bg-light rounded-top-4" style="height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer;" data-action="quick-view" data-id="${p.id}">
                        <img src="${img}" alt="${p.title || p.name}" class="img-fluid" style="max-height: 150px; object-fit: contain;">
                    </div>
                    <div class="card-body p-3 d-flex flex-column">
                        <small class="text-muted d-block text-xs text-uppercase fw-bold">${p.brand || 'Verified'}${variantCount ? ` &bull; ${variantCount} Variants` : ''}</small>
                        <h6 class="fw-bold text-dark mb-1 text-truncate" title="${p.title || p.name}">${p.title || p.name}</h6>
                        <div class="d-flex align-items-center gap-1 text-warning small mb-2">
                            <i class="bi bi-star-fill"></i>
                            <span class="text-dark fw-bold">${p.rating || 4.8}</span>
                            <span class="text-muted text-xs">(${p.reviewsCount || 42})</span>
                            ${moq > 1 ? `<span class="badge bg-warning-subtle text-warning-emphasis ms-auto">MOQ: ${moq}</span>` : ''}
                        </div>
                        <div class="mt-auto">
                            <div class="d-flex align-items-baseline gap-2 mb-2">
                                <span class="fs-5 fw-extrabold text-danger">${priceDisplay}</span>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-secondary flex-fill rounded-3 small fw-semibold" data-action="quick-view" data-id="${p.id}">
                                    <i class="bi bi-sliders me-1"></i> ${hasVariants ? 'Options & Specs' : 'Specs'}
                                </button>
                                <button class="btn btn-sm btn-brand flex-fill rounded-3 small fw-bold" data-action="quick-view" data-id="${p.id}">
                                    <i class="bi bi-cart-plus me-1"></i> ${hasVariants ? 'Select Variant' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        renderProductDetailsPage() {
            const urlParams = new URLSearchParams(window.location.search);
            const prodId = urlParams.get('id') || 'uw_prd_1001';
            const p = this.getProductById(prodId) || this.getAllProducts()[0];
            if (!p) return;

            document.title = `${p.title || p.name} | UwanBUY Hyperlocal`;
            $('#productTitle, #detailTitle').text(p.title || p.name);
            $('#productBrand, #detailBrand').text(p.brand || 'Verified Supplier');
            $('#productSku, #detailSku').text(p.sku || p.id);
            $('#productPrice, #detailPrice').text(this.getBaseProductPriceRange(p));
            
            const comparePrice = p.compareAtPriceMinor || (p.compareAtPrice ? p.compareAtPrice * 100 : 0);
            if (comparePrice) {
                $('#productComparePrice, #detailComparePrice').text(this.formatNaira(comparePrice, true)).removeClass('d-none').show();
            } else {
                $('#productComparePrice, #detailComparePrice, #detailSavingsBadge').addClass('d-none').hide();
            }

            $('#productRating, #detailRating').text(p.rating || '4.9');
            $('#productReviewsCount').text(`${p.reviewsCount || 45} verified reviews`);
            $('#productDescription, #detailDescription').text(p.description);
            $('#detailUnitLabel').text(p.unitLabel || '1 Unit');
            $('#breadcrumbCategory, #detailCategoryBadge').text(p.categoryName || p.categoryId || 'Department');
            $('#breadcrumbProductTitle').text(p.title || p.name);

            const moq = (p.stock && p.stock.moq) || 1;
            if (moq > 1) {
                $('#productMoqBadge').html(`<i class="bi bi-info-circle me-1"></i> Minimum Order Quantity (MOQ): <strong>${moq} ${p.unitLabel || 'units'}</strong>`).removeClass('d-none').show();
                $('#productQtyInput, #detailQtyInput').val(moq).attr('min', moq);
            } else {
                $('#productMoqBadge').addClass('d-none').hide();
            }

            const img = this.resolveAssetUrl((p.media && p.media[0] && (p.media[0].url || p.media[0].thumbnailUrl)) || p.image || '../assetsecm/images/soups/egusi-soup-roundbowl.png');
            $('#productMainImage, #detailMainImage').attr('src', img).attr('alt', p.title || p.name);

            this.renderDetailedSpecsTable(p);

            const self = this;
            $('#btnDetailsAddToCart, #btnDetailAddToCart').off('click').on('click', function (e) {
                e.preventDefault();
                self.openQuickViewModal(p.id);
            });

            $('#btnDetailsBuyNow, #btnDetailBuyNow').off('click').on('click', function (e) {
                e.preventDefault();
                self.openQuickViewModal(p.id);
            });
        },

        renderDetailedSpecsTable(p) {
            const $specsTable = $('#productSpecsTableBody, #specsTableBody');
            if (!$specsTable.length) return;
            $specsTable.empty();

            if (!p.specifications) {
                $specsTable.html('<tr><td colspan="2" class="text-muted small">Standard specifications apply.</td></tr>');
                return;
            }

            Object.entries(p.specifications).forEach(([k, v]) => {
                if (k === 'inspectionDiagnostics') return;
                const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const valStr = Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v);

                $specsTable.append(`
                    <tr>
                        <th class="ps-3 py-2 text-muted small fw-semibold" style="width: 35%;">${label}</th>
                        <td class="pe-3 py-2 text-dark small fw-bold">${valStr}</td>
                    </tr>
                `);
            });
        },

        /* ==========================================================================
           DUAL MODAL SYSTEM (GROCERIES SCROLLABLE VS FASHION/TECH ATTRIBUTE OPTIONS)
           ========================================================================== */
        openQuickViewModal(productId, initialVariantId = null) {
            let p = this.getProductById(productId);
            if (!p) {
                const all = this.getAllProducts();
                for (const base of all) {
                    if (base.variants && base.variants.some(v => v.id === productId)) {
                        p = base;
                        initialVariantId = productId;
                        break;
                    }
                }
            }
            if (!p) return;

            const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
            const isGroceries = (p.category === 'groceries' || p.categoryId === 'groceries' || p.modalType === 'groceries_scroll_variants');
            const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
            const self = this;

            let activeVariant = null;
            if (hasVariants) {
                if (initialVariantId) {
                    activeVariant = p.variants.find(v => v.id === initialVariantId) || p.variants[0];
                } else {
                    activeVariant = p.variants[0];
                }
            }

            let modalHtml = '';

            if (isGroceries && hasVariants) {
                // MODE A: Groceries (Scrollable Left Panel with Variant Packs)
                let variantCardsHtml = '';
                p.variants.forEach(v => {
                    const isSelected = (v.id === activeVariant.id);
                    const vImg = self.resolveAssetUrl(v.image || p.image);
                    const vWave = waveMap[v.id];
                    const vPrice = vWave ? self.formatNaira(vWave.wavePrice * 100, true) : self.formatNaira(v.priceMinor || (v.price * 100), true);

                    variantCardsHtml += `
                        <div class="card p-2 mb-2 grocery-variant-card ${isSelected ? 'border-danger bg-danger-subtle shadow-sm' : 'border bg-white'} cursor-pointer" data-base-id="${p.id}" data-variant-id="${v.id}" style="cursor: pointer; transition: all 0.2s;">
                            <div class="d-flex align-items-center gap-2">
                                <img src="${vImg}" alt="${v.name}" class="rounded-2 border flex-shrink-0" style="width: 50px; height: 50px; object-fit: contain; background: #fff;">
                                <div class="flex-grow-1 min-w-0">
                                    <div class="fw-bold text-dark small lh-sm text-truncate">${v.name}</div>
                                    <div class="d-flex align-items-center gap-1 mt-1">
                                        <span class="fw-extrabold text-danger small">${vPrice}</span>
                                        ${vWave ? `<span class="badge bg-danger rounded-pill px-1 text-xs">⚡ Surprise Wave</span>` : ''}
                                    </div>
                                </div>
                                <i class="bi ${isSelected ? 'bi-check-circle-fill text-danger' : 'bi-circle text-muted'}"></i>
                            </div>
                        </div>
                    `;
                });

                modalHtml = `
                    <div class="row g-4">
                        <!-- Left: Scrollable Variants List -->
                        <div class="col-md-5 border-end">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <h6 class="fw-bold text-dark mb-0"><i class="bi bi-stack me-1 text-danger"></i> Choose Pack Size</h6>
                                <span class="badge bg-light text-muted border">${p.variants.length} packs</span>
                            </div>
                            <p class="text-muted text-xs mb-3">Click any pack size below to view verified prices, specifications, and nutritional pack details.</p>
                            <div class="grocery-variants-scroll-wrapper" style="max-height: 420px; overflow-y: auto; padding-right: 6px;">
                                ${variantCardsHtml}
                            </div>
                        </div>

                        <!-- Right: Selected Variant Details -->
                        <div class="col-md-7" id="groceryVariantDetailsRightPanel">
                            ${self.renderGroceryVariantRightPanel(p, activeVariant, waveMap[activeVariant.id])}
                        </div>
                    </div>
                `;
            } else if (hasVariants) {
                // MODE B: Fashion, Gadgets, Home (Attribute Pill Options)
                modalHtml = self.renderAttributeOptionsModal(p, activeVariant, waveMap);
            } else {
                // MODE C: Single Base Product (No Variants)
                modalHtml = self.renderSingleProductModal(p, waveMap[p.id]);
            }

            // Populate into DOM container
            let container = document.getElementById('quickViewContent');
            if (container) {
                container.innerHTML = modalHtml;
            }
            let bModalBody = document.getElementById('quickViewModalBody') || document.querySelector('#modal-quick-view .modal-body');
            if (bModalBody) {
                bModalBody.innerHTML = modalHtml;
            }

            // Open Modal
            if (window.jQuery && $.fn.iziModal && $('#quickViewModal').length) {
                $('#quickViewModal').iziModal('open');
            } else {
                const bModalEl = document.getElementById('modal-quick-view');
                if (bModalEl && window.bootstrap) {
                    const modal = window.bootstrap.Modal.getOrCreateInstance ? window.bootstrap.Modal.getOrCreateInstance(bModalEl) : new window.bootstrap.Modal(bModalEl);
                    modal.show();
                }
            }
        },

        renderGroceryVariantRightPanel(p, v, waveInfo) {
            const self = this;
            const priceMinor = v.priceMinor || (v.price * 100);
            const compareMinor = v.compareAtPriceMinor || (v.compareAtPrice ? v.compareAtPrice * 100 : 0);
            const moq = (v.stock && v.stock.moq) || 1;
            const qtyAvailable = (v.stock && v.stock.quantity) || 15;

            let priceBlockHtml = '';
            if (waveInfo) {
                const wavePriceMinor = waveInfo.wavePrice * 100;
                const savingsMinor = priceMinor - wavePriceMinor;
                priceBlockHtml = `
                    <div class="alert alert-danger border-0 p-3 rounded-3 mb-3 bg-danger-subtle">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="badge bg-danger rounded-pill px-2 py-1 small animate-pulse">
                                <i class="bi bi-lightning-charge-fill me-1"></i> ${waveInfo.badge || 'SURPRISE PRICE WAVE'}
                            </span>
                            <span class="badge bg-dark rounded-pill px-2 py-1 small"><i class="bi bi-clock-history me-1"></i> ${waveInfo.timerMinutesLeft || 15}m left</span>
                        </div>
                        <div class="d-flex align-items-baseline gap-2 mt-2">
                            <span class="fs-3 fw-800 text-danger">${self.formatNaira(wavePriceMinor, true)}</span>
                            <span class="text-decoration-line-through text-muted small">${self.formatNaira(priceMinor, true)}</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle ms-auto">Save ${self.formatNaira(savingsMinor, true)}!</span>
                        </div>
                        <p class="small text-danger-emphasis mb-0 mt-1">${waveInfo.description || 'Special drop price active during live wave. Locks upon checkout!'}</p>
                    </div>
                `;
            } else {
                priceBlockHtml = `
                    <div class="p-3 bg-light rounded-3 mb-3 border">
                        <div class="d-flex align-items-baseline gap-2">
                            <span class="fs-3 fw-800 text-danger">${self.formatNaira(priceMinor, true)}</span>
                            ${compareMinor ? `<span class="text-decoration-line-through text-muted">${self.formatNaira(compareMinor, true)}</span>` : ''}
                        </div>
                        <div class="small text-success fw-semibold mt-1">
                            <i class="bi bi-check-circle-fill me-1"></i> In Stock (${qtyAvailable} available at Tanke Hub)
                        </div>
                    </div>
                `;
            }

            let specsRows = '';
            if (v.specifications) {
                Object.entries(v.specifications).forEach(([k, val]) => {
                    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    specsRows += `<tr><th class="ps-3 py-2 text-muted small" style="width: 40%;">${label}</th><td class="pe-3 py-2 text-dark small fw-bold">${val}</td></tr>`;
                });
            }

            return `
                <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-danger-subtle text-danger text-uppercase fw-bold">${p.categoryName || p.category}</span>
                    <span class="badge bg-light text-muted border">${p.subCategory || 'Staples'}</span>
                </div>
                <h4 class="fw-bold text-dark mb-1">${v.name}</h4>
                <p class="text-muted small mb-3">${p.description}</p>

                ${priceBlockHtml}

                <div class="table-responsive border rounded-3 mb-3 bg-white">
                    <table class="table table-sm table-striped mb-0">
                        <tbody>
                            ${specsRows || '<tr><td colspan="2" class="p-2 text-center text-muted small">Standard specifications verified.</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <!-- Quantity & Actions -->
                <div class="d-flex align-items-center gap-3">
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary btn-var-qty-minus" type="button" data-moq="${moq}">-</button>
                        <input type="number" id="modalSelectedVariantQty" class="form-control text-center fw-bold" value="${moq}" min="${moq}">
                        <button class="btn btn-outline-secondary btn-var-qty-plus" type="button">+</button>
                    </div>
                    <button class="btn btn-brand flex-grow-1 py-2 fw-bold shadow-sm btn-modal-add-variant" data-base-id="${p.id}" data-variant-id="${v.id}" data-moq="${moq}">
                        <i class="bi bi-cart-plus me-1"></i> Add To Cart
                    </button>
                </div>
            `;
        },

        renderAttributeOptionsModal(p, activeVariant, waveMap) {
            const self = this;
            const currentWave = waveMap[activeVariant.id];
            const priceMinor = activeVariant.priceMinor || (activeVariant.price * 100);
            const compareMinor = activeVariant.compareAtPriceMinor || (activeVariant.compareAtPrice ? activeVariant.compareAtPrice * 100 : 0);
            const moq = (activeVariant.stock && activeVariant.stock.moq) || 1;
            const qtyAvailable = (activeVariant.stock && activeVariant.stock.quantity) || 12;
            const img = self.resolveAssetUrl((p.media && p.media[0] && (p.media[0].url || p.media[0].thumbnailUrl)) || p.image);

            let attributesHtml = '';
            if (p.attributes && p.attributes.length > 0) {
                p.attributes.forEach(attr => {
                    let pills = '';
                    attr.values.forEach(val => {
                        const isValActive = (activeVariant[attr.key] === val);
                        pills += `
                            <button type="button" class="btn btn-sm ${isValActive ? 'btn-dark' : 'btn-outline-secondary'} rounded-pill px-3 py-1 me-1 mb-1 btn-attr-pill" data-base-id="${p.id}" data-attr-key="${attr.key}" data-attr-val="${val}">
                                ${val}
                            </button>
                        `;
                    });
                    attributesHtml += `
                        <div class="mb-3">
                            <label class="small fw-bold text-secondary d-block mb-1">${attr.label}: <strong class="text-dark">${activeVariant[attr.key] || ''}</strong></label>
                            <div class="d-flex flex-wrap">${pills}</div>
                        </div>
                    `;
                });
            }

            let priceBlockHtml = '';
            if (currentWave) {
                const wavePriceMinor = currentWave.wavePrice * 100;
                const savingsMinor = priceMinor - wavePriceMinor;
                priceBlockHtml = `
                    <div class="alert alert-danger border-0 p-3 rounded-3 mb-3 bg-danger-subtle">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="badge bg-danger rounded-pill px-2 py-1 small animate-pulse">
                                <i class="bi bi-lightning-charge-fill me-1"></i> ${currentWave.badge || 'SURPRISE PRICE WAVE'}
                            </span>
                            <span class="badge bg-dark rounded-pill px-2 py-1 small"><i class="bi bi-clock-history me-1"></i> ${currentWave.timerMinutesLeft || 15}m left</span>
                        </div>
                        <div class="d-flex align-items-baseline gap-2 mt-2">
                            <span class="fs-3 fw-800 text-danger">${self.formatNaira(wavePriceMinor, true)}</span>
                            <span class="text-decoration-line-through text-muted small">${self.formatNaira(priceMinor, true)}</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle ms-auto">Save ${self.formatNaira(savingsMinor, true)}!</span>
                        </div>
                        <p class="small text-danger-emphasis mb-0 mt-1">${currentWave.description || 'Special drop price active during live wave. Locks upon checkout!'}</p>
                    </div>
                `;
            } else {
                priceBlockHtml = `
                    <div class="p-3 bg-light rounded-3 mb-3 border">
                        <div class="d-flex align-items-baseline gap-2">
                            <span class="fs-3 fw-800 text-danger">${self.formatNaira(priceMinor, true)}</span>
                            ${compareMinor ? `<span class="text-decoration-line-through text-muted">${self.formatNaira(compareMinor, true)}</span>` : ''}
                        </div>
                        <div class="small text-success fw-semibold mt-1">
                            <i class="bi bi-check-circle-fill me-1"></i> In Stock (${qtyAvailable} available at Tanke Hub)
                        </div>
                    </div>
                `;
            }

            let specsRows = '';
            const allSpecs = { ...(p.specifications || {}), ...(activeVariant.specifications || {}) };
            Object.entries(allSpecs).forEach(([k, val]) => {
                if (k === 'inspectionDiagnostics') return;
                const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                specsRows += `<tr><th class="ps-3 py-2 text-muted small" style="width: 40%;">${label}</th><td class="pe-3 py-2 text-dark small fw-bold">${val}</td></tr>`;
            });

            return `
                <div class="row g-4 align-items-start">
                    <div class="col-md-5 text-center">
                        <div class="p-3 bg-light rounded-4 border text-center mb-3">
                            <img src="${img}" alt="${p.title}" class="img-fluid" style="max-height: 240px; object-fit: contain;">
                        </div>
                        <span class="badge bg-light text-muted border text-xs">SKU: ${activeVariant.sku || p.id}</span>
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-dark">${p.categoryName || p.category}</span>
                            <span class="badge bg-light text-muted border">${p.subCategory || 'Catalog'}</span>
                        </div>
                        <h4 class="fw-bold text-dark mb-1">${p.title || p.name}</h4>
                        <p class="text-muted small mb-3">${p.description}</p>

                        ${priceBlockHtml}

                        <!-- Attribute Modifiers -->
                        ${attributesHtml}

                        <!-- Specifications -->
                        <div class="table-responsive border rounded-3 mb-3 bg-white">
                            <table class="table table-sm table-striped mb-0">
                                <tbody>
                                    ${specsRows || '<tr><td colspan="2" class="p-2 text-center text-muted small">Standard specifications apply.</td></tr>'}
                                </tbody>
                            </table>
                        </div>

                        <div class="d-flex align-items-center gap-3">
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary btn-var-qty-minus" type="button" data-moq="${moq}">-</button>
                                <input type="number" id="modalSelectedVariantQty" class="form-control text-center fw-bold" value="${moq}" min="${moq}">
                                <button class="btn btn-outline-secondary btn-var-qty-plus" type="button">+</button>
                            </div>
                            <button class="btn btn-brand flex-grow-1 py-2 fw-bold shadow-sm btn-modal-add-variant" data-base-id="${p.id}" data-variant-id="${activeVariant.id}" data-moq="${moq}">
                                <i class="bi bi-cart-plus me-1"></i> Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        renderSingleProductModal(p, waveInfo) {
            const self = this;
            const priceMinor = p.priceMinor || (p.price * 100);
            const compareMinor = p.compareAtPriceMinor || (p.compareAtPrice ? p.compareAtPrice * 100 : 0);
            const moq = (p.stock && p.stock.moq) || 1;
            const img = self.resolveAssetUrl((p.media && p.media[0] && (p.media[0].url || p.media[0].thumbnailUrl)) || p.image);

            let priceBlockHtml = '';
            if (waveInfo) {
                const wavePriceMinor = waveInfo.wavePrice * 100;
                const savingsMinor = priceMinor - wavePriceMinor;
                priceBlockHtml = `
                    <div class="alert alert-danger border-0 p-3 rounded-3 mb-3 bg-danger-subtle">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="badge bg-danger rounded-pill px-2 py-1 small animate-pulse">
                                <i class="bi bi-lightning-charge-fill me-1"></i> ${waveInfo.badge || 'SURPRISE PRICE WAVE'}
                            </span>
                            <span class="badge bg-dark rounded-pill px-2 py-1 small"><i class="bi bi-clock-history me-1"></i> ${waveInfo.timerMinutesLeft || 15}m left</span>
                        </div>
                        <div class="d-flex align-items-baseline gap-2 mt-2">
                            <span class="fs-3 fw-800 text-danger">${self.formatNaira(wavePriceMinor, true)}</span>
                            <span class="text-decoration-line-through text-muted small">${self.formatNaira(priceMinor, true)}</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle ms-auto">Save ${self.formatNaira(savingsMinor, true)}!</span>
                        </div>
                    </div>
                `;
            } else {
                priceBlockHtml = `
                    <div class="p-3 bg-light rounded-3 mb-3 border">
                        <div class="d-flex align-items-baseline gap-2">
                            <span class="fs-3 fw-800 text-danger">${self.formatNaira(priceMinor, true)}</span>
                            ${compareMinor ? `<span class="text-decoration-line-through text-muted">${self.formatNaira(compareMinor, true)}</span>` : ''}
                        </div>
                    </div>
                `;
            }

            let specsRows = '';
            if (p.specifications) {
                Object.entries(p.specifications).forEach(([k, val]) => {
                    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    specsRows += `<tr><th class="ps-3 py-2 text-muted small" style="width: 40%;">${label}</th><td class="pe-3 py-2 text-dark small fw-bold">${val}</td></tr>`;
                });
            }

            return `
                <div class="row g-4 align-items-start">
                    <div class="col-md-5 text-center">
                        <div class="p-3 bg-light rounded-4 border text-center mb-3">
                            <img src="${img}" alt="${p.title}" class="img-fluid" style="max-height: 240px; object-fit: contain;">
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-dark">${p.categoryName || p.category}</span>
                            <span class="badge bg-light text-muted border">${p.subCategory || 'Essentials'}</span>
                        </div>
                        <h4 class="fw-bold text-dark mb-1">${p.title || p.name}</h4>
                        <p class="text-muted small mb-3">${p.description}</p>

                        ${priceBlockHtml}

                        <div class="table-responsive border rounded-3 mb-3 bg-white">
                            <table class="table table-sm table-striped mb-0">
                                <tbody>
                                    ${specsRows || '<tr><td colspan="2" class="p-2 text-center text-muted small">Standard specifications apply.</td></tr>'}
                                </tbody>
                            </table>
                        </div>

                        <div class="d-flex align-items-center gap-3">
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary btn-var-qty-minus" type="button" data-moq="${moq}">-</button>
                                <input type="number" id="modalSelectedVariantQty" class="form-control text-center fw-bold" value="${moq}" min="${moq}">
                                <button class="btn btn-outline-secondary btn-var-qty-plus" type="button">+</button>
                            </div>
                            <button class="btn btn-brand flex-grow-1 py-2 fw-bold shadow-sm btn-modal-add-variant" data-base-id="${p.id}" data-variant-id="${p.id}" data-moq="${moq}">
                                <i class="bi bi-cart-plus me-1"></i> Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        getBazaarVariants() {
            const waveMap = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS) || {};
            const products = this.getAllProducts();
            const bazaarLots = [];

            Object.entries(waveMap).forEach(([varId, wave]) => {
                let foundVariant = null;
                let foundBase = null;

                for (const p of products) {
                    if (p.variants && p.variants.length > 0) {
                        const v = p.variants.find(item => item.id === varId);
                        if (v) {
                            foundVariant = v;
                            foundBase = p;
                            break;
                        }
                    } else if (p.id === varId) {
                        foundBase = p;
                        foundVariant = p;
                        break;
                    }
                }

                if (foundBase && foundVariant) {
                    bazaarLots.push({
                        variantId: varId,
                        baseProductId: foundBase.id,
                        title: wave.title || `${foundBase.title} (${foundVariant.name})`,
                        baseTitle: foundBase.title,
                        variantName: foundVariant.name || foundBase.title,
                        category: foundBase.category,
                        categoryName: foundBase.categoryName,
                        subCategory: foundBase.subCategory,
                        image: this.resolveAssetUrl(foundVariant.image || foundBase.image),
                        originalPrice: wave.originalPrice || foundVariant.price,
                        originalPriceMinor: (wave.originalPrice || foundVariant.price) * 100,
                        wavePrice: wave.wavePrice,
                        wavePriceMinor: wave.wavePrice * 100,
                        auctionType: wave.auctionType || 'Price Wave',
                        auctionTypeSlug: wave.auctionTypeSlug || 'price-wave',
                        badge: wave.badge || '⚡ Active Wave',
                        description: wave.description || '',
                        timerMinutesLeft: wave.timerMinutesLeft || 15,
                        moq: wave.moq || (foundVariant.stock && foundVariant.stock.moq) || 1,
                        specifications: { ...(foundBase.specifications || {}), ...(foundVariant.specifications || {}) }
                    });
                }
            });

            return bazaarLots;
        },

        renderBazaarPage() {
            const $containers = $('#bazaarVariantGalleryRow, #landingAuctionDealsRow');
            if (!$containers.length) return;

            const lots = this.getBazaarVariants();
            if (lots.length === 0) return;

            $containers.each((_, el) => {
                const $container = $(el);
                $container.empty();

                lots.forEach(lot => {
                    const img = this.resolveAssetUrl(lot.image);
                    const discount = (lot.originalPrice > lot.wavePrice) ? Math.round(((lot.originalPrice - lot.wavePrice) / lot.originalPrice) * 100) : 0;

                    $container.append(`
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card h-100 border rounded-4 shadow-sm product-card bg-white position-relative overflow-hidden cursor-pointer bazaar-variant-lot-card" data-variant-id="${lot.variantId}" data-base-id="${lot.baseProductId}">
                                <span class="badge bg-danger position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1 small animate-pulse">
                                    <i class="bi bi-clock-history me-1"></i> Ends in ${lot.timerMinutesLeft}m
                                </span>
                                <div class="p-3 bg-light rounded-top-4 text-center" style="height: 170px; display: flex; align-items: center; justify-content: center;">
                                    <img src="${img}" alt="${lot.variantName || lot.title}" class="img-fluid" style="max-height: 130px; object-fit: contain;">
                                </div>
                                <div class="card-body p-3 d-flex flex-column">
                                    <small class="text-muted text-xs text-uppercase fw-bold">${lot.categoryName || lot.category}</small>
                                    <h6 class="fw-bold text-dark mb-1 text-truncate" title="${lot.title}">${lot.title}</h6>
                                    <div class="d-flex align-items-center justify-content-between small text-muted mb-2">
                                        <span>MOQ: <strong class="text-dark">${lot.moq} ${lot.moq > 1 ? 'units' : 'unit'}</strong></span>
                                        ${discount > 0 ? `<span class="badge bg-success-subtle text-success">Save ${discount}%</span>` : ''}
                                    </div>
                                    <div class="mt-auto">
                                        <div class="bg-light p-2 rounded-3 mb-2 d-flex justify-content-between align-items-baseline">
                                            <span class="text-xs text-muted">Deal Price:</span>
                                            <div>
                                                <span class="fw-extrabold text-danger fs-5">${this.formatNaira(lot.wavePriceMinor, true)}</span>
                                                ${lot.originalPrice > lot.wavePrice ? `<span class="text-decoration-line-through text-muted small ms-1">${this.formatNaira(lot.originalPriceMinor, true)}</span>` : ''}
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-dark w-100 fw-bold rounded-3 btn-inspect-auction" data-variant-id="${lot.variantId}" data-base-id="${lot.baseProductId}">
                                            <i class="bi bi-eye me-1"></i> Inspect Deal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                });
            });

            const self = this;
            $(document).off('click.bazaarInspect', '.btn-inspect-auction, .bazaar-variant-lot-card').on('click.bazaarInspect', '.btn-inspect-auction, .bazaar-variant-lot-card', function (e) {
                e.preventDefault();
                const variantId = $(this).data('variant-id');
                const baseId = $(this).data('base-id');
                self.openAuctionInspectModal(variantId, baseId);
            });
        },

        openAuctionInspectModal(variantId, baseProductId) {
            const lots = this.getBazaarVariants();
            const lot = lots.find(l => l.variantId === variantId) || lots[0];
            if (!lot) return;

            const self = this;
            const img = this.resolveAssetUrl(lot.image);
            const savingsMinor = lot.originalPriceMinor - lot.wavePriceMinor;

            let auctionExplanation = '';
            if (lot.auctionTypeSlug === 'price-wave' || lot.auctionType === 'Price Wave') {
                auctionExplanation = 'Live Price Wave Drop! The price drops periodically and locks upon checkout. Complete payment or claim before the wave ends.';
            } else if (lot.auctionTypeSlug === 'stock-cap' || lot.auctionType === 'Stock Cap') {
                auctionExplanation = 'Collective Stock Cap! Tiered bulk price allocated for this hub batch. Claim your units before the allocation cap fills.';
            } else if (lot.auctionTypeSlug === 'time-cap' || lot.auctionType === 'Time Cap') {
                auctionExplanation = 'Strict Time Cap Flash Deal! Fixed countdown drop with high discount. Locks for immediate payment or cart reserve.';
            } else if (lot.auctionTypeSlug === 'flat-rate' || lot.auctionType === 'Flat-Rate Pool') {
                auctionExplanation = 'Uniform Subsidized Flat-Rate Pool! Standardized wholesale rate funded by hyperlocal community distribution.';
            } else {
                auctionExplanation = 'Competitive Bidding & Deal Claim! Sourced directly from local verified inventory at special deal pricing.';
            }

            let specsRows = '';
            Object.entries(lot.specifications || {}).forEach(([k, val]) => {
                if (k === 'inspectionDiagnostics') return;
                const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                specsRows += `<tr><th class="ps-3 py-2 text-muted small" style="width: 40%;">${label}</th><td class="pe-3 py-2 text-dark small fw-bold">${val}</td></tr>`;
            });

            const modalHtml = `
                <div class="row g-4 align-items-start">
                    <div class="col-md-5 text-center">
                        <div class="p-3 bg-light rounded-4 border text-center mb-3">
                            <img src="${img}" alt="${lot.title}" class="img-fluid" style="max-height: 220px; object-fit: contain;">
                        </div>
                        <span class="badge bg-danger rounded-pill px-3 py-2 mb-2 d-inline-block">
                            <i class="bi bi-lightning-charge-fill me-1"></i> Revealed Auction: <strong>${lot.auctionType}</strong>
                        </span>
                        <div class="text-xs text-muted">Lot Variant SKU: <strong>${lot.variantId}</strong></div>
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-dark">${lot.categoryName || lot.category}</span>
                            <span class="badge bg-warning-subtle text-warning-emphasis"><i class="bi bi-clock me-1"></i>Ends in ${lot.timerMinutesLeft} mins</span>
                        </div>
                        <h4 class="fw-bold text-dark mb-1">${lot.title}</h4>
                        <p class="text-muted small mb-2">${lot.description || 'Verified stock drop sourced directly through local fulfillment.'}</p>

                        <div class="alert alert-danger-subtle border border-danger-subtle p-2 rounded-3 mb-3 small text-danger-emphasis">
                            <i class="bi bi-info-circle-fill me-1"></i> ${auctionExplanation}
                        </div>

                        <div class="p-3 bg-light rounded-3 mb-3 border">
                            <div class="d-flex justify-content-between align-items-baseline">
                                <div>
                                    <span class="text-muted small d-block">Auction Deal Price:</span>
                                    <span class="fs-3 fw-800 text-danger">${self.formatNaira(lot.wavePriceMinor, true)}</span>
                                    ${lot.originalPrice > lot.wavePrice ? `<span class="text-decoration-line-through text-muted small ms-2">${self.formatNaira(lot.originalPriceMinor, true)}</span>` : ''}
                                </div>
                                ${savingsMinor > 0 ? `<span class="badge bg-success-subtle text-success border border-success-subtle p-2">Save ${self.formatNaira(savingsMinor, true)}</span>` : ''}
                            </div>
                            <div class="small text-danger fw-semibold mt-2">
                                <i class="bi bi-exclamation-triangle-fill me-1"></i> MOQ: ${lot.moq} ${lot.moq > 1 ? 'units' : 'unit'} required. Auction terms expire in ${lot.timerMinutesLeft} mins without payment!
                            </div>
                        </div>

                        <div class="table-responsive border rounded-3 mb-3 bg-white">
                            <table class="table table-sm table-striped mb-0">
                                <tbody>
                                    ${specsRows || '<tr><td colspan="2" class="p-2 text-center text-muted small">Standard specifications apply.</td></tr>'}
                                </tbody>
                            </table>
                        </div>

                        <div class="d-flex flex-column flex-sm-row gap-2 mt-3">
                            <button class="btn btn-brand py-2 px-3 fw-bold flex-fill shadow-sm btn-pay-immediately" data-base-id="${lot.baseProductId}" data-variant-id="${lot.variantId}" data-moq="${lot.moq}">
                                <i class="bi bi-credit-card-2-front me-1"></i> Pay Immediately
                            </button>
                            <button class="btn btn-outline-dark py-2 px-3 fw-bold flex-fill btn-add-auction-to-cart" data-base-id="${lot.baseProductId}" data-variant-id="${lot.variantId}" data-moq="${lot.moq}" data-timer="${lot.timerMinutesLeft}">
                                <i class="bi bi-cart-plus me-1"></i> Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;

            if ($('#modal-auction-inspect').length && typeof $('#modal-auction-inspect').iziModal === 'function') {
                $('#auctionInspectModalBody').html(modalHtml);
                $('#modal-auction-inspect').iziModal('open');
            } else if ($('#quickViewModal').length && typeof $('#quickViewModal').iziModal === 'function') {
                $('#quickViewContent').html(modalHtml);
                $('#quickViewModal').iziModal('open');
            } else {
                let modalBody = document.getElementById('quickViewModalBody') || document.querySelector('#modal-quick-view .modal-body');
                if (modalBody) modalBody.innerHTML = modalHtml;
                const modalEl = document.getElementById('modal-quick-view');
                if (modalEl && window.bootstrap) {
                    const modal = window.bootstrap.Modal.getOrCreateInstance ? window.bootstrap.Modal.getOrCreateInstance(modalEl) : new bootstrap.Modal(modalEl);
                    modal.show();
                }
            }
        },

        /* ==========================================================================
           AUCTION SYSTEM (5 TYPES WITH MOQ & DIRECT CART/CHECKOUT INTEGRATION)
           ========================================================================== */
        getAuctions() {
            if (this.data && this.data.auctions) {
                return this.data.auctions;
            }
            return [];
        },

        getAuctionById(auctionId) {
            return this.getAuctions().find(a => a.id === auctionId);
        },

        getAuctionsByType(type) {
            return this.getAuctions().filter(a => a.auctionType === type);
        },

        placeAuctionBid(auctionId, bidAmountMinor) {
            const auction = this.getAuctionById(auctionId);
            if (!auction) return { success: false, message: 'Auction not found' };

            const minAcceptable = (auction.currentBidMinor || auction.basePriceMinor) + (auction.minIncrementMinor || 100000);
            if (bidAmountMinor < minAcceptable) {
                return {
                    success: false,
                    message: `Bid must be at least ${this.formatNaira(minAcceptable, true)}.`
                };
            }

            auction.currentBidMinor = bidAmountMinor;
            auction.bidCount = (auction.bidCount || 0) + 1;
            auction.highestBidder = 'You (Shopper)';

            if (window.iziToast) {
                window.iziToast.success({
                    title: 'Bid Placed!',
                    message: `Your bid of ${this.formatNaira(bidAmountMinor, true)} is now leading. MOQ: ${auction.moq} units upon win.`,
                    position: 'topRight'
                });
            }
            return { success: true, auction };
        },

        buyAuctionItem(auctionId, requestedQty) {
            const auction = this.getAuctionById(auctionId);
            if (!auction) return;

            const moq = auction.moq || 1;
            const qty = Math.max(moq, requestedQty || moq);

            if (requestedQty < moq) {
                if (window.iziToast) {
                    window.iziToast.warning({
                        title: 'MOQ Required',
                        message: `Minimum Order Quantity for this auction is ${moq} units. Adjusted to ${moq}.`
                    });
                }
            }

            // Determine unit price based on auction format
            let unitPriceMinor = 0;
            if (auction.auctionType === 'flat_rate') unitPriceMinor = auction.flatRatePriceMinor;
            else if (auction.auctionType === 'price_wave') unitPriceMinor = auction.currentWavePriceMinor;
            else if (auction.auctionType === 'stock_cap') unitPriceMinor = auction.unitCapPriceMinor;
            else if (auction.auctionType === 'time_cap') unitPriceMinor = auction.blitzPriceMinor;
            else unitPriceMinor = auction.currentBidMinor || auction.basePriceMinor;

            // Prepare cart item
            const cartItem = {
                id: `cart_${auction.id}`,
                productId: auction.productId || auction.id,
                title: `[${auction.typeName}] ${auction.title}`,
                priceMinor: unitPriceMinor,
                qty: qty,
                moq: moq,
                unitLabel: 'unit',
                auctionId: auction.id,
                auctionType: auction.auctionType,
                image: auction.image
            };

            // Add or update in cart
            const existingIdx = this.cart.findIndex(i => i.auctionId === auction.id);
            if (existingIdx >= 0) {
                this.cart[existingIdx].qty = Math.max(moq, this.cart[existingIdx].qty + qty);
            } else {
                this.cart.push(cartItem);
            }

            this.saveLocalState();
            this.syncCartUI();

            if (window.iziToast) {
                window.iziToast.success({
                    title: 'Auction Added to Cart',
                    message: `${qty}x units reserved (MOQ: ${moq}). Proceeding to server validation...`,
                    position: 'topRight'
                });
            }

            // Open validate modal right away
            this.openCheckoutValidateModal();
        },

        /* ==========================================================================
           STOREFRONT ADMIN RECONCILIATION & ORDER MANAGEMENT
           ========================================================================== */
        getPendingReconciliations() {
            return this.reconciliations || [];
        },

        reconcilePayment(reportId, action = 'approve', notes = '') {
            const report = (this.reconciliations || []).find(r => r.reportId === reportId);
            if (!report) return { success: false, message: 'Report not found' };

            report.reconciledAt = new Date().toISOString();
            report.adminNotes = notes;

            if (action === 'approve') {
                report.status = 'reconciled_approved';

                // Check report purpose:
                const pendingOrder = (this.pendingOrders || []).find(o => o.orderId === report.orderId);
                const purpose = (pendingOrder && pendingOrder.purpose) || 'order_direct';

                if (purpose === 'wallet_topup') {
                    // Credit user's wallet
                    const currentWallet = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.getWalletValue()) || 25000;
                    const creditedNaira = (report.amountPaidMinor || 0) / 100;
                    const newWallet = currentWallet + creditedNaira;
                    localStorage.setItem('uwanbuy_wallet_balance', String(newWallet));
                    if (window.AreaBazaarStorefront) window.AreaBazaarStorefront.refresh();

                    if (pendingOrder) {
                        pendingOrder.status = 'wallet_funded';
                    }
                } else {
                    // Direct order: Confirm order directly without touching wallet
                    if (pendingOrder) {
                        pendingOrder.status = 'paid_and_confirmed';
                        pendingOrder.deliveryPasscode = Math.floor(1000 + Math.random() * 9000);
                        pendingOrder.paidAt = new Date().toISOString();
                    }
                }
            } else {
                report.status = 'reconciled_rejected';
                const pendingOrder = (this.pendingOrders || []).find(o => o.orderId === report.orderId);
                if (pendingOrder) pendingOrder.status = 'payment_rejected';
            }

            this.saveLocalState();
            this.syncCartUI();
            return { success: true, report };
        },
        /* ==========================================================================
           WALLET TOP-UP & 15-MINUTE BULK DELIVERY TRACKING ENGINE
           ========================================================================== */
        openFundWalletModal() {
            const currentWallet = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.getWalletValue()) || 25000;
            $('#fundWalletCurrentBalanceDisplay').text(this.formatNaira(currentWallet * 100, true));
            const modalEl = document.getElementById('modal-fund-wallet');
            if (modalEl && window.bootstrap) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        },

        openRequestTrackingModal(orderId) {
            this.currentTrackingOrderId = orderId;
            $('#trackingReqOrderIdDisplay').text(orderId);
            const user = (window.AreaBazaarStorefront && window.AreaBazaarStorefront.getUser()) || {};
            if (user.email) $('#trackingCustomerEmail').val(user.email);
            if (user.phone) $('#trackingCustomerPhone').val(user.phone);

            const modalEl = document.getElementById('modal-request-tracking');
            if (modalEl && window.bootstrap) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        },

        submitTrackingRequest() {
            const email = $('#trackingCustomerEmail').val().trim();
            const phone = $('#trackingCustomerPhone').val().trim();
            if (!email || !email.includes('@')) {
                if (window.iziToast) window.iziToast.warning({ title: 'Valid Email Required', message: 'Enter a valid email address to receive tracking updates.' });
                return;
            }

            const trackingQueue = JSON.parse(localStorage.getItem('uwanbuy_tracking_requests') || '[]');
            const existingIdx = trackingQueue.findIndex(r => r.orderId === this.currentTrackingOrderId && r.status === 'queued');

            const reqRecord = {
                requestId: 'TRK-REQ-' + Date.now(),
                orderId: this.currentTrackingOrderId,
                customerEmail: email,
                customerPhone: phone,
                status: 'queued',
                requestedAt: new Date().toISOString(),
                batchIntervalMinutes: 15
            };

            if (existingIdx >= 0) {
                trackingQueue[existingIdx] = reqRecord;
            } else {
                trackingQueue.push(reqRecord);
            }

            localStorage.setItem('uwanbuy_tracking_requests', JSON.stringify(trackingQueue));

            $('#modal-request-tracking').modal('hide');

            if (window.iziToast) {
                window.iziToast.success({
                    title: 'Tracking Request Queued',
                    message: `Tracking for ${this.currentTrackingOrderId} queued. Next 15-min bulk batch will dispatch and email details to ${email}.`,
                    timeout: 7000
                });
            }

            this.renderBoughtOrders();
        },

        startTrackingBatchScheduler() {
            // Ensure next batch timestamp exists
            let nextBatch = parseInt(localStorage.getItem('uwanbuy_next_tracking_batch_time'), 10);
            if (!nextBatch || isNaN(nextBatch) || nextBatch < Date.now()) {
                nextBatch = Date.now() + 15 * 60 * 1000;
                localStorage.setItem('uwanbuy_next_tracking_batch_time', String(nextBatch));
            }

            // Check every 10 seconds if 15 mins elapsed
            setInterval(() => {
                const scheduledTime = parseInt(localStorage.getItem('uwanbuy_next_tracking_batch_time'), 10) || (Date.now() + 15 * 60 * 1000);
                if (Date.now() >= scheduledTime) {
                    this.processTrackingBulkDispatch(false);
                }
            }, 10000);
        },

        processTrackingBulkDispatch(isManual = false) {
            const trackingQueue = JSON.parse(localStorage.getItem('uwanbuy_tracking_requests') || '[]');
            const queuedRequests = trackingQueue.filter(r => r.status === 'queued');

            // Reset next batch time to 15 mins from now
            const nextBatch = Date.now() + 15 * 60 * 1000;
            localStorage.setItem('uwanbuy_next_tracking_batch_time', String(nextBatch));

            if (queuedRequests.length === 0) {
                if (isManual && window.iziToast) {
                    window.iziToast.info({
                        title: '15-Min Batch Dispatch',
                        message: 'Batch ran. No queued tracking requests pending dispatch at this time.'
                    });
                }
                return;
            }

            // Mark queued requests as dispatched and notify
            queuedRequests.forEach(req => {
                req.status = 'dispatched_email_sent';
                req.dispatchedAt = new Date().toISOString();
                req.riderName = 'Musa Garba';
                req.riderPhone = '+234 802 345 6789';

                // Update order in pendingOrders
                const order = (this.pendingOrders || []).find(o => o.orderId === req.orderId);
                if (order) {
                    order.status = 'in_transit';
                    order.riderName = 'Musa Garba';
                    order.riderPhone = '+234 802 345 6789';
                    order.trackingDispatchedAt = req.dispatchedAt;
                }
            });

            localStorage.setItem('uwanbuy_tracking_requests', JSON.stringify(trackingQueue));
            this.saveLocalState();
            this.renderBoughtOrders();

            // Pop simulated email modal for first request in batch
            const sampleReq = queuedRequests[0];
            $('#emailPreviewTo').text(sampleReq.customerEmail);
            $('#emailPreviewSubject').text(`🚚 Order #${sampleReq.orderId} dispatched from Tanke Hub!`);

            const modalEl = document.getElementById('modal-tracking-email-preview');
            if (modalEl && window.bootstrap) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }

            if (window.iziToast) {
                window.iziToast.success({
                    title: '15-Min Bulk Dispatch Processed',
                    message: `Dispatched ${queuedRequests.length} tracking requests. Automated email notifications sent to customers!`,
                    timeout: 8000
                });
            }
        },

        renderBoughtOrders() {
            const $container = $('#boughtItemsContainer');
            if (!$container.length) return;

            const trackingQueue = JSON.parse(localStorage.getItem('uwanbuy_tracking_requests') || '[]');
            const confirmedOrders = (this.pendingOrders || []).filter(o => 
                o.status === 'paid_and_confirmed' || o.status === 'in_transit' || o.status === 'delivered'
            );

            if (confirmedOrders.length === 0) {
                $container.html(`
                    <div class="text-center text-muted mt-5" id="emptyBoughtState">
                        <i class="bi bi-receipt fs-1 text-secondary"></i>
                        <h6 class="mt-2 fw-bold">No past purchases found</h6>
                        <p class="small">Completed orders and deliveries will appear here.</p>
                    </div>
                `);
                return;
            }

            $container.empty();
            confirmedOrders.forEach(o => {
                const req = trackingQueue.find(r => r.orderId === o.orderId);
                const isDispatched = (o.status === 'in_transit' || (req && req.status === 'dispatched_email_sent'));
                const isQueued = (req && req.status === 'queued');

                let trackingHtml = '';
                if (isDispatched) {
                    trackingHtml = `
                        <div class="mt-2 pt-2 border-top">
                            <span class="badge bg-success text-white mb-1"><i class="bi bi-truck me-1"></i> In Transit (Rider Assigned)</span>
                            <div class="small text-muted">Rider: <strong>Musa Garba</strong> (0802-345-6789)</div>
                            <div class="small text-success fw-bold mt-1">📧 Tracking update sent via 15-min bulk email</div>
                        </div>
                    `;
                } else if (isQueued) {
                    trackingHtml = `
                        <div class="mt-2 pt-2 border-top">
                            <span class="badge bg-warning text-dark"><i class="bi bi-clock-history me-1"></i> Tracking Queued (15-min Batch)</span>
                            <div class="small text-muted mt-1">Dispatches in the next 15-min bulk cycle to ${req.customerEmail}.</div>
                        </div>
                    `;
                } else {
                    trackingHtml = `
                        <div class="mt-2 pt-2 border-top">
                            <button class="btn btn-sm btn-danger w-100 py-1 fw-bold btn-request-tracking" data-order-id="${o.orderId}">
                                <i class="bi bi-cursor-fill me-1"></i> Track Delivery / Request Update
                            </button>
                        </div>
                    `;
                }

                $container.append(`
                    <div class="card border rounded-3 p-3 mb-3 shadow-sm bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge-order-id text-xs">${o.orderId}</span>
                            <span class="badge bg-success-subtle text-success fw-bold">Paid & Confirmed</span>
                        </div>
                        <div class="d-flex justify-content-between small text-muted mb-2">
                            <span>Amount: <strong class="text-dark">${this.formatNaira(o.totalMinor, true)}</strong></span>
                            <span>Passcode: <strong class="text-danger fw-bold fs-6 font-monospace">${o.deliveryPasscode || '4892'}</strong></span>
                        </div>
                        <div class="small text-secondary mb-2">
                            ${(o.items || []).map(it => `${it.title || it.name} (${it.quantity || it.qty || 1}x)`).join(', ') || 'Grocery & Lifestyle essentials'}
                        </div>
                        ${trackingHtml}
                    </div>
                `);
            });
        },
    };

    window.UwanBuyEngine = UwanBuyEngine;

    $(document).ready(function () {
        UwanBuyEngine.init();
    });
})(window, window.jQuery);
