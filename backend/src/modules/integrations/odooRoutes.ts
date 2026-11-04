import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.js';
import { odooClient } from '../../lib/odoo/client.js';

export const odooRouter = Router();
odooRouter.use(authMiddleware);

// Status da conexão com o Odoo
odooRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const isConfigured = odooClient.isConfigured();
    if (!isConfigured) {
      return res.json({
        configured: false,
        message: 'Variáveis de integração Odoo pendentes (ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY)'
      });
    }

    const uid = await odooClient.authenticate();
    return res.json({
      configured: true,
      connected: true,
      uid,
      message: 'Conectado com sucesso ao Odoo ERP'
    });
  } catch (err: any) {
    return res.status(500).json({
      configured: odooClient.isConfigured(),
      connected: false,
      error: err.message
    });
  }
});

// Sincronizar catálogo de produtos Libus a partir do Odoo
odooRouter.post('/sync-products', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    if (!odooClient.isConfigured()) {
      return res.status(400).json({ error: 'Odoo não configurado nas variáveis de ambiente' });
    }

    const odooProducts = await odooClient.fetchLibusProducts([['active', '=', true]]);
    let updatedCount = 0;
    let matchedCount = 0;

    for (const op of odooProducts) {
      if (!op.default_code) continue;

      // Localizar produto Libus pelo código interno (SKU)
      const existing = await prisma.libusProduct.findFirst({
        where: {
          OR: [
            { internalCode: op.default_code },
            { internalCode: { contains: op.default_code } }
          ]
        }
      });

      if (existing) {
        matchedCount++;
        await prisma.libusProduct.update({
          where: { id: existing.id },
          data: {
            odooProductId: op.id,
            odooSyncedAt: new Date()
          }
        });
        updatedCount++;
      }
    }

    return res.json({
      success: true,
      odooTotal: odooProducts.length,
      matchedCount,
      updatedCount,
      message: `${updatedCount} produtos Libus vinculados com sucesso ao Odoo.`
    });
  } catch (err: any) {
    console.error('Erro no sync-products Odoo:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Enviar avaliação homologada para o Odoo (cria Lead no CRM ou Cotação de Venda)
odooRouter.post('/evaluations/:id/export', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { createOrder = false } = req.body;

    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      include: {
        company: true,
        leadTechnician: true,
        comparisons: {
          include: {
            libusProduct: true,
            economicResult: true
          }
        }
      }
    });

    if (!evaluation) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (!odooClient.isConfigured()) {
      return res.status(400).json({ error: 'Odoo não configurado nas variáveis de ambiente' });
    }

    // 1. Vincular ou criar a Empresa (res.partner) no Odoo
    let partnerId = evaluation.company.odooPartnerId;
    if (!partnerId) {
      partnerId = await odooClient.syncPartner({
        name: evaluation.company.corporateName || evaluation.company.tradeName,
        tradeName: evaluation.company.tradeName,
        cnpj: evaluation.company.cnpj || undefined,
        email: evaluation.company.contactEmail || undefined,
        phone: evaluation.company.contactPhone || undefined,
        city: evaluation.company.city || undefined,
        state: evaluation.company.state || undefined
      });

      await prisma.company.update({
        where: { id: evaluation.companyId },
        data: {
          odooPartnerId: partnerId,
          odooSyncedAt: new Date()
        }
      });
    }

    // 2. Criar Oportunidade no CRM do Odoo
    const leadId = await odooClient.createCrmOpportunity({
      partnerId,
      title: `[Libus Partner] Homologação ${evaluation.company.tradeName}`,
      description: `Avaliação técnica homologada via plataforma Libus Partner.\nEspecialista: ${evaluation.leadTechnician.name}\nData: ${new Date(evaluation.evaluationDate).toLocaleDateString('pt-BR')}\nStatus: ${evaluation.status}`,
      expectedRevenue: evaluation.comparisons.reduce((acc, c) => acc + (c.economicResult?.economyGenerated || 0), 0)
    });

    // 3. Opcionalmente gerar Ordem de Venda / Cotação se solicitado
    let saleOrderId: number | undefined;
    if (createOrder) {
      const items = evaluation.comparisons
        .filter(c => c.libusProduct?.odooProductId && c.economicResult)
        .map(c => ({
          odooProductId: c.libusProduct.odooProductId!,
          quantity: c.economicResult!.quantity || 1,
          priceUnit: c.economicResult!.libusPrice || 0
        }));

      if (items.length > 0) {
        saleOrderId = await odooClient.createSaleOrder({
          partnerId,
          evaluationId: evaluation.id,
          companyName: evaluation.company.tradeName,
          technicianName: evaluation.leadTechnician.name,
          notes: evaluation.observations || undefined,
          items
        });
      }
    }

    // 4. Atualizar status na avaliação
    const updated = await prisma.evaluation.update({
      where: { id },
      data: {
        odooLeadId: leadId,
        odooOrderId: saleOrderId || null,
        odooSyncStatus: 'SYNCED',
        odooSyncedAt: new Date(),
        odooSyncError: null
      }
    });

    return res.json({
      success: true,
      partnerId,
      leadId,
      saleOrderId,
      evaluation: updated,
      message: 'Avaliação exportada com sucesso para o Odoo ERP!'
    });
  } catch (err: any) {
    console.error('Erro ao exportar avaliação para Odoo:', err);
    await prisma.evaluation.update({
      where: { id: req.params.id },
      data: {
        odooSyncStatus: 'FAILED',
        odooSyncError: err.message
      }
    }).catch(() => {});

    return res.status(500).json({ error: err.message });
  }
});
