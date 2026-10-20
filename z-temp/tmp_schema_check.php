<?php
$c = new mysqli('localhost', 'root', '', 'areabazaar');
if ($c->connect_error)
    die("Connection failed: " . $c->connect_error);

$res = $c->query("DESCRIBE wave_items");
if ($res) {
    echo "--- Table: wave_items ---\n";
    while ($r = $res->fetch_assoc()) {
        echo $r['Field'] . " | " . $r['Type'] . "\n";
    }
}
else {
    echo "Error describing wave_items\n";
}
?>
