import { prisma } from '../lib/prisma.js';

async function run() {
  const comps = await prisma.competitorProduct.findMany({
    include: { manufacturer: true },
    orderBy: { manufacturer: { name: 'asc' } }
  });
  console.log(`Total concorrentes no banco: ${comps.length}\n`);
  for (const c of comps) {
    console.log(`${c.manufacturer.name} | ${c.name} | Foto: ${c.imageUrl || 'SEM FOTO'}`);
  }
  await prisma.$disconnect();
}

run();
