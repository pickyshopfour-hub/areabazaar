<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

// Add initialization code
$old_init = "// Check role for Senior Admin access\n\$isSeniorAdmin = true; // Replace with real session check e.g., \$_SESSION['role'] == 'SeniorAdmin'\n?>";
$new_init = "\$waves = [];\nif (\$currentSession) {\n    \$stmt = \$db->prepare(\"SELECT * FROM waves WHERE session_id = ? ORDER BY is_default DESC, id ASC\");\n    \$stmt->execute([\$currentSession['id']]);\n    \$waves = \$stmt->fetchAll(PDO::FETCH_ASSOC);\n}\n\n// Check role for Senior Admin access\n\$isSeniorAdmin = true; // Replace with real session check e.g., \$_SESSION['role'] == 'SeniorAdmin'\n?>";

$content = str_replace($old_init, $new_init, $content);

file_put_contents($file, $content);
echo "Done.\n";
