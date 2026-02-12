# Specificație: Banner Anunțuri Importante

## 1. Descriere Generală

Crearea unei secțiuni de anunțuri importante care apare deasupra caruselului pe pagina principală. Secțiunea este complet personalizabilă din panoul de administrare și apare doar când conține conținut.

## 2. Cerințe Funcționale

### 2.1 Afișare Banner

- **AC 2.1.1**: Banner-ul apare deasupra caruselului pe pagina principală
- **AC 2.1.2**: Banner-ul NU apare dacă nu are conținut (titlu și descriere goale)
- **AC 2.1.3**: Banner-ul este responsive și se adaptează la toate dimensiunile de ecran
- **AC 2.1.4**: Banner-ul poate fi închis de utilizator (opțional - cu buton X)

### 2.2 Editare din Panoul Admin

- **AC 2.2.1**: Există o secțiune dedicată în panoul admin pentru gestionarea banner-ului
- **AC 2.2.2**: Admin poate edita titlul banner-ului
- **AC 2.2.3**: Admin poate edita descrierea banner-ului
- **AC 2.2.4**: Admin poate activa/dezactiva banner-ul fără să șteargă conținutul

### 2.3 Personalizare Titlu

- **AC 2.3.1**: Admin poate selecta culoarea textului titlului (color picker)
- **AC 2.3.2**: Admin poate selecta culoarea de fundal a titlului
- **AC 2.3.3**: Admin poate selecta mărimea fontului titlului (12px - 48px)
- **AC 2.3.4**: Admin poate selecta familia de font pentru titlu (Arial, Times New Roman, Courier, etc.)
- **AC 2.3.5**: Admin poate selecta greutatea fontului (normal, bold, light)
- **AC 2.3.6**: Admin poate selecta alinierea textului (stânga, centru, dreapta)

### 2.4 Personalizare Descriere

- **AC 2.4.1**: Admin poate selecta culoarea textului descrierii (color picker)
- **AC 2.4.2**: Admin poate selecta culoarea de fundal a descrierii
- **AC 2.4.3**: Admin poate selecta mărimea fontului descrierii (12px - 32px)
- **AC 2.4.4**: Admin poate selecta familia de font pentru descriere
- **AC 2.4.5**: Admin poate selecta greutatea fontului (normal, bold, light)
- **AC 2.4.6**: Admin poate selecta alinierea textului (stânga, centru, dreapta)

### 2.5 Persistență Date

- **AC 2.5.1**: Toate setările banner-ului se salvează în baza de date
- **AC 2.5.2**: Setările persistă după restart server
- **AC 2.5.3**: Modificările sunt vizibile imediat după salvare (fără refresh)

### 2.6 Preview Live

- **AC 2.6.1**: Admin vede un preview live al banner-ului în timp ce editează
- **AC 2.6.2**: Preview-ul reflectă toate modificările de stil în timp real

## 3. Cerințe Non-Funcționale

### 3.1 Performanță

- Banner-ul se încarcă în < 100ms
- Modificările se salvează în < 500ms

### 3.2 Usabilitate

- Interfața de editare este intuitivă și ușor de folosit
- Color picker-ul este vizual și ușor de utilizat
- Preview-ul este clar și reprezentativ

### 3.3 Compatibilitate

- Funcționează pe toate browserele moderne (Chrome, Firefox, Safari, Edge)
- Responsive pe mobile, tablet, desktop

## 4. Structura Datelor

### 4.1 Model Banner

