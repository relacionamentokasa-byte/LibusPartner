import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const updates = [
    { search: 'Andes', url: '/products/andes.png' },
    { search: 'Genesis', url: '/products/genesis.png' },
    { search: 'Milenium', url: '/products/milenium.png' },
    { search: 'Milienium', url: '/products/milenium_class.png' },
    { search: 'QUANTUM', url: '/products/quantum.png' },
    { search: 'L320V', url: '/products/l320v.png' },
    { search: 'L340V', url: '/products/l340v.png' },
    { search: 'L360V', url: '/products/l360v.png' },
    { search: 'L320C', url: '/products/l320c.png' },
    { search: 'L340C', url: '/products/l340c.png' },
    { search: 'L360C', url: '/products/l360c.png' },
    { search: 'Argon', url: '/products/argon.png' },
    { search: 'Argon Elite', url: '/products/argon_elite.png' },
    { search: 'Ecoline', url: '/products/ecoline.png' },
    { search: 'Neon', url: '/products/neon.png' },
    { search: 'MIG', url: '/products/mig.png' },
    { search: 'Eco Sport', url: '/products/eco_sport.png' },
    { search: 'New Classic', url: '/products/new_classic.png' },
    { search: 'Facial Bolha', url: '/products/bolha.png' },
    { search: 'Facial Tela', url: '/products/facial_tela.png' },
    { search: 'BLS 5600', url: '/products/bls_5600.png' },
    { search: 'BLS 5700', url: '/products/bls_5700.png' },
    { search: 'BLS 4000 Next R', url: '/products/bls_4000_r.png' },
    { search: 'BLS 4000 Next S', url: '/products/bls_4000_s.png' }
  ];

  for (const item of updates) {
    const res = await prisma.libusProduct.updateMany({
      where: { name: { contains: item.search, mode: 'insensitive' } },
      data: { imageUrl: item.url }
    });
    console.log(`✓ [${item.search}] -> ${item.url} (${res.count} produtos atualizados)`);
  }

  console.log('\n✓ Todos os produtos foram atualizados para carregar os arquivos locais do frontend/public/products!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
