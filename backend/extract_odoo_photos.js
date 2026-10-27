const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let nextUrl = res.headers.location;
        if (nextUrl.startsWith('/')) {
          nextUrl = 'https://odoo-app.libus.com.br' + nextUrl;
        }
        return fetchUrl(nextUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function extractPhotos() {
  // 1. Buscar com category_id=10 (Fotos)
  console.log('--- Buscando categoria Fotos (category_id=10) ---');
  const photosHtml = await fetchUrl('https://odoo-app.libus.com.br/documents?category_id=10');

  // Extrair linhas da tabela de documentos
  const trMatches = [...photosHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)];
  const photoEntries = [];

  for (const tr of trMatches) {
    // Pegar colunas td
    const tds = [...tr[0].matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map(td =>
      td[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    );
    const links = [...tr[0].matchAll(/href="([^"]+)"/gi)].map(m => m[1]);

    if (links.length > 0 && tds.length > 0) {
      photoEntries.push({
        name: tds[0] || '',
        category: tds[1] || '',
        subcategory: tds[2] || '',
        link: links[0] || '',
        allLinks: links,
        rawText: tds.join(' | ')
      });
    }
  }

  console.log(`Total de fotos/pastas encontradas na categoria 10: ${photoEntries.length}`);
  fs.writeFileSync('libus_odoo_photos.json', JSON.stringify(photoEntries, null, 2), 'utf8');

  // Exibir distribuição por subcategoria
  const bySubcategory = {};
  for (const entry of photoEntries) {
    const sub = entry.subcategory || 'Sem subcategoria';
    if (!bySubcategory[sub]) bySubcategory[sub] = [];
    bySubcategory[sub].push(entry);
  }

  for (const [sub, list] of Object.entries(bySubcategory)) {
    console.log(`\n=== Subcategoria: ${sub} (${list.length} itens) ===`);
    list.forEach(item => {
      console.log(`- [${item.name}]: ${item.link}`);
    });
  }

  // 2. Buscar também todas as demais categorias para garantir catálogo completo
  console.log('\n--- Buscando todos os documentos (sem filtro) para mapeamento geral ---');
  const allHtml = await fetchUrl('https://odoo-app.libus.com.br/documents?category_id=0');
  const allTrs = [...allHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)];
  const allEntries = [];

  for (const tr of allTrs) {
    const tds = [...tr[0].matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map(td =>
      td[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    );
    const links = [...tr[0].matchAll(/href="([^"]+)"/gi)].map(m => m[1]);

    if (links.length > 0 && tds.length > 0) {
      allEntries.push({
        name: tds[0] || '',
        category: tds[1] || '',
        subcategory: tds[2] || '',
        link: links[0] || '',
        allLinks: links
      });
    }
  }

  console.log(`Total geral de documentos no Odoo: ${allEntries.length}`);
  fs.writeFileSync('libus_odoo_all_documents.json', JSON.stringify(allEntries, null, 2), 'utf8');
}

extractPhotos().catch(console.error);
