import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';

const pdfPath = 'C:/Users/Ariel Matos/Desktop/tabla_comparativa_respiracion_brasil_0626.pdf';
const outDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products/respiratory_valid';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  console.log(`PDF carregado com ${pages.length} páginas.`);

  const enumerated = pdfDoc.context.enumerateIndirectObjects();
  let imgCount = 0;

  for (const [ref, obj] of enumerated) {
    if (obj instanceof PDFRawStream) {
      const dict = obj.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype === PDFName.of('Image')) {
        const filter = dict.get(PDFName.of('Filter'));
        const width = dict.get(PDFName.of('Width'))?.toString();
        const height = dict.get(PDFName.of('Height'))?.toString();
        const bytes = obj.getContents();
        imgCount++;

        let ext = 'bin';
        if (filter === PDFName.of('DCTDecode')) ext = 'jpg';
        else if (filter === PDFName.of('FlateDecode')) ext = 'png';

        const filename = `img_${imgCount}_${width}x${height}.${ext}`;
        fs.writeFileSync(path.join(outDir, filename), bytes);
        console.log(`Imagem salva: ${filename} (Filter: ${filter}, Tamanho: ${(bytes.length / 1024).toFixed(1)} KB)`);
      }
    }
  }

  console.log(`Total de imagens válidas extraídas: ${imgCount}`);
}

run();
