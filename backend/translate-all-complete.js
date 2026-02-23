const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

// Traduceri complete pentru toate limbile
const translations = {
  // Titluri produse
  titles: {
    'Ieduții': {
      en: 'Kids (Young Goats)',
      de: 'Ziegenlämmer',
      fr: 'Chevreaux',
      es: 'Cabritos',
      it: 'Capretti'
    },
    'Laptele de măgăriță': {
      en: 'Donkey Milk',
      de: 'Eselsmilch',
      fr: 'Lait d\'ânesse',
      es: 'Leche de burra',
      it: 'Latte d\'asina'
    },
    'Pui de găină': {
      en: 'Chicken Chicks',
      de: 'Hühnerküken',
      fr: 'Poussins',
      es: 'Pollitos',
      it: 'Pulcini'
    },
    'Carnea de ied': {
      en: 'Kid Meat',
      de: 'Ziegenfleisch',
      fr: 'Viande de chevreau',
      es: 'Carne de cabrito',
      it: 'Carne di capretto'
    },
    'Pastramă': {
      en: 'Pastrami',
      de: 'Pastrami',
      fr: 'Pastrami',
      es: 'Pastrami',
      it: 'Pastrami'
    },
    'Prepeliță': {
      en: 'Quail',
      de: 'Wachtel',
      fr: 'Caille',
      es: 'Codorniz',
      it: 'Quaglia'
    },
    'Găinile': {
      en: 'Hens',
      de: 'Hühner',
      fr: 'Poules',
      es: 'Gallinas',
      it: 'Galline'
    },
    'Oua de prepeliță': {
      en: 'Quail Eggs',
      de: 'Wachteleier',
      fr: 'Œufs de caille',
      es: 'Huevos de codorniz',
      it: 'Uova di quaglia'
    },
    'Oua de găină': {
      en: 'Chicken Eggs',
      de: 'Hühnereier',
      fr: 'Œufs de poule',
      es: 'Huevos de gallina',
      it: 'Uova di gallina'
    },
    'Urda de vacă': {
      en: 'Cow Urda Cheese',
      de: 'Kuh-Urda-Käse',
      fr: 'Fromage Urda de vache',
      es: 'Queso Urda de vaca',
      it: 'Formaggio Urda di mucca'
    },
    'Urda de capră': {
      en: 'Goat Urda Cheese',
      de: 'Ziegen-Urda-Käse',
      fr: 'Fromage Urda de chèvre',
      es: 'Queso Urda de cabra',
      it: 'Formaggio Urda di capra'
    },
    'Brânză de capră': {
      en: 'Goat Cheese',
      de: 'Ziegenkäse',
      fr: 'Fromage de chèvre',
      es: 'Queso de cabra',
      it: 'Formaggio di capra'
    },
    'Brânză de vacă': {
      en: 'Cow Cheese',
      de: 'Kuhkäse',
      fr: 'Fromage de vache',
      es: 'Queso de vaca',
      it: 'Formaggio di mucca'
    },
    'Lapte de capră': {
      en: 'Goat Milk',
      de: 'Ziegenmilch',
      fr: 'Lait de chèvre',
      es: 'Leche de cabra',
      it: 'Latte di capra'
    },
    'Lapte de vacă': {
      en: 'Cow Milk',
      de: 'Kuhmilch',
      fr: 'Lait de vache',
      es: 'Leche de vaca',
      it: 'Latte di mucca'
    },
    'Carne de capră': {
      en: 'Goat Meat',
      de: 'Ziegenfleisch',
      fr: 'Viande de chèvre',
      es: 'Carne de cabra',
      it: 'Carne di capra'
    },
    'Carne de pasăre': {
      en: 'Poultry Meat',
      de: 'Geflügelfleisch',
      fr: 'Viande de volaille',
      es: 'Carne de ave',
      it: 'Carne di pollame'
    },
    'Telemea': {
      en: 'Telemea Cheese',
      de: 'Telemea-Käse',
      fr: 'Fromage Telemea',
      es: 'Queso Telemea',
      it: 'Formaggio Telemea'
    },
    'Caș': {
      en: 'Fresh Cheese',
      de: 'Frischkäse',
      fr: 'Fromage frais',
      es: 'Queso fresco',
      it: 'Formaggio fresco'
    }
  },
  
  // Descrieri comune
  descriptions: {
    'Ieduți vii': {
      en: 'Live kids (young goats)',
      de: 'Lebende Ziegenlämmer',
      fr: 'Chevreaux vivants',
      es: 'Cabritos vivos',
      it: 'Capretti vivi'
    },
    'Sănătoși, bine îngrijiți, energici, crescuți natural': {
      en: 'Healthy, well-cared for, energetic, naturally raised',
      de: 'Gesund, gut gepflegt, energisch, natürlich aufgezogen',
      fr: 'Sains, bien soignés, énergiques, élevés naturellement',
      es: 'Sanos, bien cuidados, enérgicos, criados naturalmente',
      it: 'Sani, ben curati, energici, allevati naturalmente'
    },
    'Perfecți pentru Paști sau pentru gospodărie': {
      en: 'Perfect for Easter or for the household',
      de: 'Perfekt für Ostern oder für den Haushalt',
      fr: 'Parfaits pour Pâques ou pour le ménage',
      es: 'Perfectos para Pascua o para el hogar',
      it: 'Perfetti per Pasqua o per la casa'
    }
  }
};

