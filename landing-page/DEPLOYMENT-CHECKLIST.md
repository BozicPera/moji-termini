# 🚀 Deployment Checklist - Moji Termini Landing Page

Pratite ovu listu korak po korak pre i posle deploy-a na shared hosting.

---

## ✅ Pre Upload-a

### 1. Prilagođavanje Sadržaja

- [ ] **Email adresa u `send-email.php`**
  ```php
  $RECIPIENT_EMAIL = "info@mojitermini.rs"; // PROMENITE OVO
  ```

- [ ] **Kontakt informacije u `index.html`**
  - [ ] Email adresa u sekciji kontakta
  - [ ] Broj telefona
  - [ ] Adresa kompanije

- [ ] **Cenovnik** (opciono)
  - [ ] Proverite cene (2,500 RSD mesečno)
  - [ ] Prilagodite pakete po potrebi

- [ ] **Testimonials** (opciono)
  - [ ] Zamenite sa pravim preporukama ili uklonite sekciju dok ne sakupite

- [ ] **Logo** (opciono)
  - [ ] Dodajte logo.png u `images/` folder
  - [ ] Zamenite SVG logo sa `<img>` tagom

### 2. SEO & Meta Tags

- [ ] **Meta description** u `index.html` <head>
  - [ ] Optimizujte za Google pretragu
  
- [ ] **Keywords** - dodajte relevantne ključne reči

- [ ] **Open Graph tags** (za društvene mreže)
  ```html
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:image" content="...">
  ```

- [ ] **Favicon**
  - [ ] Kreirajte favicon.ico
  - [ ] Dodajte link u `<head>`

### 3. Analytics

- [ ] **Google Analytics** (opciono)
  - [ ] Napravite GA4 property
  - [ ] Dodajte tracking code u `<head>`

- [ ] **Google Tag Manager** (opciono)
  - [ ] Setup GTM container
  - [ ] Dodajte GTM snippet

### 4. Testiranje Lokalno

- [ ] Otvorite `index.html` u browseru
- [ ] Proverite da li sve radi:
  - [ ] Navigacija (mobilni meni)
  - [ ] Svi linkovi
  - [ ] FAQ accordion
  - [ ] Kontakt forma (biće error jer nema PHP servera lokalno)
  - [ ] Smooth scroll
  - [ ] Responzivnost (mobilni, tablet, desktop)

---

## 📤 Upload na Hosting

### 1. FTP Upload (FileZilla, WinSCP)

- [ ] Povežite se na FTP server
  - Host: `ftp.vasadomena.rs`
  - Username: `vaš_username`
  - Password: `vaš_password`
  - Port: `21` (ili `22` za SFTP)

- [ ] Navigirajte do `public_html` ili `www` foldera

- [ ] Uploadujte sve fajlove:
  ```
  ✓ index.html
  ✓ send-email.php
  ✓ .htaccess
  ✓ css/style.css
  ✓ js/main.js
  ✓ images/ (folder)
  ✗ README.md (ne mora, ali nije bitno)
  ✗ DEPLOYMENT-CHECKLIST.md (ne mora)
  ```

### 2. cPanel Upload

- [ ] Ulogujte se u cPanel
- [ ] Otvorite **File Manager**
- [ ] Idite u `public_html`
- [ ] Upload sve fajlove

### 3. Postavljanje Dozvola (Permissions)

Preko FTP ili cPanel:

- [ ] Folderi: `755`
  - `css/`
  - `js/`
  - `images/`

- [ ] Fajlovi: `644`
  - `index.html`
  - `send-email.php`
  - `.htaccess`
  - `css/style.css`
  - `js/main.js`

Komande (ako imate SSH):
```bash
chmod 755 css js images
chmod 644 index.html send-email.php .htaccess css/style.css js/main.js
```

---

## 🔐 Aktivacija SSL (HTTPS)

### Opcija 1: cPanel AutoSSL (Let's Encrypt)

- [ ] Ulogujte se u cPanel
- [ ] Idite na **SSL/TLS Status**
- [ ] Kliknite **Run AutoSSL**
- [ ] Sačekajte da se instalira (2-5 minuta)

### Opcija 2: Ručna Instalacija

- [ ] U cPanel idite na **SSL/TLS**
- [ ] Generate CSR
- [ ] Koristite Let's Encrypt ili drugi provider

### Nakon SSL Instalacije

- [ ] Otvorite `.htaccess` fajl
- [ ] Odkomentirajte HTTPS redirect:
  ```apache
  # Uklonite # ispred ovih linija:
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  ```

- [ ] Testirajte: `https://vasadomena.rs`

---

## ✅ Post-Deployment Provera

