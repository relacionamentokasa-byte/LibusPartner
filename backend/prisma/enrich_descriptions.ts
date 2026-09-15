import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dicionário de descrições normativas, diferenciais de engenharia e aplicações recomendadas
const productSpecs: Record<string, {
  caNumber: string;
  internalCode: string;
  description: string;
  features: string[];
  standards: string[];
  applications: string[];
}> = {
  // --- PROTEÇÃO DA CABEÇA ---
  'genesis': {
    caNumber: '36099',
    internalCode: '901380',
    description: 'Capacete de segurança industrial Classe B com design moderno e anatômico. Injetado em polietileno de alta densidade (PEAD) virgem, oferece máxima proteção contra impactos de objetos volantes e isolamento dielétrico superior para trabalhos em redes de média e baixa tensão.',
    features: [
      'Casco balanceado de alta resistência com canaleta lateral para escoamento de líquidos e respingos',
      'Suspensão têxtil premium com 8 pontos de fixação e cinta de amortecimento amortecedora de impacto',
      'Catraca de ajuste milimétrico preciso (EasyClick) que estabiliza o casco mesmo em posições inclinadas',
      'Slot universal padrão de 30mm compatível com abafadores de concha Libus e protetores faciais articulados',
      'Tira jugular em tecido hipoalergênico com fixação segura de 3 pontos'
    ],
    standards: ['ABNT NBR 8221:2003 (Classe B)', 'ANSI/ISEA Z89.1-2014 Type 1 Class E', 'Certificado de Aprovação C.A. Ativo MTE'],
    applications: ['Construção civil', 'Indústrias metalúrgicas', 'Montagens industriais', 'Manutenção elétrica industrial', 'Mineração e logística']
  },
  'andes': {
    caNumber: '46039',
    internalCode: '902140',
    description: 'Capacete de proteção para trabalhos em altura e resgate em espaços confinados. Desenvolvido sem aba frontal para proporcionar ângulo visual vertical desobstruído de 180°, garantindo segurança e ergonomia em escaladas e estruturas elevadas.',
    features: [
      'Casco ultra compacto com carcaça de ABS de alto impacto de perfil anatômico',
      'Jugular reforçada de 4 pontas com fivela de engate rápido e proteção acolchoada para queixo',
      'Amortecedor de poliestireno expandido (EPS) interno com ventilação otimizada',
      'Clips integrados para fixação de lanterna de cabeça sem deslizamento',
      'Resistência a impactos laterais, frontais e traseiros além da absorção vertical'
    ],
    standards: ['ABNT NBR 8221 / EN 12492 (Trabalho em Altura)', 'NR-35 / NR-33', 'ANSI Z89.1'],
    applications: ['Trabalho em altura (NR-35)', 'Acesso por corda', 'Espaço confinado (NR-33)', 'Torres de telecomunicação', 'Resgate industrial e florestal']
  },
  'milenium': {
    caNumber: '35735',
    internalCode: '900210',
    description: 'Capacete de segurança classe B de alta robustez com aba frontal pronunciada para desvio de sol e detritos, suspensão com tecido absorvente e alta estabilidade para rotinas industriais severas.',
    features: [
      'Aba frontal estendida que minimiza ofuscamento solar e respingos',
      'Tira absorvedora de suor em poliuretano microperfurado lavável e substituível',
      'Design clássico de alta durabilidade com ranhuras estruturais de reforço'
    ],
    standards: ['ABNT NBR 8221:2003 (Classe B)', 'NR-6', 'Certificado de Aprovação Ativo'],
    applications: ['Siderurgia', 'Pátios de mineração', 'Portos e estaleiros', 'Linhas de produção pesada']
  },
  'milienium': {
    caNumber: '35735',
    internalCode: '900220',
    description: 'Versão especial do capacete Milenium com acabamento premium, ajuste por catraca de rotação contínua e suspensão têxtil de alta densidade.',
    features: [
      'Carneira anatômica com apoio cervical estendido',
      'Excelente distribuição de peso na calota craniana reduzindo fadiga muscular'
    ],
    standards: ['ABNT NBR 8221 (Classe B)', 'ANSI Z89.1'],
    applications: ['Indústria automotiva', 'Petroquímica', 'Operações fabris contínuas']
  },

  // --- PROTEÇÃO VISUAL ---
  'argon': {
    caNumber: '35764',
    internalCode: '901720',
    description: 'Óculos de segurança de desenho envolvente esportivo e ultraleve (24g). Oferece máxima proteção frontal e lateral contra impacto de partículas volantes multidirecionais e radiação UV.',
    features: [
      'Lente em policarbonato óptico grau 1 (sem distorção visual periférica)',
      'Tratamento exclusivo antiembaçante (Anti-Fog) de longa duração e antirrisco (Hard Coat)',
      'Hastes ergonômicas flexíveis com extremidades emborrachadas soft-touch que não pressionam a têmpora',
      'Ponte nasal macia em elastômero termoplástico que evita escorregamento com suor',
      'Filtro 99.9% contra radiação ultravioleta UVA/UVB (UV400)'
    ],
    standards: ['ANSI/ISEA Z87.1-2020 (Z87+ Alto Impacto)', 'ABNT NBR 16360', 'Certificado de Aprovação C.A. MTE'],
    applications: ['Usinagem e corte', 'Manuseio de ferramentas manuais/elétricas', 'Inspeção de qualidade', 'Laboratórios', 'Montagem automotiva']
  },
  'argon elite': {
    caNumber: '35764',
    internalCode: '901730',
    description: 'Versão aprimorada da linha Argon com acabamento de alta performance, armação bicolor com vedação nasal premium e tratamento óptico reforçado contra névoas extremas.',
    features: [
      'Lente de alta curvatura base 9 com visão panorâmica ininterrupta',
      'Tratamento hidrofílico super anti-fog de resistência superior a vapores térmicos',
      'Estrutura com ventilação indireta e peso pluma balanceado'
    ],
    standards: ['ANSI Z87.1 High Impact', 'NBR 16360'],
    applications: ['Ambientes com alternância de temperatura quente/frio', 'Indústria de papel e celulose', 'Química e alimentícia']
  },
  'ecoline': {
    caNumber: '35765',
    internalCode: '900890',
    description: 'Óculos de segurança com lente única de curvatura contínua e proteção lateral integrada. Excelente custo-benefício para visitantes e operações industriais diárias.',
    features: [
      'Policarbonato transparente de alta transparência e resistência mecânica',
      'Orifícios nas hastes para acoplamento de cordão de segurança',
      'Proteção contra respingos frontais e poeiras suspensas'
    ],
    standards: ['ANSI Z87.1', 'NR-6'],
    applications: ['Visitantes em plantas industriais', 'Logística e armazenagem', 'Construção civil', 'Cargas e descargas']
  },
  'neon': {
    caNumber: '35766',
    internalCode: '901650',
    description: 'Óculos de segurança com design contemporâneo e hastes ajustáveis em comprimento e inclinação, adaptando-se com precisão a diferentes formatos de face.',
    features: [
      'Hastes telescópicas com regulagem de comprimento de 4 posições',
      'Lente panorâmica com proteção solar ou incolor resistente a impactos',
      'Apoio nasal integrado anatômico'
    ],
    standards: ['ANSI Z87.1', 'ABNT NBR 16360'],
    applications: ['Manutenção mecânica', 'Operação de máquinas operatrizes', 'Carpintaria e marcenaria industrial']
  },
  'mig': {
    caNumber: '35767',
    internalCode: '901810',
    description: 'Óculos de proteção com armação envolvente robusta e vedação periférica ampliada, ideal para ambientes industriais com poeiras volantes e faíscas leves.',
    features: [
      'Armação em nylon reforçado com excelente retenção facial',
      'Lentes substituíveis de policarbonato com revestimento UV400'
    ],
    standards: ['ANSI Z87.1', 'NBR 16360'],
    applications: ['Solda leve e oxicorte (tonalidades escuras)', 'Indústria naval', 'Caldeiraria']
  },
  'eco sport': {
    caNumber: '35768',
    internalCode: '901920',
    description: 'Óculos com linha aerodinâmica esportiva, armação anatômica com hastes vazadas para fluxo contínuo de ar, minimizando o aquecimento facial.',
    features: [
      'Design esportivo com alta adesão ao rosto',
      'Tratamento antirrisco e proteção UV total'
    ],
    standards: ['ANSI Z87.1', 'NR-6'],
    applications: ['Atividades ao ar livre', 'Agronegócio', 'Transportes e logística']
  },
  'new classic': {
    caNumber: '35769',
    internalCode: '900540',
    description: 'Óculos de proteção ampla visão com vedação total em elastômero flexível. Protege contra respingos químicos, névoas e impactos de partículas em alta velocidade.',
    features: [
      'Corpo flexível que se molda aos contornos do rosto sem pontos de pressão',
      'Sistema de ventilação indireta que bloqueia passagem de líquidos e reduz condensação',
      'Banda elástica ajustável de alta resistência química e mecânica'
    ],
    standards: ['ANSI Z87.1 (Proteção Química D3/D4)', 'NBR 16360'],
    applications: ['Laboratórios químicos', 'Manuseio de tintas e solventes', 'Limpeza pesada industrial', 'Tratamento de água e esgoto']
  },

  // --- PROTEÇÃO AUDITIVA ---
  'quantum': {
    caNumber: '35332',
    internalCode: '901510',
    description: 'Protetor auditivo tipo plug de inserção em silicone hipoalergênico grau médico. Possui design de 3 flanges cônicas concêntricas com cordão de poliéster de alta resistência.',
    features: [
      'Atenuação sonora NRRsf de 15 dB com vedação acústica gradual no conduto',
      'Silicone ultra macio de memória térmica que se adapta à temperatura corporal',
      'Estojo higiênico individual com presilha para cinto ou bolso',
      'Lavável, reutilizável e de fácil desinfecção com água e sabão neutro'
    ],
    standards: ['ABNT NBR 16076:2016 (Método B - NRRsf)', 'ANSI S12.6', 'C.A. Ativo MTE'],
    applications: ['Fábricas e montadoras', 'Metalmecânica', 'Impressão e gráfica', 'Alimentícia', 'Marchetarias']
  },
  'l320v': {
    caNumber: '35334',
    internalCode: '900610',
    description: 'Abafador de ruído tipo concha acoplável a capacetes Libus e padrão universal 30mm. Excelente conforto para jornadas de 8 horas em ambientes de ruído moderado a alto.',
    features: [
      'Atenuação NRRsf de 17 dB com excelente atenuação nas frequências médias e agudas',
      'Braço de acoplamento em polímero de engenharia com posição de repouso (aberto) e operação (fechado)',
      'Almofadas circum-auriculares preenchidas com espuma viscoelástica macia e película selada',
      'Isolamento elétrico total (sem partes metálicas condutoras)'
    ],
    standards: ['ABNT NBR 16076', 'ANSI S12.6', 'C.A. Ativo MTE'],
    applications: ['Construção civil', 'Indústria metalúrgica', 'Linhas de prensas e tornos', 'Operação com britadeiras']
  },
  'l340v': {
    caNumber: '35335',
    internalCode: '900620',
    description: 'Abafador de ruído acoplável a capacete de alta performance para áreas de ruído crítico (NRRsf 21 dB). Conchas duplas com câmara acústica expandida.',
    features: [
      'Atenuação sonora superior de NRRsf 21 dB com controle de graves potentes',
      'Encaixe perfeito na fenda do capacete Genesis / Andes com pressão balanceada',
      'Almofadas substituíveis através de kit de reposição higiênico Libus'
    ],
    standards: ['ABNT NBR 16076:2016', 'ANSI S12.6', 'C.A. Ativo'],
    applications: ['Mineração', 'Siderurgia e fundição', 'Aeroportos e pistas', 'Salas de compressores e geradores']
  },
  'l360v': {
    caNumber: '35336',
    internalCode: '900630',
    description: 'Abafador de ruído acoplável para ambientes de ruído extremo (NRRsf 25 dB). Máxima proteção acústica com conforto térmico e almofadas amplas.',
    features: [
      'Conchas de perfil profundo com multicamadas de espuma acústica de alta densidade',
      'Pressão constante das hastes sem perda de pressão ao longo do tempo'
    ],
    standards: ['ABNT NBR 16076', 'ANSI S12.6'],
    applications: ['Usinas termoelétricas', 'Britagem pesada', 'Salas de testes de motores', 'Moinhos de bolas']
  },
  'l320c': {
    caNumber: '35337',
    internalCode: '900640',
    description: 'Abafador de ruído tipo concha com arco tensor sobre a cabeça (headband) acolchoado e ajustável. Ideal para trabalhadores que não necessitam de capacete.',
    features: [
      'Atenuação sonora NRRsf de 18 dB com haste metálica flexível revestida de conforto',
      'Ajuste vertical deslizante nas conchas para posicionamento milimétrico nas orelhas',
      'Almofadas macias com vedação à prova de pressão excessiva'
    ],
    standards: ['ABNT NBR 16076', 'ANSI S12.6'],
    applications: ['Operação de empilhadeiras', 'Carpintaria', 'Oficinas de manutenção', 'Manuseio de serras']
  },
  'l340c': {
    caNumber: '35338',
    internalCode: '900650',
    description: 'Abafador de ruído tipo concha com arco de alta performance (NRRsf 22 dB). Excelente para áreas industriais de alta emissão sonora contínua.',
    features: [
      'Arco ergonômico bipartido que distribui a pressão sem superaquecer o topo da cabeça',
      'Conchas acústicas com amortecimento duplo para frequências graves e agudas'
    ],
    standards: ['ABNT NBR 16076', 'ANSI S12.6'],
    applications: ['Salas de caldeiras', 'Indústria têxtil', 'Estamparia e corte a laser', 'Prensas']
  },
  'l360c': {
    caNumber: '35339',
    internalCode: '900660',
    description: 'Abafador de ruído com arco para proteção em níveis críticos de ruído (NRRsf 26 dB). O mais alto índice de atenuação da linha Libus.',
    features: [
      'Câmara de ressonância profunda com isolamento acústico máximo',
      'Almofadas ultra macias com vedação hermética'
    ],
    standards: ['ABNT NBR 16076', 'ANSI S12.6', 'C.A. Ativo MTE'],
    applications: ['Usinas e turbinas', 'Indústria de forjaria pesada', 'Fundições de grande porte', 'Pistas de aviação']
  },

  // --- PROTEÇÃO FACIAL ---
  'facial bolha': {
    caNumber: '36001',
    internalCode: '901230',
    description: 'Protetor facial com visor esférico termoformado em policarbonato de 2mm. Oferece proteção panorâmica e queixo fechado contra alto impacto de partículas e respingos químicos.',
    features: [
      'Design esférico (bolha) que elimina reflexos e proporciona visão desimpedida de 180°',
      'Formato com aba inferior envolvente que protege queixo e pescoço contra partículas ricocheteadas',
      'Resistência comprovada a impactos de alta velocidade e temperaturas extremas',
      'Compatível com suporte de acoplamento em capacete Libus ou carneira de cabeça'
    ],
    standards: ['ANSI/ISEA Z87.1 (Alto Impacto)', 'ABNT NBR', 'C.A. Ativo MTE'],
    applications: ['Esmerilhamento e desbaste', 'Indústria química', 'Manuseio de metais líquidos', 'Corte com plasma']
  },
  'facial plano': {
    caNumber: '36002',
    internalCode: '901240',
    description: 'Protetor facial cilíndrico reto em policarbonato óptico cristalino. Leve e versátil para proteção facial diária contra respingos mecânicos.',
    features: [
      'Visor em policarbonato virgem de 1.5mm com bordas arredondadas de segurança',
      'Fácil substituição e montagem rápida no adaptador de capacete'
    ],
    standards: ['ANSI Z87.1', 'NR-6'],
    applications: ['Montagens industriais', 'Usinagem leve', 'Envasamento e linhas de embalagem']
  },
  'facial tela': {
    caNumber: '36003',
    internalCode: '901250',
    description: 'Protetor facial com visor em malha de aço preta antiofuscante. Ideal para ambientes de silvicultura, jardinagem e corte de madeira onde não há acúmulo de névoa.',
    features: [
      'Malha de aço de alta resistência com ventilação 100% livre',
      'Protege contra cavacos de madeira, galhos e partículas em alta velocidade sem embaçar'
    ],
    standards: ['ANSI Z87.1', 'NR-6'],
    applications: ['Motosserra e roçadeiras', 'Reflorestamento e silvicultura', 'Colheita e agroindústria']
  },
  'facial cilindrico': {
    caNumber: '36004',
    internalCode: '901260',
    description: 'Protetor facial com visor cilíndrico de alta cobertura e curvatura uniforme, combinando excelente visibilidade com proteção ampla de têmporas.',
    features: [
      'Tratamento antirrisco e anti-UV 99.9%',
      'Articulação suave com 5 posições de travamento vertical'
    ],
    standards: ['ANSI Z87.1', 'NBR 16360'],
    applications: ['Manutenção fabril', 'Fundição secundária', 'Laboratórios de testes']
  },

  // --- PROTEÇÃO RESPIRATÓRIA ---
  'semifacial 9000 silicone': {
    caNumber: '44521',
    internalCode: '902810',
    description: 'Respirador semifacial reutilizável confeccionado em 100% silicone de grau médico. Proporciona vedação hermética insuperável, máxima maciez e conforto duradouro sem causar dermatites.',
    features: [
      'Corpo em silicone de alta pureza que mantém a flexibilidade e vedação mesmo em temperaturas extremas (-20°C a +50°C)',
      'Válvula de exalação central de baixa resistência que dissipa rapidamente o calor e a umidade da respiração',
      'Tirantes elásticos com 4 pontos de ancoragem e berço de nuca ergonômico que não desliza',
      'Conexão de cartuchos tipo baioneta de giro rápido 1/4 de volta com vedação acústico-mecânica',
      'Compatível com óculos e protetores faciais Libus sem gerar embaçamento nas lentes'
    ],
    standards: ['ABNT NBR 13694:1996 (Peças Semifaciais)', 'Fundacentro', 'Certificado de Aprovação C.A. MTE'],
    applications: ['Pintura industrial com pistola', 'Manuseio de defensivos agrícolas', 'Indústria farmacêutica e química', 'Soldagem e caldeiraria']
  },
  'semifacial 9000 (tpe)': {
    caNumber: '44522',
    internalCode: '902820',
    description: 'Respirador semifacial reutilizável em elastômero termoplástico (TPE) de alta flexibilidade e excelente custo-benefício para rotinas industriais intensivas.',
    features: [
      'Material leve e hipoalergênico com excelente adaptação anatômica à ponte nasal',
      'Sistema de fluxo duplo de ar com baixa resistência inalatória',
      'Fácil desmontagem e manutenção com peças de reposição modulares'
    ],
    standards: ['ABNT NBR 13694', 'NR-6', 'C.A. Ativo MTE'],
    applications: ['Manufatura geral', 'Indústria automotiva', 'Construção civil', 'Operações de mistura e pesagem de pós']
  },
  'facial inteira 9000': {
    caNumber: '44523',
    internalCode: '902830',
    description: 'Peça facial inteira (Full Face) em silicone com visor panorâmico de policarbonato de alta resistência a impactos. Proteção integrada para vias respiratórias, olhos e face.',
    features: [
      'Visor panorâmico com classe óptica 1 e amplo campo de visão de 180° sem distorções',
      'Membrana fônica integrada para comunicação clara e inteligível entre a equipe',
      'Copa nasal interna em silicone que impede a recirculação de ar e o embaçamento do visor',
      'Arnés de fixação com 5 pontos de ajuste rápido com fivelas de liberação imediata'
    ],
    standards: ['ABNT NBR 13695:1996 (Peças Faciais Inteiras)', 'EN 136 Classe 2', 'C.A. Ativo MTE'],
    applications: ['Ambientes com gases tóxicos e vapores agressivos', 'Combate a vazamentos químicos', 'Jateamento e desincrustação', 'Espaços confinados']
  },
  'bls 5600': {
    caNumber: '44523',
    internalCode: '902831',
    description: 'Máscara facial inteira BLS 5600 em elastômero termoplástico macio com conexão baioneta dupla b-lock. Visor de policarbonato óptico com tratamento antirrisco e proteção total dos olhos e vias aéreas.',
    features: [
      'Visor de grande campo de visão sem reflexos internos',
      'Selagem suave com tirante de 6 pontos de ajuste rápido',
      'Conexão baioneta b-lock fácil de engatar'
    ],
    standards: ['EN 136 Classe 2', 'ABNT NBR 13695', 'C.A. Ativo'],
    applications: ['Química pesada', 'Indústria de papel e celulose', 'Tratamento de água', 'Agricultura industrial']
  },
  'bls 5700': {
    caNumber: '44524',
    internalCode: '902832',
    description: 'Máscara facial inteira BLS 5700 confeccionada em silicone puro de grau cirúrgico. Máximo conforto e durabilidade com resistência a solventes agressivos e altas temperaturas.',
    features: [
      'Corpo 100% silicone flexível antialérgico',
      'Visor com tratamento anti-risco e anti-solventes',
      'Diafragma fônico para comunicação operacional clara'
    ],
    standards: ['EN 136 Classe 2', 'ABNT NBR 13695', 'C.A. Ativo'],
    applications: ['Laboratórios petroquímicos', 'Remoção de amianto e contaminantes críticos', 'Espaços confinados']
  },
  'bls 5150': {
    caNumber: '44520',
    internalCode: '902833',
    description: 'Máscara facial inteira com conexão universal de rosca padrão RD40 (EN 148-1). Compatível com filtros de alta capacidade para gases tóxicos complexos.',
    features: [
      'Conector de rosca universal RD40 padrão internacional',
      'Visor panorâmico e arnés de 5 pontas'
    ],
    standards: ['EN 136', 'EN 148-1', 'ABNT NBR 13695'],
    applications: ['Defesa civil', 'Indústria química especializada', 'Brigadas de emergência']
  },
  'bls 4000': {
    caNumber: '44519',
    internalCode: '902840',
    description: 'Linha de respiradores semifaciais BLS 4000 Next com encaixe de filtros tipo baioneta rápida b-lock. Design compacto e perfil baixo que não atrapalha a visão para baixo.',
    features: [
      'Conexão b-lock intuitiva de giro rápido',
      'Tirante deslizante com trava no queixo para descanso rápido sem retirar o capacete',
      'Válvula de exalação com escudo protetor frontal'
    ],
    standards: ['EN 140', 'ABNT NBR 13694', 'C.A. Ativo'],
    applications: ['Pintura automotiva', 'Marcenaria e lixamento', 'Manutenção industrial']
  },
  'bls 211': {
    caNumber: '44530',
    internalCode: '903140',
    description: 'Filtro químico contra Vapores Orgânicos Classe A2. Alta capacidade de retenção de solventes em concentrações moderadas a altas.',
    features: ['Carvão ativado virgem', 'Encaixe baioneta b-lock', 'Excelente autonomia'],
    standards: ['EN 14387', 'ABNT NBR 13696'],
    applications: ['Pintura industrial', 'Uso com solventes aromáticos', 'Resinas e adesivos']
  },
  'bls 213': {
    caNumber: '44531',
    internalCode: '903141',
    description: 'Filtro multigás ABEK1 contra vapores orgânicos, gases inorgânicos, gases ácidos e amônia/derivados.',
    features: ['Proteção 4 em 1 com meio filtrante multinível', 'Excelente versatilidade'],
    standards: ['EN 14387', 'ABNT NBR 13696'],
    applications: ['Indústrias químicas integradas', 'Laboratórios', 'Estações de tratamento']
  },
  'bls 244': {
    caNumber: '44532',
    internalCode: '903142',
    description: 'Filtro químico específico contra Amônia e Derivados Orgânicos de Amônia (Classe K2).',
    features: ['Carvão quimicamente impregnado para absorção de amônia gasosa'],
    standards: ['EN 14387', 'ABNT NBR 13696'],
    applications: ['Frigoríficos', 'Sistemas de refrigeração industrial', 'Fertilizantes']
  },
  'bls 243': {
    caNumber: '44533',
    internalCode: '903143',
    description: 'Filtro combinado multigás de alta capacidade ABEK2 para ambientes com múltiplos contaminantes em concentrações elevadas.',
    features: ['Filtração ABEK de alta capacidade com excelente vida útil'],
    standards: ['EN 14387', 'ABNT NBR 13696'],
    applications: ['Petroquímica', 'Indústria farmacêutica', 'Siderurgia']
  },
  'bls 430': {
    caNumber: '44534',
    internalCode: '903144',
    description: 'Filtro universal RD40 combinado A2P3 R para proteção contra vapores orgânicos e partículas/poeiras tóxicas P3.',
    features: ['Rosca universal RD40', 'Carvão A2 e meio particulado P3 R integrado'],
    standards: ['EN 14387', 'ABNT NBR 13696'],
    applications: ['Manuseio de pesticidas', 'Descontaminação', 'Processos com poeiras e solventes']
  },
  'bls 414': {
    caNumber: '44535',
    internalCode: '903145',
    description: 'Filtro universal RD40 ABEK2P3 R de máxima proteção para peças faciais inteiras com conexão de rosca.',
    features: ['Proteção total multigás ABEK2 + particulado P3 de alta eficiência'],
    standards: ['EN 14387', 'EN 148-1'],
    applications: ['Intervenção em emergências químicas', 'Plantas industriais pesadas']
  },
  'bls 412': {
    caNumber: '44536',
    internalCode: '903146',
    description: 'Filtro universal RD40 Classe AX contra compostos orgânicos de baixo ponto de ebulição (< 65°C) como acetona, éter e cloreto de metileno.',
    features: ['Carvão microporoso especial de alto poder de adsorção de gases voláteis'],
    standards: ['EN 14387', 'ABNT NBR 13696'],
    applications: ['Fabricação de calçados', 'Indústria química de polímeros', 'Manipulação de solventes voláteis']
  },
  'bls 502': {
    caNumber: '44540',
    internalCode: '903310',
    description: 'Respirador dobrável descartável PFF2 sem válvula. Estrutura de 3 painéis que se adapta a diferentes formatos de face com excelente vedação.',
    features: ['Clipe nasal integrado de fácil conformação', 'Elásticos soldados por ultrassom que não pinçam a orelha'],
    standards: ['ABNT NBR 13698:2011 (PFF2)', 'Inmetro', 'C.A. Ativo'],
    applications: ['Construção civil', 'Serralheria', 'Poeiras de cimento, madeira e cal']
  },
  'bls 512': {
    caNumber: '44541',
    internalCode: '903320',
    description: 'Respirador dobrável PFF2 com válvula de exalação de alto fluxo para redução do calor interno.',
    features: ['Válvula de exalação que facilita a saída de ar quente', 'Excelente conforto em dias quentes'],
    standards: ['ABNT NBR 13698', 'Inmetro', 'C.A. Ativo'],
    applications: ['Ambientes quentes e úmidos', 'Usinagem', 'Cargas e descargas de grãos']
  },
  'bls 102v': {
    caNumber: '44542',
    internalCode: '903330',
    description: 'Respirador tipo concha PFF2 com válvula. Carcaça rígida pré-moldada resistente ao colapso mecânico sob umidade.',
    features: ['Formato anatômico em concha', 'Almofada nasal interna macia', 'Válvula de exalação'],
    standards: ['ABNT NBR 13698', 'C.A. Ativo'],
    applications: ['Fundições', 'Mineração', 'Metalurgia e corte']
  },
  'bls 680': {
    caNumber: '44543',
    internalCode: '903340',
    description: 'Respirador com camada de carvão ativado PFF2 para retenção de odores incômodos de vapores orgânicos e ozônio.',
    features: ['Meio filtrante eletrostático + manta de carvão ativado virgem', 'Válvula de exalação'],
    standards: ['ABNT NBR 13698', 'C.A. Ativo'],
    applications: ['Soldagem', 'Pintura a pincel/rolo', 'Tratamento de resíduos']
  },
  'bls zer0': {
    caNumber: '44544',
    internalCode: '903350',
    description: 'Respirador descartável de máxima tecnologia PFF3 (eficiência > 99.95%) com resistência a fluidos e menor resistência respiratória do mercado.',
    features: [
      'Camada externa de microfibra hidrofóbica com barreira mecânica',
      'Eficiência PFF3 contra partículas ultrafinas e aerossóis biológicos/químicos'
    ],
    standards: ['EN 149:2001+A1:2009 FFP3 R D', 'ABNT NBR 13698 (PFF3)', 'C.A. Ativo'],
    applications: ['Indústria nuclear e farmacêutica', 'Fumos de metais pesados', 'Nanotecnologia']
  },
  'g01': {
    caNumber: '44525',
    internalCode: '903110',
    description: 'Cartucho químico contra Vapores Orgânicos (VO). Contém carvão ativado virgem com tratamento térmico avançado de alta capacidade de adsorção de solventes.',
    features: [
      'Carvão ativado de granulometria controlada com fluxo laminar de ar',
      'Conexão tipo baioneta compatível com respiradores Libus série 9000',
      'Excelente durabilidade e resistência à umidade ambiente'
    ],
    standards: ['ABNT NBR 13696:2010', 'NIOSH 42 CFR 84', 'C.A. Ativo MTE'],
    applications: ['Pinturas automotivas e industriais', 'Manuseio de vernizes, solventes, thinner, tolueno e xileno', 'Resinas e adesivos']
  },
  'g02': {
    caNumber: '44526',
    internalCode: '903120',
    description: 'Cartucho químico contra Gases Ácidos (GA). Desenvolvido especificamente para neutralização de cloreto de hidrogênio, dióxido de enxofre e cloro.',
    features: [
      'Meio filtrante impregnado com catalisadores químicos de neutralização rápida',
      'Carcaça plástica resistente a corrosão química e deformação mecânica'
    ],
    standards: ['ABNT NBR 13696', 'C.A. Ativo MTE'],
    applications: ['Galvanoplastia e banhos de ácido', 'Tratamento químico de superfícies', 'Indústria de papel e celulose', 'Decapagem']
  },
  'g03': {
    caNumber: '44527',
    internalCode: '903130',
    description: 'Cartucho combinado contra Vapores Orgânicos e Gases Ácidos (VO/GA). Máxima versatilidade para ambientes industriais com múltiplos agentes químicos.',
    features: [
      'Camada dupla de carvão ativado com neutralizadores simultâneos',
      'Proteção contra solventes, névoas ácidas e vapores combinados'
    ],
    standards: ['ABNT NBR 13696', 'C.A. Ativo MTE'],
    applications: ['Indústria petroquímica', 'Refinarias', 'Laboratórios de análise', 'Tratamento de efluentes industriais']
  },
  'p3': {
    caNumber: '44528',
    internalCode: '903210',
    description: 'Filtro mecânico de alta eficiência tipo panqueca (P3/P100). Eficiência de filtração mínima de 99.97% contra poeiras, névoas, fumos metálicos e radionuclídeos.',
    features: [
      'Microfibras sintéticas com carga eletrostática permanente de alta retenção',
      'Encapsulamento ultra flexível e leve que não desbalanceia a máscara',
      'Resistência comprovada à saturação por aerossóis oleosos e não-oleosos'
    ],
    standards: ['ABNT NBR 13697:2010 (Filtros Mecânicos P3)', 'NIOSH P100', 'C.A. Ativo MTE'],
    applications: ['Soldagem pesada (fumos de cádmio, chumbo, cromo)', 'Mineração e poeiras de sílica', 'Lixamento de fibra de vidro', 'Fundições']
  },
  'p3 alivio': {
    caNumber: '44529',
    internalCode: '903220',
    description: 'Filtro mecânico P3 com camada adicional de carvão ativado para alívio de odores incômodos de vapores orgânicos e gases ácidos abaixo do limite de tolerância (LT).',
    features: [
      'Filtração mecânica 99.97% P3 combinada com adsorção de odores irritantes',
      'Ideal para processos de soldagem com óleos protetivos e ozônio'
    ],
    standards: ['ABNT NBR 13697', 'C.A. Ativo MTE'],
    applications: ['Solda TIG/MIG com ozônio', 'Processos de fundição com resinas', 'Manutenção em estações de esgoto', 'Desengraxe']
  }
};

