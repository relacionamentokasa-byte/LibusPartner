const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Extrair pares exatos de ID + Nome de Arquivo da página HTML do Drive
async function extractFolderPairs(folderId) {
  const html = await fetchUrl(`https://drive.google.com/drive/folders/${folderId}`);

  // O Google Drive renderiza arrays com os dados do arquivo em chunks JavaScript
  // Ex: ["1LUeApVBInJkf4PJOArPATdKIvA7xXhWT",["casco-seguridad-genesis-amarillo-01.png",...]]
  const items = [];

  // Padrão 1: Bloco de dados JSON no HTML
  const regex = /\["([a-zA-Z0-9_-]{28,})",\["([^"]+\.(?:png|jpg|jpeg|webp|PNG|JPG|JPEG))"/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    items.push({
      fileId: m[1],
      fileName: m[2],
      url: `https://lh3.googleusercontent.com/d/${m[1]}=w800`
    });
  }

  // Se não encontrar pelo padrão 1, varrer blocos ssk e nomes alinhados
  if (items.length === 0) {
    const sskIds = [...html.matchAll(/ssk='[^']*?:([a-zA-Z0-9_-]{28,})-0-1'/g)].map(x => x[1]);
    const fileNames = [...html.matchAll(/"([^"]+\.(?:png|jpg|jpeg|webp|PNG|JPG|JPEG))"/gi)]
      .map(x => x[1])
      .filter(n => !n.includes('gstatic') && !n.includes('favicon') && !n.includes('broken_image'));

    const minLen = Math.min(sskIds.length, fileNames.length);
    for (let i = 0; i < minLen; i++) {
      items.push({
        fileId: sskIds[i],
        fileName: fileNames[i],
        url: `https://lh3.googleusercontent.com/d/${sskIds[i]}=w800`
      });
    }
  }

  return items;
}

async function runDetailedExtraction() {
  const photos = JSON.parse(fs.readFileSync('libus_odoo_photos.json', 'utf8'));
  const allExtractedFiles = [];

  for (const item of photos) {
    const match = item.link.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (!match) continue;
    const folderId = match[1];

    const files = await extractFolderPairs(folderId);
    console.log(`✓ Pasta [${item.name}]: ${files.length} arquivos mapeados`);
    files.forEach(f => {
      allExtractedFiles.push({
        folderName: item.name,
        folderId,
        fileName: f.fileName,
        fileId: f.fileId,
        url: f.url
      });
    });
  }

  console.log(`\n==============================================`);
  console.log(`Total de fotos de produtos Libus extraídas: ${allExtractedFiles.length}`);
  console.log(`==============================================`);

  fs.writeFileSync('libus_all_photos_flat.json', JSON.stringify(allExtractedFiles, null, 2), 'utf8');
}

runDetailedExtraction().catch(console.error);
