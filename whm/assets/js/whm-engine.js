/**
 * AreaBazaar WHM - Warehouse Management Enterprise Reactive State Engine
 * Manages shared state across UwanBuy catalog, orders, handling, collation, SBA sourcing, and QA.
 */

const WHM_STORAGE = {
  PRODUCTS: 'uwanbuy_admin_products',
  ORDERS: 'uwanbuy_orders',
  HANDLING: 'whm_handling_specs',
  ORDER_ITEMS: 'whm_order_items',
  COLLATION: 'whm_collation_batches',
  TOTES: 'whm_order_totes',
  SBA: 'whm_sba_assignments',
  QA: 'whm_qa_inspections',
  AUDIT: 'whm_audit_logs'
};

class WHMEngine {
  constructor() {
    this.init();
  }

  init() {
    this.ensureSeedData();
  }

  // Helper: Format Naira
  formatNaira(amountMinor) {
    const val = Math.round(Number(amountMinor) || 0) / 100;
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  // Helper: Format percent
  formatPercent(pct) {
    return (Number(pct) || 0).toFixed(1) + '%';
  }

  // Helper: Generate ID
  genId(prefix = 'whm') {
    return prefix + '_' + Math.random().toString(36).substr(2, 7) + '_' + Date.now().toString(36).substr(-4);
  }

  // --- Seed Data Initialization ---
  ensureSeedData() {
    // 1. Products
    let products = JSON.parse(localStorage.getItem(WHM_STORAGE.PRODUCTS) || '[]');
    if (!products || products.length === 0) {
      products = [
        {
          id: 'uw_prd_3001',
          title: 'Smartphone Pro 256GB Dual SIM',
          brand: 'Samsung / TechCorp',
          categoryId: 'gadgets',
          priceMinor: 85000000,
          compareAtPriceMinor: 92000000,
          costFloorMinor: 72000000,
          stock: { quantity: 18, status: 'in_stock' },
          unitLabel: 'unit',
          binLocation: 'C-04-B2-S1',
          warehouseZone: 'Zone C - Gadgets & Tech',
          variants: [
            { id: 'v_3001_blk', name: 'Midnight Black 256GB', priceDeltaMinor: 0, stock: 10, costFloorMinor: 72000000 },
            { id: 'v_3001_slv', name: 'Titanium Silver 512GB', priceDeltaMinor: 15000000, stock: 8, costFloorMinor: 83000000 }
          ]
        },
        {
          id: 'uw_prd_3002',
          title: 'Smart Inverter Air Conditioner 1.5HP Copper',
          brand: 'LG Electronics',
          categoryId: 'gadgets',
          priceMinor: 24500000,
          compareAtPriceMinor: 27500000,
          costFloorMinor: 20500000,
          stock: { quantity: 9, status: 'in_stock' },
          unitLabel: 'unit',
          binLocation: 'C-01-B1-S1',
          warehouseZone: 'Zone C - Gadgets & Tech',
          variants: [
            { id: 'v_3002_std', name: '1.5HP Copper Core', priceDeltaMinor: 0, stock: 5, costFloorMinor: 20500000 },
            { id: 'v_3002_plus', name: '2.0HP Dual Inverter', priceDeltaMinor: 6000000, stock: 4, costFloorMinor: 25000000 }
          ]
        },
        {
          id: 'uw_prd_1001',
          title: 'Refined Pure Vegetable Cooking Oil 5L',
          brand: 'Devon King\'s / Grand',
          categoryId: 'groceries',
          priceMinor: 1450000,
          compareAtPriceMinor: 1600000,
          costFloorMinor: 1220000,
          stock: { quantity: 64, status: 'in_stock' },
          unitLabel: '5L Jerrycan',
          binLocation: 'A-02-B4-S2',
          warehouseZone: 'Zone A - Groceries & Foodstuff',
          variants: []
        },
        {
          id: 'uw_prd_1002',
          title: 'Golden Penny Pure Granulated Sugar 50kg Bag',
          brand: 'Golden Penny',
          categoryId: 'groceries',
          priceMinor: 8200000,
          compareAtPriceMinor: 8800000,
          costFloorMinor: 7400000,
          stock: { quantity: 14, status: 'in_stock' },
          unitLabel: '50kg Bag',
          binLocation: 'A-05-B1-PALLET',
          warehouseZone: 'Zone A - Groceries & Foodstuff',
          variants: []
        },
        {
          id: 'uw_prd_1004',
          title: 'Selected Fresh Yam Tubers (Medium Size)',
          brand: 'Local Farm Fresh (Ipata Wholesale)',
          categoryId: 'foodstuff',
          priceMinor: 180000,
          compareAtPriceMinor: 220000,
          costFloorMinor: 135000,
          stock: { quantity: 5, status: 'low_stock' },
          unitLabel: 'Tuber',
          binLocation: 'A-01-B3-VENT',
          warehouseZone: 'Zone A - Groceries & Foodstuff',
          variants: []
        },
        {
          id: 'uw_prd_1005',
          title: 'Premium Smoked Catfish Pack (5 pieces)',
          brand: 'Kwara Agro Fresh',
          categoryId: 'foodstuff',
          priceMinor: 650000,
          compareAtPriceMinor: 750000,
          costFloorMinor: 480000,
          stock: { quantity: 22, status: 'in_stock' },
          unitLabel: 'Pack',
          binLocation: 'A-03-B2-COLD',
          warehouseZone: 'Zone A - Groceries & Foodstuff',
          variants: []
        },
        {
          id: 'uw_prd_2001',
          title: 'Classic Unisex Cotton Hoodie (Heavyweight)',
          brand: 'Urban Apparel',
          categoryId: 'fashion',
          priceMinor: 1850000,
          compareAtPriceMinor: 2200000,
          costFloorMinor: 1300000,
          stock: { quantity: 30, status: 'in_stock' },
          unitLabel: 'piece',
          binLocation: 'D-02-B3-S2',
          warehouseZone: 'Zone D - Fashion & Apparel',
          variants: [
            { id: 'v_2001_blk_l', name: 'Black - L', priceDeltaMinor: 0, stock: 15, costFloorMinor: 1300000 },
            { id: 'v_2001_gry_xl', name: 'Heather Grey - XL', priceDeltaMinor: 0, stock: 15, costFloorMinor: 1300000 }
          ]
        },
        {
          id: 'uw_prd_4001',
          title: 'Stainless Steel Double Induction Cooker 2200W',
          brand: 'MasterChef Prime',
          categoryId: 'home',
          priceMinor: 4800000,
          compareAtPriceMinor: 5500000,
          costFloorMinor: 3850000,
          stock: { quantity: 11, status: 'in_stock' },
          unitLabel: 'unit',
          binLocation: 'B-03-B1-S3',
          warehouseZone: 'Zone B - Home & Living',
          variants: []
        }
      ];
      localStorage.setItem(WHM_STORAGE.PRODUCTS, JSON.stringify(products));
    }

    // 2. Handling Specs
    let handling = JSON.parse(localStorage.getItem(WHM_STORAGE.HANDLING) || '{}');
    if (!handling['uw_prd_3001']) {
      handling = {
        'uw_prd_3001': {
          storageCondition: 'climate_controlled',
          temperatureTarget: '18°C - 24°C',
          fragilityClass: 'high_fragility_optics',
          hazardClass: 'lithium_battery',
          dimensionsCm: { length: 18, width: 9, height: 5 },
          grossWeightKg: 0.45,
          heavyLiftRequired: false,
          maxStackTiers: 12,
          packagingRequirement: 'bubble_wrap_box',
          tamperEvidentSeal: true,
          expiryTracking: false,
          handlingNotes: 'Store in secure ESD anti-static tech cage. Validate IMEI during QA.',
          handlingCostBreakdown: {
            transportationMinor: 150000,
            washingMinor: 0,
            loadingMinor: 50000,
            baggingMinor: 100000,
            overheadMinor: 100000,
            totalHandlingCostMinor: 400000
          }
        },
        'uw_prd_3002': {
          storageCondition: 'ambient',
          temperatureTarget: 'Ambient (15°C - 30°C)',
          fragilityClass: 'fragile_glass',
          hazardClass: 'none',
          dimensionsCm: { length: 90, width: 40, height: 60 },
          grossWeightKg: 38.5,
          heavyLiftRequired: true,
          maxStackTiers: 3,
          packagingRequirement: 'corrugated_strapped_crate',
          tamperEvidentSeal: true,
          expiryTracking: false,
          handlingNotes: 'HEAVY LIFT! Requires 2-person team lift or forklift. Keep upright.',
          handlingCostBreakdown: {
            transportationMinor: 400000,
            washingMinor: 0,
            loadingMinor: 250000,
            baggingMinor: 150000,
            overheadMinor: 100000,
            totalHandlingCostMinor: 900000
          }
        },
        'uw_prd_1001': {
          storageCondition: 'ambient',
          temperatureTarget: '15°C - 25°C Dry',
          fragilityClass: 'non_fragile',
          hazardClass: 'none',
          dimensionsCm: { length: 22, width: 18, height: 32 },
          grossWeightKg: 4.8,
          heavyLiftRequired: false,
          maxStackTiers: 4,
          packagingRequirement: 'shrink_wrap',
          tamperEvidentSeal: true,
          expiryTracking: true,
          shelfLifeDaysFromIntake: 365,
          handlingNotes: 'Do not puncture. Keep away from direct sunlight.',
          handlingCostBreakdown: {
            transportationMinor: 30000,
            washingMinor: 5000,
            loadingMinor: 15000,
            baggingMinor: 20000,
            overheadMinor: 10000,
            totalHandlingCostMinor: 80000
          }
        },
        'uw_prd_1002': {
          storageCondition: 'dry_ventilated',
          temperatureTarget: 'Ambient Dry (<60% Humidity)',
          fragilityClass: 'non_fragile',
          hazardClass: 'none',
          dimensionsCm: { length: 80, width: 50, height: 25 },
          grossWeightKg: 50.0,
          heavyLiftRequired: true,
          maxStackTiers: 5,
          packagingRequirement: 'palletized_woven_sack',
          tamperEvidentSeal: false,
          expiryTracking: true,
          shelfLifeDaysFromIntake: 720,
          handlingNotes: 'HEAVY LIFT! Store on pallets off warehouse floor to prevent moisture.',
          handlingCostBreakdown: {
            transportationMinor: 120000,
            washingMinor: 0,
            loadingMinor: 60000,
            baggingMinor: 40000,
            overheadMinor: 30000,
            totalHandlingCostMinor: 250000
          }
        },
        'uw_prd_1004': {
          storageCondition: 'dry_ventilated',
          temperatureTarget: 'Well-ventilated ambient',
          fragilityClass: 'non_fragile',
          hazardClass: 'none',
          dimensionsCm: { length: 45, width: 14, height: 14 },
          grossWeightKg: 3.2,
          heavyLiftRequired: false,
          maxStackTiers: 3,
          packagingRequirement: 'breathable_crate',
          tamperEvidentSeal: false,
          expiryTracking: true,
          shelfLifeDaysFromIntake: 45,
          handlingNotes: 'Perishable farm tuber. Inspect weekly for rot or sprouts.',
          handlingCostBreakdown: {
            transportationMinor: 15000,
            washingMinor: 8000,
            loadingMinor: 5000,
            baggingMinor: 7000,
            overheadMinor: 5000,
            totalHandlingCostMinor: 40000
          }
        },
        'uw_prd_1005': {
          storageCondition: 'cold_chain',
          temperatureTarget: '2°C - 8°C (Refrigerated)',
          fragilityClass: 'non_fragile',
          hazardClass: 'none',
          dimensionsCm: { length: 30, width: 20, height: 6 },
          grossWeightKg: 0.85,
          heavyLiftRequired: false,
          maxStackTiers: 8,
          packagingRequirement: 'vacuum_sealed_cooler',
          tamperEvidentSeal: true,
          expiryTracking: true,
          shelfLifeDaysFromIntake: 90,
          handlingNotes: 'Cold chain required. Store in Cold Room Bay 2.'
        },
        'uw_prd_2001': {
          storageCondition: 'ambient',
          temperatureTarget: 'Ambient Dry',
          fragilityClass: 'non_fragile',
          hazardClass: 'none',
          dimensionsCm: { length: 35, width: 28, height: 4 },
          grossWeightKg: 0.65,
          heavyLiftRequired: false,
          maxStackTiers: 20,
          packagingRequirement: 'polybag',
          tamperEvidentSeal: false,
          expiryTracking: false,
          handlingNotes: 'Keep dry and sealed in polybag to prevent dust or moisture staining.'
        },
        'uw_prd_4001': {
          storageCondition: 'ambient',
          temperatureTarget: 'Ambient Dry',
          fragilityClass: 'fragile_glass',
          hazardClass: 'none',
          dimensionsCm: { length: 65, width: 42, height: 12 },
          grossWeightKg: 6.2,
          heavyLiftRequired: false,
          maxStackTiers: 6,
          packagingRequirement: 'bubble_wrap_box',
          tamperEvidentSeal: true,
          expiryTracking: false,
          handlingNotes: 'Ceramic glass top surface. Fragile - handle with care.'
        }
      };
      localStorage.setItem(WHM_STORAGE.HANDLING, JSON.stringify(handling));
    }

    // 3. Orders & Order Items
    let orderItems = JSON.parse(localStorage.getItem(WHM_STORAGE.ORDER_ITEMS) || '[]');
    if (!orderItems || orderItems.length === 0) {
      orderItems = [
        {
          orderItemId: 'uw_item_701',
          orderId: 'ORD-UWB-202610-8812',
          customerName: 'Tolani Shittu',
          customerPhone: '08023456789',
          deliveryPasscode: 'UWB-PASS-4412',
          productId: 'uw_prd_1001',
          productTitle: 'Refined Pure Vegetable Cooking Oil 5L',
          variantName: 'Standard 5L',
          categoryId: 'groceries',
          quantity: 2,
          binLocation: 'A-02-B4-S2',
          status: 'picked', // 'pending_pick' | 'picking' | 'picked' | 'in_collation' | 'packed' | 'staged_dispatch' | 'dispatched'
          toteId: 'TOTE-TK-01',
          urgency: 'express_tanke',
          pickerId: 'Picker Kayode',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          orderItemId: 'uw_item_702',
          orderId: 'ORD-UWB-202610-8812',
          customerName: 'Tolani Shittu',
          customerPhone: '08023456789',
          deliveryPasscode: 'UWB-PASS-4412',
          productId: 'uw_prd_1004',
          productTitle: 'Selected Fresh Yam Tubers (Medium Size)',
          variantName: 'Medium Tubers',
          categoryId: 'foodstuff',
          quantity: 3,
          binLocation: 'A-01-B3-VENT',
          status: 'picked',
          toteId: 'TOTE-TK-01',
          urgency: 'express_tanke',
          pickerId: 'Picker Kayode',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          orderItemId: 'uw_item_703',
          orderId: 'ORD-UWB-202610-8812',
          customerName: 'Tolani Shittu',
          customerPhone: '08023456789',
          deliveryPasscode: 'UWB-PASS-4412',
          productId: 'uw_prd_3001',
          productTitle: 'Smartphone Pro 256GB Dual SIM',
          variantName: 'Midnight Black 256GB',
          categoryId: 'gadgets',
          quantity: 1,
          binLocation: 'C-04-B2-S1',
          status: 'pending_pick',
          toteId: 'TOTE-TK-01',
          urgency: 'express_tanke',
          pickerId: null,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          orderItemId: 'uw_item_704',
          orderId: 'ORD-UWB-202610-8815',
          customerName: 'Chukwuma Adebayo',
          customerPhone: '08012345678',
          deliveryPasscode: 'UWB-PASS-5892',
          productId: 'uw_prd_1005',
          productTitle: 'Premium Smoked Catfish Pack (5 pieces)',
          variantName: 'Standard Pack',
          categoryId: 'foodstuff',
          quantity: 2,
          binLocation: 'A-03-B2-COLD',
          status: 'picking',
          toteId: 'TOTE-TK-02',
          urgency: 'standard',
          pickerId: 'Picker Sola',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          orderItemId: 'uw_item_705',
          orderId: 'ORD-UWB-202610-8815',
          customerName: 'Chukwuma Adebayo',
          customerPhone: '08012345678',
          deliveryPasscode: 'UWB-PASS-5892',
          productId: 'uw_prd_2001',
          productTitle: 'Classic Unisex Cotton Hoodie (Heavyweight)',
          variantName: 'Black - L',
          categoryId: 'fashion',
          quantity: 1,
          binLocation: 'D-02-B3-S2',
          status: 'pending_pick',
          toteId: 'TOTE-TK-02',
          urgency: 'standard',
          pickerId: null,
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          orderItemId: 'uw_item_706',
          orderId: 'ORD-UWB-202610-8820',
          customerName: 'Amina Danjuma',
          customerPhone: '08076543210',
          deliveryPasscode: 'UWB-PASS-9120',
          productId: 'uw_prd_4001',
          productTitle: 'Stainless Steel Double Induction Cooker 2200W',
          variantName: '2200W Dual Burner',
          categoryId: 'home',
          quantity: 1,
          binLocation: 'B-03-B1-S3',
          status: 'packed',
          toteId: 'TOTE-TK-03',
          urgency: 'express_tanke',
          pickerId: 'Picker Sola',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ];
      localStorage.setItem(WHM_STORAGE.ORDER_ITEMS, JSON.stringify(orderItems));
    }

    // 4. SBA Assignments
    let sbaAssignments = JSON.parse(localStorage.getItem(WHM_STORAGE.SBA) || '[]');
    if (!sbaAssignments || sbaAssignments.length === 0) {
      sbaAssignments = [
        {
          batchId: 'SBA-BATCH-202610-041',
          sbaId: 'sba_agro_kayode',
          sbaName: 'Kayode Agro Direct',
          sbaPhone: '08033129841',
          categoryId: 'foodstuff',
          categoryName: 'Foodstuff & Agro Commodities',
          targetMarket: 'Ipata Wholesale Market, Ilorin',
          status: 'supplied_at_dock', // 'assigned' | 'sba_acknowledged' | 'in_transit' | 'supplied_at_dock' | 'qa_passed'
          assignedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          expectedDelivery: new Date(Date.now() - 3600000 * 2).toISOString(),
          suppliedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          totalBudgetMinor: 1920000,
          actualCostMinor: 1850000,
          vendorReceiptRef: 'RCPT-IPT-9920',
          items: [
            {
              productId: 'uw_prd_1004',
              productTitle: 'Yam Tubers (Medium Size)',
              requestedQty: 16,
              suppliedQty: 16,
              unitBenchmarkMinor: 120000,
              actualUnitCostMinor: 115625
            }
          ]
        },
        {
          batchId: 'SBA-BATCH-202610-042',
          sbaId: 'sba_fmcg_bola',
          sbaName: 'Bola FMCG Procurement',
          sbaPhone: '08055419822',
          categoryId: 'groceries',
          categoryName: 'Packaged Groceries',
          targetMarket: 'Mandate Market & Distributor Depot',
          status: 'in_transit',
          assignedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          expectedDelivery: new Date(Date.now() + 3600000 * 2).toISOString(),
          totalBudgetMinor: 8200000,
          actualCostMinor: null,
          vendorReceiptRef: null,
          items: [
            {
              productId: 'uw_prd_1002',
              productTitle: 'Golden Penny Pure Granulated Sugar 50kg Bag',
              requestedQty: 10,
              suppliedQty: 0,
              unitBenchmarkMinor: 820000,
              actualUnitCostMinor: null
            }
          ]
        }
      ];
      localStorage.setItem(WHM_STORAGE.SBA, JSON.stringify(sbaAssignments));
    }

    // 5. QA Inspections
    let qaInspections = JSON.parse(localStorage.getItem(WHM_STORAGE.QA) || '[]');
    if (!qaInspections || qaInspections.length === 0) {
      qaInspections = [
        {
          ticketId: 'QA-TCK-202610-181',
          sourceType: 'sba_intake',
          batchId: 'SBA-BATCH-202610-041',
          productId: 'uw_prd_1004',
          productTitle: 'Yam Tubers (Medium Size)',
          categoryId: 'foodstuff',
          quantity: 16,
          specBenchmarkDoc: 'product-specs.pdf',
          status: 'pending', // 'pending' | 'passed' | 'quarantined' | 'rejected'
          disposition: null,
          checklist: {
            freshnessConfirmed: false,
            noSproutingOrRot: false,
            weightAverageCheck: false,
            pestFree: false
          },
          inspectorId: null,
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
        },
        {
          ticketId: 'QA-TCK-202610-182',
          sourceType: 'order_pack_verify',
          orderId: 'ORD-UWB-202610-8812',
          productId: 'uw_prd_3001',
          productTitle: 'Smartphone Pro 256GB Dual SIM',
          categoryId: 'gadgets',
          quantity: 1,
          specBenchmarkDoc: 'product-specs.pdf',
          status: 'pending',
          disposition: null,
          checklist: {
            powerOnBootTest: false,
            screenIntegrity: false,
            ramStorageMatch: false,
            batteryHealth95Plus: false,
            imeiRecorded: false,
            accessoriesIntact: false
          },
          inspectorId: null,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
      localStorage.setItem(WHM_STORAGE.QA, JSON.stringify(qaInspections));
    }

    // 6. Audit Logs
    let auditLogs = JSON.parse(localStorage.getItem(WHM_STORAGE.AUDIT) || '[]');
    if (!auditLogs || auditLogs.length === 0) {
      auditLogs = [
        {
          id: 'aud_sys_001',
          module: 'System Initialization',
          action: 'Warehouse Management Engine Initialized',
          details: 'Synchronized catalog and initialized 7 core WHM operations pipelines.',
          operatorId: 'SYSTEM',
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem(WHM_STORAGE.AUDIT, JSON.stringify(auditLogs));
    }
  }

  // --- Products & Pricing (Module 1) ---
  getProducts() {
    return JSON.parse(localStorage.getItem(WHM_STORAGE.PRODUCTS) || '[]');
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  }

  saveProducts(products) {
    localStorage.setItem(WHM_STORAGE.PRODUCTS, JSON.stringify(products));
  }

  updateProductPrice(productId, newPriceMinor, costFloorMinor, reason, operatorId, variantUpdates = []) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx === -1) return { success: false, error: 'Product not found' };

    const p = products[idx];
    const oldPrice = p.priceMinor;
    const oldCostFloor = p.costFloorMinor || 0;

    // Enforce invariant: Price >= Cost Floor
    if (newPriceMinor < costFloorMinor) {
      return { success: false, error: 'Selling price cannot be below verified benchmark cost floor' };
    }

    p.priceMinor = Math.round(newPriceMinor);
    p.costFloorMinor = Math.round(costFloorMinor);
    p.updatedAt = new Date().toISOString();

    if (Array.isArray(variantUpdates) && p.variants) {
      variantUpdates.forEach(u => {
        const v = p.variants.find(item => item.id === u.variantId);
        if (v) {
          if (u.priceDeltaMinor !== undefined) v.priceDeltaMinor = Math.round(u.priceDeltaMinor);
          if (u.costFloorMinor !== undefined) v.costFloorMinor = Math.round(u.costFloorMinor);
        }
      });
    }

    this.saveProducts(products);

    const marginMinor = p.priceMinor - p.costFloorMinor;
    const marginPct = (marginMinor / p.priceMinor) * 100;

    this.logAudit(
      'Price Update',
      `Updated price for ${p.title}`,
      `Price: ${this.formatNaira(oldPrice)} -> ${this.formatNaira(p.priceMinor)}, Cost Floor: ${this.formatNaira(p.costFloorMinor)}, Margin: ${this.formatPercent(marginPct)}. Reason: ${reason}`,
      operatorId
    );

    return {
      success: true,
      productId: p.id,
      priceMinor: p.priceMinor,
      costFloorMinor: p.costFloorMinor,
      marginMinor,
      marginPct
    };
  }

  applyBatchPrice(productIds, type, val, roundToMinor = 10000, reason = 'Routine Batch Update', operatorId = 'WHM Staff') {
    const products = this.getProducts();
    let updatedCount = 0;

    products.forEach(p => {
      if (productIds.includes(p.id)) {
        const oldPrice = p.priceMinor;
        const costFloor = p.costFloorMinor || 0;
        let calculated = oldPrice;

        if (type === 'percentage') {
          calculated = oldPrice * (1 + (Number(val) / 100));
        } else if (type === 'flat_offset') {
          calculated = oldPrice + (Number(val) * 100); // input in naira, convert to minor
        } else if (type === 'uniform_rate') {
          calculated = Number(val) * 100;
        }

        // Clamp to costFloor
        calculated = Math.max(costFloor, calculated);

        // Round
        if (roundToMinor > 0) {
          calculated = Math.round(calculated / roundToMinor) * roundToMinor;
        }

        p.priceMinor = Math.round(calculated);
        p.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });

    this.saveProducts(products);
    this.logAudit(
      'Batch Price Update',
      `Adjusted prices for ${updatedCount} products`,
      `Type: ${type}, Value: ${val}. Reason: ${reason}`,
      operatorId
    );

    return { success: true, updatedCount };
  }

  // --- Inventory & Slotting (Module 2) ---
  adjustStock(productId, action, qty, reasonCode, binLocation, operatorId, variantId = null) {
    const products = this.getProducts();
    const p = products.find(item => item.id === productId);
    if (!p) return { success: false, error: 'Product not found' };

    qty = Math.max(1, parseInt(qty) || 1);
    let target = p.stock;

    if (variantId && p.variants) {
      const v = p.variants.find(item => item.id === variantId);
      if (v) target = v;
    }

    const previousStock = target.quantity !== undefined ? target.quantity : (target.stock || 0);
    let newStock = previousStock;

    if (action === 'add') {
      newStock = previousStock + qty;
    } else if (action === 'drop') {
      newStock = Math.max(0, previousStock - qty);
    }

    if (target.quantity !== undefined) target.quantity = newStock;
    if (target.stock !== undefined) target.stock = newStock;

    // Auto status
    p.stock.status = p.stock.quantity <= 0 ? 'out_of_stock' : (p.stock.quantity <= 5 ? 'low_stock' : 'in_stock');
    if (binLocation) p.binLocation = binLocation;

    this.saveProducts(products);

    this.logAudit(
      'Stock Adjustment',
      `${action.toUpperCase()} ${qty} units of ${p.title}`,
      `Prev: ${previousStock}, New: ${newStock}. Reason: ${reasonCode}. Bin: ${p.binLocation || 'N/A'}`,
      operatorId
    );

    return {
      success: true,
      productId: p.id,
      previousStock,
      newStock,
      status: p.stock.status,
      binLocation: p.binLocation
    };
  }

  assignLocation(productId, zone, aisle, bay, shelf, bin) {
    const products = this.getProducts();
    const p = products.find(item => item.id === productId);
    if (!p) return { success: false, error: 'Product not found' };

    const locCode = `${zone.slice(0, 6).trim()}-${aisle}-${bay}-${shelf}-${bin}`;
    p.warehouseZone = zone;
    p.binLocation = locCode;
    p.updatedAt = new Date().toISOString();

    this.saveProducts(products);

    this.logAudit(
      'Slotting Update',
      `Assigned location ${locCode} to ${p.title}`,
      `Zone: ${zone}, Bay: ${bay}, Shelf: ${shelf}, Bin: ${bin}`,
      'WHM Slotting Lead'
    );

    return { success: true, locationCode: locCode };
  }

  // --- Handling Specifications (Module 3) ---
  getAllHandlingSpecs() {
    return JSON.parse(localStorage.getItem(WHM_STORAGE.HANDLING) || '{}');
  }

  getHandlingSpecs(productId) {
    const all = this.getAllHandlingSpecs();
    return all[productId] || {
      storageCondition: 'ambient',
      temperatureTarget: 'Ambient (15°C - 25°C)',
      fragilityClass: 'non_fragile',
      hazardClass: 'none',
      dimensionsCm: { length: 20, width: 15, height: 10 },
      grossWeightKg: 1.0,
      heavyLiftRequired: false,
      maxStackTiers: 6,
      packagingRequirement: 'corrugated_box',
      tamperEvidentSeal: false,
      expiryTracking: false,
      handlingNotes: 'Standard warehouse handling.'
    };
  }

  saveHandlingSpecs(productId, specs, operatorId = 'WHM Logistics Safety') {
    const all = this.getAllHandlingSpecs();
    specs.heavyLiftRequired = (Number(specs.grossWeightKg) || 0) > 15.0;
    all[productId] = specs;
    localStorage.setItem(WHM_STORAGE.HANDLING, JSON.stringify(all));

    const p = this.getProductById(productId);
    this.logAudit(
      'Handling Specs Update',
      `Configured handling profile for ${p ? p.title : productId}`,
      `Storage: ${specs.storageCondition}, Fragility: ${specs.fragilityClass}, Weight: ${specs.grossWeightKg}kg (Heavy Lift: ${specs.heavyLiftRequired})`,
      operatorId
    );

    return { success: true, specs };
  }

  // Algorithmic Backend Suggested Retail Price based on Purchase Cost + Handling Breakdown
  calculateAlgorithmicSuggestedPrice(productId) {
    const p = this.getProductById(productId);
    if (!p) return null;
    const sp = this.getHandlingSpecs(productId);
    const baseCost = p.costFloorMinor || 0;
    const handling = sp.handlingCostBreakdown || {
      transportationMinor: 0,
      washingMinor: 0,
      loadingMinor: 0,
      baggingMinor: 0,
      overheadMinor: 0,
      totalHandlingCostMinor: 0
    };
    const totalHandlingCost = handling.totalHandlingCostMinor || 0;
    const effectiveCostFloor = baseCost + totalHandlingCost;

    // Dynamic category benchmark markup algorithm (simulates backend pricing engine)
    let marginMultiplier = 1.15; // default 15%
    if (p.categoryId === 'groceries') marginMultiplier = 1.12; // 12%
    else if (p.categoryId === 'foodstuff') marginMultiplier = 1.18; // 18%
    else if (p.categoryId === 'gadgets') marginMultiplier = 1.14; // 14%
    else if (p.categoryId === 'fashion') marginMultiplier = 1.25; // 25%
    else if (p.categoryId === 'home') marginMultiplier = 1.20; // 20%

    // Recommended suggested price rounded cleanly
    const rawSuggested = Math.round(effectiveCostFloor * marginMultiplier);
    const suggestedPriceMinor = Math.ceil(rawSuggested / 10000) * 10000;
    const suggestedMarginMinor = suggestedPriceMinor - effectiveCostFloor;
    const suggestedMarginPct = suggestedPriceMinor > 0 ? (suggestedMarginMinor / suggestedPriceMinor) * 100 : 0;

    return {
      productId: p.id,
      title: p.title,
      categoryId: p.categoryId,
      baseCostFloorMinor: baseCost,
      handlingCostBreakdown: handling,
      totalHandlingCostMinor: totalHandlingCost,
      effectiveCostFloorMinor: effectiveCostFloor,
      suggestedPriceMinor: suggestedPriceMinor,
      suggestedMarginMinor: suggestedMarginMinor,
      suggestedMarginPct: suggestedMarginPct,
      currentPriceMinor: p.priceMinor,
      isAlgorithmSuggestion: true
    };
  }

  // --- Order Items (Module 4) ---
  getOrderItems(filter = {}) {
    let items = JSON.parse(localStorage.getItem(WHM_STORAGE.ORDER_ITEMS) || '[]');
    if (filter.status && filter.status !== 'all') {
      items = items.filter(i => i.status === filter.status);
    }
    if (filter.categoryId && filter.categoryId !== 'all') {
      items = items.filter(i => i.categoryId === filter.categoryId);
    }
    if (filter.urgency && filter.urgency !== 'all') {
      items = items.filter(i => i.urgency === filter.urgency);
    }
    if (filter.orderId) {
      items = items.filter(i => i.orderId.toLowerCase().includes(filter.orderId.toLowerCase()));
    }
    return items;
  }

  updateOrderItemStatus(orderItemId, newStatus, pickerId = 'Staff', binScanned = '', notes = '') {
    const items = this.getOrderItems();
    const item = items.find(i => i.orderItemId === orderItemId);
    if (!item) return { success: false, error: 'Order item not found' };

    const oldStatus = item.status;
    item.status = newStatus;
    if (pickerId) item.pickerId = pickerId;
    if (binScanned) item.binScanned = binScanned;
    item.updatedAt = new Date().toISOString();

    localStorage.setItem(WHM_STORAGE.ORDER_ITEMS, JSON.stringify(items));

    this.logAudit(
      'Order Item Status',
      `Order item ${item.orderItemId} -> ${newStatus.toUpperCase()}`,
      `Product: ${item.productTitle}. Prev: ${oldStatus}. Picker: ${pickerId}. Notes: ${notes}`,
      pickerId
    );

    return { success: true, item };
  }

  substituteOrderItem(orderItemId, subProductId, subTitle, reason, operatorId) {
    const items = this.getOrderItems();
    const item = items.find(i => i.orderItemId === orderItemId);
    if (!item) return { success: false, error: 'Order item not found' };

    const oldProduct = item.productTitle;
    item.originalProductId = item.productId;
    item.originalProductTitle = oldProduct;
    item.productId = subProductId;
    item.productTitle = subTitle + ' [SUBSTITUTE]';
    item.substitutionReason = reason;
    item.status = 'substituted';
    item.updatedAt = new Date().toISOString();

    localStorage.setItem(WHM_STORAGE.ORDER_ITEMS, JSON.stringify(items));

    this.logAudit(
      'Order Item Substitution',
      `Substituted ${oldProduct} with ${subTitle}`,
      `Order: ${item.orderId}. Reason: ${reason}`,
      operatorId
    );

    return { success: true, item };
  }

  // --- Collation by Category (Module 5) ---
  getCollationOverview() {
    const items = this.getOrderItems();
    const categories = ['groceries', 'foodstuff', 'gadgets', 'fashion', 'home'];
    const catLabels = {
      groceries: 'Groceries (FMCG)',
      foodstuff: 'Foodstuff & Agro',
      gadgets: 'Gadgets & Tech',
      fashion: 'Fashion & Apparel',
      home: 'Home Essentials'
    };

    const catStats = categories.map(cat => {
      const catItems = items.filter(i => i.categoryId === cat);
      const collated = catItems.filter(i => ['picked', 'in_collation', 'packed', 'staged_dispatch', 'dispatched'].includes(i.status)).length;
      const pending = catItems.filter(i => ['pending_pick', 'picking'].includes(i.status)).length;
      return {
        categoryId: cat,
        label: catLabels[cat],
        total: catItems.length,
        collated,
        pending,
        pct: catItems.length > 0 ? Math.round((collated / catItems.length) * 100) : 100
      };
    });

    // Group by Order for Pigeon Hole matrix
    const orderMap = {};
    items.forEach(i => {
      if (!orderMap[i.orderId]) {
        orderMap[i.orderId] = {
          orderId: i.orderId,
          customerName: i.customerName,
          deliveryPasscode: i.deliveryPasscode,
          urgency: i.urgency,
          toteId: i.toteId || 'TOTE-' + i.orderId.slice(-4),
          lines: [],
          categoriesPresent: new Set()
        };
      }
      orderMap[i.orderId].lines.push(i);
      orderMap[i.orderId].categoriesPresent.add(i.categoryId);
    });

    const activeOrders = Object.values(orderMap).map(o => {
      const totalLines = o.lines.length;
      const collatedLines = o.lines.filter(l => ['picked', 'in_collation', 'packed', 'staged_dispatch', 'dispatched'].includes(l.status)).length;
      const pct = Math.round((collatedLines / totalLines) * 100);
      const isComplete = pct === 100;

      // Category breakdown for order
      const catProgress = {};
      Array.from(o.categoriesPresent).forEach(cat => {
        const catL = o.lines.filter(l => l.categoryId === cat);
        const catDone = catL.filter(l => ['picked', 'in_collation', 'packed', 'staged_dispatch', 'dispatched'].includes(l.status)).length;
        catProgress[cat] = {
          total: catL.length,
          collated: catDone,
          done: catDone === catL.length
        };
      });

      return {
        orderId: o.orderId,
        customerName: o.customerName,
        deliveryPasscode: o.deliveryPasscode,
        urgency: o.urgency,
        toteId: o.toteId,
        totalLines,
        collatedLines,
        pct,
        isComplete,
        catProgress,
        lines: o.lines
      };
    });

    return { catStats, activeOrders };
  }

  assignItemToTote(orderItemId, toteId, operatorId = 'Collation Operator') {
    const items = this.getOrderItems();
    const item = items.find(i => i.orderItemId === orderItemId);
    if (!item) return { success: false, error: 'Item not found' };

    item.toteId = toteId;
    item.status = 'in_collation';
    item.updatedAt = new Date().toISOString();

    localStorage.setItem(WHM_STORAGE.ORDER_ITEMS, JSON.stringify(items));

    this.logAudit(
      'Collation Pigeon-Hole',
      `Placed ${item.productTitle} into ${toteId}`,
      `Order: ${item.orderId}`,
      operatorId
    );

    return { success: true, item };
  }

  completeOrderCollation(orderId, operatorId = 'Collation Supervisor') {
    const items = this.getOrderItems();
    const orderLines = items.filter(i => i.orderId === orderId);
    if (orderLines.length === 0) return { success: false, error: 'Order not found' };

    // Move all lines to packed
    orderLines.forEach(l => {
      l.status = 'packed';
      l.updatedAt = new Date().toISOString();
    });

    localStorage.setItem(WHM_STORAGE.ORDER_ITEMS, JSON.stringify(items));

    this.logAudit(
      'Collation Completed',
      `Order ${orderId} 100% collated and packed`,
      `Ready for QA and dispatch staging. Tote: ${orderLines[0].toteId}`,
      operatorId
    );

    return { success: true, orderId };
  }

  // --- Sourcing & SBA Assignment (Module 6) ---
  getSbaAssignments() {
    return JSON.parse(localStorage.getItem(WHM_STORAGE.SBA) || '[]');
  }

  getDeficits() {
    const products = this.getProducts();
    const orderItems = this.getOrderItems();
    const deficits = [];

    products.forEach(p => {
      const pendingOrderQty = orderItems
        .filter(i => i.productId === p.id && ['pending_pick', 'picking'].includes(i.status))
        .reduce((sum, i) => sum + (i.quantity || 1), 0);

      const availableStock = p.stock.quantity;
      const netDeficit = Math.max(0, pendingOrderQty - availableStock);

      if (netDeficit > 0 || p.stock.status === 'low_stock' || p.stock.status === 'out_of_stock') {
        const targetProcurementQty = Math.max(netDeficit, (p.reorderThreshold || 10) - availableStock);
        if (targetProcurementQty > 0) {
          deficits.push({
            productId: p.id,
            title: p.title,
            categoryId: p.categoryId,
            currentStock: availableStock,
            pendingDemand: pendingOrderQty,
            deficitQty: targetProcurementQty,
            unitCostFloorMinor: p.costFloorMinor || p.priceMinor * 0.8,
            estTotalMinor: targetProcurementQty * (p.costFloorMinor || p.priceMinor * 0.8),
            suggestedOrigin: p.categoryId === 'foodstuff' ? 'Ipata Wholesale Market' : (p.categoryId === 'groceries' ? 'Mandate Depot' : 'Tech Village Depot')
          });
        }
      }
    });

    return deficits;
  }

  createSbaBatch(sbaId, sbaName, sbaPhone, categoryId, targetMarket, items, budgetMinor, operatorId = 'Sourcing Lead') {
    const batches = this.getSbaAssignments();
    const batchId = 'SBA-BATCH-' + (new Date().getFullYear()) + (new Date().getMonth() + 1).toString().padStart(2, '0') + '-' + Math.floor(100 + Math.random() * 900);

    const newBatch = {
      batchId,
      sbaId,
      sbaName,
      sbaPhone,
      categoryId,
      categoryName: categoryId.toUpperCase(),
      targetMarket,
      status: 'assigned',
      assignedAt: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 3600000 * 4).toISOString(),
      suppliedAt: null,
      totalBudgetMinor: budgetMinor,
      actualCostMinor: null,
      vendorReceiptRef: null,
      items: items.map(it => ({
        productId: it.productId,
        productTitle: it.productTitle,
        requestedQty: Number(it.requestedQty),
        suppliedQty: 0,
        unitBenchmarkMinor: Number(it.unitBenchmarkMinor),
        actualUnitCostMinor: null
      }))
    };

    batches.unshift(newBatch);
    localStorage.setItem(WHM_STORAGE.SBA, JSON.stringify(batches));

    this.logAudit(
      'SBA Procurement Batch Created',
      `Assigned batch ${batchId} to ${sbaName}`,
      `Category: ${categoryId}, Items: ${items.length}, Budget: ${this.formatNaira(budgetMinor)}. Market: ${targetMarket}`,
      operatorId
    );

    return { success: true, batch: newBatch };
  }

  supplySbaBatch(batchId, suppliedMap, actualCostMinor, receiptRef, dockName = 'Receiving Dock 1', operatorId = 'Dock Clerk') {
    const batches = this.getSbaAssignments();
    const b = batches.find(item => item.batchId === batchId);
    if (!b) return { success: false, error: 'Batch not found' };

    b.status = 'supplied_at_dock';
    b.suppliedAt = new Date().toISOString();
    b.actualCostMinor = Math.round(Number(actualCostMinor) || b.totalBudgetMinor);
    b.vendorReceiptRef = receiptRef || 'RCPT-' + Date.now().toString().slice(-6);

    // Update supplied quantities
    b.items.forEach(it => {
      if (suppliedMap[it.productId] !== undefined) {
        it.suppliedQty = Number(suppliedMap[it.productId]);
      } else {
        it.suppliedQty = it.requestedQty;
      }
    });

    localStorage.setItem(WHM_STORAGE.SBA, JSON.stringify(batches));

    // Auto-create QA Inspection tickets for supplied items
    const qaQueue = this.getQaInspections();
    b.items.forEach(it => {
      qaQueue.unshift({
        ticketId: 'QA-TCK-' + Date.now().toString().slice(-6),
        sourceType: 'sba_intake',
        batchId: b.batchId,
        productId: it.productId,
        productTitle: it.productTitle,
        categoryId: b.categoryId,
        quantity: it.suppliedQty,
        specBenchmarkDoc: 'product-specs.pdf',
        status: 'pending',
        disposition: null,
        checklist: {},
        inspectorId: null,
        createdAt: new Date().toISOString()
      });
    });
    localStorage.setItem(WHM_STORAGE.QA, JSON.stringify(qaQueue));

    const varianceMinor = b.totalBudgetMinor - b.actualCostMinor;
    this.logAudit(
      'SBA Inbound Supply Received',
      `Received batch ${batchId} at ${dockName}`,
      `Budget: ${this.formatNaira(b.totalBudgetMinor)}, Actual: ${this.formatNaira(b.actualCostMinor)}, Variance: ${this.formatNaira(varianceMinor)}. Routed to QA.`,
      operatorId
    );

    return { success: true, batch: b, varianceMinor };
  }

  // --- Quality Assurance (Module 7) ---
  getQaInspections() {
    return JSON.parse(localStorage.getItem(WHM_STORAGE.QA) || '[]');
  }

  inspectQaTicket(ticketId, disposition, checklistEvaluation, notes, inspectorId = 'QA Inspector') {
    const queue = this.getQaInspections();
    const ticket = queue.find(t => t.ticketId === ticketId);
    if (!ticket) return { success: false, error: 'Ticket not found' };

    ticket.disposition = disposition; // 'pass_grade_a' | 'pass_grade_b_clearance' | 'quarantine' | 'reject'
    ticket.status = disposition.startsWith('pass') ? 'passed' : (disposition === 'quarantine' ? 'quarantined' : 'rejected');
    ticket.checklist = checklistEvaluation;
    ticket.notes = notes;
    ticket.inspectorId = inspectorId;
    ticket.inspectedAt = new Date().toISOString();

    localStorage.setItem(WHM_STORAGE.QA, JSON.stringify(queue));

    // If passed and from SBA, auto-increment inventory!
    if (ticket.status === 'passed' && ticket.sourceType === 'sba_intake') {
      this.adjustStock(
        ticket.productId,
        'add',
        ticket.quantity,
        'inbound_shipment_qa_passed',
        '',
        inspectorId
      );
    }

    this.logAudit(
      'QA Inspection',
      `Recorded ${disposition.toUpperCase()} for ${ticket.productTitle}`,
      `Ticket: ${ticketId}, Category: ${ticket.categoryId}. Notes: ${notes}`,
      inspectorId
    );

    return { success: true, ticket };
  }

  // --- Audit Trail ---
  getAuditLogs() {
    return JSON.parse(localStorage.getItem(WHM_STORAGE.AUDIT) || '[]');
  }

  logAudit(module, action, details, operatorId = 'WHM Staff') {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: this.genId('aud'),
      module,
      action,
      details,
      operatorId,
      timestamp: new Date().toISOString()
    });
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();
    localStorage.setItem(WHM_STORAGE.AUDIT, JSON.stringify(logs));
  }
}

// Global Singleton
window.whmEngine = new WHMEngine();
