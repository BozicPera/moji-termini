# Moji Termini - Landing Page

Profesionalna landing stranica za **Moji Termini** - sistem za zakazivanje termina za male ordinacije u Srbiji.

---

## 📋 Opis

Kompletna, responzivna landing stranica sa svim potrebnim sekcijama:

- ✅ Hero sekcija sa CTA
- ✅ Problemi koje rešavate
- ✅ Mogućnosti sistema
- ✅ Kako funkcioniše (3 koraka)
- ✅ Testimonials (preporuke korisnika)
- ✅ Cenovnik (3 paketa)
- ✅ FAQ (često postavljana pitanja)
- ✅ Kontakt forma
- ✅ Footer

---

## 🎨 Dizajn

- **Jezik:** Srpski
- **Stilizacija:** Custom CSS (bez frameworka)
- **Font:** Inter (Google Fonts)
- **Boje:** Plava (#3B82F6) kao primarna
- **Responzivnost:** Mobile-first dizajn
- **Animacije:** Smooth scroll, fade-in efekti

---

## 📁 Struktura Fajlova

```
landing-page/
├── index.html          # Glavna HTML stranica
├── css/
│   └── style.css       # Svi stilovi
├── js/
│   └── main.js         # JavaScript funkcionalnost
├── images/             # Folder za slike (prazan, dodajte po potrebi)
└── README.md           # Ova dokumentacija
```

---

## 🚀 Deployment na Shared Hosting

### Korak 1: Priprema Fajlova

Svi potrebni fajlovi su već kreirani. Struktura je spremna za upload.

### Korak 2: Upload na Shared Hosting

#### Via FTP (FileZilla, WinSCP)

1. Povežite se na vaš shared hosting preko FTP
2. Navigirajte do `public_html` ili `www` foldera
3. Uploadujte sve fajlove i foldere:
   ```
   public_html/
   ├── index.html
   ├── css/
   │   └── style.css
   ├── js/
   │   └── main.js
   └── images/
   ```

#### Via cPanel File Manager

1. Ulogujte se u cPanel
2. Otvorite **File Manager**
3. Idite u `public_html` folder
4. Kliknite **Upload**
5. Uploadujte sve fajlove

### Korak 3: Postavite Dozvole (Permissions)

- **Folderi:** 755
- **Fajlovi:** 644

```bash
# Ako imate SSH pristup
chmod 755 public_html
chmod 644 public_html/index.html
chmod 644 public_html/css/style.css
chmod 644 public_html/js/main.js
```

### Korak 4: Testiranje

1. Otvorite browser
2. Idite na vašu domenu: `http://vasadomena.rs`
3. Proverite:
   - ✅ Stranica se učitava
   - ✅ Stilovi se primenjuju
   - ✅ Mobilni prikaz radi
   - ✅ Linkovi rade
   - ✅ Kontakt forma se šalje

---

## 🔧 Prilagođavanja

### Promena Email Adrese za Kontakt Formu

**VAŽNO:** Kontakt forma trenutno ne šalje stvarne emailove. Da biste aktivirali slanje:

#### Opcija 1: PHP Backend (Najprostije za Shared Hosting)

Kreirajte `send-email.php` fajl:

```php
<?php
header('Content-Type: application/json');

// Provera metode zahteva
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Validacija podataka
$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = filter_var($_POST['phone'] ?? '', FILTER_SANITIZE_STRING);
$clinic = filter_var($_POST['clinic'] ?? '', FILTER_SANITIZE_STRING);
$message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Sva obavezna polja moraju biti popunjena"]);
    exit;
}

// Email konfiguracija
$to = "info@mojitermini.rs"; // PROMENITE OVO
$subject = "Nova poruka sa sajta - Moji Termini";

$email_body = "
Nova poruka sa kontakt forme:

Ime: $name
Email: $email
Telefon: $phone
Ordinacija: $clinic

Poruka:
$message
";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Slanje emaila
if (mail($to, $subject, $email_body, $headers)) {
    echo json_encode(["success" => true, "message" => "Poruka uspešno poslata"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Greška pri slanju poruke"]);
}
?>
```

Zatim u `js/main.js` promenite `simulateFormSubmission` funkciju:

```javascript
// Zameni postojeću funkciju sa:
async function submitContactForm(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const response = await fetch('send-email.php', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Submission failed');
    }

    return await response.json();
}

// I zameni poziv u event listeneru:
await submitContactForm(data); // umesto simulateFormSubmission(data)
```

#### Opcija 2: FormSubmit (Besplatan Servis)

Najlakši način bez backend koda:

1. Idite na https://formsubmit.co/
2. U `index.html`, promenite `<form>` tag:

```html
<form class="contact-form" action="https://formsubmit.co/vas-email@domen.rs" method="POST">
    <!-- Dodajte hidden polja -->
    <input type="hidden" name="_subject" value="Nova poruka sa Moji Termini">
    <input type="hidden" name="_captcha" value="false">
    <input type="hidden" name="_next" value="https://vasadomena.rs/hvala.html">

    <!-- Ostatak forme ostaje isti -->
    ...
</form>
```

#### Opcija 3: EmailJS (JavaScript Servis)

1. Registrujte se na https://www.emailjs.com/
2. Pratite njihov setup guide
3. Dodajte EmailJS skriptu i poziv u `js/main.js`

---

## 📝 Promena Sadržaja

### Promena Teksta

Svi tekstovi su u `index.html`. Jednostavno pretražite i zamenite:

```html
<!-- Primer: Promena naslova -->
<h1>Organizujte termine vaše ordinacije za <span class="highlight">5 minuta</span></h1>

<!-- Primer: Promena cenovnika -->
<span class="price-amount">2,500 RSD</span>
```

### Promena Boja

Boje su definisane kao CSS varijable u `css/style.css`:

```css
:root {
    --primary-color: #3B82F6;     /* Glavna boja (plava) */
    --primary-dark: #2563EB;       /* Tamnija plava */
    --primary-light: #60A5FA;      /* Svetlija plava */
    --secondary-color: #10B981;    /* Sekundarna boja (zelena) */
    /* ... */
}
```

Jednostavno promenite hex vrednosti.

### Dodavanje Logo Slike

Trenutno je SVG logo u kodu. Da biste dodali sliku:

```html
<!-- U navigaciji i footer-u, zameni SVG sa: -->
<img src="images/logo.png" alt="Moji Termini" width="32" height="32">
```

---

## 📱 Responzivnost

Landing page je potpuno responzivan:

- ✅ Desktop (1200px+)
- ✅ Laptop (1024px)
- ✅ Tablet (768px)
- ✅ Mobilni (480px)

Testirajte na svim uređajima!

---

## ⚡ Performance Optimizacije

### Opciono: Dodajte favicon

Kreirajte `favicon.ico` i dodajte u `<head>`:

```html
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

### Opciono: Google Analytics

Dodajte u `<head>` pre `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Opciono: Facebook Pixel

Za reklamne kampanje na Facebooku.

---

## 🔍 SEO Optimizacije

### Meta Tags (već dodato u `index.html`)

```html
<meta name="description" content="...">
<meta name="keywords" content="...">
```

### Dodajte Open Graph Tags (za deljenje na društvenim mrežama)

```html
<meta property="og:title" content="Moji Termini - Sistem za zakazivanje termina">
<meta property="og:description" content="Organizujte termine vaše ordinacije za 5 minuta">
<meta property="og:image" content="https://vasadomena.rs/images/og-image.jpg">
<meta property="og:url" content="https://vasadomena.rs">
<meta property="og:type" content="website">
```

### Dodajte Structured Data (Schema.org)

Za bolje rangiranje u Google-u:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Moji Termini",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "2500",
    "priceCurrency": "RSD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "ratingCount": "10"
  }
}
</script>
```

---

## 🐛 Troubleshooting

### Stilovi se ne učitavaju

- Proverite da li su putanje tačne (`css/style.css`)
- Proverite dozvole (644 za fajlove)
- Očistite browser cache (Ctrl+F5)

### JavaScript ne radi

- Otvorite Developer Console (F12)
- Proverite da li ima grešaka
- Proverite da li je `js/main.js` učitan

### Kontakt forma ne šalje

- Trenutno koristi `simulateFormSubmission` (demo)
- Pratite gore navedene opcije za aktiviranje pravog slanja

### Font se ne učitava

- Proverite internet konekciju
- Google Fonts zahteva internet pristup
- Alternativa: Downloadujte font i hostujte lokalno

---

## 📊 Google PageSpeed Insights

Nakon deploya, testirajte performanse:

1. Idite na https://pagespeed.web.dev/
2. Unesite URL vaše stranice
3. Analizirajte rezultate

**Očekivane ocene:** 90+ za Desktop, 80+ za Mobile

---

## 🔐 Sigurnost

### HTTPS

- Većina shared hostinga nudi besplatan SSL (Let's Encrypt)
- Aktivirajte u cPanel-u
- Forsajte HTTPS dodavanjem `.htaccess` pravila:

```apache
# .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Zaštita od Spam-a (Contact Form)

