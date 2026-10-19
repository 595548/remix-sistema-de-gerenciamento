import React, { useRef, useState } from 'react';
import { X, FileText, ArrowDownToLine, Upload, Check, ArrowLeft, RotateCcw, Database, Code, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Book, Reader, Loan } from '../types/library';
import { exportBooksToCSV, exportLoansToCSV, exportToXML, exportToJSON, generateOfficialPDF } from '../utils/exportUtils';

interface DataExportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  readers: Reader[];
  loans: Loan[];
  activeAssistantName: string;
  onImportBackup: (importedData: { acervo?: Book[]; leitores?: Reader[]; emprestimos?: Loan[] }) => void;
}

export const DataExportsModal: React.FC<DataExportsModalProps> = ({
  isOpen,
  onClose,
  books,
  readers,
  loans,
  activeAssistantName,
  onImportBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.acervo && Array.isArray(parsed.acervo)) {
          onImportBackup({
            acervo: parsed.acervo,
            leitores: parsed.leitores,
            emprestimos: parsed.emprestimos,
          });
          setImportStatus(`Sucesso! ${parsed.acervo.length} livros restaurados a partir do backup JSON.`);
          setImportError('');
        } else {
          throw new Error('O arquivo JSON não contém o nó "acervo" válido.');
        }
      } catch (err: any) {
        setImportError(err.message || 'Erro ao processar arquivo JSON.');
        setImportStatus('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4 text-orange-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Exportação de Relatórios & Backup de Dados
              </h3>
              <p className="text-[11px] text-slate-400">
                PDF oficial, Excel/CSV, XML estruturado e persistência JSON
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {importStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{importStatus}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Export Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* PDF Oficial */}
            <div className="p-3.5 border border-slate-200 hover:border-blue-400 rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>Relatório Oficial em PDF</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Documento formal timbrado da EMEF Des. Pedro de Queiroz com resumo estatístico e catálogo completo.
                </p>
              </div>
              <button
                onClick={() => generateOfficialPDF(books, loans, activeAssistantName)}
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Baixar Relatório PDF</span>
              </button>
            </div>

            {/* Excel / CSV Acervo */}
            <div className="p-3.5 border border-slate-200 hover:border-emerald-400 rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Planilha Excel / CSV Acervo</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Arquivo CSV compatível com Microsoft Excel e Google Planilhas (UTF-8 com acentuação corrigida).
                </p>
              </div>
              <button
                onClick={() => exportBooksToCSV(books)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Exportar Acervo CSV</span>
              </button>
            </div>

            {/* XML Estruturado */}
            <div className="p-3.5 border border-slate-200 hover:border-purple-400 rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-800 font-bold mb-1">
                  <Code className="w-4 h-4 text-purple-600" />
                  <span>Arquivo XML Válido</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Estrutura XML semântica contendo metadados institucionais, acervo, leitores e empréstimos.
                </p>
              </div>
              <button
                onClick={() => exportToXML(books, readers, loans)}
                className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Exportar XML Estruturado</span>
              </button>
            </div>

            {/* JSON Completo */}
            <div className="p-3.5 border border-slate-200 hover:border-orange-400 rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-orange-800 font-bold mb-1">
                  <Database className="w-4 h-4 text-orange-600" />
                  <span>Backup JSON Completo</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Exporta a base de dados completa em JSON estruturado para interoperabilidade e nuvem.
                </p>
              </div>
              <button
                onClick={() => exportToJSON(books, readers, loans)}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Baixar Backup JSON</span>
              </button>
            </div>
          </div>

          {/* Import JSON Section */}
          <div className="p-3.5 border border-dashed border-slate-300 rounded-xl bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Restaurar Base a partir de Arquivo JSON</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Carregue um arquivo JSON exportado anteriormente para atualizar o acervo local.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold rounded-lg transition-colors whitespace-nowrap text-xs cursor-pointer"
            >
              Selecionar JSON...
            </button>
          </div>

          {/* Standardized Action Buttons: [Confirmar, Voltar, Cancelar, Corrigir] */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => { setImportStatus(''); setImportError(''); }}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs cursor-pointer"
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
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors font-semibold text-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirmar Conclusão</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
