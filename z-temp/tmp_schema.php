<?php
$c = new mysqli('localhost', 'root', '', 'areabazaar');
if ($c->connect_error)
    die("Connection failed: " . $c->connect_error);

$res = $c->query("DESCRIBE waves");
if ($res) {
    echo "--- Table: waves ---\n";
    while ($r = $res->fetch_assoc()) {
        echo $r['Field'] . " | " . $r['Type'] . "\n";
    }
}
else {
    echo "Error describing waves\n";
}

$res = $c->query("DESCRIBE readiness_check_logs");
if ($res) {
    echo "\n--- Table: readiness_check_logs ---\n";
    while ($r = $res->fetch_assoc()) {
        echo $r['Field'] . " | " . $r['Type'] . "\n";
    }
}
else {
    echo "Error describing readiness_check_logs\n";
}
?>
