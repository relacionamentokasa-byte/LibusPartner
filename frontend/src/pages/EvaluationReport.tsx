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
  ZoomOut
} from 'lucide-react';

export const EvaluationReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showA4Guide, setShowA4Guide] = useState<boolean>(true);

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
  let totalTechnicalScores = 0;
  let validComparisonsCount = 0;

  comparisons.forEach((comp: any) => {
    if (comp.economicResult?.economyGenerated) {
      totalEconomicSavings += comp.economicResult.economyGenerated;
    }
    const sup = comp.technicalResult?.libusSuperiorityPercent ?? comp.technicalResult?.superiorityPercent;
    if (sup !== undefined && sup !== null) {
      totalTechnicalScores += Number(sup);
      validComparisonsCount++;
    }
  });

  const avgSuperiority = validComparisonsCount > 0 ? (totalTechnicalScores / validComparisonsCount).toFixed(1) : '100';

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

          {/* 3. SUMÁRIO EXECUTIVO DE SUPERIORIDADE E ECONOMIA */}
          <section className="bg-slate-900 text-white rounded-xl p-2 shadow-xs break-inside-avoid print-exact print:bg-slate-900 print:text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Award className="text-libus-magenta" size={13} />
              <h2 className="text-[9.5px] font-bold uppercase tracking-wider text-slate-300">
                Sumário Executivo de Homologação
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/10">
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-slate-400">Pares Homologados</span>
                <p className="text-sm font-bold text-white leading-tight">{comparisons.length}</p>
                <span className="text-[7.5px] text-slate-400 block">EPIs comparados</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold">
                  Superioridade Técnica
                </span>
                <p className="text-sm font-bold text-emerald-400 leading-tight">+{avgSuperiority}%</p>
                <span className="text-[7.5px] text-slate-300 block">Norma & Ergonomia</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-slate-300 font-bold">
                  Economia Anual
                </span>
                <p className="text-sm font-bold text-white leading-tight">
                  R$ {totalEconomicSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[7.5px] text-slate-400 block">Ganho Financeiro</span>
              </div>
            </div>
          </section>

          {/* 4. FICHAS COMPARATIVAS 1x1 DETALHADAS */}
          <section className="space-y-2.5">
            <div className="border-b border-slate-200 pb-1 flex items-center justify-between">
              <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="text-libus-magenta" size={14} />
                <span>Matriz Comparativa Técnica & Normativa (1x1)</span>
              </h2>
              <span className="text-[9px] text-slate-500 font-semibold">
                Critérios avaliados com notas de 1 a 10
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
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[8px] font-bold">
                        PAR #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">
                        {libus?.category?.name || 'Proteção Individual'}
                      </span>
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
                          {competitor?.caNumber && (
                            <a
                              href={getCaConsultUrl(competitor.caNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition inline-flex items-center gap-0.5 print:border-slate-300"
                              title={`Consultar Certificado de Aprovação CA ${competitor.caNumber} no Ministério do Trabalho`}
                            >
                              <span>CA: {competitor.caNumber}</span>
                              <ExternalLink size={7} className="no-print opacity-70" />
                            </a>
                          )}
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
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-4 gap-2 text-[9px] print-exact font-sans">
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
                        <span className="text-[8px] text-emerald-600 font-bold uppercase block">Economia Gerada:</span>
                        <span className="font-bold text-emerald-700 text-[10px]">
                          R$ {eco.economyGenerated?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({eco.economyPercent?.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* 5. PARECER CONCLUSIVO & TERMO DE HOMOLOGAÇÃO */}
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

            {/* Quadro de Assinaturas Formais */}
            <div className="grid grid-cols-2 gap-8 pt-2.5 text-center font-sans">
              <div className="space-y-0.5">
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
                <p className="text-[9.5px] font-bold text-slate-900">{leadTechnician?.name}</p>
                <p className="text-[7.5px] text-slate-500 uppercase">
                  Engenharia de Aplicação & Homologação • Libus do Brasil
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
                <p className="text-[9.5px] font-bold text-slate-900">
                  {participants[0]?.name || 'Responsável Técnico / SESMT'}
                </p>
                <p className="text-[7.5px] text-slate-500 uppercase">
                  Gestão de Segurança do Trabalho / Compras • {company?.tradeName}
                </p>
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
    </div>
  );
};
