import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Login
  loginTitle: string;
  loginSubtitle: string;
  loginEmailLabel: string;
  loginPasswordLabel: string;
  loginButton: string;
  loginAuthenticating: string;
  loginForgotLink: string;

  // Evaluation & Field
  evalLeadTech: string;
  evalCompany: string;
  evalSuperiority: string;
  evalUpgrade: string;
  evalEquivalence: string;
  evalHomologate: string;
  evalStatusDraft: string;
  evalStatusInProgress: string;
  evalStatusCompleted: string;

  // Catalog
  catalogTitle: string;
  catalogSubtitle: string;
  catalogAllFamilies: string;
  catalogSearchPlaceholder: string;
  catalogLibusProposal: string;
  catalogMarketEquiv: string;

  // Economic & ESG
  tcoTitle: string;
  tcoSubtitle: string;
  tcoLibusPrice: string;
  tcoCompPrice: string;
  tcoLibusLifespan: string;
  tcoCompLifespan: string;
  tcoSavingsAnnual: string;
  tcoWasteReduced: string;
}

const translations: Record<Language, Translations> = {
  pt: {
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

    loginTitle: 'Plataforma de Engenharia & Homologações Técnicas',
    loginSubtitle: 'Acesso corporativo seguro para especialistas de campo e liderança.',
    loginEmailLabel: 'E-mail Corporativo',
    loginPasswordLabel: 'Senha de Acesso',
    loginButton: 'Acessar Plataforma',
    loginAuthenticating: 'Autenticando...',
    loginForgotLink: 'Esqueceu sua senha?',

    evalLeadTech: 'Especialista Responsável',
    evalCompany: 'Empresa / Unidade',
    evalSuperiority: 'Superioridade Técnica',
    evalUpgrade: 'Upgrade Tecnológico',
    evalEquivalence: 'Equivalência Direta',
    evalHomologate: 'Homologar e Assinar Laudo',
    evalStatusDraft: 'Rascunho',
    evalStatusInProgress: 'Em Andamento',
    evalStatusCompleted: 'Homologado',

    catalogTitle: 'Catálogo Oficial Libus & Equivalências',
    catalogSubtitle: 'Portfólio de EPIs Libus com matriz de equivalências técnicas e fotos normativas.',
    catalogAllFamilies: 'Todas as Famílias',
    catalogSearchPlaceholder: 'Buscar modelo Libus, concorrente ou C.A...',
    catalogLibusProposal: 'PROPOSTA LIBUS',
    catalogMarketEquiv: 'Equivalências de Mercado',

    tcoTitle: 'Parâmetros Econômicos & Projeção de Consumo',
    tcoSubtitle: 'Custos reais de aquisição e durabilidade observada em campo.',
    tcoLibusPrice: 'Preço Unitário Proposto (R$)',
    tcoCompPrice: 'Preço Unitário Atual (R$)',
    tcoLibusLifespan: 'Vida Útil Estimada Libus (Meses)',
    tcoCompLifespan: 'Vida Útil Média Atual (Meses)',
    tcoSavingsAnnual: 'Economia Anual Projetada',
    tcoWasteReduced: 'Redução de Resíduos Sólidos (Kg)'
  },
  es: {
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

    loginTitle: 'Plataforma de Ingeniería y Homologaciones Técnicas',
    loginSubtitle: 'Acceso corporativo seguro para especialistas de campo y liderazgo.',
    loginEmailLabel: 'Correo Corporativo',
    loginPasswordLabel: 'Contraseña de Acceso',
    loginButton: 'Acceder a la Plataforma',
    loginAuthenticating: 'Autenticando...',
    loginForgotLink: '¿Olvidó su contraseña?',

    evalLeadTech: 'Especialista Responsable',
    evalCompany: 'Empresa / Planta',
    evalSuperiority: 'Superioridad Técnica',
    evalUpgrade: 'Mejora Tecnológica (Upgrade)',
    evalEquivalence: 'Equivalencia Directa',
    evalHomologate: 'Homologar y Firmar Informe',
    evalStatusDraft: 'Borrador',
    evalStatusInProgress: 'En Curso',
    evalStatusCompleted: 'Homologado',

    catalogTitle: 'Catálogo Oficial Libus y Equivalencias',
    catalogSubtitle: 'Portafolio de EPP Libus con matriz de equivalencias técnicas y fichas normativas.',
    catalogAllFamilies: 'Todas las Familias',
    catalogSearchPlaceholder: 'Buscar modelo Libus, competidor o certificación...',
    catalogLibusProposal: 'PROPUESTA LIBUS',
    catalogMarketEquiv: 'Equivalencias de Mercado',

    tcoTitle: 'Parámetros Económicos y Proyección de Consumo',
    tcoSubtitle: 'Costos reales de adquisición y durabilidad observada en planta.',
    tcoLibusPrice: 'Precio Unitario Propuesto',
    tcoCompPrice: 'Precio Unitario Actual',
    tcoLibusLifespan: 'Vida Útil Estimada Libus (Meses)',
    tcoCompLifespan: 'Vida Útil Media Actual (Meses)',
    tcoSavingsAnnual: 'Ahorro Anual Proyectado',
    tcoWasteReduced: 'Reducción de Residuos Sólidos (Kg)'
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
