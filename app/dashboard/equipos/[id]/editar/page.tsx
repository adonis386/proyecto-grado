'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

type ComponenteForm = {
  id?: string
  tipo: 'CPU' | 'Monitor' | 'Teclado' | 'Mouse' | ''
  marca: string
  modelo: string
  numero_serie: string
  placa: string
}

export default function EditarEquipoPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    numero_equipo: '',
    usuario_asignado: '',
    estado: 'Operativo',
    ubicacion: '',
    departamento: 'Informática',
    rack: '',
    observaciones: '',
  })
  const [componentes, setComponentes] = useState<ComponenteForm[]>([
    { tipo: 'CPU', marca: '', modelo: '', numero_serie: '', placa: '' },
    { tipo: 'Monitor', marca: '', modelo: '', numero_serie: '', placa: '' },
    { tipo: 'Teclado', marca: '', modelo: '', numero_serie: '', placa: '' },
    { tipo: 'Mouse', marca: '', modelo: '', numero_serie: '', placa: '' },
  ])

  useEffect(() => {
    loadEquipo()
  }, [params.id])

  async function loadEquipo() {
    try {
      const { data: equipo, error: equipoError } = await supabase
        .from('equipos')
        .select('*')
        .eq('id', params.id)
        .single()

      if (equipoError) throw equipoError

      setFormData({
        numero_equipo: equipo.numero_equipo.toString(),
        usuario_asignado: equipo.usuario_asignado || '',
        estado: equipo.estado,
        ubicacion: equipo.ubicacion,
        departamento: equipo.departamento,
        rack: equipo.rack || '',
        observaciones: equipo.observaciones || '',
      })

      const { data: componentesData, error: componentesError } = await supabase
        .from('componentes')
        .select('*')
        .eq('equipo_id', params.id)

      if (componentesError) throw componentesError

      // Mapear componentes existentes
      const tipos = ['CPU', 'Monitor', 'Teclado', 'Mouse']
      const componentesMapeados = tipos.map(tipo => {
        const existente = componentesData?.find(c => c.tipo === tipo)
        return existente ? {
          id: existente.id,
          tipo: existente.tipo as 'CPU' | 'Monitor' | 'Teclado' | 'Mouse',
          marca: existente.marca || '',
          modelo: existente.modelo || '',
          numero_serie: existente.numero_serie || '',
          placa: existente.placa || '',
        } : {
          tipo: tipo as 'CPU' | 'Monitor' | 'Teclado' | 'Mouse',
          marca: '',
          modelo: '',
          numero_serie: '',
          placa: '',
        }
      })

      setComponentes(componentesMapeados)
    } catch (error: any) {
      toast.error('Error al cargar equipo')
      router.push('/dashboard/equipos')
    } finally {
      setLoadingData(false)
    }
  }

  function updateComponente(index: number, field: keyof ComponenteForm, value: string) {
    const nuevos = [...componentes]
    nuevos[index] = { ...nuevos[index], [field]: value }
    setComponentes(nuevos)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Actualizar equipo
      const { error: equipoError } = await supabase
        .from('equipos')
        .update({
          numero_equipo: parseInt(formData.numero_equipo),
          usuario_asignado: formData.usuario_asignado || null,
          estado: formData.estado,
          ubicacion: formData.ubicacion,
          departamento: formData.departamento,
          rack: formData.rack || null,
          observaciones: formData.observaciones || null,
        })
        .eq('id', params.id)

      if (equipoError) throw equipoError

      // Actualizar/crear componentes
      for (const comp of componentes) {
        if (comp.tipo === '') continue

        if (comp.id) {
          // Actualizar componente existente
          const { error } = await supabase
            .from('componentes')
            .update({
              marca: comp.marca || null,
              modelo: comp.modelo || null,
              numero_serie: comp.numero_serie || null,
              placa: comp.placa || null,
            })
            .eq('id', comp.id)

          if (error) throw error
        } else {
          // Crear nuevo componente
          const { error } = await supabase
            .from('componentes')
            .insert([{
              equipo_id: params.id as string,
              tipo: comp.tipo,
              marca: comp.marca || null,
              modelo: comp.modelo || null,
              numero_serie: comp.numero_serie || null,
              placa: comp.placa || null,
            }])

          if (error) throw error
        }
      }

      toast.success('Equipo actualizado correctamente')
      router.push(`/dashboard/equipos/${params.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar equipo')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return <div className="text-center py-12">Cargando equipo...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/equipos/${params.id}`}
          className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block"
        >
          ← Volver al Equipo
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Equipo</h1>
        <p className="text-gray-600">Actualiza la información del equipo y sus componentes</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="card">
          {/* Información del Equipo */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Equipo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Número de Equipo *</label>
                <input
                  type="number"
                  value={formData.numero_equipo}
                  onChange={(e) => setFormData({ ...formData, numero_equipo: e.target.value })}
                  required
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="label">Usuario Asignado</label>
                <input
                  type="text"
                  value={formData.usuario_asignado}
                  onChange={(e) => setFormData({ ...formData, usuario_asignado: e.target.value })}
                  className="input-field"
                  placeholder="Nombre del usuario"
                />
              </div>

              <div>
                <label className="label">Estado *</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="Operativo">Operativo</option>
                  <option value="Disponible">Disponible</option>
                  <option value="No Operativo">No Operativo</option>
                  <option value="En Reparación">En Reparación</option>
                  <option value="En Mantenimiento">En Mantenimiento</option>
                </select>
              </div>

              <div>
                <label className="label">Ubicación</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Rack / Punto de Conexión</label>
                <input
                  type="text"
                  value={formData.rack}
                  onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Rack-01, Rack-A, Switch-01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Rack o punto de conexión de red donde está conectado el equipo
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="label">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Componentes */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Componentes del Equipo</h2>
            <div className="space-y-6">
              {componentes.map((comp, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">{comp.tipo}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Marca</label>
                      <input
                        type="text"
                        value={comp.marca}
                        onChange={(e) => updateComponente(index, 'marca', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Modelo</label>
                      <input
                        type="text"
                        value={comp.modelo}
                        onChange={(e) => updateComponente(index, 'modelo', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Número de Serie</label>
                      <input
                        type="text"
                        value={comp.numero_serie}
                        onChange={(e) => updateComponente(index, 'numero_serie', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Placa</label>
                      <input
                        type="text"
                        value={comp.placa}
                        onChange={(e) => updateComponente(index, 'placa', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Actualizar Equipo'}
            </button>
            <Link href={`/dashboard/equipos/${params.id}`} className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

