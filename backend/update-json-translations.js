const fs = require('fs');
const path = require('path');

const translations = {
  de: {
    siteNameShort: 'Von meinem Hof',
    paymentMethods: {
      bankCard: 'Bankkarte',
      bankCardDesc: 'Zahlung per Bankkarte (Visa, MasterCard)',
      cashOnDelivery: 'Barzahlung bei Lieferung',
      cashOnDeliveryDesc: 'Barzahlung bei Erhalt der Bestellung'
    },
    vouchers: {
      welcomeVoucher: 'Willkommensgutschein - 10% Rabatt'
    },
    carousel: {
      freshness: 'Wahre Frische kommt aus der Natur'
    }
  },
  fr: {
    siteNameShort: 'De ma ferme',
    paymentMethods: {
      bankCard: 'Carte Bancaire',
      bankCardDesc: 'Paiement par carte bancaire (Visa, MasterCard)',
      cashOnDelivery: 'Paiement à la livraison',
      cashOnDeliveryDesc: 'Paiement en espèces à la réception de la commande'
    },
    vouchers: {
      welcomeVoucher: 'Bon de bienvenue - 10% de réduction'
    },
    carousel: {
      freshness: 'La vraie fraîcheur vient de la nature'
    }
  },
  es: {
    siteNameShort: 'De mi granja',
    paymentMethods: {
      bankCard: 'Tarjeta Bancaria',
      bankCardDesc: 'Pago con tarjeta bancaria (Visa, MasterCard)',
      cashOnDelivery: 'Pago contra reembolso',
      cashOnDeliveryDesc: 'Pago en efectivo al recibir el pedido'
    },
    vouchers: {
      welcomeVoucher: 'Cupón de bienvenida - 10% de descuento'
    },
    carousel: {
      freshness: 'La verdadera frescura viene de la naturaleza'
    }
  },
  it: {
    siteNameShort: 'Dalla mia fattoria',
    paymentMethods: {
      bankCard: 'Carta Bancaria',
      bankCardDesc: 'Pagamento con carta bancaria (Visa, MasterCard)',
      cashOnDelivery: 'Pagamento alla consegna',
      cashOnDeliveryDesc: 'Pagamento in contanti alla ricezione dell\'ordine'
    },
    vouchers: {
      welcomeVoucher: 'Buono di benvenuto - 10% di sconto'
    },
    carousel: {
      freshness: 'La vera freschezza viene dalla natura'
    }
  }
};

function updateJsonFile(locale) {
  const filePath = path.join(__dirname, '..', 'frontend', 'locales', locale, 'common.json');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    // Add new translations
    json.siteNameShort = translations[locale].siteNameShort;
    json.paymentMethods = translations[locale].paymentMethods;
    json.vouchers = translations[locale].vouchers;
    json.carousel = translations[locale].carousel;
    
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`✅ Updated ${locale}/common.json`);
  } catch (error) {
    console.error(`❌ Error updating ${locale}/common.json:`, error.message);
  }
}

console.log('📝 Actualizare fișiere JSON traduceri...\n');

['de', 'fr', 'es', 'it'].forEach(locale => {
  updateJsonFile(locale);
});

console.log('\n✅ Toate fișierele JSON actualizate!');
