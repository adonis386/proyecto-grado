'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRolContext } from '@/lib/rol-context'

export default function Dashboard() {
  const { canManageEmpleados } = useRolContext()
  const [stats, setStats] = useState({
    totalEquipos: 0,
    equiposOperativos: 0,
    equiposConUsuario: 0,
    equiposDisponibles: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Contar equipos
      const { count: totalEquipos } = await supabase
        .from('equipos')
        .select('*', { count: 'exact', head: true })

      // Contar equipos operativos
      const { count: equiposOperativos } = await supabase
        .from('equipos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'Operativo')

      // Contar equipos con usuario
      const { count: equiposConUsuario } = await supabase
        .from('equipos')
        .select('*', { count: 'exact', head: true })
        .not('usuario_asignado', 'is', null)

      // Contar equipos disponibles
      const { count: equiposDisponibles } = await supabase
        .from('equipos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'Disponible')

      setStats({
        totalEquipos: totalEquipos || 0,
        equiposOperativos: equiposOperativos || 0,
        equiposConUsuario: equiposConUsuario || 0,
        equiposDisponibles: equiposDisponibles || 0,
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
      title: 'Total Equipos',
      value: stats.totalEquipos,
      icon: '💻',
      color: 'bg-blue-500',
      link: '/dashboard/equipos',
    },
    {
      title: 'Equipos Operativos',
      value: stats.equiposOperativos,
      icon: '✅',
      color: 'bg-green-500',
      link: '/dashboard/equipos?estado=Operativo',
    },
    {
      title: 'Con Usuario',
      value: stats.equiposConUsuario,
      icon: '👤',
      color: 'bg-inn-primary',
      link: '/dashboard/equipos?usuario=Con Usuario',
    },
    {
      title: 'Disponibles',
      value: stats.equiposDisponibles,
      icon: '📦',
      color: 'bg-yellow-500',
      link: '/dashboard/equipos?estado=Disponible',
    },
  ]

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Panel de Control IT</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Departamento de Informática - Control de Dispositivos y Equipos
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <div className="card hover:scale-105 transition-transform cursor-pointer">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            {canManageEmpleados && (
              <Link
                href="/dashboard/empleados/nuevo"
                className="block btn-primary text-center text-sm sm:text-base"
              >
                👥 Registrar Empleado
              </Link>
            )}
            <Link
              href="/dashboard/equipos/nuevo"
              className="block btn-secondary text-center text-sm sm:text-base"
            >
              ➕ Agregar Nuevo Equipo
            </Link>
            <Link
              href="/dashboard/equipos"
              className="block btn-secondary text-center text-sm sm:text-base"
            >
              📋 Ver Todos los Equipos
            </Link>
            <Link
              href="/dashboard/reportes"
              className="block btn-secondary text-center text-sm sm:text-base"
            >
              📊 Ver Reportes
            </Link>
            <Link
              href="/dashboard/guias"
              className="block btn-secondary text-center text-sm sm:text-base"
            >
              📖 Base de Conocimiento
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Información del Sistema</h2>
          <div className="space-y-3 text-xs sm:text-sm">
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

