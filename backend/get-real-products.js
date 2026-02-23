const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/ecommerce_db" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getRealProducts() {
  try {
    console.log('📦 Obținând produse REALE din baza de date...\n');

    const products = await prisma.product.findMany({
      include: {
        category: true,
        media: true
      }
    });

    const categories = await prisma.category.findMany();
    const media = await prisma.media.findMany();

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

    products.forEach((p, index) => {
      markdown += `### ${index + 1}. ${p.name}

- **ID:** ${p.id}
- **Preț:** ${p.price} RON
- **Stoc:** ${p.stock} ${p.unit}
- **Categorie:** ${p.category?.name || 'N/A'}
- **Status:** ${p.isActive ? '✅ Activ' : '❌ Inactiv'}
- **Descriere:** ${p.description || 'N/A'}
- **Imagini:** ${p.media?.length || 0} fișiere

`;
    });

    markdown += `\n---

## 📂 Categorii

`;

    categories.forEach((c, index) => {
      markdown += `${index + 1}. **${c.name}** (${c.slug})
   - Descriere: ${c.description || 'N/A'}
   - ID: ${c.id}

`;
    });

    markdown += `\n---

## 🖼️ Fișiere Media

`;

    media.forEach((m, index) => {
      markdown += `${index + 1}. **${m.originalName}**
   - Fișier: ${m.filename}
   - Path: ${m.path}
   - Tip: ${m.mimeType}
   - Mărime: ${(m.size / 1024).toFixed(2)} KB

`;
    });

    fs.writeFileSync('../PRODUSE_REALE.md', markdown, 'utf-8');
    console.log('✅ Fișier salvat: PRODUSE_REALE.md\n');

    // Afișează în consolă
    console.log('📋 Produse:');
    products.forEach(p => {
      console.log(`  - ${p.name}: ${p.price} RON (${p.stock} ${p.unit})`);
    });

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

getRealProducts();
