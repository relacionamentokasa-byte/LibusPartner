import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware } from '../../middlewares/auth.js';
import { calculateTechnicalResult, calculateEconomicResult } from '../calculations/engine.js';
import { createAuditLog } from '../../lib/audit.js';

export const evaluationsRouter = Router();
evaluationsRouter.use(authMiddleware);

const normalizeSignerName = (value?: string | null) =>
  (value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const buildSignatureStatus = (evaluation: any) => {
  const participants = evaluation.participants || [];
  const signatures = evaluation.participantSignatures || [];
  const signedIds = new Set(signatures.map((signature: any) => signature.participantId));
  const pendingParticipants = participants.filter((participant: any) => !signedIds.has(participant.id));
  const allParticipantsSigned = participants.length === 0
    ? Boolean(evaluation.clientSignature)
    : pendingParticipants.length === 0;
  const technicianSigned = Boolean(evaluation.technicianSignature);

  return {
    technicianSigned,
    totalParticipants: participants.length,
    signedParticipants: participants.filter((participant: any) => signedIds.has(participant.id)).length,
    pendingParticipants: pendingParticipants.map((participant: any) => ({
      id: participant.id,
      name: participant.name,
      roleOrArea: participant.roleOrArea
    })),
    allParticipantsSigned,
    allSigned: technicianSigned && allParticipantsSigned
  };
};

/**
 * Compatibilidade para avaliações criadas antes das assinaturas por participante.
 * A operação é idempotente e não apaga os campos legados.
 */
const normalizeLegacyParticipantSignature = async (evaluation: any) => {
  const participants = evaluation.participants || [];
  const signatures = evaluation.participantSignatures || [];
  if (!evaluation.clientSignature || !evaluation.clientSignerName || participants.length === 0) {
    return { ...evaluation, participantSignatures: signatures, signatureStatus: buildSignatureStatus({ ...evaluation, participantSignatures: signatures }) };
  }

  const legacyAlreadyLinked = signatures.some((signature: any) =>
    signature.signature === evaluation.clientSignature ||
    normalizeSignerName(signature.signerName) === normalizeSignerName(evaluation.clientSignerName)
  );

  if (!legacyAlreadyLinked) {
    const signerName = normalizeSignerName(evaluation.clientSignerName);
    const participant = participants.find((candidate: any) => normalizeSignerName(candidate.name) === signerName)
      || (participants.length === 1 ? participants[0] : null);

    if (participant) {
      const signature = await prisma.evaluationParticipantSignature.upsert({
        where: {
          evaluationId_participantId: {
            evaluationId: evaluation.id,
            participantId: participant.id
          }
        },
        update: {},
        create: {
          evaluationId: evaluation.id,
          participantId: participant.id,
          signature: evaluation.clientSignature,
          signerName: evaluation.clientSignerName,
          signerRole: evaluation.clientSignerRole || participant.roleOrArea || 'Responsável do Cliente / SESMT',
          signerDocument: evaluation.clientSignerDocument || undefined,
          signedAt: evaluation.signedAt || new Date()
        }
      });
      signatures.push(signature);
    }
  }

  const normalized = { ...evaluation, participantSignatures: signatures };
  const signatureStatus = buildSignatureStatus(normalized);
  if (normalized.status === 'COMPLETED' && participants.length > 0 && !signatureStatus.allSigned) {
    await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: { status: 'IN_PROGRESS', completedAt: null }
    });
    normalized.status = 'IN_PROGRESS';
    normalized.completedAt = null;
  }
  return { ...normalized, signatureStatus: buildSignatureStatus(normalized) };
};

const normalizeEvaluations = async (evaluations: any[]) =>
  Promise.all(evaluations.map(normalizeLegacyParticipantSignature));

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

  if (req.query.summary === 'true') {
    const summaries = await prisma.evaluation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
        leadTechnician: { select: { id: true, name: true, email: true } },
        participants: true,
        participantSignatures: true,
        comparisons: {
          select: {
            id: true,
            orderIndex: true,
            libusProduct: { select: { id: true, name: true } },
            competitorProduct: {
              select: {
                id: true,
                name: true,
                manufacturer: { select: { name: true } }
              }
            }
          }
        }
      }
    });
    return res.json({ evaluations: await normalizeEvaluations(summaries) });
  }

  const evaluations = await prisma.evaluation.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      company: true,
      leadTechnician: { select: { id: true, name: true, email: true } },
      participants: true,
      participantSignatures: true,
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

  const normalizedEvaluations = await normalizeEvaluations(evaluations);
  return res.json({ evaluations: normalizedEvaluations });
});

