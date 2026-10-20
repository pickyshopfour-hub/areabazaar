<?php
$db = new mysqli('localhost', 'root', '', 'areabazaar');
$res = $db->query('DESCRIBE show_products');
while ($r = $res->fetch_assoc())
    echo $r['Field'] . "\n";
