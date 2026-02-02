'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { CATEGORIAS_GUIA } from '@/lib/supabase-guias'

export default function NuevaGuiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingIA, setLoadingIA] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'Procedimiento',
    contenido: '',
    palabras_clave: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('guias').insert([
        {
          titulo: formData.titulo.trim(),
          categoria: formData.categoria,
          contenido: formData.contenido.trim(),
          palabras_clave: formData.palabras_clave.trim() || null,
          activo: true,
        },
      ])
      if (error) throw error
      toast.success('Guía creada correctamente')
      router.push('/dashboard/guias')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear guía')
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Guía</h1>
        <p className="text-gray-600">Agrega información para que los técnicos resuelvan problemas de forma remota</p>
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
                placeholder="Ej: Cómo resetear equipo VIT modelo E1210"
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
                placeholder="Describe el procedimiento paso a paso..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Incluye pasos claros para que los técnicos puedan seguir la guía
              </p>
            </div>

            <div>
              <label className="label">Palabras clave</label>
              <input
                type="text"
                value={formData.palabras_clave}
                onChange={(e) => setFormData({ ...formData, palabras_clave: e.target.value })}
                className="input-field"
                placeholder="VIT, reset, rack-01, internet (separadas por coma)"
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Crear Guía'}
            </button>
            <Link href="/dashboard/guias" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
