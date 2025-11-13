# 📸 Ghid Imagini și Produse

## ✅ Ce am adăugat:

1. **12 Produse** din codul tău PHP:

   - 2 Electronice (laptop, căști)
   - 2 Fashion (cămașă, rochie)
   - 2 Casă & Grădină (mașină gazon, despicător)
   - 2 Sport (bancă exerciții, gantere)
   - 2 Jucării (bicicletă, cub Rubik)
   - 2 Cărți (Chiriașa, Soarele negru)

2. **Pagină Produse** stilizată cu:

   - Grid responsive
   - Imagini produse
   - Prețuri (vechi și noi)
   - Badge-uri reducere
   - Stoc
   - Butoane Edit/Delete

3. **Dashboard actualizat** cu:
       - Statistici live
   - Link către produse
   - Design modern

---

## 📁 Unde pui imaginile?

### Locație:

```
frontend/public/images/
```

### Imagini necesare:

1. `laptop.jpg` - Laptop
2. `casti.jpg` - Căști gaming
3. `camasa.jpg` - Cămașă bărbați
4. `rochie.jpg` - Rochie Guess
5. `masina.jpg` - Mașină de tuns gazon
6. `despicator.jpg` - Despicător busteni
7. `banca.jpg` - Bancă exerciții
8. `gantere.jpg` - Set gantere
9. `bicicleta.jpg` - Bicicletă copii
10. `cub.jpg` - Cub Rubik
11. `chiriasa.jpg` - Carte "Chiriașa"
12. `soare.jpg` - Carte "Soarele negru"

---

## 🎯 Cum adaugi imaginile?

### Opțiunea 1: Copiază din proiectul PHP vechi

Dacă ai folderul `imagini/` din proiectul PHP:

1. Deschide folderul vechi: `[proiect-php]/imagini/`
2. Selectează toate imaginile
3. Copiază-le în: `frontend/public/images/`

**Windows Explorer:**

```
Sursă: C:\path\to\php\project\imagini\
Destinație: C:\Users\tatar\OneDrive\Desktop\app\frontend\public\images\
```

---

### Opțiunea 2: Folosește placeholder-e (temporar)

Aplicația va afișa automat un placeholder dacă imaginea lipsește:

- Text: "No Image"
- Fundal gri

**Nu trebuie să faci nimic!** Produsele vor apărea oricum.

---

### Opțiunea 3: Descarcă imagini noi

**Site-uri gratuite:**

- https://unsplash.com
- https://pexels.com
- https://pixabay.com

**Caută:**

- "laptop" pentru laptop.jpg
- "gaming headphones" pentru casti.jpg
- "men shirt" pentru camasa.jpg
- etc.

**Salvează ca:**

- Format: JPG
- Nume exact: `laptop.jpg`, `casti.jpg`, etc.
- În folder: `frontend/public/images/`

---

## 🧪 Testare

### 1. Verifică că backend-ul rulează

```bash
# Ar trebui să fie deja pornit
# Dacă nu, în Terminal 1:
cd backend
npm run dev
```

### 2. Verifică că frontend-ul rulează

```bash
# Ar trebui să fie deja pornit
# Dacă nu, în Terminal 2:
cd frontend
npm run dev
```

### 3. Testează pagina produse

**Deschide în browser:**
http://localhost:3000/dashboard

**Click pe:**

- "Vezi Produse" SAU
- "Products" din navigation

**Ar trebui să vezi:**

- ✅ 12 produse în grid
- ✅ Imagini (sau placeholder dacă lipsesc)
- ✅ Prețuri cu reduceri
- ✅ Badge-uri cu procent reducere
- ✅ Stoc pentru fiecare produs
- ✅ Butoane Edit/Delete

---

## 🎨 Stilizare

### Ce am folosit:

- **Tailwind CSS** - pentru styling
- **Grid responsive** - 1/2/3/4 coloane pe diferite ecrane
- **Hover effects** - shadow pe hover
- **Badge-uri** - pentru reduceri
- **Placeholder images** - dacă imaginea lipsește

### Culori:

- Albastru (#3B82F6) - prețuri, butoane
- Roșu (#EF4444) - reduceri, delete
- Verde (#10B981) - stoc disponibil
- Gri - text secundar

---

## 📊 Structura Produselor

Fiecare produs are:

```typescript
{
  id: string;
  title: string; // "Laptop"
  description: string; // Scurtă
  content: string; // Detaliată
  price: number; // 10
  oldPrice: number | null; // 30 (pentru reducere)
  stock: number; // 30
  image: string; // "/images/laptop.jpg"
  category: string; // "electronice"
  status: string; // "published"
}
```

---

## 🔧 Troubleshooting

### Imaginile nu se încarcă?

**1. Verifică calea:**

```
frontend/public/images/laptop.jpg  ✅ Corect
frontend/images/laptop.jpg         ❌ Greșit
frontend/public/laptop.jpg         ❌ Greșit
```

**2. Verifică numele:**

- Trebuie exact: `laptop.jpg` (nu `Laptop.jpg` sau `laptop.png`)
- Case-sensitive pe Linux/Mac

**3. Refresh browser:**

- `Ctrl + F5` (hard refresh)

### Produsele nu apar?

**1. Verifică backend:**

```bash
curl http://localhost:3001/api/data
# Trebuie să returneze produse
```

**2. Verifică token:**

- Ești logat?
- Token valid în localStorage?

**3. Verifică console:**

- `F12` → Console
- Vezi erori?

---

## 🎉 Rezultat Final

După ce adaugi imaginile, vei avea:

✅ **Dashboard modern** cu statistici
✅ **12 Produse** din codul tău PHP
✅ **Imagini frumoase** (sau placeholder-e)
✅ **Design responsive** pe toate dispozitivele
✅ **Prețuri cu reduceri** și badge-uri
✅ **Funcționalitate completă** CRUD

---

## 📝 Next Steps

După ce testezi produsele:

1. **Adaugă funcționalitate Edit** - pentru a edita produse
2. **Adaugă funcționalitate Delete** - pentru a șterge produse
3. **Adaugă formular Create** - pentru produse noi
4. **Adaugă filtre** - pe categorii
5. **Adaugă search** - căutare produse

Toate acestea sunt în Tasks 8-10 din plan!

---

## 💡 Tips

- **Placeholder-ele sunt OK** pentru development
- **Adaugă imaginile real** când ești gata pentru production
- **Optimizează imaginile** (< 500KB) pentru performanță
- **Folosește Next.js Image** component pentru optimizare automată (în viitor)
