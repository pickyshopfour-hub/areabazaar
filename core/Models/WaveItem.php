<?php
/**
 * WaveItem Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';
require_once 'ShowProduct.php';

class WaveItem extends Model
{
    protected $table_name = "wave_items";

    /**
     * Adopt this wave item as a general show_product (Non-Auction)
     * Ensuring no duplicates for the same variant in the same session context (if applicable)
     */
    public function adoptAsShowProduct($waveItemId, $sessionId)
    {
        $item = $this->findById($waveItemId);
        if (!$item)
            return false;

        $showProductModel = new ShowProduct($this->db);

        // Check if show_product already exists for this variant and session
        $query = "SELECT id FROM show_products WHERE variant_id = :vid AND session_id = :sid";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':vid' => $item['variant_id'], ':sid' => $sessionId]);
        $existing = $stmt->fetch();

        if ($existing) {
            // Update existing show_product price/stock if needed? 
            // For now, let's just update the price as per User Req: "adopt wave_item as show_product"
            return $showProductModel->updatePrice($existing['id'], $item['new_price']);
        }
        else {
            // Fetch variant name for display_name
            $query = "SELECT variant_name FROM product_variants WHERE id = :vid";
            $stmt = $this->db->prepare($query);
            $stmt->execute([':vid' => $item['variant_id']]);
            $variant = $stmt->fetch();

            return $showProductModel->addToSession(
                $sessionId,
                $item['variant_id'],
                $variant['variant_name'],
                $item['new_price']
            );
        }
    }
}
?>
