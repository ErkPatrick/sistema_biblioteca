export interface Emprestimo {
  id: number;
  usuario_id: number;
  livro_id: number;
  leitor_id: number;
  status: string;
  data_emprestimo: string;
  data_devolucao_prevista: string;
  data_devolucao_real?: string | null;
  valor_multa?: number;
  livro: { titulo: string };
  leitor: { nome_completo: string };
  renovado: boolean;
}


export interface CreateEmprestimoDTO {
  livro_id: number;
  leitor_id: number;
}


