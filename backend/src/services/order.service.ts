import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderService {
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
    // Verificare stoc simplificată (fără InventoryService)
    for (const item of data.items) {
      const product = await prisma.dataItem.findUnique({
        where: { id: item.dataItemId },
      });

      if (!product) {
        throw new Error(`Product ${item.dataItemId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }
    }

    // Use transaction to ensure stock is updated atomically
    return await prisma.$transaction(async (tx) => {
      // Scade stocul pentru fiecare produs (versiunea simplă)
      for (const item of data.items) {
        await tx.dataItem.update({
          where: { id: item.dataItemId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Handle voucher if provided
      let voucherId: string | undefined;
      if (data.voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: data.voucherCode },
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

      console.log('Comandă creată cu succes:', order.id);

      // Generează factura automat după crearea comenzii
      try {
        const { InvoiceSimpleService } = await import('./invoice-simple.service');
        const invoiceService = new InvoiceSimpleService();
        await invoiceService.generateInvoiceForOrder(order.id);
        console.log('📄 Factură generată automat pentru comanda:', order.id);
      } catch (error) {
        console.error('Eroare la generarea facturii:', error);
      }

      return order;
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

  // Actualizează statusul comenzii (pentru admin) - versiune simplificată
  async updateOrderStatus(orderId: string, status: string, adminId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { email: true, name: true }
        },
        orderItems: {
          include: {
            dataItem: true
          }
        }
      }
    });

    if (!order) {
      throw new Error('Comanda nu a fost găsită');
    }

    // Dacă comanda este anulată, restituie stocul (versiune simplificată)
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      console.log(`🔄 Anulare comandă ${orderId}: Restituire stoc pentru ${order.orderItems.length} produse`);
      
      for (const item of order.orderItems) {
        const oldStock = item.dataItem.stock;
        const newStock = oldStock + item.quantity;
        
        await prisma.dataItem.update({
          where: { id: item.dataItemId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
        
        console.log(`📦 Produs ${item.dataItem.title}: Stoc ${oldStock} → ${newStock} (+${item.quantity})`);
      }
      
      // Marchează factura ca anulată (nu o șterge, doar o marchează)
      if (order.invoiceGenerated) {
        console.log(`📄 Marcarea facturii ca anulată pentru comanda ${orderId}`);
      }
      
      console.log(`✅ Stoc actualizat cu succes pentru comanda ${orderId}`);
    } else if (status === 'CANCELLED') {
      console.log(`⚠️ Comanda ${orderId} era deja anulată, nu se actualizează stocul`);
    } else {
      console.log(`ℹ️ Comanda ${orderId} schimbată la status ${status}, nu necesită actualizare stoc`);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            dataItem: true
          }
        }
      }
    });

    console.log(`Status comandă ${orderId} actualizat la ${status}`);
    return updatedOrder;
  }

  // Obține toate comenzile (pentru admin)
  async getAllOrders(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          orderItems: {
            include: {
              dataItem: {
                select: { id: true, title: true, image: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Statistici comenzi pentru dashboard
  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayOrders,
      todayRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'SHIPPING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { total: true }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        _sum: { total: true }
      })
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      todayOrders,
      todayRevenue: todayRevenue._sum.total || 0
    };
  }
}