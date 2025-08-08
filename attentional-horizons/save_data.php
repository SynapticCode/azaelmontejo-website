<?php
// Set headers to allow cross-origin requests.
// For production, you should restrict this to your specific domain.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

// Define the absolute path to your secure data directory.
// IMPORTANT: This path MUST be outside your public_html or www directory.
$data_dir = '/home/monte/gamedata/'; // Replace 'monte' with your actual home directory username.

// Check if the required POST variables are set.
if (!isset($_POST['filename']) || !isset($_POST['filedata'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing parameters.']);
    exit;
}

// Sanitize the filename to prevent directory traversal attacks.
// This removes any '..' and '/' characters.
$file_name = basename(str_replace(['..', '/'], '', $_POST['filename']));
$file_data = $_POST['filedata'];

// Ensure the filename has a .csv extension.
if (substr($file_name, -4) !== '.csv') {
    $file_name .= '.csv';
}

$full_path = $data_dir . $file_name;

// Write the data to the file.
// The '@' symbol suppresses errors, which we handle manually.
if (@file_put_contents($full_path, $file_data) === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to write data to server. Check directory permissions.']);
} else {
    http_response_code(200);
    echo json_encode(['status' => 'success']);
}

exit;
?>