```typescript
interface AnnouncementBanner {
  id: string;
  isActive: boolean;
  title: string;
  description: string;
  titleStyle: {
    color: string;
    backgroundColor: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold' | 'light';
    textAlign: 'left' | 'center' | 'right';
  };
  descriptionStyle: {
    color: string;
    backgroundColor: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold' | 'light';
    textAlign: 'left' | 'center' | 'right';
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 5. Interfață Utilizator

### 5.1 Pagina Principală (Frontend)

- Banner apare deasupra caruselului
- Design atractiv și vizibil
- Buton opțional de închidere (X)

### 5.2 Panoul Admin

- Secțiune dedicată "Banner Anunțuri"
- Formular de editare cu:
  - Toggle activ/inactiv
  - Input titlu
  - Textarea descriere
  - Controale stil titlu (culoare, font, mărime, etc.)
  - Controale stil descriere (culoare, font, mărime, etc.)
  - Preview live
  - Buton salvare

## 6. API Endpoints

### 6.1 GET /api/admin/announcement-banner

- Returnează setările curente ale banner-ului
- Autentificare: Admin

### 6.2 PUT /api/admin/announcement-banner

- Actualizează setările banner-ului
- Body: AnnouncementBanner
- Autentificare: Admin

### 6.3 GET /api/announcement-banner

- Returnează banner-ul activ pentru afișare publică
- Returnează null dacă banner-ul este inactiv sau gol
- Autentificare: Nu necesită

## 7. Fluxuri de Lucru

### 7.1 Flux Admin - Creare Banner

1. Admin accesează panoul "Banner Anunțuri"
2. Admin completează titlul și descrierea
3. Admin personalizează stilurile (culori, fonturi, mărimi)
4. Admin vede preview-ul live
5. Admin activează banner-ul
6. Admin salvează modificările
7. Banner-ul apare pe pagina principală

### 7.2 Flux Admin - Editare Banner

1. Admin accesează panoul "Banner Anunțuri"
2. Sistemul încarcă setările existente
3. Admin modifică conținutul sau stilurile
4. Preview-ul se actualizează automat
5. Admin salvează modificările
6. Banner-ul se actualizează pe pagina principală

### 7.3 Flux Admin - Dezactivare Banner

1. Admin accesează panoul "Banner Anunțuri"
2. Admin dezactivează toggle-ul "Activ"
3. Admin salvează
4. Banner-ul dispare de pe pagina principală

### 7.4 Flux Utilizator - Vizualizare Banner

1. Utilizator accesează pagina principală
2. Sistemul verifică dacă există banner activ
3. Dacă DA și are conținut → afișează banner-ul
4. Dacă NU sau este gol → nu afișează nimic
5. Utilizator poate închide banner-ul (opțional)

## 8. Validări

### 8.1 Validări Backend

- Titlul: max 200 caractere
- Descrierea: max 1000 caractere
- Culori: format hex valid (#RRGGBB)
- Mărime font: între 12-48px (titlu), 12-32px (descriere)
- Font family: din lista predefinită

### 8.2 Validări Frontend

- Aceleași validări ca backend
- Mesaje de eroare clare
- Previne salvarea cu date invalide

## 9. Cazuri Speciale

### 9.1 Banner Gol

- Dacă titlu ȘI descriere sunt goale → nu afișa banner-ul
- Dacă doar titlu este gol → afișează doar descrierea
- Dacă doar descriere este goală → afișează doar titlul

### 9.2 Culori Transparente

- Permite culori transparente pentru fundal
- Asigură contrast suficient pentru lizibilitate

### 9.3 Texte Lungi

- Implementează word-wrap pentru texte lungi
- Limitează înălțimea maximă cu scroll (opțional)

## 10. Prioritizare

### Must Have (P0)

- Afișare banner pe pagina principală
- Editare titlu și descriere
- Personalizare culori (text și fundal)
- Personalizare mărime font
- Salvare în baza de date
- Afișare doar când are conținut

### Should Have (P1)

- Preview live în admin
- Personalizare font family
- Personalizare font weight
- Personalizare aliniere text
- Toggle activ/inactiv

### Nice to Have (P2)

- Buton închidere pentru utilizatori
- Animații de apariție
- Programare afișare (de la / până la dată)
- Multiple bannere cu rotație

## 11. Dependențe

- Baza de date PostgreSQL (SiteConfig table)
- React pentru frontend
- Fastify pentru backend
- Tailwind CSS pentru styling
- Color picker component (react-color sau similar)

## 12. Estimare Efort

- Backend API: 2 ore
- Frontend componenta banner: 2 ore
- Panoul admin editare: 4 ore
- Preview live: 2 ore
- Testing și bug fixes: 2 ore
- **Total: ~12 ore**
