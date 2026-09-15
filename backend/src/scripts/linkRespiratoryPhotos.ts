import { prisma } from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';

// Mapeamento das fotos extraídas do PDF da tabla comparativa de respiracion:
// As imagens foram ordenadas conforme aparecem no documento de proteção respiratória:
// 1. Semifacial 9000 TPE (Libus) x 3M Série 6200
// 2. Semifacial 9000 Silicone (Libus) x 3M Série 7502
// 3. Facial Inteira 9000 (Libus) x 3M Série 6800
// 4. Cartuchos G01 / 3M 6001
// 5. Cartuchos G02 / 3M 6002
// 6. Cartuchos G03 / 3M 6003
// 7. Filtro P3 / 3M 2091
// 8. Filtro P3 Alívio / 3M 2097

const respDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products/respiratory';
const destDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products';

const mappings = [
  // Máscaras e Respiradores
  { type: 'libus', name: 'Semifacial 9000 (TPE)', src: 'resp_img_3.jpg', filename: 'libus_semifacial_9000_tpe.jpg' },
  { type: 'comp', manuf: '3M', name: 'Série 6200 Semifacial', src: 'resp_img_4.jpg', filename: '3m_serie_6200.jpg' },
  
  { type: 'libus', name: 'Semifacial 9000 Silicone', src: 'resp_img_5.jpg', filename: 'libus_semifacial_9000_silicone.jpg' },
  { type: 'comp', manuf: '3M', name: 'Série 7502 Silicone', src: 'resp_img_7.jpg', filename: '3m_serie_7502.jpg' },
  
  { type: 'libus', name: 'Facial Inteira 9000', src: 'resp_img_9.jpg', filename: 'libus_facial_inteira_9000.jpg' },
  { type: 'comp', manuf: '3M', name: 'Série 6800 Facial Inteira', src: 'resp_img_10.jpg', filename: '3m_serie_6800.jpg' },

  // Cartuchos e Filtros
  { type: 'libus', name: 'Cartucho G01 Vapores Orgânicos', src: 'resp_img_11.jpg', filename: 'libus_cartucho_g01.jpg' },
  { type: 'comp', manuf: '3M', name: '6001 Vapores Orgânicos', src: 'resp_img_12.jpg', filename: '3m_cartucho_6001.jpg' },

  { type: 'libus', name: 'Cartucho G02 Gases Ácidos', src: 'resp_img_13.jpg', filename: 'libus_cartucho_g02.jpg' },
  { type: 'comp', manuf: '3M', name: '6002 Gases Ácidos', src: 'resp_img_14.jpg', filename: '3m_cartucho_6002.jpg' },

  { type: 'libus', name: 'Cartucho G03 VO/GA Combinado', src: 'resp_img_15.jpg', filename: 'libus_cartucho_g03.jpg' },
  { type: 'comp', manuf: '3M', name: '6003 VO/GA', src: 'resp_img_16.jpg', filename: '3m_cartucho_6003.jpg' },

  { type: 'libus', name: 'Filtro P3 Alta Eficiência', src: 'resp_img_17.jpg', filename: 'libus_filtro_p3.jpg' },
  { type: 'comp', manuf: '3M', name: '2091 P3 Particulados', src: 'resp_img_18.jpg', filename: '3m_filtro_2091.jpg' },

  { type: 'libus', name: 'Filtro P3 com Alívio de VO', src: 'resp_img_2.jpg', filename: 'libus_filtro_p3_alivio.jpg' },
  { type: 'comp', manuf: '3M', name: '2097 P3 Alívio de Odor', src: 'resp_img_1.jpg', filename: '3m_filtro_2097.jpg' }
];

async function run() {
  for (const m of mappings) {
    const srcPath = path.join(respDir, m.src);
    const destPath = path.join(destDir, m.filename);
    const publicUrl = `/products/${m.filename}`;

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }

    if (m.type === 'libus') {
      const prod = await prisma.libusProduct.findFirst({
        where: { name: { contains: m.name } }
      });
      if (prod) {
        await prisma.libusProduct.update({
          where: { id: prod.id },
          data: { imageUrl: publicUrl }
        });
        console.log(`[LIBUS ATUALIZADO] ${prod.name} -> ${publicUrl}`);
      }
    } else {
      const comp = await prisma.competitorProduct.findFirst({
        where: {
          manufacturer: { name: { contains: m.manuf } },
          name: { contains: m.name }
        }
      });
      if (comp) {
        await prisma.competitorProduct.update({
          where: { id: comp.id },
          data: { imageUrl: publicUrl }
        });
        console.log(`[CONCORRENTE ATUALIZADO] ${m.manuf} - ${comp.name} -> ${publicUrl}`);
      }
    }
  }

  await prisma.$disconnect();
}

run();
