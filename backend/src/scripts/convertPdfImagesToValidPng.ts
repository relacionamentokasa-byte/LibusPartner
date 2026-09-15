import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma.js';

const outDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products/respiratory_valid';
const destProductsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products';

// Encontrar as imagens reais dos respiradores e filtros no lote extraído de PNGs
const files = fs.readdirSync(outDir).filter(f => f.endsWith('.png'));

// Vamos filtrar imagens entre 200px e 1200px (fotos de produtos)
const productCandidateFiles: Array<{ filename: string; size: number; width: number; height: number }> = [];

files.forEach(f => {
  const match = f.match(/img_(\d+)_(\d+)x(\d+)\.png/);
  if (match) {
    const width = parseInt(match[2]);
    const height = parseInt(match[3]);
    const stat = fs.statSync(path.join(outDir, f));
    if (width >= 200 && height >= 200 && width <= 1500 && height <= 1500 && stat.size > 50000) {
      productCandidateFiles.push({ filename: f, size: stat.size, width, height });
    }
  }
});

console.log(`Candidatos a fotos de produtos respiratórios: ${productCandidateFiles.length}`);
productCandidateFiles.sort((a, b) => b.size - a.size).slice(0, 30).forEach((c, idx) => {
  console.log(`${idx + 1}. ${c.filename} (${c.width}x${c.height}, ${(c.size / 1024).toFixed(1)} KB)`);
});
