const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: "postgresql://postgres:password@localhost:5432/ecommerce_db"
});

async function getProducts() {
  try {
    console.log('📦 Conectare la baza de date...\n');

    const productsResult = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM "Product" p 
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
    `);

    const categoriesResult = await pool.query('SELECT * FROM "Category" ORDER BY name');
    const mediaResult = await pool.query('SELECT * FROM "Media" ORDER BY "uploadedAt" DESC');

    const products = productsResult.rows;
    const categories = categoriesResult.rows;
    const media = mediaResult.rows;

    console.log(`✅ ${products.length} produse găsite`);
    console.log(`✅ ${categories.length} categorii găsite`);
    console.log(`✅ ${media.length} fișiere media găsite\n`);

    let markdown = `# 🛒 Produse Reale din Baza de Date

**Data Export:** ${new Date().toLocaleString('ro-RO')}

---

## 📊 Statistici

- **Total Produse:** ${products.length}
- **Total Categorii:** ${categories.length}
- **Total Media:** ${media.length}

---

## 📦 Lista Produse

`;

    if (products.length === 0) {
      markdown += `**Nu există produse în baza de date momentan.**

Pentru a adăuga produse:
1. Autentifică-te ca admin (admin@example.com / admin123)
2. Accesează panoul admin
3. Adaugă produse folosind imaginile din \`backend/public/uploads/media/\`

`;
    } else {
      products.forEach((p, index) => {
        markdown += `### ${index + 1}. ${p.name}

- **ID:** ${p.id}
- **Preț:** ${p.price} RON
- **Stoc:** ${p.stock} ${p.unit}
- **Categorie:** ${p.category_name || 'N/A'}
- **Status:** ${p.isActive ? '✅ Activ' : '❌ Inactiv'}
- **Descriere:** ${p.description || 'N/A'}
- **Creat:** ${new Date(p.createdAt).toLocaleString('ro-RO')}

`;
      });
    }

    markdown += `\n---

## 📂 Categorii

`;

    if (categories.length === 0) {
      markdown += `**Nu există categorii în baza de date.**\n\n`;
    } else {
      categories.forEach((c, index) => {
        markdown += `${index + 1}. **${c.name}** (${c.slug})
   - Descriere: ${c.description || 'N/A'}
   - ID: ${c.id}
   - Părinte: ${c.parentId || 'N/A'}

`;
      });
    }

    markdown += `\n---

## 🖼️ Fișiere Media (Imagini Disponibile)

`;

    if (media.length === 0) {
      markdown += `**Nu există fișiere media în baza de date.**\n\n`;
    } else {
      media.forEach((m, index) => {
        markdown += `${index + 1}. **${m.originalName}**
   - Fișier: ${m.filename}
   - Path: ${m.path}
   - Tip: ${m.mimeType}
   - Mărime: ${(m.size / 1024).toFixed(2)} KB
   - Încărcat: ${new Date(m.uploadedAt).toLocaleString('ro-RO')}

`;
      });
    }

    markdown += `\n---

## 📝 Note

- Toate imaginile sunt disponibile în \`backend/public/uploads/media/\`
- Pentru a adăuga produse noi, folosește panoul admin
- Produsele pot fi asociate cu imaginile existente

`;

    fs.writeFileSync('../PRODUSE_REALE.md', markdown, 'utf-8');
    console.log('✅ Fișier salvat: PRODUSE_REALE.md\n');

    console.log('📋 Produse în baza de date:');
    if (products.length === 0) {
      console.log('  (niciun produs)');
    } else {
      products.forEach(p => {
        console.log(`  - ${p.name}: ${p.price} RON (${p.stock} ${p.unit})`);
      });
    }

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

getProducts();
