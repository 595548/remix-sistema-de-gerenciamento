import React from 'react';
import { BookOpen, UserCheck, Plus, Sparkles, Code2, FileText, ArrowDownToLine } from 'lucide-react';
import { Assistant } from '../types/library';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  assistants: Assistant[];
  activeAssistantId: string;
  setActiveAssistantId: (id: string) => void;
  onOpenNewBook: () => void;
  onOpenExportModal: () => void;
  onOpenDocsModal: () => void;
  overdueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  assistants,
  activeAssistantId,
  setActiveAssistantId,
  onOpenNewBook,
  onOpenExportModal,
  onOpenDocsModal,
  overdueCount,
}) => {
  const currentAssistant = assistants.find(a => a.id === activeAssistantId) || assistants[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top institutional strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-6 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-wide">EMEF Desembargador Pedro de Queiroz</span>
          <span className="text-slate-500">|</span>
          <span className="text-orange-400 font-medium">Biblioteca Valdiva Colaço</span>
          <span className="text-slate-500">|</span>
          <span>Projeto: Xenia Cardoso (2026)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400">Bibliotecária Responsável: <strong className="text-white font-medium">Ada Melo</strong></span>
          <button
            onClick={onOpenDocsModal}
            className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Documentação do Projeto: PRD, Arquitetura, Design, Tarefas"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documentos do Projeto (PRD / Arq)</span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <div className="flex items-center justify-between gap-8 px-6 py-3.5 max-w-7xl mx-auto">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <a
              href="#acervo"
              onClick={(e) => { e.preventDefault(); setCurrentTab('acervo'); }}
              className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap block leading-tight hover:text-blue-700 transition-colors"
            >
              Biblioteca Valdiva Colaço
            </a>
            <span className="text-[11px] text-slate-500 block leading-tight">
              Sistema de Cadastro e Acervo Escolar
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clear, uncluttered) */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setCurrentTab('acervo')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'acervo'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Acervo Geral
          </button>

          <button
            onClick={() => setCurrentTab('estantes')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'estantes'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Estantes A-Z
          </button>

          <button
            onClick={() => setCurrentTab('emprestimos')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 relative cursor-pointer ${
              currentTab === 'emprestimos'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <span>Empréstimos</span>
            {overdueCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-orange-600 text-white rounded-full">
                {overdueCount} atraso{overdueCount > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('leitores')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'leitores'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Leitores (Alunos & Servidores)
          </button>

          <button
            onClick={() => setCurrentTab('assistentes')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'assistentes'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Equipe Ada Melo
          </button>

          <button
            onClick={() => setCurrentTab('python-curso')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'python-curso'
                ? 'bg-orange-500 text-white font-bold shadow-sm shadow-orange-500/30'
                : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código Python & API</span>
          </button>
        </nav>

        {/* Zone 3: Operator & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active Operator Switcher */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-blue-700" />
            <span className="text-slate-500 text-[11px]">Operando como:</span>
            <select
              value={activeAssistantId}
              onChange={(e) => setActiveAssistantId(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              {assistants.map((ast) => (
                <option key={ast.id} value={ast.id}>
                  {ast.nome} {ast.isHeadLibrarian ? '(Coord.)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenExportModal}
            className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            title="Exportar PDF, CSV, Excel, XML e JSON"
          >
            <ArrowDownToLine className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNewBook}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-lg transition-colors shadow-sm shadow-orange-600/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Livro</span>
          </button>
        </div>
      </div>
    </header>
  );
};
