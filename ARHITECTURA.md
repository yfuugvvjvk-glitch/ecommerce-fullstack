# 🏗️ ARHITECTURA APLICAȚIEI E-COMMERCE

## 📋 Prezentare Generală

Aplicația e-commerce este construită folosind o arhitectură **full-stack modernă** cu separarea clară între frontend și backend, respectând principiile **clean architecture** și **separation of concerns**.

---

## 🎯 Stack Tehnologic

### Frontend

- **Framework:** Next.js 16.0.1 (App Router)
- **Library UI:** React 19.2.0
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Form Management:** React Hook Form + Zod
- **HTTP Client:** Axios
- **State Management:** React Context API

### Backend

- **Runtime:** Node.js
- **Framework:** Fastify 5.6.2
- **Database ORM:** Prisma 6.19.0
- **Database:** PostgreSQL
- **Authentication:** JWT (@fastify/jwt)
- **Security:** Helmet, CORS, Rate Limiting
- **File Upload:** @fastify/multipart

### DevOps & Tools

- **Containerization:** Docker (PostgreSQL)
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Testing:** Jest (unit), Cypress (E2E)
- **Linting:** ESLint + Prettier

---

## 🏛️ Arhitectura Sistemului

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Browser (Desktop/Mobile) → Next.js Frontend (Port 3000)       │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP/HTTPS Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Fastify Server (Port 3001) → Rate Limiting, CORS, Auth       │
└─────────────────────────────┬───────────────────────────────────┘
                              │ Business Logic
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Services: Auth, Order, Cart, Admin, User, Voucher, OpenAI    │
└─────────────────────────────┬───────────────────────────────────┘
                              │ Data Access
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Prisma ORM → Type-safe Database Operations                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │ SQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database (Docker Container)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Structura Proiectului

```
ecommerce-app/
├── frontend/                    # Next.js Application
│   ├── app/                    # App Router Pages
│   │   ├── (auth)/            # Authentication Pages
│   │   ├── (dashboard)/       # Protected Pages
│   │   ├── admin/             # Admin Panel
│   │   └── globals.css        # Global Styles
│   ├── components/            # Reusable Components
│   │   ├── ui/               # Base UI Components
│   │   ├── admin/            # Admin Components
│   │   └── layout/           # Layout Components
│   ├── lib/                  # Utilities & Config
│   │   ├── api-client.ts     # Axios Configuration
│   │   ├── auth-context.tsx  # Authentication Context
│   │   └── validations.ts    # Zod Schemas
│   └── public/               # Static Assets
│
├── backend/                     # Fastify API Server
│   ├── src/
│   │   ├── routes/           # API Endpoints
│   │   │   ├── auth.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── ...
│   │   ├── services/         # Business Logic
│   │   │   ├── auth.service.ts
│   │   │   ├── order.service.ts
│   │   │   └── ...
│   │   ├── middleware/       # Custom Middleware
│   │   │   ├── auth.middleware.ts
│   │   │   └── admin.middleware.ts
│   │   └── index.ts          # Server Entry Point
│   ├── prisma/               # Database Schema & Migrations
│   │   ├── schema.prisma     # Database Schema
│   │   ├── seed.ts           # Database Seeding
│   │   └── migrations/       # Migration Files
│   └── public/               # File Uploads
│
├── docker-compose.yml           # PostgreSQL Container
├── README.md                   # Project Documentation
└── API.md                      # API Documentation
```

---

## 🔄 Fluxul de Date

### 1. Autentificare

```
User Input → Frontend Validation → API Request → JWT Generation → Database → Response
```

### 2. Plasare Comandă

```
Cart Items → Checkout Form → Validation → Stock Check → Order Creation →
Stock Update → Cart Clear → Order Confirmation
```

### 3. Gestionare Admin

```
Admin Login → Protected Routes → Admin API → Database Operations →
Real-time Updates → Response
```

---

## 🔐 Securitate

### Măsuri Implementate

1. **Authentication & Authorization**

   - JWT tokens cu expirare (24h)
   - Password hashing cu bcrypt (10 rounds)
   - Role-based access control (User/Admin)

