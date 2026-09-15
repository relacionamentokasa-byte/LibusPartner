import fs from 'fs';
import path from 'path';

const pdfPath = 'C:/Users/Ariel Matos/Desktop/tabla_comparativa_respiracion_brasil_0626.pdf';
const destDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products/respiratory';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Lendo PDF de proteção respiratória...');
const buffer = fs.readFileSync(pdfPath);
console.log(`Tamanho do PDF: ${(buffer.length / (1024 * 1024)).toFixed(1)} MB`);

// Extração de imagens JPEG nativas embutidas no PDF (marcadores FFD8FFE0 / FFD8FFE1 / FFD8FFE2 / FFD8DB)
let count = 0;
let pos = 0;

while (pos < buffer.length - 4) {
  if (buffer[pos] === 0xFF && buffer[pos + 1] === 0xD8 && buffer[pos + 2] === 0xFF) {
    // Início de um JPEG
    let endPos = pos + 3;
    while (endPos < buffer.length - 1) {
      if (buffer[endPos] === 0xFF && buffer[endPos + 1] === 0xD9) {
        // Fim de JPEG
        break;
      }
      endPos++;
    }
    if (endPos < buffer.length - 1) {
      const imgBuffer = buffer.subarray(pos, endPos + 2);
      if (imgBuffer.length > 5000) { // filtrar thumbnails minúsculos ou fragmentos
        count++;
        const filename = `resp_img_${count}.jpg`;
        fs.writeFileSync(path.join(destDir, filename), imgBuffer);
        console.log(`Salva imagem ${filename} (${(imgBuffer.length / 1024).toFixed(1)} KB)`);
      }
      pos = endPos + 2;
      continue;
    }
  }
  pos++;
}

console.log(`\nTotal de imagens extraídas do PDF: ${count}`);
