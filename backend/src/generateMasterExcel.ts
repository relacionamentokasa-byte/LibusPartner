import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const originalFile = 'C:/Users/Ariel Matos/Desktop/Depara de Produtos Libus - 2024 -.xlsx';
const wbOriginal = xlsx.readFile(originalFile);

const manufacturerNormalize: Record<string, string> = {
  'M.S.A': 'MSA',
  'M.SA': 'MSA',
  'MSA': 'MSA',
  '3M': '3M',
  '3m': '3M',
  '3M- Peltor': '3M',
  '3M - Peltor': '3M',
  '3m - Peltor': '3M',
  '3M  PELTOR': '3M',
  'Delta Plus': 'Delta Plus',
  'Delta plus': 'Delta Plus',
  'DELTA PLUS': 'Delta Plus',
  'Steeflex': 'Steelflex',
  'Steelfekx': 'Steelflex',
  'Sthslflex': 'Steelflex',
  'Steelflex': 'Steelflex',
  'Kalipso': 'Kalipso',
  'KALYPSO': 'Kalipso',
  'Camper': 'Camper',
  'CAMPER': 'Camper',
  'Carbografite': 'Carbografite',
  'Danny': 'Danny',
  'Honeywell': 'Honeywell',
  'Honeywell (Uvex)': 'Honeywell',
  'Uvex': 'Honeywell',
  'Vicsa': 'Vicsa',
  'Ultramaster': 'Ultramaster',
  'Ledan': 'Ledan',
  'PlastCor': 'Plastcor',
  'Plastcor': 'Plastcor',
  'Prosafety': 'Prosafety',
  'SS2': 'Super Safety',
  'Summer Clean': 'Summer Clean',
  'MAXI ROYAL': 'Maxi Royal',
  'Elastobor': 'Elastobor',
  'TecMater': 'TecMater',
  'BSB': 'Steelflex' // Na planilha BSB é a distribuidora/fabricante do capacete Steelflex Falcon / BSB
};

const productCorrection: Record<string, string> = {
  // Capacetes
  'Ultramaster': 'Classe B Aba Frontal',
  'Ledan': 'Capacete 2001',
  'Plastcor': 'Capacete Plastcor com Jugular',
  'Prosafety': 'Capacete Prosafety Aba Frontal',
  'Camper': 'Avant',
  'V Gard M.S.A': 'V-Gard',
  'H700': 'H-700',
  'Diamond': 'Diamond V',
  'Steelflex': 'Falcon', // Modelo de capacete da Steelflex
  'Falcon': 'Falcon',

  // Óculos
  'Águia': 'Águia',
  'Supervision': 'Supervision',
  'Leopardo': 'Leopardo',
  '250': 'Fuji 250',
  'Fuji 250': 'Fuji 250',
  'Super Safety': 'Óculos SS2',
  'Super Safety ': 'Óculos SS2',
  'Pro Safety': 'Óculos Summer',
  'STX': 'STX',
  'Spectra 2000': 'Spectra 2000',
  'Jaguar': 'Jaguar',
  'Fenix': 'Fênix',
  'Phoenix': 'Phoenix',
  '200': 'Brava 200',
  'Brava 200': 'Brava 200',
  'Work': 'Work',
  'Cayman': 'Cayman',
  'Jamaica': 'Jamaica',
  'Aerial': 'Aerial',
  'Sunbird': 'Sunbird',
  'Evolution': 'Evolution',
  'Parati': 'Parati',
  'Apollo': 'Apollo',
  'Sparrow': 'Sparrow',
  'Vapor II': 'Uvex Vapor II',
  'Infinit': 'Infinit',
  'Veneza': 'Veneza',
  'Igor': 'Igor',
  'Skyper': 'Uvex Skyper',
  'Spyder': 'Spyder',
  'Tahiti': 'Tahiti',
  'Altimiter': 'Altimiter',
  'Albatross': 'Albatross',
  'Imola ': 'Imola',
  'Imola': 'Imola',
  'Everest': 'Everest Ampla Visão',
  'Everest ': 'Everest Ampla Visão',
  '2790': 'Ampla Visão 2790',
  'HARRIER': 'Harrier',
  'SWAT': 'SWAT',
  'Stealth': 'Uvex Stealth Ampla Visão',
  'Stealth ': 'Uvex Stealth Ampla Visão',

  // Protetores Auditivos (Plug)
  'POMP PLUS': 'Pomp Plus',
  'Pomp Plus': 'Pomp Plus',
  'MAXI ROYAL': 'Plug Maxi Royal Silicone',
  'K-70': 'Plug K-70 Silicone',
  'SPOT': 'Spot Plug Silicone',
  'SPOT ': 'Spot Plug Silicone',
  'POMP MILENIUM': 'Pomp Millenium',
  'Pomp Millenium': 'Pomp Millenium',

  // Abafadores
  'Pomp Muffler': 'Pomp Muffler',
  'Pomp Muffler ': 'Pomp Muffler',
  'Pomp Muffler Acoplado': 'Pomp Muffler Acoplado',
  'MARK V': 'Mark V',
  'Mark V': 'Mark V',
  'INTERLAGOS LIGHT': 'Interlagos Light',
  'Shell Pro 300': 'Shell Pro 300',
  'TH1 / TH2': 'Howard Leight TH1/TH2',
  'H9 a2': 'Peltor H9A',
  'H6A': 'Peltor H6A',
  'H6 ': 'Peltor H6A',
  'H6': 'Peltor H6A',
  'H9A': 'Peltor H9A',
  'INTERLAGOS2': 'Interlagos 2',
  'MAGNY COURS 2': 'Magny-Cours 2',
  'Inter Pro Ultra': 'Inter Pro Ultra',
  'H10A': 'Peltor H10A',
  'HPE': 'HPE',
  'Peltor H10P3E': 'Peltor H10P3E Acoplado',
  'KIT HPE': 'Kit HPE Acoplado',
  'Inter Pro para Capacete': 'Inter Pro Acoplado',
  'Shell Pro 400': 'Shell Pro 400 Acoplado',
  'Shell Max': 'Shell Max Acoplado',
  'KIT XLS': 'Kit XLS Acoplado',
  'H6P3E': 'Peltor H6P3E Acoplado',
  'KIT MARKV': 'Kit Mark V Acoplado',
  'H9P3E': 'Peltor H9P3E Acoplado',
  'H9P3E-02': 'Peltor H9P3E-02 Acoplado',

  // Protetores Faciais
  'Facial M.SA': 'Protetor Facial V-Gard 190',
  'Facial Bolha 3M': 'Protetor Facial W96 Esférico',
  'Bionic Shield': 'Bionic Shield',
  'Carbografite': 'Protetor Facial CG Bolha',
  'Bolha Camper': 'Protetor Facial Bolha Camper',
  'Facial Plano 3M': 'Protetor Facial WP96 Cilíndrico',
  'Visor I-1': 'Visor Policarbonato I-1',
  'Carbografite CG': 'Protetor Facial CG 500',
  'Facial Tela': 'Protetor Facial Tela de Aço',
  'Protetor Facial Tela de Aço': 'Protetor Facial Tela de Aço'
};

