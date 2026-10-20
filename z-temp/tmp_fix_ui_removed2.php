<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

$needle3 = "<?php if (\$currentSession['status'] == 'Active' && \$w['status'] != 'Active' && \$w['senior_admin_approval']): ?>";
$replacement3 = "<?php if (\$currentSession['status'] == 'Active' && \$w['status'] != 'Active' && \$w['status'] != 'Removed' && \$w['senior_admin_approval']): ?>";

if (strpos($content, $needle3) !== false) {
    $content = str_replace($needle3, $replacement3, $content);
}

file_put_contents($file, $content);
echo "Frontend wave UI controls guarded against Removed state further.\n";
