import { useState, useEffect } from "react";
import { Emprestimo } from "@/models/emprestimo";
import { getEmprestimos, deleteEmprestimo, renovarEmprestimo, devolverEmprestimo } from "@/services/emprestimoService";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import SenhaEmprestimoModal from "./SenhaEmprestimoModal";

export default function EmprestimosPage() {
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [emprestimoToDelete, setEmprestimoToDelete] = useState<number | null>(null);
    const [showSenhaModal, setShowSenhaModal] = useState(false);
    const [acao, setAcao] = useState<"devolver" | "renovar" | null>(null);
    const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Emprestimo | null>(null);

    const fetchEmprestimos = async () => {
        try {
            const data = await getEmprestimos();
            setEmprestimos(data);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchEmprestimos();
    }, []);

    /** Deletar empréstimo */
    const handleDelete = (id: number) => {
        setEmprestimoToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!emprestimoToDelete) return;
        setLoading(true);
        try {
            await deleteEmprestimo(emprestimoToDelete);
            toast.success("Empréstimo deletado com sucesso!");
            setEmprestimos(emprestimos.filter((e) => e.id !== emprestimoToDelete));
        } catch (err: any) {
            toast.error(err.message || "Erro ao deletar empréstimo");
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
            setEmprestimoToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setEmprestimoToDelete(null);
    };

    /** Abrir modal de senha antes de ação */
    const pedirSenha = (emprestimo: Emprestimo, tipoAcao: "devolver" | "renovar") => {
        setEmprestimoSelecionado(emprestimo);
        setAcao(tipoAcao);
        setShowSenhaModal(true);
    };

    /** Confirmar ação com senha */
    const confirmarAcaoComSenha = async (senha: string) => {
        if (!emprestimoSelecionado || !acao) return;

        setLoading(true);
        try {
            if (acao === "devolver") {
                await devolverEmprestimo(emprestimoSelecionado.id, senha);
                toast.success("Livro devolvido com sucesso!");
            } else if (acao === "renovar") {
                if (emprestimoSelecionado.renovado) {
                    toast.error("Este empréstimo já foi renovado!");
                } else {
                    await renovarEmprestimo(emprestimoSelecionado.id, senha);
                    toast.success("Prazo renovado em 15 dias!");
                }
            }
            fetchEmprestimos();
        } catch (err: any) {
            toast.error(err.message || "Erro na operação");
        } finally {
            setLoading(false);
            setShowSenhaModal(false);
            setEmprestimoSelecionado(null);
            setAcao(null);
        }
    };

    const cancelarAcaoComSenha = () => {
        setShowSenhaModal(false);
        setEmprestimoSelecionado(null);
        setAcao(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Empréstimos</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="text-center">
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Livro</th>
                        <th className="px-4 py-2 border">Leitor</th>
                        <th className="px-4 py-2 border">Status</th>
                        <th className="px-4 py-2 border">Data Empréstimo</th>
                        <th className="px-4 py-2 border">Devolução Prevista</th>
                        <th className="px-4 py-2 border">Devolução Real</th>
                        <th className="px-4 py-2 border">Valor Multa</th>
                        <th className="px-4 py-2 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {emprestimos.map((e) => (
                        <tr key={e.id} className="text-center">
                            <td className="px-4 py-2 border">{e.id}</td>
                            <td className="px-4 py-2 border">{e.livro.titulo}</td>
                            <td className="px-4 py-2 border">{e.leitor.nome_completo}</td>
                            <td className="px-4 py-2 border">{e.status}</td>
                            <td className="px-4 py-2 border">{new Date(e.data_emprestimo).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border">{new Date(e.data_devolucao_prevista).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border">{e.data_devolucao_real ? new Date(e.data_devolucao_real).toLocaleDateString() : "-"}</td>
                            <td className="px-4 py-2 border">{e.valor_multa ?? 0}</td>
                            <td className="px-4 py-2 border">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => pedirSenha(e, "devolver")}
                                        disabled={!!e.data_devolucao_real}
                                        className={`px-2 py-1 rounded text-white ${e.data_devolucao_real ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                                    >
                                        Devolver
                                    </button>
                                    <button
                                        onClick={() => pedirSenha(e, "renovar")}
                                        disabled={!!e.data_devolucao_real}
                                        className={`px-2 py-1 rounded text-white ${e.data_devolucao_real ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                                    >
                                        Renovar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(e.id)}
                                        className="px-2 py-1 rounded text-white bg-red-500 hover:bg-red-600"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {emprestimos.length === 0 && (
                        <tr>
                            <td colSpan={9} className="py-4">
                                Nenhum empréstimo encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showConfirmModal && (
                <ConfirmModal
                    message="Tem certeza que deseja deletar este empréstimo?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            {showSenhaModal && (
                <SenhaEmprestimoModal
                    onConfirm={confirmarAcaoComSenha}
                    onCancel={cancelarAcaoComSenha}
                />
            )}
        </div>
    );
}
