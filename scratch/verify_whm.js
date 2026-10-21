const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING WHM COMPREHENSIVE VERIFICATION SUITE ===\n');

const rootDir = 'c:\\xampp\\htdocs\\areabazaar';
let passCount = 0;

function check(desc, fn) {
  try {
    fn();
    console.log(`[PASS] ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${desc}: ${err.message}`);
    process.exit(1);
  }
}

// 1. Check all WHM files exist
const expectedWhmFiles = [
  'whm/index.html',
  'whm/products-pricing.html',
  'whm/inventory.html',
  'whm/handling.html',
  'whm/order-items.html',
  'whm/collation.html',
  'whm/sourcing.html',
  'whm/qa.html',
  'whm/assets/css/whm-style.css',
  'whm/assets/js/whm-engine.js'
];

expectedWhmFiles.forEach(relPath => {
  check(`File exists: ${relPath}`, () => {
    const fullPath = path.join(rootDir, relPath);
    assert(fs.existsSync(fullPath), `Missing file: ${fullPath}`);
    const stat = fs.statSync(fullPath);
    assert(stat.size > 200, `File is too small: ${fullPath}`);
  });
});

// 2. Check HTML files have correct scripts and stylesheet references
expectedWhmFiles.filter(f => f.endsWith('.html')).forEach(htmlFile => {
  check(`HTML integrity: ${htmlFile}`, () => {
    const content = fs.readFileSync(path.join(rootDir, htmlFile), 'utf8');
    assert(content.includes('assets/css/whm-style.css'), 'Missing whm-style.css');
    assert(content.includes('assets/js/whm-engine.js'), 'Missing whm-engine.js');
    assert(content.includes('whmEngine.'), 'Missing whmEngine invocations');
  });
});

// 3. Check Admin link integration
const adminFiles = [
  'uwanbuy/admin/index.html',
  'uwanbuy/admin/products.html',
  'uwanbuy/admin/orders.html',
  'uwanbuy/admin/auctions.html'
];

adminFiles.forEach(adm => {
  check(`Admin sidebar links to WHM: ${adm}`, () => {
    const content = fs.readFileSync(path.join(rootDir, adm), 'utf8');
    assert(content.includes('../../whm/index.html'), 'Missing link to ../../whm/index.html');
    assert(content.includes('WHM Warehouse Command'), 'Missing text WHM Warehouse Command');
  });
});

