import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import xlsx from 'xlsx';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seed Limpo e Consolidado do Libus Partner ---');

  // Limpar tabelas de dados de catálogo e avaliações para carga limpa e padronizada
  await prisma.evaluationCriterionResponse.deleteMany();
  await prisma.evaluationEconomicResult.deleteMany();
  await prisma.evaluationComparison.deleteMany();
  await prisma.evaluationParticipant.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.productEquivalence.deleteMany();
  await prisma.productAttributeValue.deleteMany();
  await prisma.technicalAttribute.deleteMany();
  await prisma.competitorProduct.deleteMany();
  await prisma.competitorManufacturer.deleteMany();
  await prisma.libusProduct.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productFamily.deleteMany();

  // 1. Criar Usuários Padrão (Admin, Gestor, Técnico)
  const passwordHash = await bcrypt.hash('libus123', 8);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@libus.com.br' },
    update: {},
    create: {
      name: 'Administrador Libus',
      email: 'admin@libus.com.br',
      passwordHash,
      role: 'ADMIN',
      active: true
    }
  });

  const gestor = await prisma.user.upsert({
    where: { email: 'gestor@libus.com.br' },
    update: {},
    create: {
      name: 'Carlos Gestor Nacional',
      email: 'gestor@libus.com.br',
      passwordHash,
      role: 'GESTOR',
      active: true
    }
  });

  const tecnico = await prisma.user.upsert({
    where: { email: 'tecnico@libus.com.br' },
    update: {},
    create: {
      name: 'Ariel Técnico Especialista',
      email: 'tecnico@libus.com.br',
      passwordHash,
      role: 'TECNICO',
      active: true,
      superiorId: gestor.id
    }
  });

  console.log('✓ Usuários configurados.');

  // 2. Criar Empresas de Exemplo
  const empresa1 = await prisma.company.upsert({
    where: { id: 'empresa-vale-01' },
    update: {},
    create: {
      id: 'empresa-vale-01',
      tradeName: 'Mineração Vale do Sul',
      corporateName: 'Vale do Sul Mineração S/A',
      cnpj: '12.345.678/0001-90',
      segment: 'Mineração e Metalurgia',
      state: 'MG',
      city: 'Belo Horizonte',
      contactName: 'Marcos Segurança',
      contactEmail: 'marcos.sesmt@valedosul.com.br',
      contactPhone: '(31) 98765-4321'
    }
  });

  const empresa2 = await prisma.company.upsert({
    where: { id: 'empresa-ind-02' },
    update: {},
    create: {
      id: 'empresa-ind-02',
      tradeName: 'Indústria Metalúrgica Paulista',
      corporateName: 'Metal Paulista Ltda',
      cnpj: '98.765.432/0001-10',
      segment: 'Indústria Automotiva',
      state: 'SP',
      city: 'São Bernardo do Campo',
      contactName: 'Juliana Compras',
      contactEmail: 'juliana.suprimentos@metalpaulista.com.br',
      contactPhone: '(11) 99887-7665'
    }
  });

  console.log('✓ Empresas configuradas.');

  // 3. Famílias Principais
  const familiesData = [
    { name: 'Proteção da Cabeça', slug: 'cabeca', description: 'Capacetes de segurança e suspensões' },
    { name: 'Proteção Visual', slug: 'visual', description: 'Óculos de segurança e ampla visão' },
    { name: 'Proteção Auditiva', slug: 'auditiva', description: 'Protetores auditivos tipo plug e abafadores' },
    { name: 'Proteção Facial', slug: 'facial', description: 'Protetores faciais de alto impacto e tela' },
    { name: 'Proteção Respiratória', slug: 'respiratoria', description: 'Peças faciais, semifaciais, cartuchos e filtros' }
  ];

  const familiesMap = new Map<string, string>();
  for (const fam of familiesData) {
    const f = await prisma.productFamily.create({ data: fam });
    familiesMap.set(fam.slug, f.id);
  }

  // 4. Categorias
  const categoriesData = [
    { familySlug: 'cabeca', name: 'Capacetes de Segurança', slug: 'capacetes' },
    { familySlug: 'visual', name: 'Óculos de Segurança', slug: 'oculos' },
    { familySlug: 'auditiva', name: 'Protetores Auditivos (Plug)', slug: 'plugs' },
    { familySlug: 'auditiva', name: 'Abafadores de Ruído', slug: 'abafadores' },
    { familySlug: 'facial', name: 'Protetores Faciais', slug: 'faciais' },
    { familySlug: 'respiratoria', name: 'Máscaras e Respiradores', slug: 'mascaras' },
    { familySlug: 'respiratoria', name: 'Cartuchos e Filtros', slug: 'cartuchos-filtros' }
  ];

  const catMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const famId = familiesMap.get(cat.familySlug)!;
    const c = await prisma.productCategory.create({
      data: { familyId: famId, name: cat.name, slug: cat.slug }
    });
    catMap.set(cat.slug, c.id);
    catMap.set(cat.name, c.id);
  }

  console.log('✓ Famílias e Categorias configuradas.');

  // 5. Ler e popular a partir da Planilha Mestre Consolidada
  const masterFilePath = 'C:/Users/Ariel Matos/Desktop/PROJETO LIBUS/BASE_MESTRE_DEPARA_LIBUS_PARTNER_2026.xlsx';
  if (!fs.existsSync(masterFilePath)) {
    throw new Error('Planilha mestre não encontrada: ' + masterFilePath);
  }

  const wbMaster = xlsx.readFile(masterFilePath);
  const deParaRows = xlsx.utils.sheet_to_json<any>(wbMaster.Sheets['DE_PARA_CONSOLIDADO']);
  const criteriaRows = xlsx.utils.sheet_to_json<any>(wbMaster.Sheets['CRITERIOS_TECNICOS']);

  // Mapas em memória para evitar duplicatas
  const manufacturersCache = new Map<string, string>(); // Name -> ID
  const libusProductsCache = new Map<string, string>(); // Name+CatId -> ID
  const competitorProductsCache = new Map<string, string>(); // Name+ManufId+CatId -> ID
  const technicalAttributesCache = new Map<string, string>(); // Name+CatId -> ID

  console.log(`Carregando ${deParaRows.length} pares De-Para da Planilha Mestre...`);

  for (const row of deParaRows) {
    const categoryName = row['Categoria'];
    let catId = catMap.get(categoryName);
    if (!catId) {
      if (/Capacete/i.test(categoryName)) catId = catMap.get('capacetes')!;
      else if (/Óculos/i.test(categoryName)) catId = catMap.get('oculos')!;
      else if (/Plug/i.test(categoryName)) catId = catMap.get('plugs')!;
      else if (/Abafador/i.test(categoryName)) catId = catMap.get('abafadores')!;
      else if (/Facial/i.test(categoryName)) catId = catMap.get('faciais')!;
      else if (/Respirador|Facial/i.test(categoryName)) catId = catMap.get('mascaras')!;
      else catId = catMap.get('cartuchos-filtros')!;
    }

    const libusProdName = row['Produto Libus'];
    const compManufName = row['Fabricante Concorrente'];
    const compProdName = row['Produto Concorrente'];

    // 1. Fabricante Concorrente Único
    let manufId = manufacturersCache.get(compManufName);
    if (!manufId) {
      let m = await prisma.competitorManufacturer.findFirst({ where: { name: compManufName } });
      if (!m) {
        m = await prisma.competitorManufacturer.create({ data: { name: compManufName, active: true } });
      }
      manufId = m.id;
      manufacturersCache.set(compManufName, manufId);
    }

    // 2. Produto Libus
    const libusKey = `${libusProdName}_${catId}`;
    let libusProdId = libusProductsCache.get(libusKey);

    // Associar foto do produto Libus de alta qualidade
    const libusImageFilename = (function(name: string) {
      const n = name.toLowerCase();
      if (n.includes('milenium class') || n.includes('milienium class')) return '/products/libus_do_brasil_milienium_class.png';
      if (n.includes('milenium')) return '/products/milenium.png';
      if (n.includes('genesis')) return '/products/libus_do_brasil_genesis.png';
      if (n.includes('andes')) return '/products/libus_do_brasil_andes.png';
      if (n.includes('ecoline')) return '/products/libus_do_brasil_ecoline.png';
      if (n.includes('argon elite')) return '/products/libus_do_brasil_argon_elite.png';
      if (n.includes('argon')) return '/products/libus_do_brasil_argon.png';
      if (n.includes('neon')) return '/products/libus_do_brasil_neon.png';
      if (n.includes('mig')) return '/products/libus_do_brasil_mig.png';
      if (n.includes('eco sport') || n.includes('eco plus')) return '/products/libus_do_brasil_eco_sport.png';
      if (n.includes('new classic') || n.includes('classic')) return '/products/libus_do_brasil_new_classic.png';
      if (n.includes('quantum')) return '/products/libus_do_brasil_quantum.png';
      if (n.includes('l-320v') || n.includes('l320v')) return '/products/libus_do_brasil_l320v.png';
      if (n.includes('l-340v') || n.includes('l340v')) return '/products/libus_do_brasil_l340v.png';
      if (n.includes('l-360v') || n.includes('l360v')) return '/products/libus_do_brasil_l360v.png';
      if (n.includes('l-360c') || n.includes('l360c')) return '/products/libus_do_brasil_l360c.png';
      if (n.includes('l-320c') || n.includes('l320c')) return '/products/libus_do_brasil_l320c.png';
      if (n.includes('l-340c') || n.includes('l340c')) return '/products/libus_do_brasil_l340c.png';
      if (n.includes('bolha')) return '/products/libus_do_brasil_facial_bolha.png';
      if (n.includes('plano')) return '/products/libus_do_brasil_facial_plano.png';
      if (n.includes('tela')) return '/products/libus_do_brasil_facial_tela.png';
      if (n.includes('cilíndrico') || n.includes('cilindrico')) return '/products/libus_do_brasil_facial_cilindrico.png';
      if (n.includes('9000') && n.includes('silicone')) return '/products/libus_resp_9000_silicone.png';
      if (n.includes('9000') && (n.includes('tpe') || n.includes('semifacial'))) return '/products/libus_resp_9000_tpe.png';
      if (n.includes('9000') && n.includes('inteira')) return '/products/libus_resp_9000_full.png';
      if (n.includes('g01')) return '/products/libus_resp_g01.png';
      if (n.includes('g02')) return '/products/libus_resp_g02.png';
      if (n.includes('g03')) return '/products/libus_resp_g03.png';
      if (n.includes('p3') && n.includes('alívio')) return '/products/libus_resp_p3_alivio.png';
      if (n.includes('p3')) return '/products/libus_resp_p3.png';

      // Linha BLS
      if (n.includes('5600') || n.includes('5700') || n.includes('5150')) return '/products/libus_resp_9000_full.png';
      if (n.includes('4000 next s') || n.includes('4000s')) return '/products/libus_resp_9000_silicone.png';
      if (n.includes('4000 next') || n.includes('4000')) return '/products/libus_resp_9000_tpe.png';
      if (n.includes('bls 211') || n.includes('bls 213') || n.includes('bls 244') || n.includes('bls 243')) return '/products/libus_resp_g01.png';
      if (n.includes('bls 201-3c')) return '/products/libus_resp_p3_alivio.png';
      if (n.includes('bls 201-3') || n.includes('bls 202')) return '/products/libus_resp_p3.png';
      if (n.includes('bls 221') || n.includes('bls 222')) return '/products/libus_resp_g03.png';
      if (n.includes('bls 430') || n.includes('bls 414') || n.includes('bls 412')) return '/products/libus_resp_g02.png';
      if (n.includes('bls 502') || n.includes('bls 512') || n.includes('bls 102v') || n.includes('bls 680') || n.includes('bls zer0')) return '/products/3m_aura_9320.png';
      return null;
    })(libusProdName);

    if (!libusProdId) {
      let lp = await prisma.libusProduct.findFirst({ where: { name: libusProdName, categoryId: catId } });
      if (!lp) {
        lp = await prisma.libusProduct.create({
          data: {
            name: libusProdName,
            categoryId: catId,
            description: `Linha Oficial Libus Homologada`,
            imageUrl: libusImageFilename
          }
        });
      } else if (libusImageFilename && !lp.imageUrl) {
        lp = await prisma.libusProduct.update({
          where: { id: lp.id },
          data: { imageUrl: libusImageFilename }
        });
      }
      libusProdId = lp.id;
      libusProductsCache.set(libusKey, libusProdId);
    }

    // 3. Produto Concorrente com Mapeamento de Imagem
    const compImageFilename = (function(manuf: string, prod: string) {
      const m = manuf.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      const p = prod.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

      // 3M
      if (m.includes('3m')) {
        if (p.includes('h-700') || p.includes('h700')) return '/products/3m_h700.png';
        if (p.includes('2790')) return '/products/3m_2790.png';
        if (p.includes('pomp plus') || p.includes('pomp')) return '/products/3m_pomp_plus.png';
        if (p.includes('muffler acoplado')) return '/products/3m_pomp_muffler_acoplado.png';
        if (p.includes('muffler')) return '/products/3m_pomp_muffler.png';
        if (p.includes('milenium')) return '/products/3m_pomp_milenium.png';
        if (p.includes('h10p3e') || (p.includes('h10') && p.includes('acoplado'))) return '/products/3m_peltor_h10p3e.png';
        if (p.includes('h10a') || p.includes('h10')) return '/products/3m_h10a.png';
        if (p.includes('h6p3e') || (p.includes('h6') && p.includes('acoplado'))) return '/products/3m_peltor_h6p3e.png';
        if (p.includes('h6a') || p.includes('h6')) return '/products/3m_peltor_h6a.png';
        if (p.includes('h9p3e') || (p.includes('h9') && p.includes('acoplado'))) return '/products/3m_h9p3e.png';
        if (p.includes('h9a') || p.includes('h9')) return '/products/3m_peltor_h9a.png';
        if (p.includes('w96') || p.includes('esferico') || p.includes('bolha')) return '/products/3m_facial_bolha_3m.png';
        if (p.includes('wp96') || p.includes('cilindrico') || p.includes('plano')) return '/products/3m_facial_plano_3m.png';
        if (p.includes('6200') || p.includes('hf800') || p.includes('hf-800') || p.includes('6000')) return '/products/3m_serie_6200.png';
        if (p.includes('7502') || p.includes('7500')) return '/products/3m_serie_7502.png';
        if (p.includes('6800') || p.includes('ff-400') || p.includes('ff400')) return '/products/3m_serie_6800.png';
        if (p.includes('60926') || p.includes('60928')) return '/products/3m_cartucho_60926.png';
        if (p.includes('60921') || p.includes('60923')) return '/products/3m_cartucho_60921.png';
        if (p.includes('6001')) return '/products/3m_cartucho_6001.png';
        if (p.includes('6002')) return '/products/3m_cartucho_6002.png';
        if (p.includes('6003') || p.includes('6006') || p.includes('6004') || p.includes('6005')) return '/products/3m_cartucho_6003.png';
        if (p.includes('2091') || p.includes('7093')) return '/products/3m_filtro_2091.png';
        if (p.includes('2097') || p.includes('2096')) return '/products/3m_filtro_2097.png';
        if (p.includes('9320') || p.includes('9320+')) return '/products/3m_aura_9320.png';
        if (p.includes('9322') || p.includes('9322+')) return '/products/3m_aura_9322.png';
        if (p.includes('9332') || p.includes('9332+')) return '/products/3m_aura_9332.png';
        if (p.includes('8822') || p.includes('8801')) return '/products/3m_concha_8822.png';
        if (p.includes('8023') || p.includes('8577') || p.includes('8212')) return '/products/3m_carvao_8023.png';
        if (p.includes('8214') || p.includes('8514') || p.includes('solda')) return '/products/3m_solda_8214.png';
      }

      // MSA
      if (m.includes('msa') || m.includes('m_s_a')) {
        if (p.includes('a2p3') || p.includes('d1040000')) return '/products/msa_filtro_a2p3.png';
        if (p.includes('abek2p3') || p.includes('d1051700')) return '/products/msa_filtro_abek2p3.png';
        if (p.includes('classe ax') || p.includes('série 90') || p.includes('serie 90')) return '/products/msa_filtro_ax.png';
        if (p.includes('advantage 200') || p.includes('advantage 420') || p.includes('advantage')) return '/products/msa_advantage_200.png';
        if (p.includes('ultravue') || p.includes('3000 twin')) return '/products/msa_advantage_420.png';
        if (p.includes('gme') || p.includes('gma') || p.includes('gmb') || p.includes('gmc') || p.includes('gmd') || p.includes('multi gas') || p.includes('smart') || p.includes('cartucho msa')) return '/products/msa_cartucho_gme.png';
        if (p.includes('flexifilter') || p.includes('flexi-filter') || p.includes('p100') || p.includes('filtro msa')) return '/products/msa_filtro_flexifilter.png';
        if (p.includes('v-gard') || p.includes('vgard')) return '/products/m_s_a_v_gard_m_s_a.png';
        if (p.includes('phoenix')) return '/products/m_s_a_phoenix.png';
        if (p.includes('sunbird')) return '/products/m_s_a_sunbird.png';
        if (p.includes('sparrow')) return '/products/m_s_a_sparrow.png';
        if (p.includes('altimiter')) return '/products/m_s_a_altimiter.png';
        if (p.includes('albatross')) return '/products/m_s_a_albatross.png';
        if (p.includes('harrier')) return '/products/msa_harrier.png';
        if (p.includes('kit xls') || (p.includes('xls') && p.includes('acoplado'))) return '/products/m_s_a_kit_xls.png';
        if (p.includes('xls')) return '/products/m_s_a_xls.png';
        if (p.includes('kit hpe') || (p.includes('hpe') && p.includes('acoplado'))) return '/products/m_s_a_kit_hpe.png';
        if (p.includes('hpe')) return '/products/m_s_a_hpe.png';
        if (p.includes('kit mark') || (p.includes('mark') && p.includes('acoplado'))) return '/products/m_s_a_kit_markv.png';
        if (p.includes('mark v') || p.includes('mark')) return '/products/m_s_a_mark_v.png';
        if (p.includes('facial')) return '/products/m_s_a_facial_m_sa.png';
      }

      // HONEYWELL / NORTH
      if (m.includes('honeywell') || m.includes('north')) {
        if (p.includes('hm500')) return '/products/honeywell_hm500.png';
        if (p.includes('7700') || p.includes('ru6500')) return '/products/honeywell_north_7700.png';
        if (p.includes('5500') || p.includes('5400')) return '/products/honeywell_north_5500.png';
        if (p.includes('75scp100') || p.includes('defender p100')) return '/products/honeywell_defender_p100.png';
        if (p.includes('75scl') || p.includes('defender')) return '/products/honeywell_defender_multigas.png';
        if (p.includes('pancake')) return '/products/honeywell_n_series_pancake.png';
        if (p.includes('df300')) return '/products/honeywell_df300.png';
        if (p.includes('dc301') || p.includes('dc300')) return '/products/honeywell_dc301.png';
        if (p.includes('n7500') || p.includes('n-series') || p.includes('cartucho') || p.includes('filtro')) return '/products/honeywell_cartucho_n75001.png';
        if (p.includes('bionic')) return '/products/honeywell_bionic_shield.png';
        if (p.includes('uvex')) return '/products/honeywell_uvex_stealth.png';
      }

      // DELTA PLUS
      if (m.includes('delta plus') || m.includes('deltaplus')) {
        if (p.includes('diamond')) return '/products/delta_plus_diamond.png';
        if (p.includes('fuji 250') || p.includes('fuji')) return '/products/fuji_250.png';
        if (p.includes('brava 200') || p.includes('brava')) return '/products/brava_200.png';
        if (p.includes('interlagos 2') || p.includes('interlagos')) return '/products/delta_plus_interlagos2.png';
        if (p.includes('interlagos light')) return '/products/delta_plus_interlagos_light.png';
        if (p.includes('magny cours') || p.includes('magny-cours')) return '/products/delta_plus_magny_cours_2.png';
        if (p.includes('inter pro')) return '/products/delta_plus_inter_pro_para_capacete.png';
      }

      // STEELFLEX
      if (m.includes('steelflex') || m.includes('steeflex')) {
        if (p.includes('falcon')) return '/products/falcon.png';
        if (p.includes('stx')) return '/products/steeflex_stx.png';
        if (p.includes('work')) return '/products/steeflex_work.png';
        if (p.includes('swat')) return '/products/steeflex_swat.png';
        if (p.includes('imola')) return '/products/steeflex_imola.png';
        if (p.includes('pro 100') || p.includes('pro100')) return '/products/sthslflex_shell_pro_100.png';
        if (p.includes('pro 300') || p.includes('pro300')) return '/products/steelfekx_shell_pro_300.png';
        if (p.includes('pro 400') || p.includes('pro400')) return '/products/steeflex_shell_pro_400.png';
        if (p.includes('max')) return '/products/steeflex_shell_max.png';
      }

      // DANNY
      if (m.includes('danny')) {
        if (p.includes('aguia')) return '/products/danny_aguia.png';
        if (p.includes('fenix')) return '/products/danny_fenix.png';
        if (p.includes('aerial')) return '/products/danny_aerial.png';
        if (p.includes('apollo')) return '/products/danny_apollo.png';
        if (p.includes('igor')) return '/products/danny_igor.png';
      }

      // CARBOGRAFITE
      if (m.includes('carbografite')) {
        if (p.includes('supervision')) return '/products/carbografite_supervision.png';
        if (p.includes('spectra 2000') || p.includes('spectra')) return '/products/carbografite_spectra_2000.png';
        if (p.includes('cayman')) return '/products/carbografite_cayman.png';
        if (p.includes('evolution')) return '/products/carbografite_evolution.png';
        if (p.includes('infinit')) return '/products/carbografite_infinit.png';
        if (p.includes('spyder')) return '/products/carbografite_spyder.png';
        return '/products/carbografite_carbografite.png';
      }

      // KALIPSO
      if (m.includes('kalipso') || m.includes('kalypso')) {
        if (p.includes('leopardo')) return '/products/kalipso_leopardo.png';
        if (p.includes('jaguar')) return '/products/kalipso_jaguar.png';
        if (p.includes('jamaica')) return '/products/kalipso_jamaica.png';
        if (p.includes('parati')) return '/products/kalipso_parati.png';
        if (p.includes('tahiti')) return '/products/kalipso_tahiti.png';
        if (p.includes('veneza')) return '/products/kalipso_veneza.png';
        if (p.includes('k-70') || p.includes('k70')) return '/products/kalypso_k_70.png';
      }

      // CAMPER
      if (m.includes('camper')) {
        if (p.includes('avant')) return '/products/avant.png';
        if (p.includes('spot')) return '/products/camper_spot.png';
        if (p.includes('bolha')) return '/products/camper_bolha_camper.png';
        if (p.includes('inter pro')) return '/products/camper_inter_pro_ultra.png';
        return '/products/camper_camper.png';
      }

      // OUTROS FABRICANTES
      if (m.includes('ledan')) return '/products/capacete_2001.png';
      if (m.includes('plastcor')) return '/products/plastcor_plastcor.png';
      if (m.includes('prosafety') || m.includes('pro safety')) return '/products/prosafety_prosafety.png';
      if (m.includes('ultramaster')) return '/products/ultramaster_ultramaster.png';
      if (m.includes('super safety')) return '/products/ss2_super_safety.png';
      if (m.includes('summer clean')) return '/products/summer_clean_pro_safety.png';

      // MOLDEX (Respiratória BLS)
      if (m.includes('moldex')) {
        if (p.includes('7000') || p.includes('7800') || p.includes('8000')) return '/products/moldex_serie_7000.png';
        if (p.includes('7940') || p.includes('7950') || p.includes('7960') || p.includes('7990')) return '/products/moldex_filtro_7940.png';
        if (p.includes('7100') || p.includes('7300') || p.includes('7400') || p.includes('7600')) return '/products/3m_cartucho_6001.png';
        if (p.includes('2200') || p.includes('2300') || p.includes('2400') || p.includes('2740') || p.includes('2800') || p.includes('2940')) return '/products/moldex_descartavel_2200.png';
        return '/products/moldex_serie_7000.png';
      }

      // AIR SAFETY (Respiratória BLS)
      if (m.includes('air safety') || m.includes('airsafety')) {
        if (p.includes('ffs990') || p.includes('ffs')) return '/products/air_safety_ffs990.png';
        if (p.includes('s950') || p.includes('s900')) return '/products/3m_serie_6200.png';
        if (p.includes('f600') || p.includes('f700') || p.includes('f200') || p.includes('cartucho')) return '/products/air_safety_cartucho.png';
        if (p.includes('d801') || p.includes('d802') || p.includes('d803') || p.includes('d804') || p.includes('2280')) return '/products/3m_aura_9320.png';
        return '/products/air_safety_cartucho.png';
      }

      // GERSON (Respiratória BLS)
      if (m.includes('gerson')) {
        if (p.includes('g01') || p.includes('g03') || p.includes('g08') || p.includes('g71') || p.includes('g78')) return '/products/gerson_cartucho_g01.png';
        if (p.includes('gx') || p.includes('p100') || p.includes('filtro')) return '/products/gerson_filtro_gx.png';
        if (p.includes('1730') || p.includes('1740') || p.includes('1745') || p.includes('6925') || p.includes('3230')) return '/products/gerson_descartavel.png';
        return '/products/gerson_cartucho_g01.png';
      }

      // TAYCO / PROTECH / GVS / ALLTEC (Respiratória BLS)
      if (m.includes('tayco')) {
        if (p.includes('t-9550') || p.includes('t9550') || p.includes('9550')) return '/products/tayco_t9550.png';
        if (p.includes('t-9500') || p.includes('t9500') || p.includes('9500')) return '/products/tayco_t9500.png';
        return '/products/tayco_t9500.png';
      }
      if (m.includes('protech')) {
        if (p.includes('7800') || p.includes('7600')) return '/products/protech_7800.png';
        return '/products/protech_7800.png';
      }
      if (m.includes('gvs')) {
        return '/products/3m_serie_6200.png';
      }
      if (m.includes('alltec')) {
        return '/products/3m_serie_6200.png';
      }
      if (m.includes('summer clean')) return '/products/summer_clean_pro_safety.png';
      if (m.includes('uvex') || m.includes('honeywell')) {
        if (p.includes('skyper')) return '/products/uvex_skyper.png';
        if (p.includes('vapor')) return '/products/uvex_vapor_ii.png';
        if (p.includes('stealth')) return '/products/honeywell_uvex_stealth.png';
        if (p.includes('bionic')) return '/products/honeywell_bionic_shield.png';
        if (p.includes('th1') || p.includes('th2')) return '/products/honeywell_th1_th2.png';
      }
      if (m.includes('vicsa')) {
        if (p.includes('everest')) return '/products/vicsa_everest.png';
        if (p.includes('visor')) return '/products/vicsa_visor_i_1.png';
      }
      if (m.includes('maxi royal') || m.includes('maxi')) return '/products/maxi_royal_maxi_royal.png';
      if (m.includes('bsb')) return '/products/bsb_steelflex.png';
      if (m.includes('elastobor')) return '/products/elastobor_facial_tela.png';
      if (m.includes('tecmater')) return '/products/tecmater_facial_tela.png';

      return null;
    })(compManufName, compProdName);

    const compKey = `${compProdName}_${manufId}_${catId}`;
    let compProdId = competitorProductsCache.get(compKey);
    if (!compProdId) {
      let cp = await prisma.competitorProduct.findFirst({
        where: { name: compProdName, manufacturerId: manufId, categoryId: catId }
      });
      if (!cp) {
        cp = await prisma.competitorProduct.create({
          data: {
            name: compProdName,
            manufacturerId: manufId,
            categoryId: catId,
            description: `Modelo Concorrente Equivalente`,
            imageUrl: compImageFilename
          }
        });
      } else if (compImageFilename && !cp.imageUrl) {
        cp = await prisma.competitorProduct.update({
          where: { id: cp.id },
          data: { imageUrl: compImageFilename }
        });
      }
      compProdId = cp.id;
      competitorProductsCache.set(compKey, compProdId);
    }

    // 4. Par de Equivalência 1x1
    const existingEq = await prisma.productEquivalence.findFirst({
      where: { libusProductId: libusProdId, competitorProductId: compProdId }
    });
    if (!existingEq) {
      await prisma.productEquivalence.create({
        data: {
          libusProductId: libusProdId,
          competitorProductId: compProdId,
          active: true,
          notes: row['Origem']
        }
      });
    }
  }

  // 6. Cadastrar Critérios Técnicos Padronizados e Normativos por Categoria
  console.log('Cadastrando critérios técnicos normativos e auditáveis por categoria...');

  const standardizedCriteriaByCategory: Record<string, string[]> = {
    'capacetes': [
      'Absorção de Impacto & Transmissão de Força (NBR 8221 / ANSI Z89.1)',
      'Conforto da Suspensão & Distribuição de Peso (Têxtil / Plástica)',
      'Sistema de Ajuste da Carneira (Catraca / Pino / Ajuste de Altura)',
      'Conforto e Apoio de Nuca em Longas Jornadas',
      'Estabilidade na Cabeça (Fixação com e sem jugular)',
      'Acoplamento de Acessórios (Abafadores, Protetor Facial, Jugular de 3 pontos)',
      'Isolamento Elétrico / Propriedade Dielétrica'
    ],
    'oculos': [
      'Qualidade Óptica & Ausência de Distorção (Classe Óptica 1 - ANSI Z87.1)',
      'Desempenho da Proteção Anti-Embaçante (Anti-Fog)',
      'Resistência a Riscos & Durabilidade da Lente (Hard Coat)',
      'Campo de Visão e Proteção Lateral / Multidirecional',
      'Ergonomia e Conforto na Haste e Apoio Nasal (Ponte Suave)',
      'Compatibilidade com Outros EPIs (Capacete e Abafador)'
    ],
    'plugs': [
      'Nível e Eficiência de Atenuação do Ruído (NRRsf)',
      'Conforto e Maciez de Inserção no Canal Auditivo',
      'Material Hipoalergênico e Biocompatibilidade',
      'Facilidade de Higienização e Durabilidade do Cordão'
    ],
    'abafadores': [
      'Nível de Atenuação Acústica Real no Posto de Trabalho (NRRsf)',
      'Pressão e Conforto das Almofadas circum-auriculares',
      'Ajuste de Altura / Pressão da Haste na Cabeça',
      'Propriedade Dielétrica (Ausência de partes metálicas expostas)',
      'Facilidade de Substituição do Kit de Higiene (Espumas/Almofadas)',
      'Encaixe e Estabilidade quando Acoplado ao Capacete'
    ],
    'faciais': [
      'Resistência a Alto Impacto de Partículas (ANSI Z87.1 - 2mm)',
      'Qualidade Óptica e Amplitude do Campo de Visão Panorâmico',
      'Cobertura Facial e Proteção de Queixo/Têmpora (Formato Bolha / Plano)',
      'Articulação e Estabilidade de Basculamento (Levantar/Abaixar visor)',
      'Compatibilidade de Acoplamento em Capacete / Carneira'
    ],
    'mascaras': [
      'Vedação e Selagem Facial (Conforto do Bocal e Vedação)',
      'Facilidade de Respiração (Baixa Resistência à Inalação/Exalação)',
      'Ajuste e Conforto dos Tirantes Elásticos',
      'Compatibilidade com Óculos de Segurança (Sem embaçamento)',
      'Eficiência do Filtro / Cartucho contra Contaminantes Químicos/Poeiras'
    ],
    'cartuchos-filtros': [
      'Eficiência de Filtração Química / Mecânica (Norma ABNT/NIOSH)',
      'Facilidade de Encaixe e Travamento Tipo Baioneta',
      'Distribuição Balanceada do Peso na Peça Facial',
      'Vida Útil e Resistência à Saturação no Ambiente'
    ]
  };

  for (const [catSlug, criteriaList] of Object.entries(standardizedCriteriaByCategory)) {
    const catId = catMap.get(catSlug);
    if (!catId) continue;

    for (let i = 0; i < criteriaList.length; i++) {
      const critName = criteriaList[i];
      await prisma.technicalAttribute.create({
        data: {
          categoryId: catId,
          name: critName,
          valueType: 'NUMBER',
          unit: 'Nota 1-10',
          orderIndex: i + 1
        }
      });
    }
  }

  // 7. Criar uma Avaliação de Exemplo Completa
  const firstEq = await prisma.productEquivalence.findFirst({
    include: { libusProduct: true, competitorProduct: true }
  });

  if (firstEq) {
    const evalExample = await prisma.evaluation.create({
      data: {
        companyId: empresa2.id,
        leadTechnicianId: tecnico.id,
        status: 'IN_PROGRESS',
        observations: 'Teste no posto de usinagem com equipe do 1º turno.',
        participants: {
          create: [
            { name: 'João da Silva', roleOrArea: 'Operador / Produção' },
            { name: 'Maria Souza', roleOrArea: 'Técnico de Segurança / SESMT' }
          ]
        },
        comparisons: {
          create: [
            {
              libusProductId: firstEq.libusProductId,
              competitorProductId: firstEq.competitorProductId,
              orderIndex: 0
            }
          ]
        }
      },
      include: { comparisons: true }
    });

    const compId = evalExample.comparisons[0].id;
    const attrs = await prisma.technicalAttribute.findMany({
      where: { categoryId: firstEq.libusProduct.categoryId },
      take: 6
    });

    for (const attr of attrs) {
      await prisma.evaluationCriterionResponse.create({
        data: {
          comparisonId: compId,
          attributeId: attr.id,
          libusScore: 9,
          competitorScore: 6,
          isNotApplicable: false
        }
      });
    }

    await prisma.evaluationEconomicResult.create({
      data: {
        comparisonId: compId,
        currentPrice: 42.50,
        libusPrice: 38.90,
        quantity: 120,
        consumptionPeriod: 'ANUAL',
        lifespanCurrent: 6,
        lifespanLibus: 10,
        costCurrentTotal: 42.50 * 120 * (12 / 6),
        costLibusTotal: 38.90 * 120 * (12 / 10),
        costDifference: 3.60,
        economyGenerated: (42.50 * 120 * (12 / 6)) - (38.90 * 120 * (12 / 10)),
        economyPercent: 45.0
      }
    });
  }

  console.log('✓ Seed limpo concluído com 100% de integridade relacional.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
