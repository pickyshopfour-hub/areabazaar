const fs = require('fs');
const assert = require('assert');

console.log('=== UWANBUY VERIFICATION SUITE ===');

// 1. Verify storefront-core.js
const storefrontCoreJs = fs.readFileSync('uwanbuy/assets/js/storefront-core.js', 'utf8');

const mockWindow = {
    localStorage: {
        _data: {},
        getItem(k) { return this._data[k] || null; },
        setItem(k, v) { this._data[k] = String(v); }
    },
    location: { pathname: '/uwanbuy/index.html', search: '' }
};
const mockDocument = {
    readyState: 'complete',
    addEventListener: () => {},
    querySelectorAll: () => [],
    getElementById: () => null
};

// Evaluate storefront-core.js
const storefrontFn = new Function('window', 'document', storefrontCoreJs);
storefrontFn(mockWindow, mockDocument);

const baseProducts = mockWindow.AreaBazaarStorefront.UWANBUY_PRODUCTS;
const waveVariants = mockWindow.AreaBazaarStorefront.ACTIVE_WAVE_VARIANTS;

console.log('✔ Base products count:', baseProducts.length);
assert(baseProducts.length >= 16, 'Expected at least 16 base products');

console.log('✔ Active Wave Variants count:', Object.keys(waveVariants).length);
assert(Object.keys(waveVariants).length === 8, 'Expected 8 active wave variants');

// 2. Verify uwanbuy-engine.js
const engineJs = fs.readFileSync('uwanbuy/assets/js/uwanbuy-engine.js', 'utf8');

// Mock jQuery and DOM environment
const domNodes = {};
function getOrCreateNode(selector) {
    if (!domNodes[selector]) {
        domNodes[selector] = {
            htmlContent: '',
            children: [],
            events: {},
            length: 1,
            html(val) {
                if (val !== undefined) {
                    this.htmlContent = val;
                    return this;
                }
                return this.htmlContent;
            },
            empty() {
                this.htmlContent = '';
                this.children = [];
                return this;
            },
            append(val) {
                this.htmlContent += val;
                this.children.push(val);
                return this;
            },
            addClass() { return this; },
            removeClass() { return this; },
            prop() { return this; },
            text() { return this; },
            val() { return ''; },
            find() { return getOrCreateNode(selector + '_child'); },
            off() { return this; },
            on(evt, handler) {
                this.events[evt] = handler;
                return this;
            },
            each(fn) {
                fn(0, this);
                return this;
            },
            iziModal() { return this; },
            modal() { return this; },
            show() { return this; },
            hide() { return this; },
            ready(fn) { if (typeof fn === 'function') fn(); return this; }
        };
    }
    return domNodes[selector];
}

const mockJQuery = function(sel) {
    if (!sel) return getOrCreateNode('#empty');
    if (typeof sel === 'function') {
        sel();
        return;
    }
    if (typeof sel === 'object') {
        if (!sel.off) sel.off = function() { return this; };
        if (!sel.on) sel.on = function(evt, filter, fn) { return this; };
        if (!sel.ready) sel.ready = function(fn) { if (typeof fn === 'function') fn(); return this; };
        if (!sel.empty) sel.empty = function() { if (this.htmlContent !== undefined) this.htmlContent = ''; return this; };
        if (!sel.append) sel.append = function(val) { if (this.htmlContent !== undefined) this.htmlContent += val; return this; };
        return sel;
    }
    if (typeof sel === 'string' && sel.includes(',')) {
        const parts = sel.split(',').map(s => s.trim());
        const nodes = parts.map(s => getOrCreateNode(s));
        return {
            length: nodes.length,
            each(fn) {
                nodes.forEach((n, idx) => fn(idx, n));
                return this;
            },
            empty() {
                nodes.forEach(n => n.empty());
                return this;
            },
            append(val) {
                nodes.forEach(n => n.append(val));
                return this;
            },
            prop() { return this; },
            text() { return this; },
            html() { return this; },
            attr() { return this; },
            css() { return this; },
            addClass() { return this; },
            removeClass() { return this; },
            show() { return this; },
            hide() { return this; },
            off() { return this; },
            on() { return this; }
        };
    }
    const node = getOrCreateNode(sel);
    node.ready = function(fn) { if (typeof fn === 'function') fn(); return this; };
    return node;
};
mockJQuery.fn = {
    iziModal: function() { return this; }
};
mockJQuery.on = function(evt, sel, handler) {
    if (!mockJQuery._delegated) mockJQuery._delegated = {};
    mockJQuery._delegated[`${evt} ${sel}`] = handler;
};
mockJQuery.off = function() { return mockJQuery; };

mockWindow.jQuery = mockJQuery;
mockWindow.$ = mockJQuery;
mockWindow.bootstrap = {
    Modal: class {
        constructor() {}
        show() {}
        hide() {}
        static getOrCreateInstance() { return new mockWindow.bootstrap.Modal(); }
        static getInstance() { return new mockWindow.bootstrap.Modal(); }
    }
};
mockWindow.iziToast = {
    success: (opts) => { console.log('  [Toast Success]', opts.title || opts.message); },
    warning: (opts) => { console.log('  [Toast Warning]', opts.title || opts.message); },
    info: (opts) => { console.log('  [Toast Info]', opts.title || opts.message); },
    error: (opts) => { console.log('  [Toast Error]', opts.title || opts.message); }
};

global.document = {
    readyState: 'complete',
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelectorAll: () => [],
    getElementById: () => null,
    querySelector: () => null
};
global.window = mockWindow;
global.localStorage = mockWindow.localStorage;

