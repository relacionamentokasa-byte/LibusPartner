import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';

const tempRoot = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/temp_xlsx';

async function run() {
  const wbXmlStr = fs.readFileSync(path.join(tempRoot, 'xl/workbook.xml'), 'utf-8');
  const wbXml = await parseStringPromise(wbXmlStr);
  const sheets = wbXml.workbook.sheets[0].sheet;
  
  const wbRelsStr = fs.readFileSync(path.join(tempRoot, 'xl/_rels/workbook.xml.rels'), 'utf-8');
  const wbRelsXml = await parseStringPromise(wbRelsStr);
  const rels = wbRelsXml.Relationships.Relationship;

  const relMap: Record<string, string> = {};
  rels.forEach((r: any) => {
    relMap[r.$.Id] = r.$.Target;
  });

  console.log('--- Mapeamento de Abas e Planilhas XML ---');
  for (const s of sheets) {
    const name = s.$.name;
    const rId = s.$['r:id'];
    const target = relMap[rId]; // ex: worksheets/sheet1.xml
    const sheetFile = path.basename(target);
    const sheetRelsPath = path.join(tempRoot, 'xl/worksheets/_rels', `${sheetFile}.rels`);
    
    let drawingTarget = null;
    if (fs.existsSync(sheetRelsPath)) {
      const sRelsStr = fs.readFileSync(sheetRelsPath, 'utf-8');
      const sRelsXml = await parseStringPromise(sRelsStr);
      const drawRel = sRelsXml.Relationships.Relationship?.find((r: any) => r.$.Type.includes('drawing'));
      if (drawRel) {
        drawingTarget = drawRel.$.Target; // ex: ../drawings/drawing1.xml
      }
    }

    console.log(`Aba: "${name}" -> ${sheetFile} -> Drawing: ${drawingTarget || 'Nenhum'}`);
  }
}

run();
