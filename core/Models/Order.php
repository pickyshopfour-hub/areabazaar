<?php
/**
 * Order Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class Order extends Model
{
    protected $table_name = "orders";

    /**
     * Create a spot order (immediate purchase)
     */
    public function createSpotOrder($userId, $productId, $quantity, $price, $pin)
    {
        $this->db->beginTransaction();
        try {
            // 1. Double check balance and PIN (simplified for this model, usually controller does this)
            // 2. Create Order
            $deliveryPasscode = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
            $orderQuery = "INSERT INTO orders (user_id, total_amount, status, delivery_passcode) 
                           VALUES (:uid, :total, 'Paid', :pass)";
            $stmt = $this->db->prepare($orderQuery);
            $total = $price * $quantity;
            $stmt->execute([':uid' => $userId, ':total' => $total, ':pass' => $deliveryPasscode]);
            $orderId = $this->db->lastInsertId();

            // 3. Create Order Item
            $itemQuery = "INSERT INTO order_items (order_id, show_product_id, quantity, price_at_purchase) 
                          VALUES (:oid, :pid, :qty, :price)";
            $stmt = $this->db->prepare($itemQuery);
            $stmt->execute([':oid' => $orderId, ':pid' => $productId, ':qty' => $quantity, ':price' => $price]);

            // 4. Update Wallet (Atomic)
            $walletQuery = "UPDATE wallets SET balance = balance - :amount WHERE customer_id = :uid AND balance >= :amount";
            $stmt = $this->db->prepare($walletQuery);
            $stmt->execute([':amount' => $total, ':uid' => $userId]);

            if ($stmt->rowCount() === 0) {
                throw new Exception("Insufficient balance");
            }

            // 5. Update Stock
            $stockQuery = "UPDATE show_products SET stock_available = stock_available - :qty 
                           WHERE id = :pid AND stock_available >= :qty";
            $stmt = $this->db->prepare($stockQuery);
            $stmt->execute([':qty' => $quantity, ':pid' => $productId]);

            if ($stmt->rowCount() === 0) {
                throw new Exception("Product out of stock");
            }

            $this->db->commit();
            return ["status" => "success", "order_id" => $orderId, "passcode" => $deliveryPasscode];
        }
        catch (Exception $e) {
            $this->db->rollBack();
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    /**
     * Confirm delivery
     */
    public function acknowledgeDelivery($orderId, $passcode)
    {
        $query = "UPDATE orders SET status = 'Delivered', time_delivered = NOW() 
                  WHERE id = :oid AND delivery_passcode = :pass AND status = 'Shipped'";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':oid' => $orderId, ':pass' => $passcode]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Get orders for a specific user
     */
    public function getUserOrders($userId)
    {
        $query = "SELECT o.*, GROUP_CONCAT(sp.display_name) as items 
                  FROM orders o 
                  JOIN order_items oi ON o.id = oi.order_id 
                  JOIN show_products sp ON oi.show_product_id = sp.id 
                  WHERE o.user_id = :uid 
                  GROUP BY o.id 
                  ORDER BY o.time_created DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':uid' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get global orders with filters (for Admin Oversight)
     */
    public function getGlobalOrders($filters = [])
    {
        $query = "SELECT o.*, u.name as customer_name, az.area_name as destination_area_name, 
                         s.session_name, w.wave_name,
                         (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
                         (SELECT GROUP_CONCAT(v.variant_name SEPARATOR ', ') 
                          FROM order_items oi 
                          JOIN show_products sp ON oi.show_product_id = sp.id
                          JOIN product_variants v ON sp.variant_id = v.id 
                          WHERE oi.order_id = o.id) as item_summary
                  FROM orders o
                  LEFT JOIN customers u ON o.user_id = u.id
                  LEFT JOIN operating_areas az ON o.destination_area = az.id
                  LEFT JOIN order_items oi2 ON o.id = oi2.order_id
                  LEFT JOIN show_products sp2 ON oi2.show_product_id = sp2.id
                  LEFT JOIN auction_sessions s ON sp2.session_id = s.id
                  LEFT JOIN waves w ON s.current_wave_id = w.id
                  WHERE 1=1";

        $params = [];
        if (!empty($filters['session_id'])) {
            $query .= " AND s.id = :sid";
            $params[':sid'] = $filters['session_id'];
        }
        if (!empty($filters['status'])) {
            $query .= " AND o.status = :status";
            $params[':status'] = $filters['status'];
        }
        if (!empty($filters['is_urgent'])) {
            $query .= " AND o.is_urgent = 1";
        }
        if (!empty($filters['whm_view'])) {
            $query .= " AND o.status IN ('Paid', 'Processing', 'Approved')";
        }

        $query .= " GROUP BY o.id ORDER BY o.time_created DESC LIMIT 100";

        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrderDetails($orderId)
    {
        $query = "SELECT o.*, u.name as customer_name, az.area_name as destination_area_name 
                  FROM orders o
                  LEFT JOIN customers u ON o.user_id = u.id
                  LEFT JOIN operating_areas az ON o.destination_area = az.id
                  WHERE o.id = :oid";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':oid' => $orderId]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            return null;
        }

        $itemsQuery = "SELECT oi.*, v.variant_name, p.product_name 
                       FROM order_items oi
                       JOIN show_products sp ON oi.show_product_id = sp.id
                       JOIN product_variants v ON sp.variant_id = v.id 
                       JOIN base_products p ON v.base_product_id = p.id
                       WHERE oi.order_id = :oid";
        $stmt = $this->db->prepare($itemsQuery);
        $stmt->execute([':oid' => $orderId]);
        $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $order;
    }
}