function getFamilyAndCategory(sheetName: string) {
  const s = sheetName.toLowerCase();
  if (s.includes('capacete')) return { family: 'Proteção da Cabeça', category: 'Capacetes de Segurança' };
  if (s.includes('óculos') || s.includes('classic') || s.includes('explorer')) return { family: 'Proteção Visual', category: 'Óculos de Segurança' };
  if (s.includes('plug')) return { family: 'Proteção Auditiva', category: 'Protetores Auditivos (Plug)' };
  if (s.includes('abafador')) return { family: 'Proteção Auditiva', category: 'Abafadores de Ruído' };
  if (s.includes('facial')) return { family: 'Proteção Facial', category: 'Protetores Faciais' };
  return { family: 'Proteção Geral', category: 'EPIs Gerais' };
}

const deparaRows: any[] = [];
const criteriaRows: any[] = [];
const allManufacturersSet = new Set<string>();

wbOriginal.SheetNames.forEach(sheetName => {
  if (sheetName === 'Hoja24' || sheetName === 'Alternative') return;
  const sheet = wbOriginal.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  if (!data || data.length < 5) return;

  const { family, category } = getFamilyAndCategory(sheetName);

  let prodRowIdx = -1;
  let fabRowIdx = -1;

  for (let r = 0; r < Math.min(8, data.length); r++) {
    const row = data[r];
    if (row && typeof row[0] === 'string') {
      if (row[0].trim().toLowerCase().startsWith('produto')) prodRowIdx = r;
      if (row[0].trim().toLowerCase().startsWith('fabricante')) fabRowIdx = r;
    }
  }

  if (prodRowIdx === -1) return;
  const prodRow = data[prodRowIdx];
  const fabRow = fabRowIdx !== -1 ? data[fabRowIdx] : [];

  const libusProdName = String(prodRow[1] || '').trim();
  if (!libusProdName) return;

  for (let col = 2; col < prodRow.length; col++) {
    let compProdRaw = prodRow[col];
    if (compProdRaw === undefined || compProdRaw === null || compProdRaw === '') continue;
    compProdRaw = String(compProdRaw).trim();

    let compFabRaw = fabRow[col] ? String(fabRow[col]).trim() : '';
    let cleanFab = manufacturerNormalize[compFabRaw] || compFabRaw || 'Concorrente Homologado';
    let cleanProd = productCorrection[compProdRaw] || compProdRaw;

    allManufacturersSet.add(cleanFab);

    // Evitar pares idênticos duplicados entre abas (ex: Eco Sport vs MSA Altimiter que estava repetido na aba Eco Plus)
    const exists = deparaRows.some(
      r => r['Produto Libus'] === libusProdName &&
           r['Fabricante Concorrente'] === cleanFab &&
           r['Produto Concorrente'] === cleanProd
    );

    if (!exists) {
      deparaRows.push({
        'Família': family,
        'Categoria': category,
        'Produto Libus': libusProdName,
        'Fabricante Concorrente': cleanFab,
        'Produto Concorrente': cleanProd,
        'Status De-Para': 'Homologado 1x1',
        'Origem': `Planilha (Aba: ${sheetName})`
      });
    }
  }

  const startCrit = Math.max(prodRowIdx, fabRowIdx) + 2;
  for (let r = startCrit; r < data.length; r++) {
    const row = data[r];
    if (!row || !row[0] || String(row[0]).trim() === '' || String(row[0]).toLowerCase().startsWith('foto')) continue;
    const critName = String(row[0]).trim();
    criteriaRows.push({
      'Família': family,
      'Categoria': category,
      'Critério Técnico': critName,
      'Especificação Padrão Libus': row[1] ? String(row[1]).trim() : 'Conforme Norma',
      'Escala de Avaliação': '1 a 10 (Percepção Prática em Campo)'
    });
  }
});

