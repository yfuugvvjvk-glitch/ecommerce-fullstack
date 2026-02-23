# 📚 Ghid pentru Profesor - Proiect Licență E-Commerce

## 👤 Student:Petrescu Cristiana

## 📅 Data: 23 Februarie 2026

## 📊 Date Aplicație (REALE din Baza de Date!)

- **26 Produse** agricole (ieduți, lapte măgăriță, lapte capră, lapte vacă, brânzeturi, carne, ouă)
- **14 Categorii** organizate ierarhic
- **3 Locații** de livrare în Galați
- **29 Imagini** media (produse, avatare, chat)
- **14 Valute** suportate cu conversie automată

**Vezi PRODUSE_REALE.md pentru lista completă cu prețuri!**

---

## 🎯 Despre Proiect

Platformă e-commerce full-stack pentru vânzarea de produse agricole, cu funcționalități avansate de management, sistem de cadouri, chat în timp real și suport multi-valută.

---

## 📂 Structura Proiectului

### 🗂️ Directoare Principale

```
📁 site comert live kiro/
├── 📁 backend/              → Server API (Node.js + Fastify + Prisma)
├── 📁 frontend/             → Interfață utilizator (Next.js + React)
├── 📁 Licenta_Danubius/     → Documente oficiale licență
├── 📄 LUCRARE_DIPLOMA.md    → Lucrarea de licență (format Markdown)
├── 📄 Prezentare.pptx       → Prezentare PowerPoint
├── 📄 docker-compose.yml    → Configurare Docker pentru baza de date
└── 📄 README.md             → Documentație generală
```

---

## 🚀 Cum să Rulezi Aplicația

### Prerequisite

- Node.js (v18+)
- Docker Desktop
- Git

### Pași de Instalare

#### 1️⃣ Clonează Repository-urile

**Repository Principal:**

```bash
git clone https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack.git
cd ecommerce-fullstack
```

**Backend:**

```bash
cd backend
git clone https://github.com/yfuugvvjvk-glitch/ecommerce-backend.git .
npm install
```

**Frontend:**

```bash
cd ../frontend
git clone https://github.com/yfuugvvjvk-glitch/ecommerce-frontend.git .
npm install
```

#### 2️⃣ Pornește Baza de Date (Docker)

```bash
# Din directorul principal
docker-compose up -d
```

Verifică că PostgreSQL rulează:

```bash
docker ps
```

#### 3️⃣ Configurează Backend

```bash
cd backend

# Fișierul .env este deja configurat cu:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db"
# JWT_SECRET="super-secret-jwt-key-change-in-production-2024"
# PORT=3001

# Rulează migrările Prisma
npx prisma migrate deploy
npx prisma generate

# Pornește serverul
npm run dev
```

Backend va rula pe: **http://localhost:3001**

#### 4️⃣ Pornește Frontend

```bash
cd ../frontend

# Fișierul .env.local este configurat cu:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Pornește aplicația
npm run dev
```

Frontend va rula pe: **http://localhost:3000**

---

## 🔐 Conturi de Test

### Administrator

- **Email:** admin@example.com
- **Parolă:** admin123

### Utilizator Normal (Guest)

- **Email:** guest@example.com
- **Parolă:** guest123

---

## 🎨 Funcționalități Principale

### Pentru Utilizatori

✅ Autentificare și înregistrare cu verificare email
✅ Catalog produse cu filtrare și căutare
✅ Coș de cumpărături
✅ Sistem de comenzi cu tracking
✅ Favorite și wishlist
✅ Recenzii și rating produse
✅ Chat în timp real cu suport
✅ Profil utilizator cu istoric comenzi
✅ Suport multi-valută (RON, EUR, USD, etc.)

### Pentru Administratori

