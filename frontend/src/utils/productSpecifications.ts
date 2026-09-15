// Dicionário técnico oficial Libus & BLS para enriquecimento em tempo real das Fichas Técnicas
export interface ProductSpec {
  caNumber: string;
  internalCode: string;
  description: string;
  features: string[];
  standards: string[];
  applications: string[];
  packaging?: string;
}

export const productSpecsDictionary: Record<string, ProductSpec> = {
  // --- PROTEÇÃO DA CABEÇA ---
  genesis: {
    caNumber: '36099',
    internalCode: '901380',
    description: 'Capacete de segurança industrial Classe B injetado em polietileno de alta densidade (PEAD) virgem. Projetado para máxima dissipação de energia em impactos verticais e proteção dielétrica até 20.000V.',
    features: [
      'Casco anatômico balanceado com calha lateral para desvio de respingos e chuva',
      'Suspensão têxtil premium de 8 pontos com cinta amortecedora de duplo estiramento',
      'Catraca de ajuste milimétrico EasyClick de alta precisão com trava contínua',
      'Slot universal padrão 30mm para acoplamento de protetores auditivos e faciais Libus',
      'Tira jugular em tecido hipoalergênico com fixação de 3 pontos'
    ],
    standards: ['ABNT NBR 8221:2003 (Classe B)', 'ANSI/ISEA Z89.1-2014 Type 1 Class E', 'Certificado de Aprovação C.A. 36099 MTE'],
    applications: ['Construção civil pesada', 'Indústria metalúrgica e siderúrgica', 'Montagens industriais', 'Manutenção elétrica industrial (NR-10)', 'Mineração e logística'],
    packaging: 'Caixa master c/ 20 unidades'
  },
  andes: {
    caNumber: '46039',
    internalCode: '902140',
    description: 'Capacete de proteção para trabalho em altura (NR-35) e resgate em espaços confinados (NR-33). Casco sem aba frontal para visão vertical desobstruída de 180° e máxima mobilidade.',
    features: [
      'Casco ultracompacto em ABS virgem de alta absorção contra impactos multidirecionais',
      'Jugular reforçada de 4 pontas com fivela de engate rápido e proteção acolchoada para queixo',
      'Amortecedor interno de poliestireno expandido (EPS) com canais de ventilação termo-convectiva',
      'Clips em poliamida integrados para fixação firme de lanterna de cabeça',
      'Isolação dielétrica e proteção contra deformação lateral (LD)'
    ],
    standards: ['ABNT NBR 8221 / EN 12492 (Alpinismo & Altura)', 'NR-35 / NR-33', 'ANSI Z89.1 Type 1 Class C'],
    applications: ['Trabalho em altura (NR-35)', 'Acesso por corda e resgate técnico', 'Espaço confinado (NR-33)', 'Torres de energia e telecomunicações', 'Parques eólicos e montagens'],
    packaging: 'Caixa individual com bolsa protetora'
  },
  milenium: {
    caNumber: '35735',
    internalCode: '900210',
    description: 'Capacete de segurança industrial classe B com aba frontal pronunciada contra radiação solar e detritos. Suspensão com tecido absorvente e alta estabilidade para rotinas severas.',
    features: [
      'Aba frontal estendida que minimiza ofuscamento solar e respingos suspensos',
      'Tira absorvedora de suor em poliuretano microperfurado lavável e substituível',
      'Design clássico de alta durabilidade com ranhuras estruturais de reforço'
    ],
    standards: ['ABNT NBR 8221:2003 (Classe B)', 'NR-6 MTE', 'Certificado de Aprovação Ativo'],
    applications: ['Siderurgia', 'Pátios de mineração', 'Portos e estaleiros', 'Linhas de produção pesada'],
    packaging: 'Caixa c/ 25 unidades'
  },
  'milienium class': {
    caNumber: '35735',
    internalCode: '900220',
    description: 'Capacete Milenium com acabamento premium, ajuste por catraca de rotação contínua e suspensão têxtil de alta densidade.',
    features: [
      'Carneira anatômica com apoio cervical estendido',
      'Excelente distribuição de peso na calota craniana reduzindo fadiga muscular'
    ],
    standards: ['ABNT NBR 8221 (Classe B)', 'ANSI Z89.1'],
    applications: ['Indústria automotiva', 'Petroquímica', 'Operações fabris contínuas'],
    packaging: 'Caixa c/ 20 unidades'
  },

  // --- PROTEÇÃO VISUAL ---
  argon: {
    caNumber: '35764',
    internalCode: '901720',
    description: 'Óculos de segurança de desenho envolvente esportivo e peso pluma (24g). Oferece máxima proteção frontal e lateral contra impacto de partículas multidirecionais e radiação UV.',
    features: [
      'Lente em policarbonato óptico grau 1 (sem distorção periférica em jornadas longas)',
      'Tratamento exclusivo antiembaçante (Anti-Fog) de alta durabilidade e antirrisco (Hard Coat)',
      'Hastes ergonômicas flexíveis com ponteiras emborrachadas soft-touch que não pressionam a têmpora',
      'Ponte nasal macia em elastômero termoplástico hipoalergênico antideslizante',
      'Filtro UV400 com 99.9% de proteção contra radiação UVA/UVB'
    ],
    standards: ['ANSI/ISEA Z87.1-2020 (Z87+ Alto Impacto)', 'ABNT NBR 16360', 'Certificado de Aprovação C.A. 35764 MTE'],
    applications: ['Usinagem e corte CNC', 'Operação de ferramentas manuais e elétricas', 'Inspeção de qualidade e bancada', 'Laboratórios de controle químico', 'Montagem automotiva'],
    packaging: 'Caixa c/ 10 unidades em embalagem individual'
  },
  'argon elite': {
    caNumber: '35764',
    internalCode: '901730',
    description: 'Óculos de proteção premium com curvatura base 9 panorâmica, acabamento bicolor e tratamento óptico hidrofílico avançado contra névoas extremas.',
    features: [
      'Lente panorâmica contínua base 9 de campo de visão ininterrupto',
      'Tratamento hidrofílico super anti-fog de resistência superior a choques térmicos',
      'Armação anatômica com microcanais de ventilação indireta'
    ],
    standards: ['ANSI Z87.1 High Impact (Z87+)', 'ABNT NBR 16360'],
    applications: ['Frigoríficos e câmaras frias', 'Indústria de papel e celulose', 'Química e alimentícia', 'Manutenção industrial'],
    packaging: 'Caixa c/ 10 unidades'
  },
  ecoline: {
    caNumber: '35765',
    internalCode: '900890',
    description: 'Óculos de segurança com lente única de curvatura contínua e proteção lateral integrada. Excelente durabilidade e custo-benefício para visitantes e operações industriais.',
    features: [
      'Policarbonato virgem de alta transparência óptica e resistência mecânica',
      'Orifícios nas hastes para acoplamento de cordão de segurança',
      'Proteção contra respingos frontais e partículas sólidas volantes'
    ],
    standards: ['ANSI Z87.1', 'NR-6', 'ABNT NBR 16360'],
    applications: ['Visitantes em plantas industriais', 'Logística e armazenagem', 'Construção civil', 'Cargas e descargas'],
    packaging: 'Caixa c/ 20 unidades'
  },
  neon: {
    caNumber: '35766',
    internalCode: '901650',
    description: 'Óculos de segurança com hastes telescópicas ajustáveis em comprimento e inclinação, adaptando-se com precisão a diferentes biotipos faciais.',
    features: [
      'Hastes telescópicas com regulagem de 4 posições de comprimento',
      'Ajuste angular de inclinação para perfeito assentamento nasal',
      'Lente com tratamento antirrisco e proteção solar ou incolor'
    ],
    standards: ['ANSI Z87.1', 'ABNT NBR 16360'],
    applications: ['Manutenção mecânica', 'Operação de máquinas operatrizes', 'Carpintaria e marcenaria industrial'],
    packaging: 'Caixa c/ 12 unidades'
  },
  mig: {
    caNumber: '35767',
    internalCode: '901810',
    description: 'Óculos de segurança com armação envolvente robusta e vedação periférica ampliada contra partículas quentes e fagulhas leves.',
    features: [
      'Armação em nylon de engenharia de alta tenacidade mecânica',
      'Opções de lentes incolores, cinza ou tonalidades específicas para solda leve/oxicorte'
    ],
    standards: ['ANSI Z87.1', 'ABNT NBR 16360'],
    applications: ['Caldeiraria', 'Solda leve e oxicorte', 'Indústria naval e estruturas metálicas'],
    packaging: 'Caixa c/ 10 unidades'
  },
  'new classic': {
    caNumber: '35769',
    internalCode: '900540',
    description: 'Óculos ampla visão (goggle) com vedação estanque em elastômero termoplástico macio contra respingos químicos agressivos e poeiras tóxicas.',
    features: [
      'Corpo flexível com assentamento facial hermético sem pontos de dor',
      'Canais de ventilação indireta labiríntica que impedem penetração de líquidos (D3/D4)',
      'Tira elástica ajustável de alta tenacidade química'
    ],
    standards: ['ANSI Z87.1 (Proteção Química D3/D4)', 'ABNT NBR 16360'],
    applications: ['Laboratórios químicos', 'Manuseio de defensivos agrícolas', 'Pintura e solventes', 'Tratamento de água e esgoto'],
    packaging: 'Caixa c/ 10 unidades'
  },

  // --- PROTEÇÃO AUDITIVA ---
  quantum: {
    caNumber: '35332',
    internalCode: '901510',
    description: 'Protetor auditivo tipo plugue de inserção pré-moldado de silicone cirúrgico com 3 flanges cônicas progressivas e cordão têxtil de alta tenacidade.',
    features: [
      'Silicone medicinal atóxico e hipoalergênico lavável e esterilizável',
      'Haste com núcleo rígido interno para inserção rápida e correta sem dobrar',
      'Atenuação sonora calibrada NRRsf 15 dB com conforto térmico no canal auditivo',
      'Acompanha estojo rígido higiênico individual com presilha de cinto'
    ],
    standards: ['ABNT NBR 16076:2020 - Método B (NRRsf)', 'ANSI S12.6 - 2008', 'C.A. 35332 MTE'],
    applications: ['Indústria alimentícia', 'Farmacêutica', 'Usinagem leve e embalagens', 'Turnos operacionais contínuos de 8h'],
    packaging: 'Caixa c/ 100 pares em estojos individuais'
  },
  l340v: {
    caNumber: '35335',
    internalCode: '900620',
    description: 'Abafador de ruídos tipo concha com arco tensor acolchoado em aço mola inoxidável. Atenuação superior NRRsf 22 dB para ruídos industriais contínuos e intermitentes.',
    features: [
      'Arco duplo em aço inoxidável que mantém pressão de vedação constante por anos',
      'Almofadas macias com espuma viscoelástica termo-moldável e anel de vedação substituível',
      'Conchas com tecnologia de câmara acústica dupla para bloqueio de baixas frequências'
    ],
    standards: ['ABNT NBR 16076 (Método B)', 'ANSI S12.6', 'C.A. 35335 MTE'],
    applications: ['Prensas mecânicas e estamparia', 'Serralheria industrial', 'Aeroportos e pistas', 'Salas de compressores e geradores'],
    packaging: 'Caixa c/ 10 unidades'
  },
  l320v: {
    caNumber: '35334',
    internalCode: '900610',
    description: 'Abafador de concha compacto de peso leve para ambientes de ruído moderado, com arco ajustável e almofadas laváveis.',
    features: [
      'Perfil compacto e discreto com atenuação NRRsf 18 dB',
      'Conchas giratórias em 360° para encaixe ergonômico instantâneo'
    ],
    standards: ['ABNT NBR 16076', 'ANSI S12.6'],
    applications: ['Oficinas mecânicas', 'Marcenarias', 'Operação de empilhadeiras'],
    packaging: 'Caixa c/ 12 unidades'
  },
  l360v: {
    caNumber: '35336',
    internalCode: '900630',
    description: 'Abafador de alta atenuação NRRsf 27 dB projetado para ambientes de ruído extremo e áreas de teste de motores.',
    features: [
      'Conchas de grande volume com tripla barreira acústica interna',
      'Haste sobre a cabeça com reforço acolchoado respirável'
    ],
    standards: ['ABNT NBR 16076:2020', 'ANSI S12.6'],
    applications: ['Mineração subterrânea', 'Testes de turbinas e motores diesel', 'Trituradores e britadores'],
    packaging: 'Caixa c/ 10 unidades'
  },
  l340c: {
    caNumber: '35338',
    internalCode: '900650',
    description: 'Abafador de concha para acoplamento direto em capacetes Libus (Genesis, Milenium) via slot universal de 30mm.',
    features: [
      'Braço articulado com posição de repouso, trabalho e ventilação',
      'Atenuação NRRsf 21 dB sem comprometer o isolamento elétrico do capacete'
    ],
    standards: ['ABNT NBR 16076', 'ANSI S12.6'],
    applications: ['Construção pesada', 'Montagens industriais', 'Manutenção em linhas de produção'],
    packaging: 'Caixa c/ 10 pares'
  },

  // --- PROTEÇÃO FACIAL ---
  'facial bolha': {
    caNumber: '36001',
    internalCode: '901230',
    description: 'Protetor facial esférico injetado em policarbonato óptico virgem de alta espessura com queixeira integrada e ampla proteção lateral.',
    features: [
      'Visor esférico tipo bolha que minimiza reflexos e permite uso confortável com respirador e óculos',
      'Catraca de ajuste angular com trava mecânica de 5 posições',
      'Resistência a impactos de alta energia e respingos de produtos químicos agressivos'
    ],
    standards: ['ABNT NBR 16360:2015', 'ANSI/ISEA Z87.1 (Impacto Facial Superior)', 'C.A. 36001 MTE'],
    applications: ['Esmerilhamento e corte com rebolo', 'Manuseio de produtos químicos concentrados', 'Fundição e metalurgia'],
    packaging: 'Caixa c/ 10 unidades'
  },
  'facial plano': {
    caNumber: '36002',
    internalCode: '901240',
    description: 'Protetor facial plano de policarbonato 200mm com coroa em polipropileno de alta resistência térmica.',
    features: [
      'Lente plana com borda arredondada em policarbonato de 1.5mm',
      'Excelente equilíbrio e leveza para inspeções e rotinas de corte'
    ],
    standards: ['ABNT NBR 16360', 'ANSI Z87.1'],
    applications: ['Laboratórios', 'Marcenaria e desbaste', 'Manutenção predial'],
    packaging: 'Caixa c/ 10 unidades'
  },

  // --- PROTEÇÃO RESPIRATÓRIA & LINHA BLS ---
  'semifacial 9000 silicone': {
    caNumber: '44521',
    internalCode: '902810',
    description: 'Respirador purificador de ar semifacial confeccionado em 100% silicone medicinal de alta flexibilidade. Excelente vedação facial em temperaturas extremas.',
    features: [
      'Corpo em silicone medicinal inerte que não resseca nem deforma com suor e químicos',
      'Sistema de conexão tipo baioneta de engate rápido com encaixe sonoro (Click)',
      'Válvula de exalação MaxFlow de abertura instantânea que reduz umidade e calor interno',
      'Tirante elástico de 4 pontos com suporte para nuca anatômico e ajuste deslizante'
    ],
    standards: ['ABNT NBR 13694:1996 (Peças Semifaciais)', 'Portaria MTE / NR-6', 'C.A. 44521 Ativo MTE'],
    applications: ['Pintura industrial e aplicação de vernizes', 'Indústria química e petroquímica', 'Aplicação de defensivos agrícolas', 'Soldagem e fumos metálicos'],
    packaging: 'Caixa individual com manual de ensaio de vedação (Fit Test)'
  },
  'semifacial 9000 (tpe)': {
    caNumber: '44522',
    internalCode: '902820',
    description: 'Respirador semifacial em elastômero termoplástico (TPE) atóxico, leve e com excelente vedação para operações fabris.',
    features: [
      'Elastômero flexível de ajuste confortável e hipoalergênico',
      'Biconexão baioneta balanceada para melhor distribuição de peso no rosto',
      'Compatível com toda a linha de cartuchos químicos e filtros mecânicos Libus Série G/P'
    ],
    standards: ['ABNT NBR 13694', 'NR-6', 'C.A. 44522 MTE'],
    applications: ['Oficinas de repintura automotiva', 'Operações de usinagem e colagem', 'Manutenção industrial'],
    packaging: 'Caixa c/ 10 unidades'
  },
  'facial inteira 9000': {
    caNumber: '44523',
    internalCode: '902830',
    description: 'Máscara facial inteira com visor panorâmico de policarbonato óptico Classe 1 e diafragma de voz integrado.',
    features: [
      'Visor panorâmico com tratamento antirrisco e proteção UV com campo de visão > 90%',
      'Diafragma fônico metálico de alta transmissão para comunicação clara sem retirar o respirador',
      'Tirante de 6 pontos de fixação com fivelas de liberação rápida'
    ],
    standards: ['ABNT NBR 13695:1996 (Peças Faciais Inteiras)', 'EN 136:1998 CL2', 'C.A. 44523 MTE'],
    applications: ['Ambientes com gases tóxicos e contaminantes agressivos aos olhos', 'Saneamento e tratamento de efluentes', 'Emergências químicas'],
    packaging: 'Caixa individual com capa protetora de visor'
  },
  'bls 5600': {
    caNumber: '44523',
    internalCode: '902831',
    description: 'Máscara facial completa BLS 5600 em elastômero termoplástico (TPE) com visor panorâmico Classe 1 (EN 166) e sistema antiembaçante por circulação interna.',
    features: [
      'Visor em policarbonato sem distorção óptica com certificação de impacto balístico',
      'Conexão biconector BLS Bayonet tipo B-Lock para encaixe intuitivo',
      'Circulação de ar por máscara oronasal interna que impede 100% o embaçamento da lente'
    ],
    standards: ['EN 136:1998 Classe 2', 'ABNT NBR 13695', 'C.A. 44523 MTE'],
    applications: ['Indústria farmacêutica e química fina', 'Descontaminação e lavagem química', 'Usinas nucleares e térmicas'],
    packaging: 'Caixa individual com certificado de ensaio europeu'
  },
  'bls 5700': {
    caNumber: '44524',
    internalCode: '902832',
    description: 'Máscara facial completa BLS 5700 em 100% silicone puro com visor panorâmico e altíssima resistência a solventes e calor.',
    features: [
      'Corpo em silicone nobre que mantém flexibilidade de -30°C a +150°C',
      'Tirantes de silicone integrados com alívio de pressão na nuca',
      'Diafragma de voz de alta performance'
    ],
    standards: ['EN 136 Classe 2', 'ABNT NBR 13695', 'C.A. 44524 MTE'],
    applications: ['Refinarias de petróleo', 'Plataformas offshore', 'Indústria química pesada'],
    packaging: 'Caixa individual'
  },
  'bls 5150': {
    caNumber: '44520',
    internalCode: '902833',
    description: 'Máscara facial inteira BLS 5150 com rosca universal padrão RD40 (EN 148-1) para filtros pesados de canister.',
    features: [
      'Conexão única central rosca padrão DIN EN 148-1 (RD40)',
      'Compatível com filtros combinados pesados para gases especiais e fumaças'
    ],
    standards: ['EN 136:1998 Classe 3 (Heavy Duty)', 'ABNT NBR 13695', 'C.A. 44520 MTE'],
    applications: ['Equipes de resgate químico (HAZMAT)', 'Indústria de cloro e amônia', 'Descontaminação de tanques'],
    packaging: 'Caixa individual'
  },
  'bls 4000 next s': {
    caNumber: '44519',
    internalCode: '902840',
    description: 'Respirador semifacial Série BLS 4000 Next em silicone com perfil rebaixado (Drop-Down) para uso fácil com capacetes e óculos.',
    features: [
      'Sistema Drop-Down: permite desencaixar a máscara do rosto sem soltar o capacete ou tirante da cabeça',
      'Corpo em silicone anatômico ultraleve com vedação de 3 tamanhos'
    ],
    standards: ['EN 140:1998', 'ABNT NBR 13694', 'C.A. 44519 MTE'],
    applications: ['Operações industriais contínuas', 'Construção civil', 'Cabines de pintura'],
    packaging: 'Caixa c/ 10 unidades'
  },
  'bls 502': {
    caNumber: '44540',
    internalCode: '903310',
    description: 'Respirador dobrável PFF2 (N95) sem válvula com manta de microfibras eletrostáticas de alta retenção de poeiras tóxicas e agentes biológicos.',
    features: [
      'Eficiência de filtração mínima de 94% contra aerossóis sólidos e líquidos base água',
      'Clipe nasal embutido sem metal aparente e elásticos soldados por ultrassom'
    ],
    standards: ['ABNT NBR 13698:2011 (PFF2)', 'Portaria INMETRO', 'C.A. 44540 MTE'],
    applications: ['Hospitais e laboratórios (biológico)', 'Poeiras de lixamento de madeira e gesso', 'Farináceos e grãos'],
    packaging: 'Caixa c/ 20 unidades embaladas individualmente'
  },
  'bls 512': {
    caNumber: '44541',
    internalCode: '903320',
    description: 'Respirador dobrável PFF2 com válvula de exalação frontal de alto fluxo para redução do ar quente interno.',
    features: [
      'Válvula de exalação que reduz a temperatura e umidade dentro do respirador em até 4°C',
      'Estrutura dobrável compacta fácil de guardar no bolso do uniforme'
    ],
    standards: ['ABNT NBR 13698 (PFF2 Válvula)', 'INMETRO / NR-6', 'C.A. 44541 MTE'],
    applications: ['Construção civil e concreto', 'Fundição e metalurgia', 'Cimenteiras e mineração'],
    packaging: 'Caixa c/ 10 unidades'
  },
  'bls 102v': {
    caNumber: '44542',
    internalCode: '903330',
    description: 'Respirador formato concha rígida PFF2 com válvula e malha interna de sustentação indeformável.',
    features: [
      'Concha estruturada que não amassa mesmo em ambientes de alta umidade',
      'Camada interna de contato macia com vedação perimetral anatômica'
    ],
    standards: ['ABNT NBR 13698', 'C.A. 44542 MTE'],
    applications: ['Indústria pesada', 'Mineração', 'Pedreiras e britagem'],
    packaging: 'Caixa c/ 10 unidades'
  },
  'bls 680 next': {
    caNumber: '44543',
    internalCode: '903340',
    description: 'Respirador PFF2 com camada de carvão ativado para alívio de odores incômodos de vapores orgânicos e gases ácidos abaixo do limite de tolerância (NR-15).',
    features: [
      'Camada filtrante intermediária com microgrânulos de carvão ativado ativado por vapor',
      'Válvula de exalação de baixa resistência respiratória'
    ],
    standards: ['ABNT NBR 13698 (PFF2 + Carvão)', 'C.A. 44543 MTE'],
    applications: ['Tratamento de efluentes e esgoto', 'Reciclagem e triagem de resíduos', 'Pintura leve com pincel/rolo', 'Solda e ozônio'],
    packaging: 'Caixa c/ 10 unidades'
  },
  'bls zer0 30': {
    caNumber: '44544',
    internalCode: '903350',
    description: 'Respirador descartável de altíssima performance PFF3 R D com tecnologia NanoFilter e eficiência de filtração superior a 99.95% (padrão HEPA).',
    features: [
      'Eficiência de filtração PFF3 (99.95%) com resistência respiratória ultrabaixa',
      'Certificação Dolomita (D) contra entupimento em ambientes de altíssima concentração de poeira',
      'Reutilizável por mais de um turno (classificação R)'
    ],
    standards: ['EN 149:2001+A1:2009 (FFP3 R D)', 'ABNT NBR 13698', 'C.A. 44544 MTE'],
    applications: ['Fibras de amianto/asbesto', 'Poeiras farmacêuticas de alta toxicidade', 'Fumos de chumbo, berílio e metais pesados', 'Ambientes nucleares'],
    packaging: 'Caixa c/ 5 unidades em embalagem médica selada'
  }
};

export function getProductSpec(productName: string): ProductSpec | null {
  const norm = productName.toLowerCase().trim();
  for (const [key, spec] of Object.entries(productSpecsDictionary)) {
    if (norm.includes(key)) {
      return spec;
    }
  }
  return null;
}
