import { FastifyInstance } from 'fastify';
import { InvoiceSimpleService } from '../services/invoice-simple.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const invoiceService = new InvoiceSimpleService();

export async function invoiceSimpleRoutes(fastify: FastifyInstance) {
  // User: Obține factura pentru comandă
  fastify.get('/order/:orderId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { orderId } = request.params as any;
      const userId = request.user!.userId;
      
      const invoice = await invoiceService.getInvoiceForOrder(orderId, userId);
      reply.send(invoice);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // User: Obține HTML pentru print (GET și POST pentru compatibilitate)
  fastify.get('/order/:orderId/print', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { orderId } = request.params as any;
      const userId = request.user!.userId;
      
      const invoice = await invoiceService.getInvoiceForOrder(orderId, userId);
      const html = invoiceService.generateInvoiceHTML(invoice);
      
      reply.type('text/html').send(html);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // POST version pentru admin (cu token în body)
  fastify.post('/order/:orderId/print', {
    schema: {
      body: {
        type: 'object',
        properties: {
          token: { type: 'string' }
        },
        required: ['token']
      }
    }
  }, async (request, reply) => {
    try {
      const { orderId } = request.params as any;
      const { token } = request.body as any;
      
      if (!token) {
        return reply.code(401).send({ error: 'No token provided' });
      }

      // Verifică token-ul manual
      try {
        const decoded = request.server.jwt.verify(token) as any;
        
        // Verifică dacă utilizatorul există și obține rolul
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, role: true }
        });

        if (!user) {
          return reply.code(401).send({ error: 'User not found' });
        }

        let invoice;
        if (user.role === 'admin') {
          // Admin poate vedea orice factură
          invoice = await invoiceService.getInvoiceForOrderAdmin(orderId);
        } else {
          // Utilizator normal poate vedea doar propriile facturi
          invoice = await invoiceService.getInvoiceForOrder(orderId, decoded.userId);
        }
        
        const html = invoiceService.generateInvoiceHTML(invoice);
        reply.type('text/html').send(html);
      } catch (jwtError) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // User: Obține toate facturile utilizatorului
  fastify.get('/my-invoices', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const userId = request.user!.userId;
      const invoices = await invoiceService.getUserInvoices(userId);
      reply.send(invoices);
    } catch (error: any) {
      reply.code(500).send({ error: 'Failed to get invoices' });
    }
  });

  // Admin: Obține toate facturile
  fastify.get('/admin/all', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const { page = 1, limit = 20 } = request.query as any;
      const result = await invoiceService.getAllInvoices(parseInt(page), parseInt(limit));
      reply.send(result);
    } catch (error: any) {
      reply.code(500).send({ error: 'Failed to get invoices' });
    }
  });

  // Admin: Generează factură pentru comandă
  fastify.post('/admin/generate/:orderId', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const { orderId } = request.params as any;
      const invoice = await invoiceService.generateInvoiceForOrder(orderId);
      reply.send(invoice);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  // Admin: Generează facturi pentru toate comenzile care nu au facturi
  fastify.post('/admin/generate-missing', { preHandler: [authMiddleware, adminMiddleware] }, async (request, reply) => {
    try {
      const result = await invoiceService.generateMissingInvoices();
      reply.send(result);
    } catch (error: any) {
      reply.code(500).send({ error: error.message });
    }
  });
}