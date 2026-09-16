import React, { useEffect, useState, useRef } from 'react';
import { apiRequest } from '../services/api';
import { getManufacturerLogo } from '../utils/manufacturerLogos';
import { getProductSpec } from '../utils/productSpecifications';
import { getCaConsultUrl } from '../utils/caHelper';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  ShieldCheck,
  Tag,
  ExternalLink,
  Filter,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Camera,
  Upload,
  X,
  Sparkles,
  Loader2,
  LayoutGrid,
  List,
  Info,
  Award,
  Check,
  Zap,
  BookOpen,
  ArrowRight,
  PackageCheck,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LibusProductWithEquivalences {
  id: string;
  name: string;
  internalCode?: string;
  caNumber?: string;
  description?: string;
  imageUrl?: string;
  category: {
    id: string;
    name: string;
    family: {
      id: string;
      name: string;
      slug: string;
    };
  };
  equivalences: Array<{
    id: string;
    notes?: string;
    competitorProduct: {
      id: string;
      name: string;
      caNumber?: string;
      imageUrl?: string;
      manufacturer: {
        id: string;
        name: string;
      };
    };
  }>;
}

export const CatalogPage: React.FC = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'ADMIN' || user?.role === 'GESTOR';

  const [families, setFamilies] = useState<any[]>([]);
  const [products, setProducts] = useState<LibusProductWithEquivalences[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para Modal de Upload de Foto
  const [uploadModal, setUploadModal] = useState<{
    open: boolean;
    productId: string;
    productName: string;
    isLibus: boolean;
    currentImageUrl?: string;
  }>({
    open: false,
    productId: '',
    productName: '',
    isLibus: true
  });

  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para Modal de Ficha Técnica / Detalhes do Produto Libus
  const [selectedProductDetails, setSelectedProductDetails] = useState<LibusProductWithEquivalences | null>(null);

  const loadCatalog = async () => {
    try {
      const [famRes, prodRes] = await Promise.all([
        apiRequest('/catalog/families'),
        apiRequest('/catalog/libus-products')
      ]);
      setFamilies(famRes.families || []);
      setProducts(prodRes.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleOpenUpload = (
    productId: string,
    productName: string,
    isLibus: boolean,
    currentImageUrl?: string,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setUploadModal({
      open: true,
      productId,
      productName,
      isLibus,
      currentImageUrl
    });
    setUploadPreview(null);
    setUploadSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!uploadPreview || !uploadModal.productId) return;
    setUploading(true);

    try {
      const endpoint = uploadModal.isLibus
        ? `/catalog/libus-products/${uploadModal.productId}/image`
        : `/catalog/competitor-products/${uploadModal.productId}/image`;

      await apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({
          imageBase64: uploadPreview
        })
      });

      setUploadSuccess(true);
      await loadCatalog();
      setTimeout(() => {
        setUploadModal({ open: false, productId: '', productName: '', isLibus: true });
        setUploadPreview(null);
        setUploadSuccess(false);
      }, 1000);
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar foto');
    } finally {
      setUploading(false);
    }
  };

  const availableCategories = Array.from(
    new Map(
      products
        .filter((prod) => selectedFamily === 'all' || prod.category?.family?.slug === selectedFamily)
        .map((prod) => [prod.category?.id, prod.category])
    ).values()
  ).filter(Boolean);

  const filteredProducts = products.filter((prod) => {
    const matchesFamily = selectedFamily === 'all' || prod.category?.family?.slug === selectedFamily;
    const matchesCategory = selectedCategory === 'all' || prod.category?.id === selectedCategory;
    const searchLower = searchTerm.toLowerCase();

    const matchesLibus =
      prod.name.toLowerCase().includes(searchLower) ||
      (prod.internalCode && prod.internalCode.toLowerCase().includes(searchLower)) ||
      (prod.caNumber && prod.caNumber.toLowerCase().includes(searchLower)) ||
      prod.category?.name?.toLowerCase().includes(searchLower);

    const matchesCompetitor = prod.equivalences?.some(
      (eq) =>
        eq.competitorProduct?.name.toLowerCase().includes(searchLower) ||
        eq.competitorProduct?.manufacturer?.name.toLowerCase().includes(searchLower) ||
        (eq.competitorProduct?.caNumber && eq.competitorProduct.caNumber.toLowerCase().includes(searchLower))
    );

    return matchesFamily && matchesCategory && (matchesLibus || matchesCompetitor);
  });

  const toggleExpand = (id: string) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-libus-magenta"></span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            ENGENHARIA DE PRODUTOS & MATRIZ DE CONVERSÃO
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Catálogo Oficial Libus & Equivalências
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Portfólio de EPIs Libus com matriz de equivalências técnicas e fotos normativas em fundo transparente.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isManager && (
              <span className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <Camera size={13} />
                <span>Gestão de Fotos Ativa</span>
              </span>
            )}
            <Link
              to="/evaluations/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-libus-magenta hover:bg-libus-magentaHover text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition shadow-sm self-start sm:self-auto"
            >
              <PlusCircle size={14} />
              <span>Nova Homologação</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Busca e Seletor de Modo de Visualização (Grade / Lista) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Famílias de Proteção */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1 scroll-smooth">
            <button
              onClick={() => {
                setSelectedFamily('all');
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 font-mono uppercase tracking-wider flex items-center gap-1.5 active:scale-95 ${
                selectedFamily === 'all'
                  ? 'bg-libus-charcoal text-white shadow-sm ring-2 ring-slate-800/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>Todas as Famílias</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedFamily === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {products.length}
              </span>
            </button>
            {families.map((fam) => {
              const countInFam = products.filter(p => p.category?.family?.slug === fam.slug).length;
              const isSelected = selectedFamily === fam.slug;
              return (
                <button
                  key={fam.id}
                  onClick={() => {
                    setSelectedFamily(fam.slug);
                    setSelectedCategory('all');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 font-mono uppercase tracking-wider flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-libus-magenta text-white shadow-md ring-2 ring-pink-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{fam.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {countInFam}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar modelo Libus, concorrente ou C.A..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Seletor de Modo: Grade vs Lista */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-libus-charcoal shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Visualização em Grade (Cards)"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Grade</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'list'
                    ? 'bg-white text-libus-magenta shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Visualização em Lista / Tabela De-Para"
              >
                <List size={15} />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subfiltro Rápido por Categoria Específica */}
        {availableCategories.length > 1 && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
              <Filter size={12} /> Categoria:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            {availableCategories.map((cat: any) => {
              const isSelected = selectedCategory === cat.id;
              const countInCat = products.filter(p => p.category?.id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition flex-shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-libus-magenta text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[9px] px-1 py-0.1 rounded ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {countInCat}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Conteúdo do Catálogo: Modo Grade vs Lista */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs font-mono">
          Carregando catálogo e matriz de equivalência...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-sm font-bold text-slate-800">Nenhum produto encontrado</p>
          <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de família ou termo de busca.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* VISUALIZAÇÃO EM LISTA: CARDS HORIZONTAIS COMPACTOS DE-PARA (Ergonomia Mobile) */
        <div className="space-y-3">
          {filteredProducts.map((prod) => {
            const eqList = prod.equivalences || [];

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {/* Produto Libus Oficial */}
                <div
                  onClick={() => setSelectedProductDetails(prod)}
                  className="flex items-center gap-3 md:w-[38%] min-w-0 flex-shrink-0 cursor-pointer group/card hover:opacity-90 transition"
                  title="Clique para ver a Ficha Técnica Completa"
                >
                  <div className="relative group/libusimg flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 p-1 flex items-center justify-center overflow-hidden border border-slate-200 group-hover/card:border-libus-magenta/60 group-hover/card:shadow-xs transition">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full max-h-14 sm:max-h-16 object-contain filter drop-shadow-xs transition group-hover/libusimg:scale-105"
                        />
                      ) : (
                        <span className="text-[8px] text-slate-400 font-mono text-center">SEM FOTO</span>
                      )}
                    </div>
                    {isManager && (
                      <button
                        onClick={(e) => handleOpenUpload(prod.id, prod.name, true, prod.imageUrl, e)}
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/libusimg:opacity-100 transition flex items-center justify-center text-white rounded-xl"
                        title="Alterar foto Libus"
                      >
                        <Camera size={12} />
                      </button>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {(() => {
                      const spec = getProductSpec(prod.name);
                      const caNum = prod.caNumber || spec?.caNumber;
                      const intCode = prod.internalCode || spec?.internalCode;

                      return (
                        <>
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className="text-[9px] font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                              LIBUS
                            </span>
                            {intCode && (
                              <span className="text-[9px] font-mono text-slate-500 font-semibold">
                                CÓD: {intCode}
                              </span>
                            )}
                            {caNum && (
                              <a
                                href={getCaConsultUrl(caNum)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 hover:bg-emerald-100 transition inline-flex items-center gap-1 shadow-2xs"
                                title={`Consultar Certificado de Aprovação CA ${caNum} no Ministério do Trabalho`}
                              >
                                <ShieldCheck size={11} className="text-emerald-600" />
                                <span>CA {caNum}</span>
                                <ExternalLink size={8} className="opacity-80" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate group-hover/card:text-libus-magenta transition" title={prod.name}>
                              {prod.name}
                            </h3>
                            <Info size={12} className="text-slate-400 group-hover/card:text-libus-magenta flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">{prod.category?.family?.name}</span>
                            <span>•</span>
                            <span className="text-slate-400 truncate">{prod.category?.name}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Concorrentes Equivalentes Inline */}
                <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l border-slate-100 pt-2.5 md:pt-0 md:pl-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Equivalências de Mercado ({eqList.length})
                    </span>
                  </div>

                  {eqList.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Nenhum concorrente cadastrado</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {eqList.map((eq) => {
                        const manufName = eq.competitorProduct?.manufacturer?.name;
                        const logo = getManufacturerLogo(manufName);
                        const compImage = eq.competitorProduct?.imageUrl;

                        return (
                          <div
                            key={eq.id}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition max-w-full"
                          >
                            <div className="relative group/compimg flex-shrink-0">
                              <div className="w-7 h-7 rounded bg-white p-0.5 flex items-center justify-center overflow-hidden border border-slate-200">
                                {compImage ? (
                                  <img
                                    src={compImage}
                                    alt={eq.competitorProduct?.name}
                                    className="w-full h-full max-h-7 object-contain filter drop-shadow-2xs"
                                  />
                                ) : (
                                  <span className="text-[6px] text-slate-400 font-mono">FOTO</span>
                                )}
                              </div>
                              {isManager && (
                                <button
                                  onClick={(e) =>
                                    handleOpenUpload(
                                      eq.competitorProduct.id,
                                      `${manufName} - ${eq.competitorProduct?.name}`,
                                      false,
                                      compImage,
                                      e
                                    )
                                  }
                                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/compimg:opacity-100 transition flex items-center justify-center text-white rounded"
                                  title="Alterar foto do concorrente"
                                >
                                  <Camera size={8} />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1 font-mono min-w-0">
                              {logo ? (
                                <img src={logo} alt={manufName} className="h-2.5 max-w-[32px] object-contain flex-shrink-0" />
                              ) : (
                                <span className="text-[8px] font-bold text-slate-500 uppercase flex-shrink-0">{manufName}</span>
                              )}
                              <span className="font-bold text-slate-800 text-[11px] truncate max-w-[120px] sm:max-w-[160px]" title={eq.competitorProduct?.name}>
                                {eq.competitorProduct?.name}
                              </span>
                              {eq.competitorProduct?.caNumber && (
                                <a
                                  href={getCaConsultUrl(eq.competitorProduct.caNumber)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[8px] px-1 py-0.2 bg-white rounded border border-slate-200 text-slate-600 font-semibold flex-shrink-0 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition inline-flex items-center gap-0.5"
                                  title={`Consultar CA ${eq.competitorProduct.caNumber} no Ministério do Trabalho`}
                                >
                                  <span>CA {eq.competitorProduct.caNumber}</span>
                                  <ExternalLink size={7} className="opacity-70" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Ação Rápida */}
                <div className="flex items-center justify-end flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    to="/evaluations/new"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-libus-magenta/10 text-libus-magenta hover:bg-libus-magenta hover:text-white font-bold text-xs transition"
                  >
                    <span>Homologar</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISUALIZAÇÃO EM GRADE: 2 COLUNAS COMPACTAS NO MOBILE */
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 items-start">
          {filteredProducts.map((prod) => {
            const equivalencesCount = prod.equivalences?.length || 0;
            const isExpanded = expandedCardId === prod.id;
            const manufacturers = Array.from(
              new Set(prod.equivalences?.map(eq => eq.competitorProduct?.manufacturer?.name).filter(Boolean))
            ) as string[];

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-3 sm:p-4 space-y-2.5">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase font-mono tracking-wider truncate max-w-[100px]">
                      {prod.category?.family?.name || 'Proteção'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase truncate max-w-[80px]">
                      {prod.category?.name}
                    </span>
                  </div>

                  {/* Bloco do Produto Libus */}
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center sm:items-start text-center sm:text-left">
                    <div
                      onClick={() => setSelectedProductDetails(prod)}
                      className="relative group/img flex-shrink-0 cursor-pointer"
                      title="Ver Ficha Técnica Completa"
                    >
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-slate-50 p-1 flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs group-hover/img:border-libus-magenta/60 group-hover/img:shadow-xs transition">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full max-h-16 sm:max-h-18 object-contain filter drop-shadow-xs transition group-hover/img:scale-105"
                          />
                        ) : (
                          <span className="text-[8px] text-slate-400 font-mono">SEM FOTO</span>
                        )}
                      </div>

                      {/* Botão Gestor de Trocar Foto Libus */}
                      {isManager && (
                        <button
                          onClick={(e) => handleOpenUpload(prod.id, prod.name, true, prod.imageUrl, e)}
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition flex flex-col items-center justify-center text-white rounded-xl text-[8px] font-mono font-bold"
                          title="Alterar foto do produto Libus"
                        >
                          <Camera size={12} className="mb-0.5" />
                          <span>FOTO</span>
                        </button>
                      )}
                    </div>

                    {(() => {
                      const spec = getProductSpec(prod.name);
                      const caNum = prod.caNumber || spec?.caNumber;
                      const intCode = prod.internalCode || spec?.internalCode;

                      return (
                        <div className="space-y-1 min-w-0 flex-1 w-full">
                          <div className="flex items-center justify-center sm:justify-start gap-1 text-[8px] font-mono font-bold tracking-wider flex-wrap">
                            <span className="text-slate-900 bg-slate-100 px-1 py-0.2 rounded border border-slate-300">
                              LIBUS
                            </span>
                            {intCode && (
                              <span className="text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200/80">
                                CÓD: {intCode}
                              </span>
                            )}
                          </div>
                          <div
                            onClick={() => setSelectedProductDetails(prod)}
                            className="cursor-pointer group/title"
                            title="Ver Ficha Técnica Completa"
                          >
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight line-clamp-2 group-hover/title:text-libus-magenta transition">
                              {prod.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-1 flex-wrap pt-0.5">
                            {caNum && (
                              <a
                                href={getCaConsultUrl(caNum)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-300 hover:bg-emerald-100 transition inline-flex items-center gap-0.5 shadow-2xs"
                                title={`Consultar CA ${caNum} no Ministério do Trabalho`}
                              >
                                <ShieldCheck size={9} className="text-emerald-600" />
                                <span>CA {caNum}</span>
                                <ExternalLink size={7} className="opacity-80" />
                              </a>
                            )}
                            <span className="text-[9px] text-slate-500 font-medium">
                              • {equivalencesCount} eq.
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Resumo de Fabricantes Equivalentes */}
                  {equivalencesCount > 0 ? (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold uppercase text-slate-400 text-[9px] tracking-wider">
                          Concorrentes:
                        </span>
                        <button
                          onClick={() => toggleExpand(prod.id)}
                          className="text-libus-magenta hover:text-libus-magentaHover font-mono font-bold text-[10px] flex items-center gap-0.5"
                        >
                          {isExpanded ? (
                            <>
                              <span>Ocultar</span>
                              <ChevronUp size={11} />
                            </>
                          ) : (
                            <>
                              <span>Ver ({equivalencesCount})</span>
                              <ChevronDown size={11} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Chips das marcas com Logo */}
                      <div className="flex flex-wrap gap-1">
                        {manufacturers.slice(0, 3).map((m) => {
                          const logo = getManufacturerLogo(m);
                          return (
                            <span
                              key={m}
                              className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                            >
                              {logo ? (
                                <img src={logo} alt={m} className="h-2.5 max-w-[32px] object-contain" />
                              ) : (
                                <span>{m}</span>
                              )}
                            </span>
                          );
                        })}
                        {manufacturers.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-mono">+{manufacturers.length - 3}</span>
                        )}
                      </div>

                      {/* Lista detalhada expandida */}
                      {isExpanded && (
                        <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {prod.equivalences.map((eq) => {
                            const manufName = eq.competitorProduct?.manufacturer?.name;
                            const logo = getManufacturerLogo(manufName);
                            const compImage = eq.competitorProduct?.imageUrl;

                            return (
                              <div
                                key={eq.id}
                                className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] hover:border-slate-300 transition"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="relative group/compimg flex-shrink-0">
                                    <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center border border-slate-200 overflow-hidden">
                                      {compImage ? (
                                        <img
                                          src={compImage}
                                          alt={eq.competitorProduct?.name}
                                          className="w-full h-full max-h-6 object-contain filter drop-shadow-2xs"
                                        />
                                      ) : (
                                        <span className="text-[7px] font-mono text-slate-400">EPI</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-slate-800 text-[10px] leading-tight truncate">
                                      {eq.competitorProduct?.name}
                                    </p>
                                    <span className="text-[8px] text-slate-400 font-mono uppercase truncate block">
                                      {manufName}
                                    </span>
                                  </div>
                                </div>

                                {eq.competitorProduct?.caNumber && (
                                  <a
                                    href={getCaConsultUrl(eq.competitorProduct.caNumber)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[8px] font-mono px-1 py-0.2 bg-white rounded border border-slate-200 text-slate-600 flex-shrink-0 ml-1 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition inline-flex items-center gap-0.5 font-semibold"
                                    title={`Consultar CA ${eq.competitorProduct.caNumber} no Ministério do Trabalho`}
                                  >
                                    <span>CA {eq.competitorProduct.caNumber}</span>
                                    <ExternalLink size={7} className="opacity-70" />
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic pt-1.5 border-t border-slate-100">
                      Nenhum concorrente cadastrado.
                    </p>
                  )}
                </div>

                {/* Footer do Card */}
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                    Libus
                  </span>
                  <Link
                    to="/evaluations/new"
                    className="w-full sm:w-auto text-center text-[10px] font-mono font-bold text-libus-magenta hover:underline flex items-center justify-center gap-1"
                  >
                    <span>Avaliar</span>
                    <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Upload de Foto (Exclusivo Gestor/Admin) */}
      {uploadModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-libus-magenta font-bold">
                  GESTOR • INCLUSÃO & ATUALIZAÇÃO DE FOTO
                </span>
                <h2 className="text-base font-black text-slate-900 mt-0.5">
                  Foto do Produto
                </h2>
                <p className="text-xs text-slate-500 font-medium truncate max-w-xs">
                  {uploadModal.productName}
                </p>
              </div>
              <button
                onClick={() => setUploadModal({ ...uploadModal, open: false })}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Aviso de Transparência Automática */}
            <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 flex items-center gap-2.5 text-xs text-libus-magenta font-medium">
              <Sparkles size={16} className="flex-shrink-0" />
              <span>
                O sistema processa e converte automaticamente fundos brancos em <strong>fundo transparente (PNG)</strong>.
              </span>
            </div>

            {/* Área de Seleção ou Preview */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition relative">
              {uploadPreview ? (
                <div className="space-y-3 text-center">
                  <div className="w-36 h-36 mx-auto rounded-xl bg-slate-100/50 p-2 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-mono font-bold text-libus-magenta hover:underline"
                  >
                    Escolher outro arquivo
                  </button>
                </div>
              ) : uploadModal.currentImageUrl ? (
                <div className="space-y-3 text-center">
                  <div className="w-32 h-32 mx-auto rounded-xl bg-slate-100/50 p-2 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                    <img
                      src={uploadModal.currentImageUrl}
                      alt="Atual"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition shadow-sm inline-flex items-center gap-1.5"
                  >
                    <Upload size={13} />
                    <span>Selecionar Nova Foto</span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-pink-50 text-libus-magenta mx-auto flex items-center justify-center">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Clique para carregar uma foto</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Formatos suportados: PNG, JPG ou JPEG</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition shadow-sm"
                  >
                    Procurar no Computador
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={uploading}
                onClick={() => setUploadModal({ ...uploadModal, open: false })}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition font-mono"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!uploadPreview || uploading}
                onClick={handleSavePhoto}
                className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                  uploadSuccess
                    ? 'bg-emerald-600'
                    : uploadPreview
                    ? 'bg-libus-magenta hover:bg-libus-magentaHover'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Processando Fundo...</span>
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle2 size={13} />
                    <span>Salvo com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Upload size={13} />
                    <span>Salvar Foto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Ficha Técnica Completa do Produto Libus */}
      {selectedProductDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* Header do Modal com Badges e Identidade Libus */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-libus-magenta bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                    FICHA TÉCNICA OFICIAL LIBUS
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                    {selectedProductDetails.category?.family?.name} • {selectedProductDetails.category?.name}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {selectedProductDetails.name}
                </h2>
                <div className="flex items-center gap-2 pt-1 flex-wrap font-mono text-xs">
                  {(() => {
                    const spec = getProductSpec(selectedProductDetails.name);
                    const caNum = selectedProductDetails.caNumber || spec?.caNumber;
                    const intCode = selectedProductDetails.internalCode || spec?.internalCode;

                    return (
                      <>
                        {intCode && (
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                            CÓD: {intCode}
                          </span>
                        )}
                        {caNum && (
                          <a
                            href={getCaConsultUrl(caNum)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
                            title="Consultar Certificado de Aprovação no Ministério do Trabalho"
                          >
                            <ShieldCheck size={14} className="text-emerald-600" />
                            <span>C.A. {caNum} (Ativo MTE)</span>
                            <ExternalLink size={11} className="opacity-80" />
                          </a>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <button
                onClick={() => setSelectedProductDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition flex-shrink-0"
                title="Fechar Ficha Técnica"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corpo com Scroll da Ficha Técnica */}
            {(() => {
              const spec = getProductSpec(selectedProductDetails.name);
              const features = spec?.features || [
                'Design ergonômico projetado para longas jornadas contínuas sem pontos de pressão.',
                'Matéria-prima de alta performance com resistência a impactos e agentes químicos.',
                'Compatibilidade com sistemas e acoplamentos Libus para proteção combinada.'
              ];
              const standards = spec?.standards || ['Portaria MTE / NR-6', 'Normas ABNT NBR Vigentes'];
              const applications = spec?.applications || ['Indústria em geral', 'Construção civil', 'Manutenção industrial'];
              const packaging = spec?.packaging || 'Embalagem individual homologada';

              return (
                <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {/* Card Destaque: Imagem com Fundo Transparente & Resumo de Engenharia */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white p-2.5 flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-2xs overflow-hidden">
                      {selectedProductDetails.imageUrl ? (
                        <img
                          src={selectedProductDetails.imageUrl}
                          alt={selectedProductDetails.name}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">FOTO DO EPI</span>
                      )}
                    </div>
                    <div className="space-y-2 text-center sm:text-left min-w-0">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-libus-magenta font-mono font-bold text-[11px] uppercase tracking-wider">
                        <Award size={14} />
                        <span>Especificação Técnica & Engenharia Libus</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {spec?.description || selectedProductDetails.description || 'Equipamento de Proteção Individual homologado conforme normas técnicas vigentes e ensaios laboratoriais credenciados.'}
                      </p>
                      {packaging && (
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-slate-500 font-mono pt-1">
                          <PackageCheck size={13} className="text-slate-400" />
                          <span>Embalagem: <strong>{packaging}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seção 1: Diferenciais Técnicos e de Engenharia Reais */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Zap size={15} className="text-libus-magenta" />
                      <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-800">
                        Diferenciais Construtivos & Desempenho
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Seção 2: Normas e Certificações Oficiais */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <BookOpen size={15} className="text-libus-magenta" />
                      <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-800">
                        Normas Técnicas & Portarias Aplicáveis
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {standards.map((std, idx) => (
                        <div key={idx} className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 font-semibold flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
                          <span>{std}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seção 3: Aplicações Recomendadas no SESMT */}
                  {applications.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                        <Briefcase size={15} className="text-libus-magenta" />
                        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-800">
                          Setores & Riscos Recomendados
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {applications.map((app, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seção 4: Concorrentes Equivalentes Cadastrados */}
                  {selectedProductDetails.equivalences && selectedProductDetails.equivalences.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-800">
                          Matriz de Equivalência de Campo ({selectedProductDetails.equivalences.length})
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400">Substitutos Diretos</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedProductDetails.equivalences.map((eq) => {
                          const manuf = eq.competitorProduct?.manufacturer?.name;
                          const logo = getManufacturerLogo(manuf);
                          const compImg = eq.competitorProduct?.imageUrl;

                          return (
                            <div
                              key={eq.id}
                              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {compImg ? (
                                  <img src={compImg} alt={eq.competitorProduct?.name} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-[8px] font-mono text-slate-400 font-bold">EPI</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  {logo ? (
                                    <img src={logo} alt={manuf} className="h-2.5 max-w-[40px] object-contain" />
                                  ) : (
                                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{manuf}</span>
                                  )}
                                  {eq.competitorProduct?.caNumber && (
                                    <span className="text-[8px] font-mono px-1 py-0.2 bg-white rounded border border-slate-200 text-slate-600 font-bold">
                                      CA {eq.competitorProduct.caNumber}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-bold text-slate-800 truncate" title={eq.competitorProduct?.name}>
                                  {eq.competitorProduct?.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Rodapé do Modal com Botões de Ação */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedProductDetails(null)}
                className="px-4 py-2 text-xs font-bold font-mono text-slate-600 hover:bg-slate-200/70 rounded-xl transition"
              >
                Fechar
              </button>

              <Link
                to="/evaluations/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition shadow-md"
              >
                <span>Homologar Este EPI</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
