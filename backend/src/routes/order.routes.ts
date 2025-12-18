import { FastifyInstance } from 'fastify';
import { OrderService } from '../services/order.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const orderService = new OrderService();

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const data = request.body as any;
      const order = await orderService.createOrder(request.user!.userId, data);
      reply.code(201).send(order);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.get('/my', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const orders = await orderService.getMyOrders(request.user!.userId);
      reply.send(orders);
    } catch (error) {
      reply.code(500).send({ error: 'Failed to get orders' });
    }
  });

  fastify.get('/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as any;
      const order = await orderService.getOrderById(id, request.user!.userId);
      if (!order) {
        reply.code(404).send({ error: 'Order not found' });
        return;
      }
      reply.send(order);
    } catch (error) {
      reply.code(500).send({ error: 'Failed to get order' });
    }
  });

  // Admin routes
  fastify.get('/admin/all', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const { page = 1, limit = 20, status } = request.query as any;
      const result = await orderService.getAllOrders(parseInt(page), parseInt(limit), status);
      reply.send(result);
    } catch (error) {
      reply.code(500).send({ error: 'Failed to get orders' });
    }
  });

  fastify.put('/admin/:id/status', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { status } = request.body as any;
      
      const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        reply.code(400).send({ error: 'Invalid status' });
        return;
      }

      const order = await orderService.updateOrderStatus(id, status, request.user!.userId);
      reply.send(order);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.get('/admin/stats', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const stats = await orderService.getOrderStats();
      reply.send(stats);
    } catch (error) {
      reply.code(500).send({ error: 'Failed to get order stats' });
    }
  });
}
