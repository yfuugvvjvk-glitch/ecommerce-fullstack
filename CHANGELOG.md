Si# Changelog

Toate modificările importante ale proiectului vor fi documentate în acest fișier.

## [Unreleased]

### Added - 2026-02-13

#### Sincronizare Locații de Livrare cu Metode de Livrare

- **Relație între DeliveryLocation și DeliverySettings**
  - Fiecare locație de livrare poate fi asociată cu o metodă de livrare
  - Câmp nou `deliveryMethodId` în `DeliveryLocation`
  - Relație bidirectională: `DeliverySettings.locations` și `DeliveryLocation.deliveryMethod`
- **Sincronizare automată**:
  - Când modifici `isActive` în DeliverySettings, toate locațiile asociate se actualizează automat
  - Când modifici `deliveryCost`, se actualizează `deliveryFee` în toate locațiile
  - Când modifici `freeDeliveryThreshold`, se actualizează în toate locațiile
- **Migrare bază de date**: `20260212222724_add_delivery_method_to_location`
- **API îmbunătățit**:
  - GET `/api/admin/delivery-locations` include acum `deliveryMethod`
  - GET `/api/admin/delivery-locations/:id` include `deliveryMethod`
  - GET `/api/admin/delivery-locations/active` include `deliveryMethod`

#### Sistem Reguli Multiple de Blocare Comenzi (Multiple Block Rules System)

- **Reguli multiple de blocare** - înlocuiește setarea globală unică cu sistem de reguli multiple
  - Creare, editare, ștergere reguli independente
  - Fiecare regulă poate fi activată/dezactivată individual
  - Nume descriptiv pentru fiecare regulă (ex: "Blocare Weekend", "Restricții Plată Cash")
- **Funcționalități per regulă**:
  - Blocare completă comenzi noi cu motiv și dată limită opțională
  - Blocare metode de plată specifice (cash, card, transfer, crypto)
  - Blocare metode de livrare specifice
  - Restricții valoare comandă (minimă și maximă)
- **Interfață admin îmbunătățită**:
  - Listă de reguli cu carduri vizuale colorate
  - Modal pentru creare/editare cu toate opțiunile
  - Afișare vizuală a restricțiilor active per regulă
  - Confirmare înainte de ștergere
- **Backend API**:
  - `GET /api/admin/block-rules` - obține toate regulile
  - `POST /api/admin/block-rules` - creează regulă nouă
  - `PUT /api/admin/block-rules/:ruleId` - actualizează regulă
  - `DELETE /api/admin/block-rules/:ruleId` - șterge regulă
  - Stocare în `SiteConfig` cu key `block_rules` ca JSON array
- **Documente create**:
  - `backend/check-block-rules.js` - script verificare reguli în DB
  - `backend/check-all-configs.js` - script verificare toate configurările
  - `backend/check-payment-delivery-methods.js` - script verificare metode plată/livrare
  - `backend/test-block-rules-api.js` - script testare completă API

### Fixed - 2026-02-13

#### Block Rules Checkbox Selection and Display

- **Corectat** problema de selecție automată a checkbox-urilor
  - Folosește câmpul `id` unic în loc de `type` pentru metode de plată și livrare
  - Rezolvă problema când "Livrare la domiciliu" și "Livrare Standard" se selectau ambele (aveau același type: 'courier')
  - Checkbox-urile se selectează/deselectează individual corect
  - Regulile se salvează corect în baza de date
- **Adăugat** funcții helper pentru afișarea numelor metodelor în loc de ID-uri
  - `getPaymentMethodNames()` - convertește ID-uri în nume pentru metode de plată
  - `getDeliveryMethodNames()` - convertește ID-uri în nume pentru metode de livrare
- **Verificat** că câmpul `blockUntil` (perioada de blocare) se afișează corect în lista de reguli
- **Adăugat** date mock pentru metode de plată și livrare în caz de eroare API

### Added - 2026-02-12

#### Sistem Produse Cadou (Gift Products System)

- **Specificație completă** pentru sistem de produse cadou cu condiții complexe
  - Creare reguli de cadou cu condiții AND/OR
  - Suport pentru condiții: sumă minimă, produse specifice, categorii, combinații
  - Validare dinamică în timp real
  - Gestionare stoc real pentru produse cadou
  - Multiple cadouri per comandă când sunt îndeplinite multiple reguli
- **Documente create**:
  - `.kiro/specs/gift-products-system/requirements.md` - 27 criterii de acceptare
  - `.kiro/specs/gift-products-system/design.md` - Design tehnic complet cu 31 proprietăți de corectitudine
  - `.kiro/specs/gift-products-system/tasks.md` - Plan de implementare cu 20 task-uri principale

#### Banner Anunțuri Importante (Announcement Banner)

- **Specificație completă** pentru banner personalizabil deasupra caruselului
  - Editare completă din panoul admin (titlu, descriere, stiluri)
  - Personalizare separată pentru titlu și descriere (culori, fonturi, mărimi, aliniere)
  - Preview live în timp real
  - Afișare condiționată (doar când are conținut)
  - Persistență în baza de date
- **Documente create**:
  - `.kiro/specs/announcement-banner/requirements.md` - 27 criterii de acceptare
  - `.kiro/specs/announcement-banner/design.md` - Design tehnic complet cu 8 proprietăți de corectitudine
  - `.kiro/specs/announcement-banner/tasks.md` - Plan de implementare cu 12 task-uri principale

