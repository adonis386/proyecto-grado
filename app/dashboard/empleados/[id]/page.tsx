'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { Empleado } from '@/lib/supabase-empleados'

type EquipoAsignado = {
  id: string
  numero_equipo: number
  estado: string
  rack: string | null
}

export default function EmpleadoDetallePage() {
  const params = useParams()
  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [equiposAsignados, setEquiposAsignados] = useState<EquipoAsignado[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.id])

  async function loadData() {
    try {
      const { data: emp, error: empError } = await supabase
        .from('empleados')
        .select('*')
        .eq('id', params.id)
        .single()

      if (empError) throw empError
      setEmpleado(emp)

      const { data: equipos } = await supabase
        .from('equipos')
        .select('id, numero_equipo, estado, rack')
        .eq('empleado_id', params.id)
        .order('numero_equipo')

      setEquiposAsignados(equipos || [])
    } catch (error: any) {
      toast.error('Error al cargar empleado')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12">Cargando...</div>
  if (!empleado) return <div className="text-center py-12">Empleado no encontrado</div>

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/empleados" className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block">
          ← Volver a Empleados
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{empleado.nombre_completo}</h1>
            <p className="text-gray-600">{empleado.cargo || 'Sin cargo asignado'}</p>
            <span
              className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                empleado.rol === 'Administrador' ? 'bg-purple-100 text-purple-800' :
                empleado.rol === 'Técnico' ? 'bg-blue-100 text-blue-800' :
                empleado.rol === 'Gerente' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {empleado.rol}
            </span>
            {!empleado.activo && (
              <span className="ml-2 inline-flex px-3 py-1 text-sm rounded bg-red-100 text-red-800">Inactivo</span>
            )}
          </div>
          <Link href={`/dashboard/empleados/${empleado.id}/editar`} className="btn-primary">
            ✏️ Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Datos de contacto */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información de contacto</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium">{empleado.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Teléfono</dt>
              <dd className="font-medium">{empleado.telefono || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Departamento</dt>
              <dd className="font-medium">{empleado.departamento}</dd>
            </div>
          </dl>
        </div>

        {/* Conectividad */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conectividad</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Dirección IP</dt>
              <dd className="font-medium">{empleado.direccion_ip || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Rack</dt>
              <dd className="font-medium">
                {empleado.rack ? (
                  <span className="inline-flex px-2 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-800">
                    🔌 {empleado.rack}
                  </span>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Acceso</dt>
              <dd className="font-medium">
                <span className={empleado.acceso_internet ? 'text-green-600' : 'text-gray-400'}>
                  Internet: {empleado.acceso_internet ? 'Sí' : 'No'}
                </span>
                {' · '}
                <span className={empleado.acceso_llamadas ? 'text-green-600' : 'text-gray-400'}>
                  Llamadas: {empleado.acceso_llamadas ? 'Sí' : 'No'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Equipos asignados */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Equipos asignados</h2>
        {equiposAsignados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Equipo #</th>
                  <th className="text-left py-2">Estado</th>
                  <th className="text-left py-2">Rack</th>
                  <th className="text-left py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {equiposAsignados.map((eq) => (
                  <tr key={eq.id} className="border-b border-gray-100">
                    <td className="py-3 font-semibold">#{eq.numero_equipo}</td>
                    <td className="py-3">{eq.estado}</td>
                    <td className="py-3">{eq.rack || '—'}</td>
                    <td className="py-3">
                      <Link
                        href={`/dashboard/equipos/${eq.id}`}
                        className="text-inn-primary hover:text-inn-dark font-medium text-sm"
                      >
                        Ver equipo
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No tiene equipos asignados</p>
        )}
      </div>

      {empleado.observaciones && (
        <div className="card mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Observaciones</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{empleado.observaciones}</p>
        </div>
      )}
    </div>
  )
}
