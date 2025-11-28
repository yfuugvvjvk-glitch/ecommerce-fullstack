# Proiect E-Commerce - Aplicație Full-Stack

## 📋 Informații Generale
**Student:** [Petrescu Cristian]  
**Disciplina:** [Dezvoltarea aplicatiilor Web]  
**Data:** 13 Noiembrie 2025
---

## 🌐 Link-uri Aplicație LIVE

### Frontend (Vercel)

**URL:** https://ecommerce-frontend-navy.vercel.app

### Backend API (Render)

**URL:** https://ecommerce-fullstack-3y1b.onrender.com

### Repository GitHub

**Frontend:** https://github.com/yfuugvvjvk-glitch/ecommerce-frontend  
**Backend:** https://github.com/yfuugvvjvk-glitch/ecommerce-backend  
**Repository Principal:** https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack

---

## 👤 Credențiale de Testare

### Cont Administrator

- **Email:** admin@example.com
- **Parolă:** Admin1234
- **Acces:** Panou admin complet, gestionare produse, utilizatori, comenzi, voucher-uri, oferte

### Conturi Utilizatori

1. **Ion Popescu**

   - Email: ion.popescu@example.com
   - Parolă: User1234

2. **Maria Ionescu**

   - Email: maria.ionescu@example.com
   - Parolă: User1234

3. **Andrei Popa**
   - Email: andrei.popa@example.com
   - Parolă: User1234

### Voucher-uri Active

- **WELCOME10** - 10% reducere (valabil 60 zile)
- **SUMMER50** - 50 RON reducere (valabil 30 zile)

---

## 🚀 Tehnologii Utilizate

### Frontend

- **Framework:** Next.js 16.0.1 (React 19.2.0)
- **Styling:** Tailwind CSS 4
- **Form Management:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend

- **Runtime:** Node.js
- **Framework:** Fastify 5.6.2
- **Database:** PostgreSQL (Prisma ORM 6.19.0)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting
- **File Upload:** Multipart
- **Deployment:** Render.com

### Database

- **PostgreSQL** (hosted on Render)
- **ORM:** Prisma
- **Migrații:** 7 migrații complete

---

## ✨ Funcționalități Implementate

### Pentru Utilizatori

- ✅ Autentificare și înregistrare (JWT)
- ✅ Vizualizare produse cu filtrare și căutare
- ✅ Sistem de categorii (6 categorii: Electronice, Fashion, Casă & Grădină, Sport, Jucării, Cărți)
- ✅ Coș de cumpărături persistent
- ✅ Plasare comenzi (Card sau Ramburs)
- ✅ Istoric comenzi cu tracking status
- ✅ Sistem de review-uri și rating
- ✅ Lista de favorite
- ✅ Profil utilizator editabil cu avatar
- ✅ Aplicare voucher-uri la checkout
- ✅ Cereri de voucher-uri
- ✅ Chatbot AI pentru asistență (fallback inteligent)
- ✅ Istoric de navigare
- ✅ Multilingv (Română/Engleză)

### Pentru Administratori

- ✅ Dashboard complet de administrare
- ✅ Gestionare produse (CRUD complet)
- ✅ Gestionare categorii
- ✅ Gestionare utilizatori
- ✅ Gestionare comenzi (actualizare status)
- ✅ Gestionare oferte și promoții
- ✅ Gestionare voucher-uri (creare, editare, dezactivare)
- ✅ Aprobare/respingere cereri voucher-uri
- ✅ Upload imagini pentru produse și oferte
- ✅ Statistici și rapoarte

### Funcționalități Tehnice

- ✅ Autentificare securizată cu JWT
- ✅ Rate limiting pentru protecție API
- ✅ Validare date cu Zod
- ✅ Responsive design (mobile-first)
- ✅ Optimizare imagini
- ✅ Lazy loading componente
- ✅ Cron jobs pentru curățare automată
- ✅ Error handling complet
- ✅ Logging structurat
- ✅ CORS configurat corect
- ✅ Security headers (Helmet)

---

## 📊 Date în Baza de Date

### Produse: 12 produse

- 2 Electronice (Laptop, Căști gaming)
- 2 Fashion (Cămașă, Rochie)
- 2 Casă & Grădină (Mașină tuns gazon, Despicător busteni)
- 2 Sport (Bancă exerciții, Gantere)
- 2 Jucării (Bicicletă, Cub Rubik)
- 2 Cărți (Chiriașa, Soarele negru)

### Utilizatori: 4 utilizatori

- 1 Administrator
- 3 Utilizatori normali

### Comenzi: 2 comenzi

- 1 Livrată
- 1 În procesare

### Oferte: 3 oferte active

