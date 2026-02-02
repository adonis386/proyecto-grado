'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Ticket } from '@/lib/supabase-tickets'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<any>(null)
  const [equipo, setEquipo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTicket()
  }, [params.id])

  async function loadTicket() {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', params.id)
        .single()

      if (ticketError) throw ticketError
      setTicket(ticketData)

      if (ticketData.equipo_id) {
        const { data: equipoData } = await supabase
          .from('equipos')
          .select('*')
          .eq('id', ticketData.equipo_id)
          .single()
        
        setEquipo(equipoData)
      }
    } catch (error: any) {
      toast.error('Error al cargar ticket')
      router.push('/dashboard/tickets')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este ticket?')) return

    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', params.id)

      if (error) throw error
      toast.success('Ticket eliminado')
      router.push('/dashboard/tickets')
    } catch (error: any) {
      toast.error('Error al eliminar ticket')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando ticket...</div>
  }

  if (!ticket) {
    return <div className="text-center py-12">Ticket no encontrado</div>
  }

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/tickets"
          className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block"
        >
          ← Volver a Tickets
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ticket #{ticket.numero_ticket}
            </h1>
            <p className="text-gray-600">{ticket.titulo}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/tickets/${ticket.id}/editar`}
              className="btn-primary"
            >
              ✏️ Editar
            </Link>
            <button onClick={handleDelete} className="btn-danger">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Ticket</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Descripción</p>
                <p className="text-gray-900 whitespace-pre-wrap">{ticket.descripcion}</p>
              </div>

              {ticket.solucion && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Solución</p>
                  <p className="text-gray-900 whitespace-pre-wrap bg-green-50 p-3 rounded-lg">
                    {ticket.solucion}
                  </p>
                </div>
              )}

              {ticket.observaciones && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Observaciones</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{ticket.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          {equipo && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Equipo Relacionado</h2>
              <Link
                href={`/dashboard/equipos/${equipo.id}`}
                className="text-inn-primary hover:text-inn-dark font-medium"
              >
                Ver Equipo #{equipo.numero_equipo} →
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Usuario</p>
                  <p className="font-semibold text-gray-900">
                    {equipo.usuario_asignado || 'Sin asignar'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <p className="font-semibold text-gray-900">{equipo.estado}</p>
                </div>
                {equipo.rack && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rack</p>
                    <p className="font-semibold text-gray-900">{equipo.rack}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getEstadoColor(ticket.estado)}`}>
                  {ticket.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Prioridad</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded border ${getPrioridadColor(ticket.prioridad)}`}>
                  {ticket.prioridad}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tipo</p>
                <p className="font-semibold text-gray-900">{ticket.tipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Usuario Solicitante</p>
                <p className="font-semibold text-gray-900">{ticket.usuario_solicitante}</p>
              </div>
              {ticket.asignado_a && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Asignado a</p>
                  <p className="font-semibold text-gray-900">{ticket.asignado_a}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha de Creación</p>
                <p className="font-semibold text-gray-900">{formatDate(ticket.created_at)}</p>
              </div>
              {ticket.fecha_resolucion && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha de Resolución</p>
                  <p className="font-semibold text-gray-900">{formatDate(ticket.fecha_resolucion)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

