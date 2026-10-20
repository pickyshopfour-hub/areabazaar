<?php
require_once 'core/includes/database.php';
$db = (new Database())->getConnection();

$db->exec("SET FOREIGN_KEY_CHECKS = 0;");
$db->exec("TRUNCATE TABLE payment_requests");
$db->exec("TRUNCATE TABLE payment_reports");
$db->exec("TRUNCATE TABLE bank_reports");
$db->exec("SET FOREIGN_KEY_CHECKS = 1;");

$statuses_bank = ['Unreconciled', 'Reconciled', 'orphaned', 'amount-mismatch'];
$statuses_report = ['Pending', 'Matched', 'Flagged', 'unremitted', 'amount-mismatch'];
$submitters = ['customer', 'agent', 'admin'];
$statuses_request = ['Pending', 'Paid', 'Failed'];

for ($i = 1; $i <= 40; $i++) {
    $ref = "AB-" . str_pad($i, 5, '0', STR_PAD_LEFT);
    $user_id = rand(1, 10);
    $amount = rand(500, 50000);
    $status = $statuses_request[array_rand($statuses_request)];

    $stmt = $db->prepare("INSERT INTO payment_requests (user_id, amount, method, status, invoice_refindex, time_created) VALUES (?, ?, 'Bank Transfer', ?, ?, NOW())");
    $stmt->execute([$user_id, $amount, $status, $ref]);
    $req_id = $db->lastInsertId();

    $sender = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Agent X', 'Mary Anne'][rand(0, 4)];
    $r_status = $statuses_report[array_rand($statuses_report)];
    $submitter = $submitters[array_rand($submitters)];

    $stmt2 = $db->prepare("INSERT INTO payment_reports (request_id, invoice_refindex, sender_name, amount_reported, time_reported, status, submitter) VALUES (?, ?, ?, ?, NOW(), ?, ?)");
    $stmt2->execute([$req_id, $ref, $sender, $amount, $r_status, $submitter]);

    $bank_ref = "R" . str_pad(rand(1, 999999999), 9, '0', STR_PAD_LEFT);
    $narrations = [
        "Transfer from $sender / $ref",
        "Payment REF $ref thanks",
        "Remittance REF " . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT)
    ];
    $narration = $narrations[array_rand($narrations)];
    $b_status = $statuses_bank[array_rand($statuses_bank)];

    $stmt3 = $db->prepare("INSERT INTO bank_reports (bank_ref, amount, raw_narration, transaction_date, status) VALUES (?, ?, ?, NOW(), ?)");
    $stmt3->execute([$bank_ref, $amount, $narration, $b_status]);
}

echo "Database seeded successfully!\n";
