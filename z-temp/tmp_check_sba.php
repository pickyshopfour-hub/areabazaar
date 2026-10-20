<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $stmt = $db->prepare("SELECT id, sba_id, base_product_id, assign_status, supply_status, total_qty, unit_cost FROM sba_acquisitions");
    $stmt->execute();
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
}
catch (Exception $e) {
    echo "Error checking: " . $e->getMessage();
}
