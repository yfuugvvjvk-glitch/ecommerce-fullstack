const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

async function checkMissingTranslations() {
  try {
    console.log('🔍 VERIFICARE PRODUSE NETRADUSE\n');

    const result = await pool.query(`
      SELECT id, title, "titleEn", "titleDe", "titleFr", "titleEs", "titleIt"
      FROM "DataItem"
      WHERE "titleEn" IS NULL OR "titleDe" IS NULL OR "titleFr" IS NULL 
         OR "titleEs" IS NULL OR "titleIt" IS NULL
         OR "titleEn" = title OR "titleDe" = title
    `);

    if (result.rows.length === 0) {
      console.log('✅ TOATE produsele sunt traduse complet!\n');
    } else {
      console.log(`❌ ${result.rows.length} produse cu traduceri incomplete:\n`);
      
      result.rows.forEach(p => {
        console.log(`📦 ${p.title}`);
        if (!p.titleEn || p.titleEn === p.title) console.log('   ❌ EN lipsește sau e identic cu RO');
        if (!p.titleDe || p.titleDe === p.title) console.log('   ❌ DE lipsește sau e identic cu RO');
        if (!p.titleFr || p.titleFr === p.title) console.log('   ❌ FR lipsește sau e identic cu RO');
        if (!p.titleEs || p.titleEs === p.title) console.log('   ❌ ES lipsește sau e identic cu RO');
        if (!p.titleIt || p.titleIt === p.title) console.log('   ❌ IT lipsește sau e identic cu RO');
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

checkMissingTranslations();