#### Îmbunătățiri Carousel

- **Poziții infinite** pentru items în carousel (eliminată limita de 10)
- **Auto-assign poziții** - produsele se adaugă automat pe următoarea poziție disponibilă
- **Text styling individual** pentru fiecare item din carousel
  - Stiluri separate pentru titlu, descriere și link
  - Overlay background configurat separat
  - Poziționare text la bottom-center cu word-wrap
- **Filtre pentru management**:
  - Filtrare după tip (Toate, Produse, Media, Custom)
  - Filtrare după status (Toate, Active, Inactive)
  - Căutare în titlu și descriere

#### Adrese Detaliate Utilizatori

- **Câmpuri noi** în profilul utilizatorului și formular de înregistrare:
  - Oraș (city)
  - Județ (county)
  - Stradă (street)
  - Număr stradă (streetNumber)
  - Detalii adresă (addressDetails) - bloc, apartament, casă, etc.
- **Validare** pe frontend și backend pentru toate câmpurile noi
- **Migrare bază de date**: `20260212202719_add_detailed_address_fields`

#### Sistem Blocare Comenzi Extins

- **Blocare avansată** cu multiple opțiuni:
  - Blocare permanentă/temporară
  - Blocare pe metode de plată specifice
  - Blocare pe metode de livrare specifice
  - Validare sumă minimă/maximă comandă
  - Blocare programată (zi, oră, săptămână)
- **Persistență** completă în PostgreSQL prin SiteConfig
- **Validare backend** la crearea comenzii

#### Programare Livrări

- **CRUD complet** pentru programe de livrare:
  - Creare, editare, ștergere programe
  - Zile de livrare configurabile
  - Intervale orare cu limite de comenzi
  - Date speciale (sărbători, excepții)
- **Persistență** în baza de date (nu mai sunt doar în memorie)
- **Validare** comenzi pe baza programelor active

### Fixed - 2026-02-12

#### Backend TypeScript Errors

- **Corectat** apelurile `siteConfigService.setConfig()` în `admin.routes.ts`
  - Parametrul `description` trebuie trecut în obiectul `options`, nu ca string direct
  - Toate cele 6 apeluri au fost corectate
  - Backend se compilează fără erori TypeScript

#### Carousel Text Display

- **Corectat** afișarea textului în carousel:
  - Text poziționat la bottom-center (nu mai este centrat)
  - Word-wrap global pentru tot site-ul (nu mai sunt cuvinte tăiate)
  - Overlay apare doar dacă există titlu sau descriere (nu pentru spații goale)

#### Delivery Schedule Updates

- **Corectat** funcționalitatea de actualizare programe livrare
  - Adăugat endpoint `PUT /api/admin/delivery-schedules/:scheduleId`
  - Modificările se salvează și persistă în baza de date
  - Mesaje diferite pentru CREATE vs UPDATE

### Changed - 2026-02-12

#### Carousel Management

- **Eliminat** statistica "Poziții Libere" (nu mai este relevantă cu poziții infinite)
- **Schimbat** heading de la "Items în Carousel (Poziții 1-10)" la "Items în Carousel"
- **Îmbunătățit** afișarea titlului - folosește `displayTitle` în loc de `originalName`

#### Global Styling

- **Adăugat** reguli CSS globale pentru word-wrap în `frontend/app/globals.css`
  - Aplicate pe toate elementele text (p, h1-h6, span, div, a, li, td, th, input, textarea)
  - `word-wrap: break-word`, `overflow-wrap: break-word`, `hyphens: auto`

### Database Migrations

#### 20260212202719_add_detailed_address_fields

- Adăugat câmpuri noi în tabelul `User`:
  - `city` (String, optional)
  - `county` (String, optional)
  - `street` (String, optional)
  - `streetNumber` (String, optional)
  - `addressDetails` (Text, optional)

#### 20260212203401_remove_position_unique_constraint

- Eliminat constraint `@unique` de pe câmpul `position` din `CarouselItem`
- Permite poziții duplicate (multiple items pe aceeași poziție)

#### 20260212201958_add_carousel_text_styling

- Adăugat câmpuri noi în `CarouselItem`:
  - `textStyle` (Json, optional) - stiluri pentru text overlay
  - `customTitle` (String, optional) - titlu personalizat pentru carousel
  - `customDescription` (Text, optional) - descriere personalizată
  - `linkUrl` (String, optional) - URL pentru link

## [Previous Changes]

### 2026-02-11 și anterior

- Implementare inițială sistem de comerț electronic
- Autentificare și autorizare utilizatori
- Gestionare produse și categorii
- Sistem de coș și comenzi
- Integrare plăți
- Panoul de administrare
- Sistem de chat în timp real
- Gestionare facturi
- Sistem de vouchere
- Gestionare valute
- Carousel produse pe homepage
- Sistem de review-uri
- Gestionare stoc
- Rapoarte financiare

---

## Format

Acest changelog urmează formatul [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
și proiectul respectă [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Tipuri de modificări:

- `Added` - funcționalități noi
- `Changed` - modificări la funcționalități existente
- `Deprecated` - funcționalități care vor fi eliminate
- `Removed` - funcționalități eliminate
- `Fixed` - bug fixes
- `Security` - vulnerabilități de securitate
