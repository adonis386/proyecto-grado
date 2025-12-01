'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

type Categoria = {
  id: string
  nombre: string
  descripcion: string | null
  created_at: string
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  })

  useEffect(() => {
    loadCategorias()
  }, [])

  async function loadCategorias() {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre')

      if (error) throw error
      setCategorias(data || [])
    } catch (error: any) {
      toast.error('Error al cargar categorías')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      if (editingCategoria) {
        // Actualizar
        const { error } = await supabase
          .from('categorias')
          .update(formData)
          .eq('id', editingCategoria.id)

        if (error) throw error
        toast.success('Categoría actualizada correctamente')
      } else {
        // Crear nueva
        const { error } = await supabase
          .from('categorias')
          .insert([formData])

        if (error) throw error
        toast.success('Categoría creada correctamente')
      }

      setShowModal(false)
      setFormData({ nombre: '', descripcion: '' })
      setEditingCategoria(null)
      loadCategorias()
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar categoría')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Categoría eliminada')
      loadCategorias()
    } catch (error: any) {
      toast.error('No se puede eliminar. Puede tener productos asociados.')
    }
  }

  function openModal(categoria?: Categoria) {
    if (categoria) {
      setEditingCategoria(categoria)
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
      })
    } else {
      setEditingCategoria(null)
      setFormData({ nombre: '', descripcion: '' })
    }
    setShowModal(true)
  }

  if (loading) {
    return <div className="text-center py-12">Cargando categorías...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías de equipos informáticos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary"
        >
          ➕ Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {categoria.nombre}
            </h3>
            <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
              {categoria.descripcion || 'Sin descripción'}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => openModal(categoria)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(categoria.id)}
                className="flex-1 btn-danger text-sm"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No hay categorías registradas</p>
          <button onClick={() => openModal()} className="btn-primary">
            Crear Primera Categoría
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Ej: Computadoras"
                />
              </div>
              <div className="mb-6">
                <label className="label">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Descripción de la categoría..."
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 btn-primary">
                  {editingCategoria ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

