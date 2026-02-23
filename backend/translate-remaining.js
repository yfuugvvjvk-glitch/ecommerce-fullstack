const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'ecommerce_db'
});

const translations = {
  // Payment Methods
  'Card Bancar': {
    en: 'Bank Card',
    de: 'Bankkarte',
    fr: 'Carte Bancaire',
    es: 'Tarjeta Bancaria',
    it: 'Carta Bancaria'
  },
  'Numerar la Livrare': {
    en: 'Cash on Delivery',
    de: 'Barzahlung bei Lieferung',
    fr: 'Paiement à la livraison',
    es: 'Pago contra reembolso',
    it: 'Pagamento alla consegna'
  },
  'Plată cu cardul bancar (Visa, MasterCard)': {
    en: 'Payment by bank card (Visa, MasterCard)',
    de: 'Zahlung per Bankkarte (Visa, MasterCard)',
    fr: 'Paiement par carte bancaire (Visa, MasterCard)',
    es: 'Pago con tarjeta bancaria (Visa, MasterCard)',
    it: 'Pagamento con carta bancaria (Visa, MasterCard)'
  },
  'Plată în numerar la primirea comenzii': {
    en: 'Cash payment upon receipt of order',
    de: 'Barzahlung bei Erhalt der Bestellung',
    fr: 'Paiement en espèces à la réception de la commande',
    es: 'Pago en efectivo al recibir el pedido',
    it: 'Pagamento in contanti alla ricezione dell\'ordine'
  },
  
  // Carousel descriptions
  'Adevărata prospețime vine din natură': {
    en: 'True freshness comes from nature',
    de: 'Wahre Frische kommt aus der Natur',
    fr: 'La vraie fraîcheur vient de la nature',
    es: 'La verdadera frescura viene de la naturaleza',
    it: 'La vera freschezza viene dalla natura'
  },
  
  // Voucher descriptions
  'Voucher de bun venit - 10% reducere': {
    en: 'Welcome voucher - 10% discount',
    de: 'Willkommensgutschein - 10% Rabatt',
    fr: 'Bon de bienvenue - 10% de réduction',
    es: 'Cupón de bienvenida - 10% de descuento',
    it: 'Buono di benvenuto - 10% di sconto'
  },
  
  // Site name
  'Din ograda mea direct pe masa ta': {
    en: 'From my farm directly to your table',
    de: 'Von meinem Hof direkt auf Ihren Tisch',
    fr: 'De ma ferme directement sur votre table',
    es: 'De mi granja directamente a tu mesa',
    it: 'Dalla mia fattoria direttamente sulla tua tavola'
  },
  
  // About Us content
  'Bun venit la Din ograda mea direct pe masa ta! Suntem o fermă locală dedicată să aducă produse proaspete și naturale direct de la noi la tine acasă. Cu pasiune pentru agricultură și respect pentru natură, cultivăm produse de cea mai înaltă calitate, fără chimicale dăunătoare. Fiecare produs este ales cu grijă pentru a-ți oferi cea mai bună experiență. Misiunea noastră este să promovăm un stil de viață sănătos prin produse naturale, proaspete și accesibile pentru toată familia.': {
    en: 'Welcome to From my farm directly to your table! We are a local farm dedicated to bringing fresh and natural products directly from us to your home. With a passion for agriculture and respect for nature, we grow the highest quality products without harmful chemicals. Each product is carefully selected to offer you the best experience. Our mission is to promote a healthy lifestyle through natural, fresh and accessible products for the whole family.',
    de: 'Willkommen bei Von meinem Hof direkt auf Ihren Tisch! Wir sind ein lokaler Bauernhof, der sich der Lieferung frischer und natürlicher Produkte direkt von uns zu Ihnen nach Hause verschrieben hat. Mit Leidenschaft für die Landwirtschaft und Respekt für die Natur bauen wir Produkte höchster Qualität ohne schädliche Chemikalien an. Jedes Produkt wird sorgfältig ausgewählt, um Ihnen das beste Erlebnis zu bieten. Unsere Mission ist es, einen gesunden Lebensstil durch natürliche, frische und zugängliche Produkte für die ganze Familie zu fördern.',
    fr: 'Bienvenue à De ma ferme directement sur votre table! Nous sommes une ferme locale dédiée à apporter des produits frais et naturels directement de chez nous à votre domicile. Avec une passion pour l\'agriculture et le respect de la nature, nous cultivons des produits de la plus haute qualité sans produits chimiques nocifs. Chaque produit est soigneusement sélectionné pour vous offrir la meilleure expérience. Notre mission est de promouvoir un mode de vie sain grâce à des produits naturels, frais et accessibles pour toute la famille.',
    es: '¡Bienvenido a De mi granja directamente a tu mesa! Somos una granja local dedicada a traer productos frescos y naturales directamente de nosotros a tu hogar. Con pasión por la agricultura y respeto por la naturaleza, cultivamos productos de la más alta calidad sin químicos dañinos. Cada producto es cuidadosamente seleccionado para ofrecerte la mejor experiencia. Nuestra misión es promover un estilo de vida saludable a través de productos naturales, frescos y accesibles para toda la familia.',
    it: 'Benvenuti a Dalla mia fattoria direttamente sulla tua tavola! Siamo una fattoria locale dedicata a portare prodotti freschi e naturali direttamente da noi a casa tua. Con passione per l\'agricoltura e rispetto per la natura, coltiviamo prodotti della massima qualità senza sostanze chimiche dannose. Ogni prodotto è accuratamente selezionato per offrirti la migliore esperienza. La nostra missione è promuovere uno stile di vita sano attraverso prodotti naturali, freschi e accessibili per tutta la famiglia.'
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

async function translateRemaining() {
  try {
    console.log('🌐 TRADUCERE ELEMENTE RĂMASE\n');

    // 1. Translate Payment Methods
    console.log('💳 Traducere metode de plată...');
    const payments = await pool.query('SELECT id, name, description FROM "PaymentMethod"');
    
    for (const payment of payments.rows) {
      const nameEn = translate(payment.name, 'en');
      const nameDe = translate(payment.name, 'de');
      const nameFr = translate(payment.name, 'fr');
      const nameEs = translate(payment.name, 'es');
      const nameIt = translate(payment.name, 'it');

      const descEn = translate(payment.description, 'en');
      const descDe = translate(payment.description, 'de');
      const descFr = translate(payment.description, 'fr');
      const descEs = translate(payment.description, 'es');
      const descIt = translate(payment.description, 'it');

      await pool.query(`
        UPDATE "PaymentMethod" 
        SET "nameEn" = $1, "nameDe" = $2, "nameFr" = $3, "nameEs" = $4, "nameIt" = $5,
            "descriptionEn" = $6, "descriptionDe" = $7, "descriptionFr" = $8, "descriptionEs" = $9, "descriptionIt" = $10
        WHERE id = $11
      `, [nameEn, nameDe, nameFr, nameEs, nameIt, descEn, descDe, descFr, descEs, descIt, payment.id]);

      console.log(`✅ ${payment.name}`);
      console.log(`   EN: ${nameEn}`);
      console.log(`   DE: ${nameDe}`);
      console.log(`   FR: ${nameFr}\n`);
    }

    // 2. Translate Carousel Descriptions
    console.log('🎠 Traducere descrieri carousel...');
    const carousel = await pool.query(`
      SELECT id, "customDescription" 
      FROM "CarouselItem" 
      WHERE "customDescription" IS NOT NULL
    `);
    
    for (const item of carousel.rows) {
      const descEn = translate(item.customDescription, 'en');
      const descDe = translate(item.customDescription, 'de');
      const descFr = translate(item.customDescription, 'fr');
      const descEs = translate(item.customDescription, 'es');
      const descIt = translate(item.customDescription, 'it');

      await pool.query(`
        UPDATE "CarouselItem" 
        SET "customDescriptionEn" = $1, "customDescriptionDe" = $2, "customDescriptionFr" = $3,
            "customDescriptionEs" = $4, "customDescriptionIt" = $5
        WHERE id = $6
      `, [descEn, descDe, descFr, descEs, descIt, item.id]);
    }
    console.log(`✅ ${carousel.rows.length} carousel descriptions traduse\n`);

    // 3. Update SiteConfig with translations
    console.log('⚙️ Actualizare configurare site...');
    
    // Site name translations
    const siteNameTranslations = {
      site_name_en: 'From my farm directly to your table',
      site_name_de: 'Von meinem Hof direkt auf Ihren Tisch',
      site_name_fr: 'De ma ferme directement sur votre table',
      site_name_es: 'De mi granja directamente a tu mesa',
      site_name_it: 'Dalla mia fattoria direttamente sulla tua tavola'
    };

    for (const [key, value] of Object.entries(siteNameTranslations)) {
      await pool.query(`
        INSERT INTO "SiteConfig" (id, key, value, type, "isPublic", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, 'text', true, NOW())
        ON CONFLICT (key) DO UPDATE SET value = $2, "updatedAt" = NOW()
      `, [key, value]);
    }

    // About Us translations
    const aboutUsText = 'Bun venit la Din ograda mea direct pe masa ta! Suntem o fermă locală dedicată să aducă produse proaspete și naturale direct de la noi la tine acasă. Cu pasiune pentru agricultură și respect pentru natură, cultivăm produse de cea mai înaltă calitate, fără chimicale dăunătoare. Fiecare produs este ales cu grijă pentru a-ți oferi cea mai bună experiență. Misiunea noastră este să promovăm un stil de viață sănătos prin produse naturale, proaspete și accesibile pentru toată familia.';
    
    const aboutUsTranslations = {
      about_us_en: translate(aboutUsText, 'en'),
      about_us_de: translate(aboutUsText, 'de'),
      about_us_fr: translate(aboutUsText, 'fr'),
      about_us_es: translate(aboutUsText, 'es'),
      about_us_it: translate(aboutUsText, 'it')
    };

    for (const [key, value] of Object.entries(aboutUsTranslations)) {
      await pool.query(`
        INSERT INTO "SiteConfig" (id, key, value, type, "isPublic", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, 'text', true, NOW())
        ON CONFLICT (key) DO UPDATE SET value = $2, "updatedAt" = NOW()
      `, [key, value]);
    }

    console.log('✅ Configurare site actualizată cu traduceri\n');

    console.log('\n✅ TOATE TRADUCERILE COMPLETE!');
    console.log('💳 Metode de plată: ✅');
    console.log('🎠 Descrieri carousel: ✅');
    console.log('⚙️ Configurare site: ✅');
    console.log('📝 About Us: ✅');

  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

translateRemaining();
