const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

// Comprehensive translations
const translations = {
  'Ieduții': { en: 'Kids (Young Goats)', de: 'Ziegenlämmer', fr: 'Chevreaux', es: 'Cabritos', it: 'Capretti' },
  'Laptele de măgăriță': { en: 'Donkey Milk', de: 'Eselsmilch', fr: 'Lait d\'ânesse', es: 'Leche de burra', it: 'Latte d\'asina' },
  'Pui de găină': { en: 'Chicken Chicks', de: 'Hühnerküken', fr: 'Poussins', es: 'Pollitos', it: 'Pulcini' },
  'Carnea de ied': { en: 'Kid Meat', de: 'Ziegenfleisch', fr: 'Viande de chevreau', es: 'Carne de cabrito', it: 'Carne di capretto' },
  'Pastramă': { en: 'Pastrami', de: 'Pastrami', fr: 'Pastrami', es: 'Pastrami', it: 'Pastrami' },
  'Prepeliță': { en: 'Quail', de: 'Wachtel', fr: 'Caille', es: 'Codorniz', it: 'Quaglia' },
  'Găinile': { en: 'Hens', de: 'Hühner', fr: 'Poules', es: 'Gallinas', it: 'Galline' },
  'Oua de prepeliță': { en: 'Quail Eggs', de: 'Wachteleier', fr: 'Œufs de caille', es: 'Huevos de codorniz', it: 'Uova di quaglia' },
  'Oua de găină': { en: 'Chicken Eggs', de: 'Hühnereier', fr: 'Œufs de poule', es: 'Huevos de gallina', it: 'Uova di gallina' },
  'Urda de vacă': { en: 'Cow Urda Cheese', de: 'Kuh-Urda-Käse', fr: 'Fromage Urda de vache', es: 'Queso Urda de vaca', it: 'Formaggio Urda di mucca' },
  'Urda de capră': { en: 'Goat Urda Cheese', de: 'Ziegen-Urda-Käse', fr: 'Fromage Urda de chèvre', es: 'Queso Urda de cabra', it: 'Formaggio Urda di capra' },
  'Telemea de capră': { en: 'Goat Telemea Cheese', de: 'Ziegen-Telemea-Käse', fr: 'Fromage Telemea de chèvre', es: 'Queso Telemea de cabra', it: 'Formaggio Telemea di capra' },
  'Telemea de vacă': { en: 'Cow Telemea Cheese', de: 'Kuh-Telemea-Käse', fr: 'Fromage Telemea de vache', es: 'Queso Telemea de vaca', it: 'Formaggio Telemea di mucca' },
  'Lapte de capră': { en: 'Goat Milk', de: 'Ziegenmilch', fr: 'Lait de chèvre', es: 'Leche de cabra', it: 'Latte di capra' },
  'Lapte de vacă': { en: 'Cow Milk', de: 'Kuhmilch', fr: 'Lait de vache', es: 'Leche de vaca', it: 'Latte di mucca' },
  'Carne de pui': { en: 'Chicken Meat', de: 'Hühnerfleisch', fr: 'Viande de poulet', es: 'Carne de pollo', it: 'Carne di pollo' },
  'Carne de prepeliță': { en: 'Quail Meat', de: 'Wachtelfleisch', fr: 'Viande de caille', es: 'Carne de codorniz', it: 'Carne di quaglia' },
  'Casul de vacă măricel': { en: 'Large Cow Fresh Cheese', de: 'Großer Kuh-Frischkäse', fr: 'Grand fromage frais de vache', es: 'Queso fresco de vaca grande', it: 'Grande formaggio fresco di mucca' },
  'Casul de capră mititel': { en: 'Small Goat Fresh Cheese', de: 'Kleiner Ziegen-Frischkäse', fr: 'Petit fromage frais de chèvre', es: 'Queso fresco de cabra pequeño', it: 'Piccolo formaggio fresco di capra' },
  'Casul de vacă mititel': { en: 'Small Cow Fresh Cheese', de: 'Kleiner Kuh-Frischkäse', fr: 'Petit fromage frais de vache', es: 'Queso fresco de vaca pequeño', it: 'Piccolo formaggio fresco di mucca' },
  'Casul de capră maricel': { en: 'Large Goat Fresh Cheese', de: 'Großer Ziegen-Frischkäse', fr: 'Grand fromage frais de chèvre', es: 'Queso fresco de cabra grande', it: 'Grande formaggio fresco di capra' },
};

