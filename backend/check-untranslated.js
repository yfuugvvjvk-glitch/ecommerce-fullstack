const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

async function checkUntranslated() {
  try {
    console.log('🔍 VERIFICARE ELEMENTE NETRADUSE\n');

    // Check SiteConfig
    const config = await pool.query('SELECT key, value FROM "SiteConfig"');
    console.log('📝 SITE CONFIG:');
    config.rows.forEach(c => {
      const val = c.value.length > 80 ? c.value.substring(0, 80) + '...' : c.value;
      console.log(`  ${c.key}: ${val}`);
    });

    // Check Vouchers
    const vouchers = await pool.query('SELECT code, description FROM "Voucher"');
    console.log('\n🎟️ VOUCHERS:');
    vouchers.rows.forEach(v => {
      console.log(`  ${v.code}: ${v.description || 'N/A'}`);
    });

    // Check Payment Methods
    const payments = await pool.query(`
      SELECT name, description, "nameEn", "nameDe", "nameFr", "nameEs", "nameIt",
             "descriptionEn", "descriptionDe"
      FROM "PaymentMethod"
    `);
    console.log('\n💳 PAYMENT METHODS:');
    payments.rows.forEach(p => {
      console.log(`\n  ${p.name}`);
      console.log(`    EN: ${p.nameEn || '❌ NOT TRANSLATED'}`);
      console.log(`    DE: ${p.nameDe || '❌ NOT TRANSLATED'}`);
      console.log(`    FR: ${p.nameFr || '❌ NOT TRANSLATED'}`);
      console.log(`    Descriere: ${p.description || 'N/A'}`);
      console.log(`    Descriere EN: ${p.descriptionEn || '❌ NOT TRANSLATED'}`);
    });

    // Check Carousel descriptions
    const carousel = await pool.query(`
      SELECT id, "customTitle", "customDescription", 
             "customDescriptionEn", "customDescriptionDe", "customDescriptionFr"
      FROM "CarouselItem"
      WHERE "customDescription" IS NOT NULL
      LIMIT 3
    `);
    console.log('\n🎠 CAROUSEL DESCRIPTIONS:');
    carousel.rows.forEach(c => {
      console.log(`\n  ${c.customTitle || 'No title'}`);
      console.log(`    RO: ${c.customDescription || 'N/A'}`);
      console.log(`    EN: ${c.customDescriptionEn || '❌ NOT TRANSLATED'}`);
      console.log(`    DE: ${c.customDescriptionDe || '❌ NOT TRANSLATED'}`);
    });

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

checkUntranslated();
