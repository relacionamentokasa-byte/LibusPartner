import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeamento direto de todos os filtros, respiradores e produtos BLS/Libus
// usando os IDs diretos de arquivos e pastas catalogados no Odoo
const ODOO_RESPIRATORY_MAP: Record<string, string> = {
  // Filtros Químicos e Combinados
  'filtro químico bls 211 (a2)': 'https://lh3.googleusercontent.com/d/1IEpQwsfeTTu_-jE315-OSgwTPHcSCKtv=w800',
  'filtro químico bls 213 (abek1)': 'https://lh3.googleusercontent.com/d/1vgjR4UyC9hfZoWrBpJevLnMd0AeL2To1=w800',
  'filtro químico bls 244 (k2)': 'https://lh3.googleusercontent.com/d/1G3zHN65W3AzCKB3jL8hhnf_tXl6hveTx=w800',
  'filtro químico bls 243 (abek2)': 'https://lh3.googleusercontent.com/d/1v5eW3Fj6zcuyLdni8D7UHOIS4YaBcI5h=w800',
  'filtro combinado bls 221 (a2p3 r)': 'https://lh3.googleusercontent.com/d/13umT4150CyjnpbB94PKx2gC1_K0yNhWr=w800',
  'filtro combinado bls 222 (abek1p3 r)': 'https://lh3.googleusercontent.com/d/1P6FaxWi1sg9hZV5econPt8Kx67_7Y-S-=w800',
  'filtro mecânico plano bls 201-3 (p3 r)': 'https://lh3.googleusercontent.com/d/12-ILgeSDnvgQBJ8FBEzvGs__Yc9g_NCn=w800',
  'filtro mecânico plano bls 201-3c (p3 r carvão)': 'https://lh3.googleusercontent.com/d/1ptXcHofW62oTj-ovap9oOS6Rp2I2IKsq=w800',
  'filtro partículas encapsulado bls 202 (p3 r)': 'https://lh3.googleusercontent.com/d/1AyyIIEi_m3yYSJIEz_sSpZ4TYpW5_PYQ=w800',
  'filtro universal rd40 bls 430 (a2p3 r)': 'https://lh3.googleusercontent.com/d/11T3w0HbMj_W7MVYkCvnc27ib8vxpWd12=w800',
  'filtro universal rd40 bls 414 (abek2p3 r)': 'https://lh3.googleusercontent.com/d/1v5eW3Fj6zcuyLdni8D7UHOIS4YaBcI5h=w800',
  'filtro universal rd40 bls 412 (ax)': 'https://lh3.googleusercontent.com/d/13umT4150CyjnpbB94PKx2gC1_K0yNhWr=w800',

  // Linha Zer0 e Descartáveis PFF2 / PFF3
  'respirador alta performance bls zer0 30 (pff3 r d)': 'https://lh3.googleusercontent.com/d/1MqGKQ_ncGE0qbCdjRChkkf1vclZYq3U-=w800',
  'respirador alta performance bls zer0 32c fr (pff3 solda/carvão)': 'https://lh3.googleusercontent.com/d/1Bua7MXLTuLNAdKu3wgCSes9-8abgIHar=w800',
  'respirador dobrável bls 502 (pff2 sem válvula)': 'https://lh3.googleusercontent.com/d/1WvPCvc8Pe3R_E5TjJLX0gVbKqHeldKHX=w800',
  'respirador dobrável bls 512 (pff2 com válvula)': 'https://lh3.googleusercontent.com/d/1WvPCvc8Pe3R_E5TjJLX0gVbKqHeldKHX=w800',
  'respirador concha bls 102v (pff2 com válvula)': 'https://lh3.googleusercontent.com/d/10TZIf8OmpK6KDf196RnQeoFdXCeKxhfB=w800',
  'respirador carvão ativado bls 680 next (pff2 carvão)': 'https://lh3.googleusercontent.com/d/10TZIf8OmpK6KDf196RnQeoFdXCeKxhfB=w800',

  // Cartuchos Série 9000
  'cartucho g01 vapores orgânicos': 'https://lh3.googleusercontent.com/d/1IEpQwsfeTTu_-jE315-OSgwTPHcSCKtv=w800',
  'cartucho g02 gases ácidos': 'https://lh3.googleusercontent.com/d/1IEpQwsfeTTu_-jE315-OSgwTPHcSCKtv=w800',
  'cartucho g03 vo/ga combinado': 'https://lh3.googleusercontent.com/d/1vgjR4UyC9hfZoWrBpJevLnMd0AeL2To1=w800',
  'filtro p3 alta eficiência': 'https://lh3.googleusercontent.com/d/12-ILgeSDnvgQBJ8FBEzvGs__Yc9g_NCn=w800',
  'filtro p3 com alívio de vo': 'https://lh3.googleusercontent.com/d/1ptXcHofW62oTj-ovap9oOS6Rp2I2IKsq=w800'
};

async function updateRemainingProducts() {
  console.log('--- Atualizando produtos restantes de Proteção Respiratória e Filtros do Odoo ---');

  const products = await prisma.libusProduct.findMany();
  let updated = 0;

  for (const prod of products) {
    const key = prod.name.trim().toLowerCase();
    const directUrl = ODOO_RESPIRATORY_MAP[key];

    if (directUrl) {
      await prisma.libusProduct.update({
        where: { id: prod.id },
        data: { imageUrl: directUrl }
      });
      console.log(`✓ [${prod.name}] -> Foto do Odoo associada: ${directUrl}`);
      updated++;
    }
  }

  const allUpdated = await prisma.libusProduct.findMany({
    where: { imageUrl: { not: null } }
  });

  console.log(`\n==============================================`);
  console.log(`Total Geral de Produtos Libus com Fotos do Odoo: ${allUpdated.length}/${products.length}`);
  console.log(`==============================================`);
}

updateRemainingProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
