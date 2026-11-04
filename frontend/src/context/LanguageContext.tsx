import React, { createContext, useContext, useState } from 'react';

export type Language = 'pt' | 'es';

export interface Translations {
  // Navigation & Layout
  navDashboard: string;
  navNewEvaluation: string;
  navEvaluations: string;
  navCatalog: string;
  navCompanies: string;
  navUsers: string;
  navProfile: string;
  navMenu: string;
  headerTitle: string;
  headerSubtitle: string;
  menuOperational: string;
  normativeFooterTitle: string;
  normativeFooterDesc: string;
  logout: string;
  changePassword: string;

  // Common Actions & Badges
  save: string;
  saving: string;
  cancel: string;
  confirm: string;
  delete: string;
  filter: string;
  search: string;
  all: string;
  loading: string;
  viewList: string;
  viewGrid: string;
  active: string;
  inactive: string;
  status: string;
  date: string;
  actions: string;
  details: string;
  open: string;
  back: string;
  next: string;
  newAction: string;

  // Login
  loginTitle: string;
  loginSubtitle: string;
  loginEmailLabel: string;
  loginPasswordLabel: string;
  loginButton: string;
  loginAuthenticating: string;
  loginForgotLink: string;

  // Dashboard Page
  dashBadgeTitle: string;
  dashTitle: string;
  dashSubtitle: string;
  dashNewTestBtn: string;
  dashStatTestsTitle: string;
  dashStatTestsBadge: string;
  dashStatTestsUnit: string;
  dashStatTestsSub: string;
  dashStatCompaniesTitle: string;
  dashStatCompaniesBadge: string;
  dashStatCompaniesUnit: string;
  dashStatCompaniesSub: string;
  dashStatTauTitle: string;
  dashStatTauBadge: string;
  dashStatTauSub: string;
  dashStatCompetitorsTitle: string;
  dashStatCompetitorsBadge: string;
  dashStatCompetitorsSub: string;
  dashTableTitle: string;
  dashTableSubtitle: string;
  dashTableFullHistory: string;
  dashTableEmptyTitle: string;
  dashTableEmptyDesc: string;
  dashTableEmptyBtn: string;
  dashColCompany: string;
  dashColTech: string;
  dashColPairs: string;
  dashColStatus: string;
  dashColDate: string;
  dashColAction: string;
  dashStatusCompleted: string;
  dashStatusInProgress: string;
  dashStatusDraft: string;

  // Catalog Page
  catalogBadge: string;
  catalogTitle: string;
  catalogSubtitle: string;
  catalogNewEvaluationBtn: string;
  catalogManagePhotosActive: string;
  catalogAllFamilies: string;
  catalogCategoryFilter: string;
  catalogAllCategories: string;
  catalogSearchPlaceholder: string;
  catalogNoProductsTitle: string;
  catalogNoProductsDesc: string;
  catalogLibusProposal: string;
  catalogMarketEquiv: string;
  catalogNoCompetitors: string;
  catalogHomologateBtn: string;
  catalogClickTechSheet: string;
  catalogSuperiority: string;

  // Evaluations List Page
  evalListBadge: string;
  evalListTitle: string;
  evalListSubtitle: string;
  evalListNewBtn: string;
  evalListSearchPlaceholder: string;
  evalListFilterAll: string;
  evalListEmptyTitle: string;
  evalListEmptyDesc: string;
  evalListEmptyBtn: string;
  evalListDeleteModalTitle: string;
  evalListDeleteModalDesc: string;

  // New Evaluation Wizard
  wizardTitle: string;
  wizardSubtitle: string;
  wizardStep1Company: string;
  wizardStep2Workstation: string;
  wizardStep3Participants: string;
  wizardStep4Comparisons: string;
  wizardSelectCompany: string;
  wizardSelectWorkstation: string;
  wizardAddParticipant: string;
  wizardAddComparison: string;
  wizardStartEvaluation: string;

  // Evaluation Execution & Scoring
  execBadgePar: string;
  execLibusXComp: string;
  execTabTechnical: string;
  execTabEconomic: string;
  execTabReport: string;
  execNormativeInstruction: string;
  execCriteriaTable: string;
  execScoreSelect: string;
  execScoreExcellence: string;
  execNotApplicable: string;
  execFinishEvaluation: string;
  execSignReportBtn: string;

