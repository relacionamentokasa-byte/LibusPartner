import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Shield,
  Award,
  Search,
  ExternalLink,
  Lock,
  X,
  Check,
  AlertTriangle,
  Building,
  UserCheck
} from 'lucide-react';
import { AlvesStore } from '../services/alvesStore';
import { Contrato, ConfiguracoesEmpresa } from '../types/alves';

export const ContratosPage: React.FC = () => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [config, setConfig] = useState<ConfiguracoesEmpresa | null>(null);
  const [busca, setBusca] = useState('');
  const [contratoVisualizando, setContratoVisualizando] = useState<Contrato | null>(null);

  // Modal de Assinatura Demonstrativa
  const [modalAssinaturaOpen, setModalAssinaturaOpen] = useState(false);
  const [assinanteNome, setAssinanteNome] = useState('');
  const [assinanteDoc, setAssinanteDoc] = useState('');
  const [assinanteEmail, setAssinanteEmail] = useState('');
  const [concordouTermos, setConcordouTermos] = useState(false);

  const carregarContratos = async () => {
    const [list, config] = await Promise.all([AlvesStore.getContratos(), AlvesStore.getConfig()]);
    setContratos(list);
    setConfig(config);
    if (list.length > 0 && !contratoVisualizando) {
      setContratoVisualizando(list[0]);
    }
  };

  useEffect(() => {
    carregarContratos().catch((error) => console.error('Erro ao carregar contratos:', error));
  }, []);

  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const openAssinaturaModal = (ctr: Contrato) => {
    setContratoVisualizando(ctr);
    setAssinanteNome(ctr.cliente.nome);
    setAssinanteDoc(ctr.cliente.documento || '');
    setAssinanteEmail(ctr.cliente.email || '');
    setConcordouTermos(false);
    setModalAssinaturaOpen(true);
  };

  const handleConfirmarAssinatura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contratoVisualizando || !concordouTermos) return;

    const assinado = await AlvesStore.assinarContratoDemonstrativo(contratoVisualizando.publicToken, {
      nome: assinanteNome,
      documento: assinanteDoc,
      email: assinanteEmail
    });

    if (assinado) {
      setContratoVisualizando({ ...assinado });
      setModalAssinaturaOpen(false);
      await carregarContratos();
      alert('Assinatura Eletrônica Registrada com Sucesso! Trilha de auditoria gerada.');
    }
  };

  const contratosFiltrados = contratos.filter(c => {
    const termo = busca.toLowerCase();
    return (
      c.numero.toLowerCase().includes(termo) ||
      c.cliente.nome.toLowerCase().includes(termo) ||
      c.nomeProjeto.toLowerCase().includes(termo)
    );
  });

  if (!config) return <div className="p-8 text-sm text-[#6E645C]">Carregando contratos...</div>;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-[#231B15]">Contratos de Prestação de Serviços</h1>
          <p className="text-xs text-[#6E645C] mt-1">
            Contratos jurídicos gerados a partir de propostas aprovadas com suporte a assinatura eletrônica.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Lista de Contratos */}
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9087]" />
              <input
                type="text"
                placeholder="Buscar contrato..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#231B15] focus:outline-none focus:border-[#C5A265]"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {contratosFiltrados.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-[#E8E2D9] text-xs text-[#9B9087]">
                Nenhum contrato gerado. Aprove uma proposta comercial para gerar o contrato automaticamente.
              </div>
            ) : (
              contratosFiltrados.map((ctr) => {
                const isSelected = contratoVisualizando?.id === ctr.id;
                const isAssinado = ctr.status === 'assinado';

                return (
                  <div
                    key={ctr.id}
                    onClick={() => setContratoVisualizando(ctr)}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C5A265] ring-2 ring-[#C5A265]/20 shadow-md bg-[#FAF8F5]/40'
                        : 'border-[#E8E2D9] hover:border-[#C5A265]/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#1B1410]">{ctr.numero}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isAssinado
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isAssinado ? '✓ Assinado' : 'Aguardando Assinatura'}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="font-sans text-sm font-bold text-[#1B1410]">{ctr.cliente.nome}</div>
                      <div className="text-[11px] text-[#6E645C] truncate">{ctr.nomeProjeto}</div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E8E2D9] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#9B9087]">Ref: {ctr.propostaNumero}</span>
                      <span className="font-bold text-[#C5A265]">{formatarMoeda(ctr.valorTotal)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Coluna 2 e 3: Visualizador do Contrato Oficial */}
        <div className="lg:col-span-2">
          {contratoVisualizando ? (
            <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-premium-lg overflow-hidden space-y-6">
              {/* Barra de Ações do Contrato */}
              <div className="bg-[#1B1410] text-[#FAF8F5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A1F19]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans font-bold text-base text-[#FAF8F5]">{contratoVisualizando.numero}</span>
                    <span className="text-[11px] text-[#C5A265]">
                      • Vinculado à {contratoVisualizando.propostaNumero} (V{contratoVisualizando.propostaVersao})
                    </span>
                  </div>
                  <p className="text-xs text-[#D9D2C7] mt-0.5">{contratoVisualizando.cliente.nome}</p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-[#2A1F19] hover:bg-[#382B23] text-[#FAF8F5] rounded-xl border border-[#382B23] flex items-center space-x-1"
                  >
                    <Printer size={13} />
                    <span>Imprimir Contrato</span>
                  </button>

                  {contratoVisualizando.status !== 'assinado' ? (
                    <button
                      onClick={() => openAssinaturaModal(contratoVisualizando)}
                      className="px-4 py-2 bg-[#C5A265] hover:bg-[#DFC28B] text-[#1B1410] font-bold rounded-xl shadow-gold-glow flex items-center space-x-1.5 transition-all"
                    >
                      <UserCheck size={14} />
                      <span>Assinar Eletronicamente (Demo)</span>
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>Contrato Assinado & Válido</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status de Assinatura e Trilha de Auditoria */}
              {contratoVisualizando.assinatura && (
                <div className="mx-6 sm:mx-8 p-5 bg-[#FAF3E8] rounded-2xl border border-[#C5A265]/40 text-xs space-y-3">
                  <div className="flex items-center space-x-2 font-sans font-bold text-sm text-[#1B1410]">
                    <Award size={18} className="text-[#C5A265]" />
                    <span>Trilha de Auditoria & Evidência Eletrônica</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#6E645C]">
                    <div>Assinado por: <strong className="text-[#1B1410]">{contratoVisualizando.assinatura.assinadoPor}</strong></div>
                    <div>Documento CPF/CNPJ: <strong className="text-[#1B1410]">{contratoVisualizando.assinatura.documentoAssinante}</strong></div>
                    <div>Data e Hora: <span className="text-[#1B1410]">{new Date(contratoVisualizando.assinatura.assinadoEm).toLocaleString('pt-BR')}</span></div>
                    <div>Integridade Técnica: <span className="font-mono text-[10px] text-[#9E7E45]">{contratoVisualizando.assinatura.ipSimulado}</span></div>
                  </div>

                  <div className="pt-2 border-t border-[#C5A265]/20 space-y-1">
                    <span className="font-semibold text-[#1B1410] text-[11px]">Registro de Eventos:</span>
                    {contratoVisualizando.assinatura.trilhaAuditoria.map((t, idx) => (
                      <div key={idx} className="text-[11px] text-[#6E645C] flex items-center justify-between">
                        <span>• {t.evento}: {t.detalhes}</span>
                        <span className="text-[10px] text-[#9B9087]">{new Date(t.dataHora).toLocaleTimeString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TEXTO FORMAL DO CONTRATO */}
              <div className="p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-[#231B15] leading-relaxed">
                <div className="text-center border-b border-[#E8E2D9] pb-6 space-y-1">
                  <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1B1410] uppercase tracking-wide">
                    CONTRATO DE PRESTAÇÃO DE SERVIÇOS E FORNECIMENTO DE MÓVEIS SOB MEDIDA
                  </h2>
                  <p className="text-xs text-[#6E645C]">Instrumento Particular de Fabricação e Montagem</p>
                </div>

                {/* Qualificação das Partes */}
                <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D9] text-xs">
                  <h3 className="font-sans font-bold text-[#1B1410] text-sm uppercase">1. DAS PARTES CONTRATANTES</h3>
                  <p>
                    <strong>CONTRATADA:</strong> {config.razaoSocial}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {config.cnpj}, com sede em {config.enderecoCompleto}.
                  </p>
                  <p>
                    <strong>CONTRATANTE:</strong> {contratoVisualizando.cliente.nome}, inscrito(a) sob o CPF/CNPJ nº {contratoVisualizando.cliente.documento || 'Não informado'}, residente e domiciliado(a) em {contratoVisualizando.enderecoObra}, telefone/WhatsApp {contratoVisualizando.cliente.whatsapp || contratoVisualizando.cliente.telefone}.
                  </p>
                </div>

                {/* Cláusulas do Contrato */}
                <div className="space-y-6">
                  {contratoVisualizando.clausulas.map((cl, idx) => (
                    <div key={cl.id} className="space-y-1.5">
                      <h4 className="font-sans font-bold text-[#1B1410] text-xs uppercase tracking-wider">
                        CLÁUSULA {idx + 1}ª — {cl.titulo}
                      </h4>
                      <p className="text-xs text-[#6E645C] leading-relaxed text-justify">
                        {cl.conteudo}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Resumo Financeiro */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] text-xs space-y-2">
                  <h4 className="font-sans font-bold text-[#1B1410] text-xs uppercase">VALOR E FORMA DE PAGAMENTO</h4>
                  <p>
                    O valor total deste contrato é de <strong>{formatarMoeda(contratoVisualizando.valorTotal)}</strong>, a ser pago conforme: {contratoVisualizando.condicoesPagamento}.
                  </p>
                  <p>
                    Prazo de entrega e montagem: <strong>{contratoVisualizando.prazoEntregaDias} dias úteis</strong> contados da liberação do local e medição final.
                  </p>
                </div>

                {/* Assinaturas */}
                <div className="pt-8 border-t border-[#E8E2D9] grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
                  <div className="space-y-2">
                    <div className="h-12 flex items-end justify-center font-sans text-[#C5A265] italic text-sm">
                      Alves Planejados & Interiores
                    </div>
                    <div className="border-t border-[#231B15] pt-1">
                      <div className="font-bold">{config.nomeFantasia}</div>
                      <div className="text-[10px] text-[#6E645C]">CONTRATADA</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-12 flex items-end justify-center font-sans text-[#1B1410] italic text-sm">
                      {contratoVisualizando.assinatura ? contratoVisualizando.assinatura.assinadoPor : '___________________________'}
                    </div>
                    <div className="border-t border-[#231B15] pt-1">
                      <div className="font-bold">{contratoVisualizando.cliente.nome}</div>
                      <div className="text-[10px] text-[#6E645C]">CONTRATANTE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-[#E8E2D9] text-xs text-[#9B9087]">
              Selecione um contrato para visualizar o documento completo.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Assinatura Eletrônica Demonstrativa */}
      {modalAssinaturaOpen && contratoVisualizando && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E8E2D9] shadow-premium-lg overflow-hidden p-6 sm:p-8 space-y-4 text-xs animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
              <h3 className="font-sans text-base font-bold text-[#1B1410] flex items-center space-x-2">
                <UserCheck size={18} className="text-[#C5A265]" />
                <span>Assinatura Eletrônica Demonstrativa</span>
              </h3>
              <button onClick={() => setModalAssinaturaOpen(false)} className="text-[#9B9087] hover:text-[#231B15]">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200">
              <span className="font-bold">Aviso de Simulação:</span> Esta funcionalidade demonstra a validação e trilha de auditoria para o protótipo da Alves Planejados.
            </div>

            <form onSubmit={handleConfirmarAssinatura} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#231B15]">Nome Completo do Assinante *</label>
                <input
                  type="text"
                  required
                  value={assinanteNome}
                  onChange={(e) => setAssinanteNome(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#231B15]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#231B15]">CPF ou CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={assinanteDoc}
                    onChange={(e) => setAssinanteDoc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#231B15]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#231B15]">E-mail para Comprovante</label>
                  <input
                    type="email"
                    value={assinanteEmail}
                    onChange={(e) => setAssinanteEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#231B15]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={concordouTermos}
                    onChange={(e) => setConcordouTermos(e.target.checked)}
                    className="mt-0.5 rounded text-[#C5A265] focus:ring-[#C5A265]"
                  />
                  <span className="text-[11px] text-[#6E645C] leading-snug">
                    Declaro que li e concordo integralmente com todas as cláusulas, prazos e condições financeiras do contrato <strong>{contratoVisualizando.numero}</strong>.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setModalAssinaturaOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D9] text-[#6E645C] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!concordouTermos}
                  className="px-5 py-2 bg-[#C5A265] hover:bg-[#DFC28B] text-[#1B1410] font-bold rounded-xl disabled:opacity-50 transition-all shadow-gold-glow"
                >
                  Confirmar Assinatura Digital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
