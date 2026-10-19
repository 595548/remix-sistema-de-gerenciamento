import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, ArrowLeft, AlertCircle, BookmarkPlus } from 'lucide-react';
import { Book, BookGenre } from '../types/library';

interface BookModalProps {
  isOpen: boolean;
  bookToEdit?: Book | null;
  onClose: () => void;
  onSaveBook: (bookData: Omit<Book, 'id' | 'dataCadastro'> & { id?: string }) => void;
  nextSuggestedTombo: string;
}

const GENRES: BookGenre[] = [
  'Infantojuvenil',
  'Contos e Fábulas',
  'Poesia e Cordel',
  'Aventura e Clássicos',
  'Literatura Brasileira',
  'Biografia e Memórias',
  'Crônicas e Humor',
  'Teatro e Drama',
  'Outros',
];

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  bookToEdit,
  onClose,
  onSaveBook,
  nextSuggestedTombo,
}) => {
  const [tombo, setTombo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [estante, setEstante] = useState('A-1');
  const [genero, setGenero] = useState<BookGenre>('Infantojuvenil');
  const [ano, setAno] = useState<number>(2026);
  const [disponivel, setDisponivel] = useState<'Sim' | 'Não'>('Sim');
  const [sinopse, setSinopse] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Initial populate or reset
  useEffect(() => {
    if (bookToEdit) {
      setTombo(bookToEdit.tombo);
      setTitulo(bookToEdit.titulo);
      setAutor(bookToEdit.autor);
      setEstante(bookToEdit.estante);
      setGenero(bookToEdit.genero);
      setAno(bookToEdit.ano);
      setDisponivel(bookToEdit.disponivel);
      setSinopse(bookToEdit.sinopse || '');
    } else {
      setTombo(nextSuggestedTombo);
      setTitulo('');
      setAutor('');
      setEstante('A-1');
      setGenero('Infantojuvenil');
      setAno(2026);
      setDisponivel('Sim');
      setSinopse('');
    }
    setErrorMsg('');
  }, [bookToEdit, nextSuggestedTombo, isOpen]);

  if (!isOpen) return null;

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErrorMsg('O título da obra é obrigatório.');
      return;
    }
    if (!autor.trim()) {
      setErrorMsg('O autor da obra é obrigatório.');
      return;
    }
    if (!tombo.trim()) {
      setErrorMsg('O número de tombo é obrigatório.');
      return;
    }

    onSaveBook({
      id: bookToEdit ? bookToEdit.id : undefined,
      tombo: tombo.trim(),
      titulo: titulo.trim(),
      autor: autor.trim(),
      estante: estante.trim(),
      genero,
      ano: Number(ano) || 2026,
      disponivel,
      sinopse: sinopse.trim() || undefined,
    });
    onClose();
  };

  const handleCorrigir = () => {
    if (bookToEdit) {
      setTombo(bookToEdit.tombo);
      setTitulo(bookToEdit.titulo);
      setAutor(bookToEdit.autor);
      setEstante(bookToEdit.estante);
      setGenero(bookToEdit.genero);
      setAno(bookToEdit.ano);
      setDisponivel(bookToEdit.disponivel);
      setSinopse(bookToEdit.sinopse || '');
    } else {
      setTitulo('');
      setAutor('');
      setSinopse('');
    }
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookmarkPlus className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold tracking-tight">
              {bookToEdit ? 'Editar Livro no Acervo' : 'Cadastrar Novo Livro no Acervo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleConfirmar} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nº Tombo Oficial:
              </label>
              <input
                type="text"
                value={tombo}
                onChange={(e) => setTombo(e.target.value)}
                placeholder="Ex: 0167"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estante Física:
              </label>
              <select
                value={estante}
                onChange={(e) => setEstante(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="A-1">Estante A-1</option>
                <option value="A-2">Estante A-2</option>
                <option value="A-3">Estante A-3</option>
                <option value="B-1">Estante B-1</option>
                <option value="B-2">Estante B-2</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título da Obra: *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Histórias de Assombrar"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Autor / Autora: *
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Ex: Ana Maria Machado"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Gênero Literário:
              </label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value as BookGenre)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ano Edição:
              </label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Disponibilidade Inicial:
              </label>
              <select
                value={disponivel}
                onChange={(e) => setDisponivel(e.target.value as 'Sim' | 'Não')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Sim">Sim (Disponível na estante)</option>
                <option value="Não">Não (Emprestado)</option>
              </select>
            </div>

            <div>
              <span className="block text-[11px] text-slate-500 pt-3">
                EMEF Des. Pedro de Queiroz · Valdiva Colaço
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Observações / Sinopse Breve:
            </label>
            <textarea
              rows={2}
              value={sinopse}
              onChange={(e) => setSinopse(e.target.value)}
              placeholder="Notas sobre o estado do exemplar ou resumo da obra..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Standardized Component Buttons explicitly requested: [Confirmar], [Voltar], [Cancelar], [Corrigir] */}
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
                title="Limpar ou restaurar dados preenchidos"
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
                title="Cancelar operação"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg transition-colors font-semibold text-xs shadow-sm shadow-orange-600/20 cursor-pointer"
                title="Confirmar gravação no acervo"
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
