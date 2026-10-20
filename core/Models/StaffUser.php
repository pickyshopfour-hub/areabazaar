<?php
/**
 * StaffUser Model
 * AreaBazaar PHP/MySQL REST API
 */

require_once 'Model.php';

class StaffUser extends Model
{
    protected $table_name = "staff_users";

    /**
     * Authenticate staff by phone and password
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
     * Check if user has specific staff role
     */
    public function hasRole($id, $role)
    {
        $user = $this->findById($id);
        return ($user && $user['role'] === $role);
    }
}
?>
