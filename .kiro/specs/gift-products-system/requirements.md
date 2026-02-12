# Specificație: Sistem Produse Cadou

## 1. Descriere Generală

Sistem de management pentru produse cadou care sunt oferite automat clienților când îndeplinesc anumite condiții (sarcini). Produsele cadou sunt produse reale din inventar, cu stoc real, și pot fi selectate de client la checkout când condițiile sunt îndeplinite.

## 2. Cerințe Funcționale

### 2.1 Gestionare Reguli Cadou (Admin)

- **AC 2.1.1**: Admin poate crea reguli noi de cadou
- **AC 2.1.2**: Admin poate edita reguli existente
- **AC 2.1.3**: Admin poate șterge reguli
- **AC 2.1.4**: Admin poate activa/dezactiva reguli fără a le șterge
- **AC 2.1.5**: Fiecare regulă are un nume descriptiv
- **AC 2.1.6**: Fiecare regulă are o prioritate (pentru rezolvarea conflictelor)

### 2.2 Condiții pentru Reguli

- **AC 2.2.1**: Regulă poate avea condiție de sumă minimă (ex: comandă >= 200 RON)
- **AC 2.2.2**: Regulă poate avea condiție de produs specific (ex: trebuie să cumpere Produsul X)
- **AC 2.2.3**: Regulă poate avea condiție de produse multiple (ex: Produsul X SAU Produsul Y)
- **AC 2.2.4**: Regulă poate avea condiție de categorie (ex: orice produs din Categoria A)
- **AC 2.2.5**: Regulă poate avea condiție de categorii multiple (ex: Categoria A SAU Categoria B)
- **AC 2.2.6**: Regulă poate combina condiții (ex: sumă >= 200 RON ȘI Produsul X)
- **AC 2.2.7**: Combinațiile pot fi AND sau OR între condiții
- **AC 2.2.8**: Admin poate specifica cantitate minimă pentru produse (ex: 2x Produsul X)

### 2.3 Produse Cadou Disponibile

- **AC 2.3.1**: Admin poate selecta unul sau mai multe produse ca fiind cadou pentru o regulă
- **AC 2.3.2**: Produsele cadou sunt produse reale din inventar
- **AC 2.3.3**: Produsele cadou au stoc real care se verifică
- **AC 2.3.4**: Admin poate limita câte bucăți din fiecare produs cadou sunt disponibile per regulă
- **AC 2.3.5**: Produsele cadou pot avea imagini și descrieri (din produsul original)

### 2.4 Afișare Cadouri la Checkout

- **AC 2.4.1**: Când condițiile unei reguli sunt îndeplinite, produsele cadou apar la checkout
- **AC 2.4.2**: Clientul vede o secțiune dedicată "Produse Cadou Disponibile"
- **AC 2.4.3**: Pentru fiecare regulă îndeplinită, clientul poate selecta UN singur produs cadou
- **AC 2.4.4**: Dacă o regulă are 5 produse cadou disponibile, clientul alege doar 1
- **AC 2.4.5**: Dacă sunt îndeplinite 2 reguli diferite, clientul poate selecta 2 produse cadou (câte unul per regulă)
- **AC 2.4.6**: Produsele cadou selectate apar în coș cu preț 0 RON
- **AC 2.4.7**: Produsele cadou sunt marcate vizual ca "CADOU" în coș

### 2.5 Validare Dinamică

- **AC 2.5.1**: Când clientul modifică coșul, condițiile se reevaluează automat
- **AC 2.5.2**: Dacă condițiile nu mai sunt îndeplinite, produsele cadou dispar din coș
- **AC 2.5.3**: Dacă clientul șterge un produs și condiția cade, cadoul asociat se elimină automat
- **AC 2.5.4**: Dacă clientul adaugă produse și îndeplinește o nouă regulă, cadourile noi apar
- **AC 2.5.5**: Validarea se face în timp real (fără refresh pagină)

### 2.6 Validare Stoc

