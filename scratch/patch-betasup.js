const fs = require('fs');

let html = fs.readFileSync('betasup/index.html', 'utf8');

// 1. Fix search input
html = html.replace(
  '<input type="text" id="soup-search-input" class="form-control border-start-0 ps-0"',
  '<input type="text" id="soup-search-input" name="soup_query" autocomplete="off" spellcheck="false" value="" class="form-control border-start-0 ps-0"'
);

// 2. Build the script replacement
const targetPart = `            // Nav Triggers
            $('#btn-login-trigger').on('click', () => $('#modal-login').iziModal('open'));
            $('#btn-register-trigger').on('click', () => $('#modal-register').iziModal('open'));
            $('#btn-hero-auction').on('click', () => {
                $('html, body').animate({ scrollTop: $('#auctionArenaSection').offset().top - 80 }, 400);
            });
            // Order / Bid Now trigger inside Variant Modal
            
    </script>`;

const newScript = `            // Nav Triggers
            $('#btn-login-trigger').on('click', () => $('#modal-login').iziModal('open'));
            $('#btn-register-trigger').on('click', () => $('#modal-register').iziModal('open'));
            $('#btn-hero-auction').on('click', () => {
                $('html, body').animate({ scrollTop: $('#auctionArenaSection').offset().top - 80 }, 400);
            });

            // Reset search input value on page load
            $('#soup-search-input').val('');

            // 4 BETASUP AUCTION ARENAS INTERACTION
            // 1. Fastest Finger Claim
            let betaFFRemaining = 2;
            $('.btn-claim-beta-ff').on('click', function (e) {
                e.preventDefault();
                if (betaFFRemaining <= 0) {
                    UIController.notify('Flash pot sold out!', 'error');
                    return;
                }
                betaFFRemaining--;
                $('#betaFFStock').text(betaFFRemaining);

                if (window.AreaBazaarStorefront && window.AreaBazaarStorefront.StorefrontCheckout) {
                    window.AreaBazaarStorefront.StorefrontCheckout.addToCart({
                        productId: 'auc_pot_ff_banga_2l',
                        title: '2L Delta Banga Soup Pot (Fastest Finger Flash Drop)',
                        price: 3800,
                        priceMinor: 380000,
                        quantity: 1,
                        image: '../assetsecm/images/soups/variants/stand-mini-var-banga-pot.png',
                        category: 'auction',
                        isAuction: true,
                        auctionExpiresAt: Date.now() + 15 * 60 * 1000,
                        store: 'betasup'
                    }, false, false);
                    window.AreaBazaarStorefront.StorefrontCheckout.openCheckoutValidateModal(true);
                }
                UIController.notify('⚡ 2L Banga Pot claimed at ₦3,800 flash price!', 'success');
                if (betaFFRemaining === 0) {
                    $(this).prop('disabled', true).text('Claimed / Sold Out');
                }
            });

            // 2. Timebound Feast Lock
            $('.btn-claim-beta-tb').on('click', function (e) {
                e.preventDefault();
                if (window.AreaBazaarStorefront && window.AreaBazaarStorefront.StorefrontCheckout) {
                    window.AreaBazaarStorefront.StorefrontCheckout.addToCart({
                        productId: 'auc_pot_tb_party_10l',
                        title: '10L Mega Party Cooler Package (Timebound Feast Deal)',
                        price: 35000,
                        priceMinor: 3500000,
                        quantity: 1,
                        image: '../assetsecm/images/soups/variants/mega-cooler-stew-pot.png',
                        category: 'auction',
                        isAuction: true,
                        auctionExpiresAt: Date.now() + 25 * 60 * 1000,
                        store: 'betasup'
                    }, false, false);
                    window.AreaBazaarStorefront.StorefrontCheckout.openCheckoutValidateModal(true);
                }
                UIController.notify('⏳ 10L Party Cooler reserved at ₦35,000 deal price! Kitchen preparing your feast.', 'success');
            });

            // 3. Real Bidding Submission
            let betaCurrentHigh = 65000;
            let betaBidClockSec = 330; // 05:30

            $('.btn-submit-beta-bid').on('click', function (e) {
                e.preventDefault();
                const bidVal = parseFloat($('#inputBetaBidAmount').val());
                const minNext = betaCurrentHigh + 5000;

                if (isNaN(bidVal) || bidVal < minNext) {
                    return UIController.notify(\`Minimum next bid must be at least ₦\${minNext.toLocaleString()}\`, 'error');
                }

                betaCurrentHigh = bidVal;
                $('#betaCurrentHighBid').text(\`₦\${betaCurrentHigh.toLocaleString()}\`);
                $('#betaMinNextBid').text(\`₦\${(betaCurrentHigh + 5000).toLocaleString()}\`);
                $('#betaBidSnippet').html(\`Latest: <span class="fw-bold">₦\${betaCurrentHigh.toLocaleString()}</span> by <em>You (Top Bidder)</em> (Just now)\`);
                $('#inputBetaBidAmount').val(betaCurrentHigh + 5000);

                if (betaBidClockSec < 60) {
                    betaBidClockSec += 120;
                    UIController.notify('Anti-Sniping Clock Extended (+2 mins)', 'info');
                }

                UIController.notify(\`🔨 High bid of ₦\${betaCurrentHigh.toLocaleString()} placed for 25L Royal Feast!\`, 'success');
            });

            // 4. Price Waves Spot Buy
            $('.btn-claim-beta-wave').on('click', function (e) {
                e.preventDefault();
                if (window.AreaBazaarStorefront && window.AreaBazaarStorefront.StorefrontCheckout) {
                    window.AreaBazaarStorefront.StorefrontCheckout.addToCart({
                        productId: 'auc_pot_wave_fisherman_5l',
                        title: '5L Fisherman Soup Pot (Wave 2 Spot Buy)',
                        price: 18500,
                        priceMinor: 1850000,
                        quantity: 1,
                        image: '../assetsecm/images/soups/variants/special-fisherman-soup-5l.png',
                        category: 'auction',
                        isAuction: true,
                        auctionExpiresAt: Date.now() + 20 * 60 * 1000,
                        store: 'betasup'
                    }, false, false);
                    window.AreaBazaarStorefront.StorefrontCheckout.openCheckoutValidateModal(true);
                }
                UIController.notify('🌊 Wave 2 Spot Secured for 5L Fisherman Soup Pot!', 'success');
            });

            // Countdown Timers
            setInterval(() => {
                if (betaBidClockSec > 0) {
                    betaBidClockSec--;
                    const m = Math.floor(betaBidClockSec / 60).toString().padStart(2, '0');
                    const s = (betaBidClockSec % 60).toString().padStart(2, '0');
                    $('#betaBidClock').text(\`00:\${m}:\${s}\`);
                }
            }, 1000);

            // Registration Form Submit
            $('#form-register').on('submit', function (e) {
                e.preventDefault();
                const fullName = $('#reg-fullname').val().trim();
                const phone = $('#reg-phone').val().trim();
                const email = $('#reg-email').val().trim();
                const password = $('#reg-password').val();
                const pin = $('#reg-pin').val();
                const addressLine1 = $('#reg-address1').val().trim();
                const addressLine2 = $('#reg-address2').val().trim();
                const landmark = $('#reg-landmark').val().trim();
                const city = $('#reg-city').val().trim();
                const state = $('#reg-state').val().trim();
                const instructions = $('#reg-instructions').val().trim();
                const hub = $('#reg-hub').val();
                const agentCode = $('#reg-agent-code').val().trim();

                if (!fullName || !phone || !password || !addressLine1 || !landmark) {
                    return UIController.notify('Please fill all required personal and address fields.', 'error');
                }

                if (window.AreaBazaarStorefront) {
                    window.AreaBazaarStorefront.register({
                        fullName, phone, email, addressLine1, addressLine2, landmark, city, state, instructions, hub, pin, agentCode
                    });
                }
                currentUser = AreaBazaarStorefront.getUser('betasup');
                updateUserUI();
                $('#modal-register').iziModal('close');
                this.reset();
                UIController.notify(\`Welcome \${fullName}! ₦15,000 Kitchen Wallet Credit Activated!\`, 'success');
            });

            // Login Form Submit
            $('#form-login').on('submit', function (e) {
                e.preventDefault();
                const phone = $('#login-phone').val().trim();
                const pw = $('#login-password').val();
                if (window.AreaBazaarStorefront) {
                    window.AreaBazaarStorefront.login(phone, pw);
                }
                currentUser = AreaBazaarStorefront.getUser('betasup');
                updateUserUI();
                $('#modal-login').iziModal('close');
                UIController.notify('Signed in successfully!', 'success');
            });

            // Delivery Passcode Acknowledgment Click Handler
            $(document).on('click', '.ack-delivery-btn', function () {
                const orderId = $(this).data('id');
                const passcode = prompt("Enter 6-digit Delivery Passcode received from driver:");
                if (!passcode) return;

                let orders = JSON.parse(localStorage.getItem('ab_orders') || '[]');
                const target = orders.find(o => o.id === orderId);
                if (target) {
                    target.status = 'Delivered';
                    localStorage.setItem('ab_orders', JSON.stringify(orders));
                    UIController.notify('Delivery Confirmed & Partner Commissions Released!', 'success');
                }
            });
        });

        // Gallery Renderer
        function renderSoupGallery(data) {
            const grid = $('#soup-pot-grid');
            if (!data || !data.length) {
                grid.html('<div class="col-12 text-center py-5"><p class="text-muted fs-5">No soup pots found matching your query.</p></div>');
                return;
            }

            let html = '';
            data.forEach(item => {
                html += \`
                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="pot-card" data-id="\${item.id}">
                            <div class="pot-img-box">
                                <span class="category-tag">\${item.categoryLabel}</span>
                                <img src="\${item.image}" alt="\${item.name}">
                            </div>
                            <div class="pot-body">
                                <h3 class="pot-title">\${item.name}</h3>
                                <div class="pot-tagline"><i class="fa fa-fire-flame-curved me-1"></i>\${item.tagline}</div>
                                <p class="pot-desc">\${item.description}</p>
                                <div class="pot-footer">
                                    <div>
                                        <span class="price-label">Starting From</span>
                                        <span class="price-amount">₦\${item.basePrice.toLocaleString()}</span>
                                    </div>
                                    <button class="btn btn-view-variants">
                                        Select Size <i class="fa fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            });
            grid.html(html);
        }

        // Open Variant Selection iziModal
        function openVariantModal(productId) {
            selectedProduct = soupPotsData.find(p => String(p.id) === String(productId));
            if (!selectedProduct) return;

            currentVariantIndex = 0;
            currentQuantity = 1;
            selectedSwallowPrice = 0;
            selectedSwallowName = '';

            renderVariantModalContent();
            $('#modal-product-variants').iziModal('open');
        }

        function renderVariantModalContent() {
            const currentVariant = selectedProduct.variants[currentVariantIndex];
            const displayImage = currentVariant.image || selectedProduct.image;

            let variantsButtonsHtml = '';
            selectedProduct.variants.forEach((v, idx) => {
                const activeClass = idx === currentVariantIndex ? 'active' : '';
                variantsButtonsHtml += \`
                    <div class="variant-selector-btn \${activeClass}" onclick="selectVariantIndex(\${idx})">
                        <span class="var-size">\${v.size}</span>
                        <span class="var-price">₦\${v.price.toLocaleString()}</span>
                    </div>
                \`;
            });

            let swallowsHtml = '';
            if (selectedProduct.swallows && selectedProduct.swallows.length) {
                selectedProduct.swallows.forEach((s, idx) => {
                    const checked = idx === 0 ? 'checked' : '';
                    swallowsHtml += \`
                        <div class="form-check mb-2">
                            <input class="form-check-input swallow-radio" type="radio" name="swallowOption" id="swallow-\${idx}" value="\${s.price}" data-name="\${s.name}" \${checked} onchange="updateSwallowSelection(\${s.price}, '\${s.name}')">
                            <label class="form-check-label d-flex justify-content-between small text-dark" for="swallow-\${idx}">
                                <span>\${s.name}</span>
                                <span class="fw-bold">\${s.price > 0 ? '+₦' + s.price.toLocaleString() : 'FREE'}</span>
                            </label>
                        </div>
                    \`;
                });
            }

            const html = \`
                <div class="row g-4 align-items-center">
                    <div class="col-md-5 text-center">
                        <div class="p-3 bg-light rounded-4 border">
                            <img src="\${displayImage}" alt="\${selectedProduct.name}" class="img-fluid" id="variant-preview-img" style="max-height: 220px; object-fit: contain;">
                        </div>
                        <div class="mt-3 text-start">
                            <span class="badge bg-amber-subtle text-warning fw-bold px-3 py-1 rounded-pill mb-1" style="background:#fff7ed; color:var(--primary-amber);"><i class="fa fa-star text-warning me-1"></i> \${selectedProduct.rating} Rating</span>
                            <h5 class="fw-bold text-dark mb-1 mt-2">\${selectedProduct.name}</h5>
                            <p class="small text-muted mb-0">\${selectedProduct.description}</p>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <h6 class="fw-bold text-dark mb-2">1. Select Pot Size Variant</h6>
                        <div class="d-flex gap-2 mb-4 flex-wrap">
                            \${variantsButtonsHtml}
                        </div>

                        <h6 class="fw-bold text-dark mb-2">2. Optional Swallow Pair</h6>
                        <div class="bg-light p-3 rounded-3 border mb-4">
                            \${swallowsHtml}
                        </div>

                        <h6 class="fw-bold text-dark mb-2">3. Quantity & Total</h6>
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="d-flex align-items-center gap-2">
                                <button class="qty-btn" onclick="changeQty(-1)">-</button>
                                <input type="text" id="modal-qty-input" class="form-control text-center fw-bold" value="\${currentQuantity}" readonly style="width: 50px;">
                                <button class="qty-btn" onclick="changeQty(1)">+</button>
                            </div>
                            <div class="text-end">
                                <small class="text-muted d-block small">Subtotal Price</small>
                                <span class="h3 fw-800 text-amber mb-0" id="variant-modal-total" style="color: var(--primary-amber);">₦\${calculateCurrentItemTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-outline-warning fw-bold py-3 px-3 rounded-3 btn-soup-add-to-cart flex-fill" style="color: #ea580c; border: 2px solid #ea580c; background: #fff7ed;">
                                <i class="fa fa-cart-plus me-1"></i> Add To Cart
                            </button>
                            <button type="button" class="btn btn-amber fw-bold py-3 px-3 rounded-3 btn-soup-pay-immediately flex-fill shadow-sm text-white">
                                <i class="fa fa-bolt me-1"></i> Checkout Now
                            </button>
                            <a href="product-details.html?id=\${selectedProduct.id}" class="btn btn-dark fw-bold py-3 px-3 rounded-3 text-nowrap d-flex align-items-center">
                                Details <i class="fa fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            \`;

            $('#variant-modal-body').html(html);
        }

        function selectVariantIndex(idx) {
            currentVariantIndex = idx;
            renderVariantModalContent();
        }

        function updateSwallowSelection(price, name) {
            selectedSwallowPrice = price;
            selectedSwallowName = name;
            $('#variant-modal-total').text('₦' + calculateCurrentItemTotal().toLocaleString());
        }

        function changeQty(delta) {
            currentQuantity = Math.max(1, currentQuantity + delta);
            $('#modal-qty-input').val(currentQuantity);
            $('#variant-modal-total').text('₦' + calculateCurrentItemTotal().toLocaleString());
        }

        function calculateCurrentItemTotal() {
            if (!selectedProduct) return 0;
            const base = selectedProduct.variants[currentVariantIndex].price;
            return (base + selectedSwallowPrice) * currentQuantity;
        }

        function updateUserUI() {
            if (currentUser) {
                window.walletBalance = currentUser.wallet || 0;
                $('#wallet-balance-display, #modal-wallet-balance-text').text('₦' + (currentUser.wallet || 0).toLocaleString());
                $('#auth-btn-wrapper').html(\`
                    <button class="btn btn-dark btn-sm rounded-pill px-3 fw-600 me-1" id="nav-profile-btn">
                        <i class="fa fa-user-circle me-1"></i> \${currentUser.name.split(' ')[0]}
                    </button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill" onclick="logoutUser()">Logout</button>
                \`);
            } else {
                window.walletBalance = 0;
                $('#wallet-balance-display, #modal-wallet-balance-text').text('₦0.00');
                $('#auth-btn-wrapper').html(\`
                    <button id="btn-login-trigger" class="btn btn-dark rounded-pill px-4 fw-600 btn-sm me-1" onclick="$('#modal-login').iziModal('open')">Login</button>
                    <button id="btn-register-trigger" class="btn btn-amber btn-sm rounded-pill px-4" onclick="$('#modal-register').iziModal('open')">Register</button>
                \`);
            }
        }

        function logoutUser() {
            if (window.AreaBazaarStorefront) {
                window.AreaBazaarStorefront.logout('betasup');
            }
            currentUser = null;
            window.walletBalance = 0;
            updateUserUI();
            if (window.AreaBazaarStorefront) {
                window.AreaBazaarStorefront.refresh();
            }
            UIController.notify('Logged out successfully', 'info');
        }
    </script>`;

// Normalize CRLF
const targetNormalized = targetPart.replace(/\r\n/g, '\n');
const htmlNormalized = html.replace(/\r\n/g, '\n');

if (htmlNormalized.includes(targetNormalized)) {
    const updated = htmlNormalized.replace(targetNormalized, newScript.replace(/\r\n/g, '\n'));
    fs.writeFileSync('betasup/index.html', updated, 'utf8');
    console.log('Successfully patched betasup/index.html!');
} else {
    console.log('Target part not found in betasup/index.html');
}

