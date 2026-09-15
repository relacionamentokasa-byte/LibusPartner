import { prisma } from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';

// Imagens extraídas da tabla_comparativa_respiracion_brasil_0626.pdf
const respDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products/respiratory';

async function run() {
  console.log('Imagens extraídas em respiratory:');
  const files = fs.readdirSync(respDir);
  files.forEach(f => {
    const stat = fs.statSync(path.join(respDir, f));
    console.log(`- ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
  });

  // Mapear os produtos respiratórios Libus e Concorrentes (3M)
  const libusResp = await prisma.libusProduct.findMany({
    where: { category: { family: { slug: 'protecao-respiratoria' } } }
  });
  console.log('\nLibus Respiratória:', libusResp.map(p => `${p.name} (id: ${p.id})`));

  const compResp = await prisma.competitorProduct.findMany({
    where: { category: { family: { slug: 'protecao-respiratoria' } } },
    include: { manufacturer: true }
  });
  console.log('\nConcorrentes Respiratória:', compResp.map(p => `${p.manufacturer.name} - ${p.name}`));

  await prisma.$disconnect();
}

run();
