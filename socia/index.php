<?php
/**
 * API Entry Point & Router
 * AreaBazaar PHP/MySQL REST API
 */

require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Extract Route
require_once '../core/includes/Router.php';

$router = new Router();

// Auth Routes
$router->post('api/auth/login', ['AuthController', 'login']);
$router->post('api/auth/register', ['AuthController', 'register']);
$router->post('api/auth/staff-login', ['AuthController', 'staffLogin']);
$router->post('api/auth/staff-register', ['AuthController', 'staffRegister']);
$router->post('api/auth/logout', ['AuthController', 'logout']);
$router->get('api/auth/check', ['AuthController', 'checkSession']);
$router->post('api/auth/verify-user', ['AuthController', 'verifyUser']);


// Finance & Wallet Routes
$router->post('api/finance/deposit', ['FinanceController', 'createDepositRequest']);
$router->post('api/finance/report', ['FinanceController', 'reportPayment']);
$router->get('api/finance/status', ['FinanceController', 'checkStatus']);
$router->post('api/finance/approve-high-value', ['FinanceController', 'approveHighValueDeposit']);
$router->post('api/finance/reject-high-value', ['FinanceController', 'rejectHighValueDeposit']);

// Order & Cart Routes
$router->post('api/order/validate', ['OrderController', 'validateCart']);
$router->post('api/order/checkout', ['OrderController', 'checkout']);
$router->post('api/order/spotorder', ['OrderController', 'spotOrder']);
$router->get('api/order/history', ['OrderController', 'getHistory']);
$router->get('api/order/list', ['OrderController', 'listGlobalOrders']);
$router->get('api/order/details', ['OrderController', 'getDetails']);
$router->post('api/order/acknowledge', ['OrderController', 'acknowledgeDelivery']);

// Accounting & Partner Routes
$router->post('api/accounting/approve', ['AccountingController', 'approveCommissions']);
$router->post('api/accounting/trigger-credit', ['AccountingController', 'processBatchCrediting']);
$router->get('api/accounting/statement', ['AccountingController', 'getPartnerStatement']);

// Finance Admin Routes
$router->get('api/finance-admin/bank-reports', ['FinanceAdminController', 'listBankReports']);
$router->post('api/finance-admin/sync-bank', ['FinanceAdminController', 'syncBankReports']);
$router->get('api/finance-admin/customer-reports', ['FinanceAdminController', 'listCustomerPaymentReports']);
$router->get('api/finance-admin/agent-reports', ['FinanceAdminController', 'listAgentPaymentReports']);
$router->get('api/finance-admin/payment-requests', ['FinanceAdminController', 'listPaymentRequests']);
$router->post('api/finance-admin/verify-report', ['FinanceAdminController', 'verifyPaymentReport']);
$router->get('api/finance-admin/oversight', ['FinanceAdminController', 'getOversightFinance']);
$router->get('api/finance-admin/remittances', ['FinanceAdminController', 'getPartnerRemittances']);
$router->post('api/finance-admin/remittance-action', ['FinanceAdminController', 'processRemittanceAction']);

// Agent (FRM) Routes
$router->get('api/agent/customers', ['AgentController', 'listCustomers']);
$router->get('api/agent/payments', ['AgentController', 'listPayments']);
$router->post('api/agent/report', ['AgentController', 'reportPayment']);
$router->post('api/agent/remit', ['AgentController', 'reportRemittance']);

// Auction Routes
$router->post('api/auction/create', ['AuctionController', 'createSession']);
$router->post('api/auction/ingest-wave', ['AuctionController', 'ingestAdminWave']);
$router->post('api/auction/update-settings', ['AuctionController', 'updateSessionSettings']);
$router->get('api/auction/items', ['AuctionController', 'listAuctionItems']);
$router->post('api/auction/update-item', ['AuctionController', 'updateAuctionItem']);
$router->get('api/auction/orders', ['AuctionController', 'listAuctionOrders']);
$router->post('api/auction/update-order', ['AuctionController', 'updateAuctionOrder']);
$router->post('api/auction/verify', ['AuctionController', 'verifyReadiness']);
$router->get('api/auction/products', ['AuctionController', 'getActiveProducts']);
$router->post('api/auction/start', ['AuctionController', 'startAuction']);
$router->post('api/auction/pause-session', ['AuctionController', 'pauseSession']);
$router->post('api/auction/end-session', ['AuctionController', 'endSession']);
$router->post('api/auction/switch-wave', ['AuctionController', 'switchWave']);
$router->post('api/auction/update-wave', ['AuctionController', 'updateWave']);
$router->post('api/auction/remove-wave', ['AuctionController', 'removeWave']);
$router->post('api/auction/approve-wave', ['AuctionController', 'approveWave']);
$router->get('api/auction/check-autoswitch', ['AuctionController', 'checkAutoswitch']);
$router->post('api/auction/wave/add', ['AuctionController', 'addWave']);

// Partner Onboarding & Management Routes
$router->post('api/partner/add', ['PartnerController', 'addPartner']);
$router->post('api/partner/batch-ingest', ['PartnerController', 'batchIngest']);
$router->get('api/partner/pending', ['PartnerController', 'listPending']);
$router->get('api/partner/list', ['PartnerController', 'listAll']);
$router->post('api/partner/approve', ['PartnerController', 'approvePartner']);
$router->get('api/partner/profile', ['PartnerController', 'getPartnerProfile']);
$router->get('api/partner/stats', ['PartnerController', 'getDashboardStats']);

