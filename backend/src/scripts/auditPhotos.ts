import { prisma } from '../lib/prisma.js';

async function run() {
  console.log('=== AUDITORIA DE PRODUTOS LIBUS ===');
  const libus = await prisma.libusProduct.findMany({
    include: { category: { include: { family: true } } },
    orderBy: { name: 'asc' }
  });
  const libusMissing = libus.filter(p => !p.imageUrl);
  console.log(`Total Libus: ${libus.length} | Com foto: ${libus.length - libusMissing.length} | Sem foto: ${libusMissing.length}`);
  libusMissing.forEach(p => {
    console.log(`[Libus Sem Foto] ${p.category.family.name} > ${p.category.name} > ${p.name} (cód: ${p.internalCode || 'S/C'})`);
  });

  console.log('\n=== AUDITORIA DE PRODUTOS CONCORRENTES ===');
  const comps = await prisma.competitorProduct.findMany({
    include: { manufacturer: true, category: { include: { family: true } } },
    orderBy: { manufacturer: { name: 'asc' } }
  });
  const compsMissing = comps.filter(p => !p.imageUrl);
  console.log(`Total Concorrentes: ${comps.length} | Com foto: ${comps.length - compsMissing.length} | Sem foto: ${compsMissing.length}`);
  compsMissing.forEach(p => {
    console.log(`[Concorrente Sem Foto] ${p.manufacturer.name} > ${p.name} (${p.category?.name || 'S/Cat'})`);
  });

  await prisma.$disconnect();
}

run();
