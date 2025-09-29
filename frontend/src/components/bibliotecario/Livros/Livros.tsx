"use client";

import { useEffect, useState } from "react";
import { Livro, CreateLivroDTO, UpdateLivroDTO } from "@/models/livro";
import { Categoria } from "@/models/categoria";
import { getLivros, createLivro, updateLivro, deleteLivro } from "@/services/livroService";
import { getCategorias } from "@/services/categoriaService";
import FormLivro from "./FormLivro";
import FormEmprestimo from "./FormEmprestimo";
import { toast } from "sonner";
import ConfirmModal from "../../ConfirmModal";

export default function LivrosPage() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [filteredLivros, setFilteredLivros] = useState<Livro[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [selectedLivro, setSelectedLivro] = useState<Livro | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [livroToDelete, setLivroToDelete] = useState<Livro | null>(null);
    const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);

    // Filtros
    const [searchTitulo, setSearchTitulo] = useState("");
    const [searchAutor, setSearchAutor] = useState("");
    const [filterCategoria, setFilterCategoria] = useState<number | "">("");
    const [filterStatus, setFilterStatus] = useState<string>("");

    const loadData = async () => {
        try {
            const [livrosData, categoriasData] = await Promise.all([getLivros(), getCategorias()]);
            setLivros(livrosData);
            setFilteredLivros(livrosData);
            setCategorias(categoriasData);
        } catch (err: any) {
            toast.error(err.message || "Erro ao carregar dados");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let temp = [...livros];
        if (searchTitulo) temp = temp.filter(l => l.titulo.toLowerCase().includes(searchTitulo.toLowerCase()));
        if (searchAutor) temp = temp.filter(l => l.autor.toLowerCase().includes(searchAutor.toLowerCase()));
        if (filterCategoria) temp = temp.filter(l => l.categoria_id === filterCategoria);
        if (filterStatus) temp = temp.filter(l => l.status.toLowerCase() === filterStatus.toLowerCase());
        setFilteredLivros(temp);
    }, [searchTitulo, searchAutor, filterCategoria, filterStatus, livros]);

    const handleSaveLivro = async (data: CreateLivroDTO | UpdateLivroDTO, id?: number, quantidade?: number) => {
        try {
            if (id) {
                await updateLivro(id, data as UpdateLivroDTO);
                toast.success("Livro atualizado com sucesso!");
            } else {
                for (let i = 0; i < quantidade!; i++) {
                    await createLivro(data as CreateLivroDTO);
                }
                toast.success(`${quantidade} Livro(s) criado(s) com sucesso!`);
            }
            setIsFormModalOpen(false);
            setSelectedLivro(null);
            loadData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar livro");
        }
    };

    const handleDeleteLivro = async () => {
        if (!livroToDelete) return;
        try {
            await deleteLivro(livroToDelete.id);
            toast.success("Livro deletado com sucesso!");
            setIsConfirmModalOpen(false);
            setLivroToDelete(null);
            loadData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao deletar livro");
        }
    };

    const getCategoriaNome = (categoriaId: number) => {
        const categoria = categorias.find(c => c.id === categoriaId);
        return categoria ? categoria.nome : "Sem categoria";
    };

    const resetarFiltros = () => {
        setSearchTitulo("");
        setSearchAutor("");
        setFilterCategoria("");
        setFilterStatus("");
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Livros</h1>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por título"
                    value={searchTitulo}
                    onChange={e => setSearchTitulo(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:w-1/4"
                />
                <input
                    type="text"
                    placeholder="Buscar por autor"
                    value={searchAutor}
                    onChange={e => setSearchAutor(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:w-1/4"
                />
                <select
                    value={filterCategoria}
                    onChange={e => setFilterCategoria(e.target.value ? Number(e.target.value) : "")}
                    className="p-2 border border-gray-300 rounded w-full md:w-1/4"
                >
                    <option value="">Todas as categorias</option>
                    {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                </select>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:w-1/4"
                >
                    <option value="">Todos os status</option>
                    <option value="disponível">Disponível</option>
                    <option value="emprestado">Emprestado</option>
                    <option value="danificado/perdido">Danificado/Perdido</option>
                </select>
            </div>
            <div className="flex justify-between">
                <button
                    onClick={() => setIsFormModalOpen(true)}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Adicionar Livro
                </button>

                <button
                    onClick={resetarFiltros}
                    className="mb-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-700"
                >
                    Resetar filtros
                </button>
            </div>

            <table className="w-full border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border border-gray-300">Id</th>
                        <th className="p-2 border border-gray-300">Título</th>
                        <th className="p-2 border border-gray-300">Autor</th>
                        <th className="p-2 border border-gray-300">Categoria</th>
                        <th className="p-2 border border-gray-300">Status</th>
                        <th className="p-2 border border-gray-300">Observações</th>
                        <th className="p-2 border border-gray-300">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLivros.map(livro => (
                        <tr key={livro.id} className="border-b border-gray-300 text-center">
                            <td className="p-2 border border-gray-300">{livro.id}</td>
                            <td className="p-2 border border-gray-300">{livro.titulo}</td>
                            <td className="p-2 border border-gray-300">{livro.autor}</td>
                            <td className="p-2 border border-gray-300">{getCategoriaNome(livro.categoria_id)}</td>
                            <td className="p-2 border border-gray-300">{livro.status}</td>
                            <td className="p-2 border border-gray-300">{livro.observacoes}</td>
                            <td className="p-2 border border-gray-300 flex justify-around">
                                <button
                                    onClick={() => {
                                        setSelectedLivro(livro);
                                        setIsEmprestimoModalOpen(true);
                                    }}
                                    className={`px-2 py-1 rounded text-white ${livro.status === "emprestado" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                                    disabled={livro.status === "emprestado"}
                                    title={livro.status === "emprestado" ? "Livro já emprestado" : ""}
                                >
                                    Emprestar
                                </button>

                                <button
                                    onClick={() => { setSelectedLivro(livro); setIsFormModalOpen(true); }}
                                    className="px-2 py-1 bg-yellow-400 rounded"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => { setLivroToDelete(livro); setIsConfirmModalOpen(true); }}
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredLivros.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500">Nenhum livro encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isFormModalOpen && (
                <FormLivro
                    livro={selectedLivro}
                    categorias={categorias}
                    onClose={() => { setIsFormModalOpen(false); setSelectedLivro(null); }}
                    onSave={handleSaveLivro}
                />
            )}

            {isConfirmModalOpen && livroToDelete && (
                <ConfirmModal
                    message={`Deseja realmente deletar o livro "${livroToDelete.titulo}"?`}
                    onConfirm={handleDeleteLivro}
                    onCancel={() => setIsConfirmModalOpen(false)}
                />
            )}

            {isEmprestimoModalOpen && selectedLivro && (
                <FormEmprestimo
                    livro={selectedLivro}
                    onClose={() => setIsEmprestimoModalOpen(false)}
                    onSave={() => {
                        setIsEmprestimoModalOpen(false);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
