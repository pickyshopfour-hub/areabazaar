<?php
/**
 * Product Controller
 * AreaBazaar PHP/MySQL REST API
 */

require_once '../core/Models/Product.php';
require_once '../core/Models/ProductVariant.php';

class ProductController
{
    private $db;
    private $productModel;
    private $variantModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->productModel = new Product($db);
        $this->variantModel = new ProductVariant($db);
    }

    /**
     * Add One or Many Products
     * POST /api/product/add
     */
    /**
     * Add One Product (Support for Multipart/Form-Data)
     * POST /api/product/add
     */
    public function addProduct()
    {
        // Handle both JSON and Form-Data
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        if (!$data)
            return jsonResponse('error', 'Invalid input');

        // 1. Create Base Product
        $res = $this->productModel->create($data);
        if (!$res)
            return jsonResponse('error', 'Failed to create product');

        $baseId = $res['id'];

        // 2. Handle File Upload if present
        if (!empty($_FILES['product_photo']) && $_FILES['product_photo']['error'] == UPLOAD_ERR_OK) {
            $photoExt = pathinfo($_FILES['product_photo']['name'], PATHINFO_EXTENSION);
            $cleanName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', strtolower($data['product_name']));
            $photoName = $cleanName . '_' . time() . '.' . $photoExt;
            $targetDir = "../assets/images/prod_photos/products/";
            if (!is_dir($targetDir))
                mkdir($targetDir, 0755, true);
            if (move_uploaded_file($_FILES['product_photo']['tmp_name'], $targetDir . $photoName)) {
                $this->productModel->update($baseId, ['main_photo' => $photoName]);
            }
        }

        // 3. Auto-create variant if specified or if no variants exist
        $hasVariants = ($data['has_variants'] == '1' || $data['has_variants'] === true);
        if (!$hasVariants) {
            $variantData = [
                'base_product_id' => $baseId,
                'variant_name' => $data['product_name'] . " (Standard)",
                'quantity_value' => $data['quantity_value'] ?? 1,
                'quantity_unit' => $data['quantity_unit'] ?? 'pcs'
            ];
            $this->variantModel->create($variantData);
        }

        return jsonResponse('success', 'Product added successfully', ['id' => $baseId]);
    }

    /**
     * Add One Variant (Support for Multipart/Form-Data)
     * POST /api/product/add-variant
     */
    public function addVariant()
    {
        // Handle both JSON and Form-Data
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        if (!$data)
            return jsonResponse('error', 'Invalid input');

        // 1. Ensure Base Product exists
        $baseId = $data['base_product_id'] ?? null;
        if (!$baseId) {
            $res = $this->productModel->create([
                'product_name' => $data['variant_name'],
                'category' => 'Uncategorized',
                'added_by' => 'SYSTEM'
            ]);
            $baseId = $res['id'];
        }

        // 2. Create Variant
        $data['base_product_id'] = $baseId;
        $res = $this->variantModel->create($data);
        if (!$res)
            return jsonResponse('error', 'Failed to create variant');

        $vId = $res['id'];

        // 3. Handle File Upload if present
        if (!empty($_FILES['variant_photo']) && $_FILES['variant_photo']['error'] == UPLOAD_ERR_OK) {
            $photoExt = pathinfo($_FILES['variant_photo']['name'], PATHINFO_EXTENSION);
            $cleanName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', strtolower($data['variant_name']));
            $photoName = $cleanName . '_' . time() . '.' . $photoExt;
            $targetDir = "../assets/images/prod_photos/variants/";
            if (!is_dir($targetDir))
                mkdir($targetDir, 0755, true);
            if (move_uploaded_file($_FILES['variant_photo']['tmp_name'], $targetDir . $photoName)) {
                $this->variantModel->update($vId, ['photo_path' => $photoName]);
            }
        }

        return jsonResponse('success', 'Variant added successfully', ['id' => $vId]);
    }

    /**
     * Update One Product (Support for Multipart/Form-Data)
     * POST /api/product/update
     */
    public function updateProduct()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['id']))
            return jsonResponse('error', 'Invalid input or missing ID');

        $id = $data['id'];
        unset($data['id']);

        // Handle File Upload if present
        if (!empty($_FILES['product_photo']) && $_FILES['product_photo']['error'] == UPLOAD_ERR_OK) {
            $photoExt = pathinfo($_FILES['product_photo']['name'], PATHINFO_EXTENSION);
            $cleanName = isset($data['product_name']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '_', strtolower($data['product_name'])) : 'product';
            $photoName = $cleanName . '_' . time() . '.' . $photoExt;
            $targetDir = "../assets/images/prod_photos/products/";
            if (!is_dir($targetDir))
                mkdir($targetDir, 0755, true);
            if (move_uploaded_file($_FILES['product_photo']['tmp_name'], $targetDir . $photoName)) {
                $data['main_photo'] = $photoName;
            }
        }

        $res = $this->productModel->update($id, $data);
        if ($res) {
            return jsonResponse('success', 'Product updated successfully');
        } else {
            return jsonResponse('error', 'Failed to update product');
        }
    }

    /**
     * Update One Variant (Support for Multipart/Form-Data)
     * POST /api/product/update-variant
     */
    public function updateVariant()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['id']))
            return jsonResponse('error', 'Invalid input or missing ID');

        $id = $data['id'];
        unset($data['id']);

        // Handle File Upload if present
        if (!empty($_FILES['variant_photo']) && $_FILES['variant_photo']['error'] == UPLOAD_ERR_OK) {
            $photoExt = pathinfo($_FILES['variant_photo']['name'], PATHINFO_EXTENSION);
            $cleanName = isset($data['variant_name']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '_', strtolower($data['variant_name'])) : 'variant';
            $photoName = $cleanName . '_' . time() . '.' . $photoExt;
            $targetDir = "../assets/images/prod_photos/variants/";
            if (!is_dir($targetDir))
                mkdir($targetDir, 0755, true);
            if (move_uploaded_file($_FILES['variant_photo']['tmp_name'], $targetDir . $photoName)) {
                $data['photo_path'] = $photoName;
            }
        }

        $res = $this->variantModel->update($id, $data);
        if ($res) {
            return jsonResponse('success', 'Variant updated successfully');
        } else {
            return jsonResponse('error', 'Failed to update variant');
        }
    }
    /**
     * Batch Ingest from Google Sheets (Entity-Specific Push Cycle)
     * POST /api/webhook/ingest
     */
    public function batchIngestFromGS()
    {
        // Simple API Key Check
        $apiKey = $_SERVER['HTTP_X_AB_KEY'] ?? '';
        if ($apiKey !== 'AB-GS-INGEST-KEY-2026') {
            return jsonResponse('error', 'Unauthorized Webhook Access', null);
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data)
            return jsonResponse('error', 'Invalid ingestion package');

        $products = !empty($data['products']) ? $data['products'] : null;
        $variants = !empty($data['variants']) ? $data['variants'] : null;
        $results = ['products' => [], 'variants' => [], 'errors' => []];

        try {
            $this->db->beginTransaction();

            // CYCLE 1: PRODUCT PUSH
            if ($products !== null) {
                foreach ($products as $p) {
                    try {
                        $tempId = $p['temp_ID'] ?? $p['temp_id'] ?? null;
                        unset($p['temp_id'], $p['temp_ID'], $p['original_photo_filename']);
                        if (!isset($p['main_photo']) && isset($p['photo_filename'])) {
                            $p['main_photo'] = $p['photo_filename'];
                        }
                        unset($p['photo_filename']);

                        $res = $this->productModel->create($p);
                        if ($res) {
                            $results['products'][] = [
                                'temp_id' => $tempId,
                                'actual_id' => $res['id'],
                                'photo_name' => $res['photo']
                            ];
                        }
                    } catch (Exception $e) {
                        $results['errors'][] = "Product Item Error: " . $e->getMessage();
                    }
                }
            }

            // CYCLE 2: VARIANT PUSH
            if ($variants !== null) {
                foreach ($variants as $v) {
                    try {
                        $tempId = $v['temp_id'] ?? $v['temp_ID'] ?? null;
                        unset($v['temp_id'], $v['temp_ID'], $v['original_photo_filename'], $v['parent_product_name']);
                        if (!isset($v['photo_path']) && isset($v['photo_filename'])) {
                            $v['photo_path'] = $v['photo_filename'];
                        }
                        unset($v['photo_filename']);

                        // STRICT VALIDATION: Must have parent ID from previous push
                        $baseId = $v['base_product_id'] ?? null;
                        if (!$baseId) {
                            $results['errors'][] = "Variant Error (TempID $tempId): Manual Parent ID required for GS ingestion. Parent may have failed ingestion.";
                            continue;
                        }

                        $v['base_product_id'] = $baseId;
                        $res = $this->variantModel->create($v);
                        if ($res) {
                            $results['variants'][] = [
                                'temp_id' => $tempId,
                                'actual_id' => $res['id'],
                                'photo_name' => $res['photo']
                            ];
                        }
                    } catch (Exception $e) {
                        $results['errors'][] = "Variant Item Error: " . $e->getMessage();
                    }
                }
            }

            $this->db->commit();
            $msg = ($products !== null ? "Product" : ($variants !== null ? "Variant" : "Entity")) . " push cycle completed";
            return jsonResponse('success', $msg, $results);

        } catch (Exception $e) {
            $this->db->rollBack();
            return jsonResponse('error', 'Critical ingestion failure: ' . $e->getMessage());
        }
    }

    /**
     * Import Products via CSV
     * POST /api/product/import-csv
     */
    public function importProductsByCsv()
    {
        if (empty($_FILES['csv_file'])) {
            return jsonResponse('error', 'No CSV file uploaded');
        }

        require_once '../core/Models/WaveItem.php';
        require_once '../core/Models/ShowProduct.php';
        require_once '../core/Models/Wave.php';

        $waveItemModel = new WaveItem($this->db);
        $showProdModel = new ShowProduct($this->db);
        $waveModel = new Wave($this->db);

        $file = $_FILES['csv_file']['tmp_name'];
        $handle = fopen($file, "r");
        $header = fgetcsv($handle); // Assuming first row is header

        $results = ['success_count' => 0, 'errors' => []];
        $addedBy = $_POST['admin_id'] ?? 'SYSTEM';

        while (($row = fgetcsv($handle)) !== FALSE) {
            $data = array_combine($header, $row);
            $data = sanitize($data);

            try {
                $this->db->beginTransaction();

                // Process Product Photo
                $pPhotoName = $data['product_photo'] ?? null;
                if ($pPhotoName) {
                    $src = "../assets/prod_photo_upload/" . $pPhotoName;
                    $cleanName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', strtolower($data['product_name']));
                    $destName = $cleanName . '_' . time() . '.' . pathinfo($pPhotoName, PATHINFO_EXTENSION);
                    $dest = "../assets/images/prod_photos/products/" . $destName;
                    if (file_exists($src)) {
                        if (!is_dir(dirname($dest)))
                            mkdir(dirname($dest), 0755, true);
                        copy($src, $dest);
                        $pPhotoName = $destName;
                    }
                }

                // 1. Create Base Product
                $prodData = [
                    'product_name' => $data['product_name'],
                    'category' => $data['category'] ?? 'General',
                    'description' => $data['description'] ?? '',
                    'main_photo' => $pPhotoName ?? '',
                    'added_by' => $addedBy
                ];
                $res = $this->productModel->create($prodData);
                $baseId = $res['id'];

                // 2. Handle Variants
                $vPhotoName = $data['variant_photo'] ?? $data['product_photo'] ?? 'default.jpg';
                if ($vPhotoName && $vPhotoName !== 'default.jpg' && file_exists("../assets/prod_photo_upload/" . $vPhotoName)) {
                    $src = "../assets/prod_photo_upload/" . $vPhotoName;
                    $vCleanName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', strtolower($data['product_name'] . "_Standard"));
                    $destName = $vCleanName . '_' . time() . '.' . pathinfo($vPhotoName, PATHINFO_EXTENSION);
                    $dest = "../assets/images/prod_photos/variants/" . $destName;
                    if (!is_dir(dirname($dest)))
                        mkdir(dirname($dest), 0755, true);
                    copy($src, $dest);
                    $vPhotoName = $destName;
                }

                $hasVariants = ($data['has_variants'] == '1');
                $variantId = null;

                if (!$hasVariants) {
                    $variantData = [
                        'base_product_id' => $baseId,
                        'variant_name' => $data['product_name'] . " (Standard)",
                        'quantity_value' => $data['quantity_value'] ?? 1,
                        'quantity_unit' => $data['quantity_unit'] ?? 'pcs',
                        'photo_path' => ($vPhotoName !== 'default.jpg') ? $vPhotoName : ($pPhotoName ?? 'default.jpg')
                    ];
                    $vRes = $this->variantModel->create($variantData);
                    $variantId = $vRes['id'];
                }

                // 3. Add to Session (Waves)
                $sessionId = $data['add_to_session'] ?? '';
                if (!empty($sessionId) && $variantId) {
                    // Find all waves for this session
                    $query = "SELECT id FROM waves WHERE session_id = :sid";
                    $stmt = $this->db->prepare($query);
                    $stmt->execute([':sid' => $sessionId]);
                    $waves = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($waves as $w) {
                        $waveItemModel->create([
                            'wave_id' => $w['id'],
                            'variant_id' => $variantId,
                            'new_price' => $data['unit_price'] ?? 0,
                            'new_stock' => $data['stock'] ?? 100
                        ]);
                    }
                }

                // 4. Add to ShowProd
                $showSessionId = $data['add_to_showprod'] ?? '';
                if (!empty($showSessionId) && $variantId) {
                    $showProdModel->addToSession(
                        $showSessionId,
                        $variantId,
                        $data['product_name'],
                        $data['unit_price'] ?? 0
                    );
                }

                $this->db->commit();
                $results['success_count']++;
            } catch (Exception $e) {
                $this->db->rollBack();
                $results['errors'][] = "Row error (" . $data['product_name'] . "): " . $e->getMessage();
            }
        }

        fclose($handle);
        return jsonResponse('success', 'CSV Import completed', $results);
    }

    /**
     * Approve or Reject Product / Variant
     * POST /api/product/approve
     */
    public function approveProduct()
    {
        $data = !empty($_POST) ? $_POST : json_decode(file_get_contents("php://input"), true);
        if (empty($data['id']) || empty($data['status'])) {
            return ["status" => "error", "message" => "Invalid input"];
        }
        $type = $data['type'] ?? 'product';
        if ($type === 'variant') {
            $res = $this->variantModel->update($data['id'], ['admin_approval' => $data['status']]);
        } else {
            $res = $this->productModel->update($data['id'], ['admin_approval' => $data['status']]);
        }
        return ["status" => $res ? "success" : "error", "message" => $res ? "Approval status updated" : "Failed to update status"];
    }

    /**
     * List all products with their variants
     * GET /api/products
     */
    public function listProducts()
    {
        $products = $this->productModel->findAll("product_name ASC");
        foreach ($products as &$p) {
            $p['variants'] = $this->variantModel->where('base_product_id', $p['id']);
        }
        return ["status" => "success", "data" => $products];
    }
}
?>