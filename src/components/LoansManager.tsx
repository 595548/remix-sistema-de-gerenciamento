import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Send, Search, Check, X, ArrowLeft, RotateCcw, MessageSquare, ArrowDownToLine } from 'lucide-react';
import { Loan, Book, Reader } from '../types/library';
import { exportLoansToCSV } from '../utils/exportUtils';

interface LoansManagerProps {
  loans: Loan[];
  books: Book[];
  readers: Reader[];
  activeAssistantName: string;
  onReturnBook: (loanId: string) => void;
  onSendNotification: (loanId: string, message: string) => void;
  onOpenNewLoan: () => void;
}

export const LoansManager: React.FC<LoansManagerProps> = ({
  loans,
  books,
  readers,
  activeAssistantName,
  onReturnBook,
  onSendNotification,
  onOpenNewLoan,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'ativo' | 'atrasado' | 'devolvido'>('all');
  const [search, setSearch] = useState('');
  const [notifyingLoan, setNotifyingLoan] = useState<Loan | null>(null);
  const [customNoticeText, setCustomNoticeText] = useState('');

  // Calculate days overdue based on today (2026-10-19)
  const today = new Date('2026-10-19T00:00:00');

  const processedLoans = useMemo(() => {
    return loans.map(loan => {
      if (loan.status === 'devolvido') {
        return { ...loan, diasAtraso: 0 };
      }
      const dueDate = new Date(loan.dataDevolucaoPrevista + 'T00:00:00');
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isLate = diffDays > 0;

      return {
        ...loan,
        status: isLate ? ('atrasado' as const) : ('ativo' as const),
        diasAtraso: isLate ? diffDays : 0,
      };
    });
  }, [loans, today]);

  const filteredLoans = useMemo(() => {
    return processedLoans.filter(l => {
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          l.leitorNome.toLowerCase().includes(q) ||
          l.livroTitulo.toLowerCase().includes(q) ||
          l.livroTombo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [processedLoans, filterStatus, search]);

  const counts = useMemo(() => {
    return {
      total: loans.length,
      ativos: processedLoans.filter(l => l.status === 'ativo').length,
      atrasados: processedLoans.filter(l => l.status === 'atrasado').length,
      devolvidos: processedLoans.filter(l => l.status === 'devolvido').length,
    };
  }, [loans, processedLoans]);

  const handleOpenNotice = (loan: Loan & { diasAtraso?: number }) => {
    const reader = readers.find(r => r.id === loan.leitorId);
    const dias = loan.diasAtraso || 1;
    const msg = `EMEF Desembargador Pedro de Queiroz - Biblioteca Valdiva Colaço\n` +
      `Prezado(a) ${loan.leitorNome} (${loan.leitorTurma || loan.leitorCategoria.toUpperCase()}),\n` +
      `Informamos que o empréstimo do livro "${loan.livroTitulo}" (Nº Tombo ${loan.livroTombo}) está vencido há ${dias} dia(s). Prazo era: ${new Date(loan.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}.\n` +
      `Por favor, compareça à biblioteca para regularização ou renovação com a bibliotecária Ada Melo / equipe.\n` +
      `Atenciosamente, Equipe da Biblioteca Valdiva Colaço.`;

    setCustomNoticeText(msg);
    setNotifyingLoan(loan);
  };

  const handleSendNotice = () => {
    if (notifyingLoan) {
      onSendNotification(notifyingLoan.id, customNoticeText);
      setNotifyingLoan(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner and Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Controle de Empréstimos e Devoluções
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestão de prazos, notificações de atraso e histórico de circulação da Biblioteca Valdiva Colaço.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportLoansToCSV(loans)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Exportar planilha de empréstimos em CSV/Excel"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onOpenNewLoan}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm shadow-blue-700/20 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Novo Empréstimo</span>
            </button>
          </div>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({counts.total})
            </button>

            <button
              onClick={() => setFilterStatus('atrasado')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterStatus === 'atrasado' ? 'bg-orange-600 text-white shadow-xs font-bold' : 'text-orange-700 hover:bg-orange-100/50'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Atrasados ({counts.atrasados})</span>
            </button>

            <button
              onClick={() => setFilterStatus('ativo')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterStatus === 'ativo' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ativos no Prazo ({counts.ativos})
            </button>

            <button
              onClick={() => setFilterStatus('devolvido')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterStatus === 'devolvido' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Devolvidos ({counts.devolvidos})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por leitor, título ou tombo..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {filteredLoans.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            Nenhum empréstimo encontrado no filtro selecionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-semibold tracking-wider">
                  <th className="py-2.5 px-4">Tombo / Livro</th>
                  <th className="py-2.5 px-4">Leitor / Aluno</th>
                  <th className="py-2.5 px-4">Data Empréstimo</th>
                  <th className="py-2.5 px-4">Prazo Devolução</th>
                  <th className="py-2.5 px-4">Status & Atraso</th>
                  <th className="py-2.5 px-4">Bibliotecária</th>
                  <th className="py-2.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map((loan) => {
                  const isReturned = loan.status === 'devolvido';
                  const isOverdue = loan.status === 'atrasado';

                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-500 font-semibold mr-1.5 tabular-nums">
                          [{loan.livroTombo}]
                        </span>
                        <strong className="text-slate-900">{loan.livroTitulo}</strong>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{loan.leitorNome}</div>
                        <div className="text-[11px] text-slate-500">
                          {loan.leitorTurma ? loan.leitorTurma : loan.leitorCategoria.toUpperCase()}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                        {new Date(loan.dataEmprestimo).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                        {new Date(loan.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Devolvido</span>
                          </span>
                        ) : isOverdue ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{loan.diasAtraso} dia(s) em atraso</span>
                            </span>
                            {loan.notificacoesEnviadas > 0 && (
                              <span className="text-[10px] text-slate-400">
                                {loan.notificacoesEnviadas} aviso(s) enviado(s)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>No prazo</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {loan.bibliotecariaResponsavel}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isReturned && (
                            <>
                              {isOverdue && (
                                <button
                                  onClick={() => handleOpenNotice(loan)}
                                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded transition-colors cursor-pointer"
                                  title="Disparar aviso de cobrança amigável para o leitor"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Notificar</span>
                                </button>
                              )}

                              <button
                                onClick={() => onReturnBook(loan.id)}
                                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-xs cursor-pointer"
                                title="Confirmar devolução do livro à estante"
                              >
                                <Check className="w-3 h-3" />
                                <span>Devolver</span>
                              </button>
                            </>
                          )}
                          {isReturned && (
                            <span className="text-[11px] text-slate-400 italic">Concluído</span>
                          )}
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

      {/* Notification Modal for Overdue Readers */}
      {notifyingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-orange-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <h3 className="text-sm font-bold tracking-tight">
                  Notificar Leitor sobre Atraso de Devolução
                </h3>
              </div>
              <button
                onClick={() => setNotifyingLoan(null)}
                className="text-orange-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-900">
                <p className="font-semibold">
                  Destinatário: {notifyingLoan.leitorNome} ({notifyingLoan.leitorTurma || notifyingLoan.leitorCategoria})
                </p>
                <p className="text-[11px] text-orange-700 mt-0.5">
                  Livro: &quot;{notifyingLoan.livroTitulo}&quot; · Tombo {notifyingLoan.livroTombo} · Prazo: {new Date(notifyingLoan.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Texto da Notificação / Mensagem de Cobrança:
                </label>
                <textarea
                  rows={6}
                  value={customNoticeText}
                  onChange={(e) => setCustomNoticeText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              {/* Standardized Components: [Confirmar, Voltar, Cancelar, Corrigir] */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNotifyingLoan(null)}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenNotice(notifyingLoan)}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Corrigir</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNotifyingLoan(null)}
                    className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancelar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendNotice}
                    className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg transition-colors font-semibold text-xs shadow-sm shadow-orange-600/20 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirmar Envio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
