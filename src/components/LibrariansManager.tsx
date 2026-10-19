import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Shield, Clock, Check, X, ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { Assistant } from '../types/library';

interface LibrariansManagerProps {
  assistants: Assistant[];
  activeAssistantId: string;
  onSetActiveAssistant: (id: string) => void;
  onAddAssistant: (assistant: Omit<Assistant, 'id'>) => void;
  onDeleteAssistant: (id: string) => void;
}

export const LibrariansManager: React.FC<LibrariansManagerProps> = ({
  assistants,
  activeAssistantId,
  onSetActiveAssistant,
  onAddAssistant,
  onDeleteAssistant,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('Assistente de Biblioteca');
  const [turno, setTurno] = useState('Manhã');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setNome('');
    setCargo('Assistente de Biblioteca');
    setTurno('Manhã');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleCorrigir = () => {
    setNome('');
    setCargo('Assistente de Biblioteca');
    setTurno('Manhã');
    setErrorMsg('');
  };

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('O nome do profissional é obrigatório.');
      return;
    }

    onAddAssistant({
      nome: nome.trim(),
      cargo: cargo.trim(),
      turno,
      ativo: true,
      isHeadLibrarian: false,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-orange-600" />
              <span>Gestão de Bibliotecárias e Assistentes</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordenação de Ada Melo e equipe de atendimento da Biblioteca Valdiva Colaço (EMEF Des. Pedro de Queiroz).
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm shadow-orange-600/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Bibliotecária / Assistente</span>
          </button>
        </div>

        {/* Current Active Banner */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
              {assistants.find(a => a.id === activeAssistantId)?.nome.charAt(0) || 'A'}
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Sessão em operação ativa:</span>
              <strong className="text-blue-900 text-sm">
                {assistants.find(a => a.id === activeAssistantId)?.nome}
              </strong>
              <span className="text-blue-700 text-[11px] ml-2">
                ({assistants.find(a => a.id === activeAssistantId)?.cargo})
              </span>
            </div>
          </div>
          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Operador Autorizado</span>
          </span>
        </div>
      </div>

      {/* Grid of Assistants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assistants.map((ast) => {
          const isActive = ast.id === activeAssistantId;

          return (
            <div
              key={ast.id}
              className={`p-4 rounded-xl border transition-all bg-white flex flex-col justify-between ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-600/10 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      ast.isHeadLibrarian
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ast.nome.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <span>{ast.nome}</span>
                        {ast.isHeadLibrarian && (
                          <span title="Bibliotecária Chefe Titular">
                            <Shield className="w-3.5 h-3.5 text-orange-500" />
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500">{ast.cargo}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Turno de atuação:</span>
                    <span className="font-medium text-slate-800">{ast.turno}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-600 font-semibold">Ativo na Unidade</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {isActive ? (
                  <span className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 rounded">
                    Sessão Atual
                  </span>
                ) : (
                  <button
                    onClick={() => onSetActiveAssistant(ast.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  >
                    Operar como
                  </button>
                )}

                {!ast.isHeadLibrarian && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja remover ${ast.nome} da equipe de assistentes?`)) {
                        onDeleteAssistant(ast.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                    title="Excluir assistente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Assistant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold tracking-tight">
                  Adicionar Bibliotecária / Assistente
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
                  placeholder="Ex: Carlos Eduardo de Sousa"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Função / Cargo:
                </label>
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Assistente de Biblioteca">Assistente de Biblioteca</option>
                  <option value="Bibliotecária Adjunta">Bibliotecária Adjunta</option>
                  <option value="Mediador de Leitura">Mediador de Leitura</option>
                  <option value="Estagiário(a) de Biblioteconomia">Estagiário(a) de Biblioteconomia</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Turno de Atuação:
                </label>
                <select
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                  <option value="Manhã e Tarde">Manhã e Tarde (Integral)</option>
                </select>
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
                    className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg transition-colors font-semibold text-xs shadow-sm shadow-orange-600/20 cursor-pointer"
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
