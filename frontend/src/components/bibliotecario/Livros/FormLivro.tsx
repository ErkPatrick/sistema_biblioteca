"use client";

import { useState, useEffect } from "react";
import { Livro, CreateLivroDTO, UpdateLivroDTO } from "@/models/livro";
import { Categoria } from "@/models/categoria";
import { toast } from "sonner";

interface FormLivroProps {
    livro: Livro | null;
    categorias: Categoria[];
    onClose: () => void;
    onSave: (data: CreateLivroDTO | UpdateLivroDTO, id?: number, quantidade?: number) => void;
}

export default function FormLivro({ livro, categorias, onClose, onSave }: FormLivroProps) {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [observacoes, setObservacoes] = useState("");
    const [status, setStatus] = useState("disponível");
    const [quantidadeLivros, setQuantidadeLivros] = useState<number>(1);

    useEffect(() => {
        if (livro) {
            setTitulo(livro.titulo);
            setAutor(livro.autor);
            setCategoriaId(livro.categoria_id);
            setObservacoes(livro.observacoes);
            setStatus(livro.status);
        } else {
            setTitulo("");
            setAutor("");
            setCategoriaId(categorias.length > 0 ? categorias[0].id : 0);
            setObservacoes("");
            setStatus("disponível");
            setQuantidadeLivros(1);
        }
    }, [livro, categorias]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (livro) {
            const updateData: UpdateLivroDTO = {
                titulo,
                autor,
                categoria_id: categoriaId,
                observacoes,
                status,
            };
            onSave(updateData, livro.id);
        } else {
            const createData: CreateLivroDTO = {
                titulo,
                autor,
                categoria_id: categoriaId,
                observacoes,
            };
            if (quantidadeLivros > 0) {
                onSave(createData, undefined, quantidadeLivros)
            }
            else {
                toast.error("A quantidade de livros deve ser maior que 0")
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">{livro ? "Editar Livro" : "Adicionar Livro"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título do livro"
                        className="border p-2 rounded w-full"
                        required
                    />

                    <input
                        type="text"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                        placeholder="Autor do livro"
                        className="border p-2 rounded w-full"
                        required
                    />

                    <select
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(Number(e.target.value))}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value={0} disabled>Selecione uma categoria</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>

                    <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Observações"
                        className="border p-2 rounded w-full"
                    />

                    {livro && (
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="disponível">Disponível</option>
                            <option value="emprestado">Emprestado</option>
                            <option value="danificado/perdido">Danificado/Perdido</option>
                        </select>
                    )}
                    {!livro && (
                        <div>
                            <label htmlFor="campo_quantidade">Quantidade:</label>
                            <input
                                id="campo_quantidade"
                                type="text"
                                value={quantidadeLivros}
                                onChange={(e) => {
                                    const valor = e.target.value;
                                    if (/^\d*$/.test(valor)) { // só números
                                        setQuantidadeLivros(Number(valor));
                                    }
                                }}
                                placeholder="Quantidade de livros"
                                className="border p-2 rounded w-full"
                                required
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            {livro ? "Atualizar" : "Criar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
