/**
 * AreaBazaar FRM - Field Regional Marketing Engine
 * Reactive State Management for Regional Catalog, Field Payments, Bank Remittances,
 * Customer-Order Intake, Fulfillment Tracking, and Proof-of-Delivery Handover.
 */

const FRM_STORAGE = {
  PRODUCTS: 'uwanbuy_admin_products',
  ORDERS: 'frm_customer_orders',
  UWB_ORDERS: 'uwanbuy_orders',
  PAYMENTS: 'frm_payment_reports',
  REMITTANCES: 'frm_remittance_batches',
  AGENTS: 'frm_regional_agents'
};

class FRMEngine {
  constructor() {
    this.init();
  }

  init() {
    this.ensureSeedData();
  }

  formatNaira(amountMinor) {
    const val = Math.round(Number(amountMinor) || 0) / 100;
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  formatPercent(pct) {
    return (Number(pct) || 0).toFixed(1) + '%';
  }

  genPasscode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  genId(prefix = 'FRM') {
    return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  // --- Seed Data Initialization ---
  ensureSeedData() {
    // 1. Agents
    let agents = JSON.parse(localStorage.getItem(FRM_STORAGE.AGENTS) || '[]');
    if (!agents || agents.length === 0) {
      agents = [
        { id: 'AGT-ILN-01', name: 'Kabir Olatunji', phone: '0803-441-2890', zone: 'Tanke Commercial Zone', hub: 'Tanke Hub, Ilorin', status: 'active', targetMonthlyMinor: 500000000 },
        { id: 'AGT-ILN-02', name: 'Zainab Danladi', phone: '0812-778-3312', zone: 'Fate / GRA Residential Area', hub: 'Fate Hub, Ilorin', status: 'active', targetMonthlyMinor: 450000000 },
        { id: 'AGT-ILN-03', name: 'Emeka Eze', phone: '0706-992-1145', zone: 'Sanrab / Unilorin Student Corridor', hub: 'Sanrab Hub, Ilorin', status: 'active', targetMonthlyMinor: 380000000 },
        { id: 'AGT-ILN-04', name: 'Bolanle Ajayi', phone: '0805-334-9011', zone: 'Offa Garage Wholesale Market', hub: 'Offa Garage Hub', status: 'active', targetMonthlyMinor: 600000000 }
      ];
      localStorage.setItem(FRM_STORAGE.AGENTS, JSON.stringify(agents));
    }

    // 2. Orders
    let orders = JSON.parse(localStorage.getItem(FRM_STORAGE.ORDERS) || '[]');
    if (!orders || orders.length === 0) {
      orders = [
        {
          id: 'ORD-FRM-50124',
          customerName: 'Madam Folake Alabi (Mega Provisions)',
          customerPhone: '0803-882-9901',
          customerAddress: '14 University Road, Tanke, Ilorin',
          hub: 'Tanke Hub, Ilorin',
          agentId: 'AGT-ILN-01',
          agentName: 'Kabir Olatunji',
          items: [
            { productId: 'uw_prd_1001', title: 'Refined Pure Vegetable Cooking Oil 5L', quantity: 4, unitPriceMinor: 1450000, lineTotalMinor: 5800000 },
            { productId: 'uw_prd_1002', title: 'Golden Penny Pure Granulated Sugar 50kg Bag', quantity: 1, unitPriceMinor: 8200000, lineTotalMinor: 8200000 }
          ],
          totalAmountMinor: 14000000,
          passcode: '6821',
          paymentMode: 'immediate_field_payment',
          paymentStatus: 'paid',
          fulfillmentStatus: 'out_for_delivery',
          trackingTimeline: [
            { stage: 'submitted', title: 'Order Submitted by Marketer', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Agent Kabir took order on ground' },
            { stage: 'collation', title: 'WHM Collation Complete', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'Bagged & sealed in Tanke staging lane' },
            { stage: 'warehouse_dispatched', title: 'Dispatched from Central Warehouse', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Truck TRK-ILN-04' },
            { stage: 'hub_arrived', title: 'Arrived at Tanke Regional Hub', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), note: 'Scanned in by Hub Coordinator' },
            { stage: 'out_for_delivery', title: 'Out for Local Handover', timestamp: new Date().toISOString(), note: 'Rider assigned: Saliu (0809-112-4455)' }
          ],
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'ORD-FRM-50125',
          customerName: 'Alhaji Bashir Mustapha',
          customerPhone: '0814-555-8822',
          customerAddress: 'Plot 7, Fate River Basin Estate, Ilorin',
          hub: 'Fate Hub, Ilorin',
          agentId: 'AGT-ILN-02',
          agentName: 'Zainab Danladi',
          items: [
            { productId: 'uw_prd_1004', title: 'Selected Fresh Yam Tubers (Medium Size)', quantity: 10, unitPriceMinor: 180000, lineTotalMinor: 1800000 },
            { productId: 'uw_prd_1005', title: 'Premium Smoked Catfish Pack (5 pieces)', quantity: 2, unitPriceMinor: 650000, lineTotalMinor: 1300000 }
          ],
          totalAmountMinor: 3100000,
          passcode: '4190',
          paymentMode: 'pay_on_delivery',
          paymentStatus: 'pending',
          fulfillmentStatus: 'hub_arrived',
          trackingTimeline: [
            { stage: 'submitted', title: 'Order Submitted by Marketer', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Agent Zainab order intake' },
            { stage: 'collation', title: 'WHM Collation Complete', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Freshness verified at agro collation' },
            { stage: 'warehouse_dispatched', title: 'Dispatched to Fate Hub', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), note: 'Transit van assigned' },
            { stage: 'hub_arrived', title: 'Stored at Fate Hub Cold / Chilled Unit', timestamp: new Date().toISOString(), note: 'Awaiting scheduled delivery slot' }
          ],
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 'ORD-FRM-50120',
          customerName: 'Dr. Timothy Adebayo',
          customerPhone: '0802-334-1188',
          customerAddress: 'Sanrab Plaza, Suite 3, Tanke',
          hub: 'Sanrab Hub, Ilorin',
          agentId: 'AGT-ILN-03',
          agentName: 'Emeka Eze',
          items: [
            { productId: 'uw_prd_3001', title: 'Smartphone Pro 256GB Dual SIM', quantity: 1, unitPriceMinor: 85000000, lineTotalMinor: 85000000 }
          ],
          totalAmountMinor: 85000000,
          passcode: '9044',
          paymentMode: 'bank_transfer',
          paymentStatus: 'paid',
          fulfillmentStatus: 'delivered',
          deliveredAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          pod: {
            recipientName: 'Dr. Timothy Adebayo',
            recipientPhone: '0802-334-1188',
            deliveredBy: 'Emeka Eze (FRM Marketer)',
            verifiedPasscode: '9044',
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            deliveryNotes: 'Device handed over intact in presence of customer. Boot test verified.'
          },
          trackingTimeline: [
            { stage: 'submitted', title: 'Order Submitted', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
            { stage: 'collation', title: 'Serial & IMEI QA Verified', timestamp: new Date(Date.now() - 3600000 * 10).toISOString() },
            { stage: 'warehouse_dispatched', title: 'Dispatched with Tamper Seal', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
            { stage: 'hub_arrived', title: 'Arrived Sanrab Hub', timestamp: new Date(Date.now() - 3600000 * 7).toISOString() },
            { stage: 'out_for_delivery', title: 'Out for Handover', timestamp: new Date(Date.now() - 3600000 * 6.5).toISOString() },
            { stage: 'delivered', title: 'Delivered & Passcode Confirmed', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() }
          ],
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ];
      localStorage.setItem(FRM_STORAGE.ORDERS, JSON.stringify(orders));
    }

    // 3. Payment Reports
    let payments = JSON.parse(localStorage.getItem(FRM_STORAGE.PAYMENTS) || '[]');
    if (!payments || payments.length === 0) {
      payments = [
        {
          id: 'REP-PAY-8801',
          orderId: 'ORD-FRM-50124',
          customerName: 'Madam Folake Alabi',
          customerPhone: '0803-882-9901',
          amountMinor: 14000000,
          channel: 'pos_terminal',
          posTerminalId: 'POS-TNK-091',
          bankName: 'Moniepoint MFB',
          transactionRef: 'MNP-TX-9921820',
          agentId: 'AGT-ILN-01',
          agentName: 'Kabir Olatunji',
          status: 'verified',
          remittanceStatus: 'unremitted',
          receiptDoc: 'moniepoint_slip_8801.png',
          notes: 'Customer paid full order sum via agent POS card swipe.',
          reportedAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'REP-PAY-8802',
          orderId: 'ORD-FRM-50120',
          customerName: 'Dr. Timothy Adebayo',
          customerPhone: '0802-334-1188',
          amountMinor: 85000000,
          channel: 'direct_bank_transfer',
          bankName: 'Guaranty Trust Bank',
          transactionRef: 'GTB-FT-49102830',
          agentId: 'AGT-ILN-03',
          agentName: 'Emeka Eze',
          status: 'verified',
          remittanceStatus: 'remitted',
          remittanceBatchId: 'REM-BATCH-102',
          receiptDoc: 'gtb_transfer_slip.pdf',
          notes: 'Corporate direct transfer for Smartphone Pro.',
          reportedAt: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: 'REP-PAY-8803',
          orderId: 'ORD-FRM-50118',
          customerName: 'Ayoade Supermarket',
          customerPhone: '0805-112-9933',
          amountMinor: 25000000,
          channel: 'cash_in_hand',
          bankName: 'Cash Collection',
          transactionRef: 'CSH-TNK-4410',
          agentId: 'AGT-ILN-01',
          agentName: 'Kabir Olatunji',
          status: 'verified',
          remittanceStatus: 'unremitted',
          receiptDoc: 'physical_receipt_slip.jpg',
          notes: 'Wholesale carton cooking oil cash payment.',
          reportedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
      localStorage.setItem(FRM_STORAGE.PAYMENTS, JSON.stringify(payments));
    }

    // 4. Remittances
    let remittances = JSON.parse(localStorage.getItem(FRM_STORAGE.REMITTANCES) || '[]');
    if (!remittances || remittances.length === 0) {
      remittances = [
        {
          id: 'REM-BATCH-102',
          batchCode: 'REM-ILN-202610-01',
          agentId: 'AGT-ILN-03',
          agentName: 'Emeka Eze',
          hub: 'Sanrab Hub, Ilorin',
          totalAmountMinor: 85000000,
          paymentReportIds: ['REP-PAY-8802'],
          destinationBank: 'First Bank of Nigeria (AreaBazaar Operations - 2038192810)',
          bankTellerRef: 'FBN-DEP-9948201',
          depositSlipFile: 'fbn_deposit_teller_102.jpg',
          status: 'hq_confirmed',
          confirmedBy: 'HQ Finance Controller',
          confirmedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          remittedAt: new Date(Date.now() - 3600000 * 11).toISOString(),
          notes: 'Remittance verified against corporate bank feed.'
        }
      ];
      localStorage.setItem(FRM_STORAGE.REMITTANCES, JSON.stringify(remittances));
    }
  }

  // --- Products Catalog ---
  getProducts() {
    return JSON.parse(localStorage.getItem(FRM_STORAGE.PRODUCTS) || '[]');
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  }

  // --- Customer Orders Management ---
  getOrders(filter = {}) {
    let orders = JSON.parse(localStorage.getItem(FRM_STORAGE.ORDERS) || '[]');
    if (filter.status && filter.status !== 'all') {
      orders = orders.filter(o => o.fulfillmentStatus === filter.status);
    }
    if (filter.agentId && filter.agentId !== 'all') {
      orders = orders.filter(o => o.agentId === filter.agentId);
    }
    if (filter.hub && filter.hub !== 'all') {
      orders = orders.filter(o => (o.hub || '').toLowerCase().includes(filter.hub.toLowerCase()));
    }
    return orders;
  }

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id) || null;
  }

  submitCustomerOrder(data) {
    const orders = this.getOrders();
    const orderId = this.genId('ORD-FRM');
    const passcode = this.genPasscode();

    const newOrder = {
      id: orderId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      hub: data.hub || 'Tanke Hub, Ilorin',
      agentId: data.agentId || 'AGT-ILN-01',
      agentName: data.agentName || 'Field Marketer',
      items: data.items || [],
      totalAmountMinor: data.totalAmountMinor || 0,
      passcode: passcode,
      paymentMode: data.paymentMode || 'pay_on_delivery',
      paymentStatus: data.paymentMode === 'immediate_field_payment' ? 'paid' : 'pending',
      fulfillmentStatus: 'submitted',
      trackingTimeline: [
        { stage: 'submitted', title: 'Order Submitted by Marketer', timestamp: new Date().toISOString(), note: `Captured by ${data.agentName || 'Marketer'}` }
      ],
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    localStorage.setItem(FRM_STORAGE.ORDERS, JSON.stringify(orders));

    // If immediate payment was taken, automatically generate initial payment report
    if (data.paymentMode === 'immediate_field_payment') {
      this.savePaymentReport({
        orderId: orderId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        amountMinor: data.totalAmountMinor,
        channel: data.immediatePaymentChannel || 'cash_in_hand',
        bankName: data.immediatePaymentBank || 'Direct Field Cash',
        transactionRef: data.immediatePaymentRef || `PAY-${orderId.slice(-5)}`,
        agentId: data.agentId,
        agentName: data.agentName,
        status: 'verified',
        notes: 'Immediate payment logged at order intake.'
      });
    }

    // Mirror to UwanBUY storefront orders so storefront admin can view
    try {
      const uwbOrders = JSON.parse(localStorage.getItem(FRM_STORAGE.UWB_ORDERS) || '[]');
      uwbOrders.unshift({
        id: orderId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        totalAmountMinor: data.totalAmountMinor,
        passcode: passcode,
        status: newOrder.paymentStatus === 'paid' ? 'paid' : 'awaiting_payment',
        channel: 'FRM Regional Marketing',
        hub: data.hub,
        itemsCount: (data.items || []).length,
        createdAt: newOrder.createdAt
      });
      localStorage.setItem(FRM_STORAGE.UWB_ORDERS, JSON.stringify(uwbOrders));
    } catch (e) {
      console.warn('Sync to UWB orders failed', e);
    }

    return { success: true, order: newOrder };
  }

  updateOrderStatus(orderId, newStatus, note = '', operator = 'FRM Logistics Coordinator') {
    const orders = this.getOrders();
    const o = orders.find(item => item.id === orderId);
    if (!o) return { success: false, error: 'Order not found' };

    o.fulfillmentStatus = newStatus;
    if (!o.trackingTimeline) o.trackingTimeline = [];

    const stageTitles = {
      submitted: 'Order Submitted',
      collation: 'WHM Collation in Progress',
      warehouse_dispatched: 'Dispatched from Warehouse',
      hub_arrived: 'Arrived at Regional Hub',
      out_for_delivery: 'Out for Local Handover',
      delivered: 'Delivered & Handover Confirmed',
      cancelled: 'Order Cancelled'
    };

    o.trackingTimeline.push({
      stage: newStatus,
      title: stageTitles[newStatus] || newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Updated by ${operator}`
    });

    if (newStatus === 'delivered' && !o.deliveredAt) {
      o.deliveredAt = new Date().toISOString();
      o.paymentStatus = 'paid';
    }

    localStorage.setItem(FRM_STORAGE.ORDERS, JSON.stringify(orders));
    return { success: true, order: o };
  }

  verifyDeliveryPasscode(orderId, inputPasscode, podData = {}) {
    const orders = this.getOrders();
    const o = orders.find(item => item.id === orderId);
    if (!o) return { success: false, error: 'Order record not found.' };

    if (o.fulfillmentStatus === 'delivered') {
      return { success: false, error: 'This order has already been marked as DELIVERED.' };
    }

    // Verify 4-digit passcode
    if (String(o.passcode).trim() !== String(inputPasscode).trim()) {
      return { success: false, error: 'Invalid 4-digit passcode! Handover cannot be completed without valid customer authorization.' };
    }

    // Success! Update delivery state
    o.fulfillmentStatus = 'delivered';
    o.paymentStatus = 'paid';
    o.deliveredAt = new Date().toISOString();
    o.pod = {
      recipientName: podData.recipientName || o.customerName,
      recipientPhone: podData.recipientPhone || o.customerPhone,
      relationship: podData.relationship || 'Self (Customer)',
      deliveredBy: podData.deliveredBy || o.agentName,
      verifiedPasscode: inputPasscode,
      deliveryNotes: podData.deliveryNotes || 'Passcode matched. Order items handed over.',
      timestamp: o.deliveredAt
    };

    if (!o.trackingTimeline) o.trackingTimeline = [];
    o.trackingTimeline.push({
      stage: 'delivered',
      title: 'Delivered & Customer Passcode Confirmed',
      timestamp: o.deliveredAt,
      note: `Verified by ${podData.deliveredBy || 'Marketer'}. Recipient: ${o.pod.recipientName}`
    });

    localStorage.setItem(FRM_STORAGE.ORDERS, JSON.stringify(orders));
    return { success: true, order: o };
  }

  // --- Payment Reports (Field Collections) ---
  getPaymentReports(filter = {}) {
    let reports = JSON.parse(localStorage.getItem(FRM_STORAGE.PAYMENTS) || '[]');
    if (filter.status && filter.status !== 'all') {
      reports = reports.filter(r => r.status === filter.status);
    }
    if (filter.remittanceStatus && filter.remittanceStatus !== 'all') {
      reports = reports.filter(r => r.remittanceStatus === filter.remittanceStatus);
    }
    if (filter.agentId && filter.agentId !== 'all') {
      reports = reports.filter(r => r.agentId === filter.agentId);
    }
    return reports;
  }

  savePaymentReport(data) {
    const reports = this.getPaymentReports();
    const reportId = this.genId('REP-PAY');

    const newReport = {
      id: reportId,
      orderId: data.orderId || 'N/A',
      customerName: data.customerName || 'Field Customer',
      customerPhone: data.customerPhone || '',
      amountMinor: Number(data.amountMinor) || 0,
      channel: data.channel || 'cash_in_hand',
      posTerminalId: data.posTerminalId || '',
      bankName: data.bankName || 'Cash Collection',
      transactionRef: data.transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      agentId: data.agentId || 'AGT-ILN-01',
      agentName: data.agentName || 'Field Marketer',
      status: 'verified',
      remittanceStatus: 'unremitted',
      receiptDoc: data.receiptDoc || 'electronic_receipt.png',
      notes: data.notes || '',
      reportedAt: new Date().toISOString()
    };

    reports.unshift(newReport);
    localStorage.setItem(FRM_STORAGE.PAYMENTS, JSON.stringify(reports));
    return { success: true, report: newReport };
  }

  // --- Payment Remittances (To HQ Bank) ---
  getRemittances(filter = {}) {
    let remittances = JSON.parse(localStorage.getItem(FRM_STORAGE.REMITTANCES) || '[]');
    if (filter.status && filter.status !== 'all') {
      remittances = remittances.filter(r => r.status === filter.status);
    }
    if (filter.agentId && filter.agentId !== 'all') {
      remittances = remittances.filter(r => r.agentId === filter.agentId);
    }
    return remittances;
  }

  createRemittanceBatch(data) {
    const remittances = this.getRemittances();
    const payments = this.getPaymentReports();
    const batchId = this.genId('REM-BATCH');
    const batchCode = `REM-ILN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10 + Math.random() * 90)}`;

    const selectedReportIds = Array.isArray(data.paymentReportIds) ? data.paymentReportIds : [];
    
    // Sum amount of selected payment reports
    let totalMinor = 0;
    selectedReportIds.forEach(id => {
      const rep = payments.find(p => p.id === id);
      if (rep) {
        totalMinor += (rep.amountMinor || 0);
        rep.remittanceStatus = 'remitted';
        rep.remittanceBatchId = batchId;
      }
    });

    if (totalMinor === 0 && data.manualAmountMinor) {
      totalMinor = data.manualAmountMinor;
    }

    const newBatch = {
      id: batchId,
      batchCode: batchCode,
      agentId: data.agentId || 'AGT-ILN-01',
      agentName: data.agentName || 'Kabir Olatunji',
      hub: data.hub || 'Tanke Hub, Ilorin',
      totalAmountMinor: totalMinor,
      paymentReportIds: selectedReportIds,
      destinationBank: data.destinationBank || 'First Bank of Nigeria (AreaBazaar Operations - 2038192810)',
      bankTellerRef: data.bankTellerRef || `FBN-DEP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      depositSlipFile: data.depositSlipFile || 'bank_teller_slip.jpg',
      status: 'submitted',
      remittedAt: new Date().toISOString(),
      notes: data.notes || 'Batch field collection remittance submitted for HQ finance confirmation.'
    };

    remittances.unshift(newBatch);
    localStorage.setItem(FRM_STORAGE.REMITTANCES, JSON.stringify(remittances));
    localStorage.setItem(FRM_STORAGE.PAYMENTS, JSON.stringify(payments));

    return { success: true, batch: newBatch };
  }

  confirmRemittanceByHQ(batchId, confirmedBy = 'HQ Finance Lead') {
    const remittances = this.getRemittances();
    const batch = remittances.find(r => r.id === batchId);
    if (!batch) return { success: false, error: 'Remittance batch not found.' };

    batch.status = 'hq_confirmed';
    batch.confirmedBy = confirmedBy;
    batch.confirmedAt = new Date().toISOString();

    localStorage.setItem(FRM_STORAGE.REMITTANCES, JSON.stringify(remittances));
    return { success: true, batch };
  }

  // --- Regional Agents ---
  getAgents() {
    return JSON.parse(localStorage.getItem(FRM_STORAGE.AGENTS) || '[]');
  }
}

// Global singleton instance
const frmEngine = new FRMEngine();
