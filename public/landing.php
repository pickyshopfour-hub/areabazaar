<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AreaBazaar | Nigeria's Hyperlocal Auction Platform</title>
    
    <!-- External Dependencies -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.6.1/css/iziModal.min.css">
    
    <!-- Internal Styles -->
    <link rel="stylesheet" href="../assets/css/style.css?v=1772656066.00796">
    
    <style>
        .hero-section {
            padding: 100px 0;
            background: radial-gradient(circle at top right, #f8fafc, #eff6ff);
            border-bottom: 1px solid #e2e8f0;
        }
        .auction-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .auction-card:hover {
            transform: translateY(-10px);
            border-color: #3b82f6;
        }
        .wave-badge {
            background: #ef4444;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        .navbar-light-custom {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e2e8f0;
        }
        .navbar-brand {
            font-size: 1.5rem;
            letter-spacing: -0.5px;
        }
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light navbar-light-custom sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold text-primary" href="#">AREABAZAAR</a>
            <div class="d-flex align-items-center">
                <a href="javascript:void(0)" id="nav-cart" class="me-3 text-muted text-decoration-none fw-600">
                    <i class="fa fa-shopping-cart me-1"></i> Cart
                </a>
                <a href="javascript:void(0)" id="nav-wallet" class="me-3 text-muted text-decoration-none fw-600">
                    <i class="fa fa-wallet me-1"></i> ₦0.00
                </a>
                <button id="btn-login-trigger" class="btn btn-premium btn-sm rounded-pill px-4 shadow-sm">Login</button>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="hero-section text-center">
        <div class="container">
            <h1 class="display-3 fw-bold mb-3 text-dark">Hyperlocal Auctions,<br><span class="text-primary">Global Standards.</span></h1>
            <p class="lead text-muted mb-5 px-md-5">Get premium products at unbeatable prices through our area-restricted auction waves. Fast, secure, and community-driven.</p>
            <div class="d-flex justify-content-center gap-3">
                <button id="btn-join-trigger" class="btn btn-premium btn-lg px-5 shadow-md">Join the Wave</button>
                <button class="btn btn-outline-premium btn-lg px-5">How it Works</button>
            </div>
        </div>
    </section>

    <!-- Active Auctions -->
    <section class="py-5 bg-white">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold text-dark">Active Auctions</h3>
                <span class="badge wave-badge px-3 py-2 rounded-pill">LIVE WAVE</span>
            </div>
            <div class="row g-4" id="auction-container">
                <!-- Example Auction Item -->
                <div class="col-md-4">
                    <div class="glass-card auction-card h-100" data-id="1">
                        <div class="position-relative mb-3">
                            <div class="bg-light rounded" style="height: 200px; border: 1px solid #f1f5f9;"></div>
                            <span class="badge bg-primary position-absolute top-0 end-0 m-2">Food & Grocery</span>
                        </div>
                        <h5 class="fw-bold text-dark">Premium Nigerian Basmati Rice (50kg)</h5>
                        
                        <!-- Quantity Selector in Card -->
                        <div class="d-flex align-items-center mb-3 mt-3">
                            <small class="text-muted me-2 fw-bold">Quantity:</small>
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn qty-btn btn-minus">-</button>
                                <input type="text" class="form-control qty-input" value="1" readonly>
                                <button class="btn qty-btn btn-plus">+</button>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-end mt-4 pt-3 border-top">
                            <div>
                                <small class="text-muted d-block fw-600">Current Price</small>
                                <span class="h4 text-primary fw-bold">₦24,500</span>
                            </div>
                            <button class="btn btn-premium btn-sm px-4 btn-bid shadow-sm" data-id="1">Bid Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Modal Placeholders -->
    <div id="modal-login">
        <div class="p-4">
            <form id="form-login">
                <div class="mb-3">
                    <label class="form-label d-block">Phone Number</label>
                    <input type="text" class="form-control" placeholder="e.g. 08012345678" required>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">Password</label>
                    <input type="password" class="form-control" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-premium w-100 py-3 mt-2 shadow-sm">Sign In</button>
            </form>
        </div>
    </div>

    <div id="modal-register">
        <div class="p-4">
            <form id="form-register">
                <div class="mb-3">
                    <label class="form-label d-block">Full Name</label>
                    <input type="text" class="form-control" placeholder="John Doe" required>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">Phone Number</label>
                    <input type="text" class="form-control" placeholder="080XXXXXXXX" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label d-block">Password</label>
                        <input type="password" class="form-control" placeholder="Create Password" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label d-block">Wallet PIN (4-digits)</label>
                        <input type="password" maxlength="4" class="form-control" placeholder="1234" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">FRM Reference Code (Optional)</label>
                    <input type="text" class="form-control" placeholder="Enter Agent Code">
                </div>
                <button type="submit" class="btn btn-premium w-100 py-3 mt-2 shadow-sm">Create Account</button>
            </form>
        </div>
    </div>

    <div id="modal-cart">
        <div class="p-4">
            <ul class="nav nav-tabs mb-4 border-0 bg-light rounded-pill p-1" id="cartTabs" role="tablist">
                <li class="nav-item w-50">
                    <button class="nav-link active w-100 rounded-pill border-0 py-2 fw-bold" data-bs-toggle="tab" data-bs-target="#tab-active-cart">Active Cart</button>
                </li>
                <li class="nav-item w-50">
                    <button class="nav-link w-100 rounded-pill border-0 py-2 fw-bold" data-bs-toggle="tab" data-bs-target="#tab-order-history">Order History</button>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="tab-active-cart">
                    <div class="notice-text mb-4">
                        <i class="fa fa-info-circle me-1"></i> A purchase is only confirmed once paid for. The Price at the time of payment confirmation is what will apply.
                    </div>
                    <div id="cart-items" class="mb-4">
                        <p class="text-muted text-center py-5">Your cart is empty.</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center border-top pt-4">
                        <h5 class="fw-bold m-0 text-dark">Total: <span class="text-primary">₦0.00</span></h5>
                        <button class="btn btn-premium px-4 shadow-sm" id="btn-cart-checkout" disabled>Checkout</button>
                    </div>
                </div>
                <div class="tab-pane fade" id="tab-order-history">
                    <div id="order-history-list">
                        <p class="text-muted text-center py-5">No recent orders found.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="modal-product-details">
        <div class="p-4">
            <div class="bg-light rounded mb-4" style="height: 250px; border: 1px solid #f1f5f9;"></div>
            <h4 class="fw-bold text-dark mb-1">Premium Nigerian Basmati Rice</h4>
            <span class="badge bg-primary mb-3 rounded-pill px-3">Food & Grocery</span>
            <p class="text-muted mb-4">High-quality locally sourced parboiled rice. Stone-free and perfectly aged for the best taste in every pot.</p>
            
            <div class="glass-card mb-4 bg-light border-0 shadow-sm">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <small class="text-muted d-block mb-1">Current Wave Price</small>
                        <span class="h3 text-primary fw-bold">₦24,500</span>
                    </div>
                    <div class="text-end">
                        <small class="text-muted d-block mb-1">Stock Available</small>
                        <span class="h5 fw-bold text-dark">128 Units</span>
                    </div>
                </div>
            </div>

            <!-- Quantity Selector -->
            <div class="d-flex align-items-center mb-4">
                <span class="text-dark fw-bold me-3">Quantity:</span>
                <div class="input-group" style="width: 150px;">
                    <button class="btn qty-btn btn-minus">-</button>
                    <input type="text" class="form-control qty-input py-2" value="1" readonly>
                    <button class="btn qty-btn btn-plus">+</button>
                </div>
            </div>

            <button class="btn btn-premium w-100 py-3 btn-bid-trigger shadow-md" data-id="1">Place Bid Now</button>
        </div>
    </div>

    <div id="modal-bid-choice">
        <div class="p-4">
            <div class="notice-text mb-4">
                <i class="fa fa-exclamation-triangle me-1"></i> <strong>IMPORTANT:</strong> Price at the time of purchase confirmation by Payment is what applies.
            </div>

            <div class="mb-4">
                <h6 class="text-dark fw-bold mb-3">Option 1: Confirm Purchase Immediately</h6>
                <div class="glass-card p-3 bg-light border-0 shadow-sm mb-2">
                    <label class="small text-muted mb-2 d-block">Enter Wallet PIN to Confirm Payment & Lock Price</label>
                    <div class="d-flex gap-2">
                        <input type="password" maxlength="4" class="form-control" placeholder="PIN" style="width: 100px;">
                        <button class="btn btn-premium flex-grow-1 shadow-sm">Pay Now (₦24,500)</button>
                    </div>
                </div>
            </div>

            <div class="modal-separator">
                <span>OR</span>
            </div>

            <div>
                <h6 class="text-dark fw-bold text-center mb-3">Option 2: Add to Cart</h6>
                <button class="btn btn-outline-premium w-100 py-3 mb-2">
                    <i class="fa fa-cart-plus me-2"></i> Add to Cart for Later
                </button>
                <p class="text-muted small text-center mt-2 font-italic">Item remains subject to price waves until confirmed.</p>
            </div>
        </div>
    </div>

    <div id="modal-wallet">
        <div class="p-4">
            <div class="glass-card text-center mb-4 shadow-md bg-white border-0" style="background: linear-gradient(135deg, #ffffff, #f8fafc);">
                <p class="text-muted small fw-bold mb-1">Available Wallet Balance</p>
                <h1 class="fw-bold text-primary mb-0">₦0.00</h1>
            </div>
            
            <div class="row g-3">
                <div class="col-6">
                    <button id="btn-deposit-fund" class="btn btn-outline-premium w-100 py-4 shadow-sm">
                        <i class="fa fa-plus-circle d-block mb-2 fa-2x"></i>
                        <span class="small fw-bold">Deposit Funds</span>
                    </button>
                </div>
                <div class="col-6">
                    <button id="btn-report-payment" class="btn btn-outline-info w-100 py-4 shadow-sm border-2 fw-bold" style="color: #0891b2; border-color: #0891b2; border-radius: 0.75rem;">
                        <i class="fa fa-paper-plane d-block mb-2 fa-2x"></i>
                        <span class="small">Report Payment</span>
                    </button>
                </div>
            </div>

            <hr class="my-5 opacity-25">
            
            <h6 class="fw-bold mb-4 text-dark d-flex align-items-center">
                <i class="fa fa-history me-2 text-primary"></i> Recent Activity
            </h6>
            <div class="text-center py-4 bg-light rounded-4">
                <i class="fa fa-folder-open text-muted fa-2x mb-2 opacity-50"></i>
                <p class="text-muted small mb-0">Your transaction history will appear here.</p>
            </div>
        </div>
    </div>

    <!-- Deposit Sub-Modal -->
    <div id="modal-deposit-details">
        <div class="p-4">
            <form id="form-create-payment">
                <div class="mb-3">
                    <label class="form-label d-block">Amount to Deposit (₦)</label>
                    <input type="number" class="form-control" placeholder="0.00" required>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">Payment Method</label>
                    <select class="form-select">
                        <option value="bank">Bank Transfer</option>
                        <option value="card">Debit Card</option>
                        <option value="agent">Deposit with Area Agent (FRM)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">User-Account Phone</label>
                    <input type="text" class="form-control" placeholder="Phone used for deposit" required>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">Location / Pickup Hub</label>
                    <input type="text" class="form-control" placeholder="Current location" required>
                </div>
                <button type="submit" class="btn btn-premium w-100 py-3 mt-3 shadow-sm">Create Payment Request</button>
            </form>
            
            <div id="payment-result" class="mt-4 d-none">
                <div class="glass-card border-success bg-white shadow-sm p-4">
                    <p class="text-success small fw-bold mb-3"><i class="fa fa-check-circle me-1"></i> Request Created Successfully</p>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted small">Ref Index:</span>
                        <span class="text-dark small fw-bold" id="res-ref">AB-7F2A9K</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted small">Amount:</span>
                        <span class="text-dark small fw-bold" id="res-amt">₦5,000.00</span>
                    </div>
                    <hr class="my-3 opacity-25">
                    <p class="text-muted small mb-0 mt-3 pt-2 border-top">Please transfer to: <strong>Zenith Bank | 1234567890 | AreaBazaar Ltd</strong></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Payment Report Sub-Modal -->
    <div id="modal-report-details">
        <div class="p-4">
            <form id="form-report-payment">
                <div class="mb-3">
                    <label class="form-label d-block">Invoice Reference Index</label>
                    <input type="text" class="form-control" placeholder="AB-XXXXXXXX" required>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">Sender Name / Account Name</label>
                    <input type="text" class="form-control" placeholder="Name on your bank account" required>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">Payment Date & Time</label>
                    <input type="datetime-local" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label d-block">Upload Receipt (Optional)</label>
                    <input type="file" class="form-control">
                </div>
                <button type="submit" class="btn btn-premium w-100 py-3 mt-3 shadow-sm">Submit Payment Report</button>
            </form>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.6.1/js/iziModal.min.js"></script>
    
    <script src="../assets/js/UIController.js"></script>
    <script src="../assets/js/TransactionHandler.js"></script>
    
    <script>
        $(document).ready(function() {
            UIController.notify('Welcome to AreaBazaar!', 'info');
            
            // Initialize Modals
            // Initialize Modals with a professional Navy-Blue header
            const headerColor = '#1e293b'; // Slate-Dark for premium contrast
            
            UIController.initModal('#modal-login', { title: 'Customer Login', subtitle: 'Enter your phone and PIN', headerColor: headerColor });
            UIController.initModal('#modal-register', { title: 'Create Account', subtitle: 'Join the wave', headerColor: headerColor });
            UIController.initModal('#modal-cart', { title: 'Your Shopping Cart', subtitle: 'Review items', headerColor: headerColor, width: 500 });
            UIController.initModal('#modal-product-details', { title: 'Product Details', subtitle: 'Full Specs', headerColor: headerColor, width: 550 });
            UIController.initModal('#modal-wallet', { title: 'My Wallet', subtitle: 'Manage funds', headerColor: headerColor });
            UIController.initModal('#modal-bid-choice', { title: 'Confirm Action', subtitle: 'Select how to proceed', headerColor: headerColor, width: 450 });
            UIController.initModal('#modal-deposit-details', { title: 'Deposit Funds', subtitle: 'Create Payment Request', headerColor: headerColor, width: 450 });
            UIController.initModal('#modal-report-details', { title: 'Report Payment', subtitle: 'Submit proof of transfer', headerColor: headerColor, width: 450 });

            // Click Handlers
            $('#btn-login-trigger').on('click', () => $('#modal-login').iziModal('open'));
            $('#btn-join-trigger').on('click', () => $('#modal-register').iziModal('open'));
            $('#nav-cart').on('click', () => $('#modal-cart').iziModal('open'));
            $('#nav-wallet').on('click', () => $('#modal-wallet').iziModal('open'));
            
            $('#btn-deposit-fund').on('click', () => $('#modal-deposit-details').iziModal('open'));
            $('#btn-report-payment').on('click', () => $('#modal-report-details').iziModal('open'));

            $('.auction-card').on('click', function(e) {
                if ($(e.target).closest('.btn-bid, .qty-btn, .qty-input').length) return;
                $('#modal-product-details').iziModal('open');
            });

            // Bid Button Logic (Restored)
            $(document).on('click', '.btn-bid, .btn-bid-trigger', function(e) {
                e.stopPropagation();
                $('#modal-bid-choice').iziModal('open');
            });

            // Quantity Controls (Restored)
            $(document).on('click', '.qty-btn', function(e) {
                e.stopPropagation();
                const input = $(this).siblings('.qty-input');
                let val = parseInt(input.val());
                if ($(this).hasClass('btn-plus')) input.val(val + 1);
                else if (val > 1) input.val(val - 1);
            });

            // Refresh Cart Side-Panel UI from localStorage
            function refreshCartUI() {
                const cart = TransactionHandler.getLocalCart();
                const container = $('#cart-items');
                if (!cart.length) {
                    container.html('<p class="text-muted text-center py-5">Your cart is empty.</p>');
                    $('#btn-cart-checkout').prop('disabled', true);
                    return;
                }

                let html = '';
                let total = 0;
                cart.forEach((item, index) => {
                    const price = parseFloat(item.price);
                    total += price * item.quantity;
                    html += `
                        <div class="glass-card mb-2 p-3 bg-white border-0 shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <div class="fw-bold text-dark">${item.name}</div>
                                <div class="text-primary small">₦${price.toLocaleString()} x ${item.quantity}</div>
                            </div>
                            <button class="btn btn-sm btn-link text-danger remove-cart-item" data-index="${index}"><i class="fa fa-trash"></i></button>
                        </div>
                    `;
                });
                container.html(html);
                $('#modal-cart h5 span').text('₦' + total.toLocaleString());
                $('#btn-cart-checkout').prop('disabled', false);
            }

            // Sync Cart on Open
            $('#nav-cart').on('click', refreshCartUI);

            // Spot Order - Pay Now
            $('#modal-bid-choice .btn-premium').on('click', async function() {
                const pin = $(this).siblings('input').val();
                if (!pin) return UIController.notify('Please enter your Wallet PIN', 'error');

                const btn = $(this);
                const result = await TransactionHandler.spotOrder(1, 1, 24500, pin, btn.attr('id'));
                
                if (result && result.status === 'success') {
                    $('#modal-bid-choice').iziModal('close');
                    UIController.notify('Order Confirmed! Code: ' + result.passcode, 'success');
                } else if (result && result.mismatch) {
                    // Handle Price Mismatch Prompt
                    if (confirm(`Notice: Price has updated to ₦${parseFloat(result.new_price).toLocaleString()}. Continue with new price?`)) {
                        // Retry with new price
                        const retry = await TransactionHandler.spotOrder(1, 1, result.new_price, pin, btn.attr('id'));
                        if (retry && retry.status === 'success') {
                            $('#modal-bid-choice').iziModal('close');
                            UIController.notify('Order Confirmed!', 'success');
                        }
                    }
                }
            });

            // Add to Cart (Client Side)
            $('.btn-outline-premium').on('click', function() {
                TransactionHandler.addToLocalCart({
                    product_id: 1, // Mock
                    name: 'Premium Nigerian Rice', // Mock
                    price: 24500, // Mock
                    quantity: parseInt($('.qty-input').val() || 1)
                });
                $('#modal-bid-choice').iziModal('close');
            });

            // Checkout Validation Flow
            $('#btn-cart-checkout').on('click', async function() {
                const validation = await TransactionHandler.validateCart();
                if (validation && validation.data.changed) {
                    if (!confirm("Some prices or stock levels have changed. Do you want to continue with the updated values?")) {
                        return;
                    }
                }
                
                // Proceed to checkout API call (to be refined in Model)
                UIController.notify('Proceeding to secure checkout...', 'info');
                const res = await TransactionHandler.request('order/checkout', 'POST', { items: TransactionHandler.getLocalCart() });
                if (res) {
                    TransactionHandler.clearLocalCart();
                    $('#modal-cart').iziModal('close');
                    UIController.notify('Checkout Successful!', 'success');
                }
            });

            // Order History Tab Refresh
            $('button[data-bs-target="#tab-order-history"]').on('shown.bs.tab', async function() {
                const history = await TransactionHandler.getOrderHistory();
                if (history && history.orders) {
                    let html = history.orders.length ? '' : '<p class="text-muted text-center py-5">No recent orders found.</p>';
                    history.orders.forEach(order => {
                        html += `
                            <div class="glass-card p-3 mb-2 bg-white border-0 shadow-sm">
                                <div class="d-flex justify-content-between">
                                    <span class="small fw-bold text-dark">#ORD-${order.id}</span>
                                    <span class="badge bg-success small">${order.status}</span>
                                </div>
                                <div class="small text-muted mt-1">${order.items}</div>
                                <div class="mt-2 d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-primary">₦${parseFloat(order.total_amount).toLocaleString()}</span>
                                    <div>
                                        <span class="small text-dark fw-bold bg-light px-2 rounded me-2">Pass: ${order.delivery_passcode}</span>
                                        ${order.status === 'Shipped' ? `<button class="btn btn-sm btn-success rounded-pill px-2 ack-btn" data-id="${order.id}">Delivered?</button>` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    $('#order-history-list').html(html);
                }
            });

            // Acknowledge Delivery Click
            $(document).on('click', '.ack-btn', async function() {
                const orderId = $(this).data('id');
                const pass = prompt("Please enter the Delivery Passcode to confirm arrival:");
                if (!pass) return;

                const res = await TransactionHandler.request('order/acknowledge', 'POST', { order_id: orderId, passcode: pass });
                if (res && res.status === 'success') {
                    UIController.notify('Delivery Confirmed! Partner commissions triggered.', 'success');
                    $('button[data-bs-target="#tab-order-history"]').trigger('shown.bs.tab'); // Refresh
                }
            });

            // Remove Item from Cart
            $(document).on('click', '.remove-cart-item', function() {
                const index = $(this).data('index');
                let cart = TransactionHandler.getLocalCart();
                cart.splice(index, 1);
                TransactionHandler.saveLocalCart(cart);
                refreshCartUI();
            });
        });
    </script>
<script src="../assets/js/global.js?v=1772652487"></script>
</body>
</html>
