<?php
/**
 * Baseline Model Class
 * AreaBazaar PHP/MySQL REST API
 */

abstract class Model
{
    protected $db;
    protected $table_name;
    protected $primary_key = 'id';

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getConn()
    {
        return $this->db;
    }

    /**
     * Create a new record
     */
    public function create($data)
    {
        $fields = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));

        $query = "INSERT INTO " . $this->table_name . " ($fields) VALUES ($placeholders)";
        $stmt = $this->db->prepare($query);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    /**
     * Find record by ID
     */
    public function findById($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE " . $this->primary_key . " = ? LIMIT 0,1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Update a record
     */
    public function update($id, $data)
    {
        $fields = "";
        foreach ($data as $key => $value) {
            $fields .= "$key = :$key, ";
        }
        $fields = rtrim($fields, ", ");

        $query = "UPDATE " . $this->table_name . " SET $fields WHERE " . $this->primary_key . " = :target_id";
        $stmt = $this->db->prepare($query);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
        $stmt->bindValue(":target_id", $id);

        return $stmt->execute();
    }

    /**
     * Delete a record
     */
    public function delete($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE " . $this->primary_key . " = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $id);

        return $stmt->execute();
    }

    /**
     * Get all records
     */
    public function findAll($order = null)
    {
        $query = "SELECT * FROM " . $this->table_name;
        if ($order) {
            $query .= " ORDER BY $order";
        }
        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Simple WHERE filter
     */
    public function where($field, $value, $operator = "=")
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE $field $operator ?";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $value);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Log a sensitive action to audit_logs
     */
    public function auditLog($userId, $userType, $action, $entity, $oldData = null, $newData = null)
    {
        $query = "INSERT INTO audit_logs (user_id, user_type, action, entity_affected, old_data, new_data, ip_address) 
                  VALUES (:uid, :utype, :act, :ent, :old, :new, :ip)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            ':uid' => $userId,
            ':utype' => $userType,
            ':act' => $action,
            ':ent' => $entity,
            ':old' => $oldData ? json_encode($oldData) : null,
            ':new' => $newData ? json_encode($newData) : null,
            ':ip' => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'
        ]);
    }
}
?>
