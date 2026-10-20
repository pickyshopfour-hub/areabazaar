<?php
/**
 * PaymentReport Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class PaymentReport extends Model
{
    protected $table_name = "payment_reports";

    /**
     * Submit a new payment report
     */
    public function submitReport($data)
    {
        return $this->create($data);
    }

    /**
     * Get pending reports for reconciliation
     */
    public function getPending()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE status = 'Pending'";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
