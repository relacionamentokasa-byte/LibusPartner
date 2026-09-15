import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import * as XLSX from 'xlsx';
import { prisma } from '../lib/prisma.js';

const tempRoot = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/temp_xlsx';
const workbookPath = 'C:/Users/Ariel Matos/Desktop/PROJETO LIBUS/BASE_MESTRE_DEPARA_LIBUS_PARTNER_2026.xlsx';
const destProductsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products';

async function run() {
  console.log('Lendo workbook...');
  const wb = XLSX.readFile(workbookPath);
  console.log('Abas disponíveis:', wb.SheetNames);

  // Mapear cada drawingX.xml para descobrir em qual linha/coluna cada imagem está ancorada
  const drawingsDir = path.join(tempRoot, 'xl/drawings');
  const drawingFiles = fs.readdirSync(drawingsDir).filter(f => f.endsWith('.xml'));

  // Ler workbook.xml.rels para saber qual sheet aponta para qual drawing
  const wbRelsPath = path.join(tempRoot, 'xl/_rels/workbook.xml.rels');
  const sheetRelsDir = path.join(tempRoot, 'xl/worksheets/_rels');

  for (const sheetName of wb.SheetNames) {
    console.log(`\nAnalisando aba: "${sheetName}"`);
    const sheet = wb.Sheets[sheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`Linhas: ${data.length}`);
    if (data.length > 0) {
      console.log('Cabeçalho (primeiras 3 linhas):');
      console.log(data.slice(0, 3));
    }
  }

  await prisma.$disconnect();
}

run();
