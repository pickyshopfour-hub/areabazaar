<?php
require 'core/helpers/functions.php';
$db = getConn();
$sql = "EXPLAIN orders";
$stmt = $db->query($sql);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo $r['Field'] . " - " . $r['Type'] . "\n";
}
