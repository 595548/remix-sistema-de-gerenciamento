# Plano de Tarefas e Etapas do Projeto (tarefas.md)
## Sistema de Cadastro de Biblioteca Valdiva Colaço
**EMEF Desembargador Pedro de Queiroz** | **Projeto:** Xenia Cardoso (2026)

---

### Etapa 1: Estrutura Inicial e Menu
- [x] Criação do menu principal com opções: Cadastro, Listagem, Busca, Empréstimo, Devolução, Estatísticas e Saída.
- [x] Declaração de assinaturas de funções com a palavra-chave `pass` em Python para compilação sem falhas prévias.
- [x] Configuração da estrutura de repetição (`while True`) para interação contínua.

### Etapa 2: Cadastro de Livros
- [x] Modelagem de livros através de dicionários contendo `tombo`, `titulo`, `autor`, `estante`, `genero`, `ano` e `disponivel`.
- [x] Armazenamento em lista global (`acervo = []`).
- [x] Validação com mais de 5 livros reais inventariados no acervo oficial.

### Etapa 3: Consulta e Busca
- [x] Implementação da função `listar_livros()` formatando colunas de forma legível.
- [x] Implementação de busca por texto com suporte a filtro por título, autor e gênero literário.
- [x] Mensagens de aviso amigáveis quando o registro não for localizado.

### Etapa 4: Empréstimos e Devoluções
- [x] Lógica de empréstimo: alterar chave `disponivel` de "Sim" para "Não".
- [x] Lógica de devolução: reverter chave `disponivel` para "Sim".
- [x] Validação de empréstimo duplo ou devolução de livro já disponível.

### Etapa 5: Persistência com JSON
- [x] Implementação da função `salvar_dados()` gravando em `acervo_biblioteca.json` com indentação e codificação UTF-8.
- [x] Implementação da função `carregar_dados()` lendo o arquivo ao inicializar o programa.

### Etapa 6: Melhorias Sugeridas & Funcionalidades Avançadas
- [x] **Contador de Acervo:** Total de títulos, disponíveis e emprestados.
- [x] **Ordenação:** Ordenação alfabética por título ou autor.
- [x] **Remoção de Livros:** Exclusão de exemplares com atualização de persistência.
- [x] **Separação por Estante:** Divisão por Estantes A-1, A-2 e A-3 em estrita ordem alfabética.
- [x] **Sistema de Notificações de Atraso:** Cálculo de dias excedentes e geração de comunicado formal ao leitor.
- [x] **Subclassificação Escolar:** Separação por Alunos (Série, Turma, Turno), Professores, Servidores e Comunidade.
- [x] **Gestão de Assistentes:** Adicionar e remover bibliotecárias sob coordenação de Ada Melo.
- [x] **Exportação Multiformato:** Emissão de PDF oficial com cabeçalho timbrado, CSV/Excel, XML estruturado e backup JSON.
- [x] **Integração com API de Livros:** Consulta ao Google Books para enriquecimento de metadados.
