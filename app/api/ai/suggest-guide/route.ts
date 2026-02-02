import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

/**
 * POST: Generar borrador de guía técnica con Gemini
 * Recibe: titulo, categoria (opcional)
 * Devuelve: contenido (y opcionalmente palabras_clave)
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
    const { titulo, categoria } = body

    if (!titulo?.trim()) {
      return NextResponse.json(
        { error: 'Se requiere el título de la guía' },
        { status: 400 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview'

    const prompt = `Eres un experto en soporte técnico del departamento de TI del INN.
Genera un borrador de guía técnica paso a paso para el siguiente tema. El contenido debe ser claro, técnico y fácil de seguir para un técnico de soporte.

Título de la guía: ${titulo}
${categoria ? `Categoría: ${categoria}` : ''}

Instrucciones:
1. Escribe el contenido en formato texto plano, con pasos numerados (1., 2., 3., etc.).
2. Incluye pasos concretos, verificaciones y recomendaciones de seguridad si aplica.
3. Usa lenguaje técnico apropiado (resetear, reiniciar, rack, switch, patch panel, etc.).
4. Al final, agrega una línea en blanco y luego "Palabras clave sugeridas:" seguido de 4-6 palabras o frases cortas separadas por coma.
5. No incluyas encabezados tipo "Introducción" ni "Conclusión"; ve directo a los pasos.
6. Máximo 400 palabras.

Responde únicamente con el contenido de la guía más las palabras clave al final.`

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    })

    const rawText = response.text?.trim()
    if (!rawText) {
      return NextResponse.json(
        { error: 'La IA no generó una respuesta válida' },
        { status: 500 }
      )
    }

    // Separar contenido y palabras clave
    const claveIdx = rawText.toLowerCase().indexOf('palabras clave sugeridas:')
    let contenido = rawText
    let palabras_clave = ''

    if (claveIdx >= 0) {
      contenido = rawText.slice(0, claveIdx).trim()
      palabras_clave = rawText.slice(claveIdx).replace(/^palabras clave sugeridas:\s*/i, '').trim()
    }

    return NextResponse.json({
      contenido: contenido || rawText,
      palabras_clave: palabras_clave || undefined,
    })
  } catch (err: any) {
    console.error('[AI suggest-guide]', err)
    return NextResponse.json(
      { error: err.message || 'Error al generar guía' },
      { status: 500 }
    )
  }
}
