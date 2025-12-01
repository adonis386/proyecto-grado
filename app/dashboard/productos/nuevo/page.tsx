'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadProductImage } from '@/lib/upload-image'
import ImageUpload from '@/components/ImageUpload'
import toast from 'react-hot-toast'
import Link from 'next/link'

type Categoria = {
  id: string
  nombre: string
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    estado: 'Disponible',
    ubicacion: '',
    fecha_adquisicion: '',
  })

  useEffect(() => {
    loadCategorias()
  }, [])

  async function loadCategorias() {
    const { data } = await supabase
      .from('categorias')
      .select('id, nombre')
      .order('nombre')
    
    setCategorias(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl: string | null = null

      // Prioridad 1: Subir archivo si se seleccionó
      if (imageFile) {
        toast.loading('Subiendo imagen...', { id: 'upload' })
        finalImageUrl = await uploadProductImage(imageFile)
        toast.dismiss('upload')
      } 
      // Prioridad 2: Usar URL si se ingresó
      else if (imageUrl) {
        finalImageUrl = imageUrl
      }

      const { error } = await supabase
        .from('productos')
        .insert([{
          ...formData,
          imagen_url: finalImageUrl,
        }])

      if (error) throw error
      
      toast.success('Producto creado correctamente')
      router.push('/dashboard/productos')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Producto</h1>
        <p className="text-gray-600">Registra un nuevo equipo informático en el inventario</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Nombre del Producto *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="input-field"
                placeholder="Ej: Laptop Dell Latitude 7420"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Descripción detallada del equipo..."
              />
            </div>

            <div>
              <label className="label">Categoría *</label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                required
                className="input-field"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Estado *</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                required
                className="input-field"
              >
                <option value="Disponible">Disponible</option>
                <option value="En Uso">En Uso</option>
                <option value="En Reparación">En Reparación</option>
                <option value="Dado de Baja">Dado de Baja</option>
              </select>
            </div>

            <div>
              <label className="label">Marca</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="input-field"
                placeholder="Ej: Dell, HP, Lenovo"
              />
            </div>

            <div>
              <label className="label">Modelo</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="input-field"
                placeholder="Ej: Latitude 7420"
              />
            </div>

            <div>
              <label className="label">Número de Serie</label>
              <input
                type="text"
                value={formData.numero_serie}
                onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                className="input-field"
                placeholder="Ej: SN123456789"
              />
            </div>

            <div>
              <label className="label">Ubicación</label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="input-field"
                placeholder="Ej: Oficina 201"
              />
            </div>

            <div>
              <label className="label">Fecha de Adquisición</label>
              <input
                type="date"
                value={formData.fecha_adquisicion}
                onChange={(e) => setFormData({ ...formData, fecha_adquisicion: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Subida de imagen */}
          <div className="md:col-span-2">
            <ImageUpload
              onImageSelected={setImageFile}
              onImageUrlChanged={setImageUrl}
            />
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
            <Link href="/dashboard/productos" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

