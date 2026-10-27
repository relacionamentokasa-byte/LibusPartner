import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

interface ExtractedPhoto {
  folderName: string;
  folderId: string;
  fileName: string;
  fileId: string;
  url: string;
}

// Mapeamento prioritário de fotos oficiais para os principais produtos Libus
const OFFICIAL_PRODUCT_PHOTO_RULES: Array<{
  productKey: string;
  matchPattern: RegExp;
  fallbackFolder?: string;
}> = [
  // Capacetes
  { productKey: 'genesis', matchPattern: /casco-seguridad-genesis-amarillo-01\.png/i, fallbackFolder: 'Linha Genesis' },
  { productKey: 'andes', matchPattern: /casco-altura-andes-amarillo-01\.png/i, fallbackFolder: 'Andes' },
  { productKey: 'milenium', matchPattern: /casco-seguridad-milenium-full-brim-con-slot-amarillo-01\.PNG/i, fallbackFolder: 'Full Brim com Slot' },
  { productKey: 'milenium class', matchPattern: /casco-seguridad-milenium-class-slot-blanco.*01\.png/i, fallbackFolder: 'Jugular' },
  { productKey: 'full brim', matchPattern: /casco-seguridad-milenium-full-brim-amarillo-01\.png/i, fallbackFolder: 'Full Brim' },
  { productKey: 'bone', matchPattern: /bone-brasil-azul.*01\.png/i, fallbackFolder: 'Boné' },

  // Protetores Auditivos (Plugues & Abafadores)
  { productKey: 'quantum', matchPattern: /proteccion-auditiva-quantum-03\.png|proteccion-auditiva-quantum-dos/i, fallbackFolder: 'Linha Quatum' },
  { productKey: 'quantum foam', matchPattern: /protector-auditivo-quantum-foam-rd-con-cordel-01\.png/i, fallbackFolder: 'Linha Quantum Foam' },
  { productKey: 'l320v', matchPattern: /l320-vincha.*001|l320-vincha.*01/i, fallbackFolder: 'Linha 300' },
  { productKey: 'l340v', matchPattern: /l340-vincha.*001|l340-vincha.*01/i, fallbackFolder: 'Linha 300' },
  { productKey: 'l360v', matchPattern: /l360-vincha.*001|l360-vincha.*01/i, fallbackFolder: 'Linha 300' },
  { productKey: 'l320c', matchPattern: /l320-casco.*001|l320-casco.*01/i, fallbackFolder: 'Linha 300' },
  { productKey: 'l340c', matchPattern: /l340-casco.*001|l340-casco.*01/i, fallbackFolder: 'Linha 300' },
  { productKey: 'l360c', matchPattern: /l360-casco.*001|l360-casco.*01/i, fallbackFolder: 'Linha 300' },
  { productKey: 'alternative', matchPattern: /alternative-clean-vincha-001/i, fallbackFolder: 'Linha Alternative' },
  { productKey: 'new alternative', matchPattern: /new-alternative-01\.png/i, fallbackFolder: 'Linha New Alternative' },
  { productKey: 'electronico', matchPattern: /proteccion-auditiva-E1-electronico-vincha-001/i, fallbackFolder: 'Linha eletrônicos' },

  // Óculos (Linha Classic & Sport)
  { productKey: 'argon elite', matchPattern: /argon-elite-flex-gris-01\.png|argon-elite.*01/i, fallbackFolder: 'Sport Line' },
  { productKey: 'argon', matchPattern: /anteojo-seguridad-argon-amarillo-01\.PNG|argon-transparente.*01/i, fallbackFolder: 'Classic Line' },
  { productKey: 'ecoline', matchPattern: /ecoline.*01/i, fallbackFolder: 'Classic Line' },
  { productKey: 'neon', matchPattern: /neon.*01/i, fallbackFolder: 'Classic Line' },
  { productKey: 'mig', matchPattern: /mig.*01/i, fallbackFolder: 'Sport Line' },
  { productKey: 'eco sport', matchPattern: /eco-sport.*01|sport.*01/i, fallbackFolder: 'Sport Line' },
  { productKey: 'aviator', matchPattern: /aviator.*transparente-01\.png|aviator.*01/i, fallbackFolder: 'Antiparras' },
  { productKey: 'new classic', matchPattern: /new-classic.*01|classic.*01/i, fallbackFolder: 'Classic Line' },

  // Proteção Facial
  { productKey: 'facial bolha', matchPattern: /proteccion-facial-burbuja|bolha/i, fallbackFolder: 'Faciais' },
  { productKey: 'facial plano', matchPattern: /proteccion-facial-plano|plano/i, fallbackFolder: 'Faciais' },
  { productKey: 'facial tela', matchPattern: /proteccion-facial-malla-forestal-001/i, fallbackFolder: 'Malhas' },
  { productKey: 'facial cilindrico', matchPattern: /cilindrico|cilíndrico/i, fallbackFolder: 'Faciais' },

  // Solda
  { productKey: 'strong welder', matchPattern: /soldadura-fotosensible-strong-welder-1000-001/i, fallbackFolder: 'Máscaras Automaticas' },
  { productKey: 'flip up', matchPattern: /proteccion-soldadura-flip-up -01/i, fallbackFolder: 'Máscaras Fixas' }
];

async function populateProductImages() {
  console.log('--- Iniciando Associação de Fotos Oficiais do Odoo aos Produtos Libus ---');

  const photosRaw = fs.readFileSync('libus_all_photos_flat.json', 'utf8');
  const allPhotos: ExtractedPhoto[] = JSON.parse(photosRaw);

  console.log(`Total de fotos no banco extraído do Odoo: ${allPhotos.length}`);

  const products = await prisma.libusProduct.findMany();
  let updatedCount = 0;

  for (const product of products) {
    const prodName = product.name.toLowerCase().trim();
    let matchedPhoto: ExtractedPhoto | undefined;

    // 1. Procurar nas regras específicas
    for (const rule of OFFICIAL_PRODUCT_PHOTO_RULES) {
      if (prodName.includes(rule.productKey)) {
        matchedPhoto = allPhotos.find(p => rule.matchPattern.test(p.fileName));
        if (!matchedPhoto && rule.fallbackFolder) {
          matchedPhoto = allPhotos.find(p => p.folderName.toLowerCase() === rule.fallbackFolder?.toLowerCase());
        }
        if (matchedPhoto) break;
      }
    }

    // 2. Busca genérica pelo nome se não encontrou nas regras
    if (!matchedPhoto) {
      const cleanSearchName = prodName.replace(/capacete|óculos|protetor|máscara|linha/gi, '').trim();
      if (cleanSearchName.length > 2) {
        matchedPhoto = allPhotos.find(p =>
          p.fileName.toLowerCase().includes(cleanSearchName) &&
          !p.fileName.toLowerCase().includes('repuesto')
        );
      }
    }

    if (matchedPhoto) {
      await prisma.libusProduct.update({
        where: { id: product.id },
        data: {
          imageUrl: matchedPhoto.url
        }
      });
      console.log(`✓ [${product.name}] -> Foto associada: ${matchedPhoto.fileName}`);
      console.log(`  URL: ${matchedPhoto.url}`);
      updatedCount++;
    } else {
      console.log(`- [${product.name}] -> Sem correspondência direta.`);
    }
  }

  console.log(`\n==============================================`);
  console.log(`Total de produtos Libus atualizados com fotos oficiais: ${updatedCount}/${products.length}`);
  console.log(`==============================================`);
}

populateProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