  // Economic Analysis & TCO
  tcoTitle: string;
  tcoSubtitle: string;
  tcoLibusProposal: string;
  tcoCurrentProduct: string;
  tcoLibusPrice: string;
  tcoCompPrice: string;
  tcoLibusLifespan: string;
  tcoCompLifespan: string;
  tcoAnnualCalculation: string;
  tcoDisposalImpactTitle: string;
  tcoDisposalImpactSubtitle: string;
  tcoDisposalCostUnit: string;
  tcoDisposalCostUnitHint: string;
  tcoProductWeightGrams: string;
  tcoProductWeightGramsHint: string;
  tcoQuantityUsers: string;
  tcoCalculateBtn: string;
  tcoAnnualSavings: string;
  tcoWasteReduced: string;

  // Homologation & Digital Signatures Modal
  modalSignBadge: string;
  modalSignTitle: string;
  modalStep1TechTab: string;
  modalStep2ClientTab: string;
  modalTechSignTitle: string;
  modalTechSignPrompt: string;
  modalTechInstructedCheck: string;
  modalTechNotesLabel: string;
  modalAdvanceToClient: string;
  modalClientSelectParticipant: string;
  modalClientNameLabel: string;
  modalClientRoleLabel: string;
  modalClientDocLabel: string;
  modalClientSignTitle: string;
  modalClientSignPrompt: string;
  modalClearSign: string;
  modalCapturedBadge: string;
  modalBackStep1: string;
  modalSubmitSign: string;
  modalSigningLoading: string;

  // Companies Management
  compBadge: string;
  compTitle: string;
  compSubtitle: string;
  compNewBtn: string;
  compColTradeName: string;
  compColCorporate: string;
  compColCnpj: string;
  compColSegment: string;
  compColLocation: string;
  compColEvaluations: string;
}

