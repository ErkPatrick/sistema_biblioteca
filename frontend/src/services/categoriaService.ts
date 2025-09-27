import { Categoria, CreateCategoriaDTO, UpdateCategoriaDTO } from "@/models/categoria";
import { api } from "@/utils/api";

export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const res = await api.get("/categorias");
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao buscar categorias");
    }
};

export const createCategoria = async (
    categoria: CreateCategoriaDTO
): Promise<Categoria> => {
    try {
        const res = await api.post("/categorias", { categoria });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao criar categoria");
    }
};

export const updateCategoria = async (
    id: number,
    categoria: UpdateCategoriaDTO
): Promise<Categoria> => {
    try {
        const res = await api.put(`/categorias/${id}`, { categoria });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao atualizar categoria");
    }
};

export const deleteCategoria = async (id: number): Promise<void> => {
    try {
        await api.delete(`/categorias/${id}`);
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao excluir categoria");
    }
};
