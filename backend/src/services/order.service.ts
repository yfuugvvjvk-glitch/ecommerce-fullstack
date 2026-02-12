import { PrismaClient } from '@prisma/client';
import { realtimeService } from './realtime.service';

const prisma = new PrismaClient();

// Mock storage pentru setările de blocare (în producție ar fi în baza de date)
let orderBlockSettings = {
  blockNewOrders: false,
  blockReason: '',
  blockUntil: undefined as string | undefined,
  allowedPaymentMethods: ['cash', 'card', 'transfer', 'crypto'],
  minimumOrderValue: 0,
  maximumOrderValue: undefined as number | undefined
};

export class OrderService {
  // Obține setările de blocare comenzi
  async getOrderBlockSettings() {
    try {
      // Încearcă să obții din baza de date
      const config = await prisma.siteConfig.findUnique({
        where: { key: 'order_block_settings' }
      });
      
      if (config && config.value) {
        return JSON.parse(config.value as string);
      }
    } catch (error) {
      console.error('Error loading order block settings from DB:', error);
    }
    
    // Returnează valorile implicite dacă nu există în DB
    return orderBlockSettings;
  }

  // Actualizează setările de blocare comenzi
  async updateOrderBlockSettings(settings: typeof orderBlockSettings) {
    try {
      // Salvează în baza de date
      await prisma.siteConfig.upsert({
        where: { key: 'order_block_settings' },
        update: { value: JSON.stringify(settings) },
        create: { 
          key: 'order_block_settings', 
          value: JSON.stringify(settings),
          description: 'Order blocking settings'
        }
      });
      
      // Actualizează și în memorie pentru performanță
      orderBlockSettings = { ...settings };
      return orderBlockSettings;
    } catch (error) {
      console.error('Error saving order block settings to DB:', error);
      throw error;
    }
  }