2. **API Security**

   - Rate limiting (100 req/min general, 5 req/min auth)
   - CORS configuration
   - Helmet security headers
   - Input validation cu Zod

3. **Database Security**

   - Prisma ORM (SQL injection protection)
   - Prepared statements
   - Connection pooling

4. **Frontend Security**
   - XSS protection
   - CSRF protection
   - Secure cookie handling

---

## 📊 Modelul Bazei de Date

### Entități Principale

```sql
User (Utilizatori)
├── id, email, password, name, role
├── phone, address, avatar, locale
└── Relations: orders, cartItems, reviews, favorites

DataItem (Produse)
├── id, title, description, price, stock
├── image, categoryId, status, rating
└── Relations: category, reviews, orderItems

Order (Comenzi)
├── id, userId, total, status
├── shippingAddress, paymentMethod
└── Relations: user, orderItems, voucherUsed

Category (Categorii)
├── id, name, slug, icon
└── Relations: dataItems

Review (Evaluări)
├── id, rating, comment, userId, dataItemId
└── Relations: user, dataItem

Voucher (Vouchere)
├── id, code, discountType, discountValue
├── validFrom, validUntil, maxUsage
└── Relations: userVouchers
```

### Relații Cheie

- User 1:N Orders (Un utilizator → multiple comenzi)
- Order 1:N OrderItems (O comandă → multiple produse)
- DataItem N:1 Category (Produse → o categorie)
- User N:M DataItem (prin Favorite - many-to-many)

---

## 🚀 Performanță

### Optimizări Frontend

- **Code Splitting:** Automatic cu Next.js App Router
- **Image Optimization:** Next.js Image component
- **Lazy Loading:** Componente și imagini
- **Caching:** Browser caching pentru assets

### Optimizări Backend

- **Database Indexing:** Pe câmpurile frecvent căutate
- **Connection Pooling:** Prisma connection pooling
- **Query Optimization:** Select specific fields
- **Response Compression:** Gzip compression

### Optimizări Database

- **Indexes:** userId, categoryId, status, email
- **Foreign Keys:** Pentru integritatea datelor
- **Constraints:** Unique constraints pentru email, voucher codes

---

## 🔧 Deployment

### Local Development

```bash
# PostgreSQL
docker-compose up -d

# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production Deployment

- **Frontend:** Vercel (Automatic deployments)
- **Backend:** Render.com (Docker container)
- **Database:** Render PostgreSQL (Managed service)

---

## 📈 Scalabilitate

### Horizontal Scaling

- **Load Balancing:** Multiple backend instances
- **Database Replication:** Read replicas
- **CDN:** Static assets distribution

### Vertical Scaling

- **Database Optimization:** Query optimization, indexing
- **Caching Layer:** Redis pentru session storage
- **File Storage:** Cloud storage pentru imagini

---

## 🧪 Testing Strategy

### Unit Testing (Jest)

- Service layer testing
- Utility functions testing
- Component testing

### Integration Testing

- API endpoint testing
- Database operations testing
- Authentication flow testing

### End-to-End Testing (Cypress)

- User journey testing
- Admin workflow testing
- Cross-browser compatibility

---

## 📚 Documentație

### Pentru Dezvoltatori

- **README.md:** Setup și utilizare
- **API.md:** Documentație API completă
- **ARHITECTURA.md:** Acest document

### Pentru Utilizatori

- **User Guide:** În aplicație (help sections)
- **Admin Guide:** Panou admin cu tooltips

---

## 🔮 Extensibilitate Viitoare

### Funcționalități Planificate

- **Payment Gateway:** Stripe/PayPal integration
- **Email Service:** Nodemailer pentru notificări
- **Analytics:** Google Analytics integration
- **Mobile App:** React Native app

### Îmbunătățiri Tehnice

- **Microservices:** Separarea în servicii independente
- **GraphQL:** Alternative la REST API
- **WebSockets:** Real-time notifications
- **PWA:** Progressive Web App features

---

**Arhitectura actuală oferă o bază solidă pentru o aplicație e-commerce modernă, scalabilă și sigură.**
