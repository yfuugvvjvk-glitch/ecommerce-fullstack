const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanTranslationPrefixes() {
  console.log('🧹 Curățare prefixe din traduceri...\n');

  try {
    // Get all products
    const products = await prisma.dataItem.findMany();

    console.log(`📦 Găsite ${products.length} produse\n`);

    let updatedCount = 0;

    for (const product of products) {
      const updates = {};
      let needsUpdate = false;

      // Clean title translations
      if (product.titleEn && product.titleEn.startsWith('[EN]')) {
        updates.titleEn = product.titleEn.replace(/^\[EN\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.titleFr && product.titleFr.startsWith('[FR]')) {
        updates.titleFr = product.titleFr.replace(/^\[FR\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.titleDe && product.titleDe.startsWith('[DE]')) {
        updates.titleDe = product.titleDe.replace(/^\[DE\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.titleEs && product.titleEs.startsWith('[ES]')) {
        updates.titleEs = product.titleEs.replace(/^\[ES\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.titleIt && product.titleIt.startsWith('[IT]')) {
        updates.titleIt = product.titleIt.replace(/^\[IT\]\s*/, '').trim();
        needsUpdate = true;
      }

      // Clean description translations
      if (product.descriptionEn && product.descriptionEn.startsWith('[EN]')) {
        updates.descriptionEn = product.descriptionEn.replace(/^\[EN\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.descriptionFr && product.descriptionFr.startsWith('[FR]')) {
        updates.descriptionFr = product.descriptionFr.replace(/^\[FR\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.descriptionDe && product.descriptionDe.startsWith('[DE]')) {
        updates.descriptionDe = product.descriptionDe.replace(/^\[DE\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.descriptionEs && product.descriptionEs.startsWith('[ES]')) {
        updates.descriptionEs = product.descriptionEs.replace(/^\[ES\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (product.descriptionIt && product.descriptionIt.startsWith('[IT]')) {
        updates.descriptionIt = product.descriptionIt.replace(/^\[IT\]\s*/, '').trim();
        needsUpdate = true;
      }

      if (needsUpdate) {
        await prisma.dataItem.update({
          where: { id: product.id },
          data: updates
        });
        updatedCount++;
        console.log(`✅ Curățat: ${product.title}`);
      }
    }

    // Clean delivery locations
    const locations = await prisma.deliveryLocation.findMany();
    console.log(`\n📍 Găsite ${locations.length} locații de livrare\n`);

    for (const location of locations) {
      const updates = {};
      let needsUpdate = false;

      // Clean name translations
      if (location.nameEn && location.nameEn.startsWith('[EN]')) {
        updates.nameEn = location.nameEn.replace(/^\[EN\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.nameFr && location.nameFr.startsWith('[FR]')) {
        updates.nameFr = location.nameFr.replace(/^\[FR\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.nameDe && location.nameDe.startsWith('[DE]')) {
        updates.nameDe = location.nameDe.replace(/^\[DE\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.nameEs && location.nameEs.startsWith('[ES]')) {
        updates.nameEs = location.nameEs.replace(/^\[ES\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.nameIt && location.nameIt.startsWith('[IT]')) {
        updates.nameIt = location.nameIt.replace(/^\[IT\]\s*/, '').trim();
        needsUpdate = true;
      }

      // Clean instructions translations
      if (location.specialInstructionsEn && location.specialInstructionsEn.startsWith('[EN]')) {
        updates.specialInstructionsEn = location.specialInstructionsEn.replace(/^\[EN\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.specialInstructionsFr && location.specialInstructionsFr.startsWith('[FR]')) {
        updates.specialInstructionsFr = location.specialInstructionsFr.replace(/^\[FR\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.specialInstructionsDe && location.specialInstructionsDe.startsWith('[DE]')) {
        updates.specialInstructionsDe = location.specialInstructionsDe.replace(/^\[DE\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.specialInstructionsEs && location.specialInstructionsEs.startsWith('[ES]')) {
        updates.specialInstructionsEs = location.specialInstructionsEs.replace(/^\[ES\]\s*/, '').trim();
        needsUpdate = true;
      }
      if (location.specialInstructionsIt && location.specialInstructionsIt.startsWith('[IT]')) {
        updates.specialInstructionsIt = location.specialInstructionsIt.replace(/^\[IT\]\s*/, '').trim();
        needsUpdate = true;
      }

      if (needsUpdate) {
        await prisma.deliveryLocation.update({
          where: { id: location.id },
          data: updates
        });
        updatedCount++;
        console.log(`✅ Curățat: ${location.name}`);
      }
    }

    console.log(`\n✨ Finalizat! ${updatedCount} înregistrări curățate.`);

  } catch (error) {
    console.error('❌ Eroare:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanTranslationPrefixes();
