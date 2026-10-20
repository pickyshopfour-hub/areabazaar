<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

$needle1 = "<span class=\"badge bg-<?php echo \$w['status'] == 'Active' ? 'success' : (\$w['status'] == 'Replaced' ? 'secondary' : 'warning'); ?> rounded-pill\">";
$replacement1 = "<span class=\"badge bg-<?php echo \$w['status'] == 'Removed' ? 'danger' : (\$w['status'] == 'Active' ? 'success' : (\$w['status'] == 'Replaced' ? 'secondary' : 'warning')); ?> rounded-pill\">";

if (strpos($content, $needle1) !== false) {
    $content = str_replace($needle1, $replacement1, $content);
}

$needle2 = "<?php if (!in_array(\$currentSession['status'], ['Completed', 'Ended', 'Cancelled', 'Closed'])): ?>";
$replacement2 = "<?php if (!in_array(\$currentSession['status'], ['Completed', 'Ended', 'Cancelled', 'Closed']) && \$w['status'] != 'Removed'): ?>";

if (strpos($content, $needle2) !== false) {
    $content = str_replace($needle2, $replacement2, $content);
}

file_put_contents($file, $content);
echo "Frontend wave UI updated.\n";
