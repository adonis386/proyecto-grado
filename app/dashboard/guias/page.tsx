'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CATEGORIAS_GUIA } from '@/lib/supabase-guias'

type Guia = {
  id: string
  titulo: string
  categoria: string
  contenido: string
  palabras_clave: string | null
  activo: boolean
  created_at: string
}

export default function GuiasPage() {
  const [guias, setGuias] = useState<Guia[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('Todas')

  useEffect(() => {
    loadGuias()
  }, [])

  async function loadGuias() {
    try {
      const { data, error } = await supabase
        .from('guias')
        .select('id, titulo, categoria, contenido, palabras_clave, activo, created_at')
        .order('titulo')

      if (error) throw error
      setGuias(data || [])
    } catch (error: any) {
      toast.error('Error al cargar guías')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta guía?')) return

    try {
      const { error } = await supabase
        .from('guias')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Guía eliminada')
      loadGuias()
    } catch (error: any) {
      toast.error('Error al eliminar guía')
    }
  }

  const filteredGuias = guias.filter((g) => {
    const matchSearch =
      g.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.contenido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.palabras_clave?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = filterCategoria === 'Todas' || g.categoria === filterCategoria
    return matchSearch && matchCategoria
  })

  function getResumen(contenido: string, maxLen = 120) {
    const limpio = contenido.replace(/\n/g, ' ').trim()
    return limpio.length > maxLen ? limpio.slice(0, maxLen) + '...' : limpio
  }

  if (loading) {
    return <div className="text-center py-12">Cargando guías...</div>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Base de Conocimiento</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Guías para técnicos: resetear equipos, revisar racks, procedimientos
          </p>
        </div>
        <Link href="/dashboard/guias/nuevo" className="btn-primary text-center whitespace-nowrap">
          ➕ Nueva Guía
        </Link>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Título, contenido, palabras clave..."
            />
          </div>
          <div>
            <label className="label">Categoría</label>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="input-field"
            >
              <option value="Todas">Todas</option>
              {CATEGORIAS_GUIA.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de guías */}
      <div className="space-y-4">
        {filteredGuias.map((guia) => (
          <div key={guia.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{guia.titulo}</h3>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    {guia.categoria}
                  </span>
                  {!guia.activo && (
                    <span className="inline-flex px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-600">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{getResumen(guia.contenido)}</p>
                {guia.palabras_clave && (
                  <p className="text-xs text-gray-500">
                    🔑 {guia.palabras_clave}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/dashboard/guias/${guia.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold"
                >
                  Ver
                </Link>
                <Link
                  href={`/dashboard/guias/${guia.id}/editar`}
                  className="btn-primary text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(guia.id)}
                  className="btn-danger text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGuias.length === 0 && (
        <div className="text-center py-12 card">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterCategoria !== 'Todas'
              ? 'No se encontraron guías con los filtros aplicados'
              : 'No hay guías registradas'}
          </p>
          {!searchTerm && filterCategoria === 'Todas' && (
            <Link href="/dashboard/guias/nuevo" className="btn-primary">
              Crear Primera Guía
            </Link>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredGuias.length} de {guias.length} guías
      </div>
    </div>
  )
}
