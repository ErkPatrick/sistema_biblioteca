import { api } from "@/utils/api";
import { Emprestimo, CreateEmprestimoDTO } from "@/models/emprestimo";

export const getEmprestimos = async (): Promise<Emprestimo[]> => {
  try {
    const res = await api.get("/emprestimos");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao buscar empréstimos");
  }
};

export const createEmprestimo = async (emprestimo: CreateEmprestimoDTO): Promise<Emprestimo> => {
  try {
    const res = await api.post("/emprestimos", { emprestimo });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao criar empréstimo");
  }
};

export const deleteEmprestimo = async (id: number): Promise<void> => {
  try {
    await api.delete(`/emprestimos/${id}`);
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao deletar empréstimo");
  }
};

export const renovarEmprestimo = async (id: number, senha: string): Promise<Emprestimo> => {
  try {
    const res = await api.post(`/emprestimos/${id}/renovar`, { senha_emprestimo: senha });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao renovar empréstimo");
  }
};

export const devolverEmprestimo = async (id: number, senha: string): Promise<Emprestimo> => {
  try {
    const res = await api.post(`/emprestimos/${id}/devolver`, { senha_emprestimo: senha });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Erro ao devolver empréstimo");
  }
};