### 1. Osnovne Funkcionalnosti

Otvorite sajt u browseru:

- [ ] **Homepage učitavanje**
  - [ ] URL: `https://vasadomena.rs`
  - [ ] Stranica se učitava bez grešaka

- [ ] **Stilovi primenjeni**
  - [ ] Boje su tačne (plava #3B82F6)
  - [ ] Font je učitan (Inter)
  - [ ] Layout je ispravan

- [ ] **Navigacija**
  - [ ] Desktop meni radi
  - [ ] Mobilni hamburger meni radi
  - [ ] Svi anchor linkovi vode na odgovarajuće sekcije

- [ ] **Sekcije**
  - [ ] Hero sekcija
  - [ ] Problemi
  - [ ] Mogućnosti
  - [ ] Kako funkcioniše
  - [ ] Testimonials
  - [ ] Cenovnik
  - [ ] FAQ
  - [ ] Kontakt
  - [ ] Footer

### 2. Interaktivnost

- [ ] **FAQ Accordion**
  - [ ] Klikom se proširuje/zatvara
  - [ ] Ikonice se rotiraju (+/×)

- [ ] **Smooth Scroll**
  - [ ] Klik na link u navigaciji scrolluje glatko

- [ ] **Animacije**
  - [ ] Kartice fade-in kada dođu u viewport
  - [ ] Counter animacija u stats sekciji

### 3. Kontakt Forma

**Važan test!**

- [ ] **Popunite formu** sa test podacima:
  - Ime: Test Korisnik
  - Email: test@test.com
  - Poruka: Ovo je test poruka

- [ ] **Submitujte formu**
  - [ ] Loading state se pojavi ("Šalje se...")
  - [ ] Success poruka se prikaže
  - [ ] Forma se resetuje

- [ ] **Proverite email**
  - [ ] Email stigao na `info@mojitermini.rs`
  - [ ] Subject je tačan
  - [ ] Formatiranje je čitko

- [ ] **Testirajte validaciju**
  - [ ] Prazna forma → error poruka
  - [ ] Nevalidan email → error poruka
  - [ ] Kratka poruka (<10 chars) → error

### 4. Responzivnost

Testirajte na različitim uređajima:

- [ ] **Desktop** (1920x1080)
  - [ ] Layout tačan
  - [ ] Sve sekcije vidljive

- [ ] **Laptop** (1366x768)
  - [ ] Layout prilagođen
  - [ ] Grid kolone tačne

- [ ] **Tablet** (iPad - 768px)
  - [ ] Mobilni meni se aktivira
  - [ ] Grid prelazi na 1-2 kolone

- [ ] **Mobilni** (iPhone - 375px)
  - [ ] Sve sekcije čitke
  - [ ] Dugmad velika dovoljno za touch
  - [ ] Hero tekst čitljiv
  - [ ] Forma funkcioniše

### 5. Browser Kompatibilnost

Testirajte u različitim browserima:

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (iOS/Mac)
- [ ] **Edge** (latest)
- [ ] **Safari Mobile** (iPhone)
- [ ] **Chrome Mobile** (Android)

### 6. Performance

- [ ] **Google PageSpeed Insights**
  - URL: https://pagespeed.web.dev/
  - [ ] Unesite `https://vasadomena.rs`
  - [ ] Desktop score: > 90
  - [ ] Mobile score: > 80
  - [ ] Ispravite eventualne probleme

- [ ] **GTmetrix** (opciono)
  - URL: https://gtmetrix.com/
  - [ ] Grade: A ili B

### 7. SEO Provera

- [ ] **Google Search Console**
  - [ ] Dodajte svoj sajt
  - [ ] Submit sitemap (kreirajte sitemap.xml)

- [ ] **Meta Tags**
  - [ ] View Page Source
  - [ ] Proverite da li su title, description, og:tags tačni

- [ ] **Structured Data** (opciono)
  - [ ] Test: https://search.google.com/test/rich-results
  - [ ] Dodajte Schema.org markup

### 8. Security

- [ ] **HTTPS**
  - [ ] Zelena katanac ikonica u browseru
  - [ ] HTTP automatski redirectuje na HTTPS

- [ ] **Headers**
  - [ ] Test: https://securityheaders.com/
  - [ ] Proverite security headers

- [ ] **SSL Certificate**
  - [ ] Test: https://www.ssllabs.com/ssltest/
  - [ ] Grade: A ili A+

### 9. Spam Protection

- [ ] **Spam Test**
  - [ ] Popunite skriveno `website` polje (preko Developer Tools)
  - [ ] Submit forma
  - [ ] Email NE treba da stigne (spam protection radi)

---

## 📊 Tracking & Analytics

### Nakon Deploy-a

- [ ] **Google Analytics Tracking**
  - [ ] Posetite sajt
  - [ ] Proverite u GA da li se beležI (Real-time)

- [ ] **Event Tracking** (opciono)
  - [ ] CTA klikovi
  - [ ] Form submissions
  - [ ] Scroll depth

- [ ] **Conversion Tracking**
  - [ ] Setup Goals u GA
  - [ ] Goal 1: Contact Form Submit
  - [ ] Goal 2: CTA Button Click

---

## 🔧 Opcione Optimizacije

### Odmah Nakon Deploy-a

- [ ] **robots.txt**
  ```
  User-agent: *
  Allow: /
  Sitemap: https://vasadomena.rs/sitemap.xml
  ```

- [ ] **sitemap.xml**
  - Koristite generator ili kreirajte ručno
  - Submit na Google Search Console

- [ ] **404 Error Page**
  - Kreirajte `404.html`
  - Dodajte u `.htaccess`: `ErrorDocument 404 /404.html`

### U Narednih 7 Dana

- [ ] **Social Media Sharing**
  - [ ] Podelite na Facebook
  - [ ] Podelite na LinkedIn
  - [ ] Proverite preview (Open Graph image)

- [ ] **Google My Business** (ako je relevantno)
  - [ ] Dodajte link ka sajtu

- [ ] **Backlinks**
  - [ ] Dodajte link u email signature
  - [ ] Dodajte na social media profile

### U Narednih 30 Dana

- [ ] **A/B Testing**
  - [ ] Test različite CTA kopije
  - [ ] Test različite cene
  - [ ] Test različite hero naslove

- [ ] **Heatmap Analysis** (Hotjar, Clarity)
  - [ ] Instalirajte heatmap tool
  - [ ] Analizirajte klikove, scroll

- [ ] **User Feedback**
  - [ ] Dodajte feedback widget
  - [ ] Sakupljajte komentare

---

## 🐛 Troubleshooting

### Problem: Stilovi se ne učitavaju

**Rešenje:**
1. Proverite putanju: `css/style.css` (ne `/css/style.css`)
2. Očistite browser cache (Ctrl+F5)
3. Proverite file permissions (644)
4. Proverite da li je CSS fajl stvarno uploadovan

### Problem: Kontakt forma ne šalje

**Rešenje:**
1. Proverite `send-email.php`:
   - Da li je `$RECIPIENT_EMAIL` tačan?
   - Da li je fajl uploadovan?
2. Proverite PHP logs u cPanel (Error Log)
3. Testirajte mail() funkciju na serveru
4. Alternativa: Koristite FormSubmit.co (bez PHP)

### Problem: JavaScript ne radi

**Rešenje:**
1. Otvorite Developer Console (F12)
2. Pogledajte greške (Errors tab)
3. Proverite da li je `js/main.js` učitan
4. Proverite da li je putanja tačna

### Problem: Mobilni meni ne radi

**Rešenje:**
1. Proverite JavaScript
2. Proverite CSS media queries
3. Testirajte u različitim browserima

### Problem: Email ne stiže

**Rešenje:**
1. Proverite SPAM folder
2. Proverite da li hosting dozvoljava `mail()` funkciju
3. Alternativa: Koristite SMTP (PHPMailer)
4. Alternativa: Koristite spoljni servis (SendGrid, Mailgun)

---

## 📞 Podrška

Ako naiđete na probleme:

1. **Proverite hosting dokumentaciju** (cPanel, PHP verzija)
2. **Kontaktirajte hosting support** (za PHP mail() probleme)
3. **Stack Overflow** (za tehničke greške)

---

## ✅ Finalna Checklist

Pre nego što službeno lansiraš:

- [ ] Svi linkovi rade
- [ ] Kontakt forma šalje emailove
- [ ] SSL je aktivan (HTTPS)
- [ ] Mobilni prikaz je savršen
- [ ] Email adresa je tačna
- [ ] Telefon je tačan
- [ ] Google Analytics prati posetioce
- [ ] Testimonials su pravi (ili uklonjeni)
- [ ] Cene su finalne
- [ ] Legal pages (Privacy Policy, Terms) su dodati ili planirani

---

## 🎉 Gotovo!

Čestitamo! Vaš sajt je live. 

**Sledeći koraci:**
1. Podelite link sa prijateljima/familijom za feedback
2. Započnite marketing kampanju
3. Pratite analytics
4. Sakupite prve korisnike

---

**Datum Deploy-a:** _____________  
**URL:** https://vasadomena.rs  
**Status:** ✅ Live / 🚧 U pripremi
