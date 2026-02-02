import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

/**
 * POST: Consultar la IA sobre una guía específica
 * Recibe: titulo, contenido, categoria, pregunta
 * Devuelve: respuesta de la IA basada en la guía
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada en variables de entorno !' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { titulo, contenido, categoria, pregunta } = body

    if (!contenido?.trim() || !pregunta?.trim()) {
      return NextResponse.json(
        { error: 'Se requieren el contenido de la guía y la pregunta' },
        { status: 400 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview'

    const prompt = `Eres un asistente de soporte técnico del departamento de TI del INN.
El usuario tiene una duda sobre la siguiente guía de la base de conocimiento. Responde ÚNICAMENTE basándote en el contenido de la guía. Si la guía no contiene la información necesaria para responder, indícalo amablemente y sugiere revisar el procedimiento completo o contactar a un técnico.

---

GUÍA: ${titulo || 'Sin título'}
Categoría: ${categoria || 'N/A'}

CONTENIDO DE LA GUÍA:
${contenido}

---

PREGUNTA DEL USUARIO:
${pregunta}

---

Responde de forma clara, concisa y en español. Máximo 300 palabras.`

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    })

    const text = response.text?.trim()
    if (!text) {
      return NextResponse.json(
        { error: 'La IA no generó una respuesta válida' },
        { status: 500 }
      )
    }

    return NextResponse.json({ respuesta: text })
  } catch (err: any) {
    console.error('[AI ask-guide]', err)
    return NextResponse.json(
      { error: err.message || 'Error al consultar' },
      { status: 500 }
    )
  }
}
