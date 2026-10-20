<?php
require_once '../core/includes/database.php';
require_once '../core/Controllers/QueryController.php';

$db = (new Database())->getConnection();
$ctrl = new QueryController($db);

$data = [
    'subject_id' => 0,
    'subject_type' => 'Global',
    'note' => 'Global Test Query'
];

$res = $ctrl->addQuery($data);
echo json_encode($res);
?>
