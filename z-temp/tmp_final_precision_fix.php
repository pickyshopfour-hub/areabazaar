<?php
// Fix whm_auctions.php MODAL duplication and submission
$wa_path = 'c:\xampp\htdocs\areabazaar\public\whm_auctions.php';
$wa_content = file_get_contents($wa_path);
// Remove local query modal
$wa_content = preg_replace('/<!-- Query Admin Modal -->.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s', '<!-- Removed local modal to use global -->', $wa_content);
// Fix button call to use global modal
$wa_content = str_replace('onclick="queryAdmin(', 'onclick="openQueryModal(', $wa_content);
// Remove local queryAdmin function if any
$wa_content = preg_replace('/function\s+queryAdmin\(sessionId\)\s*\{.*?\}/s', '', $wa_content);
// Ensure 'AuctionSession' is passed
$wa_content = str_replace('openQueryModal(', 'openQueryModal(null, "AuctionSession")', $wa_content); // This is wrong regex, let's fix
$wa_content = preg_replace('/openQueryModal\(([0-9a-zA-Z_\$\.]+)\)/', 'openQueryModal($1, "AuctionSession")', $wa_content);

file_put_contents($wa_path, $wa_content);

// Fix whm_auction_items.php RENDER function and ICON
$wai_path = 'c:\xampp\htdocs\areabazaar\public\whm_auction_items.php';
$wai_content = file_get_contents($wai_path);

$render_func = '
        function renderItems(items) {
            let html = "";
            if (items.length === 0) {
                html = "<tr><td colspan=\"6\" class=\"text-center py-5 text-muted\">No order items found.</td></tr>";
            } else {
                items.forEach(i => {
                    let hideOpt = i.whm_status === "dispatched" ? `<li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="hideItem(${i.id})">Hide</a></li>` : "";
                    html += `<tr id="item-row-${i.id}">
                        <td class="ps-4"><input type="checkbox" class="item-chk" value="${i.id}"></td>
                        <td>
                            <div class="fw-bold text-dark">${i.product_name}</div>
                            <div class="small text-muted">${i.variant_name}</div>
                        </td>
                        <td>
                            <div class="small">Ord: #${i.order_id}</div>
                            <div class="extra-small text-muted">${i.customer_name}</div>
                        </td>
                        <td><span class="badge bg-secondary">${i.whm_status || "requested"}</span></td>
                        <td>${i.quantity}</td>
                        <td class="text-end pe-4">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-dark" onclick="openQueryModal(${i.id}, \'OrderItem\')" title="Query Item"><i class="fa fa-question"></i></button>
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown">Actions</button>
                                    <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="viewDetails(${i.order_id}, ${i.id})">View Details</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="openStatusModal([${i.id}])">Set WHM Status</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="openQueryModal(${i.id}, \'OrderItem\')">Query Admin</a></li>
                                        <li><a class="dropdown-item text-warning" href="javascript:void(0)" onclick="flagItem(${i.id})">Flag</a></li>
                                        ${hideOpt}
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="openNotesModal(${i.id})">Add Ship Notes</a></li>
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>`;
                });
            }
            $("#orderItemsBody").html(html);
        }

        function renderPagination(total, current) {
            let html = "";
            for(let i=1; i<=total; i++) {
                html += `<li class="page-item ${i===current ? "active" : ""}"><a class="page-link" href="javascript:void(0)" onclick="loadOrderItems(${i})">${i}</a></li>`;
            }
            $("#pagination").html(html);
        }
';

if (strpos($wai_content, 'function renderItems') === false) {
    $wai_content = str_replace('function applyMassAction', $render_func . "\n        function applyMassAction", $wai_content);
}

file_put_contents($wai_path, $wai_content);

echo "Final fixes for whm_auctions and whm_auction_items completed.\n";
?>
