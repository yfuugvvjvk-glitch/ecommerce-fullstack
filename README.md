# 🛒 E-Commerce Full-Stack Application

Aplicație completă de e-commerce construită cu Next.js, Fastify și PostgreSQL.

## 🌐 Demo Live

⚠️ **IMPORTANT: Aplicația funcționează DOAR LOCAL**

- Baza de date gratuită a expirat definitiv
- Pentru testare, rulează aplicația local (vezi instrucțiunile de mai jos)
- **Frontend local:** http://localhost:3000
- **Backend local:** http://localhost:3001

## 🔑 Credențiale Demo

**Admin:**

- Email: admin@example.com
- Parolă: Admin1234

**User:**

- Email: ion.popescu@example.com
- Parolă: User1234

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

## ✨ Funcționalități Complete

### Pentru Utilizatori 👥

- 🔐 **Autentificare completă** - Register, Login, JWT, profil editabil
- 🛍️ **Catalog produse** - 12 produse, 6 categorii, filtrare, căutare, sortare
- 🛒 **Coș persistent** - Adăugare/eliminare produse, calcul automat total
- 📦 **Plasare comenzi** - Checkout complet cu 3 metode plată
- 🎟️ **Sistem voucher-uri** - Aplicare coduri reducere (WELCOME10, SUMMER50)
- ⭐ **Review-uri** - Rating și comentarii pentru produse
- 💝 **Lista favorite** - Salvare produse preferate
- 👤 **Profil utilizator** - Editare informații și avatar upload
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
- 🌍 **Suport multilingv** - Română și Engleză
- ⚡ **Performance optimizat** - Lazy loading, caching, bundle optimization

## 📦 Instalare Locală

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm sau yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurează DATABASE_URL în .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Creează .env.local cu NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev
```

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
