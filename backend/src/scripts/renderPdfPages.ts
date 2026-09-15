import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products/respiratory_valid';
const files = fs.readdirSync(outDir).filter(f => f.endsWith('.png'));

console.log('Testando Jimp em algumas imagens de tamanho moderado:');
async function test() {
  for (const f of files.slice(0, 5)) {
    try {
      const img = await Jimp.read(path.join(outDir, f));
      console.log(`[OK] ${f} -> ${img.width}x${img.height}`);
    } catch (e: any) {
      console.log(`[ERR] ${f} -> ${e.message}`);
    }
  }
}
test();