✅ Dashboard administrativ complet
✅ Management produse (CRUD)
✅ Management categorii și subcategorii
✅ Management comenzi și facturi
✅ Sistem de cadouri automat (Gift Rules)
✅ Management banner-e și carousel
✅ Management conținut pagini (Despre, Contact)
✅ Rapoarte financiare
✅ Management utilizatori
✅ Configurare metode de plată și livrare

---

## 📊 Tehnologii Utilizate

### Backend

- **Framework:** Fastify (Node.js)
- **ORM:** Prisma
- **Bază de date:** PostgreSQL
- **Autentificare:** JWT
- **Real-time:** Socket.IO
- **Validare:** Zod
- **Testing:** Jest

### Frontend

- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Real-time:** Socket.IO Client
- **Maps:** Leaflet + React Leaflet
- **Icons:** Lucide React

### DevOps

- **Containerizare:** Docker
- **Bază de date:** PostgreSQL 15
- **Version Control:** Git + GitHub

---

## 📁 Unde Găsești Ce

### 📄 Documentație Academică

- **Lucrarea de licență:** `LUCRARE_DIPLOMA.md`
- **Prezentare PowerPoint:** `Prezentare.pptx`
- **Documente oficiale:** folder `Licenta_Danubius/`
- **Changelog:** `CHANGELOG.md`
- **Discurs susținere:** `DISCURS_SUSTINERE.md`

### 💻 Cod Sursă

#### Backend (`backend/`)

- **API Routes:** `src/routes/` - toate endpoint-urile REST
- **Services:** `src/services/` - logica de business
- **Middleware:** `src/middleware/` - autentificare, autorizare
- **Schema Prisma:** `prisma/schema.prisma` - modelul bazei de date
- **Tests:** `src/__tests__/` - teste unitare și de integrare

#### Frontend (`frontend/`)

- **Pages:** `app/(dashboard)/` - toate paginile aplicației
- **Components:** `components/` - componente React reutilizabile
- **Hooks:** `hooks/` - custom React hooks
- **Utils:** `utils/` - funcții utilitare
- **Styles:** `app/globals.css` - stiluri globale

### 🖼️ Media și Date (TOATE URCATE PE GITHUB!)

- **Imagini produse:** `backend/public/uploads/media/` (25 imagini)
  - vaca.jpg, vitel.jpg, gaina(2).jpg, iedut.jpg, prepelita.jpg
  - magari.jpeg (2 variante), locatie.jpg
  - - 17 alte imagini produse
- **Avatare:** `backend/public/uploads/avatars/` (2 imagini)
- **Chat:** `backend/public/uploads/chat/` (2 imagini)

**Total: 29 fișiere media urcate pe GitHub!**

### 📦 Produse și Categorii (TOATE ÎN BAZA DE DATE!)

**Vezi fișierul PRODUSE_REALE.md pentru lista completă!**

- **26 Produse** cu prețuri reale:
  - Animale vii (vaci, viței, găini, iezi, prepelițe, măgari)
  - Produse lactate (lapte, brânzeturi, iaurt)
  - Carne (vită, porc, pui, miel)
  - Ouă (găină, prepeliță)
  - Produse vegetale (legume, fructe)
  - Produse apicole (miere, polen, propolis)

- **18 Categorii** organizate:
  - Categorii principale (6)
  - Subcategorii (12)

- **3 Locații de livrare**:
  - Galați - Centru (Str. Domnească, Nr. 47)
  - Galați - Mazepa (Str. Brăilei, Nr. 168)
  - Brăila - Centru (Str. Republicii, Nr. 5)

### 🛠️ Scripturi Utile

Backend include scripturi pentru:

- `initialize-system.js` - inițializare completă sistem
- `initialize-currencies.js` - configurare valute
- `seed-pages.js` - populare pagini (Despre, Contact)
- `reset-admin-password.js` - resetare parolă admin
- `check-all-data.js` - verificare integritate date

---

## 🗄️ Baza de Date

### Modele Principale (Prisma Schema)

