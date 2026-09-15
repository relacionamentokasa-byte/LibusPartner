import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma.js';

const destProductsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products';

// Criar imagens vetoriais/raster limpas profissionais de alta fidelidade para a linha respiratória
async function createRespiratoryBadge(title: string, subtitle: string, code: string, colorHex: number, filename: string) {
  const width = 400;
  const height = 400;
  const image = new Jimp({ width, height, color: 0xFFFFFFFF });

  // Fundo suave com borda sutil
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        image.setPixelColor(0xE2E8F0FF, x, y);
      }
    }
  }

  // Círculo de destaque no centro com a cor da linha
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 130;

  for (let x = centerX - radius; x <= centerX + radius; x++) {
    for (let y = centerY - radius; y <= centerY + radius; y++) {
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (dist <= radius) {
        if (dist > radius - 6) {
          image.setPixelColor(colorHex, x, y);
        } else if (dist <= radius - 6 && dist >= radius - 20) {
          image.setPixelColor(0xF8FAFCFF, x, y);
        }
      }
    }
  }

  const destPath = path.join(destProductsDir, filename);
  await image.write(destPath as any);
  console.log(`Gerado: ${filename}`);
  return `/products/${filename}`;
}

async function run() {
  const items = [
    { name: 'Cartucho G01 Vapores Orgânicos', title: 'G01', sub: 'Vapores Orgânicos', code: 'LIBUS', color: 0x1E293BFF, file: 'libus_resp_g01.png', isLibus: true },
    { name: 'Cartucho G02 Gases Ácidos', title: 'G02', sub: 'Gases Ácidos', code: 'LIBUS', color: 0xE11D48FF, file: 'libus_resp_g02.png', isLibus: true },
    { name: 'Cartucho G03 VO/GA Combinado', title: 'G03', sub: 'VO / GA', code: 'LIBUS', color: 0xE11D48FF, file: 'libus_resp_g03.png', isLibus: true },
    { name: 'Filtro P3 Alta Eficiência', title: 'P3', sub: 'Particulados', code: 'LIBUS', color: 0xBE185DFF, file: 'libus_resp_p3.png', isLibus: true },
    { name: 'Filtro P3 com Alívio de VO', title: 'P3 VO', sub: 'Alívio de Odor', code: 'LIBUS', color: 0xBE185DFF, file: 'libus_resp_p3_alivio.png', isLibus: true },
    { name: 'Semifacial 9000 (TPE)', title: '9000 TPE', sub: 'Semifacial', code: 'LIBUS', color: 0x0284C7FF, file: 'libus_resp_9000_tpe.png', isLibus: true },
    { name: 'Semifacial 9000 Silicone', title: '9000 SILICONE', sub: 'Semifacial', code: 'LIBUS', color: 0x0284C7FF, file: 'libus_resp_9000_silicone.png', isLibus: true },
    { name: 'Facial Inteira 9000', title: '9000 FULL', sub: 'Facial Inteira', code: 'LIBUS', color: 0x0284C7FF, file: 'libus_resp_9000_full.png', isLibus: true },

    // 3M
    { manuf: '3M', name: '6001 Vapores Orgânicos', title: '6001', sub: 'Vapores Orgânicos', code: '3M', color: 0x1E293BFF, file: '3m_resp_6001.png', isLibus: false },
    { manuf: '3M', name: '6002 Gases Ácidos', title: '6002', sub: 'Gases Ácidos', code: '3M', color: 0xE11D48FF, file: '3m_resp_6002.png', isLibus: false },
    { manuf: '3M', name: '6003 VO/GA', title: '6003', sub: 'VO / GA', code: '3M', color: 0xE11D48FF, file: '3m_resp_6003.png', isLibus: false },
    { manuf: '3M', name: '2091 P3 Particulados', title: '2091', sub: 'Particulados', code: '3M', color: 0xBE185DFF, file: '3m_resp_2091.png', isLibus: false },
    { manuf: '3M', name: '2097 P3 Alívio de Odor', title: '2097', sub: 'Alívio de Odor', code: '3M', color: 0xBE185DFF, file: '3m_resp_2097.png', isLibus: false },
    { manuf: '3M', name: 'Série 6200 Semifacial', title: '6200', sub: 'Semifacial', code: '3M', color: 0x0284C7FF, file: '3m_resp_6200.png', isLibus: false },
    { manuf: '3M', name: 'Série 7502 Silicone', title: '7502', sub: 'Silicone', code: '3M', color: 0x0284C7FF, file: '3m_resp_7502.png', isLibus: false },
    { manuf: '3M', name: 'Série 6800 Facial Inteira', title: '6800', sub: 'Facial Inteira', code: '3M', color: 0x0284C7FF, file: '3m_resp_6800.png', isLibus: false }
  ];

  for (const item of items) {
    const url = await createRespiratoryBadge(item.title, item.sub, item.code, item.color, item.file);
    if (item.isLibus) {
      const p = await prisma.libusProduct.findFirst({ where: { name: { contains: item.name } } });
      if (p) {
        await prisma.libusProduct.update({ where: { id: p.id }, data: { imageUrl: url } });
      }
    } else {
      const c = await prisma.competitorProduct.findFirst({
        where: { manufacturer: { name: { contains: item.manuf } }, name: { contains: item.name } }
      });
      if (c) {
        await prisma.competitorProduct.update({ where: { id: c.id }, data: { imageUrl: url } });
      }
    }
  }

  await prisma.$disconnect();
}

run();
