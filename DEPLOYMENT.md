# 🚀 GHID DEPLOYMENT

## 📋 Prezentare Generală

Acest document descrie procesul complet de deployment pentru aplicația e-commerce, de la development local până la producție.

---

## 🎯 Strategia de Deployment

### Medii de Deployment

1. **Development** - Local development environment
2. **Staging** - Pre-production testing environment
3. **Production** - Live application environment

### Servicii Utilizate

- **Frontend:** Vercel (Automatic deployments)
- **Backend:** Render.com (Docker containers)
- **Database:** Render PostgreSQL (Managed service)
- **File Storage:** Render Static Files

---

## 🔧 Configurare Locală

### Prerequisites

```bash
# Software necesar
- Node.js 18+
- Docker Desktop
- Git
- npm sau yarn
```

### Setup Complet

```bash
# 1. Clone repository
git clone <repository-url>
cd ecommerce-app

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Setup database
docker-compose up -d

# 4. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 5. Run migrations
cd backend
npx prisma migrate dev
npx prisma db seed

# 6. Start applications
npm run dev # în backend
npm run dev # în frontend (terminal nou)
```

### Environment Variables

**Backend (.env)**

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# OpenAI (Optional)
OPENAI_API_KEY="sk-your-api-key"
```

**Frontend (.env.local)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🌐 Deployment Producție

### 1. Frontend Deployment (Vercel)

#### Setup Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod
```

#### Configurare Vercel

**Fișier:** `frontend/vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-backend-url.onrender.com"
  }
}
```

#### Environment Variables Vercel

```bash
# În Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://ecommerce-backend.onrender.com
```

### 2. Backend Deployment (Render)

#### Dockerfile

**Fișier:** `backend/Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Start command
CMD ["npm", "start"]
```

#### Render Configuration

**Fișier:** `backend/render.yaml`

```yaml
services:
  - type: web
    name: ecommerce-backend
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: ecommerce-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
      - key: CORS_ORIGIN
        value: https://your-frontend-url.vercel.app

databases:
  - name: ecommerce-db
    databaseName: ecommerce
    user: ecommerce_user
```

#### Environment Variables Render

```bash
# În Render Dashboard → Environment
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=3001
```

### 3. Database Setup (Render PostgreSQL)

#### Creare Database

1. Render Dashboard → New → PostgreSQL
2. Nume: `ecommerce-db`
3. Database Name: `ecommerce`
4. User: `ecommerce_user`
5. Region: Oregon (US West)

#### Migrații Producție

```bash
# Conectare la production database
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Seed production data
DATABASE_URL="postgresql://..." npx prisma db seed
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**Fișier:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm run test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Monitoring & Logging

### Health Checks

```typescript
// backend/src/routes/health.ts
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV,
  };
});
```

### Logging Strategy

```typescript
// Production logging
const logger = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
        }
      : undefined,
};
```

### Error Tracking

```typescript
// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  reply.code(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});
```

---

## 🔒 Securitate Producție

### SSL/TLS

- **Vercel:** SSL automat pentru toate domeniile
- **Render:** SSL automat pentru toate serviciile

### Environment Variables

```bash
# Securizare secrets
JWT_SECRET=complex-random-string-256-bits
DATABASE_URL=postgresql://encrypted-connection
OPENAI_API_KEY=sk-secure-api-key
```

### Security Headers

```typescript
// Helmet configuration pentru producție
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});
```

---

## 📈 Performance Optimization

### Frontend Optimizations

```typescript
// next.config.ts
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Compression
  compress: true,

  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
```

### Backend Optimizations

```typescript
// Database connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Response compression
await fastify.register(require('@fastify/compress'));
```

---

## 🚨 Rollback Strategy

### Quick Rollback

```bash
# Vercel rollback
vercel --prod --force

# Render rollback
# În Render Dashboard → Deployments → Previous deployment → Redeploy
```

### Database Rollback

```bash
# Prisma migration rollback
npx prisma migrate reset
npx prisma migrate deploy --to 20231201000000_previous_migration
```

---

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Toate testele trec
- [ ] Environment variables configurate
- [ ] Database migrations pregătite
- [ ] SSL certificates valide
- [ ] Backup database creat

### Deployment

- [ ] Deploy backend
- [ ] Verificare health check
- [ ] Deploy frontend
- [ ] Verificare conectivitate
- [ ] Smoke testing

### Post-Deployment

- [ ] Monitoring activ
- [ ] Performance check
- [ ] Error tracking
- [ ] User acceptance testing
- [ ] Documentation update

---

## 🔧 Troubleshooting

### Probleme Comune

#### 1. Database Connection Issues

```bash
# Verificare conexiune
npx prisma db pull

# Test connection
docker exec -it postgres psql -U user -d database
```

#### 2. Build Failures

```bash
# Clear cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### 3. Environment Variables

```bash
# Verificare variables
echo $DATABASE_URL
printenv | grep API
```

---

## 📞 Support & Maintenance

### Backup Strategy

- **Database:** Daily automated backups (Render)
- **Files:** Versioned în Git
- **Configs:** Environment variables backup

### Update Strategy

- **Dependencies:** Monthly security updates
- **Framework:** Quarterly major updates
- **Database:** Schema migrations cu rollback plan

---

**Deployment-ul este automatizat și optimizat pentru scalabilitate și siguranță!** 🚀
