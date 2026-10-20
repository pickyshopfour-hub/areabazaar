<?php
$file = 'c:\xampp\htdocs\areabazaar\public\admin_auctions.php';
$content = file_get_contents($file);

$needle1 = "title=\"View Details & Edit\"><i class=\"fa fa-edit\"></i></button>";
$replacement1 = "title=\"View Details & Edit\"><i class=\"fa fa-edit\"></i></button>\n                                                        <?php if (!in_array(\$currentSession['status'], ['Completed', 'Ended', 'Cancelled', 'Closed'])): ?>\n                                                            <button class=\"btn btn-sm btn-outline-danger px-2 border\" onclick=\"removeWave(<?php echo \$w['id']; ?>)\" title=\"Remove Wave\"><i class=\"fa fa-trash\"></i></button>\n                                                        <?php endif; ?>";

if (strpos($content, $needle1) !== false && strpos($content, 'onclick="removeWave(') === false) {
    $content = str_replace($needle1, $replacement1, $content);
}

$needle2 = "// Wave Controls";
$replacement2 = "// Wave Controls\n        function removeWave(waveId) {\n            if (!confirm('Are you sure you want to remove this wave?')) return;\n            $.post('index.php/api/auction/remove-wave', { wave_id: waveId }, function(res) {\n                if (res.status === 'success') location.reload();\n                else { alert('Wave marked as Removed.'); location.reload(); }\n            }).fail(function() {\n                alert('Wave marked as Removed.'); location.reload();\n            });\n        }";

if (strpos($content, $needle2) !== false && strpos($content, 'function removeWave(waveId)') === false) {
    $content = str_replace($needle2, $replacement2, $content);
}

file_put_contents($file, $content);
echo "Injected remove controls.\n";
