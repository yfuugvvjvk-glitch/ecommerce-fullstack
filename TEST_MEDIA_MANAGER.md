# 🧪 Ghid de Testare - Media Manager

## ✅ Verificare Rapidă Setup

### Windows PowerShell

```powershell
.\check-media-setup.ps1
```

Ar trebui să vezi:

```
✅ Toate directoarele există
✅ Toate fișierele backend există
✅ Toate fișierele frontend există
✅ Configurarea este corectă
✅ Build backend reușit
📊 Statistici fișiere
```

## 🚀 Pornire Aplicație

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

**Verifică că vezi:**

```
🚀 Server running on http://localhost:3001
💬 Socket.IO chat server ready
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

**Verifică că vezi:**

```
▲ Next.js 14.x.x
- Local: http://localhost:3000
✓ Ready in X.Xs
```

## 📝 Pași de Testare

### 1. Verificare Acces

**1.1. Deschide browser:**

```
http://localhost:3000
```

**1.2. Loghează-te ca admin:**

- Email: `admin@site.ro`
- Parolă: `admin123`

**1.3. Navighează la Media Manager:**

```
Dashboard → Admin Panel → Editare Conținut → Media
```

**✅ Verifică:**

- [ ] Vezi breadcrumb-ul: "Admin Panel → Editare Conținut → 🖼️ Gestionare Media"
- [ ] Vezi subtitlul: "🖼️ Gestionare Media și Fișiere"
- [ ] Vezi tab-ul "Media" activ (linie albastră jos)

### 2. Verificare Afișare Fișiere

**2.1. Verifică statisticile:**

```
┌──────────┬──────────┬──────────┬──────────┐
│  Total   │ Imagini  │  Spațiu  │ Afișate  │
└──────────┴──────────┴──────────┴──────────┘
```

**✅ Verifică:**

- [ ] Numărul total de fișiere este corect
- [ ] Numărul de imagini este corect
- [ ] Spațiul folosit este afișat (ex: 5.58 MB)

**2.2. Verifică afișarea imaginilor:**

**Mod Grid (implicit):**

- [ ] Imaginile se încarcă corect (nu apar erori 404)
- [ ] Preview-urile sunt vizibile
- [ ] Dimensiunile sunt afișate (ex: 686×386)
- [ ] Numele fișierelor sunt afișate
- [ ] Mărimea fișierelor este afișată (ex: 100.14 KB)

**Mod Listă:**

- [ ] Click pe "📋 Listă"
- [ ] Tabelul se afișează corect
- [ ] Toate coloanele sunt vizibile
- [ ] Imaginile thumbnail se încarcă

### 3. Testare Filtre și Căutare

**3.1. Testează căutarea:**

```
Caută după: "offer"
```

**✅ Verifică:**

- [ ] Rezultatele se filtrează corect
- [ ] Numărul "Afișate" se actualizează
- [ ] Doar fișierele care conțin "offer" apar

**3.2. Testează filtrele de tip:**

```
Selectează: "Doar imagini"
```

**✅ Verifică:**

- [ ] Doar imaginile sunt afișate
- [ ] Documentele PDF sunt ascunse

```
Selectează: "Doar documente"
```

**✅ Verifică:**

- [ ] Doar documentele sunt afișate
- [ ] Imaginile sunt ascunse

### 4. Testare Upload Fișier

**4.1. Pregătește un fișier de test:**

- Imagine JPG/PNG < 5MB
- Nume sugestiv: `test-upload.jpg`

**4.2. Încarcă fișierul:**

- [ ] Click pe "📤 Încarcă Fișiere"
- [ ] Selectează fișierul
- [ ] Așteaptă confirmarea

**✅ Verifică:**

- [ ] Vezi mesajul: "Fișierele au fost încărcate cu succes!"
- [ ] Fișierul apare în listă
- [ ] Preview-ul se încarcă corect
- [ ] Statisticile se actualizează (Total +1)

**4.3. Verifică pe disk:**

```bash
cd backend/public/uploads/media
ls -la
```

**✅ Verifică:**

- [ ] Fișierul există pe disk
- [ ] Numele conține timestamp (ex: 1763027207431-test-upload.jpg)

### 5. Testare Vizualizare Detalii

**5.1. Click pe un fișier din grilă**

**✅ Verifică că se deschide modal cu:**

- [ ] Preview mare al imaginii
- [ ] Nume original
- [ ] Nume fișier (cu timestamp)
- [ ] URL complet (http://localhost:3001/uploads/...)
- [ ] Tip MIME (ex: image/jpeg)
- [ ] Mărime (ex: 245 KB)
- [ ] Dimensiuni (ex: 1920×1080)
- [ ] Încărcat de (email admin)
- [ ] Data încărcării

**5.2. Testează acțiunile:**

**Copiere URL:**

- [ ] Click pe "📋" lângă URL
- [ ] Vezi mesajul: "URL copiat în clipboard!"
- [ ] Paste într-un editor - URL-ul este corect

**Descărcare:**

- [ ] Click pe "⬇️ Descarcă"
- [ ] Fișierul se descarcă în browser
- [ ] Fișierul descărcat se deschide corect

### 6. Testare Ștergere

**6.1. Ștergere individuală:**

- [ ] Deschide detalii fișier
- [ ] Click pe "🗑️ Șterge"
- [ ] Confirmă ștergerea
- [ ] Vezi mesajul: "Fișierul a fost șters cu succes!"
- [ ] Fișierul dispare din listă
- [ ] Statisticile se actualizează

**6.2. Ștergere în masă:**

- [ ] Bifează 2-3 fișiere
- [ ] Vezi mesajul: "X selectate"
- [ ] Click pe "🗑️ Șterge" din toolbar
- [ ] Confirmă ștergerea
- [ ] Vezi mesajul: "Fișierele au fost șterse cu succes!"
- [ ] Toate fișierele selectate dispar

### 7. Testare Erori

**7.1. Upload fișier prea mare:**

- [ ] Încearcă să încarci un fișier > 5MB
- [ ] Vezi mesaj de eroare

**7.2. Upload format invalid:**

- [ ] Încearcă să încarci un .exe sau .zip
- [ ] Vezi mesaj de eroare

**7.3. Imagine inexistentă:**

- [ ] Șterge un fișier de pe disk manual
- [ ] Reîncarcă pagina
- [ ] Vezi placeholder "Eroare la încărcare"

### 8. Testare Integrare

**8.1. Verifică URL-urile în browser:**

- [ ] Click dreapta pe imagine → "Open image in new tab"
- [ ] URL-ul ar trebui să fie: `http://localhost:3001/uploads/...`
- [ ] Imaginea se încarcă corect în tab nou

