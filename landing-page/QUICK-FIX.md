# ⚡ BRZO REŠENJE - Email Ne Stiže

## 🎯 Najbrže Rešenje (5 minuta)

### Koristi FormSubmit.co

**1. Otvori `index.html`**

**2. Pronađi liniju ~444:**
```html
<form class="contact-form" id="contactForm">
```

**3. Zameni sa (stavi SVOJ email):**
```html
<form class="contact-form" action="https://formsubmit.co/TVOJ-EMAIL@domen.rs" method="POST">
```

**4. Izbaci `id="contactForm"` i dodaj hidden polja:**
```html
<form class="contact-form" action="https://formsubmit.co/TVOJ-EMAIL@domen.rs" method="POST">
    <!-- Dodaj ove linije odmah ispod -->
    <input type="hidden" name="_subject" value="Nova poruka - Moji Termini">
    <input type="hidden" name="_captcha" value="false">
    <input type="text" name="_honey" style="display:none">
    
    <!-- Ostatak forme ostaje isto -->
    <div class="form-group">
        ...
```

**5. Uploaduj `index.html` na server**

**6. Testiraj:**
- Popuni formu
- Klikni Submit
- **DOBIĆEŠ EMAIL OD FORMSUBMIT ZA VERIFIKACIJU**
- Klikni link u emailu
- Gotovo! Sada sve poruke stižu

---

## 🔄 Ili Koristi Improved PHP (ako hoćeš PHP)

**1. Otvori `send-email-improved.php`**

**2. Promeni liniju 17:**
```php
$RECIPIENT_EMAIL = "TVOJ-PRAVI-EMAIL@domen.rs"; // <-- PROMENI OVO
```

**3. Otvori `js/main.js`**

**4. Promeni liniju 99:**
```javascript
// Staro:
const response = await fetch('send-email.php', {

// Novo:
const response = await fetch('send-email-improved.php', {
```

**5. Uploaduj oba fajla**

**6. Testiraj formu**

**7. Ako ne radi, proveri `email.log` fajl na serveru**

---

## 📧 Proveri Spam Folder!

Pre svega, **PROVERI SPAM FOLDER**!

Mnogi shared hostinzi šalju emailove u spam.

Ako je email u spam-u:
1. Označi kao "Not Spam"
2. Dodaj sender u kontakte
3. Sve buduće poruke će stizati u inbox

---

## 🆘 I Dalje Ne Radi?

Pročitaj: **EMAIL-TROUBLESHOOTING.md** (detaljni vodič)

Ili kontaktiraj hosting support i pitaj:
> "Da li je PHP mail() funkcija omogućena na mom nalogu?"

---

**Preporuka:** Koristi **FormSubmit.co** - garantovano radi!
