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
  Trash2
} from 'lucide-react';
import { getManufacturerLogo } from '../utils/manufacturerLogos';

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

  // Estados locais das notas por comparação
  const [scoresMap, setScoresMap] = useState<Record<string, Record<string, { libus: number | null; comp: number | null; na: boolean }>>>({});

  // Estados locais econômicos
  const [economicInputs, setEconomicInputs] = useState<Record<string, {
    currentPrice: number;
    libusPrice: number;
    quantity: number;
    lifespanCurrent: number;
    lifespanLibus: number;
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
              lifespanLibus: comp.economicResult.lifespanLibus
            };
          } else {
            initialEconomic[comp.id] = {
              currentPrice: 35.0,
              libusPrice: 28.5,
              quantity: 50,
              lifespanCurrent: 3,
              lifespanLibus: 6
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
    if (!confirm('Deseja homologar oficialmente esta avaliação?')) return;
    try {
      await apiRequest(`/evaluations/${id}/complete`, { method: 'PATCH' });
      setEvaluation({ ...evaluation, status: 'COMPLETED' });
      alert('Laudo técnico homologado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao concluir avaliação');
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
                onClick={handleCompleteEvaluation}
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

      {/* Participantes da Empresa Avaliada */}
      <div className="bg-slate-100/70 border border-slate-200/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-libus-magenta">
            <Users size={16} />
          </div>
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
            Equipe Participante:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {evaluation.participants?.map((p: any) => (
            <div key={p.id} className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold shadow-xs flex items-center gap-1.5">
              <span>{p.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">[{p.roleOrArea}]</span>
            </div>
          ))}
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
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  PAR COMPARATIVO #{idx + 1}
                </p>
                <p className="text-xs font-black text-slate-900">
                  <span className="text-libus-magenta">{comp.libusProduct?.name}</span>
                  <span className="text-slate-400 mx-1.5 font-normal">x</span>
                  <span className="text-slate-700">{comp.competitorProduct?.name}</span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Fabricante: {comp.competitorProduct?.manufacturer?.name}</p>
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

      {/* Navegação de Abas do Laudo */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setActiveTab('TECNICA')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition font-mono ${
            activeTab === 'TECNICA'
              ? 'border-libus-magenta text-libus-magenta'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={16} /> <span>1. Avaliação Técnica (Notas 1 a 10)</span>
        </button>

        <button
          onClick={() => setActiveTab('ECONOMICA')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition font-mono ${
            activeTab === 'ECONOMICA'
              ? 'border-libus-magenta text-libus-magenta'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign size={16} /> <span>2. Análise Econômica & Consumo</span>
        </button>

        <button
          onClick={() => setActiveTab('RESULTADO')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition font-mono ${
            activeTab === 'RESULTADO'
              ? 'border-libus-magenta text-libus-magenta'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award size={16} /> <span>3. Laudo Executivo Consolidado</span>
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

          {/* Ficha de Critérios */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 font-mono">
                <tr>
                  <th className="px-6 py-4 w-5/12">Critério Técnico / Requisito Normativo</th>
                  <th className="px-6 py-4 text-center bg-pink-50/50 text-libus-magenta border-l border-r border-slate-200 font-black">
                    Libus ({activeComparison?.libusProduct?.name})
                  </th>
                  <th className="px-6 py-4 text-center bg-slate-50 text-slate-800 border-r border-slate-200 font-black">
                    Concorrente ({activeComparison?.competitorProduct?.name})
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
                      <td className="px-6 py-3 text-center bg-blue-50/20 border-l border-r border-slate-100">
                        <select
                          disabled={isNA}
                          value={state.libus ?? ''}
                          onChange={(e) => handleScoreChange(r.attributeId, 'libus', Number(e.target.value))}
                          className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-libus-blue focus:ring-2 focus:ring-libus-lightBlue focus:border-libus-lightBlue shadow-xs cursor-pointer"
                        >
                          <option value="">Nota...</option>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>{n} {n === 10 ? '★ (Melhor)' : ''}</option>
                          ))}
                        </select>
                      </td>

                      {/* Seletor Concorrente */}
                      <td className="px-6 py-3 text-center bg-amber-50/20 border-r border-slate-100">
                        <select
                          disabled={isNA}
                          value={state.comp ?? ''}
                          onChange={(e) => handleScoreChange(r.attributeId, 'comp', Number(e.target.value))}
                          className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs cursor-pointer"
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
                              className="rounded border-slate-300 text-libus-blue focus:ring-libus-lightBlue"
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
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">Economia Anual Gerada</span>
                  <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                    R$ {economicResult.economyGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">Redução direta de custo</span>
                </div>
              </div>

              {/* Termo de Homologação e Assinaturas */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
                    Termo de Homologação & Validação Técnica de Campo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Declaro que a avaliação acima reflete a pontuação e os testes de uso dos colaboradores nas atividades operacionais.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="border-t-2 border-slate-300 pt-3 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900">{evaluation.leadTechnician?.name}</p>
                    <p className="text-[11px] text-slate-500 uppercase font-mono">Libus do Brasil • Divisão Técnica</p>
                  </div>

                  <div className="border-t-2 border-slate-300 pt-3 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900">
                      {evaluation.participants?.[0]?.name || 'Responsável Técnico / SESMT'}
                    </p>
                    <p className="text-[11px] text-slate-500 uppercase font-mono">
                      {evaluation.company?.tradeName} • Cliente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
    </div>
  );
};
