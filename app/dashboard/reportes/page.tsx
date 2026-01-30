'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type ReporteIncidencias = {
  total: number
  abiertos: number
  enProceso: number
  resueltos: number
  porTipo: Record<string, number>
  porPrioridad: Record<string, number>
}

type ReporteInventario = {
  totalEquipos: number
  equiposPorEstado: Record<string, number>
  totalEmpleados: number
  empleadosActivos: number
  totalComponentes: number
}

type TicketReciente = {
  id: string
  numero_ticket: number
  titulo: string
  tipo: string
  estado: string
  prioridad: string
  created_at: string
  fecha_resolucion: string | null
}

export default function ReportesPage() {
  const [loading, setLoading] = useState(true)
  const [incidencias, setIncidencias] = useState<ReporteIncidencias>({
    total: 0,
    abiertos: 0,
    enProceso: 0,
    resueltos: 0,
    porTipo: {},
    porPrioridad: {},
  })
  const [inventario, setInventario] = useState<ReporteInventario>({
    totalEquipos: 0,
    equiposPorEstado: {},
    totalEmpleados: 0,
    empleadosActivos: 0,
    totalComponentes: 0,
  })
  const [ticketsRecientes, setTicketsRecientes] = useState<TicketReciente[]>([])
  const [tiempoPromedioHoras, setTiempoPromedioHoras] = useState<number | null>(null)
  const [ticketsResueltos30dias, setTicketsResueltos30dias] = useState(0)

  useEffect(() => {
    loadReportes()
  }, [])

  async function loadReportes() {
    try {
      // Tickets - todos
      const { data: tickets } = await supabase
        .from('tickets')
        .select('tipo, estado, prioridad, created_at, fecha_resolucion, id, numero_ticket, titulo')

      const porTipo: Record<string, number> = {}
      const porPrioridad: Record<string, number> = {}

      let abiertos = 0
      let enProceso = 0
      let resueltos = 0
      let totalResolucionMs = 0
      let countResueltos = 0

      const hace30Dias = new Date()
      hace30Dias.setDate(hace30Dias.getDate() - 30)
      let resueltos30 = 0

      tickets?.forEach((t: any) => {
        porTipo[t.tipo] = (porTipo[t.tipo] || 0) + 1
        porPrioridad[t.prioridad] = (porPrioridad[t.prioridad] || 0) + 1

        if (t.estado === 'Abierto') abiertos++
        else if (t.estado === 'En Proceso') enProceso++
        else if (t.estado === 'Resuelto' || t.estado === 'Cerrado') {
          resueltos++
          if (t.fecha_resolucion && t.created_at) {
            const creado = new Date(t.created_at).getTime()
            const resuelto = new Date(t.fecha_resolucion).getTime()
            totalResolucionMs += resuelto - creado
            countResueltos++
          }
          if (t.fecha_resolucion && new Date(t.fecha_resolucion) >= hace30Dias) {
            resueltos30++
          }
        }
      })

      const promHoras = countResueltos > 0
        ? Math.round(totalResolucionMs / countResueltos / (1000 * 60 * 60) * 10) / 10
        : null

      setIncidencias({
        total: tickets?.length || 0,
        abiertos,
        enProceso,
        resueltos,
        porTipo,
        porPrioridad,
      })
      setTiempoPromedioHoras(promHoras)
      setTicketsResueltos30dias(resueltos30)

      // Tickets recientes (últimos 10)
      const recientes = (tickets || [])
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map((t: any) => ({
          id: t.id,
          numero_ticket: t.numero_ticket,
          titulo: t.titulo,
          tipo: t.tipo,
          estado: t.estado,
          prioridad: t.prioridad,
          created_at: t.created_at,
          fecha_resolucion: t.fecha_resolucion,
        }))
      setTicketsRecientes(recientes)

      // Inventario - equipos
      const { data: equipos } = await supabase.from('equipos').select('estado')
      const equiposPorEstado: Record<string, number> = {}
      equipos?.forEach((e: any) => {
        equiposPorEstado[e.estado] = (equiposPorEstado[e.estado] || 0) + 1
      })

      // Empleados
      let totalEmpleados = 0
      let empleadosActivos = 0
      const { count: t } = await supabase.from('empleados').select('*', { count: 'exact', head: true })
      const { count: a } = await supabase.from('empleados').select('*', { count: 'exact', head: true }).eq('activo', true)
      totalEmpleados = t ?? 0
      empleadosActivos = a ?? 0

      // Componentes
      const { count: totalComponentes } = await supabase
        .from('componentes')
        .select('*', { count: 'exact', head: true })

      setInventario({
        totalEquipos: equipos?.length || 0,
        equiposPorEstado,
        totalEmpleados: totalEmpleados || 0,
        empleadosActivos: empleadosActivos || 0,
        totalComponentes: totalComponentes || 0,
      })
    } catch (error) {
      console.error('Error cargando reportes:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return <div className="text-center py-12">Cargando reportes...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reportes</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Informes de incidencias, tiempos de respuesta y estado del inventario
        </p>
      </div>

      <div className="space-y-8">
        {/* Resumen de Incidencias */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Reporte de Incidencias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{incidencias.total}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Abiertos</p>
              <p className="text-2xl font-bold text-amber-700">{incidencias.abiertos}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-yellow-700">{incidencias.enProceso}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Resueltos/Cerrados</p>
              <p className="text-2xl font-bold text-green-700">{incidencias.resueltos}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Por Tipo</h3>
              <ul className="space-y-2">
                {Object.entries(incidencias.porTipo)
                  .sort(([, a], [, b]) => b - a)
                  .map(([tipo, count]) => (
                    <li key={tipo} className="flex justify-between text-sm">
                      <span>{tipo}</span>
                      <span className="font-semibold">{count}</span>
                    </li>
                  ))}
                {Object.keys(incidencias.porTipo).length === 0 && (
                  <li className="text-gray-500 text-sm">Sin datos</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Por Prioridad</h3>
              <ul className="space-y-2">
                {Object.entries(incidencias.porPrioridad)
                  .sort(([, a], [, b]) => b - a)
                  .map(([prioridad, count]) => (
                    <li key={prioridad} className="flex justify-between text-sm">
                      <span>{prioridad}</span>
                      <span className="font-semibold">{count}</span>
                    </li>
                  ))}
                {Object.keys(incidencias.porPrioridad).length === 0 && (
                  <li className="text-gray-500 text-sm">Sin datos</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Tiempos de Respuesta */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⏱️ Tiempos de Respuesta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Tiempo promedio de resolución</p>
              <p className="text-2xl font-bold text-gray-900">
                {tiempoPromedioHoras !== null ? (
                  tiempoPromedioHoras < 24
                    ? `${tiempoPromedioHoras} horas`
                    : `${Math.round(tiempoPromedioHoras / 24)} días`
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Calculado sobre tickets resueltos con fecha de resolución
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Resueltos últimos 30 días</p>
              <p className="text-2xl font-bold text-green-700">{ticketsResueltos30dias}</p>
            </div>
          </div>
        </div>

        {/* Estado del Inventario */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Estado del Inventario</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Link href="/dashboard/equipos">
              <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                <p className="text-sm text-gray-600">Total Equipos</p>
                <p className="text-2xl font-bold text-gray-900">{inventario.totalEquipos}</p>
              </div>
            </Link>
            <Link href="/dashboard/empleados">
              <div className="bg-inn-light rounded-lg p-4 hover:bg-green-100 transition-colors">
                <p className="text-sm text-gray-600">Empleados Activos</p>
                <p className="text-2xl font-bold text-gray-900">{inventario.empleadosActivos}</p>
              </div>
            </Link>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Empleados</p>
              <p className="text-2xl font-bold text-gray-900">{inventario.totalEmpleados}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Componentes</p>
              <p className="text-2xl font-bold text-gray-900">{inventario.totalComponentes}</p>
            </div>
          </div>
          {Object.keys(inventario.equiposPorEstado).length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Equipos por Estado</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(inventario.equiposPorEstado)
                  .sort(([, a], [, b]) => b - a)
                  .map(([estado, count]) => (
                    <span
                      key={estado}
                      className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                    >
                      {estado}: {count}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Últimos Tickets */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">🎫 Últimos Tickets</h2>
            <Link href="/dashboard/tickets" className="text-sm text-inn-primary hover:text-inn-dark font-medium">
              Ver todos →
            </Link>
          </div>
          {ticketsRecientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-semibold">#</th>
                    <th className="text-left py-2 text-sm font-semibold">Título</th>
                    <th className="text-left py-2 text-sm font-semibold">Tipo</th>
                    <th className="text-left py-2 text-sm font-semibold">Estado</th>
                    <th className="text-left py-2 text-sm font-semibold">Prioridad</th>
                    <th className="text-left py-2 text-sm font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsRecientes.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3">
                        <Link href={`/dashboard/tickets/${t.id}`} className="text-inn-primary hover:text-inn-dark font-medium">
                          #{t.numero_ticket}
                        </Link>
                      </td>
                      <td className="py-3 text-sm">{t.titulo}</td>
                      <td className="py-3 text-sm">{t.tipo}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs rounded ${
                          t.estado === 'Abierto' ? 'bg-blue-100 text-blue-800' :
                          t.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                          t.estado === 'Resuelto' || t.estado === 'Cerrado' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t.estado}
                        </span>
                      </td>
                      <td className="py-3 text-sm">{t.prioridad}</td>
                      <td className="py-3 text-sm text-gray-600">{formatFecha(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No hay tickets registrados</p>
          )}
        </div>
      </div>
    </div>
  )
}
