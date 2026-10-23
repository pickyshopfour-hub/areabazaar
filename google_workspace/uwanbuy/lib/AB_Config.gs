/**
 * AB_Config.gs
 * UwanBuy back-office (Google Workspace) — shared configuration.
 *
 * Copy the files in google_workspace/uwanbuy/lib/ into every UwanBuy workbook
 * script project (or publish them as one Apps Script Library).
 *
 * Secrets are NEVER hard-coded. Set them once per project in:
 *   Project Settings > Script Properties
 *     AB_API_BASE   e.g. https://your-domain.com/api
 *     AB_API_KEY    shared ingest key (X-AB-KEY header)
 *     AB_MOCK_MODE  "true" (default) uses AB_Mock fixtures; "false" calls the backend
 *     AB_ROLE_MAP   JSON {"user@domain.com":"SeniorAdmin","whm1@domain.com":"WHM"}
 *     AB_WHZ_ID     (WHM workbooks only) warehouse zone this workbook serves
 *     AB_DEV_ROLE   (mock mode only) role to impersonate while testing
 */

const AB = {
  STORE: 'uwanbuy',
  VERSION: '1.0.0',
  CURRENCY: 'NGN',

  PROPS: {
    API_BASE: 'AB_API_BASE',
    API_KEY: 'AB_API_KEY',
    MOCK: 'AB_MOCK_MODE',
    ROLE_MAP: 'AB_ROLE_MAP',
    WHZ_ID: 'AB_WHZ_ID',
    DEV_ROLE: 'AB_DEV_ROLE'
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

    // Monitors + generic row actions (ADM)
    MONITOR_PULL:         { method: 'get',  path: '/admin/monitor/order-items' },
    ROW_ACTION:           { method: 'post', path: '/admin/row-action' }
  },

  SHEETS: {
    // WHM_Fulfilment workbook
    ORDER_ITEMS: 'ORDER-ITEMS',
    DEMAND: 'SOURCING-DEMAND',
    SBA_BATCHES: 'SBA-BATCHES',
    INTAKE: 'INTAKE-QA',
    PACK: 'PACK-ALLOCATION',
    LABELS: 'LABELS',
    STAGING: 'STAGING-AREA-SORT',
    ZBD: 'ZBD-ASSIGNMENTS',
    BILLS: 'BILLS',
    // ADM_Catalog workbook
    PRODUCT_REGISTER: 'PRODUCT-REGISTER',
    VARIANT_REGISTER: 'VARIANT-REGISTER',
    SHOW_REGISTER: 'SHOW-PRODUCTS-REGISTER',
    STOCK_SCHEDULE: 'STOCK-SCHEDULE',
    SBA_PRICE_SCHEDULE: 'SBA-PRICE-SCHEDULE',
    HANDLING_COST: 'HANDLING-COST',
    SELLING_PRICE_SCHEDULE: 'SELLING-BASE-PRICE-SCHEDULE',
    SOURCING_SCHEDULE: 'PRODUCT-SOURCING-SCHEDULE',
    // ADM_OpsMonitor workbook
    MON_WHM: 'MON-WHM',
    MON_STAGING: 'MON-STAGING',
    MON_ZBD: 'MON-ZBD',
    MON_LMD: 'MON-LMD',
    MON_DELIVERY: 'MON-DELIVERY',
    // shared
    SYNC_LOG: 'SYNC-LOG'
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
