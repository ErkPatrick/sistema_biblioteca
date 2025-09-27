"use client";

import { useEffect, useState } from "react";
import { Livro } from "@/models/livro";
import { getLivros, deleteLivro } from "@/services/livroService";
import FormLivro from "./FormLivro";
import { toast } from "sonner";

export default function Livros() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedLivro, setSelectedLivro] = useState<Livro | undefined>();

    const fetchLivros = async () => {
        try {
            const data = await getLivros();
            setLivros(data);
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao carregar livros");
        }
    };

    useEffect(() => {
        fetchLivros();
    }, []);

    const handleEdit = (livro: Livro) => {
        setSelectedLivro(livro);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Deseja realmente excluir este livro?")) return;
        try {
            await deleteLivro(id);
            toast.success("Livro excluído com sucesso!");
            fetchLivros();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao excluir livro");
        }
    };

    return (
        <div>
            <button
                onClick={() => {
                    setSelectedLivro(undefined);
                    setShowForm(true);
                }}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
            >
                Novo Livro
            </button>

            <table className="w-full border">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Título</th>
                        <th className="p-2 border">Autor</th>
                        <th className="p-2 border">Categoria</th>
                        <th className="p-2 border">Publicado em</th>
                        <th className="p-2 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro) => (
                        <tr key={livro.id}>
                            <td className="p-2 border">{livro.titulo}</td>
                            <td className="p-2 border">{livro.autor}</td>
                            <td className="p-2 border">{livro.categoria}</td>
                            <td className="p-2 border">{livro.publicado_em}</td>
                            <td className="p-2 border flex gap-2">
                                <button
                                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                                    onClick={() => handleEdit(livro)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                    onClick={() => handleDelete(livro.id)}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <FormLivro
                    livroSelecionado={selectedLivro}
                    onClose={() => setShowForm(false)}
                    onSave={fetchLivros}
                />
            )}
        </div>
    );
}
