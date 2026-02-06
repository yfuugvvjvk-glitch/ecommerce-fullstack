# 🎨 Ghid Complet: Editare Imagini Carousel (Flux)

## ❓ Ce sunt imaginile din "flux" (carousel)?

Imaginile care apar în **carousel-ul de pe pagina principală** (Dashboard) sunt generate automat din **produsele care au reduceri** (au `oldPrice` mai mare decât `price`).

## 🎯 Cum funcționează sistemul?

### Sistem Automat

Aplicația ia **primele 3 produse cu reduceri** și le afișează în carousel:

- Imaginea produsului devine imaginea din carousel
- Titlul devine "Ofertă: [Nume Produs]"
- Procentul de reducere se calculează automat
- **Click pe imagine → duce direct la pagina produsului**

## 📝 Cum ADAUGI sau MODIFICI imaginile din carousel?

### Metoda 1: Prin Produse cu Reduceri (RECOMANDAT)

#### Pas 1: Accesează Admin

1. Loghează-te cu: `admin@example.com` / `Admin1234`
2. Mergi la **Admin** → Tab **📦 Produse**

#### Pas 2: Editează un Produs

1. Click pe **⚙️ Configurează** la produsul dorit
2. În modal, vei vedea secțiunea **📝 Informații de Bază**
3. Completează/Modifică:
   - **Preț per unitate** (ex: 50 RON)
   - **Preț original (pentru oferte)** (ex: 100 RON) ← IMPORTANT!
   - **URL Imagine** (ex: `/images/products/laptop.jpg`)

#### Pas 3: Salvează

- Click **💾 Actualizează Produs**
- Produsul va apărea AUTOMAT în carousel dacă are reducere

### Exemplu Practic

Pentru a avea 3 imagini în carousel:

**Produs 1: Laptop Gaming**

- Preț: 2500 RON
- Preț original: 3500 RON (reducere 29%)
- Imagine: `/images/products/laptop-gaming.jpg`

**Produs 2: Telefon Samsung**

- Preț: 1800 RON
- Preț original: 2500 RON (reducere 28%)
- Imagine: `/images/products/samsung-phone.jpg`

**Produs 3: Căști Wireless**

- Preț: 150 RON
- Preț original: 300 RON (reducere 50%)
- Imagine: `/images/products/headphones.jpg`

## 🗑️ Cum ELIMINI o imagine din carousel?

### Opțiunea 1: Elimină reducerea

1. Editează produsul
2. Șterge valoarea din **Preț original (pentru oferte)**
3. Salvează → Produsul dispare din carousel

### Opțiunea 2: Dezactivează produsul

1. Editează produsul
2. Debifează **Produs activ**
3. Salvează → Produsul nu mai apare nicăieri

## 🔄 Ordinea imaginilor în carousel

Imaginile apar în ordinea produselor cu cele mai mari reduceri:

- Primul produs cu reducere → Prima imagine
- Al doilea produs cu reducere → A doua imagine
- Al treilea produs cu reducere → A treia imagine

## 📍 Unde sunt stocate imaginile?

Imaginile pot fi:

1. **URL-uri externe**: `https://example.com/image.jpg`
2. **Imagini locale**: `/images/products/produs.jpg`
3. **Imagini urcate**: `/uploads/products/produs-123456.jpg`

## 💡 IMPORTANT: Metode de Plată

Când editezi un produs, vei vedea și secțiunea **💳 Metode de Plată Acceptate**:

- ✅ Card Bancar
- ✅ Numerar la Livrare
- ✅ Transfer Bancar
- ✅ PayPal

Bifează metodele pe care le accepți pentru acel produs.

## 🎁 Metoda 2: Prin Oferte (AVANSAT)

Dacă vrei control mai mare, poți crea oferte în **Admin → 🎁 Oferte**:

1. Click **➕ Adaugă Ofertă Nouă**
2. Completează:
   - Titlu (ex: "Black Friday")
   - Descriere
   - Discount (%)
   - **Imagine** (aceasta va apărea în carousel)
   - Selectează produsele din ofertă
3. Salvează

**NOTĂ**: Ofertele au prioritate față de produsele cu reduceri simple.

## 📊 Rezumat Rapid

| Acțiune              | Unde                           | Cum                               |
| -------------------- | ------------------------------ | --------------------------------- |
| **Adaugă imagine**   | Admin → Produse                | Setează Preț Original > Preț      |
| **Modifică imagine** | Admin → Produse → Configurează | Schimbă URL Imagine               |
| **Elimină imagine**  | Admin → Produse → Configurează | Șterge Preț Original              |
| **Schimbă ordine**   | Admin → Produse                | Modifică procentul de reducere    |
| **Click pe imagine** | -                              | Duce automat la pagina produsului |

## 🔗 Link-uri Utile

- **Pagina Admin**: http://localhost:3000/admin
- **Dashboard (unde apare carousel)**: http://localhost:3000/dashboard
- **Produse**: http://localhost:3000/shop

---

**TL;DR**: Imaginile din carousel = Produse cu reduceri. Pentru a le modifica, editează produsele și setează "Preț original" mai mare decât "Preț". Click pe imagine duce direct la produs.