- **AC 2.6.1**: Înainte de a afișa un produs cadou, se verifică stocul
- **AC 2.6.2**: Dacă produsul cadou nu are stoc, nu apare în lista de cadouri
- **AC 2.6.3**: Dacă clientul selectează un cadou și stocul se epuizează între timp, primește eroare
- **AC 2.6.4**: La plasarea comenzii, stocul produsului cadou se decrementează

### 2.7 Procesare Comandă

- **AC 2.7.1**: Produsele cadou apar în comandă cu preț 0 RON
- **AC 2.7.2**: Produsele cadou sunt marcate în baza de date ca "isGift: true"
- **AC 2.7.3**: Produsele cadou se scad din stoc la fel ca produsele normale
- **AC 2.7.4**: În factura/invoice, produsele cadou apar cu mențiunea "CADOU"
- **AC 2.7.5**: Rapoartele admin arată separat produsele cadou de cele vândute

### 2.8 Restricții și Limite

- **AC 2.8.1**: Un client poate primi maxim un cadou per regulă îndeplinită
- **AC 2.8.2**: Produsele cadou nu pot fi returnate sau schimbate
- **AC 2.8.3**: Produsele cadou nu contribuie la îndeplinirea altor reguli de cadou
- **AC 2.8.4**: Dacă un produs este deja în coș ca produs normal, poate fi selectat și ca cadou (2 bucăți separate)

## 3. Cerințe Non-Funcționale

### 3.1 Performanță

- Evaluarea condițiilor se face în < 200ms
- Actualizarea coșului cu cadouri în < 300ms
- Validarea stocului în < 100ms

### 3.2 Usabilitate

- Interfața de creare reguli este intuitivă
- Clientul înțelege clar ce cadouri poate primi
- Mesaje clare când cadourile dispar (de ce)

### 3.3 Securitate

- Validarea condițiilor se face pe backend (nu doar frontend)
- Clientul nu poate manipula cadourile prin API
- Stocul se verifică la fiecare pas

## 4. Structura Datelor

### 4.1 Model GiftRule (Regulă Cadou)

```typescript
interface GiftRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number; // 1-100, mai mare = prioritate mai mare
  
  // Condiții
  conditions: GiftCondition[];
  conditionLogic: 'AND' | 'OR'; // cum se combină condițiile
  
  // Produse cadou disponibile
  giftProducts: GiftProduct[];
  
  // Limite
  maxUsesPerCustomer: number | null; // null = unlimited
  maxTotalUses: number | null;
  currentTotalUses: number;
  
  // Validitate
  validFrom: Date | null;
  validUntil: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Model GiftCondition (Condiție)

```typescript
interface GiftCondition {
  id: string;
  type: 'MIN_AMOUNT' | 'SPECIFIC_PRODUCT' | 'PRODUCT_CATEGORY' | 'PRODUCT_QUANTITY';
  
  // Pentru MIN_AMOUNT
  minAmount?: number;
  
  // Pentru SPECIFIC_PRODUCT
  productId?: string;
  minQuantity?: number; // câte bucăți din produs
  
  // Pentru PRODUCT_CATEGORY
  categoryId?: string;
  minCategoryAmount?: number; // sumă minimă din categorie
  
