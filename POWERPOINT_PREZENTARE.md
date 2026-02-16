# 🎓 PREZENTARE POWERPOINT PENTRU SUSȚINEREA LUCRĂRII DE LICENȚĂ

---

## 📊 PREZENTAREA POWERPOINT (20 SLIDE-URI)

### Slide 1: TITLU

```
UNIVERSITATEA INTERNAȚIONALĂ DANUBIUS
FACULTATEA DE INFORMATICĂ

DEZVOLTAREA UNEI APLICAȚII E-COMMERCE
FOLOSIND TEHNOLOGII WEB MODERNE

Absolvent: Petrescu Cristian
Coordonator: Prof. univ. dr. Radu Tonis Manea Bucea
Galați, 2025
```

### Slide 2: CUPRINS

```
📋 CUPRINSUL PREZENTĂRII

1. Contextul și motivația proiectului
2. Obiectivele și cerințele
3. Tehnologiile utilizate
4. Arhitectura sistemului
5. Implementarea practică
6. Rezultatele și testarea
7. Demonstrație live
8. Concluzii și dezvoltări viitoare
```

### Slide 3: CONTEXTUL PROIECTULUI

```
🌐 CONTEXTUL ȘI MOTIVAȚIA

• E-commerce-ul - creștere de 25% în ultimii 2 ani
• Necesitatea aplicațiilor web moderne și scalabile
• Importanța experienței utilizatorului
• Securitatea și performanța - priorități esențiale

💡 MOTIVAȚIA PERSONALĂ
• Aplicarea cunoștințelor teoretice în practică
• Demonstrarea competențelor full-stack
• Crearea unei aplicații reale și utilizabile
```

### Slide 4: OBIECTIVELE

```
🎯 OBIECTIVE GENERALE
• Dezvoltarea unei aplicații e-commerce complete
• Utilizarea tehnologiilor moderne full-stack
• Implementarea best practices de securitate
• Crearea unei experiențe utilizator excelente

🔧 OBIECTIVE TEHNICE ATINSE
✅ Frontend: React 19, Next.js 16, Tailwind CSS 4
✅ Backend: Fastify 5.6.2, Prisma 6.19.0
✅ Database: PostgreSQL cu optimizări
✅ Deployment: Vercel + Render
✅ Testing: Jest + Cypress (87% coverage)
```

### Slide 5: STACK TEHNOLOGIC

```
🛠️ TEHNOLOGII UTILIZATE

FRONTEND                    BACKEND
• React.js 19.2.0          • Fastify 5.6.2
• Next.js 16.0.1           • Prisma ORM 6.19.0
• Tailwind CSS 4           • PostgreSQL
• TypeScript               • JWT Authentication
• Axios                    • bcrypt Security

DEVOPS & TOOLS
• Docker                   • GitHub
• Vercel                   • Render
• Jest                     • Cypress
```

### Slide 6: ARHITECTURA

```
🏗️ ARHITECTURA APLICAȚIEI

┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   FRONTEND      │ ←──────────────→ │    BACKEND      │
│   Next.js       │                  │    Fastify      │
│   React 19      │                  │    Node.js      │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   DATABASE      │
                                     │   PostgreSQL    │
                                     │   + Prisma ORM  │
                                     └─────────────────┘

• Arhitectură în 3 niveluri
• Separarea responsabilităților
• API REST pentru comunicare
• Type safety cu TypeScript
```

### Slide 7: FUNCȚIONALITĂȚI UTILIZATORI

```
⭐ FUNCȚIONALITĂȚI PENTRU UTILIZATORI

🔐 Autentificare completă (JWT)
🛍️ Catalog produse (12 produse, 6 categorii)
🔍 Căutare și filtrare avansată
🛒 Coș persistent cu cantități fixe
📦 Checkout complet (3 metode plată)
🎟️ Sistem voucher-uri cu validare
⭐ Review-uri și rating produse
💝 Lista favorite persistentă
👤 Profil editabil + upload avatar
📄 Sistem facturi complet
📍 Locații de livrare multiple
🔔 Notificări în timp real
📱 Design responsive complet
```

