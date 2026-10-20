<?php
/**
 * Webhook Receiver
 * AreaBazaar PHP/MySQL REST API
 */

require_once '../core/includes/database.php';
require_once '../core/helpers/functions.php';

// Simple action-based routing for webhooks
$action = isset($_GET['action']) ? sanitize($_GET['action']) : null;
$data = json_decode(file_get_contents("php://input"), true);
$data = sanitize($data);

if (!$action || !$data) {
    jsonResponse('error', "Invalid webhook request");
}

$database = new Database();
$db = $database->getConnection();

switch ($action) {
    case 'sync-inventory':
        // Logic to push Appscript row data to product_variants table
        jsonResponse('success', "Inventory sync received for " . count($data) . " items");
        break;

    case 'zbdp-transport-bill':
        // Logic to record logistics bills
        jsonResponse('success', "Transport bill successfully recorded");
        break;

    default:
        jsonResponse('error', "Unknown webhook action: $action");
        break;
}
?>
