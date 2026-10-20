<?php
$path = 'c:\xampp\htdocs\areabazaar\public\whm_auction_items.php';
$content = file_get_contents($path);

$target = '<td class="text-end pe-4">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-dark dropdown-toggle"';

$replacement = '<td class="text-end pe-4">
                            <div class="d-flex justify-content-end gap-1">
                                <button class="btn btn-sm btn-outline-dark" onclick="openQueryModal(${i.id}, \'OrderItem\')" title="Query Item"><i class="fa fa-question"></i></button>
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-outline-dark dropdown-toggle"';

$content = str_replace($target, $replacement, $content);
// Close the div we opened
$content = str_replace('</ul>
                            </div>
                        </td>', '</ul>
                                </div>
                            </div>
                        </td>', $content);

file_put_contents($path, $content);
echo "whm_auction_items.php query icon injected.\n";
?>
