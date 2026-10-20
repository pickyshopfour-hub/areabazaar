<?php
/**
 * Wallet Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class Wallet extends Model
{
    protected $table_name = "wallets";

    /**
     * Get user wallet by user ID
     */
    public function getWallet($userId)
    {
        $stmt = $this->db->prepare("SELECT * FROM " . $this->table_name . " WHERE customer_id = :id LIMIT 1");
        $stmt->execute([':id' => $userId]);
        $wallet = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$wallet) {
            // Create a wallet if it doesn't exist
            $this->create(['customer_id' => $userId, 'balance' => 0.00]);
            $stmt->execute([':id' => $userId]);
            $wallet = $stmt->fetch(PDO::FETCH_ASSOC);
        }

        return $wallet;
    }

    /**
     * Credit a user's wallet
     */
    public function creditWallet($userId, $amount)
    {
        $wallet = $this->getWallet($userId);
        $newBalance = $wallet['balance'] + $amount;
        $stmt = $this->db->prepare("UPDATE " . $this->table_name . " SET balance = :balance WHERE customer_id = :id");
        return $stmt->execute([':balance' => $newBalance, ':id' => $userId]);
    }
}
