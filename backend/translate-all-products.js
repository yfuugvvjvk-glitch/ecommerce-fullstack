const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

// Funcție simplă de traducere (poți integra cu API de traducere)
function translateToEnglish(text) {
  const translations = {
    'Ieduții': 'Kids (Young Goats)',
    'Laptele de măgăriță': 'Donkey Milk',
    'Pui de găină': 'Chicken Chicks',
    'Carnea de ied': 'Kid Meat',
    'Pastramă': 'Pastrami',
    'Prepeliță': 'Quail',
    'Găinile': 'Hens',
    'Oua de prepeliță': 'Quail Eggs',
    'Oua de găină': 'Chicken Eggs',
    'Urda de vacă': 'Cow Urda Cheese',
    'Urda de capră': 'Goat Urda Cheese',
    'Brânză de capră': 'Goat Cheese',
    'Brânză de vacă': 'Cow Cheese',
    'Lapte de capră': 'Goat Milk',
    'Lapte de vacă': 'Cow Milk',
    'Carne de capră': 'Goat Meat',
    'Carne de pasăre': 'Poultry Meat',
  };
  
  // Încearcă să găsească traducerea exactă
  for (const [ro, en] of Object.entries(translations)) {
    if (text.includes(ro)) {
      return text.replace(ro, en);
    }
  }
  
  return text; // Returnează textul original dacă nu găsește traducere
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

async function translateProducts() {
  try {
    console.log('🌐 Începe traducerea produselor...\n');

    // Obține toate produsele
    const result = await pool.query('SELECT id, title, description, content FROM "DataItem"');
    const products = result.rows;

    console.log(`📦 Găsite ${products.length} produse de tradus\n`);

    let updated = 0;

    for (const product of products) {
      const titleClean = stripHtml(product.title);
      const descriptionClean = stripHtml(product.description);
      const contentClean = stripHtml(product.content);

      // Traduceri simple (poți îmbunătăți cu API de traducere)
      const titleEn = translateToEnglish(titleClean);
      const descriptionEn = descriptionClean; // Păstrează descrierea în română pentru moment
      const contentEn = contentClean;

      // Actualizează în baza de date
      await pool.query(`
        UPDATE "DataItem" 
        SET "titleEn" = $1, 
            "descriptionEn" = $2, 
            "contentEn" = $3,
            "titleDe" = $1,
            "titleFr" = $1,
            "titleEs" = $1,
            "titleIt" = $1
        WHERE id = $4
      `, [titleEn, descriptionEn, contentEn, product.id]);

      console.log(`✅ ${titleClean} → ${titleEn}`);
      updated++;
    }

    console.log(`\n✅ ${updated} produse actualizate cu traduceri!`);

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

translateProducts();
