# Diretrizes de Design e Identidade Visual (design.md)
## Sistema de Cadastro da Biblioteca Valdiva Colaço
**EMEF Desembargador Pedro de Queiroz** | **Projeto:** Xenia Cardoso (2026)

---

### 1. Filosofia Visual e Cores
O design do sistema foi estruturado para refletir a seriedade institucional de uma instituição pública de ensino combinada com a vivacidade do ambiente infantojuvenil de leitura.

- **Cor Laranja (Ação / Alertas / Destaque):**
  - Laranja Primário: `#f97316` (Tailwind `orange-500`)
  - Laranja Interativo / Hover: `#ea580c` (Tailwind `orange-600`)
  - Laranja Claro (Fundo de Alertas): `#fff7ed` (Tailwind `orange-50`)
- **Cor Azul (Estrutural / Confiança / Leitura):**
  - Azul Institucional: `#1e40af` (Tailwind `blue-800`)
  - Azul Primário: `#2563eb` (Tailwind `blue-600`)
  - Azul Superfície Suave: `#eff6ff` (Tailwind `blue-50`)
- **Neutros de Alto Contraste:**
  - Fundo Geral: `#f8fafc` (Tailwind `slate-50`)
  - Tipografia Principal: `#0f172a` (Tailwind `slate-900`)
  - Bordas Sutis: `#e2e8f0` (Tailwind `slate-200`)

---

### 2. Tipografia
- **Família Tipográfica Principal:** Montserrat (Google Fonts)
  - Pesos ativos: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold).
- **Tipografia Numérica & Código:** JetBrains Mono / Monospace para Tombos (`tabular-nums`), anos e linhas do terminal.

---

### 3. Componentes de Ação Padronizados
Para garantir consistência cognitiva, todas as interfaces com formulários ou tomadas de decisão utilizam o conjunto de botões:
1. `[Confirmar]`: Ação primária de persistência (Verde esmeralda ou Azul escuro).
2. `[Voltar]`: Retorno à tela ou estado anterior sem alterações.
3. `[Cancelar]`: Fechamento imediato do diálogo ou descarte da operação.
4. `[Corrigir]`: Limpeza ou restauração dos dados aos valores padrão para novo preenchimento.

---

### 4. Responsividade e Ergonomia
- O sistema é 100% responsivo, adaptando-se a telas desktop (1440px), notebooks de atendimento e tablets móveis utilizados nas estantes da biblioteca.
