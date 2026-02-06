# 🎨 Ghid VIZUAL: Cum Modifici Imaginile din Carousel (Flux)

## 🎯 CE ESTE CAROUSEL-UL?

Carousel-ul este **banda cu imagini mari** care apare pe pagina principală (Dashboard) și se schimbă automat la câteva secunde.

```
┌─────────────────────────────────────────────────┐
│  [← Imagine Mare cu Produs →]                   │
│                                                 │
│  "Ofertă: Laptop Gaming"                       │
│  "Reducere 30%"                                │
│  ● ● ○  (indicatori)                           │
└─────────────────────────────────────────────────┘
```

## ❓ DE UNDE VIN IMAGINILE?

**IMPORTANT**: Imaginile din carousel NU sunt imagini separate!

Ele sunt **AUTOMAT generate** din **produsele care au REDUCERI** (oldPrice > price).

## 📝 PAS CU PAS: Cum Adaugi/Modifici Imagini în Carousel

### PASUL 1: Loghează-te ca Admin

```
Email: admin@example.com
Parolă: Admin1234
```

### PASUL 2: Mergi la Produse

```
Click pe meniu → Admin → Tab "📦 Produse"
```

### PASUL 3: Alege un Produs

```
Găsește produsul pe care vrei să-l afișezi în carousel
Click pe butonul "⚙️ Configurează"
```

### PASUL 4: Setează Reducerea (IMPORTANT!)

```
În modalul care se deschide, găsește secțiunea:
"📝 Informații de Bază"

Completează:
┌─────────────────────────────────────────┐
│ Preț per unitate (RON)                  │
│ [  50.00  ] ← Prețul ACTUAL             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Preț original (pentru oferte)           │
│ [ 100.00  ] ← Prețul VECHI (mai mare!)  │
└─────────────────────────────────────────┘

⚠️ IMPORTANT: Prețul original TREBUIE să fie mai mare decât prețul actual!
```

### PASUL 5: Setează Imaginea

```
┌─────────────────────────────────────────┐
│ URL Imagine                              │
│ [ /images/laptop.jpg ]                   │
└─────────────────────────────────────────┘

Poți folosi:
✅ /images/products/produs.jpg (imagini locale)
✅ https://example.com/image.jpg (URL extern)
✅ /uploads/products/produs-123.jpg (imagini urcate)
```

### PASUL 6: Salvează

```
Click pe butonul "💾 Actualizează Produs"
```

### PASUL 7: Verifică

```
Mergi la Dashboard (pagina principală)
→ Produsul tău apare AUTOMAT în carousel! 🎉
```

## 🔢 CÂTE IMAGINI APAR ÎN CAROUSEL?

Carousel-ul afișează **primele 3 produse** cu cele mai mari reduceri.

**Exemplu**:

```
Produs 1: Laptop - Reducere 50% (100 RON → 50 RON)  ← Apare PRIMUL
Produs 2: Telefon - Reducere 40% (200 RON → 120 RON) ← Apare AL DOILEA
Produs 3: Căști - Reducere 30% (150 RON → 105 RON)   ← Apare AL TREILEA
Produs 4: Mouse - Reducere 20% (50 RON → 40 RON)     ← NU apare (doar 3)
```

## 🗑️ Cum ELIMINI o Imagine din Carousel?

### Opțiunea 1: Elimină Reducerea

```
1. Admin → Produse → Configurează produs
2. ȘTERGE valoarea din "Preț original (pentru oferte)"
3. Salvează
→ Produsul dispare din carousel
```

### Opțiunea 2: Dezactivează Produsul

```
1. Admin → Produse → Configurează produs
2. DEBIFEAZĂ "Produs activ"
3. Salvează
→ Produsul dispare complet (și din carousel)
```

## 🔄 Cum SCHIMBI ORDINEA Imaginilor?

Ordinea este AUTOMATĂ bazată pe procentul de reducere:

```
Reducere mai mare = Apare mai devreme în carousel
```

**Exemplu**:

```
Vrei ca Telefonul să apară PRIMUL în loc de Laptop?

Laptop: 100 RON → 50 RON (50% reducere)
Telefon: 200 RON → 120 RON (40% reducere)

Soluție:
Modifică prețul Telefonului:
200 RON → 100 RON (50% reducere) sau mai mult
→ Acum Telefonul apare PRIMUL!
```

## 📊 EXEMPLU COMPLET

### Vrei 3 Imagini în Carousel:

#### Imagine 1: Laptop Gaming

```
Admin → Produse → Configurează "Laptop Gaming"

Preț: 2500 RON
Preț original: 3500 RON (reducere 29%)
Imagine: /images/laptop-gaming.jpg

Salvează → Apare în carousel!
```

#### Imagine 2: Telefon Samsung

```
Admin → Produse → Configurează "Telefon Samsung"

Preț: 1800 RON
Preț original: 2500 RON (reducere 28%)
Imagine: /images/samsung-phone.jpg

Salvează → Apare în carousel!
```

#### Imagine 3: Căști Wireless

```
Admin → Produse → Configurează "Căști Wireless"

Preț: 150 RON
Preț original: 300 RON (reducere 50%)
Imagine: /images/headphones.jpg

Salvează → Apare în carousel!
```

**Rezultat**: Căștile apar PRIMELE (50% reducere), apoi Laptopul (29%), apoi Telefonul (28%)

## ❓ ÎNTREBĂRI FRECVENTE

### Q: De ce nu apare produsul meu în carousel?

**A**: Verifică:

- ✅ Are "Preț original" setat?
- ✅ Prețul original e mai mare decât prețul actual?
- ✅ Produsul e activ?
- ✅ Are imagine setată?
- ✅ Are reducere mai mare decât alte 3 produse?

### Q: Pot avea mai mult de 3 imagini?

**A**: Nu, carousel-ul afișează doar primele 3 produse cu reduceri. Dacă vrei mai multe, trebuie să modifici codul.

### Q: Cum schimb viteza de derulare?

**A**: Asta necesită modificare în cod (componenta Carousel.tsx).

### Q: Click pe imagine duce unde?

**A**: Duce DIRECT la pagina produsului respectiv.

## 🎯 REZUMAT RAPID

| Vrei să...           | Faci asta...                                 |
| -------------------- | -------------------------------------------- |
| **Adaugi imagine**   | Setează Preț Original > Preț la produs       |
| **Modifici imagine** | Schimbă URL Imagine la produs                |
| **Elimini imagine**  | Șterge Preț Original sau dezactivează produs |
| **Schimbi ordine**   | Modifică procentul de reducere               |
| **Verifici**         | Mergi la Dashboard și vezi carousel-ul       |

## 📍 Link-uri Rapide

- **Admin Produse**: http://localhost:3000/admin (Tab "📦 Produse")
- **Dashboard (vezi carousel)**: http://localhost:3000/dashboard
- **Toate Produsele**: http://localhost:3000/shop

---

**TL;DR**:

1. Mergi la **Admin → Produse**
2. Click **⚙️ Configurează** pe produs
3. Setează **Preț Original** mai mare decât **Preț**
4. Setează **URL Imagine**
5. Salvează
6. Produsul apare AUTOMAT în carousel! 🎉
