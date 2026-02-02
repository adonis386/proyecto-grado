'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Ticket, ESTADOS_TICKET, TIPOS_TICKET, PRIORIDADES_TICKET } from '@/lib/supabase-tickets'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [filterTipo, setFilterTipo] = useState('Todos')
  const [filterPrioridad, setFilterPrioridad] = useState('Todos')

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          equipos (
            numero_equipo,
            usuario_asignado
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error: any) {
      toast.error('Error al cargar tickets')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este ticket?')) return

    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Ticket eliminado')
      loadTickets()
    } catch (error: any) {
      toast.error('Error al eliminar ticket')
    }
  }

  const filteredTickets = tickets.filter((ticket: any) => {
    const matchSearch = 
      ticket.numero_ticket.toString().includes(searchTerm) ||
      ticket.usuario_solicitante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchEstado = filterEstado === 'Todos' || ticket.estado === filterEstado
    const matchTipo = filterTipo === 'Todos' || ticket.tipo === filterTipo
    const matchPrioridad = filterPrioridad === 'Todos' || ticket.prioridad === filterPrioridad

    return matchSearch && matchEstado && matchTipo && matchPrioridad
  })

  if (loading) {
    return <div className="text-center py-12">Cargando tickets...</div>
  }

  const estados = ['Todos', ...ESTADOS_TICKET]
  const tipos = ['Todos', ...TIPOS_TICKET]
  const prioridades = ['Todos', ...PRIORIDADES_TICKET]

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Urgente': return 'bg-red-100 text-red-800 border-red-300'
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Media': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Baja': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Abierto': return 'bg-blue-100 text-blue-800'
      case 'Asignado': return 'bg-indigo-100 text-indigo-800'
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800'
      case 'Pendiente': return 'bg-amber-100 text-amber-800'
      case 'Resuelto': return 'bg-green-100 text-green-800'
      case 'Cerrado': return 'bg-gray-100 text-gray-800'
      case 'Cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sistema de Tickets</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestión de solicitudes y reportes de fallas de equipos
          </p>
        </div>
        <Link href="/dashboard/tickets/nuevo" className="btn-primary text-center whitespace-nowrap">
          ➕ Nuevo Ticket
        </Link>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Número, usuario, título..."
            />
          </div>
          <div>
            <label className="label">Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="input-field"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="input-field"
            >
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Prioridad</label>
            <select
              value={filterPrioridad}
              onChange={(e) => setFilterPrioridad(e.target.value)}
              className="input-field"
            >
              {prioridades.map((prioridad) => (
                <option key={prioridad} value={prioridad}>
                  {prioridad}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || filterEstado !== 'Todos' || filterTipo !== 'Todos' || filterPrioridad !== 'Todos') && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterEstado('Todos')
                setFilterTipo('Todos')
                setFilterPrioridad('Todos')
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              ✕ Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Vista Desktop: Tabla */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-inn-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ticket #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Prioridad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Asignado</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg text-gray-900">#{ticket.numero_ticket}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{ticket.titulo}</div>
                    {ticket.equipos && (
                      <div className="text-xs text-gray-500 mt-1">
                        Equipo #{ticket.equipos.numero_equipo}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {ticket.usuario_solicitante}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                      {ticket.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getPrioridadColor(ticket.prioridad)}`}>
                      {ticket.prioridad}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(ticket.estado)}`}>
                      {ticket.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {ticket.asignado_a || <span className="text-gray-400">Sin asignar</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/dashboard/tickets/${ticket.id}/editar`}
                        className="text-inn-primary hover:text-inn-dark font-medium text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile: Cards */}
      <div className="lg:hidden space-y-4">
        {filteredTickets.map((ticket: any) => (
          <div key={ticket.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Ticket #{ticket.numero_ticket}</h3>
                <p className="text-sm font-semibold text-gray-700 mt-1">{ticket.titulo}</p>
                <p className="text-xs text-gray-500 mt-1">{ticket.usuario_solicitante}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(ticket.estado)}`}>
                  {ticket.estado}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getPrioridadColor(ticket.prioridad)}`}>
                  {ticket.prioridad}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex gap-2 mb-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{ticket.tipo}</span>
                {ticket.equipos && (
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                    Equipo #{ticket.equipos.numero_equipo}
                  </span>
                )}
              </div>
              {ticket.asignado_a && (
                <p className="text-xs text-gray-600">Asignado a: {ticket.asignado_a}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/dashboard/tickets/${ticket.id}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold text-center"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/tickets/${ticket.id}/editar`}
                className="flex-1 btn-primary text-sm text-center"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(ticket.id)}
                className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterEstado !== 'Todos' || filterTipo !== 'Todos' || filterPrioridad !== 'Todos'
              ? 'No se encontraron tickets con los filtros aplicados'
              : 'No hay tickets registrados'}
          </p>
          {!searchTerm && filterEstado === 'Todos' && filterTipo === 'Todos' && filterPrioridad === 'Todos' && (
            <Link href="/dashboard/tickets/nuevo" className="btn-primary">
              Crear Primer Ticket
            </Link>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredTickets.length} de {tickets.length} tickets
      </div>
    </div>
  )
}

