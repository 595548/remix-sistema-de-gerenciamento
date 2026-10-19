import React, { useState } from 'react';
import { Terminal, Code2, BookOpen, Play, CheckCircle, Copy, Check, FileCode, Layers, Server } from 'lucide-react';

const PYTHON_CLI_CODE = `"""
SISTEMA DE CADASTRO DE BIBLIOTECA VALDIVA COLAÇO
EMEF Desembargador Pedro de Queiroz
Projeto: Xenia Cardoso | Ano: 2026 | Bibliotecária: Ada Melo

Código Completo do Projeto de Curso em Python (Etapas 1 a 6)
"""

import json
import os

# Base de Dados em Memória (Lista de Dicionários)
acervo = []
ARQUIVO_JSON = "acervo_biblioteca.json"


# ETAPA 1: ESTRUTURA INICIAL E MENU
def exibir_menu():
    print("\\n" + "=" * 50)
    print("  BIBLIOTECA VALDIVA COLAÇO - EMEF DES. PEDRO DE QUEIROZ")
    print("  Projeto: Xenia Cardoso | Coord.: Bibliotecária Ada Melo")
    print("=" * 50)
    print("1 - Cadastrar Livro")
    print("2 - Listar Todo o Acervo")
    print("3 - Buscar Livro por Título, Autor ou Gênero")
    print("4 - Realizar Empréstimo de Livro")
    print("5 - Realizar Devolução de Livro")
    print("6 - Contador e Estatísticas do Acervo (Etapa 6)")
    print("7 - Ordenar Acervo Alfabeticamente (Etapa 6)")
    print("8 - Remover Livro do Acervo (Etapa 6)")
    print("9 - Salvar Acervo em Arquivo JSON (Etapa 5)")
    print("0 - Sair do Sistema")
    print("=" * 50)


# ETAPA 2: CADASTRO DE LIVROS (Dicionário com título, autor, ano, status)
def cadastrar_livro(tombo, titulo, autor, estante, genero, ano):
    """Cadastra um novo exemplar como dicionário na lista global."""
    livro = {
        "tombo": tombo,
        "titulo": titulo,
        "autor": autor,
        "estante": estante,
        "genero": genero,
        "ano": int(ano),
        "disponivel": "Sim"
    }
    acervo.append(livro)
    print(f"✓ Livro '{titulo}' (Tombo: {tombo}) cadastrado com sucesso na Estante {estante}!")
    salvar_dados()


# ETAPA 3: CONSULTA E BUSCA
def listar_livros():
    """Percorre a lista e exibe todos os livros de forma organizada."""
    if not acervo:
        print("Acervo vazio no momento.")
        return

    print(f"\\n{'TOMBO':<8} | {'TÍTULO':<35} | {'AUTOR':<25} | {'ESTANTE':<8} | {'DISP'}")
    print("-" * 85)
    for l in acervo:
        print(f"{l['tombo']:<8} | {l['titulo'][:34]:<35} | {l['autor'][:24]:<25} | {l['estante']:<8} | {l['disponivel']}")


def buscar_livro(termo):
    """Busca por título, autor ou gênero."""
    termo = termo.lower()
    encontrados = [
        l for l in acervo
        if termo in l['titulo'].lower() or termo in l['autor'].lower() or termo in l.get('genero', '').lower()
    ]

    if not encontrados:
        print(f"Aviso: Nenhuma obra encontrada com o termo '{termo}'.")
    else:
        print(f"✓ Encontrado(s) {len(encontrados)} livro(s):")
        for l in encontrados:
            print(f"- [{l['tombo']}] {l['titulo']} ({l['autor']}) - Estante {l['estante']} - Disp: {l['disponivel']}")


# ETAPA 4: EMPRÉSTIMOS E DEVOLUÇÕES (Alterar Sim/Não)
def emprestar_livro(tombo):
    for l in acervo:
        if l['tombo'] == tombo:
            if l['disponivel'] == "Sim":
                l['disponivel'] = "Não"
                print(f"✓ Empréstimo confirmado para '{l['titulo']}'. Status alterado para 'Não'.")
                salvar_dados()
            else:
                print(f"Atenção: O livro '{l['titulo']}' já está emprestado!")
            return
    print(f"Erro: Livro com tombo {tombo} não encontrado.")


def devolver_livro(tombo):
    for l in acervo:
        if l['tombo'] == tombo:
            if l['disponivel'] == "Não":
                l['disponivel'] = "Sim"
                print(f"✓ Devolução confirmada para '{l['titulo']}'. Status revertido para 'Sim'.")
                salvar_dados()
            else:
                print(f"Atenção: O livro '{l['titulo']}' já consta como disponível na estante.")
            return
    print(f"Erro: Livro com tombo {tombo} não encontrado.")


# ETAPA 5: PERSISTÊNCIA COM JSON
def carregar_dados():
    global acervo
    if os.path.exists(ARQUIVO_JSON):
        try:
            with open(ARQUIVO_JSON, "r", encoding="utf-8") as f:
                acervo = json.load(f)
            print(f"✓ Acervo carregado do arquivo JSON: {len(acervo)} livros.")
        except Exception as e:
            print(f"Erro ao ler JSON: {e}")
    else:
        # 5 Livros iniciais obrigatórios para validação da Etapa 2
        acervo = [
            {"tombo": "0001", "titulo": "Caixa de Desejos", "autor": "Ana Cristina Melo", "estante": "A-1", "genero": "Infantojuvenil", "ano": 2014, "disponivel": "Sim"},
            {"tombo": "0002", "titulo": "Bisa Bia, Bisa Bel", "autor": "Ana Maria Machado", "estante": "A-1", "genero": "Literatura Brasileira", "ano": 2011, "disponivel": "Sim"},
            {"tombo": "0006", "titulo": "Jabuti sabido e Macaco metido", "autor": "Ana Maria Machado", "estante": "A-1", "genero": "Contos e Fábulas", "ano": 2015, "disponivel": "Sim"},
            {"tombo": "0010", "titulo": "Malala, a menina que queria ir à escola", "autor": "Adriana Carranca", "estante": "A-1", "genero": "Biografia e Memórias", "ano": 2015, "disponivel": "Sim"},
            {"tombo": "0075", "titulo": "O pequeno príncipe", "autor": "Antoine de Saint-Exupéry", "estante": "A-2", "genero": "Aventura e Clássicos", "ano": 2015, "disponivel": "Sim"}
        ]
        salvar_dados()


def salvar_dados():
    try:
        with open(ARQUIVO_JSON, "w", encoding="utf-8") as f:
            json.dump(acervo, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Erro ao salvar JSON: {e}")


# ETAPA 6: MELHORIAS (Contador, Ordenação, Remoção)
def exibir_estatisticas():
    total = len(acervo)
    disponiveis = sum(1 for l in acervo if l['disponivel'] == "Sim")
    emprestados = total - disponiveis
    print("\\n=== CONTADOR DE ACERVO (VALDIVA COLAÇO) ===")
    print(f"Total de Livros: {total}")
    print(f"Livros Disponíveis: {disponiveis}")
    print(f"Livros Emprestados: {emprestados}")


def ordenar_acervo(criterio="titulo"):
    global acervo
    if criterio == "titulo":
        acervo.sort(key=lambda x: x['titulo'].lower())
    elif criterio == "autor":
        acervo.sort(key=lambda x: x['autor'].lower())
    print(f"✓ Acervo reordenado com sucesso por {criterio}.")


def remover_livro(tombo):
    global acervo
    inicial = len(acervo)
    acervo = [l for l in acervo if l['tombo'] != tombo]
    if len(acervo) < inicial:
        print(f"✓ Livro de tombo {tombo} excluído com sucesso.")
        salvar_dados()
    else:
        print(f"Aviso: Livro {tombo} não encontrado para exclusão.")
`;

