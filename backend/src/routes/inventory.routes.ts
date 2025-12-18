import { FastifyInstance } from 'fastify';
import { InventoryService } from '../services/inventory.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

export async function inventoryRoutes(fastify: FastifyInstance) {
  // Verifică stocul unui produs (public)
  fastify.get('/check/:productId', async (request, reply) => {
    try {
      const { productId } = request.params as any;
      const { quantity = 1 } = request.query as any;
      
      const result = await InventoryService.checkStock(productId, parseInt(quantity));
      reply.send(result);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Admin routes
  fastify.get('/admin/low-stock', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const products = await InventoryService.getLowStockProducts();
      reply.send(products);
    } catch (error) {
      reply.code(500).send({ error: 'Failed to get low stock products' });
    }
  });

  fastify.get('/admin/report', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const report = await InventoryService.getStockReport();
      reply.send(report);
    } catch (error) {
      reply.code(500).send({ error: 'Failed to get stock report' });
    }
  });

  fastify.put('/admin/:productId/stock', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const { productId } = request.params as any;
      const { stock } = request.body as any;

      if (typeof stock !== 'number' || stock < 0) {
        reply.code(400).send({ error: 'Invalid stock value' });
        return;
      }

      await InventoryService.updateStock(productId, stock);
      reply.send({ success: true, message: 'Stock updated successfully' });
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Bulk stock update
  fastify.put('/admin/bulk-update', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const { updates } = request.body as any; // Array of { productId, stock }

      if (!Array.isArray(updates)) {
        reply.code(400).send({ error: 'Updates must be an array' });
        return;
      }

      const results = [];
      for (const update of updates) {
        try {
          await InventoryService.updateStock(update.productId, update.stock);
          results.push({ productId: update.productId, success: true });
        } catch (error: any) {
          results.push({ productId: update.productId, success: false, error: error.message });
        }
      }

      reply.send({ results });
    } catch (error) {
      reply.code(500).send({ error: 'Failed to update stock' });
    }
  });
}