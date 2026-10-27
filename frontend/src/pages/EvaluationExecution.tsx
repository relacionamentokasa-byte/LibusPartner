import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import {
  ShieldCheck,
  Award,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Save,
  Building2,
  Users,
  TrendingUp,
  Percent,
  Layers,
  ChevronRight,
  Info,
  Printer,
  FileCheck2,
  FileSpreadsheet,
  Clock,
  Trash2,
  UserPlus,
  Plus,
  X,
  Edit2
} from 'lucide-react';
import { getManufacturerLogo } from '../utils/manufacturerLogos';
import { getCaConsultUrl } from '../utils/caHelper';
import { ExternalLink } from 'lucide-react';
import { HomologationSignatureModal } from '../components/HomologationSignatureModal';

export const EvaluationExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [activeComparisonIndex, setActiveComparisonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'TECNICA' | 'ECONOMICA' | 'RESULTADO'>('TECNICA');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Estado do Modal de Homologação com Termo de Orientação Técnica (NR-6)
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [technicianInstructed, setTechnicianInstructed] = useState(true);
  const [instructionNotes, setInstructionNotes] = useState('');
  const [completing, setCompleting] = useState(false);

  // Estado do Modal de Gerenciamento de Participantes / Equipe
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [savingParticipants, setSavingParticipants] = useState(false);
  const [modalParticipants, setModalParticipants] = useState<Array<{
    name: string;
    roleOrArea: string;
    companyName?: string;
    email?: string;
    phone?: string;
  }>>([]);

  // Estados locais das notas por comparação
  const [scoresMap, setScoresMap] = useState<Record<string, Record<string, { libus: number | null; comp: number | null; na: boolean }>>>({});

  // Estados locais econômicos
  const [economicInputs, setEconomicInputs] = useState<Record<string, {
    currentPrice: number;
    libusPrice: number;
    quantity: number;
    lifespanCurrent: number;
    lifespanLibus: number;
    disposalCostPerUnit: number;
    productWeightGrams: number;
  }>>({});

  useEffect(() => {
    async function loadEvaluation() {
      try {
        const data = await apiRequest(`/evaluations/${id}`);
        setEvaluation(data.evaluation);

        const initialScores: any = {};
        const initialEconomic: any = {};

        data.evaluation.comparisons.forEach((comp: any) => {
          initialScores[comp.id] = {};
          comp.responses.forEach((r: any) => {
            initialScores[comp.id][r.attributeId] = {
              libus: r.libusScore,
              comp: r.competitorScore,
              na: r.isNotApplicable
            };
          });

          if (comp.economicResult) {
            initialEconomic[comp.id] = {
              currentPrice: comp.economicResult.currentPrice,
              libusPrice: comp.economicResult.libusPrice,
              quantity: comp.economicResult.quantity,
              lifespanCurrent: comp.economicResult.lifespanCurrent,
              lifespanLibus: comp.economicResult.lifespanLibus,
              disposalCostPerUnit: comp.economicResult.disposalCostPerUnit || 0,
              productWeightGrams: comp.economicResult.productWeightGrams || 0
            };
          } else {
            initialEconomic[comp.id] = {
              currentPrice: 35.0,
              libusPrice: 28.5,
              quantity: 50,
              lifespanCurrent: 3,
              lifespanLibus: 6,
              disposalCostPerUnit: 0,
              productWeightGrams: 0
            };
          }
        });

        setScoresMap(initialScores);
        setEconomicInputs(initialEconomic);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvaluation();
  }, [id]);

  const activeComparison = evaluation?.comparisons?.[activeComparisonIndex];

  const handleScoreChange = (attributeId: string, type: 'libus' | 'comp', value: number) => {
    if (!activeComparison) return;
    const compId = activeComparison.id;
    const current = scoresMap[compId]?.[attributeId] || { libus: null, comp: null, na: false };

    setScoresMap({
      ...scoresMap,
      [compId]: {
        ...scoresMap[compId],
        [attributeId]: {
          ...current,
          [type]: value,
          na: false
        }
      }
    });
  };

  const handleToggleNA = (attributeId: string) => {
    if (!activeComparison) return;
    const compId = activeComparison.id;
    const current = scoresMap[compId]?.[attributeId] || { libus: null, comp: null, na: false };

    setScoresMap({
      ...scoresMap,
      [compId]: {
        ...scoresMap[compId],
        [attributeId]: {
          ...current,
          na: !current.na
        }
      }
    });
  };

  const handleSaveScores = async () => {
    if (!activeComparison) return;
    setSaving(true);
    try {
      const compId = activeComparison.id;
      const responsesPayload = Object.entries(scoresMap[compId] || {}).map(([attributeId, vals]) => ({
        attributeId,
        libusScore: vals.na ? null : vals.libus,
        competitorScore: vals.na ? null : vals.comp,
        isNotApplicable: vals.na
      }));

      const res = await apiRequest(`/evaluations/comparisons/${compId}/scores`, {
        method: 'PUT',
        body: JSON.stringify({ responses: responsesPayload })
      });

      const updatedComparisons = [...evaluation.comparisons];
      updatedComparisons[activeComparisonIndex].technicalResult = res.technicalResult;
      setEvaluation({ ...evaluation, comparisons: updatedComparisons });
      alert('Notas salvas e índice de superioridade recalculado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar notas');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEconomic = async () => {
    if (!activeComparison) return;
    setSaving(true);
    try {
      const compId = activeComparison.id;
      const payload = economicInputs[compId];

      const res = await apiRequest(`/evaluations/comparisons/${compId}/economic`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      const updatedComparisons = [...evaluation.comparisons];
      updatedComparisons[activeComparisonIndex].economicResult = res.economicResult;
      setEvaluation({ ...evaluation, comparisons: updatedComparisons });
      alert('Demonstrativo financeiro recalculado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar cálculo econômico');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteEvaluation = async () => {
    try {
      setCompleting(true);
      const res = await apiRequest(`/evaluations/${id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({
          technicianInstructed,
          instructionNotes: instructionNotes.trim() || undefined
        })
      });
      setEvaluation({
        ...evaluation,
        status: 'COMPLETED',
        completedAt: res.evaluation?.completedAt || new Date().toISOString(),
        technicianInstructed,
        instructionNotes
      });
      setShowCompleteModal(false);
      alert('Laudo técnico homologado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao concluir avaliação');
    } finally {
      setCompleting(false);
    }
  };

  const handleOpenParticipantsModal = () => {
    if (evaluation?.participants && evaluation.participants.length > 0) {
      setModalParticipants(
        evaluation.participants.map((p: any) => ({
          name: p.name,
          roleOrArea: p.roleOrArea,
          companyName: p.companyName || '',
          email: p.email || '',
          phone: p.phone || ''
        }))
      );
    } else {
      setModalParticipants([
        { name: '', roleOrArea: 'Operador / Produção', companyName: evaluation?.company?.tradeName || '' }
      ]);
    }
    setShowParticipantsModal(true);
  };

  const handleAddParticipantRow = () => {
    setModalParticipants([
      ...modalParticipants,
      { name: '', roleOrArea: 'Operador / Produção', companyName: evaluation?.company?.tradeName || '' }
    ]);
  };

  const handleRemoveParticipantRow = (index: number) => {
    setModalParticipants(modalParticipants.filter((_, i) => i !== index));
  };

  const handleUpdateParticipantField = (index: number, field: string, value: string) => {
    const updated = [...modalParticipants];
    updated[index] = { ...updated[index], [field]: value };
    setModalParticipants(updated);
  };

  const handleSaveParticipants = async () => {
    try {
      setSavingParticipants(true);
      const validParticipants = modalParticipants.filter(p => p.name.trim() !== '');

      const res = await apiRequest(`/evaluations/${id}/participants`, {
        method: 'PUT',
        body: JSON.stringify({ participants: validParticipants })
      });

      setEvaluation({
        ...evaluation,
        participants: res.participants || []
      });
      setShowParticipantsModal(false);
      alert('Equipe de participantes atualizada com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar participantes');
    } finally {
      setSavingParticipants(false);
    }
  };

  const handleDeleteEvaluation = async () => {
    try {
      setDeleting(true);
      await apiRequest(`/evaluations/${id}`, { method: 'DELETE' });
      navigate('/evaluations');
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir avaliação');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading || !evaluation) {
    return <div className="p-16 text-center text-xs font-mono text-slate-400">Carregando bancada técnica...</div>;
  }

  const technicalResult = activeComparison?.technicalResult;
  const economicResult = activeComparison?.economicResult;

  return (
    <div className="space-y-6">
      {/* Top Header estilo Laudo de Homologação */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <Link
            to="/evaluations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-libus-magenta transition font-mono"
          >
            <ArrowLeft size={13} /> <span>Voltar ao Histórico</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {evaluation.company?.tradeName}
            </h1>
            {evaluation.status === 'COMPLETED' ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 font-mono">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Homologada</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-mono">
                <Clock size={13} className="text-slate-400" />
                <span>Em Campo</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <span>Técnico Especialista: <strong className="text-slate-800 font-bold">{evaluation.leadTechnician?.name}</strong></span>
            <span>•</span>
            <span>Data: <span className="font-mono text-slate-700">{new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}</span></span>
            <span>•</span>
            <span>Unidade: <span className="text-slate-700">{evaluation.company?.city || 'Brasil'}</span></span>
          </div>
        </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/evaluations/${id}/report`}
              className="px-4 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover text-white rounded-xl text-xs font-bold transition flex items-center gap-2 font-mono shadow-sm"
              title="Visualizar e emitir Laudo Técnico Oficial completo para PDF"
            >
              <FileCheck2 size={15} />
              <span>Ver Laudo Oficial (PDF)</span>
            </Link>
            {evaluation.status !== 'COMPLETED' && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 tracking-wide uppercase font-mono"
              >
                <CheckCircle2 size={15} /> Homologar
              </button>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              title="Excluir Avaliação"
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-slate-200 hover:border-rose-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
      </div>

      {/* Resumo de Superioridade em Badge Fixo / Placar em Tempo Real no Topo */}
      {activeComparison && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-libus-charcoal text-white flex items-center justify-center font-black font-mono text-xs flex-shrink-0">
              VS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  DUELO #{activeComparisonIndex + 1} • {activeComparison.libusProduct?.category?.name || 'EPI'}
                </span>
                {activeComparison.comparisonType === 'UPGRADE' && (
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                    <span>★ PROPOSTA DE UPGRADE</span>
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                <span className="text-libus-magenta">{activeComparison.libusProduct?.name}</span>
                <span className="text-slate-400 font-normal">vs</span>
                <span className="text-slate-700">{activeComparison.competitorProduct?.name}</span>
              </div>
              {activeComparison.comparisonType === 'UPGRADE' && activeComparison.upgradeJustification && (
                <p className="text-[11px] text-amber-900 font-medium mt-0.5">
                  <strong>Foco do Upgrade:</strong> {activeComparison.upgradeJustification}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {activeComparison.technicalResult?.validCriteria > 0 ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase font-mono block">Superioridade</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                    +{activeComparison.technicalResult?.libusSuperiorityPercent ?? 0}%
                  </span>
                </div>
                <Award size={18} className="text-emerald-600" />
              </div>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Preencha as notas abaixo
              </span>
            )}
          </div>
        </div>
      )}

      {/* Participantes da Empresa Avaliada */}
      <div className="bg-slate-100/70 border border-slate-200/80 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-libus-magenta">
            <Users size={16} />
          </div>
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
            Equipe Participante:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {evaluation.participants && evaluation.participants.length > 0 ? (
            evaluation.participants.map((p: any) => (
              <div key={p.id} className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold shadow-xs flex items-center gap-1.5">
                <span>{p.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">[{p.roleOrArea}]</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">
              Nenhum participante cadastrado ainda (opcional)
            </span>
          )}
          <button
            type="button"
            onClick={handleOpenParticipantsModal}
            className="text-xs px-2.5 py-1 bg-white hover:bg-pink-50 text-libus-magenta border border-pink-200 hover:border-libus-magenta rounded-lg font-bold font-mono transition flex items-center gap-1 shadow-2xs"
            title="Adicionar ou editar operadores e técnicos participantes"
          >
            <UserPlus size={13} />
            <span>{evaluation.participants?.length > 0 ? 'Editar Equipe' : '+ Adicionar Participantes'}</span>
          </button>
        </div>
      </div>

      {/* Seletores de Pares 1x1 em Ficha Técnica */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {evaluation.comparisons?.map((comp: any, idx: number) => {
          const isActive = idx === activeComparisonIndex;
          const supPercent = comp.technicalResult?.libusSuperiorityPercent ?? 0;
          return (
            <button
              key={comp.id}
              onClick={() => setActiveComparisonIndex(idx)}
              className={`flex-shrink-0 p-4 rounded-2xl border text-left transition flex items-center gap-4 ${
                isActive
                  ? 'border-libus-magenta bg-white shadow-md ring-2 ring-pink-500/20'
                  : 'border-slate-200/80 bg-white/60 hover:bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {comp.libusProduct?.imageUrl && (
                  <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs">
                    <img
                      src={comp.libusProduct.imageUrl}
                      alt={comp.libusProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {comp.competitorProduct?.imageUrl ? (
                  <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs">
                    <img
                      src={comp.competitorProduct.imageUrl}
                      alt={comp.competitorProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : getManufacturerLogo(comp.competitorProduct?.manufacturer?.name) ? (
                  <div className="w-10 h-10 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs">
                    <img
                      src={getManufacturerLogo(comp.competitorProduct?.manufacturer?.name)!}
                      alt={comp.competitorProduct?.manufacturer?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : null}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    PAR COMPARATIVO #{idx + 1}
                  </p>
                  {comp.comparisonType === 'UPGRADE' && (
                    <span className="text-[8px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1 rounded uppercase">
                      Upgrade
                    </span>
                  )}
                </div>
                <p className="text-xs font-black text-slate-900">
                  <span className="text-libus-magenta">{comp.libusProduct?.name}</span>
                  <span className="text-slate-400 mx-1.5 font-normal">x</span>
                  <span className="text-slate-700">{comp.competitorProduct?.name}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <span>Fabricante: {comp.competitorProduct?.manufacturer?.name}</span>
                  {comp.libusProduct?.caNumber && (
                    <a
                      href={getCaConsultUrl(comp.libusProduct.caNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] font-mono px-1 py-0.2 rounded bg-pink-50 text-libus-magenta font-bold border border-pink-200 hover:underline inline-flex items-center gap-0.5"
                      title={`Consultar CA ${comp.libusProduct.caNumber} da Libus`}
                    >
                      <span>CA Libus: {comp.libusProduct.caNumber}</span>
                      <ExternalLink size={8} />
                    </a>
                  )}
                </div>
              </div>

              {comp.technicalResult?.validCriteria > 0 && (
                <div className="text-right pl-4 border-l border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Superioridade</span>
                  <span className="text-base font-black text-emerald-600 font-mono">{supPercent}%</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Navegação de Abas do Laudo - Responsiva com Scroll Horizontal */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveTab('TECNICA')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition font-mono flex-shrink-0 ${
            activeTab === 'TECNICA'
              ? 'border-libus-magenta text-libus-magenta'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={16} /> <span>1. Avaliação Técnica</span>
        </button>

        <button
          onClick={() => setActiveTab('ECONOMICA')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition font-mono flex-shrink-0 ${
            activeTab === 'ECONOMICA'
              ? 'border-libus-magenta text-libus-magenta'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign size={16} /> <span>2. Análise Econômica</span>
        </button>

        <button
          onClick={() => setActiveTab('RESULTADO')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition font-mono flex-shrink-0 ${
            activeTab === 'RESULTADO'
              ? 'border-libus-magenta text-libus-magenta'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award size={16} /> <span>3. Laudo Consolidado</span>
        </button>
      </div>

      {/* CONTEÚDO DA TAB TÉCNICA */}
      {activeTab === 'TECNICA' && (
        <div className="space-y-6">
          {/* Instrução Normativa */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-libus-magenta text-white mt-0.5">
                <Info size={16} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold uppercase tracking-wider text-libus-magenta font-mono">
                  Diretriz de Avaliação Técnica Libus
                </p>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Atribua notas de <strong>1 a 10</strong> para cada critério com base na percepção prática dos funcionários no posto de trabalho. Nota 10 representa a excelência operacional.
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveScores}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold rounded-xl text-xs shadow-lg hover:shadow-pink-500/20 flex items-center justify-center gap-2 transition flex-shrink-0 uppercase tracking-wider font-mono"
            >
              <Save size={14} /> {saving ? 'Processando...' : 'Salvar & Recalcular'}
            </button>
          </div>

          {/* Ficha de Critérios - Desktop Table & Mobile Touch Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            {/* Visão Tabela Desktop (md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-6 py-4 w-5/12">Critério de Performance de Campo</th>
                    <th className="px-6 py-4 text-center bg-pink-50/50 text-libus-magenta border-l border-r border-slate-200 font-black">
                      <div className="flex flex-col items-center gap-1">
                        <span>Libus ({activeComparison?.libusProduct?.name})</span>
                        {activeComparison?.libusProduct?.caNumber && (
                          <a
                            href={getCaConsultUrl(activeComparison.libusProduct.caNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white text-libus-magenta font-bold border border-pink-200 hover:bg-pink-50 hover:underline inline-flex items-center gap-0.5"
                            title={`Consultar Certificado de Aprovação CA ${activeComparison.libusProduct.caNumber} no Ministério do Trabalho`}
                          >
                            <span>CA: {activeComparison.libusProduct.caNumber}</span>
                            <ExternalLink size={8} />
                          </a>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center bg-slate-50 text-slate-800 border-r border-slate-200 font-black">
                      <div className="flex flex-col items-center gap-1">
                        <span>Concorrente ({activeComparison?.competitorProduct?.name})</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center">Veredito / N/A</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeComparison?.responses?.map((r: any) => {
                    const state = scoresMap[activeComparison.id]?.[r.attributeId] || { libus: null, comp: null, na: false };
                    const isNA = state.na;
                    const lScore = state.libus;
                    const cScore = state.comp;

                    let indicator = null;
                    if (!isNA && lScore && cScore) {
                      if (lScore > cScore) {
                        indicator = (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded uppercase font-mono">
                            Libus +{lScore - cScore}
                          </span>
                        );
                      } else if (lScore < cScore) {
                        indicator = (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded uppercase font-mono">
                            Concorrente +{cScore - lScore}
                          </span>
                        );
                      } else {
                        indicator = (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded uppercase font-mono">
                            Equivalente
                          </span>
                        );
                      }
                    }

                    return (
                      <tr key={r.id} className={isNA ? 'bg-slate-50/70 opacity-50' : 'hover:bg-slate-50/40 transition'}>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {r.attribute?.name}
                        </td>

                        {/* Seletor Libus */}
                        <td className="px-6 py-3 text-center bg-pink-50/30 border-l border-r border-slate-100">
                          <select
                            disabled={isNA}
                            value={state.libus ?? ''}
                            onChange={(e) => handleScoreChange(r.attributeId, 'libus', Number(e.target.value))}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-libus-magenta focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-xs cursor-pointer"
                          >
                            <option value="">Nota...</option>
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                              <option key={n} value={n}>{n} {n === 10 ? '★ (Melhor)' : ''}</option>
                            ))}
                          </select>
                        </td>

                        {/* Seletor Concorrente */}
                        <td className="px-6 py-3 text-center bg-slate-50/80 border-r border-slate-100">
                          <select
                            disabled={isNA}
                            value={state.comp ?? ''}
                            onChange={(e) => handleScoreChange(r.attributeId, 'comp', Number(e.target.value))}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-800 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 shadow-xs cursor-pointer"
                          >
                            <option value="">Nota...</option>
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                              <option key={n} value={n}>{n} {n === 10 ? '★ (Melhor)' : ''}</option>
                            ))}
                          </select>
                        </td>

                        {/* Status / N/A */}
                        <td className="px-6 py-3 text-center">
                          <div className="flex items-center justify-center gap-3">
                            {indicator}
                            <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer font-medium hover:text-slate-800">
                              <input
                                type="checkbox"
                                checked={isNA}
                                onChange={() => handleToggleNA(r.attributeId)}
                                className="rounded border-slate-300 text-libus-magenta focus:ring-pink-400"
                              />
                              <span>N/A</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visão Mobile Touch Cards (md:hidden) com Pílulas Táteis 1-10 */}
            <div className="md:hidden divide-y divide-slate-100">
              {activeComparison?.responses?.map((r: any) => {
                const state = scoresMap[activeComparison.id]?.[r.attributeId] || { libus: null, comp: null, na: false };
                const isNA = state.na;
                const lScore = state.libus;
                const cScore = state.comp;

                let indicator = null;
                if (!isNA && lScore && cScore) {
                  if (lScore > cScore) {
                    indicator = (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                        Libus +{lScore - cScore}
                      </span>
                    );
                  } else if (lScore < cScore) {
                    indicator = (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-mono">
                        Concorrente +{cScore - lScore}
                      </span>
                    );
                  } else {
                    indicator = (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono">
                        Equivalente
                      </span>
                    );
                  }
                }

                return (
                  <div key={r.id} className={`p-3.5 space-y-3 ${isNA ? 'bg-slate-50/70 opacity-60' : 'bg-white'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900 text-xs flex-1">
                        {r.attribute?.name}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {indicator}
                        <label className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600 font-mono cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isNA}
                            onChange={() => handleToggleNA(r.attributeId)}
                            className="rounded border-slate-300 text-libus-magenta focus:ring-pink-400"
                          />
                          <span>N/A</span>
                        </label>
                      </div>
                    </div>

                    {!isNA && (
                      <div className="space-y-2.5 pt-0.5">
                        {/* Seletor Rápido Libus (Touch Chips 1 a 10) */}
                        <div className="p-2.5 rounded-xl bg-pink-50/50 border border-pink-100 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-libus-magenta font-mono">
                              Libus: {lScore ? `Nota ${lScore}` : 'Selecione'}
                            </span>
                            {lScore === 10 && (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                                ★ Excelência
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-10 gap-1">
                            {[1,2,3,4,5,6,7,8,9,10].map(n => {
                              const isSelected = lScore === n;
                              return (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => handleScoreChange(r.attributeId, 'libus', n)}
                                  className={`py-1.5 text-xs font-black rounded-lg transition active:scale-90 font-mono flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-libus-magenta text-white shadow-sm ring-2 ring-pink-400'
                                      : 'bg-white text-slate-700 border border-slate-200 hover:border-pink-300'
                                  }`}
                                >
                                  {n}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Seletor Rápido Concorrente (Touch Chips 1 a 10) */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono truncate">
                              {activeComparison?.competitorProduct?.manufacturer?.name || 'Concorrente'}: {cScore ? `Nota ${cScore}` : 'Selecione'}
                            </span>
                            {cScore === 10 && (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                                ★ Excelência
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-10 gap-1">
                            {[1,2,3,4,5,6,7,8,9,10].map(n => {
                              const isSelected = cScore === n;
                              return (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => handleScoreChange(r.attributeId, 'comp', n)}
                                  className={`py-1.5 text-xs font-black rounded-lg transition active:scale-90 font-mono flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-slate-800 text-white shadow-sm ring-2 ring-slate-600'
                                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                                  }`}
                                >
                                  {n}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA TAB ECONÔMICA */}
      {activeTab === 'ECONOMICA' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-libus-accent"></span>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Parâmetros Econômicos & Projeção de Consumo
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Informe os custos reais de aquisição e a durabilidade média observada no ambiente produtivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Libus (Proposta Homologada) à Esquerda com Foto */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  {activeComparison?.libusProduct?.imageUrl ? (
                    <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-700 shadow-xs">
                      <img
                        src={activeComparison.libusProduct.imageUrl}
                        alt={activeComparison.libusProduct.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-libus-magenta border border-slate-700">
                      <ShieldCheck size={24} />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-libus-magenta font-bold font-mono uppercase tracking-widest block">
                      PROPOSTA LIBUS
                    </span>
                    <h4 className="text-sm font-black text-white">
                      {activeComparison?.libusProduct?.name}
                    </h4>
                    {activeComparison?.libusProduct?.caNumber && (
                      <a
                        href={getCaConsultUrl(activeComparison.libusProduct.caNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-mono px-1.5 py-0.2 mt-1 rounded bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30 hover:bg-pink-500/30 transition inline-flex items-center gap-0.5"
                        title={`Consultar Certificado de Aprovação CA ${activeComparison.libusProduct.caNumber} no Ministério do Trabalho`}
                      >
                        <span>CA: {activeComparison.libusProduct.caNumber}</span>
                        <ExternalLink size={8} className="opacity-70" />
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-libus-magenta font-bold border border-pink-500/30">
                  HOMOLOGAÇÃO
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">Preço Unitário Proposto (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={economicInputs[activeComparison?.id]?.libusPrice ?? 0}
                  onChange={(e) => setEconomicInputs({
                    ...economicInputs,
                    [activeComparison?.id]: {
                      ...economicInputs[activeComparison?.id],
                      libusPrice: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:ring-2 focus:ring-libus-magenta/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">Vida Útil Estimada Libus (Meses)</label>
                <input
                  type="number"
                  step="0.1"
                  value={economicInputs[activeComparison?.id]?.lifespanLibus ?? 0}
                  onChange={(e) => setEconomicInputs({
                    ...economicInputs,
                    [activeComparison?.id]: {
                      ...economicInputs[activeComparison?.id],
                      lifespanLibus: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:ring-2 focus:ring-libus-magenta/40"
                />
              </div>
            </div>

            {/* 2. Concorrente (Produto Atual) à Direita */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  {activeComparison?.competitorProduct?.imageUrl ? (
                    <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs">
                      <img
                        src={activeComparison.competitorProduct.imageUrl}
                        alt={activeComparison.competitorProduct.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : getManufacturerLogo(activeComparison?.competitorProduct?.manufacturer?.name) ? (
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs">
                      <img
                        src={getManufacturerLogo(activeComparison?.competitorProduct?.manufacturer?.name)!}
                        alt={activeComparison?.competitorProduct?.manufacturer?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-200 shadow-2xs font-mono font-bold text-xs">
                      {activeComparison?.competitorProduct?.manufacturer?.name?.substring(0, 3).toUpperCase() || 'EPI'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      {getManufacturerLogo(activeComparison?.competitorProduct?.manufacturer?.name) && (
                        <img
                          src={getManufacturerLogo(activeComparison?.competitorProduct?.manufacturer?.name)!}
                          alt={activeComparison?.competitorProduct?.manufacturer?.name}
                          className="w-3.5 h-3.5 object-contain flex-shrink-0"
                        />
                      )}
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">
                        {activeComparison?.competitorProduct?.manufacturer?.name || 'CONCORRENTE'}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">
                      {activeComparison?.competitorProduct?.name}
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-200 font-bold">
                  PRODUTO ATUAL
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Preço Unitário Atual (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={economicInputs[activeComparison?.id]?.currentPrice ?? 0}
                  onChange={(e) => setEconomicInputs({
                    ...economicInputs,
                    [activeComparison?.id]: {
                      ...economicInputs[activeComparison?.id],
                      currentPrice: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-libus-lightBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Vida Útil Média (Meses no Posto)</label>
                <input
                  type="number"
                  step="0.1"
                  value={economicInputs[activeComparison?.id]?.lifespanCurrent ?? 0}
                  onChange={(e) => setEconomicInputs({
                    ...economicInputs,
                    [activeComparison?.id]: {
                      ...economicInputs[activeComparison?.id],
                      lifespanCurrent: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-libus-lightBlue"
                />
              </div>
            </div>
          </div>

          {/* Impacto operacional das trocas e do descarte */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1"></span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                    Impacto de Trocas e Descarte (Opcional)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Use somente se o cliente souber esses valores. Caso contrário, deixe os campos em 0.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-bold flex-shrink-0">
                CÁLCULO ANUAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                  Custo aproximado de cada troca (R$)
                </label>
                <span className="text-[11px] text-slate-500 block mb-2">
                  Exemplo: tempo do almoxarifado, entrega do novo EPI e descarte. Se não souber, deixe 0.
                </span>
                <input
                  type="number"
                  step="0.10"
                  placeholder="Ex: 2.50"
                  value={economicInputs[activeComparison?.id]?.disposalCostPerUnit ?? 0}
                  onChange={(e) => setEconomicInputs({
                    ...economicInputs,
                    [activeComparison?.id]: {
                      ...economicInputs[activeComparison?.id],
                      disposalCostPerUnit: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                  Peso de uma unidade (gramas)
                </label>
                <span className="text-[11px] text-slate-500 block mb-2">
                  Usado para estimar o peso do resíduo evitado. Se não souber, deixe 0.
                </span>
                <input
                  type="number"
                  step="5"
                  placeholder="Ex: 85"
                  value={economicInputs[activeComparison?.id]?.productWeightGrams ?? 0}
                  onChange={(e) => setEconomicInputs({
                    ...economicInputs,
                    [activeComparison?.id]: {
                      ...economicInputs[activeComparison?.id],
                      productWeightGrams: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-slate-200 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Quantidade de Postos / Usuários</label>
              <input
                type="number"
                value={economicInputs[activeComparison?.id]?.quantity ?? 1}
                onChange={(e) => setEconomicInputs({
                  ...economicInputs,
                  [activeComparison?.id]: {
                    ...economicInputs[activeComparison?.id],
                    quantity: Number(e.target.value)
                  }
                })}
                className="w-48 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900"
              />
            </div>

            <button
              onClick={handleSaveEconomic}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold rounded-xl text-xs shadow-lg hover:shadow-pink-500/20 flex items-center justify-center gap-2 transition uppercase tracking-wider font-mono"
            >
              <Save size={14} /> Calcular Projeção Financeira
            </button>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA TAB RESULTADO */}
      {activeTab === 'RESULTADO' && (
        <div className="space-y-6">
          {/* Card Superioridade Técnica */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 bg-libus-charcoal text-white rounded font-mono">
                ÍNDICE DE PERFORMANCE NORMATIVA
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Superioridade Técnica Libus
              </h3>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                Percentual exato de critérios técnicos válidos em que o equipamento Libus obteve pontuação superior à do concorrente avaliado pela equipe técnica e operacional.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0F141F] via-[#1A2130] to-[#0A0D14] text-white text-center min-w-[240px] shadow-xl border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">SUPERIORIDADE LIBUS</p>
              <p className="text-5xl font-black text-libus-magenta mt-2 font-mono tracking-tight">
                {technicalResult?.libusSuperiorityPercent ?? 0}%
              </p>
              <p className="text-[11px] text-slate-300 mt-3 font-medium">
                Venceu em <strong className="text-white">{technicalResult?.libusSuperiorCount ?? 0}</strong> de {technicalResult?.validCriteria ?? 0} critérios válidos
              </p>
            </div>
          </div>

          {/* Breakdown Técnico - KPI Minimalista */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">Vitórias Libus</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600">SUPERIOR</span>
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">{technicalResult?.libusSuperiorCount ?? 0}</p>
              <p className="text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2 mt-2">Critérios normativos superados</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">Empatados</span>
                <span className="text-[10px] font-mono font-bold text-slate-400">EQUIVALENTE</span>
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">{technicalResult?.drawCount ?? 0}</p>
              <p className="text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2 mt-2">Critérios com mesma pontuação</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">Concorrente</span>
                <span className="text-[10px] font-mono font-bold text-amber-600">ATENÇÃO</span>
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">{technicalResult?.competitorSuperiorCount ?? 0}</p>
              <p className="text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2 mt-2">Critérios com ponto de melhoria</p>
            </div>
          </div>

          {/* Card Econômico */}
          {economicResult && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                    Demonstrativo Financeiro & Economia Projetada
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Base de cálculo anual baseada no ciclo de troca</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                  <span>Economia de {economicResult.economyPercent}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Custo Atual (Concorrente)</span>
                  <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                    R$ {economicResult.costCurrentTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">Custo total no período</span>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-libus-magenta font-bold uppercase tracking-wider font-mono">Custo Proposto (Libus)</span>
                  <p className="text-2xl font-black text-white mt-2 font-mono">
                    R$ {economicResult.costLibusTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">Proposta técnica homologada</span>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">Economia na Compra</span>
                  <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                    R$ {economicResult.economyGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">Redução direta de custo</span>
                </div>
              </div>

              {/* Resumo das trocas e do descarte */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-200/80 pb-3 gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-0.5"></span>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 font-mono">
                        Resumo de Trocas e Descarte
                      </h4>
                      <p className="text-[11px] text-emerald-800/80 mt-1">
                        Estimativa anual baseada na vida útil e nos valores informados.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-600 text-white shadow-xs self-start sm:self-auto">
                    RESULTADO ANUAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-800">
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Trocas evitadas por ano</span>
                    <p className="text-2xl font-black text-emerald-800 mt-1 font-mono">
                      -{Math.max(0, (economicResult.unitsDiscardedCurrent || 0) - (economicResult.unitsDiscardedLibus || 0))} peças
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1">
                      De {economicResult.unitsDiscardedCurrent || 0} para {economicResult.unitsDiscardedLibus || 0} trocas anuais
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Resíduo evitado</span>
                    <p className="text-2xl font-black text-emerald-800 mt-1 font-mono">
                      -{economicResult.wasteKgReduced || 0} kg
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1">Massa de polímero retirada do descarte</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Economia Total (TCO + Descarte)</span>
                    <p className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                      R$ {(economicResult.totalAnnualSavings || economicResult.economyGenerated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1">
                      Inclui +R$ {(economicResult.disposalCostSavings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em taxa/almoxarifado
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Modal de Homologação com Assinatura Digital na Tela & Termo NR-6 */}
      <HomologationSignatureModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        evaluationId={evaluation.id}
        companyName={evaluation.company?.tradeName || 'Cliente'}
        defaultTechnicianName={evaluation.leadTechnician?.name || ''}
        participants={evaluation.participants || []}
        onSuccess={(updatedEval) => {
          setEvaluation({
            ...evaluation,
            ...updatedEval,
            status: 'COMPLETED'
          });
          alert('Laudo técnico assinado e homologado com sucesso!');
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-600">CONFIRMAÇÃO DE SEGURANÇA</span>
                <h3 className="text-base font-black text-slate-900">Excluir Avaliação / Laudo?</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Você está prestes a excluir este laudo da empresa <strong className="text-slate-900">{evaluation.company?.tradeName}</strong>.
            </p>
            <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
              Esta ação removerá permanentemente as notas técnicas, critérios comparativos e cálculos econômicos vinculados.
            </p>

            <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteEvaluation}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider flex items-center gap-2"
              >
                <Trash2 size={13} />
                <span>{deleting ? 'Excluindo...' : 'Sim, Excluir Laudo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de Participantes / Equipe Técnica */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center flex-shrink-0 text-libus-magenta">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-libus-magenta">
                    EQUIPE DE TESTE & SESMT
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Gerenciar Participantes do Laudo
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Cadastre ou atualize os operadores, técnicos de segurança ou membros do SESMT da empresa <strong>{evaluation.company?.tradeName}</strong> que participaram dos testes práticos de campo.
            </p>

            <div className="space-y-3 pt-2">
              {modalParticipants.map((p, index) => (
                <div key={index} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono text-slate-600 uppercase">
                      Participante #{index + 1}
                    </span>
                    {modalParticipants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipantRow(index)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 transition"
                      >
                        <Trash2 size={12} /> Remover
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: João Silva"
                        value={p.name}
                        onChange={(e) => handleUpdateParticipantField(index, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Área / Cargo / Função *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Operador de Caldeira, TST, Compras"
                        value={p.roleOrArea}
                        onChange={(e) => handleUpdateParticipantField(index, 'roleOrArea', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                        E-mail (Opcional)
                      </label>
                      <input
                        type="email"
                        placeholder="colaborador@empresa.com.br"
                        value={p.email || ''}
                        onChange={(e) => handleUpdateParticipantField(index, 'email', e.target.value)}
                        className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                        Telefone / Ramal (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="(11) 99999-9999"
                        value={p.phone || ''}
                        onChange={(e) => handleUpdateParticipantField(index, 'phone', e.target.value)}
                        className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddParticipantRow}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-mono rounded-xl border border-dashed border-slate-300 transition flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Adicionar Mais um Participante
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowParticipantsModal(false)}
                disabled={savingParticipants}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveParticipants}
                disabled={savingParticipants}
                className="px-5 py-2.5 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider flex items-center gap-2"
              >
                <Save size={14} />
                <span>{savingParticipants ? 'Salvando...' : 'Salvar Equipe'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar no Mobile para Gravação Rápida */}
      {activeTab === 'TECNICA' && (
        <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 p-2.5 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-500 truncate pl-1">
            {activeComparison?.libusProduct?.name ? (
              <span className="font-bold text-slate-800 truncate block">
                {activeComparison.libusProduct.name}
              </span>
            ) : (
              <span>Notas do par técnico</span>
            )}
          </div>
          <button
            onClick={handleSaveScores}
            disabled={saving}
            className="px-4 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition flex-shrink-0 uppercase tracking-wider font-mono active:scale-95 disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Gravando...' : 'Salvar Notas'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
