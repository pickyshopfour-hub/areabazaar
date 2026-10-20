<?php
/**
 * Phase 0 — Seed global_settings with authentication and notification config keys
 * Run once: http://localhost/areabazaar/public/seed_phase0_settings.php
 */
require_once '../core/includes/database.php';
$db = (new Database())->getConnection();

$settings = [
    // Auth
    ['session_lifetime_minutes', '120'],
    ['session_secure_cookie', '0'], // Set to 1 on HTTPS production

    // Notification delivery
    ['notif_poll_interval_seconds', '30'],
    ['notif_email_enabled', '0'],
    ['notif_sms_enabled', '0'],
    ['notif_email_from', 'no-reply@areabazaar.com'],
    ['notif_sms_gateway_url', ''],
    ['notif_sms_api_key', ''],
    ['notif_sms_sender_id', 'AreaBazaar'],
];

$stmt = $db->prepare("INSERT IGNORE INTO global_settings (setting_key, setting_value) VALUES (?, ?)");
$inserted = 0;
foreach ($settings as [$key, $val]) {
    if ($stmt->execute([$key, $val])) {
        $inserted += $stmt->rowCount();
        echo "✔ {$key} = {$val}<br>\n";
    }
    else {
        echo "✖ Failed: {$key}<br>\n";
    }
}
echo "<br><strong>Done. {$inserted} new settings inserted (existing keys skipped).</strong>\n";
?>
