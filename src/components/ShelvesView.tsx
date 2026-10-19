import React, { useState, useMemo } from 'react';
import { Layers, BookOpen, CheckCircle2, XCircle, ArrowRightLeft, ArrowDownToLine } from 'lucide-react';
import { Book } from '../types/library';

interface ShelvesViewProps {
  books: Book[];
  onOpenLoanForBook: (book: Book) => void;
  onReturnBookDirect: (bookId: string) => void;
}

export const ShelvesView: React.FC<ShelvesViewProps> = ({
  books,
  onOpenLoanForBook,
  onReturnBookDirect,
}) => {
  const [activeShelf, setActiveShelf] = useState<string>('all');
  const [shelfSearch, setShelfSearch] = useState('');

  // Extract unique shelves
  const shelves = useMemo(() => {
    return Array.from(new Set(books.map(b => b.estante))).filter(Boolean).sort();
  }, [books]);

  // Group books by shelf, sorted alphabetically by title
  const shelfData = useMemo(() => {
    const map: Record<string, Book[]> = {};
    shelves.forEach(s => {
      map[s] = [];
    });

    books.forEach(b => {
      const shelfKey = b.estante || 'Outras';
      if (!map[shelfKey]) map[shelfKey] = [];
      map[shelfKey].push(b);
    });

    // Sort each shelf's books alphabetically by title
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => a.titulo.localeCompare(b.titulo));
    });

    return map;
  }, [books, shelves]);

  const displayedShelves = activeShelf === 'all' ? shelves : [activeShelf];

  return (
    <div className="space-y-4">
      {/* Shelf Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Organização por Estante (Ordem Alfabética)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Acervo segmentado fisicamente por estantes (A-1, A-2, A-3) e ordenado alfabeticamente pelo título da obra.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shelfSearch}
              onChange={(e) => setShelfSearch(e.target.value)}
              placeholder="Filtrar nesta estante..."
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Shelf Tabs */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveShelf('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeShelf === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Todas as Estantes ({books.length})
          </button>

          {shelves.map(s => {
            const count = (shelfData[s] || []).length;
            const avail = (shelfData[s] || []).filter(b => b.disponivel === 'Sim').length;

            return (
              <button
                key={s}
                onClick={() => setActiveShelf(s)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeShelf === s
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Estante {s}</span>
                <span className={`ml-1.5 text-[10px] font-mono ${activeShelf === s ? 'text-blue-200' : 'text-slate-400'}`}>
                  ({avail}/{count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shelves Content */}
      <div className="space-y-6">
        {displayedShelves.map(shelfKey => {
          let list = shelfData[shelfKey] || [];
          if (shelfSearch.trim()) {
            const q = shelfSearch.toLowerCase();
            list = list.filter(b => b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.tombo.includes(q));
          }

          const totalShelf = (shelfData[shelfKey] || []).length;
          const availShelf = (shelfData[shelfKey] || []).filter(b => b.disponivel === 'Sim').length;
          const borrowedShelf = totalShelf - availShelf;

          return (
            <div key={shelfKey} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              {/* Shelf Banner */}
              <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-xs tracking-tight text-white font-mono">
                    {shelfKey}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">
                      Estante {shelfKey} — Obras em Ordem Alfabética (A-Z)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Localização física na Biblioteca Valdiva Colaço
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-300">Total: <strong>{totalShelf}</strong></span>
                  <span className="text-emerald-400">Disp: <strong>{availShelf}</strong></span>
                  <span className="text-orange-400">Emp: <strong>{borrowedShelf}</strong></span>
                </div>
              </div>

              {/* Shelf Book List */}
              {list.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Nenhuma obra localizada para o filtro nesta estante.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {list.map((book, idx) => {
                    const isAvailable = book.disponivel === 'Sim';

                    return (
                      <div
                        key={book.id}
                        className="p-3.5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="w-12 shrink-0 font-mono text-[11px] font-bold text-slate-400 pt-0.5">
                            #{book.tombo}
                          </span>

                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">
                              {book.titulo}
                            </h4>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="text-slate-700">{book.autor}</span>
                              <span aria-hidden="true">·</span>
                              <span>{book.genero}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{book.ano}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Disponível</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700">
                              <XCircle className="w-3.5 h-3.5 text-orange-600" />
                              <span>Emprestado</span>
                            </span>
                          )}

                          {isAvailable ? (
                            <button
                              onClick={() => onOpenLoanForBook(book)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors cursor-pointer"
                            >
                              Emprestar
                            </button>
                          ) : (
                            <button
                              onClick={() => onReturnBookDirect(book.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors cursor-pointer"
                            >
                              Devolver
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
