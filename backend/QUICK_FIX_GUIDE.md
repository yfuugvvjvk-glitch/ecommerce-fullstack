# Ghid Rapid de Rezolvare - Media Manager

## Problemele Rezolvate

### ✅ 1. Căi de fișiere incorecte

- **Problema:** Folosea `__dirname` care nu funcționează corect în TypeScript compilat
- **Soluție:** Înlocuit cu `process.cwd()` pentru căi absolute corecte

### ✅ 2. Proprietăți user incorecte

- **Problema:** Folosea `request.user.id` în loc de `request.user.userId`
- **Soluție:** Corectat toate referințele la `userId`

### ✅ 3. Erori TypeScript

- **Problema:** Logger-ul Fastify nu accepta parametri multipli
- **Soluție:** Folosit format corect cu obiect pentru logging

### ✅ 4. Rute API inconsistente

- **Problema:** Frontend apela `/api/media` dar backend avea `/api/admin/media`
- **Soluție:** Unificat rutele la `/api/media`

## Testare Rapidă

### 1. Verifică baza de date

```bash
cd backend
node test-db-connection.js
```

Ar trebui să vezi:

```
✅ Conexiune la baza de date reușită!
✅ Tabelul Media există!
```

### 2. Pornește backend-ul

```bash
npm run dev
```

Verifică că pornește fără erori:

```
🚀 Server running on http://localhost:3001
```

### 3. Testează endpoint-ul

Deschide browser și accesează (după autentificare):

```
http://localhost:3001/api/media
```

Sau folosește curl:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/media
```

## Dacă Mai Ai Erori

### Eroare: "No token provided"

- Asigură-te că ești logat în frontend
- Verifică că token-ul este salvat în localStorage
- Token-ul trebuie să fie în header-ul `Authorization: Bearer TOKEN`

### Eroare: "Forbidden - Admin access required"

- Contul tău trebuie să aibă `role: 'admin'` în baza de date
- Verifică în Prisma Studio: `npx prisma studio`
- Schimbă role-ul user-ului la 'admin'

### Eroare: "Cannot read property 'userId' of undefined"

- Middleware-ul auth nu a rulat corect
- Verifică că rutele au `preHandler: [authMiddleware, adminMiddleware]`

### Eroare la scanarea directoarelor

- Verifică că directoarele există:
  - `backend/public/uploads/products/`
  - `backend/public/uploads/avatars/`
  - `backend/public/uploads/offers/`
  - `backend/public/uploads/media/`

## Structura Corectă

```
backend/
├── public/
│   └── uploads/
│       ├── products/    (scanat automat)
│       ├── avatars/     (scanat automat)
│       ├── offers/      (scanat automat)
│       └── media/       (pentru upload-uri noi)
├── src/
│   ├── routes/
│   │   └── media.routes.ts  (✅ corectat)
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── admin.middleware.ts
│   └── index.ts  (✅ corectat)
```

## Următorii Pași

1. **Pornește backend-ul:** `npm run dev`
2. **Pornește frontend-ul:** `cd ../frontend && npm run dev`
3. **Loghează-te ca admin**
4. **Accesează:** Admin Panel → Editare Conținut → Media
5. **Verifică:** Fișierele existente ar trebui să apară (sau listă goală)
6. **Testează upload:** Încarcă un fișier nou

## Debugging

Dacă încă ai probleme, verifică logurile backend-ului:

- Erori de autentificare
- Erori de bază de date
- Erori de citire fișiere

Logurile vor arăta exact ce eroare apare!
