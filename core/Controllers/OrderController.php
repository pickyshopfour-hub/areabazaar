<?php
/**
 * OrderController
 * AreaBazaar PHP/MySQL REST API
 */

require_once __DIR__ . '/../Models/Order.php';
require_once __DIR__ . '/../Models/ShowProduct.php';

class OrderController
{
    private $orderModel;
    private $productModel;

    public function __construct($db)
    {
        $this->orderModel = new Order($db);
        $this->productModel = new ShowProduct($db);
    }

    /**
     * Validate cart items against DB prices and stock
     */
    public function validateCart($data)
    {
        $items = $data['items'] ?? [];
        $validation = [
            'changed' => false,
            'items' => [],
            'balance_ok' => true
        ];

        foreach ($items as $item) {
            $dbProduct = $this->productModel->getById($item['product_id']);
            if (!$dbProduct)
                continue;

            $mismatch = (floatval($dbProduct['current_price']) !== floatval($item['price'])) ||
                (intval($dbProduct['stock_available']) < intval($item['quantity']));

            if ($mismatch)
                $validation['changed'] = true;

            $validation['items'][] = [
                'product_id' => $dbProduct['id'],
                'db_price' => $dbProduct['current_price'],
                'db_stock' => $dbProduct['stock_available'],
                'mismatch' => $mismatch
            ];
        }

        return ["status" => "success", "data" => $validation];
    }

    /**
     * Handle immediate spot order purchase
     */
    public function spotOrder($data)
    {
        $userId = $data['user_id'] ?? 1;

        // 1. PIN verification would happen here
        if (!isset($data['pin']) || strlen($data['pin']) !== 4) {
            return ["status" => "error", "message" => "Valid 4-digit PIN required"];
        }

        // 2. Immediate Validation on spot order
        $dbProduct = $this->productModel->getById($data['product_id']);
        if (floatval($dbProduct['current_price']) !== floatval($data['price'])) {
            return ["status" => "error", "mismatch" => true, "new_price" => $dbProduct['current_price'], "message" => "Price has changed!"];
        }

        return $this->orderModel->createSpotOrder(
            $userId,
            $data['product_id'],
            $data['quantity'],
            $data['price'],
            $data['pin']
        );
    }

    public function checkout($data)
    {
        // ... (Checkout logic would call createOrder in Model)
        return ["status" => "success", "message" => "Checkout complete"];
    }

    public function getHistory($data)
    {
        $userId = $data['user_id'] ?? 1;
        return ["status" => "success", "orders" => $this->orderModel->getUserOrders($userId)];
    }

    /**
     * Dispatch Order (WHM Action)
     */
    public function dispatchOrder($data)
    {
        $orderId = $data['order_id'];
        $query = "UPDATE orders SET status = 'Shipped' WHERE id = :oid";
        $stmt = $this->orderModel->getConn()->prepare($query);
        $stmt->execute([':oid' => $orderId]);
        return ["status" => "success", "message" => "Order marked as Shipped"];
    }

    /**
     * Confirm Delivery (Customer/Agent Action)
     */
    public function acknowledgeDelivery($data)
    {
        $orderId = $data['order_id'];
        $passcode = $data['passcode'];

        $success = $this->orderModel->acknowledgeDelivery($orderId, $passcode);

        if ($success) {
            // Trigger Commission Calculation
            require_once __DIR__ . '/AccountingController.php';
            $accounting = new AccountingController($this->orderModel->getConn());
            $accounting->calculateCommissions($orderId);

            return ["status" => "success", "message" => "Delivery Acknowledged. Commission Triggered."];
        }

        return ["status" => "error", "message" => "Invalid passcode or order status mismatch."];
    }
    public function listGlobalOrders($data)
    {
        $orders = [];
        $filters = [
            'session_id' => $data['session_id'] ?? null,
            'status' => $data['status'] ?? null,
            'is_urgent' => $data['is_urgent'] ?? null,
            'whm_view' => $data['whm_view'] ?? null
        ];
        $orders = $this->orderModel->getGlobalOrders($filters);
        return ["status" => "success", "data" => $orders];
    }

    public function getDetails($data)
    {
        if (empty($data['id'])) {
            return ["status" => "error", "message" => "Order ID required"];
        }
        $order = $this->orderModel->getOrderDetails($data['id']);
        if (!$order) {
            return ["status" => "error", "message" => "Order not found"];
        }
        return ["status" => "success", "data" => $order];
    }
}
