# 📊 Informații Bază de Date și Conținut

## 🗄️ Structura Bazei de Date

### Modele Principale (30+ tabele)

#### 👤 Utilizatori și Autentificare

- **User** - utilizatori (admin, client)
- **VerificationToken** - tokenuri verificare email
- **UserCard** - carduri salvate utilizatori

#### 🛍️ Produse și Catalog

- **Product** - produse cu toate detaliile
- **ProductVariant** - variante produse (culoare, mărime)
- **Category** - categorii ierarhice
- **Media** - imagini și fișiere media
- **Review** - recenzii și rating-uri

#### 🛒 Comenzi și Coș

- **Cart** - coșuri de cumpărături
- **CartItem** - produse în coș
- **Order** - comenzi plasate
- **OrderItem** - produse din comenzi
- **Invoice** - facturi generate

#### 🎁 Sistem Cadouri

- **GiftRule** - reguli automate pentru cadouri
- **GiftProduct** - produse cadou asociate
- **GiftRuleTranslation** - traduceri reguli

#### 💰 Financiar

- **Currency** - valute suportate (RON, EUR, USD, etc.)
- **ExchangeRate** - cursuri de schimb
- **ExchangeRateHistory** - istoric cursuri
- **Transaction** - tranzacții financiare
- **Voucher** - vouchere și reduceri

#### 🚚 Livrare și Plată

- **DeliveryLocation** - locații de livrare
- **DeliverySchedule** - program livrări
- **PaymentMethod** - metode de plată

#### 📄 Conținut și Configurare

- **Page** - pagini dinamice (Despre, Contact)
- **SiteConfig** - configurări site
- **AnnouncementBanner** - banner-e anunțuri
- **Carousel** - carousel produse
- **UIElement** - elemente UI personalizabile

#### 💬 Chat și Comunicare

- **ChatMessage** - mesaje chat în timp real
- **Offer** - oferte speciale

#### 🌐 Traduceri

- **Translation** - traduceri generale
- **ProductTranslation** - traduceri produse
- **CategoryTranslation** - traduceri categorii
- **DeliveryLocationTranslation** - traduceri locații
- **CarouselTranslation** - traduceri carousel
- **PaymentMethodTranslation** - traduceri metode plată

---

## 📦 Conținut Actual în Baza de Date

### 👥 Utilizatori de Test

#### Administrator

- **Email:** admin@example.com
- **Parolă:** admin123
- **Rol:** Administrator complet
- **Acces:** Toate funcționalitățile admin

#### Utilizator Normal

- **Email:** guest@example.com
- **Parolă:** guest123
- **Rol:** Client
- **Acces:** Funcționalități utilizator standard

### 🖼️ Media și Imagini

**Locație:** `backend/public/uploads/`

#### Imagini Produse (25 fișiere)

Toate imaginile sunt urcate pe GitHub în repository-ul backend:

**Animale și Produse Agricole:**

1. `vaca.jpg` - Imagine vacă
2. `vitel.jpg` - Imagine vițel
3. `gaina(2).jpg` - Imagine găină
4. `iedut.jpg` - Imagine ied
5. `prepelita.jpg` - Imagine prepeliță
6. `magari.jpeg` - Imagine măgari
7. `magari2.jpeg` - Imagine măgari (varianta 2)

**Locații:** 8. `locatie.jpg` - Imagine locație fermă

**Imagini Generale:**
9-25. Diverse imagini pentru produse și carousel

**Avatare:**

- Avatar utilizator admin
- Avatar utilizator guest

**Chat:**

- Imagini trimise în chat (2 fișiere)

---

## 🏗️ Cum să Populezi Baza de Date

### Metoda 1: Scripturi de Inițializare

```bash
cd backend

# 1. Inițializare completă sistem
node initialize-system.js

# 2. Inițializare valute
node initialize-currencies.js

# 3. Inițializare pagini (Despre, Contact)
node seed-pages.js

# 4. Inițializare metode livrare și plată
node initialize-delivery-payment.js

# 5. Inițializare configurare site
node initialize-site-config.js

# 6. Inițializare banner anunțuri
node initialize-announcement-banner.js

# 7. Inițializare pagina Despre
node init-about-us.js

# 8. Inițializare pagina Contact
node initialize-contact-page.js
```

