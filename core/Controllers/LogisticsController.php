<?php
require_once __DIR__ . '/../Models/Order.php';

class LogisticsController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getBenchmarks($data)
    {
        $stmt = $this->db->query("
            SELECT tbc.*, bp.product_name, dr.route_name 
            FROM transport_benchmark_cost tbc
            JOIN base_products bp ON tbc.base_product_id = bp.id
            LEFT JOIN delivery_routes dr ON tbc.route_id = dr.id
            ORDER BY tbc.id DESC
        ");
        return jsonResponse('success', 'benchmarks', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function toggleBenchmarkHidden($data)
    {
        if (empty($data['id']))
            return jsonResponse('error', 'Missing ID');
        $stmt = $this->db->prepare("UPDATE transport_benchmark_cost SET is_hidden = ? WHERE id = ?");
        $stmt->execute([$data['is_hidden'] ?? 0, $data['id']]);
        return jsonResponse('success', 'Benchmark status updated');
    }

    public function deleteBenchmark($data)
    {
        if (empty($data['id']))
            return jsonResponse('error', 'Missing ID');
        $stmt = $this->db->prepare("DELETE FROM transport_benchmark_cost WHERE id = ?");
        $stmt->execute([$data['id']]);
        return jsonResponse('success', 'Benchmark definition deleted');
    }

    public function uploadBenchmarkCsv($data)
    {
        if (!isset($_FILES['csv_file']) || $_FILES['csv_file']['error'] !== UPLOAD_ERR_OK) {
            return jsonResponse('error', 'Invalid CSV upload');
        }

        $file = $_FILES['csv_file']['tmp_name'];
        if (($handle = fopen($file, "r")) !== FALSE) {
            fgetcsv($handle); // Skip header row
            $stmt = $this->db->prepare("INSERT INTO transport_benchmark_cost (base_product_id, route_id, price_per_unit, is_hidden) VALUES (?, ?, ?, 0) ON DUPLICATE KEY UPDATE price_per_unit = VALUES(price_per_unit)");
            while (($row = fgetcsv($handle)) !== FALSE) {
                if (count($row) >= 3) {
                    $stmt->execute([$row[0], $row[1], $row[2]]);
                }
            }
            fclose($handle);
            return jsonResponse('success', 'Benchmarks imported successfully');
        }
        return jsonResponse('error', 'Could not process CSV');
    }
}
