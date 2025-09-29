import { api } from "@/utils/api";
import { Usuario, CreateUsuarioDTO, UpdateUsuarioDTO } from "@/models/usuario";

export const getUsuarios = async (): Promise<Usuario[]> => {
    try {
        const res = await api.get("/usuarios");
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao buscar usuários");
    }
};

export const createUsuario = async (usuario: CreateUsuarioDTO): Promise<Usuario> => {
    try {
        const res = await api.post("/usuarios", { usuario });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao criar usuário");
    }
};

export const updateUsuario = async (id: number, usuario: UpdateUsuarioDTO): Promise<Usuario> => {
    try {
        const res = await api.put(`/usuarios/${id}`, { usuario });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao atualizar usuário");
    }
};



export const deleteUsuario = async (id: number): Promise<void> => {
    try {
        await api.delete(`/usuarios/${id}`);
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao deletar usuário");
    }
};
