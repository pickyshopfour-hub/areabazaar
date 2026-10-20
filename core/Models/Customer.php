<?php
/**
 * Customer Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class Customer extends Model
{
    protected $table_name = "customers";

    /**
     * Authenticate customer by phone and password
     */
    public function authenticate($phone, $password)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE phone_number = ? LIMIT 0,1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $phone);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password_hash'])) {
            return $user;
        }
        return false;
    }

    /**
     * Verify Wallet PIN
     */
    public function verifyPIN($id, $pin)
    {
        $user = $this->findById($id);
        return ($user && $user['auth_pin'] === $pin);
    }

    /**
     * Generate new DeliveryPassCode
     */
    public function generatePassCode($id)
    {
        $code = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6);
        return $this->update($id, ['delivery_passcode' => $code]);
    }
}
?>
