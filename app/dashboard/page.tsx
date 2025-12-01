'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalCategorias: 0,
    productosDisponibles: 0,
    productosEnUso: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Contar productos
      const { count: totalProductos } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })

      // Contar categorías
      const { count: totalCategorias } = await supabase
        .from('categorias')
        .select('*', { count: 'exact', head: true })

      // Contar productos disponibles
      const { count: productosDisponibles } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'Disponible')

      // Contar productos en uso
      const { count: productosEnUso } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'En Uso')

      setStats({
        totalProductos: totalProductos || 0,
        totalCategorias: totalCategorias || 0,
        productosDisponibles: productosDisponibles || 0,
        productosEnUso: productosEnUso || 0,
      })
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando estadísticas...</div>
  }

  const statCards = [
    {
      title: 'Total Productos',
      value: stats.totalProductos,
      icon: '💻',
      color: 'bg-blue-500',
      link: '/dashboard/productos',
    },
    {
      title: 'Categorías',
      value: stats.totalCategorias,
      icon: '📁',
      color: 'bg-inn-primary',
      link: '/dashboard/categorias',
    },
    {
      title: 'Disponibles',
      value: stats.productosDisponibles,
      icon: '✅',
      color: 'bg-green-500',
      link: '/dashboard/productos?estado=Disponible',
    },
    {
      title: 'En Uso',
      value: stats.productosEnUso,
      icon: '🔄',
      color: 'bg-yellow-500',
      link: '/dashboard/productos?estado=En Uso',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
        <p className="text-gray-600">
          Bienvenido al sistema de gestión de inventario de equipos informáticos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <div className="card hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/productos/nuevo"
              className="block btn-primary text-center"
            >
              ➕ Agregar Nuevo Producto
            </Link>
            <Link
              href="/dashboard/categorias"
              className="block btn-secondary text-center"
            >
              📁 Gestionar Categorías
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Sistema</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Estado del Sistema:</span>
              <span className="text-green-600 font-semibold">✓ Operativo</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Base de Datos:</span>
              <span className="text-green-600 font-semibold">✓ Conectada</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Versión:</span>
              <span className="font-semibold">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

