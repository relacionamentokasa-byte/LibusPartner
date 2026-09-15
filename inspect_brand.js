const fs = require('fs');
const { createCanvas, loadImage } = (() => {
  try { return require('canvas'); } catch(e) { return {}; }
})();

// Vamos converter o PDF ou extrair imagens usando script nativo
console.log('Verificando arquivos do manual e logos...');
