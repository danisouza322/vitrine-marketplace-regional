import Link from "next/link";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-6 h-16 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-blue-700">Minha Vitrine</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/painel" className="hover:text-blue-600 font-medium">Dashboard</Link>
          <Link href="/painel/produtos" className="hover:text-blue-600 font-medium">Produtos</Link>
          <Link href="/painel/perfil" className="hover:text-blue-600 font-medium">Perfil</Link>
        </nav>
        <div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-semibold">Sair</button>
        </div>
      </header>
      {/* Menu lateral mobile */}
      <nav className="md:hidden flex gap-4 bg-white shadow px-4 py-2 sticky top-16 z-10">
        <Link href="/painel" className="hover:text-blue-600 font-medium">Dashboard</Link>
        <Link href="/painel/produtos" className="hover:text-blue-600 font-medium">Produtos</Link>
        <Link href="/painel/perfil" className="hover:text-blue-600 font-medium">Perfil</Link>
      </nav>
      {/* Conteúdo */}
      <main className="flex-1 w-full max-w-6xl mx-auto py-6 px-2 md:px-8">
        {children}
      </main>
    </div>
  );
} 