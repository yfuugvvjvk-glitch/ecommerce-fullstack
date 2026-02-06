# 🎨 Ghid: Editare Imagini din Flux (Carousel)

## Ce sunt imaginile din "flux"?

Imaginile din **flux** (carousel) care apar pe pagina principală (Dashboard) sunt de fapt **OFERTELE** create în panoul de administrare.

## 📍 Unde se editează?

### Pas 1: Accesează Panoul Admin

1. Loghează-te cu contul de admin: `admin@example.com` / `Admin1234`
2. Mergi la pagina **Admin** din meniul principal

### Pas 2: Selectează Tab-ul Oferte

1. În panoul admin, găsești mai multe tab-uri: **Produse**, **Oferte**, **Vouchere**, **Comenzi**
2. Click pe tab-ul **🎁 Oferte**

### Pas 3: Editează Imaginile

1. Vei vedea lista tuturor ofertelor existente
2. Pentru fiecare ofertă există un buton **📷 Încarcă Imagine**
3. Click pe buton și introdu URL-ul imaginii noi
4. Salvează modificările

## 🔄 Cum funcționează?

- Ofertele active (cu `isActive: true`) apar automat în carousel-ul de pe Dashboard
- Când un utilizator dă click pe o imagine din carousel, este redirecționat către pagina cu produsele din acea ofertă
- Poți adăuga, edita sau șterge oferte din panoul admin

## 📦 Oferte Actuale în Baza de Date

După rularea scriptului de populare, ai următoarele oferte:

1. **Black Friday - Electronice**
   - Discount: 30%
   - Produse: Laptop, Căști
   - Imagine: `/images/offers/black-friday-electronics.jpg`

2. **Ofertă Fashion**
   - Discount: 25%
   - Produse: Cămașă, Rochie
   - Imagine: `/images/offers/fashion-spring.jpg`

3. **Sport & Fitness**
   - Discount: 20%
   - Produse: Bancă fitness, Gantere
   - Imagine: `/images/offers/sport-fitness.jpg`

## ➕ Cum adaugi o ofertă nouă?

1. Mergi la **Admin** → **🎁 Oferte**
2. Click pe **➕ Adaugă Ofertă Nouă**
3. Completează:
   - Titlu (ex: "Reduceri de Vară")
   - Descriere (ex: "Până la 40% discount la toate produsele!")
   - Discount (ex: 40)
   - URL Imagine (ex: `/images/offers/summer-sale.jpg`)
   - Data început și sfârșit
4. Selectează produsele care fac parte din ofertă
5. Salvează

## 🎯 Notă Importantă

**Imaginile din carousel NU sunt imagini separate** - ele sunt imaginile ofertelor tale. Dacă vrei să schimbi ce apare în carousel, trebuie să:

- Editezi ofertele existente (schimbi imaginea)
- SAU creezi oferte noi
- SAU dezactivezi ofertele vechi (setează `isActive: false`)

## 🔗 Click pe Imagine

Când un utilizator dă click pe o imagine din carousel:

1. Este redirecționat către `/offers?offerId=<id-ul-ofertei>`
2. Pagina afișează toate produsele din acea ofertă
3. Utilizatorul poate vedea detaliile și adăuga produse în coș

---

**Rezumat:** Imaginile din flux = Imaginile ofertelor. Editează-le în **Admin → Oferte → 📷 Încarcă Imagine**
