<?php
/**
 * Moji Termini - Contact Form Handler
 *
 * Simple PHP script for handling contact form submissions
 * Sends email to specified address
 */

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

// Allow CORS (if needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Metoda nije dozvoljena. Koristite POST."
    ]);
    exit;
}

// Configuration
$RECIPIENT_EMAIL = "info@mojitermini.rs"; // PROMENITE OVO NA VAŠ EMAIL
$SUBJECT_PREFIX = "[Moji Termini] Nova poruka sa sajta";

// Get and sanitize POST data
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
$clinic = filter_input(INPUT_POST, 'clinic', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// Validate required fields
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = "Ime mora imati najmanje 2 karaktera";
}

if (!$email) {
    $errors[] = "Email adresa nije validna";
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = "Poruka mora imati najmanje 10 karaktera";
}

// If validation fails, return errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Greška pri validaciji",
        "errors" => $errors
    ]);
    exit;
}

// Simple spam protection (honeypot field check)
// Add hidden field in HTML form: <input type="text" name="website" style="display:none">
$honeypot = filter_input(INPUT_POST, 'website', FILTER_SANITIZE_STRING);
if (!empty($honeypot)) {
    // Looks like spam, silently reject
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Poruka uspešno poslata"
    ]);
    exit;
}

// Prepare email subject
$subject = $SUBJECT_PREFIX;
if (!empty($clinic)) {
    $subject .= " - " . $clinic;
}

// Prepare email body
$email_body = "═══════════════════════════════════════\n";
$email_body .= "  NOVA PORUKA SA MOJI TERMINI SAJTA\n";
$email_body .= "═══════════════════════════════════════\n\n";
$email_body .= "Datum: " . date('d.m.Y H:i:s') . "\n\n";
$email_body .= "───────────────────────────────────────\n";
$email_body .= "KONTAKT INFORMACIJE:\n";
$email_body .= "───────────────────────────────────────\n\n";
$email_body .= "Ime:         " . $name . "\n";
$email_body .= "Email:       " . $email . "\n";
$email_body .= "Telefon:     " . ($phone ?: 'Nije navedeno') . "\n";
$email_body .= "Ordinacija:  " . ($clinic ?: 'Nije navedeno') . "\n\n";
$email_body .= "───────────────────────────────────────\n";
$email_body .= "PORUKA:\n";
$email_body .= "───────────────────────────────────────\n\n";
$email_body .= wordwrap($message, 70, "\n") . "\n\n";
$email_body .= "═══════════════════════════════════════\n";
$email_body .= "Odgovorite direktno na: " . $email . "\n";
$email_body .= "═══════════════════════════════════════\n";

// Prepare email headers
$headers = [];
$headers[] = "From: Moji Termini <noreply@" . $_SERVER['HTTP_HOST'] . ">";
$headers[] = "Reply-To: " . $name . " <" . $email . ">";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

// Send email
$mail_sent = @mail(
    $RECIPIENT_EMAIL,
    $subject,
    $email_body,
    implode("\r\n", $headers)
);

// Check if email was sent successfully
if ($mail_sent) {
    // Success response
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Poruka uspešno poslata! Odgovorićemo vam uskoro."
    ]);

    // Optional: Log submission (for analytics)
    logSubmission($name, $email, $clinic);

} else {
    // Failed to send
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Greška pri slanju poruke. Molimo pokušajte ponovo ili nas kontaktirajte direktno."
    ]);

    // Optional: Log error
    error_log("Failed to send contact form email to: " . $RECIPIENT_EMAIL);
}

/**
 * Optional: Log submissions to a file
 * Useful for analytics and debugging
 */
function logSubmission($name, $email, $clinic) {
    $log_file = __DIR__ . '/logs/submissions.log';

    // Create logs directory if it doesn't exist
    if (!is_dir(__DIR__ . '/logs')) {
        @mkdir(__DIR__ . '/logs', 0755, true);
    }

    $log_entry = sprintf(
        "[%s] Name: %s | Email: %s | Clinic: %s\n",
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $clinic ?: 'N/A'
    );

    @file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

?>
