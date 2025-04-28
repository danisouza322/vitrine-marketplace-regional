"use client";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", description: "", image_url: "", category: "", active: true });
  const [formError, setFormError] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tenant/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar produtos");
      setProducts(data.products);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleCreateOrEdit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    try {
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch("/api/tenant/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isEdit ? "Erro ao editar produto" : "Erro ao criar produto"));
      setShowForm(false);
      setForm({ id: "", name: "", description: "", image_url: "", category: "", active: true });
      setIsEdit(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      const res = await fetch("/api/tenant/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao excluir produto");
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  function openEdit(product: Product) {
    setForm(product);
    setIsEdit(true);
    setShowForm(true);
  }

  function openCreate() {
    setForm({ id: "", name: "", description: "", image_url: "", category: "", active: true });
    setIsEdit(false);
    setShowForm(true);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <button className="mb-4 bg-green-600 text-white px-4 py-2 rounded" onClick={openCreate}>Novo Produto</button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <form className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4" onSubmit={handleCreateOrEdit}>
            <h2 className="text-xl font-bold mb-2">{isEdit ? "Editar Produto" : "Novo Produto"}</h2>
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input className="w-full border rounded px-3 py-2" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium">Descrição</label>
              <input className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium">Imagem (URL)</label>
              <input className="w-full border rounded px-3 py-2" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium">Categoria</label>
              <input className="w-full border rounded px-3 py-2" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              <span className="ml-2">Ativo</span>
            </div>
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setShowForm(false); setIsEdit(false); }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nome</th>
            <th className="p-2">Categoria</th>
            <th className="p-2">Ativo</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.active ? "Sim" : "Não"}</td>
              <td className="p-2">
                <button className="text-blue-600 mr-2" onClick={() => openEdit(p)}>Editar</button>
                <button className="text-red-600" onClick={() => handleDelete(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && !loading && <p>Nenhum produto cadastrado.</p>}
    </main>
  );
} 