import { ReactNode } from 'react'
import { BsGrid, BsBox, BsGear, BsPerson } from 'react-icons/bs'
import Link from 'next/link'

const menuItems = [
  { icon: BsGrid, label: 'Dashboard', href: '/painel' },
  { icon: BsBox, label: 'Produtos', href: '/painel/produtos' },
  { icon: BsPerson, label: 'Perfil', href: '/painel/perfil' },
  { icon: BsGear, label: 'Configurações', href: '/painel/configuracoes' },
]

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-gray-800">Vitrine</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <BsPerson className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar & Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm fixed h-full">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard
              title="Total de Produtos"
              value="120"
              change="+5%"
              trend="up"
            />
            <MetricCard
              title="Visualizações"
              value="1.2k"
              change="+12%"
              trend="up"
            />
            <MetricCard
              title="Contatos"
              value="48"
              change="-3%"
              trend="down"
            />
            <MetricCard
              title="Taxa de Conversão"
              value="3.2%"
              change="+2%"
              trend="up"
            />
          </div>

          {/* Conteúdo Principal */}
          <div className="bg-white rounded-lg shadow p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, trend }: {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {change}
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  )
} 