const DJANGO_CODE = `"""
API DJANGO REST FRAMEWORK - BIBLIOTECA VALDIVA COLAÇO
EMEF Desembargador Pedro de Queiroz
"""

# models.py
from django.db import models

class Leitor(models.Model):
    CATEGORIAS = [
        ('aluno', 'Aluno'),
        ('professor', 'Professor'),
        ('servidor', 'Servidor'),
        ('comunidade', 'Comunidade'),
    ]
    nome = models.CharField(max_length=150)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='aluno')
    serie = models.CharField(max_length=50, blank=True, null=True)  # ex: 6º Ano
    turma = models.CharField(max_length=10, blank=True, null=True)  # ex: A
    turno = models.CharField(max_length=20, blank=True, null=True)  # ex: Manhã
    matricula = models.CharField(max_length=50, blank=True, null=True)
    telefone = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.nome} ({self.categoria})"


class Livro(models.Model):
    tombo = models.CharField(max_length=20, unique=True)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=150)
    estante = models.CharField(max_length=20, default='A-1')
    genero = models.CharField(max_length=100, default='Infantojuvenil')
    ano = models.IntegerField(default=2026)
    disponivel = models.BooleanField(default=True)
    sinopse = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"[{self.tombo}] {self.titulo} - {self.autor}"


class Emprestimo(models.Model):
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name='emprestimos')
    leitor = models.ForeignKey(Leitor, on_delete=models.CASCADE, related_name='emprestimos')
    data_emprestimo = models.DateField(auto_now_add=True)
    data_devolucao_prevista = models.DateField()
    data_devolucao_real = models.DateField(blank=True, null=True)
    bibliotecaria_responsavel = models.CharField(max_length=100, default='Ada Melo')


# serializers.py
from rest_framework import serializers

class LivroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livro
        fields = '__all__'

class LeitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leitor
        fields = '__all__'

class EmprestimoSerializer(serializers.ModelSerializer):
    livro_detalhe = LivroSerializer(source='livro', read_only=True)
    leitor_detalhe = LeitorSerializer(source='leitor', read_only=True)

    class Meta:
        model = Emprestimo
        fields = '__all__'


# views.py
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

class LivroViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all().order_by('tombo')
    serializer_class = LivroSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'autor', 'estante', 'genero', 'tombo']

    @action(detail=True, methods=['post'])
    def emprestar(self, request, pk=None):
        livro = self.get_object()
        if not livro.disponivel:
            return Response({'erro': 'Livro já está emprestado'}, status=400)
        livro.disponivel = False
        livro.save()
        return Response({'status': 'Empréstimo registrado com sucesso'})

    @action(detail=True, methods=['post'])
    def devolver(self, request, pk=None):
        livro = self.get_object()
        livro.disponivel = True
        livro.save()
        return Response({'status': 'Devolução confirmada com sucesso'})
`;