// Detalhe da avaliação com cálculo técnico e econômico em tempo real
evaluationsRouter.get('/:id', async (req: Request, res: Response) => {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: req.params.id },
    include: {
      company: true,
      leadTechnician: { select: { id: true, name: true, email: true } },
      participants: true,
      participantSignatures: true,
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

  // Blindagem de segurança: Técnico só pode acessar suas próprias avaliações
  const currentUser = req.user!;
  if (currentUser.role === 'TECNICO' && evaluation.leadTechnicianId !== currentUser.id) {
    return res.status(403).json({ error: 'Acesso negado: você só pode visualizar avaliações conduzidas por você.' });
  }

  // Calcular resultados consolidados para cada comparação
  const processedComparisons = evaluation.comparisons.map(comp => {
    const technicalResult = calculateTechnicalResult(comp.responses);
    return {
      ...comp,
      technicalResult
    };
  });

  const normalizedEvaluation = await normalizeLegacyParticipantSignature(evaluation);
  return res.json({
    evaluation: {
      ...normalizedEvaluation,
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
    participantId: z.string().nullable().optional(),
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
    const comparison = await prisma.evaluationComparison.findUnique({
      where: { id: comparisonId },
      select: { evaluationId: true }
    });
    if (!comparison) return res.status(404).json({ error: 'Comparativo não encontrado' });

    const participantIds = [...new Set(responses.map(response => response.participantId).filter(Boolean))] as string[];
    if (participantIds.length > 0) {
      const validParticipants = await prisma.evaluationParticipant.count({
        where: { evaluationId: comparison.evaluationId, id: { in: participantIds } }
      });
      if (validParticipants !== participantIds.length) {
        return res.status(400).json({ error: 'Participante inválido para esta avaliação' });
      }
    }

    for (const r of responses) {
      await prisma.evaluationCriterionResponse.upsert({
        where: {
          comparisonId_attributeId_participantId: {
            comparisonId,
            attributeId: r.attributeId,
            participantId: r.participantId ?? null
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
          participantId: r.participantId ?? null,
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
const participantSignatureSchema = z.object({
  participantId: z.string().min(1, 'Participante é obrigatório'),
  signature: z.string().min(10, 'Assinatura do responsável é obrigatória'),
  signerName: z.string().min(2, 'Nome do responsável é obrigatório'),
  signerRole: z.string().min(2, 'Cargo do responsável é obrigatório'),
  signerDocument: z.string().optional()
});

const signEvaluationSchema = z.object({
  technicianSignature: z.string().min(10, 'Assinatura do técnico é obrigatória'),
  technicianSignerName: z.string().min(2, 'Nome do técnico é obrigatório'),
  participantSignatures: z.array(participantSignatureSchema).optional(),
  // Campos legados: aceitos para avaliações antigas com um único responsável.
  clientSignature: z.string().min(10).optional(),
  clientSignerName: z.string().min(2).optional(),
  clientSignerRole: z.string().min(2).optional(),
  clientSignerDocument: z.string().optional(),
  technicianInstructed: z.boolean().default(true),
  instructionNotes: z.string().optional()
});

const resolveParticipantSignatures = async (evaluationId: string, input: z.infer<typeof signEvaluationSchema>) => {
  const participants = await prisma.evaluationParticipant.findMany({
    where: { evaluationId },
    orderBy: { createdAt: 'asc' }
  });

  const submitted = input.participantSignatures || [];
  if (participants.length > 0) {
    const byId = new Map(submitted.map(signature => [signature.participantId, signature]));
    if (submitted.length !== participants.length || participants.some(participant => !byId.has(participant.id))) {
      throw new Error('Todos os responsáveis participantes devem assinar antes da homologação.');
    }
    const participantIds = new Set(participants.map(participant => participant.id));
    if (submitted.some(signature => !participantIds.has(signature.participantId))) {
      throw new Error('Participante inválido para esta avaliação.');
    }
    return submitted;
  }

  if (input.clientSignature && input.clientSignerName && input.clientSignerRole) {
    return [];
  }

  throw new Error('É necessário cadastrar pelo menos um responsável ou informar a assinatura legada do cliente.');
};

const persistParticipantSignatures = async (
  evaluationId: string,
  signatures: z.infer<typeof participantSignatureSchema>[]
) => {
  for (const signature of signatures) {
    await prisma.evaluationParticipantSignature.upsert({
      where: {
        evaluationId_participantId: {
          evaluationId,
          participantId: signature.participantId
        }
      },
      update: {
        signature: signature.signature,
        signerName: signature.signerName,
        signerRole: signature.signerRole,
        signerDocument: signature.signerDocument,
        signedAt: new Date()
      },
      create: {
        evaluationId,
        participantId: signature.participantId,
        signature: signature.signature,
        signerName: signature.signerName,
        signerRole: signature.signerRole,
        signerDocument: signature.signerDocument
      }
    });
  }
};

evaluationsRouter.patch('/:id/participant-signatures/:participantId', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const input = participantSignatureSchema.parse({
      participantId: req.params.participantId,
      ...req.body
    });
    const technicianSignature = typeof req.body.technicianSignature === 'string' && req.body.technicianSignature.length > 10
      ? req.body.technicianSignature
      : undefined;
    const technicianSignerName = typeof req.body.technicianSignerName === 'string' && req.body.technicianSignerName.trim()
      ? req.body.technicianSignerName.trim()
      : undefined;
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: req.params.id },
      select: { id: true, leadTechnicianId: true }
    });
    if (!evaluation) return res.status(404).json({ error: 'Avaliação não encontrada' });
    if (user.role === 'TECNICO' && evaluation.leadTechnicianId !== user.id) {
      return res.status(403).json({ error: 'Acesso negado para esta avaliação.' });
    }
    const participant = await prisma.evaluationParticipant.findFirst({
      where: { id: input.participantId, evaluationId: evaluation.id }
    });
    if (!participant) return res.status(400).json({ error: 'Participante inválido para esta avaliação.' });
    await persistParticipantSignatures(evaluation.id, [input]);
    if (technicianSignature) {
      await prisma.evaluation.update({
        where: { id: evaluation.id },
        data: {
          technicianSignature,
          ...(technicianSignerName ? { technicianSignerName } : {}),
          updatedById: user.id
        }
      });
    }
    const updated = await prisma.evaluation.findUnique({
      where: { id: evaluation.id },
      include: { participants: true, participantSignatures: true }
    });
    const normalized = await normalizeLegacyParticipantSignature(updated);
    const signatureStatus = buildSignatureStatus(normalized);
    const allSigned = signatureStatus.allSigned;
    const completed = allSigned && Boolean(normalized.technicianSignature);
    const finalEvaluation = completed && normalized.status !== 'COMPLETED'
      ? await prisma.evaluation.update({
          where: { id: evaluation.id },
          data: { status: 'COMPLETED', signedAt: normalized.signedAt || new Date(), completedAt: normalized.completedAt || new Date() },
          include: { participants: true, participantSignatures: true }
        })
      : normalized;
    return res.json({
      success: true,
      evaluation: { ...finalEvaluation, signatureStatus: buildSignatureStatus(finalEvaluation) }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: 'Erro ao salvar assinatura do participante' });
  }
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

    const participantSignatures = await resolveParticipantSignatures(req.params.id, input);
    const now = new Date();
    await persistParticipantSignatures(req.params.id, participantSignatures);
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
        company: { select: { tradeName: true } },
        participants: true,
        participantSignatures: true
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
    if (err instanceof Error && /participante|responsável|assinar|assinatura/i.test(err.message)) {
      return res.status(400).json({ error: err.message });
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

    // Substituir participantes da avaliação
    await prisma.evaluationParticipant.deleteMany({
      where: { evaluationId: id }
    });

    const created = await prisma.evaluationParticipant.createMany({
      data: participants.map(p => ({
        evaluationId: id,
        name: p.name,
        roleOrArea: p.roleOrArea,
        companyName: p.companyName,
        email: p.email,
        phone: p.phone
      }))
    });

    const updatedParticipants = await prisma.evaluationParticipant.findMany({
      where: { evaluationId: id }
    });

    return res.json({ success: true, participants: updatedParticipants });
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
  const existing = await prisma.evaluation.findUnique({
    where: { id: req.params.id },
    include: { participants: true, participantSignatures: true }
  });
  if (!existing) return res.status(404).json({ error: 'Avaliação não encontrada' });
  const normalized = await normalizeLegacyParticipantSignature(existing);
  const signatureStatus = buildSignatureStatus(normalized);
  if (!signatureStatus.allSigned) {
    return res.status(400).json({
      error: 'A avaliação não pode ser homologada enquanto houver assinaturas pendentes.',
      signatureStatus
    });
  }

  const evaluation = await prisma.evaluation.update({
    where: { id: req.params.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      signedAt: existing.signedAt || new Date(),
      technicianInstructed,
      instructionNotes,
      updatedById: user.id
    },
    include: {
      company: { select: { tradeName: true } },
      participants: true,
      participantSignatures: true
    }
  });
  const responseEvaluation = await normalizeLegacyParticipantSignature(evaluation);



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

  return res.json({ success: true, evaluation: responseEvaluation });
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
