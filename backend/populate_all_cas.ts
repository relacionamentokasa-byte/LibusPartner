import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeamento oficial de C.A.s e Códigos Internos da linha Libus & BLS
const LIBUS_CA_MAP: Record<string, { ca: string; code: string }> = {
  // Capacetes
  'genesis': { ca: '36099', code: '901380' },
  'andes': { ca: '49941', code: '902140' },
  'milenium': { ca: '35735', code: '900210' },
  'milienium class': { ca: '35735', code: '900220' },
  'capacete genesis': { ca: '36099', code: '901380' },
  'capacete andes': { ca: '49941', code: '902140' },
  'capacete milenium': { ca: '35735', code: '900210' },
  'capacete milienium': { ca: '35735', code: '900220' },

  // Óculos
  'argon': { ca: '35764', code: '901720' },
  'argon elite': { ca: '35764', code: '901730' },
  'ecoline': { ca: '35765', code: '900890' },
  'neon': { ca: '35766', code: '901650' },
  'mig': { ca: '35767', code: '901810' },
  'eco sport': { ca: '35768', code: '901740' },
  'new classic': { ca: '35769', code: '900540' },

  // Protetores Auditivos (Plugues & Abafadores)
  'quantum': { ca: '35332', code: '901510' },
  'l320v': { ca: '35334', code: '900610' },
  'l340v': { ca: '35335', code: '900620' },
  'l360v': { ca: '35336', code: '900630' },
  'l320c': { ca: '35337', code: '900640' },
  'l340c': { ca: '35338', code: '900650' },
  'l360c': { ca: '35339', code: '900660' },

  // Proteção Facial
  'facial bolha': { ca: '36001', code: '901230' },
  'facial plano': { ca: '36002', code: '901240' },
  'facial tela': { ca: '36003', code: '901250' },
  'facial cilindrico': { ca: '36004', code: '901260' },

  // Proteção Respiratória Libus & BLS
  'semifacial 9000 (tpe)': { ca: '44522', code: '902820' },
  'semifacial 9000 silicone': { ca: '44521', code: '902810' },
  'facial inteira 9000': { ca: '44523', code: '902830' },
  'máscara facial completa bls 5600 (tpe)': { ca: '44523', code: '902831' },
  'máscara facial completa bls 5700 (silicone)': { ca: '44524', code: '902832' },
  'máscara facial completa bls 5150 (rd40)': { ca: '44520', code: '902833' },
  'máscara semifacial bls 4000 next s (silicone)': { ca: '44519', code: '902840' },
  'máscara semifacial bls 4000 next r (tpe)': { ca: '44518', code: '902841' },
  'respirador dobrável bls 502 (pff2 sem válvula)': { ca: '41517', code: '902710' },
  'respirador dobrável bls 512 (pff2 com válvula)': { ca: '41518', code: '902720' },
  'respirador concha bls 102v (pff2 com válvula)': { ca: '41519', code: '902730' },
  'respirador carvão ativado bls 680 next (pff2 carvão)': { ca: '41520', code: '902740' },
  'respirador alta performance bls zer0 30 (pff3 r d)': { ca: '41521', code: '902750' },
  'respirador alta performance bls zer0 32c fr (pff3 solda/carvão)': { ca: '41522', code: '902760' }
};

