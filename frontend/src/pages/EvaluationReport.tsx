import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { LibusLogo } from '../components/LibusLogo';
import { getManufacturerLogo } from '../utils/manufacturerLogos';
import { getCaConsultUrl } from '../utils/caHelper';
import {
  ShieldCheck,
  Award,
  DollarSign,
  CheckCircle2,
  Printer,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  FileCheck2,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Leaf,
  Recycle,
  Trash2,
  PenTool,
  Clock
} from 'lucide-react';
import { HomologationSignatureModal } from '../components/HomologationSignatureModal';

export const EvaluationReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showA4Guide, setShowA4Guide] = useState<boolean>(true);
  const [showSignModal, setShowSignModal] = useState<boolean>(false);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await apiRequest(`/evaluations/${id}`);
        setEvaluation(data.evaluation);
      } catch (err) {
        console.error('Erro ao carregar laudo:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handlePrint = async () => {
    try {
      if (id) {
        apiRequest(`/evaluations/${id}/audit-emission`, {
          method: 'POST',
          body: JSON.stringify({ actionType: 'PRINT_PDF' })
        }).catch(() => {});
      }
    } catch (_) {}
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-libus-magenta border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Consolidando Laudo Técnico Oficial...
        </p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Laudo Técnico não localizado</h2>
        <p className="text-xs text-slate-500 mt-1">Verifique o link ou retorne para o histórico de avaliações.</p>
        <Link
          to="/evaluations"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-libus-charcoal text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft size={14} />
          <span>Voltar ao Histórico</span>
        </Link>
      </div>
    );
  }

  const { company, leadTechnician, participants = [], comparisons = [], createdAt } = evaluation;

  // Cálculos consolidados gerais do Laudo
  let totalEconomicSavings = 0;
  let totalDisposalSavings = 0;
  let totalWasteKgAvoided = 0;
  let totalPiecesDiscardAvoided = 0;
  let totalTechnicalScores = 0;
  let validComparisonsCount = 0;
  let totalLibusAvg = 0;
  let totalCompetitorAvg = 0;
  let libusWinsCount = 0;
  let tiesCount = 0;

  comparisons.forEach((comp: any) => {
    if (comp.economicResult) {
      const eco = comp.economicResult;
      totalEconomicSavings += eco.totalAnnualSavings || eco.economyGenerated || 0;
      totalDisposalSavings += eco.disposalCostSavings || 0;
      totalWasteKgAvoided += eco.wasteKgReduced || 0;
      const discardedCurr = eco.unitsDiscardedCurrent || 0;
      const discardedLib = eco.unitsDiscardedLibus || 0;
      totalPiecesDiscardAvoided += Math.max(0, discardedCurr - discardedLib);
    }
    const sup = comp.technicalResult?.libusSuperiorityPercent ?? comp.technicalResult?.superiorityPercent;
    if (sup !== undefined && sup !== null) {
      totalTechnicalScores += Number(sup);
      validComparisonsCount++;
    }

    const lAvg = comp.technicalResult?.libusAverageScore ?? comp.technicalResult?.libusAverage;
    const cAvg = comp.technicalResult?.competitorAverageScore ?? comp.technicalResult?.competitorAverage;

    if (lAvg !== undefined && lAvg !== null) totalLibusAvg += Number(lAvg);
    if (cAvg !== undefined && cAvg !== null) totalCompetitorAvg += Number(cAvg);

    if (lAvg && cAvg) {
      if (lAvg > cAvg) libusWinsCount++;
      else if (lAvg === cAvg) tiesCount++;
    }
  });

  const avgSuperiority = validComparisonsCount > 0 ? (totalTechnicalScores / validComparisonsCount).toFixed(1) : '100';
  const overallLibusScore = validComparisonsCount > 0 ? (totalLibusAvg / validComparisonsCount).toFixed(1) : '-';
  const overallCompetitorScore = validComparisonsCount > 0 ? (totalCompetitorAvg / validComparisonsCount).toFixed(1) : '-';

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto pb-20">
      {/* Barra Superior de Ações e Pré-Visualizador A4 (Oculta na Impressão) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm no-print sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <Link
            to={`/evaluations/${id}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Voltar para Edição / Bancada"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                PRÉVIA DO DOCUMENTO (FOLHA A4)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-bold border border-slate-900">
                CONFORME NR-6
              </span>
            </div>
            <h1 className="text-base font-black text-slate-900 leading-snug tracking-tight">
              Laudo Técnico de Homologação: {company?.tradeName}
            </h1>
          </div>
        </div>

        {/* Controles de Zoom e Impressão */}
        <div className="flex items-center gap-2 self-end md:self-auto font-sans">
          <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
              title="Diminuir Zoom"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-2 text-slate-600 font-bold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
              title="Aumentar Zoom"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowA4Guide(!showA4Guide)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              showA4Guide
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Eye size={14} />
            <span>{showA4Guide ? 'Modo Folha A4' : 'Modo Expandido'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 cursor-pointer"
          >
            <Printer size={15} />
            <span>Imprimir / Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* Banner de Homologação / Assinatura Digital Pendente (Oculto na Impressão) */}
      {!evaluation.signedAt && (
        <div className="no-print bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
              <PenTool size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase font-mono tracking-wider">
                Assinaturas Digitais Pendentes
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Este laudo ainda não possui as assinaturas manuscritas na tela do Especialista Libus e do Responsável pelo Cliente (SESMT).
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSignModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <PenTool size={14} />
            <span>Assinar na Tela Agora</span>
          </button>
        </div>
      )}

      {/* ÁREA DE PRÉ-VISUALIZAÇÃO DE DOCUMENTO (ESTILO FOLHA DE PAPEL A4 REAL) */}
      <div
        id="report-preview-wrapper"
        className="flex justify-center overflow-x-auto p-2 sm:p-6 bg-slate-100 rounded-3xl border border-slate-200"
      >
        <div
          id="printable-report-sheet"
          style={{
            transform: showA4Guide && zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center'
          }}
          className={`${
            showA4Guide
              ? 'w-[210mm] min-h-[297mm] shadow-xl ring-1 ring-slate-200 bg-white mx-auto'
              : 'w-full bg-white shadow-md'
          } rounded-none p-[6mm] space-y-2.5 text-slate-900 font-sans`}
        >

          {/* 1. CABEÇALHO INSTITUCIONAL & CAPA EXECUTIVA */}
          <header className="border-b-2 border-slate-900 pb-2 flex flex-row justify-between items-start gap-4 break-inside-avoid">
            <div className="space-y-0.5">
              <LibusLogo className="h-6 w-auto" textColor="#0F141F" badgeText="PARTNER" />
              <div className="text-[9.5px] text-slate-600 space-y-0.5 font-medium leading-tight">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[8.5px]">
                  Libus do Brasil • Divisão de Engenharia de Aplicação & Homologação
                </p>
                <p className="text-[8px] text-slate-500">Normas Regulamentadoras NR-6 • Certificados de Aprovação (C.A.) Ministério do Trabalho</p>
              </div>
            </div>

            <div className="text-right border-l border-slate-200 pl-3 space-y-0.5 flex-shrink-0">
              <div className="inline-block px-2 py-0.5 rounded bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest print-exact">
                LAUDO TÉCNICO OFICIAL
              </div>
              <p className="text-[9.5px] font-bold text-slate-800">
                REG: LIB-{new Date(createdAt).getFullYear()}-{id?.slice(-6).toUpperCase()}
              </p>
              <p className="text-[8.5px] text-slate-500">
                Data: {new Date(createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </header>

          {/* 2. DADOS CADASTRAIS DA EMPRESA E RESPONSÁVEIS */}
          <section className="grid grid-cols-2 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs break-inside-avoid print-exact">
            <div className="space-y-0.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 block">
                1. EMPRESA HOMOLOGADA / CLIENTE
              </span>
              <h2 className="text-[10.5px] font-bold text-slate-900 leading-tight">{company?.corporateName || company?.tradeName}</h2>
              <div className="grid grid-cols-2 gap-1 text-slate-700 font-medium pt-0.5 text-[9px]">
                <div>
                  <span className="text-slate-400 block text-[8px]">Nome Fantasia:</span>
                  <span className="font-bold text-slate-800 block">{company?.tradeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px]">CNPJ:</span>
                  <span className="block font-mono">{company?.cnpj || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px]">Segmento:</span>
                  <span className="block">{company?.segment || 'Geral'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px]">Localidade:</span>
                  <span className="block">{company?.city ? `${company.city} - ${company.state}` : 'Brasil'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-0.5 border-l border-slate-200 pl-2.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 block">
                2. EQUIPE TÉCNICA RESPONSÁVEL
              </span>
              <div className="space-y-0.5 pt-0.5 text-slate-700 text-[9px]">
                <div>
                  <span className="text-slate-400 block text-[8px]">Especialista Libus:</span>
                  <span className="font-bold text-slate-900">{leadTechnician?.name}</span>
                  <span className="text-[8px] text-slate-500 block">{leadTechnician?.email}</span>
                </div>

                {participants.length > 0 && (
                  <div>
                    <span className="text-slate-400 block text-[8px]">Participantes SESMT:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {participants.map((p: any) => (
                        <span
                          key={p.id}
                          className="inline-block px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[8px] font-semibold text-slate-700"
                        >
                          {p.name} {p.department ? `(${p.department})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. SUMÁRIO EXECUTIVO DE SUPERIORIDADE E ECONOMIA CONSOLIDADA */}
          <section className="bg-slate-900 text-white rounded-xl p-2.5 shadow-xs break-inside-avoid print-exact print:bg-slate-900 print:text-white">
            <div className="flex items-center justify-between gap-1.5 mb-1.5 border-b border-white/10 pb-1">
              <div className="flex items-center gap-1.5">
                <Award className="text-libus-magenta" size={13} />
                <h2 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-200">
                  Sumário Executivo & Média Global da Empresa ({company?.tradeName || 'Cliente'})
                </h2>
              </div>
              {comparisons.length > 1 && (
                <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  PORTFÓLIO MULTI-ITEM ({comparisons.length} EPIs CONSOLIDADOS)
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 text-center divide-x divide-white/10">
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-slate-400">Pares Homologados</span>
                <p className="text-sm font-bold text-white leading-tight">{comparisons.length}</p>
                <span className="text-[7.5px] text-slate-400 block">
                  {libusWinsCount} superados / {tiesCount} equivalentes
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-slate-300 font-bold">
                  Score Médio Libus vs Atual
                </span>
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold leading-tight">
                  <span className="text-white">{overallLibusScore}</span>
                  <span className="text-slate-500 text-[10px]">vs</span>
                  <span className="text-slate-400">{overallCompetitorScore}</span>
                </div>
                <span className="text-[7.5px] text-slate-300 block">Média de notas (1 a 10)</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold">
                  Superioridade Média Global
                </span>
                <p className="text-sm font-bold text-emerald-400 leading-tight">+{avgSuperiority}%</p>
                <span className="text-[7.5px] text-slate-300 block">Norma, Ergonomia e Campo</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-slate-300 font-bold">
                  Economia Anual Total (TCO)
                </span>
                <p className="text-sm font-bold text-emerald-400 leading-tight">
                  R$ {totalEconomicSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[7.5px] text-slate-400 block">Aquisição direta + Descarte</span>
              </div>
            </div>

            {/* Painel ESG & Economia Circular Consolidada (quando houver métricas de resíduo ou descarte) */}
            {(totalWasteKgAvoided > 0 || totalPiecesDiscardAvoided > 0 || totalDisposalSavings > 0) && (
              <div className="mt-2 pt-2 border-t border-white/10 bg-emerald-950/40 -mx-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-[8.5px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                    <Leaf size={12} />
                  </div>
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-300 block">
                      Impacto ESG & Redução de Resíduos Industriais (Economia Circular)
                    </span>
                    <span className="text-[7.5px] text-slate-300">
                      Menor frequência de descarte pela maior durabilidade e ciclo de vida dos EPIs Libus
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  {totalPiecesDiscardAvoided > 0 && (
                    <div>
                      <span className="text-[7px] text-slate-400 uppercase block">Descartes Evitados:</span>
                      <span className="font-mono font-bold text-emerald-300 text-[9.5px]">
                        -{totalPiecesDiscardAvoided.toLocaleString('pt-BR')} peças/ano
                      </span>
                    </div>
                  )}
                  {totalWasteKgAvoided > 0 && (
                    <div>
                      <span className="text-[7px] text-slate-400 uppercase block">Resíduo Plástico/Sólido Evitado:</span>
                      <span className="font-mono font-bold text-emerald-300 text-[9.5px]">
                        -{totalWasteKgAvoided.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg/ano
                      </span>
                    </div>
                  )}
                  {totalDisposalSavings > 0 && (
                    <div>
                      <span className="text-[7px] text-slate-400 uppercase block">Economia Logística/MTR:</span>
                      <span className="font-mono font-bold text-emerald-300 text-[9.5px]">
                        +R$ {totalDisposalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tabela Resumo Rápido da Matriz quando houver múltiplos EPIs */}
            {comparisons.length > 1 && (
              <div className="mt-2 pt-2 border-t border-white/10 overflow-hidden text-[8.5px]">
                <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Matriz Sintética de Portfólio Avaliado ({comparisons.length} Postos / EPIs)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 font-sans">
                  {comparisons.map((c: any, i: number) => {
                    const lib = c.libusProduct;
                    const comp = c.competitorProduct;
                    const t = c.technicalResult;
                    const e = c.economicResult;
                    const sup = t?.libusSuperiorityPercent ?? t?.superiorityPercent ?? 0;
                    return (
                      <div
                        key={c.id || i}
                        className="bg-white/5 border border-white/10 rounded-md p-1.5 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="text-[7.5px] text-pink-400 font-mono font-bold block">
                            PAR #{i + 1} • {lib?.category?.name || 'EPI'}
                          </span>
                          <p className="text-[8px] font-bold text-slate-200 truncate">{lib?.name}</p>
                          <span className="text-[7px] text-slate-400 truncate block">vs {comp?.name || 'Atual'}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[8px] border border-emerald-500/30">
                            +{sup}%
                          </span>
                          {e?.economyGenerated && (
                            <span className="block text-[7px] text-slate-300 font-mono mt-0.5">
                              +R$ {Math.round(e.economyGenerated).toLocaleString('pt-BR')}/ano
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* 4. FICHAS COMPARATIVAS 1x1 DETALHADAS */}
          <section className="space-y-2.5">
            <div className="border-b border-slate-200 pb-1 flex items-center justify-between">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="text-libus-magenta" size={14} />
                <span>Matriz Comparativa de Performance de Campo (1x1)</span>
              </h2>
              <span className="text-[9px] text-slate-500 font-semibold">
                Critérios práticos avaliados com notas de 1 a 10
              </span>
            </div>

            {comparisons.map((comp: any, idx: number) => {
              const libus = comp.libusProduct;
              const competitor = comp.competitorProduct;
              const tech = comp.technicalResult;
              const eco = comp.economicResult;
              const competitorLogo = getManufacturerLogo(competitor?.manufacturer?.name);

              return (
                <div
                  key={comp.id}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs space-y-2 p-2.5 print:border-slate-300 print:shadow-none break-inside-avoid"
                >
                  {/* Cabeçalho do Par */}
                  <div className="flex flex-row justify-between items-center gap-2 border-b border-slate-100 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[8px] font-bold">
                        PAR #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">
                        {libus?.category?.name || 'Proteção Individual'}
                      </span>
                      {comp.comparisonType === 'UPGRADE' && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[8px] font-bold font-mono uppercase flex items-center gap-1">
                          <span>★ PROPOSTA DE UPGRADE</span>
                        </span>
                      )}
                    </div>
                    {tech && (
                      <div className="flex items-center gap-1 text-[9px] font-bold font-mono">
                        <span className="text-slate-400">Resultado:</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white border border-slate-900">
                          Libus +{tech.libusSuperiorityPercent ?? tech.superiorityPercent ?? 0}% Superior
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Justificativa Executiva de Upgrade (quando aplicável) */}
                  {comp.comparisonType === 'UPGRADE' && comp.upgradeJustification && (
                    <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200/80 text-[8.5px] text-amber-950 flex items-start gap-1.5">
                      <span className="font-bold text-amber-900 uppercase tracking-wider block font-mono text-[8px] whitespace-nowrap">
                        Direcionamento de Upgrade:
                      </span>
                      <span className="font-medium">{comp.upgradeJustification}</span>
                    </div>
                  )}

                  {/* Bloco Lado a Lado: Libus vs Concorrente */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Card Libus */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex gap-2.5 items-start print-exact">
                      <div className="w-11 h-11 rounded-lg bg-white p-0.5 flex-shrink-0 flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                        {libus?.imageUrl ? (
                          <img src={libus.imageUrl} alt={libus.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[8px] font-bold text-slate-800">LIBUS</span>
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1 text-[9.5px]">
                        <div className="flex items-center gap-1.5 text-[8px] font-bold">
                          <span className="text-slate-800 bg-slate-200 px-1.5 py-0.2 rounded uppercase">PROPOSTA LIBUS</span>
                          {libus?.internalCode && (
                            <span className="text-slate-500 font-medium">CÓD: {libus.internalCode}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-[11px] truncate leading-tight">{libus?.name}</h3>
                        <div className="flex items-center gap-2 text-[9px] text-slate-600">
                          {libus?.caNumber && (
                            <a
                              href={getCaConsultUrl(libus.caNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition inline-flex items-center gap-0.5 print:border-slate-300"
                              title={`Consultar Certificado de Aprovação CA ${libus.caNumber} no Ministério do Trabalho`}
                            >
                              <span>CA: {libus.caNumber}</span>
                              <ExternalLink size={7} className="no-print opacity-70" />
                            </a>
                          )}
                          <span>Média: <strong className="text-slate-900 text-[10px]">{tech?.libusAverageScore?.toFixed(1) || tech?.libusAverage?.toFixed(1) || '-'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Card Concorrente */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex gap-2.5 items-start print-exact">
                      <div className="w-11 h-11 rounded-lg bg-white p-0.5 flex-shrink-0 flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                        {competitor?.imageUrl ? (
                          <img src={competitor.imageUrl} alt={competitor.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[8px] font-bold text-slate-400">EPI</span>
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1 text-[9.5px]">
                        <div className="flex items-center gap-1.5 text-[8px] font-bold">
                          <span className="text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded uppercase">
                            ATUAL / CONCORRENTE
                          </span>
                          {competitorLogo && (
                            <img src={competitorLogo} alt={competitor?.manufacturer?.name} className="h-3 max-w-[32px] object-contain" />
                          )}
                        </div>
                        <h3 className="font-bold text-slate-800 text-[11px] truncate leading-tight">{competitor?.name}</h3>
                        <div className="flex items-center gap-2 text-[9px] text-slate-600">
                          <span>Média: <strong className="text-slate-800 text-[10px]">{tech?.competitorAverageScore?.toFixed(1) || tech?.competitorAverage?.toFixed(1) || '-'}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descritivo Técnico Oficial Libus */}
                  {libus?.description && (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[9px] text-slate-600 leading-snug font-medium">
                      <strong className="text-slate-800 font-bold text-[9px] block mb-0.2">Especificação Normativa do Modelo Libus:</strong>
                      {libus.description}
                    </div>
                  )}

                  {/* Tabela de Notas por Critério */}
                  {comp.responses && comp.responses.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[9px] border-collapse font-sans">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 font-bold text-[8.5px] uppercase tracking-wider border-b border-slate-200">
                            <th className="py-1 px-2">Critério Técnico Normativo</th>
                            <th className="py-1 px-2 text-center text-slate-900 font-bold">Nota Libus</th>
                            <th className="py-1 px-2 text-center text-slate-700 font-bold">Nota Atual</th>
                            <th className="py-1 px-2 text-center font-bold">Status</th>
                            <th className="py-1 px-2 font-bold">Observações de Campo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {comp.responses.map((resp: any) => {
                            const isLibusWinner = resp.libusScore > resp.competitorScore;
                            const isCompetitorWinner = resp.competitorScore > resp.libusScore;

                            return (
                              <tr key={resp.id} className="hover:bg-slate-50/80">
                                <td className="py-1 px-2 font-semibold text-slate-800">
                                  {resp.attribute?.name || 'Critério Avaliado'}
                                </td>
                                <td className="py-1 px-2 text-center font-bold text-slate-900 text-[10px]">
                                  {resp.isNotApplicable ? 'N/A' : resp.libusScore}
                                </td>
                                <td className="py-1 px-2 text-center font-bold text-slate-700 text-[10px]">
                                  {resp.isNotApplicable ? 'N/A' : resp.competitorScore}
                                </td>
                                <td className="py-1 px-2 text-center text-[8.5px]">
                                  {resp.isNotApplicable ? (
                                    <span className="text-slate-400 font-mono font-medium">N/A</span>
                                  ) : isLibusWinner ? (
                                    <span className="text-slate-900 font-mono font-bold bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                                      Libus Superior
                                    </span>
                                  ) : isCompetitorWinner ? (
                                    <span className="text-slate-600 font-mono font-bold bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                      Concorrente
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 font-mono font-bold bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                      Equivalente
                                    </span>
                                  )}
                                </td>
                                <td className="py-1 px-2 text-slate-500 italic text-[9px]">
                                  {resp.observation || '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Bloco Econômico do Par */}
                  {eco && (
                    <div className="space-y-1.5 font-sans">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-4 gap-2 text-[9px] print-exact">
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-medium block">Custo Unitário Libus:</span>
                          <span className="font-bold text-slate-900">
                            R$ {eco.libusPrice?.toFixed(2)} ({eco.lifespanLibus}m)
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-medium block">Custo Unitário Atual:</span>
                          <span className="font-bold text-slate-700">
                            R$ {eco.currentPrice?.toFixed(2)} ({eco.lifespanCurrent}m)
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 uppercase font-medium block">Usuários Ativos:</span>
                          <span className="font-bold text-slate-800">{eco.quantity} colab.</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-emerald-600 font-bold uppercase block">Economia Direta Compra:</span>
                          <span className="font-bold text-emerald-700 text-[10px]">
                            R$ {eco.economyGenerated?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({eco.economyPercent?.toFixed(1)}%)
                          </span>
                        </div>
                      </div>

                      {/* Sub-bloco de Descarte & ESG do Par (se houver dados) */}
                      {(eco.wasteKgReduced > 0 || eco.disposalCostSavings > 0 || (eco.unitsDiscardedCurrent - eco.unitsDiscardedLibus) > 0) && (
                        <div className="px-2 py-1.5 bg-emerald-50/60 rounded-md border border-emerald-200/80 flex items-center justify-between text-[8px] text-slate-700 print-exact">
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                            <Leaf size={10} className="text-emerald-600" />
                            <span>Impacto ESG Par:</span>
                            <span className="font-normal text-slate-600">
                              {eco.unitsDiscardedCurrent} trocas atuais vs {eco.unitsDiscardedLibus} Libus ({Math.max(0, eco.unitsDiscardedCurrent - eco.unitsDiscardedLibus)} descartes evitados/ano)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {eco.wasteKgReduced > 0 && (
                              <span className="font-mono text-emerald-800">
                                <strong>-{eco.wasteKgReduced} kg</strong> resíduo
                              </span>
                            )}
                            {eco.disposalCostSavings > 0 && (
                              <span className="font-mono text-emerald-800">
                                <strong>+R$ {eco.disposalCostSavings?.toFixed(2)}</strong> logística/MTR
                              </span>
                            )}
                            {eco.totalAnnualSavings > 0 && (
                              <span className="font-mono font-bold text-emerald-900 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300">
                                TCO Total: R$ {eco.totalAnnualSavings?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* 5. PARECER CONCLUSIVO, ORIENTAÇÃO TÉCNICA NR-6 & TERMO DE HOMOLOGAÇÃO */}
          <section className="space-y-2 pt-2 border-t-2 border-slate-900 break-inside-avoid">
            <div className="space-y-0.5">
              <h2 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileCheck2 className="text-libus-magenta" size={13} />
                <span>Parecer Conclusivo de Engenharia de Segurança & Homologação</span>
              </h2>
              <p className="text-[8.5px] text-slate-600 leading-relaxed text-justify">
                Com base nos ensaios práticos e nas avaliações comparativas realizadas nos postos de trabalho, atesta-se que os Equipamentos de Proteção Individual (EPIs) da <strong>Libus do Brasil</strong> apresentados neste laudo atendem integralmente aos requisitos da <strong>Norma Regulamentadora NR-6</strong>, com Certificados de Aprovação (C.A.) válidos junto ao Ministério do Trabalho. Constatou-se índice de superioridade técnica em conforto, ajuste anatômico e durabilidade, habilitando a formalização da conversão e homologação do portfólio.
              </p>
            </div>

            {/* Cláusula de Conformidade Técnica & Orientação Prévia de Uso (NR-6) */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[8.5px] space-y-1 font-sans">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-libus-magenta" />
                  <span>Conformidade de Treinamento & Orientação Técnica Prévia (Item 6.6.1 da NR-6):</span>
                </span>
                <span className={`px-2 py-0.2 rounded font-mono font-bold text-[8px] ${
                  evaluation.technicianInstructed !== false
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {evaluation.technicianInstructed !== false ? 'ORIENTAÇÃO TÉCNICA MINISTRADA' : 'SEM ORIENTAÇÃO PRÉVIA REGISTRADA'}
                </span>
              </div>
              <p className="text-slate-600 text-[8px] leading-normal">
                {evaluation.technicianInstructed !== false
                  ? 'Atesta-se que todos os colaboradores participantes receberam instrução técnica presencial do especialista Libus sobre a correta colocação, ajuste ergonômico, vedação e limites de uso dos EPIs antes do início dos testes práticos.'
                  : 'Os testes foram executados sem a comprovação de orientação técnica prévia formalizada pelo especialista Libus no ato do ensaio.'}
              </p>
              {evaluation.instructionNotes && (
                <div className="mt-1 pt-1 border-t border-slate-200/80 text-[8px] text-slate-700">
                  <strong className="text-slate-900">Observações de Colocação / Campo: </strong>
                  <span>{evaluation.instructionNotes}</span>
                </div>
              )}
            </div>

            {/* Quadro de Assinaturas Formais e Certificação Digital */}
            <div className="grid grid-cols-2 gap-8 pt-2.5 text-center font-sans">
              {/* Coluna Especialista Libus */}
              <div className="space-y-0.5 flex flex-col justify-end">
                {evaluation.technicianSignature ? (
                  <div className="flex flex-col items-center">
                    <div className="h-14 flex items-center justify-center">
                      <img
                        src={evaluation.technicianSignature}
                        alt="Assinatura Especialista Libus"
                        className="max-h-12 max-w-[180px] object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="border-b border-slate-700 w-3/4 mx-auto"></div>
                    <p className="text-[9.5px] font-bold text-slate-900 mt-0.5">
                      {evaluation.technicianSignerName || leadTechnician?.name}
                    </p>
                    <p className="text-[7.5px] text-slate-500 uppercase">
                      Engenharia de Aplicação & Homologação • Libus do Brasil
                    </p>
                    {evaluation.signedAt && (
                      <span className="text-[7px] text-emerald-700 font-mono flex items-center justify-center gap-0.5 mt-0.5">
                        <CheckCircle2 size={8} className="text-emerald-600" />
                        Assinado digitalmente em {new Date(evaluation.signedAt).toLocaleDateString('pt-BR')} às {new Date(evaluation.signedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
                    <p className="text-[9.5px] font-bold text-slate-900">{leadTechnician?.name}</p>
                    <p className="text-[7.5px] text-slate-500 uppercase">
                      Engenharia de Aplicação & Homologação • Libus do Brasil
                    </p>
                    <span className="text-[7px] text-slate-400 font-mono block mt-0.5">Pendente de assinatura na tela</span>
                  </div>
                )}
              </div>

              {/* Coluna Responsável do Cliente / SESMT */}
              <div className="space-y-0.5 flex flex-col justify-end">
                {evaluation.clientSignature ? (
                  <div className="flex flex-col items-center">
                    <div className="h-14 flex items-center justify-center">
                      <img
                        src={evaluation.clientSignature}
                        alt="Assinatura Responsável Cliente"
                        className="max-h-12 max-w-[180px] object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="border-b border-slate-700 w-3/4 mx-auto"></div>
                    <p className="text-[9.5px] font-bold text-slate-900 mt-0.5">
                      {evaluation.clientSignerName || participants[0]?.name || 'Responsável Técnico / SESMT'}
                    </p>
                    <p className="text-[7.5px] text-slate-500 uppercase">
                      {evaluation.clientSignerRole || 'Gestão de Segurança do Trabalho / Compras'} • {company?.tradeName}
                    </p>
                    {evaluation.clientSignerDocument && (
                      <p className="text-[7px] text-slate-400 font-mono">
                        Reg/Doc: {evaluation.clientSignerDocument}
                      </p>
                    )}
                    {evaluation.signedAt && (
                      <span className="text-[7px] text-emerald-700 font-mono flex items-center justify-center gap-0.5 mt-0.5">
                        <CheckCircle2 size={8} className="text-emerald-600" />
                        Validado em campo pelo SESMT
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
                    <p className="text-[9.5px] font-bold text-slate-900">
                      {participants[0]?.name || 'Responsável Técnico / SESMT'}
                    </p>
                    <p className="text-[7.5px] text-slate-500 uppercase">
                      Gestão de Segurança do Trabalho / Compras • {company?.tradeName}
                    </p>
                    <span className="text-[7px] text-slate-400 font-mono block mt-0.5">Pendente de assinatura na tela</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Rodapé do Laudo */}
          <footer className="pt-1.5 border-t border-slate-100 flex flex-row items-center justify-between text-[8px] text-slate-400 font-sans">
            <span>Libus do Brasil • Todos os direitos reservados.</span>
            <span>Plataforma Corporativa Libus Partner • Relatório emitido em {new Date().toLocaleDateString('pt-BR')}</span>
          </footer>

        </div>
      </div>

      {/* Modal de Homologação e Assinaturas Acionado pelo Laudo */}
      <HomologationSignatureModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        evaluationId={evaluation.id}
        companyName={company?.tradeName || 'Cliente'}
        defaultTechnicianName={evaluation.technicianSignerName || leadTechnician?.name || ''}
        participants={participants}
        onSuccess={(updatedEval) => {
          setEvaluation({
            ...evaluation,
            ...updatedEval,
            status: 'COMPLETED'
          });
        }}
      />
    </div>
  );
};
