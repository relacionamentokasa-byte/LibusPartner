import fs from 'fs';
import path from 'path';
import { Jimp } from './backend/node_modules/jimp/dist/esm/index.js';

const productsDir = path.join(process.cwd(), 'frontend', 'public', 'products');

async function processCleanTransparency(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.png', '.jpeg', '.jpg'].includes(ext)) return;

    const image = await Jimp.read(filePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Converte pixels de fundo para transparente
    image.scan(0, 0, width, height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];

      // Fundo preto artificial (decorrente de formatos sem canal alfa ou conversão anterior)
      if (red < 15 && green < 15 && blue < 15) {
        // Se estiver nas bordas ou for isolado
        if (x < 6 || x > width - 6 || y < 6 || y > height - 6 || (red === 0 && green === 0 && blue === 0)) {
          this.bitmap.data[idx + 3] = 0;
        }
      }

      // Fundo branco e off-white de estúdio
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0;
      } else if (red > 210 && green > 210 && blue > 210 && Math.abs(red - green) < 14 && Math.abs(green - blue) < 14) {
        const factor = (255 - Math.max(red, green, blue)) / 45;
        this.bitmap.data[idx + 3] = Math.round(alpha * Math.max(0, Math.min(1, factor)));
      }
    });

    const parsed = path.parse(filePath);
    const targetPng = path.join(parsed.dir, `${parsed.name}.png`);

    await image.write(targetPng);

    console.log(`[Clean PNG] ${parsed.name}.png`);
  } catch (err) {
    console.error(`[Erro] ${filePath}:`, err.message);
  }
}

async function run() {
  const files = fs.readdirSync(productsDir);
  for (const file of files) {
    const fullPath = path.join(productsDir, file);
    if (fs.statSync(fullPath).isFile()) {
      await processCleanTransparency(fullPath);
    }
  }
  console.log('Todas as fotos convertidas para PNG com transparência limpa!');
}

run();
