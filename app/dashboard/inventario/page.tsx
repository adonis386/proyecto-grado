'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

type ComponenteStock = {
  tipo: string
  marca: string | null
  modelo: string | null
  cantidad: number
  equipos: {
    numero_equipo: number
    usuario_asignado: string | null
  }[]
}

export default function InventarioPage() {
  const [componentes, setComponentes] = useState<ComponenteStock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('Todos')
  const [filterMarca, setFilterMarca] = useState('Todos')
  const [sortBy, setSortBy] = useState<'cantidad' | 'tipo' | 'marca' | 'modelo'>('cantidad')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadInventario()
  }, [])

  async function loadInventario() {
    try {
      // Cargar todos los componentes con información de sus equipos
      const { data: componentesData, error: componentesError } = await supabase
        .from('componentes')
        .select(`
          tipo,
          marca,
          modelo,
          equipo_id,
          equipos (
            numero_equipo,
            usuario_asignado
          )
        `)
        .order('tipo')

      if (componentesError) throw componentesError

      // Agrupar por tipo, marca y modelo
      const agrupados = new Map<string, ComponenteStock>()

      componentesData?.forEach((comp: any) => {
        const key = `${comp.tipo}|${comp.marca || 'Sin Marca'}|${comp.modelo || 'Sin Modelo'}`
        
        if (!agrupados.has(key)) {
          agrupados.set(key, {
            tipo: comp.tipo,
            marca: comp.marca,
            modelo: comp.modelo,
            cantidad: 0,
            equipos: [],
          })
        }

        const item = agrupados.get(key)!
        item.cantidad++
        if (comp.equipos) {
          item.equipos.push({
            numero_equipo: comp.equipos.numero_equipo,
            usuario_asignado: comp.equipos.usuario_asignado,
          })
        }
      })

      const inventario = Array.from(agrupados.values())
      setComponentes(inventario)
    } catch (error: any) {
      toast.error('Error al cargar inventario')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredComponentes = componentes.filter((comp) => {
    const matchSearch = 
      comp.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchTipo = filterTipo === 'Todos' || comp.tipo === filterTipo
    const matchMarca = filterMarca === 'Todos' || comp.marca === filterMarca

    return matchSearch && matchTipo && matchMarca
  })

  // Ordenar
  const sortedComponentes = [...filteredComponentes].sort((a, b) => {
    let aVal: any, bVal: any
    
    switch (sortBy) {
      case 'cantidad':
        aVal = a.cantidad
        bVal = b.cantidad
        break
      case 'tipo':
        aVal = a.tipo
        bVal = b.tipo
        break
      case 'marca':
        aVal = a.marca || ''
        bVal = b.marca || ''
        break
      case 'modelo':
        aVal = a.modelo || ''
        bVal = b.modelo || ''
        break
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  if (loading) {
    return <div className="text-center py-12">Cargando inventario...</div>
  }

  // Obtener valores únicos para filtros
  const tipos: string[] = ['Todos', ...Array.from(new Set(componentes.map(c => c.tipo)))]
  const marcas: string[] = ['Todos', ...Array.from(new Set(componentes.map(c => c.marca).filter((m): m is string => Boolean(m))))]

  const totalComponentes = componentes.reduce((sum, c) => sum + c.cantidad, 0)
  const tiposUnicos = new Set(componentes.map(c => c.tipo)).size

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Inventario de Componentes</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Control de existencia de componentes por tipo, marca y modelo
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Componentes</p>
          <p className="text-3xl font-bold text-gray-900">{totalComponentes}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Tipos Diferentes</p>
          <p className="text-3xl font-bold text-gray-900">{tiposUnicos}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Modelos Únicos</p>
          <p className="text-3xl font-bold text-gray-900">{componentes.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="label">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Tipo, marca, modelo..."
            />
          </div>
          <div>
            <label className="label">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="input-field"
            >
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Marca</label>
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
            <label className="label">Ordenar por</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input-field flex-1"
              >
                <option value="cantidad">Cantidad</option>
                <option value="tipo">Tipo</option>
                <option value="marca">Marca</option>
                <option value="modelo">Modelo</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {(searchTerm || filterTipo !== 'Todos' || filterMarca !== 'Todos') && (
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterTipo('Todos')
              setFilterMarca('Todos')
            }}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Vista Desktop: Tabla */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-inn-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Marca</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Modelo</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Cantidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Equipos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedComponentes.map((comp, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {comp.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {comp.marca || <span className="text-gray-400">Sin marca</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {comp.modelo || <span className="text-gray-400">Sin modelo</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-inn-primary text-white font-bold text-lg">
                      {comp.cantidad}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 max-w-md">
                      {comp.equipos.slice(0, 3).map((eq, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          #{eq.numero_equipo} {eq.usuario_asignado ? `- ${eq.usuario_asignado}` : ''}
                        </span>
                      ))}
                      {comp.equipos.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-200 text-gray-600">
                          +{comp.equipos.length - 3} más
                        </span>
                      )}
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
        {sortedComponentes.map((comp, idx) => (
          <div key={idx} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 mb-2">
                  {comp.tipo}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  {comp.marca || 'Sin marca'} {comp.modelo || 'Sin modelo'}
                </h3>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-inn-primary text-white font-bold text-xl">
                {comp.cantidad}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Equipos ({comp.equipos.length}):</p>
              <div className="flex flex-wrap gap-2">
                {comp.equipos.slice(0, 5).map((eq, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    #{eq.numero_equipo}
                  </span>
                ))}
                {comp.equipos.length > 5 && (
                  <span className="text-xs text-gray-500">+{comp.equipos.length - 5} más</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedComponentes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterTipo !== 'Todos' || filterMarca !== 'Todos'
              ? 'No se encontraron componentes con los filtros aplicados'
              : 'No hay componentes registrados'}
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {sortedComponentes.length} de {componentes.length} modelos diferentes
      </div>
    </div>
  )
}

