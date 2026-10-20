<?php
/**
 * AuctionController
 * AreaBazaar PHP/MySQL REST API
 */

require_once __DIR__ . '/../Models/AuctionSession.php';
require_once __DIR__ . '/../Models/ShowProduct.php';

class AuctionController
{
    private $sessionModel;
    private $productModel;

    public function __construct($db)
    {
        $this->sessionModel = new AuctionSession($db);
        $this->productModel = new ShowProduct($db);
    }

    /**
     * Create a new auction session (Draft)
     */
    public function createSession($data)
    {
        if (empty($data['name']) || empty($data['type']) || empty($data['target_zone'])) {
            return ["status" => "error", "message" => "Name, Type, and Target Zone are mandatory"];
        }
        $res = $this->sessionModel->startSession($data);
        if ($res) {
            return [
                "status" => "success",
                "session_id" => $res['id'],
                "load_items_url" => "https://script.google.com/macros/s/AKfycb.../exec?action=ingest&sessionId=" . $res['id']
            ];
        }
        return ["status" => "error", "message" => "Failed to initialize session"];
    }

    /**
     * Update Session Settings (Senior Admin only logic should be in middleware/router)
     */
    public function updateSessionSettings($data)
    {
        if (empty($data['id']))
            return ["status" => "error", "message" => "Session ID required"];
        $id = $data['id'];
        unset($data['id']);

        if ($this->sessionModel->updateSettings($id, $data)) {
            return ["status" => "success", "message" => "Settings updated"];
        }
        return ["status" => "error", "message" => "Update failed"];
    }

    public function listAuctionItems($data)
    {
        $sessionId = $data['session_id'] ?? null;
        if (!$sessionId)
            return ["status" => "error", "message" => "Session ID required"];

        $filterFactor = $data['filter_factor'] ?? null;
        $filterValue = $data['filter_value'] ?? null;

        $sql = "SELECT sp.*, pv.variant_name, p.category, p.product_name 
                FROM show_products sp
                JOIN product_variants pv ON sp.variant_id = pv.id
                JOIN base_products p ON pv.base_product_id = p.id
                WHERE sp.session_id = :sid";

        $params = [':sid' => $sessionId];

        if ($filterFactor && $filterValue) {
            switch ($filterFactor) {
                case 'category':
                    $sql .= " AND p.category LIKE :val";
                    $params[':val'] = "%$filterValue%";
                    break;
                case 'price-above':
                    $sql .= " AND sp.current_price >= :val";
                    $params[':val'] = $filterValue;
                    break;
                case 'price-below':
                    $sql .= " AND sp.current_price <= :val";
                    $params[':val'] = $filterValue;
                    break;
            }
        }

        $stmt = $this->sessionModel->getConn()->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["status" => "success", "data" => $items];
    }

    /**
     * Manage Auction Item Actions
     */
    public function updateAuctionItem($data)
    {
        $id = $data['id']; // show_product_id
        $action = $data['action'];
        $val = $data['value'] ?? null;

        $item = $this->productModel->getById($id);
        if (!$item)
            return ["status" => "error", "message" => "Item not found"];

        switch ($action) {
            case 'addStock':
                $sql = "UPDATE show_products SET current_stock = current_stock + :val WHERE id = :id";
                break;
            case 'removeStock':
                $sql = "UPDATE show_products SET current_stock = GREATEST(0, current_stock - :val) WHERE id = :id";
                break;
            case 'hide':
                $sql = "UPDATE show_products SET status = 'Hidden' WHERE id = :id";
                break;
            case 'suspend':
                $sql = "UPDATE show_products SET status = 'Suspended' WHERE id = :id";
                break;
            case 'changeCurrentPrice':
                $sql = "UPDATE show_products SET current_price = :val WHERE id = :id";
                break;
            case 'fixWavesPrice':
                $sql = "UPDATE wave_items SET new_price = :val 
                        WHERE variant_id = :vid AND wave_id IN (SELECT id FROM waves WHERE session_id = :sid AND status = 'Pending')";
                $stmt = $this->sessionModel->getConn()->prepare($sql);
                $stmt->execute([':val' => $val, ':vid' => $item['variant_id'], ':sid' => $item['session_id']]);
                return ["status" => "success", "message" => "Price fixed across pending waves"];
            default:
                return ["status" => "error", "message" => "Invalid action"];
        }

        $stmt = $this->sessionModel->getConn()->prepare($sql);
        $params = [':id' => $id];
        if (strpos($sql, ':val') !== false)
            $params[':val'] = $val;

        if ($stmt->execute($params))
            return ["status" => "success", "message" => "Action $action completed"];
        return ["status" => "error", "message" => "Action failed"];
    }

