import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// C.A.s e códigos de referência oficiais para o duelo de demonstração
const OFFICIAL_PAIRS = [
  {
    category: 'Capacetes de Segurança',
    libusName: 'Genesis',
    libusCA: '36099',
    libusCode: '901380',
    compManuf: '3M',
    compName: 'H-700',
    compCA: '29638',
    obs: 'Capacete Classe B com suspensão têxtil de 8 pontos vs H-700'
  },
  {
    category: 'Óculos de Segurança',
    libusName: 'Argon',
    libusCA: '35764',
    libusCode: '901720',
    compManuf: 'Kalipso',
    compName: 'Jaguar',
    compCA: '10346',
    obs: 'Lente óptica classe 1 com tratamento anti-risco e anti-embaçante'
  },
  {
    category: 'Protetores Auditivos (Plug)',
    libusName: 'Quantum',
    libusCA: '35332',
    libusCode: '901510',
    compManuf: '3M',
    compName: 'Pomp Plus',
    compCA: '5674',
    obs: 'Plugue de silicone medicinal hipoalergênico com 3 flanges'
  },
  {
    category: 'Abafadores de Ruído',
    libusName: 'L-340V',
    libusCA: '35335',
    libusCode: '900620',
    compManuf: '3M',
    compName: 'Peltor H10A',
    compCA: '12188',
    obs: 'Abafador com arco tensor de aço mola e atenuação NRRsf 22dB'
  }
];

async function seedCleanDemo() {
  console.log('--- Recriando Avaliação Demo com Pares e C.A.s 100% Corretos ---');

  const admin = await prisma.user.findFirst({ where: { email: 'admin@libus.com.br' } });
  if (!admin) {
    console.error('Usuário admin não encontrado');
    return;
  }

  // Deletar avaliações anteriores para não poluir
  await prisma.evaluationCriterionResponse.deleteMany();
  await prisma.evaluationEconomicResult.deleteMany();
  await prisma.evaluationComparison.deleteMany();
  await prisma.evaluationParticipant.deleteMany();
  await prisma.evaluation.deleteMany();

  const company = await prisma.company.upsert({
    where: { id: 'empresa-arcelor-01' },
    update: {},
    create: {
      id: 'empresa-arcelor-01',
      tradeName: 'ArcelorMittal Tubarão',
      corporateName: 'ArcelorMittal Brasil S.A.',
      cnpj: '17.469.701/0001-77',
      segment: 'Siderurgia & Mineração',
      city: 'Serra',
      state: 'ES',
      active: true
    }
  });

  const evaluation = await prisma.evaluation.create({
    data: {
      id: '9e2ce9ed-9df5-4555-a78e-ed7ad87d658d',
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

  for (let i = 0; i < OFFICIAL_PAIRS.length; i++) {
    const pairDef = OFFICIAL_PAIRS[i];

    // Buscar categoria
    let category = await prisma.productCategory.findFirst({
      where: { name: { contains: pairDef.category.split(' ')[0] } }
    });

    if (!category) {
      category = await prisma.productCategory.findFirst();
    }

    // Buscar ou criar fabricante concorrente
    let manuf = await prisma.competitorManufacturer.findFirst({
      where: { name: pairDef.compManuf }
    });
    if (!manuf) {
      manuf = await prisma.competitorManufacturer.create({
        data: { name: pairDef.compManuf, active: true }
      });
    }

    // Buscar ou atualizar LibusProduct com C.A. correto
    let libusProduct = await prisma.libusProduct.findFirst({
      where: { name: { contains: pairDef.libusName } }
    });

    if (libusProduct) {
      libusProduct = await prisma.libusProduct.update({
        where: { id: libusProduct.id },
        data: {
          caNumber: pairDef.libusCA,
          internalCode: pairDef.libusCode
        }
      });
    } else {
      libusProduct = await prisma.libusProduct.create({
        data: {
          name: `Capacete ${pairDef.libusName}`,
          categoryId: category!.id,
          caNumber: pairDef.libusCA,
          internalCode: pairDef.libusCode,
          description: 'Linha Oficial Libus Homologada'
        }
      });
    }

    // Buscar ou atualizar CompetitorProduct com C.A. correto
    let compProduct = await prisma.competitorProduct.findFirst({
      where: {
        name: { contains: pairDef.compName },
        manufacturerId: manuf.id
      }
    });

    if (compProduct) {
      compProduct = await prisma.competitorProduct.update({
        where: { id: compProduct.id },
        data: { caNumber: pairDef.compCA }
      });
    } else {
      compProduct = await prisma.competitorProduct.create({
        data: {
          name: pairDef.compName,
          manufacturerId: manuf.id,
          categoryId: category!.id,
          caNumber: pairDef.compCA,
          description: 'Modelo Concorrente Equivalente'
        }
      });
    }

    const comparison = await prisma.evaluationComparison.create({
      data: {
        evaluationId: evaluation.id,
        libusProductId: libusProduct.id,
        competitorProductId: compProduct.id,
        orderIndex: i
      }
    });

    // Critérios técnicos
    const attributes = await prisma.technicalAttribute.findMany({
      where: { categoryId: category!.id }
    });

    for (const attr of attributes) {
      await prisma.evaluationCriterionResponse.create({
        data: {
          comparisonId: comparison.id,
          attributeId: attr.id,
          libusScore: 9,
          competitorScore: 6,
          observation: 'Excelente aceitação em campo, ajuste anatômico e conformidade com a norma'
        }
      });
    }

    // Resultado Econômico condizente
    const qty = 50 * (i + 1);
    const priceCurrent = 28.50 + (i * 15);
    const priceLibus = 32.00 + (i * 12);
    const lifeCurrent = 1; // 1 mês
    const lifeLibus = 3;    // 3 meses
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

  console.log('✓ Avaliação corrigida com sucesso com C.A.s e pares compatíveis!');
}

seedCleanDemo()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
