const https = require('https');
const fs = require('fs');

function fetchFolderPage(folderId) {
  return new Promise((resolve, reject) => {
    https.get(`https://drive.google.com/drive/folders/${folderId}`, {
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

async function extractFilesFromDrive() {
  const photos = JSON.parse(fs.readFileSync('libus_odoo_photos.json', 'utf8'));
  console.log(`--- Analisando ${photos.length} pastas de fotos do Odoo ---`);

  const results = [];

  for (const item of photos) {
    const match = item.link.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (!match) continue;
    const folderId = match[1];

    try {
      const html = await fetchFolderPage(folderId);

      // Extrair ocorrências de arquivos com seus IDs
      // No Google Drive HTML os itens aparecem no formato: [..., "fileID", "filename.png", ...]
      const regex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+\.(?:png|jpg|jpeg|webp))"/gi;
      let m;
      const filesFound = [];

      while ((m = regex.exec(html)) !== null) {
        const fileId = m[1];
        const fileName = m[2];
        // Evitar ícones estáticos do Google
        if (!fileName.includes('gstatic') && !fileName.includes('favicon')) {
          filesFound.push({
            fileId,
            fileName,
            directUrl: `https://lh3.googleusercontent.com/d/${fileId}=w800`,
            thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
          });
        }
      }

      // Se a regex específica não pegar tudo, tentar regex alternativa de pares de dados
      if (filesFound.length === 0) {
        const altRegex = /"([a-zA-Z0-9_-]{25,})"[^\]]*?"([^"]+\.(?:png|jpg|jpeg|webp))"/gi;
        let altM;
        while ((altM = altRegex.exec(html)) !== null) {
          const fileId = altM[1];
          const fileName = altM[2];
          if (!fileName.includes('gstatic') && !fileName.includes('favicon')) {
            if (!filesFound.some(f => f.fileId === fileId)) {
              filesFound.push({
                fileId,
                fileName,
                directUrl: `https://lh3.googleusercontent.com/d/${fileId}=w800`,
                thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
              });
            }
          }
        }
      }

      console.log(`✓ Pasta [${item.name}] (ID: ${folderId}): ${filesFound.length} fotos encontradas.`);
      results.push({
        folderName: item.name,
        folderId,
        folderLink: item.link,
        files: filesFound
      });
    } catch (e) {
      console.error(`Erro ao ler pasta ${item.name}:`, e.message);
    }
  }

  fs.writeFileSync('libus_drive_extracted_photos.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nSalvo em libus_drive_extracted_photos.json`);
}

extractFilesFromDrive().catch(console.error);
