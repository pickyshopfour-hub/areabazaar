<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

try {
    // High-value Payment Requests (to link to Reports)
    $db->exec("INSERT INTO payment_requests (user_id, amount, method, invoice_refindex, status) VALUES 
        (1, 1500000.00, 'Bank', 'AB-HIGHVAL01', 'Pending'),
        (2, 2500000.00, 'Agent', 'AB-HIGHVAL02', 'Pending')
    ");

    // High-value Payment Reports (AwaitingAdminApproval)
    $db->exec("INSERT INTO payment_reports (invoice_refindex, sender_name, amount_reported, status, submitter) VALUES 
        ('AB-HIGHVAL01', 'Customer Alpha', 1500000.00, 'AwaitingAdminApproval', 'customer'),
        ('AB-HIGHVAL02', 'Agent Beta', 2500000.00, 'AwaitingAdminApproval', 'agent')
    ");

    // High-value Bank Reports (orphaned and amount-mismatch)
    $db->exec("INSERT INTO bank_reports (bank_ref, amount, raw_narration, transaction_date, status) VALUES 
        ('BNK-ORP-15M', 15000000.00, 'Transfer from Whale User / NO REF', NOW(), 'orphaned'),
        ('BNK-MIS-2M', 2000000.00, 'Transfer Ref: AB-HIGHVAL01 Amount mismatched', NOW(), 'amount-mismatch')
    ");

    echo "Oversight data seeded successfully.\n";
}
catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