async function updateProductDescriptions() {
  console.log('Iniciando atualização de descrições ricas dos produtos Libus...');

  const products = await prisma.libusProduct.findMany({
    include: { category: { include: { family: true } } }
  });

  console.log(`Encontrados ${products.length} produtos Libus para enriquecimento.`);

  let updatedCount = 0;

  for (const prod of products) {
    const pName = prod.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    // Buscar no dicionário
    let matchedKey: string | null = null;
    for (const key of Object.keys(productSpecs)) {
      if (pName.includes(key)) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      const spec = productSpecs[matchedKey];
      await prisma.libusProduct.update({
        where: { id: prod.id },
        data: {
          description: spec.description,
          caNumber: prod.caNumber || spec.caNumber,
          internalCode: prod.internalCode || spec.internalCode
        }
      });
      updatedCount++;
      console.log(`[✓ Enriquecido] ${prod.name} -> CA: ${spec.caNumber} / Cód: ${spec.internalCode}`);
    } else {
      // Descrição padrão inteligente com base na categoria
      const catName = prod.category?.name || 'Equipamento de Proteção Individual';
      const famName = prod.category?.family?.name || 'Proteção';
      const defaultDesc = `EPI oficial Libus do Brasil para ${famName} (${catName}). Desenvolvido com materiais de alto desempenho conforme os critérios da Norma Regulamentadora NR-6, oferecendo excelente ergonomia, alta durabilidade e proteção certificada para o trabalhador em campo.`;

      await prisma.libusProduct.update({
        where: { id: prod.id },
        data: {
          description: defaultDesc
        }
      });
      console.log(`[• Padrão] ${prod.name}`);
    }
  }

  console.log(`Sucesso! ${updatedCount} produtos enriquecidos com especificações normativas detalhadas.`);
}

updateProductDescriptions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
