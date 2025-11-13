# 🚀 Setup și Testare Manuală

## Pregătire Inițială

### 1. Verifică PostgreSQL

Asigură-te că PostgreSQL rulează pe portul 5432.

**Windows:**

```powershell
# Verifică dacă PostgreSQL rulează
Get-Service -Name postgresql*
```

**Creează baza de date:**

```sql
CREATE DATABASE fullstack_app;
```

### 2. Setup Backend

**Terminal 1 - Backend Setup:**

```bash
cd backend

# Instalează dependențele (dacă nu sunt deja instalate)
npm install

# Rulează migrațiile Prisma
npx prisma migrate dev --name init

# Generează Prisma Client
npx prisma generate

# Populează baza de date cu date de test
npm run prisma:seed

# Pornește serverul backend
npm run dev
```

**Așteptări:**

- Serverul pornește pe `http://localhost:3001`
- Mesaj: `🚀 Server running on http://localhost:3001`
- Health check: http://localhost:3001/health

### 3. Setup Frontend

**Terminal 2 - Frontend:**

```bash
cd frontend

# Instalează dependențele (dacă nu sunt deja instalate)
npm install

# Pornește serverul de development
npm run dev
```

**Așteptări:**

- Serverul pornește pe `http://localhost:3000`
- Mesaj: `✓ Ready in X ms`

---

## 🧪 Testare Manuală

### Test 1: Health Check Backend ✅

**URL:** http://localhost:3001/health

**Rezultat așteptat:**

```json
{
  "status": "ok",
  "timestamp": "2024-11-12T..."
}
```

---

### Test 2: Pagina Home ✅

**URL:** http://localhost:3000

**Verificări:**

- ✅ Pagina se încarcă
- ✅ Titlu: "🚀 Full-Stack App"
- ✅ Butoane "Login" și "Register" vizibile
- ✅ Design responsive

---

### Test 3: Înregistrare Utilizator Nou ✅

**URL:** http://localhost:3000/register

**Pași:**

1. Click pe "Register" din home
2. Completează formularul:
   - **Name:** Test User
   - **Email:** test@example.com
   - **Password:** Test1234
3. Observă indicatorul de putere parolă
4. Click "Register"

**Verificări:**

- ✅ Validare în timp real
- ✅ Indicator putere parolă (Weak → Strong)
- ✅ Mesaj de eroare dacă email există deja
- ✅ Mesaj de succes: "Registration Successful!"
- ✅ Redirect automat la `/login` după 2 secunde

**Erori posibile:**

- "User with this email already exists" - Normal dacă ai rulat seed-ul
- Folosește alt email: `test2@example.com`

---

### Test 4: Login cu Utilizator Seed ✅

**URL:** http://localhost:3000/login

**Credențiale de test (din seed):**

- **Email:** admin@example.com
- **Password:** Admin1234

**Pași:**

1. Introdu credențialele
2. Click "Login"

**Verificări:**

- ✅ Validare formulare
- ✅ Mesaj de eroare pentru credențiale greșite
- ✅ Loading state: "Logging in..."
- ✅ Redirect la `/dashboard` după login reușit
- ✅ Token salvat în localStorage

**Verifică token în browser:**

```javascript
// Deschide Console (F12)
localStorage.getItem('token');
// Ar trebui să returneze un JWT token
```

---

### Test 5: Dashboard (Protected Route) ✅

**URL:** http://localhost:3000/dashboard

**Verificări:**

- ✅ Pagina se încarcă doar dacă ești autentificat
- ✅ Navigation bar cu "Dashboard", "Products", "Logout"
- ✅ 3 carduri cu statistici:
  - Total Products: 0
  - Orders: 0
  - Reviews: 0
- ✅ Design responsive

---

### Test 6: Logout ✅

**Pași:**

1. Din dashboard, click pe "Logout"
2. Verifică că ești redirectat

**Verificări:**

- ✅ Token șters din localStorage
- ✅ Redirect la home sau login
- ✅ Nu mai poți accesa `/dashboard` fără login

---

### Test 7: API Testing cu cURL 🔧

**Test Register API:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"curl@example.com\",\"password\":\"Test1234\",\"name\":\"Curl User\"}"
```

**Rezultat așteptat:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "curl@example.com",
    "name": "Curl User"
  }
}
```

**Test Login API:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"Admin1234\"}"
```

**Rezultat așteptat:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Administrator",
    ...
  }
}
```

**Test Protected Endpoint:**

```bash
# Salvează token-ul din răspunsul anterior
TOKEN="your-token-here"

curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting

### Backend nu pornește

**Eroare:** `PrismaConfigEnvError: Missing required environment variable: DATABASE_URL`

**Soluție:**

```bash
cd backend
# Verifică că .env există și conține DATABASE_URL
cat .env
```

---

### Eroare la migrații Prisma

**Eroare:** `Can't reach database server`

**Soluție:**

1. Verifică că PostgreSQL rulează
2. Verifică credențialele în `backend/.env`
3. Testează conexiunea:

```bash
psql -U postgres -h localhost
```

---

### Frontend nu se conectează la backend

**Eroare:** `Failed to fetch` sau `Network error`

**Soluție:**

1. Verifică că backend rulează pe port 3001
2. Verifică `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Restart frontend după modificarea .env

---

### CORS Error

**Eroare:** `Access to fetch blocked by CORS policy`

**Soluție:**
Verifică în `backend/.env`:

```
CORS_ORIGIN="http://localhost:3000"
```

---

## ✅ Checklist Final

- [ ] PostgreSQL rulează
- [ ] Backend pornit pe port 3001
- [ ] Frontend pornit pe port 3000
- [ ] Health check funcționează
- [ ] Înregistrare funcționează
- [ ] Login funcționează
- [ ] Dashboard se încarcă
- [ ] Logout funcționează
- [ ] Token salvat în localStorage
- [ ] API endpoints răspund corect

---

## 📊 Rezultate Așteptate

După testare completă, ar trebui să ai:

1. ✅ **Backend funcțional** - API răspunde la toate request-urile
2. ✅ **Frontend funcțional** - Toate paginile se încarcă
3. ✅ **Auth flow complet** - Register → Login → Dashboard → Logout
4. ✅ **Validare** - Formulare validează corect
5. ✅ **Securitate** - Token JWT funcționează
6. ✅ **UX** - Loading states, error messages, success messages

---

## 🎯 Next Steps

După ce testarea manuală este completă:

1. Implementează UI pentru produse (Task 8-10)
2. Adaugă teste E2E cu Cypress (Task 13)
3. Optimizează performance (Task 12)
4. Deploy pe Vercel + Railway (Task 15)

---

## 📝 Notițe

- Toate parolele de test trebuie să aibă minim 8 caractere, o literă mare, o literă mică și un număr
- Token-ul JWT expiră după 24 ore
- Rate limiting: 5 request-uri/minut pentru auth endpoints
- Toate datele sunt stocate în PostgreSQL, nu în fișiere JSON
