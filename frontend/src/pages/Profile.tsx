import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Mail,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar,
  Sparkles
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('A confirmação da nova senha não coincide.');
      return;
    }

    if (newPassword.length < 4) {
      setError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    setSaving(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setSuccess('Sua senha foi atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar senha');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Administrador do Sistema',
          badgeClass: 'bg-slate-900 text-white border-slate-900 font-mono tracking-wider',
          desc: 'Acesso total a relatórios, cadastros, gestão de equipe e configurações técnicas.'
        };
      case 'GESTOR':
        return {
          label: 'Gestor Técnico / Comercial',
          badgeClass: 'bg-slate-800 text-slate-100 border-slate-700 font-mono tracking-wider',
          desc: 'Acesso gerencial aos laudos de campo, catálogo de-para e aprovações de equivalência.'
        };
      default:
        return {
          label: 'Técnico Especialista Libus',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300 font-mono tracking-wider font-bold',
          desc: 'Execução de ensaios comparativos de campo, testes de aceitação e coleta com usuários.'
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header da Página */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-libus-magenta"></span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            MINHA CONTA & CREDENCIAIS
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Meu Perfil & Segurança
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gerenciamento de dados de identificação profissional e segurança de acesso ao Libus Partner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cartão de Identificação */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-libus-magenta via-pink-600 to-libus-magentaHover text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 border-2 border-white mb-4">
              {user?.name?.charAt(0) || 'U'}
            </div>

            <h2 className="text-base font-black text-slate-900 tracking-tight">{user?.name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>

            <div className="mt-3">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${roleInfo.badgeClass}`}>
                {user?.role}
              </span>
            </div>

            <div className="w-full mt-6 pt-5 border-t border-slate-100 text-left space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Shield size={14} className="text-libus-magenta flex-shrink-0" />
                <span className="font-medium">{roleInfo.label}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-emerald-700">Acesso Ativo & Homologado</span>
              </div>
            </div>
          </div>

          {/* Card Institucional */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl text-white text-xs border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 font-mono font-bold text-[10px] text-libus-magenta uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              <span>DIRETRIZ DE SEGURANÇA</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {roleInfo.desc}
            </p>
          </div>
        </div>

        {/* Formulário de Troca de Senha */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 text-slate-900 pb-4 border-b border-slate-100 mb-5">
              <div className="p-2 rounded-xl bg-pink-50 text-libus-magenta border border-pink-100">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider font-mono">
                  Alteração de Senha
                </h2>
                <p className="text-xs text-slate-500">
                  Mantenha suas credenciais protegidas para validação de laudos técnicos em campo.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-medium">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5 font-medium">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Senha Atual *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nova Senha *</label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Nova Senha *</label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition text-xs uppercase tracking-wider font-mono disabled:opacity-50"
                >
                  <KeyRound size={14} />
                  <span>{saving ? 'Atualizando Senha...' : 'Atualizar Minha Senha'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
