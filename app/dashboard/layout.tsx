'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import { RolProvider, useRolContext } from '@/lib/rol-context'

function DashboardContent({
  children,
  user,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
}: {
  children: React.ReactNode
  user: any
  onLogout: () => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}) {
  const pathname = usePathname()
  const { canManageEmpleados } = useRolContext()

  const menuItems = [
    { href: '/dashboard', label: 'Inicio', icon: '🏠' },
    ...(canManageEmpleados ? [{ href: '/dashboard/empleados', label: 'Empleados', icon: '👥' }] : []),
    { href: '/dashboard/equipos', label: 'Equipos', icon: '💻' },
    { href: '/dashboard/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/dashboard/reportes', label: 'Reportes', icon: '📊' },
    { href: '/dashboard/guias', label: 'Guías', icon: '📖' },
    { href: '/dashboard/cableado', label: 'Cableado', icon: '🔌' },
    { href: '/dashboard/inventario', label: 'Inventario', icon: '📦' },
    { href: '/dashboard/categorias', label: 'Categorías', icon: '📁' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu (solo móvil) */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="relative w-10 h-10">
                    <Image src="/logo.png" alt="INN Logo" fill className="object-contain" />
                  </div>
                  <div className="relative w-10 h-10">
                    <Image src="/unexca-logo.png" alt="UNEXCA Logo" fill className="object-contain" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-inn-primary">INN</h1>
                  <p className="text-xs text-gray-500">Inventario IT - Alianza UNEXCA</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] sm:max-w-none">{user.email}</span>
              <button
                onClick={onLogout}
                className="btn-secondary text-xs sm:text-sm px-2 sm:px-4 py-2"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r border-gray-200
          top-16 lg:top-0
          min-h-[calc(100vh-64px)]
        `}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-inn-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    } catch (err) {
      console.error('[Dashboard] Error al verificar sesión:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-inn-primary text-xl">Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <RolProvider userId={user.id}>
      <DashboardContent user={user} onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        {children}
      </DashboardContent>
    </RolProvider>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutInner>{children}</DashboardLayoutInner>
}
