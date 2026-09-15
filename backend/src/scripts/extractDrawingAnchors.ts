import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import * as XLSX from 'xlsx';

const tempRoot = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/temp_xlsx';
const pathOrig = 'C:/Users/Ariel Matos/Desktop/Depara de Produtos Libus - 2024 -.xlsx';

async function run() {
  const wb = XLSX.readFile(pathOrig);
  
  // Vamos inspecionar as primeiras 5 abas detalhadamente
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
    console.log(`\n======================================================`);
    console.log(`ABA [${i}]: "${sheetName}"`);
    
    const sheet = wb.Sheets[sheetName];
    const matrix: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const twoCellAnchors = drawXml['xdr:wsDr']['xdr:twoCellAnchor'] || [];
    const oneCellAnchors = drawXml['xdr:wsDr']['xdr:oneCellAnchor'] || [];
    const allAnchors = [...twoCellAnchors, ...oneCellAnchors];

    allAnchors.forEach((anc: any, aIdx: number) => {
      const fromCol = parseInt(anc['xdr:from'][0]['xdr:col'][0]);
      const fromRow = parseInt(anc['xdr:from'][0]['xdr:row'][0]);
      
      let blipId = null;
      try {
        blipId = anc['xdr:pic'][0]['xdr:blipFill'][0]['a:blip'][0]['$']['r:embed'];
      } catch (e) {}

      const imgFile = blipId ? imageMap[blipId] : 'Desconhecido';
      
      // Conteúdo da célula da linha/coluna aproximada
      const cellVal = matrix[fromRow] ? matrix[fromRow][fromCol] : 'Vazio';
      const rowText = matrix[fromRow] ? matrix[fromRow].filter(Boolean).slice(0, 4).join(' | ') : '';
      const prevRowText = (fromRow > 0 && matrix[fromRow - 1]) ? matrix[fromRow - 1].filter(Boolean).slice(0, 4).join(' | ') : '';
      const nextRowText = matrix[fromRow + 1] ? matrix[fromRow + 1].filter(Boolean).slice(0, 4).join(' | ') : '';

      console.log(`  Img #${aIdx+1}: [${imgFile}] ancorada em Col:${fromCol}, Row:${fromRow} (Ref: ${XLSX.utils.encode_cell({c: fromCol, r: fromRow})})`);
      console.log(`    Contexto: ${prevRowText || rowText || nextRowText}`);
    });
  }
}

run();
