import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FileClock,
  Send,
  CheckCircle2,
  FileCheck2,
  Award,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Search,
  Eye,
  MessageCircle,
  Clock
} from 'lucide-react';
import { AlvesStore } from '../services/alvesStore';
import { Proposta, Contrato } from '../types/alves';

export const VisaoGeralPage: React.FC = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([AlvesStore.getPropostas(), AlvesStore.getContratos()])
      .then(([propostas, contratos]) => {
        if (active) { setPropostas(propostas); setContratos(contratos); }
      })
      .catch((error) => console.error('Erro ao carregar painel Alves:', error));
    return () => { active = false; };
  }, []);

  // Indicadores
  const totalPropostas = propostas.length;
  const propostasElaboracao = propostas.filter(p => p.status === 'rascunho').length;
  const propostasEnviadas = propostas.filter(p => p.status === 'enviada').length;
  const propostasAprovadas = propostas.filter(p => p.status === 'aprovada' || p.status === 'contrato_gerado').length;
  const contratosAguardando = contratos.filter(c => c.status === 'aguardando_assinatura').length;
  const contratosAssinados = contratos.filter(c => c.status === 'assinado').length;

  const valorTotalAprovado = propostas
    .filter(p => p.status === 'aprovada' || p.status === 'contrato_gerado')
    .reduce((acc, p) => acc + p.condicoes.valorFinal, 0);

  const propostasFiltradas = propostas.filter(p => {
    const termo = busca.toLowerCase();
    return (
      p.numero.toLowerCase().includes(termo) ||
      p.cliente.nome.toLowerCase().includes(termo) ||
      p.nomeProjeto.toLowerCase().includes(termo)
    );
  });

  const getStatusBadge = (status: Proposta['status']) => {
    switch (status) {
      case 'rascunho':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Em Elaboração
          </span>
        );
      case 'enviada':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            Enviada ao Cliente
          </span>
        );
      case 'aprovada':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Proposta Aprovada
          </span>
        );
      case 'solicitou_ajuste':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5" />
            Ajustes Solicitados
          </span>
        );
      case 'contrato_gerado':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF3E8] text-[#9E7E45] border border-[#C5A265]/40 font-semibold">
            <Award size={13} className="mr-1 text-[#C5A265]" />
            Contrato Gerado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B1410] via-[#2A1F19] to-[#1B1410] text-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#382B23] shadow-premium-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        {/* Subtle glow background element */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-[#C5A265]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-[#C5A265]/20 text-[#DFC28B] px-3 py-1 rounded-full text-xs font-medium border border-[#C5A265]/30">
            <Award size={14} className="text-[#C5A265]" />
            <span>Sistema Exclusivo de Propostas & Contratos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-semibold text-[#FAF8F5]">
            Painel Executivo Alves Planejados
          </h1>
          <p className="text-sm text-[#D9D2C7] leading-relaxed">
            Acompanhe o ciclo completo de orçamentos, aprovações de clientes e contratos prontos para assinatura.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to="/propostas/nova"
            className="flex items-center justify-center space-x-2 bg-[#C5A265] hover:bg-[#DFC28B] text-[#1B1410] font-semibold px-5 py-3.5 rounded-xl shadow-gold-glow transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
          >
            <PlusCircle size={18} />
            <span>+ Nova Proposta</span>
          </Link>
          <Link
            to="/clientes"
            className="flex items-center justify-center space-x-2 bg-[#2A1F19] hover:bg-[#382B23] text-[#FAF8F5] font-medium px-4 py-3.5 rounded-xl border border-[#382B23] transition-colors text-sm"
          >
            <span>Gerenciar Clientes</span>
          </Link>
        </div>
      </div>

      {/* 6 Indicadores Principais */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#231B15] flex items-center space-x-2">
            <span>Indicadores Comerciais</span>
            <span className="text-xs font-normal text-[#6E645C] bg-[#F2EFEB] px-2.5 py-0.5 rounded-full">
              Tempo Real
            </span>
          </h2>
          <div className="text-xs text-[#6E645C] font-medium">
            Volume Aprovado: <span className="text-[#1B1410] font-bold">{formatarMoeda(valorTotalAprovado)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total de Propostas */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm hover:border-[#C5A265]/50 transition-all">
            <div className="flex items-center justify-between text-[#6E645C] mb-2">
              <span className="text-xs font-medium">Total Propostas</span>
              <div className="p-2 bg-[#FAF8F5] rounded-xl text-[#231B15]">
                <FileText size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#1B1410]">{totalPropostas}</div>
            <div className="text-[11px] text-[#9B9087] mt-1">Todos os registros</div>
          </div>

          {/* Em Elaboração */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm hover:border-[#C5A265]/50 transition-all">
            <div className="flex items-center justify-between text-[#6E645C] mb-2">
              <span className="text-xs font-medium">Em Elaboração</span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
                <FileClock size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-900">{propostasElaboracao}</div>
            <div className="text-[11px] text-[#9B9087] mt-1">Rascunhos abertos</div>
          </div>

          {/* Enviadas */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm hover:border-[#C5A265]/50 transition-all">
            <div className="flex items-center justify-between text-[#6E645C] mb-2">
              <span className="text-xs font-medium">Enviadas</span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
                <Send size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-900">{propostasEnviadas}</div>
            <div className="text-[11px] text-[#9B9087] mt-1">Aguardando cliente</div>
          </div>

          {/* Aprovadas */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-[#6E645C] mb-2">
              <span className="text-xs font-medium">Aprovadas</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-900">{propostasAprovadas}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">Prontas p/ contrato</div>
          </div>

          {/* Contratos Aguardando */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm hover:border-[#C5A265]/50 transition-all">
            <div className="flex items-center justify-between text-[#6E645C] mb-2">
              <span className="text-xs font-medium">Ctr. Pendentes</span>
              <div className="p-2 bg-[#FAF3E8] rounded-xl text-[#9E7E45]">
                <FileCheck2 size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#231B15]">{contratosAguardando}</div>
            <div className="text-[11px] text-[#9B9087] mt-1">Pendente assinatura</div>
          </div>

          {/* Contratos Assinados */}
          <div className="bg-gradient-to-br from-[#1B1410] to-[#2A1F19] text-[#FAF8F5] p-4 rounded-2xl border border-[#C5A265]/40 shadow-sm transition-all">
            <div className="flex items-center justify-between text-[#D9D2C7] mb-2">
              <span className="text-xs font-medium">Assinados</span>
              <div className="p-2 bg-[#C5A265]/20 rounded-xl text-[#DFC28B]">
                <Award size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#FAF8F5]">{contratosAssinados}</div>
            <div className="text-[11px] text-[#C5A265] mt-1 font-medium">Fechamento total</div>
          </div>
        </div>
      </div>

      {/* Tabela de Propostas Recentes */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans text-lg font-semibold text-[#231B15]">Propostas Recentes</h3>
            <p className="text-xs text-[#6E645C] mt-0.5">
              Consulte e acesse rapidamente as propostas comerciais geradas no sistema
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9087]" />
              <input
                type="text"
                placeholder="Buscar cliente, número..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#231B15] placeholder-[#9B9087] focus:outline-none focus:border-[#C5A265] transition-colors"
              />
            </div>
            <Link
              to="/propostas"
              className="text-xs font-semibold text-[#C5A265] hover:text-[#9E7E45] whitespace-nowrap flex items-center space-x-1"
            >
              <span>Ver todas</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] font-semibold text-[#6E645C] uppercase tracking-wider">
                <th className="py-3.5 px-5">Número / Versão</th>
                <th className="py-3.5 px-5">Cliente</th>
                <th className="py-3.5 px-5">Projeto & Ambientes</th>
                <th className="py-3.5 px-5">Valor Final</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Data Emissão</th>
                <th className="py-3.5 px-5 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9] text-xs">
              {propostasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#9B9087]">
                    Nenhuma proposta encontrada.
                  </td>
                </tr>
              ) : (
                propostasFiltradas.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#1B1410]">{p.numero}</div>
                      <div className="text-[11px] text-[#9B9087]">Versão {p.versao}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-medium text-[#231B15]">{p.cliente.nome}</div>
                      <div className="text-[11px] text-[#6E645C]">{p.cliente.whatsapp || p.cliente.telefone}</div>
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <div className="font-medium text-[#231B15] truncate">{p.nomeProjeto}</div>
                      <div className="text-[11px] text-[#9B9087] truncate">
                        {p.ambientes.map(a => a.nome).join(', ')}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#1B1410]">{formatarMoeda(p.condicoes.valorFinal)}</div>
                      {p.condicoes.descontoGeral > 0 && (
                        <div className="text-[10px] text-emerald-700">
                          Desc: {formatarMoeda(p.condicoes.descontoGeral)}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="py-4 px-5 text-[#6E645C]">
                      {new Date(p.dataEmissao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/propostas/${p.id}/previa`}
                          title="Visualizar Proposta Oficial"
                          className="p-1.5 text-[#6E645C] hover:text-[#1B1410] hover:bg-[#F2EFEB] rounded-lg transition-colors"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/p/${p.publicToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Ver Link Público do Cliente"
                          className="p-1.5 text-[#C5A265] hover:text-[#9E7E45] hover:bg-[#FAF3E8] rounded-lg transition-colors"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <Link
                          to={`/propostas/${p.id}/editar`}
                          className="text-[11px] font-semibold text-[#1B1410] hover:text-[#C5A265] bg-[#FAF8F5] hover:bg-white px-2.5 py-1 rounded-md border border-[#E8E2D9] transition-all"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