// Evaluate engine
const engineFn = new Function('window', '$', 'document', engineJs);
engineFn(mockWindow, mockJQuery, global.document);

const Engine = mockWindow.UwanBuyEngine;
assert(Engine, 'UwanBuyEngine should be defined on window');

Engine.init();
console.log('✔ UwanBuyEngine initialized successfully');

// Check sections
const sections = ['groceries', 'gadgets', 'fashion', 'fashion/mens-wear', 'fashion/womens-wear', 'home'];
sections.forEach(s => {
    const list = Engine.getProductsBySection(s);
    console.log(`  Section ${s}: ${list.length} products`);
    assert(list.length >= 2, `Expected at least 2 products in section ${s}`);
});

// Check Bazaar variants
const bazaarLots = Engine.getBazaarVariants();
console.log('✔ Bazaar variant lots count:', bazaarLots.length);
console.log('Matched variant IDs:', bazaarLots.map(l => l.variantId));
console.log('Expected variant IDs:', Object.keys(waveVariants));
assert(bazaarLots.length === 8, 'Expected 8 bazaar variant lots');

// Render bazaar page
Engine.renderBazaarPage();
const bazaarHtml = getOrCreateNode('#bazaarVariantGalleryRow').htmlContent;
console.log('✔ Rendered Bazaar HTML length:', bazaarHtml.length);

// Ensure NO auction format names are displayed on the card badges
assert(!bazaarHtml.includes('<span class="badge bg-danger position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1 small">Bid & Win</span>'), 'Cards must not show Bid & Win badge');
assert(!bazaarHtml.includes('<span class="badge bg-primary position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1 small">Flat-Rate Pool</span>'), 'Cards must not show Flat-Rate Pool badge');
assert(bazaarHtml.includes('btn-inspect-auction'), 'Cards must have Inspect Deal button');
assert(bazaarHtml.includes('bazaar-variant-lot-card'), 'Cards must have bazaar-variant-lot-card class');

// Test inspect deal modal
Engine.openAuctionInspectModal('var_rice_50kg', 'uw_prd_1001');
const inspectHtml = getOrCreateNode('#auctionInspectModalBody').htmlContent || getOrCreateNode('#modal-auction-inspect').htmlContent || getOrCreateNode('#quickViewContent').htmlContent || getOrCreateNode('#quickViewModalBody').htmlContent;
console.log('✔ Inspect Deal modal rendered, length:', inspectHtml.length);
assert(inspectHtml.includes('Revealed Auction:'), 'Modal must reveal the auction format');
assert(inspectHtml.includes('btn-pay-immediately'), 'Modal must have Pay Immediately button');
assert(inspectHtml.includes('btn-add-auction-to-cart'), 'Modal must have Add to Cart button');

// Test Cart Auction Expiration
Engine.cart = [];
Engine.addVariantToCart('uw_prd_1001', 'var_rice_50kg', 1, true);
assert(Engine.cart.length === 1, 'Cart should have 1 item');
assert(Engine.cart[0].isAuction === true, 'Cart item should be marked as isAuction');
assert(Engine.cart[0].auctionExpiresAt > Date.now(), 'Cart item should have future auctionExpiresAt');
console.log('✔ Auction item added to cart with expiration timestamp');

// Test expiration eviction
Engine.cart[0].auctionExpiresAt = Date.now() - 5000; // Expired 5 seconds ago
Engine.checkAndEvictExpiredCartAuctions();
assert(Engine.cart.length === 0, 'Expired auction item should be evicted from cart');
console.log('✔ Expired auction item successfully evicted from cart');

// 3. Verify category.html markup
const categoryHtml = fs.readFileSync('uwanbuy/category.html', 'utf8');
assert(categoryHtml.includes('id="quickViewModal"'), 'category.html must contain #quickViewModal');
assert(categoryHtml.includes('id="quickViewContent"'), 'category.html must contain #quickViewContent');
assert(categoryHtml.includes('id="quickViewModalBody"'), 'category.html must contain #quickViewModalBody');
assert(categoryHtml.includes('$("#quickViewModal").iziModal'), 'category.html must initialize #quickViewModal iziModal');
console.log('✔ category.html verified: quickViewModal and iziModal init present');

// 4. Verify index.html markup
const indexHtml = fs.readFileSync('uwanbuy/index.html', 'utf8');
assert(indexHtml.includes('id="landingAuctionDealsRow"'), 'index.html must contain #landingAuctionDealsRow');
assert(indexHtml.includes('id="modal-auction-inspect"'), 'index.html must contain #modal-auction-inspect');
assert(indexHtml.includes('id="quickViewModal"'), 'index.html must contain #quickViewModal');
assert(indexHtml.includes('$("#modal-auction-inspect").iziModal'), 'index.html must initialize #modal-auction-inspect');
console.log('✔ index.html verified: landingAuctionDealsRow and modal-auction-inspect present');

// 5. Verify auctions/index.html markup
const auctionsIndexHtml = fs.readFileSync('uwanbuy/auctions/index.html', 'utf8');
assert(!auctionsIndexHtml.includes('1. Bid & Win'), 'auctions/index.html hero must not have auction type sorting links');
assert(auctionsIndexHtml.includes('id="bazaarVariantGalleryRow"'), 'auctions/index.html must have #bazaarVariantGalleryRow');
assert(auctionsIndexHtml.includes('id="modal-auction-inspect"'), 'auctions/index.html must have #modal-auction-inspect');
console.log('✔ auctions/index.html verified: no format links, variant gallery and inspect modal present');

console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
process.exit(0);
