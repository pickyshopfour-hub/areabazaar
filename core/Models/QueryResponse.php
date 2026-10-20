<?php
/**
 * QueryResponseModel
 * Handles query response threads and per-response admin notes
 */
class QueryResponseModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Insert a new response into a query thread
     */
    public function create($data)
    {
        try {
            $stmt = $this->db->prepare(
                "INSERT INTO query_responses
                 (query_id, responder_id, responder_role, message, forwarded_to, forwarded_role, created_at)
                 VALUES (:qid, :rid, :rrole, :msg, :fwd, :fwdrole, NOW())"
            );
            $result = $stmt->execute([
                ':qid' => $data['query_id'],
                ':rid' => $data['responder_id'],
                ':rrole' => $data['responder_role'],
                ':msg' => $data['message'],
                ':fwd' => $data['forwarded_to'] ?? null,
                ':fwdrole' => $data['forwarded_role'] ?? null,
            ]);
            return $result ? $this->db->lastInsertId() : false;
        }
        catch (PDOException $e) {
            error_log("QueryResponseModel::create Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all responses for a query thread, ordered chronologically
     */
    public function findByQuery($queryId)
    {
        $stmt = $this->db->prepare(
            "SELECT r.*, GROUP_CONCAT(
                JSON_OBJECT('id', n.id, 'author_id', n.author_id, 'author_role', n.author_role, 'note', n.note, 'created_at', n.created_at)
                ORDER BY n.created_at ASC SEPARATOR '|||'
             ) AS notes_raw
             FROM query_responses r
             LEFT JOIN query_response_notes n ON n.response_id = r.id
             WHERE r.query_id = :qid
             GROUP BY r.id
             ORDER BY r.created_at ASC"
        );
        $stmt->execute([':qid' => $queryId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Parse notes from concatenated JSON
        foreach ($rows as &$row) {
            if (!empty($row['notes_raw'])) {
                $row['notes'] = array_map(
                fn($n) => json_decode($n, true),
                    explode('|||', $row['notes_raw'])
                );
            }
            else {
                $row['notes'] = [];
            }
            unset($row['notes_raw']);
        }
        return $rows;
    }

    /**
     * Add a note (comment) to a specific response
     */
    public function addNote($responseId, $authorId, $authorRole, $note)
    {
        try {
            $stmt = $this->db->prepare(
                "INSERT INTO query_response_notes (response_id, author_id, author_role, note, created_at)
                 VALUES (:rid, :aid, :arole, :note, NOW())"
            );
            return $stmt->execute([
                ':rid' => $responseId,
                ':aid' => $authorId,
                ':arole' => $authorRole,
                ':note' => $note,
            ]);
        }
        catch (PDOException $e) {
            error_log("QueryResponseModel::addNote Error: " . $e->getMessage());
            return false;
        }
    }
}
?>
