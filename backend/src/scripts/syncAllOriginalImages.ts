import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import * as XLSX from 'xlsx';
import { prisma } from '../lib/prisma.js';

const tempRoot = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/temp_xlsx';
const pathOrig = 'C:/Users/Ariel Matos/Desktop/Depara de Produtos Libus - 2024 -.xlsx';
const destProductsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products';

function sanitizeName(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

async function run() {
  const wb = XLSX.readFile(pathOrig);
  let totalSaved = 0;
  let totalLibusMatched = 0;
  let totalCompMatched = 0;

  for (let i = 1; i <= 24; i++) {
    const drawingFile = `drawing${i}.xml`;
    const drawingRelsFile = `drawing${i}.xml.rels`;
    const drawingPath = path.join(tempRoot, 'xl/drawings', drawingFile);
    const relsPath = path.join(tempRoot, 'xl/drawings/_rels', drawingRelsFile);
    
    if (!fs.existsSync(drawingPath) || !fs.existsSync(relsPath)) continue;

    const relsStr = fs.readFileSync(relsPath, 'utf-8');
    const relsXml = await parseStringPromise(relsStr);
    const imageMap: Record<string, string> = {};
    (relsXml.Relationships.Relationship || []).forEach((r: any) => {
      imageMap[r.$.Id] = path.basename(r.$.Target);
    });

    const drawStr = fs.readFileSync(drawingPath, 'utf-8');
    const drawXml = await parseStringPromise(drawStr);

    const sheetName = wb.SheetNames[i - 1];
    const sheet = wb.Sheets[sheetName];
    const matrix: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Encontrar linha de Produto e Fabricante
    let prodRowIdx = -1;
    let manufRowIdx = -1;
    let photoRowIdx = -1;

    for (let r = 0; r < Math.min(15, matrix.length); r++) {
      const row = matrix[r];
      if (!row) continue;
      const firstCell = String(row[0] || '').toLowerCase().trim();
      if (firstCell.includes('produto')) prodRowIdx = r;
      if (firstCell.includes('fabricante')) manufRowIdx = r;
      if (firstCell.includes('foto')) photoRowIdx = r;
    }

    if (prodRowIdx === -1 || manufRowIdx === -1) {
      console.log(`[PULAR ABA ${i}] Não encontrou cabeçalho em ${sheetName}`);
      continue;
    }

    const prodRow = matrix[prodRowIdx];
    const manufRow = matrix[manufRowIdx];

    const twoCellAnchors = drawXml['xdr:wsDr']['xdr:twoCellAnchor'] || [];
    const oneCellAnchors = drawXml['xdr:wsDr']['xdr:oneCellAnchor'] || [];
    const allAnchors = [...twoCellAnchors, ...oneCellAnchors];

    console.log(`\n======================================================`);
    console.log(`PROCESSANDO ABA [${i}]: "${sheetName}"`);

    for (const anc of allAnchors) {
      const fromCol = parseInt(anc['xdr:from'][0]['xdr:col'][0]);
      const fromRow = parseInt(anc['xdr:from'][0]['xdr:row'][0]);
      
      // Ignorar logo Libus que fica no topo (linha 0 a 3, col 0)
      if (fromRow < 4 && fromCol === 0) continue;

      let blipId = null;
      try {
        blipId = anc['xdr:pic'][0]['xdr:blipFill'][0]['a:blip'][0]['$']['r:embed'];
      } catch (e) {}

      if (!blipId || !imageMap[blipId]) continue;
      const srcImageFile = imageMap[blipId];
      const srcImagePath = path.join(tempRoot, 'xl/media', srcImageFile);
      if (!fs.existsSync(srcImagePath)) continue;

      // Pegar nome do produto e fabricante da coluna
      const prodName = prodRow[fromCol] ? String(prodRow[fromCol]).trim() : '';
      const manufName = manufRow[fromCol] ? String(manufRow[fromCol]).trim() : '';

      if (!prodName) continue;

      const isLibus = fromCol === 1 || manufName.toLowerCase().includes('libus');
      const ext = path.extname(srcImageFile).toLowerCase();
      const newFilename = `${sanitizeName(manufName)}_${sanitizeName(prodName)}${ext}`;
      const destPath = path.join(destProductsDir, newFilename);
      const publicUrl = `/products/${newFilename}`;

      fs.copyFileSync(srcImagePath, destPath);
      totalSaved++;

      if (isLibus) {
        // Atualizar produto Libus no banco
        const libusProd = await prisma.libusProduct.findFirst({
          where: {
            OR: [
              { name: { contains: prodName } },
              { name: { contains: sheetName.replace(/^(Capacete|Óculos|Abafador|Plug|Facial)\s*/i, '').trim() } }
            ]
          }
        });
        if (libusProd) {
          await prisma.libusProduct.update({
            where: { id: libusProd.id },
            data: { imageUrl: publicUrl }
          });
          console.log(`  [LIBUS SALVO] ${libusProd.name} -> ${publicUrl}`);
          totalLibusMatched++;
        } else {
          console.log(`  [LIBUS FOTO COPIADA, N/B] ${prodName} -> ${publicUrl}`);
        }
      } else {
        // Atualizar produto Concorrente no banco
        // Normalização de nomes de fabricantes da planilha
        let normalizedManuf = manufName;
        if (manufName.toLowerCase().includes('m.s.a') || manufName.toLowerCase().includes('msa')) normalizedManuf = 'MSA';
        if (manufName.toLowerCase().includes('3m')) normalizedManuf = '3M';
        if (manufName.toLowerCase().includes('delta')) normalizedManuf = 'Delta Plus';
        if (manufName.toLowerCase().includes('steeflex') || manufName.toLowerCase().includes('steelflex') || manufName.toLowerCase().includes('sthslflex') || manufName.toLowerCase().includes('bsb')) normalizedManuf = 'Steelflex';
        if (manufName.toLowerCase().includes('kalypso') || manufName.toLowerCase().includes('kalipso')) normalizedManuf = 'Kalipso';
        if (manufName.toLowerCase().includes('uvex') || manufName.toLowerCase().includes('honeywell')) normalizedManuf = 'Honeywell';

        const compProd = await prisma.competitorProduct.findFirst({
          where: {
            manufacturer: { name: { contains: normalizedManuf } },
            OR: [
              { name: { contains: prodName } },
              { name: { contains: prodName.split(' ')[0] } }
            ]
          }
        });

        if (compProd) {
          await prisma.competitorProduct.update({
            where: { id: compProd.id },
            data: { imageUrl: publicUrl }
          });
          console.log(`  [CONCORRENTE SALVO] ${normalizedManuf} - ${compProd.name} -> ${publicUrl}`);
          totalCompMatched++;
        } else {
          console.log(`  [CONCORRENTE FOTO COPIADA, N/B] ${manufName} - ${prodName} -> ${publicUrl}`);
        }
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`TOTAL COPIADO: ${totalSaved}`);
  console.log(`LIBUS VINCULADOS: ${totalLibusMatched}`);
  console.log(`CONCORRENTES VINCULADOS: ${totalCompMatched}`);

  await prisma.$disconnect();
}

run();
