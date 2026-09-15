import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Search,
  Filter,
  FileCheck2,
  Trash2,
  Building2,
  UserCheck,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ recentEmissions: 0, recentDeletions: 0, totalLogs: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [logsData, statsData] = await Promise.all([
        apiRequest('/audit?limit=100'),
        apiRequest('/audit/stats')
      ]);
      setLogs(logsData.logs || []);
      setStats(statsData || { recentEmissions: 0, recentDeletions: 0, totalLogs: 0 });
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchTerm.toLowerCase();
    const detailsStr = typeof log.details === 'string' ? log.details.toLowerCase() : JSON.stringify(log.details || {}).toLowerCase();
    const matchesSearch =
      (log.userName && log.userName.toLowerCase().includes(q)) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(q)) ||
      (log.entityId && log.entityId.toLowerCase().includes(q)) ||
      detailsStr.includes(q);

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || log.entity === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return {
          label: 'CRIAÇÃO',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'UPDATE':
        return {
          label: 'EDIÇÃO',
          className: 'bg-sky-50 text-sky-700 border-sky-200'
        };
      case 'DELETE':
        return {
          label: 'EXCLUSÃO',
          className: 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
        };
      case 'COMPLETE':
        return {
          label: 'HOMOLOGAÇÃO',
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold'
        };
      case 'EMISSION':
      case 'EXPORT_PDF':
        return {
          label: 'EMISSÃO LAUDO',
          className: 'bg-slate-900 text-white border-slate-900 font-bold'
        };
      default:
        return {
          label: action,
          className: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const parseDetails = (details: any) => {
    if (!details) return null;
    if (typeof details === 'object') return details;
    try {
      return JSON.parse(details);
    } catch {
      return { raw: details };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-900"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              RASTREABILIDADE & CONFORMIDADE
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Auditoria & Logs de Segurança
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro imutável de emissões, alterações e exclusões de laudos e empresas por técnicos e gestores.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition text-xs uppercase tracking-wider font-mono self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Atualizar Logs</span>
        </button>
      </div>

      {/* Cards de Métricas de Auditoria */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <FileCheck2 size={18} />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-mono">{stats.recentEmissions}</div>
            <div className="text-[11px] text-slate-500 font-medium">Laudos Emitidos / Homologados</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
            <Trash2 size={18} />
          </div>
          <div>
            <div className="text-xl font-black text-rose-600 font-mono">{stats.recentDeletions}</div>
            <div className="text-[11px] text-slate-500 font-medium">Exclusões Auditadas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold">
            <Layers size={18} />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-mono">{stats.totalLogs}</div>
            <div className="text-[11px] text-slate-500 font-medium">Eventos Registrados</div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuário, e-mail, ID ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Todas as Ações</option>
            <option value="EMISSION">Emissão de Laudo</option>
            <option value="DELETE">Exclusão</option>
            <option value="CREATE">Criação</option>
            <option value="UPDATE">Edição</option>
            <option value="COMPLETE">Homologação</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Todas as Entidades</option>
            <option value="EVALUATION">Avaliações / Laudos</option>
            <option value="COMPANY">Empresas</option>
            <option value="USER">Usuários</option>
          </select>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Carregando registros de auditoria...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Nenhum evento registrado encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Data / Hora</th>
                  <th className="px-5 py-3.5">Ação</th>
                  <th className="px-5 py-3.5">Entidade</th>
                  <th className="px-5 py-3.5">Responsável Técnico</th>
                  <th className="px-5 py-3.5">Detalhes da Operação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const detailsObj = parseDetails(log.details);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border font-mono ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-800 font-bold">
                        {log.entity}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-slate-900">{log.userName || log.user?.name || 'Sistema'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.userEmail || log.user?.email || '-'}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-[11px] text-slate-600 max-w-md truncate">
                          {detailsObj?.companyName && (
                            <strong className="text-slate-800">Empresa: {detailsObj.companyName} • </strong>
                          )}
                          {detailsObj?.tradeName && (
                            <strong className="text-slate-800">Empresa: {detailsObj.tradeName} • </strong>
                          )}
                          {log.details ? (typeof log.details === 'string' ? log.details : JSON.stringify(log.details)) : 'Sem observações adicionais'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
