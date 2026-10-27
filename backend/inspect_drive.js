const https = require('https');
const fs = require('fs');

function fetchGoogleDriveFolder(folderId) {
  return new Promise((resolve, reject) => {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function inspectDriveFolders() {
  const photos = JSON.parse(fs.readFileSync('libus_odoo_photos.json', 'utf8'));
  console.log(`Total de categorias de fotos: ${photos.length}`);

  for (const item of photos.slice(0, 5)) {
    const match = item.link.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (match) {
      const folderId = match[1];
      console.log(`\nInspecionando [${item.name}] (Folder ID: ${folderId})...`);
      const html = await fetchGoogleDriveFolder(folderId);

      // Procurar por nomes de arquivos e IDs de imagem no Google Drive HTML
      const matches = [...html.matchAll(/\[\"([^\"]+\.(?:jpg|jpeg|png|webp|pdf))\"/gi)].map(m => m[1]);
      console.log(`Arquivos encontrados na prévia do Drive (${matches.length}):`, matches.slice(0, 10));
    }
  }
}

inspectDriveFolders().catch(console.error);
