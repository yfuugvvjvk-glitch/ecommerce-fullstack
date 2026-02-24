const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

async function checkSiteConfig() {
  try {
    const result = await pool.query(`
      SELECT key, value 
      FROM "SiteConfig" 
      WHERE key LIKE 'site_name%' OR key LIKE 'about_us%'
      ORDER BY key
    `);
    
    console.log('📝 SITE CONFIG TRANSLATIONS:\n');
    result.rows.forEach(r => {
      const val = r.value.length > 80 ? r.value.substring(0, 80) + '...' : r.value;
      console.log(`${r.key}:`);
      console.log(`  ${val}\n`);
    });
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

checkSiteConfig();
