export type UserCategory = 'aluno' | 'professor' | 'servidor' | 'comunidade';

export type ShiftType = 'Manhã' | 'Tarde' | 'Integral' | 'Noite';

export interface Reader {
  id: string;
  nome: string;
  categoria: UserCategory;
  // Campos específicos de Aluno:
  serie?: string; // ex: "6º Ano", "7º Ano"
  turma?: string; // ex: "A", "B", "C"
  turno?: ShiftType;
  // Outros dados
  matricula?: string;
  telefone?: string;
  email?: string;
  dataCadastro: string;
}

export type BookGenre =
  | 'Infantojuvenil'
  | 'Contos e Fábulas'
  | 'Poesia e Cordel'
  | 'Aventura e Clássicos'
  | 'Literatura Brasileira'
  | 'Biografia e Memórias'
  | 'Crônicas e Humor'
  | 'Teatro e Drama'
  | 'Outros';

export interface Book {
  id: string;
  tombo: string; // ex: "0001", "0002"
  titulo: string;
  autor: string;
  estante: string; // ex: "A-1", "A-2", "A-3"
  genero: BookGenre;
  ano: number;
  disponivel: 'Sim' | 'Não';
  sinopse?: string;
  isbn?: string;
  capaUrl?: string;
  dataCadastro: string;
}

export interface Loan {
  id: string;
  livroId: string;
  livroTitulo: string;
  livroTombo: string;
  leitorId: string;
  leitorNome: string;
  leitorCategoria: UserCategory;
  leitorTurma?: string;
  dataEmprestimo: string; // YYYY-MM-DD
  dataDevolucaoPrevista: string; // YYYY-MM-DD
  dataDevolucaoReal?: string;
  status: 'ativo' | 'devolvido' | 'atrasado';
  bibliotecariaResponsavel: string;
  notificacoesEnviadas: number;
  observacoes?: string;
}

export interface Assistant {
  id: string;
  nome: string;
  cargo: string;
  turno: string;
  ativo: boolean;
  isHeadLibrarian?: boolean;
}

export interface NotificationRecord {
  id: string;
  loanId: string;
  leitorNome: string;
  livroTitulo: string;
  diasAtraso: number;
  mensagem: string;
  dataEnvio: string;
}
