import React, { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAlvesAuth } from '../context/AlvesAuthContext';

export const AlvesAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, login } = useAlvesAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#6E645C]">Validando sessão...</div>;
  if (user) return <>{children}</>;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try { await login(email, password); }
    catch (err) { setError((err as Error).message || 'Não foi possível entrar'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#1B1410] flex items-center justify-center p-5">
      <form onSubmit={submit} className="w-full max-w-md bg-[#FAF8F5] rounded-3xl p-7 sm:p-9 shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1B1410] text-[#C5A265] flex items-center justify-center"><LockKeyhole size={20} /></div>
          <div><p className="text-xs text-[#9E7E45] font-semibold">Área interna</p><h1 className="text-2xl font-bold text-[#231B15]">Alves Planejados</h1></div>
        </div>
        <p className="text-sm text-[#6E645C]">Entre com seu usuário para acessar propostas, clientes e contratos.</p>
        <div className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="E-mail" className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] bg-white" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Senha" className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] bg-white" />
        </div>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
        <button disabled={submitting} className="w-full py-3 rounded-xl bg-[#C5A265] hover:bg-[#DFC28B] disabled:opacity-60 text-[#1B1410] font-bold">{submitting ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </div>
  );
};