// Clean HTML tags and special characters
function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp;
    .replace(/&amp;/g, '&')  // Replace &amp;
    .replace(/&lt;/g, '<')   // Replace &lt;
    .replace(/&gt;/g, '>')   // Replace &gt;
    .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
    .trim();
}

function translate(text, lang) {
  if (!text) return text;
  
  const cleanedText = cleanText(text);
  
  // Direct match
  if (translations[cleanedText] && translations[cleanedText][lang]) {
    return translations[cleanedText][lang];
  }
  
  // Partial match
  let result = cleanedText;
  for (const [ro, trans] of Object.entries(translations)) {
    if (cleanedText.includes(ro) && trans[lang]) {
      result = result.replace(ro, trans[lang]);
    }
  }
  
  return result;
}

async function fixAndTranslateAll() {
  try {
    console.log('🔧 CURĂȚARE ȘI TRADUCERE COMPLETĂ\n');

    // 1. Clean and translate Products
    console.log('📦 Curățare și traducere produse...');
    const products = await pool.query('SELECT id, title, description, content FROM "DataItem"');
    
    let fixedCount = 0;
    for (const product of products.rows) {
      // Clean Romanian fields first
      const titleClean = cleanText(product.title);
      const descClean = cleanText(product.description);
      const contentClean = cleanText(product.content);
      
      // Translate to all languages
      const titleEn = translate(titleClean, 'en');
      const titleDe = translate(titleClean, 'de');
      const titleFr = translate(titleClean, 'fr');
      const titleEs = translate(titleClean, 'es');
      const titleIt = translate(titleClean, 'it');

      const descEn = translate(descClean, 'en');
      const descDe = translate(descClean, 'de');
      const descFr = translate(descClean, 'fr');
      const descEs = translate(descClean, 'es');
      const descIt = translate(descClean, 'it');

      const contentEn = translate(contentClean, 'en');
      const contentDe = translate(contentClean, 'de');
      const contentFr = translate(contentClean, 'fr');
      const contentEs = translate(contentClean, 'es');
      const contentIt = translate(contentClean, 'it');

      // Update database with cleaned Romanian + all translations
      await pool.query(`
        UPDATE "DataItem" 
        SET title = $1, description = $2, content = $3,
            "titleEn" = $4, "titleDe" = $5, "titleFr" = $6, "titleEs" = $7, "titleIt" = $8,
            "descriptionEn" = $9, "descriptionDe" = $10, "descriptionFr" = $11, "descriptionEs" = $12, "descriptionIt" = $13,
            "contentEn" = $14, "contentDe" = $15, "contentFr" = $16, "contentEs" = $17, "contentIt" = $18
        WHERE id = $19
      `, [
        titleClean, descClean, contentClean,
        titleEn, titleDe, titleFr, titleEs, titleIt,
        descEn, descDe, descFr, descEs, descIt,
        contentEn, contentDe, contentFr, contentEs, contentIt,
        product.id
      ]);

      if (product.title !== titleClean) {
        console.log(`✅ Curățat: "${product.title}" → "${titleClean}"`);
        fixedCount++;
      }
      console.log(`   EN: ${titleEn}`);
      console.log(`   DE: ${titleDe}`);
      console.log(`   FR: ${titleFr}`);
      console.log(`   ES: ${titleEs}`);
      console.log(`   IT: ${titleIt}\n`);
    }
    console.log(`✅ ${products.rows.length} produse procesate (${fixedCount} curățate)`);

    // 2. Verify all products are translated
    console.log('\n🔍 Verificare finală...');
    const check = await pool.query(`
      SELECT id, title, "titleEn", "titleDe", "titleFr", "titleEs", "titleIt"
      FROM "DataItem"
      WHERE "titleEn" IS NULL OR "titleDe" IS NULL OR "titleFr" IS NULL OR "titleEs" IS NULL OR "titleIt" IS NULL
    `);

    if (check.rows.length > 0) {
      console.log(`⚠️  ${check.rows.length} produse cu traduceri incomplete:`);
      check.rows.forEach(p => {
        console.log(`   - ${p.title}`);
        if (!p.titleEn) console.log(`     ❌ EN lipsește`);
        if (!p.titleDe) console.log(`     ❌ DE lipsește`);
        if (!p.titleFr) console.log(`     ❌ FR lipsește`);
        if (!p.titleEs) console.log(`     ❌ ES lipsește`);
        if (!p.titleIt) console.log(`     ❌ IT lipsește`);
      });
    } else {
      console.log('✅ TOATE produsele au traduceri complete în TOATE limbile!');
    }

    console.log('\n\n✅ CURĂȚARE ȘI TRADUCERE COMPLETĂ!');

  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

fixAndTranslateAll();
