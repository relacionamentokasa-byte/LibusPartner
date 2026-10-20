import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Printer,
  Share2,
  ExternalLink,
  Edit3,
  Copy,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ArrowLeft,
  FileCheck2,
  Sparkles,
  GitBranch,
  Building,
  Award
} from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { AlvesStore } from '../services/alvesStore';
import { Proposta, ConfiguracoesEmpresa } from '../types/alves';

export const PreviaPropostaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [config, setConfig] = useState<ConfiguracoesEmpresa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) {
      setCarregando(false);
      return;
    }
    Promise.all([AlvesStore.getPropostaById(id), AlvesStore.getConfig()])
      .then(([prop, loadedConfig]) => {
        setProposta(prop ?? null);
        setConfig(loadedConfig);
      })
      .catch((error) => console.error('Erro ao carregar prévia:', error))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando || !config) {
    return <div className="p-8 text-sm text-[#6E645C]">Carregando prévia...</div>;
  }

  if (!proposta) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E8E2D9] text-center space-y-4 max-w-md mx-auto my-12">
        <FileText size={40} className="mx-auto text-[#9B9087]" />
        <h2 className="font-sans text-lg font-semibold text-[#1B1410]">Proposta não encontrada</h2>
        <Link to="/propostas" className="text-xs text-[#C5A265] font-semibold hover:underline block">
          Voltar para Lista de Propostas
        </Link>
      </div>
    );
  }

  const formatarMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const publicUrl = `${window.location.origin}/p/${proposta.publicToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareWhatsapp = () => {
    const rawMsg = config.mensagemWhatsappPadrao;
    const msg = rawMsg
      .replace('{CLIENTE}', proposta.cliente.nome.split(' ')[0])
      .replace('{PROJETO}', proposta.nomeProjeto)
      .replace('{LINK}', publicUrl);

    const whatsLimpo = (proposta.cliente.whatsapp || proposta.cliente.telefone || '').replace(/\D/g, '');
    const url = whatsLimpo
      ? `https://api.whatsapp.com/send?phone=55${whatsLimpo}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
  };

  const handleCriarNovaVersao = async () => {
    if (!window.confirm(`Deseja gerar uma nova versão (V${proposta.versao + 1}) desta proposta mantendo o histórico?`)) return;
    try {
      const nova = await AlvesStore.criarNovaVersaoProposta(proposta.id);
      navigate(`/propostas/${nova.id}/editar`);
    } catch (error) {
      console.error('Erro ao criar nova versão:', error);
      alert('Não foi possível criar a nova versão da proposta.');
    }
  };

  const handleGerarContrato = async () => {
    if (!window.confirm('Deseja converter esta proposta aprovada em um Contrato Oficial da Alves Planejados?')) return;
    try {
      await AlvesStore.gerarContratoDeProposta(proposta.id);
      navigate('/contratos');
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      alert('Não foi possível gerar o contrato desta proposta.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Action Toolbar (No Print) */}
      <div className="no-print bg-[#1B1410] text-[#FAF8F5] p-4 sm:p-5 rounded-3xl border border-[#2A1F19] shadow-premium flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-16 z-20 backdrop-blur">
        <div className="flex items-center space-x-3">
          <Link
            to="/propostas"
            className="p-2 bg-[#2A1F19] text-[#FAF8F5] hover:bg-[#382B23] rounded-xl text-xs flex items-center space-x-1"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold text-sm text-[#FAF8F5]">{proposta.numero}</span>
              <span className="text-[10px] bg-[#C5A265]/20 text-[#DFC28B] px-2 py-0.5 rounded-full font-semibold">
                Versão {proposta.versao}
              </span>
            </div>
            <p className="text-[11px] text-[#9B9087] truncate max-w-xs">{proposta.cliente.nome}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={handleCriarNovaVersao}
            title="Criar nova versão com base nesta"
            className="flex items-center space-x-1 px-3 py-2 bg-[#2A1F19] hover:bg-[#382B23] text-[#FAF8F5] rounded-xl border border-[#382B23] transition-colors"
          >
            <GitBranch size={13} className="text-[#C5A265]" />
            <span>Nova Versão</span>
          </button>

          <Link
            to={`/propostas/${proposta.id}/editar`}
            className="flex items-center space-x-1 px-3 py-2 bg-[#2A1F19] hover:bg-[#382B23] text-[#FAF8F5] rounded-xl border border-[#382B23] transition-colors"
          >
            <Edit3 size={13} />
            <span>Editar</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-3 py-2 bg-[#2A1F19] hover:bg-[#382B23] text-[#FAF8F5] rounded-xl border border-[#382B23] transition-colors"
          >
            <Printer size={13} />
            <span>Gerar / Imprimir PDF</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1 px-3 py-2 bg-[#2A1F19] hover:bg-[#382B23] text-[#C5A265] rounded-xl border border-[#C5A265]/30 transition-colors"
          >
            {copiedLink ? <CheckCircle2 size={13} /> : <Copy size={13} />}
            <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsapp}
            className="flex items-center space-x-1 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm transition-colors"
          >
            <Share2 size={13} />
            <span>Enviar no WhatsApp</span>
          </button>

          {proposta.status === 'aprovada' && (
            <button
              onClick={handleGerarContrato}
              className="flex items-center space-x-1 px-3.5 py-2 bg-[#C5A265] hover:bg-[#DFC28B] text-[#1B1410] rounded-xl font-bold shadow-gold-glow transition-all"
            >
              <FileCheck2 size={14} />
              <span>Gerar Contrato</span>
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENTO OFICIAL DA PROPOSTA (LAYOUT PREMIUM) */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-premium-lg overflow-hidden text-[#231B15] print:border-none print:shadow-none print:rounded-none">
        {/* CAPA DA PROPOSTA */}
        <section className="bg-gradient-to-b from-[#1B1410] via-[#241C18] to-[#1B1410] text-[#FAF8F5] p-8 sm:p-14 relative overflow-hidden border-b border-[#C5A265]/40">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C5A265]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[#382B23] pb-8">
            <div className="flex items-center space-x-4">
              <BrandMark variant="document" contrast="dark" className="!bg-[#F7F3EE]" />
              <div>
                <h1 className="font-brand text-2xl font-bold tracking-wider text-[#FAF8F5]">ALVES PLANEJADOS</h1>
                <p className="text-xs text-[#C5A265] uppercase tracking-widest font-semibold mt-0.5">
                  Marcenaria & Mobiliário Sob Medida de Alto Padrão
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-[#9B9087] uppercase tracking-wider block">Proposta Comercial</span>
              <div className="font-mono text-lg font-bold text-[#C5A265]">{proposta.numero}</div>
              <div className="text-xs text-[#D9D2C7] mt-0.5">Versão Oficial {proposta.versao}</div>
            </div>
          </div>

          <div className="pt-10 space-y-4 max-w-2xl">
            <span className="text-xs text-[#C5A265] uppercase tracking-widest font-bold">Apresentação Exclusiva</span>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-[#FAF8F5] leading-tight">
              {proposta.nomeProjeto}
            </h2>
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs text-[#D9D2C7] pt-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-[#9B9087]">Cliente:</span>
                <span className="font-semibold text-white">{proposta.cliente.nome}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[#9B9087]">Local da Obra:</span>
                <span className="font-semibold text-white">{proposta.enderecoObra}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[#9B9087]">Emissão:</span>
                <span className="text-white">{new Date(proposta.dataEmissao).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[#9B9087]">Validade:</span>
                <span className="text-[#DFC28B] font-semibold">
                  {new Date(proposta.dataValidade).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* APRESENTAÇÃO DO PROJETO */}
        <section className="p-8 sm:p-12 border-b border-[#E8E2D9] bg-[#FAF8F5]/60 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#C5A265] uppercase tracking-widest">
            <Sparkles size={15} />
            <span>Conceito & Qualidade Alves</span>
          </div>
          <h3 className="font-brand text-2xl font-bold text-[#1B1410]">Excelência em Cada Detalhe</h3>
          <p className="text-xs sm:text-sm text-[#6E645C] leading-relaxed max-w-4xl">
            {config.textoApresentacaoPadrao}
          </p>
        </section>

        {/* AMBIENTES & DETALHAMENTO */}
        <section className="p-8 sm:p-12 space-y-12">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4">
            <div>
              <span className="text-xs font-bold text-[#C5A265] uppercase tracking-widest">Escopo Completo</span>
              <h3 className="font-sans text-2xl font-bold text-[#1B1410] mt-1">
                Ambientes & Renders do Projeto ({proposta.ambientes.length})
              </h3>
            </div>
            <div className="text-xs text-[#6E645C]">
              Consultor: <span className="font-semibold text-[#1B1410]">{proposta.responsavel}</span>
            </div>
          </div>

          <div className="space-y-12">
            {proposta.ambientes.map((amb, index) => (
              <div key={amb.id} className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D9] pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-[#1B1410] text-[#C5A265] flex items-center justify-center font-bold text-xs">
                      0{index + 1}
                    </span>
                    <h4 className="font-sans text-xl font-bold text-[#1B1410]">{amb.nome}</h4>
                  </div>
                  {proposta.exibirValoresPorAmbiente && (
                    <div className="text-sm font-bold text-[#C5A265]">
                      Subtotal: {formatarMoeda(amb.valorSubtotal)}
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#6E645C] leading-relaxed">{amb.descricao}</p>

                {/* Galeria de Renders */}
                {amb.imagens && amb.imagens.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {amb.imagens.map((img) => (
                      <div key={img.id} className="rounded-2xl overflow-hidden border border-[#E8E2D9] shadow-sm bg-black/5">
                        <img src={img.url} alt={img.nome} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
                        <div className="p-3 bg-[#FAF8F5] text-xs font-medium text-[#231B15] border-t border-[#E8E2D9]">
                          {img.nome}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Itens do Ambiente */}
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] p-4 text-xs space-y-2">
                  <span className="font-semibold text-[#1B1410] block text-[11px] uppercase tracking-wider">
                    Especificações & Módulos Inclusos:
                  </span>
                  <div className="divide-y divide-[#E8E2D9]">
                    {amb.itens.map(item => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-[#C5A265] font-bold">•</span>
                          <span className="text-[#231B15] font-medium">{item.descricao}</span>
                          <span className="text-[#9B9087] text-[11px]">({item.quantidade} {item.unidade})</span>
                        </div>
                        {proposta.exibirValoresPorAmbiente && (
                          <div className="font-semibold text-[#1B1410]">{formatarMoeda(item.valorTotal)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INVESTIMENTO & CONDIÇÕES COMERCIAIS */}
        <section className="p-8 sm:p-12 bg-[#FAF8F5]/80 border-t border-[#E8E2D9] space-y-8 page-break">
          <div>
            <span className="text-xs font-bold text-[#C5A265] uppercase tracking-widest">Proposta Financeira</span>
            <h3 className="font-sans text-2xl font-bold text-[#1B1410] mt-1">Investimento & Condições de Pagamento</h3>
          </div>

          {/* Card Dourado de Investimento Total */}
          <div className="bg-gradient-to-r from-[#1B1410] to-[#2A1F19] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#C5A265]/40 shadow-premium-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs text-[#DFC28B] uppercase tracking-wider font-semibold">Valor Total do Projeto</span>
              <div className="text-3xl sm:text-4xl font-sans font-bold text-[#C5A265]">
                {formatarMoeda(proposta.condicoes.valorFinal)}
              </div>
              {proposta.condicoes.descontoGeral > 0 && (
                <div className="text-xs text-emerald-400">
                  Desconto comercial aplicado de {formatarMoeda(proposta.condicoes.descontoGeral)}
                </div>
              )}
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs text-[#D9D2C7]">
              <div><span className="text-[#9B9087]">Prazo de Execução:</span> <strong className="text-white">{proposta.condicoes.prazoExecucaoDias} dias úteis</strong></div>
              <div><span className="text-[#9B9087]">Garantia Estrutural:</span> <strong className="text-white">{proposta.condicoes.garantiaMeses} meses (5 anos)</strong></div>
              <div><span className="text-[#9B9087]">Validade da Proposta:</span> <strong className="text-[#DFC28B]">{new Date(proposta.dataValidade).toLocaleDateString('pt-BR')}</strong></div>
            </div>
          </div>

          {/* Cronograma de Pagamento */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4">
            <h4 className="font-semibold text-xs text-[#1B1410] uppercase tracking-wider flex items-center space-x-2">
              <Calendar size={14} className="text-[#C5A265]" />
              <span>Cronograma de Pagamento Acordado</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {proposta.condicoes.parcelas.map(parc => (
                <div key={parc.numero} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-xs">
                  <div className="flex items-center justify-between font-semibold text-[#1B1410]">
                    <span>Parcela #{parc.numero}</span>
                    <span className="text-[#C5A265] font-bold">{formatarMoeda(parc.valor)}</span>
                  </div>
                  <div className="text-[11px] text-[#6E645C] mt-1">{parc.descricao}</div>
                  <div className="text-[10px] text-[#9B9087] mt-2 pt-1 border-t border-[#E8E2D9]">
                    Vencimento: {new Date(parc.vencimento).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* O que está incluso e garantia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-2">
              <h4 className="font-semibold text-emerald-800 flex items-center space-x-1.5">
                <CheckCircle2 size={15} />
                <span>Escopo Incluso</span>
              </h4>
              <ul className="space-y-1 text-[#6E645C]">
                {proposta.condicoes.incluso.map((inc, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-2">
              <h4 className="font-semibold text-[#1B1410] flex items-center space-x-1.5">
                <Shield size={15} className="text-[#C5A265]" />
                <span>Termos de Garantia Alves</span>
              </h4>
              <p className="text-[#6E645C] leading-relaxed">
                {config.termosGarantiaPadrao}
              </p>
            </div>
          </div>
        </section>

        {/* ENCERRAMENTO & APROVAÇÃO */}
        <footer className="p-8 sm:p-12 border-t border-[#E8E2D9] bg-white space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#E8E2D9] pb-8 text-center sm:text-left">
            <div className="space-y-1 text-xs text-[#6E645C]">
              <div className="font-brand font-bold text-base text-[#1B1410]">{config.nomeFantasia}</div>
              <div>{config.enderecoCompleto}</div>
              <div>CNPJ: {config.cnpj} • Telefone: {config.telefone}</div>
            </div>

            <div className="flex items-center space-x-3">
              <BrandMark variant="header" contrast="dark" className="!px-1.5 !py-1" />
            </div>
          </div>

          {/* Status de Aprovação Registrado */}
          {proposta.aprovacao && (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center space-x-4">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-xs text-emerald-900 space-y-0.5">
                <div className="font-bold text-sm">Proposta Aprovada Eletronicamente pelo Cliente</div>
                <div>Aprovado por: <strong>{proposta.aprovacao.aprovadoPor}</strong></div>
                <div>Data/Hora: {new Date(proposta.aprovacao.aprovadoEm).toLocaleString('pt-BR')} ({proposta.aprovacao.ip})</div>
                {proposta.aprovacao.observacaoCliente && (
                  <div className="text-[11px] italic text-emerald-800 mt-1">"{proposta.aprovacao.observacaoCliente}"</div>
                )}
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};
