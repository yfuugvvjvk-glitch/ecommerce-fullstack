const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

async function checkTranslations() {
  try {
    console.log('🌐 VERIFICARE TRADUCERI\n');

    // Check products
    const products = await pool.query(`
      SELECT id, title, "titleEn", "titleDe", "titleFr", "titleEs", "titleIt",
             description, "descriptionEn", "descriptionDe"
      FROM "DataItem" 
      LIMIT 5
    `);
    
    console.log('📦 PRODUSE (primele 5):');
    products.rows.forEach(p => {
      console.log(`\n${p.title}`);
      console.log(`  EN: ${p.titleEn || '❌ NOT TRANSLATED'}`);
      console.log(`  DE: ${p.titleDe || '❌ NOT TRANSLATED'}`);
      console.log(`  FR: ${p.titleFr || '❌ NOT TRANSLATED'}`);
      console.log(`  ES: ${p.titleEs || '❌ NOT TRANSLATED'}`);
      console.log(`  IT: ${p.titleIt || '❌ NOT TRANSLATED'}`);
    });

    // Check carousel
    const carousel = await pool.query(`
      SELECT id, type, position, "customTitle", "customTitleEn", "customTitleDe", 
             "customTitleFr", "customTitleEs", "customTitleIt", "isActive"
      FROM "CarouselItem" 
      ORDER BY position
    `);
    
    console.log(`\n\n🎠 CAROUSEL ITEMS: ${carousel.rows.length}`);
    carousel.rows.forEach(item => {
      console.log(`\n${item.position}. ${item.customTitle || 'No title'} - ${item.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   EN: ${item.customTitleEn || '❌ NOT TRANSLATED'}`);
      console.log(`   DE: ${item.customTitleDe || '❌ NOT TRANSLATED'}`);
      console.log(`   FR: ${item.customTitleFr || '❌ NOT TRANSLATED'}`);
    });

    // Check delivery locations
    const locations = await pool.query(`
      SELECT id, name, "nameEn", "nameDe", "nameFr", "nameEs", "nameIt",
             "specialInstructions", "specialInstructionsEn", "specialInstructionsDe"
      FROM "DeliveryLocation"
    `);
    
    console.log(`\n\n📍 LOCAȚII LIVRARE: ${locations.rows.length}`);
    locations.rows.forEach(loc => {
      console.log(`\n${loc.name}`);
      console.log(`  EN: ${loc.nameEn || '❌ NOT TRANSLATED'}`);
      console.log(`  DE: ${loc.nameDe || '❌ NOT TRANSLATED'}`);
      console.log(`  FR: ${loc.nameFr || '❌ NOT TRANSLATED'}`);
      console.log(`  ES: ${loc.nameEs || '❌ NOT TRANSLATED'}`);
      console.log(`  IT: ${loc.nameIt || '❌ NOT TRANSLATED'}`);
    });

    // Check categories
    const categories = await pool.query(`
      SELECT id, name, "nameEn", "nameDe", "nameFr", "nameEs", "nameIt"
      FROM "Category"
      WHERE "parentId" IS NULL
      LIMIT 5
    `);
    
    console.log(`\n\n📂 CATEGORII PRINCIPALE:`);
    categories.rows.forEach(cat => {
      console.log(`\n${cat.name}`);
      console.log(`  EN: ${cat.nameEn || '❌ NOT TRANSLATED'}`);
      console.log(`  DE: ${cat.nameDe || '❌ NOT TRANSLATED'}`);
      console.log(`  FR: ${cat.nameFr || '❌ NOT TRANSLATED'}`);
    });

    // Check pages
    const pages = await pool.query(`
      SELECT id, slug, title
      FROM "Page"
    `);
    
    console.log(`\n\n📄 PAGINI: ${pages.rows.length}`);
    pages.rows.forEach(page => {
      console.log(`- ${page.slug}: ${page.title}`);
    });

    // Check gift rules
    const giftRules = await pool.query(`
      SELECT id, name, "nameEn", "nameDe", "nameFr", "nameEs", "nameIt",
             description, "descriptionEn"
      FROM "GiftRule"
      LIMIT 3
    `);
    
    console.log(`\n\n🎁 REGULI CADOURI: ${giftRules.rows.length}`);
    giftRules.rows.forEach(rule => {
      console.log(`\n${rule.name}`);
      console.log(`  EN: ${rule.nameEn || '❌ NOT TRANSLATED'}`);
      console.log(`  DE: ${rule.nameDe || '❌ NOT TRANSLATED'}`);
    });

    console.log('\n\n✅ Verificare completă!');

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

checkTranslations();
