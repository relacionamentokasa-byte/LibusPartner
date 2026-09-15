import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardCheck,
  Plus,
  Search,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  FileCheck2,
  Filter,
  X
} from 'lucide-react';

export const EvaluationsListPage: React.FC = () => {
  const { user } = useAuth();
  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'GESTOR';
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<any>(null);

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

  const filtered = evaluations.filter(e => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      e.company?.tradeName?.toLowerCase().includes(q) ||
      e.company?.cnpj?.includes(q) ||
      e.leadTechnician?.name?.toLowerCase().includes(q) ||
      e.comparisons?.some((c: any) =>
        c.libusProduct?.name?.toLowerCase().includes(q) ||
        c.competitorProduct?.name?.toLowerCase().includes(q) ||
        c.competitorProduct?.manufacturer?.name?.toLowerCase().includes(q)
      );

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'COMPLETED' && e.status === 'COMPLETED') ||
      (statusFilter === 'IN_PROGRESS' && e.status !== 'COMPLETED');

    return matchesSearch && matchesStatus;
  });

  const completedCount = evaluations.filter(e => e.status === 'COMPLETED').length;
  const inProgressCount = evaluations.filter(e => e.status !== 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-libus-magenta"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              REGISTROS AUDITÁVEIS
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Histórico de Laudos & Homologações
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro oficial de todos os comparativos de campo e avaliações normativas realizadas.
          </p>
        </div>

        <Link
          to="/evaluations/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-pink-500/20 transition text-xs uppercase tracking-wider font-mono self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Nova Avaliação</span>
        </Link>
      </div>

      {/* Barra de Busca e Filtro */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Empresa, CNPJ, Técnico ou Produto (Libus/Concorrente)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 placeholder-slate-400"
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

        {/* Filtro por Status da Homologação */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 flex-shrink-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Todos</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded ${statusFilter === 'ALL' ? 'bg-slate-100 text-slate-700 font-bold' : 'bg-slate-200 text-slate-500'}`}>
              {evaluations.length}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              statusFilter === 'COMPLETED'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Homologadas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded ${statusFilter === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-slate-200 text-slate-500'}`}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              statusFilter === 'IN_PROGRESS'
                ? 'bg-white text-libus-magenta shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock size={12} className="text-slate-400" />
            <span>Em Campo</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded ${statusFilter === 'IN_PROGRESS' ? 'bg-pink-50 text-libus-magenta font-bold' : 'bg-slate-200 text-slate-500'}`}>
              {inProgressCount}
            </span>
          </button>
        </div>
      </div>

      {/* Listagem de Registros: Tabela em Desktop e Cards Compactos em Mobile */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs font-mono">
            Carregando base de dados de homologações...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <ClipboardCheck size={24} />
            </div>
            <p className="text-sm font-bold text-slate-800">Nenhum laudo encontrado</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Verifique o termo buscado ou inicie uma nova avaliação técnica de campo.
            </p>
          </div>
        ) : (
          <div>
            {/* Visão em Cards para Mobile */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filtered.map((ev) => (
                <div key={ev.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {ev.company?.tradeName}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {ev.company?.cnpj || 'CNPJ não informado'}
                      </p>
                    </div>
                    {ev.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono flex-shrink-0">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>Homologada</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 font-mono flex-shrink-0">
                        <Clock size={11} className="text-slate-400" />
                        <span>Em Campo</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="text-slate-500 font-medium">Técnico: <strong className="text-slate-800 font-bold">{ev.leadTechnician?.name}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-slate-500 text-[11px]">{new Date(ev.createdAt).toLocaleDateString('pt-BR')}</span>
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

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Link
                      to={`/evaluations/${ev.id}/report`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition font-mono"
                    >
                      <FileCheck2 size={13} />
                      <span>Laudo PDF</span>
                    </Link>
                    <Link
                      to={`/evaluations/${ev.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-lg text-xs font-bold text-slate-700 transition border border-slate-200 font-mono"
                    >
                      <span>Abrir</span>
                      <ChevronRight size={13} />
                    </Link>
                    {/* Ações Técnicas e de Gestão */}
                    {(isManagerOrAdmin || ev.leadTechnicianId === user?.id) && (
                      <button
                        onClick={() => confirmDelete(ev)}
                        title="Excluir Avaliação"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Visão em Tabela para Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-6 py-4">Empresa Homologada</th>
                    <th className="px-6 py-4">Técnico Libus</th>
                    <th className="px-6 py-4">Produtos Avaliados (1x1)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Data Registro</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{ev.company?.tradeName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{ev.company?.cnpj || 'CNPJ não informado'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{ev.leadTechnician?.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{ev.leadTechnician?.role || 'Técnico Especialista'}</div>
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
                            title="Visualizar e Imprimir Laudo Oficial"
                          >
                            <FileCheck2 size={13} />
                            <span>PDF</span>
                          </Link>
                          <Link
                            to={`/evaluations/${ev.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-libus-charcoal hover:text-white rounded-lg text-xs font-bold text-slate-700 transition border border-slate-200 group-hover:border-slate-300 font-mono"
                          >
                            <span>Editar</span>
                            <ChevronRight size={13} />
                          </Link>
                          {(isManagerOrAdmin || ev.leadTechnicianId === user?.id) && (
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
          </div>
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

