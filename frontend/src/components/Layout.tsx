import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LibusLogo } from './LibusLogo';
import { apiRequest } from '../services/api';
import {
  ClipboardCheck,
  Layers,
  Building2,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Plus,
  ChevronRight,
  Menu,
  X,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Users,
  UserCheck
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'GESTOR';

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Nova Avaliação', href: '/evaluations/new', icon: Plus, isPrimaryAction: true },
    { name: 'Histórico & Laudos', href: '/evaluations', icon: ClipboardCheck },
    { name: 'Catálogo De-Para', href: '/catalog', icon: Layers },
    { name: 'Empresas & Unidades', href: '/companies', icon: Building2 },
    ...(isManagerOrAdmin
      ? [{ name: 'Equipe & Gestão', href: '/users', icon: Users }]
      : []),
    { name: 'Meu Perfil', href: '/profile', icon: UserCheck },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (newPassword.length < 4) {
      setPassError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    setChangingPass(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setPassSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess('');
      }, 1500);
    } catch (err: any) {
      setPassError(err.message || 'Erro ao alterar senha');
    } finally {
      setChangingPass(false);
    }
  };

  const sidebarContent = (
    <>
      {/* Brand Header com Logotipo e Isotipo Vetorial Autêntico Libus */}
      <div className="px-6 py-5 border-b border-white/10 bg-black/20 flex items-center justify-between">
        <div>
          <LibusLogo className="h-7 w-auto" textColor="#FFFFFF" badgeText="PARTNER" />
          <p className="text-[10px] font-medium text-slate-400 tracking-wider mt-1.5 pl-0.5">
            Engenharia de Segurança & Homologação
          </p>
        </div>
        {/* Botão de Fechar no Mobile */}
        <button
          onClick={closeMobileMenu}
          className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>

      {/* User Card Profissional */}
      {user && (
        <div className="mx-4 my-4 p-3 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-libus-magenta to-pink-600 border border-white/20 flex items-center justify-center flex-shrink-0 text-xs font-black text-white shadow">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {user.role}
                </span>
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setPassError('');
                    setPassSuccess('');
                  }}
                  className="text-[9px] text-pink-400 hover:text-pink-300 underline font-mono cursor-pointer"
                  title="Alterar Senha"
                >
                  (Alterar Senha)
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Encerrar Sessão"
            className="text-slate-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition"
          >
            <LogOut size={15} />
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
          Menu Operacional
        </p>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          if (item.isPrimaryAction) {
            return (
              <div key={item.name} className="py-2">
                <Link
                  to={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-libus-magenta to-libus-magentaHover text-white font-bold text-xs tracking-wide shadow-lg hover:shadow-pink-500/20 hover:brightness-105 transition transform active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded bg-white/20">
                      <Icon size={14} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-70" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                isActive
                  ? 'bg-white/10 text-white border-l-4 border-libus-magenta shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-libus-magenta' : 'text-slate-400'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer com Metodologia Normativa */}
      <div className="p-3.5 m-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[10px] font-mono">
          <ShieldCheck size={13} className="text-libus-magenta" />
          <span>PORTARIA MTE & NR-6</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Laudos técnicos emitidos com base nas normas ABNT NBR e ensaios laboratoriais.
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col md:flex-row text-slate-800 antialiased selection:bg-libus-magenta selection:text-white">
      {/* Sidebar Desktop (Fixo) */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-gradient-to-b from-[#0F141F] via-[#151D2C] to-[#0A0D14] text-white flex-col flex-shrink-0 border-r border-white/10 shadow-2xl sticky top-0 h-screen no-print">
        {sidebarContent}
      </aside>

      {/* Drawer Mobile (Overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop escuro */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />
          {/* Menu Drawer */}
          <aside className="relative w-4/5 max-w-xs bg-gradient-to-b from-[#0F141F] via-[#151D2C] to-[#0A0D14] text-white flex flex-col h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar Institucional */}
        <header className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-10 backdrop-blur-md bg-white/95 no-print">
          <div className="flex items-center gap-3">
            {/* Botão Hamburger Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Abrir Menu"
            >
              <Menu size={20} />
            </button>

            <div className="p-1.5 rounded-lg bg-slate-100 text-libus-magenta border border-slate-200 hidden sm:block">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                Homologação Técnica & Comparativo Normativo
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Libus do Brasil • Divisão de Engenharia de Proteção
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Viewport Content - Fluido e sem margens gigantes */}
        <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 flex-1 w-full max-w-[1700px] mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile Native App Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F141F]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex items-center justify-around text-white shadow-2xl no-print">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            location.pathname === '/' ? 'text-libus-magenta font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[10px] tracking-tight mt-0.5 font-medium">Início</span>
        </Link>

        <Link
          to="/evaluations"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            location.pathname === '/evaluations' ? 'text-libus-magenta font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ClipboardCheck size={18} />
          <span className="text-[10px] tracking-tight mt-0.5 font-medium">Laudos</span>
        </Link>

        {/* Floating Action Button (Nova Avaliação) */}
        <Link
          to="/evaluations/new"
          className="flex flex-col items-center justify-center -mt-5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-libus-magenta to-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/40 border-2 border-[#0F141F] group-active:scale-95 transition">
            <Plus size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-bold tracking-tight text-pink-400 mt-1 uppercase font-mono">Novo</span>
        </Link>

        <Link
          to="/catalog"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            location.pathname === '/catalog' ? 'text-libus-magenta font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={18} />
          <span className="text-[10px] tracking-tight mt-0.5 font-medium">Catálogo</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-white transition"
        >
          <Menu size={18} />
          <span className="text-[10px] tracking-tight mt-0.5 font-medium">Menu</span>
        </button>
      </nav>

      {/* Modal de Alteração de Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5 text-libus-magenta">
                <div className="p-2 rounded-xl bg-pink-50 border border-pink-100">
                  <KeyRound size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Segurança da Conta</span>
                  <h3 className="text-base font-black text-slate-900">Alterar Senha de Acesso</h3>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {passError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle size={15} className="flex-shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 size={15} className="flex-shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Senha Atual *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nova Senha *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Nova Senha *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={changingPass}
                  className="px-5 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider disabled:opacity-50"
                >
                  {changingPass ? 'Atualizando...' : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
