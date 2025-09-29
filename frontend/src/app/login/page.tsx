"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/models/auth";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { loginUser, forgotPassword } from "@/services/authServices";

export default function LoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    logout();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);
      login(data.usuario, data.token);

      if (data.usuario.senha_provisoria) {
        router.push("/login/trocar-senha-provisoria");
      } else {
        toast.success(`${data.usuario.nome}, bem-vindo ao sistema!`);
        router.push("/home");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!form.email) {
      toast.error("Informe seu email para recuperar a senha");
      return;
    }

    setForgotLoading(true);
    try {
      await forgotPassword({ email: form.email });
      toast.success("Instruções de recuperação enviadas para seu email");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setForgotLoading(false);
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

        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={forgotLoading}
          className="text-blue-500 mt-2 underline text-center hover:cursor-pointer"
        >
          {forgotLoading ? "Enviando..." : "Esqueci minha senha"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}
