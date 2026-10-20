<?php
/**
 * BankReport Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class BankReport extends Model
{
    protected $table_name = "bank_reports";

    public function getByRef($ref)
    {
        $stmt = $this->db->prepare("SELECT * FROM " . $this->table_name . " WHERE bank_ref = :ref LIMIT 1");
        $stmt->execute([':ref' => $ref]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getPending()
    {
        $stmt = $this->db->prepare("SELECT * FROM " . $this->table_name . " WHERE status = 'Unreconciled'");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status)
    {
        $stmt = $this->db->prepare("UPDATE " . $this->table_name . " SET status = :status WHERE id = :id");
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }
}
