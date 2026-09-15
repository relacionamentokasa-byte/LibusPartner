import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.js';
import { createAuditLog } from '../../lib/audit.js';

export const companiesRouter = Router();
companiesRouter.use(authMiddleware);

const companySchema = z.object({
  tradeName: z.string().min(2, 'Nome Fantasia é obrigatório'),
  corporateName: z.string().optional(),
  cnpj: z.string().optional(),
  segment: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional()
});

companiesRouter.get('/', async (req: Request, res: Response) => {
  const companies = await prisma.company.findMany({
    where: { active: true },
    orderBy: { tradeName: 'asc' },
    include: {
      _count: {
        select: { evaluations: true }
      }
    }
  });
  return res.json({ companies });
});

companiesRouter.get('/:id', async (req: Request, res: Response) => {
  const company = await prisma.company.findUnique({
    where: { id: req.params.id },
    include: {
      evaluations: {
        orderBy: { createdAt: 'desc' },
        include: {
          leadTechnician: { select: { id: true, name: true } },
          comparisons: {
            include: {
              libusProduct: true,
              competitorProduct: { include: { manufacturer: true } }
            }
          }
        }
      }
    }
  });
  if (!company) return res.status(404).json({ error: 'Empresa não encontrada' });
  return res.json({ company });
});

companiesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const data = companySchema.parse(req.body);
    const company = await prisma.company.create({
      data: {
        ...data,
        contactEmail: data.contactEmail || null,
        createdById: user.id,
        updatedById: user.id
      }
    });

    await createAuditLog({
      user,
      action: 'CREATE',
      entity: 'COMPANY',
      entityId: company.id,
      details: {
        tradeName: company.tradeName,
        cnpj: company.cnpj,
        segment: company.segment
      },
      ipAddress: req.ip
    });

    return res.status(201).json({ company });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao cadastrar empresa' });
  }
});

companiesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const data = companySchema.parse(req.body);

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...data,
        contactEmail: data.contactEmail || null,
        updatedById: user.id
      }
    });

    await createAuditLog({
      user,
      action: 'UPDATE',
      entity: 'COMPANY',
      entityId: company.id,
      details: {
        tradeName: company.tradeName,
        changes: data
      },
      ipAddress: req.ip
    });

    return res.json({ company });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    return res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

companiesRouter.delete('/:id', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: { evaluations: true }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await createAuditLog({
      user,
      action: 'DELETE',
      entity: 'COMPANY',
      entityId: id,
      details: {
        tradeName: company.tradeName,
        evaluationsCount: company._count.evaluations,
        softDelete: company._count.evaluations > 0
      },
      ipAddress: req.ip
    });

    if (company._count.evaluations > 0) {
      // Soft-delete se houver laudos vinculados para manter histórico
      await prisma.company.update({
        where: { id },
        data: { active: false, updatedById: user.id }
      });
    } else {
      // Exclusão definitiva se não houver laudos
      await prisma.company.delete({
        where: { id }
      });
    }

    return res.json({ message: 'Empresa excluída com sucesso' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao excluir empresa' });
  }
});

