import { api } from "@/utils/api";
import { Livro } from "@/models/livro";

export const getLivros = async (): Promise<Livro[]> => {
  const res = await api.get("/livros");
  return res.data;
};

export const createLivro = async (livro: Partial<Livro>): Promise<Livro> => {
  const res = await api.post("/livros", { livro });
  return res.data;
};

export const updateLivro = async (id: number, livro: Partial<Livro>): Promise<Livro> => {
  const res = await api.put(`/livros/${id}`, { livro });
  return res.data;
};

export const deleteLivro = async (id: number): Promise<void> => {
  await api.delete(`/livros/${id}`);
};
