import { api } from "@/utils/api";
import { CreateLivroDTO, Livro, UpdateLivroDTO } from "@/models/livro";

export const getLivros = async (): Promise<Livro[]> => {
    try {
        const res = await api.get("/livros");
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao buscar livros");
    }
};

export const createLivro = async (livro: CreateLivroDTO): Promise<Livro> => {
    try {
        const res = await api.post("/livros", { livro });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao criar livro");
    }
};

export const updateLivro = async (id: number, livro: UpdateLivroDTO): Promise<Livro> => {
    try {
        const res = await api.put(`/livros/${id}`, { livro });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao atualizar livro");
    }
};

export const deleteLivro = async (id: number): Promise<void> => {
    try {
        await api.delete(`/livros/${id}`);
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao excluir livro");
    }
};
