import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('--- Criando avaliação de teste completa para Laudo Técnico ---');

  const user = await prisma.user.findFirst({ where: { email: 'tecnico@libus.com.br' } });
  const company = await prisma.company.findFirst({ where: { tradeName: 'Indústria Metalúrgica Paulista' } });

  if (!user || !company) {
    console.log('Usuário ou empresa não encontrados.');
    return;
  }

  // Pegar par Argon x Fênix
  const libusProduct = await prisma.libusProduct.findFirst({ where: { name: { contains: 'Argon' } } });
  const compProduct = await prisma.competitorProduct.findFirst({ where: { name: { contains: 'Fênix' } } });

  if (!libusProduct || !compProduct) {
    console.log('Produtos não encontrados.');
    return;
  }

  // Critérios
  const attributes = await prisma.technicalAttribute.findMany({
    where: { categoryId: libusProduct.categoryId }
  });

  const evaluation = await prisma.evaluation.create({
    data: {
      companyId: company.id,
      leadTechnicianId: user.id,
      status: 'TECHNICAL_DONE',
      participants: {
        create: [
          { name: 'Carlos Eduardo Silva', roleOrArea: 'Engenheiro de Segurança / SESMT' },
          { name: 'Marcos Vinícius', roleOrArea: 'Supervisor de Produção & Usinagem' }
        ]
      },
      comparisons: {
        create: [
          {
            libusProductId: libusProduct.id,
            competitorProductId: compProduct.id,
            orderIndex: 0,
            economicResult: {
              create: {
                currentPrice: 18.5,
                libusPrice: 22.0,
                quantity: 120,
                lifespanCurrent: 1,
                lifespanLibus: 3,
                costCurrentTotal: 26640,
                costLibusTotal: 8760,
                costDifference: -17880,
                economyGenerated: 17880,
                economyPercent: 67.4
              }
            },
            responses: {
              create: attributes.map((attr, idx) => ({
                attributeId: attr.id,
                libusScore: idx === 0 ? 10 : idx === 1 ? 9 : 8,
                competitorScore: idx === 0 ? 7 : idx === 1 ? 6 : 7,
                isNotApplicable: false,
                observation: idx === 0 ? 'Excelente durabilidade do revestimento anti-risco em bancada' : 'Ajuste e vedação superior relatado pelos operadores'
              }))
            }
          }
        ]
      }
    }
  });

  console.log(`Avaliação de demonstração criada com ID: ${evaluation.id}`);
  await prisma.$disconnect();
}

run();
