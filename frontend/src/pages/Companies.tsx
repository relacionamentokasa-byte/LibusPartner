import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building2, Plus, Phone, Mail, MapPin, Search, FileText, CheckCircle2, Trash2, AlertTriangle, Edit3, X } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const { user } = useAuth();
  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'GESTOR';
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [tradeName, setTradeName] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [segment, setSegment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const loadCompanies = async () => {
    try {
      const data = await apiRequest('/companies');
      setCompanies(data.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const openCreateModal = () => {
    setEditingCompany(null);
    setTradeName('');
    setCorporateName('');
    setCnpj('');
    setSegment('');
    setCity('');
    setState('');
    setContactName('');
    setContactEmail('');
    setShowModal(true);
  };

  const openEditModal = (c: any) => {
    setEditingCompany(c);
    setTradeName(c.tradeName || '');
    setCorporateName(c.corporateName || '');
    setCnpj(c.cnpj || '');
    setSegment(c.segment || '');
    setCity(c.city || '');
    setState(c.state || '');
    setContactName(c.contactName || '');
    setContactEmail(c.contactEmail || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCompany) {
        await apiRequest(`/companies/${editingCompany.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            tradeName,
            corporateName,
            cnpj,
            segment,
            city,
            state,
            contactName,
            contactEmail
          })
        });
      } else {
        await apiRequest('/companies', {
          method: 'POST',
          body: JSON.stringify({
            tradeName,
            corporateName,
            cnpj,
            segment,
            city,
            state,
            contactName,
            contactEmail
          })
        });
      }
      setShowModal(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar empresa');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!companyToDelete) return;
    setDeleting(true);
    try {
      await apiRequest(`/companies/${companyToDelete.id}`, {
        method: 'DELETE'
      });
      setCompanyToDelete(null);
      await loadCompanies();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir empresa');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = companies.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      c.tradeName?.toLowerCase().includes(q) ||
      c.corporateName?.toLowerCase().includes(q) ||
      c.cnpj?.includes(q) ||
      c.segment?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.state?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-libus-magenta"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              CADASTRO INDUSTRIAL & UNIDADES FABRIS
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Empresas & Clientes Homologados
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro de indústrias e postos de trabalho para aplicação das avaliações comparativas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-libus-magenta to-libus-magentaHover hover:brightness-105 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-pink-500/20 transition text-xs uppercase tracking-wider font-mono self-start sm:self-auto"
        >
          <Plus size={15} /> Cadastrar Empresa
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Nome Fantasia, Razão Social, CNPJ, Cidade ou Segmento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-400 font-semibold hidden sm:block">
          {filtered.length} {filtered.length === 1 ? 'empresa cadastrada' : 'empresas cadastradas'}
        </div>
      </div>

      {/* Grid de Empresas */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs font-mono">Carregando empresas cadastradas...</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-sm font-bold text-slate-800">Nenhuma empresa encontrada</p>
          <p className="text-xs text-slate-400 mt-1">Cadastre uma nova indústria para iniciar comparativos técnicos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 uppercase font-mono tracking-wider">
                    {c.segment || 'Indústria Geral'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-libus-magenta font-mono flex items-center gap-1 mr-1">
                      <FileText size={12} />
                      <span>{c._count?.evaluations ?? 0} Laudos</span>
                    </span>
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 text-slate-400 hover:text-libus-magenta hover:bg-pink-50 rounded-lg transition"
                      title={`Editar dados de ${c.tradeName}`}
                    >
                      <Edit3 size={14} />
                    </button>
                    {isManagerOrAdmin && (
                      <button
                        onClick={() => setCompanyToDelete(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title={`Excluir ${c.tradeName}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{c.tradeName}</h3>
                  {c.corporateName && <p className="text-xs text-slate-500 font-medium mt-0.5">{c.corporateName}</p>}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  {c.cnpj && (
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                      <span className="text-slate-400">CNPJ:</span>
                      <span className="font-semibold text-slate-700">{c.cnpj}</span>
                    </div>
                  )}
                  {(c.city || c.state) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{c.city ? `${c.city} - ${c.state}` : c.state}</span>
                    </div>
                  )}
                  {c.contactName && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="text-slate-400 font-semibold">Contato:</span>
                      <span>{c.contactName} {c.contactEmail ? `(${c.contactEmail})` : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Cadastro / Edição de Empresa */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-libus-magenta">
                  {editingCompany ? 'EDIÇÃO DE CADASTRO' : 'NOVO CADASTRO'}
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  {editingCompany ? 'Editar Empresa / Unidade' : 'Cadastrar Empresa / Indústria'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Fantasia *</label>
                <input
                  type="text"
                  required
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="Ex: Indústria Metalúrgica Paulista"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Razão Social</label>
                <input
                  type="text"
                  value={corporateName}
                  onChange={(e) => setCorporateName(e.target.value)}
                  placeholder="Ex: IMP Indústria e Comércio LTDA"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Segmento</label>
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    placeholder="Ex: Metalurgia, Mineração"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Paulínia"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Ex: SP"
                    maxLength={2}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs uppercase font-mono focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Responsável Local</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Carlos Engenharia"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail do Responsável</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="carlos@empresa.com"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-libus-magenta/40 focus:border-libus-magenta text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-libus-magenta hover:bg-libus-magentaHover text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider"
                >
                  {saving ? 'Salvando...' : editingCompany ? 'Salvar Alterações' : 'Salvar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {companyToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex-shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Excluir Empresa?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tem certeza que deseja excluir a empresa <strong className="text-slate-800">{companyToDelete.tradeName}</strong>?
                </p>
                {companyToDelete._count?.evaluations > 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2 font-medium">
                    Esta empresa possui <strong>{companyToDelete._count.evaluations} laudo(s)</strong> vinculados. Ela será arquivada para preservar o histórico das avaliações.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setCompanyToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition font-mono"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition font-mono uppercase tracking-wider flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{deleting ? 'Excluindo...' : 'Confirmar Exclusão'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};