<?php
/**
 * ShowProduct Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class ShowProduct extends Model
{
    protected $table_name = "show_products";

    /**
     * Add product variant to a session
     */
    public function addToSession($sessionId, $variantId, $displayName, $startingPrice)
    {
        $data = [
            'session_id' => $sessionId,
            'variant_id' => $variantId,
            'display_name' => $displayName,
            'starting_price' => $startingPrice,
            'current_price' => $startingPrice,
            'status' => 'Active'
        ];
        return $this->create($data);
    }

    /**
     * Update price for a wave
     */
    public function updatePrice($id, $newPrice)
    {
        $query = "UPDATE " . $this->table_name . " SET current_price = :price WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":price", $newPrice);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    /**
     * Get products for a session
     */
    public function getBySession($sessionId)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE session_id = :session_id AND status = 'Active'";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":session_id", $sessionId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get a single product by ID
     */
    public function getById($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
