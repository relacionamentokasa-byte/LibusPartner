import { prisma } from '../lib/prisma.js';

async function run() {
  const families = await prisma.productFamily.findMany({
    include: {
      categories: {
        include: {
          libusProducts: true,
          competitorProducts: { include: { manufacturer: true } }
        }
      }
    }
  });

  families.forEach(f => {
    console.log(`\nFamília: ${f.name} (slug: ${f.slug})`);
    f.categories.forEach(c => {
      console.log(`  Categoria: ${c.name}`);
      console.log(`    Libus (${c.libusProducts.length}):`, c.libusProducts.map(p => p.name).join(', '));
      console.log(`    Concorrentes (${c.competitorProducts.length}):`, c.competitorProducts.map(p => `${p.manufacturer.name} - ${p.name}`).join(', '));
    });
  });

  await prisma.$disconnect();
}

run();
