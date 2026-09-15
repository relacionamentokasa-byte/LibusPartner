import fs from 'fs';
import path from 'path';
import { Jimp } from './backend/node_modules/jimp/dist/esm/index.js';

const productsDir = path.join(process.cwd(), 'frontend', 'public', 'products');

async function processImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.png', '.jpeg', '.jpg'].includes(ext)) return;

    const image = await Jimp.read(filePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Scan pixels and convert white/near-white to transparent
    image.scan(0, 0, width, height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];

      // Pure or near pure white
      if (red > 232 && green > 232 && blue > 232) {
        this.bitmap.data[idx + 3] = 0;
      } else if (red > 210 && green > 210 && blue > 210 && Math.abs(red - green) < 14 && Math.abs(green - blue) < 14) {
        const factor = (255 - Math.max(red, green, blue)) / 45;
        this.bitmap.data[idx + 3] = Math.round(alpha * Math.max(0, Math.min(1, factor)));
      }
    });

    const parsed = path.parse(filePath);
    const targetPng = path.join(parsed.dir, `${parsed.name}.png`);

    await image.write(targetPng);

    if (ext === '.jpeg' || ext === '.jpg') {
      await image.write(filePath);
    }

    console.log(`[OK] Fundo transparente: ${parsed.base}`);
  } catch (err) {
    console.error(`[Erro] ${filePath}:`, err.message);
  }
}

async function run() {
  const files = fs.readdirSync(productsDir);
  console.log(`Processando remoção de fundo branco em ${files.length} arquivos...`);

  for (const file of files) {
    const fullPath = path.join(productsDir, file);
    if (fs.statSync(fullPath).isFile()) {
      await processImage(fullPath);
    }
  }

  console.log('Remoção de fundo branco concluída em todas as imagens!');
}

run();
