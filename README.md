# 🛍️ Full-Stack E-Commerce Application

Aplicație e-commerce completă construită cu Next.js, Node.js, PostgreSQL și Prisma.

## 📋 Funcționalități

### Pentru Utilizatori:

- ✅ Autentificare și înregistrare
- ✅ Navigare produse cu filtre (categorie, preț, rating)
- ✅ Coș de cumpărături
- ✅ Sistem de comenzi
- ✅ Favorite
- ✅ Review-uri și rating-uri
- ✅ Vouchere și reduceri
- ✅ Istoric comenzi
- ✅ Chatbot AI pentru asistență
- ✅ Multilingv (Română, Engleză, Spaniolă)

### Pentru Administratori:

- ✅ Gestionare produse (CRUD)
- ✅ Gestionare categorii
- ✅ Gestionare utilizatori
- ✅ Gestionare comenzi
- ✅ Gestionare vouchere
- ✅ Gestionare oferte speciale
- ✅ Statistici și dashboard
- ✅ Aprobare cereri vouchere

## 🛠️ Tehnologii Utilizate

### Frontend:

- **Next.js 16** (React Framework)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (HTTP client)
- **React Hook Form**
- **Lucide Icons**

### Backend:

- **Node.js** cu **Fastify**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (autentificare)
- **Bcrypt** (hash parole)
- **Zod** (validare)

### DevOps:

- **Docker** & **Docker Compose**
- **Nodemon** (development)

## 📦 Instalare și Rulare

### Prerequisite:

- Node.js 18+
- Docker Desktop
- npm sau yarn

### 1. Clonează repository-ul:

```bash
git clone <repository-url>
cd app
```

### 2. Instalează dependențele:

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Configurare variabile de mediu:

**Backend (.env):**

```bash
cd backend
cp .env.example .env
```

Editează `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"
JWT_SECRET="your-secret-key-here"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

**Frontend (.env.local):**

```bash
cd frontend
cp .env.example .env.local
```

Editează `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Pornește baza de date (Docker):

```bash
docker-compose up -d
```

Verifică că PostgreSQL rulează:

```bash
docker ps
```

### 5. Rulează migrările Prisma:

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 6. Pornește aplicația:

**Backend (terminal 1):**

```bash
cd backend
npm run dev
```

Backend va rula pe: http://localhost:3001

**Frontend (terminal 2):**

```bash
cd frontend
npm run dev
```

Frontend va rula pe: http://localhost:3000

### 7. Accesează aplicația:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

### Cont Admin Implicit:

După seed, poți folosi:

- **Email:** admin@example.com
- **Parolă:** admin123

## 📁 Structura Proiectului

```
app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Schema bază de date
│   │   └── seed.ts            # Date inițiale
│   ├── src/
│   │   ├── routes/            # Rute API
│   │   ├── services/          # Logică business
│   │   ├── middleware/        # Middleware-uri
│   │   ├── utils/             # Utilități
│   │   └── index.ts           # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Pagini autentificare
│   │   └── (dashboard)/      # Pagini principale
│   ├── components/            # Componente React
│   ├── lib/                   # Utilități și configurări
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml         # Configurare Docker
└── README.md
```

## 🗄️ Schema Bază de Date

Aplicația folosește următoarele tabele principale:

- **User** - Utilizatori
- **Category** - Categorii produse
- **DataItem** - Produse
- **Order** - Comenzi
- **OrderItem** - Produse din comenzi
- **CartItem** - Coș de cumpărături
- **Review** - Review-uri
- **Favorite** - Produse favorite
- **Voucher** - Vouchere
- **Offer** - Oferte speciale

## 🔧 Comenzi Utile

### Prisma:

```bash
# Generează client Prisma
npx prisma generate

# Creează migrare nouă
npx prisma migrate dev --name migration_name

# Vizualizează baza de date
npx prisma studio

# Reset bază de date
npx prisma migrate reset
```

### Docker:

```bash
# Pornește serviciile
docker-compose up -d

# Oprește serviciile
docker-compose down

# Vezi log-uri
docker-compose logs -f

# Șterge volumele (ATENȚIE: șterge datele!)
docker-compose down -v
```

## 🚀 Build pentru Producție

### Backend:

```bash
cd backend
npm run build
npm start
```

### Frontend:

```bash
cd frontend
npm run build
npm start
```

## 📝 API Endpoints Principale

### Autentificare:

- `POST /api/auth/register` - Înregistrare
- `POST /api/auth/login` - Autentificare
- `GET /api/auth/me` - Profil utilizator

### Produse:

- `GET /api/data` - Lista produse
- `GET /api/data/:id` - Detalii produs
- `POST /api/data` - Creare produs (admin)
- `PUT /api/data/:id` - Actualizare produs (admin)
- `DELETE /api/data/:id` - Ștergere produs (admin)

### Comenzi:

- `POST /api/orders` - Creare comandă
- `GET /api/orders/my` - Comenzile mele
- `GET /api/orders/:id` - Detalii comandă

### Coș:

- `GET /api/cart` - Coșul meu
- `POST /api/cart` - Adaugă în coș
- `PUT /api/cart/:id` - Actualizează cantitate
- `DELETE /api/cart/:id` - Șterge din coș

## 🐛 Troubleshooting

### Eroare: "Port already in use"

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Eroare: "Cannot connect to database"

```bash
# Verifică că Docker rulează
docker ps

# Repornește containerul
docker-compose restart postgres
```

### Eroare: "Prisma Client not generated"

```bash
cd backend
npx prisma generate
```

## 👨‍💻 Autor

Proiect realizat pentru cursul de Full-Stack Development

## 📄 Licență

MIT License
