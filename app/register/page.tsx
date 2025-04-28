"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao registrar");
      setSuccess(true);
      setForm({ name: "", email: "", password: "", whatsapp: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar Empresa</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Nome da Empresa</label>
            <input id="name" type="text" className="mt-1 w-full border rounded px-3 py-2" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" type="email" className="mt-1 w-full border rounded px-3 py-2" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Senha</label>
            <input id="password" type="password" className="mt-1 w-full border rounded px-3 py-2" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium">WhatsApp</label>
            <input id="whatsapp" type="text" className="mt-1 w-full border rounded px-3 py-2" required value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold" disabled={loading}>{loading ? "Registrando..." : "Registrar"}</button>
        </form>
        {error && <div className="mt-4 text-center text-sm text-red-600">{error}</div>}
        {success && <div className="mt-4 text-center text-sm text-green-600">Cadastro realizado com sucesso! Faça login.</div>}
        <div className="mt-4 text-center text-sm">
          Já tem conta? <a href="/login" className="text-blue-600 underline">Entrar</a>
        </div>
      </div>
    </div>
  );
} 