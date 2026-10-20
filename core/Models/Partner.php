<?php
/**
 * Partner Model
 * AreaBazaar PHP/MySQL REST API
 * Handles SBA, ZBDp, and Agent partner records
 */

require_once 'Model.php';

class Partner extends Model
{
    protected $table_name = "partners";

    /**
     * Authenticate partner by phone and password
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
     * Find partners by type (SBA, ZBDp, Agent)
     */
    public function findByType($type)
    {
        return $this->where('partner_type', $type);
    }

    /**
     * Fetch pending approval partners, optionally filtered by type
     */
    public function findPendingApprovals($type = null)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE approval_status = 'Pending'";
        $params = [];

        if ($type) {
            $query .= " AND partner_type = :type";
            $params[':type'] = $type;
        }

        $query .= " ORDER BY time_created DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get all partners with optional filters
     */
    public function getAllPartners($filters = [])
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
        $params = [];

        if (!empty($filters['type'])) {
            $query .= " AND partner_type = :type";
            $params[':type'] = $filters['type'];
        }
        if (!empty($filters['approval_status'])) {
            $query .= " AND approval_status = :approval";
            $params[':approval'] = $filters['approval_status'];
        }
        if (!empty($filters['search'])) {
            $query .= " AND (name LIKE :search OR business_name LIKE :search2 OR phone_number LIKE :search3)";
            $params[':search'] = '%' . $filters['search'] . '%';
            $params[':search2'] = '%' . $filters['search'] . '%';
            $params[':search3'] = '%' . $filters['search'] . '%';
        }

        $query .= " ORDER BY time_created DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update approval status (SeniorAdmin action)
     */
    public function updateApprovalStatus($id, $status, $adminId, $notes = '')
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET approval_status = :status, 
                      approved_by = :admin, 
                      approval_notes = :notes,
                      time_approved = CASE WHEN :status2 = 'Approved' THEN NOW() ELSE time_approved END
                  WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            ':status' => $status,
            ':admin' => $adminId,
            ':notes' => $notes,
            ':status2' => $status,
            ':id' => $id
        ]);
    }

    /**
     * Get full partner details by ID
     */
    public function getPartnerDetails($id)
    {
        $query = "SELECT p.*, 
                         s1.name AS approved_by_name,
                         s2.name AS onboarded_by_name
                  FROM " . $this->table_name . " p
                  LEFT JOIN staff_users s1 ON p.approved_by = s1.id
                  LEFT JOIN staff_users s2 ON p.onboarded_by = s2.id
                  WHERE p.id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Create a single partner record
     */
    public function createPartner($data)
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  (name, phone_number, password_hash, partner_type, business_name, 
                   commission_rate, region_id, contact_info, supply_categories, 
                   vehicle_count, documents_json, onboarded_by, approval_status)
                  VALUES (:name, :phone, :pass, :type, :biz, :comm, :region, 
                          :contact, :supply, :vehicles, :docs, :onboarder, 'Pending')";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            ':name' => $data['name'],
            ':phone' => $data['phone_number'],
            ':pass' => password_hash($data['password'] ?? 'temp1234', PASSWORD_DEFAULT),
            ':type' => $data['partner_type'],
            ':biz' => $data['business_name'] ?? null,
            ':comm' => $data['commission_rate'] ?? 0.00,
            ':region' => $data['region_id'] ?? null,
            ':contact' => isset($data['contact_info']) ? json_encode($data['contact_info']) : null,
            ':supply' => isset($data['supply_categories']) ? json_encode($data['supply_categories']) : null,
            ':vehicles' => $data['vehicle_count'] ?? null,
            ':docs' => isset($data['documents_json']) ? json_encode($data['documents_json']) : null,
            ':onboarder' => $data['onboarded_by'] ?? null
        ]);
    }

    /**
     * Batch create partners from GS template push
     */
    public function batchCreate($partners, $onboardedBy = null)
    {
        $results = ['success' => 0, 'failed' => 0, 'errors' => []];

        foreach ($partners as $p) {
            try {
                $p['onboarded_by'] = $onboardedBy;
                $this->createPartner($p);
                $results['success']++;
            }
            catch (PDOException $e) {
                $results['failed']++;
                $results['errors'][] = ($p['name'] ?? 'Unknown') . ': ' . $e->getMessage();
            }
        }

        return $results;
    }

    /**
     * Get counts by approval status
     */
    public function getApprovalCounts()
    {
        $query = "SELECT approval_status, COUNT(*) as count 
                  FROM " . $this->table_name . " 
                  GROUP BY approval_status";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $counts = [];
        foreach ($rows as $row) {
            $counts[$row['approval_status']] = (int)$row['count'];
        }
        return $counts;
    }
}
?>
