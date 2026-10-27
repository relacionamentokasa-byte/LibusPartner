import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as https from 'https';

const prisma = new PrismaClient();

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Extrair arquivos de pastas adicionais do Google Drive (BLS, Respiratória, Milenium, etc)
async function extractDriveFolder(folderId: string) {
  const html = await fetchUrl(`https://drive.google.com/drive/folders/${folderId}`);
  const items: Array<{ fileId: string; fileName: string; url: string }> = [];

  const regex = /\["([a-zA-Z0-9_-]{28,})",\["([^"]+\.(?:png|jpg|jpeg|webp|PNG|JPG|JPEG))"/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    items.push({
      fileId: m[1],
      fileName: m[2],
      url: `https://lh3.googleusercontent.com/d/${m[1]}=w800`
    });
  }

  if (items.length === 0) {
    const sskIds = [...html.matchAll(/ssk='[^']*?:([a-zA-Z0-9_-]{28,})-0-1'/g)].map(x => x[1]);
    const fileNames = [...html.matchAll(/"([^"]+\.(?:png|jpg|jpeg|webp|PNG|JPG|JPEG))"/gi)]
      .map(x => x[1])
      .filter(n => !n.includes('gstatic') && !n.includes('favicon') && !n.includes('broken_image'));

    const minLen = Math.min(sskIds.length, fileNames.length);
    for (let i = 0; i < minLen; i++) {
      items.push({
        fileId: sskIds[i],
        fileName: fileNames[i],
        url: `https://lh3.googleusercontent.com/d/${sskIds[i]}=w800`
      });
    }
  }

  return items;
}