  // Pentru combinații
  subConditions?: GiftCondition[];
  logic?: 'AND' | 'OR';
}
```

### 4.3 Model GiftProduct (Produs Cadou)

```typescript
interface GiftProduct {
  id: string;
  productId: string; // referință la Product real
  giftRuleId: string;
  maxQuantityPerOrder: number; // câte pot fi oferite per comandă
  remainingStock: number | null; // null = folosește stocul produsului real
}
```

### 4.4 Model OrderItem extins

```typescript
interface OrderItem {
  // ... câmpuri existente
  isGift: boolean;
  giftRuleId: string | null; // ce regulă a oferit cadoul
  originalPrice: number; // prețul original al produsului (pentru raportare)
}
```

## 5. Interfață Utilizator

### 5.1 Panoul Admin - Gestionare Reguli

**Pagină**: `/admin/gift-rules`

**Funcționalități**:
- Lista cu toate regulile (active/inactive)
- Buton "Creare Regulă Nouă"
- Editare regulă existentă
- Ștergere regulă
- Toggle activ/inactiv
- Statistici: câte comenzi au folosit fiecare regulă

**Formular Creare/Editare Regulă**:
1. Informații de bază:
   - Nume regulă
   - Descriere
   - Prioritate (1-100)
   - Activ/Inactiv
   
2. Condiții:
   - Tip condiție (dropdown)
   - Parametri specifici tipului
   - Buton "Adaugă Condiție"
   - Logic între condiții (AND/OR)
   
3. Produse Cadou:
   - Selector produse (search + select)
   - Lista produse selectate
   - Cantitate maximă per produs
   - Preview produs (imagine, nume, preț original)
   
4. Limite:
   - Maxim utilizări per client
   - Maxim utilizări totale
   - Perioadă validitate (de la / până la)

### 5.2 Checkout - Secțiune Produse Cadou

**Locație**: În pagina de checkout, după lista produselor din coș

**Afișare**:
```
┌─────────────────────────────────────────┐
│ 🎁 Produse Cadou Disponibile            │
├─────────────────────────────────────────┤
│ Ai îndeplinit condițiile pentru cadouri!│
│                                          │
│ Regulă: "Comandă peste 200 RON"         │
│ ✓ Condiție îndeplinită                  │
│                                          │
│ Alege UN produs cadou:                  │
│ ○ [Imagine] Produs A (Stoc: 5)          │
│ ○ [Imagine] Produs B (Stoc: 3)          │
│ ○ [Imagine] Produs C (Stoc: 10)         │
│                                          │
│ [Buton: Adaugă Cadou Selectat]          │
└─────────────────────────────────────────┘
```

**Comportament**:
- Secțiunea apare doar dacă există reguli îndeplinite
- Pentru fiecare regulă îndeplinită, o secțiune separată
- Radio buttons pentru selecție (doar unul)
- Buton pentru adăugare în coș
- După adăugare, produsul apare în coș cu preț 0 și badge "CADOU"

### 5.3 Coș - Afișare Produse Cadou

**Afișare în coș**:
```
Produs Normal          150 RON  [x]
Produs Cadou 🎁        0 RON    [x]
  (Cadou pentru comandă peste 200 RON)
