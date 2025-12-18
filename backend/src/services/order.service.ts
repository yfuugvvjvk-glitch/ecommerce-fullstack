import { PrismaClient } from '@prisma/client';
import { InventoryService } from './inventory.service';
import { EmailService } from './email.service';

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
  }) {
    // Verifică stocul înainte de a crea comanda
    for (const item of data.items) {
      const stockCheck = await InventoryService.checkStock(item.dataItemId, item.quantity);
      if (!stockCheck.available) {
        const product = await prisma.dataItem.findUnique({
          where: { id: item.dataItemId },
          select: { title: true }
        });
        throw new Error(`Stoc insuficient pentru ${product?.title}. Disponibil: ${stockCheck.currentStock}, Cerut: ${item.quantity}`);
      }
    }

    // Use transaction to ensure stock is updated atomically
    return await prisma.$transaction(async (tx) => {
      // Rezervă stocul pentru fiecare produs
      for (const item of data.items) {
        await InventoryService.reserveStock(item.dataItemId, item.quantity);
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

      // Trimite email de confirmare
      try {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true }
        });

        if (user) {
          await EmailService.sendOrderConfirmation({
            orderId: order.id,
            customerName: user.name,
            customerEmail: user.email,
            total: data.total,
            items: data.items.map(item => {
              const orderItem = order.orderItems.find(oi => oi.dataItemId === item.dataItemId);
              return {
                title: orderItem?.dataItem.title || 'Produs',
                quantity: item.quantity,
                price: item.price
              };
            }),
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod || 'cash'
          });
        }
      } catch (emailError) {
        console.error('Eroare trimitere email confirmare:', emailError);
        // Nu oprește procesul dacă emailul eșuează
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

  // Actualizează statusul comenzii (pentru admin)
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

    // Dacă comanda este anulată, restituie stocul
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.orderItems) {
        await InventoryService.restoreStock(item.dataItemId, item.quantity);
      }
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

    // Trimite email de notificare
    try {
      await EmailService.sendOrderStatusUpdate(
        order.user.email,
        orderId,
        status,
        order.user.name
      );
    } catch (emailError) {
      console.error('Eroare trimitere email status:', emailError);
    }

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