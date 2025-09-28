"use client";

import { useState, useEffect } from "react";
import { Usuario } from "@/models/usuario";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "@/services/usuarioService";
import FormUsuario from "./FormUsuario";
import { toast } from "sonner";
import ConfirmModal from "../../ConfirmModal";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
    const [filterNome, setFilterNome] = useState("");
    const [filterRole, setFilterRole] = useState<"bibliotecario" | "admin" | "">("");

    const loadUsuarios = async () => {
        try {
            const data = await getUsuarios();
            setUsuarios(data);
            setFilteredUsuarios(data);
        } catch (err: any) {
            toast.error(err.message || "Erro ao carregar usuários");
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    // Aplica filtros sempre que o nome ou role mudar
    useEffect(() => {
        const filtered = usuarios.filter(u =>
            u.nome.toLowerCase().includes(filterNome.toLowerCase()) &&
            (filterRole === "" || u.role === filterRole)
        );
        setFilteredUsuarios(filtered);
    }, [filterNome, filterRole, usuarios]);

    const handleSaveUsuario = async (data: any, id?: number) => {
        try {
            if (id) {
                await updateUsuario(id, data);
                toast.success("Usuário atualizado com sucesso!");
            } else {
                await createUsuario(data);
                toast.success("Usuário criado com sucesso!");
            }
            setIsFormModalOpen(false);
            setSelectedUsuario(null);
            loadUsuarios();
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar usuário");
        }
    };

    const handleDeleteUsuario = async () => {
        if (!usuarioToDelete) return;
        try {
            await deleteUsuario(usuarioToDelete.id);
            toast.success("Usuário deletado com sucesso!");
            setIsConfirmModalOpen(false);
            setUsuarioToDelete(null);
            loadUsuarios();
        } catch (err: any) {
            toast.error(err.message || "Erro ao deletar usuário");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Usuários</h1>

            <div className="flex items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filtrar por nome"
                    value={filterNome}
                    onChange={(e) => setFilterNome(e.target.value)}
                    className="border p-2 rounded w-64"
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as "bibliotecario" | "admin" | "")}
                    className="border p-2 rounded"
                >
                    <option value="">Todas as Roles</option>
                    <option value="bibliotecario">Bibliotecário</option>
                    <option value="admin">Admin</option>
                </select>

                <button
                    onClick={() => setIsFormModalOpen(true)}
                    className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Adicionar Usuário
                </button>
            </div>

            <table className="w-full border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border border-gray-300">Nome</th>
                        <th className="p-2 border border-gray-300">E-mail</th>
                        <th className="p-2 border border-gray-300">Role</th>
                        <th className="p-2 border border-gray-300">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsuarios.map((u) => (
                        <tr key={u.id} className="border-b border-gray-300 text-center">
                            <td className="p-2 border border-gray-300">{u.nome}</td>
                            <td className="p-2 border border-gray-300">{u.email}</td>
                            <td className="p-2 border border-gray-300">{u.role}</td>
                            <td className="p-2 border border-gray-300 flex justify-center gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedUsuario(u);
                                        setIsFormModalOpen(true);
                                    }}
                                    className="px-2 py-1 bg-yellow-400 text-white rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        setUsuarioToDelete(u);
                                        setIsConfirmModalOpen(true);
                                    }}
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredUsuarios.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-2 text-center">
                                Nenhum usuário encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isFormModalOpen && (
                <FormUsuario
                    usuario={selectedUsuario}
                    onClose={() => {
                        setIsFormModalOpen(false);
                        setSelectedUsuario(null);
                    }}
                    onSave={handleSaveUsuario}
                />
            )}

            {isConfirmModalOpen && usuarioToDelete && (
                <ConfirmModal
                    message={`Deseja realmente deletar o usuário ${usuarioToDelete.nome}?`}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleDeleteUsuario}
                />
            )}
        </div>
    );
}
