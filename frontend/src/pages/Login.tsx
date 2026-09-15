import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { LibusLogo } from '../components/LibusLogo';
import { Lock, Mail, ArrowRight, KeyRound, X, CheckCircle2, AlertTriangle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('tecnico@libus.com.br');
  const [password, setPassword] = useState('libus123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal Esqueceu a Senha
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Falha ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);

    try {
      const data = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail })
      });
      setForgotSuccess(data.message || 'Instruções enviadas para seu e-mail.');
    } catch (err: any) {
      setForgotError(err.message || 'Erro ao processar recuperação.');
    } finally {
      setForgotLoading(false);
    }
  };

  const setDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('libus123');
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
            Plataforma de Engenharia & Homologações Técnicas
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 transition"
                  placeholder="usuario@libus.com.br"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotError('');
                    setForgotSuccess('');
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-pink-600 hover:text-pink-700 font-mono font-bold hover:underline transition cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 transition font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/25 transition flex items-center justify-center gap-2 font-mono uppercase tracking-wider text-xs group disabled:opacity-50 mt-6 active:scale-98 cursor-pointer"
            >
              <span>{loading ? 'Autenticando...' : 'Acessar Plataforma'}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition" />
            </button>
          </form>

          {/* Perfis Demo para Facilidade */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-2.5">
              Ambiente de Homologação • Perfis:
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setDemoUser('tecnico@libus.com.br')}
                className="text-[11px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 transition"
              >
                Técnico
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('gestor@libus.com.br')}
                className="text-[11px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 transition"
              >
                Gestor
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('admin@libus.com.br')}
                className="text-[11px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 transition"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Solicitar Recuperação de Senha */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5 text-libus-magenta">
                <div className="p-2 rounded-xl bg-pink-50 border border-pink-100">
                  <KeyRound size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Recuperação de Acesso</span>
                  <h3 className="text-base font-black text-slate-900">Esqueceu sua senha?</h3>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Informe seu e-mail corporativo cadastrado. Enviaremos um link de uso único para você definir sua nova senha com segurança.
            </p>

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle size={15} className="flex-shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                  Seu E-mail *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="usuario@libus.com.br"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 font-mono">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover text-white text-xs font-bold rounded-xl shadow-md transition uppercase tracking-wider disabled:opacity-50"
                >
                  {forgotLoading ? 'Enviando Link...' : 'Enviar Link de Recuperação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

