import React, { useState } from 'react';
import { Users, UserPlus, Search, GraduationCap, Briefcase, HeartHandshake, BookOpen, Edit2, Trash2, Check, X, RotateCcw, ArrowLeft, AlertCircle } from 'lucide-react';
import { Reader, UserCategory, ShiftType } from '../types/library';

interface ReadersManagerProps {
  readers: Reader[];
  onAddReader: (reader: Omit<Reader, 'id' | 'dataCadastro'>) => void;
  onUpdateReader: (reader: Reader) => void;
  onDeleteReader: (id: string) => void;
}

export const ReadersManager: React.FC<ReadersManagerProps> = ({
  readers,
  onAddReader,
  onUpdateReader,
  onDeleteReader,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readerToEdit, setReaderToEdit] = useState<Reader | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<UserCategory>('aluno');
  const [serie, setSerie] = useState('6º Ano');
  const [turma, setTurma] = useState('A');
  const [turno, setTurno] = useState<ShiftType>('Manhã');
  const [matricula, setMatricula] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setReaderToEdit(null);
    setNome('');
    setCategoria('aluno');
    setSerie('6º Ano');
    setTurma('A');
    setTurno('Manhã');
    setMatricula('');
    setTelefone('');
    setEmail('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: Reader) => {
    setReaderToEdit(r);
    setNome(r.nome);
    setCategoria(r.categoria);
    setSerie(r.serie || '6º Ano');
    setTurma(r.turma || 'A');
    setTurno(r.turno || 'Manhã');
    setMatricula(r.matricula || '');
    setTelefone(r.telefone || '');
    setEmail(r.email || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleCorrigir = () => {
    if (readerToEdit) {
      setNome(readerToEdit.nome);
      setCategoria(readerToEdit.categoria);
      setSerie(readerToEdit.serie || '6º Ano');
      setTurma(readerToEdit.turma || 'A');
      setTurno(readerToEdit.turno || 'Manhã');
      setMatricula(readerToEdit.matricula || '');
      setTelefone(readerToEdit.telefone || '');
      setEmail(readerToEdit.email || '');
    } else {
      setNome('');
      setMatricula('');
      setTelefone('');
      setEmail('');
    }
    setErrorMsg('');
  };

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('O nome do leitor é obrigatório.');
      return;
    }

    if (readerToEdit) {
      onUpdateReader({
        ...readerToEdit,
        nome: nome.trim(),
        categoria,
        serie: categoria === 'aluno' ? serie : undefined,
        turma: categoria === 'aluno' ? turma : undefined,
        turno: categoria === 'aluno' ? turno : undefined,
        matricula: matricula.trim() || undefined,
        telefone: telefone.trim() || undefined,
        email: email.trim() || undefined,
      });
    } else {
      onAddReader({
        nome: nome.trim(),
        categoria,
        serie: categoria === 'aluno' ? serie : undefined,
        turma: categoria === 'aluno' ? turma : undefined,
        turno: categoria === 'aluno' ? turno : undefined,
        matricula: matricula.trim() || undefined,
        telefone: telefone.trim() || undefined,
        email: email.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const filteredReaders = readers.filter(r => {
    if (filterCategory !== 'all' && r.categoria !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.nome.toLowerCase().includes(q) ||
        (r.matricula && r.matricula.toLowerCase().includes(q)) ||
        (r.serie && r.serie.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Cadastro e Gestão de Leitores
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Subclassificação oficial de alunos (série, turma, turno), professores, servidores e comunidade.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm shadow-blue-700/20 cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Leitor</span>
          </button>
        </div>

        {/* Filter bar and search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterCategory === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({readers.length})
            </button>
            <button
              onClick={() => setFilterCategory('aluno')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filterCategory === 'aluno' ? 'bg-white text-blue-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Alunos ({readers.filter(r => r.categoria === 'aluno').length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('professor')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filterCategory === 'professor' ? 'bg-white text-orange-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>Professores ({readers.filter(r => r.categoria === 'professor').length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('servidor')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filterCategory === 'servidor' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-600" />
              <span>Servidores ({readers.filter(r => r.categoria === 'servidor').length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('comunidade')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filterCategory === 'comunidade' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Comunidade ({readers.filter(r => r.categoria === 'comunidade').length})</span>
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, matrícula ou série..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Readers Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {filteredReaders.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            Nenhum leitor encontrado para a categoria ou termo pesquisado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-semibold tracking-wider">
                  <th className="py-2.5 px-4">Nome do Leitor</th>
                  <th className="py-2.5 px-4">Categoria</th>
                  <th className="py-2.5 px-4">Série / Turma / Turno</th>
                  <th className="py-2.5 px-4">Matrícula</th>
                  <th className="py-2.5 px-4">Contato (Tel / E-mail)</th>
                  <th className="py-2.5 px-4">Data Cadastro</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReaders.map((r) => {
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {r.nome}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-medium text-slate-700">
                          {r.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {r.categoria === 'aluno' ? (
                          <div className="text-[11px] font-medium text-blue-900">
                            {r.serie} - Turma {r.turma} ({r.turno})
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {r.matricula || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        <div>{r.telefone || '-'}</div>
                        {r.email && <div className="text-slate-400 text-[10px]">{r.email}</div>}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px] tabular-nums">
                        {new Date(r.dataCadastro).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                            title="Editar cadastro do leitor"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja realmente remover o leitor ${r.nome}?`)) {
                                onDeleteReader(r.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                            title="Remover leitor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold tracking-tight">
                  {readerToEdit ? 'Editar Leitor' : 'Cadastrar Novo Leitor'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmar} className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo: *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Ana Clara Rodrigues da Silva"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Categoria de Usuário:
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as UserCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="aluno">Aluno / Aluna</option>
                  <option value="professor">Professor / Professora</option>
                  <option value="servidor">Servidor Escolar</option>
                  <option value="comunidade">Comunidade / Responsável</option>
                </select>
              </div>

              {/* Subclassificação específica de Aluno e Aluna: [Série, Turma, Turno] */}
              {categoria === 'aluno' && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-3">
                  <span className="block font-bold text-blue-900 text-[11px] uppercase tracking-wide">
                    Subclassificação Escolar do Aluno:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                        Série:
                      </label>
                      <select
                        value={serie}
                        onChange={(e) => setSerie(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                      >
                        <option value="1º Ano">1º Ano</option>
                        <option value="2º Ano">2º Ano</option>
                        <option value="3º Ano">3º Ano</option>
                        <option value="4º Ano">4º Ano</option>
                        <option value="5º Ano">5º Ano</option>
                        <option value="6º Ano">6º Ano</option>
                        <option value="7º Ano">7º Ano</option>
                        <option value="8º Ano">8º Ano</option>
                        <option value="9º Ano">9º Ano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                        Turma:
                      </label>
                      <select
                        value={turma}
                        onChange={(e) => setTurma(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                      >
                        <option value="A">Turma A</option>
                        <option value="B">Turma B</option>
                        <option value="C">Turma C</option>
                        <option value="D">Turma D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                        Turno:
                      </label>
                      <select
                        value={turno}
                        onChange={(e) => setTurno(e.target.value as ShiftType)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                      >
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Integral">Integral</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Matrícula / ID:
                  </label>
                  <input
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Ex: 2026-6A-15"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telefone / WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(85) 99999-9999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-mail institucional ou de contato:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@escola.ce.gov.br"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Standardized Components: [Confirmar, Voltar, Cancelar, Corrigir] */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCorrigir}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Corrigir</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancelar</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-lg transition-colors font-semibold text-xs shadow-sm shadow-blue-700/20 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirmar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
