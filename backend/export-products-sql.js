const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportProductsSQL() {
  try {
    console.log('📦 Exportând produse din baza de date...\n');

    // Obține toate produsele
    const products = await prisma.product.findMany({
      include: {
        category: true,
        media: true,
        variants: true
      }
    });

    const categories = await prisma.category.findMany();
    const media = await prisma.media.findMany();

    console.log(`✅ Găsite ${products.length} produse`);
    console.log(`✅ Găsite ${categories.length} categorii`);
    console.log(`✅ Găsite ${media.length} fișiere media\n`);

    // Creează SQL dump
    let sqlDump = `-- ================================================
-- DUMP PRODUSE - Baza de Date E-Commerce
-- Data: ${new Date().toISOString()}
-- ================================================

-- Categorii
`;

    categories.forEach(cat => {
      sqlDump += `INSERT INTO "Category" (id, name, slug, description, "parentId", "createdAt", "updatedAt") VALUES 
('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', ${cat.description ? `'${cat.description.replace(/'/g, "''")}'` : 'NULL'}, ${cat.parentId ? `'${cat.parentId}'` : 'NULL'}, '${cat.createdAt.toISOString()}', '${cat.updatedAt.toISOString()}');\n`;
    });

    sqlDump += `\n-- Media\n`;
    media.forEach(m => {
      sqlDump += `INSERT INTO "Media" (id, filename, "originalName", "mimeType", size, path, "uploadedAt") VALUES 
('${m.id}', '${m.filename}', '${m.originalName.replace(/'/g, "''")}', '${m.mimeType}', ${m.size}, '${m.path}', '${m.uploadedAt.toISOString()}');\n`;
    });

    sqlDump += `\n-- Produse\n`;
    products.forEach(p => {
      sqlDump += `INSERT INTO "Product" (id, name, description, price, stock, unit, "categoryId", "isActive", "createdAt", "updatedAt") VALUES 
('${p.id}', '${p.name.replace(/'/g, "''")}', ${p.description ? `'${p.description.replace(/'/g, "''")}'` : 'NULL'}, ${p.price}, ${p.stock}, '${p.unit}', ${p.categoryId ? `'${p.categoryId}'` : 'NULL'}, ${p.isActive}, '${p.createdAt.toISOString()}', '${p.updatedAt.toISOString()}');\n`;
    });

    // Salvează SQL
    fs.writeFileSync('database-products.sql', sqlDump, 'utf-8');
    console.log('✅ SQL dump salvat în database-products.sql\n');

    // Creează și JSON pentru vizualizare ușoară
    const jsonExport = {
      exportDate: new Date().toISOString(),
      statistics: {
        products: products.length,
        categories: categories.length,
        media: media.length
      },
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        unit: p.unit,
        category: p.category?.name || 'N/A',
        isActive: p.isActive,
        images: p.media?.map(m => m.filename) || []
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description
      })),
      media: media.map(m => ({
        id: m.id,
        filename: m.filename,
        originalName: m.originalName,
        path: m.path
      }))
    };

    fs.writeFileSync('database-products.json', JSON.stringify(jsonExport, null, 2), 'utf-8');
    console.log('✅ JSON export salvat în database-products.json\n');

    // Afișează câteva exemple
    console.log('📊 Exemple de produse:\n');
    products.slice(0, 5).forEach(p => {
      console.log(`  - ${p.name}: ${p.price} RON (Stock: ${p.stock} ${p.unit})`);
    });

  } catch (error) {
    console.error('❌ Eroare:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportProductsSQL();
