<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$category = isset($_GET['category']) ? $_GET['category'] : '';

if (empty($category)) {
    echo json_encode(['error' => 'Category is required']);
    exit;
}

$directory = "../images/" . $category;
$images = [];

if (is_dir($directory)) {
    $files = scandir($directory);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..' && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
            $images[] = "/image-slider/images/" . $category . "/" . $file; // Adjust the base URL as needed
        }
    }
}

echo json_encode($images);
?>
