# Changelog

Toate schimbările notabile ale proiectului vor fi documentate în acest fișier.

## [2.0.0] - 2025-02-08

### ✨ Funcționalități Majore Adăugate

#### 💱 Sistem Complet de Conversie Valutară

- **Suport pentru 15+ monede**: RON, EUR, USD, GBP, CHF, JPY, CAD, AUD, CNY, SEK, NOK, DKK, PLN, CZK, HUF
- **Actualizare automată zilnică** a cursurilor la ora 10:00 AM
- **Integrare cu API-uri externe**:
  - Banca Națională a României (BNR) pentru cursuri oficiale RON
  - ExchangeRate-API pentru cursuri internaționale
- **Conversie în timp real** pentru toate prețurile din aplicație
- **Istoric complet** al cursurilor valutare pentru tracking
- **Panou admin complet** pentru gestionare monede:
  - Adăugare/editare/ștergere monede
  - Actualizare manuală cursuri
  - Setare monedă de bază
  - Vizualizare istoric cursuri

**Componente Frontend:**

- `CurrencySelector.tsx` - Dropdown în header cu scroll pentru selecție monedă
- `CurrencyPrice.tsx` - Component pentru conversie automată prețuri
- `admin/currencies/page.tsx` - Pagină admin pentru gestionare monede

**Backend:**

- `currency.service.ts` - Serviciu complet CRUD pentru monede
- `currency.routes.ts` - 12 endpoint-uri (6 publice + 6 admin)
- `currency-update.job.ts` - Job programat pentru actualizare automată

**Modele Prisma:**

- `Currency` - Informații despre monede
- `ExchangeRate` - Cursuri de schimb curente
- `ExchangeRateHistory` - Istoric cursuri

#### 💰 Sistem Dual de Prețuri (Fixed vs Per Unit)

- **Două tipuri de prețuri pentru produse**:
  1. **Preț FIX (`priceType: "fixed"`)**: Preț per produs/ambalaj
     - Exemplu: "Lapte 2L" = 1 leu/sticlă (NU per litru)
     - Afișare: "1.00 lei/buc" + "2 litri/produs"
     - Stoc: număr de ambalaje (3 sticle = 6 litri total)
     - Client alege număr de produse, nu cantitate în litri
  2. **Preț per UNITATE (`priceType: "per_unit"`)**: Preț per unitate de măsură
     - Exemplu: "Lapte" = 5 lei/litru
     - Afișare: "5.00 lei/litru"
     - Client alege cantitatea (0.5L, 1L, 2L)
     - Preț calculat automat (2L × 5.00 = 10.00 lei)

**Implementare:**

- Câmp `priceType` adăugat în schema Prisma
- Logică de afișare implementată în toate componentele:
  - `ProductGrid.tsx`
  - `ShoppingCart.tsx`
  - `products/[id]/page.tsx`
  - `dashboard/page.tsx`
  - `favorites/page.tsx`
- UI îmbunătățit cu butoane mari pentru selecție tip preț în admin
- Explicații clare pentru fiecare opțiune

### 🔧 Îmbunătățiri Tehnice

- **Migrație Prisma**: `20260208192046_add_currency_system`
- **Migrație Prisma**: `20260208203201_add_price_type_field`
- **API URLs corectate**: Adăugat prefix `/api` la toate endpoint-urile currency
- **Prisma regenerat**: Client actualizat cu noile modele
- **Backend restartat**: Process 11 cu toate funcționalitățile noi

### 📝 Documentație Actualizată

- `README.md` - Adăugate secțiuni pentru sistem valutar și prețuri duale
- `CHANGELOG.md` - Creat cu versiunea 2.0.0
- `LUCRARE_DIPLOMA.md` - În curs de actualizare
- `DISCURS_SUSTINERE.md` - În curs de actualizare
- `POWERPOINT_PREZENTARE.md` - În curs de actualizare
- `TRIMITERE_PROFESOR.txt` - În curs de actualizare

### 🐛 Bug Fixes

- Rezolvată eroarea 400 la adăugare produse (câmpuri inexistente `orderCutoffTime`, `paymentMethods`)
- Câmpul `image` făcut opțional cu placeholder default
- Câmpul `priceType` inclus în toate request-urile de produse
- RON făcut vizibil în dropdown currency (adăugat scroll)

### 🗃️ Commits

- **Backend**: "Complete currency system and fixed pricing implementation - Backend updates with Prisma regeneration" (147 files)
- **Frontend**: "Apply fixed vs per-unit pricing display logic across all components" (12 files)
- **Root**: "Complete implementation: Currency system + Fixed vs Per-Unit pricing" (3 files)

---

## [1.0.0] - 2025-01-05

### ✨ Release Inițial

- Aplicație e-commerce completă cu React 19 și Next.js 16
- Backend Fastify cu Prisma și PostgreSQL
- Autentificare JWT
- Sistem complet de produse, comenzi, coș
- Panou admin funcțional
- Design responsive cu Tailwind CSS 4
- Testare automată (Jest + Cypress)
- Deployment cu Docker

---

**Legendă:**

- ✨ Funcționalități noi
- 🔧 Îmbunătățiri tehnice
- 🐛 Bug fixes
- 📝 Documentație
- 🗃️ Commits
