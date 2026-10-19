import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, BookOpen, Layers, Edit3, Trash2, ArrowRightLeft, Globe, CheckCircle2, XCircle, Grid, List } from 'lucide-react';
import { Book, BookGenre } from '../types/library';

interface BookCatalogProps {
  books: Book[];
  onOpenEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onOpenLoanForBook: (book: Book) => void;
  onReturnBookDirect: (bookId: string) => void;
  onOpenGoogleLookup: (book?: Book) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  onOpenEditBook,
  onDeleteBook,
  onOpenLoanForBook,
  onReturnBookDirect,
  onOpenGoogleLookup,
  statusFilter,
  setStatusFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShelf, setSelectedShelf] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'tombo' | 'titulo' | 'autor' | 'ano' | 'estante'>('tombo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Extract unique shelves and genres
  const shelves = useMemo(() => {
    const s = Array.from(new Set(books.map(b => b.estante))).filter(Boolean).sort();
    return s;
  }, [books]);

  const genres = useMemo(() => {
    const g = Array.from(new Set(books.map(b => b.genero))).filter(Boolean).sort();
    return g;
  }, [books]);

  // Filter and sort
  const filteredBooks = useMemo(() => {
    return books
      .filter(b => {
        // Status filter
        if (statusFilter === 'disponivel' && b.disponivel !== 'Sim') return false;
        if (statusFilter === 'emprestado' && b.disponivel !== 'Não') return false;

        // Shelf filter
        if (selectedShelf !== 'all' && b.estante !== selectedShelf) return false;

        // Genre filter
        if (selectedGenre !== 'all' && b.genero !== selectedGenre) return false;

        // Search term (title, author, tombo)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = b.titulo.toLowerCase().includes(q);
          const matchAuthor = b.autor.toLowerCase().includes(q);
          const matchTombo = b.tombo.toLowerCase().includes(q);
          const matchShelf = b.estante.toLowerCase().includes(q);
          return matchTitle || matchAuthor || matchTombo || matchShelf;
        }

        return true;
      })
      .sort((a, b) => {
        let compare = 0;
        if (sortBy === 'tombo') {
          compare = a.tombo.localeCompare(b.tombo, undefined, { numeric: true });
        } else if (sortBy === 'titulo') {
          compare = a.titulo.localeCompare(b.titulo);
        } else if (sortBy === 'autor') {
          compare = a.autor.localeCompare(b.autor);
        } else if (sortBy === 'ano') {
          compare = a.ano - b.ano;
        } else if (sortBy === 'estante') {
          compare = a.estante.localeCompare(b.estante);
        }
        return sortOrder === 'asc' ? compare : -compare;
      });
  }, [books, searchTerm, selectedShelf, selectedGenre, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, page, pageSize]);

  const handleSort = (field: 'tombo' | 'titulo' | 'autor' | 'ano' | 'estante') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Buscar por título, autor, nº de tombo (ex: 0001)..."
              className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Quick Action: Search external Google Books */}
          <button
            onClick={() => onOpenGoogleLookup()}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors border border-blue-200/80 whitespace-nowrap cursor-pointer"
            title="Consultar API Google Books para obter metadados oficiais"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Consultar Google Books API</span>
          </button>

          {/* Toggle view mode */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Visualização em Grade de Livros"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
          {/* Estante Filter */}
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">Estante:</span>
            <select
              value={selectedShelf}
              onChange={(e) => { setSelectedShelf(e.target.value); setPage(1); }}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todas as Estantes</option>
              {shelves.map(s => (
                <option key={s} value={s}>Estante {s}</option>
              ))}
            </select>
          </div>

          {/* Gênero Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">Gênero:</span>
            <select
              value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todos os Gêneros</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Disponibilidade Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="disponivel">Disponíveis na Estante</option>
              <option value="emprestado">Emprestados</option>
            </select>
          </div>

          {/* Result Count and Active Filters Reset */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-slate-500 text-[11px] tabular-nums font-mono">
              Mostrando {filteredBooks.length} de {books.length} livros
            </span>
            {(searchTerm || selectedShelf !== 'all' || selectedGenre !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedShelf('all');
                  setSelectedGenre('all');
                  setStatusFilter('all');
                  setPage(1);
                }}
                className="text-[11px] text-orange-600 hover:text-orange-700 underline font-medium cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Nenhum livro encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Verifique o termo de busca ou redefina os filtros de estante e gênero para localizar outros títulos do acervo.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3.5 w-16">
                  <button
                    onClick={() => handleSort('tombo')}
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Nº</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3.5">
                  <button
                    onClick={() => handleSort('titulo')}
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Título da Obra</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3.5">
                  <button
                    onClick={() => handleSort('autor')}
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Autor</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3.5 w-24">
                  <button
                    onClick={() => handleSort('estante')}
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Estante</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3.5">Gênero</th>
                <th className="py-2.5 px-3.5 w-20">
                  <button
                    onClick={() => handleSort('ano')}
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Ano</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3.5 w-28">Status</th>
                <th className="py-2.5 px-3.5 text-right w-44">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBooks.map((book) => {
                const isAvailable = book.disponivel === 'Sim';

                return (
                  <tr key={book.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-2.5 px-3.5 font-mono text-slate-500 font-semibold tabular-nums">
                      {book.tombo}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {book.titulo}
                      </div>
                      {book.sinopse && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{book.sinopse}</p>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700">
                      {book.autor}
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px] border border-slate-200">
                        {book.estante}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">
                      {book.genero}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-500 font-mono tabular-nums">
                      {book.ano}
                    </td>
                    <td className="py-2.5 px-3.5">
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
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isAvailable ? (
                          <button
                            onClick={() => onOpenLoanForBook(book)}
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors cursor-pointer"
                            title="Registrar Empréstimo deste livro"
                          >
                            Emprestar
                          </button>
                        ) : (
                          <button
                            onClick={() => onReturnBookDirect(book.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors cursor-pointer"
                            title="Registrar Devolução imediata"
                          >
                            Devolver
                          </button>
                        )}

                        <button
                          onClick={() => onOpenEditBook(book)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                          title="Editar cadastro do livro"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o livro "${book.titulo}" (${book.tombo}) do acervo?`)) {
                              onDeleteBook(book.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Excluir livro do acervo"
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
      ) : (
        /* Cards View */
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {paginatedBooks.map((book) => {
            const isAvailable = book.disponivel === 'Sim';

            return (
              <div
                key={book.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
                    <span className="font-bold text-slate-700">Nº {book.tombo}</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                      Estante {book.estante}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 mb-1">
                    {book.titulo}
                  </h4>

                  <p className="text-[11px] text-slate-600 mb-2">
                    {book.autor}
                  </p>

                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mb-3">
                    <span>{book.genero}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{book.ano}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {isAvailable ? (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Disponível</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-orange-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>Emprestado</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    {isAvailable ? (
                      <button
                        onClick={() => onOpenLoanForBook(book)}
                        className="px-2 py-0.5 text-[10px] font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded cursor-pointer"
                      >
                        Emprestar
                      </button>
                    ) : (
                      <button
                        onClick={() => onReturnBookDirect(book.id)}
                        className="px-2 py-0.5 text-[10px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 cursor-pointer"
                      >
                        Devolver
                      </button>
                    )}
                    <button
                      onClick={() => onOpenEditBook(book)}
                      className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
          <span className="text-[11px] text-slate-500 font-mono">
            Página {page} de {totalPages} ({filteredBooks.length} registros)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer text-xs"
            >
              Anterior
            </button>

            {/* Quick page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 5 && page > 3) {
                pageNum = page - 2 + idx;
                if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-semibold cursor-pointer ${
                    page === pageNum
                      ? 'bg-blue-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer text-xs"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
