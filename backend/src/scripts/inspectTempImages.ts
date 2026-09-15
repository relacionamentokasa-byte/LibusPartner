import fs from 'fs';
import path from 'path';

const tempDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/temp_xlsx/xl/media';

if (fs.existsSync(tempDir)) {
  const files = fs.readdirSync(tempDir);
  console.log(`Encontrados ${files.length} arquivos no temp_xlsx:`);
  files.forEach((f, idx) => {
    const stat = fs.statSync(path.join(tempDir, f));
    console.log(`${idx + 1}. ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
  });
} else {
  console.log('Pasta temp_xlsx não encontrada.');
}
