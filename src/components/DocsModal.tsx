import React, { useState } from 'react';
import { X, FileText, Layers, Palette, CheckSquare, Code2, Copy, Check } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeDoc, setActiveDoc] = useState<'prd' | 'arquitetura' | 'design' | 'tarefas' | 'explaincode'>('prd');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Documentação Técnica do Projeto (2026)
              </h3>
              <p className="text-[11px] text-slate-400">
                Biblioteca Valdiva Colaço · EMEF Desembargador Pedro de Queiroz · Projeto Xenia Cardoso
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

        {/* Tab Selector */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
          <button
            onClick={() => setActiveDoc('prd')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeDoc === 'prd' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>prd.md (Requisitos)</span>
          </button>

          <button
            onClick={() => setActiveDoc('arquitetura')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeDoc === 'arquitetura' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>arquitetura.md (Stack & Arquitetura)</span>
          </button>

          <button
            onClick={() => setActiveDoc('design')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeDoc === 'design' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>design.md (Cores, Tipografia & UI)</span>
          </button>

          <button
            onClick={() => setActiveDoc('tarefas')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeDoc === 'tarefas' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>tarefas.md (Etapas 1-6)</span>
          </button>

          <button
            onClick={() => setActiveDoc('explaincode')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeDoc === 'explaincode' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>explaincode.py (Didática Python)</span>
          </button>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 leading-relaxed space-y-4">
          {activeDoc === 'prd' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                PRD - Product Requirements Document
              </h2>
              <p><strong>Projeto:</strong> Sistema de Gestão e Cadastro de Biblioteca Valdiva Colaço</p>
              <p><strong>Instituição:</strong> EMEF Desembargador Pedro de Queiroz</p>
              <p><strong>Autora:</strong> Xenia Cardoso | <strong>Ano:</strong> 2026 | <strong>Bibliotecária Chefe:</strong> Ada Melo</p>

              <h3 className="text-sm font-bold text-slate-800 pt-2">1. Objetivo do Produto</h3>
              <p>
                Organizar o acervo bibliográfico físico e o fluxo diário de empréstimos e devoluções da Biblioteca Valdiva Colaço, atendendo a comunidade escolar da EMEF Desembargador Pedro de Queiroz.
              </p>

              <h3 className="text-sm font-bold text-slate-800 pt-2">2. Usuários e Subclassificação</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Alunos e Alunas:</strong> Subclassificados com Série (1º ao 9º ano), Turma (A, B, C) e Turno (Manhã, Tarde, Integral).</li>
                <li><strong>Professores:</strong> Docentes de diferentes disciplinas e áreas curriculares.</li>
                <li><strong>Servidores:</strong> Funcionários do corpo administrativo e operacional da escola.</li>
                <li><strong>Comunidade:</strong> Pais, responsáveis e leitores do entorno escolar.</li>
              </ul>

              <h3 className="text-sm font-bold text-slate-800 pt-2">3. Requisitos Funcionais Principais</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Cadastro de livros com Tombo oficial, Título, Autor, Estante física (A-1, A-2, A-3), Gênero e Ano.</li>
                <li>Empréstimos com cálculo automático de prazo e alerta visual de atraso.</li>
                <li>Mecanismo de notificação direta para alunos e leitores com devolução pendente.</li>
                <li>Organização por estantes em estrita ordem alfabética de títulos.</li>
                <li>Exportação de relatórios em PDF timbrado, Excel/CSV, XML estruturado e backup JSON.</li>
                <li>Gestão de bibliotecárias e assistentes com alternância de operador na sessão.</li>
              </ul>
            </div>
          )}

          {activeDoc === 'arquitetura' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Arquitetura do Sistema e Stack Tecnológica
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 mb-1">Frontend SPA Web:</h4>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>React 19 + TypeScript + Vite 8</li>
                    <li>Tailwind CSS v4 com paleta Laranja &amp; Azul</li>
                    <li>Tipografia: Google Font Montserrat</li>
                    <li>jsPDF para emissão de relatórios oficiais da escola</li>
                    <li>Ícones: Lucide React (minimalistas)</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 mb-1">Backend &amp; API Python:</h4>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Python 3.12 + Clean Architecture</li>
                    <li>Django REST Framework (ModelViewSets, Serializers)</li>
                    <li>PostgreSQL / SQLite para persistência relacional</li>
                    <li>CLI interativo em Python para portfólio de curso</li>
                    <li>Variáveis de ambiente (.env) para segurança de chaves</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 pt-2">Fluxo de Dados &amp; Persistência</h3>
              <p>
                Os dados são armazenados localmente com persistência imediata em LocalStorage e salvamento em arquivo JSON. A exportação gera XML válido e bem estruturado com conformidade W3C e CSV com UTF-8 BOM para garantir correta abertura no Microsoft Excel.
              </p>
            </div>
          )}

          {activeDoc === 'design' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Diretrizes de Design e Identidade Visual (design.md)
              </h2>
              <p><strong>Cores Primárias:</strong> Laranja Institucional (#f97316 / #ea580c) e Azul Nobre (#1e40af / #1e3a8a / #0284c7).</p>
              <p><strong>Tipografia:</strong> Família Montserrat (pesos 400 regular, 500 medium, 600 semibold, 700 bold), garantindo excelente legibilidade em relatórios e telas escolares.</p>
              
              <h3 className="text-sm font-bold text-slate-800 pt-2">Componentes de Ação Padronizados</h3>
              <p>Todas as janelas e modais do sistema incorporam obrigatoriamente a quádrupla de componentes de ação:</p>
              <div className="grid grid-cols-4 gap-2 text-center font-bold">
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  [Confirmar]
                </div>
                <div className="p-2 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                  [Voltar]
                </div>
                <div className="p-2 bg-slate-100 text-slate-700 border border-slate-200 rounded">
                  [Cancelar]
                </div>
                <div className="p-2 bg-orange-50 text-orange-800 border border-orange-200 rounded">
                  [Corrigir]
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'tarefas' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Plano de Tarefas e Etapas do Projeto (tarefas.md)
              </h2>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <strong>Etapa 1: Estrutura Inicial e Menu</strong>
                  <p className="text-[11px] text-slate-500">Criação do loop principal, menu com opções numéricas e assinaturas de funções com pass.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <strong>Etapa 2: Cadastro de Livros</strong>
                  <p className="text-[11px] text-slate-500">Dicionários contendo título, autor, estante, gênero, ano e disponibilidade ("Sim"). Validação com os exemplares reais.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <strong>Etapa 3: Consulta e Busca</strong>
                  <p className="text-[11px] text-slate-500">Listagem formatada em colunas e busca textual por título, autor e gênero literário.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <strong>Etapa 4: Empréstimos e Devoluções</strong>
                  <p className="text-[11px] text-slate-500">Alternância controlada de disponibilidade ("Sim" &harr; "Não") e registro de responsável.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <strong>Etapa 5: Persistência com JSON</strong>
                  <p className="text-[11px] text-slate-500">Carregamento e gravação contínua no arquivo acervo_biblioteca.json com tratamento de exceções.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <strong>Etapa 6: Melhorias Sugeridas</strong>
                  <p className="text-[11px] text-slate-500">Contador de acervo, ordenação alfabética por estante, sistema de notificação por atraso e exclusão de itens.</p>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'explaincode' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Explicação Didática do Código Python (explaincode.py)
              </h2>
              <p>
                Este documento detalha linha a linha os conceitos de ciência da computação e sintaxe Python aplicados na aplicação:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>pass:</strong> Utilizado na Etapa 1 como marcador de posição para permitir que o interpretador Python compile as assinaturas das funções antes da implementação.</li>
                <li><strong>Dicionários Python:</strong> Estruturas chave-valor (ex: <code>&#123;&quot;titulo&quot;: &quot;Malala&quot;, &quot;disponivel&quot;: &quot;Sim&quot;&#125;</code>) que garantem acesso em tempo constante $O(1)$ aos atributos do livro.</li>
                <li><strong>List Comprehension:</strong> Utilizada na função de busca e filtros para filtrar eficientemente a lista global de acervo.</li>
                <li><strong>Módulo json:</strong> As funções <code>json.dump()</code> e <code>json.load()</code> serializam e desserializam as coleções em disco com codificação UTF-8.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-slate-500">
            EMEF Desembargador Pedro de Queiroz · Biblioteca Valdiva Colaço
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Fechar Documentação
          </button>
        </div>
      </div>
    </div>
  );
};
