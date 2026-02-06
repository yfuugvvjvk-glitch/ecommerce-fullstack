# 🛒 Platformă E-Commerce Live cu AI

Platformă modernă de comerț electronic cu funcționalități avansate: management de conținut în timp real, asistent AI, sistem de comenzi complet, și gestionare avansată de stoc.

## 🚀 Caracteristici Principale

### Pentru Clienți

- 🛍️ **Catalog de produse** cu filtrare și căutare avansată
- 🤖 **Asistent AI** pentru recomandări personalizate
- 🛒 **Coș de cumpărături** cu actualizări în timp real
- 💳 **Plată securizată** (card, cash, transfer bancar)
- 📦 **Tracking comenzi** în timp real
- 🎟️ **Sistem de vouchere** și reduceri
- ⭐ **Review-uri și rating** pentru produse
- 📍 **Locații de livrare** multiple cu program personalizat

### Pentru Administratori

- 📊 **Dashboard complet** cu statistici live
- 📝 **Management de conținut** - editare pagini în timp real
- 📦 **Gestionare produse** cu stoc avansat (perisabile, unități, cantități fixe)
- 👥 **Gestionare utilizatori** și roluri
- 🎯 **Gestionare comenzi** cu actualizare automată stoc
- 🎁 **Gestionare oferte** și campanii
- 💰 **Rapoarte financiare** și cheltuieli/venituri
- 🚚 **Locații de livrare** cu program și rază de acoperire
- 🔄 **Actualizări în timp real** pentru toate modificările

## 📋 Tehnologii Utilizate

### Backend

- **Node.js** + **TypeScript**
- **Fastify** - framework web rapid
- **Prisma** - ORM pentru PostgreSQL
- **Socket.IO** - comunicare în timp real
- **JWT** - autentificare securizată
- **Zod** - validare date

### Frontend

- **Next.js 14** - framework React
- **TypeScript**
- **Tailwind CSS** - styling
- **WebSocket** - actualizări live
- **Context API** - state management

### Database

- **PostgreSQL** - bază de date relațională

## 🛠️ Instalare și Configurare

### Cerințe

- Node.js 18+
- PostgreSQL 14+
- npm sau yarn

### 1. Clonează repository-ul

```bash
git clone <repository-url>
cd site-comert-live
```

### 2. Configurare Backend

```bash
cd backend
npm install

# Configurare .env
cp .env.example .env
# Editează .env cu datele tale de conexiune PostgreSQL
```

**Fișier `.env` necesar:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET="your-secret-key-here"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 3. Inițializare Bază de Date

```bash
# Rulează migrările
npx prisma migrate deploy

# Inițializează sistemul cu date implicite
node initialize-system.js
```

Acest script va crea:

- ✅ Configurații site (email, telefon, adresă, program)
- ✅ Pagini editabile (About, Contact, Dashboard Welcome)
- ✅ Locație de livrare implicită
- ✅ Utilizator admin (dacă nu există)

### 4. Configurare Frontend

```bash
cd frontend
npm install

# Configurare .env
cp .env.example .env.local
```

**Fișier `.env.local` necesar:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Pornire Aplicație

**Opțiune 1: Manual (pentru development)**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Opțiune 2: Script automat (Windows)**

```bash
# Pornește ambele servere
start-local.bat

# Oprește serverele
stop-app.bat
```

### 6. Acces Aplicație

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Admin Panel:** http://localhost:3000/admin

**Credențiale admin implicite:**

- Email: `admin@site.ro`
- Parolă: `admin123`

## 📱 Structura Aplicației

### Pagini Principale

#### Pentru Clienți

