# 📧 Email Problem - Troubleshooting Guide

**Problem:** Forma pokazuje "Poruka uspešno poslata" ali email ne stiže.

---

## 🔍 Dijagnoza - Proveri Ove Korake

### 1. Proveri SPAM Folder

- [ ] Otvori email klijent
- [ ] Idi u **Spam/Junk** folder
- [ ] Pretraži po "Moji Termini"

**Ako je u spam-u:**
- Označi kao "Not Spam"
- Dodaj noreply@vasadomena.rs u kontakte

---

### 2. Proveri Da Li PHP mail() Radi na Hostingu

**Test skript:** Kreiraj `test-email.php`:

```php
<?php
$to = "vas-email@domen.rs"; // TVOJ EMAIL
$subject = "Test Email";
$message = "Ako vidiš ovu poruku, mail() funkcija radi!";
$headers = "From: noreply@" . $_SERVER['HTTP_HOST'];

if (mail($to, $subject, $message, $headers)) {
    echo "Email poslat! Proveri inbox/spam.";
} else {
    echo "mail() funkcija NE RADI na ovom hostingu.";
}
?>
```

**Uploaduj i otvori:** `http://vasadomena.rs/test-email.php`

**Rezultat:**
- ✅ **Email stigao** → PHP mail() radi, koristi Rešenje 1
- ❌ **Email nije stigao** → PHP mail() ne radi, koristi Rešenje 2 ili 3

---

### 3. Proveri Email Logove u cPanel

**Koraci:**
1. Login u cPanel
2. Email sekcija → **Email Deliverability** ili **Track Delivery**
3. Pogledaj Recent Messages
4. Traži poruke koje nisu dostavljene

**Česte greške:**
- `550 Relay access denied` → SMTP problem
- `554 Message rejected` → Spam filter
- `Connection timed out` → Server problem

---

## ✅ Rešenje 1: Poboljšan PHP Script (Probaj Prvo)

**Fajl:** `send-email-improved.php`

### Instalacija:

1. **Promeni email adresu:**
   ```php
   $RECIPIENT_EMAIL = "tvoj-pravi-email@domen.rs"; // Linija 17
   ```

2. **Uploaduj fajl** na server

3. **Promeni JavaScript** da koristi novi fajl:

   Otvori `js/main.js`, linija 99, zameni:
   ```javascript
   // Staro:
   const response = await fetch('send-email.php', {

   // Novo:
   const response = await fetch('send-email-improved.php', {
   ```

4. **Testiraj formu**

5. **Proveri logove:**
   - Otvori FTP
   - Pogledaj fajl `email.log` (kreiran automatski)
   - Videćeš da li je email SENT ili FAILED

**Prednosti:**
- ✅ Ne treba external servis
- ✅ Logging uključen
- ✅ Bolja kompatibilnost sa shared hostingom

**Mane:**
- ❌ I dalje zavisi od PHP mail()
- ❌ Može završiti u spam-u

---

## ✅ Rešenje 2: FormSubmit.co (Najlakše - Garantovano Radi)

**PREPORUČENO AKO PHP mail() NE RADI!**

### Šta je FormSubmit?
Besplatni servis koji prima HTML forme i šalje emailove. Ne treba backend kod!

### Setup (5 minuta):

**1. Otvori `index.html`**

**2. Pronađi `<form>` tag (linija ~444):**
```html
<form class="contact-form" id="contactForm">
```

**3. Zameni sa:**
```html
<form class="contact-form" action="https://formsubmit.co/tvoj-email@domen.rs" method="POST">
```

**4. Dodaj hidden polja (odmah posle `<form>`):**
```html
<input type="hidden" name="_subject" value="Nova poruka sa Moji Termini sajta">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_template" value="table">
<input type="text" name="_honey" style="display:none">
```

**5. UKLONI `id="contactForm"`** iz form taga (jer više ne koristimo JavaScript)

**6. Promeni name atribute (FormSubmit zahteva specifične nazive):**
```html
<!-- Staro -->
<input type="tel" id="phone" name="phone">

<!-- Novo -->
<input type="tel" id="phone" name="Telefon">
```

**7. Uploaduj izmenjeni `index.html`**

**8. Testiraj formu:**
- Popuni formu
- Submit
- **Dobićeš email za verifikaciju od FormSubmit**
- Klikni link u emailu da aktiviraš
- Sada sve poruke stižu!

**Kompletna forma primer:**
```html
<form class="contact-form" action="https://formsubmit.co/tvoj-email@domen.rs" method="POST">
    <input type="hidden" name="_subject" value="Nova poruka sa Moji Termini">
    <input type="hidden" name="_captcha" value="false">
    <input type="text" name="_honey" style="display:none">

    <div class="form-group">
        <label for="name">Ime i prezime *</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
        <label for="email">Email adresa *</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
        <label for="phone">Telefon</label>
        <input type="tel" id="phone" name="Telefon">
    </div>
    <div class="form-group">
        <label for="clinic">Naziv ordinacije</label>
        <input type="text" id="clinic" name="Ordinacija">
    </div>
    <div class="form-group">
        <label for="message">Poruka *</label>
        <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary btn-block">Pošalji poruku</button>
</form>
```

**Prednosti:**
- ✅ 100% radi (garantovano)
- ✅ Besplatno
- ✅ Nema PHP potreban
- ✅ Anti-spam ugrađen
- ✅ Email formatirani lijepo (table format)

