'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ESTADOS_TICKET, TIPOS_TICKET, PRIORIDADES_TICKET } from '@/lib/supabase-tickets'

export default function EditarTicketPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [equipos, setEquipos] = useState<any[]>([])
  
  const [formData, setFormData] = useState<{
    usuario_solicitante: string
    equipo_id: string
    tipo: 'Falla' | 'Cambio' | 'Mantenimiento' | 'Consulta' | 'Otro'
    estado: 'Abierto' | 'En Proceso' | 'Resuelto' | 'Cerrado' | 'Cancelado'
    prioridad: 'Baja' | 'Media' | 'Alta' | 'Urgente'
    titulo: string
    descripcion: string
    asignado_a: string
    solucion: string
    observaciones: string
  }>({
    usuario_solicitante: '',
    equipo_id: '',
    tipo: 'Falla',
    estado: 'Abierto',
    prioridad: 'Media',
    titulo: '',
    descripcion: '',
    asignado_a: '',
    solucion: '',
    observaciones: '',
  })

  useEffect(() => {
    loadTicket()
    loadEquipos()
  }, [params.id])

  async function loadEquipos() {
    const { data } = await supabase
      .from('equipos')
      .select('id, numero_equipo, usuario_asignado')
      .order('numero_equipo')
    
    setEquipos(data || [])
  }

  async function loadTicket() {
    try {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setFormData({
        usuario_solicitante: ticket.usuario_solicitante,
        equipo_id: ticket.equipo_id || '',
        tipo: ticket.tipo,
        estado: ticket.estado,
        prioridad: ticket.prioridad,
        titulo: ticket.titulo,
        descripcion: ticket.descripcion,
        asignado_a: ticket.asignado_a || '',
        solucion: ticket.solucion || '',
        observaciones: ticket.observaciones || '',
      })
    } catch (error: any) {
      toast.error('Error al cargar ticket')
      router.push('/dashboard/tickets')
    } finally {
      setLoadingData(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData: any = {
        usuario_solicitante: formData.usuario_solicitante,
        equipo_id: formData.equipo_id || null,
        tipo: formData.tipo,
        estado: formData.estado,
        prioridad: formData.prioridad,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        asignado_a: formData.asignado_a || null,
        solucion: formData.solucion || null,
        observaciones: formData.observaciones || null,
      }

      // Si el estado cambia a Resuelto o Cerrado, actualizar fecha_resolucion
      if ((formData.estado === 'Resuelto' || formData.estado === 'Cerrado') && formData.solucion) {
        updateData.fecha_resolucion = new Date().toISOString()
      } else if (formData.estado === 'Abierto' || formData.estado === 'En Proceso') {
        updateData.fecha_resolucion = null
      }

      const { error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', params.id)

      if (error) throw error

      toast.success('Ticket actualizado correctamente')
      router.push(`/dashboard/tickets/${params.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar ticket')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return <div className="text-center py-12">Cargando ticket...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/tickets/${params.id}`}
          className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block"
        >
          ← Volver al Ticket
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Ticket</h1>
        <p className="text-gray-600">Actualiza la información del ticket</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Usuario Solicitante *</label>
              <input
                type="text"
                value={formData.usuario_solicitante}
                onChange={(e) => setFormData({ ...formData, usuario_solicitante: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Equipo Relacionado</label>
              <select
                value={formData.equipo_id}
                onChange={(e) => setFormData({ ...formData, equipo_id: e.target.value })}
                className="input-field"
              >
                <option value="">Sin equipo específico</option>
                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    Equipo #{equipo.numero_equipo} - {equipo.usuario_asignado || 'Sin asignar'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                required
                className="input-field"
              >
                {TIPOS_TICKET.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Estado *</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                required
                className="input-field"
              >
                {ESTADOS_TICKET.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Prioridad *</label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as any })}
                required
                className="input-field"
              >
                {PRIORIDADES_TICKET.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>{prioridad}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Asignado a</label>
              <input
                type="text"
                value={formData.asignado_a}
                onChange={(e) => setFormData({ ...formData, asignado_a: e.target.value })}
                className="input-field"
                placeholder="Técnico responsable"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Descripción *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                className="input-field"
                rows={6}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Solución</label>
              <textarea
                value={formData.solucion}
                onChange={(e) => setFormData({ ...formData, solucion: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="Describe la solución aplicada..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Notas adicionales..."
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Actualizar Ticket'}
            </button>
            <Link href={`/dashboard/tickets/${params.id}`} className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

