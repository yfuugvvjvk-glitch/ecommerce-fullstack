const fs = require('fs');

// Citește JSON-ul
const data = JSON.parse(fs.readFileSync('../EXPORT_REAL_DATA.json', 'utf-8'));

// Funcție pentru a curăța HTML
function cleanHTML(html) {
  if (!html) return 'N/A';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let markdown = `# 🛒 Produse REALE din Baza de Date

**Data Export:** 23 Februarie 2026, 12:27

**Sursa:** Baza de date PostgreSQL - ecommerce_db

---

## 📊 Statistici REALE

- **Total Produse:** ${data.statistics.products}
- **Total Categorii:** ${data.statistics.categories}
- **Total Locații Livrare:** ${data.statistics.locations}
- **Total Imagini Media:** ${data.statistics.media}

---

## 📦 Lista Completă Produse (${data.statistics.products})

`;

data.products.forEach((p, index) => {
  const title = cleanHTML(p.title);
  const description = cleanHTML(p.description);
  
  markdown += `### ${index + 1}. ${title}

- **Preț:** ${p.price} RON/${p.unitName}
- **Stoc:** ${p.stock} ${p.unitName}
- **Descriere:** ${description}
- **Imagine:** ${p.image}
- **Status:** ${p.status === 'published' ? '✅ Publicat' : '❌ Nepublicat'}

`;
});

markdown += `\n---

## 📂 Categorii (${data.statistics.categories})

`;

data.categories.forEach((c, index) => {
  markdown += `${index + 1}. **${c.name}** (${c.slug})
   - Descriere: ${c.description || 'N/A'}
   - ID: ${c.id}
   - Părinte: ${c.parentId || 'Categorie principală'}

`;
});

markdown += `\n---

## 📍 Locații de Livrare (${data.statistics.locations})

`;

data.locations.forEach((l, index) => {
  markdown += `### ${index + 1}. ${l.name}
- **Adresă:** ${l.address}
- **Oraș:** ${l.city}
- **Județ:** ${l.county}
- **Cod Poștal:** ${l.postalCode || 'N/A'}
- **Coordonate GPS:** ${l.latitude ? `${l.latitude}, ${l.longitude}` : 'N/A'}

`;
});

markdown += `\n---

## 🖼️ Imagini Media (${data.statistics.media} fișiere)

`;

data.media.forEach((m, index) => {
  markdown += `${index + 1}. **${m.originalName}**
   - Fișier: ${m.filename}
   - Path: ${m.path}
   - Tip: ${m.mimeType}
   - Mărime: ${(m.size / 1024).toFixed(2)} KB

`;
});

markdown += `\n---

## ✅ Verificare

Toate datele sunt REALE, extrase direct din baza de date PostgreSQL.

Pentru a verifica:
1. Pornește aplicația
2. Accesează http://localhost:3000
3. Vezi toate cele ${data.statistics.products} de produse

---

**Date exportate din baza de date live! 🎉**
`;

fs.writeFileSync('../PRODUSE_REALE.md', markdown, 'utf-8');
console.log('✅ Fișier generat: PRODUSE_REALE.md');
