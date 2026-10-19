# Arquitetura do Sistema e Stack Tecnológica
## Biblioteca Valdiva Colaço - EMEF Desembargador Pedro de Queiroz
**Projeto:** Xenia Cardoso (2026) | **Bibliotecária:** Ada Melo

---

### 1. Visão Geral da Arquitetura
O sistema adota uma arquitetura em camadas orientada a domínio (Domain-Driven Design / Clean Architecture), dividida entre uma interface frontend de alta responsividade e serviços backend robustos em Python com suporte a API RESTful e persistência relacional/JSON.

```
+-------------------------------------------------------------+
|                     INTERFACE VISUAL (SPA)                  |
|    React 19 + TypeScript + Tailwind CSS v4 + Fonte Montserrat|
+-------------------------------------------------------------+
                              |
       +----------------------+----------------------+
       |                                             |
       v                                             v
+-----------------------------+        +------------------------------+
|  Módulo Web / Exportações   |        |   API Django REST Framework  |
|  - jsPDF (Relatórios PDF)   |        |   - ViewSets & Serializers   |
|  - CSV / Excel / XML        |        |   - Autenticação e RBAC      |
|  - Google Books API Client  |        |   - PostgreSQL / SQLite      |
+-----------------------------+        +------------------------------+
       |                                             |
       +----------------------+----------------------+
                              |
                              v
+-------------------------------------------------------------+
|             NÚCLEO PYTHON CLI & PERSISTÊNCIA                |
|    - Scripts das Etapas 1 a 6 (acervo_biblioteca.json)       |
|    - Funções de Dicionários, Listas e Validação             |
+-------------------------------------------------------------+
```

---

### 2. Tecnologias Empregadas (Stack)
- **Frontend:**
  - React 19 com Hooks funcionais e estado reativo.
  - Tailwind CSS v4 com paleta Laranja (#f97316) e Azul (#1e40af / #1e3a8a).
  - Google Font Montserrat (pesos 400, 500, 600, 700).
  - Biblioteca `jspdf` para confecção de relatórios timbrados da escola.
  - Ícones minimalistas da biblioteca `lucide-react`.

- **Backend & Scripts Python:**
  - Python 3.12 com Clean Architecture.
  - Django REST Framework (DRF) para fornecimento de endpoints REST (`/api/livros/`, `/api/leitores/`, `/api/emprestimos/`).
  - Módulos nativos `json`, `os`, `sys` e `datetime` para persistência local e relatórios.

- **Contêineres & Infraestrutura:**
  - Docker & Docker Compose para orquestração de microsserviços.
  - Suporte a banco de dados relacional PostgreSQL ou arquivo SQLite / JSON.

---

### 3. Modelo de Entidades
1. **Livro:** `id`, `tombo`, `titulo`, `autor`, `estante`, `genero`, `ano`, `disponivel`, `sinopse`, `isbn`.
2. **Leitor:** `id`, `nome`, `categoria` (`aluno`, `professor`, `servidor`, `comunidade`), `serie`, `turma`, `turno`, `matricula`, `telefone`, `email`.
3. **Empréstimo:** `id`, `livroId`, `leitorId`, `dataEmprestimo`, `dataDevolucaoPrevista`, `dataDevolucaoReal`, `status`, `bibliotecariaResponsavel`, `notificacoesEnviadas`.
4. **Assistente:** `id`, `nome`, `cargo`, `turno`, `ativo`, `isHeadLibrarian`.
