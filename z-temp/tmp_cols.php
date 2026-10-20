<?php
$db = new PDO('mysql:host=localhost;dbname=areabazaar', 'root', '');
$tables = ['wallets', 'partner_wallets', 'payment_requests', 'payment_reports', 'bank_reports'];
foreach ($tables as $t) {
    try {
        echo "--- $t ---\n";
        $cols = $db->query("DESCRIBE $t")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($cols as $c)
            echo $c['Field'] . " (" . $c['Type'] . ")\n";
        echo "\n";
    }
    catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
