<?php
$test_file = __DIR__ . '/test_write.txt';
$result = file_put_contents($test_file, "Test write at " . date('Y-m-d H:i:s'));

if ($result === false) {
    echo "Failed to write to file. Check permissions.";
    error_log("Failed to write to: $test_file");
} else {
    echo "Successfully wrote to file: $test_file";
}
?>
