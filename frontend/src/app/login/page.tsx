"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest, LoginResponse } from "@/models/auth";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { toast } from "sonner";
import { loginUser } from "@/services/authServices";

export default function LoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //limpo o contexto de login ao entrar nessa parte
  useEffect(() => {
    logout()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);

      // Salvar no contexto
      login(data.usuario, data.token);

      if (data.usuario.senha_provisoria) {
        router.push("/login/trocar-senha-provisoria");
      }
      else {
        toast.success(`${data.usuario.nome}, bem-vindo ao sistema!`)
        router.push("/home");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <Link className="flex justify-center text-blue-500 hover:underline" href={"/registrar"}>Não tem uma conta?</Link>
      </form>
    </div>
  );
}
