'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { TIPOS_CONEXION } from '@/lib/supabase-cableado'
import { RACKS_PREDEFINIDOS } from '@/lib/opciones-formularios'

type Conexion = {
  id: string
  rack: string
  puerto: string
  equipo_id: string | null
  tipo_conexion: string
  descripcion: string | null
  equipos?: { numero_equipo: number; usuario_asignado: string | null } | null
}

export default function CableadoPage() {
  const [conexiones, setConexiones] = useState<Conexion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRack, setFilterRack] = useState('Todos')
  const [filterTipo, setFilterTipo] = useState('Todos')

  useEffect(() => {
    loadConexiones()
  }, [])

  async function loadConexiones() {
    try {
      const { data, error } = await supabase
        .from('conexiones_rack')
        .select(`
          *,
          equipos (numero_equipo, usuario_asignado)
        `)
        .order('rack')
        .order('puerto')

      if (error) throw error
      setConexiones(data || [])
    } catch (error: any) {
      toast.error('Error al cargar cableado')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta conexión?')) return

    try {
      const { error } = await supabase
        .from('conexiones_rack')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Conexión eliminada')
      loadConexiones()
    } catch (error: any) {
      toast.error('Error al eliminar')
    }
  }

  const filteredConexiones = conexiones.filter((c) => {
    const matchSearch =
      c.rack?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.puerto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.equipos?.numero_equipo?.toString().includes(searchTerm) ||
      c.equipos?.usuario_asignado?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRack = filterRack === 'Todos' || c.rack === filterRack
    const matchTipo = filterTipo === 'Todos' || c.tipo_conexion === filterTipo
    return matchSearch && matchRack && matchTipo
  })

  const racks = ['Todos', ...Array.from(new Set(conexiones.map((c) => c.rack)))]

  // Agrupar por rack para vista organizada
  const porRack = filteredConexiones.reduce<Record<string, Conexion[]>>((acc, c) => {
    if (!acc[c.rack]) acc[c.rack] = []
    acc[c.rack].push(c)
    return acc
  }, {})

  if (loading) {
    return <div className="text-center py-12">Cargando cableado...</div>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Organización del Cableado</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Registro de conexiones y puertos en racks
          </p>
        </div>
        <Link href="/dashboard/cableado/nuevo" className="btn-primary text-center whitespace-nowrap">
          ➕ Nueva Conexión
        </Link>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Rack, puerto, equipo, usuario..."
            />
          </div>
          <div>
            <label className="label">Rack</label>
            <select
              value={filterRack}
              onChange={(e) => setFilterRack(e.target.value)}
              className="input-field"
            >
              {racks.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="input-field"
            >
              <option value="Todos">Todos</option>
              {TIPOS_CONEXION.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vista por rack */}
      <div className="space-y-6">
        {Object.entries(porRack)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([rack, items]) => (
            <div key={rack} className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔌</span>
                {rack}
                <span className="text-sm font-normal text-gray-500">({items.length} conexiones)</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-semibold">Puerto</th>
                      <th className="text-left py-2 text-sm font-semibold">Tipo</th>
                      <th className="text-left py-2 text-sm font-semibold">Equipo</th>
                      <th className="text-left py-2 text-sm font-semibold">Usuario</th>
                      <th className="text-left py-2 text-sm font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items
                      .sort((a, b) => a.puerto.localeCompare(b.puerto, undefined, { numeric: true }))
                      .map((c) => (
                        <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 font-mono">{c.puerto}</td>
                          <td className="py-3">
                            <span className="inline-flex px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                              {c.tipo_conexion}
                            </span>
                          </td>
                          <td className="py-3">
                            {c.equipos ? (
                              <Link
                                href={`/dashboard/equipos/${c.equipo_id}`}
                                className="text-inn-primary hover:text-inn-dark font-medium"
                              >
                                Equipo #{c.equipos.numero_equipo}
                              </Link>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-3 text-sm text-gray-600">
                            {c.equipos?.usuario_asignado || '—'}
                          </td>
                          <td className="py-3">
                            <Link
                              href={`/dashboard/cableado/${c.id}/editar`}
                              className="text-inn-primary hover:text-inn-dark text-sm mr-2"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>

      {filteredConexiones.length === 0 && (
        <div className="text-center py-12 card">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterRack !== 'Todos' || filterTipo !== 'Todos'
              ? 'No se encontraron conexiones'
              : 'No hay conexiones registradas'}
          </p>
          {!searchTerm && filterRack === 'Todos' && filterTipo === 'Todos' && (
            <Link href="/dashboard/cableado/nuevo" className="btn-primary">
              Registrar Primera Conexión
            </Link>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total: {filteredConexiones.length} conexiones
      </div>
    </div>
  )
}
