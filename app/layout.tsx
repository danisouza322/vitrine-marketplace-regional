import type { Metadata } from 'next'
import './globals.css';
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Vitrine - Marketplace Regional',
  description: 'Plataforma de vitrine digital para empresas regionais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 