import React, { useState, useEffect } from 'react';
import { Book, Reader, Loan, Assistant } from './types/library';
import { INITIAL_BOOKS } from './data/initialBooks';
import { INITIAL_READERS, INITIAL_ASSISTANTS, INITIAL_LOANS } from './data/initialUsers';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { BookCatalog } from './components/BookCatalog';
import { ShelvesView } from './components/ShelvesView';
import { LoansManager } from './components/LoansManager';
import { ReadersManager } from './components/ReadersManager';
import { LibrariansManager } from './components/LibrariansManager';
import { PythonCourseView } from './components/PythonCourseView';
import { BookModal } from './components/BookModal';
import { LoanModal } from './components/LoanModal';
import { GoogleBooksLookupModal } from './components/GoogleBooksLookupModal';
import { DataExportsModal } from './components/DataExportsModal';
import { DocsModal } from './components/DocsModal';

const STORAGE_KEYS = {
  BOOKS: 'valdiva_colaco_books_v1',
  READERS: 'valdiva_colaco_readers_v1',
  ASSISTANTS: 'valdiva_colaco_assistants_v1',
  LOANS: 'valdiva_colaco_loans_v1',
  ACTIVE_ASSISTANT: 'valdiva_colaco_active_ast_v1',
};

export default function App() {
  // Main State with LocalStorage persistence
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BOOKS;
  });

  const [readers, setReaders] = useState<Reader[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.READERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_READERS;
  });

  const [assistants, setAssistants] = useState<Assistant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSISTANTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ASSISTANTS;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LOANS;
  });

  const [activeAssistantId, setActiveAssistantId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ASSISTANT);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'ast-1'; // Ada Melo
  });

  // Navigation and Filters
  const [currentTab, setCurrentTab] = useState<string>('acervo');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanPreselectedBook, setLoanPreselectedBook] = useState<Book | null>(null);

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isExportsModalOpen, setIsExportsModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.READERS, JSON.stringify(readers));
  }, [readers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSISTANTS, JSON.stringify(assistants));
  }, [assistants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ASSISTANT, activeAssistantId);
  }, [activeAssistantId]);

  const activeAssistant = assistants.find(a => a.id === activeAssistantId) || assistants[0];

  // Calculate overdue loans
  const today = new Date('2026-10-19T00:00:00');
  const overdueCount = loans.filter(l => {
    if (l.status === 'devolvido') return false;
    const due = new Date(l.dataDevolucaoPrevista + 'T00:00:00');
    return today.getTime() > due.getTime();
  }).length;

  // Book actions
  const handleOpenNewBook = () => {
    setBookToEdit(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    setBookToEdit(book);
    setIsBookModalOpen(true);
  };

  const handleSaveBook = (bookData: Omit<Book, 'id' | 'dataCadastro'> & { id?: string }) => {
    if (bookData.id) {
      // Edit
      setBooks(prev =>
        prev.map(b => (b.id === bookData.id ? { ...b, ...bookData } : b))
      );
    } else {
      // New
      const newBook: Book = {
        ...bookData,
        id: `book-${Date.now()}`,
        dataCadastro: new Date().toISOString().slice(0, 10),
      };
      setBooks(prev => [newBook, ...prev]);
    }
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    // Also remove from active loans if needed
    setLoans(prev => prev.filter(l => l.livroId !== id));
  };

  // Direct return
  const handleReturnBookDirect = (bookId: string) => {
    // Set book available
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, disponivel: 'Sim' } : b))
    );
    // Mark loan as returned
    setLoans(prev =>
      prev.map(l =>
        l.livroId === bookId && l.status !== 'devolvido'
          ? { ...l, status: 'devolvido', dataDevolucaoReal: new Date().toISOString().slice(0, 10) }
          : l
      )
    );
  };

  // Loan registration
  const handleOpenLoanForBook = (book: Book) => {
    setLoanPreselectedBook(book);
    setIsLoanModalOpen(true);
  };

  const handleOpenGenericLoan = () => {
    setLoanPreselectedBook(null);
    setIsLoanModalOpen(true);
  };

  const handleConfirmLoan = (
    loanData: Omit<Loan, 'id' | 'status' | 'notificacoesEnviadas'>
  ) => {
    const newLoan: Loan = {
      ...loanData,
      id: `loan-${Date.now()}`,
      status: 'ativo',
      notificacoesEnviadas: 0,
    };

    setLoans(prev => [newLoan, ...prev]);

    // Mark book as borrowed
    setBooks(prev =>
      prev.map(b => (b.id === loanData.livroId ? { ...b, disponivel: 'Não' } : b))
    );
  };

  const handleReturnFromLoans = (loanId: string) => {
    const targetLoan = loans.find(l => l.id === loanId);
    if (!targetLoan) return;

    setLoans(prev =>
      prev.map(l =>
        l.id === loanId
          ? { ...l, status: 'devolvido', dataDevolucaoReal: new Date().toISOString().slice(0, 10) }
          : l
      )
    );

    setBooks(prev =>
      prev.map(b => (b.id === targetLoan.livroId ? { ...b, disponivel: 'Sim' } : b))
    );
  };

  const handleSendNotification = (loanId: string, message: string) => {
    setLoans(prev =>
      prev.map(l =>
        l.id === loanId
          ? { ...l, notificacoesEnviadas: (l.notificacoesEnviadas || 0) + 1 }
          : l
      )
    );
    alert(`Notificação enviada com sucesso para o leitor via sistema da escola!\n\n${message}`);
  };

  // Reader actions
  const handleAddReader = (readerData: Omit<Reader, 'id' | 'dataCadastro'>) => {
    const newReader: Reader = {
      ...readerData,
      id: `usr-${Date.now()}`,
      dataCadastro: new Date().toISOString().slice(0, 10),
    };
    setReaders(prev => [newReader, ...prev]);
  };

  const handleUpdateReader = (updatedReader: Reader) => {
    setReaders(prev => prev.map(r => (r.id === updatedReader.id ? updatedReader : r)));
  };

  const handleDeleteReader = (id: string) => {
    setReaders(prev => prev.filter(r => r.id !== id));
  };

  // Assistant actions
  const handleAddAssistant = (astData: Omit<Assistant, 'id'>) => {
    const newAst: Assistant = {
      ...astData,
      id: `ast-${Date.now()}`,
    };
    setAssistants(prev => [...prev, newAst]);
  };

  const handleDeleteAssistant = (id: string) => {
    setAssistants(prev => prev.filter(a => a.id !== id));
    if (activeAssistantId === id) {
      setActiveAssistantId('ast-1'); // fallback to Ada Melo
    }
  };

  // Import from backup
  const handleImportBackup = (imported: {
    acervo?: Book[];
    leitores?: Reader[];
    emprestimos?: Loan[];
  }) => {
    if (imported.acervo && Array.isArray(imported.acervo)) {
      setBooks(imported.acervo);
    }
    if (imported.leitores && Array.isArray(imported.leitores)) {
      setReaders(imported.leitores);
    }
    if (imported.emprestimos && Array.isArray(imported.emprestimos)) {
      setLoans(imported.emprestimos);
    }
  };

  // Next suggested tombo
  const nextTomboNumber = books.length > 0
    ? String(Math.max(...books.map(b => parseInt(b.tombo, 10) || 0)) + 1).padStart(4, '0')
    : '0167';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 3-Zone Institutional Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        assistants={assistants}
        activeAssistantId={activeAssistantId}
        setActiveAssistantId={setActiveAssistantId}
        onOpenNewBook={handleOpenNewBook}
        onOpenExportModal={() => setIsExportsModalOpen(true)}
        onOpenDocsModal={() => setIsDocsModalOpen(true)}
        overdueCount={overdueCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Metric Summary Strips */}
        <HeroStats
          books={books}
          loans={loans}
          readers={readers}
          activeFilter={statusFilter}
          onFilterStatus={(st) => {
            if (st === 'atrasado') {
              setCurrentTab('emprestimos');
            } else {
              setStatusFilter(st);
              setCurrentTab('acervo');
            }
          }}
        />

        {/* Tab 1: Acervo Geral */}
        {currentTab === 'acervo' && (
          <BookCatalog
            books={books}
            onOpenEditBook={handleOpenEditBook}
            onDeleteBook={handleDeleteBook}
            onOpenLoanForBook={handleOpenLoanForBook}
            onReturnBookDirect={handleReturnBookDirect}
            onOpenGoogleLookup={() => setIsGoogleModalOpen(true)}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}

        {/* Tab 2: Estantes A-Z */}
        {currentTab === 'estantes' && (
          <ShelvesView
            books={books}
            onOpenLoanForBook={handleOpenLoanForBook}
            onReturnBookDirect={handleReturnBookDirect}
          />
        )}

        {/* Tab 3: Empréstimos & Devoluções */}
        {currentTab === 'emprestimos' && (
          <LoansManager
            loans={loans}
            books={books}
            readers={readers}
            activeAssistantName={activeAssistant.nome}
            onReturnBook={handleReturnFromLoans}
            onSendNotification={handleSendNotification}
            onOpenNewLoan={handleOpenGenericLoan}
          />
        )}

        {/* Tab 4: Leitores (Alunos, Professores, Servidores, Comunidade) */}
        {currentTab === 'leitores' && (
          <ReadersManager
            readers={readers}
            onAddReader={handleAddReader}
            onUpdateReader={handleUpdateReader}
            onDeleteReader={handleDeleteReader}
          />
        )}

        {/* Tab 5: Equipe Ada Melo (Assistentes e Bibliotecárias) */}
        {currentTab === 'assistentes' && (
          <LibrariansManager
            assistants={assistants}
            activeAssistantId={activeAssistantId}
            onSetActiveAssistant={setActiveAssistantId}
            onAddAssistant={handleAddAssistant}
            onDeleteAssistant={handleDeleteAssistant}
          />
        )}

        {/* Tab 6: Código Python & API Django */}
        {currentTab === 'python-curso' && <PythonCourseView />}
      </main>

      {/* Institutional School Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800">
              EMEF Desembargador Pedro de Queiroz — Biblioteca Valdiva Colaço
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Projeto de Conclusão: Xenia Cardoso (2026) · Coordenação: Bibliotecária Ada Melo
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Documentos (PRD, Arq, Design, Tarefas)
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setCurrentTab('python-curso')}
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors cursor-pointer"
            >
              Terminal Python CLI
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setIsExportsModalOpen(true)}
              className="text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Exportações & Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Book Add/Edit Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        bookToEdit={bookToEdit}
        onClose={() => setIsBookModalOpen(false)}
        onSaveBook={handleSaveBook}
        nextSuggestedTombo={nextTomboNumber}
      />

      {/* Loan Modal */}
      <LoanModal
        isOpen={isLoanModalOpen}
        preselectedBook={loanPreselectedBook}
        availableBooks={books.filter(b => b.disponivel === 'Sim')}
        readers={readers}
        activeAssistantName={activeAssistant.nome}
        onClose={() => setIsLoanModalOpen(false)}
        onConfirmLoan={handleConfirmLoan}
      />

      {/* Google Books Lookup Modal */}
      <GoogleBooksLookupModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onImportBook={(importedData) => {
          handleSaveBook({
            tombo: nextTomboNumber,
            titulo: importedData.titulo,
            autor: importedData.autor,
            estante: 'A-1',
            genero: importedData.genero,
            ano: importedData.ano,
            disponivel: 'Sim',
            sinopse: importedData.sinopse,
          });
          setCurrentTab('acervo');
        }}
      />

      {/* Data Exports and Backup Modal */}
      <DataExportsModal
        isOpen={isExportsModalOpen}
        onClose={() => setIsExportsModalOpen(false)}
        books={books}
        readers={readers}
        loans={loans}
        activeAssistantName={activeAssistant.nome}
        onImportBackup={handleImportBackup}
      />

      {/* Documentation Modal */}
      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
}
