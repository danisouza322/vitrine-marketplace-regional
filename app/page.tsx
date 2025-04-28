export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Vitrine Marketplace Regional</h1>
      <p className="mb-2">Bem-vindo! Escolha uma loja ou faça login para administrar.</p>
      <a href="/login" className="text-blue-600 underline">Login/Admin</a>
    </main>
  );
} 