    public function listAuctionOrders($data)
    {
        $sessionId = $data['session_id'] ?? null;

        $sql = "SELECT o.*, u.name as customer_name, a.session_name, aa.area_name as destination_area_name
                FROM orders o
                JOIN customers u ON o.user_id = u.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN show_products sp ON oi.show_product_id = sp.id
                LEFT JOIN auction_sessions a ON sp.session_id = a.id
                LEFT JOIN operating_areas aa ON o.destination_area = aa.id
                WHERE 1=1";

        $params = [];
        if ($sessionId) {
            $sql .= " AND a.id = :sid";
            $params[':sid'] = $sessionId;
        }

        $sql .= " GROUP BY o.id ORDER BY o.time_created DESC";
        $stmt = $this->sessionModel->getConn()->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["status" => "success", "data" => $orders];
    }


    /**
     * Manage Auction Order Actions
     */
    public function updateAuctionOrder($data)
    {
        $id = $data['id']; // order_id
        $action = $data['action'];
        $val = $data['value'] ?? null;

        switch ($action) {
            case 'Approve':
                $sql = "UPDATE orders SET status = 'AdminApproved', time_approved = NOW() WHERE id = :id";
                break;
            case 'SetUrgent':
                $sql = "UPDATE orders SET is_urgent = 1, status = 'AdminApproved', time_approved = IFNULL(time_approved, NOW()) WHERE id = :id";
                break;
            case 'Assign':
                $sql = "UPDATE orders SET assigned_to = :val, status = 'AdminApproved' WHERE id = :id";
                break;
            default:
                return ["status" => "error", "message" => "Invalid action"];
        }

        $stmt = $this->sessionModel->getConn()->prepare($sql);
        $params = [':id' => $id];
        if (strpos($sql, ':val') !== false)
            $params[':val'] = $val;

        if ($stmt->execute($params))
            return ["status" => "success", "message" => "Order $action successful"];
        return ["status" => "error", "message" => "Operation failed"];
    }

    /**
     * Perform a readiness check sign-off
     */
    public function verifyReadiness($data)
    {
        $query = "INSERT INTO readiness_check_logs (session_id, whm_staff_id, admin_staff_id, check_type, status, comments, report_url, report_metadata) 
                  VALUES (:sid, :whmid, :adminid, :type, :status, :msg, :url, :meta)";
        $stmt = $this->sessionModel->getConn()->prepare($query);
        $stmt->execute([
            ':sid' => $data['session_id'],
            ':whmid' => $data['whm_staff_id'] ?? null,
            ':adminid' => $data['admin_staff_id'] ?? null,
            ':type' => $data['check_type'],
            ':status' => $data['status'] ?? 'Pending',
            ':msg' => $data['comments'] ?? '',
            ':url' => $data['report_url'] ?? null,
            ':meta' => isset($data['report_metadata']) ? json_encode($data['report_metadata']) : null
        ]);
        return ["status" => "success", "message" => "Readiness check recorded"];
    }

    /**
     * Start the first wave of an auction
     */
    public function startAuction($data)
    {
        $sessionId = $data['session_id'];

        // 1. Update session status to Active
        $this->sessionModel->updateStatus($sessionId, 'Active');

        // 2. Initial logic for Wave 1 start
        // Find default or first wave
        $waveModel = new Wave($this->sessionModel->getConn());
        $sql = "SELECT id FROM waves WHERE session_id = :sid ORDER BY is_default DESC, id ASC LIMIT 1";
        $stmt = $this->sessionModel->getConn()->prepare($sql);
        $stmt->execute([':sid' => $sessionId]);
        $firstWave = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($firstWave) {
            $this->applyWave($firstWave['id'], $sessionId);
        }

        return ["status" => "success", "message" => "Auction Wave 1 started"];
    }

    /**
     * Get products for the current active session
     */
    public function getActiveProducts()
    {
        $activeSession = $this->sessionModel->getActiveSession();
        if (!$activeSession) {
            return ["status" => "error", "message" => "No active auction session"];
        }
        $products = $this->productModel->getBySession($activeSession['id']);
        return ["status" => "success", "session" => $activeSession, "products" => $products];
    }

