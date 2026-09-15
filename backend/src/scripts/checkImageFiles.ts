import fs from 'fs';
import path from 'path';

const productsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products';
const respFiles = fs.readdirSync(productsDir).filter(f => f.includes('cartucho') || f.includes('9000') || f.includes('filtro') || f.includes('resp'));
console.log('Arquivos respiratórios em frontend/public/products:');
respFiles.forEach(f => {
  const stat = fs.statSync(path.join(productsDir, f));
  const buffer = fs.readFileSync(path.join(productsDir, f));
  const header = buffer.subarray(0, 10).toString('hex');
  console.log(`- ${f} (${(stat.size / 1024).toFixed(1)} KB) | Header hex: ${header}`);
});
