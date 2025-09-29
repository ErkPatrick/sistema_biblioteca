"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/utils/api";

export default function ResetSenhaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Token inválido ou expirado.</p>
      </div>
    );
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (password !== passwordConfirmation) {
      toast.error("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      await api.patch("/usuarios/recuperar_senha", {
        usuario: {
          password,
          password_confirmation: passwordConfirmation,
          reset_password_token: token,
        },
      });

      toast.success("Senha alterada com sucesso!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.errors?.[0] || "Erro ao resetar a senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Resetar Senha</h1>

        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Alterando..." : "Alterar senha"}
        </button>
      </form>
    </div>
  );
}
