<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

$old_content = "// Check role for Senior Admin access\n\$isSeniorAdmin = true;";
$new_content = "\$waves = [];\nif (\$currentSession) {\n    \$stmt = \$db->prepare(\"SELECT * FROM waves WHERE session_id = ? ORDER BY is_default DESC, id ASC\");\n    \$stmt->execute([\$currentSession['id']]);\n    \$waves = \$stmt->fetchAll(PDO::FETCH_ASSOC);\n}\n\n// Check role for Senior Admin access\n\$isSeniorAdmin = true;";

if (strpos($content, $old_content) !== false) {
    if (strpos($content, '$waves = [];') === false) {
        $content = str_replace($old_content, $new_content, $content);
        file_put_contents($file, $content);
        echo "Successfully added \$waves variable.";
    }
    else {
        echo "Already contains \$waves.";
    }
}
else {
    echo "Could not find target content.";
}