  async createOrder(userId: string, data: {
    items: Array<{ dataItemId: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
    deliveryPhone?: string;
    deliveryName?: string;
    paymentMethod?: string;
    deliveryMethod?: string;
    voucherCode?: string;
    orderLocalTime?: string;
    orderLocation?: string;
    orderTimezone?: string;
  }) {
    // === VERIFICARE BLOCARE COMENZI ===
    // Verifică dacă comenzile sunt blocate
    const blockSettings = await this.getOrderBlockSettings();
    
    if (blockSettings.blockNewOrders) {
      // Verifică dacă blocarea este temporară și a expirat
      if (blockSettings.blockUntil) {
        const blockUntilDate = new Date(blockSettings.blockUntil);
        if (new Date() < blockUntilDate) {
          throw new Error(`Comenzile sunt blocate temporar. Motiv: ${blockSettings.blockReason || 'Indisponibil temporar'}. Comenzile vor fi disponibile după ${blockUntilDate.toLocaleString('ro-RO')}`);
        }
      } else {
        // Blocare permanentă
        throw new Error(`Comenzile sunt blocate momentan. Motiv: ${blockSettings.blockReason || 'Indisponibil temporar'}`);
      }
    }

    // Verifică valoarea minimă a comenzii
    if (data.total < blockSettings.minimumOrderValue) {
      throw new Error(`Valoarea minimă a comenzii este ${blockSettings.minimumOrderValue} RON. Valoarea ta: ${data.total} RON`);
    }

    // Verifică valoarea maximă a comenzii (dacă este setată)
    if (blockSettings.maximumOrderValue && data.total > blockSettings.maximumOrderValue) {
      throw new Error(`Valoarea maximă a comenzii este ${blockSettings.maximumOrderValue} RON. Valoarea ta: ${data.total} RON`);
    }

    // Verifică metoda de plată
    if (data.paymentMethod && !blockSettings.allowedPaymentMethods.includes(data.paymentMethod)) {
      const allowedMethods = blockSettings.allowedPaymentMethods.map((m: string) => {
        switch(m) {
          case 'cash': return 'Numerar';
          case 'card': return 'Card';
          case 'transfer': return 'Transfer';
          case 'crypto': return 'Crypto';
          default: return m;
        }
      }).join(', ');
      throw new Error(`Metoda de plată "${data.paymentMethod}" nu este disponibilă. Metode permise: ${allowedMethods}`);
    }

    // Use transaction to ensure stock is updated atomically
    return await prisma.$transaction(async (tx) => {
      // Verificare și rezervare stoc pentru fiecare produs
      for (const item of data.items) {
        const product = await tx.dataItem.findUnique({
          where: { id: item.dataItemId },
        });

        if (!product) {
          throw new Error(`Product ${item.dataItemId} not found`);
        }

        // Verifică stocul disponibil (nu rezervat)
        const availableStock = product.availableStock || product.stock;
        if (availableStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.title}. Available: ${availableStock}, Requested: ${item.quantity}`);
        }

        // Rezervă stocul (nu îl scade încă)
        await tx.dataItem.update({
          where: { id: item.dataItemId },
          data: {
            reservedStock: { increment: item.quantity },
            availableStock: { decrement: item.quantity },
          },
        });
      }

      // Handle voucher if provided
      let voucherId: string | undefined;
      if (data.voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: data.voucherCode.toUpperCase() }, // Case insensitive
        });

        if (voucher && voucher.isActive) {
          // Increment voucher usage count
          await tx.voucher.update({
            where: { id: voucher.id },
            data: { usedCount: { increment: 1 } },
          });
          voucherId = voucher.id;
        }
      }

      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          total: data.total,
          shippingAddress: data.shippingAddress,
          deliveryPhone: data.deliveryPhone,
          deliveryName: data.deliveryName,
          paymentMethod: data.paymentMethod || 'cash',
          deliveryMethod: data.deliveryMethod || 'courier',
          status: 'PROCESSING',
          orderLocalTime: data.orderLocalTime,
          orderLocation: data.orderLocation,
          orderTimezone: data.orderTimezone,
          orderItems: {
            create: data.items.map(item => ({
              dataItemId: item.dataItemId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              dataItem: true,
            },
          },
        },
      });

      // Create UserVoucher record if voucher was used
      if (voucherId) {
        await tx.userVoucher.create({
          data: {
            userId,
            voucherId,
            orderId: order.id,
            usedAt: new Date(),
          },
        });
      }

      // Clear user's cart after successful order
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      // Broadcast new order to admin dashboard
      if (realtimeService) {
        realtimeService.broadcastNewOrder(order);
      }

      return order;
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              dataItem: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          orderItems: {
            include: {
              dataItem: true,
            },
          },
        },
      });

      // Handle stock based on status change
      if (status === 'DELIVERED') {
        // Finalize stock reduction - move from reserved to sold
        for (const item of order.orderItems) {
          await tx.dataItem.update({
            where: { id: item.dataItemId },
            data: {
              stock: { decrement: item.quantity },
              reservedStock: { decrement: item.quantity },
              totalSold: { increment: item.quantity },
            },
          });

          // Create stock movement record
          await tx.stockMovement.create({
            data: {
              dataItemId: item.dataItemId,
              type: 'OUT',
              quantity: item.quantity,
              reason: `Order delivered #${orderId.slice(-6)}`,
              orderId: orderId,
            },
          });

          // Broadcast inventory update
          if (realtimeService) {
            const updatedProduct = await tx.dataItem.findUnique({
              where: { id: item.dataItemId },
              select: { 
                stock: true, 
                reservedStock: true, 
                availableStock: true, 
                title: true, 
                unitName: true, 
                price: true 
              }
            });
            
            if (updatedProduct) {
              realtimeService.broadcastInventoryUpdate(item.dataItemId, {
                stock: updatedProduct.stock,
                reservedStock: updatedProduct.reservedStock,
                availableStock: updatedProduct.availableStock,
                lastUpdated: new Date(),
                productTitle: updatedProduct.title,
                unitName: updatedProduct.unitName,
                price: updatedProduct.price
              });
            }
          }
        }
      } else if (status === 'CANCELLED') {
        // Release reserved stock back to available
        for (const item of order.orderItems) {
          await tx.dataItem.update({
            where: { id: item.dataItemId },
            data: {
              reservedStock: { decrement: item.quantity },
              availableStock: { increment: item.quantity },
            },
          });

          // Create stock movement record
          await tx.stockMovement.create({
            data: {
              dataItemId: item.dataItemId,
              type: 'RELEASED',
              quantity: item.quantity,
              reason: `Order cancelled #${orderId.slice(-6)}`,
              orderId: orderId,
            },
          });

          // Broadcast inventory update
          if (realtimeService) {
            const updatedProduct = await tx.dataItem.findUnique({
              where: { id: item.dataItemId },
              select: { 
                stock: true, 
                reservedStock: true, 
                availableStock: true, 
                title: true, 
                unitName: true, 
                price: true 
              }
            });
            
            if (updatedProduct) {
              realtimeService.broadcastInventoryUpdate(item.dataItemId, {
                stock: updatedProduct.stock,
                reservedStock: updatedProduct.reservedStock,
                availableStock: updatedProduct.availableStock,
                lastUpdated: new Date(),
                productTitle: updatedProduct.title,
                unitName: updatedProduct.unitName,
                price: updatedProduct.price
              });
            }
          }
        }
      }

      // Broadcast order status update
      if (realtimeService) {
        realtimeService.broadcastOrderUpdate(orderId, status, updatedOrder);
      }

      return updatedOrder;
    });
  }

  async getMyOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            dataItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: string, userId: string) {
    return await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        orderItems: {
          include: {
            dataItem: true,
          },
        },
      },
    });
  }

  async getAllOrders(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { name: true, email: true },
          },
          orderItems: {
            include: {
              dataItem: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderStats() {
    const [
      totalOrders,
      totalRevenue,
      todayOrders,
      todayRevenue,
      pendingOrders,
      processingOrders,
      deliveredOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'DELIVERED' },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      todayOrders,
      todayRevenue: todayRevenue._sum.total || 0,
      pendingOrders,
      processingOrders,
      deliveredOrders,
    };
  }
}