- Black Friday Electronice (30% reducere)
- Ofertă Fashion (25% reducere)
- Sport & Fitness (20% reducere)

### Voucher-uri: 2 voucher-uri active

### Review-uri: 5 review-uri

### Cereri Voucher: 3 cereri (1 pending, 1 aprobată, 1 respinsă)

---

## 🔧 Cum să Testați Aplicația

### 1. Testare ca Utilizator

1. Accesați: https://ecommerce-frontend-navy.vercel.app
2. Click pe "Înregistrare" și creați un cont SAU folosiți: ion.popescu@example.com / User1234
3. Navigați prin categorii și produse
4. Adăugați produse în coș
5. Mergeți la checkout și plasați o comandă
6. Aplicați voucher-ul "WELCOME10" pentru 10% reducere
7. Verificați istoricul comenzilor
8. Lăsați un review la un produs
9. Testați chatbot-ul AI

### 2. Testare ca Administrator

1. Loghează-te cu: admin@example.com / Admin1234
2. Accesați panoul de administrare
3. Creați un produs nou
4. Editați o comandă existentă
5. Creați un voucher nou
6. Aprobați/respingeți cereri de voucher-uri
7. Gestionați utilizatorii

### 3. Testare API (Opțional)

```bash
# Health check
curl https://ecommerce-fullstack-3y1b.onrender.com/health

# Get products
curl https://ecommerce-fullstack-3y1b.onrender.com/api/data/items

# Get categories
curl https://ecommerce-fullstack-3y1b.onrender.com/api/categories
```

---

## 📁 Structura Proiectului

```
ecommerce-fullstack/
├── frontend/                 # Aplicația Next.js
│   ├── app/                 # Pages și layouts
│   ├── components/          # Componente React
│   ├── lib/                 # Utilități și API client
│   └── public/              # Imagini și assets
│
├── backend/                 # API Fastify
│   ├── src/
│   │   ├── routes/         # Endpoint-uri API
│   │   ├── services/       # Logică business
│   │   ├── middleware/     # Autentificare, validare
│   │   └── utils/          # Utilități
│   ├── prisma/
│   │   ├── schema.prisma   # Schema bazei de date
│   │   ├── migrations/     # Migrații database
│   │   └── seed.ts         # Date inițiale
│   └── public/uploads/     # Fișiere încărcate
│
└── README.md
```

---

## 🔐 Securitate

- ✅ Parole hash-uite cu bcrypt (10 rounds)
- ✅ JWT pentru autentificare
- ✅ Rate limiting (100 req/min general, 5 req/min pentru auth)
- ✅ CORS configurat
- ✅ Helmet pentru security headers
- ✅ Validare input cu Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection

---

## 📝 Note Importante

1. **Prima încărcare:** Backend-ul pe Render poate dura 30-60 secunde la prima accesare (free tier)
2. **Imagini:** Imaginile sunt servite din folderul `/public/images`
3. **Database:** PostgreSQL hosted pe Render
4. **Deployment:** Automatic deployment la fiecare push pe GitHub

---

## 🎯 Caracteristici Notabile

### 1. AI Chatbot Inteligent

- Răspunde la întrebări despre produse, comenzi, voucher-uri
- Citește date real-time din baza de date
- Fallback inteligent când OpenAI API nu este disponibil

### 2. Sistem Complet de Voucher-uri

- Utilizatorii pot cere voucher-uri
- Adminii pot aproba/respinge cereri
- Voucher-uri cu expirare automată
- Suport pentru reduceri procentuale și fixe

### 3. Gestionare Comenzi Avansată

- Multiple statusuri (Pending, Processing, Shipping, Delivered, Cancelled)
- Tracking complet
- Istoric detaliat
- Notificări

### 4. Cleanup Automat

- Cron job zilnic la 3:00 AM
- Șterge voucher-uri expirate
- Șterge cereri vechi de voucher-uri
- Curăță voucher-uri complet utilizate

---

## 📞 Contact

Pentru întrebări sau probleme tehnice, vă rog să mă contactați.

---

## ✅ Checklist Finalizare

- [x] Frontend deploiat pe Vercel
- [x] Backend deploiat pe Render
- [x] Baza de date PostgreSQL configurată
- [x] Toate migrațiile aplicate
- [x] Date de test populate
- [x] Autentificare funcțională
- [x] CRUD produse funcțional
- [x] Sistem comenzi funcțional
- [x] Sistem voucher-uri funcțional
- [x] Panou admin complet
- [x] Responsive design
- [x] Securitate implementată
- [x] Documentație completă

---

**Proiect realizat cu:** Next.js, React, Fastify, PostgreSQL, Prisma, Vercel, Render

**Data finalizării:** 13 Noiembrie 2025
