<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    $db->exec("ALTER TABLE payment_reports ADD COLUMN submitter_id INT NULL AFTER submitter");
    echo "Column submitter_id added.\n";
}
catch (PDOException $e) {
    echo "Error adding column: " . $e->getMessage() . "\n";
}

// Update existing agent reports to have a dummy submitter_id of 1
try {
    $db->exec("UPDATE payment_reports SET submitter_id = 1 WHERE submitter = 'agent'");
    echo "Existing agent reports updated.\n";
}
catch (PDOException $e) {
    echo "Error updating rows: " . $e->getMessage() . "\n";
}
