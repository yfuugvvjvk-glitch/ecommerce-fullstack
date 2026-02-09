import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { carouselService } from '../services/carousel.service';

// Middleware pentru verificarea rolului de admin
const adminMiddleware = async (request: any, reply: any) => {
  if (request.user?.role !== 'admin') {
    return reply.code(403).send({ error: 'Access denied. Admin role required.' });
  }
};

export async function carouselRoutes(fastify: FastifyInstance) {
  // === RUTE PUBLICE ===

  // Obține item-urile active din carousel (pentru afișare publică)
  fastify.get('/active', async (request, reply) => {
    try {
      const items = await carouselService.getActiveCarouselItems();
      reply.send(items);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });

  // === RUTE ADMIN ===

  // Aplicăm middleware-ul de autentificare și admin pentru rutele de mai jos
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', adminMiddleware);

  // Obține toate pozițiile disponibile
  fastify.get('/positions', async (request, reply) => {
    try {
      const positions = await carouselService.getAvailablePositions();
      reply.send(positions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });

  // Obține toate item-urile din carousel
  fastify.get('/', async (request, reply) => {
    try {
      const { includeInactive } = request.query as any;
      const items = await carouselService.getAllCarouselItems(includeInactive === 'true');
      reply.send(items);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });

  // Obține un item specific
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const item = await carouselService.getCarouselItemById(id);
      reply.send(item);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(404).send({ error: errorMessage });
    }
  });

  // Creează un nou item în carousel
  fastify.post('/', async (request, reply) => {
    try {
      const data = request.body as any;
      const userId = request.user!.userId;

      const item = await carouselService.createCarouselItem(data, userId);
      reply.code(201).send(item);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(400).send({ error: errorMessage });
    }
  });

  // Actualizează un item din carousel
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const data = request.body as any;

      const item = await carouselService.updateCarouselItem(id, data);
      reply.send(item);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(400).send({ error: errorMessage });
    }
  });

  // Șterge un item din carousel
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const result = await carouselService.deleteCarouselItem(id);
      reply.send(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(400).send({ error: errorMessage });
    }
  });

  // Schimbă pozițiile a două item-uri
  fastify.post('/swap', async (request, reply) => {
    try {
      const { itemId1, itemId2 } = request.body as any;

      if (!itemId1 || !itemId2) {
        return reply.code(400).send({ error: 'Both item IDs are required' });
      }

      const result = await carouselService.swapPositions(itemId1, itemId2);
      reply.send(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(400).send({ error: errorMessage });
    }
  });

  // Mută un item la o nouă poziție
  fastify.post('/:id/move', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { position } = request.body as any;

      if (!position || position < 1 || position > 10) {
        return reply.code(400).send({ error: 'Position must be between 1 and 10' });
      }

      const item = await carouselService.moveToPosition(id, position);
      reply.send(item);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(400).send({ error: errorMessage });
    }
  });

  // Obține statistici despre carousel
  fastify.get('/stats/overview', async (request, reply) => {
    try {
      const stats = await carouselService.getCarouselStats();
      reply.send(stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.code(500).send({ error: errorMessage });
    }
  });
}
