import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { LibusLogo } from '../components/LibusLogo';
import { Lock, ArrowLeft, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Token de recuperação ausente ou inválido.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (newPassword.length < 4) {
      setError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/auth/reset-password-with-token', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      });
      setSuccess(data.message || 'Senha redefinida com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Falha ao redefinir a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F141F] via-[#151D2C] to-[#0A0D14] flex items-center justify-center p-4 selection:bg-libus-magenta selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Oficial Libus */}
        <div className="bg-gradient-to-b from-[#0F141F] to-[#1A2130] p-8 text-center text-white relative border-b border-white/10 flex flex-col items-center">
          <div className="py-2">
            <LibusLogo className="h-9 w-auto" textColor="#FFFFFF" badgeText="PARTNER" />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide">
            Recuperação de Acesso & Segurança
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {!token ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-base font-black text-slate-900">Link Incompleto ou Inválido</h2>
              <p className="text-xs text-slate-500">
                O token de segurança não foi identificado no link de recuperação. Por favor, solicite um novo link na tela de login.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition"
              >
                <ArrowLeft size={14} />
                <span>Voltar ao Login</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-2 text-slate-900 mb-1">
                  <KeyRound size={18} className="text-libus-magenta" />
                  <h2 className="text-base font-black text-slate-900">Cadastrar Nova Senha</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Crie uma senha segura para restabelecer seu acesso corporativo.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  <span>{success} Redirecionando...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                    Nova Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 transition font-mono"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 transition font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !!success}
                  className="w-full py-3.5 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/25 transition flex items-center justify-center gap-2 font-mono uppercase tracking-wider text-xs group disabled:opacity-50 mt-6 active:scale-98 cursor-pointer"
                >
                  <span>{loading ? 'Redefinindo...' : 'Salvar Nova Senha'}</span>
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 font-mono transition"
                >
                  <ArrowLeft size={13} />
                  <span>Voltar para Login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
