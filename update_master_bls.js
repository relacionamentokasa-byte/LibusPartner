const fs = require('fs');
const xlsx = require('./backend/node_modules/xlsx');

const masterFilePath = 'C:/Users/Ariel Matos/Desktop/PROJETO LIBUS/BASE_MESTRE_DEPARA_LIBUS_PARTNER_2026.xlsx';
const wb = xlsx.readFile(masterFilePath);
const currentDePara = xlsx.utils.sheet_to_json(wb.Sheets['DE_PARA_CONSOLIDADO']);
const currentCriterios = xlsx.utils.sheet_to_json(wb.Sheets['CRITERIOS_TECNICOS']);

// Novas linhas De-Para completas da Linha BLS
const blsDeParaRows = [
  // --- PEÇAS FACIAIS INTEIRAS (REUTILIZÁVEIS) ---
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5600 (TPE)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Máscara Facial Inteira Série 6800',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5600 (TPE)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Mascara Advantage 3000 TWIN',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5600 (TPE)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': '5400 Series Full Facepiece',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5600 (TPE)',
    'Fabricante Concorrente': 'Tayco',
    'Produto Concorrente': 'T-9550 Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5600 (TPE)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'AIR FFS990 Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5600 (TPE)',
    'Fabricante Concorrente': 'Protech',
    'Produto Concorrente': '7800 Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5700 (Silicone)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Facial Completo 3M FX FF-400',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5700 (Silicone)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'RU6500 Full Facepiece Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Facial Completa BLS 5150 (RD40)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Ultravue RD40 Cartucho Único',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 3)'
  },

  // --- PEÇAS SEMIFACIAIS (REUTILIZÁVEIS) ---
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next S (Silicone)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Semifacial Reutilizável 3M HF800',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next S (Silicone)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': '7700 Series Half Mask Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next S (Silicone)',
    'Fabricante Concorrente': 'Tayco',
    'Produto Concorrente': 'Respirador Semifacial T-9500 Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next S (Silicone)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'AIR S950 Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next S (Silicone)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Respirador Advantage 420 Silicone',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next R (TPE)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Semifacial Reutilizável 3M 6000',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next R (TPE)',
    'Fabricante Concorrente': 'Protech',
    'Produto Concorrente': 'Respirador Peça Semifacial 7600',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next R (TPE)',
    'Fabricante Concorrente': 'Alltec',
    'Produto Concorrente': 'Respirador Reutilizável 2402',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next R (TPE)',
    'Fabricante Concorrente': 'GVS',
    'Produto Concorrente': 'Respirador Reutilizável Elipse',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next R (TPE)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'HM500 Drop-Down Elastômero',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next R (TPE)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'AIR S900 Elastômero',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Máscara Semifacial BLS 4000 Next R (TPE)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Respirador Advantage 200 LS',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 5)'
  },

  // --- CARTUCHOS QUÍMICOS E FILTROS B-LOCK ---
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 211 (A2)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': '6001 - Cartucho Vapor Orgânico 3M',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 211 (A2)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '7100 Vapores Orgânicos',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 211 (A2)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'N 75001L Vapores Orgânicos',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 211 (A2)',
    'Fabricante Concorrente': 'Gerson',
    'Produto Concorrente': 'G01 Organic Vapor Cartridge',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 211 (A2)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'AIR F600V - A1',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 211 (A2)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '815355 - Filtros Químicos Advantage GMA',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 213 (ABEK1)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': '6003 - Cartucho Vapores Orgânicos e Gases Ácidos 3M',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 213 (ABEK1)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '7300 VO/GA Gases Ácidos',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 213 (ABEK1)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'N75003L Vapores Orgânicos e Gases Ácidos',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 213 (ABEK1)',
    'Fabricante Concorrente': 'Gerson',
    'Produto Concorrente': 'G03 Organic Vapor / Acid Gas',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 213 (ABEK1)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'AIR F600VG (A1E1)',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 213 (ABEK1)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '815357 - Filtros Químicos Advantage GMC',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 244 (K2)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': '6004 - Cartucho Amoníaco / Metilamina 3M',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 244 (K2)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '7400 Amoníaco / Metilamina',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 244 (K2)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'N75004L Ammonia / Methylamine',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 244 (K2)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '815358 - Cartucho Advantage GMD Amoníaco',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 243 (ABEK2)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': '6006 - Cartucho Multi Gas / Vapores 3M',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 243 (ABEK2)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '7600 Multi-Gas/Vapor Smart',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 243 (ABEK2)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': '75SCL Defender Multi-Gas',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Químico BLS 243 (ABEK2)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '815359 - Filtro Químico Advantage GMD / Multi',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 7)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Mecânico Plano BLS 201-3 (P3 R)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Filtro para Partículas 3M 2091 P100 / P3',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Mecânico Plano BLS 201-3 (P3 R)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': 'Disco Filtro 7940 P100',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Mecânico Plano BLS 201-3 (P3 R)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'Honeywell N Series P100 Pancake',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Mecânico Plano BLS 201-3 (P3 R)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '818342 Flexi-Filter P100',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Mecânico Plano BLS 201-3C (P3 R Carvão)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Filtro para Partículas 3M 2097 P100 Alívio VO/GA',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Mecânico Plano BLS 201-3C (P3 R Carvão)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '818343 Flexi-Filter P100 Alívio Vapores Orgânicos',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Partículas Encapsulado BLS 202 (P3 R)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Filtro para Partículas 3M 7093 P100 Magenta',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Partículas Encapsulado BLS 202 (P3 R)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Cartucho LOW PROFILE P100 815369',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 8)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Combinado BLS 221 (A2P3 R)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Cartucho/Filtro 3M 60921 P100 Vapores Orgânicos',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 9)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Combinado BLS 221 (A2P3 R)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '815362 - Cartucho GMA-P100 ADV. 200',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 9)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Combinado BLS 222 (ABEK1P3 R)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Cartucho Dual 60926 Multigases e Partículas P100',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 9)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Combinado BLS 222 (ABEK1P3 R)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': '75SCP100L Defender P100 Cartridge',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 9)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Combinado BLS 222 (ABEK1P3 R)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': '815366 - Filtros Quím-MEC ADVANTAGE GME-P100',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 9)'
  },

  // --- FILTROS UNIVERSAIS RD40 ---
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Universal RD40 BLS 430 (A2P3 R)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Filtro Série 93 A2P3 PlexTec (D1040000)',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 10)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Universal RD40 BLS 414 (ABEK2P3 R)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Filtro Antigás Série 93 ABEK2P3 Hg (D1051700)',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 10)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Cartuchos e Filtros',
    'Produto Libus': 'Filtro Universal RD40 BLS 412 (AX)',
    'Fabricante Concorrente': 'MSA',
    'Produto Concorrente': 'Filtro Antigás Série 90 Classe AX',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 11)'
  },

  // --- RESPIRADORES DESCARTÁVEIS PFF2 / PFF3 ---
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 502 (PFF2 Sem Válvula)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Descartável 3M Aura 9320+BR PFF2',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 502 (PFF2 Sem Válvula)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '2200 N95 Respirador para Partículas',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 502 (PFF2 Sem Válvula)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'DF300 N95 Flatfold Disposable Respirator',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 502 (PFF2 Sem Válvula)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'D801 PFF2 Não Reutilizável',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 502 (PFF2 Sem Válvula)',
    'Fabricante Concorrente': 'Gerson',
    'Produto Concorrente': '1730 N95 Disposable',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 512 (PFF2 Com Válvula)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Descartável 3M Aura 9322+ PFF2 Valvulado',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 512 (PFF2 Com Válvula)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '2300 N95 com Válvula de Exalação',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 512 (PFF2 Com Válvula)',
    'Fabricante Concorrente': 'Honeywell',
    'Produto Concorrente': 'DC301 N95 Valvulado',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Dobrável BLS 512 (PFF2 Com Válvula)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'D802 PFF2 Com Válvula',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Concha BLS 102V (PFF2 Com Válvula)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Descartável Concha 3M 8822 PFF2',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Concha BLS 102V (PFF2 Com Válvula)',
    'Fabricante Concorrente': 'Gerson',
    'Produto Concorrente': '1740 N95 Concha',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 13)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Carvão Ativado BLS 680 Next (PFF2 Carvão)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Descartável 3M 8023 / 8577 Carvão Ativado',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Carvão Ativado BLS 680 Next (PFF2 Carvão)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '2400 N95 Carvão Ativado',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Carvão Ativado BLS 680 Next (PFF2 Carvão)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': 'D803 Carvão Ativado',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Alta Performance BLS Zer0 30 (PFF3 R D)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador Descartável 3M Aura 9332+ PFF3',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Alta Performance BLS Zer0 30 (PFF3 R D)',
    'Fabricante Concorrente': 'Gerson',
    'Produto Concorrente': 'PFF3 - 6925',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Alta Performance BLS Zer0 32C FR (PFF3 Solda/Carvão)',
    'Fabricante Concorrente': '3M',
    'Produto Concorrente': 'Respirador 3M 8214 Solda / N95',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Alta Performance BLS Zer0 32C FR (PFF3 Solda/Carvão)',
    'Fabricante Concorrente': 'Moldex',
    'Produto Concorrente': '2740 R95 / 2310 N99',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  },
  {
    'Família': 'Proteção Respiratória',
    'Categoria': 'Máscaras e Respiradores',
    'Produto Libus': 'Respirador Alta Performance BLS Zer0 32C FR (PFF3 Solda/Carvão)',
    'Fabricante Concorrente': 'Air Safety',
    'Produto Concorrente': '2280 P100 Air Safety',
    'Status De-Para': 'Homologado 1x1',
    'Origem': 'Catálogo Técnico BLS (Pág. 14)'
  }
];

