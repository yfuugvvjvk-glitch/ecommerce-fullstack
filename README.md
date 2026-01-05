# 🛒 E-Commerce Full-Stack Application

Aplicație completă de e-commerce construită cu Next.js, Fastify și PostgreSQL.

## 🌐 Demo Live

✅ **APLICAȚIA FUNCȚIONEAZĂ COMPLET LOCAL**

- **Frontend local:** http://localhost:3000
- **Backend local:** http://localhost:3001
- **Status:** Toate funcționalitățile sunt operaționale
- **Baza de date:** PostgreSQL local configurată și funcțională
- **Chat în timp real:** Socket.IO implementat și testat
- 📝 **NOTĂ**: Aplicația este demonstrativă pentru testarea competențelor tehnice

## 🔑 Credențiale Demo

**Admin:**

- Email: admin@example.com
- Parolă: 123

**User:**

- Email: ion.popescu@example.com
- Parolă: ion123

**Voucher-uri:** `WELCOME10` (10% off), `SUMMER50` (50 RON off)

## 🚀 Tehnologii

### Frontend

- Next.js 16 + React 19
- Tailwind CSS 4
- React Hook Form + Zod
- Axios

### Backend

- Fastify 5
- PostgreSQL + Prisma ORM
- JWT Authentication
- Bcrypt

## ✨ Funcționalități Complete (Demonstrative)

⚠️ **APLICAȚIE DEMONSTRATIVĂ**: Toate funcționalitățile sunt simulate pentru demonstrarea competențelor tehnice:

- Plățile cu carduri sunt simulate (nu se procesează plăți reale)
- Produsele și prețurile sunt fictive pentru testare
- Comenzile și livrările sunt simulate
- Scopul este demonstrarea competențelor full-stack moderne

### Pentru Utilizatori 👥

- 🔐 **Autentificare completă** - Register, Login, JWT, profil editabil
- 🛍️ **Catalog produse** - 12 produse, 6 categorii, filtrare, căutare, sortare
- 🛒 **Coș persistent** - Adăugare/eliminare produse, calcul automat total
- 📦 **Plasare comenzi** - Checkout complet cu 3 metode plată
- 🎟️ **Sistem voucher-uri** - Aplicare coduri reducere (WELCOME10, SUMMER50)
- ⭐ **Review-uri** - Rating și comentarii pentru produse
- 💝 **Lista favorite** - Salvare produse preferate
- 👤 **Profil utilizator** - Editare informații și avatar upload
- 💳 **Sistem carduri** - Carduri reale (securizate) și fictive pentru test
- 💬 **Chat în timp real** - Mesagerie directă, grupuri, support cu Socket.IO
- 📱 **Design responsive** - Funcționează perfect pe mobile/desktop

### Pentru Administratori 👨‍💼

- 📊 **Dashboard complet** - Statistici vânzări, utilizatori, comenzi în timp real
- 🛍️ **Gestionare produse** - CRUD complet cu upload imagini
- 👥 **Gestionare utilizatori** - Vizualizare, editare roluri, dezactivare conturi
- 📦 **Gestionare comenzi** - Actualizare status, procesare, tracking
- 🎟️ **Sistem voucher-uri** - Creare, editare, aprobare cereri utilizatori
- 📈 **Rapoarte și analize** - Export date, statistici detaliate

### Funcționalități Tehnice 🔧

- 🔒 **Securitate avansată** - JWT, bcrypt, rate limiting, CORS, helmet
- 📦 **Actualizare automată stoc** - La anulare comenzi, stocul se restituie
- 🤖 **AI Chatbot** - Asistență inteligentă cu fallback responses
- 💬 **Socket.IO** - Comunicare în timp real pentru chat și notificări
- 🌍 **Suport multilingv** - Română și Engleză
- ⚡ **Performance optimizat** - Lazy loading, caching, bundle optimization

## 📦 Instalare și Pornire Rapidă

### Metoda 1: Pornire Automată (Recomandată)

```bash
# Clonează repository-ul
git clone https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack.git
cd ecommerce-fullstack

# Pornește aplicația completă (baza de date + backend + frontend)
./start-full-app.bat
```

### Metoda 2: Instalare Manuală

#### Prerequisites

- Node.js 18+
- Docker și Docker Compose (pentru PostgreSQL)
- Git

#### Pași de instalare:

1. **Clonează repository-ul:**

```bash
git clone https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack.git
cd ecommerce-fullstack
```

2. **Pornește baza de date:**

```bash
docker-compose up -d
```

3. **Backend:**

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

4. **Frontend (în terminal nou):**

```bash
cd frontend
npm install
npm run dev
```

### Accesare Aplicație

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Chat în timp real:** Funcțional prin Socket.IO

## 📚 Documentație

### Documentație Tehnică

- **[ARHITECTURA.md](./ARHITECTURA.md)** - Arhitectura sistemului și design patterns
- **[SPECIFICATII.md](./SPECIFICATII.md)** - Cerințe tehnice și funcționale complete
- **[TESTARE.md](./TESTARE.md)** - Strategia de testare și exemple
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Ghid deployment și CI/CD
- **[ANALIZA_CERINTE.md](./ANALIZA_CERINTE.md)** - Analiza cerințelor vs implementare

### Documentație Proiect

- **[UPDATE_DATABASE.md](./UPDATE_DATABASE.md)** - Rezolvare problemă bază de date expirată
- **[TRIMITERE_PROFESOR.txt](./TRIMITERE_PROFESOR.txt)** - Informații pentru trimitere

## 🗂️ Structura

```
├── frontend/          # Next.js app
├── backend/           # Fastify API
│   ├── prisma/       # Database schema & migrations
│   └── src/          # Source code
└── README.md
```

## 🔒 Securitate

- Parole hash-uite cu bcrypt
- JWT pentru sesiuni
- Rate limiting
- CORS configurat
- Helmet security headers
- Input validation cu Zod

## 📄 Licență

MIT Universitatea Internațională Danubius

## 👨‍💻 Autor

**Student:** [Petrescu Cristian]  
Proiect realizat pentru disciplina [Dezvoltarea aplicatiilor Web]
**Data:** 13 Noiembrie 2025
