"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest, LoginResponse } from "@/models/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: form }),
      });

      if (!res.ok) throw new Error("Credenciais inválidas");

      const data: LoginResponse = await res.json();

      // Salvar no contexto
      login(data.usuario, data.token);

      // Redirecionar para o dashboard certo mediante a role do usuário
      if (data.usuario.role === "bibliotecario") {
        router.push("/dashboard-bibliotecario");
      } else if (data.usuario.role === "admin") {
        router.push("/dashboard-admin");
      } else {
        alert("Erro: tipo de usuário não identificado");
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
      </form>
    </div>
  );
}