    /**
     * Switch to a new wave (Immediate or Scheduled)
     */
    public function updateWave($data)
    {
        $waveId = $data['wave_id'] ?? null;
        if (!$waveId)
            return ["status" => "error", "message" => "Wave ID required"];

        $waveName = $data['wave_name'] ?? '';
        $status = $data['status'] ?? 'Pending';
        $scheduledAt = !empty($data['scheduled_at']) ? $data['scheduled_at'] : null;
        $isDefault = isset($data['is_default']) ? (int) $data['is_default'] : 0;

        if ($isDefault) {
            // First we need to get the session_id for this wave
            $stmt = $this->sessionModel->getConn()->prepare("SELECT session_id FROM waves WHERE id = ?");
            $stmt->execute([$waveId]);
            $wave = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($wave) {
                // Unset all other defaults in that session
                $stmtReset = $this->sessionModel->getConn()->prepare("UPDATE waves SET is_default = 0 WHERE session_id = ?");
                $stmtReset->execute([$wave['session_id']]);
            }
        }

        // Build the basic update parameters
        // The frontend disables editing wave_name and scheduled_at if the session is passed,
        // so we check if they are provided/applicable. But we can just boldly update what the frontend gives.
        $sql = "UPDATE waves SET is_default = :isDefault, status = :status";
        $params = [
            ":isDefault" => $isDefault,
            ":status" => $status,
            ":id" => $waveId
        ];

        // Only update these fields if they were modified/provided. (Readonly on frontend means they submit as is)
        if ($waveName !== '') {
            $sql .= ", wave_name = :waveName";
            $params[':waveName'] = $waveName;
        }

        if ($scheduledAt !== null) {
            $sql .= ", scheduled_at = :scheduledAt";
            $params[':scheduledAt'] = $scheduledAt;
        } else {
            $sql .= ", scheduled_at = NULL";
        }

        $sql .= " WHERE id = :id";

        $stmt = $this->sessionModel->getConn()->prepare($sql);
        if ($stmt->execute($params)) {
            return ["status" => "success", "message" => "Wave updated successfully"];
        }

        return ["status" => "error", "message" => "Update Failed"];
    }

    public function removeWave($data)
    {
        if (empty($data['wave_id']))
            return ["status" => "error", "message" => "Wave ID required"];
        $stmt = $this->sessionModel->getConn()->prepare("UPDATE waves SET status='Removed' WHERE id=?");
        if ($stmt->execute([$data['wave_id']]))
            return ["status" => "success", "message" => "Wave marked as Removed"];
        return ["status" => "error", "message" => "Update Failed"];
    }

    public function switchWave($data)
    {
        $waveId = $data['wave_id'];
        $sessionId = $data['session_id'];
        $mode = $data['mode'] ?? 'immediate'; // immediate or scheduled

        $waveModel = new Wave($this->sessionModel->getConn());
        $wave = $waveModel->findById($waveId);

        if (!$wave || $wave['session_id'] != $sessionId) {
            return ["status" => "error", "message" => "Invalid wave or session"];
        }

        // Senior Admin Approval Check
        if (!$wave['senior_admin_approval']) {
            return ["status" => "error", "message" => "Wave requires Senior Admin approval"];
        }

        if ($mode === 'immediate') {
            return $this->applyWave($waveId, $sessionId);
        } else {
            $waveModel->update($waveId, ['status' => 'Pending', 'scheduled_at' => date('Y-m-d H:i:s')]);
            return ["status" => "success", "message" => "Wave switch prompted. Awaiting 120s timeout."];
        }
    }

    /**
     * Apply wave data to the session (Stage 2 / Execution)
     */
    public function applyWave($waveId, $sessionId)
    {
        $waveModel = new Wave($this->sessionModel->getConn());
        $waveItemModel = new WaveItem($this->sessionModel->getConn());

        $items = $waveModel->getItems($waveId);

        foreach ($items as $item) {
            $query = "UPDATE show_products SET current_price = :price, current_stock = :stock 
                      WHERE session_id = :sid AND variant_id = :vid";
            $stmt = $this->sessionModel->getConn()->prepare($query);
            $stmt->execute([
                ':price' => $item['new_price'],
                ':stock' => $item['stock_limit'] ?? 100,
                ':sid' => $sessionId,
                ':vid' => $item['variant_id']
            ]);

            if ($stmt->rowCount() == 0) {
                $waveItemModel->adoptAsShowProduct($item['id'], $sessionId);
            }
        }

        $this->sessionModel->update($sessionId, ['current_wave_id' => $waveId]);
        $waveModel->update($waveId, ['status' => 'Active', 'actual_switch_time' => date('Y-m-d H:i:s')]);

        $query = "UPDATE waves SET status = 'Replaced' WHERE session_id = :sid AND id != :wid AND status = 'Active'";
        $stmt = $this->sessionModel->getConn()->prepare($query);
        $stmt->execute([':sid' => $sessionId, ':wid' => $waveId]);

        return ["status" => "success", "message" => "Wave applied successfully"];
    }

