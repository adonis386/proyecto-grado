'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { CATEGORIAS_GUIA } from '@/lib/supabase-guias'

export default function EditarGuiaPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingIA, setLoadingIA] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'Procedimiento',
    contenido: '',
    palabras_clave: '',
    activo: true,
  })

  useEffect(() => {
    loadGuia()
  }, [params.id])

  async function loadGuia() {
    try {
      const { data, error } = await supabase
        .from('guias')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setFormData({
        titulo: data.titulo || '',
        categoria: data.categoria || 'Procedimiento',
        contenido: data.contenido || '',
        palabras_clave: data.palabras_clave || '',
        activo: data.activo ?? true,
      })
    } catch (error: any) {
      toast.error('Error al cargar guía')
      router.push('/dashboard/guias')
    } finally {
      setLoadingData(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('guias')
        .update({
          titulo: formData.titulo.trim(),
          categoria: formData.categoria,
          contenido: formData.contenido.trim(),
          palabras_clave: formData.palabras_clave.trim() || null,
          activo: formData.activo,
        })
        .eq('id', params.id)

      if (error) throw error
      toast.success('Guía actualizada correctamente')
      router.push(`/dashboard/guias/${params.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar guía')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerarConIA() {
    if (!formData.titulo?.trim()) {
      toast.error('Ingresa un título para generar la guía')
      return
    }
    setLoadingIA(true)
    try {
      const res = await fetch('/api/ai/suggest-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: formData.titulo,
          categoria: formData.categoria,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setFormData((prev) => ({
        ...prev,
        contenido: data.contenido || prev.contenido,
        palabras_clave: data.palabras_clave || prev.palabras_clave,
      }))
      toast.success('Borrador generado')
    } catch (err: any) {
      toast.error(err.message || 'Error al generar guía')
    } finally {
      setLoadingIA(false)
    }
  }

  if (loadingData) return <div className="text-center py-12">Cargando...</div>

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/guias/${params.id}`}
          className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block"
        >
          ← Volver a la Guía
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Guía</h1>
        <p className="text-gray-600">Actualiza el contenido de la guía</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-6">
            <div>
              <label className="label">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="input-field"
              >
                {CATEGORIAS_GUIA.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <label className="label mb-0">Contenido *</label>
                <button
                  type="button"
                  onClick={handleGenerarConIA}
                  disabled={loadingIA || !formData.titulo?.trim()}
                  className="text-sm px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {loadingIA ? '...' : '✨'} Generar con IA
                </button>
              </div>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                required
                className="input-field"
                rows={12}
              />
            </div>

            <div>
              <label className="label">Palabras clave</label>
              <input
                type="text"
                value={formData.palabras_clave}
                onChange={(e) => setFormData({ ...formData, palabras_clave: e.target.value })}
                className="input-field"
                placeholder="Separadas por coma"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="rounded"
              />
              <span>Guía activa (visible para técnicos)</span>
            </label>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>
            <Link href={`/dashboard/guias/${params.id}`} className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