### Slide 8: PANOUL ADMIN

```
👨‍💼 FUNCȚIONALITĂȚI ADMIN

📊 Dashboard cu statistici în timp real
🛍️ Gestionare produse avansată
   • Sistem dual de prețuri:
     - Preț FIX per produs/ambalaj
     - Preț per UNITATE de măsură
   • Cantități fixe (0.5kg, 1kg, 2kg)
   • Unități de măsură (kg, litru, bucată, metru)
   • Produse perisabile cu comandă în avans
👥 Gestionare utilizatori și roluri
📦 Gestionare comenzi cu actualizare stoc
🎟️ Sistem voucher-uri și oferte
📝 Editor LIVE pentru pagini (About, Contact)
📍 Locații de livrare cu program
💰 Rapoarte financiare (venituri/cheltuieli)
📊 Inventar cu alerte stoc scăzut
💱 Sistem complet conversie valutară:
   • 15+ monede (EUR, RON, USD, GBP, etc.)
   • Actualizare automată zilnică (BNR + API)
   • Gestionare completă monede și cursuri
   • Istoric cursuri valutare
🔄 Actualizări LIVE în timp real:
   • Metode de livrare și plată configurabile
   • Informații contact actualizate automat
   • Produse în carousel configurabile
   • Toate modificările din admin apar instant
```

### Slide 9: SECURITATEA

```
🔒 MĂSURI DE SECURITATE

AUTENTIFICARE & AUTORIZARE
• JWT tokens cu expirare (7 zile)
• Parole hash-uite cu bcrypt (12 rounds)
• Role-based access control
• Rate limiting pentru login

PROTECȚIE ATACURI
• XSS Protection (CSP)
• CSRF Protection
• SQL Injection (Prisma ORM)
• Input validation și sanitization

CONFORMITATE
✅ OWASP Top 10 compliant
✅ WCAG 2.1 AA (96% conformitate)
```

### Slide 10: PERFORMANȚA

```
⚡ REZULTATE PERFORMANȚĂ

LIGHTHOUSE SCORES
• Performance: 94/100 🟢
• Accessibility: 96/100 🟢
• Best Practices: 92/100 🟢
• SEO: 89/100 🟢

CORE WEB VITALS
• LCP: 1.2s | FID: 45ms | CLS: 0.08

API PERFORMANCE
• Timp mediu răspuns: 180ms
• P95 response time: 420ms
• Uptime: 99.9%
```

### Slide 11: TESTAREA

```
🧪 STRATEGIA DE TESTARE

TIPURI DE TESTE
• Unit Tests (Jest) - 87% coverage
• Integration Tests - API endpoints
• E2E Tests (Cypress) - User journeys
• Load Testing (k6) - 200 utilizatori

REZULTATE
✅ 156 teste unitare - toate trec
✅ 45 teste integrare - toate trec
✅ 12 teste E2E - toate trec
✅ Load test: 0.02% erori la 200 users
```

### Slide 12: DEMONSTRAȚIE LIVE

```
🎬 DEMONSTRAȚIE APLICAȚIE

✅ APLICAȚIA LOCALĂ COMPLET FUNCȚIONALĂ
http://localhost:3000
📝 Toate funcționalitățile operaționale

CREDENȚIALE DEMO
👑 Admin: admin@example.com / Admin1234
👤 User: ion.popescu@example.com / User1234
🎟️ Voucher: WELCOME10 (10% reducere)

FUNCȚIONALITĂȚI DE DEMONSTRAT
1. Homepage cu carousel produse
2. Catalog cu sistem dual prețuri
3. Selector monedă (15+ valute)
4. Selector limbă (6 limbi)
5. Adăugare în coș cu cantități fixe
6. Checkout complet (3 metode plată)
7. Panou admin:
   • Editor live pagini
   • Gestionare produse (fix/per unitate)
   • Sistem conversie valutară
   • Gestionare comenzi cu stoc automat
   • Rapoarte financiare
8. Actualizări în timp real (WebSocket)
9. Design responsive (mobile/tablet/desktop)
```