- `/` - Redirect automat la dashboard sau login
- `/login` - Autentificare
- `/register` - Înregistrare cont nou
- `/dashboard` - Pagina principală cu produse și oferte
- `/shop` - Catalog complet de produse
- `/products/:id` - Detalii produs
- `/cart` - Coș de cumpărături
- `/checkout` - Finalizare comandă
- `/orders` - Istoricul comenzilor
- `/profile` - Profil utilizator
- `/about` - Despre noi (editabil de admin)
- `/contact` - Contact (editabil de admin)
- `/offers` - Oferte speciale
- `/favorites` - Produse favorite

#### Pentru Administratori

- `/admin` - Panoul de administrare cu:
  - 📊 Dashboard cu statistici
  - 👥 Gestionare utilizatori
  - 📦 Gestionare produse
  - 🛒 Gestionare comenzi
  - 🎟️ Gestionare vouchere
  - 🎁 Gestionare oferte
  - 📝 Gestionare conținut (pagini editabile)
  - 🚚 Locații de livrare
  - 💰 Rapoarte financiare
  - 📊 Inventar și stoc

## 🎯 Funcționalități Avansate

### 1. Actualizări Live în Timp Real ⚡

**Toate modificările din admin se actualizează automat pe site fără restart sau rebuild!**

#### Ce se actualizează live:

**📦 Metode de Livrare**

- Admin modifică în "💳 Plată & Livrare"
- Checkout page afișează imediat noile metode
- Costuri și praguri de livrare gratuită actualizate automat
- API: `GET /api/public/delivery-methods`

**💳 Metode de Plată**

- Admin modifică metodele de plată (card, cash, transfer, crypto, PayPal)
- Checkout page afișează metodele active
- Iconițe și descrieri actualizate automat
- API: `GET /api/public/payment-methods`

**📞 Informații de Contact**

- Admin modifică email, telefon, adresă, program
- Contact page și Checkout afișează datele noi
- Actualizare automată pe toate paginile
- API: `GET /api/public/site-config`, `GET /api/public/contact-info`

**📍 Locații de Livrare/Ridicare**

- Admin adaugă/modifică locații
- Checkout afișează locațiile active cu program
- Calcul automat taxe de livrare
- API: `GET /api/public/delivery-locations`

**🎠 Produse în Carousel**

- Admin marchează produse cu "Show in Carousel"
- Dashboard afișează automat produsele în carousel
- Ordine manuală sau automată după discount

**📄 Pagini Personalizate**

- Admin editează conținut pagini (About, Contact)
- Modificările apar imediat pe site
- API: `GET /api/public/pages/:slug`

#### Cum funcționează:

1. **Admin modifică** → Salvare → Baza de date
2. **Frontend solicită** → fetch API → setState
3. **React re-render** → UI actualizat

#### Testare:

1. Deschide site în browser
2. Deschide Admin Panel în alt tab
3. Modifică o setare (ex: cost livrare)
4. Reîncarcă pagina site-ului (F5)
5. ✅ Modificarea este vizibilă!

### 2. Management de Conținut Live

Administratorii pot edita paginile site-ului în timp real:

- **Pagini editabile:** About, Contact
- **Editor live** cu preview în timp real
- **Actualizări instantanee** - modificările apar imediat pe site
- **Istoric modificări** - tracking complet

### 2. Sistem Avansat de Produse

- **Produse perisabile** cu date de expirare
- **Unități de măsură** flexibile (kg, litru, bucată)
- **Cantități fixe** stabilite de admin (ex: 0.5kg, 1kg, 2kg)
- **Comandă în avans** pentru produse proaspete
- **Stoc rezervat** vs stoc disponibil
- **Alertă stoc scăzut** automată

### 3. Locații de Livrare

- **Multiple locații** de ridicare/livrare
- **Program personalizat** pentru fiecare locație
- **Rază de acoperire** cu calcul distanță
- **Cost livrare dinamic** bazat pe valoarea comenzii
- **Livrare gratuită** peste un prag configurat

### 4. Rapoarte și Statistici

- **Dashboard financiar** cu venituri/cheltuieli
- **Rapoarte inventar** cu valori stoc
- **Statistici comenzi** pe perioade
- **Export date** pentru analiză