```

**Comportament**:
- Produsele cadou au badge vizual "🎁 CADOU"
- Sub produs, text explicativ de ce este cadou
- Buton [x] pentru eliminare (dacă clientul nu-l mai vrea)
- Dacă condiția cade, mesaj: "Acest cadou a fost eliminat deoarece condiția nu mai este îndeplinită"

## 6. API Endpoints

### 6.1 Admin - Gestionare Reguli

#### GET /api/admin/gift-rules
- Returnează lista tuturor regulilor
- Autentificare: Admin

#### POST /api/admin/gift-rules
- Creează regulă nouă
- Body: GiftRule
- Autentificare: Admin

#### PUT /api/admin/gift-rules/:id
- Actualizează regulă existentă
- Body: GiftRule
- Autentificare: Admin

#### DELETE /api/admin/gift-rules/:id
- Șterge regulă
- Autentificare: Admin

#### GET /api/admin/gift-rules/:id/statistics
- Returnează statistici pentru regulă (câte comenzi, produse oferite, etc.)
- Autentificare: Admin

### 6.2 Client - Evaluare și Selecție Cadouri

#### POST /api/cart/evaluate-gift-rules
- Evaluează ce reguli sunt îndeplinite pentru coșul curent
- Body: { cartItems: CartItem[] }
- Response: { eligibleRules: EligibleGiftRule[] }
- Autentificare: User

#### POST /api/cart/add-gift-product
- Adaugă produs cadou în coș
- Body: { giftRuleId: string, productId: string }
- Response: { success: boolean, cart: Cart }
- Autentificare: User

#### POST /api/cart/remove-gift-product
- Elimină produs cadou din coș
- Body: { cartItemId: string }
- Response: { success: boolean, cart: Cart }
- Autentificare: User

#### GET /api/gift-rules/active
- Returnează regulile active (pentru afișare publică)
- Response: { rules: GiftRule[] }
- Autentificare: Nu necesită

## 7. Fluxuri de Lucru

### 7.1 Flux Admin - Creare Regulă Cadou

1. Admin accesează `/admin/gift-rules`
2. Click "Creare Regulă Nouă"
3. Completează nume și descriere
4. Adaugă condiții:
   - Selectează tip: "Sumă Minimă"
   - Introduce: 200 RON
   - (Opțional) Adaugă altă condiție
   - Selectează logic: AND/OR
5. Selectează produse cadou:
   - Caută "Produs A"
   - Adaugă în listă
   - Setează cantitate max: 1
   - Repetă pentru alte produse
6. Setează limite:
   - Max 1 utilizare per client
   - Fără limită totală
7. Activează regula
8. Salvează
9. Regula apare în listă și devine activă

### 7.2 Flux Client - Primire Cadou

1. Client adaugă produse în coș
2. Merge la checkout
3. Sistemul evaluează automat regulile
4. Dacă o regulă este îndeplinită:
   - Apare secțiunea "Produse Cadou Disponibile"
   - Afișează produsele disponibile pentru acea regulă
5. Client selectează un produs cadou (radio button)
6. Click "Adaugă Cadou Selectat"
7. Produsul apare în coș cu preț 0 și badge "CADOU"
8. Client continuă cu comanda
9. La plasare comandă, produsul cadou se include cu preț 0
10. Stocul produsului cadou se decrementează

### 7.3 Flux Client - Pierdere Cadou

1. Client are produs cadou în coș (condiție îndeplinită)
2. Client elimină un produs din coș
3. Sistemul reevaluează condițiile
4. Condiția nu mai este îndeplinită
5. Produsul cadou se elimină automat din coș
6. Apare mesaj: "Cadoul [Nume Produs] a fost eliminat deoarece comanda nu mai îndeplinește condiția de [descriere condiție]"

### 7.4 Flux Client - Multiple Cadouri

1. Client adaugă produse în coș: total 300 RON
2. Sistemul detectează 2 reguli îndeplinite:
   - Regulă A: "Comandă peste 200 RON" → oferă Cadou 1, 2, 3
   - Regulă B: "Cumpără Produs X" → oferă Cadou 4, 5
3. La checkout apar 2 secțiuni de cadouri:
   - Secțiunea 1: Alege dintre Cadou 1, 2, 3
   - Secțiunea 2: Alege dintre Cadou 4, 5
4. Client selectează Cadou 2 din prima secțiune
5. Client selectează Cadou 5 din a doua secțiune
6. Ambele cadouri apar în coș
7. La comandă, primește 2 produse gratuite

## 8. Validări

### 8.1 Validări Backend - Creare Regulă

- Nume regulă: obligatoriu, max 200 caractere
- Prioritate: între 1-100
- Cel puțin o condiție definită
- Cel puțin un produs cadou selectat
- Produsele cadou există în inventar
- Datele de validitate: validFrom < validUntil
- Limitele: numere pozitive sau null

### 8.2 Validări Backend - Evaluare Condiții

- Verifică că toate produsele din coș există
- Calculează corect suma totală
- Verifică cantitățile pentru condiții de cantitate
- Verifică categoriile produselor
- Evaluează logic-ul AND/OR corect

### 8.3 Validări Backend - Adăugare Cadou

- Regula există și este activă
- Condiția este încă îndeplinită
- Produsul cadou există în regulă
- Produsul cadou are stoc disponibil
- Clientul nu a depășit limita de utilizări
- Clientul nu are deja un cadou din aceeași regulă

## 9. Cazuri Speciale

### 9.1 Stoc Insuficient

- Dacă produsul cadou nu are stoc, nu apare în listă
- Dacă stocul se epuizează între selecție și plasare comandă:
  - Eroare: "Produsul cadou [Nume] nu mai este disponibil"
  - Clientul trebuie să selecteze alt cadou sau să continue fără

### 9.2 Reguli Conflictuale

- Dacă 2 reguli oferă același produs cadou:
  - Se folosește regula cu prioritate mai mare
  - Clientul poate primi produsul doar o dată (din regula cu prioritate mai mare)

### 9.3 Modificare Regulă Activă

- Dacă admin modifică o regulă în timp ce clienți o folosesc:
  - Comenzile în curs folosesc versiunea veche
  - Comenzile noi folosesc versiunea nouă
  - Se salvează snapshot-ul regulii în comandă

### 9.4 Produse Cadou în Comenzi Returnate

- Produsele cadou nu pot fi returnate separat
- Dacă comanda întreagă este returnată:
  - Produsele cadou se returnează în stoc
  - Nu se returnează bani (erau gratuite)

### 9.5 Combinații Complexe de Condiții

Exemplu: (Sumă >= 200 RON) AND ((Produs A) OR (Categorie X))

- Se evaluează mai întâi parantezele interioare
- Apoi se aplică operatorii exteriori
- Suport pentru maxim 3 nivele de imbricare

## 10. Prioritizare

### Must Have (P0)

- Creare reguli cu condiții simple (sumă minimă, produs specific)
- Selecție produse cadou
- Afișare cadouri la checkout
- Validare dinamică (eliminare când condiția cade)
- Decrementare stoc pentru cadouri
- Marcare cadouri în comandă

### Should Have (P1)

- Condiții complexe (combinații AND/OR)
- Condiții pe categorii
- Limite utilizări per client
- Statistici admin
- Perioade de validitate

### Nice to Have (P2)

- Notificări când cadouri devin disponibile
- Istoric cadouri primite de client
- Recomandări: "Mai adaugă X RON pentru cadou"
- Export rapoarte cadouri oferite
- A/B testing pentru reguli

## 11. Dependențe

- Baza de date PostgreSQL (tabele noi: GiftRule, GiftCondition, GiftProduct)
- Sistem existent de coș (Cart)
- Sistem existent de comenzi (Order)
- Sistem existent de produse (Product)
- Sistem existent de inventar (Stock)
- React pentru frontend
- Fastify pentru backend

## 12. Estimare Efort

- Backend - Modele și migrații: 3 ore
- Backend - API endpoints admin: 4 ore
- Backend - Logic evaluare condiții: 6 ore
- Backend - Integrare cu coș și comenzi: 4 ore
- Frontend - Panoul admin reguli: 6 ore
- Frontend - Secțiune cadouri la checkout: 4 ore
- Frontend - Afișare cadouri în coș: 2 ore
- Testing și bug fixes: 4 ore
- **Total: ~33 ore**

## 13. Integrări cu Sistemul Existent

### 13.1 Integrare cu Cart Service

- Adaugă metode noi:
  - `evaluateGiftRules(cartItems)`
  - `addGiftProduct(giftRuleId, productId)`
  - `removeGiftProduct(cartItemId)`
  - `validateGiftProducts()`

### 13.2 Integrare cu Order Service

- La creare comandă:
  - Verifică că produsele cadou sunt încă valide
  - Marchează items cu `isGift: true`
  - Salvează `giftRuleId` pentru fiecare cadou
  - Incrementează `currentTotalUses` pentru reguli folosite

### 13.3 Integrare cu Product/Stock Service

- La verificare stoc:
  - Include produsele cadou în verificare
  - Decrementează stoc pentru cadouri la fel ca pentru produse normale

### 13.4 Integrare cu Invoice/Reporting

- În facturi:
  - Afișează produse cadou cu preț 0
  - Adaugă mențiune "CADOU"
- În rapoarte:
  - Separă produse vândute de produse oferite cadou
  - Calculează valoarea produselor oferite cadou (cost pentru business)