**Mane:**
- ❌ Korisnik vidi FormSubmit stranicu posle submita (ali možeš redirect)
- ❌ Zavisi od external servisa

**Napomena:** Možeš zadržati JavaScript za validaciju, samo ukloni `e.preventDefault()` i fetch() deo.

---

## ✅ Rešenje 3: SMTP sa PHPMailer (Najsigurnije)

**Najbolje za production, ali zahteva više setup-a.**

### Koraci:

**1. Download PHPMailer**
- Idi na: https://github.com/PHPMailer/PHPMailer/releases
- Download ZIP
- Ekstraktuj `src/` folder
- Uploaduj kao `PHPMailer/` u landing-page folder

**Struktura:**
```
landing-page/
├── PHPMailer/
│   ├── src/
│   │   ├── PHPMailer.php
│   │   ├── SMTP.php
│   │   └── Exception.php
└── send-email-smtp.php
```

**2. Konfiguriši SMTP**

Otvori `send-email-smtp.php`, promeni:

**Za Gmail:**
```php
$SMTP_HOST = 'smtp.gmail.com';
$SMTP_PORT = 587;
$SMTP_USERNAME = 'tvoj-email@gmail.com';
$SMTP_PASSWORD = 'app-specific-password'; // NE obična lozinka!
```

**Kako dobiti Gmail App Password:**
1. Google Account → Security
2. 2-Step Verification → Enable
3. App passwords → Generate
4. Kopiraj 16-karakterni kod

**Za shared hosting email:**
```php
$SMTP_HOST = 'mail.vasadomena.rs';
$SMTP_PORT = 587; // ili 465 za SSL
$SMTP_USERNAME = 'info@vasadomena.rs';
$SMTP_PASSWORD = 'lozinka-od-email-naloga';
```

**3. Recipient email:**
```php
$RECIPIENT_EMAIL = 'tvoj-email@domen.rs';
```

**4. Promeni JavaScript (js/main.js, linija 99):**
```javascript
const response = await fetch('send-email-smtp.php', {
```

**5. Testiraj!**

**Prednosti:**
- ✅ Najsigurnije (ne ide u spam)
- ✅ Puna kontrola
- ✅ Radi sa bilo kojim SMTP serverom
- ✅ Error handling bolji

**Mane:**
- ❌ Zahteva više setup-a
- ❌ Treba SMTP credentials

---

## 🛠️ Debugging Tips

### Debug Mode u send-email-improved.php

Otvori `send-email-improved.php`, dodaj na početak:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

Sada će prikazati greške direktno.

### Proveri što email log kaže

Posle slanja forme, proveri `email.log` fajl:
```
[2026-05-04 15:30:22] Email SENT | To: info@mojitermini.rs | From: Test (test@test.com)
```

Ako piše `FAILED`, PHP mail() ne radi.

### Test različite FROM adrese

Neke shared hosting platforme dozvoljaju samo FROM adrese sa istim domenom:

```php
// Umesto:
$FROM_EMAIL = "noreply@mojitermini.rs";

// Probaj:
$FROM_EMAIL = "noreply@" . $_SERVER['HTTP_HOST'];
```

---

## 📊 Koji Metod Izabrati?

| Metod | Lakoća | Sigurnost | Besplatno | Preporuka |
|-------|---------|-----------|-----------|-----------|
| **send-email-improved.php** | ⭐⭐⭐ | ⭐⭐ | ✅ | Probaj prvo |
| **FormSubmit.co** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ | Ako PHP ne radi |
| **SMTP (PHPMailer)** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | Za production |

---

## 🚀 Brzi Action Plan

**Scenario 1: PHP mail() radi (email u spam-u)**
1. Koristi `send-email-improved.php`
2. Proveri SPF/DKIM rekorde u cPanel
3. Dodaj email u kontakte

**Scenario 2: PHP mail() ne radi (timeout, error)**
1. Koristi **FormSubmit.co** (5 min setup)
2. 100% garantovano radi

**Scenario 3: Production site, treba perfektno**
1. Setup **SMTP sa PHPMailer**
2. Koristi Gmail ili hosting SMTP
3. Testiraj temeljno

---

## 📞 Dodatna Pomoć

Ako ni jedan metod ne radi:

1. **Kontaktiraj hosting support:**
   - Pitaj: "Da li je PHP mail() omogućen?"
   - Pitaj: "Koji SMTP server da koristim?"

2. **Proveri hosting dokumentaciju:**
   - Traži "email setup"
   - Traži "SMTP settings"

3. **Alternative servise:**
   - SendGrid (besplatno 100 email/dan)
   - Mailgun (besplatno 100 email/dan)
   - EmailJS (JavaScript samo)

---

## ✅ Checklist

Posle primene rešenja:

- [ ] Email stiže u inbox (ne spam)
- [ ] Reply-To adresa je tačna (korisnikov email)
- [ ] Subject line je jasan
- [ ] Formatiranje je čitko
- [ ] Testirano sa 3+ email adrese
- [ ] Log fajlovi rade (ako koriste)
- [ ] Forma prikazuje success message
- [ ] Forma prikazuje error ako nešto podje naopako

---

**Preporuka:** Počni sa **FormSubmit.co** - radi odmah, besplatno, bez konfiguracije!

Posle možeš preći na SMTP ako hoćeš više kontrole.
