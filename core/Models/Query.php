<?php
/**
 * QueryModel — Extended
 * Handles all query thread read/write operations
 */
class QueryModel
{
    private $db;
    private $table_name = "queries";

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Create a new query thread
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO queries
                      (subject_type, subject_id, creator_id, creator_role, assigned_to, assigned_role, note, flag_types, priority, status, created_at, last_activity)
                      VALUES (:stype, :sid, :cid, :crole, :assigned_to, :assigned_role, :note, :flags, :priority, 'Open', NOW(), NOW())";

            $stmt = $this->db->prepare($query);
            $flags = isset($data['flag_types'])
                ? (is_array($data['flag_types']) ? json_encode($data['flag_types']) : $data['flag_types'])
                : null;

            return $stmt->execute([
                ':stype' => $data['subject_type'],
                ':sid' => $data['subject_id'],
                ':cid' => $data['creator_id'] ?? 1,
                ':crole' => $data['creator_role'] ?? 'Admin',
                ':assigned_to' => $data['assigned_to'] ?? null,
                ':assigned_role' => $data['assigned_role'] ?? null,
                ':note' => $data['note'],
                ':flags' => $flags,
                ':priority' => $data['priority'] ?? 'Normal',
            ]);
        }
        catch (PDOException $e) {
            error_log("QueryModel::create Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Find a single query by ID
     */
    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM queries WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * List all queries with optional filters
     * @param array $filters Keys: status, priority, assigned_to, assigned_role, creator_id, unassigned_only
     */
    public function findAll($filters = [], $limit = 200)
    {
        $where = ["1=1"];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = "status = :status";
            $params[':status'] = $filters['status'];
        }
        else {
            // Default: exclude archived
            $where[] = "status != 'Archived'";
        }

        if (!empty($filters['priority'])) {
            $where[] = "priority = :priority";
            $params[':priority'] = $filters['priority'];
        }

        if (!empty($filters['assigned_to'])) {
            $where[] = "assigned_to = :assigned_to";
            $params[':assigned_to'] = $filters['assigned_to'];
        }

        if (!empty($filters['assigned_role'])) {
            $where[] = "assigned_role = :assigned_role";
            $params[':assigned_role'] = $filters['assigned_role'];
        }

        if (!empty($filters['creator_id'])) {
            $where[] = "creator_id = :creator_id";
            $params[':creator_id'] = $filters['creator_id'];
        }

        if (!empty($filters['unassigned_only'])) {
            $where[] = "(assigned_to IS NULL OR assigned_to = 0)";
        }

        $whereStr = implode(' AND ', $where);
        $stmt = $this->db->prepare(
            "SELECT * FROM queries WHERE {$whereStr} ORDER BY last_activity DESC LIMIT :limit"
        );
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update query fields
     */
    public function update($id, $data)
    {
        $allowed = ['priority', 'status', 'assigned_to', 'assigned_role', 'closed_by', 'close_reason', 'last_activity'];
        $sets = [];
        $params = [':id' => $id];

        foreach ($data as $key => $val) {
            if (in_array($key, $allowed)) {
                $sets[] = "`{$key}` = :{$key}";
                $params[":{$key}"] = $val;
            }
        }

        if (empty($sets))
            return false;

        // Always stamp last_activity
        if (!array_key_exists(':last_activity', $params)) {
            $sets[] = "`last_activity` = NOW()";
        }

        $sql = "UPDATE queries SET " . implode(', ', $sets) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    /**
     * Get open threads with no activity in the last $days days (cold threads)
     */
    public function getCold($days = 4)
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM queries
             WHERE status = 'Open'
               AND last_activity < NOW() - INTERVAL :days DAY
             ORDER BY last_activity ASC"
        );
        $stmt->bindValue(':days', (int)$days, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Archive closed threads older than $days days (prune)
     * Returns count of rows affected
     */
    public function pruneOld($days = 28)
    {
        $stmt = $this->db->prepare(
            "UPDATE queries
             SET status = 'Archived', last_activity = NOW()
             WHERE status = 'Closed'
               AND last_activity < NOW() - INTERVAL :days DAY"
        );
        $stmt->bindValue(':days', (int)$days, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount();
    }

    /**
     * Get the last inserted ID (for use after create)
     */
    public function lastInsertId()
    {
        return $this->db->lastInsertId();
    }
}
?>
