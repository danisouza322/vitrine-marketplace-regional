"use client";
import { useRouter } from "next/navigation";
import { ChartBarIcon, ShoppingBagIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function PainelDashboard() {
  const router = useRouter();
  // Mock de dados para estudo
  const produtos = 0; // Substituir por fetch real
  const limitePlano = 20;
  const nomeLoja = "Minha Empresa";
  const whatsapp = "11999999999";
  const plano = "Plano Básico";

  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Painel da Empresa</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center cursor-pointer" onClick={() => router.push("/painel/produtos")}> 
          <ShoppingBagIcon className="h-10 w-10 text-blue-600 mb-2" />
          <span className="text-lg font-semibold text-gray-700">Produtos</span>
          <span className="text-3xl font-bold text-blue-700">{produtos}</span>
          <span className="text-xs text-gray-400">Limite: {limitePlano}</span>
        </div>
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center cursor-pointer" onClick={() => router.push("/painel/perfil")}> 
          <UserCircleIcon className="h-10 w-10 text-green-600 mb-2" />
          <span className="text-lg font-semibold text-gray-700">Plano</span>
          <span className="text-xl font-bold text-green-700">{plano}</span>
          <span className="text-xs text-gray-400">WhatsApp: {whatsapp}</span>
        </div>
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center cursor-pointer opacity-70">
          <ChartBarIcon className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-lg font-semibold text-gray-700">Analytics</span>
          <span className="text-sm text-gray-400">Em breve</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow" onClick={() => router.push("/painel/produtos")}>Gerenciar Produtos</button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow" onClick={() => router.push("/painel/perfil")}>Perfil da Loja</button>
      </div>
    </main>
  );
} 