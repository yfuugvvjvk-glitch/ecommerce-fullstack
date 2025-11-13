# 🚀 QUICK START - Cu Docker

## Pasul 1: Pornește PostgreSQL cu Docker

**Simplu - dublu-click pe:**

```
start-database.bat
```

**SAU rulează în terminal:**

```bash
docker-compose up -d
```

**Verifică că rulează:**

```bash
docker ps
```

Ar trebui să vezi `fullstack-postgres` în listă.

---

## Pasul 2: Setup Backend (Prima dată)

**Terminal 1:**

```bash
cd backend

# Rulează migrațiile (creează tabelele)
npx prisma migrate dev --name init

# Generează Prisma Client
npx prisma generate

# Adaugă date de test
npm run prisma:seed

# Pornește backend
npm run dev
```

**Așteptări:**

```
🚀 Server running on http://localhost:3001
```

---

## Pasul 3: Pornește Frontend

**Terminal 2:**

```bash
cd frontend
npm run dev
```

**Așteptări:**

```
✓ Ready in 2s
○ Local: http://localhost:3000
```

---

## 🧪 Testează Aplicația

### 1. Backend Health Check

Deschide: http://localhost:3001/health

Ar trebui să vezi:

```json
{ "status": "ok", "timestamp": "..." }
```

### 2. Frontend

Deschide: http://localhost:3000

### 3. Register

- Click "Register"
- Name: `Test User`
- Email: `test@example.com`
- Password: `Test1234`
- Click "Register"

### 4. Login

- Email: `admin@example.com`
- Password: `Admin1234`
- Click "Login"

### 5. Dashboard

- Ar trebui să vezi dashboard-ul cu statistici

---

## 🛑 Oprire

**Oprește aplicația:**

- `Ctrl+C` în ambele terminale

**Oprește PostgreSQL:**

```bash
docker-compose down
```

**Șterge tot (inclusiv date):**

```bash
docker-compose down -v
```

---

## 📊 Comenzi Utile Docker

**Vezi containere:**

```bash
docker ps
```

**Vezi logs PostgreSQL:**

```bash
docker logs fullstack-postgres
```

**Conectează-te la PostgreSQL:**

```bash
docker exec -it fullstack-postgres psql -U postgres -d fullstack_app
```

**Oprește PostgreSQL:**

```bash
docker-compose down
```

**Repornește PostgreSQL:**

```bash
docker-compose restart
```

---

## ✅ Checklist

- [x] Docker Desktop pornit
- [ ] `docker-compose up -d` rulat
- [ ] Backend migrations rulate
- [ ] Backend seed rulat
- [ ] Backend pornit (Terminal 1)
- [ ] Frontend pornit (Terminal 2)
- [ ] Testat în browser

---

## 🎉 Gata!

Aplicația ar trebui să funcționeze perfect!

**URLs:**

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health: http://localhost:3001/health

**Credențiale test:**

- Email: `admin@example.com`
- Password: `Admin1234`
