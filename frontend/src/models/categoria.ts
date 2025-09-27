export interface Categoria {
  id: number;
  nome: string;
  created_at: string;
  updated_at: string;
}

export type CreateCategoriaDTO = {
  nome: string;
};

export type UpdateCategoriaDTO = {
  nome: string;
};
