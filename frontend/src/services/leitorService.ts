import { api } from "@/utils/api";
import { Leitor, CreateLeitorDTO, UpdateLeitorDTO } from "@/models/leitor";

export const getLeitores = async (): Promise<Leitor[]> => {
  try {
    const res = await api.get("/leitores");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao buscar leitores");
  }
};

export const getLeitorByCPF = async (cpf: string): Promise<Leitor | null> => {
  try {
    const res = await api.get(`/leitores/cpf/${cpf}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao buscar leitor pelo cpf informado");
  }
};


export const createLeitor = async (leitor: CreateLeitorDTO): Promise<Leitor> => {
  try {
    const res = await api.post("/leitores", { leitor });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao criar leitor");
  }
};

export const updateLeitor = async (id: number, leitor: UpdateLeitorDTO): Promise<Leitor> => {
  try {
    const res = await api.put(`/leitores/${id}`, { leitor });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao atualizar leitor");
  }
};

export const deleteLeitor = async (id: number): Promise<void> => {
  try {
    await api.delete(`/leitores/${id}`);
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao deletar leitor");
  }
};
