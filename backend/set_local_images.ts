import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeamento de caminhos locais oficiais servidos diretamente pelo frontend
const LOCAL_STATIC_MAP: Record<string, string> = {
  // Cabeça
  'genesis': '/products/genesis.png',
  'capacete genesis': '/products/genesis.png',
  'andes': '/products/andes.png',
  'capacete andes': '/products/andes.png',
  'milenium': '/products/milenium.png',
  'capacete milenium': '/products/milenium.png',
  'milienium class': '/products/milenium_class.png',
  'capacete milienium': '/products/milenium_class.png',
  'bone': '/products/bone.png',

  // Auditiva
  'quantum': '/products/quantum.png',
  'capacete quantum': '/products/quantum.png',
  'quantum foam': '/products/quantum_foam.png',
  'l320v': '/products/l320v.png',
  'l340v': '/products/l340v.png',
  'capacete l-340v': '/products/l340c.png',
  'l360v': '/products/l360v.png',
  'l320c': '/products/l320c.png',
  'l340c': '/products/l340c.png',
  'l360c': '/products/l360c.png',
  'alternative': '/products/alternative.png',
  'new alternative': '/products/new_alternative.png',

  // Visual
  'argon': '/products/argon.png',
  'argon elite': '/products/argon_elite.png',
  'ecoline': '/products/ecoline.png',
  'neon': '/products/neon.png',
  'mig': '/products/mig.png',
  'eco sport': '/products/eco_sport.png',
  'new classic': '/products/new_classic.png',
  'aviator': '/products/aviator.png',

  // Facial
  'facial bolha': '/products/bolha.png',
  'facial plano': '/products/facial_plano.png',
  'facial tela': '/products/facial_tela.png',
  'facial cilindrico': '/products/facial_cilindrico.png',

  // Respiratória
  'máscara facial completa bls 5600 (tpe)': '/products/bls_5600.png',
  'máscara facial completa bls 5700 (silicone)': '/products/bls_5700.png',
  'máscara facial completa bls 5150 (rd40)': '/products/bls_5600.png',
  'facial inteira 9000': '/products/bls_5600.png',
  'máscara semifacial bls 4000 next r (tpe)': '/products/bls_4000_r.png',
  'máscara semifacial bls 4000 next s (silicone)': '/products/bls_4000_s.png',
  'semifacial 9000 (tpe)': '/products/bls_4000_r.png',
  'semifacial 9000 silicone': '/products/bls_4000_s.png',
  'filtro químico bls 211 (a2)': '/products/bls_213.png',
  'filtro químico bls 213 (abek1)': '/products/bls_213.png',
  'filtro químico bls 244 (k2)': '/products/bls_244.png',
  'filtro químico bls 243 (abek2)': '/products/bls_243.png',
  'filtro combinado bls 221 (a2p3 r)': '/products/bls_243.png',
  'filtro combinado bls 222 (abek1p3 r)': '/products/bls_243.png',
  'respirador dobrável bls 502 (pff2 sem válvula)': '/products/bls_502.png',
  'respirador dobrável bls 512 (pff2 com válvula)': '/products/bls_502.png'
};

async function setLocalImages() {
  console.log('--- Configurando caminhos locais rápidos e estáveis no banco ---');

  const products = await prisma.libusProduct.findMany();
  let count = 0;

  for (const prod of products) {
    const key = prod.name.trim().toLowerCase();
    let localPath = LOCAL_STATIC_MAP[key];

    if (!localPath) {
      for (const [mapKey, p] of Object.entries(LOCAL_STATIC_MAP)) {
        if (key.includes(mapKey) || mapKey.includes(key)) {
          localPath = p;
          break;
        }
      }
    }

    if (localPath) {
      await prisma.libusProduct.update({
        where: { id: prod.id },
        data: { imageUrl: localPath }
      });
      console.log(`✓ [${prod.name}] -> ${localPath}`);
      count++;
    }
  }

  console.log(`\nTotal atualizado para caminhos locais: ${count}/${products.length}`);
}

setLocalImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
