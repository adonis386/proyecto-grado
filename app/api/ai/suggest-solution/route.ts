import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

/**
 * POST: Sugerir descripción de solución para un ticket usando Gemini
 * Recibe: titulo, descripcion, tipo
 * Devuelve: texto sugerido para el campo "Solución"
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada en variables de entorno' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { titulo, descripcion, tipo } = body

    if (!titulo?.trim() || !descripcion?.trim()) {
      return NextResponse.json(
        { error: 'Se requieren título y descripción del ticket' },
        { status: 400 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview'

    const prompt = `Eres un asistente de soporte técnico del departamento de TI del INN.
Basándote en el siguiente ticket de incidencia, sugiere una descripción técnica breve para el campo "Solución" que un técnico registraría al resolver el problema.
Sé conciso (2-5 oraciones). Usa lenguaje técnico apropiado. No inventes detalles que no se mencionen.

Ticket:
- Tipo: ${tipo || 'No especificado'}
- Título: ${titulo}
- Descripción: ${descripcion}

Responde únicamente con el texto de la solución sugerida, sin encabezados ni explicaciones adicionales.`

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    })

    const text = response.text
    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'La IA no generó una respuesta válida' },
        { status: 500 }
      )
    }

    return NextResponse.json({ solucion: text.trim() })
  } catch (err: any) {
    console.error('[AI suggest-solution]', err)
    return NextResponse.json(
      { error: err.message || 'Error al generar sugerencia' },
      { status: 500 }
    )
  }
}
