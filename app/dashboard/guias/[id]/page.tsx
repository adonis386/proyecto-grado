'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Guia = {
  id: string
  titulo: string
  categoria: string
  contenido: string
  palabras_clave: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export default function GuiaDetallePage() {
  const params = useParams()
  const [guia, setGuia] = useState<Guia | null>(null)
  const [loading, setLoading] = useState(true)
  const [pregunta, setPregunta] = useState('')
  const [respuestaIA, setRespuestaIA] = useState('')
  const [loadingIA, setLoadingIA] = useState(false)

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
      setGuia(data)
    } catch (error: any) {
      toast.error('Error al cargar guía')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePreguntarIA() {
    if (!pregunta?.trim() || !guia) return
    setLoadingIA(true)
    setRespuestaIA('')
    try {
      const res = await fetch('/api/ai/ask-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: guia.titulo,
          contenido: guia.contenido,
          categoria: guia.categoria,
          pregunta: pregunta.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setRespuestaIA(data.respuesta)
    } catch (err: any) {
      toast.error(err.message || 'Error al consultar')
    } finally {
      setLoadingIA(false)
    }
  }

  if (loading) return <div className="text-center py-12">Cargando...</div>
  if (!guia) return <div className="text-center py-12">Guía no encontrada</div>

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/guias" className="text-inn-primary hover:text-inn-dark font-medium mb-4 inline-block">
          ← Volver a Guías
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{guia.titulo}</h1>
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800">
              {guia.categoria}
            </span>
            {!guia.activo && (
              <span className="ml-2 inline-flex px-3 py-1 text-sm rounded bg-gray-200 text-gray-600">
                Inactiva
              </span>
            )}
          </div>
          <Link href={`/dashboard/guias/${guia.id}/editar`} className="btn-primary">
            ✏️ Editar
          </Link>
        </div>
      </div>

      <div className="card">
        {guia.palabras_clave && (
          <div className="mb-4 pb-4 border-b">
            <p className="text-sm text-gray-500">Palabras clave</p>
            <p className="text-gray-700">{guia.palabras_clave}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Procedimiento</h2>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
              {guia.contenido}
            </pre>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-sm text-gray-500">
          Actualizado: {new Date(guia.updated_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">¿Tienes dudas sobre esta guía?</h2>
        <p className="text-sm text-gray-600 mb-3">
          Escribe tu pregunta y la IA te responderá basándose en el contenido de esta guía.
        </p>
        <div className="space-y-2">
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Ej: ¿En qué paso debo verificar el rack? ¿Qué hago si el equipo no responde?"
            className="input-field w-full"
            rows={3}
            disabled={loadingIA}
          />
          <button
            type="button"
            onClick={handlePreguntarIA}
            disabled={loadingIA || !pregunta?.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingIA ? 'Consultando...' : '✨ Preguntar a la IA'}
          </button>
        </div>
        {respuestaIA && (
          <div className="mt-4 p-4 rounded-lg bg-purple-50 border border-purple-100">
            <p className="text-sm font-medium text-purple-800 mb-2">Respuesta de la IA:</p>
            <p className="text-gray-700 whitespace-pre-wrap">{respuestaIA}</p>
          </div>
        )}
      </div>
    </div>
  )
}
