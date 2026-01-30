// Tipos para Base de Conocimiento / Guías - Modelo de Negocios INN

export type Guia = {
  id: string
  titulo: string
  categoria: string
  contenido: string
  palabras_clave: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export const CATEGORIAS_GUIA = [
  'Resetear equipo',
  'Revisar rack',
  'Conectividad',
  'Telefonía IP',
  'Cableado',
  'Procedimiento',
  'Otro',
]
