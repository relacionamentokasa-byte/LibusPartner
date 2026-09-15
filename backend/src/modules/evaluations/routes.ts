import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware } from '../../middlewares/auth.js';
import { calculateTechnicalResult, calculateEconomicResult } from '../calculations/engine.js';
import { createAuditLog } from '../../lib/audit.js';

export const evaluationsRouter = Router();
evaluationsRouter.use(authMiddleware);

// Listar avaliações (com filtros por perfil e empresa)
evaluationsRouter.get('/', async (req: Request, res: Response) => {
  const user = req.user!;
  const { status, companyId } = req.query;

  // Técnicos veem suas avaliações; Gestores e Admins veem todas
  const whereClause: any = {};
  if (user.role === 'TECNICO') {
    whereClause.leadTechnicianId = user.id;
  }
  if (status) whereClause.status = String(status);
  if (companyId) whereClause.companyId = String(companyId);

  const evaluations = await prisma.evaluation.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      company: true,
      leadTechnician: { select: { id: true, name: true, email: true } },
      participants: true,
      comparisons: {
        include: {
          libusProduct: true,
          competitorProduct: { include: { manufacturer: true } },
          responses: true,
          economicResult: true
        }
      }
    }
  });

  return res.json({ evaluations });
});

// Detalhe da avaliação com cálculo técnico e econômico em tempo real
evaluationsRouter.get('/:id', async (req: Request, res: Response) => {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: req.params.id },
    include: {
      company: true,
      leadTechnician: { select: { id: true, name: true, email: true } },
      participants: true,
      comparisons: {
        orderBy: { orderIndex: 'asc' },
        include: {
          libusProduct: {
            include: {
              category: true,
              attributeValues: { include: { attribute: true } }
            }
          },
          competitorProduct: {
            include: {
              manufacturer: true,
              category: true,
              attributeValues: { include: { attribute: true } }
            }
          },
          responses: {
            include: { attribute: true }
          },
          economicResult: true
        }
      }
    }
  });

  if (!evaluation) {
    return res.status(404).json({ error: 'Avaliação não encontrada' });
  }

  // Calcular resultados consolidados para cada comparação
  const processedComparisons = evaluation.comparisons.map(comp => {
    const technicalResult = calculateTechnicalResult(comp.responses);
    return {
      ...comp,
      technicalResult
    };
  });

  return res.json({
    evaluation: {
      ...evaluation,
      comparisons: processedComparisons
    }
  });
});

// Criar nova avaliação
const createEvaluationSchema = z.object({
  companyId: z.string().min(1, 'Empresa é obrigatória'),
  observations: z.string().optional(),
  participants: z.array(z.object({
    name: z.string().min(1, 'Nome do participante é obrigatório'),
    roleOrArea: z.string().min(1, 'Área/Cargo é obrigatório'),
    companyName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional()
  })).optional(),
  comparisons: z.array(z.object({
    libusProductId: z.string().min(1, 'Produto Libus é obrigatório'),
    competitorProductId: z.string().min(1, 'Produto Concorrente é obrigatório')
  })).min(1, 'Pelo menos um comparativo 1x1 deve ser incluído')
});

evaluationsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = createEvaluationSchema.parse(req.body);
    const leadTechnicianId = req.user!.id;

    // Criar avaliação no banco
    const evaluation = await prisma.evaluation.create({
      data: {
        companyId: data.companyId,
        leadTechnicianId,
        createdById: leadTechnicianId,
        updatedById: leadTechnicianId,
        observations: data.observations,
        status: 'IN_PROGRESS',
        participants: {
          create: (data.participants || []).map(p => ({
            name: p.name,
            roleOrArea: p.roleOrArea,
            companyName: p.companyName,
            email: p.email,
            phone: p.phone
          }))
        },
        comparisons: {
          create: data.comparisons.map((c, idx) => ({
            libusProductId: c.libusProductId,
            competitorProductId: c.competitorProductId,
            orderIndex: idx
          }))
        }
      },
      include: {
        comparisons: {
          include: {
            libusProduct: true,
            competitorProduct: true
          }
        },
        company: {
          select: { tradeName: true }
        }
      }
    });

    // Registrar log de auditoria de criação de laudo
    await createAuditLog({
      user: req.user,
      action: 'CREATE',
      entity: 'EVALUATION',
      entityId: evaluation.id,
      details: {
        companyId: data.companyId,
        companyName: evaluation.company.tradeName,
        comparisonsCount: data.comparisons.length,
        status: 'IN_PROGRESS'
      },
      ipAddress: req.ip
    });

    // Auto-popular critérios técnicos das categorias para cada comparação
    for (const comp of evaluation.comparisons) {
      const attributes = await prisma.technicalAttribute.findMany({
        where: { categoryId: comp.libusProduct.categoryId },
        orderBy: { orderIndex: 'asc' }
      });

      for (const attr of attributes) {
        await prisma.evaluationCriterionResponse.create({
          data: {
            comparisonId: comp.id,
            attributeId: attr.id,
            libusScore: null,
            competitorScore: null,
            isNotApplicable: false
          }
        });
      }
    }

    return res.status(201).json({ evaluation, evaluationId: evaluation.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// Atualizar notas de um comparativo
const updateScoresSchema = z.object({
  responses: z.array(z.object({
    attributeId: z.string(),
    libusScore: z.number().min(1).max(10).nullable().optional(),
    competitorScore: z.number().min(1).max(10).nullable().optional(),
    isNotApplicable: z.boolean().optional(),
    observation: z.string().optional()
  }))
});

evaluationsRouter.put('/comparisons/:comparisonId/scores', async (req: Request, res: Response) => {
  try {
    const { comparisonId } = req.params;
    const { responses } = updateScoresSchema.parse(req.body);

    for (const r of responses) {
      await prisma.evaluationCriterionResponse.upsert({
        where: {
          comparisonId_attributeId: {
            comparisonId,
            attributeId: r.attributeId
          }
        },
        update: {
          libusScore: r.isNotApplicable ? null : r.libusScore,
          competitorScore: r.isNotApplicable ? null : r.competitorScore,
          isNotApplicable: r.isNotApplicable ?? false,
          observation: r.observation
        },
        create: {
          comparisonId,
          attributeId: r.attributeId,
          libusScore: r.isNotApplicable ? null : r.libusScore,
          competitorScore: r.isNotApplicable ? null : r.competitorScore,
          isNotApplicable: r.isNotApplicable ?? false,
          observation: r.observation
        }
      });
    }

    // Retornar resultado técnico recalculado
    const updatedResponses = await prisma.evaluationCriterionResponse.findMany({
      where: { comparisonId }
    });

    // Atualizar evaluation para atualizar updatedAt e updatedById
    await prisma.evaluation.update({
      where: { id: comparisonId ? (await prisma.evaluationComparison.findUnique({ where: { id: comparisonId }, select: { evaluationId: true } }))?.evaluationId : undefined },
      data: { updatedById: req.user!.id }
    }).catch(() => {});

    const technicalResult = calculateTechnicalResult(updatedResponses);
    return res.json({ success: true, technicalResult });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao atualizar notas' });
  }
});

// Salvar / Calcular resultado econômico de um comparativo
const economicResultSchema = z.object({
  currentPrice: z.number().min(0.01, 'Preço do concorrente é obrigatório'),
  libusPrice: z.number().min(0.01, 'Preço Libus é obrigatório'),
  quantity: z.number().min(1).default(1),
  consumptionPeriod: z.string().default('MONTHLY'),
  lifespanCurrent: z.number().min(0.1, 'Vida útil do concorrente é obrigatória'),
  lifespanLibus: z.number().min(0.1, 'Vida útil Libus é obrigatória'),
  notes: z.string().optional()
});

evaluationsRouter.put('/comparisons/:comparisonId/economic', async (req: Request, res: Response) => {
  try {
    const { comparisonId } = req.params;
    const input = economicResultSchema.parse(req.body);

    const calc = calculateEconomicResult({
      currentPrice: input.currentPrice,
      libusPrice: input.libusPrice,
      quantity: input.quantity,
      lifespanCurrentMonths: input.lifespanCurrent,
      lifespanLibusMonths: input.lifespanLibus
    });

    const economicResult = await prisma.evaluationEconomicResult.upsert({
      where: { comparisonId },
      update: {
        currentPrice: input.currentPrice,
        libusPrice: input.libusPrice,
        quantity: input.quantity,
        consumptionPeriod: input.consumptionPeriod,
        lifespanCurrent: input.lifespanCurrent,
        lifespanLibus: input.lifespanLibus,
        costCurrentTotal: calc.costCurrentTotal,
        costLibusTotal: calc.costLibusTotal,
        costDifference: calc.costDifference,
        economyGenerated: calc.economyGenerated,
        economyPercent: calc.economyPercent,
        notes: input.notes
      },
      create: {
        comparisonId,
        currentPrice: input.currentPrice,
        libusPrice: input.libusPrice,
        quantity: input.quantity,
        consumptionPeriod: input.consumptionPeriod,
        lifespanCurrent: input.lifespanCurrent,
        lifespanLibus: input.lifespanLibus,
        costCurrentTotal: calc.costCurrentTotal,
        costLibusTotal: calc.costLibusTotal,
        costDifference: calc.costDifference,
        economyGenerated: calc.economyGenerated,
        economyPercent: calc.economyPercent,
        notes: input.notes
      }
    });

    // Atualizar evaluation para atualizar updatedAt e updatedById
    if (comparisonId) {
      const comp = await prisma.evaluationComparison.findUnique({
        where: { id: comparisonId },
        select: { evaluationId: true }
      });
      if (comp?.evaluationId) {
        await prisma.evaluation.update({
          where: { id: comp.evaluationId },
          data: { updatedById: req.user!.id }
        }).catch(() => {});
      }
    }

    return res.json({ success: true, economicResult });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao calcular resultado econômico' });
  }
});

// Concluir Avaliação
evaluationsRouter.patch('/:id/complete', async (req: Request, res: Response) => {
  const user = req.user!;
  const evaluation = await prisma.evaluation.update({
    where: { id: req.params.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      updatedById: user.id
    },
    include: {
      company: { select: { tradeName: true } }
    }
  });

  await createAuditLog({
    user,
    action: 'COMPLETE',
    entity: 'EVALUATION',
    entityId: evaluation.id,
    details: {
      companyName: evaluation.company.tradeName,
      completedAt: evaluation.completedAt
    },
    ipAddress: req.ip
  });

  return res.json({ success: true, evaluation });
});

// Registrar log de emissão/impressão ou visualização do laudo técnico oficial
evaluationsRouter.post('/:id/audit-emission', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const evaluationId = req.params.id;

    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: { company: { select: { tradeName: true } } }
    });

    if (!evaluation) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    await createAuditLog({
      user,
      action: 'EMISSION',
      entity: 'EVALUATION',
      entityId: evaluation.id,
      details: {
        companyName: evaluation.company.tradeName,
        actionType: req.body.actionType || 'PRINT_PDF'
      },
      ipAddress: req.ip
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao registrar auditoria de emissão' });
  }
});

// Excluir Avaliação
evaluationsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const evaluationId = req.params.id;

    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        company: { select: { tradeName: true } }
      }
    });

    if (!evaluation) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    // Técnicos só podem excluir suas próprias avaliações; Gestores/Admins podem excluir qualquer uma
    if (user.role === 'TECNICO' && evaluation.leadTechnicianId !== user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir esta avaliação' });
    }

    // Gravar log de auditoria ANTES da exclusão física
    await createAuditLog({
      user,
      action: 'DELETE',
      entity: 'EVALUATION',
      entityId: evaluationId,
      details: {
        companyName: evaluation.company.tradeName,
        leadTechnicianId: evaluation.leadTechnicianId,
        status: evaluation.status
      },
      ipAddress: req.ip
    });

    await prisma.evaluation.delete({
      where: { id: evaluationId }
    });

    return res.json({ success: true, message: 'Avaliação excluída com sucesso' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao excluir avaliação' });
  }
});
