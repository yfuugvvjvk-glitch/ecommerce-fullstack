const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

// Traduceri pentru descrieri comune
const descriptionTranslations = {
  'Ieduți vii': 'Live kids (young goats)',
  'Sănătoși, bine îngrijiți, energici, crescuți natural': 'Healthy, well-cared for, energetic, naturally raised',
  'Perfecți pentru Paști sau pentru gospodărie': 'Perfect for Easter or for the household',
  'Alege laptele de măgăriță direct de la sursă': 'Choose donkey milk directly from the source',
  'Muls cu grijă, în cantități mici, păstrat proaspăt și natural': 'Carefully milked, in small quantities, kept fresh and natural',
  'capabil să întărească imunitatea, să susțină digestia, să hidrateaze pielea și să ofere un plus de vitalitate': 'capable of strengthening immunity, supporting digestion, hydrating the skin and providing extra vitality',
  'Ideal pentru copii și bătrâni': 'Ideal for children and the elderly',
  'Pui de găină robuști, activi, obișnuiți cu mediul din gospodărie': 'Robust, active chicken chicks, accustomed to the household environment',
  'Rase mixte, rezistente ,ideale pentru cei care vor să-și mărească efectivul cu păsări sănătoase': 'Mixed breeds, resistant, ideal for those who want to increase their flock with healthy birds',
  'Carnea de ied inseamnă tradiție, prospețime, sărbătoare': 'Kid meat means tradition, freshness, celebration',
  'Iezii noștri sunt crescuți cu grijă': 'Our kids are raised with care',
  'într-o gospodăria unde natura dictează ritmul': 'in a household where nature dictates the rhythm',
  'Sunt hrăniți natural, îngrijiți cu atenție': 'They are naturally fed, carefully cared for',
  'carne fragedă, gustoasă, ușor de gătit și perfectă pentru rețetele tradiționale': 'tender, tasty meat, easy to cook and perfect for traditional recipes',
  'oferind gustul curat al Paștelui': 'offering the pure taste of Easter',
  'O pastramă cu aromă intensă, textură fragedă și gust autentic': 'A pastrami with intense aroma, tender texture and authentic taste',
  'Este condimentată natural, afumată lent, pregătită ca odinioară': 'It is naturally seasoned, slowly smoked, prepared as in the old days',
  'Nu e doar un preparat. E o poveste. E un obicei': 'It\'s not just a dish. It\'s a story. It\'s a tradition',
  'Gust puternic. Aromă intensă. Prospețime garantată': 'Strong taste. Intense aroma. Guaranteed freshness',
  'Prepelițele noastre sunt crescute în condiții naturale, cu hrană curată și multă atenție': 'Our quails are raised in natural conditions, with clean food and lots of attention',
  'Găinile noastre sunt crescute în aer liber, hrănite natural și îngrijite cu respect': 'Our hens are raised outdoors, naturally fed and cared for with respect',
  'Ouăle de prepeliță — mici bijuterii ale naturii, pline de nutrienți și prospețime': 'Quail eggs — small jewels of nature, full of nutrients and freshness',
  'Fiecare ou este o sursă concentrată de energie, gust și beneficii naturale': 'Each egg is a concentrated source of energy, taste and natural benefits',
  'perfecte pentru toate vârstele': 'perfect for all ages',
  'Oua de găină fără hormoni, fără compromisuri': 'Chicken eggs without hormones, without compromises',
  'Doar proteine de calitate, vitamine și minerale esențiale pentru o alimentație echilibrată': 'Only quality proteins, vitamins and essential minerals for a balanced diet',
  'Urda - o alegere excelentă pentru un stil de viață echilibrat': 'Urda - an excellent choice for a balanced lifestyle',
  'Doar lapte, pricepere și tradiție': 'Just milk, skill and tradition',
};

function translateText(text) {
  if (!text) return text;
  
  let translated = text;
  for (const [ro, en] of Object.entries(descriptionTranslations)) {
    translated = translated.replace(new RegExp(ro, 'gi'), en);
  }
  
  return translated;
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

async function translateDescriptions() {
  try {
    console.log('🌐 Traducere descrieri produse...\n');

    const result = await pool.query('SELECT id, title, description, content FROM "DataItem"');
    const products = result.rows;

    console.log(`📦 ${products.length} produse\n`);

    for (const product of products) {
      const descClean = stripHtml(product.description);
      const contentClean = stripHtml(product.content);

      const descEn = translateText(descClean);
      const contentEn = translateText(contentClean);

      await pool.query(`
        UPDATE "DataItem" 
        SET "descriptionEn" = $1, 
            "contentEn" = $2
        WHERE id = $3
      `, [descEn, contentEn, product.id]);

      console.log(`✅ ${stripHtml(product.title)}`);
      console.log(`   RO: ${descClean.substring(0, 60)}...`);
      console.log(`   EN: ${descEn.substring(0, 60)}...\n`);
    }

    console.log('✅ Traduceri complete!');

  } catch (error) {
    console.error('❌ Eroare:', error.message);
  } finally {
    await pool.end();
  }
}

translateDescriptions();
