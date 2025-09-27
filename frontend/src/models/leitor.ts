export interface Endereco {
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Leitor {
  id: number;
  nome_completo: string;
  cpf: string;
  email?: string;
  telefone?: string;
  senha_emprestimo: string;
  endereco: Endereco;
  created_at: string;
  updated_at: string;
}

export interface CreateLeitorDTO {
  nome_completo: string;
  cpf: string;
  email?: string;
  telefone?: string;
  endereco: Endereco;
}

export interface UpdateLeitorDTO {
  nome_completo: string;
  cpf: string;
  email?: string;
  telefone?: string;
  endereco: Endereco;
}
