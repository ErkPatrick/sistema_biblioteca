"use client"

import { useAuth } from "@/context/AuthContext";
import { UpdatePasswordRequest, UpdatePasswordResponse } from "@/models/auth";
import { updatePassword } from "@/services/authServices";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TrocarSenhaProvisoriaPage() {
    const router = useRouter();
    const { usuario } = useAuth();
    const [form, setForm] = useState<UpdatePasswordRequest>({
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if(usuario == null){
                toast.error("Usuário não encontrado.")
                router.push("/login");
                return;
            }
            const data = await updatePassword(usuario.id, form);
            
            toast.success(data.message);

            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleUpdatePassword}
                className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-center">Alterar Senha</h1>
                <p>Troque sua senha provisória por uma definitiva</p>
                <input
                    type="password"
                    placeholder="Nova senha"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    {loading ? "Atualizando..." : "Atualizar Senha"}
                </button>

                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </div>
    );
}