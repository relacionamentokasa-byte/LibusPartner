import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const technicalDescriptions: Record<string, { caNumber?: string; internalCode?: string; description: string }> = {
  // 1. CAPACETES
  'Genesis': {
    caNumber: '36099',
    internalCode: '900010',
    description: 'Capacete de segurança em polietileno de alta densidade (PEAD), Classe B (dielétrico até 20.000V). Suspensão têxtil de 6 pontos com absorvedor de energia e ajuste rápido por catraca ou pino. Fendas laterais para acoplamento de protetores auditivos e faciais.'
  },
  'Milienium Class': {
    caNumber: '35735',
    internalCode: '900020',
    description: 'Capacete de segurança industrial Classe B com design ergonômico e perfil baixo para trabalhos em espaços confinados e altura. Suspensão com almofada de conforto para nuca e fita jugular de 3 pontos acoplada.'
  },
  'Andes': {
    caNumber: '42314',
    internalCode: '900030',
    description: 'Capacete de segurança para alpinismo industrial, resgate e trabalho em altura (NBR 8221 / EN 397 / EN 12492). Casco em ABS de alta resistência com ventilação regulável, jugular de 4 pontos e suporte integrado para lanterna frontal.'
  },

  // 2. ÓCULOS DE SEGURANÇA
  'Argon': {
    caNumber: '35764',
    internalCode: '901201',
    description: 'Óculos de segurança com design esportivo e moderno. Lente única em policarbonato de alta resistência com curvatura de base 8 para proteção periférica total. Tratamento anti-risco e anti-embaçante (Anti-Fog), proteção 99,9% UV.'
  },
  'Argon Elite': {
    caNumber: '35765',
    internalCode: '901202',
    description: 'Óculos de proteção premium com hastes flexíveis em co-injeção de borracha macia e ponte nasal anatômica siliconada. Classe Óptica 1 sem distorção visual para longas jornadas de trabalho.'
  },
  'Ecoline': {
    caNumber: '35760',
    internalCode: '901100',
    description: 'Óculos de proteção ultraleve e econômico com lente panorâmica de policarbonato, hastes ventiladas e ampla cobertura frontal e lateral contra impacto de partículas volantes multidirecionais.'
  },
  'Neon': {
    caNumber: '35768',
    internalCode: '901300',
    description: 'Óculos com armação contemporânea, hastes com regulagem angular e longitudinal de 4 estágios para ajuste personalizado a qualquer anatomia facial. Lentes com filtro UV 400.'
  },
  'MIG': {
    caNumber: '35770',
    internalCode: '901400',
    description: 'Óculos de segurança com vedação perimetral em espuma EVA macia removível, ideal para ambientes com alta concentração de poeira e partículas em suspensão. Hastes intercambiáveis com fita elástica ajustável.'
  },
  'Eco Sport': {
    caNumber: '35772',
    internalCode: '901500',
    description: 'Óculos com desenho esportivo envolvente, hastes aerodinâmicas com perfurações para ventilação e redução de embaçamento em postos de trabalho de alta temperatura e umidade.'
  },
  'New Classic': {
    caNumber: '35762',
    internalCode: '901050',
    description: 'Design clássico de armação integral com proteções laterais integradas e perfurações para circulação de ar. Oferece alta robustez mecânica para trabalhos de usinagem, caldeiraria e montagem industrial.'
  },

  // 3. PROTETORES AUDITIVOS (PLUG)
  'QUANTUM': {
    caNumber: '35298',
    internalCode: '902100',
    description: 'Protetor auditivo tipo plug confeccionado em silicone/elastômero termoplástico grau médico, hipoalergênico, com 3 flanges circulares cônicas para vedação perfeita no canal auditivo (NRRsf 15 dB). Acompanha cordão e estojo higiênico.'
  },

  // 4. ABAFADORES DE RUÍDO
  'L320V': {
    caNumber: '35740',
    internalCode: '903100',
    description: 'Protetor auditivo circum-auricular tipo concha com haste metálica flexível sobre a cabeça. Conchas em ABS preenchidas com espuma de alta densidade e almofadas macias (NRRsf 18 dB). Ideal para níveis médios de ruído.'
  },
  'L340V': {
    caNumber: '35741',
    internalCode: '903200',
    description: 'Abafador de ruído de alta atenuação (NRRsf 22 dB) com arco duplo superior ventilado que reduz a pressão no topo da cabeça. Conchas com tecnologia de dupla câmara de atenuação acústica.'
  },
  'L360V': {
    caNumber: '35742',
    internalCode: '903300',
    description: 'Abafador circum-auricular para máxima atenuação em ambientes severos (NRRsf 26 dB). Almofadas ultra-confortáveis preenchidas com combinação líquida/espuma para vedação acústica sem desconforto.'
  },
  'L320C': {
    caNumber: '35743',
    internalCode: '903150',
    description: 'Protetor auditivo tipo concha projetado para acoplamento direto nas fendas laterais de capacetes de segurança Libus Genesis/Milenium (NRRsf 16 dB). Haste de acoplamento ajustável em 3 posições operacionais.'
  },
  'L340C': {
    caNumber: '35744',
    internalCode: '903250',
    description: 'Abafador acoplável de alto desempenho (NRRsf 21 dB) para capacete. Braços de acoplamento robustos que permitem bascular as conchas para trás da nuca quando fora da área de risco acústico.'
  },
  'L360C': {
    caNumber: '35745',
    internalCode: '903350',
    description: 'Abafador acoplável para capacete de extrema atenuação acústica (NRRsf 25 dB). Desenvolvido para aeroportos, usinas hidrelétricas, fundições e britadores.'
  },

  // 5. PROTETORES FACIAIS
  'Facial Bolha': {
    caNumber: '35750',
    internalCode: '904100',
    description: 'Protetor facial com visor esférico de 2mm em policarbonato virgem moldado por injeção. Geometria bolha oferece proteção integral queixo-têmpora e ampla visão sem distorções periféricas contra impacto de partículas (ANSI Z87.1).'
  },
  'Facial Plano': {
    caNumber: '35751',
    internalCode: '904110',
    description: 'Visor facial plano em policarbonato flexível com borda de reforço em alumínio moldável. Excelente proteção frontal contra projeção de partículas e respingos químicos.'
  },
  'Facial Tela': {
    caNumber: '35752',
    internalCode: '904120',
    description: 'Protetor facial com tela de malha de aço anodizado de alta densidade. Projetado especialmente para motosserristas, roçadores e corte florestal, garantindo máxima ventilação e resistência a impactos de gravetos e pedras.'
  },
  'Facial Cilindrico': {
    caNumber: '35753',
    internalCode: '904130',
    description: 'Visor cilíndrico de alta resistência com campo visual vertical expandido, compatível com o sistema basculante para capacetes ou carneiras com catraca Libus.'
  },

  // 6. MÁSCARAS E RESPIRADORES
  'Semifacial 9000 (TPE)': {
    caNumber: '44210',
    internalCode: '905100',
    description: 'Respirador purificador de ar semifacial confeccionado em elastômero termoplástico (TPE) antialérgico e leve. Conexão tipo baioneta de engate rápido, válvula de exalação MaxFlow que dissipa calor e umidade, tirante de 4 pontos com presilha para pescoço.'
  },
  'Semifacial 9000 Silicone': {
    caNumber: '44211',
    internalCode: '905150',
    description: 'Respirador semifacial em silicone cirúrgico de alta maciez e durabilidade. Mantém a vedação e flexibilidade mesmo em temperaturas extremas de frio ou calor. Alta resistência química e fácil higienização.'
  },
  'Facial Inteira 9000': {
    caNumber: '44220',
    internalCode: '905200',
    description: 'Máscara facial inteira com visor panorâmico de policarbonato classe óptica 1 resistente a impacto e riscos. Diafragma de voz integrado para comunicação clara no posto de trabalho e tirante de 6 pontos para vedação hermética.'
  },

  // 7. CARTUCHOS E FILTROS
  'Cartucho G01 Vapores Orgânicos': {
    caNumber: '44230',
    internalCode: '905301',
    description: 'Cartucho químico classe 1 com carvão ativado de alta adsorção para proteção contra vapores orgânicos (solventes, tintas, hidrocarbonetos) até 1.000 ppm. Encaixe baioneta com perfil recuado para melhor distribuição de peso e campo de visão.'
  },
  'Cartucho G02 Gases Ácidos': {
    caNumber: '44231',
    internalCode: '905302',
    description: 'Cartucho químico classe 1 com carvão ativado quimicamente impregnado para proteção contra gases ácidos (cloro, ácido clorídrico, dióxido de enxofre, sulfeto de hidrogênio e dióxido de cloro).'
  },
  'Cartucho G03 VO/GA Combinado': {
    caNumber: '44232',
    internalCode: '905303',
    description: 'Cartucho químico combinado para proteção simultânea contra Vapores Orgânicos e Gases Ácidos (VO/GA). Ideal para indústrias químicas, farmacêuticas, papel & celulose e galvanoplastia.'
  },
  'Filtro P3 Alta Eficiência': {
    caNumber: '44240',
    internalCode: '905400',
    description: 'Filtro mecânico encapsulado para partículas altamente tóxicas e poeiras perigosas (P3 / P100 - eficiência mínima de 99,95%). Resistente a umidade e respingos d’água (NBR 13697).'
  },
  'Filtro P3 com Alívio de VO': {
    caNumber: '44241',
    internalCode: '905410',
    description: 'Filtro para partículas P3 de alta eficiência (99,95%) combinado com camada de carvão ativado para alívio de odores incômodos de vapores orgânicos em níveis abaixo do Limite de Tolerância (LT).'
  }
};

async function run() {
  console.log('--- Atualizando descritivos técnicos oficiais Libus ---');
  let updatedCount = 0;

  for (const [nameKey, data] of Object.entries(technicalDescriptions)) {
    const prod = await prisma.libusProduct.findFirst({
      where: { name: { contains: nameKey } }
    });

    if (prod) {
      await prisma.libusProduct.update({
        where: { id: prod.id },
        data: {
          description: data.description,
          caNumber: data.caNumber || prod.caNumber,
          internalCode: data.internalCode || prod.internalCode
        }
      });
      console.log(`[OK] ${prod.name} -> CÓD: ${data.internalCode} | CA: ${data.caNumber}`);
      updatedCount++;
    } else {
      console.log(`[NÃO ENCONTRADO]: ${nameKey}`);
    }
  }

  console.log(`\nAtualização concluída: ${updatedCount} produtos enriquecidos com sucesso!`);
  await prisma.$disconnect();
}

run();
