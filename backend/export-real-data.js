const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

async function exportData() {
  try {
    console.log('📦 Conectare la baza de date...\n');

    // Produse
    const products = await pool.query('SELECT * FROM "DataItem" ORDER BY "createdAt" DESC');
    console.log(`✅ ${products.rows.length} produse găsite`);

    // Categorii
    const categories = await pool.query('SELECT * FROM "Category" ORDER BY name');
    console.log(`✅ ${categories.rows.length} categorii găsite`);

    // Locații
    const locations = await pool.query('SELECT * FROM "DeliveryLocation" ORDER BY name');
    console.log(`✅ ${locations.rows.length} locații găsite`);

    // Media
    const media = await pool.query('SELECT * FROM "Media" ORDER BY id DESC');
    console.log(`✅ ${media.rows.length} fișiere media găsite\n`);

    // Salvează în JSON
    const data = {
      exportDate: new Date().toISOString(),
      statistics: {
        products: products.rows.length,
        categories: categories.rows.length,
        locations: locations.rows.length,
        media: media.rows.length
      },
      products: products.rows,
      categories: categories.rows,
      locations: locations.rows,
      media: media.rows
    };

    fs.writeFileSync('../EXPORT_REAL_DATA.json', JSON.stringify(data, null, 2));
    console.log('✅ Date exportate în EXPORT_REAL_DATA.json\n');

    // Afișează produsele
    console.log('📋 PRODUSE REALE:');
    products.rows.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - ${p.price} RON (${p.stock} ${p.unit})`);
    });

    console.log('\n📂 CATEGORII REALE:');
    categories.rows.forEach((c, i) => {
      console.log(`${i+1}. ${c.name} (${c.slug})`);
    });

    console.log('\n📍 LOCAȚII REALE:');
    locations.rows.forEach((l, i) => {
      console.log(`${i+1}. ${l.name} - ${l.address}, ${l.city}`);
    });

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

exportData();