const translations: Record<Language, Translations> = {
  pt: {
    // Navigation & Layout
    navDashboard: 'Dashboard',
    navNewEvaluation: 'Nova Avaliação',
    navEvaluations: 'Histórico & Laudos',
    navCatalog: 'Catálogo De-Para',
    navCompanies: 'Empresas & Unidades',
    navUsers: 'Equipe & Gestão',
    navProfile: 'Meu Perfil',
    navMenu: 'Menu',
    headerTitle: 'Homologação Técnica & Comparativo Normativo',
    headerSubtitle: 'Libus • Divisão de Engenharia de Proteção',
    menuOperational: 'Menu Operacional',
    normativeFooterTitle: 'NORMAS TÉCNICAS & CONFORMIDADE',
    normativeFooterDesc: 'Laudos emitidos com base nas normas ABNT NBR, EN e ensaios certificados.',
    logout: 'Encerrar Sessão',
    changePassword: 'Alterar Senha',

    // Common Actions
    save: 'Salvar',
    saving: 'Salvando...',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    filter: 'Filtrar',
    search: 'Buscar',
    all: 'Todas',
    loading: 'Carregando...',
    viewList: 'Lista',
    viewGrid: 'Grade',
    active: 'Ativo',
    inactive: 'Inativo',
    status: 'Status',
    date: 'Data',
    actions: 'Ações',
    details: 'Detalhes',
    open: 'Abrir',
    back: 'Voltar',
    next: 'Avançar',
    newAction: 'Novo',

    // Login
    loginTitle: 'Plataforma de Engenharia & Homologações Técnicas',
    loginSubtitle: 'Acesso corporativo seguro para especialistas de campo e liderança.',
    loginEmailLabel: 'E-mail Corporativo',
    loginPasswordLabel: 'Senha de Acesso',
    loginButton: 'Acessar Plataforma',
    loginAuthenticating: 'Autenticando...',
    loginForgotLink: 'Esqueceu sua senha?',

    // Dashboard Page
    dashBadgeTitle: 'ENGENHARIA DE APLICAÇÃO & HOMOLOGAÇÃO',
    dashTitle: 'Painel de Testes & Laudos',
    dashSubtitle: 'Gestão de ensaios comparativos de EPIs, validação de C.A. e testes práticos de aceitação com colaboradores no posto de trabalho.',
    dashNewTestBtn: 'Novo Teste de Campo',
    dashStatTestsTitle: 'Testes de Campo',
    dashStatTestsBadge: 'VOLUME',
    dashStatTestsUnit: 'laudos',
    dashStatTestsSub: 'em andamento',
    dashStatCompaniesTitle: 'Empresas',
    dashStatCompaniesBadge: 'CLIENTES',
    dashStatCompaniesUnit: 'indústrias',
    dashStatCompaniesSub: 'laudos emitidos',
    dashStatTauTitle: 'Aceitação TAU',
    dashStatTauBadge: 'SESMT',
    dashStatTauSub: 'Conforto & durabilidade',
    dashStatCompetitorsTitle: 'Concorrentes',
    dashStatCompetitorsBadge: 'DE-PARA',
    dashStatCompetitorsSub: 'Marcas testadas 1x1',
    dashTableTitle: 'Laudos e Avaliações de Campo',
    dashTableSubtitle: 'Histórico de homologações e comparativos realizados em clientes',
    dashTableFullHistory: 'Ver Histórico Completo',
    dashTableEmptyTitle: 'Nenhum laudo registrado até o momento.',
    dashTableEmptyDesc: 'Inicie um novo comparativo técnico para coletar notas com os funcionários do cliente.',
    dashTableEmptyBtn: 'Iniciar Primeira Avaliação',
    dashColCompany: 'Empresa Cliente',
    dashColTech: 'Técnico Libus',
    dashColPairs: 'Pares Avaliados (1x1)',
    dashColStatus: 'Status',
    dashColDate: 'Data Registro',
    dashColAction: 'Ação',
    dashStatusCompleted: 'Homologada',
    dashStatusInProgress: 'Em Campo',
    dashStatusDraft: 'Rascunho',

    // Catalog Page
    catalogBadge: 'ENGENHARIA DE PRODUTOS & MATRIZ DE CONVERSÃO',
    catalogTitle: 'Catálogo Oficial Libus & Equivalências',
    catalogSubtitle: 'Portfólio de EPIs Libus com matriz de equivalências técnicas e fotos normativas em fundo transparente.',
    catalogNewEvaluationBtn: 'Nova Homologação',
    catalogManagePhotosActive: 'Gestão de Fotos Ativa',
    catalogAllFamilies: 'Todas as Famílias',
    catalogCategoryFilter: 'Categoria:',
    catalogAllCategories: 'Todas',
    catalogSearchPlaceholder: 'Buscar modelo Libus, concorrente ou C.A...',
    catalogNoProductsTitle: 'Nenhum produto encontrado',
    catalogNoProductsDesc: 'Ajuste os filtros de família ou termo de busca.',
    catalogLibusProposal: 'PROPOSTA LIBUS',
    catalogMarketEquiv: 'Equivalências de Mercado',
    catalogNoCompetitors: 'Nenhum concorrente cadastrado',
    catalogHomologateBtn: 'Homologar',
    catalogClickTechSheet: 'Clique para ver a Ficha Técnica Completa',
    catalogSuperiority: 'Superioridade',

    // Evaluations List Page
    evalListBadge: 'HISTÓRICO OPERACIONAL',
    evalListTitle: 'Histórico de Laudos & Homologações',
    evalListSubtitle: 'Relatórios técnicos gerados com notas comparativas, TCO e validação formal.',
    evalListNewBtn: 'Novo Laudo de Campo',
    evalListSearchPlaceholder: 'Buscar por empresa, técnico ou observações...',
    evalListFilterAll: 'Todos os Status',
    evalListEmptyTitle: 'Nenhuma avaliação encontrada',
    evalListEmptyDesc: 'Tente ajustar os filtros ou crie uma nova homologação.',
    evalListEmptyBtn: 'Criar Avaliação',
    evalListDeleteModalTitle: 'Excluir Avaliação',
    evalListDeleteModalDesc: 'Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.',

    // New Evaluation Wizard
    wizardTitle: 'Nova Avaliação Técnica em Campo',
    wizardSubtitle: 'Configure o cliente, posto de trabalho e pares de produtos para iniciar o ensaio.',
    wizardStep1Company: '1. Empresa & Unidade',
    wizardStep2Workstation: '2. Posto de Trabalho',
    wizardStep3Participants: '3. Participantes',
    wizardStep4Comparisons: '4. Comparativo 1x1',
    wizardSelectCompany: 'Selecione a Empresa Cliente',
    wizardSelectWorkstation: 'Selecione ou digite o posto de trabalho',
    wizardAddParticipant: 'Adicionar Participante',
    wizardAddComparison: 'Adicionar Par Comparativo',
    wizardStartEvaluation: 'Iniciar Avaliação de Campo',

    // Evaluation Execution & Scoring
    execBadgePar: 'PAR COMPARATIVO',
    execLibusXComp: 'Libus x Concorrente',
    execTabTechnical: '1. Avaliação Técnica',
    execTabEconomic: '2. Análise Econômica',
    execTabReport: '3. Laudo Consolidado',
    execNormativeInstruction: 'Avalie cada critério técnico de 1 a 10 juntamente com os colaboradores no posto de trabalho.',
    execCriteriaTable: 'Critérios Técnicos & Ergonômicos',
    execScoreSelect: 'Selecione',
    execScoreExcellence: '★ Excelência',
    execNotApplicable: 'N/A',
    execFinishEvaluation: 'Concluir Laudo Técnico',
    execSignReportBtn: 'Homologar e Assinar Laudo',

    // Economic Analysis & TCO
    tcoTitle: 'Parâmetros Econômicos & Projeção de Consumo',
    tcoSubtitle: 'Informe os custos reais de aquisição e a durabilidade média observada no ambiente produtivo.',
    tcoLibusProposal: 'PROPOSTA LIBUS',
    tcoCurrentProduct: 'PRODUTO ATUAL',
    tcoLibusPrice: 'Preço Unitário Proposto (R$)',
    tcoCompPrice: 'Preço Unitário Atual (R$)',
    tcoLibusLifespan: 'Vida Útil Estimada Libus (Meses)',
    tcoCompLifespan: 'Vida Útil Média Atual (Meses no Posto)',
    tcoAnnualCalculation: 'CÁLCULO ANUAL',
    tcoDisposalImpactTitle: 'Impacto de Trocas e Descarte (Opcional)',
    tcoDisposalImpactSubtitle: 'Use somente se o cliente souber esses valores. Caso contrário, deixe os campos em 0.',
    tcoDisposalCostUnit: 'Custo aproximado de cada troca (R$)',
    tcoDisposalCostUnitHint: 'Exemplo: tempo do almoxarifado, entrega do novo EPI e descarte. Se não souber, deixe 0.',
    tcoProductWeightGrams: 'Peso de uma unidade (gramas)',
    tcoProductWeightGramsHint: 'Usado para estimar o peso do resíduo evitado. Se não souber, deixe 0.',
    tcoQuantityUsers: 'Quantidade de Postos / Usuários',
    tcoCalculateBtn: 'Calcular Projeção Financeira',
    tcoAnnualSavings: 'Economia Anual Projetada',
    tcoWasteReduced: 'Redução de Resíduos Sólidos (Kg)',

    // Homologation & Digital Signatures Modal
    modalSignBadge: 'HOMOLOGAÇÃO TÉCNICA OFICIAL',
    modalSignTitle: 'Assinatura Digital do Laudo',
    modalStep1TechTab: '1º SIGNATÁRIO: Especialista Responsável',
    modalStep2ClientTab: '2º SIGNATÁRIO: Responsável Cliente / SESMT',
    modalTechSignTitle: 'Assinatura do Especialista Responsável *',
    modalTechSignPrompt: 'Desenhe sua assinatura no quadro abaixo:',
    modalTechInstructedCheck: 'Declaro que os colaboradores participantes receberam instrução técnica prévia de correta colocação, ajuste, guarda e conservação deste EPI.',
    modalTechNotesLabel: 'Observações Técnicas de Campo (Opcional)',
    modalAdvanceToClient: 'Avançar para Assinatura do Cliente',
    modalClientSelectParticipant: 'Ou selecione um colaborador participante:',
    modalClientNameLabel: 'Nome do Responsável / SESMT *',
    modalClientRoleLabel: 'Cargo / Área *',
    modalClientDocLabel: 'Registro Profissional / CPF / Matrícula (Opcional)',
    modalClientSignTitle: 'Assinatura do Responsável do Cliente *',
    modalClientSignPrompt: 'Passe o dispositivo para o responsável assinar na tela:',
    modalClearSign: 'Limpar Traço',
    modalCapturedBadge: '✓ Capturada',
    modalBackStep1: '← Voltar Etapa 1',
    modalSubmitSign: 'Homologar e Assinar Laudo',
    modalSigningLoading: 'Salvando Homologação...',

    // Companies Management
    compBadge: 'GESTÃO DE PARCEIROS & PLANTAS',
    compTitle: 'Empresas & Unidades Atendidas',
    compSubtitle: 'Cadastro de plantas industriais, contatos de SESMT e histórico de homologações.',
    compNewBtn: 'Nova Empresa',
    compColTradeName: 'Nome Fantasia',
    compColCorporate: 'Razão Social',
    compColCnpj: 'CNPJ',
    compColSegment: 'Segmento',
    compColLocation: 'Localização',
    compColEvaluations: 'Laudos'
  },
  es: {
    // Navigation & Layout
    navDashboard: 'Panel Principal',
    navNewEvaluation: 'Nueva Evaluación',
    navEvaluations: 'Historial e Informes',
    navCatalog: 'Catálogo Comparativo',
    navCompanies: 'Empresas y Unidades',
    navUsers: 'Equipo y Gestión',
    navProfile: 'Mi Perfil',
    navMenu: 'Menú',
    headerTitle: 'Homologación Técnica y Comparativo Normativo',
    headerSubtitle: 'Libus • División de Ingeniería de Protección',
    menuOperational: 'Menú Operativo',
    normativeFooterTitle: 'NORMAS TÉCNICAS Y CONFORMIDAD',
    normativeFooterDesc: 'Informes técnicos emitidos según normas IRAM, EN, ANSI y ensayos certificados.',
    logout: 'Cerrar Sesión',
    changePassword: 'Cambiar Contraseña',

    // Common Actions
    save: 'Guardar',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    filter: 'Filtrar',
    search: 'Buscar',
    all: 'Todas',
    loading: 'Cargando...',
    viewList: 'Lista',
    viewGrid: 'Cuadrícula',
    active: 'Activo',
    inactive: 'Inactivo',
    status: 'Estado',
    date: 'Fecha',
    actions: 'Acciones',
    details: 'Detalles',
    open: 'Abrir',
    back: 'Volver',
    next: 'Avanzar',
    newAction: 'Nuevo',

    // Login
    loginTitle: 'Plataforma de Ingeniería y Homologaciones Técnicas',
    loginSubtitle: 'Acceso corporativo seguro para especialistas de campo y liderazgo.',
    loginEmailLabel: 'Correo Corporativo',
    loginPasswordLabel: 'Contraseña de Acceso',
    loginButton: 'Acceder a la Plataforma',
    loginAuthenticating: 'Autenticando...',
    loginForgotLink: '¿Olvidó su contraseña?',

    // Dashboard Page
    dashBadgeTitle: 'INGENIERÍA DE APLICACIÓN Y HOMOLOGACIÓN',
    dashTitle: 'Panel de Pruebas e Informes',
    dashSubtitle: 'Gestión de ensayos comparativos de EPP, validación de certificados y pruebas prácticas de aceptación con trabajadores en planta.',
    dashNewTestBtn: 'Nueva Prueba de Campo',
    dashStatTestsTitle: 'Pruebas de Campo',
    dashStatTestsBadge: 'VOLUMEN',
    dashStatTestsUnit: 'informes',
    dashStatTestsSub: 'en curso',
    dashStatCompaniesTitle: 'Empresas',
    dashStatCompaniesBadge: 'CLIENTES',
    dashStatCompaniesUnit: 'plantas',
    dashStatCompaniesSub: 'informes emitidos',
    dashStatTauTitle: 'Aceptación TAU',
    dashStatTauBadge: 'HSE / SST',
    dashStatTauSub: 'Confort y durabilidad',
    dashStatCompetitorsTitle: 'Competidores',
    dashStatCompetitorsBadge: 'COMPARATIVO',
    dashStatCompetitorsSub: 'Marcas evaluadas 1x1',
    dashTableTitle: 'Informes y Evaluaciones de Campo',
    dashTableSubtitle: 'Historial de homologaciones y comparativas realizadas en clientes',
    dashTableFullHistory: 'Ver Historial Completo',
    dashTableEmptyTitle: 'No hay informes registrados hasta el momento.',
    dashTableEmptyDesc: 'Inicie un nuevo comparativo técnico para relevar puntuaciones con los trabajadores.',
    dashTableEmptyBtn: 'Iniciar Primera Evaluación',
    dashColCompany: 'Empresa Cliente',
    dashColTech: 'Especialista Libus',
    dashColPairs: 'Pares Evaluados (1x1)',
    dashColStatus: 'Estado',
    dashColDate: 'Fecha Registro',
    dashColAction: 'Acción',
    dashStatusCompleted: 'Homologada',
    dashStatusInProgress: 'En Planta',
    dashStatusDraft: 'Borrador',

    // Catalog Page
    catalogBadge: 'INGENIERÍA DE PRODUCTOS Y MATRIZ DE CONVERSIÓN',
    catalogTitle: 'Catálogo Oficial Libus y Equivalencias',
    catalogSubtitle: 'Portafolio de EPP Libus con matriz de equivalencias técnicas y fichas normativas con fondo transparente.',
    catalogNewEvaluationBtn: 'Nueva Homologación',
    catalogManagePhotosActive: 'Gestión de Fotos Activa',
    catalogAllFamilies: 'Todas las Familias',
    catalogCategoryFilter: 'Categoría:',
    catalogAllCategories: 'Todas',
    catalogSearchPlaceholder: 'Buscar modelo Libus, competidor o certificación...',
    catalogNoProductsTitle: 'No se encontraron productos',
    catalogNoProductsDesc: 'Ajuste los filtros de familia o término de búsqueda.',
    catalogLibusProposal: 'PROPUESTA LIBUS',
    catalogMarketEquiv: 'Equivalencias de Mercado',
    catalogNoCompetitors: 'Sin competidores registrados',
    catalogHomologateBtn: 'Homologar',
    catalogClickTechSheet: 'Haga clic para ver la Ficha Técnica Completa',
    catalogSuperiority: 'Superioridad',

    // Evaluations List Page
    evalListBadge: 'HISTORIAL OPERATIVO',
    evalListTitle: 'Historial de Informes y Homologaciones',
    evalListSubtitle: 'Informes técnicos generados con puntajes comparativos, TCO y validación formal.',
    evalListNewBtn: 'Nuevo Informe de Campo',
    evalListSearchPlaceholder: 'Buscar por empresa, especialista u observaciones...',
    evalListFilterAll: 'Todos los Estados',
    evalListEmptyTitle: 'No se encontraron evaluaciones',
    evalListEmptyDesc: 'Ajuste los filtros o cree una nueva homologación.',
    evalListEmptyBtn: 'Crear Evaluación',
    evalListDeleteModalTitle: 'Eliminar Evaluación',
    evalListDeleteModalDesc: '¿Está seguro de que desea eliminar esta evaluación? Esta acción no se puede deshacer.',

    // New Evaluation Wizard
    wizardTitle: 'Nueva Evaluación Técnica en Planta',
    wizardSubtitle: 'Configure el cliente, puesto de trabajo y pares de productos para iniciar el ensayo.',
    wizardStep1Company: '1. Empresa y Planta',
    wizardStep2Workstation: '2. Puesto de Trabajo',
    wizardStep3Participants: '3. Participantes',
    wizardStep4Comparisons: '4. Comparativo 1x1',
    wizardSelectCompany: 'Seleccione la Empresa Cliente',
    wizardSelectWorkstation: 'Seleccione o escriba el puesto de trabajo',
    wizardAddParticipant: 'Agregar Participante',
    wizardAddComparison: 'Agregar Par Comparativo',
    wizardStartEvaluation: 'Iniciar Evaluación de Campo',

    // Evaluation Execution & Scoring
    execBadgePar: 'PAR COMPARATIVO',
    execLibusXComp: 'Libus vs Competidor',
    execTabTechnical: '1. Evaluación Técnica',
    execTabEconomic: '2. Análisis Económico',
    execTabReport: '3. Informe Consolidado',
    execNormativeInstruction: 'Evalúe cada criterio técnico de 1 a 10 junto a los trabajadores en el puesto de trabajo.',
    execCriteriaTable: 'Criterios Técnicos y Ergonómicos',
    execScoreSelect: 'Seleccione',
    execScoreExcellence: '★ Excelencia',
    execNotApplicable: 'N/A',
    execFinishEvaluation: 'Finalizar Informe Técnico',
    execSignReportBtn: 'Homologar y Firmar Informe',

    // Economic Analysis & TCO
    tcoTitle: 'Parámetros Económicos y Proyección de Consumo',
    tcoSubtitle: 'Ingrese los costos reales de adquisición y la durabilidad promedio observada en planta.',
    tcoLibusProposal: 'PROPUESTA LIBUS',
    tcoCurrentProduct: 'PRODUCTO ACTUAL',
    tcoLibusPrice: 'Precio Unitario Propuesto',
    tcoCompPrice: 'Precio Unitario Actual',
    tcoLibusLifespan: 'Vida Útil Estimada Libus (Meses)',
    tcoCompLifespan: 'Vida Útil Promedio Actual (Meses)',
    tcoAnnualCalculation: 'CÁLCULO ANUAL',
    tcoDisposalImpactTitle: 'Impacto de Recambios y Residuos (Opcional)',
    tcoDisposalImpactSubtitle: 'Complete sólo si el cliente conoce estos valores. De lo contrario, deje en 0.',
    tcoDisposalCostUnit: 'Costo aproximado por recambio',
    tcoDisposalCostUnitHint: 'Ejemplo: tiempo de pañol/almacén, entrega y gestión de residuos. Si no sabe, deje 0.',
    tcoProductWeightGrams: 'Peso de una unidad (gramos)',
    tcoProductWeightGramsHint: 'Utilizado para estimar la masa de residuos evitada. Si no sabe, deje 0.',
    tcoQuantityUsers: 'Cantidad de Puestos / Usuarios',
    tcoCalculateBtn: 'Calcular Proyección Financiera',
    tcoAnnualSavings: 'Ahorro Anual Proyectado',
    tcoWasteReduced: 'Reducción de Residuos Sólidos (Kg)',

    // Homologation & Digital Signatures Modal
    modalSignBadge: 'HOMOLOGACIÓN TÉCNICA OFICIAL',
    modalSignTitle: 'Firma Digital del Informe',
    modalStep1TechTab: '1º FIRMANTE: Especialista Responsable',
    modalStep2ClientTab: '2º FIRMANTE: Responsable Cliente / HSE',
    modalTechSignTitle: 'Firma del Especialista Responsable *',
    modalTechSignPrompt: 'Dibuje su firma en el recuadro a continuación:',
    modalTechInstructedCheck: 'Declaro que los trabajadores participantes recibieron inducción técnica previa sobre correcto uso, ajuste, guardado y conservación de este EPP.',
    modalTechNotesLabel: 'Observaciones Técnicas de Campo (Opcional)',
    modalAdvanceToClient: 'Avanzar a Firma del Cliente',
    modalClientSelectParticipant: 'O seleccione un colaborador participante:',
    modalClientNameLabel: 'Nombre del Responsable / HSE *',
    modalClientRoleLabel: 'Cargo / Área *',
    modalClientDocLabel: 'Registro Profesional / DNI / Matrícula (Opcional)',
    modalClientSignTitle: 'Firma del Responsável del Cliente *',
    modalClientSignPrompt: 'Entregue el dispositivo al responsable para firmar en pantalla:',
    modalClearSign: 'Limpiar Trazo',
    modalCapturedBadge: '✓ Capturada',
    modalBackStep1: '← Volver Paso 1',
    modalSubmitSign: 'Homologar y Firmar Informe',
    modalSigningLoading: 'Guardando Homologación...',

    // Companies Management
    compBadge: 'GESTIÓN DE CLIENTES Y PLANTAS',
    compTitle: 'Empresas y Unidades Atendidas',
    compSubtitle: 'Registro de plantas industriales, contactos de HSE / Seguridad e historial de homologaciones.',
    compNewBtn: 'Nueva Empresa',
    compColTradeName: 'Nombre Fantasía',
    compColCorporate: 'Razón Social',
    compColCnpj: 'Identificación Fiscal',
    compColSegment: 'Segmento',
    compColLocation: 'Ubicación',
    compColEvaluations: 'Informes'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('libus_lang');
    return (saved === 'es' || saved === 'pt') ? saved : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('libus_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
