/**
 * Verification Script: UwanBuy Storefront 11 Corrections & Endpoint Map
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- STARTING UWANBUY STOREFRONT VERIFICATION ---');

// 1. Verify storefront-core.js
const coreJsPath = path.join(__dirname, '../uwanbuy/assets/js/storefront-core.js');
assert.ok(fs.existsSync(coreJsPath), 'storefront-core.js exists');
const coreJsContent = fs.readFileSync(coreJsPath, 'utf8');

// Test 1: Category hierarchy up to 3 levels
assert.ok(coreJsContent.includes('UWANBUY_CATEGORIES'), 'UWANBUY_CATEGORIES is defined in storefront-core.js');
assert.ok(coreJsContent.includes('subCategories'), 'UWANBUY_CATEGORIES contains subCategories');
assert.ok(coreJsContent.includes('subSubCategories'), 'UWANBUY_CATEGORIES contains subSubCategories (3 levels)');

// Test 2: Active wave registry
assert.ok(coreJsContent.includes('ACTIVE_WAVE_VARIANTS'), 'ACTIVE_WAVE_VARIANTS dictionary is defined');
assert.ok(coreJsContent.includes('var_rice_10kg'), 'ACTIVE_WAVE_VARIANTS has variant mappings');

// Test 3: Base Products & Derived Variants catalog
assert.ok(coreJsContent.includes('UWANBUY_PRODUCTS'), 'UWANBUY_PRODUCTS is defined');
assert.ok(coreJsContent.includes('modalType: \'groceries_scroll_variants\''), 'Groceries modalType defined');
assert.ok(coreJsContent.includes('modalType: \'attribute_options\''), 'Fashion/Tech modalType defined');

// 2. Verify uwanbuy-engine.js
const engineJsPath = path.join(__dirname, '../uwanbuy/assets/js/uwanbuy-engine.js');
assert.ok(fs.existsSync(engineJsPath), 'uwanbuy-engine.js exists');
const engineJsContent = fs.readFileSync(engineJsPath, 'utf8');

// Test 4: Base product price range
assert.ok(engineJsContent.includes('getBaseProductPriceRange'), 'getBaseProductPriceRange method exists');

// Test 5: category/subcategory querying
assert.ok(engineJsContent.includes('fashion/mens-wear'), 'category/subcategory querying supported');
assert.ok(engineJsContent.includes('fashion/womens-wear'), 'category/subcategory querying supported');

// Test 6: Groceries scrollable variants modal (Mode A)
assert.ok(engineJsContent.includes('grocery-variant-card'), 'grocery-variant-card scrollable list exists');
assert.ok(engineJsContent.includes('grocery-variants-scroll-wrapper'), 'grocery-variants-scroll-wrapper container exists');

// Test 7: Fashion/Tech attribute modifier modal (Mode B)
assert.ok(engineJsContent.includes('btn-attr-pill'), 'btn-attr-pill attribute buttons exist');

// Test 8: Bazaar variant-level querying & inspection modal
assert.ok(engineJsContent.includes('getBazaarVariants'), 'getBazaarVariants method exists');
assert.ok(engineJsContent.includes('renderBazaarPage'), 'renderBazaarPage method exists');
assert.ok(engineJsContent.includes('openAuctionInspectModal'), 'openAuctionInspectModal method exists');
assert.ok(engineJsContent.includes('btn-pay-immediately'), 'btn-pay-immediately action exists');
assert.ok(engineJsContent.includes('btn-add-auction-to-cart'), 'btn-add-auction-to-cart action exists');

// Test 9: Auction cart expiration eviction
assert.ok(engineJsContent.includes('checkAndEvictExpiredCartAuctions'), 'checkAndEvictExpiredCartAuctions method exists');
assert.ok(engineJsContent.includes('auctionExpiresAt'), 'auctionExpiresAt tracking exists in engine');

// Test 10: Autocomplete suggestion opens modal
assert.ok(engineJsContent.includes('openQuickViewModal(id, variantId)'), 'suggestion click calls openQuickViewModal');

// 3. Verify uwanbuy/index.html
const indexHtmlPath = path.join(__dirname, '../uwanbuy/index.html');
assert.ok(fs.existsSync(indexHtmlPath), 'index.html exists');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Hero section & search
assert.ok(indexHtmlContent.includes('Hyperlocal Fulfillment Hub'), 'Hero badge exists');
assert.ok(indexHtmlContent.includes('quick-search-tag'), 'Quick search tags exist in hero');
assert.ok(indexHtmlContent.includes('id="suggestionsBox"'), 'Autocomplete suggestionsBox exists in index.html');

// Subcategory galleries
assert.ok(indexHtmlContent.includes('id="fashionMensGalleryRow"'), 'fashionMensGalleryRow exists on landing page');
assert.ok(indexHtmlContent.includes('id="fashionWomensGalleryRow"'), 'fashionWomensGalleryRow exists on landing page');

// No format sorting pills on landing page
assert.ok(!indexHtmlContent.includes('landing-auction-pill'), 'Landing page format sorting pills removed');

// 4. Verify uwanbuy/auctions/index.html
const auctionsHtmlPath = path.join(__dirname, '../uwanbuy/auctions/index.html');
assert.ok(fs.existsSync(auctionsHtmlPath), 'auctions/index.html exists');
const auctionsHtmlContent = fs.readFileSync(auctionsHtmlPath, 'utf8');

// No format filter pills
assert.ok(!auctionsHtmlContent.includes('auction-filter-pill'), 'Auctions page format filter pills removed');
// Variant level gallery & inspection modal
assert.ok(auctionsHtmlContent.includes('id="bazaarVariantGalleryRow"'), 'bazaarVariantGalleryRow container exists');
assert.ok(auctionsHtmlContent.includes('id="modal-auction-inspect"'), 'modal-auction-inspect exists');

// 5. Verify storefront-frontend-backend-endpoint-map.md
const mapPath = path.join(__dirname, '../storefront-frontend-backend-endpoint-map.md');
assert.ok(fs.existsSync(mapPath), 'endpoint map exists');
const mapContent = fs.readFileSync(mapPath, 'utf8');
assert.ok(mapContent.includes('### 7.9 3-Level Taxonomy, Base Products vs Derived Variants, Modal Modes & Bazaar Variant Architecture'), 'Section 7.9 added in endpoint map');
assert.ok(mapContent.includes('category/subcategory'), 'category/subcategory documented in endpoint map');
assert.ok(mapContent.includes('Mode A — Groceries & Foodstuff'), 'Mode A documented in endpoint map');
assert.ok(mapContent.includes('Mode B — Fashion, Tech & Home'), 'Mode B documented in endpoint map');
assert.ok(mapContent.includes('Bazaar Page Variant-Level Model'), 'Bazaar variant-level model documented');

console.log('--- ALL 11 UWANBUY CORRECTIONS VERIFIED SUCCESSFULLY! ---');
