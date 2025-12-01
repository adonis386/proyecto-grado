'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Producto = {
  id: string
  nombre: string
  descripcion: string | null
  marca: string | null
  modelo: string | null
  numero_serie: string | null
  estado: string
  ubicacion: string | null
  fecha_adquisicion: string | null
  precio: number | null
  created_at: string
  updated_at: string
  categorias: {
    nombre: string
  }
}

export default function ProductoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducto()
  }, [params.id])

  async function loadProducto() {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categorias (nombre)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error
      setProducto(data)
    } catch (error: any) {
      toast.error('Error al cargar producto')
      router.push('/dashboard/productos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', params.id)

      if (error) throw error
      toast.success('Producto eliminado')
      router.push('/dashboard/productos')
    } catch (error: any) {
      toast.error('Error al eliminar producto')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando producto...</div>
  }

  if (!producto) {
    return <div className="text-center py-12">Producto no encontrado</div>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/productos"
          className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block"
        >
          ← Volver a Productos
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
            <p className="text-gray-600">Detalles del equipo informático</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/productos/${producto.id}/editar`}
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
        {/* Columna izquierda - Imagen */}
        {producto.imagen_url && (
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Imagen</h2>
              <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Información Principal */}
        <div className={producto.imagen_url ? 'lg:col-span-2 space-y-6' : 'lg:col-span-3 space-y-6'}>
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre</p>
                <p className="font-semibold text-gray-900">{producto.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Categoría</p>
                <p className="font-semibold text-gray-900">{producto.categorias.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Marca</p>
                <p className="font-semibold text-gray-900">{producto.marca || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Modelo</p>
                <p className="font-semibold text-gray-900">{producto.modelo || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Descripción</p>
                <p className="text-gray-900">{producto.descripcion || '-'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles Técnicos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Número de Serie</p>
                <p className="font-semibold text-gray-900 font-mono">
                  {producto.numero_serie || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  producto.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                  producto.estado === 'En Uso' ? 'bg-yellow-100 text-yellow-800' :
                  producto.estado === 'En Reparación' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {producto.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                <p className="font-semibold text-gray-900">{producto.ubicacion || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Precio</p>
                <p className="font-semibold text-gray-900">{formatPrice(producto.precio)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel lateral - solo si NO hay imagen, sino ya está en la columna izquierda */}
      {!producto.imagen_url && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha de Adquisición</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(producto.fecha_adquisicion)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Registrado el</p>
                <p className="text-gray-900">
                  {formatDate(producto.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Última actualización</p>
                <p className="text-gray-900">
                  {formatDate(producto.updated_at)}
                </p>
              </div>
            </div>
          </div>

            <div className="card bg-inn-light border-2 border-inn-primary">
              <h3 className="font-bold text-inn-primary mb-2">ID del Producto</h3>
              <p className="text-xs font-mono text-gray-600 break-all">{producto.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

