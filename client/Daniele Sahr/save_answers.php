<?php
// This script receives form data, formats it as a CSV, and saves it on the server.

// --- CONFIGURATION ---
// Define the full path to the directory where the file will be saved.
$save_path = '/var/www/azaelmontejo.com/html/client/Daniele Sahr';

// Define the redirect URL
$redirect_url = 'index.html';

// Email notification settings
$admin_email = 'montejoazaeljr@gmail.com';
$admin_phone = '15513641890'; // Format for SMS gateways

// --- SCRIPT LOGIC ---
// Only run script if the form was submitted using POST method.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the save directory exists, if not, try to create it.
    if (!file_exists($save_path)) {
        @mkdir($save_path, 0755, true);
    }

    // Set timezone to Eastern Time
    date_default_timezone_set('America/New_York');
    
    // Get the current date and time
    $current_time = new DateTime();
    $timestamp_for_filename = $current_time->format('Y-m-d_h-i-s_A');
    $submission_time = $current_time->format('Y-m-d h:i A') . ' Eastern Time';
    
    // Create a unique filename with timestamp
    $filename = $save_path . '/Daniele_Sahr_Fitness_Journey_' . $timestamp_for_filename . '.csv';
    
    // Prepare the CSV content.
    $csv_data = [];
    $headers = ['Question', 'Answer'];
    array_push($csv_data, $headers);
    
    // Add submission time as first data row
    array_push($csv_data, ['Submission Time', $submission_time]);

    // Prepare email content
    $email_body = "New submission from Daniele Sahr at $submission_time\n\n";

    // Loop through all the submitted form data.
    foreach ($_POST as $question => $answer) {
        // Sanitize the input lightly to prevent issues.
        $clean_question = trim($question);
        $clean_answer = trim($answer);
        
        // Add the question and answer as a new row in our data array.
        array_push($csv_data, [$clean_question, $clean_answer]);
        
        // Add to email body
        $email_body .= "Question: $clean_question\nAnswer: $clean_answer\n\n";
    }

    // Open file for writing
    $file_handle = fopen($filename, 'w');
    
    if ($file_handle === false) {
        error_log("Failed to open file for writing: $filename");
        die("Error: Could not open the file for writing. Please check the directory permissions.");
    }
    
    // Write each row to the CSV file
    foreach ($csv_data as $row) {
        fputcsv($file_handle, $row);
    }
    
    // Close the file
    fclose($file_handle);
    
    // Send email notification with improved error handling
    $subject = "Daniele Sahr has submitted her fitness questionnaire";
    $headers = "From: notifications@azaelmontejo.com\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    // Send the email and log result
    $mail_result = mail($admin_email, $subject, $email_body, $headers);
    if (!$mail_result) {
        error_log("Failed to send email notification to $admin_email");
    }
    
    // Send SMS notification with improved error handling
    $sms_message = "Daniele Sahr has submitted her fitness questionnaire at $submission_time";
    
    // Try multiple SMS gateways
    $gateways = [
        $admin_phone . '@tmomail.net', // T-Mobile
        $admin_phone . '@txt.att.net',  // AT&T
        $admin_phone . '@vtext.com'     // Verizon
    ];
    
    foreach ($gateways as $gateway) {
        $sms_result = mail($gateway, $subject, $sms_message);
        if ($sms_result) {
            break; // Stop if one succeeds
        }
    }
    
    // Redirect the user back to the questionnaire page with a success message in the URL.
    header('Location: ' . $redirect_url . '?status=success');
    exit(); // Stop the script from running further.
} else {
    // If someone tries to access this PHP file directly, redirect them.
    header('Location: ' . $redirect_url);
    exit();
}
?>
