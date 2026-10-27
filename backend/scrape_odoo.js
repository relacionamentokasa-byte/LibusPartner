const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Redirecting to:', res.headers.location);
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

async function run() {
  const html = await fetchUrl('https://odoo-app.libus.com.br/documents');
  console.log('HTML fetched successfully. Length:', html.length);
  fs.writeFileSync('odoo_dump.html', html, 'utf8');

  // Regex simples para capturar formulários e selects
  const selectMatches = [...html.matchAll(/<select[^>]*name="([^"]*)"[^>]*>([\s\S]*?)<\/select>/gi)];
  console.log('Filtros / Selects encontrados:', selectMatches.length);
  for (const sel of selectMatches) {
    const name = sel[1];
    const options = [...sel[2].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi)]
      .map(o => ({ value: o[1], label: o[2].trim() }));
    console.log('Select [' + name + ']:', JSON.stringify(options, null, 2));
  }

  // Capturar linhas de tabela ou cards
  const trMatches = [...html.matchAll(/<tr[\s\S]*?<\/tr>/gi)];
  console.log('Total de linhas <tr>:', trMatches.length);
  const rows = [];
  for (const tr of trMatches) {
    const text = tr[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const links = [...tr[0].matchAll(/href="([^"]+)"/gi)].map(m => m[1]);
    if (links.length > 0) {
      rows.push({ text, links });
    }
  }
  console.log('Primeiras 25 linhas com links:', JSON.stringify(rows.slice(0, 25), null, 2));
  console.log('Total de registros com links:', rows.length);
}

run().catch(console.error);