    /**
     * SeniorAdmin Approve Wave (Gatekeeper)
     */
    public function approveWave($data)
    {
        $waveModel = new Wave($this->sessionModel->getConn());
        $result = $waveModel->update($data['wave_id'], ['senior_admin_approval' => 1]);

        if ($result) {
            return ["status" => "success", "message" => "Wave approved by Senior Admin"];
        }
        return ["status" => "error", "message" => "Failed to approve wave"];
    }

    /**
     * System Scheduled Check (2-Stage Autoswitch)
     */
    public function checkAutoswitch()
    {
        $activeSession = $this->sessionModel->getActiveSession();
        if (!$activeSession)
            return ["status" => "error", "message" => "No active session"];

        $waveModel = new Wave($this->sessionModel->getConn());
        $pendingWave = $waveModel->getNextScheduled($activeSession['id']);

        if (!$pendingWave)
            return ["status" => "success", "message" => "No waves scheduled"];

        if (!$pendingWave['senior_admin_approval']) {
            return ["status" => "error", "message" => "Wave #{$pendingWave['id']} lacks SeniorAdmin approval"];
        }

        if ($pendingWave['status'] == 'Pending') {
            $scheduledTime = strtotime($pendingWave['scheduled_at']);
            $diff = time() - $scheduledTime;

            if ($diff >= 120) {
                $this->applyWave($pendingWave['id'], $activeSession['id']);
                return ["status" => "success", "message" => "Wave #{$pendingWave['id']} auto-executed"];
            }
        }
        return ["status" => "success", "message" => "Autoswitch cycle healthy"];
    }

    /**
     * Pause an active auction
     */
    public function pauseSession($data)
    {
        $this->sessionModel->updateStatus($data['session_id'], 'Paused');
        return ["status" => "success", "message" => "Auction session paused"];
    }

    /**
     * End an auction session
     */
    public function endSession($data)
    {
        $this->sessionModel->updateStatus($data['session_id'], 'Ended');
        return ["status" => "success", "message" => "Auction session ended"];
    }

    /**
     * Webhook Ingestion: Admin Google Sheets Wave to DB Bridge
     */
    public function ingestAdminWave()
    {
        // Simple authentication check
        $apiKey = $_SERVER['HTTP_X_AB_KEY'] ?? '';
        if ($apiKey !== 'AB-GS-INGEST-KEY-2026') {
            return jsonResponse('error', 'Unauthorized Webhook Access', null);
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['metadata']['session_id']) || !isset($data['items'])) {
            return jsonResponse('error', 'Invalid ingestion package');
        }

        $meta = $data['metadata'];
        $items = $data['items'];
        $sessionId = $meta['session_id'];
        $waveName = $meta['wave_name'];
        $isDefault = isset($meta['is_default']) && $meta['is_default'] ? 1 : 0;

        $db = $this->sessionModel->getConn();

