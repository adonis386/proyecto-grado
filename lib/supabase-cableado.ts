// Tipos para Organización del Cableado - Modelo de Negocios INN

export type ConexionRack = {
  id: string
  rack: string
  puerto: string
  equipo_id: string | null
  tipo_conexion: TipoConexion
  descripcion: string | null
  created_at: string
  updated_at: string
}

export type TipoConexion = 'Red' | 'Energía' | 'VoIP' | 'Otro'

export const TIPOS_CONEXION: TipoConexion[] = ['Red', 'Energía', 'VoIP', 'Otro']