function translateText(text, lang) {
  if (!text) return text;
  
  let translated = text;
  
  // Traduce titlurile
  for (const [ro, trans] of Object.entries(translations.titles)) {
    if (text.includes(ro) && trans[lang]) {
      translated = translated.replace(ro, trans[lang]);
    }
  }
  
  // Traduce descrierile
  for (const [ro, trans] of Object.entries(translations.descriptions)) {
    if (text.includes(ro) && trans[lang]) {
      translated = translated.replace(ro, trans[lang]);
    }
  }
  
  return translated;
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

async function translateAll() {
  try {
    console.log('🌐 Traducere COMPLETĂ în TOATE limbile...\n');

    const result = await pool.query('SELECT id, title, description, content FROM "DataItem"');
    const products = result.rows;

    console.log(`📦 ${products.length} produse\n`);

    for (const product of products) {
      const titleClean = stripHtml(product.title);
      const descClean = stripHtml(product.description);
      const contentClean = stripHtml(product.content);

      // Traduce în toate limbile
      const titleEn = translateText(titleClean, 'en');
      const titleDe = translateText(titleClean, 'de');
      const titleFr = translateText(titleClean, 'fr');
      const titleEs = translateText(titleClean, 'es');
      const titleIt = translateText(titleClean, 'it');

      const descEn = translateText(descClean, 'en');
      const descDe = translateText(descClean, 'de');
      const descFr = translateText(descClean, 'fr');
      const descEs = translateText(descClean, 'es');
      const descIt = translateText(descClean, 'it');

      const contentEn = translateText(contentClean, 'en');
      const contentDe = translateText(contentClean, 'de');
      const contentFr = translateText(contentClean, 'fr');
      const contentEs = translateText(contentClean, 'es');
      const contentIt = translateText(contentClean, 'it');

      await pool.query(`
        UPDATE "DataItem" 
        SET "titleEn" = $1, "titleDe" = $2, "titleFr" = $3, "titleEs" = $4, "titleIt" = $5,
            "descriptionEn" = $6, "descriptionDe" = $7, "descriptionFr" = $8, "descriptionEs" = $9, "descriptionIt" = $10,
            "contentEn" = $11, "contentDe" = $12, "contentFr" = $13, "contentEs" = $14, "contentIt" = $15
        WHERE id = $16
      `, [
        titleEn, titleDe, titleFr, titleEs, titleIt,
        descEn, descDe, descFr, descEs, descIt,
        contentEn, contentDe, contentFr, contentEs, contentIt,
        product.id
      ]);

      console.log(`✅ ${titleClean}`);
      console.log(`   EN: ${titleEn}`);
      console.log(`   DE: ${titleDe}`);
      console.log(`   FR: ${titleFr}`);
      console.log(`   ES: ${titleEs}`);
      console.log(`   IT: ${titleIt}\n`);
    }

    console.log('✅ TOATE produsele traduse în TOATE limbile!');

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

translateAll();
