'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { TIPOS_CONEXION } from '@/lib/supabase-cableado'
import { RACKS_PREDEFINIDOS } from '@/lib/opciones-formularios'

type EquipoOpt = { id: string; numero_equipo: number; usuario_asignado: string | null }

export default function NuevaConexionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [racksExistentes, setRacksExistentes] = useState<string[]>([])
  const [rackCustom, setRackCustom] = useState(false)
  const [equipos, setEquipos] = useState<EquipoOpt[]>([])

  const [formData, setFormData] = useState({
    rack: '',
    puerto: '',
    equipo_id: '',
    tipo_conexion: 'Red' as const,
    descripcion: '',
  })

  useEffect(() => {
    loadOpciones()
  }, [])

  async function loadOpciones() {
    const { data: racks } = await supabase
      .from('conexiones_rack')
      .select('rack')
      .not('rack', 'is', null)
    const racksUnicos = Array.from(new Set(racks?.map((r) => r.rack).filter(Boolean) as string[]))
    setRacksExistentes(racksUnicos)

    const { data: equiposData } = await supabase
      .from('equipos')
      .select('id, numero_equipo, usuario_asignado')
      .order('numero_equipo')
    setEquipos(equiposData || [])
  }

  const todosLosRacks = [...RACKS_PREDEFINIDOS, ...racksExistentes.filter((r) => !RACKS_PREDEFINIDOS.includes(r))]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('conexiones_rack').insert([
        {
          rack: formData.rack.trim(),
          puerto: formData.puerto.trim(),
          equipo_id: formData.equipo_id || null,
          tipo_conexion: formData.tipo_conexion,
          descripcion: formData.descripcion.trim() || null,
        },
      ])
      if (error) throw error
      toast.success('Conexión registrada')
      router.push('/dashboard/cableado')
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Conexión</h1>
        <p className="text-gray-600">Registra una conexión en un rack (puerto, equipo, tipo)</p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Rack *</label>
                {!rackCustom ? (
                  <select
                    value={formData.rack}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setRackCustom(true)
                        setFormData({ ...formData, rack: '' })
                      } else {
                        setFormData({ ...formData, rack: e.target.value })
                      }
                    }}
                    required
                    className="input-field"
                  >
                    <option value="">Seleccionar...</option>
                    {todosLosRacks.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    <option value="__custom__">➕ Nuevo rack</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.rack}
                      onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                      className="input-field flex-1"
                      placeholder="Ej: Rack-01"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRackCustom(false)
                        setFormData({ ...formData, rack: '' })
                      }}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Puerto *</label>
                <input
                  type="text"
                  value={formData.puerto}
                  onChange={(e) => setFormData({ ...formData, puerto: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Ej: Puerto 5, 1/0/24"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Equipo conectado</label>
                <select
                  value={formData.equipo_id}
                  onChange={(e) => setFormData({ ...formData, equipo_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Ninguno</option>
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      Equipo #{eq.numero_equipo} {eq.usuario_asignado ? `- ${eq.usuario_asignado}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tipo de conexión</label>
                <select
                  value={formData.tipo_conexion}
                  onChange={(e) => setFormData({ ...formData, tipo_conexion: e.target.value as any })}
                  className="input-field"
                >
                  {TIPOS_CONEXION.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="input-field"
                rows={2}
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
              {loading ? 'Guardando...' : 'Registrar Conexión'}
            </button>
            <Link href="/dashboard/cableado" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
