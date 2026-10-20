<?php
/**
 * Product Model (3-Tier)
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class Product extends Model
{
    protected $table_name = "base_products";

    /**
     * Create a single product
     */
    public function create($data)
    {
        $query = "INSERT INTO " . $this->table_name . " (product_name, brand, category, bulk_purchase_price, bulk_purchase_unit, unit_handling_cost, description, main_photo, added_by) 
                  VALUES (:name, :brand, :cat, :price, :unit, :cost, :desc, :photo, :by)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':name' => $data['product_name'],
            ':brand' => $data['brand'] ?? null,
            ':cat' => $data['category'] ?? null,
            ':price' => $data['bulk_purchase_price'] ?? 0,
            ':unit' => $data['bulk_purchase_unit'] ?? null,
            ':cost' => $data['unit_handling_cost'] ?? 0,
            ':desc' => $data['description'] ?? null,
            ':photo' => $data['main_photo'] ?? null,
            ':by' => $data['added_by'] ?? null
        ]);
        $id = $this->db->lastInsertId();

        // Auto-generate formal photo name if not provided (Web Upload flow)
        if (empty($data['main_photo'])) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['product_name'])));
            $photoName = "prod_{$id}_{$slug}.jpg";
            $this->update($id, ['main_photo' => $photoName]);
            return ['id' => $id, 'photo' => $photoName];
        }

        return ['id' => $id, 'photo' => $data['main_photo']];
    }

    /**
     * Batch create products
     */
    public function batchCreate($items)
    {
        $ids = [];
        $this->db->beginTransaction();
        try {
            foreach ($items as $item) {
                $ids[] = $this->create($item);
            }
            $this->db->commit();
            return $ids;
        }
        catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    /**
     * Check if product exists by name
     */
    public function existsByName($name)
    {
        $result = $this->where('product_name', $name);
        return !empty($result) ? $result[0] : false;
    }

    /**
     * Get all variants for a base product
     */
    public function getVariants($baseId)
    {
        $query = "SELECT * FROM product_variants WHERE base_product_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$baseId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get active show products (Auctions)
     */
    public function getActiveAuctions()
    {
        $query = "SELECT s.*, v.variant_name, b.product_name 
                  FROM show_products s
                  JOIN product_variants v ON s.variant_id = v.id
                  JOIN base_products b ON v.base_product_id = b.id
                  WHERE s.status = 'Active'";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update current price (Auction Wave)
     */
    public function updatePrice($showId, $newPrice)
    {
        $query = "UPDATE show_products SET current_price = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$newPrice, $showId]);
    }
}
?>
