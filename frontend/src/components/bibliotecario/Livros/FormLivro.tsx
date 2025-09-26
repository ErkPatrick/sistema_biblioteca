"use client";

import { useState, useEffect } from "react";
import { Livro } from "@/models/livro";
import { createLivro, updateLivro } from "@/services/livrosService";
import { toast } from "sonner";

interface FormLivroProps {
    livroSelecionado?: Livro;
    onClose: () => void;
    onSave: () => void; // Para atualizar a lista no componente pai
}

export default function FormLivro({ livroSelecionado, onClose, onSave }: FormLivroProps) {
    const [form, setForm] = useState<Partial<Livro>>({
        titulo: "",
        autor: "",
        categoria: "",
        publicado_em: "",
    });

    useEffect(() => {
        if (livroSelecionado) {
            setForm(livroSelecionado);
        }
    }, [livroSelecionado]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (livroSelecionado) {
                await updateLivro(livroSelecionado.id, form);
                toast.success("Livro atualizado com sucesso!");
            } else {
                await createLivro(form);
                toast.success("Livro criado com sucesso!");
            }
            onSave();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao salvar livro");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-lg w-96 flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold">{livroSelecionado ? "Editar Livro" : "Novo Livro"}</h2>

                <input
                    type="text"
                    placeholder="Título"
                    value={form.titulo || ""}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="text"
                    placeholder="Autor"
                    value={form.autor || ""}
                    onChange={(e) => setForm({ ...form, autor: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="text"
                    placeholder="Categoria"
                    value={form.categoria || ""}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="date"
                    placeholder="Publicado em"
                    value={form.publicado_em || ""}
                    onChange={(e) => setForm({ ...form, publicado_em: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <div className="flex justify-end gap-2">
                    <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                        {livroSelecionado ? "Atualizar" : "Salvar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
