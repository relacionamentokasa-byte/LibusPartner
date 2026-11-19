import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware } from '../../middlewares/auth.js';
import { calculateTechnicalResult, calculateTeamTechnicalResult, calculateEconomicResult } from '../calculations/engine.js';
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
          responses: { include: { participant: true } },
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
            include: { attribute: true, participant: true }
          },
          economicResult: true
        }
      }
    }
  });

  if (!evaluation) {
    return res.status(404).json({ error: 'Avaliação não encontrada' });
  }

  // Blindagem de segurança: Técnico só pode acessar suas próprias avaliações
  const currentUser = req.user!;
  if (currentUser.role === 'TECNICO' && evaluation.leadTechnicianId !== currentUser.id) {
    return res.status(403).json({ error: 'Acesso negado: você só pode visualizar avaliações conduzidas por você.' });
  }

  // Consolidar as respostas individuais por média da equipe.
  const processedComparisons = evaluation.comparisons.map(comp => {
    const technicalResult = calculateTeamTechnicalResult(comp.responses.map(response => ({
      attributeId: response.attributeId,
      participantId: response.participantId,
      libusScore: response.libusScore,
      competitorScore: response.competitorScore,
      isNotApplicable: response.isNotApplicable
    })));
    return {
      ...comp,
      technicalResult,
      teamResponseCount: new Set(comp.responses.map(response => response.participantId).filter(Boolean)).size
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
    competitorProductId: z.string().min(1, 'Produto Concorrente é obrigatório'),
    comparisonType: z.enum(['EQUIVALENCE', 'UPGRADE']).default('EQUIVALENCE').optional(),
    upgradeJustification: z.string().optional()
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
            comparisonType: c.comparisonType || 'EQUIVALENCE',
            upgradeJustification: c.upgradeJustification,
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

    // Auto-popular critérios técnicos para cada participante.
    // Avaliações antigas sem participantes continuam usando uma resposta legada.
    const createdParticipants = await prisma.evaluationParticipant.findMany({
      where: { evaluationId: evaluation.id },
      select: { id: true }
    });

    for (const comp of evaluation.comparisons) {
      const attributes = await prisma.technicalAttribute.findMany({
        where: { categoryId: comp.libusProduct.categoryId },
        orderBy: { orderIndex: 'asc' }
      });

      for (const attr of attributes) {
        if (createdParticipants.length === 0) {
          await prisma.evaluationCriterionResponse.create({
            data: {
              comparisonId: comp.id,
              attributeId: attr.id,
              libusScore: null,
              competitorScore: null,
              isNotApplicable: false
            }
          });
          continue;
        }

        await prisma.evaluationCriterionResponse.createMany({
          data: createdParticipants.map(participant => ({
            comparisonId: comp.id,
            participantId: participant.id,
            attributeId: attr.id,
            libusScore: null,
            competitorScore: null,
            isNotApplicable: false
          }))
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
  participantId: z.string().optional(),
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
    const { participantId, responses } = updateScoresSchema.parse(req.body);

    if (participantId) {
      const participant = await prisma.evaluationParticipant.findFirst({
        where: {
          id: participantId,
          evaluation: { leadTechnicianId: req.user!.id }
        }
      });
      if (!participant && req.user!.role === 'TECNICO') {
        return res.status(403).json({ error: 'Participante não pertence à sua avaliação.' });
      }
    }

    for (const r of responses) {
      if (participantId) {
        await prisma.evaluationCriterionResponse.upsert({
          where: {
            comparisonId_attributeId_participantId: {
              comparisonId,
              attributeId: r.attributeId,
              participantId
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
            participantId,
            attributeId: r.attributeId,
            libusScore: r.isNotApplicable ? null : r.libusScore,
            competitorScore: r.isNotApplicable ? null : r.competitorScore,
            isNotApplicable: r.isNotApplicable ?? false,
            observation: r.observation
          }
        });
      } else {
        // Compatibilidade com respostas legadas sem participante.
        const legacyResponse = await prisma.evaluationCriterionResponse.findFirst({
          where: { comparisonId, attributeId: r.attributeId, participantId: null },
          select: { id: true }
        });
        const legacyData = {
          libusScore: r.isNotApplicable ? null : r.libusScore,
          competitorScore: r.isNotApplicable ? null : r.competitorScore,
          isNotApplicable: r.isNotApplicable ?? false,
          observation: r.observation
        };
        if (legacyResponse) {
          await prisma.evaluationCriterionResponse.update({ where: { id: legacyResponse.id }, data: legacyData });
        } else {
          await prisma.evaluationCriterionResponse.create({
            data: { comparisonId, attributeId: r.attributeId, ...legacyData }
          });
        }
      }
    }

    // Retornar resultado técnico médio da equipe
    const updatedResponses = await prisma.evaluationCriterionResponse.findMany({
      where: { comparisonId },
      select: { attributeId: true, participantId: true, libusScore: true, competitorScore: true, isNotApplicable: true }
    });

    const technicalResult = calculateTeamTechnicalResult(updatedResponses);

    // Atualizar evaluation para atualizar updatedAt e updatedById
    await prisma.evaluation.update({
      where: { id: comparisonId ? (await prisma.evaluationComparison.findUnique({ where: { id: comparisonId }, select: { evaluationId: true } }))?.evaluationId : undefined },
      data: { updatedById: req.user!.id }
    }).catch(() => {});

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
  disposalCostPerUnit: z.number().min(0).default(0).optional(),
  productWeightGrams: z.number().min(0).default(0).optional(),
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
      lifespanLibusMonths: input.lifespanLibus,
      disposalCostPerUnit: input.disposalCostPerUnit,
      productWeightGrams: input.productWeightGrams
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
        disposalCostPerUnit: input.disposalCostPerUnit ?? 0,
        productWeightGrams: input.productWeightGrams ?? 0,
        disposalCostSavings: calc.disposalCostSavings,
        wasteKgReduced: calc.wasteKgReduced,
        unitsDiscardedCurrent: calc.unitsDiscardedCurrent,
        unitsDiscardedLibus: calc.unitsDiscardedLibus,
        totalAnnualSavings: calc.totalAnnualSavings,
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
        disposalCostPerUnit: input.disposalCostPerUnit ?? 0,
        productWeightGrams: input.productWeightGrams ?? 0,
        disposalCostSavings: calc.disposalCostSavings,
        wasteKgReduced: calc.wasteKgReduced,
        unitsDiscardedCurrent: calc.unitsDiscardedCurrent,
        unitsDiscardedLibus: calc.unitsDiscardedLibus,
        totalAnnualSavings: calc.totalAnnualSavings,
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

// Concluir e Homologar com Assinaturas Digitais na Tela
const signEvaluationSchema = z.object({
  technicianSignature: z.string().min(10, 'Assinatura do técnico é obrigatória'),
  technicianSignerName: z.string().min(2, 'Nome do técnico é obrigatório'),
  clientSignature: z.string().min(10, 'Assinatura do cliente é obrigatória'),
  clientSignerName: z.string().min(2, 'Nome do responsável do cliente é obrigatório'),
  clientSignerRole: z.string().min(2, 'Cargo do responsável é obrigatório'),
  clientSignerDocument: z.string().optional(),
  technicianInstructed: z.boolean().default(true),
  instructionNotes: z.string().optional()
});

evaluationsRouter.patch('/:id/sign-and-complete', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const input = signEvaluationSchema.parse(req.body);

    // Se for técnico, só pode assinar/concluir a própria avaliação
    const existing = await prisma.evaluation.findUnique({
      where: { id: req.params.id },
      select: { leadTechnicianId: true }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    if (user.role === 'TECNICO' && existing.leadTechnicianId !== user.id) {
      return res.status(403).json({ error: 'Acesso negado: você só pode homologar avaliações conduzidas por você.' });
    }

    const now = new Date();
    const evaluation = await prisma.evaluation.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        completedAt: now,
        signedAt: now,
        technicianSignature: input.technicianSignature,
        technicianSignerName: input.technicianSignerName,
        clientSignature: input.clientSignature,
        clientSignerName: input.clientSignerName,
        clientSignerRole: input.clientSignerRole,
        clientSignerDocument: input.clientSignerDocument,
        technicianInstructed: input.technicianInstructed,
        instructionNotes: input.instructionNotes,
        updatedById: user.id
      },
      include: {
        company: { select: { tradeName: true } }
      }
    });

    await createAuditLog({
      user,
      action: 'COMPLETE_AND_SIGN',
      entity: 'EVALUATION',
      entityId: evaluation.id,
      details: {
        companyName: evaluation.company.tradeName,
        completedAt: now,
        signedAt: now,
        technicianSignerName: input.technicianSignerName,
        clientSignerName: input.clientSignerName,
        clientSignerRole: input.clientSignerRole,
        clientSignerDocument: input.clientSignerDocument
      },
      ipAddress: req.ip
    });

    return res.json({ success: true, evaluation });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro ao assinar e homologar avaliação' });
  }
});

// Concluir Avaliação (com termo de orientação técnica do especialista Libus)
const completeEvaluationSchema = z.object({
  technicianInstructed: z.boolean().default(true),
  instructionNotes: z.string().optional()
});

// Adicionar ou atualizar participantes de uma avaliação
const updateParticipantsSchema = z.object({
  participants: z.array(z.object({
    name: z.string().min(1, 'Nome do participante é obrigatório'),
    roleOrArea: z.string().min(1, 'Área/Cargo é obrigatório'),
    companyName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional()
  }))
});

evaluationsRouter.put('/:id/participants', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { participants } = updateParticipantsSchema.parse(req.body);

    const existingParticipants = await prisma.evaluationParticipant.findMany({
      where: { evaluationId: id },
      include: { _count: { select: { criterionResponses: true } } }
    });

    const hasAnswered = existingParticipants.some(participant => participant._count.criterionResponses > 0);
    const incomingNames = new Set(participants.map(participant => participant.name.trim().toLowerCase()));
    const removedWithAnswers = existingParticipants.filter(participant =>
      participant._count.criterionResponses > 0 && !incomingNames.has(participant.name.trim().toLowerCase())
    );

    if (removedWithAnswers.length > 0) {
      return res.status(409).json({
        error: 'Não é possível remover participantes que já possuem respostas. Preserve a equipe respondente ou crie uma nova avaliação.'
      });
    }

    const createdParticipants = await prisma.$transaction(async tx => {
      let participantRows;
      if (!hasAnswered) {
        await tx.evaluationParticipant.deleteMany({ where: { evaluationId: id } });
        await tx.evaluationParticipant.createMany({
          data: participants.map(p => ({
            evaluationId: id,
            name: p.name,
            roleOrArea: p.roleOrArea,
            companyName: p.companyName,
            email: p.email,
            phone: p.phone
          }))
        });
        participantRows = await tx.evaluationParticipant.findMany({ where: { evaluationId: id } });
      } else {
        const existingNames = new Set(existingParticipants.map(p => p.name.trim().toLowerCase()));
        const newParticipants = participants.filter(p => !existingNames.has(p.name.trim().toLowerCase()));
        if (newParticipants.length > 0) {
          await tx.evaluationParticipant.createMany({
            data: newParticipants.map(p => ({
              evaluationId: id,
              name: p.name,
              roleOrArea: p.roleOrArea,
              companyName: p.companyName,
              email: p.email,
              phone: p.phone
            }))
          });
        }
        participantRows = await tx.evaluationParticipant.findMany({ where: { evaluationId: id } });
      }

      const comparisons = await tx.evaluationComparison.findMany({
        where: { evaluationId: id },
        include: { libusProduct: { select: { categoryId: true } } }
      });
      const missingResponses: Array<{ comparisonId: string; participantId: string; attributeId: string }> = [];
      for (const comparison of comparisons) {
        const attributes = await tx.technicalAttribute.findMany({
          where: { categoryId: comparison.libusProduct.categoryId },
          select: { id: true }
        });
        const existing = await tx.evaluationCriterionResponse.findMany({
          where: { comparisonId: comparison.id, participantId: { not: null } },
          select: { participantId: true, attributeId: true }
        });
        const keys = new Set(existing.map(row => `${row.participantId}:${row.attributeId}`));
        for (const participant of participantRows) {
          for (const attribute of attributes) {
            const key = `${participant.id}:${attribute.id}`;
            if (!keys.has(key)) {
              missingResponses.push({ comparisonId: comparison.id, participantId: participant.id, attributeId: attribute.id });
            }
          }
        }
      }
      if (missingResponses.length > 0) {
        await tx.evaluationCriterionResponse.createMany({
          data: missingResponses.map(row => ({ ...row, isNotApplicable: false }))
        });
      }
      return participantRows;
    });

    return res.json({ success: true, participants: createdParticipants });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao atualizar participantes' });
  }
});

evaluationsRouter.patch('/:id/complete', async (req: Request, res: Response) => {
  const user = req.user!;
  const { technicianInstructed = true, instructionNotes } = completeEvaluationSchema.parse(req.body || {});

  const evaluation = await prisma.evaluation.update({
    where: { id: req.params.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      technicianInstructed,
      instructionNotes,
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
      completedAt: evaluation.completedAt,
      technicianInstructed,
      instructionNotes
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

    // Técnicos podem excluir apenas as próprias avaliações; Gestores não têm exclusão administrativa
    if (user.role !== 'ADMIN' && evaluation.leadTechnicianId !== user.id) {
      return res.status(403).json({ error: 'Apenas o Administrador pode excluir avaliações de terceiros.' });
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
