'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

function buildKey(tipo: string, marca: string | null, modelo: string | null) {
  return `${tipo}|${marca ?? ''}|${modelo ?? ''}`
}

type ComponenteStock = {
  tipo: string
  marca: string | null
  modelo: string | null
  enUso: number
  enAlmacen: number
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
  const [sortBy, setSortBy] = useState<'enUso' | 'enAlmacen' | 'tipo' | 'marca' | 'modelo'>('enUso')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [editAlmacenKey, setEditAlmacenKey] = useState<string | null>(null)
  const [editAlmacenVal, setEditAlmacenVal] = useState<number>(0)

  useEffect(() => {
    loadInventario()
  }, [])

  async function loadInventario() {
    try {
      // Cargar componentes (en uso) con información de equipos
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

      // Cargar stock en almacén (cantidad disponible en bodega)
      let stockData: { tipo: string; marca: string; modelo: string; cantidad: number }[] = []
      const { data: stockRows, error: stockError } = await supabase
        .from('stock_almacen')
        .select('tipo, marca, modelo, cantidad')
      if (stockError) {
        // Tabla no existe o error de permisos: seguir sin stock en almacén
        console.warn('[Inventario] stock_almacen:', stockError.message)
        stockData = []
      } else {
        stockData = stockRows || []
      }

      const stockMap = new Map<string, number>()
      stockData.forEach((s) => {
        stockMap.set(buildKey(s.tipo, s.marca ?? '', s.modelo ?? ''), s.cantidad ?? 0)
      })

      // Agrupar por tipo, marca y modelo: en uso (asignados a equipos) + en almacén
      const agrupados = new Map<string, ComponenteStock>()

      componentesData?.forEach((comp: any) => {
        const key = buildKey(comp.tipo, comp.marca, comp.modelo)
        if (!agrupados.has(key)) {
          agrupados.set(key, {
            tipo: comp.tipo,
            marca: comp.marca,
            modelo: comp.modelo,
            enUso: 0,
            enAlmacen: stockMap.get(key) ?? 0,
            equipos: [],
          })
        }
        const item = agrupados.get(key)!
        item.enUso++
        if (comp.equipos) {
          item.equipos.push({
            numero_equipo: comp.equipos.numero_equipo,
            usuario_asignado: comp.equipos.usuario_asignado,
          })
        }
      })

      // Incluir filas que solo tienen stock en almacén (sin uso aún)
      stockData.forEach((s) => {
        const key = buildKey(s.tipo, s.marca ?? '', s.modelo ?? '')
        if (!agrupados.has(key)) {
          agrupados.set(key, {
            tipo: s.tipo,
            marca: s.marca || null,
            modelo: s.modelo || null,
            enUso: 0,
            enAlmacen: s.cantidad ?? 0,
            equipos: [],
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

  async function actualizarStockAlmacen(comp: ComponenteStock, nuevaCantidad: number) {
    const marca = comp.marca ?? ''
    const modelo = comp.modelo ?? ''
    try {
      const { error } = await supabase.from('stock_almacen').upsert(
        {
          tipo: comp.tipo,
          marca,
          modelo,
          cantidad: Math.max(0, nuevaCantidad),
        },
        { onConflict: 'tipo,marca,modelo' }
      )
      if (error) throw error
      toast.success('Stock en almacén actualizado')
      loadInventario()
    } catch (e: any) {
      toast.error(e.message || 'Error al actualizar stock')
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
      case 'enUso':
        aVal = a.enUso
        bVal = b.enUso
        break
      case 'enAlmacen':
        aVal = a.enAlmacen
        bVal = b.enAlmacen
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
      default:
        aVal = a.enUso
        bVal = b.enUso
    }
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1
    return aVal < bVal ? 1 : -1
  })

  if (loading) {
    return <div className="text-center py-12">Cargando inventario...</div>
  }

  // Obtener valores únicos para filtros
  const tipos: string[] = ['Todos', ...Array.from(new Set(componentes.map(c => c.tipo)))]
  const marcas: string[] = ['Todos', ...Array.from(new Set(componentes.map(c => c.marca).filter((m): m is string => Boolean(m))))]

  const totalEnUso = componentes.reduce((sum, c) => sum + c.enUso, 0)
  const totalEnAlmacen = componentes.reduce((sum, c) => sum + c.enAlmacen, 0)
  const tiposUnicos = new Set(componentes.map(c => c.tipo)).size

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Inventario de Componentes</h1>
        <p className="text-sm sm:text-base text-gray-600">
          <strong>En uso:</strong> asignados a equipos. <strong>En almacén:</strong> cantidad disponible en bodega para asignar.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">En uso (equipos)</p>
          <p className="text-3xl font-bold text-gray-900">{totalEnUso}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">En almacén</p>
          <p className="text-3xl font-bold text-inn-primary">{totalEnAlmacen}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Tipos</p>
          <p className="text-3xl font-bold text-gray-900">{tiposUnicos}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Modelos únicos</p>
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
                <option value="enUso">En uso</option>
                <option value="enAlmacen">En almacén</option>
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
                <th className="px-6 py-3 text-center text-sm font-semibold">En uso</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">En almacén</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Equipos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedComponentes.map((comp, idx) => {
                const key = buildKey(comp.tipo, comp.marca, comp.modelo)
                const isEditing = editAlmacenKey === key
                return (
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
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-800 font-bold text-lg">
                        {comp.enUso}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min={0}
                            value={editAlmacenVal}
                            onChange={(e) => setEditAlmacenVal(parseInt(e.target.value, 10) || 0)}
                            className="input-field w-20 text-center"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              actualizarStockAlmacen(comp, editAlmacenVal)
                              setEditAlmacenKey(null)
                            }}
                            className="px-2 py-1 bg-inn-primary text-white rounded text-xs"
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditAlmacenKey(null)}
                            className="px-2 py-1 bg-gray-300 rounded text-xs"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 rounded-full bg-inn-primary text-white font-bold text-lg">
                            {comp.enAlmacen}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditAlmacenKey(key)
                              setEditAlmacenVal(comp.enAlmacen)
                            }}
                            className="text-xs text-inn-primary hover:underline"
                            title="Editar cantidad en almacén"
                          >
                            Editar
                          </button>
                        </div>
                      )}
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
                        {comp.equipos.length === 0 && (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile: Cards */}
      <div className="lg:hidden space-y-4">
        {sortedComponentes.map((comp, idx) => {
          const key = buildKey(comp.tipo, comp.marca, comp.modelo)
          const isEditing = editAlmacenKey === key
          return (
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
                <div className="flex gap-2">
                  <span className="inline-flex flex-col items-center">
                    <span className="text-xs text-gray-500">En uso</span>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-800 font-bold">
                      {comp.enUso}
                    </span>
                  </span>
                  <span className="inline-flex flex-col items-center">
                    <span className="text-xs text-gray-500">Almacén</span>
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <input
                          type="number"
                          min={0}
                          value={editAlmacenVal}
                          onChange={(e) => setEditAlmacenVal(parseInt(e.target.value, 10) || 0)}
                          className="input-field w-14 text-center text-sm"
                        />
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              actualizarStockAlmacen(comp, editAlmacenVal)
                              setEditAlmacenKey(null)
                            }}
                            className="px-2 py-0.5 bg-inn-primary text-white rounded text-xs"
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditAlmacenKey(null)}
                            className="px-2 py-0.5 bg-gray-300 rounded text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditAlmacenKey(key)
                          setEditAlmacenVal(comp.enAlmacen)
                        }}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-inn-primary text-white font-bold"
                      >
                        {comp.enAlmacen}
                      </button>
                    )}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Equipos ({comp.enUso}):</p>
                <div className="flex flex-wrap gap-2">
                  {comp.equipos.slice(0, 5).map((eq, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      #{eq.numero_equipo}
                    </span>
                  ))}
                  {comp.equipos.length > 5 && (
                    <span className="text-xs text-gray-500">+{comp.equipos.length - 5} más</span>
                  )}
                  {comp.equipos.length === 0 && <span className="text-gray-400 text-xs">—</span>}
                </div>
              </div>
            </div>
          )
        })}
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

