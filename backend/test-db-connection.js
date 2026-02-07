// Test conexiune baza de date
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testare conexiune la baza de date...\n');
    
    // Test conexiune
    await prisma.$connect();
    console.log('✅ Conexiune la baza de date reușită!\n');
    
    // Verifică dacă tabelul Media există
    console.log('📊 Verificare tabel Media...');
    const mediaCount = await prisma.media.count();
    console.log(`✅ Tabelul Media există! Număr înregistrări: ${mediaCount}\n`);
    
    // Afișează primele 3 înregistrări
    if (mediaCount > 0) {
      console.log('📁 Primele 3 fișiere media:');
      const files = await prisma.media.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      files.forEach((file, index) => {
        console.log(`${index + 1}. ${file.filename} (${file.category}) - ${file.url}`);
      });
    } else {
      console.log('ℹ️  Nu există fișiere în baza de date.');
      console.log('   La prima accesare, sistemul va scana directoarele uploads/');
    }
    
    console.log('\n✅ Toate testele au trecut!');
  } catch (error) {
    console.error('\n❌ Eroare:', error.message);
    
    if (error.code === 'P2021') {
      console.log('\n💡 Tabelul Media nu există în baza de date.');
      console.log('   Rulează migrațiile: npm run prisma:migrate');
    } else if (error.code === 'P1001') {
      console.log('\n💡 Nu se poate conecta la baza de date.');
      console.log('   Verifică DATABASE_URL în fișierul .env');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
