'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { Empleado } from '@/lib/supabase-empleados'
import { useRolContext } from '@/lib/rol-context'

export default function EmpleadosPage() {
  const { canManageEmpleados } = useRolContext()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartamento, setFilterDepartamento] = useState('Todos')
  const [filterRol, setFilterRol] = useState('Todos')
  const [filterActivo, setFilterActivo] = useState('Todos')

  useEffect(() => {
    loadEmpleados()
  }, [])

  async function loadEmpleados() {
    try {
      const { data, error } = await supabase
        .from('empleados')
        .select('*')
        .order('nombre_completo')

      if (error) throw error
      setEmpleados(data || [])
    } catch (error: any) {
      toast.error('Error al cargar empleados')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este empleado? Se desvinculará de equipos asignados.')) return

    try {
      const { error } = await supabase
        .from('equipos')
        .update({ empleado_id: null })
        .eq('empleado_id', id)

      if (error) throw error

      const { error: deleteError } = await supabase
        .from('empleados')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      toast.success('Empleado eliminado')
      loadEmpleados()
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar empleado')
    }
  }

  const filteredEmpleados = empleados.filter((emp) => {
    const matchSearch =
      emp.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.rack?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.direccion_ip?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchDept = filterDepartamento === 'Todos' || emp.departamento === filterDepartamento
    const matchRol = filterRol === 'Todos' || emp.rol === filterRol
    const matchActivo =
      filterActivo === 'Todos' ||
      (filterActivo === 'Sí' && emp.activo) ||
      (filterActivo === 'No' && !emp.activo)
    return matchSearch && matchDept && matchRol && matchActivo
  })

  const departamentos = ['Todos', ...Array.from(new Set(empleados.map((e) => e.departamento).filter(Boolean)))]

  if (loading) {
    return <div className="text-center py-12">Cargando empleados...</div>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Empleados</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Registro de empleados del INN - Datos de contacto, conectividad y asignación
          </p>
        </div>
        {canManageEmpleados && (
          <Link href="/dashboard/empleados/nuevo" className="btn-primary text-center whitespace-nowrap">
            ➕ Nuevo Empleado
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Nombre, email, cargo, rack, IP..."
            />
          </div>
          <div>
            <label className="label">Departamento</label>
            <select
              value={filterDepartamento}
              onChange={(e) => setFilterDepartamento(e.target.value)}
              className="input-field"
            >
              {departamentos.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Rol</label>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="input-field"
            >
              <option value="Todos">Todos</option>
              <option value="Empleado">Empleado</option>
              <option value="Técnico">Técnico</option>
              <option value="Gerente">Gerente</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          <div>
            <label className="label">Activo</label>
            <select
              value={filterActivo}
              onChange={(e) => setFilterActivo(e.target.value)}
              className="input-field"
            >
              <option value="Todos">Todos</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-inn-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Empleado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Cargo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Departamento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rack</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Contacto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rol</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmpleados.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{emp.nombre_completo}</div>
                    {emp.direccion_ip && (
                      <div className="text-xs text-gray-500">IP: {emp.direccion_ip}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{emp.cargo || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{emp.departamento}</td>
                  <td className="px-6 py-4">
                    {emp.rack ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        🔌 {emp.rack}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{emp.email || '—'}</div>
                    {emp.telefono && <div className="text-gray-500">{emp.telefono}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        emp.rol === 'Administrador'
                          ? 'bg-purple-100 text-purple-800'
                          : emp.rol === 'Técnico'
                            ? 'bg-blue-100 text-blue-800'
                            : emp.rol === 'Gerente'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {emp.rol}
                    </span>
                    {!emp.activo && (
                      <span className="ml-1 inline-flex px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <Link
                        href={`/dashboard/empleados/${emp.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Ver
                      </Link>
                      {canManageEmpleados && (
                        <>
                          <Link
                            href={`/dashboard/empleados/${emp.id}/editar`}
                            className="text-inn-primary hover:text-inn-dark font-medium text-sm"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredEmpleados.map((emp) => (
          <div key={emp.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{emp.nombre_completo}</h3>
                <p className="text-sm text-gray-600">{emp.cargo || emp.departamento}</p>
                <p className="text-xs text-gray-500 mt-1">{emp.email}</p>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  emp.rol === 'Administrador' ? 'bg-purple-100 text-purple-800' : emp.rol === 'Técnico' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {emp.rol}
              </span>
            </div>
            {emp.rack && (
              <p className="text-sm mb-2">
                <span className="font-medium">Rack:</span>{' '}
                <span className="text-blue-600">🔌 {emp.rack}</span>
              </p>
            )}
            <div className="flex gap-2">
              <Link
                href={`/dashboard/empleados/${emp.id}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold text-center"
              >
                Ver
              </Link>
              {canManageEmpleados && (
                <>
                  <Link
                    href={`/dashboard/empleados/${emp.id}/editar`}
                    className="flex-1 btn-primary text-sm text-center"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEmpleados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterDepartamento !== 'Todos' || filterRol !== 'Todos' || filterActivo !== 'Todos'
              ? 'No se encontraron empleados con los filtros aplicados'
              : 'No hay empleados registrados'}
          </p>
          {!searchTerm && filterDepartamento === 'Todos' && filterRol === 'Todos' && filterActivo === 'Todos' && canManageEmpleados && (
            <Link href="/dashboard/empleados/nuevo" className="btn-primary">
              Registrar Primer Empleado
            </Link>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredEmpleados.length} de {empleados.length} empleados
      </div>
    </div>
  )
}
