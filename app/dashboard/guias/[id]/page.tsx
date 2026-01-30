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
    </div>
  )
}
