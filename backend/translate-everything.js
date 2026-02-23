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
  // Products
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
  
  // Categories
  'Branză': { en: 'Cheese', de: 'Käse', fr: 'Fromage', es: 'Queso', it: 'Formaggio' },
  'Lapte': { en: 'Milk', de: 'Milch', fr: 'Lait', es: 'Leche', it: 'Latte' },
  'Ouă': { en: 'Eggs', de: 'Eier', fr: 'Œufs', es: 'Huevos', it: 'Uova' },
  'Carne': { en: 'Meat', de: 'Fleisch', fr: 'Viande', es: 'Carne', it: 'Carne' },
  'Animale vii': { en: 'Live Animals', de: 'Lebende Tiere', fr: 'Animaux vivants', es: 'Animales vivos', it: 'Animali vivi' },
  'Branză de capră': { en: 'Goat Cheese', de: 'Ziegenkäse', fr: 'Fromage de chèvre', es: 'Queso de cabra', it: 'Formaggio di capra' },
  'Branză de vacă': { en: 'Cow Cheese', de: 'Kuhkäse', fr: 'Fromage de vache', es: 'Queso de vaca', it: 'Formaggio di mucca' },
  'Lapte de capră': { en: 'Goat Milk', de: 'Ziegenmilch', fr: 'Lait de chèvre', es: 'Leche de cabra', it: 'Latte di capra' },
  'Lapte de vacă': { en: 'Cow Milk', de: 'Kuhmilch', fr: 'Lait de vache', es: 'Leche de vaca', it: 'Latte di mucca' },
  'Lapte de măgăriță': { en: 'Donkey Milk', de: 'Eselsmilch', fr: 'Lait d\'ânesse', es: 'Leche de burra', it: 'Latte d\'asina' },
  'Ouă de găină': { en: 'Chicken Eggs', de: 'Hühnereier', fr: 'Œufs de poule', es: 'Huevos de gallina', it: 'Uova di gallina' },
  'Ouă de prepeliță': { en: 'Quail Eggs', de: 'Wachteleier', fr: 'Œufs de caille', es: 'Huevos de codorniz', it: 'Uova di quaglia' },
  'Carne de capră': { en: 'Goat Meat', de: 'Ziegenfleisch', fr: 'Viande de chèvre', es: 'Carne de cabra', it: 'Carne di capra' },
  'Carne de pasăre': { en: 'Poultry Meat', de: 'Geflügelfleisch', fr: 'Viande de volaille', es: 'Carne de ave', it: 'Carne di pollame' },
  
  // Delivery Locations
  'Sediul Firmei': { en: 'Company Headquarters', de: 'Firmensitz', fr: 'Siège social', es: 'Sede de la empresa', it: 'Sede aziendale' },
  'În Galați': { en: 'In Galați', de: 'In Galați', fr: 'À Galați', es: 'En Galați', it: 'A Galați' },
  'Limitrofe': { en: 'Surrounding Areas', de: 'Umgebung', fr: 'Zones limitrophes', es: 'Zonas limítrofes', it: 'Zone limitrofe' },
  
  // Carousel
  'DIN OGRADA MEA- DIRECT PE MASA TA': { 
    en: 'FROM MY FARM - DIRECTLY TO YOUR TABLE', 
    de: 'VON MEINEM HOF - DIREKT AUF IHREN TISCH', 
    fr: 'DE MA FERME - DIRECTEMENT SUR VOTRE TABLE', 
    es: 'DE MI GRANJA - DIRECTAMENTE A TU MESA', 
    it: 'DALLA MIA FATTORIA - DIRETTAMENTE SULLA TUA TAVOLA' 
  },
  
  // Gift Rules
  'Comanda de peste 400 de lei': { 
    en: 'Order over 400 lei', 
    de: 'Bestellung über 400 Lei', 
    fr: 'Commande de plus de 400 lei', 
    es: 'Pedido de más de 400 lei', 
    it: 'Ordine superiore a 400 lei' 
  }
};

function translate(text, lang) {
  if (!text) return text;
  
  // Direct match
  if (translations[text] && translations[text][lang]) {
    return translations[text][lang];
  }
  
  // Partial match
  for (const [ro, trans] of Object.entries(translations)) {
    if (text.includes(ro) && trans[lang]) {
      text = text.replace(ro, trans[lang]);
    }
  }
  
  return text;
}

