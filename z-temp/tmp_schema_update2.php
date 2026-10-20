<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    // 1. Alter sba_acquisitions
    $db->exec("ALTER TABLE sba_acquisitions 
        MODIFY COLUMN assign_status ENUM('pending', 'approved', 'sbaAck', 'sbaRejected', 'cancelled', 'hanging') DEFAULT 'pending',
        MODIFY COLUMN supply_status ENUM('pending', 'acknowledged', 'supplied', 'QApassed', 'completed', 'QArejected', 'QArisk') DEFAULT 'pending',
        MODIFY COLUMN remittance_status ENUM('Pending', 'Paid', 'Acknowledged', 'Cancelled') DEFAULT 'Pending',
        ADD COLUMN admin_notes TEXT,
        ADD COLUMN whm_notes TEXT,
        ADD COLUMN sba_notes TEXT,
        ADD COLUMN session_id BIGINT UNSIGNED NULL,
        MODIFY COLUMN order_item_id BIGINT UNSIGNED NULL DEFAULT NULL
    ");

    // 2. Alter zbd_assignments
    $db->exec("ALTER TABLE zbd_assignments
        ADD COLUMN session_id BIGINT UNSIGNED NULL,
        ADD COLUMN order_id BIGINT UNSIGNED NULL,
        ADD COLUMN remittance_status ENUM('Pending', 'Cancelled', 'Paid', 'Acknowledged') DEFAULT 'Pending',
        ADD COLUMN admin_notes TEXT,
        ADD COLUMN whm_notes TEXT,
        ADD COLUMN zbdp_notes TEXT,
        MODIFY COLUMN progress_status ENUM('pending', 'accepted', 'loaded', 'dispatch_ready', 'confirmed', 'completed', 'bad_dispatch', 'dispatch_risk', 'cancelled') DEFAULT 'pending'
    ");

    // 3. Update existing sba_acquisitions order_item_id mapping (handle null implicitly if possible, wait, its fine as is)

    echo "Schema updated successfully!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
