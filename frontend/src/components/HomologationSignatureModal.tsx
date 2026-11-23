import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, ShieldCheck, ArrowRight, AlertTriangle, UserCheck } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { apiRequest } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface Participant {
  id: string;
  name: string;
  roleOrArea: string;
}

interface ParticipantSignature {
  participantId: string;
  signature: string;
  signerName: string;
  signerRole: string;
  signerDocument?: string;
  signedAt?: string;
}

interface HomologationSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationId: string;
  companyName: string;
  defaultTechnicianName: string;
  defaultTechnicianSignature?: string;
  individualParticipantId?: string;
  participants: Participant[];
  participantSignatures?: ParticipantSignature[];
  onSuccess: (updatedEvaluation: any) => void;
}

export const HomologationSignatureModal: React.FC<HomologationSignatureModalProps> = ({
  isOpen,
  onClose,
  evaluationId,
  companyName,
  defaultTechnicianName,
  defaultTechnicianSignature = '',
  individualParticipantId,
  participants,
  participantSignatures = [],
  onSuccess
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [technicianName, setTechnicianName] = useState(defaultTechnicianName);
  const [technicianSignature, setTechnicianSignature] = useState('');
  const [technicianInstructed, setTechnicianInstructed] = useState(true);
  const [instructionNotes, setInstructionNotes] = useState('');
  const [activeParticipantId, setActiveParticipantId] = useState(participants[0]?.id || '');
  const [signatureDrafts, setSignatureDrafts] = useState<Record<string, ParticipantSignature>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingParticipant, setSavingParticipant] = useState(false);

  // Reinicia os dados somente quando o modal abre (ou muda o laudo/participante),
  // para que um re-render do laudo não apague a assinatura recém-desenhada.
  useEffect(() => {
    if (!isOpen) return;
    setTechnicianName(defaultTechnicianName);
    setTechnicianSignature(defaultTechnicianSignature || user?.signatureImage || '');
    setSignatureDrafts(Object.fromEntries(
      participantSignatures.map(signature => [signature.participantId, signature])
    ));
    setActiveParticipantId(individualParticipantId || participants[0]?.id || '');
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, evaluationId, individualParticipantId]);

  if (!isOpen) return null;

  const activeParticipant = participants.find(p => p.id === activeParticipantId) || participants[0];
  const activeDraft = activeParticipant ? signatureDrafts[activeParticipant.id] : undefined;
  const signedParticipantsCount = participants.filter(p => Boolean(signatureDrafts[p.id]?.signature)).length;

  const updateActiveDraft = (patch: Partial<ParticipantSignature>) => {
    if (!activeParticipant) return;
    setSignatureDrafts(current => ({
      ...current,
      [activeParticipant.id]: {
        participantId: activeParticipant.id,
        signature: current[activeParticipant.id]?.signature || '',
        signerName: current[activeParticipant.id]?.signerName || activeParticipant.name,
        signerRole: current[activeParticipant.id]?.signerRole || activeParticipant.roleOrArea || 'Engenharia de Segurança / SESMT',
        signerDocument: current[activeParticipant.id]?.signerDocument || '',
        ...patch
      }
    }));
  };

  const selectParticipant = (participant: Participant) => {
    setActiveParticipantId(participant.id);
    setError('');
  };

  const saveActiveParticipantSignature = async () => {
    if (!technicianSignature) {
      setError('A assinatura do especialista responsável é obrigatória.');
      setStep(1);
      return false;
    }
    if (!activeParticipant || !activeDraft?.signature) {
      setError('Capture a assinatura do responsável selecionado antes de salvar.');
      return false;
    }
    if (!activeDraft.signerName.trim() || !activeDraft.signerRole.trim()) {
      setError('Informe nome e cargo do responsável antes de salvar.');
      return false;
    }
    try {
      setSavingParticipant(true);
      const data = await apiRequest(`/evaluations/${evaluationId}/participant-signatures/${activeParticipant.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          signature: activeDraft.signature,
          signerName: activeDraft.signerName.trim(),
          signerRole: activeDraft.signerRole.trim(),
          signerDocument: activeDraft.signerDocument?.trim() || undefined,
          technicianSignature,
          technicianSignerName: technicianName.trim()
        })
      });
      onSuccess(data.evaluation);
      setError('Assinatura salva. Selecione o próximo responsável.');
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar assinatura do participante');
      return false;
    } finally {
      setSavingParticipant(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (individualParticipantId) {
      const saved = await saveActiveParticipantSignature();
      if (saved) onClose();
      return;
    }
    if (!technicianSignature) {
      setError('A assinatura do especialista responsável é obrigatória.');
      setStep(1);
      return;
    }

    const signingParticipants = individualParticipantId
      ? participants.filter(participant => participant.id === individualParticipantId)
      : participants;

    if (signingParticipants.length > 0) {
      const missing = signingParticipants.find(p => !signatureDrafts[p.id]?.signature);
      if (missing) {
        setActiveParticipantId(missing.id);
        setStep(2);
        setError(`A assinatura de ${missing.name} ainda é obrigatória.`);
        return;
      }
    }

    try {
      setLoading(true);
      const participantPayload = signingParticipants
        .map(participant => signatureDrafts[participant.id])
        .filter(Boolean);
      const firstSignature = participantPayload[0];

      const data = await apiRequest(`/evaluations/${evaluationId}/sign-and-complete`, {
        method: 'PATCH',
        body: JSON.stringify({
          technicianSignerName: technicianName.trim(),
          technicianSignature,
          technicianInstructed,
          instructionNotes: instructionNotes.trim() || undefined,
          participantSignatures: participantPayload,
          // Compatibilidade com avaliações antigas que ainda exibem campos únicos.
          clientSignerName: firstSignature?.signerName,
          clientSignerRole: firstSignature?.signerRole,
          clientSignerDocument: firstSignature?.signerDocument || undefined,
          clientSignature: firstSignature?.signature
        })
      });

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
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-libus-magenta flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-libus-magenta">{t.modalSignBadge}</span>
              <h3 className="text-lg font-black text-slate-900">{t.modalSignTitle} • {companyName}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setStep(1)} className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${step === 1 ? 'bg-libus-magenta/10 border-libus-magenta text-libus-magenta ring-2 ring-libus-magenta/20' : technicianSignature ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${technicianSignature ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>{technicianSignature ? '✓' : '1'}</div>
            <div className="min-w-0"><span className="text-[9px] font-mono uppercase block text-slate-400 font-bold">1º Signatário</span><strong className="text-xs truncate block">{t.modalStep1TechTab.split(':')[1]?.trim() || 'Especialista'}</strong></div>
          </button>
          <button type="button" onClick={() => { if (!technicianSignature) { setError('Assine a etapa do especialista responsável antes de prosseguir.'); return; } setStep(2); }} className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${step === 2 ? 'bg-libus-magenta/10 border-libus-magenta text-libus-magenta ring-2 ring-libus-magenta/20' : signedParticipantsCount === participants.length && participants.length > 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${signedParticipantsCount === participants.length && participants.length > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>{signedParticipantsCount === participants.length && participants.length > 0 ? '✓' : '2'}</div>
            <div className="min-w-0"><span className="text-[9px] font-mono uppercase block text-slate-400 font-bold">2º Signatários</span><strong className="text-xs truncate block">{signedParticipantsCount}/{participants.length || 1} responsáveis</strong></div>
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium"><AlertTriangle size={16} className="text-red-500 flex-shrink-0" /><span>{error}</span></div>}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">{t.modalTechSignTitle}</label>
              <input type="text" value={technicianName} onChange={e => setTechnicianName(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40" placeholder="Ex: Nome Completo do Especialista" />
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer"><input type="checkbox" checked={technicianInstructed} onChange={e => setTechnicianInstructed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded text-libus-magenta focus:ring-libus-magenta border-slate-300" /><span className="text-xs font-bold text-slate-800 leading-tight">{t.modalTechInstructedCheck}</span></label>
              <textarea rows={2} value={instructionNotes} onChange={e => setInstructionNotes(e.target.value)} placeholder={t.modalTechNotesLabel} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-libus-magenta/40" />
            </div>
            <SignaturePad label={t.modalTechSignTitle} subLabel={t.modalTechSignPrompt} onSignatureChange={setTechnicianSignature} />
            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400 font-mono">{technicianSignature ? t.modalCapturedBadge : 'Traço pendente'}</span>
              <button type="button" onClick={() => { if (!technicianSignature) { setError('Por favor, assine no campo acima antes de prosseguir.'); return; } setError(''); setStep(2); }} className="px-5 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md"><span>{t.modalAdvanceToClient}</span><ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Responsáveis que devem assinar</span><span className="text-[10px] font-mono font-bold text-emerald-700">{signedParticipantsCount}/{participants.length} assinados</span></div>
              <div className="flex flex-wrap gap-1.5">
                {participants.map(participant => {
                  const signed = Boolean(signatureDrafts[participant.id]?.signature);
                  return <button key={participant.id} type="button" onClick={() => selectParticipant(participant)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium border transition flex items-center gap-1 ${activeParticipant?.id === participant.id ? 'bg-pink-50 text-libus-magenta border-libus-magenta/40' : signed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-pink-50'}`}><UserCheck size={11} /><span>{participant.name}</span><span>{signed ? '✓' : '•'}</span></button>;
                })}
              </div>
            </div>

            {activeParticipant ? (
              <>
                <div className="flex items-center justify-between"><div><p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Assinatura do responsável selecionado</p><h4 className="text-sm font-black text-slate-900">{activeParticipant.name}</h4><p className="text-[11px] text-slate-500">{activeParticipant.roleOrArea}</p></div>{activeDraft?.signature && <span className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">Assinatura capturada</span>}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">Nome</label><input type="text" value={activeDraft?.signerName || activeParticipant.name} onChange={e => updateActiveDraft({ signerName: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40" /></div>
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">Cargo / Área</label><input type="text" value={activeDraft?.signerRole || activeParticipant.roleOrArea} onChange={e => updateActiveDraft({ signerRole: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40" /></div>
                </div>
                <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-1">Documento / Matrícula</label><input type="text" value={activeDraft?.signerDocument || ''} onChange={e => updateActiveDraft({ signerDocument: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-libus-magenta/40 font-mono" placeholder="Ex: CREA 12345/D ou Matrícula 8821" /></div>
                <SignaturePad label={`Assinatura de ${activeParticipant.name}`} subLabel="Assine com o dedo, caneta touch ou mouse" onSignatureChange={signature => updateActiveDraft({ signature })} />
                <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-100"><div className="flex gap-2"><button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-mono font-bold uppercase transition">{t.modalBackStep1}</button><button type="button" disabled={savingParticipant || !activeDraft?.signature} onClick={individualParticipantId ? handleSubmit : saveActiveParticipantSignature} className="px-4 py-2.5 bg-libus-magenta hover:bg-libus-magentaHover disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition">{savingParticipant ? 'Salvando...' : 'Salvar assinatura'}</button></div><button type="button" disabled={loading} onClick={handleSubmit} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg hover:shadow-xl"><CheckCircle2 size={16} /><span>{loading ? t.modalSigningLoading : 'Homologar após todas as assinaturas'}</span></button></div>
              </>
            ) : <p className="text-sm text-slate-500">Cadastre pelo menos um responsável antes de homologar.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