async function syncAllLibusImages() {
  console.log('--- Sincronizando Catálogo Completo de Imagens do Odoo Libus ---');

  // 1. Pastas específicas de proteção respiratória BLS identificadas no Odoo
  const additionalFolders = [
    { name: 'Facial Inteira 5600', folderId: '12uhaq_ojA7P6c8DjNDchTdlHN8EvdNrB' },
    { name: 'Facial Inteira 5700', folderId: '1jGQNk3mFtP0YJzNyo-hBH9oia5o2wyNw' },
    { name: 'Semi Faciais 4000next', folderId: '1Um5HFdAeu7mVmq9g4K0-XoMLRL7-CVrT' },
    { name: 'Libus-Bls Geral', folderId: '13qcabiTxPHcFCCZu3gJPTS6eF_T-u410' }
  ];

  const additionalPhotos: any[] = [];
  for (const f of additionalFolders) {
    const files = await extractDriveFolder(f.folderId);
    console.log(`✓ Pasta [${f.name}]: ${files.length} arquivos extraídos`);
    files.forEach(item => {
      additionalPhotos.push({
        folderName: f.name,
        fileName: item.fileName,
        fileId: item.fileId,
        url: item.url
      });
    });
  }

  // 2. Carregar todas as fotos flat
  const flatRaw = fs.readFileSync('libus_all_photos_flat.json', 'utf8');
  const allPhotos = [...JSON.parse(flatRaw), ...additionalPhotos];

  // 3. Mapeamento definitivo e preciso produto a produto
  const EXACT_PRODUCT_MAP: Record<string, { pattern: RegExp; directFileId?: string }> = {
    // Cabeça
    'genesis': { pattern: /casco-seguridad-genesis-amarillo-01\.png/i },
    'capacete genesis': { pattern: /casco-seguridad-genesis-amarillo-01\.png/i },
    'andes': { pattern: /casco-altura-andes-amarillo-01\.png/i },
    'capacete andes': { pattern: /casco-altura-andes-amarillo-01\.png/i },
    'milenium': { pattern: /casco-seguridad-milenium-full-brim-con-slot-amarillo-01\.PNG/i },
    'milienium class': { pattern: /casco-seguridad-milenium-class-slot-blanco.*01\.png/i },
    'capacete milenium': { pattern: /casco-seguridad-milenium-full-brim-con-slot-amarillo-01\.PNG/i },
    'capacete milienium': { pattern: /casco-seguridad-milenium-class-slot-blanco.*01\.png/i },

    // Auditiva
    'quantum': { pattern: /proteccion-auditiva-quantum-03\.png/i },
    'capacete quantum': { pattern: /proteccion-auditiva-quantum-03\.png/i },
    'l320v': { pattern: /proteccion-auditiva-l320-vincha-001\.PNG/i },
    'l340v': { pattern: /proteccion-auditiva-l340-vincha-001\.PNG/i },
    'capacete l-340v': { pattern: /proteccion-auditiva-l340-casco-001\.PNG/i },
    'l360v': { pattern: /proteccion-auditiva-l360-vincha|l360-casco-001\.png/i },
    'l320c': { pattern: /proteccion-auditiva-l320-casco-001\.png/i },
    'l340c': { pattern: /proteccion-auditiva-l340-casco-001\.PNG/i },
    'l360c': { pattern: /proteccion-auditiva-l360-casco-001\.png/i },

    // Visual
    'argon': { pattern: /anteojo-seguridad-argon-amarillo-01\.PNG|argon-amarillo/i },
    'argon elite': { pattern: /anteojo-seguridad-argon-elite-amarillo-01\.png|argon-elite/i },
    'ecoline': { pattern: /anteojo-seguridad-ecoline|argon-amarillo/i },
    'neon': { pattern: /anteojo-seguridad-neon|argon-amarillo/i },
    'mig': { pattern: /anteojo-seguridad-mig|argon-elite/i },
    'eco sport': { pattern: /anteojo-seguridad-eco-sport|argon-elite/i },
    'new classic': { pattern: /anteojo-seguridad-new-classic|argon-amarillo/i },
    'aviator': { pattern: /antiparra-seguridad-aviator.*transparente-01\.png|aviator/i },

    // Facial
    'facial bolha': { pattern: /proteccion-facial-burbuja-amarillo-001\.png/i },
    'facial plano': { pattern: /proteccion-facial-plano|cronos/i },
    'facial tela': { pattern: /proteccion-facial-malla-forestal-001\.png/i },
    'facial cilindrico': { pattern: /cilindrico|cronos/i },

    // Respiratória BLS e Libus
    'máscara facial completa bls 5600 (tpe)': { pattern: /5600/i, directFileId: '1TIfCg5w4UtszMj3dAgyfF3BZFu7tmjOP' },
    'máscara facial completa bls 5700 (silicone)': { pattern: /5700/i, directFileId: '16loNWgz3CmYu5Y9uymuUvtNOJe4a9-1P' },
    'máscara facial completa bls 5150 (rd40)': { pattern: /5150|5600/i, directFileId: '1TIfCg5w4UtszMj3dAgyfF3BZFu7tmjOP' },
    'facial inteira 9000': { pattern: /9000|5600/i, directFileId: '1TIfCg5w4UtszMj3dAgyfF3BZFu7tmjOP' },
    'máscara semifacial bls 4000 next r (tpe)': { pattern: /4000.*r/i, directFileId: '1DTK1_XXVqWaQzCuqg53pkYPzy3u_Il1u' },
    'máscara semifacial bls 4000 next s (silicone)': { pattern: /4000.*s/i, directFileId: '10NlV2E4obZttdP-fQQYSz3tCEdbcwg2t' },
    'semifacial 9000 (tpe)': { pattern: /4000/i, directFileId: '1DTK1_XXVqWaQzCuqg53pkYPzy3u_Il1u' },
    'semifacial 9000 silicone': { pattern: /4000/i, directFileId: '10NlV2E4obZttdP-fQQYSz3tCEdbcwg2t' }
  };

  const products = await prisma.libusProduct.findMany();
  let updated = 0;

  for (const prod of products) {
    const key = prod.name.trim().toLowerCase();
    let imgUrl: string | null = null;

    if (EXACT_PRODUCT_MAP[key]) {
      const rule = EXACT_PRODUCT_MAP[key];
      if (rule.directFileId) {
        imgUrl = `https://lh3.googleusercontent.com/d/${rule.directFileId}=w800`;
      } else {
        const photo = allPhotos.find(p => rule.pattern.test(p.fileName));
        if (photo) imgUrl = photo.url;
      }
    }

    if (!imgUrl) {
      // Busca parcial
      for (const [mapKey, rule] of Object.entries(EXACT_PRODUCT_MAP)) {
        if (key.includes(mapKey) || mapKey.includes(key)) {
          if (rule.directFileId) {
            imgUrl = `https://lh3.googleusercontent.com/d/${rule.directFileId}=w800`;
          } else {
            const photo = allPhotos.find(p => rule.pattern.test(p.fileName));
            if (photo) imgUrl = photo.url;
          }
          break;
        }
      }
    }

    if (imgUrl) {
      await prisma.libusProduct.update({
        where: { id: prod.id },
        data: { imageUrl: imgUrl }
      });
      console.log(`✓ [${prod.name}] -> Imagem vinculada: ${imgUrl}`);
      updated++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Libus atualizados com imagens oficiais Odoo: ${updated}/${products.length}`);
  console.log(`========================================`);
}

syncAllLibusImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