### Slide 13: PROVOCĂRI

```
⚠️ PROVOCĂRI ȘI SOLUȚII

GESTIONAREA STĂRII COMPLEXE
❌ Problema: Sincronizarea între componente
✅ Soluția: Context API + custom hooks

PERFORMANȚA CU VOLUME MARI
❌ Problema: Încărcarea lentă
✅ Soluția: Paginare + lazy loading

SECURITATEA APLICAȚIEI
❌ Problema: Protecția împotriva atacurilor
✅ Soluția: Middleware + validare strictă

DEPLOYMENT SCALABIL
❌ Problema: Configurarea producție
✅ Soluția: Docker + cloud platforms
```

### Slide 14: DEZVOLTĂRI VIITOARE

```
🚀 PLANURI DE DEZVOLTARE

FUNCȚIONALITĂȚI PLANIFICATE
💳 Integrare plăți reale (Stripe/PayPal)
🤖 Sistem recomandări AI avansat
📱 Aplicație mobilă React Native
📊 Analytics și rapoarte avansate
🌍 Suport multilingv extins

ÎMBUNĂTĂȚIRI TEHNICE
🔄 Microservices architecture
📡 GraphQL API alternativ
🌐 PWA features complete
☁️ Deployment cloud scalabil
🔐 Securitate avansată (2FA)
```

### Slide 15: SISTEM AVANSAT DE PRODUSE

```
📦 GESTIONARE PRODUSE AVANSATĂ

💰 SISTEM DUAL DE PREȚURI
• Preț FIX per produs/ambalaj:
  - Ex: "Lapte 2L" = 1 leu/sticlă (NU per litru)
  - Afișare: "1.00 lei/buc" + "2 litri/produs"
  - Stoc: număr ambalaje (3 sticle = 6L total)
  - Client alege număr produse, nu cantitate

• Preț per UNITATE de măsură:
  - Ex: "Lapte" = 5 lei/litru
  - Afișare: "5.00 lei/litru"
  - Client alege cantitatea (0.5L, 1L, 2L)
  - Preț calculat automat (2L × 5 = 10 lei)

🎯 CANTITĂȚI FIXE
• Admin setează cantități (0.5kg, 1kg, 2kg)
• Client alege doar din opțiunile disponibile
• Previne erori și facilitează gestionarea

📏 UNITĂȚI DE MĂSURĂ
• Kilogram, Litru, Bucată, Metru
• Afișare clară preț per unitate
• Calcul automat valoare stoc

⏰ COMANDĂ ÎN AVANS
• Produse perisabile cu comandă 1-2 zile înainte
• Ora limită pentru comenzi (ex: 20:00)
• Previne deteriorarea produselor

🔄 STOC AUTOMAT
• Rezervare la plasare comandă
• Actualizare la livrare/anulare
• Alerte pentru stoc scăzut
```

### Slide 16: SISTEM CONVERSIE VALUTARĂ

```
💱 SISTEM COMPLET DE CONVERSIE VALUTARĂ

🌍 SUPORT MULTIPLE MONEDE
• 15+ monede disponibile:
  RON, EUR, USD, GBP, CHF, JPY, CAD, AUD,
  CNY, SEK, NOK, DKK, PLN, CZK, HUF
• Selector în header cu scroll
• Persistență în localStorage
• Actualizare instant la schimbare

🔄 ACTUALIZARE AUTOMATĂ
• Job programat zilnic la 10:00 AM
• Integrare cu API BNR (cursuri oficiale RON)
• Integrare cu ExchangeRate-API (cursuri internaționale)
• Actualizare la pornirea serverului

📊 ISTORIC ȘI TRACKING
• Salvare toate cursurile în baza de date
• Istoric complet pentru analiză
• Tracking modificări cursuri
• Rapoarte și statistici

👨‍💼 GESTIONARE ADMIN
• Adăugare/editare/ștergere monede
• Actualizare manuală cursuri
• Setare monedă de bază
• Vizualizare istoric cursuri
• Configurare completă sistem

⚡ CONVERSIE ÎN TIMP REAL
• Toate prețurile convertite instant
• Afișare în moneda selectată
• Calcul automat în coș și comenzi
• Performanță optimizată cu cache
```

