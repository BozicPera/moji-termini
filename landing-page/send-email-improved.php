<?php
/**
 * Moji Termini - Improved Contact Form Handler
 * Better compatibility with shared hosting
 */

// Error logging (check logs in cPanel)
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// ===== CONFIGURATION - CHANGE THESE =====
$RECIPIENT_EMAIL = "info@mojitermini.rs"; // PROMENITE OVO!
$FROM_EMAIL = "noreply@" . $_SERVER['HTTP_HOST']; // Use your domain
$REPLY_TO_NAME = "Moji Termini Forma";
// ========================================

// Get POST data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$clinic = trim($_POST['clinic'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validate
$errors = [];
if (strlen($name) < 2) $errors[] = "Ime prekratko";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email nevažeći";
if (strlen($message) < 10) $errors[] = "Poruka prekratka";

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => implode(", ", $errors)]);
    exit;
}

// Honeypot check
if (!empty($_POST['website'])) {
    echo json_encode(["success" => true, "message" => "Poruka poslata"]);
    exit;
}

// Build email
$subject = "[Moji Termini] Nova poruka od: " . $name;

$email_body = "Nova poruka sa kontakt forme\n\n";
$email_body .= "Ime: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Telefon: " . ($phone ?: 'N/A') . "\n";
$email_body .= "Ordinacija: " . ($clinic ?: 'N/A') . "\n";
$email_body .= "Datum: " . date('d.m.Y H:i') . "\n\n";
$email_body .= "Poruka:\n" . wordwrap($message, 70) . "\n\n";
$email_body .= "---\n";
$email_body .= "Odgovorite direktno na: " . $email;

// Headers - CRITICAL for delivery
$headers = [];
$headers[] = "From: " . $REPLY_TO_NAME . " <" . $FROM_EMAIL . ">";
$headers[] = "Reply-To: " . $name . " <" . $email . ">";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Priority: 3";

// Additional parameters for better delivery
$additional_params = "-f" . $FROM_EMAIL;

// Send email
$mail_sent = @mail(
    $RECIPIENT_EMAIL,
    $subject,
    $email_body,
    implode("\r\n", $headers),
    $additional_params
);

// Log attempt
$log_entry = sprintf(
    "[%s] Email %s | To: %s | From: %s (%s)\n",
    date('Y-m-d H:i:s'),
    $mail_sent ? 'SENT' : 'FAILED',
    $RECIPIENT_EMAIL,
    $name,
    $email
);
@file_put_contents(__DIR__ . '/email.log', $log_entry, FILE_APPEND);

if ($mail_sent) {
    echo json_encode([
        "success" => true,
        "message" => "Poruka uspešno poslata! Odgovorićemo vam uskoro."
    ]);
} else {
    error_log("Mail function failed: " . print_r(error_get_last(), true));
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Greška pri slanju. Pokušajte ponovo ili nas kontaktirajte direktno na " . $RECIPIENT_EMAIL
    ]);
}
?>