        try {
            $db->beginTransaction();

            // 1. Create the Wave Record
            $sql = "INSERT INTO waves (session_id, wave_name, scheduled_at, is_default, metadata, time_created) 
                    VALUES (:sid, :wname, :sch, :is_def, :meta, NOW())";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':sid' => $sessionId,
                ':wname' => $waveName,
                ':sch' => empty($meta['scheduled_at']) ? null : $meta['scheduled_at'],
                ':is_def' => $isDefault,
                ':meta' => json_encode($meta)
            ]);
            $waveId = $db->lastInsertId();

            // 2. Insert Wave Items (Variants extracted from the Summing Sheet)
            if (count($items) > 0) {
                // Prepare statement for bulk insert
                $sqlItem = "INSERT INTO wave_items (wave_id, variant_id, new_price, new_stock) 
                            VALUES (:wid, :vid, :price, :stock)";
                $stmtItem = $db->prepare($sqlItem);

                foreach ($items as $item) {
                    // Extract ID directly or safely from 'VariantID' depending on GS Headers
                    $vid = $item['ID'] ?? $item['VariantID'] ?? $item['variant_id'] ?? null;
                    $price = $item['Price'] ?? $item['price'] ?? 0;
                    $stock = $item['Stock'] ?? $item['Quantity'] ?? $item['stock'] ?? 100;

                    if ($vid) {
                        $stmtItem->execute([
                            ':wid' => $waveId,
                            ':vid' => $vid,
                            ':price' => $price,
                            ':stock' => $stock
                        ]);

                        // User Request: If default wave, mirror directly into show_products via WaveItem Model
                        if ($isDefault) {
                            $waveItemId = $db->lastInsertId();
                            if (!isset($waveItemModel)) {
                                require_once __DIR__ . '/../Models/WaveItem.php';
                                $waveItemModel = new WaveItem($db);
                            }
                            $waveItemModel->adoptAsShowProduct($waveItemId, $sessionId);
                        }
                    }
                }
            }

            $db->commit();

            return jsonResponse('success', "Wave '$waveName' successfully ingested into Session #$sessionId. Contains " . count($items) . " items.");

        } catch (Exception $e) {
            $db->rollBack();
            return jsonResponse('error', 'Critical ingestion failure: ' . $e->getMessage());
        }
    }

    /**
     * Get all auction sessions
     */
    public function getAllSessions()
    {
        return ["status" => "success", "sessions" => $this->sessionModel->findAll("time_created DESC")];
    }

    public function addWave($data)
    {
        $sessionId = $data['session_id'] ?? null;
        $waveName = $data['wave_name'] ?? null;
        $status = $data['status'] ?? 'Pending';
        $scheduledTime = !empty($data['scheduled_time']) ? date('Y-m-d ') . $data['scheduled_time'] : null;
        $isDefault = isset($data['is_default']) && $data['is_default'] ? 1 : 0;

        $category = trim($data['include_prod_category'] ?? '');
        $addFactor = isset($data['price_add_factor']) && $data['price_add_factor'] !== '' ? floatval($data['price_add_factor']) : 0;
        $addSubtractAmount = $data['to_addorsub_amount'] ?? '+';
        $pctFactor = isset($data['price_percentage_factor']) && $data['price_percentage_factor'] !== '' ? floatval($data['price_percentage_factor']) : 0;
        $addSubtractPct = $data['to_addorsub_percent'] ?? '+';
        $stockApply = isset($data['stock_apply']) && $data['stock_apply'] !== '' ? intval($data['stock_apply']) : 0;

        if (!$sessionId || !$waveName) {
            return ["status" => "error", "message" => "Session ID and Wave Name are required."];
        }

        $db = $this->sessionModel->getConn();

        try {
            $db->beginTransaction();

            if ($isDefault) {
                $db->query("UPDATE waves SET is_default = 0 WHERE session_id = " . intval($sessionId));
            }

            $sql = "INSERT INTO waves (session_id, wave_name, status, scheduled_at, is_default, time_created) VALUES (:sid, :wname, :status, :sch, :isdef, NOW())";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':sid' => $sessionId,
                ':wname' => $waveName,
                ':status' => $status,
                ':sch' => $scheduledTime,
                ':isdef' => $isDefault
            ]);

            $waveId = $db->lastInsertId();

            if (!empty($category)) {
                $q = "SELECT pv.id as variant_id, COALESCE(pv.quantity_value, bp.bulk_purchase_price, 0) as base_price 
                      FROM product_variants pv 
                      JOIN base_products bp ON pv.base_product_id = bp.id 
                      WHERE bp.category LIKE ?";
                $pstmt = $db->prepare($q);
                $pstmt->execute(['%' . $category . '%']);
                $variants = $pstmt->fetchAll(PDO::FETCH_ASSOC);

                if (count($variants) > 0) {
                    $insertSql = "INSERT INTO wave_items (wave_id, variant_id, new_price, new_stock) VALUES (:wid, :vid, :price, :stock)";
                    $instmt = $db->prepare($insertSql);

                    foreach ($variants as $v) {
                        $price = floatval($v['base_price']);

                        // Apply amount factor
                        if ($addFactor > 0) {
                            $price = ($addSubtractAmount === '+') ? ($price + $addFactor) : ($price - $addFactor);
                        }

                        // Apply percent factor
                        if ($pctFactor > 0) {
                            $pctAmt = $price * ($pctFactor / 100);
                            $price = ($addSubtractPct === '+') ? ($price + $pctAmt) : ($price - $pctAmt);
                        }

                        $price = max(0, $price); // Prevent negative prices

                        $instmt->execute([
                            ':wid' => $waveId,
                            ':vid' => $v['variant_id'],
                            ':price' => $price,
                            ':stock' => $stockApply
                        ]);
                    }
                }
            }

            $db->commit();
            return ["status" => "success", "message" => "Wave added successfully."];
        } catch (Exception $e) {
            $db->rollBack();
            return ["status" => "error", "message" => "Failed to add wave: " . $e->getMessage()];
        }
    }
}
?>