// Adicionar Proteção Respiratória
const respiratoriaDePara = [
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Peças Faciais e Respiradores', 'Produto Libus': 'Semifacial 9000 (TPE)', 'Fabricante Concorrente': '3M', 'Produto Concorrente': 'Série 6200 Semifacial', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' },
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Peças Faciais e Respiradores', 'Produto Libus': 'Semifacial 9000 Silicone', 'Fabricante Concorrente': '3M', 'Produto Concorrente': 'Série 7502 Silicone', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' },
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Peças Faciais e Respiradores', 'Produto Libus': 'Facial Inteira 9000', 'Fabricante Concorrente': '3M', 'Produto Concorrente': 'Série 6800 Facial Inteira', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' },
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Cartuchos e Filtros', 'Produto Libus': 'Cartucho G01 Vapores Orgânicos', 'Fabricante Concorrente': '3M', 'Produto Concorrente': '6001 Vapores Orgânicos', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' },
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Cartuchos e Filtros', 'Produto Libus': 'Cartucho G02 Gases Ácidos', 'Fabricante Concorrente': '3M', 'Produto Concorrente': '6002 Gases Ácidos', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' },
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Cartuchos e Filtros', 'Produto Libus': 'Cartucho G03 VO/GA Combinado', 'Fabricante Concorrente': '3M', 'Produto Concorrente': '6003 VO/GA', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' },
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Cartuchos e Filtros', 'Produto Libus': 'Filtro P3 Alta Eficiência', 'Fabricante Concorrente': '3M', 'Produto Concorrente': '2091 P3 Particulados', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' },
  { 'Família': 'Proteção Respiratória', 'Categoria': 'Cartuchos e Filtros', 'Produto Libus': 'Filtro P3 com Alívio de VO', 'Fabricante Concorrente': '3M', 'Produto Concorrente': '2097 P3 Alívio de Odor', 'Status De-Para': 'Homologado 1x1', 'Origem': 'Catálogo Técnico de Respiradores' }
];

allManufacturersSet.add('3M');
respiratoriaDePara.forEach(r => deparaRows.push(r));

// Criar o arquivo mestre
const wbMaster = xlsx.utils.book_new();

const wsDePara = xlsx.utils.json_to_sheet(deparaRows);
xlsx.utils.book_append_sheet(wbMaster, wsDePara, 'DE_PARA_CONSOLIDADO');

const fabRows = Array.from(allManufacturersSet).sort().map(name => ({
  'Fabricante Homologado': name,
  'Total de Produtos Mapeados': deparaRows.filter(r => r['Fabricante Concorrente'] === name).length
}));
const wsFab = xlsx.utils.json_to_sheet(fabRows);
xlsx.utils.book_append_sheet(wbMaster, wsFab, 'FABRICANTES_HOMOLOGADOS');

const wsCriteria = xlsx.utils.json_to_sheet(criteriaRows);
xlsx.utils.book_append_sheet(wbMaster, wsCriteria, 'CRITERIOS_TECNICOS');

const outPath = 'C:/Users/Ariel Matos/Desktop/PROJETO LIBUS/BASE_MESTRE_DEPARA_LIBUS_PARTNER_2026.xlsx';
xlsx.writeFile(wbMaster, outPath);

console.log('Arquivo gerado com sucesso em: ' + outPath);
console.log('Total de Pares De-Para:', deparaRows.length);
console.log('Total de Fabricantes Únicos:', fabRows.length);
