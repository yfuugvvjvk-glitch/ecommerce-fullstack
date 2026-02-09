import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FinancialReportFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface RevenueBreakdown {
  totalRevenue: number;
  orderRevenue: number;
  cardTransactions: number;
  averageOrderValue: number;
  totalOrders: number;
}

export interface ExpenseBreakdown {
  totalExpenses: number;
  byCategory: { category: string; amount: number; count: number }[];
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
  averagePrice: number;
}

export interface FinancialSummary {
  revenue: RevenueBreakdown;
  expenses: ExpenseBreakdown;
  profit: number;
  profitMargin: number;
  topProducts: ProductPerformance[];
  ordersByStatus: { status: string; count: number; total: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
}

class FinancialReportService {
  // Obține raportul financiar complet
  async getFinancialReport(filters: FinancialReportFilters): Promise<FinancialSummary> {
    const { startDate, endDate } = this.getDateRange(filters);

    const [revenue, expenses, topProducts, ordersByStatus, revenueByDay] = await Promise.all([
      this.getRevenueBreakdown(startDate, endDate),
      this.getExpenseBreakdown(startDate, endDate),
      this.getTopProducts(startDate, endDate, 10),
      this.getOrdersByStatus(startDate, endDate),
      this.getRevenueByDay(startDate, endDate)
    ]);

    const profit = revenue.totalRevenue - expenses.totalExpenses;
    const profitMargin = revenue.totalRevenue > 0 ? (profit / revenue.totalRevenue) * 100 : 0;

    return {
      revenue,
      expenses,
      profit,
      profitMargin,
      topProducts,
      ordersByStatus,
      revenueByDay
    };
  }

