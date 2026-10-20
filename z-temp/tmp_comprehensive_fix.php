<?php
/**
 * Comprehensive Fix for Dashboards
 */

// 1. Fix QueryController.php
$qc_path = 'c:\xampp\htdocs\areabazaar\core\Controllers\QueryController.php';
$qc_content = file_get_contents($qc_path);
$qc_fix = '
    public function addQuery($data)
    {
        // Alias Mapping for flexibility across different legacy forms
        $subjectId = $data[\'subject_id\'] ?? $data[\'item_id\'] ?? $data[\'session_id\'] ?? $data[\'order_id\'] ?? 0;
        $subjectType = $data[\'subject_type\'] ?? $data[\'type\'] ?? $data[\'context\'] ?? \'General\';
        $note = $data[\'note\'] ?? $data[\'description\'] ?? $data[\'message\'] ?? null;
        
        $data[\'subject_id\'] = $subjectId;
        $data[\'subject_type\'] = $subjectType;
        $data[\'note\'] = $note;

        if (empty($subjectType) || !isset($subjectId) || empty($note)) {
            return [\'status\' => \'error\', \'message\' => \'Missing required fields for query (Type, ID, or Note)\'];
        }

        if ($this->queryModel->create($data)) {
            return [\'status\' => \'success\', \'message\' => \'Query recorded\'];
        }

        return [\'status\' => \'error\', \'message\' => \'Failed to record query\'];
    }';
$qc_content = preg_replace('/public function addQuery\(\$data\)\s*\{.*?\}/s', $qc_fix, $qc_content);
file_put_contents($qc_path, $qc_content);

echo "Fixed QueryController.php\n";

// 2. Fix Dashboards
$dir = 'c:\xampp\htdocs\areabazaar\public';
$files = glob("$dir/*.php");

foreach ($files as $file) {
    if (strpos($file, 'dashboard') === false && strpos($file, 'admin') === false && strpos($file, 'whm') === false) {
        continue;
    }
    $basename = basename($file);
    $content = file_get_contents($file);

    // 2a. Ensure Bootstrap JS is present
    if (strpos($content, 'bootstrap.bundle.min.js') === false) {
        $bs_script = '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>';
        $content = str_replace('</body>', $bs_script . "\n" . '</body>', $content);
    }

    // 2b. Restore whm_auction_items.php renderItems
    if ($basename === 'whm_auction_items.php') {
        if (strpos($content, 'function renderItems') === false) {
            $render_items_js = '
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
                            <div class="fw-bold">${i.product_name}</div>
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
                                    <button class="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown">Actions</button>
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
            $content = str_replace('function applyMassAction', $render_items_js . "\n        function applyMassAction", $content);
        }
    }

    // 2c. Restore whm_auction_orders.php (Query Icon)
    if ($basename === 'whm_auction_orders.php') {
        $content = str_replace('<button class="btn btn-sm btn-outline-dark dropdown-toggle"', '<button class="btn btn-sm btn-outline-dark" onclick="openQueryModal(${o.id}, \'Order\')" title="Query Order"><i class="fa fa-question"></i></button><button class="btn btn-sm btn-outline-dark dropdown-toggle"', $content);
    }

    // 2d. whm_inventory.php (Query Icons)
    if ($basename === 'whm_inventory.php') {
        // Product Query
        $content = str_replace('inventory.editProduct(${p.id})"><i class="fa fa-edit"></i></button>', 'inventory.editProduct(${p.id})"><i class="fa fa-edit"></i></button><button class="btn btn-sm btn-link text-info" onclick="openQueryModal(${p.id}, \'Product\')"><i class="fa fa-question-circle"></i></button>', $content);
        // Variant Query
        $content = str_replace('inventory.editVariant(${v.id}, ${p.id})"><i class="fa fa-edit"></i></button>', 'inventory.editVariant(${v.id}, ${p.id})"><i class="fa fa-edit"></i></button><button class="btn btn-sm btn-link text-info" onclick="openQueryModal(${v.id}, \'Variant\')"><i class="fa fa-question-circle"></i></button>', $content);
    }

    // 2e. admin_inventory.php (Query Icons)
    if ($basename === 'admin_inventory.php') {
        $content = str_replace('inventory.editProduct(${p.id})"><i class="fa fa-edit"></i></button>', 'inventory.editProduct(${p.id})"><i class="fa fa-edit"></i></button><button class="btn btn-sm btn-link text-info" onclick="openQueryModal(${p.id}, \'Product\')"><i class="fa fa-question-circle"></i></button>', $content);
    }

    // 2f. admin_finance.php (Query Icons for rows)
    if ($basename === 'admin_finance.php') {
        // This is usually in a render function
        $content = str_replace('onclick="viewTransaction(${t.id})">', 'onclick="viewTransaction(${t.id})"><button class="btn btn-xs btn-outline-info ms-1" onclick="openQueryModal(${t.id}, \'Transaction\')"><i class="fa fa-question"></i></button>', $content);
    }

    // 2g. agent_dashboard.php
    if ($basename === 'agent_dashboard.php') {
        // Task list
        $content = str_replace('onclick="viewTask(${t.id})">', 'onclick="viewTask(${t.id})"><button class="btn btn-xs btn-outline-info ms-1" onclick="openQueryModal(${t.id}, \'Task\')"><i class="fa fa-question"></i></button>', $content);
    }

    // 2h. admin_global_orders.php
    if ($basename === 'admin_global_orders.php') {
        $content = str_replace('onclick="viewOrder(${o.id})">', 'onclick="viewOrder(${o.id})"><button class="btn btn-xs btn-outline-info ms-1" onclick="openQueryModal(${o.id}, \'Order\')"><i class="fa fa-question"></i></button>', $content);
    }

    // 2i. whm_dashboard.php
    if ($basename === 'whm_dashboard.php') {
        $content = str_replace('onclick="viewTask(${t.id})">', 'onclick="viewTask(${t.id})"><button class="btn btn-xs btn-outline-info ms-1" onclick="openQueryModal(${t.id}, \'Task\')"><i class="fa fa-question"></i></button>', $content);
    }

    // 2j. whm_auctions.php (Fix existing form)
    if ($basename === 'whm_auctions.php') {
        // Change "description" to "note" in the form
        $content = str_replace('name="description"', 'name="note"', $content);
        $content = str_replace('name="session_id"', 'name="subject_id"', $content);
        $content = str_replace('value="Auction"', 'value="AuctionSession"', $content);
    // Also update the submission code to make it consistent if needed, but Aliases in Controller will handle it too.
    }

    // 2k. admin_partners.php (Query Icon)
    if ($basename === 'admin_partners.php') {
        // Add Query icon to both pending and all partners list
        $content = str_replace('onclick="viewPartnerDetail(${p.id})"><i class="fa fa-eye me-1"></i>View</button>', 'onclick="viewPartnerDetail(${p.id})"><i class="fa fa-eye me-1"></i>View Details</button><button class="btn btn-sm btn-outline-info rounded-pill px-2 ms-1" onclick="openQueryModal(${p.id}, \'Partner\')"><i class="fa fa-question"></i></button>', $content);
        if (strpos($content, 'bootstrap.bundle.min.js') === false) {
            $content = str_replace('</body>', '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>' . "\n" . '</body>', $content);
        }
    }

    file_put_contents($file, $content);
    echo "Processed: $basename\n";
}

echo "All repairs completed.\n";
?>
