import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { LibusLogo } from '../components/LibusLogo';
import { ShieldAlert, Lock, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';

export const ForceChangePasswordPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hasLength = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!hasLength || !hasLetter || !hasNumber) {
      setError('A nova senha não atende a todos os critérios de segurança.');
      return;
    }

    if (!passwordsMatch) {
      setError('A confirmação não coincide com a nova senha.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('A nova senha deve ser diferente da senha temporária atual.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      updateUser({ mustChangePassword: false });
      setSuccess('Senha pessoal cadastrada com sucesso! Redirecionando...');

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Falha ao atualizar a senha. Verifique a senha temporária.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F141F] via-[#151D2C] to-[#0A0D14] flex items-center justify-center p-4 selection:bg-libus-magenta selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in duration-200">
        {/* Topo institucional */}
        <div className="bg-gradient-to-b from-[#0F141F] to-[#1A2130] p-6 text-center text-white border-b border-white/10 flex flex-col items-center">
          <LibusLogo className="h-8 w-auto" textColor="#FFFFFF" badgeText="PARTNER" />
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            <ShieldAlert size={13} />
            <span>Primeiro Acesso • Troca Obrigatória</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Olá, {user?.name || 'Especialista'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Por política de segurança da plataforma Libus Partner, você deve cadastrar sua senha pessoal definitiva para ter acesso ao sistema.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                Senha Temporária Atual *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite a senha temporária recebida"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-900 font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                Nova Senha Pessoal Definitiva *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 dígitos com letra e número"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-900 font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-900 font-mono transition"
                />
              </div>
            </div>

            {/* Checklist de segurança da senha */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px] font-mono">
              <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span>{hasLength ? '✓' : '•'}</span>
                <span>Mínimo de 8 caracteres</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLetter ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span>{hasLetter ? '✓' : '•'}</span>
                <span>Pelo menos uma letra</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span>{hasNumber ? '✓' : '•'}</span>
                <span>Pelo menos um número</span>
              </div>
              {confirmPassword.length > 0 && (
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700' : 'text-rose-600'}`}>
                  <span>{passwordsMatch ? '✓' : '✕'}</span>
                  <span>Confirmação idêntica</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-pink-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Salvando Senha Definitiva...' : 'Cadastrar Senha e Acessar Plataforma'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Não é você?</span>
            <button
              type="button"
              onClick={logout}
              className="text-slate-600 hover:text-rose-600 font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <LogOut size={13} />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