const allDePara = [...currentDePara, ...blsDeParaRows];

const manufCountMap = new Map();
for (const row of allDePara) {
  const m = row['Fabricante Concorrente'];
  manufCountMap.set(m, (manufCountMap.get(m) || 0) + 1);
}

const allFabricantes = Array.from(manufCountMap.entries())
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({
    'Fabricante Homologado': name,
    'Total de Produtos Mapeados': count
  }));

const newWb = xlsx.utils.book_new();

const wsDePara = xlsx.utils.json_to_sheet(allDePara);
wsDePara['!cols'] = [
  { wch: 24 },
  { wch: 28 },
  { wch: 45 },
  { wch: 24 },
  { wch: 45 },
  { wch: 18 },
  { wch: 35 }
];
xlsx.utils.book_append_sheet(newWb, wsDePara, 'DE_PARA_CONSOLIDADO');

const wsFab = xlsx.utils.json_to_sheet(allFabricantes);
wsFab['!cols'] = [
  { wch: 30 },
  { wch: 28 }
];
xlsx.utils.book_append_sheet(newWb, wsFab, 'FABRICANTES_HOMOLOGADOS');

const wsCrit = xlsx.utils.json_to_sheet(currentCriterios);
wsCrit['!cols'] = [
  { wch: 28 },
  { wch: 60 },
  { wch: 15 },
  { wch: 15 },
  { wch: 12 }
];
xlsx.utils.book_append_sheet(newWb, wsCrit, 'CRITERIOS_TECNICOS');

xlsx.writeFile(newWb, masterFilePath);
console.log('✓ Planilha Mestre atualizada com sucesso!');
console.log('Total De-Para anterior:', currentDePara.length);
console.log('Pares BLS adicionados:', blsDeParaRows.length);
console.log('Novo total De-Para consolidado:', allDePara.length);
