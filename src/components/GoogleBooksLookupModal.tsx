import React, { useState } from 'react';
import { Search, Globe, Plus, Check, X, ArrowLeft, RotateCcw, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import { Book, BookGenre } from '../types/library';

interface GoogleBooksLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBook: (bookData: { titulo: string; autor: string; ano: number; genero: BookGenre; sinopse?: string }) => void;
}

interface VolumeItem {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    publisher?: string;
  };
}

export const GoogleBooksLookupModal: React.FC<GoogleBooksLookupModalProps> = ({
  isOpen,
  onClose,
  onImportBook,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VolumeItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    try {
      // Query Google Books API securely without requiring client secrets
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=pt`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Erro na API de Livros (${res.status})`);
      }
      const data = await res.json();
      setResults(data.items || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao conectar com a API de Livros.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (item: VolumeItem) => {
    const info = item.volumeInfo;
    const year = info.publishedDate ? parseInt(info.publishedDate.substring(0, 4), 10) || 2026 : 2026;
    const author = info.authors ? info.authors.join(', ') : 'Autor Desconhecido';
    const title = info.title || 'Título sem nome';

    let cat: BookGenre = 'Infantojuvenil';
    if (info.categories && info.categories.length > 0) {
      const c = info.categories.join(' ').toLowerCase();
      if (c.includes('poe') || c.includes('verse')) cat = 'Poesia e Cordel';
      else if (c.includes('tale') || c.includes('fable') || c.includes('conto')) cat = 'Contos e Fábulas';
      else if (c.includes('bio') || c.includes('memor')) cat = 'Biografia e Memórias';
      else if (c.includes('fic') || c.includes('novel')) cat = 'Literatura Brasileira';
    }

    onImportBook({
      titulo: title,
      autor: author,
      ano: year,
      genero: cat,
      sinopse: info.description ? info.description.substring(0, 280) + '...' : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Integração API de Livros (Google Books)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pesquise títulos oficiais para enriquecer dados e cadastrar no acervo da escola
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o título, autor ou ISBN (Ex: Malala, Ana Maria Machado, O Pequeno Príncipe)..."
                className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Pesquisar API</span>
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {loading && (
            <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span>Consultando acervo global da API Google Books...</span>
            </div>
          )}

          {!loading && searched && results.length === 0 && !errorMsg && (
            <div className="py-12 text-center text-xs text-slate-500">
              Nenhuma obra localizada para este termo na API. Tente buscar pelo nome exato do autor ou obra.
            </div>
          )}

          {!loading && results.map((item) => {
            const info = item.volumeInfo;
            const author = info.authors ? info.authors.join(', ') : 'Autor Desconhecido';
            const year = info.publishedDate ? info.publishedDate.substring(0, 4) : 'Ano não informado';

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 transition-all flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-14 bg-slate-100 rounded border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 leading-snug">
                      {info.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      {author} · {year} {info.publisher ? `· ${info.publisher}` : ''}
                    </p>
                    {info.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {info.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectBook(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                  title="Importar dados deste livro para o cadastro oficial da Biblioteca Valdiva Colaço"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Importar</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer with Standardized Buttons */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
            <button
              onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
              className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Corrigir</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