// Partner Portal Ext Routes (Chunk 9)
$router->get('api/partner-portal/sba-tasks', ['PartnerPortalController', 'getSbaTasks']);
$router->post('api/partner-portal/sba-action', ['PartnerPortalController', 'submitSbaAction']);
$router->get('api/partner-portal/sba-remittances', ['PartnerPortalController', 'getSbaRemittances']);
$router->get('api/partner-portal/zbd-tasks', ['PartnerPortalController', 'getZbdTasks']);
$router->get('api/partner-portal/zbd-remittances', ['PartnerPortalController', 'getZbdRemittances']);
$router->post('api/partner-portal/remittance-ack', ['PartnerPortalController', 'acknowledgeRemittance']);

// Logistics Benchmarks
$router->get('api/logistics/benchmarks', ['LogisticsController', 'getBenchmarks']);
$router->post('api/logistics/benchmark-toggle', ['LogisticsController', 'toggleBenchmarkHidden']);
$router->post('api/logistics/benchmark-delete', ['LogisticsController', 'deleteBenchmark']);
$router->post('api/logistics/benchmark-upload', ['LogisticsController', 'uploadBenchmarkCsv']);

// Query Thread Routes
$router->post('api/queries/add', ['QueryController', 'addQuery']);
$router->get('api/queries/list', ['QueryController', 'listQueries']);
$router->get('api/queries/thread', ['QueryController', 'getThread']);
$router->post('api/queries/respond', ['QueryController', 'submitResponse']);
$router->post('api/queries/assign', ['QueryController', 'assignQuery']);
$router->post('api/queries/set-priority', ['QueryController', 'setPriority']);
$router->post('api/queries/close', ['QueryController', 'closeQuery']);
$router->post('api/queries/close-cold', ['QueryController', 'closeColdQuery']);
$router->post('api/queries/add-note', ['QueryController', 'addResponseNote']);
$router->post('api/queries/prune-archive', ['QueryController', 'pruneToArchive']);
$router->get('api/queries/cold-audit', ['QueryController', 'getColdThreads']);

// Notification Routes
$router->get('api/notifications/unread', ['QueryController', 'getUnreadNotifications']);
$router->post('api/notifications/mark-read', ['QueryController', 'markNotificationsRead']);


// Product & Inventory Routes
$router->get('api/products', ['ProductController', 'listProducts']);
$router->post('api/product/add', ['ProductController', 'addProduct']);
$router->post('api/product/update', ['ProductController', 'updateProduct']);
$router->post('api/product/add-variant', ['ProductController', 'addVariant']);
$router->post('api/product/update-variant', ['ProductController', 'updateVariant']);
$router->post('api/product/import-csv', ['ProductController', 'importProductsByCsv']);
$router->post('api/product/approve', ['ProductController', 'approveProduct']);
$router->post('api/webhook/ingest', ['ProductController', 'batchIngestFromGS']);

// Webhook for Finance
$router->post('api/webhook/bank-reports', ['WebhookController', 'receiveBankReports']);

// Staff Management Routes
$router->get('api/staff/list', ['StaffController', 'listStaff']);
$router->post('api/staff/add', ['StaffController', 'addStaff']);
$router->post('api/staff/update', ['StaffController', 'updateStaff']);
$router->get('api/staff/profile', ['StaffController', 'getStaffProfile']);

// Oversight Entities Routes
$router->get('api/oversight/list', ['OversightController', 'listEntities']);
$router->post('api/oversight/create', ['OversightController', 'createEntity']);
$router->post('api/oversight/update-status', ['OversightController', 'updateStatus']);
$router->post('api/oversight/assign-officer', ['OversightController', 'assignChargeOfficer']);
$router->post('api/oversight/delete-entity', ['OversightController', 'deleteEntity']);
$router->post('api/oversight/batch-ingest', ['OversightController', 'batchIngest']);

// Query Routes
$router->post('api/query/add', ['StaffController', 'addQuery']);

// WHM Routes
$router->get('api/whm/items-triage', ['WhmController', 'getItemsTriage']);
$router->get('api/whm/stats', ['WhmController', 'getDashboardStats']);
$router->get('api/whm/prepcheck-pull', ['WhmController', 'pullPrepCheckData']);
$router->post('api/whm/prepcheck-ingest', ['WhmController', 'ingestPrepCheckReport']);
$router->post('api/whm/mark-packed', ['WhmController', 'markItemPacked']);
$router->post('api/whm/mass-update', ['WhmController', 'massUpdate']);
$router->get('api/whm/export-orders', ['WhmController', 'exportOrders']);
// WHM Order & Order Items Mgt
$router->get('api/whm/orders-mgt', ['WhmController', 'getOrdersMgt']);
$router->get('api/whm/order-items-mgt', ['WhmController', 'getOrderItemsMgt']);
$router->post('api/whm/update-item-action', ['WhmController', 'updateItemAction']);
$router->post('api/whm/update-item-status', ['WhmController', 'updateItemStatus']);
$router->post('api/whm/export-orders-sheet', ['WhmController', 'exportOrdersSheet']);
$router->post('api/whm/export-items-sheet', ['WhmController', 'exportItemsSheet']);

// WHM SBA & ZBDP Logistics Route
$router->get('api/whm/sba-acquisitions', ['WhmController', 'getSbaAcquisitions']);
$router->post('api/whm/sba-assign', ['WhmController', 'assignSba']);
$router->post('api/whm/sba-supply-status', ['WhmController', 'updateSbaSupplyStatus']);

$router->get('api/whm/zbd-dispatch', ['WhmController', 'getZbdDispatch']);
$router->post('api/whm/zbd-assign', ['WhmController', 'assignZbd']);
$router->post('api/whm/zbd-progress', ['WhmController', 'updateZbdProgress']);

// Admin Dispatch Oversight
$router->get('api/whm/sba-dispatch-all', ['WhmController', 'getSbaDispatchAll']);
$router->post('api/whm/sba-assign-status', ['WhmController', 'updateSbaAssignStatus']);

// Dispatch
$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
?>