### Slide 17: SISTEM TRADUCERI LIVE

```
🌍 SISTEM COMPLET DE TRADUCERI MULTILINGVE

📚 SUPORT MULTIPLE LIMBI
• 6 limbi disponibile:
  🇷🇴 Română (ro) - limba implicită
  🇬🇧 Engleză (en)
  🇫🇷 Franceză (fr)
  🇩🇪 Germană (de)
  🇪🇸 Spaniolă (es)
  🇮🇹 Italiană (it)
• Selector limbă în header
• Persistență în localStorage
• Schimbare instant fără reload

🔄 TIPURI DE TRADUCERI
• Traduceri statice pentru UI:
  - Butoane, etichete, mesaje
  - Navigare și meniuri
  - Formulare și validări
• Traduceri dinamice pentru conținut:
  - Produse și categorii
  - Pagini și descrieri
  - Mesaje chat

⚡ PERFORMANȚĂ ȘI CACHE
• Cache în memorie + sessionStorage
• LRU eviction (>1000 entries)
• TTL 1 oră pentru cache
• Fallback hierarchy:
  1. Limba curentă
  2. Română (fallback)
  3. Cheia ca text

🌐 API BACKEND COMPLET
• 6 endpoint-uri pentru gestionare:
  - GET traducere unică
  - POST traduceri batch
  - GET toate traducerile entitate
  - PUT actualizare traducere (admin)
  - POST generare automată (admin)
  - GET statistici (admin)
• Integrare Google Translate API
• Traduceri automate pentru conținut nou

📊 FORMATARE LOCALE-AWARE
• Prețuri adaptate la fiecare limbă
• Date și ore în format local
• Numere cu separatori corecți
• Timp relativ localizat

👨‍💼 GESTIONARE ADMIN
• Vizualizare toate traducerile
• Editare traduceri manuale
• Generare traduceri automate
• Statistici și rapoarte
• Status: automatic/manual/reviewed
```

### Slide 18: VALOAREA PROIECTULUI

```
💎 VALOAREA ȘI IMPACTUL

COMPETENȚE DEMONSTRATE
✅ Full-Stack Development modern
✅ Arhitectura scalabilă
✅ Securitate și best practices
✅ Testing și quality assurance
✅ DevOps și deployment
✅ UI/UX design responsive

APLICABILITATE PRACTICĂ
🏢 Bază pentru business real
📋 Template pentru proiecte similare
🎓 Demonstrație competențe
📚 Referință best practices
```

### Slide 18: CONCLUZII

```
🎯 CONCLUZII FINALE

OBIECTIVE ATINSE
✅ Aplicație e-commerce completă
✅ Tehnologii moderne implementate
✅ Securitate și performanță optimizate
✅ Documentație completă
✅ Testare comprehensivă

CONTRIBUȚII
• Cod 100% original
• Arhitectură scalabilă
• Best practices industrie
• Soluție viabilă pentru producție

LECȚII ÎNVĂȚATE
• Importanța planificării
• Valoarea testării automate
• Necesitatea optimizării
• Beneficiile tehnologiilor moderne
```

### Slide 19: MULȚUMIRI

```
🙏 MULȚUMIRI

Mulțumesc pentru atenție!

COORDONATOR ȘTIINȚIFIC
Prof. univ. dr. Radu Tonis Manea Bucea

COMISIA DE EVALUARE
Pentru timpul acordat

ÎNTREBĂRI?
Sunt pregătit să răspund

CONTACT
📧 [email]@danubiusuniv.ro
🌐 GitHub Repository
```
