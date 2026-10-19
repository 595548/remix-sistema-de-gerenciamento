# PRD - Documento de Requisitos do Produto
## Sistema de Cadastro de Biblioteca Valdiva Colaço
**EMEF Desembargador Pedro de Queiroz**  
**Projeto:** Xenia Cardoso  
**Ano:** 2026  
**Bibliotecária Responsável:** Ada Melo  

---

### 1. Visão Geral e Contexto
O presente sistema foi concebido para modernizar e organizar a gestão do acervo físico e o fluxo operacional da Biblioteca Valdiva Colaço, pertencente à EMEF Desembargador Pedro de Queiroz. A solução atende tanto às necessidades acadêmicas do curso de desenvolvimento de software em Python quanto à rotina real de catalogação da bibliotecária Ada Melo e seus assistentes.

### 2. Objetivos Principais
1. **Catalogação Oficial:** Registro e controle dos 166 títulos reais inventariados nas Estantes A-1, A-2 e A-3, sem dados fictícios.
2. **Subclassificação dos Usuários:**
   - **Alunos e Alunas:** Identificados obrigatoriamente por Série (1º ao 9º ano), Turma (A, B, C, D) e Turno (Manhã, Tarde, Integral).
   - **Professores:** Controle por matrícula e disciplina.
   - **Servidores:** Identificação funcional.
   - **Comunidade:** Responsáveis e moradores do bairro.
3. **Gestão de Empréstimos e Devoluções:**
   - Controle de prazos (14 dias por padrão).
   - Identificação instantânea de atrasos com cálculo de dias em atraso.
   - Envio de notificações e avisos formais aos leitores com pendências.
4. **Organização por Estantes:**
   - Distribuição espacial (Estantes A-1, A-2, A-3).
   - Ordenação estritamente alfabética por título dentro de cada estante.
5. **Relatórios e Interoperabilidade:**
   - Exportação em PDF oficial timbrado para prestação de contas.
   - Planilhas CSV / Excel para análise de dados.
   - Formato XML válido e bem estruturado.
   - Formato JSON para persistência e backup em nuvem.
6. **Gestão de Bibliotecárias e Assistentes:**
   - Liderança de Ada Melo.
   - Capacidade de inclusão e exclusão de novos assistentes e alternância de operador.

---

### 3. Requisitos Não Funcionais
- **Design:** Paleta institucional nas cores Laranja e Azul; tipografia Montserrat.
- **Componentes:** Inclusão de botões padronizados: `[Confirmar]`, `[Voltar]`, `[Cancelar]`, `[Corrigir]`.
- **Segurança:** Uso de variáveis de ambiente (`.env`) para ocultar chaves de API e garantir integridade no controle de versão Git.
- **Portabilidade:** Empacotamento Docker e Docker Compose para execução consistente em qualquer ambiente.
