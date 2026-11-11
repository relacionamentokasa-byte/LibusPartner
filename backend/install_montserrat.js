const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const fontDir = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'Windows', 'Fonts');
if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir, { recursive: true });

const dest = path.join(fontDir, 'Montserrat-Variable.ttf');

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Baixando Montserrat oficial do Google Fonts...');
  await download('https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf', dest);
  console.log('Arquivo salvo em:', dest, 'tamanho:', fs.statSync(dest).size);

  const escapedDest = dest.replace(/\\/g, '\\\\');
  const psCmd = `New-ItemProperty -Path 'HKCU:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts' -Name 'Montserrat (TrueType)' -Value '${escapedDest}' -PropertyType String -Force`;
  execSync(`powershell -NoProfile -Command "${psCmd}"`);
  console.log('Fonte Montserrat instalada e registrada no Windows com sucesso!');
}

run().catch(e => console.error('Erro:', e.message));
