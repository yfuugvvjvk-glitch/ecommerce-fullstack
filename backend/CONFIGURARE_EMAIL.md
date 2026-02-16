# 📧 CONFIGURARE SISTEM EMAIL

## Problema: Email-urile nu se trimit

Dacă email-urile de verificare nu se trimit, trebuie să configurezi SMTP în fișierul `.env.local`.

## Soluție: Configurare Gmail SMTP

### Pasul 1: Activează 2-Step Verification

1. Mergi la: https://myaccount.google.com/security
2. Activează "2-Step Verification"

### Pasul 2: Generează App Password

1. Mergi la: https://myaccount.google.com/apppasswords
2. Selectează "Mail" și "Other (Custom name)"
3. Scrie "E-Commerce App"
4. Click "Generate"
5. **Copiază parola de 16 caractere** (ex: `abcd efgh ijkl mnop`)

### Pasul 3: Configurează .env.local

Deschide `backend/.env.local` și actualizează:

```env
# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"           # ← Email-ul tău Gmail
SMTP_PASS="abcd efgh ijkl mnop"            # ← App Password generat (16 caractere)
SMTP_FROM_EMAIL="noreply@example.com"      # ← Email afișat ca expeditor
SMTP_FROM_NAME="E-Commerce App"            # ← Nume afișat ca expeditor
```

### Pasul 4: Restart Backend

```bash
cd backend
npm run dev
```

## Alternative la Gmail

### Outlook/Hotmail

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

### Yahoo Mail

```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

### SendGrid (Recomandat pentru producție)

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

## Testare Configurație

După configurare, încearcă să te înregistrezi cu un email nou:

1. Mergi la: http://localhost:3000/register
2. Completează formularul
3. Verifică inbox-ul pentru codul de verificare
4. **Verifică și folderul SPAM!**

## Probleme Comune

### "Invalid login: 535-5.7.8 Username and Password not accepted"

- Verifică că ai activat 2-Step Verification
- Verifică că folosești App Password, NU parola normală
- Verifică că ai copiat corect toate cele 16 caractere

### "Connection timeout"

- Verifică că portul 587 nu este blocat de firewall
- Încearcă să schimbi `SMTP_PORT=465` și `SMTP_SECURE=true`

### Email-urile ajung în SPAM

- Configurează SPF, DKIM și DMARC pentru domeniul tău
- Folosește un serviciu profesional (SendGrid, Mailgun) pentru producție

## Verificare Email Obligatorie

Sistemul acum **BLOCHEAZĂ** login-ul pentru utilizatori neverificați:

```
❌ Email not verified. Please verify your email before logging in.
```

Utilizatorii TREBUIE să verifice email-ul înainte de a se putea autentifica.

## Debugging

Pentru a vedea erorile de email în consolă:

```bash
cd backend
npm run dev
```

Caută în consolă mesaje de tipul:

```
Email send error: ...
```

## Contact

Dacă ai probleme, verifică:

1. Configurația SMTP este corectă în `.env.local`
2. Backend-ul rulează (`npm run dev`)
3. Nu există erori în consolă
4. Email-ul nu este în folderul SPAM
