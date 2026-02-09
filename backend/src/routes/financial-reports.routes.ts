import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { FinancialReportService } from '../services/financial-report.service';

const financialReportService = new FinancialReportService();

export async function financialReportsRoutes(fastify: FastifyInstance) {
  // GET /api/admin/financial-reports - Get financial reports
  fastify.get(
    '/admin/financial-reports',
    {
      preHandler: [authMiddleware, adminMiddleware],
    },
    async (request, reply) => {
      try {
        const { period } = request.query as { period?: 'week' | 'month' | 'year' };
        const data = await financialReportService.getFinancialReport(period || 'month');
        reply.send(data);
      } catch (error: any) {
        reply.code(500).send({ error: error.message });
      }
    }
  );
}
