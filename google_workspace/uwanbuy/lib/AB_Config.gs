/**
 * AB_Config.gs
 * UwanBuy back-office (Google Workspace) — shared configuration.
 *
 * Copy the files in google_workspace/uwanbuy/lib/ into every UwanBuy workbook
 * script project (or publish them as one Apps Script Library).
 *
 * Secrets are NEVER hard-coded. Set them once per project in:
 *   Project Settings > Script Properties
 *     AB_API_BASE          e.g. https://your-domain.com/api
 *     AB_API_KEY           shared ingest key (X-AB-KEY header)
 *     AB_MOCK_MODE         "true" (default) uses AB_Mock fixtures; "false" calls the backend
 *     AB_ROLE_MAP          JSON {"user@domain.com":"SeniorAdmin","whm1@domain.com":"WHM"}
 *     AB_WHZ_ID            (WHM workbooks only) warehouse zone this workbook serves
 *     AB_DEV_ROLE          (mock mode only) role to impersonate while testing
 *     AB_DB_MASTER_SHEET_ID Google Sheet ID of UwanBuy_DB_Master staging hub
 *     AB_SYNC_MODE         "INSTANT" or "DEFERRED" (default: "DEFERRED")
 */

const AB = {
  STORE: 'uwanbuy',
  VERSION: '1.1.0',
  CURRENCY: 'NGN',

  SYNC_MODES: {
    INSTANT: 'INSTANT',
    DEFERRED: 'DEFERRED'
  },

  PROPS: {
    API_BASE: 'AB_API_BASE',
    API_KEY: 'AB_API_KEY',
    MOCK: 'AB_MOCK_MODE',
    ROLE_MAP: 'AB_ROLE_MAP',
    WHZ_ID: 'AB_WHZ_ID',
    DEV_ROLE: 'AB_DEV_ROLE',
    DB_MASTER_ID: 'AB_DB_MASTER_SHEET_ID',
    SYNC_MODE: 'AB_SYNC_MODE'
  },

  // Backend REST routes (relative to AB_API_BASE). Keys are used by abApi().
  ENDPOINTS: {
    // Catalogue / schedules (ADM)
    PRODUCTS_LIST:        { method: 'get',  path: '/products/register' },
    VARIANTS_LIST:        { method: 'get',  path: '/products/variants-register' },
    SHOW_PRODUCTS_LIST:   { method: 'get',  path: '/products/show-register' },
    SCHEDULES_GET:        { method: 'get',  path: '/products/schedules' },
    SCHEDULES_SUBMIT:     { method: 'post', path: '/products/schedules/submit' },
    SCHEDULES_APPROVE:    { method: 'post', path: '/products/schedules/approve' },
    SELLING_PRICE_PUBLISH:{ method: 'post', path: '/products/selling-price/publish' },

    // WHM fulfilment
    ORDER_ITEMS_PULL:     { method: 'get',  path: '/whm/order-items' },
    RESOLUTION_POST:      { method: 'post', path: '/whm/resolution' },
    SBA_BATCHES_POST:     { method: 'post', path: '/whm/sba-acquisitions/assign' },
    INTAKE_POST:          { method: 'post', path: '/whm/intake' },
    ITEM_STATUS_POST:     { method: 'post', path: '/whm/order-items/status' },
    ZBD_ASSIGN_POST:      { method: 'post', path: '/whm/zbd-assignments/assign' },
    BILLS_POST:           { method: 'post', path: '/whm/bills' },

    // FRM Field & Delivery Handover
    POS_ORDERS_POST:      { method: 'post', path: '/frm/pos/order' },
    DELIVERY_VERIFY_OTP:  { method: 'post', path: '/frm/delivery/verify-otp' },
    DELIVERY_COMPLETED:   { method: 'post', path: '/frm/delivery/completed' },
    REMITTANCE_SUBMIT:    { method: 'post', path: '/frm/remittance/submit' },

    // Monitors + generic row actions (ADM)
    MONITOR_PULL:         { method: 'get',  path: '/admin/monitor/order-items' },
    ROW_ACTION:           { method: 'post', path: '/admin/row-action' }
  },

  SHEETS: {
    // Central DB-Sheet (UwanBuy_DB_Master)
    DB_PRODUCTS: 'DB_PRODUCTS',
    DB_VARIANTS: 'DB_VARIANTS',
    DB_SBA_PRICES: 'DB_SBA_PRICES',
    DB_ORDERS_FEED: 'DB_ORDERS_FEED',
    DB_DISPATCH_QUEUE: 'DB_DISPATCH_QUEUE',
    DB_SYNC_LOG: 'DB_SYNC_LOG',

    // WHM_Fulfilment workbook
    ORDER_ITEMS: 'ORDER-ITEMS-INGEST',
    DEMAND: 'SOURCING-DEMAND',
    SBA_BATCHES: 'SBA-ACQUISITIONS',
    INTAKE: 'INTAKE-QA',
    PACK: 'PACK-ALLOCATION',
    LABELS: 'LABELS-GENERATOR',
    STAGING: 'STAGING-AREA-SORT',
    ZBD: 'ZBD-DISPATCH-MANIFEST',
    BILLS: 'COMPILED-BILLS',

    // ADM_Control_Center workbook
    PRODUCT_REGISTER: 'PRODUCT-REGISTER',
    VARIANT_REGISTER: 'VARIANT-REGISTER',
    SHOW_REGISTER: 'SHOW-PRODUCTS-REGISTER',
    STOCK_SCHEDULE: 'STOCK-SCHEDULE',
    SBA_PRICE_SCHEDULE: 'SBA-PRICE-SCHEDULE',
    HANDLING_COST: 'HANDLING-COST',
    SELLING_PRICE_SCHEDULE: 'SELLING-BASE-PRICE-SCHEDULE',
    STAFF_REGISTRY: 'STAFF-REGISTRY',
    AUCTION_SESSIONS: 'AUCTION-SESSIONS',
    WAVE_SCHEDULE: 'WAVE-SCHEDULE',
    BANK_FEED: 'BANK-FEED-SYNC',
    PAYMENT_RECON: 'PAYMENT-RECON',

    // FRM_Field_Operations workbook
    SELLING_CATALOG_VIEW: 'SELLING-CATALOG-VIEW',
    AREA_CUSTOMERS: 'AREA-CUSTOMERS',
    PROXY_SPOT_ORDERS: 'PROXY-SPOT-ORDERS',
    FIELD_PAYMENTS: 'FIELD-PAYMENTS-REPORT',
    BATCH_REMITTANCES: 'BATCH-REMITTANCES',
    AREA_INBOUND: 'AREA-INBOUND-RECEIVING',
    DELIVERY_HANDOVER: 'CUSTOMER-DELIVERY-HANDOVER',

    // Companion Loading Sheets
    PRODUCT_INGEST_LOADING: 'PRODUCT-INGEST-LOADING',
    VARIANT_INGEST_LOADING: 'VARIANT-INGEST-LOADING',
    PRICE_UPDATE_LOADING: 'PRICE-UPDATE-LOADING',
    MANUAL_ORDER_LOADING: 'MANUAL-ORDER-INGEST-LOADING',
    INTAKE_RECEIVING_LOADING: 'INTAKE-RECEIVING-LOADING',
    CUSTOMER_ENROLLMENT_LOADING: 'CUSTOMER-ENROLLMENT-LOADING',

    // Common
    ARCHIVE_VAULT: 'ARCHIVE-LOADING-VAULT',
    SYNC_QUEUE: 'SYNC-QUEUE',
    CONFIG: 'CONFIG'
  },

  // Business defaults (overridable per schedule row)
  DEFAULTS: {
    MARGIN_PCT: 15,
    ROUND_TO_MINOR: 5000,          // round selling prices up to nearest ₦50
    COST_VARIANCE_ALERT_PCT: 10,   // SBA actual vs benchmark
    STAGING_DWELL_ALERT_HOURS: 6,
    LMD_DWELL_ALERT_HOURS: 24
  }
};

/** Read a Script Property with a fallback (safe outside Apps Script). */
function abGetProp_(key, fallback) {
  try {
    const v = PropertiesService.getScriptProperties().getProperty(key);
    return (v === null || v === undefined || v === '') ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

/** Mock mode is ON unless AB_MOCK_MODE is explicitly "false". */
function abIsMock() {
  return String(abGetProp_(AB.PROPS.MOCK, 'true')).toLowerCase() !== 'false';
}

/** Get the configured sync mode ('INSTANT' | 'DEFERRED'). */
function abGetSyncMode() {
  return abGetProp_(AB.PROPS.SYNC_MODE, AB.SYNC_MODES.DEFERRED);
}

/** Get the Central DB-Sheet ID (UwanBuy_DB_Master). */
function abGetDbMasterId() {
  return abGetProp_(AB.PROPS.DB_MASTER_ID, '');
}

/** Get the API Base URL. */
function abGetApiBase() {
  return abGetProp_(AB.PROPS.API_BASE, 'https://api.areabazaar.com/v1');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AB, abGetProp_, abIsMock, abGetSyncMode, abGetDbMasterId, abGetApiBase };
}
