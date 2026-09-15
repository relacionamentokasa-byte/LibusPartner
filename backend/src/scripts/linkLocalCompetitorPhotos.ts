import { prisma } from '../lib/prisma.js';

const localMappings = [
  { manuf: 'Kalipso', name: 'Plug K-70', path: '/products/k-70.jpeg' },
  { manuf: '3M', name: 'Pomp Millenium', path: '/products/milenium.jpeg' },
  { manuf: 'Carbografite', name: 'Protetor Facial CG Bolha', path: '/products/facial_bolha.jpeg' },
  { manuf: 'Carbografite', name: 'Protetor Facial CG 500', path: '/products/facial_cilindrico.jpeg' },
  { manuf: 'MSA', name: 'Protetor Facial V-Gard 190', path: '/products/facial_cilindrico.jpeg' },
  { manuf: '3M', name: 'Protetor Facial W96 Esférico', path: '/products/facial_bolha.jpeg' },
  { manuf: '3M', name: 'Protetor Facial WP96 Cilíndrico', path: '/products/facial_cilindrico.jpeg' },
  { manuf: 'Vicsa', name: 'Visor Policarbonato I-1', path: '/products/facial_plano.jpeg' }
];

async function run() {
  for (const item of localMappings) {
    const comp = await prisma.competitorProduct.findFirst({
      where: {
        manufacturer: { name: { contains: item.manuf } },
        name: { contains: item.name }
      }
    });

    if (comp) {
      await prisma.competitorProduct.update({
        where: { id: comp.id },
        data: { imageUrl: item.path }
      });
      console.log(`[LINKED] ${item.manuf} - ${comp.name} -> ${item.path}`);
    } else {
      console.log(`[NOT FOUND] ${item.manuf} - ${item.name}`);
    }
  }
  await prisma.$disconnect();
}

run();
