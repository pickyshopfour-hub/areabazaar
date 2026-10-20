<?php
/**
 * QueryNotificationModel
 * Manages in-app notifications for the query thread system
 */
class QueryNotificationModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Create a new in-app notification
     */
    public function create($queryId, $recipientId, $recipientRole, $type, $message = null)
    {
        try {
            $stmt = $this->db->prepare(
                "INSERT INTO query_notifications
                 (query_id, recipient_id, recipient_role, type, message, is_read, created_at)
                 VALUES (:qid, :rid, :rrole, :type, :msg, 0, NOW())"
            );
            return $stmt->execute([
                ':qid' => $queryId,
                ':rid' => $recipientId,
                ':rrole' => $recipientRole,
                ':type' => $type,
                ':msg' => $message,
            ]);
        }
        catch (PDOException $e) {
            error_log("QueryNotificationModel::create Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all unread notifications for a recipient
     */
    public function getUnread($recipientId)
    {
        $stmt = $this->db->prepare(
            "SELECT n.*, q.subject_type, q.subject_id
             FROM query_notifications n
             LEFT JOIN queries q ON q.id = n.query_id
             WHERE n.recipient_id = :rid AND n.is_read = 0
             ORDER BY n.created_at DESC
             LIMIT 50"
        );
        $stmt->execute([':rid' => $recipientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Mark all notifications for a recipient as read
     */
    public function markAllRead($recipientId)
    {
        $stmt = $this->db->prepare(
            "UPDATE query_notifications SET is_read = 1 WHERE recipient_id = :rid AND is_read = 0"
        );
        return $stmt->execute([':rid' => $recipientId]);
    }

    /**
     * Mark a specific notification as read by ID
     */
    public function markOneRead($notifId)
    {
        $stmt = $this->db->prepare(
            "UPDATE query_notifications SET is_read = 1 WHERE id = :id"
        );
        return $stmt->execute([':id' => $notifId]);
    }

    /**
     * Count unread notifications for a recipient
     */
    public function countUnread($recipientId)
    {
        $stmt = $this->db->prepare(
            "SELECT COUNT(*) FROM query_notifications WHERE recipient_id = :rid AND is_read = 0"
        );
        $stmt->execute([':rid' => $recipientId]);
        return (int)$stmt->fetchColumn();
    }
}
?>
