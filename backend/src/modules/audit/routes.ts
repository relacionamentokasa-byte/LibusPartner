import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.js';

export const auditRouter = Router();
auditRouter.use(authMiddleware);

// Apenas ADMIN e GESTOR podem visualizar logs de auditoria
auditRouter.get('/', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const { entity, action, userId, limit = '50', page = '1' } = req.query;

    const take = Math.min(Math.max(parseInt(String(limit), 10) || 50, 1), 200);
    const skip = (Math.max(parseInt(String(page), 10) || 1, 1) - 1) * take;

    const whereClause: any = {};
    if (entity) whereClause.entity = String(entity);
    if (action) whereClause.action = String(action);
    if (userId) whereClause.userId = String(userId);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      }),
      prisma.auditLog.count({ where: whereClause })
    ]);

    return res.json({
      logs,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (err) {
    console.error('Erro ao listar logs de auditoria:', err);
    return res.status(500).json({ error: 'Erro ao listar logs de auditoria' });
  }
});

// Resumo/Estatísticas de ações recentes para o painel de gestão
auditRouter.get('/stats', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const [recentEmissions, recentDeletions, totalLogs] = await Promise.all([
      prisma.auditLog.count({ where: { action: { in: ['EMISSION', 'EXPORT_PDF', 'COMPLETE'] } } }),
      prisma.auditLog.count({ where: { action: 'DELETE' } }),
      prisma.auditLog.count()
    ]);

    return res.json({
      recentEmissions,
      recentDeletions,
      totalLogs
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao carregar estatísticas de auditoria' });
  }
});
