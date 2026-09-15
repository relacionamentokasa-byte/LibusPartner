import fs from 'fs';
import path from 'path';

// Vamos inspecionar as relações entre as planilhas e as imagens extraídas em temp_xlsx
const drawingDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/temp_xlsx/xl/drawings';
const relsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/temp_xlsx/xl/drawings/_rels';

console.log('Verificando desenhos/relações do Excel extraído:');
if (fs.existsSync(drawingDir)) {
  console.log('Drawings:', fs.readdirSync(drawingDir));
}
if (fs.existsSync(relsDir)) {
  console.log('Rels:', fs.readdirSync(relsDir));
}
