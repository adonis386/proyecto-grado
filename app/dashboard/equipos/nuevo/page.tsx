'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

type ComponenteForm = {
  tipo: 'CPU' | 'Monitor' | 'Teclado' | 'Mouse' | ''
  marca: string
  modelo: string
  numero_serie: string
  placa: string
}

export default function NuevoEquipoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    numero_equipo: '',
    usuario_asignado: '',
    estado: 'Operativo',
    ubicacion: 'Oficina Principal',
    departamento: 'Informática',
    observaciones: '',
  })
  const [componentes, setComponentes] = useState<ComponenteForm[]>([
    { tipo: 'CPU', marca: '', modelo: '', numero_serie: '', placa: '' },
    { tipo: 'Monitor', marca: '', modelo: '', numero_serie: '', placa: '' },
    { tipo: 'Teclado', marca: '', modelo: '', numero_serie: '', placa: '' },
    { tipo: 'Mouse', marca: '', modelo: '', numero_serie: '', placa: '' },
  ])

  function updateComponente(index: number, field: keyof ComponenteForm, value: string) {
    const nuevos = [...componentes]
    nuevos[index] = { ...nuevos[index], [field]: value }
    setComponentes(nuevos)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Crear el equipo
      const { data: equipo, error: equipoError } = await supabase
        .from('equipos')
        .insert([{
          numero_equipo: parseInt(formData.numero_equipo),
          usuario_asignado: formData.usuario_asignado || null,
          estado: formData.estado,
          ubicacion: formData.ubicacion,
          departamento: formData.departamento,
          observaciones: formData.observaciones || null,
        }])
        .select()
        .single()

      if (equipoError) throw equipoError

      // Crear componentes
      const componentesParaInsertar = componentes
        .filter(c => c.tipo !== '') // Solo los que tienen tipo
        .map(c => ({
          equipo_id: equipo.id,
          tipo: c.tipo,
          marca: c.marca || null,
          modelo: c.modelo || null,
          numero_serie: c.numero_serie || null,
          placa: c.placa || null,
        }))

      if (componentesParaInsertar.length > 0) {
        const { error: componentesError } = await supabase
          .from('componentes')
          .insert(componentesParaInsertar)

        if (componentesError) throw componentesError
      }

      toast.success('Equipo creado correctamente')
      router.push('/dashboard/equipos')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear equipo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Equipo</h1>
        <p className="text-gray-600">Registra un nuevo equipo completo con sus componentes</p>
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
                  placeholder="1, 2, 3..."
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
                  placeholder="Oficina Principal"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Notas adicionales sobre el equipo..."
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
                        placeholder="Ej: VIT, Dell, HP"
                      />
                    </div>
                    <div>
                      <label className="label">Modelo</label>
                      <input
                        type="text"
                        value={comp.modelo}
                        onChange={(e) => updateComponente(index, 'modelo', e.target.value)}
                        className="input-field"
                        placeholder="Ej: VITE-1210-01"
                      />
                    </div>
                    <div>
                      <label className="label">Número de Serie</label>
                      <input
                        type="text"
                        value={comp.numero_serie}
                        onChange={(e) => updateComponente(index, 'numero_serie', e.target.value)}
                        className="input-field"
                        placeholder="Ej: A000877892"
                      />
                    </div>
                    <div>
                      <label className="label">Placa</label>
                      <input
                        type="text"
                        value={comp.placa}
                        onChange={(e) => updateComponente(index, 'placa', e.target.value)}
                        className="input-field"
                        placeholder="Ej: 01-32385"
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
              {loading ? 'Guardando...' : 'Crear Equipo'}
            </button>
            <Link href="/dashboard/equipos" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