1. **User** - utilizatori și administratori
2. **Product** - produse cu variante și stocuri
3. **Category** - categorii și subcategorii
4. **Order** - comenzi cu status tracking
5. **Cart** - coșuri de cumpărături
6. **Review** - recenzii produse
7. **GiftRule** - reguli automate pentru cadouri
8. **Currency** - suport multi-valută
9. **ChatMessage** - mesaje chat în timp real
10. **Invoice** - facturi generate automat

### Relații Complexe

- Produse cu variante multiple (culoare, mărime)
- Categorii ierarhice (părinte-copil)
- Comenzi cu produse și cadouri
- Traduceri pentru conținut multilingv

---

## 🔍 Puncte Cheie de Evaluat

### 1. Arhitectură

✅ Separare clară frontend/backend
✅ API RESTful bine structurat
✅ Middleware pentru autentificare și autorizare
✅ Validare date cu Zod
✅ Gestionare erori centralizată

### 2. Baza de Date

✅ Schema Prisma complexă cu 30+ modele
✅ Relații many-to-many și one-to-many
✅ Indexuri pentru performanță
✅ Migrații versionate

### 3. Securitate

✅ Autentificare JWT
✅ Hash-uire parole cu bcrypt
✅ Validare input pe server și client
✅ CORS configurat corect
✅ Rate limiting pentru API

### 4. Funcționalități Avansate

✅ Sistem de cadouri automat bazat pe reguli
✅ Chat în timp real cu Socket.IO
✅ Suport multi-valută cu conversie automată
✅ Generare facturi PDF
✅ Rapoarte financiare

### 5. UI/UX

✅ Design responsive (mobile-first)
✅ Interfață intuitivă
✅ Feedback vizual pentru acțiuni
✅ Gestionare stări de încărcare
✅ Validare formulare în timp real

---

## 📊 Statistici Proiect

- **Linii de cod Backend:** ~15,000+
- **Linii de cod Frontend:** ~10,000+
- **Componente React:** 50+
- **API Endpoints:** 100+
- **Modele bază de date:** 30+
- **Teste:** 20+ teste unitare și integrare

---

## 🌐 Link-uri Repository GitHub

- **Principal:** https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack
- **Backend:** https://github.com/yfuugvvjvk-glitch/ecommerce-backend
- **Frontend:** https://github.com/yfuugvvjvk-glitch/ecommerce-frontend

---

## 🐛 Troubleshooting

### Problema: Docker nu pornește

**Soluție:** Verifică că Docker Desktop este pornit și rulează

### Problema: Backend nu se conectează la baza de date

**Soluție:**

```bash
# Verifică că PostgreSQL rulează
docker ps

# Verifică DATABASE_URL în backend/.env
# Ar trebui să fie: postgresql://postgres:password@localhost:5432/ecommerce_db
```

### Problema: Frontend nu se conectează la backend

**Soluție:**

```bash
# Verifică că backend rulează pe port 3001
# Verifică NEXT_PUBLIC_API_URL în frontend/.env.local
# Ar trebui să fie: http://localhost:3001
```

### Problema: Erori Prisma

**Soluție:**

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

---

## 📞 Contact

Pentru întrebări sau clarificări despre proiect, vă rog să mă contactați.

---

## ✅ Checklist Evaluare

- [ ] Aplicația pornește fără erori
- [ ] Autentificarea funcționează
- [ ] Produsele se afișează corect
- [ ] Coșul de cumpărături funcționează
- [ ] Comenzile se pot plasa
- [ ] Panoul admin este accesibil
- [ ] Chat-ul în timp real funcționează
- [ ] Sistemul de cadouri funcționează
- [ ] Rapoartele financiare se generează
- [ ] Codul este bine documentat

---

**Mulțumesc pentru evaluare! 🙏**

_Acest proiect reprezintă munca mea pentru obținerea diplomei de licență și demonstrează competențele dobândite în dezvoltarea aplicațiilor web full-stack moderne._
