<?php
/**
 * PaymentRequest Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class PaymentRequest extends Model
{
    protected $table_name = "payment_requests";

    /**
     * Create a new payment request with unique ref
     */
    public function createRequest($userId, $amount, $method)
    {
        $ref = 'AB-' . strtoupper(substr(uniqid(), -8));
        $data = [
            'user_id' => $userId,
            'amount' => $amount,
            'method' => $method,
            'invoice_refindex' => $ref,
            'status' => 'Pending'
        ];
        return $this->create($data) ? $ref : false;
    }

    /**
     * Find by reference code
     */
    public function findByRef($ref)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE invoice_refindex = :ref LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":ref", $ref);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Update status by reference
     */
    public function updateStatus($ref, $status)
    {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE invoice_refindex = :ref";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([':status' => $status, ':ref' => $ref]);
    }
}
