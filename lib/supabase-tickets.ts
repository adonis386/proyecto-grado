// Tipos para el sistema de tickets

export type Ticket = {
  id: string
  numero_ticket: number
  usuario_solicitante: string
  equipo_id: string | null
  tipo: TipoTicket
  estado: EstadoTicket
  prioridad: PrioridadTicket
  titulo: string
  descripcion: string
  asignado_a: string | null
  solucion: string | null
  observaciones: string | null
  fecha_resolucion: string | null
  created_at: string
  updated_at: string
}

export type TicketCompleto = Ticket & {
  equipos?: {
    numero_equipo: number
    usuario_asignado: string | null
  } | null
}

export type TipoTicket = 
  | 'Falla'
  | 'Cambio'
  | 'Mantenimiento'
  | 'Consulta'
  | 'Otro'

export type EstadoTicket = 
  | 'Abierto'
  | 'En Proceso'
  | 'Resuelto'
  | 'Cerrado'
  | 'Cancelado'

export type PrioridadTicket = 
  | 'Baja'
  | 'Media'
  | 'Alta'
  | 'Urgente'

export const TIPOS_TICKET: TipoTicket[] = [
  'Falla',
  'Cambio',
  'Mantenimiento',
  'Consulta',
  'Otro',
]

export const ESTADOS_TICKET: EstadoTicket[] = [
  'Abierto',
  'En Proceso',
  'Resuelto',
  'Cerrado',
  'Cancelado',
]

export const PRIORIDADES_TICKET: PrioridadTicket[] = [
  'Baja',
  'Media',
  'Alta',
  'Urgente',
]