  // Obține breakdown-ul veniturilor
  async getRevenueBreakdown(startDate: Date, endDate: Date): Promise<RevenueBreakdown> {
    // Venituri din comenzi
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: {
          in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
        }
      },
      select: {
        total: true
      }
    });

    const orderRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? orderRevenue / totalOrders : 0;

    // Tranzacții cu cardul
    const cardTransactions = await prisma.cardTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        type: 'PAYMENT',
        status: 'COMPLETED'
      },
      select: {
        amount: true
      }
    });

    const cardTransactionTotal = cardTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalRevenue: orderRevenue,
      orderRevenue,
      cardTransactions: cardTransactionTotal,
      averageOrderValue,
      totalOrders
    };
  }

  // Obține breakdown-ul cheltuielilor (mock data pentru moment)
  async getExpenseBreakdown(startDate: Date, endDate: Date): Promise<ExpenseBreakdown> {
    // Mock data - în producție ar fi din tabelul de tranzacții financiare
    const mockExpenses = [
      { category: 'Utilități', amount: 250.50, count: 1 },
      { category: 'Marketing', amount: 500.00, count: 3 },
      { category: 'Materii Prime', amount: 1200.00, count: 5 }
    ];

    const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      totalExpenses,
      byCategory: mockExpenses
    };
  }

  // Obține produsele cu cele mai bune performanțe
  async getTopProducts(startDate: Date, endDate: Date, limit: number = 10): Promise<ProductPerformance[]> {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: {
            in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
          }
        }
      },
      include: {
        dataItem: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Grupează după produs
    const productMap = new Map<string, { name: string; totalSold: number; revenue: number; prices: number[] }>();

    orderItems.forEach(item => {
      const existing = productMap.get(item.dataItemId) || {
        name: item.dataItem.title,
        totalSold: 0,
        revenue: 0,
        prices: []
      };

      existing.totalSold += item.quantity;
      existing.revenue += item.price * item.quantity;
      existing.prices.push(item.price);

      productMap.set(item.dataItemId, existing);
    });

    // Convertește în array și sortează după venituri
    const products: ProductPerformance[] = Array.from(productMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        totalSold: data.totalSold,
        revenue: data.revenue,
        averagePrice: data.prices.reduce((sum, p) => sum + p, 0) / data.prices.length
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);

    return products;
  }

  // Obține comenzile grupate după status
  async getOrdersByStatus(startDate: Date, endDate: Date) {
    const orders = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      },
      _sum: {
        total: true
      }
    });

    return orders.map(order => ({
      status: order.status,
      count: order._count.id,
      total: order._sum.total || 0
    }));
  }

  // Obține veniturile pe zile
  async getRevenueByDay(startDate: Date, endDate: Date) {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: {
          in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
        }
      },
      select: {
        createdAt: true,
        total: true
      }
    });

    // Grupează după zi
    const dayMap = new Map<string, { revenue: number; orders: number }>();

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      const existing = dayMap.get(date) || { revenue: 0, orders: 0 };
      
      existing.revenue += order.total;
      existing.orders += 1;
      
      dayMap.set(date, existing);
    });

    // Convertește în array și sortează
    return Array.from(dayMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Obține statistici pentru produse
  async getProductStatistics(filters: FinancialReportFilters) {
    const { startDate, endDate } = this.getDateRange(filters);

    const products = await prisma.dataItem.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        orderItems: {
          where: {
            order: {
              status: {
                in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
              }
            }
          }
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    });

    return products.map(product => {
      const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const revenue = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        totalSold,
        revenue,
        reviews: product._count.reviews,
        favorites: product._count.favorites,
        rating: product.rating
      };
    });
  }

  // Obține statistici pentru clienți
  async getCustomerStatistics(filters: FinancialReportFilters) {
    const { startDate, endDate } = this.getDateRange(filters);

    const users = await prisma.user.findMany({
      where: {
        role: 'user',
        orders: {
          some: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: {
              in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
            }
          },
          select: {
            total: true,
            createdAt: true
          }
        }
      }
    });

    return users.map(user => {
      const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
      const orderCount = user.orders.length;
      const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
      const lastOrderDate = user.orders.length > 0 
        ? user.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
        : null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalSpent,
        orderCount,
        averageOrderValue,
        lastOrderDate
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }

  // Obține raport de vânzări pe categorii
  async getSalesByCategory(filters: FinancialReportFilters) {
    const { startDate, endDate } = this.getDateRange(filters);

    const categories = await prisma.category.findMany({
      include: {
        dataItems: {
          include: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: startDate,
                    lte: endDate
                  },
                  status: {
                    in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
                  }
                }
              }
            }
          }
        }
      }
    });

    return categories.map(category => {
      const totalSold = category.dataItems.reduce((sum, product) => 
        sum + product.orderItems.reduce((pSum, item) => pSum + item.quantity, 0), 0
      );
      
      const revenue = category.dataItems.reduce((sum, product) => 
        sum + product.orderItems.reduce((pSum, item) => pSum + (item.price * item.quantity), 0), 0
      );

      return {
        id: category.id,
        name: category.name,
        totalSold,
        revenue,
        productCount: category.dataItems.length
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }

  // Helper pentru a obține intervalul de date
  private getDateRange(filters: FinancialReportFilters): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (filters.startDate && filters.endDate) {
      startDate = new Date(filters.startDate);
      endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (filters.period) {
      switch (filters.period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      }
    } else {
      // Default: luna curentă
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    }

    return { startDate, endDate };
  }

  // Exportă raportul în format CSV
  async exportReportToCSV(filters: FinancialReportFilters): Promise<string> {
    const report = await this.getFinancialReport(filters);
    
    let csv = 'Raport Financiar\n\n';
    csv += 'Rezumat General\n';
    csv += `Venituri Totale,${report.revenue.totalRevenue.toFixed(2)} RON\n`;
    csv += `Cheltuieli Totale,${report.expenses.totalExpenses.toFixed(2)} RON\n`;
    csv += `Profit,${report.profit.toFixed(2)} RON\n`;
    csv += `Marjă Profit,${report.profitMargin.toFixed(2)}%\n`;
    csv += `Număr Comenzi,${report.revenue.totalOrders}\n`;
    csv += `Valoare Medie Comandă,${report.revenue.averageOrderValue.toFixed(2)} RON\n\n`;

    csv += 'Top Produse\n';
    csv += 'Produs,Cantitate Vândută,Venituri,Preț Mediu\n';
    report.topProducts.forEach(product => {
      csv += `${product.productName},${product.totalSold},${product.revenue.toFixed(2)},${product.averagePrice.toFixed(2)}\n`;
    });

    csv += '\nComenzi pe Status\n';
    csv += 'Status,Număr,Total\n';
    report.ordersByStatus.forEach(status => {
      csv += `${status.status},${status.count},${status.total.toFixed(2)}\n`;
    });

    return csv;
  }
}

export const financialReportService = new FinancialReportService();
