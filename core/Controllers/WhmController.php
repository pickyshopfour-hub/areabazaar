<?php
/**
 * WhmController
 * AreaBazaar PHP/MySQL REST API
 */

require_once __DIR__ . '/../Models/Order.php';

class WhmController
{
    private $db;
    private $orderModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->orderModel = new Order($db);
    }

    /**
     * Get consolidated items for triage
     */
    public function getItemsTriage($data)
    {
        // Consolidated view of needed variants for active orders
        $query = "SELECT v.id as variant_id, v.variant_name, 
                         SUM(oi.quantity) as total_needed,
                         SUM(CASE WHEN oi.treatment_status = 'Packed' THEN oi.quantity ELSE 0 END) as packed
                  FROM order_items oi
                  JOIN orders o ON oi.order_id = o.id
                  JOIN show_products sp ON oi.show_product_id = sp.id
                  JOIN product_variants v ON sp.variant_id = v.id
                  WHERE o.status IN ('Paid', 'Processing', 'AdminApproved')
                  GROUP BY v.id";

        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["status" => "success", "data" => $items];
    }

    /**
     * Mark all items of a variant as Packed for active orders
     */
    public function markItemPacked($data)
    {
        if (empty($data['variant_id'])) {
            return ["status" => "error", "message" => "Variant ID required"];
        }

        $vid = $data['variant_id'];
        $query = "UPDATE order_items oi
                  JOIN orders o ON oi.order_id = o.id
                  JOIN show_products sp ON oi.show_product_id = sp.id
                  SET oi.treatment_status = 'Packed'
                  WHERE sp.variant_id = ? AND o.status IN ('Paid', 'Processing', 'AdminApproved')";

        $stmt = $this->db->prepare($query);
        $stmt->execute([$vid]);

        return ["status" => "success", "message" => "Variant items marked as Packed"];
    }

    /**
     * Batch update multiple orders
     */
    public function massUpdate($data)
    {
        if (empty($data['ids']) || empty($data['status'])) {
            return ["status" => "error", "message" => "IDs and status required"];
        }

        $ids = $data['ids'];
        $status = $data['status'];
        $note = $data['note'] ?? '';

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query = "UPDATE orders SET status = ?, whm_notes = ? WHERE id IN ($placeholders)";

        $stmt = $this->db->prepare($query);
        $params = array_merge([$status, $note], $ids);
        $stmt->execute($params);

        return ["status" => "success", "message" => count($ids) . " orders updated to $status"];
    }

    /**
     * Register stats for the WHM dashboard
     */
    public function getDashboardStats($data)
    {
        $stats = [
            'new' => 0,
            'treatable' => 0,
            'transit' => 0,
            'dispatched_24h' => 0
        ];

        try {
            // New (Paid)
            $stats['new'] = (int)$this->db->query("SELECT COUNT(*) FROM orders WHERE status = 'Paid'")->fetchColumn();

            // Treatable (Processing)
            $stats['treatable'] = (int)$this->db->query("SELECT COUNT(*) FROM orders WHERE status = 'Processing'")->fetchColumn();

            // Transit (Shipped)
            $stats['transit'] = (int)$this->db->query("SELECT COUNT(*) FROM orders WHERE status = 'Shipped'")->fetchColumn();

            // Dispatched (All dispatched)
            $stats['dispatched_24h'] = (int)$this->db->query("SELECT COUNT(*) FROM orders WHERE status IN ('Shipped', 'Delivered')")->fetchColumn();

            return ["status" => "success", "data" => $stats];
        }
        catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    /**
     * Export active orders as CSV
     */
    public function exportOrders($data)
    {
        $query = "SELECT o.id, u.name as customer, o.total_amount, o.status, o.time_created 
                  FROM orders o 
                  JOIN customers u ON o.user_id = u.id 
                  WHERE o.status IN ('Paid', 'Processing', 'AdminApproved')
                  ORDER BY o.id DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="areabazaar_orders_' . date('Ymd_His') . '.csv"');

        $output = fopen('php://output', 'w');
        fputcsv($output, ['Order ID', 'Customer', 'Amount', 'Status', 'Date']);
        foreach ($orders as $row) {
            fputcsv($output, $row);
        }
        fclose($output);
        exit;
    }

    public function getOrdersMgt($data)
    {
        $page = isset($data['page']) ? (int)$data['page'] : 1;
        $limit = 50;
        $offset = ($page - 1) * $limit;

        $factor = $data['factor'] ?? '';
        $value = $data['value'] ?? '';

        $query = "SELECT o.*, c.name as customer_name, a.area_name as destination_area_name 
                  FROM orders o
                  LEFT JOIN customers c ON o.user_id = c.id
                  LEFT JOIN operating_areas a ON o.destination_area = a.id
                  WHERE 1=1";
        $countQuery = "SELECT COUNT(*) FROM orders o WHERE 1=1";

        $params = [];
        if ($factor && $value !== '') {
            $query .= " AND o.{$factor} LIKE ?";
            $countQuery .= " AND o.{$factor} LIKE ?";
            $params[] = "%$value%";
        }

        $query .= " ORDER BY o.time_created DESC LIMIT $limit OFFSET $offset";

        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmtCount = $this->db->prepare($countQuery);
        $stmtCount->execute($params);
        $total = $stmtCount->fetchColumn();

        return [
            "status" => "success",
            "data" => [
                "orders" => $orders,
                "total_pages" => ceil($total / $limit),
                "current_page" => $page
            ]
        ];
    }

    public function getOrderItemsMgt($data)
    {
        $page = isset($data['page']) ? (int)$data['page'] : 1;
        $limit = 50;
        $offset = ($page - 1) * $limit;

        $factor = $data['factor'] ?? '';
        $value = $data['value'] ?? '';

        $query = "SELECT oi.*, p.product_name, v.variant_name, o.user_id as customer_id, c.name as customer_name
                  FROM order_items oi
                  JOIN orders o ON oi.order_id = o.id
                  JOIN customers c ON o.user_id = c.id
                  JOIN show_products sp ON oi.show_product_id = sp.id
                  JOIN product_variants v ON sp.variant_id = v.id
                  JOIN base_products p ON v.base_product_id = p.id
                  WHERE oi.is_hidden = 0";

        $countQuery = "SELECT COUNT(*) FROM order_items oi 
                       JOIN orders o ON oi.order_id = o.id
                       WHERE oi.is_hidden = 0";

        $params = [];
        if ($factor && $value !== '') {
            // Need a safe mapping for factors since they span multiple tables
            $factorMap = [
                'order_id' => 'oi.order_id',
                'customer_id' => 'o.user_id',
                'product' => 'p.product_name',
                'order_status' => 'o.status',
                'urgency' => 'o.is_urgent'
            ];
            $dbFactor = $factorMap[$factor] ?? $factor; // fallback
            $query .= " AND $dbFactor LIKE ?";
            $countQuery .= " AND $dbFactor LIKE ?";
            $params[] = "%$value%";
        }

        $query .= " ORDER BY oi.id DESC LIMIT $limit OFFSET $offset";

        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmtCount = $this->db->prepare($countQuery);
        $stmtCount->execute($params);
        $total = $stmtCount->fetchColumn();

        return [
            "status" => "success",
            "data" => [
                "items" => $items,
                "total_pages" => ceil($total / $limit),
                "current_page" => $page
            ]
        ];
    }

    public function updateItemAction($data)
    {
        $action = $data['action'] ?? '';
        $ids = $data['ids'] ?? [];
        if (empty($ids) || !is_array($ids))
            return ["status" => "error", "message" => "No items selected"];

        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        if ($action === 'hide') {
            $query = "UPDATE order_items SET is_hidden = 1 WHERE id IN ($placeholders) AND whm_status = 'dispatched'";
            $stmt = $this->db->prepare($query);
            $stmt->execute($ids);
            return ["status" => "success", "message" => "Eligible items hidden"];
        }
        else if ($action === 'flag') {
            $query = "UPDATE order_items SET is_flagged = 1 WHERE id IN ($placeholders)";
            $stmt = $this->db->prepare($query);
            $stmt->execute($ids);
            return ["status" => "success", "message" => "Items flagged"];
        }
        else if ($action === 'add_note') {
            $note = $data['note'] ?? '';
            $query = "UPDATE order_items SET ship_notes = ? WHERE id IN ($placeholders)";
            $stmt = $this->db->prepare($query);
            $params = array_merge([$note], $ids);
            $stmt->execute($params);
            return ["status" => "success", "message" => "Notes added"];
        }
        return ["status" => "error", "message" => "Invalid action"];
    }

    public function updateItemStatus($data)
    {
        $status = $data['status'] ?? '';
        $ids = $data['ids'] ?? [];
        if (empty($ids) || !is_array($ids))
            return ["status" => "error", "message" => "No items selected"];

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query = "UPDATE order_items SET whm_status = ? WHERE id IN ($placeholders)";
        $stmt = $this->db->prepare($query);
        $params = array_merge([$status], $ids);
        $stmt->execute($params);

        return ["status" => "success", "message" => "Items status updated"];
    }

    public function exportOrdersSheet($data)
    {
        return ["status" => "success", "url" => "https://docs.google.com/spreadsheets/example-orders-export"];
    }

    public function exportItemsSheet($data)
    {
        return ["status" => "success", "url" => "https://docs.google.com/spreadsheets/example-items-export"];
    }

    // --- SBA ACQUISITIONS (CHUNK 9) ---
    public function getSbaAcquisitions($data)
    {
        // 1. Unassigned Groupings (Pending group by Base Product)
        $unassignedQuery = "SELECT p.id as base_product_id, p.product_name, p.bulk_purchase_price as unit_cost, SUM(oi.quantity) as total_qty, GROUP_CONCAT(DISTINCT sp.session_id SEPARATOR ', ') as session_ids, 'unassigned' as assign_status, 'pending' as supply_status, 0 as acq_id
                            FROM order_items oi
                            JOIN show_products sp ON oi.show_product_id = sp.id
                            JOIN product_variants pv ON sp.variant_id = pv.id
                            JOIN base_products p ON pv.base_product_id = p.id
                            LEFT JOIN sba_acquisitions sa ON sa.base_product_id = p.id AND sa.assign_status NOT IN ('sbaRejected', 'cancelled')
                            WHERE oi.treatment_status = 'Pending' AND sa.id IS NULL
                            GROUP BY p.id
                            UNION ALL
                            SELECT sa.base_product_id, p.product_name, sa.unit_cost, sa.total_qty, sa.session_id as session_ids, sa.assign_status, sa.supply_status, sa.id as acq_id
                            FROM sba_acquisitions sa
                            JOIN base_products p ON sa.base_product_id = p.id
                            WHERE sa.assign_status IN ('unassigned', 'cancelled')
                            ORDER BY acq_id DESC";
        $stmt = $this->db->query($unassignedQuery);
        $unassigned = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 2. Existing Assignments (exclude unassigned & cancelled)
        $assignedQuery = "SELECT sa.*, p.product_name, p.bulk_purchase_price, part.name as sba_name 
                          FROM sba_acquisitions sa
                          JOIN base_products p ON sa.base_product_id = p.id
                          JOIN partners part ON sa.sba_id = part.id
                          WHERE sa.assign_status NOT IN ('cancelled', 'unassigned')
                          ORDER BY sa.id DESC";
        $stmt = $this->db->query($assignedQuery);
        $assigned = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["status" => "success", "data" => ["unassigned" => $unassigned, "assigned" => $assigned]];
    }

    public function assignSba($data)
    {
        if (empty($data['base_product_id']) || empty($data['sba_id']) || empty($data['total_qty']) || empty($data['unit_cost'])) {
            return jsonResponse('error', 'Missing assignment parameters');
        }

        // Check if there is an 'unassigned' clone we should consume instead of inserting
        $stmt = $this->db->prepare("SELECT id FROM sba_acquisitions WHERE base_product_id = ? AND assign_status = 'unassigned'");
        $stmt->execute([$data['base_product_id']]);
        $existing = $stmt->fetch();

        if ($existing) {
            $this->db->prepare("UPDATE sba_acquisitions SET sba_id = ?, assign_status = 'pending', time_assigned = NOW() WHERE id = ?")
                ->execute([$data['sba_id'], $existing['id']]);
        }
        else {
            $stmt = $this->db->prepare("INSERT INTO sba_acquisitions (sba_id, base_product_id, order_item_id, total_qty, unit_cost, assign_status, supply_status, time_assigned) VALUES (?, ?, NULL, ?, ?, 'pending', 'pending', NOW())");
            $stmt->execute([$data['sba_id'], $data['base_product_id'], $data['total_qty'], $data['unit_cost']]);
        }

        return jsonResponse('success', 'SBA assigned successfully, pending Partner Acknowledgement');
    }

    public function updateSbaSupplyStatus($data)
    {
        if (empty($data['id']) || empty($data['status']))
            return jsonResponse('error', 'Missing parameters');
        $id = $data['id'];
        $status = $data['status'];
        $note = $data['note'] ?? '';

        if ($status === 'QArejected' || $status === 'QArisk' || $status === 'QApassed') {
            $assign_status = ($status === 'QApassed') ? 'approved' : 'hanging';
            $stmt = $this->db->prepare("UPDATE sba_acquisitions SET supply_status = ?, assign_status = ?, whm_notes = ? WHERE id = ?");
            $stmt->execute([$status, $assign_status, $note, $id]);
            return jsonResponse('success', 'QA Assessment Submitted');
        }
        else {
            // General supply update (e.g. from SBA)
            $stmt = $this->db->prepare("UPDATE sba_acquisitions SET supply_status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            return jsonResponse('success', 'SBA Supply Status Updated');
        }
    }

    // --- ZBDP DISPATCH (CHUNK 9) ---
    public function getZbdDispatch($data)
    {
        // 1. Unassigned Destinations
        $unassignedQuery = "SELECT a.id as destination_area_id, a.area_name, p.id as base_product_id, p.product_name, SUM(oi.quantity) as total_quantity, GROUP_CONCAT(DISTINCT sp.session_id SEPARATOR ', ') as session_ids
                            FROM order_items oi
                            JOIN orders o ON oi.order_id = o.id
                            JOIN operating_areas a ON o.shipping_address_id = a.id
                            JOIN show_products sp ON oi.show_product_id = sp.id
                            JOIN product_variants pv ON sp.variant_id = pv.id
                            JOIN base_products p ON pv.base_product_id = p.id
                            LEFT JOIN zbd_assignments za ON za.destination_area_id = a.id AND za.base_product_id = p.id
                            WHERE oi.treatment_status = 'Pending' AND za.id IS NULL
                            GROUP BY a.id, p.id";
        $stmt = $this->db->query($unassignedQuery);
        $unassigned = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 2. Existing Assignments
        $assignedQuery = "SELECT za.*, a.area_name, p.product_name, part.name as zbdp_name
                          FROM zbd_assignments za
                          JOIN operating_areas a ON za.destination_area_id = a.id
                          JOIN base_products p ON za.base_product_id = p.id
                          JOIN partners part ON za.zbdp_id = part.id
                          ORDER BY za.id DESC";
        $stmt = $this->db->query($assignedQuery);
        $assigned = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["status" => "success", "data" => ["unassigned" => $unassigned, "assigned" => $assigned]];
    }

    public function assignZbd($data)
    {
        if (empty($data['zbdp_id']) || empty($data['destination_area_id']) || empty($data['base_product_id']) || empty($data['total_quantity'])) {
            return jsonResponse('error', 'Missing assignment parameters');
        }

        // Calculate benchmark price roughly via simple lookup logic (assume route 1 for now if missing complex match)
        $price = 0;
        $stmt = $this->db->prepare("SELECT price_per_unit FROM transport_benchmark_cost WHERE base_product_id = ? LIMIT 1");
        $stmt->execute([$data['base_product_id']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row)
            $price = floatval($row['price_per_unit']) * intval($data['total_quantity']);
        else
            $price = 500 * intval($data['total_quantity']); // fallback

        $stmt = $this->db->prepare("INSERT INTO zbd_assignments (zbdp_id, destination_area_id, base_product_id, total_quantity, transport_price, progress_status, time_assigned) VALUES (?, ?, ?, ?, ?, 'pending', NOW())");
        $stmt->execute([$data['zbdp_id'], $data['destination_area_id'], $data['base_product_id'], $data['total_quantity'], $price]);

        return jsonResponse('success', 'ZBDp assigned tentatively. Transport cost: ₦' . number_format($price));
    }

    public function updateZbdProgress($data)
    {
        if (empty($data['id']) || empty($data['status']))
            return jsonResponse('error', 'Missing parameters');

        $id = $data['id'];
        $status = $data['status'];
        $note = $data['note'] ?? null;
        $context = $data['context'] ?? 'admin';

        $setQuery = "progress_status = ?";
        $params = [$status];
        if ($note) {
            if ($context === 'zbdp') {
                $setQuery .= ", zbdp_notes = ?";
            }
            else if ($context === 'whm') {
                $setQuery .= ", whm_notes = ?";
            }
            else {
                $setQuery .= ", admin_notes = ?";
            }
            $params[] = $note;
        }
        $params[] = $id;

        $stmt = $this->db->prepare("UPDATE zbd_assignments SET $setQuery WHERE id = ?");
        $stmt->execute($params);

        // If admin approves transit (confirmed), add to partner_remittances
        if ($status === 'confirmed') {
            $stmt = $this->db->prepare("SELECT zbdp_id, transport_price FROM zbd_assignments WHERE id = ?");
            $stmt->execute([$id]);
            $zbd = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($zbd) {
                // Ensure no duplicate remittances if hit twice
                $check = $this->db->prepare("SELECT id FROM partner_remittances WHERE partner_id = ? AND amount = ? AND status = 'queued' AND time_sent > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
                $check->execute([$zbd['zbdp_id'], $zbd['transport_price']]);
                if (!$check->fetch()) {
                    $this->db->prepare("INSERT INTO partner_remittances (partner_id, amount, status, time_sent) VALUES (?, ?, 'queued', NOW())")
                        ->execute([$zbd['zbdp_id'], $zbd['transport_price']]);
                }
            }
        }

        // Clone if it fails (withdrawn, rejected, cancelled) to return it to the actionable pool
        if (in_array($status, ['withdrawn', 'cancelled', 'rejected'])) {
            $this->db->prepare("UPDATE zbd_assignments SET remittance_status = 'cancelled' WHERE id = ?")->execute([$id]);

            $stmt = $this->db->prepare("SELECT * FROM zbd_assignments WHERE id = ?");
            $stmt->execute([$id]);
            $old = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($old) {
                // Ensure we don't duplicate multiple 'unassigned' for the exact same set
                $dupCheck = $this->db->prepare("SELECT id FROM zbd_assignments WHERE base_product_id = ? AND destination_area_id = ? AND session_id <=> ? AND progress_status = 'unassigned'");
                $dupCheck->execute([$old['base_product_id'], $old['destination_area_id'], $old['session_id']]);
                if (!$dupCheck->fetch()) {
                    $ins = $this->db->prepare("INSERT INTO zbd_assignments (zbdp_id, destination_area_id, base_product_id, session_id, order_id, total_quantity, transport_price, progress_status, remittance_status, time_assigned) VALUES (NULL, ?, ?, ?, ?, ?, ?, 'unassigned', 'pending', NOW())");
                    $ins->execute([$old['destination_area_id'], $old['base_product_id'], $old['session_id'], $old['order_id'], $old['total_quantity'], $old['transport_price']]);
                }
            }
        }

        return jsonResponse('success', 'ZBDp Progress Updated to ' . $status);
    }

    public function updateSbaAssignStatus($data)
    {
        if (empty($data['id']) || empty($data['status']))
            return jsonResponse('error', 'Missing params');
        $status = $data['status'];
        $id = $data['id'];
        $note = $data['note'] ?? null;

        $setQuery = "assign_status = ?";
        $params = [$status];
        if ($note) {
            $setQuery .= ", admin_notes = ?";
            $params[] = $note;
        }
        $params[] = $id;

        $stmt = $this->db->prepare("UPDATE sba_acquisitions SET $setQuery WHERE id = ?");
        $stmt->execute($params);

        // If admin approved QA, set supply_status = completed
        if ($status === 'approved_qa') {
            $this->db->prepare("UPDATE sba_acquisitions SET assign_status = 'approved', supply_status = 'completed' WHERE id = ?")->execute([$id]);

            // Add to partner_remittances
            $stmt = $this->db->prepare("SELECT sba_id, total_qty, unit_cost FROM sba_acquisitions WHERE id = ?");
            $stmt->execute([$id]);
            $acq = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($acq) {
                $amount = $acq['total_qty'] * $acq['unit_cost'];
                // Ensure no duplicate remittances if hit twice
                $check = $this->db->prepare("SELECT id FROM partner_remittances WHERE partner_id = ? AND amount = ? AND status = 'queued' AND time_sent > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
                $check->execute([$acq['sba_id'], $amount]);
                if (!$check->fetch()) {
                    $this->db->prepare("INSERT INTO partner_remittances (partner_id, amount, status, time_sent) VALUES (?, ?, 'queued', NOW())")
                        ->execute([$acq['sba_id'], $amount]);
                }
            }
        }
        else if ($status === 'approved') {
            $this->db->prepare("UPDATE sba_acquisitions SET assign_status = 'approved', supply_status = 'acknowledged' WHERE id = ?")->execute([$id]);
        }
        // If admin rejected QA, duplicate and set cancelled.
        if ($status === 'rejected_qa' || $status === 'cancelled') {
            $this->db->prepare("UPDATE sba_acquisitions SET assign_status = 'cancelled', remittance_status = 'Cancelled' WHERE id = ?")->execute([$id]);

            // Duplicate as Unassigned
            $stmt = $this->db->prepare("SELECT * FROM sba_acquisitions WHERE id = ?");
            $stmt->execute([$id]);
            $old = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($old) {
                $dupCheck = $this->db->prepare("SELECT id FROM sba_acquisitions WHERE base_product_id = ? AND assign_status = 'unassigned'");
                $dupCheck->execute([$old['base_product_id']]);
                if (!$dupCheck->fetch()) {
                    $ins = $this->db->prepare("INSERT INTO sba_acquisitions (base_product_id, sba_id, session_id, total_qty, unit_cost, assign_status, supply_status, time_assigned) VALUES (?, NULL, ?, ?, ?, 'unassigned', 'pending', NOW())");
                    $ins->execute([$old['base_product_id'], $old['session_id'], $old['total_qty'], $old['unit_cost']]);
                }
            }
        }

        return jsonResponse('success', 'SBA Assign Authorization Processed');
    }

    public function getSbaDispatchAll()
    {
        $stmt = $this->db->query("SELECT s.*, p.product_name, part.name as sba_name
                                  FROM sba_acquisitions s
                                  JOIN base_products p ON s.base_product_id = p.id
                                  LEFT JOIN partners part ON s.sba_id = part.id
                                  WHERE s.assign_status != 'unassigned' ");
        $sba = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $unassignedQuery = "SELECT p.id as base_product_id, p.product_name, p.bulk_purchase_price as unit_cost, SUM(oi.quantity) as total_qty, GROUP_CONCAT(DISTINCT sp.session_id SEPARATOR ', ') as session_ids, 'unassigned' as assign_status, 'pending' as supply_status, 0 as acq_id
                            FROM order_items oi
                            JOIN show_products sp ON oi.show_product_id = sp.id
                            JOIN product_variants pv ON sp.variant_id = pv.id
                            JOIN base_products p ON pv.base_product_id = p.id
                            LEFT JOIN sba_acquisitions sa ON sa.base_product_id = p.id AND sa.assign_status NOT IN ('sbaRejected', 'cancelled')
                            WHERE oi.treatment_status = 'Pending' AND sa.id IS NULL
                            GROUP BY p.id
                            UNION ALL
                            SELECT sa.base_product_id, p.product_name, sa.unit_cost, sa.total_qty, sa.session_id as session_ids, sa.assign_status, sa.supply_status, sa.id as acq_id
                            FROM sba_acquisitions sa
                            JOIN base_products p ON sa.base_product_id = p.id
                            WHERE sa.assign_status IN ('unassigned')
                            ORDER BY acq_id DESC";
        $stmt2 = $this->db->query($unassignedQuery);
        $unassignedSba = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $this->db->query("SELECT za.*, a.area_name, part.name as zbdp_name
                                  FROM zbd_assignments za
                                  JOIN operating_areas a ON za.destination_area_id = a.id
                                  JOIN partners part ON za.zbdp_id = part.id");
        $zbdp = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return jsonResponse('success', 'Admin Logistics Feed', ['sba' => $sba, 'unassigned_sba' => $unassignedSba, 'zbdp' => $zbdp]);
    }

    /**
     * Webhook/API Pull: Feed the WHM PrepCheck Google AppScript with active variants
     */
    public function pullPrepCheckData()
    {
        $sessionId = $_GET['session_id'] ?? null;
        if (!$sessionId) {
            return jsonResponse('error', 'Session ID required');
        }

        $query = "SELECT sp.id as show_product_id, sp.session_id, sp.variant_id, sp.current_stock, sp.current_price, pv.variant_name as product_name 
                  FROM show_products sp
                  JOIN product_variants pv ON sp.variant_id = pv.id
                  WHERE sp.session_id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->execute([$sessionId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($items) === 0) {
            return jsonResponse('error', "No items found for Session $sessionId. Ensure a Default Wave has been submitted.");
        }

        return jsonResponse('success', 'Session items retrieved', $items);
    }

    /**
     * Webhook Ingestion: Receive WHM PrepCheck Report from Google AppScript
     */
    public function ingestPrepCheckReport()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['session_id'])) {
            return jsonResponse('error', 'Invalid PrepCheck Payload');
        }

        try {
            $this->db->beginTransaction();

            $sql = "INSERT INTO readiness_check_logs (session_id, whm_staff_id, check_type, status, report_url, report_metadata, timestamp) 
                    VALUES (:sid, :whm, :ctype, :status, :url, :meta, NOW())";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':sid' => $data['session_id'],
                ':whm' => $data['whm_staff_id'] ?? null,
                ':ctype' => $data['check_type'] ?? 'Overall',
                ':status' => $data['status'] ?? 'Verified',
                ':url' => $data['report_url'] ?? '',
                ':meta' => isset($data['report_metadata']) ? json_encode($data['report_metadata']) : null
            ]);

            // Update Auction Session Status to indicate WHM Clearance
            $sqlSession = "UPDATE auction_sessions SET status = 'WHM Cleared' WHERE id = :sid AND status = 'Pending'";
            $stmtSession = $this->db->prepare($sqlSession);
            $stmtSession->execute([':sid' => $data['session_id']]);

            $this->db->commit();
            return jsonResponse('success', "PrepCheck logs recorded for Session #" . $data['session_id']);

        }
        catch (Exception $e) {
            $this->db->rollBack();
            return jsonResponse('error', "PrepCheck ingestion failed: " . $e->getMessage());
        }
    }
}
