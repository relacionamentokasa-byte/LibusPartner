const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const productsDir = path.join(__dirname, 'frontend', 'public', 'products');

async function processImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.png', '.jpeg', '.jpg'].includes(ext)) return;

    // Carregar imagem com Jimp
    const image = await Jimp.read(filePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Converter fundo branco/quase branco para transparente
    // Verifica pixels nas bordas e cantos para calcular média de fundo ou usar threshold
    // Considera pixels com R, G, B > 240 como fundo branco
    image.scan(0, 0, width, height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];

      // Se o pixel for predominantemente branco / cinza muito claro de estúdio
      if (red > 235 && green > 235 && blue > 235) {
        this.bitmap.data[idx + 3] = 0; // Torna transparente
      } else if (red > 215 && green > 215 && blue > 215 && Math.abs(red - green) < 10 && Math.abs(green - blue) < 10) {
        // Transição suave nas bordas claras
        const factor = (255 - Math.max(red, green, blue)) / 40;
        this.bitmap.data[idx + 3] = Math.round(alpha * Math.max(0, Math.min(1, factor)));
      }
    });

    // Se for JPEG, salvar também como PNG transparente
    const parsed = path.parse(filePath);
    const targetPng = path.join(parsed.dir, `${parsed.name}.png`);

    // Salva a versão PNG com transparência
    await image.write(targetPng);

    // Se o arquivo original for JPEG/JPG, sobrescreve também
    if (ext === '.jpeg' || ext === '.jpg') {
      await image.write(filePath);
    }

    console.log(`[OK] Transparência aplicada: ${parsed.base}`);
  } catch (err) {
    console.error(`[Erro] ao processar ${filePath}:`, err.message);
  }
}

async function run() {
  const files = fs.readdirSync(productsDir);
  console.log(`Iniciando remoção de fundo branco em ${files.length} arquivos...`);

  for (const file of files) {
    const fullPath = path.join(productsDir, file);
    if (fs.statSync(fullPath).isFile()) {
      await processImage(fullPath);
    }
  }

  console.log('Todos os fundos processados com sucesso!');
}

run();