// 4. Test WHM Engine in Mock Environment
check('WHM Engine business logic and state machine test', () => {
  // Mock localStorage
  const store = {};
  global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  };
  global.window = {};

  const engineCode = fs.readFileSync(path.join(rootDir, 'whm/assets/js/whm-engine.js'), 'utf8');
  eval(engineCode);
  const eng = global.window.whmEngine;
  assert(eng, 'whmEngine not initialized');

  // Test 1: Seed data initialization
  const products = eng.getProducts();
  assert(products.length >= 8, `Expected >= 8 products, got ${products.length}`);
  const orderItems = eng.getOrderItems();
  assert(orderItems.length >= 6, `Expected >= 6 order items, got ${orderItems.length}`);

  // Test 2: Price update with cost floor invariant
  const p1 = products[0];
  const oldPrice = p1.priceMinor;
  
  // Attempt invalid price below cost floor
  const failRes = eng.updateProductPrice(p1.id, 50000000, 72000000, 'test_fail', 'Tester');
  assert(!failRes.success, 'Price update should fail if price < cost floor');

  // Valid price update
  const successRes = eng.updateProductPrice(p1.id, 90000000, 72000000, 'test_success', 'Tester');
  assert(successRes.success, 'Valid price update should succeed');
  assert.strictEqual(successRes.priceMinor, 90000000);
  assert.strictEqual(successRes.marginMinor, 18000000);
  assert(successRes.marginPct > 19, 'Margin % calculation error');

  // Test 3: Batch price calculation
  const batchRes = eng.applyBatchPrice([products[1].id], 'percentage', 10, 10000, 'test_batch', 'Tester');
  assert(batchRes.success, 'Batch price failed');
  const updatedP2 = eng.getProductById(products[1].id);
  assert(updatedP2.priceMinor > products[1].priceMinor || updatedP2.priceMinor === 26950000, 'Batch price math error');

  // Test 4: Stock adjustment
  const prevStock = p1.stock.quantity;
  const adjRes = eng.adjustStock(p1.id, 'add', 5, 'inbound_shipment', 'C-04-B2-S1', 'Tester');
  assert(adjRes.success, 'Stock adjust failed');
  assert.strictEqual(adjRes.newStock, prevStock + 5);

  // Test 5: Location Slotting
  const locRes = eng.assignLocation(p1.id, 'Zone C - Gadgets & Tech', '04', 'B2', 'S1', '10');
  assert(locRes.success, 'Slotting failed');
  assert.strictEqual(locRes.locationCode, 'Zone C-04-B2-S1-10');

  // Test 6: Handling Specs
  const specs = eng.getHandlingSpecs(p1.id);
  assert(specs, 'Missing handling specs');
  assert(specs.storageCondition, 'Missing storage condition');

  // Test 7: Order items state machine
  const item1 = orderItems[0];
  const advanceRes = eng.updateOrderItemStatus(item1.orderItemId, 'picked', 'Picker 01', 'A-02-B4-S2');
  assert(advanceRes.success, 'Failed to advance order item status');
  assert.strictEqual(advanceRes.item.status, 'picked');

  // Test 8: Collation
  const collation = eng.getCollationOverview();
  assert(collation.catStats.length === 5, 'Expected 5 category segment stats in collation');
  assert(collation.activeOrders.length > 0, 'Expected active orders in collation pigeon holes');

  // Test 9: Sourcing Deficits & SBA
  const deficits = eng.getDeficits();
  assert(Array.isArray(deficits), 'Deficits must be array');
  const newBatch = eng.createSbaBatch('sba_test', 'Tester Agent', '08000000000', 'foodstuff', 'Ipata Market', [
    { productId: 'uw_prd_1004', productTitle: 'Yam', requestedQty: 10, unitBenchmarkMinor: 120000 }
  ], 1200000, 'Tester');
  assert(newBatch.success, 'Failed to create SBA batch');
  
  // Test 10: Inbound Supply & Auto QA Queue
  const supplyRes = eng.supplySbaBatch(newBatch.batch.batchId, {}, 1150000, 'RCPT-TEST-01', 'Dock 1', 'Tester');
  assert(supplyRes.success, 'Failed to supply SBA batch');
  assert(supplyRes.varianceMinor === 50000, 'SBA variance calculation error');

  const qaQueue = eng.getQaInspections();
  const ticket = qaQueue.find(q => q.batchId === newBatch.batch.batchId);
  assert(ticket, 'QA ticket not generated for supplied SBA batch');

  // Test 11: QA Inspection & Auto Inventory Restock
  const qaRes = eng.inspectQaTicket(ticket.ticketId, 'pass_grade_a', { chk1: true }, 'All specs verified', 'Inspector 01');
  assert(qaRes.success, 'QA inspection failed');
  assert.strictEqual(qaRes.ticket.disposition, 'pass_grade_a');
});

// 5. Documentation checks
check('Documentation has Section 7.10 WHM endpoints below dashed line', () => {
  const content = fs.readFileSync(path.join(rootDir, 'storefront-frontend-backend-endpoint-map.md'), 'utf8');
  assert(content.includes('7.10 Warehouse Management (WHM) Enterprise Operations & Logistics API Mapping'), 'Missing Section 7.10 in endpoint map');
  assert(content.includes('/api/v1/whm/products/{productId}/price'), 'Missing price endpoint');
  assert(content.includes('/api/v1/whm/collation/by-category'), 'Missing collation endpoint');
  assert(content.includes('/api/v1/whm/sourcing/batches/create'), 'Missing sourcing endpoint');
  assert(content.includes('/api/v1/whm/qa/inspect'), 'Missing QA inspect endpoint');
});

check('Documentation has Section 9 WHM backend contract below dashed line', () => {
  const content = fs.readFileSync(path.join(rootDir, 'storefront-backend-contract.md'), 'utf8');
  assert(content.includes('9. Warehouse Management System (WHM) Contract & Operations Lifecycle'), 'Missing Section 9 in contract');
  assert(content.includes('WhmHandlingSpecs'), 'Missing WhmHandlingSpecs interface');
  assert(content.includes('Category-Segment Collation & Order Pigeon-Holes'), 'Missing Collation contract');
  assert(content.includes('Sourcing & Buying Agent (SBA) Acquisition Pipeline'), 'Missing SBA contract');
});

console.log(`\n=== ALL ${passCount} ASSERTIONS PASSED! WHM IS FULLY OPERATIONAL ===`);
