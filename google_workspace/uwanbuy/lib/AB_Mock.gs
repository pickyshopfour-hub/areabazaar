/**
 * AB_Mock.gs
 * Mock API fixtures and responses for offline development and testing of UwanBuy
 * and AreaBazaar Google Workspace operations.
 */

const AB_Mock = {
  fixtures: {
    products: [
      { id: 'PROD-RICE', name: 'Premium Long Grain Rice', category: 'Groceries', brand: 'Royal Stallion', hasVariants: true, status: 'ACTIVE' },
      { id: 'PROD-OIL', name: 'Vegetable Cooking Oil', category: 'Groceries', brand: 'Kings', hasVariants: true, status: 'ACTIVE' },
      { id: 'PROD-PHONE', name: 'Smartphone Pro Max', category: 'Gadgets', brand: 'Xiaomi', hasVariants: true, status: 'ACTIVE' }
    ],
    variants: [
      { id: 'VAR-RICE-50KG', baseProductId: 'PROD-RICE', name: '50kg Bag', sku: 'SKU-RICE-50KG', qtyValue: 50, qtyUnit: 'kg', packaging: 'Sack', specs: '{"Origin":"Kebbi State","Packaging":"Woven Poly Sack","Grade":"Grade A Long Grain"}', active: true },
      { id: 'VAR-OIL-5L', baseProductId: 'PROD-OIL', name: '5 Litre Gallon', sku: 'SKU-OIL-5L', qtyValue: 5, qtyUnit: 'litre', packaging: 'Keg', specs: '{"Packaging":"BPA-Free Jerrycan","Cholesterol":"Zero"}', active: true },
      { id: 'VAR-PHONE-256GB', baseProductId: 'PROD-PHONE', name: '8GB / 256GB Midnight Black', sku: 'SKU-PHONE-256', qtyValue: 1, qtyUnit: 'unit', packaging: 'Box', specs: '{"RAM":"8GB","Storage":"256GB","Color":"Midnight Black","Display":"6.67-inch AMOLED"}', active: true }
    ],
    orderItems: [
      { orderItemId: 'ITM-101', orderId: 'ORD-8801', productId: 'PROD-RICE', productName: 'Premium Long Grain Rice', variantId: 'VAR-RICE-50KG', variantName: '50kg Bag', quantity: 2, quantityValue: 50, quantityUnit: 'kg', whzId: 'WHZ-01', whmStatus: 'requested', adminApproved: true, isUrgent: true, destinationAreaId: 'AREA-TANKE', destinationAreaName: 'Tanke Regional Hub' },
      { orderItemId: 'ITM-102', orderId: 'ORD-8802', productId: 'PROD-OIL', productName: 'Vegetable Cooking Oil', variantId: 'VAR-OIL-5L', variantName: '5 Litre Gallon', quantity: 4, quantityValue: 5, quantityUnit: 'litre', whzId: 'WHZ-01', whmStatus: 'requested', adminApproved: true, isUrgent: false, destinationAreaId: 'AREA-TANKE', destinationAreaName: 'Tanke Regional Hub' }
    ]
  },

  handle(endpointKey, payload) {
    switch (endpointKey) {
      case 'PRODUCTS_LIST':
        return { success: true, count: this.fixtures.products.length, data: this.fixtures.products };

      case 'VARIANTS_LIST':
        return { success: true, count: this.fixtures.variants.length, data: this.fixtures.variants };

      case 'SHOW_PRODUCTS_LIST':
        return {
          success: true,
          waveId: 'WAVE-ACTIVE-01',
          data: [
            { slot: 1, variantId: 'VAR-RICE-50KG', title: '50kg Rice', wavePrice: 72000, timerMinutes: 12 },
            { slot: 2, variantId: 'VAR-OIL-5L', title: '5L Oil', wavePrice: 13500, timerMinutes: 12 }
          ]
        };

      case 'ORDER_ITEMS_PULL':
        return { success: true, count: this.fixtures.orderItems.length, data: this.fixtures.orderItems };

      case 'RESOLUTION_POST':
        return { success: true, demandCodesGenerated: 2, message: 'Demand successfully resolved from approved order items.' };

      case 'SBA_BATCHES_POST':
        return { success: true, batchRef: 'SBA-BATCH-' + Date.now(), message: 'Procurement batch dispatched to SBA.' };

      case 'INTAKE_POST':
        return { success: true, inspectionId: 'INSP-' + Date.now(), status: 'QA_LOGGED' };

      case 'ITEM_STATUS_POST':
        return { success: true, orderItemId: payload ? payload.orderItemId : null, nextStatus: payload ? payload.status : null };

      case 'ZBD_ASSIGN_POST':
        return { success: true, manifestId: 'MAN-ZBD-' + Date.now(), waybillStatus: 'DISPATCHED' };

      case 'BILLS_POST':
        return { success: true, voucherCount: 2, status: 'POSTED_FOR_SADM_APPROVAL' };

      case 'POS_ORDERS_POST':
        return { success: true, invoiceRef: 'INV-POS-' + Date.now(), receiptId: 'RCP-' + Date.now() };

      case 'DELIVERY_VERIFY_OTP':
        // Test passcode is '894215' or any 6-digit match
        const enteredOtp = payload ? String(payload.otp || payload.secretOtp).trim() : '';
        const isValid = enteredOtp === '894215' || (enteredOtp.length === 6 && /^\d+$/.test(enteredOtp));
        return {
          success: isValid,
          authenticated: isValid,
          message: isValid ? 'OTP Validated Successfully' : 'Invalid 6-digit OTP passcode'
        };

      case 'DELIVERY_COMPLETED':
        return { success: true, parcelId: payload ? payload.parcelId : null, status: 'HANDED_OVER' };

      case 'REMITTANCE_SUBMIT':
        return { success: true, batchId: 'REMIT-' + Date.now(), status: 'PENDING_BANK_RECON' };

      case 'SELLING_PRICE_PUBLISH':
        return { success: true, publishedCount: payload ? (payload.variants || []).length : 1, timestamp: new Date().toISOString() };

      default:
        return { success: true, endpoint: endpointKey, timestamp: new Date().toISOString() };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AB_Mock };
}