// Mapeamento oficial de C.A.s dos principais concorrentes de mercado
const COMPETITOR_CA_MAP: Record<string, string> = {
  // Capacetes
  'h-700': '29638',
  'v-gard': '498',
  'avant': '34414',
  'diamond v': '35983',
  'falcon': '41144',
  'capacete 2001': '14798',
  'classe b aba frontal': '12322',
  'capacete plastcor com jugular': '31469',
  'capacete prosafety aba frontal': '29792',

  // Óculos
  'jaguar': '10346',
  'leopardo': '11268',
  'fuji 250': '34082',
  'óculos ss2': '35156',
  'óculos summer': '35268',
  'stx': '40906',
  'spectra 2000': '11447',
  'fênix': '9722',
  'phoenix': '9722',
  'brava 200': '34082',
  'work': '39846',
  'cayman': '11447',
  'jamaica': '15649',
  'aerial': '9722',
  'sunbird': '18064',
  'evolution': '11447',
  'parati': '15649',
  'apollo': '9722',
  'sparrow': '18064',
  'uvex vapor ii': '18819',
  'infinit': '11447',
  'veneza': '15649',
  'igor': '9722',
  'uvex skyper': '18819',
  'spyder': '11447',
  'tahiti': '15649',
  'altimiter': '18064',
  'albatross': '18064',
  'imola': '40906',
  'everest ampla visão': '34082',
  'ampla visão 2790': '20772',
  'harrier': '18064',
  'swat': '40906',
  'uvex stealth ampla visão': '19072',
  'supervision': '11447',
  'águia': '9722',

  // Protetores Auditivos (Plugs & Abafadores)
  'pomp plus': '5674',
  'plug maxi royal silicone': '14472',
  'plug k-70 silicone': '14472',
  'spot plug silicone': '28534',
  'pomp millenium': '19522',
  'pomp muffler': '29792',
  'mark v': '27971',
  'interlagos light': '36433',
  'shell pro 300': '41940',
  'howard leight th1/th2': '11425',
  'peltor h9a': '12189',
  'xls': '27972',
  'peltor h6a': '12187',
  'interlagos 2': '36433',
  'magny-cours 2': '36434',
  'inter pro ultra': '28534',
  'hpe': '27973',
  'peltor h10a': '12188',
  'peltor h10p3e acoplado': '12188',
  'kit hpe acoplado': '27973',
  'pomp muffler acoplado': '29792',
  'inter pro acoplado': '36433',
  'shell pro 400 acoplado': '41940',
  'shell max acoplado': '41940',
  'kit xls acoplado': '27972',
  'peltor h6p3e acoplado': '12187',
  'kit mark v acoplado': '27971',
  'peltor h9p3e acoplado': '12189',
  'peltor h9p3e-02 acoplado': '12189',

  // Proteção Facial
  'protetor facial v-gard 190': '17014',
  'protetor facial w96 esférico': '9702',
  'bionic shield': '18242',
  'protetor facial cg bolha': '15019',
  'protetor facial bolha camper': '34415',
  'protetor facial wp96 cilíndrico': '9702',
  'visor policarbonato i-1': '34082',
  'protetor facial cg 500': '15019',
  'protetor facial tela de aço': '15019',

  // Proteção Respiratória
  'série 6200 semifacial': '4115',
  'série 7502 silicone': '12011',
  'série 6800 facial inteira': '7298',
  'máscara facial inteira série 6800': '7298',
  'mascara advantage 3000 twin': '14791',
  '5400 series full facepiece': '15649',
  't-9550 silicone': '39700',
  'air ffs990 silicone': '40120',
  '7800 silicone': '7298',
  'respirador facial completo 3m fx ff-400': '31518',
  'ru6500 full facepiece silicone': '15649',
  'ultravue rd40 cartucho único': '8901',
  'respirador semifacial reutilizável 3m hf800': '44040',
  '7700 series half mask silicone': '1055',
  'respirador semifacial t-9500 silicone': '39700',
  'air s950 silicone': '40120',
  'respirador advantage 420 silicone': '25560',
  'respirador semifacial reutilizável 3m 6000': '4115',
  'respirador peça semifacial 7600': '1055',
  'respirador reutilizável 2402': '11162',
  'respirador reutilizável elipse': '36566',
  'hm500 drop-down elastômero': '1055',
  'air s900 elastômero': '40120',
  'respirador advantage 200 ls': '8558',

  // Descartáveis PFF2 / PFF3
  'respirador descartável 3m aura 9320+br pff2': '30592',
  '2200 n95 respirador para partículas': '11268',
  'df300 n95 flatfold disposable respirator': '38520',
  'd801 pff2 não reutilizável': '38901',
  '1730 n95 disposable': '38902',
  'respirador descartável 3m aura 9322+ pff2 valvulado': '30593',
  '2300 n95 com válvula de exalação': '11268',
  'dc301 n95 valvulado': '38520',
  'd802 pff2 com válvula': '38901',
  'respirador descartável concha 3m 8822 pff2': '5657',
  '1740 n95 concha': '38902',
  'respirador descartável 3m 8023 / 8577 carvão ativado': '9920',
  '2400 n95 carvão ativado': '11268',
  'd803 carvão ativado': '38901',
  'respirador descartável 3m aura 9332+ pff3': '30594',
  'pff3 - 6925': '38902',
  'respirador 3m 8214 solda / n95': '12461',
  '2740 r95 / 2310 n99': '11268',
  '2280 p100 air safety': '40120'
};

async function populateAllCAs() {
  console.log('--- Iniciando Atualização Geral de C.A.s e Códigos no Banco de Dados ---');

  // 1. Atualizar Produtos Libus
  const libusProducts = await prisma.libusProduct.findMany();
  let updatedLibus = 0;

  for (const prod of libusProducts) {
    const key = prod.name.trim().toLowerCase();
    const match = LIBUS_CA_MAP[key];

    if (match) {
      await prisma.libusProduct.update({
        where: { id: prod.id },
        data: {
          caNumber: match.ca,
          internalCode: match.code
        }
      });
      updatedLibus++;
      console.log(`✓ Libus: ${prod.name} -> CA ${match.ca} | Cód ${match.code}`);
    }
  }

  // Concorrentes não recebem C.A. neste sistema.
  const clearedCompetitors = await prisma.competitorProduct.updateMany({
    where: { caNumber: { not: null } },
    data: { caNumber: null }
  });

  console.log(`\n========================================`);
  console.log(`Total Libus atualizados com CA e Código: ${updatedLibus}/${libusProducts.length}`);
  console.log(`C.A.s de concorrentes removidos: ${clearedCompetitors.count}`);
  console.log(`Produtos Libus sem correspondência exata permanecem pendentes.`);
  console.log(`========================================`);
}

populateAllCAs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
