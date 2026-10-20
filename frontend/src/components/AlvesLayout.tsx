import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { AlvesAuthGuard } from './AlvesAuthGuard';
import {
  LayoutDashboard,
  Users,
  FileText,
  FileCheck,
  Settings,
  PlusCircle,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const AlvesLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Visão Geral', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Propostas', href: '/propostas', icon: FileText },
    { name: 'Contratos', href: '/contratos', icon: FileCheck },
    { name: 'Modelos e Configurações', href: '/configuracoes', icon: Settings },
  ];

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <AlvesAuthGuard>
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row text-[#231B15]">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1B1410] text-[#FAF8F5] px-4 py-3 flex items-center justify-between border-b border-[#2A1F19] sticky top-0 z-40">
        <BrandMark variant="header" contrast="light" className="!px-1.5 !py-1" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-[#2A1F19] text-[#C5A265] hover:bg-[#382B23] transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1B1410] text-[#FAF8F5] border-r border-[#2A1F19] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="alves-pattern p-6 border-b border-[#2A1F19] flex flex-col items-center text-center">
          <div className="w-full flex justify-center mb-3">
            <BrandMark variant="sidebar" contrast="dark" />
          </div>
          <div className="mt-1">
            <h2 className="text-lg tracking-[0.16em] text-[#FAF8F5] font-bold">ALVES PLANEJADOS</h2>
            <p className="text-xs text-[#C5A265] uppercase tracking-widest font-medium mt-0.5">
              Propostas & Contratos
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="px-5 pt-5 pb-2">
          <Link
            to="/propostas/nova"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#C5A265] to-[#DFC28B] hover:from-[#B89454] hover:to-[#C5A265] text-[#1B1410] font-semibold px-4 py-3 rounded-xl shadow-gold-glow transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
          >
            <PlusCircle size={18} className="text-[#1B1410]" />
            <span>+ Nova Proposta</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-[#8C7D73] uppercase tracking-wider mb-2">
            Menu Principal
          </p>
          {navigation.map((item) => {
            const active = isCurrent(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#2A1F19] text-[#C5A265] border-l-4 border-[#C5A265] shadow-sm font-semibold'
                    : 'text-[#D9D2C7] hover:bg-[#241C18] hover:text-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={19} className={active ? 'text-[#C5A265]' : 'text-[#8C7D73]'} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight size={15} className="text-[#C5A265]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[#2A1F19] bg-[#140E0B]/70">
          <div className="flex items-center justify-between text-xs text-[#8C7D73]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ambiente Ativo</span>
            </div>
            <span className="text-[11px] font-mono text-[#C5A265]/80">v1.0 • Kasa</span>
          </div>
          <div className="mt-2 text-[11px] text-[#6E645C] text-center">
            Desenvolvido para Alves Planejados
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden md:flex bg-white/90 backdrop-blur border-b border-[#E8E2D9] px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-3 text-sm text-[#6E645C]">
            <span className="text-[#9B9087]">Alves Planejados</span>
            <span className="text-[#C5A265]">/</span>
            <span className="font-semibold text-[#231B15] capitalize">
              {location.pathname === '/' ? 'Visão Geral' : location.pathname.split('/')[1]}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/propostas/nova"
              className="flex items-center space-x-1.5 bg-[#1B1410] hover:bg-[#2A1F19] text-[#FAF8F5] text-xs font-medium px-3.5 py-2 rounded-lg border border-[#382B23] transition-colors"
            >
              <PlusCircle size={15} className="text-[#C5A265]" />
              <span>Criar Proposta</span>
            </Link>

            <div className="h-6 w-px bg-[#E8E2D9]" />

            <div className="flex items-center space-x-2.5 pl-2">
              <BrandMark variant="monogram" />
              <div className="text-left">
                <div className="text-xs font-semibold text-[#231B15]">Consultor Alves</div>
                <div className="text-[10px] text-[#9B9087]">São Paulo, SP</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
    </AlvesAuthGuard>
  );
};
