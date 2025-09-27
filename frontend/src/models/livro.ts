export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria_id: number;
  status: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLivroDTO{
  titulo: string;
  autor: string;
  categoria_id: number;
  observacoes: string;
}

export interface UpdateLivroDTO{
  titulo: string;
  autor: string;
  categoria_id: number;
  observacoes: string;
  status: string;
}

export interface UpdateStatusLivroDTO{
  status: string;
} 
