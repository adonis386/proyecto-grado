'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { TIPOS_TICKET, PRIORIDADES_TICKET } from '@/lib/supabase-tickets'

export default function NuevoTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [equipos, setEquipos] = useState<any[]>([])
  const [usuariosExistentes, setUsuariosExistentes] = useState<string[]>([])
  const [usuarioCustom, setUsuarioCustom] = useState(false)
  
  const [formData, setFormData] = useState({
    usuario_solicitante: '',
    equipo_id: '',
    tipo: 'Falla' as const,
    prioridad: 'Media' as const,
    titulo: '',
    descripcion: '',
    asignado_a: '',
  })

  useEffect(() => {
    loadOpciones()
  }, [])

  async function loadOpciones() {
    try {
      // Cargar equipos
      const { data: equiposData } = await supabase
        .from('equipos')
        .select('id, numero_equipo, usuario_asignado')
        .order('numero_equipo')
      
      setEquipos(equiposData || [])

      // Cargar usuarios existentes
      const { data: equiposUsuarios } = await supabase
        .from('equipos')
        .select('usuario_asignado')
        .not('usuario_asignado', 'is', null)
      
      const usuarios = Array.from(new Set(equiposUsuarios?.map(e => e.usuario_asignado).filter(Boolean) as string[]))
      setUsuariosExistentes(usuarios)
    } catch (error) {
      console.error('Error cargando opciones:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          usuario_solicitante: formData.usuario_solicitante,
          equipo_id: formData.equipo_id || null,
          tipo: formData.tipo,
          prioridad: formData.prioridad,
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          asignado_a: formData.asignado_a || null,
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Ticket creado correctamente')
      router.push(`/dashboard/tickets/${data.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Error al crear ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Ticket</h1>
        <p className="text-gray-600">Crea un nuevo ticket para solicitud o reporte de falla</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Usuario Solicitante *</label>
              {!usuarioCustom ? (
                <select
                  value={formData.usuario_solicitante}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setUsuarioCustom(true)
                      setFormData({ ...formData, usuario_solicitante: '' })
                    } else {
                      setFormData({ ...formData, usuario_solicitante: e.target.value })
                    }
                  }}
                  required
                  className="input-field"
                >
                  <option value="">Seleccionar usuario</option>
                  {usuariosExistentes.map((usuario) => (
                    <option key={usuario} value={usuario}>{usuario}</option>
                  ))}
                  <option value="__custom__">➕ Agregar nuevo usuario</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.usuario_solicitante}
                    onChange={(e) => setFormData({ ...formData, usuario_solicitante: e.target.value })}
                    className="input-field flex-1"
                    placeholder="Nombre del usuario"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioCustom(false)
                      setFormData({ ...formData, usuario_solicitante: '' })
                    }}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
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
                placeholder="Técnico responsable (opcional)"
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
                placeholder="Ej: Monitor no enciende, Necesito cambio de teclado..."
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
                placeholder="Describe el problema o solicitud en detalle..."
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Ticket'}
            </button>
            <Link href="/dashboard/tickets" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

