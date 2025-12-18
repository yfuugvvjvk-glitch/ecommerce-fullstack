import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InventoryService {
  // Verifică disponibilitatea stocului
  static async checkStock(productId: string, quantity: number): Promise<{ available: boolean; currentStock: number }> {
    const product = await prisma.dataItem.findUnique({
      where: { id: productId },
      select: { stock: true, trackInventory: true, isInStock: true }
    });

    if (!product) {
      throw new Error('Produsul nu a fost găsit');
    }

    if (!product.trackInventory) {
      return { available: true, currentStock: -1 }; // Stoc nelimitat
    }

    return {
      available: product.isInStock && product.stock >= quantity,
      currentStock: product.stock
    };
  }

  // Rezervă stoc pentru o comandă
  static async reserveStock(productId: string, quantity: number): Promise<void> {
    const product = await prisma.dataItem.findUnique({
      where: { id: productId },
      select: { stock: true, trackInventory: true, isInStock: true, lowStockAlert: true }
    });

    if (!product) {
      throw new Error('Produsul nu a fost găsit');
    }

    if (!product.trackInventory) {
      return; // Nu urmărește stocul
    }

    if (!product.isInStock || product.stock < quantity) {
      throw new Error('Stoc insuficient');
    }

    const newStock = product.stock - quantity;
    const isInStock = newStock > 0;

    await prisma.dataItem.update({
      where: { id: productId },
      data: {
        stock: newStock,
        isInStock: isInStock
      }
    });

    // Verifică dacă stocul este scăzut și trimite notificare
    if (newStock <= product.lowStockAlert && newStock > 0) {
      await this.createLowStockNotification(productId, newStock);
    }
  }

  // Restituie stoc (în caz de anulare comandă)
  static async restoreStock(productId: string, quantity: number): Promise<void> {
    const product = await prisma.dataItem.findUnique({
      where: { id: productId },
      select: { stock: true, trackInventory: true }
    });

    if (!product || !product.trackInventory) {
      return;
    }

    const newStock = product.stock + quantity;

    await prisma.dataItem.update({
      where: { id: productId },
      data: {
        stock: newStock,
        isInStock: true
      }
    });
  }

  // Actualizează stocul manual (pentru admin)
  static async updateStock(productId: string, newStock: number): Promise<void> {
    const product = await prisma.dataItem.findUnique({
      where: { id: productId },
      select: { lowStockAlert: true }
    });

    if (!product) {
      throw new Error('Produsul nu a fost găsit');
    }

    const isInStock = newStock > 0;

    await prisma.dataItem.update({
      where: { id: productId },
      data: {
        stock: newStock,
        isInStock: isInStock
      }
    });

    // Verifică dacă stocul este scăzut
    if (newStock <= product.lowStockAlert && newStock > 0) {
      await this.createLowStockNotification(productId, newStock);
    }
  }

  // Obține produsele cu stoc scăzut
  static async getLowStockProducts(): Promise<any[]> {
    return await prisma.dataItem.findMany({
      where: {
        trackInventory: true,
        OR: [
          {
            stock: {
              lte: prisma.dataItem.fields.lowStockAlert
            }
          },
          {
            isInStock: false
          }
        ]
      },
      select: {
        id: true,
        title: true,
        stock: true,
        lowStockAlert: true,
        isInStock: true,
        image: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        stock: 'asc'
      }
    });
  }

  // Creează notificare pentru stoc scăzut
  private static async createLowStockNotification(productId: string, currentStock: number): Promise<void> {
    const product = await prisma.dataItem.findUnique({
      where: { id: productId },
      select: { title: true, userId: true }
    });

    if (!product) return;

    // Găsește toți adminii
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true }
    });

    // Creează notificări pentru toți adminii
    const notifications = admins.map(admin => ({
      userId: admin.id,
      type: 'LOW_STOCK',
      title: 'Stoc Scăzut',
      message: `Produsul "${product.title}" are doar ${currentStock} bucăți în stoc.`,
      data: {
        productId: productId,
        currentStock: currentStock,
        productTitle: product.title
      }
    }));

    await prisma.notification.createMany({
      data: notifications
    });
  }

  // Raport stoc pentru dashboard
  static async getStockReport(): Promise<{
    totalProducts: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
    totalValue: number;
  }> {
    const [totalProducts, inStock, outOfStock, lowStockProducts, totalValue] = await Promise.all([
      prisma.dataItem.count({
        where: { trackInventory: true }
      }),
      prisma.dataItem.count({
        where: { 
          trackInventory: true,
          isInStock: true,
          stock: { gt: 0 }
        }
      }),
      prisma.dataItem.count({
        where: { 
          trackInventory: true,
          isInStock: false 
        }
      }),
      prisma.dataItem.count({
        where: {
          trackInventory: true,
          isInStock: true,
          stock: {
            lte: prisma.dataItem.fields.lowStockAlert
          }
        }
      }),
      prisma.dataItem.aggregate({
        where: { trackInventory: true },
        _sum: {
          stock: true
        }
      })
    ]);

    return {
      totalProducts,
      inStock,
      outOfStock,
      lowStock: lowStockProducts,
      totalValue: totalValue._sum.stock || 0
    };
  }
}