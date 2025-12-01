'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Producto = {
  id: string
  nombre: string
  descripcion: string | null
  categoria_id: string
  marca: string | null
  modelo: string | null
  numero_serie: string | null
  estado: string
  ubicacion: string | null
  fecha_adquisicion: string | null
  precio: number | null
  imagen_url: string | null
  categorias: {
    nombre: string
  }
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('Todos')

  useEffect(() => {
    loadProductos()
  }, [])

  async function loadProductos() {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categorias (nombre)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProductos(data || [])
    } catch (error: any) {
      toast.error('Error al cargar productos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Producto eliminado')
      loadProductos()
    } catch (error: any) {
      toast.error('Error al eliminar producto')
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       producto.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       producto.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       producto.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchEstado = filterEstado === 'Todos' || producto.estado === filterEstado

    return matchSearch && matchEstado
  })

  if (loading) {
    return <div className="text-center py-12">Cargando productos...</div>
  }

  const estados = ['Todos', 'Disponible', 'En Uso', 'En Reparación', 'Dado de Baja']

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Productos</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestiona el inventario de equipos informáticos</p>
        </div>
        <Link href="/dashboard/productos/nuevo" className="btn-primary text-center whitespace-nowrap">
          ➕ Nuevo Producto
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
              placeholder="Nombre, marca, modelo, número de serie..."
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
        </div>
      </div>

      {/* Lista de productos - Desktop: Tabla, Mobile: Cards */}
      
      {/* Vista Desktop (oculta en móvil) */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-inn-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Imagen</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Producto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Categoría</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Marca/Modelo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">N° Serie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ubicación</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProductos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {producto.imagen_url ? (
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        <span className="text-2xl">📦</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{producto.nombre}</div>
                    {producto.descripcion && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {producto.descripcion}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {producto.categorias.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>{producto.marca || '-'}</div>
                    <div className="text-gray-500">{producto.modelo || ''}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                    {producto.numero_serie || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      producto.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                      producto.estado === 'En Uso' ? 'bg-yellow-100 text-yellow-800' :
                      producto.estado === 'En Reparación' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {producto.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {producto.ubicacion || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <Link
                        href={`/dashboard/productos/${producto.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/dashboard/productos/${producto.id}/editar`}
                        className="text-inn-primary hover:text-inn-dark font-medium text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(producto.id)}
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

      {/* Vista Mobile (oculta en desktop) */}
      <div className="lg:hidden space-y-4">
        {filteredProductos.map((producto) => (
          <div key={producto.id} className="card">
            <div className="flex gap-4">
              {/* Imagen */}
              {producto.imagen_url ? (
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-3xl">📦</span>
                </div>
              )}

              {/* Información */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{producto.nombre}</h3>
                <p className="text-sm text-gray-600 truncate">{producto.categorias.nombre}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    producto.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                    producto.estado === 'En Uso' ? 'bg-yellow-100 text-yellow-800' :
                    producto.estado === 'En Reparación' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {producto.estado}
                  </span>
                </div>
              </div>
            </div>

            {/* Detalles adicionales */}
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
              {producto.marca && (
                <p className="text-gray-600">
                  <span className="font-medium">Marca:</span> {producto.marca} {producto.modelo}
                </p>
              )}
              {producto.numero_serie && (
                <p className="text-gray-600">
                  <span className="font-medium">Serie:</span> <span className="font-mono text-xs">{producto.numero_serie}</span>
                </p>
              )}
              {producto.ubicacion && (
                <p className="text-gray-600">
                  <span className="font-medium">Ubicación:</span> {producto.ubicacion}
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="mt-4 flex gap-2">
              <Link
                href={`/dashboard/productos/${producto.id}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold text-center"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/productos/${producto.id}/editar`}
                className="flex-1 btn-primary text-sm text-center"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(producto.id)}
                className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProductos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || filterEstado !== 'Todos' 
              ? 'No se encontraron productos con los filtros aplicados'
              : 'No hay productos registrados'}
          </p>
          {!searchTerm && filterEstado === 'Todos' && (
            <Link href="/dashboard/productos/nuevo" className="btn-primary">
              Crear Primer Producto
            </Link>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredProductos.length} de {productos.length} productos
      </div>
    </div>
  )
}

