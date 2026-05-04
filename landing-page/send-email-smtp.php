<?php
/**
 * Moji Termini - SMTP Contact Form Handler
 * Uses PHPMailer for reliable email delivery
 *
 * INSTALLATION:
 * 1. Upload PHPMailer library or use composer:
 *    composer require phpmailer/phpmailer
 * 2. Configure SMTP settings below
 * 3. Update form action to use this file
 */

// If using composer autoloader
// require 'vendor/autoload.php';

// OR manual include (download from https://github.com/PHPMailer/PHPMailer)
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';
require_once 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// ===== SMTP CONFIGURATION =====
// Option 1: Gmail SMTP
$SMTP_HOST = 'smtp.gmail.com';
$SMTP_PORT = 587;
$SMTP_USERNAME = 'vas-email@gmail.com'; // Gmail adresa
$SMTP_PASSWORD = 'vaša-app-specific-password'; // Gmail App Password (ne obična lozinka!)

// Option 2: Shared Hosting SMTP (obično)
// $SMTP_HOST = 'mail.vasadomena.rs';
// $SMTP_PORT = 587;
// $SMTP_USERNAME = 'info@vasadomena.rs';
// $SMTP_PASSWORD = 'vašalozinka';

// Recipient
$RECIPIENT_EMAIL = 'info@mojitermini.rs';
$RECIPIENT_NAME = 'Moji Termini';
// ================================

// Get POST data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$clinic = trim($_POST['clinic'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validate
if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Podaci nisu validni"]);
    exit;
}

// Honeypot
if (!empty($_POST['website'])) {
    echo json_encode(["success" => true, "message" => "Poruka poslata"]);
    exit;
}

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // SMTP settings
    $mail->isSMTP();
    $mail->Host = $SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = $SMTP_USERNAME;
    $mail->Password = $SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $SMTP_PORT;
    $mail->CharSet = 'UTF-8';

    // Recipients
    $mail->setFrom($SMTP_USERNAME, 'Moji Termini Forma');
    $mail->addAddress($RECIPIENT_EMAIL, $RECIPIENT_NAME);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(false);
    $mail->Subject = "[Moji Termini] Nova poruka od: " . $name;

    $mail->Body = "Nova poruka sa kontakt forme\n\n";
    $mail->Body .= "Ime: " . $name . "\n";
    $mail->Body .= "Email: " . $email . "\n";
    $mail->Body .= "Telefon: " . ($phone ?: 'N/A') . "\n";
    $mail->Body .= "Ordinacija: " . ($clinic ?: 'N/A') . "\n";
    $mail->Body .= "Datum: " . date('d.m.Y H:i') . "\n\n";
    $mail->Body .= "Poruka:\n" . wordwrap($message, 70) . "\n\n";
    $mail->Body .= "---\nOdgovorite direktno na: " . $email;

    // Send
    $mail->send();

    echo json_encode([
        "success" => true,
        "message" => "Poruka uspešno poslata! Odgovorićemo vam uskoro."
    ]);

} catch (Exception $e) {
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Greška pri slanju emaila. Pokušajte ponovo."
    ]);
}
?>
