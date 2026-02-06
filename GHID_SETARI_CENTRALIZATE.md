# ⚙️ Ghid: Setări Centralizate și Sincronizare Informații

## 🎯 Problema Rezolvată

**ÎNAINTE**: Dacă modificai adresa de livrare într-o parte, trebuia să o modifici manual în:

- Pagina Contact
- Pagina Checkout
- Footer
- Email-uri
- Etc.

**ACUM**: Modifici o dată în **Admin → Setări Site** și se actualizează AUTOMAT peste tot!

## 📍 Unde Găsești Setările Centralizate?

1. Loghează-te ca admin: `admin@example.com` / `Admin1234`
2. Mergi la **Admin** → **⚙️ Setări Site** (tab nou)
3. Aici găsești 4 secțiuni:
   - 📞 **Contact** - Email, telefon, adresă fizică
   - 🚚 **Livrare** - Adresă livrare, telefon, costuri
   - 🛒 **Comenzi** - Valoare minimă comandă
   - 🕐 **Program** - Program de lucru

## ✅ Ce Probleme Rezolvă?

### 1. Editare Orele în Programul de Livrare

**Problema**: Nu puteai edita orele în programul de livrare
**Soluție**:

- Mergi la **Admin** → **📅 Program Livrări**
- Click **✏️ Editează** pe program
- Acum vezi secțiunea **Intervale de Livrare** cu:
  - Ora început (editabilă)
  - Ora sfârșit (editabilă)
  - Max comenzi (editabil)
  - Buton **➕ Adaugă Interval** pentru intervale noi
  - Buton **🗑️** pentru ștergere interval

### 2. Sincronizare Informații

**Problema**: Informațiile diferă între Contact, Livrare, Checkout
**Soluție**: Setări centralizate în **Admin → Setări Site**

#### Exemplu Practic:

**Modifici adresa de livrare:**

1. Mergi la **Admin → Setări Site → 🚚 Livrare**
2. Modifici "Adresă Livrare/Ridicare"
3. Salvează (automat la blur)

**Rezultat**: Adresa se actualizează AUTOMAT în:

- ✅ Pagina Contact
- ✅ Pagina Checkout (la plasare comandă)
- ✅ Footer site
- ✅ Email-uri către clienți
- ✅ Facturi

### 3. Blocare Comenzi pentru Date Specifice

**Problema**: Vrei să blochezi comenzile pentru anumite date (sărbători, concedii)
**Soluție**:

#### Opțiunea 1: Blocare Generală (Toate Comenzile)

1. Mergi la **Admin → 📅 Program Livrări → 🚫 Blocare Comenzi**
2. Bifează **"Blochează toate comenzile noi"**
3. Completează:
   - **Motiv blocare** (ex: "Concediu de Crăciun")
   - **Blochează până la** (dată și oră opțională)
4. Salvează

**Rezultat**:

- ❌ Utilizatorii NU pot plasa comenzi noi
- 📢 Văd mesajul: "Comenzile sunt temporar blocate: [Motiv]"
- ⏰ Dacă ai setat dată, se deblochează automat

#### Opțiunea 2: Blocare Date Specifice (Sărbători)

1. Mergi la **Admin → 📅 Program Livrări → 🗓️ Date Speciale**
2. Completează:
   - **Data** (ex: 25.12.2024)
   - **Tip**: "Zi blocată (fără livrări)"
   - **Motiv** (ex: "Crăciun")
3. Click **➕ Adaugă Dată**

**Rezultat**:

- ❌ Utilizatorii NU pot selecta această dată la checkout
- 📅 Data apare ca "indisponibilă" în calendar
- 📢 Văd mesajul: "Livrările nu sunt disponibile în această zi: [Motiv]"

## 📊 Setări Disponibile

### 📞 Contact

| Setare          | Unde Apare                   | Exemplu                         |
| --------------- | ---------------------------- | ------------------------------- |
| Email Contact   | Contact, Footer, Email-uri   | contact@example.com             |
| Telefon Contact | Contact, Footer, Header      | +40 745 123 456                 |
| Adresă Fizică   | Contact, Footer, Google Maps | Str. Exemplu nr. 123, București |

### 🚚 Livrare

| Setare           | Unde Apare                   | Exemplu                         |
| ---------------- | ---------------------------- | ------------------------------- |
| Adresă Livrare   | Checkout, Email-uri, Facturi | Str. Exemplu nr. 123, București |
| Telefon Livrări  | Checkout, Email-uri          | +40 745 123 456                 |
| Cost Livrare     | Checkout, Coș                | 15 RON                          |
| Livrare Gratuită | Checkout, Banner             | Peste 200 RON                   |

### 🛒 Comenzi

| Setare         | Unde Apare    | Exemplu |
| -------------- | ------------- | ------- |
| Valoare Minimă | Checkout, Coș | 50 RON  |

### 🕐 Program

| Setare        | Unde Apare      | Exemplu          |
| ------------- | --------------- | ---------------- |
| Program Lucru | Contact, Footer | L-V: 09:00-18:00 |

## 🔄 Cum Funcționează Sincronizarea?

### Backend (API)

```javascript
// Toate componentele citesc din aceeași sursă
GET /api/public/site-config?keys=contact_email,contact_phone,delivery_address
```

### Frontend (Componente)

```typescript
// Contact Page
const { contact_email, contact_phone } = useSiteConfig();

// Checkout Page
const { delivery_address, delivery_cost } = useSiteConfig();

// Footer
const { contact_email, business_hours } = useSiteConfig();
```

## 🎯 Cazuri de Utilizare

### Caz 1: Schimbi Numărul de Telefon

1. **Admin → Setări Site → Contact**
2. Modifici "Telefon Contact"
3. **Rezultat**: Se actualizează în:
   - Header (buton "Sună-ne")
   - Footer
   - Pagina Contact
   - Email-uri către clienți

### Caz 2: Concediu de Sărbători

1. **Admin → Program Livrări → Date Speciale**
2. Adaugi: 24-26 Decembrie ca "Zi blocată"
3. **Rezultat**:
   - Clienții nu pot selecta aceste date
   - Văd mesaj: "Livrările nu sunt disponibile: Sărbători de Crăciun"

### Caz 3: Modifici Costul Livrării

1. **Admin → Setări Site → Livrare**
2. Modifici "Cost Livrare" de la 15 la 20 RON
3. **Rezultat**:
   - Coșul recalculează automat
   - Checkout afișează noul cost
   - Email-uri conțin noul cost

## 🚀 Beneficii

✅ **Modifici o dată** - se actualizează peste tot
✅ **Fără erori** - nu uiți să actualizezi undeva
✅ **Consistent** - aceleași informații peste tot
✅ **Rapid** - nu mai cauți prin cod
✅ **Sigur** - doar adminii pot modifica

## 📝 Notă Importantă

După ce modifici o setare, **NU trebuie să restartezi aplicația**. Modificările se aplică IMEDIAT pentru toți utilizatorii.

---

**TL;DR**: Toate informațiile importante (contact, livrare, program) sunt centralizate în **Admin → Setări Site**. Modifici o dată și se actualizează automat peste tot. Pentru blocare comenzi, folosește **Admin → Program Livrări → Blocare Comenzi** sau **Date Speciale**.
