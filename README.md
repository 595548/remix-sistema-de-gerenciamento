# Sistema de Cadastro de Biblioteca Valdiva Colaço
### EMEF Desembargador Pedro de Queiroz
**Autora do Projeto:** Xenia Cardoso  
**Ano Letivo:** 2026  
**Bibliotecária Responsável:** Ada Melo  

---

## 📖 Sobre o Projeto
O **Sistema de Cadastro e Gestão da Biblioteca Valdiva Colaço** foi desenvolvido para atender às necessidades reais de catalogação e controle da biblioteca da **EMEF Desembargador Pedro de Queiroz**. 

O projeto consolida os fundamentos aprendidos ao longo do curso de desenvolvimento em **Python**, demonstrando arquitetura limpa, estrutura de dados com dicionários e listas, persistência em arquivo JSON, integração com APIs externas (Google Books), emissão de relatórios oficiais timbrados em PDF, planilhas CSV/Excel, XML estruturado e API com Django REST Framework.

---

## 🌟 Funcionalidades Principais

1. **Acervo Real Completo (166 Livros Oficiais):**
   - Transcrição exata do Livro de Tombo e Cadastro físico da escola (Páginas 1 a 4).
   - Sem nomes ou dados fictícios.
   - Catalogação por Tombo oficial (`0001` a `0166`), Título, Autor, Gênero e Ano.

2. **Organização por Estante em Ordem Alfabética:**
   - Visualização dedicada com separação física das **Estantes A-1, A-2 e A-3**.
   - Obras agrupadas e listadas em ordem alfabética estrita por título.

3. **Subclassificação Completa de Leitores:**
   - **Alunos e Alunas:** Subclassificados com **Série** (1º ao 9º Ano), **Turma** (A, B, C, D) e **Turno** (Manhã, Tarde, Integral).
   - **Professores, Servidores Escolares e Comunidade**.

4. **Controle de Empréstimos & Sistema de Notificações de Atraso:**
   - Controle de prazos de devolução.
   - Detecção em tempo real de dias em atraso.
   - Disparo de aviso formal amigável para o leitor regularizar a situação com a bibliotecária Ada Melo.

5. **Gestão de Bibliotecárias & Equipe de Assistentes:**
   - Coordenação titular por **Ada Melo**.
   - Possibilidade de incluir novos assistentes, excluir registros e alternar quem está operando o sistema.

6. **Exportação Multiformato:**
   - **Relatório Oficial em PDF:** Timbrado e formatado com cabeçalho institucional da EMEF Des. Pedro de Queiroz, resumo estatístico e tabela zebrada.
   - **Planilhas CSV / Excel:** Com cabeçalho UTF-8 BOM para abertura perfeita no Microsoft Excel.
   - **XML Válido e Estruturado:** Em conformidade com os padrões de interoperabilidade W3C.
   - **JSON Completo:** Para backup e restauração na nuvem.

7. **Ambiente Interativo de Portfólio Python (Etapas 1 a 6):**
   - Terminal interativo integrado rodando a simulação do script CLI em Python.
   - Código fonte completo das Etapas 1-6 em `biblioteca_cli.py`.
   - Explicações didáticas em `explaincode.py`.
   - Especificação dos endpoints e serializers em `Django REST Framework`.

8. **Identidade Visual Conforme Especificação:**
   - Cores institucionais: **Laranja** (`#f97316`) e **Azul** (`#1e40af`).
   - Tipografia: **Montserrat** (Google Fonts).
   - Componentes padronizados: `[Confirmar]`, `[Voltar]`, `[Cancelar]`, `[Corrigir]`.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, jsPDF.
- **Backend / Python:** Python 3.12, Django REST Framework, Módulos nativos `json` e `os`.
- **DevOps:** Docker, Docker Compose, Git (.gitignore configurado para segurança).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm (versão 10 ou superior)
- Python 3.10+ (opcional, para execução direta do script CLI local)

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/biblioteca-valdiva-colaco.git
   cd biblioteca-valdiva-colaco
   ```

2. **Configurar as Variáveis de Ambiente:**
   Copie o modelo de variáveis sem expor credenciais reais no repositório:
   ```bash
   cp .env.example .env
   ```
   *O arquivo `.env` já está incluído no `.gitignore` para garantir total segurança de chaves e dados sensíveis.*

3. **Instalar Dependências:**
   ```bash
   npm install
   ```

4. **Executar em Modo de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: `http://localhost:3000`

5. **Compilar para Produção:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🐳 Executando com Docker

Para garantir consistência idêntica entre ambientes de desenvolvimento e produção:

```bash
# Construir a imagem e iniciar o contêiner
docker-compose up -d --build

# Acompanhar os logs
docker-compose logs -f

# Parar o serviço
docker-compose down
```
Acesse a aplicação em `http://localhost:3000`.

---

## 📂 Estrutura de Documentos do Projeto

- `prd.md`: Documento de Requisitos do Produto para a Biblioteca Valdiva Colaço.
- `arquitetura.md`: Descrição arquitetural, Clean Architecture, stack e modelo de entidades.
- `design.md`: Guia de estilo, paleta Laranja & Azul, tipografia Montserrat e componentes padronizados.
- `tarefas.md`: Checklist completo das Etapas 1 a 6 e melhorias implementadas.
- `explaincode.py`: Guia didático linha a linha dos conceitos computacionais em Python.
- `.env.example`: Modelo de variáveis de ambiente seguro.

---

## 📜 Licença e Créditos
- **Escola:** EMEF Desembargador Pedro de Queiroz
- **Biblioteca:** Valdiva Colaço
- **Projeto de Software:** Xenia Cardoso (2026)
- **Coordenação da Biblioteca:** Ada Melo