export const PythonCourseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cli' | 'django' | 'terminal'>('terminal');
  const [copied, setCopied] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "=== AMBIENTE INTERATIVO PYTHON 3.12 (PORTFÓLIO VALDIVA COLAÇO) ===",
    "Iniciando: python biblioteca_cli.py...",
    "✓ Acervo carregado do arquivo JSON: 166 livros cadastrados.",
    "Bibliotecária Responsável: Ada Melo",
    "Projeto: Xenia Cardoso | EMEF Desembargador Pedro de Queiroz",
    "Digite um comando ou clique nos atalhos rápidos abaixo para testar as Etapas 1-6:"
  ]);
  const [cliInput, setCliInput] = useState('');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCliCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const newOutput = [...terminalOutput, `>>> ${trimmed}`];

    if (trimmed === '1' || trimmed.toLowerCase() === 'cadastrar') {
      newOutput.push("--- ETAPA 2: CADASTRO DE LIVROS ---");
      newOutput.push("Cadastrando livro: {'tombo': '0167', 'titulo': 'O Menino Maluquinho', 'autor': 'Ziraldo', 'estante': 'A-1', 'genero': 'Infantojuvenil', 'ano': 2026, 'disponivel': 'Sim'}");
      newOutput.push("✓ Livro cadastrado com sucesso e persistido no arquivo JSON.");
    } else if (trimmed === '2' || trimmed.toLowerCase() === 'listar') {
      newOutput.push("--- ETAPA 3: LISTAGEM GERAL DO ACERVO ---");
      newOutput.push("TOMBO    | TÍTULO                              | AUTOR                     | ESTANTE  | DISP");
      newOutput.push("-------------------------------------------------------------------------------------");
      newOutput.push("0001     | Caixa de Desejos                    | Ana Cristina Melo         | A-1      | Sim");
      newOutput.push("0002     | Bisa Bia, Bisa Bel                  | Ana Maria Machado         | A-1      | Sim");
      newOutput.push("0010     | Malala, a menina que queria ir...   | Adriana Carranca          | A-1      | Sim");
      newOutput.push("0075     | O pequeno príncipe                  | Antoine de Saint-Exupéry  | A-2      | Sim");
      newOutput.push("... (166 registros no acervo oficial)");
    } else if (trimmed === '3' || trimmed.toLowerCase().startsWith('buscar')) {
      newOutput.push("--- ETAPA 3: BUSCA POR FILTRO ---");
      newOutput.push("Buscando por: 'Ana Maria Machado'");
      newOutput.push("✓ Encontrados 18 livros da autora Ana Maria Machado no acervo.");
      newOutput.push("- [0002] Bisa Bia, Bisa Bel - Estante A-1 (Disponível)");
      newOutput.push("- [0006] Jabuti sabido e Macaco metido - Estante A-1 (Disponível)");
      newOutput.push("- [0007] Raul da ferrugem azul - Estante A-1 (Disponível)");
      newOutput.push("- [0028] Mensagem para você - Estante A-1 (Disponível)");
    } else if (trimmed === '4' || trimmed.toLowerCase() === 'emprestar') {
      newOutput.push("--- ETAPA 4: EMPRÉSTIMO DE LIVRO ---");
      newOutput.push("Tombo: 0001 (Caixa de Desejos)");
      newOutput.push("Leitor: Cauã Vinícius dos Santos (6º Ano A - Manhã)");
      newOutput.push("✓ Status de disponibilidade alterado de 'Sim' para 'Não'.");
      newOutput.push("✓ Persistência executada em acervo_biblioteca.json.");
    } else if (trimmed === '5' || trimmed.toLowerCase() === 'devolver') {
      newOutput.push("--- ETAPA 4: DEVOLUÇÃO DE LIVRO ---");
      newOutput.push("Tombo: 0001 (Caixa de Desejos)");
      newOutput.push("✓ Devolução confirmada! Status de disponibilidade revertido para 'Sim'.");
    } else if (trimmed === '6' || trimmed.toLowerCase() === 'estatisticas') {
      newOutput.push("--- ETAPA 6: CONTADOR DE ACERVO ---");
      newOutput.push("Total de Obras: 166 títulos");
      newOutput.push("Disponíveis na Estante: 163 títulos");
      newOutput.push("Emprestados: 3 títulos");
      newOutput.push("Estantes catalogadas: A-1, A-2, A-3");
    } else if (trimmed === '7' || trimmed.toLowerCase() === 'ordenar') {
      newOutput.push("--- ETAPA 6: ORDENAÇÃO ALFABÉTICA ---");
      newOutput.push("✓ Acervo ordenado alfabeticamente por título da obra.");
    } else if (trimmed === 'limpar' || trimmed === 'clear') {
      setTerminalOutput(["Terminal limpo. Digite um comando:"]);
      setCliInput('');
      return;
    } else {
      newOutput.push(`Comando '${trimmed}' processado no loop interativo.`);
    }

    setTerminalOutput(newOutput);
    setCliInput('');
  };

  return (
    <div className="space-y-4">
      {/* Course Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-orange-500 text-white font-bold text-[10px] rounded tracking-wide uppercase">
                Curso de Python & Portfólio 2026
              </span>
              <span className="text-slate-400 text-xs">· EMEF Desembargador Pedro de Queiroz</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              Arquitetura Limpa em Python & Django REST Framework
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Implementação das Etapas 1 a 6 solicitadas: Menu interativo, dicionários em listas, busca e listagem, manipulação de estado (Sim/Não), persistência JSON e melhorias de ordenação e estatísticas.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-lg text-xs shrink-0">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'terminal' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Simulador Terminal CLI</span>
            </button>

            <button
              onClick={() => setActiveTab('cli')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cli' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Código Python (Etapas 1-6)</span>
            </button>

            <button
              onClick={() => setActiveTab('django')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'django' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>API Django REST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab: Interactive Terminal CLI */}
      {activeTab === 'terminal' && (
        <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-md">
          {/* Terminal Title Bar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span className="font-mono text-[11px] ml-2 text-slate-300">python3 biblioteca_cli.py</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Ada Melo · Valdiva Colaço</span>
          </div>

          {/* Quick Action Buttons for the CLI stages */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 mr-1">Executar Etapa:</span>
            <button
              onClick={() => executeCliCommand('1')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded text-[11px] font-mono cursor-pointer"
            >
              1: Cadastrar Livro
            </button>
            <button
              onClick={() => executeCliCommand('2')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-[11px] font-mono cursor-pointer"
            >
              2: Listar Acervo
            </button>
            <button
              onClick={() => executeCliCommand('3')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-mono cursor-pointer"
            >
              3: Buscar Livro
            </button>
            <button
              onClick={() => executeCliCommand('4')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-yellow-400 rounded text-[11px] font-mono cursor-pointer"
            >
              4: Emprestar
            </button>
            <button
              onClick={() => executeCliCommand('5')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-green-400 rounded text-[11px] font-mono cursor-pointer"
            >
              5: Devolver
            </button>
            <button
              onClick={() => executeCliCommand('6')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded text-[11px] font-mono cursor-pointer"
            >
              6: Estatísticas
            </button>
            <button
              onClick={() => executeCliCommand('limpar')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-[11px] font-mono ml-auto cursor-pointer"
            >
              Limpar
            </button>
          </div>

          {/* Terminal Console Logs */}
          <div className="p-4 font-mono text-xs space-y-1 max-h-96 overflow-y-auto leading-relaxed">
            {terminalOutput.map((line, i) => (
              <div
                key={i}
                className={
                  line.startsWith('>>>')
                    ? 'text-yellow-400 font-bold'
                    : line.startsWith('✓')
                    ? 'text-emerald-400'
                    : line.startsWith('---')
                    ? 'text-orange-400 font-bold'
                    : line.startsWith('Erro')
                    ? 'text-red-400'
                    : 'text-slate-300'
                }
              >
                {line}
              </div>
            ))}
          </div>

          {/* Command Prompt Input */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <span className="text-orange-500 font-mono font-bold text-xs pl-1">&gt;&gt;&gt;</span>
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && cliInput.trim()) {
                  executeCliCommand(cliInput);
                }
              }}
              placeholder="Digite o número da opção (ex: 1, 2, 3, 4, 5, 6) ou comando e pressione Enter..."
              className="flex-1 bg-transparent text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none"
            />
            <button
              onClick={() => { if (cliInput.trim()) executeCliCommand(cliInput); }}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-mono text-xs font-semibold cursor-pointer"
            >
              Executar
            </button>
          </div>
        </div>
      )}

      {/* Tab: Python CLI Source Code */}
      {activeTab === 'cli' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono font-semibold text-slate-800">
              <FileCode className="w-4 h-4 text-orange-600" />
              <span>biblioteca_cli.py (Código Fonte Completo - Etapas 1 a 6)</span>
            </div>
            <button
              onClick={() => copyCode(PYTHON_CLI_CODE)}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
            {PYTHON_CLI_CODE}
          </pre>
        </div>
      )}

      {/* Tab: Django REST Framework */}
      {activeTab === 'django' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono font-semibold text-slate-800">
              <Server className="w-4 h-4 text-blue-700" />
              <span>api_django/ (Models, Serializers, ViewSets e Endpoints REST)</span>
            </div>
            <button
              onClick={() => copyCode(DJANGO_CODE)}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
            {DJANGO_CODE}
          </pre>
        </div>
      )}
    </div>
  );
};
