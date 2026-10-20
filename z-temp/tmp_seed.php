<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$db = new mysqli('localhost', 'root', '', 'areabazaar');
if ($db->connect_error)
    die("DB Connection Failed: " . $db->connect_error);
$db->set_charset("utf8mb4");

echo "Begin Seeding Process...\n";

// Helper function to insert and get ID
function insertRow($db, $table, $data)
{
    $keys = array_keys($data);
    $fields = implode(', ', $keys);
    $placeholders = implode(', ', array_fill(0, count($keys), '?'));

    $types = '';
    $values = [];
    foreach ($data as $val) {
        if (is_int($val))
            $types .= 'i';
        elseif (is_float($val) || is_double($val))
            $types .= 'd';
        else
            $types .= 's';
        $values[] = $val;
    }

    $stmt = $db->prepare("INSERT INTO $table ($fields) VALUES ($placeholders)");
    if (!$stmt)
        die("Prepare failed for $table: " . $db->error);
    $stmt->bind_param($types, ...$values);
    if (!$stmt->execute())
        die("Execute failed for $table: " . $stmt->error);
    return $db->insert_id;
}

// 1. Seed Base Products (15 rows)
$baseProducts = [
    ['product_name' => 'Indomie Instant Noodles', 'category' => 'Food'],
    ['product_name' => 'Dangote Sugar', 'category' => 'Food'],
    ['product_name' => 'Power Oil', 'category' => 'Food'],
    ['product_name' => 'Milo Beverage', 'category' => 'Beverage'],
    ['product_name' => 'Peak Milk', 'category' => 'Beverage'],
    ['product_name' => 'Golden Penny Spaghetti', 'category' => 'Food'],
    ['product_name' => 'Coca Cola', 'category' => 'Beverage'],
    ['product_name' => 'Knorr Cubes', 'category' => 'Food'],
    ['product_name' => 'Ariel Detergent', 'category' => 'Household'],
    ['product_name' => 'Morning Fresh', 'category' => 'Household'],
    ['product_name' => 'Dettol Soap', 'category' => 'Health'],
    ['product_name' => 'Always Ultra', 'category' => 'Health'],
    ['product_name' => 'Colgate Toothpaste', 'category' => 'Health'],
    ['product_name' => 'Bama Mayonnaise', 'category' => 'Food'],
    ['product_name' => 'Gino Tomato Paste', 'category' => 'Food']
];

$baseProductIds = [];
// Clear existing for clean run or just append? Let's just append.
foreach ($baseProducts as $bp) {
    if ($db->query("SELECT id FROM base_products WHERE product_name = '{$bp['product_name']}'")->num_rows > 0)
        continue;
    // Removed status
    $baseProductIds[] = insertRow($db, 'base_products', $bp);
}
if (empty($baseProductIds)) {
    $res = $db->query("SELECT id FROM base_products LIMIT 15");
    while ($r = $res->fetch_assoc())
        $baseProductIds[] = $r['id'];
}

echo "Base Products checked/seeded.\n";

// 2. Seed Product Variants (50 rows)
$variantIds = [];
$vCount = 0;
foreach ($baseProductIds as $bId) {
    for ($i = 1; $i <= 4; $i++) {
        $vCount++;
        if ($vCount > 55)
            break;
        $vname = "Variant " . $i . " for Product " . $bId;

        $chk = $db->query("SELECT id FROM product_variants WHERE base_product_id=$bId AND variant_name='$vname'");
        if ($chk->num_rows > 0) {
            $variantIds[] = $chk->fetch_assoc()['id'];
            continue;
        }

        $vdata = [
            'base_product_id' => $bId,
            'variant_name' => $vname,
            'quantity_value' => rand(1, 10),
            'quantity_unit' => 'Pack',
            'admin_approval' => 'Approved'
        ];
        $variantIds[] = insertRow($db, 'product_variants', $vdata);
    }
}
echo "Variants checked/seeded. Total Variants available: " . count($variantIds) . "\n";


// 3. Ensure Auction Sessions
$sessionIds = [];
$res = $db->query("SELECT id FROM auction_sessions LIMIT 5");
while ($r = $res->fetch_assoc())
    $sessionIds[] = $r['id'];

for ($i = count($sessionIds); $i < 5; $i++) {
    $sdata = [
        'session_name' => 'Seeded Session ' . ($i + 1),
        'session_type' => 'Standard',
        'target_zone' => 'LAG-01',
        'status' => 'Pending',
        'target_revenue' => 5000000
    ];
    $sessionIds[] = insertRow($db, 'auction_sessions', $sdata);
}
echo "Sessions checked/seeded.\n";


// 4. Seed Waves, Wave Items, Show Products, and Readiness Logs
foreach ($sessionIds as $sid) {
    // A. Readiness Logs
    $chk = $db->query("SELECT id FROM readiness_check_logs WHERE session_id=$sid AND check_type='Overall'");
    if ($chk->num_rows == 0) {
        $logData = [
            'session_id' => $sid,
            'whm_staff_id' => 10,
            'check_type' => 'Overall',
            'status' => 'Verified',
            'report_metadata' => '{"info":"Automated seed data"}'
        ];
        insertRow($db, 'readiness_check_logs', $logData);
        $db->query("UPDATE auction_sessions SET status='WHM Cleared' WHERE id=$sid AND status='Pending'");
    }

    // Determine how many variants for this session (15 items)
    shuffle($variantIds);
    $sessionVariants = array_slice($variantIds, 0, 15);

    // B. Waves
    $chk = $db->query("SELECT id FROM waves WHERE session_id=$sid");
    if ($chk->num_rows < 3) {
        $numWaves = rand(3, 5);
        $defaultSet = false;

        for ($w = 1; $w <= $numWaves; $w++) {
            $isDef = (!$defaultSet && $w == 1) ? 1 : 0;
            if ($isDef)
                $defaultSet = true;

            $wdata = [
                'session_id' => $sid,
                'wave_name' => "Wave $w for Session $sid",
                'status' => ($isDef ? 'Pending' : 'Pending'),
                'senior_admin_approval' => 1,
                'is_default' => $isDef,
                'metadata' => '{"info":"Seeded Wave"}'
            ];
            $waveId = insertRow($db, 'waves', $wdata);

            // C. Wave Items
            foreach ($sessionVariants as $vid) {
                // Determine a base price just internally for seeding
                $basePrice = rand(1000, 10000);

                // Adjust price depending on wave
                $priceMultiplier = 1.0;
                if ($w == 2)
                    $priceMultiplier = 0.95; // 5% discount
                elseif ($w == 3)
                    $priceMultiplier = 0.90;

                $newPrice = $basePrice * $priceMultiplier;

                $wid = insertRow($db, 'wave_items', [
                    'wave_id' => $waveId,
                    'variant_id' => $vid,
                    'new_price' => $newPrice,
                    'new_stock' => rand(50, 200),
                    'status' => 'Active'
                ]);

                // D. Show Products (Only for default wave)
                if ($isDef) {
                    $chkSP = $db->query("SELECT id FROM show_products WHERE session_id=$sid AND variant_id=$vid");
                    if ($chkSP->num_rows == 0) {
                        insertRow($db, 'show_products', [
                            'session_id' => $sid,
                            'variant_id' => $vid,
                            'starting_price' => $basePrice,
                            'current_price' => $newPrice,
                            'stock_available' => rand(50, 200),
                            'status' => 'Active'
                        ]);
                    }
                }
            }
        }
    }
}

echo "Waves, Wave Items, Show Products, Readiness Logs Seeded.\n";
echo "Done!\n";
?>
