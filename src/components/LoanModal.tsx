import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, ArrowLeft, Calendar, User, BookOpen, AlertCircle } from 'lucide-react';
import { Book, Reader, Loan } from '../types/library';

interface LoanModalProps {
  isOpen: boolean;
  preselectedBook?: Book | null;
  availableBooks: Book[];
  readers: Reader[];
  activeAssistantName: string;
  onClose: () => void;
  onConfirmLoan: (loanData: Omit<Loan, 'id' | 'status' | 'notificacoesEnviadas'>) => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  preselectedBook,
  availableBooks,
  readers,
  activeAssistantName,
  onClose,
  onConfirmLoan,
}) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedReaderId, setSelectedReaderId] = useState('');
  const [dataEmprestimo, setDataEmprestimo] = useState('');
  const [dataDevolucao, setDataDevolucao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Default dates: today and +14 days
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const dueStr = dueDate.toISOString().slice(0, 10);

    setDataEmprestimo(todayStr);
    setDataDevolucao(dueStr);

    if (preselectedBook) {
      setSelectedBookId(preselectedBook.id);
    } else if (availableBooks.length > 0) {
      setSelectedBookId(availableBooks[0].id);
    }

    if (readers.length > 0) {
      setSelectedReaderId(readers[0].id);
    }
    setObservacoes('');
    setErrorMsg('');
  }, [isOpen, preselectedBook, availableBooks, readers]);

  if (!isOpen) return null;

  const currentBook = availableBooks.find(b => b.id === selectedBookId) || preselectedBook;
  const currentReader = readers.find(r => r.id === selectedReaderId);

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBook) {
      setErrorMsg('Selecione um livro disponível para empréstimo.');
      return;
    }
    if (!currentReader) {
      setErrorMsg('Selecione um leitor cadastrado.');
      return;
    }
    if (!dataDevolucao) {
      setErrorMsg('A data de devolução prevista é obrigatória.');
      return;
    }

    const turmaDesc = currentReader.categoria === 'aluno'
      ? `${currentReader.serie || ''} ${currentReader.turma || ''} (${currentReader.turno || ''})`.trim()
      : undefined;

    onConfirmLoan({
      livroId: currentBook.id,
      livroTitulo: currentBook.titulo,
      livroTombo: currentBook.tombo,
      leitorId: currentReader.id,
      leitorNome: currentReader.nome,
      leitorCategoria: currentReader.categoria,
      leitorTurma: turmaDesc,
      dataEmprestimo,
      dataDevolucaoPrevista: dataDevolucao,
      bibliotecariaResponsavel: activeAssistantName,
      observacoes: observacoes.trim() || undefined,
    });

    onClose();
  };

  const handleCorrigir = () => {
    const today = new Date();
    setDataEmprestimo(today.toISOString().slice(0, 10));
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    setDataDevolucao(dueDate.toISOString().slice(0, 10));
    setObservacoes('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-blue-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold tracking-tight">
              Registrar Novo Empréstimo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirmar} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Livro selecionado */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Livro do Acervo (Tombo / Título / Estante):
            </label>
            {preselectedBook ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-blue-900 text-xs">
                    [{preselectedBook.tombo}]
                  </span>{' '}
                  <strong className="text-slate-900">{preselectedBook.titulo}</strong>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {preselectedBook.autor} · Estante {preselectedBook.estante}
                  </div>
                </div>
              </div>
            ) : (
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    [{b.tombo}] {b.titulo} - {b.autor} (Estante {b.estante})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Leitor */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Leitor / Aluno Solicitante:
            </label>
            <select
              value={selectedReaderId}
              onChange={(e) => setSelectedReaderId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {readers.map(r => (
                <option key={r.id} value={r.id}>
                  {r.nome} ({r.categoria.toUpperCase()}
                  {r.categoria === 'aluno' ? ` - ${r.serie || ''} ${r.turma || ''} - ${r.turno || ''}` : ''})
                </option>
              ))}
            </select>
            {currentReader && (
              <div className="mt-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Contato: {currentReader.telefone || currentReader.email || 'Não informado'}</span>
                {currentReader.matricula && <span>Matrícula: {currentReader.matricula}</span>}
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data do Empréstimo:
              </label>
              <input
                type="date"
                value={dataEmprestimo}
                onChange={(e) => setDataEmprestimo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data Prevista de Devolução:
              </label>
              <input
                type="date"
                value={dataDevolucao}
                onChange={(e) => setDataDevolucao(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Bibliotecária Responsável pelo Registro:
            </label>
            <input
              type="text"
              value={activeAssistantName}
              readOnly
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Observações:
            </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Trabalho de literatura em grupo, prazo estendido especial..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Standardized Components: [Confirmar, Voltar, Cancelar, Corrigir] */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
                title="Voltar ao catálogo"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleCorrigir}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
                title="Restaurar valores padrão"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Corrigir</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors text-xs font-semibold cursor-pointer"
                title="Cancelar empréstimo"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-lg transition-colors font-semibold text-xs shadow-sm shadow-blue-700/20 cursor-pointer"
                title="Confirmar empréstimo"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
