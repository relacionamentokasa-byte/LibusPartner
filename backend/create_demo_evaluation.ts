import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createDemo() {
  const admin = await prisma.user.findFirst({ where: { email: 'admin@libus.com.br' } });
  if (!admin) {
    console.error('Admin user not found');
    return;
  }

  let company = await prisma.company.findFirst({
    where: { tradeName: 'ArcelorMittal Tubarão' }
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        tradeName: 'ArcelorMittal Tubarão',
        corporateName: 'ArcelorMittal Brasil S.A.',
        cnpj: '17.469.701/0001-77',
        segment: 'Siderurgia & Mineração',
        city: 'Serra',
        state: 'ES',
        active: true
      }
    });
  }

  const libusProducts = await prisma.libusProduct.findMany({
    take: 4,
    include: { category: true }
  });

  const competitorProducts = await prisma.competitorProduct.findMany({
    take: 4,
    include: { manufacturer: true }
  });

  const ev = await prisma.evaluation.create({
    data: {
      companyId: company.id,
      leadTechnicianId: admin.id,
      observations: 'Linha de Solda & Caldeiraria',
      status: 'COMPLETED',
      participants: {
        create: [
          { name: 'Carlos Eduardo Mendes', roleOrArea: 'Engenheiro de Segurança / SESMT' },
          { name: 'Mariana Silveira', roleOrArea: 'Supervisora de Operações / Produção' }
        ]
      }
    }
  });

  for (let i = 0; i < Math.min(libusProducts.length, competitorProducts.length); i++) {
    const lib = libusProducts[i];
    const comp = competitorProducts[i];

    const comparison = await prisma.evaluationComparison.create({
      data: {
        evaluationId: ev.id,
        libusProductId: lib.id,
        competitorProductId: comp.id,
        orderIndex: i
      }
    });

    const categoryAttributes = await prisma.technicalAttribute.findMany({
      where: { categoryId: lib.categoryId }
    });

    for (const attr of categoryAttributes) {
      await prisma.evaluationCriterionResponse.create({
        data: {
          comparisonId: comparison.id,
          attributeId: attr.id,
          libusScore: 9,
          competitorScore: 6,
          observation: 'Excelente aceitação em campo e ajuste anatômico'
        }
      });
    }

    const qty = 60 * (i + 1);
    const priceCurrent = 28.50 + (i * 12);
    const priceLibus = 34.00 + (i * 10);
    const lifeCurrent = 1;
    const lifeLibus = 3;
    const currentAnnual = priceCurrent * (12 / lifeCurrent) * qty;
    const libusAnnual = priceLibus * (12 / lifeLibus) * qty;
    const economy = currentAnnual - libusAnnual;

    await prisma.evaluationEconomicResult.create({
      data: {
        comparisonId: comparison.id,
        quantity: qty,
        currentPrice: priceCurrent,
        lifespanCurrent: lifeCurrent,
        libusPrice: priceLibus,
        lifespanLibus: lifeLibus,
        costCurrentTotal: currentAnnual,
        costLibusTotal: libusAnnual,
        costDifference: economy,
        economyGenerated: economy,
        economyPercent: (economy / currentAnnual) * 100
      }
    });
  }

  console.log('DEMO_EVALUATION_ID:', ev.id);
}

createDemo()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
