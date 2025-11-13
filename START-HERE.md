# 🎯 START HERE - Testare Aplicație

## ⚠️ IMPORTANT: Pregătire Înainte de Testare

### 1. Pornește PostgreSQL

**Trebuie să ai PostgreSQL instalat și pornit!**

**Windows - Verifică dacă rulează:**

```powershell
Get-Service -Name postgresql*
```

**Dacă nu rulează, pornește-l:**

```powershell
Start-Service postgresql-x64-14  # sau versiunea ta
```

**Sau folosește pgAdmin sau alt tool pentru a porni PostgreSQL.**

---

### 2. Creează Baza de Date

**Opțiune A - Cu psql:**

```bash
psql -U postgres
CREATE DATABASE fullstack_app;
\q
```

**Opțiune B - Cu pgAdmin:**

1. Deschide pgAdmin
2. Right-click pe "Databases"
3. Create → Database
4. Name: `fullstack_app`
5. Save

---

### 3. Verifică Credențialele

Editează `backend/.env` dacă ai alte credențiale:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/fullstack_app?schema=public"
```

Înlocuiește:

- `USERNAME` - username-ul tău PostgreSQL (default: `postgres`)
- `PASSWORD` - parola ta PostgreSQL

---

## 🚀 Pornire Aplicație (2 Terminale)

### Terminal 1: Backend

```bash
# Navighează la backend
cd backend

# Rulează migrațiile (prima dată)
npx prisma migrate dev --name init

# Generează Prisma Client
npx prisma generate

# Populează cu date de test
npm run prisma:seed

# Pornește serverul
npm run dev
```

**Așteptări:**

```
🚀 Server running on http://localhost:3001
```

**Lasă acest terminal deschis!**

---

### Terminal 2: Frontend

```bash
# Navighează la frontend
cd frontend

# Pornește serverul
npm run dev
```

**Așteptări:**

```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

**Lasă acest terminal deschis!**

---

## 🧪 Testare Rapidă (5 minute)

### Test 1: Backend Health Check ✅

Deschide în browser: http://localhost:3001/health

**Ar trebui să vezi:**

```json
{ "status": "ok", "timestamp": "..." }
```

---

### Test 2: Frontend Home ✅

Deschide în browser: http://localhost:3000

**Ar trebui să vezi:**

- Titlu mare: "🚀 Full-Stack App"
- 2 butoane: "Login" și "Register"

---

### Test 3: Register ✅

1. Click pe "Register"
2. Completează:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test1234`
3. Observă indicatorul de putere parolă
4. Click "Register"
5. Ar trebui să vezi "Registration Successful!"
6. Redirect automat la login

---

### Test 4: Login ✅

1. Folosește credențialele din seed:
   - Email: `admin@example.com`
   - Password: `Admin1234`
2. Click "Login"
3. Ar trebui să fii redirectat la Dashboard

---

### Test 5: Dashboard ✅

- Ar trebui să vezi 3 carduri cu statistici
- Navigation bar cu "Dashboard", "Products", "Logout"
- Click pe "Logout" pentru a te deconecta

---

## ✅ Checklist Rapid

- [ ] PostgreSQL pornit
- [ ] Backend rulează pe :3001
- [ ] Frontend rulează pe :3000
- [ ] Health check OK
- [ ] Register funcționează
- [ ] Login funcționează
- [ ] Dashboard se încarcă
- [ ] Logout funcționează

---

## 🐛 Probleme Comune

### "Can't reach database server"

→ PostgreSQL nu rulează. Pornește-l!

### "User with this email already exists"

→ Normal! Folosește alt email sau șterge baza de date și re-run seed

### "Failed to fetch"

→ Backend-ul nu rulează. Verifică Terminal 1

### "CORS error"

→ Verifică că backend rulează pe :3001 și frontend pe :3000

---

## 📞 Ajutor

Dacă întâmpini probleme:

1. Verifică că ambele terminale rulează
2. Verifică console-ul browser-ului (F12) pentru erori
3. Verifică logs în terminalele backend/frontend
4. Citește `setup-and-test.md` pentru detalii complete

---

## 🎉 Succes!

Dacă toate testele trec, aplicația funcționează perfect!

**Next steps:**

- Explorează codul
- Adaugă mai multe features
- Deploy pe Vercel + Railway

**Documentație:**

- `README.md` - Overview general
- `setup-and-test.md` - Ghid detaliat de testare
- `TESTING.md` - Teste automate
- `IMPLEMENTATION_SUMMARY.md` - Ce am implementat
