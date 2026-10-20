<?php
/**
 * AccountingController
 * AreaBazaar PHP/MySQL REST API
 */

require_once __DIR__ . '/../Models/Model.php';

class AccountingController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Calculate and record PENDING commissions for an order
     * Triggered when order is marked as 'Delivered'
     */
    public function calculateCommissions($orderId)
    {
        try {
            // 1. Fetch Order and Items
            $orderQuery = "SELECT o.*, c.associated_ref_code 
                           FROM orders o 
                           JOIN customers c ON o.user_id = c.id 
                           WHERE o.id = :oid";
            $stmt = $this->db->prepare($orderQuery);
            $stmt->execute([':oid' => $orderId]);
            $order = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$order || !$order['associated_ref_code'])
                return;

            // 2. Fetch Partner (FRM) by Ref Code
            $partnerQuery = "SELECT id, commission_rate FROM partners WHERE name = :ref AND partner_type = 'FRM'";
            $stmt = $this->db->prepare($partnerQuery);
            $stmt->execute([':ref' => $order['associated_ref_code']]);
            $partner = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$partner)
                return;

            // 3. Calculate Amount (e.g., % of total or per item)
            $rate = $partner['commission_rate'] ?: 0.05; // Default 5%
            $commissionAmount = floatval($order['total_amount']) * $rate;

            // 4. Create Pending Commission Record
            $commQuery = "INSERT INTO commissions (partner_id, order_id, amount, status) 
                          VALUES (:pid, :oid, :amt, 'Pending')";
            $stmt = $this->db->prepare($commQuery);
            $stmt->execute([
                ':pid' => $partner['id'],
                ':oid' => $orderId,
                ':amt' => $commissionAmount
            ]);

            return ["status" => "success", "message" => "Commission recorded as Pending"];
        }
        catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    /**
     * Senior Admin marks commissions as APPROVED
     */
    public function approveCommissions($data)
    {
        $ids = $data['ids'] ?? [];
        if (empty($ids))
            return ["status" => "error", "message" => "No IDs provided"];

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query = "UPDATE commissions SET status = 'Approved', time_approved = NOW() 
                  WHERE id IN ($placeholders) AND status = 'Pending'";

        $stmt = $this->db->prepare($query);
        $stmt->execute($ids);

        return ["status" => "success", "message" => count($ids) . " commissions approved"];
    }

    /**
     * Batch Crediting Trigger (Credits all APPROVED to wallets)
     */
    public function processBatchCrediting()
    {
        $this->db->beginTransaction();
        try {
            // 1. Fetch all Approved commissions
            $query = "SELECT * FROM commissions WHERE status = 'Approved'";
            $stmt = $this->db->query($query);
            $commissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($commissions)) {
                return ["status" => "success", "message" => "No approved commissions to process."];
            }

            foreach ($commissions as $comm) {
                // 2. Update Partner Wallet
                $walletQuery = "UPDATE partner_wallets SET balance = balance + :amt 
                                WHERE partner_id = :pid";
                $wStmt = $this->db->prepare($walletQuery);
                $wStmt->execute([':amt' => $comm['amount'], ':pid' => $comm['partner_id']]);

                // 3. Mark as Credited
                $updateQuery = "UPDATE commissions SET status = 'Credited', time_credited = NOW() 
                                WHERE id = :id";
                $uStmt = $this->db->prepare($updateQuery);
                $uStmt->execute([':id' => $comm['id']]);
            }

            $this->db->commit();
            return ["status" => "success", "message" => count($commissions) . " commissions credited to wallets."];
        }
        catch (Exception $e) {
            $this->db->rollBack();
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    /**
     * Get statement for Partner Portal
     */
    public function getPartnerStatement($data)
    {
        $partnerId = $data['partner_id'] ?? 0;
        $query = "SELECT c.*, o.id as order_ref 
                  FROM commissions c 
                  JOIN orders o ON c.order_id = o.id 
                  WHERE c.partner_id = :pid 
                  ORDER BY c.time_created DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':pid' => $partnerId]);
        return ["status" => "success", "commissions" => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    }
}