- Dodajte Google reCAPTCHA v3
- Ili koristite FormSubmit sa honeypot zaštitom

---

## 📈 Praćenje Konverzija

### Google Tag Manager

1. Kreirajte GTM nalog
2. Dodajte GTM snippet u `<head>`
3. Pratite klikove na CTA dugmad
4. Pratite submit kontakt forme

### Postavljanje Event Tracking

```javascript
// U js/main.js, dodajte:
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Primer: Track CTA klikove
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('CTA', 'click', 'Start Free Trial');
    });
});
```

---

## 🎨 Dodatne Prilagođavanja

### Dodajte Slider za Testimonials

Koristite biblioteku kao što je **Swiper.js**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

### Dodajte Live Chat

Integrirajte Tawk.to, Intercom, ili Crisp Chat.

### Dodajte Video Demo

Postavite video na YouTube, zatim embed:

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

---

## 🚀 Sledeći Koraci

1. ✅ Uploadujte na shared hosting
2. ✅ Aktivirajte SSL (HTTPS)
3. ✅ Podesite kontakt formu (PHP ili FormSubmit)
4. ✅ Dodajte favicon
5. ✅ Dodajte Google Analytics
6. ✅ Testirajte na mobilnim uređajima
7. ✅ Podelite link na društvenim mrežama
8. ✅ Započnite marketing kampanju

---

## 📞 Podrška

Ako imate pitanja ili probleme sa landing stranicom, kontaktirajte:

- **Email:** info@mojitermini.rs
- **GitHub Issues:** [Link ka repo-u]

---

## 📄 Licenca

Copyright © 2026 Moji Termini. Sva prava zadržana.

---

**Verzija:** 1.0.0  
**Poslednje Ažuriranje:** 2026-05-04  
**Status:** Spreman za Production ✅
