const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function parseDriveFolder(folderId) {
  const html = await fetchUrl(`https://drive.google.com/drive/folders/${folderId}`);

  // No HTML do Google Drive, as entradas têm formato:
  // ssk='...:FILE_ID-0-1' ou blocos de dados contendo o ID e o título
  const fileIdMatches = [...html.matchAll(/ssk='[^']*?:([a-zA-Z0-9_-]{28,})-0-1'/g)].map(m => m[1]);
  const uniqueIds = [...new Set(fileIdMatches)];

  // Buscar nomes de arquivos no HTML
  const fileNames = [...html.matchAll(/"([^"]+\.(?:png|jpg|jpeg|webp))"/gi)]
    .map(m => m[1])
    .filter(n => !n.includes('gstatic') && !n.includes('favicon') && !n.includes('broken_image'));
  const uniqueNames = [...new Set(fileNames)];

  return {
    uniqueIds,
    uniqueNames
  };
}

async function processAllOdooFolders() {
  const photos = JSON.parse(fs.readFileSync('libus_odoo_photos.json', 'utf8'));
  console.log(`Total de pastas do Odoo: ${photos.length}`);

  const mappedFolders = [];

  for (const item of photos) {
    const match = item.link.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (!match) continue;
    const folderId = match[1];

    try {
      const data = await parseDriveFolder(folderId);
      console.log(`\n📁 [${item.name}] -> ${data.uniqueIds.length} IDs de arquivo, ${data.uniqueNames.length} nomes`);
      if (data.uniqueNames.length > 0) {
        console.log(`   Nomes:`, data.uniqueNames.slice(0, 5));
      }
      if (data.uniqueIds.length > 0) {
        console.log(`   Exemplo de URL direta: https://lh3.googleusercontent.com/d/${data.uniqueIds[0]}=w800`);
      }

      mappedFolders.push({
        folderName: item.name,
        folderId,
        folderLink: item.link,
        fileIds: data.uniqueIds,
        fileNames: data.uniqueNames,
        primaryImage: data.uniqueIds.length > 0 ? `https://lh3.googleusercontent.com/d/${data.uniqueIds[0]}=w800` : null
      });
    } catch (err) {
      console.error(`Erro ao processar ${item.name}:`, err.message);
    }
  }

  fs.writeFileSync('libus_drive_full_mapping.json', JSON.stringify(mappedFolders, null, 2), 'utf8');
  console.log('\nMapeamento completo salvo em libus_drive_full_mapping.json');
}

processAllOdooFolders().catch(console.error);
