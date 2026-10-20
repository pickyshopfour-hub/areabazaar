<?php
/**
 * Wave Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class Wave extends Model
{
    protected $table_name = "waves";

    /**
     * Get items associated with this wave
     */
    public function getItems($waveId)
    {
        $query = "SELECT wi.*, pv.variant_name, pv.quantity_value, pv.quantity_unit, pv.photo_path 
                  FROM wave_items wi
                  JOIN product_variants pv ON wi.variant_id = pv.id
                  WHERE wi.wave_id = :wave_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":wave_id", $waveId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get the next pending scheduled wave for a session
     */
    public function getNextScheduled($sessionId)
    {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE session_id = :session_id 
                  AND status = 'Pending' 
                  AND scheduled_at <= NOW() 
                  ORDER BY scheduled_at DESC 
                  LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":session_id", $sessionId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
