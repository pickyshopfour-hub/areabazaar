<?php
/**
 * ProductVariant Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class ProductVariant extends Model
{
    protected $table_name = "product_variants";

    /**
     * Create a single variant
     */
    public function create($data)
    {
        $query = "INSERT INTO " . $this->table_name . " (base_product_id, variant_name, quantity_value, quantity_unit, photo_path, presentation_type) 
                  VALUES (:base_id, :name, :val, :unit, :photo, :type)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':base_id' => $data['base_product_id'],
            ':name' => $data['variant_name'],
            ':val' => $data['quantity_value'] ?? 1,
            ':unit' => $data['quantity_unit'] ?? 'pcs',
            ':photo' => $data['photo_path'] ?? null,
            ':type' => $data['presentation_type'] ?? 'Auction-unit'
        ]);
        $id = $this->db->lastInsertId();

        // Auto-generate formal photo name if not provided (Web Upload flow)
        if (empty($data['photo_path'])) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['variant_name'])));
            $photoName = "var_{$id}_{$slug}.jpg";
            $this->update($id, ['photo_path' => $photoName]);
            return ['id' => $id, 'photo' => $photoName];
        }

        return ['id' => $id, 'photo' => $data['photo_path']];
    }

    /**
     * Batch create variants
     */
    public function batchCreate($items)
    {
        $this->db->beginTransaction();
        try {
            foreach ($items as $item) {
                $this->create($item);
            }
            return $this->db->commit();
        }
        catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
}
?>