async function translateEverything() {
  try {
    console.log('🌐 TRADUCERE COMPLETĂ ÎN TOATE LIMBILE\n');

    // 1. Translate Products
    console.log('📦 Traducere produse...');
    const products = await pool.query('SELECT id, title, description, content FROM "DataItem"');
    
    for (const product of products.rows) {
      const titleEn = translate(product.title, 'en');
      const titleDe = translate(product.title, 'de');
      const titleFr = translate(product.title, 'fr');
      const titleEs = translate(product.title, 'es');
      const titleIt = translate(product.title, 'it');

      await pool.query(`
        UPDATE "DataItem" 
        SET "titleEn" = $1, "titleDe" = $2, "titleFr" = $3, "titleEs" = $4, "titleIt" = $5
        WHERE id = $6
      `, [titleEn, titleDe, titleFr, titleEs, titleIt, product.id]);
    }
    console.log(`✅ ${products.rows.length} produse traduse`);

    // 2. Translate Categories
    console.log('\n📂 Traducere categorii...');
    const categories = await pool.query('SELECT id, name FROM "Category"');
    
    for (const cat of categories.rows) {
      const nameEn = translate(cat.name, 'en');
      const nameDe = translate(cat.name, 'de');
      const nameFr = translate(cat.name, 'fr');
      const nameEs = translate(cat.name, 'es');
      const nameIt = translate(cat.name, 'it');

      await pool.query(`
        UPDATE "Category" 
        SET "nameEn" = $1, "nameDe" = $2, "nameFr" = $3, "nameEs" = $4, "nameIt" = $5
        WHERE id = $6
      `, [nameEn, nameDe, nameFr, nameEs, nameIt, cat.id]);
    }
    console.log(`✅ ${categories.rows.length} categorii traduse`);

    // 3. Translate Delivery Locations
    console.log('\n📍 Traducere locații livrare...');
    const locations = await pool.query('SELECT id, name, "specialInstructions" FROM "DeliveryLocation"');
    
    for (const loc of locations.rows) {
      const nameEn = translate(loc.name, 'en');
      const nameDe = translate(loc.name, 'de');
      const nameFr = translate(loc.name, 'fr');
      const nameEs = translate(loc.name, 'es');
      const nameIt = translate(loc.name, 'it');

      await pool.query(`
        UPDATE "DeliveryLocation" 
        SET "nameEn" = $1, "nameDe" = $2, "nameFr" = $3, "nameEs" = $4, "nameIt" = $5
        WHERE id = $6
      `, [nameEn, nameDe, nameFr, nameEs, nameIt, loc.id]);
    }
    console.log(`✅ ${locations.rows.length} locații traduse`);

    // 4. Translate Carousel Items
    console.log('\n🎠 Traducere carousel...');
    const carousel = await pool.query('SELECT id, "customTitle", "customDescription" FROM "CarouselItem"');
    
    for (const item of carousel.rows) {
      if (item.customTitle) {
        const titleEn = translate(item.customTitle, 'en');
        const titleDe = translate(item.customTitle, 'de');
        const titleFr = translate(item.customTitle, 'fr');
        const titleEs = translate(item.customTitle, 'es');
        const titleIt = translate(item.customTitle, 'it');

        await pool.query(`
          UPDATE "CarouselItem" 
          SET "customTitleEn" = $1, "customTitleDe" = $2, "customTitleFr" = $3, 
              "customTitleEs" = $4, "customTitleIt" = $5
          WHERE id = $6
        `, [titleEn, titleDe, titleFr, titleEs, titleIt, item.id]);
      }
    }
    console.log(`✅ ${carousel.rows.length} carousel items traduse`);

    // 5. Translate Gift Rules
    console.log('\n🎁 Traducere reguli cadouri...');
    const giftRules = await pool.query('SELECT id, name, description FROM "GiftRule"');
    
    for (const rule of giftRules.rows) {
      const nameEn = translate(rule.name, 'en');
      const nameDe = translate(rule.name, 'de');
      const nameFr = translate(rule.name, 'fr');
      const nameEs = translate(rule.name, 'es');
      const nameIt = translate(rule.name, 'it');

      await pool.query(`
        UPDATE "GiftRule" 
        SET "nameEn" = $1, "nameDe" = $2, "nameFr" = $3, "nameEs" = $4, "nameIt" = $5
        WHERE id = $6
      `, [nameEn, nameDe, nameFr, nameEs, nameIt, rule.id]);
    }
    console.log(`✅ ${giftRules.rows.length} reguli cadouri traduse`);

    console.log('\n\n✅ TOATE TRADUCERILE COMPLETE!');
    console.log('📦 Produse: ✅');
    console.log('📂 Categorii: ✅');
    console.log('📍 Locații: ✅');
    console.log('🎠 Carousel: ✅');
    console.log('🎁 Reguli cadouri: ✅');

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

translateEverything();
