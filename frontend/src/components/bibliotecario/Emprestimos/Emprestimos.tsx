import { useState, useEffect } from "react";
import { Emprestimo } from "@/models/emprestimo";
import {
    getEmprestimos,
    deleteEmprestimo,
    renovarEmprestimo,
    devolverEmprestimo,
    marcarPerdidoDanificado,
} from "@/services/emprestimoService";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import SenhaEmprestimoModal from "./SenhaEmprestimoModal";

export default function EmprestimosPage() {
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [emprestimoToDelete, setEmprestimoToDelete] = useState<number | null>(null);
    const [showSenhaModal, setShowSenhaModal] = useState(false);
    const [acao, setAcao] = useState<"devolver" | "renovar" | "perdido" | null>(null);
    const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Emprestimo | null>(null);

    const [filtroLeitor, setFiltroLeitor] = useState("");
    const [filtroLivro, setFiltroLivro] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroDataInicio, setFiltroDataInicio] = useState("");
    const [filtroDataFim, setFiltroDataFim] = useState("");
    const [filtroMulta, setFiltroMulta] = useState("");

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

    const pedirSenha = (emprestimo: Emprestimo, tipoAcao: "devolver" | "renovar" | "perdido") => {
        setEmprestimoSelecionado(emprestimo);
        setAcao(tipoAcao);
        setShowSenhaModal(true);
    };

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
            } else if (acao === "perdido") {
                await marcarPerdidoDanificado(emprestimoSelecionado.id, senha);
                toast.success("Livro marcado como perdido/danificado! Multa de R$50 aplicada.");
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

    const emprestimosFiltrados = emprestimos.filter((e) => {
        const leitorMatch = e.leitor.nome_completo
            .toLowerCase()
            .includes(filtroLeitor.toLowerCase());
        const livroMatch = e.livro.titulo
            .toLowerCase()
            .includes(filtroLivro.toLowerCase());
        const statusMatch = filtroStatus ? e.status === filtroStatus : true;
        const multaMatch =
            filtroMulta === "sim"
                ? (e.valor_multa ?? 0) > 0
                : filtroMulta === "nao"
                    ? (e.valor_multa ?? 0) === 0
                    : true;

        let dataMatch = true;
        const emprestimoData = new Date(e.data_emprestimo);

        if (filtroDataInicio) {
            const inicio = new Date(filtroDataInicio);
            inicio.setHours(0, 0, 0, 0);
            if (emprestimoData < inicio) dataMatch = false;
        }

        if (filtroDataFim) {
            const fim = new Date(filtroDataFim);
            fim.setHours(23, 59, 59, 999);
            if (emprestimoData > fim) dataMatch = false;
        }


        return leitorMatch && livroMatch && statusMatch && multaMatch && dataMatch;
    });

    const resetarFiltros = () => {
        setFiltroLeitor("");
        setFiltroLivro("");
        setFiltroStatus("");
        setFiltroMulta("");
        setFiltroDataInicio("");
        setFiltroDataFim("");
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Empréstimos</h1>

            {/* filtros */}
            <div className="mb-4 p-4 border rounded grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Filtrar por nome do leitor"
                    value={filtroLeitor}
                    onChange={(e) => setFiltroLeitor(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <input
                    type="text"
                    placeholder="Filtrar por nome do livro"
                    value={filtroLivro}
                    onChange={(e) => setFiltroLivro(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">Todos os status</option>
                    <option value="emprestado">Emprestado</option>
                    <option value="devolvido dentro do prazo">
                        Devolvido dentro do prazo
                    </option>
                    <option value="devolvido com atraso">
                        Devolvido com atraso
                    </option>
                    <option value="perdido/danificado">
                        Perdido/Danificado
                    </option>
                </select>
                <div className="flex items-center gap-2">
                    <label>Data início(emprestimos):</label>
                    <input
                        type="date"
                        value={filtroDataInicio}
                        onChange={(e) => setFiltroDataInicio(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label>Data fim(emprestimos):</label>
                    <input
                        type="date"
                        value={filtroDataFim}
                        onChange={(e) => setFiltroDataFim(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>
                <select
                    value={filtroMulta}
                    onChange={(e) => setFiltroMulta(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">Multa (Todos)</option>
                    <option value="sim">Com multa</option>
                    <option value="nao">Sem multa</option>
                </select>
            </div>
            <button
                onClick={resetarFiltros}
                className="mb-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-700"
            >
                Resetar filtros
            </button>

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
                    {emprestimosFiltrados.map((e) => (
                        <tr key={e.id} className="text-center">
                            <td className="px-4 py-2 border">{e.id}</td>
                            <td className="px-4 py-2 border">{e.livro.titulo}</td>
                            <td className="px-4 py-2 border">{e.leitor.nome_completo}</td>
                            <td className="px-4 py-2 border">{e.status}</td>
                            <td className="px-4 py-2 border">
                                {new Date(e.data_emprestimo).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 border">
                                {new Date(e.data_devolucao_prevista).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 border">
                                {e.data_devolucao_real
                                    ? new Date(e.data_devolucao_real).toLocaleDateString()
                                    : "-"}
                            </td>
                            <td className="px-4 py-2 border">{e.valor_multa ?? 0}</td>
                            <td className="px-4 py-2 border">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => pedirSenha(e, "devolver")}
                                        disabled={!!e.data_devolucao_real || e.status === "perdido/danificado"}
                                        title={
                                            e.data_devolucao_real
                                                ? "O livro já foi devolvido"
                                                : ""
                                        }
                                        className={`px-2 py-1 rounded text-white ${e.data_devolucao_real
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                            }`}
                                    >
                                        Devolver
                                    </button>
                                    <button
                                        onClick={() => pedirSenha(e, "renovar")}
                                        disabled={!!e.data_devolucao_real || e.renovado || e.status === "perdido/danificado"}
                                        title={
                                            e.renovado
                                                ? "Já foi feita uma renovação"
                                                : ""
                                        }
                                        className={`px-2 py-1 rounded text-white ${e.data_devolucao_real || e.renovado
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600"
                                            }`}
                                    >
                                        Renovar
                                    </button>
                                    <button
                                        onClick={() => pedirSenha(e, "perdido")}
                                        disabled={!!e.data_devolucao_real || e.status === "perdido/danificado"}
                                        title={e.status === "perdido/danificado" ? "Livro já marcado como perdido/danificado" : ""}
                                        className={`px-2 py-1 rounded text-white ${!!e.data_devolucao_real || e.status === "perdido/danificado"
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-purple-500 hover:bg-purple-600"
                                            }`}
                                    >
                                        Perdido/Danificado
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
                    {emprestimosFiltrados.length === 0 && (
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
