import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import {
  Building2,
  Users,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Search,
  Sparkles,
  X,
  Sliders,
  Check,
  Settings2,
  Briefcase
} from 'lucide-react';
import { getManufacturerLogo } from '../utils/manufacturerLogos';
import { getCaConsultUrl } from '../utils/caHelper';
import { ExternalLink } from 'lucide-react';

interface LibusProductItem {
  id: string;
  name: string;
  categoryId: string;
  internalCode?: string;
  caNumber?: string;
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
  equivalences?: Array<{
    id: string;
    competitorProduct: any;
  }>;
}

interface ComparisonPair {
  id: string; // temp unique id
  libusProduct: LibusProductItem;
  competitorManufacturerName: string;
  competitorProductId: string;
  competitorProductName: string;
  competitorImageUrl?: string;
  isCustomNew: boolean;
  comparisonType: 'EQUIVALENCE' | 'UPGRADE';
  upgradeJustification?: string;
}

export const NewEvaluationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [libusProducts, setLibusProducts] = useState<LibusProductItem[]>([]);
  const [competitorProducts, setCompetitorProducts] = useState<any[]>([]);

  // Dados do Contexto (Empresa e Participantes)
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [observations, setObservations] = useState('');
  const [participants, setParticipants] = useState<Array<{ name: string; roleOrArea: string }>>([]);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Bancada de Homologação (Pares Selecionados)
  const [comparisonPairs, setComparisonPairs] = useState<ComparisonPair[]>([]);

  // Filtros da Vitrine Libus
  const [selectedFamilySlug, setSelectedFamilySlug] = useState('all');
  const [libusSearch, setLibusSearch] = useState('');

  // Drawer Lateral de Pareamento 1x1
  const [pairingProduct, setPairingProduct] = useState<LibusProductItem | null>(null);
  const [pairingType, setPairingType] = useState<'EQUIVALENCE' | 'UPGRADE'>('EQUIVALENCE');
  const [upgradeJustification, setUpgradeJustification] = useState('');
  const [selectedManuf, setSelectedManuf] = useState('');
  const [selectedCompProdId, setSelectedCompProdId] = useState('');
  const [customManuf, setCustomManuf] = useState('');
  const [customProdName, setCustomProdName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [filterAllCategories, setFilterAllCategories] = useState(false);
  const [compSearchQuery, setCompSearchQuery] = useState('');

  // Modal nova empresa
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySegment, setNewCompanySegment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [compRes, famRes, libusRes, compProdsRes] = await Promise.all([
          apiRequest('/companies'),
          apiRequest('/catalog/families'),
          apiRequest('/catalog/libus-products'),
          apiRequest('/catalog/competitor-products')
        ]);
        setCompanies(compRes.companies || []);
        setFamilies(famRes.families || []);
        setLibusProducts(libusRes.products || []);
        setCompetitorProducts(compProdsRes.products || []);
        // Não selecionar empresa automaticamente para forçar escolha consciente do técnico
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Abrir gaveta lateral para parear um produto
  const handleOpenPairing = (product: LibusProductItem) => {
    setPairingProduct(product);
    setPairingType('EQUIVALENCE');
    setUpgradeJustification('');
    setFilterAllCategories(false);
    setCompSearchQuery('');

    const categoryComps = competitorProducts.filter(cp => cp.categoryId === product.categoryId);
    const defaultEq = product.equivalences?.[0]?.competitorProduct;
    const firstComp = defaultEq || categoryComps[0];

    if (firstComp) {
      setSelectedManuf(firstComp.manufacturer?.name || '');
      setSelectedCompProdId(firstComp.id);
      setIsCustomMode(false);
    } else {
      setIsCustomMode(true);
      setSelectedManuf('');
      setSelectedCompProdId('');
    }
    setCustomManuf('');
    setCustomProdName('');
  };

  // Confirmar adição na Bancada
  const handleConfirmPair = () => {
    if (!pairingProduct) return;

    let manufName = selectedManuf;
    let prodName = '';
    let prodId = selectedCompProdId;
    let compImg: string | undefined = undefined;

    if (isCustomMode) {
      manufName = customManuf.trim();
      prodName = customProdName.trim();
      prodId = '';
      if (!manufName || !prodName) {
        alert('Preencha o fabricante e o nome do produto concorrente.');
        return;
      }
    } else {
      const found = competitorProducts.find(cp => cp.id === selectedCompProdId);
      prodName = found?.name || '';
      compImg = found?.imageUrl;
    }

    const newPair: ComparisonPair = {
      id: `${pairingProduct.id}_${Date.now()}`,
      libusProduct: pairingProduct,
      competitorManufacturerName: manufName,
      competitorProductId: prodId,
      competitorProductName: prodName,
      competitorImageUrl: compImg,
      isCustomNew: isCustomMode,
      comparisonType: pairingType,
      upgradeJustification: pairingType === 'UPGRADE' ? upgradeJustification.trim() : undefined
    };

    setComparisonPairs(prev => [...prev, newPair]);
    setPairingProduct(null);
  };

  const handleRemovePair = (pairId: string) => {
    setComparisonPairs(prev => prev.filter(p => p.id !== pairId));
  };

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', roleOrArea: 'Técnico de Segurança' }]);
  };

  const handleRemoveParticipant = (idx: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== idx));
    }
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updated = [...participants];
    (updated[index] as any)[field] = value;
    setParticipants(updated);
  };

  const handleCreateCompanyInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;
    try {
      const data = await apiRequest('/companies', {
        method: 'POST',
        body: JSON.stringify({
          tradeName: newCompanyName,
          segment: newCompanySegment || 'Geral'
        })
      });
      setCompanies([...companies, data.company]);
      setSelectedCompanyId(data.company.id);
      setShowNewCompany(false);
      setNewCompanyName('');
      setNewCompanySegment('');
    } catch (err: any) {
      alert(err.message || 'Erro ao cadastrar empresa');
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!selectedCompanyId) {
      setError('Selecione uma empresa cliente para a homologação.');
      setShowConfigModal(true);
      return;
    }

    if (comparisonPairs.length === 0) {
      setError('Adicione pelo menos um equipamento Libus à bancada de homologação.');
      return;
    }

    // Participantes agora são 100% opcionais na criação inicial
    const validParticipants = participants.filter(p => p.name.trim() !== '');

    setSubmitting(true);

    try {
      const finalComparisons: Array<{ libusProductId: string; competitorProductId: string; orderIndex: number }> = [];

      for (let i = 0; i < comparisonPairs.length; i++) {
        const pair = comparisonPairs[i];
        let compProdId = pair.competitorProductId;

        if (pair.isCustomNew || !compProdId) {
          const res = await apiRequest('/catalog/competitor-products', {
            method: 'POST',
            body: JSON.stringify({
              name: pair.competitorProductName,
              manufacturerName: pair.competitorManufacturerName,
              categoryId: pair.libusProduct.categoryId
            })
          });
          compProdId = res.product.id;
        }

        finalComparisons.push({
          libusProductId: pair.libusProduct.id,
          competitorProductId: compProdId,
          comparisonType: pair.comparisonType,
          upgradeJustification: pair.upgradeJustification,
          orderIndex: i
        } as any);
      }

      const payload = {
        companyId: selectedCompanyId,
        observations,
        participants: validParticipants,
        comparisons: finalComparisons
      };

      const res = await apiRequest('/evaluations', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const targetId = res.evaluationId || res.evaluation?.id || res.id;
      if (targetId) {
        navigate(`/evaluations/${targetId}`);
      } else {
        navigate('/evaluations');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar avaliação');
      setSubmitting(false);
    }
  };

  // Produtos Libus filtrados
  const filteredLibusProducts = libusProducts.filter((p) => {
    const matchesFamily =
      selectedFamilySlug === 'all' || p.category?.family?.slug === selectedFamilySlug;
    const query = libusSearch.toLowerCase();
    const matchesSearch =
      !libusSearch ||
      p.name.toLowerCase().includes(query) ||
      p.category?.name.toLowerCase().includes(query) ||
      (p.internalCode && p.internalCode.toLowerCase().includes(query));
    return matchesFamily && matchesSearch;
  });

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs font-mono">
        Carregando bancada de homologação...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* 1. Barra Superior Compacta de Contexto da Homologação */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-libus-charcoal text-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 shadow-xs">
            <Briefcase size={18} className="text-libus-magenta" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                CLIENTE EM HOMOLOGAÇÃO
              </span>
              <button
                onClick={() => setShowConfigModal(true)}
                className="text-[10px] font-mono font-bold text-libus-magenta hover:underline flex items-center gap-1"
              >
                <Settings2 size={11} /> Alterar Dados
              </button>
            </div>
            <h2 className="text-sm font-black text-slate-900">
              {selectedCompany ? (
                <>
                  {selectedCompany.tradeName}
                  <span className="text-xs font-normal text-slate-500 ml-2">
                    ({selectedCompany.segment || 'Geral'}) • {participants.filter(p => p.name.trim()).length} avaliador(es)
                  </span>
                </>
              ) : (
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="text-libus-magenta hover:underline font-bold text-xs flex items-center gap-1 mt-0.5"
                >
                  + Clique aqui para selecionar a empresa cliente
                </button>
              )}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition flex items-center gap-1.5"
          >
            <Users size={14} />
            <span>Equipe ({participants.filter(p => p.name.trim()).length})</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || comparisonPairs.length === 0}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-md ${
              comparisonPairs.length > 0
                ? 'bg-libus-magenta hover:bg-libus-magentaHover text-white shadow-pink-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{submitting ? 'Iniciando...' : 'Iniciar Avaliação Técnica'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-semibold">
          <AlertCircle size={18} className="flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Layout Principal: Vitrine de EPIs Libus + Bancada Ativa */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-start">

        {/* BANCADA DE HOMOLOGAÇÃO ATIVA (No Mobile aparece PRIMEIRO se tiver itens) */}
        <div className="w-full md:col-span-5 md:order-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${comparisonPairs.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span>Bancada de Teste</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                  comparisonPairs.length > 0 ? 'bg-libus-magenta text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {comparisonPairs.length}
                </span>
              </h3>
            </div>
            {comparisonPairs.length > 0 && (
              <button
                onClick={() => setComparisonPairs([])}
                className="text-[10px] text-slate-400 hover:text-red-600 font-mono"
              >
                Limpar Bancada
              </button>
            )}
          </div>

          <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-3.5 sm:p-4 min-h-[140px] md:min-h-[580px] flex flex-col justify-between shadow-xs">
            {comparisonPairs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8 space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                  <Layers size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-mono">Bancada Vazia</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 max-w-xs leading-relaxed">
                    Toque em qualquer EPI da vitrine abaixo para parear com o concorrente.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[360px] md:max-h-[500px] pr-0.5">
                {comparisonPairs.map((pair, idx) => (
                  <div
                    key={pair.id}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        DUELO #{idx + 1} • {pair.libusProduct.category.name}
                      </span>
                      <button
                        onClick={() => handleRemovePair(pair.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-slate-100 transition"
                        title="Remover duelo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Comparativo Visual 1x1 Compacto */}
                    <div className="grid grid-cols-2 gap-2 items-center">
                      {/* Lado Libus */}
                      <div className="p-2 rounded-lg bg-slate-900 text-white flex items-center gap-2 min-w-0 relative overflow-hidden">
                        {pair.comparisonType === 'UPGRADE' && (
                          <span className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[7px] px-1 py-0.2 rounded-bl uppercase font-mono">
                            ★ Upgrade
                          </span>
                        )}
                        {pair.libusProduct.imageUrl && (
                          <img
                            src={pair.libusProduct.imageUrl}
                            alt={pair.libusProduct.name}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-white p-0.5 object-contain flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-[8px] font-mono font-bold text-libus-magenta block leading-none mb-0.5">LIBUS</span>
                          <p className="text-[11px] sm:text-xs font-black text-white truncate">{pair.libusProduct.name}</p>
                        </div>
                      </div>

                      {/* Lado Concorrente */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 min-w-0">
                        {pair.competitorImageUrl ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-white p-0.5 flex-shrink-0 flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                            <img
                              src={pair.competitorImageUrl}
                              alt={pair.competitorProductName}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : getManufacturerLogo(pair.competitorManufacturerName) ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-white p-0.5 flex-shrink-0 flex items-center justify-center border border-slate-200 shadow-2xs">
                            <img
                              src={getManufacturerLogo(pair.competitorManufacturerName)!}
                              alt={pair.competitorManufacturerName}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-100 flex-shrink-0 flex items-center justify-center text-[8px] font-mono text-slate-400 font-bold">
                            EPI
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-mono font-bold text-slate-500 block truncate leading-none mb-0.5">
                              {pair.competitorManufacturerName}
                            </span>
                            {pair.isCustomNew && (
                              <span className="text-[7px] font-mono font-bold bg-amber-100 text-amber-800 px-1 rounded">
                                NOVO
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">{pair.competitorProductName}</p>
                        </div>
                      </div>
                    </div>

                    {pair.comparisonType === 'UPGRADE' && pair.upgradeJustification && (
                      <div className="px-2 py-1 bg-amber-50/80 border border-amber-200/70 rounded-md text-[10px] text-amber-900 font-medium">
                        <strong>Foco Upgrade:</strong> {pair.upgradeJustification}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Rodapé da Bancada com Ação Rápida */}
            {comparisonPairs.length > 0 && (
              <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-600">
                  {comparisonPairs.length} {comparisonPairs.length === 1 ? 'item pronto' : 'itens prontos'}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-3.5 py-2 bg-libus-magenta hover:bg-libus-magentaHover text-white text-xs font-mono font-bold uppercase rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
                >
                  <span>Iniciar Laudo</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* VITRINE DE EPIS LIBUS */}
        <div className="w-full md:col-span-7 md:order-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-libus-magenta"></span>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900">
                1. Vitrine de EPIs Libus
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Clique no item para parear
            </span>
          </div>

          {/* Filtros de Família & Busca */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            {/* Pílulas Fluidas no Desktop / Carrossel Horizontal no Mobile */}
            <div className="flex items-center gap-1.5 py-0.5 overflow-x-auto pb-1 no-scrollbar flex-nowrap -mx-1 px-1 sm:flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedFamilySlug('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 active:scale-95 flex-shrink-0 ${
                  selectedFamilySlug === 'all'
                    ? 'bg-libus-charcoal text-white shadow-sm ring-2 ring-slate-800/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>Todos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedFamilySlug === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {libusProducts.length}
                </span>
              </button>
              {families.map((fam) => {
                const count = libusProducts.filter(p => p.category?.family?.slug === fam.slug).length;
                const isSelected = selectedFamilySlug === fam.slug;
                return (
                  <button
                    key={fam.id}
                    type="button"
                    onClick={() => setSelectedFamilySlug(fam.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 active:scale-95 flex-shrink-0 ${
                      isSelected
                        ? 'bg-libus-magenta text-white shadow-md ring-2 ring-pink-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span>{fam.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar EPI Libus (ex: Genesis, Argon, L-320V, Facial)..."
                value={libusSearch}
                onChange={(e) => setLibusSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta font-medium"
              />
            </div>
          </div>

          {/* Grade Visual da Vitrine - 2 Colunas Limpas no Mobile com Touch Otimizado */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredLibusProducts.map((p) => {
              const inBenchCount = comparisonPairs.filter(cp => cp.libusProduct.id === p.id).length;
              return (
                <div
                  key={p.id}
                  onClick={() => handleOpenPairing(p)}
                  className={`p-2.5 sm:p-3.5 bg-white rounded-2xl border transition cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md relative overflow-hidden active:scale-[0.98] ${
                    inBenchCount > 0
                      ? 'border-libus-magenta ring-2 ring-pink-500/20'
                      : 'border-slate-200/90 hover:border-libus-magenta/60'
                  }`}
                >
                  {inBenchCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 rounded-md bg-libus-magenta text-white text-[8px] sm:text-[9px] font-mono font-bold shadow-xs">
                      {inBenchCount} no duelo
                    </span>
                  )}

                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="w-full h-20 sm:h-28 rounded-xl bg-slate-50 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-libus-magenta/20 transition">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition transform"
                        />
                      ) : (
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono font-bold">LIBUS</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[8px] sm:text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">
                        {p.category.name}
                      </span>
                      <h4 className="text-[11px] sm:text-xs font-black text-slate-900 group-hover:text-libus-magenta transition truncate">
                        {p.name}
                      </h4>
                      {p.caNumber && (
                        <a
                          href={getCaConsultUrl(p.caNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-emerald-700 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                          title={`Consultar Certificado de Aprovação CA ${p.caNumber} no Ministério do Trabalho`}
                        >
                          <span>CA: {p.caNumber}</span>
                          <ExternalLink size={8} className="opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-1.5 mt-1.5 sm:pt-2 sm:mt-2 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-libus-magenta">
                    <span>+ Parear 1x1</span>
                    <Plus size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Drawer Lateral de Pareamento (Aparece ao clicar em um produto Libus) */}
      {pairingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50 transition-opacity">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Header do Drawer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-libus-magenta font-bold">
                    PAREAMENTO DE CAMPO (1X1)
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Configurar Concorrente
                  </h3>
                </div>
                <button
                  onClick={() => setPairingProduct(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Produto Libus Selecionado em Destaque */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-4 border border-slate-800">
                {pairingProduct.imageUrl ? (
                  <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={pairingProduct.imageUrl}
                      alt={pairingProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-500">
                    LIBUS
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-libus-magenta uppercase tracking-wider block">
                    EQUIPAMENTO LIBUS SELECIONADO
                  </span>
                  <h4 className="text-sm font-black text-white">{pairingProduct.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {pairingProduct.category.name} {pairingProduct.caNumber ? `• CA ${pairingProduct.caNumber}` : ''}
                  </p>
                </div>
              </div>

              {/* Seletor de Tipo de Comparativo: Equivalência vs Upgrade */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                  Objetivo Deste Comparativo 1x1:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPairingType('EQUIVALENCE')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      pairingType === 'EQUIVALENCE'
                        ? 'border-libus-magenta bg-white shadow-xs ring-2 ring-pink-500/20'
                        : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900 block">Equivalência</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Mesma linha e categoria direta
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPairingType('UPGRADE')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      pairingType === 'UPGRADE'
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-2 ring-amber-500/30'
                        : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                      <span>★ Upgrade</span>
                    </span>
                    <span className="text-[10px] text-amber-800/80 mt-0.5 leading-tight">
                      Evolução de tecnologia / conforto
                    </span>
                  </button>
                </div>

                {pairingType === 'UPGRADE' && (
                  <div className="pt-2 space-y-1.5 animate-in fade-in duration-150">
                    <label className="block text-[10px] font-mono font-bold text-amber-900 uppercase">
                      Justificativa do Upgrade / Ganho Principal (Opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Maior durabilidade, vedação de espuma, proteção antiembaçante superior..."
                      value={upgradeJustification}
                      onChange={(e) => setUpgradeJustification(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Opções do Concorrente (Seleção Aberta e Flexível) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-700">
                    Qual o concorrente em uso no cliente?
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(!isCustomMode)}
                    className="text-[11px] font-mono font-bold text-libus-magenta hover:underline"
                  >
                    {isCustomMode ? '← Usar Catálogo' : '+ Digitar outro modelo'}
                  </button>
                </div>

                {!isCustomMode ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/90">
                    {/* Toggle para Abrir Busca em Todas as Categorias (Seleção Totalmente Aberta) */}
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        Filtrar concorrentes:
                      </span>
                      <button
                        type="button"
                        onClick={() => setFilterAllCategories(!filterAllCategories)}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition ${
                          filterAllCategories
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {filterAllCategories ? '★ Todo o Catálogo Concorrente' : `Mesma Categoria (${pairingProduct.category.name})`}
                      </button>
                    </div>

                    {/* Busca Rápida de Concorrente */}
                    <div>
                      <input
                        type="text"
                        placeholder="Buscar por nome ou CA do concorrente..."
                        value={compSearchQuery}
                        onChange={(e) => setCompSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 mb-2 focus:ring-2 focus:ring-libus-magenta/30"
                      />
                    </div>

                    {/* Fabricantes que atendem a categoria deste produto ou todas */}
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                        Fabricante Concorrente
                      </label>
                      <select
                        value={selectedManuf}
                        onChange={(e) => {
                          const m = e.target.value;
                          setSelectedManuf(m);
                          const prods = competitorProducts.filter(cp => {
                            const matchCat = filterAllCategories || cp.categoryId === pairingProduct.categoryId;
                            const matchQuery = !compSearchQuery || cp.name.toLowerCase().includes(compSearchQuery.toLowerCase());
                            return matchCat && cp.manufacturer?.name === m && matchQuery;
                          });
                          setSelectedCompProdId(prods[0]?.id || '');
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-libus-magenta/40"
                      >
                        {Array.from(
                          new Set(
                            competitorProducts
                              .filter(cp => {
                                const matchCat = filterAllCategories || cp.categoryId === pairingProduct.categoryId;
                                const matchQuery = !compSearchQuery || cp.name.toLowerCase().includes(compSearchQuery.toLowerCase());
                                return matchCat && matchQuery;
                              })
                              .map(cp => cp.manufacturer?.name)
                              .filter(Boolean)
                          )
                        ).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Produtos do Fabricante Selecionado */}
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                        Modelo Concorrente
                      </label>
                      <select
                        value={selectedCompProdId}
                        onChange={(e) => setSelectedCompProdId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-libus-magenta/40"
                      >
                        {competitorProducts
                          .filter(cp => {
                            const matchCat = filterAllCategories || cp.categoryId === pairingProduct.categoryId;
                            const matchManuf = !selectedManuf || cp.manufacturer?.name === selectedManuf;
                            const matchQuery = !compSearchQuery || cp.name.toLowerCase().includes(compSearchQuery.toLowerCase());
                            return matchCat && matchManuf && matchQuery;
                          })
                          .map(cp => (
                            <option key={cp.id} value={cp.id}>
                              {cp.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                    <p className="text-[11px] text-amber-800 font-medium">
                      Cadastre um modelo concorrente livre na hora para este teste:
                    </p>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                        Nome do Fabricante *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 3M, Danny, MSA, Kalipso, Carbografite..."
                        value={customManuf}
                        onChange={(e) => setCustomManuf(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                        Nome do Modelo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: H-700, V-Gard, Spectra, Eco..."
                        value={customProdName}
                        onChange={(e) => setCustomProdName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ações do Drawer */}
            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setPairingProduct(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPair}
                className="flex-1 py-3 bg-libus-magenta hover:bg-libus-magentaHover text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Check size={14} />
                <span>Adicionar à Bancada</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal de Configuração de Empresa e Participantes */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-libus-magenta">
                  DADOS DA HOMOLOGAÇÃO
                </span>
                <h3 className="text-base font-black text-slate-900">Empresa & Equipe do Cliente</h3>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 font-mono">Empresa Cliente *</label>
                  <button
                    type="button"
                    onClick={() => { setShowConfigModal(false); setShowNewCompany(true); }}
                    className="text-[11px] font-mono font-bold text-libus-magenta hover:underline"
                  >
                    + Nova Empresa
                  </button>
                </div>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="">-- Selecione a Empresa Cliente --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.tradeName} {c.cnpj ? `— CNPJ: ${c.cnpj}` : ''} ({c.segment || 'Geral'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 font-mono">
                    Contexto / Posto de Trabalho
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Sugestões rápidas</span>
                </div>

                {/* Chips de Postos de Trabalho Pré-Definidos Padronizados */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Linha de Solda & Caldeiraria',
                    'Usinagem & Torneamento',
                    'Montagem Industrial & Linha',
                    'Manutenção Mecânica & Elétrica',
                    'Trabalho em Altura (NR-35)',
                    'Espaço Confinado (NR-33)',
                    'Pintura Industrial & Cabine',
                    'Logística & Movimentação',
                    'Construção Civil & Obras',
                    'Laboratório & Químicos',
                    'Fundição & Tratamento Térmico',
                    'Mineração & Pátio Pesado'
                  ].map((preset) => {
                    const isSelected = observations === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setObservations(isSelected ? '' : preset)}
                        className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition ${
                          isSelected
                            ? 'bg-libus-magenta text-white border-libus-magenta font-bold shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 font-medium'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ou digite um posto personalizado (ex: Pátio de Coque, Forno 02)..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-libus-magenta/40"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-bold text-slate-700 font-mono">Avaliadores no Cliente</label>
                    <span className="text-[10px] text-slate-400 font-mono">(Opcional)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="text-[11px] font-mono font-bold text-libus-magenta hover:underline"
                  >
                    + Adicionar
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {participants.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      Nenhum colaborador adicionado ainda. Você pode iniciar o laudo agora e adicionar os participantes a qualquer momento durante os ensaios.
                    </p>
                  ) : (
                    participants.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nome do colaborador (ex: Carlos Silva)"
                          value={p.name}
                          onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Cargo/Área"
                          value={p.roleOrArea}
                          onChange={(e) => handleParticipantChange(idx, 'roleOrArea', e.target.value)}
                          className="w-36 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2 bg-libus-charcoal hover:bg-slate-800 text-white text-xs font-mono font-bold uppercase rounded-xl transition"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Nova Empresa */}
      {showNewCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-libus-magenta">
                CADASTRO RÁPIDO
              </span>
              <h3 className="text-base font-black text-slate-900">Adicionar Empresa Cliente</h3>
            </div>
            <form onSubmit={handleCreateCompanyInline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Nome Fantasia *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mineração Vale do Sol"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Segmento</label>
                <input
                  type="text"
                  placeholder="Ex: Mineração, Siderurgia..."
                  value={newCompanySegment}
                  onChange={(e) => setNewCompanySegment(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewCompany(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-libus-magenta hover:bg-libus-magentaHover text-white text-xs font-mono font-bold uppercase rounded-xl shadow-md transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
