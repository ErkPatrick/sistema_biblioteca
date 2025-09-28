"use client";

import { useEffect, useState } from "react";
import { Categoria } from "@/models/categoria";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "@/services/categoriaService";
import FormCategoria from "./FormCategoria";
import { toast } from "sonner";
import ConfirmModal from "../../ConfirmModal";

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadCategorias = async () => {
        try {
            const data = await getCategorias();
            setCategorias(data);
            setFilteredCategorias(data);
        } catch (err: any) {
            toast.error(err.message || "Erro ao carregar categorias");
        }
    };

    useEffect(() => {
        loadCategorias();
    }, []);

    // Filtra categorias conforme o termo de busca
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredCategorias(
            categorias.filter((cat) => cat.nome.toLowerCase().includes(term))
        );
    }, [searchTerm, categorias]);

    const handleSaveCategoria = async (nome: string, id?: number) => {
        try {
            if (id) {
                await updateCategoria(id, { nome });
                toast.success("Categoria atualizada com sucesso!");
            } else {
                await createCategoria({ nome });
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

            {/* Campo de busca */}
            <input
                type="text"
                placeholder="Buscar categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            <button
                onClick={() => setIsFormModalOpen(true)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Adicionar Categoria
            </button>

            <table className="w-full border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border border-gray-300 w-3/4">Nome</th>
                        <th className="p-2 border border-gray-300">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategorias.map((cat) => (
                        <tr key={cat.id} className="border-b border-gray-300 text-center">
                            <td className="p-2 border border-gray-300">{cat.nome}</td>
                            <td className="p-2 border border-gray-300 flex justify-center gap-2">
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
                    {filteredCategorias.length === 0 && (
                        <tr>
                            <td colSpan={2} className="p-4 text-center text-gray-500">
                                Nenhuma categoria encontrada.
                            </td>
                        </tr>
                    )}
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
