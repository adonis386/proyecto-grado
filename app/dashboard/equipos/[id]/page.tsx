'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Equipo = {
  id: string
  numero_equipo: number
  usuario_asignado: string | null
  estado: string
  ubicacion: string
  departamento: string
  observaciones: string | null
  created_at: string
  updated_at: string
}

type Componente = {
  id: string
  tipo: string
  marca: string | null
  modelo: string | null
  numero_serie: string | null
  placa: string | null
}

export default function EquipoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [equipo, setEquipo] = useState<Equipo | null>(null)
  const [componentes, setComponentes] = useState<Componente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEquipo()
  }, [params.id])

  async function loadEquipo() {
    try {
      const { data: equipoData, error: equipoError } = await supabase
        .from('equipos')
        .select('*')
        .eq('id', params.id)
        .single()

      if (equipoError) throw equipoError
      setEquipo(equipoData)

      const { data: componentesData, error: componentesError } = await supabase
        .from('componentes')
        .select('*')
        .eq('equipo_id', params.id)
        .order('tipo')

      if (componentesError) throw componentesError
      setComponentes(componentesData || [])
    } catch (error: any) {
      toast.error('Error al cargar equipo')
      router.push('/dashboard/equipos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este equipo y todos sus componentes?')) return

    try {
      const { error } = await supabase
        .from('equipos')
        .delete()
        .eq('id', params.id)

      if (error) throw error
      toast.success('Equipo eliminado')
      router.push('/dashboard/equipos')
    } catch (error: any) {
      toast.error('Error al eliminar equipo')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando equipo...</div>
  }

  if (!equipo) {
    return <div className="text-center py-12">Equipo no encontrado</div>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const tiposOrdenados = ['CPU', 'Monitor', 'Teclado', 'Mouse']
  const componentesOrdenados = tiposOrdenados.map(tipo => 
    componentes.find(c => c.tipo === tipo)
  ).filter(Boolean) as Componente[]

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/equipos"
          className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block"
        >
          ← Volver a Equipos
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Equipo #{equipo.numero_equipo}
            </h1>
            <p className="text-gray-600">Detalles del equipo de cómputo</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/equipos/${equipo.id}/editar`}
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Número de Equipo</p>
                <p className="font-bold text-2xl text-gray-900">#{equipo.numero_equipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Usuario Asignado</p>
                <p className="font-semibold text-gray-900">
                  {equipo.usuario_asignado || <span className="text-gray-400">Sin asignar</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  equipo.estado === 'Operativo' ? 'bg-green-100 text-green-800' :
                  equipo.estado === 'Disponible' ? 'bg-blue-100 text-blue-800' :
                  equipo.estado === 'No Operativo' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {equipo.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                <p className="font-semibold text-gray-900">{equipo.ubicacion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Departamento</p>
                <p className="font-semibold text-gray-900">{equipo.departamento}</p>
              </div>
              {equipo.observaciones && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Observaciones</p>
                  <p className="text-gray-900">{equipo.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          {/* Componentes */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Componentes del Equipo</h2>
            {componentesOrdenados.length > 0 ? (
              <div className="space-y-4">
                {componentesOrdenados.map((comp) => (
                  <div key={comp.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">{comp.tipo}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {comp.marca && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Marca</p>
                          <p className="font-semibold text-gray-900">{comp.marca}</p>
                        </div>
                      )}
                      {comp.modelo && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Modelo</p>
                          <p className="font-semibold text-gray-900">{comp.modelo}</p>
                        </div>
                      )}
                      {comp.numero_serie && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Número de Serie</p>
                          <p className="font-semibold text-gray-900 font-mono text-sm">
                            {comp.numero_serie}
                          </p>
                        </div>
                      )}
                      {comp.placa && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Placa</p>
                          <p className="font-semibold text-gray-900">{comp.placa}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Este equipo no tiene componentes registrados</p>
            )}
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Registrado el</p>
                <p className="text-gray-900">{formatDate(equipo.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Última actualización</p>
                <p className="text-gray-900">{formatDate(equipo.updated_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Componentes</p>
                <p className="font-bold text-2xl text-gray-900">{componentes.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-inn-light border-2 border-inn-primary">
            <h3 className="font-bold text-inn-primary mb-2">ID del Equipo</h3>
            <p className="text-xs font-mono text-gray-600 break-all">{equipo.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