### Metoda 2: Seed Prisma

```bash
cd backend
npm run prisma:seed
```

### Metoda 3: Prin Interfața Admin

După autentificare ca admin (admin@example.com):

1. **Adaugă Categorii:**
   - Accesează `/admin`
   - Secțiunea "Categorii"
   - Creează categorii și subcategorii

2. **Adaugă Produse:**
   - Secțiunea "Produse"
   - Completează formular cu:
     - Nume, descriere
     - Preț, stoc
     - Categorie
     - Imagini (upload din `backend/public/uploads/media/`)
     - Variante (opțional)

3. **Configurează Carousel:**
   - Secțiunea "Carousel"
   - Adaugă produse în carousel
   - Setează ordine și vizibilitate

4. **Creează Reguli Cadouri:**
   - Secțiunea "Gift Rules"
   - Definește condiții (valoare minimă, produse specifice)
   - Asociază produse cadou

---

## 🔄 Migrări Prisma

Toate migrările sunt versionate și urcate pe GitHub:

**Locație:** `backend/prisma/migrations/`

**Total migrări:** 45+

**Ultimele migrări importante:**

- `20260216091501_add_email_verification_system` - Sistem verificare email
- `20260216082751_add_gift_rule_translations` - Traduceri reguli cadouri
- `20260215204102_add_carousel_translations` - Traduceri carousel
- `20260213100425_add_gift_products_system` - Sistem produse cadou
- `20260208192046_add_currency_system` - Sistem multi-valută

---

## 📊 Exemple de Date

### Categorii Sugerate

```javascript
const categories = [
  {
    name: 'Animale Vii',
    slug: 'animale-vii',
    description: 'Animale de fermă pentru vânzare',
    subcategories: [
      { name: 'Bovine', slug: 'bovine' },
      { name: 'Păsări', slug: 'pasari' },
      { name: 'Ovine/Caprine', slug: 'ovine-caprine' },
    ],
  },
  {
    name: 'Produse Lactate',
    slug: 'produse-lactate',
    description: 'Lapte, brânzeturi, iaurt',
    subcategories: [
      { name: 'Lapte', slug: 'lapte' },
      { name: 'Brânzeturi', slug: 'branzeturi' },
      { name: 'Iaurt', slug: 'iaurt' },
    ],
  },
  {
    name: 'Carne și Preparate',
    slug: 'carne-preparate',
    description: 'Carne proaspătă și preparate din carne',
  },
  {
    name: 'Ouă',
    slug: 'oua',
    description: 'Ouă proaspete de la diverse păsări',
  },
];
```

### Produse Exemplu

```javascript
const products = [
  {
    name: 'Vacă Jersey',
    description: 'Vacă de rasă Jersey, 3 ani, productivă',
    price: 8500.0,
    stock: 2,
    unit: 'bucată',
    category: 'Bovine',
    images: ['vaca.jpg'],
  },
  {
    name: 'Vițel Holstein',
    description: 'Vițel de rasă Holstein, 6 luni',
    price: 3200.0,
    stock: 5,
    unit: 'bucată',
    category: 'Bovine',
    images: ['vitel.jpg'],
  },
  {
    name: 'Găină Ouătoare',
    description: 'Găină ouătoare, rasă Rhode Island Red',
    price: 45.0,
    stock: 50,
    unit: 'bucată',
    category: 'Păsări',
    images: ['gaina(2).jpg'],
  },
  {
    name: 'Ied',
    description: 'Ied de 3 luni, sănătos',
    price: 280.0,
    stock: 10,
    unit: 'bucată',
    category: 'Ovine/Caprine',
    images: ['iedut.jpg'],
  },
  {
    name: 'Prepeliță',
    description: 'Prepeliță ouătoare',
    price: 15.0,
    stock: 100,
    unit: 'bucată',
    category: 'Păsări',
    images: ['prepelita.jpg'],
  },
  {
    name: 'Măgar',
    description: 'Măgar pentru muncă sau companie',
    price: 1500.0,
    stock: 3,
    unit: 'bucată',
    category: 'Alte Animale',
    images: ['magari.jpeg', 'magari2.jpeg'],
  },
];
```

