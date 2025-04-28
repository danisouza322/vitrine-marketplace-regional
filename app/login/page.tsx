"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou senha inválidos.");
    } else {
      // Redireciona para painel do tenant ou admin
      // (Ajuste conforme lógica de roles se necessário)
      router.push("/tenant");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" type="email" className="mt-1 w-full border rounded px-3 py-2" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Senha</label>
            <input id="password" type="password" className="mt-1 w-full border rounded px-3 py-2" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        </form>
        {error && <div className="mt-4 text-center text-sm text-red-600">{error}</div>}
        <div className="mt-4 text-center text-sm">
          Não tem conta? <a href="/register" className="text-blue-600 underline">Registrar empresa</a>
        </div>
      </div>
    </div>
  );
} 