## 🔧 Configurare Avansată

### Configurații Site (editabile din admin)

Toate configurațiile pot fi modificate din panoul admin:

- Nume site
- Descriere
- Email contact
- Telefon contact
- Adresă companie
- Program de lucru
- Rețele sociale
- Valoare minimă comandă
- Prag livrare gratuită
- Mod mentenanță

### Locații de Livrare

Configurare completă pentru fiecare locație:

- Nume și adresă
- Coordonate GPS
- Program de lucru pe zile
- Cost livrare
- Prag livrare gratuită
- Rază de acoperire (km)
- Instrucțiuni speciale
- Persoană de contact

## 📊 API Endpoints

### Public (fără autentificare)

- `GET /api/public/pages` - Lista pagini publicate
- `GET /api/public/pages/:slug` - Conținut pagină
- `GET /api/public/site-config` - Configurații publice
- `GET /api/public/delivery-locations` - Locații active
- `GET /api/public/delivery-methods` - Metode de livrare active
- `GET /api/public/payment-methods` - Metode de plată active
- `GET /api/public/contact-info` - Informații contact

### Autentificare

- `POST /api/auth/register` - Înregistrare
- `POST /api/auth/login` - Autentificare
- `GET /api/auth/me` - Profil utilizator

### Produse

- `GET /api/data` - Lista produse
- `GET /api/data/:id` - Detalii produs
- `POST /api/data` - Creare produs (admin)
- `PUT /api/data/:id` - Actualizare produs (admin)
- `DELETE /api/data/:id` - Ștergere produs (admin)

### Comenzi

- `GET /api/orders` - Comenzile utilizatorului
- `POST /api/orders` - Creare comandă
- `GET /api/orders/:id` - Detalii comandă
- `PUT /api/orders/:id/status` - Actualizare status (admin)

### Admin

- `GET /api/admin/stats` - Statistici generale
- `GET /api/admin/users` - Lista utilizatori
- `GET /api/admin/orders` - Toate comenzile
- `GET /api/admin/content/pages` - Pagini editabile
- `PUT /api/admin/content/pages/:id` - Actualizare pagină
- `GET /api/admin/delivery-locations` - Locații livrare
- `POST /api/admin/delivery-locations` - Creare locație

## 🧪 Testare

### Test Sistem Complet

```bash
node test-real-pages-system.js
```

Testează:

- ✅ Pagini reale (About, Contact, Dashboard)
- ✅ Configurații site
- ✅ Locații de livrare
- ✅ API endpoints publice

## 📝 Informații Contact Reale

**Email:** crys.cristi@yahoo.com  
**Telefon:** 0753615742  
**Adresă:** Str. Gari nr. 69, Galati, România, Cod poștal: 08001

**Program:**

- Magazin fizic: Luni-Vineri 9:00-18:00, Sâmbătă 10:00-14:00
- Magazin online: Non-stop

## 📚 Documentație Academică

Pentru susținerea lucrării de licență, sunt disponibile următoarele documente:

- **LUCRARE_DIPLOMA.md** - Lucrarea de licență completă în format Markdown
- **Lucrare licenta.docx** - Lucrarea de licență în format Word
- **POWERPOINT_PREZENTARE.md** - Prezentarea PowerPoint (17 slide-uri)
- **DISCURS_SUSTINERE.md** - Discursul pentru susținere (15-20 minute)
- **TRIMITERE_PROFESOR.txt** - Instrucțiuni complete pentru profesor

## 🤝 Contribuții

Pentru îmbunătățiri sau raportare bug-uri, contactați echipa de dezvoltare.

## 📄 Licență

Acest proiect este dezvoltat pentru uz educațional și comercial.

---

**Versiune:** 2.1  
**Ultima actualizare:** 6 Februarie 2026  
**Status:** ✅ Complet funcțional cu actualizări live în timp real
