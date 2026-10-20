<?php
$db = new PDO('mysql:host=localhost;dbname=areabazaar', 'root', '');
$t = 'auction_sessions';
echo "--- $t ---\n";
$cols = $db->query("DESCRIBE $t")->fetchAll(PDO::FETCH_ASSOC);
foreach ($cols as $c)
    echo $c['Field'] . " (" . $c['Type'] . ")\n";
?>
