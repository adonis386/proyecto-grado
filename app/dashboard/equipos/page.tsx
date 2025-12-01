'use client'

import { useEffect, useState } from 'react'
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
  rack: string | null
  componentes: {
    tipo: string
    marca: string | null
    modelo: string | null
    numero_serie: string | null
  }[]
}

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [filterUsuario, setFilterUsuario] = useState('Todos')
  const [filterRack, setFilterRack] = useState('Todos')
  const [filterDepartamento, setFilterDepartamento] = useState('Todos')
  const [filterModelo, setFilterModelo] = useState('Todos')
  const [filterMarca, setFilterMarca] = useState('Todos')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    loadEquipos()
  }, [])

  async function loadEquipos() {
    try {
      const { data: equiposData, error: equiposError } = await supabase
        .from('equipos')
        .select('*')
        .order('numero_equipo')

      if (equiposError) throw equiposError

      // Cargar componentes para cada equipo
      const equiposConComponentes = await Promise.all(
        (equiposData || []).map(async (equipo) => {
          const { data: componentes } = await supabase
            .from('componentes')
            .select('tipo, marca, modelo, numero_serie')
            .eq('equipo_id', equipo.id)
            .order('tipo')

          return {
            ...equipo,
            componentes: componentes || [],
          }
        })
      )

      setEquipos(equiposConComponentes)
    } catch (error: any) {
      toast.error('Error al cargar equipos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este equipo y todos sus componentes?')) return

    try {
      const { error } = await supabase
        .from('equipos')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Equipo eliminado')
      loadEquipos()
    } catch (error: any) {
      toast.error('Error al eliminar equipo')
    }
  }

  const filteredEquipos = equipos.filter((equipo) => {
    // Búsqueda general
    const matchSearch = 
      equipo.numero_equipo.toString().includes(searchTerm) ||
      equipo.usuario_asignado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.departamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.rack?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.componentes.some(c => 
        c.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    // Filtros específicos
    const matchEstado = filterEstado === 'Todos' || equipo.estado === filterEstado
    const matchUsuario = filterUsuario === 'Todos' || 
      (filterUsuario === 'Con Usuario' && equipo.usuario_asignado) ||
      (filterUsuario === 'Sin Usuario' && !equipo.usuario_asignado) ||
      equipo.usuario_asignado === filterUsuario
    const matchRack = filterRack === 'Todos' || equipo.rack === filterRack || 
      (filterRack === 'Sin Rack' && !equipo.rack)
    const matchDepartamento = filterDepartamento === 'Todos' || equipo.departamento === filterDepartamento
    const matchModelo = filterModelo === 'Todos' || 
      equipo.componentes.some(c => c.modelo === filterModelo)
    const matchMarca = filterMarca === 'Todos' || 
      equipo.componentes.some(c => c.marca === filterMarca)

    return matchSearch && matchEstado && matchUsuario && matchRack && 
           matchDepartamento && matchModelo && matchMarca
  })

  if (loading) {
    return <div className="text-center py-12">Cargando equipos...</div>
  }

  // Obtener valores únicos para los filtros
  const estados = ['Todos', 'Operativo', 'Disponible', 'No Operativo', 'En Reparación', 'En Mantenimiento']
  const usuarios: string[] = ['Todos', 'Con Usuario', 'Sin Usuario', ...Array.from(new Set(equipos.map(e => e.usuario_asignado).filter((u): u is string => Boolean(u))))]
  const racks: string[] = ['Todos', 'Sin Rack', ...Array.from(new Set(equipos.map(e => e.rack).filter((r): r is string => Boolean(r))))]
  const departamentos: string[] = ['Todos', ...Array.from(new Set(equipos.map(e => e.departamento).filter(Boolean)))]
  const modelos: string[] = ['Todos', ...Array.from(new Set(equipos.flatMap(e => e.componentes.map(c => c.modelo).filter((m): m is string => Boolean(m)))))]
  const marcas: string[] = ['Todos', ...Array.from(new Set(equipos.flatMap(e => e.componentes.map(c => c.marca).filter((m): m is string => Boolean(m)))))]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Equipos de Cómputo</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestión de equipos completos del departamento IT - Búsqueda por usuario, rack, departamento y componentes
          </p>
        </div>
        <Link href="/dashboard/equipos/nuevo" className="btn-primary text-center whitespace-nowrap">
          ➕ Nuevo Equipo
        </Link>
      </div>

      {/* Búsqueda Rápida - Casos de Uso Específicos */}
      <div className="card mb-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 Búsqueda Rápida</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-sm">Buscar por Usuario</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              className="input-field"
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setFilterUsuario('Todos')
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Encuentra el equipo, departamento y rack de un usuario
            </p>
          </div>
          <div>
            <label className="label text-sm">Buscar por Rack</label>
            <input
              type="text"
              placeholder="Ej: Rack-01, Rack-A, etc."
              className="input-field"
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setFilterRack('Todos')
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ver todos los equipos conectados a un rack específico
            </p>
          </div>
        </div>
      </div>

      {/* Filtros Básicos */}
      <div className="card mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-sm text-inn-primary hover:text-inn-dark font-medium"
          >
            {showAdvancedFilters ? '▲ Ocultar' : '▼ Mostrar'} Filtros Avanzados
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Búsqueda General</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Usuario, rack, marca, modelo, serie..."
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
            <label className="label">Usuario</label>
            <select
              value={filterUsuario}
              onChange={(e) => setFilterUsuario(e.target.value)}
              className="input-field"
            >
              {usuarios.map((usuario) => (
                <option key={usuario} value={usuario}>
                  {usuario}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros Avanzados */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="label">Rack</label>
              <select
                value={filterRack}
                onChange={(e) => setFilterRack(e.target.value)}
                className="input-field"
              >
                {racks.map((rack) => (
                  <option key={rack} value={rack}>
                    {rack}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Departamento</label>
              <select
                value={filterDepartamento}
                onChange={(e) => setFilterDepartamento(e.target.value)}
                className="input-field"
              >
                {departamentos.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Marca Componente</label>
              <select
                value={filterMarca}
                onChange={(e) => setFilterMarca(e.target.value)}
                className="input-field"
              >
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Modelo Componente</label>
              <select
                value={filterModelo}
                onChange={(e) => setFilterModelo(e.target.value)}
                className="input-field"
              >
                {modelos.map((modelo) => (
                  <option key={modelo} value={modelo}>
                    {modelo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Botón Limpiar Filtros */}
        {(searchTerm || filterEstado !== 'Todos' || filterUsuario !== 'Todos' || 
          filterRack !== 'Todos' || filterDepartamento !== 'Todos' || 
          filterModelo !== 'Todos' || filterMarca !== 'Todos') && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterEstado('Todos')
                setFilterUsuario('Todos')
                setFilterRack('Todos')
                setFilterDepartamento('Todos')
                setFilterModelo('Todos')
                setFilterMarca('Todos')
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              ✕ Limpiar todos los filtros
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Equipo #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Departamento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rack</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Componentes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEquipos.map((equipo) => (
                <tr key={equipo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg text-gray-900">#{equipo.numero_equipo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {equipo.usuario_asignado || <span className="text-gray-400">Sin asignar</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {equipo.departamento}
                  </td>
                  <td className="px-6 py-4">
                    {equipo.rack ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        🔌 {equipo.rack}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin rack</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {equipo.componentes.map((comp, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          {comp.tipo}: {comp.marca || 'N/A'} {comp.modelo || ''}
                        </span>
                      ))}
                      {equipo.componentes.length === 0 && (
                        <span className="text-gray-400 text-sm">Sin componentes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      equipo.estado === 'Operativo' ? 'bg-green-100 text-green-800' :
                      equipo.estado === 'Disponible' ? 'bg-blue-100 text-blue-800' :
                      equipo.estado === 'No Operativo' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {equipo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <Link
                        href={`/dashboard/equipos/${equipo.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/dashboard/equipos/${equipo.id}/editar`}
                        className="text-inn-primary hover:text-inn-dark font-medium text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(equipo.id)}
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
        {filteredEquipos.map((equipo) => (
          <div key={equipo.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Equipo #{equipo.numero_equipo}</h3>
                <p className="text-sm text-gray-600">
                  {equipo.usuario_asignado || <span className="text-gray-400">Sin asignar</span>}
                </p>
                <p className="text-xs text-gray-500 mt-1">{equipo.departamento}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                equipo.estado === 'Operativo' ? 'bg-green-100 text-green-800' :
                equipo.estado === 'Disponible' ? 'bg-blue-100 text-blue-800' :
                equipo.estado === 'No Operativo' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {equipo.estado}
              </span>
            </div>

            {equipo.rack && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Rack:</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                  🔌 {equipo.rack}
                </span>
              </div>
            )}

            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Componentes:</p>
              <div className="flex flex-wrap gap-2">
                {equipo.componentes.map((comp, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {comp.tipo}: {comp.marca || 'N/A'} {comp.modelo || ''}
                  </span>
                ))}
                {equipo.componentes.length === 0 && (
                  <span className="text-xs text-gray-400">Sin componentes</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/dashboard/equipos/${equipo.id}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold text-center"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/equipos/${equipo.id}/editar`}
                className="flex-1 btn-primary text-sm text-center"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(equipo.id)}
                className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterEstado !== 'Todos' || filterUsuario !== 'Todos' ||
             filterRack !== 'Todos' || filterDepartamento !== 'Todos' ||
             filterModelo !== 'Todos' || filterMarca !== 'Todos'
              ? 'No se encontraron equipos con los filtros aplicados'
              : 'No hay equipos registrados'}
          </p>
          {!searchTerm && filterEstado === 'Todos' && filterUsuario === 'Todos' && 
           filterRack === 'Todos' && filterDepartamento === 'Todos' &&
           filterModelo === 'Todos' && filterMarca === 'Todos' && (
            <Link href="/dashboard/equipos/nuevo" className="btn-primary">
              Crear Primer Equipo
            </Link>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredEquipos.length} de {equipos.length} equipos
      </div>
    </div>
  )
}
