"use client";

import { useState } from "react";
import { Livro } from "@/models/livro";
import { useAuth } from "@/context/AuthContext";
import { createEmprestimo } from "@/services/emprestimoService";
import { getLeitorByCPF } from "@/services/leitorService";
import { toast } from "sonner";
import { IMaskInput } from "react-imask";

interface FormEmprestimoProps {
    livro: Livro;
    onClose: () => void;
    onSave: () => void;
}

export default function FormEmprestimo({ livro, onClose, onSave }: FormEmprestimoProps) {
    const { usuario } = useAuth();

    const [cpf, setCpf] = useState("");
    const [senhaEmprestimo, setSenhaEmprestimo] = useState("");
    const [leitor, setLeitor] = useState<any | null>(null);
    const [leitorValido, setLeitorValido] = useState(false);
    const [loading, setLoading] = useState(false);

    const validarLeitor = async () => {
        if (!cpf || !senhaEmprestimo) return toast.error("Digite CPF e senha de empréstimo");

        setLoading(true);
        try {
            const leitorData = await getLeitorByCPF(cpf);
            if (!leitorData) throw new Error("Leitor não encontrado");

            if (leitorData.senha_emprestimo !== senhaEmprestimo) {
                toast.error("Senha de empréstimo inválida");
                setLeitorValido(false);
                setLeitor(null);
            } else {
                setLeitor(leitorData);
                setLeitorValido(true);
                toast.success(`Leitor ${leitorData.nome_completo} validado!`);
            }
        } catch (err: any) {
            toast.error(err.message || "Erro ao buscar leitor pelo CPF informado");
            setLeitorValido(false);
            setLeitor(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leitorValido || !usuario) return;

        setLoading(true);
        try {
            await createEmprestimo({
                livro_id: livro.id,
                leitor_id: leitor.id,
            });
            toast.success("Empréstimo realizado com sucesso!");
            onSave();
        } catch (err: any) {
            toast.error(err.message || "Erro ao criar empréstimo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-auto z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold text-center">Empréstimo de Livro</h2>

                <label className="flex flex-col">
                    Livro
                    <input type="text" value={livro.titulo} disabled className="border p-2 rounded bg-gray-100" />
                </label>

                <label className="flex flex-col">
                    Bibliotecário
                    <input
                        type="text"
                        value={usuario?.nome || ""}
                        disabled
                        className="border p-2 rounded bg-gray-100"
                    />
                </label>

                <label className="flex flex-col">
                    Data de Empréstimo
                    <input type="text" value={new Date().toLocaleDateString()} disabled className="border p-2 rounded bg-gray-100" />
                </label>

                <label className="flex flex-col">
                    Data de Devolução Prevista
                    <input type="text" value={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()} disabled className="border p-2 rounded bg-gray-100" />
                </label>

                <div className="flex flex-col">
                    <label className="mb-1 font-semibold">CPF do Leitor</label>
                    <IMaskInput
                        mask="000.000.000-00"
                        value={cpf}
                        onAccept={(val: any) => setCpf(val)}
                        className="border p-3 rounded w-full"
                        placeholder="000.000.000-00"
                        required
                    />
                </div>


                <label className="flex flex-col">
                    Senha de Empréstimo
                    <input
                        type="password"
                        value={senhaEmprestimo}
                        onChange={e => setSenhaEmprestimo(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                </label>

                <button
                    type="button"
                    onClick={validarLeitor}
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Validar Leitor
                </button>

                <button
                    type="submit"
                    disabled={!leitorValido || loading}
                    title={!leitorValido ? "Valide o leitor primeiro" : ""}
                    className={`py-2 rounded text-white ${leitorValido ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {loading ? "Salvando..." : "Confirmar Empréstimo"}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
