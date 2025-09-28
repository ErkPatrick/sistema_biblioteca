"use client";

import { useState, useEffect } from "react";
import { Usuario, CreateUsuarioDTO, UpdateUsuarioDTO } from "@/models/usuario";

interface FormUsuarioProps {
  usuario: Usuario | null;
  onClose: () => void;
  onSave: (data: CreateUsuarioDTO | UpdateUsuarioDTO, id?: number) => void;
}

export default function FormUsuario({ usuario, onClose, onSave }: FormUsuarioProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"bibliotecario" | "admin">("bibliotecario");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setRole(usuario.role);
      setPassword("");
      setPasswordConfirmation("");
    } else {
      setNome("");
      setEmail("");
      setRole("bibliotecario");
      setPassword("");
      setPasswordConfirmation("");
    }
  }, [usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario) {
      // Atualização
      onSave({ nome, email, role }, usuario.id);
    } else {
      // Criação
      onSave({
        nome,
        email,
        role,
        password,
        password_confirmation: passwordConfirmation,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">{usuario ? "Editar Usuário" : "Adicionar Usuário"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="flex flex-col">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>

                    {!usuario && (
            <>
              <div className="flex flex-col">
                <label>Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Confirme a Senha</label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </>
          )}

          <div className="flex flex-col">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "bibliotecario" | "admin")}
              className="border p-2 rounded w-full"
            >
              <option value="bibliotecario">Bibliotecário</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {usuario ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
