# 🛒 E-Commerce Full-Stack Application

Aplicație completă de e-commerce construită cu Next.js, Fastify și PostgreSQL.

## 🌐 Demo Live

- **Frontend:** https://ecommerce-frontend-navy.vercel.app
- **Backend API:** https://ecommerce-fullstack-3y1b.onrender.com

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

## ✨ Funcționalități

- 🔐 Autentificare și autorizare (JWT)
- 🛍️ Catalog produse cu filtrare și căutare
- 🛒 Coș de cumpărături persistent
- 📦 Gestionare comenzi
- 🎟️ Sistem voucher-uri
- ⭐ Review-uri și rating-uri
- 💝 Lista de favorite
- 👤 Profil utilizator cu avatar
- 🤖 AI Chatbot pentru asistență
- 📊 Panou admin complet
- 🌍 Multilingv (RO/EN)

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

Vezi [INSTRUCTIUNI_TRIMITERE.md](./INSTRUCTIUNI_TRIMITERE.md) pentru documentație completă.

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

MIT

## 👨‍💻 Autor

Proiect realizat pentru disciplina [Numele Disciplinei]
