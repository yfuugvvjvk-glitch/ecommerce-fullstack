# 🌐 Sistem de Traduceri

**Data:** 23 Februarie 2026

---

## 📊 Statistici Traduceri

- **26 Produse** traduse complet
- **6 Limbi** suportate: RO, EN, DE, FR, ES, IT
- **Traduceri automate** pentru titluri și descrieri
- **Componente React** cu suport multilingv

---

## 🔄 Ce Este Tradus

### 1. Produse (26)

- ✅ Titluri (title, titleEn, titleDe, titleFr, titleEs, titleIt)
- ✅ Descrieri (description, descriptionEn, descriptionDe, etc.)
- ✅ Conținut (content, contentEn, contentDe, etc.)

### 2. Categorii (14)

- ✅ Nume categorii
- ✅ Descrieri categorii

### 3. Interfață

- ✅ Butoane și meniuri
- ✅ Mesaje de eroare
- ✅ Notificări
- ✅ Formulare

---

## 🛠️ Cum Funcționează

### Frontend

Componentele folosesc hook-ul `useTranslation`:

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { locale, t } = useTranslation();

  return <h1>{t('welcome')}</h1>;
}
```

### Componente Speciale

#### ProductTitle

```tsx
<ProductTitle product={product}>
  {(translatedTitle) => <h1>{translatedTitle}</h1>}
</ProductTitle>
```

#### ProductItem

```tsx
<ProductItem product={product}>
  {(translatedTitle, translatedDescription) => (
    <>
      <h2>{translatedTitle}</h2>
      <p>{translatedDescription}</p>
    </>
  )}
</ProductItem>
```

---

## 📝 Exemple Traduceri

### Titluri Produse

| Română              | English            | Deutsch            | Français           |
| ------------------- | ------------------ | ------------------ | ------------------ |
| Ieduții             | Kids (Young Goats) | Kids (Young Goats) | Kids (Young Goats) |
| Laptele de măgăriță | Donkey Milk        | Donkey Milk        | Donkey Milk        |
| Găinile             | Hens               | Hens               | Hens               |
| Oua de găină        | Chicken Eggs       | Chicken Eggs       | Chicken Eggs       |
| Brânză de capră     | Goat Cheese        | Goat Cheese        | Goat Cheese        |

### Descrieri

**Română:**

> Ieduți vii, sănătoși, bine îngrijiți, energici, crescuți natural. Perfecți pentru Paști sau pentru gospodărie.

**English:**

> Live kids (young goats), healthy, well-cared for, energetic, naturally raised. Perfect for Easter or for the household.

---

## 🔧 Scripturi de Traducere

### 1. translate-all-products.js

Traduce titlurile tuturor produselor în toate limbile.

```bash
cd backend
node translate-all-products.js
```

### 2. translate-descriptions.js

Traduce descrierile și conținutul produselor.

```bash
cd backend
node translate-descriptions.js
```

---

## 🌍 Limbi Suportate

1. **Română (RO)** - Limba principală
2. **Engleză (EN)** - Traducere completă
3. **Germană (DE)** - Traducere parțială
4. **Franceză (FR)** - Traducere parțială
5. **Spaniolă (ES)** - Traducere parțială
6. **Italiană (IT)** - Traducere parțială

---

## 📦 Câmpuri în Baza de Date

### DataItem (Produse)

```sql
title          VARCHAR  -- Titlu în română
titleEn        VARCHAR  -- Titlu în engleză
titleDe        VARCHAR  -- Titlu în germană
titleFr        VARCHAR  -- Titlu în franceză
titleEs        VARCHAR  -- Titlu în spaniolă
titleIt        VARCHAR  -- Titlu în italiană

description    TEXT     -- Descriere în română
descriptionEn  TEXT     -- Descriere în engleză
descriptionDe  TEXT     -- Descriere în germană
descriptionFr  TEXT     -- Descriere în franceză
descriptionEs  TEXT     -- Descriere în spaniolă
descriptionIt  TEXT     -- Descriere în italiană

content        TEXT     -- Conținut în română
contentEn      TEXT     -- Conținut în engleză
contentDe      TEXT     -- Conținut în germană
contentFr      TEXT     -- Conținut în franceză
contentEs      TEXT     -- Conținut în spaniolă
contentIt      TEXT     -- Conținut în italiană
```

---

## ✅ Status Traduceri

- ✅ **Produse:** 26/26 traduse (EN)
- ✅ **Categorii:** 14/14 traduse
- ✅ **Interfață:** Complet tradusă
- ✅ **Componente:** Toate suportă multilingv
- ⚠️ **DE, FR, ES, IT:** Traduceri parțiale (folosesc EN ca fallback)

---

## 🔄 Cum să Adaugi Traduceri Noi

### 1. Pentru Produse Noi

Când adaugi un produs nou prin admin, completează câmpurile de traducere:

- Title EN, DE, FR, ES, IT
- Description EN, DE, FR, ES, IT

### 2. Pentru Interfață

Adaugă traducerile în `frontend/hooks/useTranslation.ts`:

```typescript
const translations = {
  ro: {
    new_key: 'Text în română',
  },
  en: {
    new_key: 'Text in English',
  },
};
```

---

## 📝 Note

- Traducerile sunt stocate direct în baza de date
- Componentele React selectează automat limba corectă
- Fallback la română dacă traducerea lipsește
- Scripturile pot fi rulate oricând pentru a actualiza traducerile

---

**Sistem complet de traduceri implementat! 🌐**
