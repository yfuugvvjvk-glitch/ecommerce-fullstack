const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

async function checkUrda() {
  try {
    const result = await pool.query(`
      SELECT id, title, description, "descriptionEn", "descriptionDe", "descriptionFr"
      FROM "DataItem" 
      WHERE title LIKE '%Urda%'
    `);
    
    console.log('🔍 PRODUSE URDA:\n');
    result.rows.forEach(p => {
      console.log(`${p.title}`);
      console.log(`  RO: ${p.description ? p.description.substring(0, 100) : 'N/A'}...`);
      console.log(`  EN: ${p.descriptionEn ? p.descriptionEn.substring(0, 100) : '❌ NOT TRANSLATED'}...`);
      console.log(`  DE: ${p.descriptionDe ? p.descriptionDe.substring(0, 100) : '❌ NOT TRANSLATED'}...`);
      console.log(`  FR: ${p.descriptionFr ? p.descriptionFr.substring(0, 100) : '❌ NOT TRANSLATED'}...\n`);
    });
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

checkUrda();