### Valute Configurate

```javascript
const currencies = [
  { code: 'RON', name: 'Leu Românesc', symbol: 'lei', isBase: true },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'Dolar American', symbol: '$' },
  { code: 'GBP', name: 'Liră Sterlină', symbol: '£' },
  { code: 'CHF', name: 'Franc Elvețian', symbol: 'CHF' },
  // + alte 9 valute
];
```

---

## 🔍 Verificare Date

### Verifică Utilizatori

```bash
cd backend
node check-users-real.js
```

### Verifică Toate Datele

```bash
cd backend
node check-all-data.js
# sau versiunea simplificată
node check-all-data-simple.js
```

### Verifică Pagini

```bash
cd backend
node check-pages.js
```

---

## 🛠️ Scripturi Utile

**Locație:** `backend/*.js`

### Inițializare

- `initialize-system.js` - Inițializare completă
- `initialize-currencies.js` - Setup valute
- `initialize-delivery-payment.js` - Setup livrare/plată
- `initialize-site-config.js` - Configurare site
- `initialize-announcement-banner.js` - Banner anunțuri
- `initialize-contact-page.js` - Pagina Contact
- `init-about-us.js` - Pagina Despre

### Populare Date

- `seed-pages.js` - Pagini dinamice
- `seed-ui-elements.js` - Elemente UI
- `seed-chat-normal-ui-element.js` - UI chat
- `add-products-to-carousel.js` - Produse în carousel
- `enable-carousel-products.js` - Activare produse carousel

### Traduceri

- `generate-all-translations.js` - Toate traducerile
- `generate-carousel-translations.js` - Traduceri carousel
- `generate-category-translations.js` - Traduceri categorii
- `populate-gift-rule-translations.js` - Traduceri reguli cadouri
- `populate-payment-method-translations.js` - Traduceri metode plată
- `populate-schedule-translations.js` - Traduceri program

### Administrare

- `reset-admin-password.js` - Resetare parolă admin
- `reset-guest-password.js` - Resetare parolă guest
- `verify-all-users.js` - Verificare toți utilizatorii
- `delete-pending-user.js` - Ștergere utilizatori pending

### Verificare și Fix

- `check-all-data.js` - Verificare integritate date
- `check-all-data-simple.js` - Verificare simplă
- `check-pages.js` - Verificare pagini
- `check-users-real.js` - Verificare utilizatori
- `fix-all-relations.js` - Reparare relații
- `fix-carousel-media.js` - Reparare media carousel
- `fix-creates.js` - Reparare înregistrări
- `fix-delivery-schedules.js` - Reparare program livrări
- `fix-relations.js` - Reparare relații generale

### Testing

- `test-media-access.js` - Test acces media

---

## ✅ Checklist Date Complete

- [x] Schema Prisma definită (30+ modele)
- [x] Migrări versionate (45+)
- [x] Utilizatori de test (admin + guest)
- [x] Imagini media (25 fișiere)
- [x] Scripturi inițializare (15+)
- [x] Scripturi populare date (10+)
- [x] Scripturi verificare (5+)
- [x] Scripturi fix/repair (5+)
- [x] Sistem multi-valută (14 valute)
- [x] Sistem traduceri (6 limbi)
- [x] Toate fișierele urcate pe GitHub

---

## 📝 Note pentru Profesor

**Toate datele și imaginile sunt incluse în repository-urile GitHub.**

Pentru a vedea aplicația cu date complete:

1. Rulează migrările Prisma
2. Rulează scripturile de inițializare
3. Autentifică-te ca admin
4. Adaugă produse prin interfața admin folosind imaginile din `backend/public/uploads/media/`

**Imaginile sunt deja urcate pe GitHub și vor fi disponibile după clonare!**
