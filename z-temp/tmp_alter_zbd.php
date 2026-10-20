<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $db->query("ALTER TABLE zbd_assignments ADD COLUMN IF NOT EXISTS session_id VARCHAR(100) NULL DEFAULT NULL");
    $db->query("ALTER TABLE zbd_assignments ADD COLUMN IF NOT EXISTS order_id INT(11) NULL DEFAULT NULL");
    $db->query("ALTER TABLE zbd_assignments ADD COLUMN IF NOT EXISTS remittance_status ENUM('pending', 'cancelled', 'paid', 'acknowledged') DEFAULT 'pending'");
    $db->query("ALTER TABLE zbd_assignments ADD COLUMN IF NOT EXISTS admin_notes TEXT NULL");
    $db->query("ALTER TABLE zbd_assignments ADD COLUMN IF NOT EXISTS whm_notes TEXT NULL");
    $db->query("ALTER TABLE zbd_assignments ADD COLUMN IF NOT EXISTS zbdp_notes TEXT NULL");

    // update enum for progress_status
    $db->query("ALTER TABLE zbd_assignments MODIFY progress_status ENUM('unassigned', 'pending', 'accepted', 'rejected', 'withdrawn', 'loaded', 'dispatch_ready', 'dispatch_risk', 'bad_dispatch', 'confirmed', 'completed', 'cancelled') DEFAULT 'unassigned'");

    echo "DB Schema Updated for ZBD Assignments.";
}
catch (Exception $e) {
    echo "Error checking: " . $e->getMessage();
}
