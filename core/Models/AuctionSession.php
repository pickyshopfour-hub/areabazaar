<?php
/**
 * AuctionSession Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class AuctionSession extends Model
{
    protected $table_name = "auction_sessions";

    /**
     * Start a new auction session (Draft)
     */
    public function startSession($data)
    {
        $insertData = [
            'session_name' => $data['name'],
            'type' => $data['type'] ?? 'mixed-auction',
            'target_zone' => $data['target_zone'] ?? null,
            'status' => 'Draft'
        ];
        return $this->create($insertData);
    }

    /**
     * Update session settings (SeniorAdmin focus)
     */
    public function updateSettings($id, $data)
    {
        return $this->update($id, $data);
    }

    /**
     * Update session status
     */
    public function updateStatus($id, $status)
    {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    /**
     * Set Senior Admin Approval
     */
    public function setSeniorApproval($id, $approved = 1)
    {
        $query = "UPDATE " . $this->table_name . " SET senior_admin_approval = :app WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(":app", $approved, PDO::PARAM_INT);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Get currently active session
     */
    public function getActiveSession()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE status = 'Active' LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
