<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

function clean_input(string $value): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\n", "%0a", "%0d"], '', $value);
    return strip_tags($value);
}

$name   = isset($_POST['name']) ? clean_input((string) $_POST['name']) : '';
$clinic = isset($_POST['clinic']) ? clean_input((string) $_POST['clinic']) : '';
$role   = isset($_POST['role']) ? clean_input((string) $_POST['role']) : '';
$email  = isset($_POST['email']) ? clean_input((string) $_POST['email']) : '';

$errors = [];

if ($name === '' || $clinic === '' || $role === '' || $email === '') {
    $errors[] = 'All fields are required.';
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}

if (!empty($errors)) {
    http_response_code(400);
    exit(implode(' ', $errors));
}

$to = 'your-email@example.com'; // TODO: replace with your real email address
$subject = 'New Demo Request - ClinicFlow Landing Page';

$bodyLines = [
    'You received a new demo request:',
    '',
    'Name: ' . $name,
    'Clinic: ' . $clinic,
    'Role: ' . $role,
    'Email: ' . $email,
    '',
    'Submitted at: ' . date('Y-m-d H:i:s'),
    'IP Address: ' . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown'),
];

$body = implode("\n", $bodyLines);

$headers = [
    'From: no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'),
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    exit('Sorry, we could not send your request right now. Please try again later.');
}

header('Location: thank-you.html');
exit;
