import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardCheck,
  Building2,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  Activity,
  Layers,
  ChevronRight,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await apiRequest('/evaluations');
      setEvaluations(data.evaluations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmDelete = (ev: any) => {
    setEvaluationToDelete(ev);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!evaluationToDelete) return;
    try {
      setDeletingId(evaluationToDelete.id);
      await apiRequest(`/evaluations/${evaluationToDelete.id}`, {
        method: 'DELETE'
      });
      setShowDeleteModal(false);
      setEvaluationToDelete(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir avaliação');
    } finally {
      setDeletingId(null);
    }
  };

  const totalEvaluations = evaluations.length;
  const completedEvaluations = evaluations.filter(e => e.status === 'COMPLETED').length;
  const inProgressEvaluations = evaluations.filter(e => e.status === 'IN_PROGRESS').length;
  const conversionRate = totalEvaluations > 0 ? Math.round((completedEvaluations / totalEvaluations) * 100) : 0;

  // Cálculo consolidado de indicadores operacionais e SESMT
  let totalUsersProtected = 0;
  let totalCriteriaScoreSum = 0;
  let totalCriteriaCount = 0;
  const competitorCounts: Record<string, number> = {};
  const uniqueCompanies = new Set();

  evaluations.forEach((ev) => {
    if (ev.company?.tradeName) {
      uniqueCompanies.add(ev.company.tradeName);
    }

    ev.comparisons?.forEach((c: any) => {
      const manuf = c.competitorProduct?.manufacturer?.name;
      if (manuf) {
        competitorCounts[manuf] = (competitorCounts[manuf] || 0) + 1;
      }
      if (c.economicAnalysis) {
        const econ = typeof c.economicAnalysis === 'string' ? JSON.parse(c.economicAnalysis) : c.economicAnalysis;
        if (econ.activeUsers && econ.activeUsers > 0) {
          totalUsersProtected += Number(econ.activeUsers);
        }
      }
      if (c.responses && Array.isArray(c.responses)) {
        c.responses.forEach((cr: any) => {
          if (cr.libusScore !== null && cr.libusScore !== undefined && !cr.isNotApplicable) {
            totalCriteriaScoreSum += Number(cr.libusScore);
            totalCriteriaCount += 1;
          }
        });
      }
    });
  });

  const avgSatisfactionScore = totalCriteriaCount > 0
    ? (totalCriteriaScoreSum / totalCriteriaCount).toFixed(1)
    : '—';

  const topCompetitors = Object.entries(competitorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner Executivo Libus - Compacto em Mobile */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-libus-charcoal via-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-center">
          <ShieldCheck size={260} className="text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-libus-magenta text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase font-mono">
                {user?.role || 'TÉCNICO'}
              </span>
              <span className="text-slate-400 text-[10px] sm:text-xs font-mono">
                ENGENHARIA DE APLICAÇÃO & HOMOLOGAÇÃO
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              Painel de Testes & Laudos
            </h1>
            <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm max-w-2xl leading-relaxed hidden sm:block">
              Gestão de ensaios comparativos de EPIs, validação de C.A. e testes práticos de aceitação com colaboradores no posto de trabalho.
            </p>
          </div>

          <Link
            to="/evaluations/new"
            className="inline-flex items-center justify-center gap-2 bg-libus-magenta hover:bg-libus-magentaHover text-white font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl shadow-md transition transform active:scale-95 flex-shrink-0 text-xs tracking-wider uppercase font-mono w-full sm:w-auto"
          >
            <Plus size={15} />
            <span>Novo Teste de Campo</span>
          </Link>
        </div>
      </div>

      {/* Faixa de Indicadores Reais de Campo & SESMT - Grid 2x2 no Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Testes de Campo */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 truncate">Testes de Campo</span>
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 hidden sm:inline">VOLUME</span>
          </div>
          <div className="my-1 sm:my-2 flex items-baseline gap-1.5 sm:gap-2">
            <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">{totalEvaluations}</p>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">laudos</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-100 pt-1.5 sm:pt-2 font-medium truncate">
            {inProgressEvaluations} em andamento
          </p>
        </div>

        {/* Empresas em Homologação */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 truncate">Empresas</span>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 hidden sm:inline">CLIENTES</span>
          </div>
          <div className="my-1 sm:my-2 flex items-baseline gap-1.5 sm:gap-2">
            <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">{uniqueCompanies.size}</p>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">indústrias</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-100 pt-1.5 sm:pt-2 font-medium truncate">
            {completedEvaluations} laudos emitidos
          </p>
        </div>

        {/* Avaliação Média dos Usuários (TAU) */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 truncate">Aceitação TAU</span>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-600 hidden sm:inline">SESMT</span>
          </div>
          <div className="my-1 sm:my-2 flex items-baseline gap-1 sm:gap-1.5">
            <p className="text-xl sm:text-3xl font-black text-emerald-600 tracking-tight font-mono">
              {avgSatisfactionScore}
            </p>
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono font-bold">/ 10</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-100 pt-1.5 sm:pt-2 font-medium truncate">
            Conforto & durabilidade
          </p>
        </div>

        {/* Principais Concorrentes Avaliados */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 truncate">Concorrentes</span>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 hidden sm:inline">DE-PARA</span>
          </div>
          <div className="my-1 sm:my-2 flex flex-wrap gap-1 items-center">
            {topCompetitors.length > 0 ? (
              topCompetitors.map(([brand, count]) => (
                <span key={brand} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] sm:text-[11px] font-mono font-bold border border-slate-200 truncate">
                  {brand} ({count})
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">Nenhum</span>
            )}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-100 pt-1.5 sm:pt-2 font-medium truncate">
            Marcas testadas 1x1
          </p>
        </div>
      </div>

      {/* Tabela de Avaliações Recentes Estilo Prancheta Técnica */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-libus-magenta"></span>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 font-mono">
                Laudos e Avaliações de Campo
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Histórico de homologações e comparativos realizados em clientes
            </p>
          </div>
          <Link
            to="/evaluations"
            className="text-xs font-bold text-slate-700 hover:text-libus-magenta flex items-center gap-1.5 transition font-mono"
          >
            <span>Ver Histórico Completo</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Carregando registros da base de dados...
          </div>
        ) : evaluations.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <ClipboardCheck size={28} />
            </div>
            <p className="text-sm font-bold text-slate-700">Nenhum laudo registrado até o momento.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Inicie um novo comparativo técnico para coletar notas com os funcionários do cliente.
            </p>
            <Link
              to="/evaluations/new"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-libus-magenta text-white text-xs font-bold rounded-xl shadow hover:bg-libus-magentaHover transition uppercase tracking-wider font-mono"
            >
              <Plus size={14} /> Iniciar Primeira Avaliação
            </Link>
          </div>
        ) : (
          <>
            {/* Visão em Cards para Mobile (md:hidden) */}
            <div className="md:hidden divide-y divide-slate-100">
              {evaluations.map((ev) => (
                <div key={ev.id} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ev.company?.tradeName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{ev.company?.cnpj || 'CNPJ não informado'}</p>
                    </div>
                    {ev.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono border border-emerald-200 flex-shrink-0">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        Homologada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold font-mono border border-slate-200 flex-shrink-0">
                        <Clock size={11} className="text-slate-400" />
                        Em Campo
                      </span>
                    )}
                  </div>

                  {ev.comparisons && ev.comparisons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ev.comparisons.map((c: any) => (
                        <div key={c.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                          <span className="text-libus-magenta font-bold">{c.libusProduct?.name}</span>
                          <span className="text-slate-400 text-[9px]">x</span>
                          <span className="text-slate-600 truncate max-w-[110px]">{c.competitorProduct?.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                    <span>{new Date(ev.createdAt).toLocaleDateString('pt-BR')}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/evaluations/${ev.id}/report`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition font-mono"
                      >
                        <ShieldCheck size={12} />
                        <span>PDF</span>
                      </Link>
                      <Link
                        to={`/evaluations/${ev.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-lg text-xs font-bold text-slate-700 transition border border-slate-200 font-mono"
                      >
                        <span>Abrir</span>
                        <ChevronRight size={13} />
                      </Link>
                      {(user?.role === 'ADMIN' || user?.role === 'GESTOR' || ev.leadTechnicianId === user?.id) && (
                        <button
                          onClick={() => confirmDelete(ev)}
                          title="Excluir Avaliação"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visão em Tabela para Desktop (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-6 py-3.5">Empresa Cliente</th>
                    <th className="px-6 py-3.5">Técnico Libus</th>
                    <th className="px-6 py-3.5">Pares Avaliados (1x1)</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Data Registro</th>
                    <th className="px-6 py-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {evaluations.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{ev.company?.tradeName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{ev.company?.cnpj || 'CNPJ não informado'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{ev.leadTechnician?.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">TÉCNICO ESPECIALISTA</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {ev.comparisons?.map((c: any) => (
                            <div key={c.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-medium mr-1.5">
                              <span className="text-libus-magenta font-bold">{c.libusProduct?.name}</span>
                              <span className="text-slate-400 text-[10px]">vs</span>
                              <span className="text-slate-600">{c.competitorProduct?.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {ev.status === 'COMPLETED' ? (
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
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                        {new Date(ev.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/evaluations/${ev.id}/report`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition font-mono"
                            title="Ver Laudo em PDF"
                          >
                            <ShieldCheck size={13} />
                            <span>PDF</span>
                          </Link>
                          <Link
                            to={`/evaluations/${ev.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-libus-charcoal hover:text-white rounded-lg text-xs font-bold text-slate-700 transition border border-slate-200 group-hover:border-slate-300 font-mono"
                          >
                            <span>Abrir</span>
                            <ChevronRight size={13} />
                          </Link>
                          {(user?.role === 'ADMIN' || user?.role === 'GESTOR' || ev.leadTechnicianId === user?.id) && (
                            <button
                              onClick={() => confirmDelete(ev)}
                              title="Excluir Avaliação"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && evaluationToDelete && (
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
              Você está prestes a excluir o laudo da empresa <strong className="text-slate-900">{evaluationToDelete.company?.tradeName}</strong> registrado em <span className="font-mono font-bold">{new Date(evaluationToDelete.createdAt).toLocaleDateString('pt-BR')}</span>.
            </p>
            <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
              Esta ação removerá permanentemente as notas técnicas, critérios comparativos e cálculos econômicos vinculados.
            </p>

            <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setEvaluationToDelete(null);
                }}
                disabled={deletingId !== null}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider flex items-center gap-2"
              >
                <Trash2 size={13} />
                <span>{deletingId ? 'Excluindo...' : 'Sim, Excluir Laudo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
