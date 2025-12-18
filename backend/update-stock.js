const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateStock() {
  try {
    console.log('🔄 Actualizare stocuri produse...');

    // Actualizează toate produsele cu stocuri realiste
    const products = await prisma.dataItem.findMany({
      select: { id: true, title: true, stock: true }
    });

    console.log(`📦 Găsite ${products.length} produse`);

    for (const product of products) {
      // Generează stoc aleator între 5 și 50
      const newStock = Math.floor(Math.random() * 46) + 5;
      
      await prisma.dataItem.update({
        where: { id: product.id },
        data: {
          stock: newStock,
          isInStock: true,
          trackInventory: true,
          lowStockAlert: 5
        }
      });

      console.log(`✅ ${product.title}: ${newStock} bucăți`);
    }

    console.log('🎉 Stocuri actualizate cu succes!');
  } catch (error) {
    console.error('❌ Eroare actualizare stocuri:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateStock();