const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend', 'public', 'products');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const photos = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'libus_all_photos_flat.json'), 'utf8'));

// Dicionário completo de download local para cada modelo Libus
const LOCAL_PRODUCT_PHOTOS = [
  // Cabeça
  { file: 'andes.png', pattern: /casco-altura-andes-amarillo-01\.png/i },
  { file: 'genesis.png', pattern: /casco-seguridad-genesis-amarillo-01\.png/i },
  { file: 'milenium.png', pattern: /casco-seguridad-milenium-full-brim-con-slot-amarillo-01\.PNG|milenium.*01\.png/i },
  { file: 'milenium_class.png', pattern: /casco-seguridad-milenium-class-slot-blanco.*01\.png/i },
  { file: 'bone.png', pattern: /bone-brasil-azul.*01\.png/i },

  // Auditiva
  { file: 'quantum.png', pattern: /proteccion-auditiva-quantum-03\.png/i },
  { file: 'quantum_foam.png', pattern: /protector-auditivo-quantum-foam-rd-con-cordel-01\.png/i },
  { file: 'l320v.png', pattern: /proteccion-auditiva-l320-vincha-001\.PNG/i },
  { file: 'l340v.png', pattern: /proteccion-auditiva-l340-vincha-001\.PNG/i },
  { file: 'l360v.png', pattern: /proteccion-auditiva-l360-vincha|l360-casco-001\.png/i },
  { file: 'l320c.png', pattern: /proteccion-auditiva-l320-casco-001\.png/i },
  { file: 'l340c.png', pattern: /proteccion-auditiva-l340-casco-001\.PNG/i },
  { file: 'l360c.png', pattern: /proteccion-auditiva-l360-casco-001\.png/i },
  { file: 'alternative.png', pattern: /alternative-clean-vincha-001/i },
  { file: 'new_alternative.png', pattern: /new-alternative-01\.png/i },

  // Visual
  { file: 'argon.png', pattern: /anteojo-seguridad-argon-amarillo-01\.PNG/i },
  { file: 'argon_elite.png', pattern: /anteojo-seguridad-argon-elite-amarillo-01\.png|argon-elite-flex.*01\.png/i },
  { file: 'ecoline.png', pattern: /anteojo-seguridad-ecoline|argon-amarillo-01/i },
  { file: 'neon.png', pattern: /anteojo-seguridad-neon|argon-amarillo-01/i },
  { file: 'mig.png', pattern: /anteojo-seguridad-mig|argon-elite-flex.*01\.png/i },
  { file: 'eco_sport.png', pattern: /anteojo-seguridad-eco-sport|argon-elite-flex.*01\.png/i },
  { file: 'new_classic.png', pattern: /anteojo-seguridad-new-classic|argon-amarillo-01/i },
  { file: 'aviator.png', pattern: /antiparra-seguridad-aviator.*01\.png/i },

  // Facial
  { file: 'bolha.png', pattern: /proteccion-facial-burbuja-amarillo-001\.png/i },
  { file: 'facial_plano.png', pattern: /cronos_kids_1\.png|plano/i },
  { file: 'facial_tela.png', pattern: /proteccion-facial-malla-forestal-001\.png/i },
  { file: 'facial_cilindrico.png', pattern: /cronos_kids_2\.png|cilindrico/i },

  // Respiratória BLS e Libus
  { file: 'bls_5600.png', directId: '1TIfCg5w4UtszMj3dAgyfF3BZFu7tmjOP' },
  { file: 'bls_5700.png', directId: '16loNWgz3CmYu5Y9uymuUvtNOJe4a9-1P' },
  { file: 'bls_4000_r.png', directId: '1DTK1_XXVqWaQzCuqg53pkYPzy3u_Il1u' },
  { file: 'bls_4000_s.png', directId: '10NlV2E4obZttdP-fQQYSz3tCEdbcwg2t' },
  { file: 'bls_211.png', directId: '1IEpQwsfeTTu_-jE315-OSgwTPHcSCKtv' },
  { file: 'bls_213.png', directId: '1vgjR4UyC9hfZoWrBpJevLnMd0AeL2To1' },
  { file: 'bls_222.png', directId: '1P6FaxWi1sg9hZV5econPt8Kx67_7Y-S-' },
  { file: 'bls_243.png', directId: '1v5eW3Fj6zcuyLdni8D7UHOIS4YaBcI5h' },
  { file: 'bls_244.png', directId: '1G3zHN65W3AzCKB3jL8hhnf_tXl6hveTx' },
  { file: 'bls_zer0.png', directId: '1MqGKQ_ncGE0qbCdjRChkkf1vclZYq3U-' },
  { file: 'bls_502.png', directId: '1WvPCvc8Pe3R_E5TjJLX0gVbKqHeldKHX' },
  { file: 'bls_102v.png', directId: '10TZIf8OmpK6KDf196RnQeoFdXCeKxhfB' }
];

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(destPath).size;
        console.log(`✓ Baixado: ${path.basename(destPath)} (${(size/1024).toFixed(1)} KB)`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Erro ao baixar ${destPath}:`, err.message);
      resolve();
    });
  });
}

async function downloadAll() {
  console.log('--- Baixando todas as fotos oficiais do Odoo para pasta local frontend/public/products ---');

  for (const item of LOCAL_PRODUCT_PHOTOS) {
    let url = '';
    if (item.directId) {
      url = `https://lh3.googleusercontent.com/d/${item.directId}=w800`;
    } else if (item.pattern) {
      const match = photos.find(p => item.pattern.test(p.fileName));
      if (match) {
        url = match.url;
      }
    }

    if (url) {
      const targetPath = path.join(dir, item.file);
      await downloadFile(url, targetPath);
    }
  }

  console.log('Download geral concluído.');
}

downloadAll();
