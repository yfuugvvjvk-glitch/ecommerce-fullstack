const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

const translations = {
  'Urda - o alegere excelentă pentru un stil de viață echilibrat.Doar lapte, pricepere și tradiție.': {
    en: 'Urda - an excellent choice for a balanced lifestyle. Only milk, skill and tradition.',
    de: 'Urda - eine ausgezeichnete Wahl für einen ausgewogenen Lebensstil. Nur Milch, Können und Tradition.',
    fr: 'Urda - un excellent choix pour un mode de vie équilibré. Seulement du lait, du savoir-faire et de la tradition.',
    es: 'Urda - una excelente opción para un estilo de vida equilibrado. Solo leche, habilidad y tradición.',
    it: 'Urda - una scelta eccellente per uno stile di vita equilibrato. Solo latte, abilità e tradizione.'
  },
  'Urda de capră o brânză ușoară, cremoasă, cu o aromă blândă și naturală, perfectă pentru cei care apreciază simplitatea adevărată. O alegere excelentă pentru cei care vor să mănânce sănătos fără să renunțe la gust. Săracă în grăsimi, bogată în proteine': {
    en: 'Goat Urda is a light, creamy cheese with a mild and natural aroma, perfect for those who appreciate true simplicity. An excellent choice for those who want to eat healthy without giving up taste. Low in fat, rich in protein',
    de: 'Ziegen-Urda ist ein leichter, cremiger Käse mit einem milden und natürlichen Aroma, perfekt für diejenigen, die wahre Einfachheit schätzen. Eine ausgezeichnete Wahl für diejenigen, die gesund essen möchten, ohne auf Geschmack zu verzichten. Fettarm, proteinreich',
    fr: 'L\'Urda de chèvre est un fromage léger et crémeux avec un arôme doux et naturel, parfait pour ceux qui apprécient la vraie simplicité. Un excellent choix pour ceux qui veulent manger sainement sans renoncer au goût. Faible en gras, riche en protéines',
    es: 'El Urda de cabra es un queso ligero y cremoso con un aroma suave y natural, perfecto para quienes aprecian la verdadera simplicidad. Una excelente opción para quienes quieren comer saludable sin renunciar al sabor. Bajo en grasas, rico en proteínas',
    it: 'L\'Urda di capra è un formaggio leggero e cremoso con un aroma delicato e naturale, perfetto per chi apprezza la vera semplicità. Una scelta eccellente per chi vuole mangiare sano senza rinunciare al gusto. Povero di grassi, ricco di proteine'
  }
};

function translateDescription(text, lang) {
  if (!text) return text;
  
  // Try exact match first
  for (const [ro, trans] of Object.entries(translations)) {
    if (text.includes(ro) && trans[lang]) {
      return text.replace(ro, trans[lang]);
    }
  }
  
  // If no match, try partial translations
  let result = text;
  
  // Common phrases
  const phrases = {
    'o alegere excelentă pentru un stil de viață echilibrat': {
      en: 'an excellent choice for a balanced lifestyle',
      de: 'eine ausgezeichnete Wahl für einen ausgewogenen Lebensstil',
      fr: 'un excellent choix pour un mode de vie équilibré',
      es: 'una excelente opción para un estilo de vida equilibrado',
      it: 'una scelta eccellente per uno stile di vita equilibrato'
    },
    'Doar lapte, pricepere și tradiție': {
      en: 'Only milk, skill and tradition',
      de: 'Nur Milch, Können und Tradition',
      fr: 'Seulement du lait, du savoir-faire et de la tradition',
      es: 'Solo leche, habilidad y tradición',
      it: 'Solo latte, abilità e tradizione'
    },
    'o brânză ușoară, cremoasă, cu o aromă blândă și naturală': {
      en: 'a light, creamy cheese with a mild and natural aroma',
      de: 'ein leichter, cremiger Käse mit einem milden und natürlichen Aroma',
      fr: 'un fromage léger et crémeux avec un arôme doux et naturel',
      es: 'un queso ligero y cremoso con un aroma suave y natural',
      it: 'un formaggio leggero e cremoso con un aroma delicato e naturale'
    },
    'perfectă pentru cei care apreciază simplitatea adevărată': {
      en: 'perfect for those who appreciate true simplicity',
      de: 'perfekt für diejenigen, die wahre Einfachheit schätzen',
      fr: 'parfait pour ceux qui apprécient la vraie simplicité',
      es: 'perfecto para quienes aprecian la verdadera simplicidad',
      it: 'perfetto per chi apprezza la vera semplicità'
    },
    'Săracă în grăsimi, bogată în proteine': {
      en: 'Low in fat, rich in protein',
      de: 'Fettarm, proteinreich',
      fr: 'Faible en gras, riche en protéines',
      es: 'Bajo en grasas, rico en proteínas',
      it: 'Povero di grassi, ricco di proteine'
    }
  };
  
  for (const [ro, trans] of Object.entries(phrases)) {
    if (result.includes(ro) && trans[lang]) {
      result = result.replace(ro, trans[lang]);
    }
  }
  
  return result;
}

async function translateUrda() {
  try {
    console.log('🌐 TRADUCERE PRODUSE URDA\n');

    const products = await pool.query(`
      SELECT id, title, description 
      FROM "DataItem" 
      WHERE title LIKE '%Urda%'
    `);

    for (const product of products.rows) {
      const descEn = translateDescription(product.description, 'en');
      const descDe = translateDescription(product.description, 'de');
      const descFr = translateDescription(product.description, 'fr');
      const descEs = translateDescription(product.description, 'es');
      const descIt = translateDescription(product.description, 'it');

      await pool.query(`
        UPDATE "DataItem" 
        SET "descriptionEn" = $1, "descriptionDe" = $2, "descriptionFr" = $3,
            "descriptionEs" = $4, "descriptionIt" = $5
        WHERE id = $6
      `, [descEn, descDe, descFr, descEs, descIt, product.id]);

      console.log(`✅ ${product.title}`);
      console.log(`   EN: ${descEn.substring(0, 80)}...`);
      console.log(`   DE: ${descDe.substring(0, 80)}...`);
      console.log(`   FR: ${descFr.substring(0, 80)}...\n`);
    }

    console.log('✅ Toate produsele Urda traduse!');

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

translateUrda();
