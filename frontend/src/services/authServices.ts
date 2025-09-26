import { api } from "@/utils/api";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UpdatePasswordRequest,
    UpdatePasswordResponse
} from "@/models/auth";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await api.post("/usuarios/login", { usuario: data });
        return response.data;
    }
    catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao fazer login");
    }
};

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await api.post("/usuarios", { usuario: data });
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao registrar usuário");
    }
};

export const updatePassword = async (
    id: number,
    data: UpdatePasswordRequest
): Promise<UpdatePasswordResponse> => {
    try {
        const response = await api.put(`/usuarios/${id}/update_password`, { usuario: data });
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.error || "Erro ao atualizar a senha");
    }
};
