import React from 'react';
import { BookOpen, CheckCircle2, Clock, AlertTriangle, Users, Layers } from 'lucide-react';
import { Book, Loan, Reader } from '../types/library';

interface HeroStatsProps {
  books: Book[];
  loans: Loan[];
  readers: Reader[];
  onFilterStatus: (status: 'all' | 'disponivel' | 'emprestado' | 'atrasado') => void;
  activeFilter: string;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  books,
  loans,
  readers,
  onFilterStatus,
  activeFilter,
}) => {
  const total = books.length;
  const disponiveis = books.filter(b => b.disponivel === 'Sim').length;
  const emprestados = total - disponiveis;
  const atrasados = loans.filter(l => l.status === 'atrasado').length;

  const shelves = Array.from(new Set(books.map(b => b.estante))).sort();

  return (
    <div className="mb-6">
      {/* Overdue alert strip if any delayed loans */}
      {atrasados > 0 && (
        <div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-900">
                Atenção: {atrasados} leitor{atrasados > 1 ? 'es' : ''} com prazo de devolução vencido
              </p>
              <p className="text-[11px] text-orange-700">
                Acesse a aba de Empréstimos para disparar avisos de notificação aos alunos e leitores.
              </p>
            </div>
          </div>
          <button
            onClick={() => onFilterStatus('atrasado')}
            className="text-xs font-semibold text-orange-700 hover:text-orange-900 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ver atrasados &rarr;
          </button>
        </div>
      )}

      {/* Grid of clean metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Total Acervo */}
        <button
          onClick={() => onFilterStatus('all')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold tracking-wide uppercase ${activeFilter === 'all' ? 'text-blue-200' : 'text-slate-500'}`}>
              Total Acervo
            </span>
            <BookOpen className={`w-4 h-4 ${activeFilter === 'all' ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums leading-none mb-1">
            {total}
          </p>
          <span className={`text-[10px] ${activeFilter === 'all' ? 'text-blue-200' : 'text-slate-400'}`}>
            Títulos catalogados
          </span>
        </button>

        {/* Livros Disponíveis */}
        <button
          onClick={() => onFilterStatus('disponivel')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'disponivel'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold tracking-wide uppercase ${activeFilter === 'disponivel' ? 'text-emerald-200' : 'text-slate-500'}`}>
              Disponíveis
            </span>
            <CheckCircle2 className={`w-4 h-4 ${activeFilter === 'disponivel' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums leading-none mb-1 text-emerald-600 dark:text-emerald-400">
            {disponiveis}
          </p>
          <span className={`text-[10px] ${activeFilter === 'disponivel' ? 'text-emerald-200' : 'text-slate-400'}`}>
            Prontos na estante
          </span>
        </button>

        {/* Livros Emprestados */}
        <button
          onClick={() => onFilterStatus('emprestado')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'emprestado'
              ? 'bg-blue-800 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold tracking-wide uppercase ${activeFilter === 'emprestado' ? 'text-blue-200' : 'text-slate-500'}`}>
              Emprestados
            </span>
            <Clock className={`w-4 h-4 ${activeFilter === 'emprestado' ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums leading-none mb-1 text-blue-600">
            {emprestados}
          </p>
          <span className={`text-[10px] ${activeFilter === 'emprestado' ? 'text-blue-200' : 'text-slate-400'}`}>
            Circulando na escola
          </span>
        </button>

        {/* Leitores Cadastrados */}
        <div className="p-3.5 rounded-xl border bg-white text-slate-800 border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
              Leitores Ativos
            </span>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums leading-none mb-1 text-slate-900">
            {readers.length}
          </p>
          <span className="text-[10px] text-slate-400">
            Alunos e Professores
          </span>
        </div>

        {/* Estantes */}
        <div className="p-3.5 rounded-xl border bg-white text-slate-800 border-slate-200 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
              Estantes
            </span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-sm font-bold text-slate-900 leading-none mb-1">
            {shelves.join(', ') || 'A-1, A-2, A-3'}
          </p>
          <span className="text-[10px] text-slate-400">
            Organização alfabética
          </span>
        </div>
      </div>
    </div>
  );
};
