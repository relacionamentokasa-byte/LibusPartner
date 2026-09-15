import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  KeyRound,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Building2,
  FileText,
  X,
  AlertTriangle,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  FileCheck2,
  Trash2,
  Layers,
  History
} from 'lucide-react';

export const UsersManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'USERS' | 'AUDIT'>('USERS');

  // --- ESTADOS DA ABA DE USUÁRIOS ---
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'GESTOR' | 'TECNICO'>('ALL');

  // Modal Novo Usuário
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'TECNICO' | 'GESTOR' | 'ADMIN'>('TECNICO');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Modal Redefinir Senha
  const [userToReset, setUserToReset] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Modal / Ação de Exclusão de Usuário
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Ação de Toggle Status
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // --- ESTADOS DA ABA DE AUDITORIA & LOGS ---
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ recentEmissions: 0, recentDeletions: 0, totalLogs: 0 });
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('ALL');
  const [auditEntityFilter, setAuditEntityFilter] = useState<string>('ALL');

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await apiRequest('/users');
      setUsers(data.users || []);
      setAccessDenied(false);
    } catch (err: any) {
      if (err.message?.includes('Acesso negado') || err.message?.includes('403')) {
        setAccessDenied(true);
      }
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAudit = async () => {
    try {
      setLoadingAudit(true);
      const [logsData, statsData] = await Promise.all([
        apiRequest('/audit?limit=100'),
        apiRequest('/audit/stats')
      ]);
      setLogs(logsData.logs || []);
      setStats(statsData || { recentEmissions: 0, recentDeletions: 0, totalLogs: 0 });
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'AUDIT') {
      loadAudit();
    }
  }, [activeTab]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      setShowCreateModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('TECNICO');
      await loadUsers();
    } catch (err: any) {
      setCreateError(err.message || 'Erro ao cadastrar usuário');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    if (user.id === currentUser?.id) {
      alert('Você não pode desativar seu próprio acesso.');
      return;
    }

    setTogglingId(user.id);
    try {
      await apiRequest(`/users/${user.id}/toggle-status`, {
        method: 'PATCH'
      });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar status do usuário');
    } finally {
      setTogglingId(null);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToReset) return;
    setResetError('');
    setResetSuccess('');
    setResetting(true);

    try {
      await apiRequest(`/users/${userToReset.id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });
      setResetSuccess(`Senha de ${userToReset.name} redefinida com sucesso!`);
      setNewPassword('');
      setTimeout(() => {
        setUserToReset(null);
        setResetSuccess('');
      }, 1500);
    } catch (err: any) {
      setResetError(err.message || 'Erro ao redefinir senha');
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);

    try {
      const res = await apiRequest(`/users/${userToDelete.id}`, {
        method: 'DELETE'
      });
      setUserToDelete(null);
      await loadUsers();
      if (res.message) {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir usuário');
    } finally {
      setDeleting(false);
    }
  };

  // Filtros de Usuários
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtros de Auditoria
  const filteredLogs = logs.filter((log) => {
    const q = auditSearchTerm.toLowerCase();
    const detailsStr = typeof log.details === 'string' ? log.details.toLowerCase() : JSON.stringify(log.details || {}).toLowerCase();
    const matchesSearch =
      (log.userName && log.userName.toLowerCase().includes(q)) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(q)) ||
      (log.entityId && log.entityId.toLowerCase().includes(q)) ||
      detailsStr.includes(q);

    const matchesAction = auditActionFilter === 'ALL' || log.action === auditActionFilter;
    const matchesEntity = auditEntityFilter === 'ALL' || log.entity === auditEntityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'ADMIN':
        return {
          label: 'ADMINISTRADOR',
          badgeClass: 'bg-slate-900 text-white border-slate-900 font-mono tracking-wider'
        };
      case 'GESTOR':
        return {
          label: 'GESTOR',
          badgeClass: 'bg-slate-800 text-slate-100 border-slate-700 font-mono tracking-wider'
        };
      default:
        return {
          label: 'TÉCNICO',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300 font-mono tracking-wider font-bold'
        };
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return { label: 'CRIAÇÃO', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'UPDATE':
        return { label: 'EDIÇÃO', className: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'DELETE':
        return { label: 'EXCLUSÃO', className: 'bg-rose-50 text-rose-700 border-rose-200 font-bold' };
      case 'COMPLETE':
        return { label: 'HOMOLOGAÇÃO', className: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' };
      case 'EMISSION':
      case 'EXPORT_PDF':
        return { label: 'EMISSÃO LAUDO', className: 'bg-slate-900 text-white border-slate-900 font-bold' };
      default:
        return { label: action, className: 'bg-slate-100 text-slate-700 border-slate-200' };
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
            <span className="w-2 h-2 rounded-full bg-libus-magenta"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              PAINEL ADMINISTRATIVO & AUDITORIA
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Equipe & Gestão
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre novos técnicos, controle acessos e acompanhe logs de auditoria e segurança.
          </p>
        </div>

        {activeTab === 'USERS' ? (
          <button
            onClick={() => {
              setShowCreateModal(true);
              setCreateError('');
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-pink-500/20 transition text-xs uppercase tracking-wider font-mono self-start sm:self-auto"
          >
            <UserPlus size={15} /> Cadastrar Novo Usuário
          </button>
        ) : (
          <button
            onClick={loadAudit}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition text-xs uppercase tracking-wider font-mono self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loadingAudit ? 'animate-spin' : ''} />
            <span>Atualizar Logs</span>
          </button>
        )}
      </div>

      {/* Navegação por Abas Integradas (Equipe vs Auditoria) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeTab === 'USERS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={15} />
          <span>Usuários & Técnicos ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeTab === 'AUDIT'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History size={15} />
          <span>Auditoria & Logs de Segurança</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: GESTÃO DE USUÁRIOS & TÉCNICOS */}
      {/* ========================================================================= */}
      {activeTab === 'USERS' && (
        <div className="space-y-5">
          {/* Barra de Filtros e Busca */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Nome, E-mail ou Perfil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 placeholder-slate-400"
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

            {/* Filtros Rápidos por Papel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {(['ALL', 'TECNICO', 'GESTOR', 'ADMIN'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex-shrink-0 ${
                    roleFilter === r
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r === 'ALL' ? 'Todos' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Usuários ou Aviso de Acesso Restrito */}
          {loadingUsers ? (
            <div className="p-16 text-center text-slate-400 text-xs font-mono">
              Carregando usuários cadastrados...
            </div>
          ) : accessDenied ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-base font-black text-slate-900">Acesso Restrito à Gestão</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                A gestão de usuários e criação de acessos de equipe é permitida exclusivamente para perfis <strong>ADMIN</strong> e <strong>GESTOR</strong>.
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <p className="text-sm font-bold text-slate-800">Nenhum usuário encontrado</p>
              <p className="text-xs text-slate-400 mt-1">Cadastre novos técnicos para executar testes em campo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUsers.map((u) => {
                const roleBadge = getRoleBadge(u.role);
                const isSelf = u.id === currentUser?.id;

                return (
                  <div
                    key={u.id}
                    className={`bg-white p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 shadow-xs ${
                      u.active ? 'border-slate-200/90 hover:border-slate-300' : 'border-slate-200 bg-slate-50/60 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs ${
                            u.active ? 'bg-gradient-to-tr from-slate-900 to-slate-800' : 'bg-slate-400'
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[9px] bg-pink-100 text-libus-magenta font-mono px-1.5 py-0.2 rounded font-bold">
                                  VOCÊ
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded border ${roleBadge.badgeClass}`}>
                          {roleBadge.label}
                        </span>
                      </div>

                      {/* Métricas de Laudos */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
                        <div className="flex items-center gap-1 text-slate-500">
                          <FileText size={13} className="text-slate-400" />
                          <span>Laudos Criados:</span>
                        </div>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {u._count?.evaluations ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Barra de Ações Rápidas */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setUserToReset(u);
                            setResetError('');
                            setResetSuccess('');
                            setNewPassword('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition font-mono"
                          title="Redefinir Senha do Usuário"
                        >
                          <KeyRound size={13} className="text-slate-500" />
                          <span>Senha</span>
                        </button>

                        {!isSelf && (
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Excluir Usuário"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={isSelf || togglingId === u.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                          u.active
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-rose-50 hover:text-rose-700 border border-emerald-200 hover:border-rose-200'
                            : 'text-slate-500 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title={u.active ? 'Clique para desativar acesso' : 'Clique para ativar acesso'}
                      >
                        {u.active ? (
                          <>
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            <span>Ativo</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={13} className="text-slate-400" />
                            <span>Inativo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: AUDITORIA & LOGS DE SEGURANÇA */}
      {/* ========================================================================= */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-5">
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
                value={auditSearchTerm}
                onChange={(e) => setAuditSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
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
                value={auditEntityFilter}
                onChange={(e) => setAuditEntityFilter(e.target.value)}
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
            {loadingAudit ? (
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
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR NOVO USUÁRIO */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5 text-libus-magenta">
                <div className="p-2 rounded-xl bg-pink-50 border border-pink-100">
                  <UserPlus size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Novo Acesso</span>
                  <h3 className="text-base font-black text-slate-900">Cadastrar Usuário</h3>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle size={15} className="flex-shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Profissional *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao.silva@libus.com.br"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Senha Inicial de Acesso *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Perfil de Permissão *</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 bg-white"
                >
                  <option value="TECNICO">TÉCNICO (Execução de Campo e Laudos)</option>
                  <option value="GESTOR">GESTOR (Visualização Geral e Equipe)</option>
                  <option value="ADMIN">ADMINISTRADOR (Acesso Total)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider disabled:opacity-50"
                >
                  {creating ? 'Cadastrando...' : 'Cadastrar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REDEFINIR SENHA */}
      {/* ========================================================================= */}
      {userToReset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                  <KeyRound size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Segurança de Acesso</span>
                  <h3 className="text-base font-black text-slate-900">Redefinir Senha</h3>
                </div>
              </div>
              <button
                onClick={() => setUserToReset(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Defina uma nova senha de acesso para <strong>{userToReset.name}</strong> ({userToReset.email}).
            </p>

            {resetError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle size={15} className="flex-shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 size={15} className="flex-shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nova Senha Provisória *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserToReset(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider disabled:opacity-50"
                >
                  {resetting ? 'Gravando...' : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRMAR EXCLUSÃO DE USUÁRIO */}
      {/* ========================================================================= */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                  <Trash2 size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Atenção</span>
                  <h3 className="text-base font-black text-slate-900">Excluir Usuário</h3>
                </div>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-xs text-slate-600 leading-relaxed">
                Tem certeza que deseja remover o usuário <strong>{userToDelete.name}</strong> ({userToDelete.email})?
              </p>
              {userToDelete._count?.evaluations > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-normal">
                  <strong>Aviso de integridade:</strong> Este usuário possui <strong>{userToDelete._count.evaluations} laudo(s)</strong> vinculados. O sistema desativará o acesso permanentemente mantendo a autoria dos laudos históricos preservada.
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Esta ação removerá o cadastro do usuário e todos os registros de permissão do sistema.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition font-mono"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteUser}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                <span>{deleting ? 'Excluindo...' : 'Confirmar Exclusão'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
