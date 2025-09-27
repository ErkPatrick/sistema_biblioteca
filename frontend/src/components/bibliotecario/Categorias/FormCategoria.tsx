"use client";

import { useState, useEffect } from "react";
import { Categoria } from "@/models/categoria";

interface FormCategoriaProps {
    categoria: Categoria | null;
    onClose: () => void;
    onSave: (nome: string, id?: number) => void;
}

export default function FormCategoria({ categoria, onClose, onSave }: FormCategoriaProps) {
    const [nome, setNome] = useState("");

    useEffect(() => {
        if (categoria) setNome(categoria.nome);
    }, [categoria]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(nome, categoria?.id);
    };

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">{categoria ? "Editar Categoria" : "Adicionar Categoria"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome da categoria"
                        className="border p-2 rounded w-full"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{categoria ? "Atualizar" : "Criar"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