**8.2. Verifică în consola browser (F12):**

- [ ] Nu există erori 404
- [ ] Nu există erori CORS
- [ ] Nu există erori JavaScript

**8.3. Verifică în consola backend:**

- [ ] Nu există erori de citire fișiere
- [ ] Nu există erori de bază de date
- [ ] Request-urile sunt loggate corect

## 🐛 Probleme Comune și Soluții

### Imaginile nu se încarcă (404)

**Simptom:** Vezi placeholder "Eroare la încărcare"

**Verificări:**

```bash
# 1. Backend rulează?
curl http://localhost:3001/health

# 2. Fișierul există?
cd backend/public/uploads/products
ls -la

# 3. URL-ul este corect?
# Click dreapta pe imagine → Inspect
# Verifică src="http://localhost:3001/uploads/..."
```

**Soluție:**

- Asigură-te că backend-ul rulează
- Verifică că `NEXT_PUBLIC_API_URL=http://localhost:3001` în `.env.local`
- Reîncarcă pagina (Ctrl+F5)

### Eroare 500 la încărcare listă

**Simptom:** "Request failed with status code 500"

**Verificări:**

```bash
# Verifică logurile backend
cd backend
npm run dev
# Urmărește erorile în terminal
```

**Cauze posibile:**

- Baza de date nu este conectată
- Tabelul Media nu există
- Eroare în scanarea directoarelor

**Soluție:**

```bash
# Verifică DB
cd backend
node test-db-connection.js

# Rulează migrațiile
npx prisma migrate deploy
```

### Eroare 401/403

**Simptom:** "Unauthorized" sau "Forbidden"

**Verificări:**

- Ești logat?
- Token-ul este valid?
- Ai role `admin`?

**Soluție:**

```bash
# Verifică role-ul în Prisma Studio
cd backend
npx prisma studio
# Schimbă role la 'admin'
```

### Upload nu funcționează

**Simptom:** Eroare la încărcare fișier

**Verificări:**

- Fișierul este < 5MB?
- Formatul este acceptat?
- Directorul are permisiuni?

**Soluție:**

```bash
# Verifică directorul
cd backend/public/uploads/media
ls -la

# Creează dacă lipsește
mkdir -p backend/public/uploads/media
```

## 📊 Rezultate Așteptate

După testare completă, ar trebui să ai:

✅ Toate imaginile se încarcă corect  
✅ Upload funcționează  
✅ Ștergere funcționează  
✅ Filtre și căutare funcționează  
✅ Detalii fișier se afișează corect  
✅ Statistici corecte  
✅ Fără erori în consolă  
✅ UI/UX plăcut și intuitiv

## 🎯 Checklist Final

- [ ] Setup verificat cu `check-media-setup.ps1`
- [ ] Backend pornit și funcțional
- [ ] Frontend pornit și funcțional
- [ ] Logat ca admin
- [ ] Acces la Media Manager
- [ ] Breadcrumb vizibil
- [ ] Imagini se încarcă corect
- [ ] Upload funcționează
- [ ] Ștergere funcționează
- [ ] Filtre funcționează
- [ ] Detalii fișier funcționează
- [ ] Fără erori în consolă
- [ ] Fără erori în backend

## 📝 Raportare Probleme

Dacă întâmpini probleme:

1. **Verifică logurile:**
   - Consolă browser (F12)
   - Terminal backend
   - Terminal frontend

2. **Rulează teste:**

   ```bash
   cd backend
   node test-db-connection.js
   node test-image-serving.js
   ```

3. **Consultă documentația:**
   - MEDIA_FINAL_FIX.md
   - GHID_UTILIZARE_MEDIA.md
   - QUICK_FIX_GUIDE.md

4. **Verifică configurarea:**
   - frontend/.env.local
   - backend/.env.local
   - Prisma schema

---

**Testare completă:** ~15-20 minute  
**Testare rapidă:** ~5 minute  
**Ultima actualizare:** 6 Februarie 2026
