import React, { useState } from 'react';
import { CheckCircle2, X, ShieldCheck, PenTool, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import { SignaturePad } from './SignaturePad';

interface Participant {
  id?: string;
  name: string;
  roleOrArea: string;
}

interface HomologationSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationId: string;
  companyName: string;
  defaultTechnicianName: string;
  participants: Participant[];
  onSuccess: (updatedEvaluation: any) => void;
}

export const HomologationSignatureModal: React.FC<HomologationSignatureModalProps> = ({
  isOpen,
  onClose,
  evaluationId,
  companyName,
  defaultTechnicianName,
  participants,
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Dados do especialista responsável
  const [technicianName, setTechnicianName] = useState(defaultTechnicianName);
  const [technicianSignature, setTechnicianSignature] = useState('');
  const [technicianInstructed, setTechnicianInstructed] = useState(true);
  const [instructionNotes, setInstructionNotes] = useState('');

  // Dados do Responsável do Cliente
  const [clientSignerName, setClientSignerName] = useState(participants[0]?.name || '');
  const [clientSignerRole, setClientSignerRole] = useState(participants[0]?.roleOrArea || 'Engenharia de Segurança / SESMT');
  const [clientSignerDocument, setClientSignerDocument] = useState('');
  const [clientSignature, setClientSignature] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectExistingParticipant = (participant: Participant) => {
    setClientSignerName(participant.name);
    setClientSignerRole(participant.roleOrArea || 'Engenharia de Segurança / SESMT');
  };

  const handleSubmit = async () => {
    setError('');

    if (!technicianSignature) {
      setError('A assinatura do especialista responsável é obrigatória.');
      setStep(1);
      return;
    }

    if (!clientSignerName.trim()) {
      setError('Por favor, informe o nome do responsável pelo cliente.');
      return;
    }

    if (!clientSignature) {
      setError('A assinatura do responsável pelo cliente é obrigatória.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('libus_token');
      const res = await fetch(`/api/evaluations/${evaluationId}/sign-and-complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          technicianSignerName: technicianName,
          technicianSignature,
          technicianInstructed,
          instructionNotes: instructionNotes.trim() || undefined,
          clientSignerName: clientSignerName.trim(),
          clientSignerRole: clientSignerRole.trim(),
          clientSignerDocument: clientSignerDocument.trim() || undefined,
          clientSignature
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar homologação e assinaturas');
      }

      onSuccess(data.evaluation);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao salvar assinaturas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto">
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-libus-magenta flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-libus-magenta">
                HOMOLOGAÇÃO TÉCNICA OFICIAL
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Assinatura Digital do Laudo • {companyName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Indicador de Etapas */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${
              step === 1
                ? 'bg-libus-magenta/10 border-libus-magenta text-libus-magenta ring-2 ring-libus-magenta/20'
                : technicianSignature
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
              technicianSignature ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {technicianSignature ? '✓' : '1'}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase block text-slate-400 font-bold">1º Signatário</span>
              <strong className="text-xs truncate block">Especialista responsável</strong>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!technicianSignature) {
                setError('Assine a etapa do especialista responsável antes de prosseguir.');
                return;
              }
              setStep(2);
            }}
            className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${
              step === 2
                ? 'bg-libus-magenta/10 border-libus-magenta text-libus-magenta ring-2 ring-libus-magenta/20'
                : clientSignature
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
              clientSignature ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {clientSignature ? '✓' : '2'}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase block text-slate-400 font-bold">2º Signatário</span>
              <strong className="text-xs truncate block">Responsável Cliente / SESMT</strong>
            </div>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ETAPA 1: ESPECIALISTA RESPONSÁVEL */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">
                Nome do Especialista Responsável
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40"
                placeholder="Ex: Nome Completo do Especialista"
              />
            </div>

            {/* Termo NR-6 de Orientação Prévia */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={technicianInstructed}
                  onChange={(e) => setTechnicianInstructed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-libus-magenta focus:ring-libus-magenta border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  Atesto instrução prévia presencial sobre correta colocação e ajuste aos operadores (NR-6)
                </span>
              </label>
              <textarea
                rows={2}
                value={instructionNotes}
                onChange={(e) => setInstructionNotes(e.target.value)}
                placeholder="Observações técnicas de campo ou desvios de colocação observados (opcional)..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-libus-magenta/40"
              />
            </div>

            {/* Canvas de Assinatura do Especialista */}
            <SignaturePad
              label="Assinatura Manuscrita do Especialista Responsável"
              subLabel="Assine na tela com o dedo, caneta stylus ou mouse"
              onSignatureChange={(sig) => setTechnicianSignature(sig)}
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                {technicianSignature ? '✓ Assinatura capturada' : 'Traço pendente'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!technicianSignature) {
                    setError('Por favor, assine no campo acima antes de prosseguir.');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                className="px-5 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md"
              >
                <span>Avançar para Assinatura do Cliente</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: RESPONSÁVEL DO CLIENTE / SESMT */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Atalhos para selecionar participante já cadastrado */}
            {participants.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  Ou selecione um colaborador participante:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {participants.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectExistingParticipant(p)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-libus-magenta text-slate-700 text-[11px] font-mono font-medium border border-slate-200 transition flex items-center gap-1"
                    >
                      <UserCheck size={11} />
                      <span>{p.name} ({p.roleOrArea})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">
                  Nome do Responsável / SESMT *
                </label>
                <input
                  type="text"
                  value={clientSignerName}
                  onChange={(e) => setClientSignerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40"
                  placeholder="Ex: Engenheiro ou Coordenador de Segurança"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">
                  Cargo / Área *
                </label>
                <input
                  type="text"
                  value={clientSignerRole}
                  onChange={(e) => setClientSignerRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40"
                  placeholder="Ex: Eng. de Segurança / Coordenador SESMT"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">
                Registro Profissional / CPF / Matrícula (Opcional)
              </label>
              <input
                type="text"
                value={clientSignerDocument}
                onChange={(e) => setClientSignerDocument(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40 font-mono"
                placeholder="Ex: CREA 12345/D ou Matrícula 8821"
              />
            </div>

            {/* Canvas de Assinatura do Cliente */}
            <SignaturePad
              label="Assinatura do Responsável do Cliente"
              subLabel="Passe o dispositivo para o responsável assinar na tela"
              onSignatureChange={(sig) => setClientSignature(sig)}
            />

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-mono font-bold uppercase transition"
              >
                ← Voltar Etapa 1
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <CheckCircle2 size={16} />
                <span>{loading ? 'Homologando...' : 'HOMOLOGAR E ASSINAR LAUDO'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
