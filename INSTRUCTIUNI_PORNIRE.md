# 🚀 Instrucțiuni Pornire Aplicație E-Commerce

## ✅ Aplicația este LIVE și funcțională!

**Repository GitHub:** https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack

---

## 📋 Cerințe Sistem

- **Node.js** 18 sau mai nou (https://nodejs.org/)
- **Git** (https://git-scm.com/)
- **PostgreSQL** 14+ (opțional - poate folosi Docker)
- **Docker Desktop** (opțional - pentru baza de date)

---

## 🚀 Pornire Rapidă (2 minute)

### Opțiunea 1: Cu Script Automat (Recomandat)

```bash
# 1. Clonează repository-ul
git clone https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack.git
cd ecommerce-fullstack

# 2. Pornește aplicația (Windows)
start-full-app.bat
```

### Opțiunea 2: Manual

```bash
# 1. Clonează repository-ul
git clone https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack.git
cd ecommerce-fullstack

# 2. Pornește Docker (dacă ai Docker Desktop instalat)
docker-compose up -d

# 3. Instalează dependențe Backend
cd backend
npm install

# 4. Configurează baza de date
npx prisma migrate deploy
npx prisma db seed

# 5. Pornește Backend
npm run dev
# Backend va rula pe http://localhost:3001

# 6. În alt terminal - Instalează dependințe Frontend
cd ../frontend
npm install

# 7. Pornește Frontend
npm run dev
# Frontend va rula pe http://localhost:3000
```

---

## 🌐 Accesare Aplicație

După pornire, aplicația va fi disponibilă la:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## 🔑 Credențiale de Test

### Administrator

- **Email:** admin@example.com
- **Parolă:** Admin1234

### Utilizatori Normali

- **Email:** ion.popescu@example.com | **Parolă:** User1234
- **Email:** maria.ionescu@example.com | **Parolă:** User1234
- **Email:** andrei.popa@example.com | **Parolă:** User1234

### Vouchere de Test

- **WELCOME10** - 10% reducere
- **SUMMER50** - 50 RON reducere

---

## 🎯 Ce să Testezi

### Pentru Utilizatori:

1. **Înregistrare/Login** - Creează cont nou sau folosește credențialele de test
2. **Navigare Produse** - Explorează catalogul cu 12 produse în 6 categorii
3. **Căutare și Filtrare** - Caută produse și filtrează după categorie/preț
4. **Coș de Cumpărături** - Adaugă produse cu cantități fixe
5. **Checkout** - Finalizează comandă cu 3 metode de plată
6. **Vouchere** - Aplică WELCOME10 pentru 10% reducere
7. **Review-uri** - Lasă rating și comentarii pentru produse
8. **Profil** - Editează profil și încarcă avatar
9. **Istoric Comenzi** - Vezi comenzile tale cu tracking

### Pentru Administratori:

1. **Dashboard** - Vezi statistici în timp real
2. **Gestionare Produse** - Adaugă/editează produse cu:
   - Cantități fixe (0.5kg, 1kg, 2kg)
   - Unități de măsură (kg, litru, bucată)
   - Produse perisabile cu comandă în avans
3. **Gestionare Comenzi** - Schimbă status și vezi actualizarea automată a stocului
4. **Editor Live Pagini** - Editează About, Contact, Dashboard cu preview instant
5. **Locații de Livrare** - Adaugă puncte cu program și rază de acoperire
6. **Rapoarte Financiare** - Vezi venituri, cheltuieli și inventar
7. **Actualizări în Timp Real** - Modificările apar instant cu WebSocket

---

## 🛠️ Funcționalități Avansate Implementate

### ✅ Sistem Avansat de Produse

- Cantități fixe stabilite de admin (previne erori)
- Unități de măsură flexibile (kg, litru, bucată)
- Comandă în avans pentru produse perisabile
- Gestionare stoc automată cu alerte

### ✅ Editor Live pentru Pagini

- Editare în timp real cu preview instant
- Actualizări WebSocket - modificările apar imediat
- Pagini editabile: About, Contact, Dashboard Welcome

### ✅ Locații de Livrare

- Multiple puncte cu program personalizat
- Cost livrare dinamic și livrare gratuită
- Rază de acoperire și calcul distanță

### ✅ Rapoarte Financiare

- Dashboard cu venituri/cheltuieli
- Inventar cu valori stoc
- Statistici detaliate pe perioade

### ✅ Actualizări în Timp Real

- WebSocket pentru comunicare bidirecțională
- Notificări live pentru comenzi noi
- Actualizare automată stoc la schimbări
- Sincronizare între toate sesiunile admin

---

## 📊 Tehnologii Utilizate

### Backend

- **Fastify 5.6.2** - Framework web rapid
- **Prisma 6.19.0** - ORM pentru PostgreSQL
- **PostgreSQL** - Bază de date relațională
- **Socket.IO** - Comunicare în timp real
- **JWT** - Autentificare securizată
- **Zod** - Validare date
- **TypeScript** - Type safety

### Frontend

- **Next.js 16.0.1** - Framework React
- **React 19.2.0** - Biblioteca UI
- **Tailwind CSS 4** - Styling modern
- **TypeScript** - Type safety
- **WebSocket** - Actualizări live

---

## 🔧 Rezolvare Probleme

### Backend nu pornește

```bash
# Verifică dacă PostgreSQL rulează
docker ps

# Sau pornește Docker
docker-compose up -d

# Verifică logs
cd backend
npm run dev
```

### Frontend nu pornește

```bash
# Șterge cache și reinstalează
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Eroare la baza de date

```bash
# Resetează baza de date
cd backend
npx prisma migrate reset
npx prisma db seed
```

---

## 📞 Contact

**Email:** crys.cristi@yahoo.com  
**Telefon:** 0753615742  
**GitHub:** https://github.com/yfuugvvjvk-glitch/ecommerce-fullstack

---

## 📚 Documentație Completă

Pentru mai multe detalii, consultă:

- **README.md** - Documentație completă proiect
- **LUCRARE_DIPLOMA.md** - Lucrarea de licență
- **POWERPOINT_PREZENTARE.md** - Prezentarea PowerPoint
- **DISCURS_SUSTINERE.md** - Discursul pentru susținere

---

**Versiune:** 2.0 Final  
**Data:** Februarie 2026  
**Status:** ✅ Complet funcțional și testat
