<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

$needle = "// Check role for Senior Admin access";
$replacement = "\$waves = [];\nif (\$currentSession) {\n    \$stmt = \$db->prepare(\"SELECT * FROM waves WHERE session_id = ? ORDER BY is_default DESC, id ASC\");\n    \$stmt->execute([\$currentSession['id']]);\n    \$waves = \$stmt->fetchAll(PDO::FETCH_ASSOC);\n}\n\n// Check role for Senior Admin access";

if (strpos($content, '$waves = [];') === false) {
    if (strpos($content, $needle) !== false) {
        $content = str_replace($needle, $replacement, $content);
        file_put_contents($file, $content);
        echo "Waves query added correctly.\n";
    }
    else {
        echo "Failed to find needle.\n";
    }
}
else {
    echo "Waves already added.\n";
}
