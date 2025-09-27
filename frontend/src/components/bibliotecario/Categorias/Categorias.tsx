"use client";

import { useEffect, useState } from "react";
import { Categoria } from "@/models/categoria";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "@/services/categoriaService";
import FormCategoria from "./FormCategoria";
import { toast } from "sonner";
import ConfirmModal from "../../ConfirmModal";

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

    const loadCategorias = async () => {
        try {
            const data = await getCategorias();
            setCategorias(data);
        } catch (err: any) {
            toast.error(err.message || "Erro ao carregar categorias");
        }
    };

    useEffect(() => {
        loadCategorias();
    }, []);

    const handleSaveCategoria = async (nome: string, id?: number) => {
        try {
            let data;
            if (id) {
                data = await updateCategoria(id, { nome });
                toast.success("Categoria atualizada com sucesso!");
            } else {
                data = await createCategoria({ nome });
                toast.success("Categoria criada com sucesso!");
            }

            setIsFormModalOpen(false);
            setSelectedCategoria(null);
            loadCategorias();
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar categoria");
        }
    };

    const handleDeleteCategoria = async () => {
        if (!categoriaToDelete) return;

        try {
            await deleteCategoria(categoriaToDelete.id);
            toast.success("Categoria deletada com sucesso!");
            setIsConfirmModalOpen(false);
            setCategoriaToDelete(null);
            loadCategorias();
        } catch (err: any) {
            toast.error(err.message || "Erro ao deletar categoria");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Categorias</h1>
            <button
                onClick={() => setIsFormModalOpen(true)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Adicionar Categoria
            </button>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Nome</th>
                        <th className="p-2 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((cat) => (
                        <tr key={cat.id} className="border-b">
                            <td className="p-2">{cat.nome}</td>
                            <td className="p-2 flex gap-2">
                                <button
                                    onClick={() => { setSelectedCategoria(cat); setIsFormModalOpen(true); }}
                                    className="px-2 py-1 bg-yellow-400 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => { setCategoriaToDelete(cat); setIsConfirmModalOpen(true); }}
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isFormModalOpen && (
                <FormCategoria
                    categoria={selectedCategoria}
                    onClose={() => { setIsFormModalOpen(false); setSelectedCategoria(null); }}
                    onSave={handleSaveCategoria}
                />
            )}

            {isConfirmModalOpen && categoriaToDelete && (
                <ConfirmModal
                    message={`Deseja realmente deletar a categoria "${categoriaToDelete.nome}"?`}
                    onConfirm={handleDeleteCategoria}
                    onCancel={() => setIsConfirmModalOpen(false)}
                />
            )}
        </div>
    );
}
