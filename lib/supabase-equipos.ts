// Tipos para el sistema de inventario de equipos IT (estructura real de INN)

export type Equipo = {
  id: string
  numero_equipo: number
  usuario_asignado: string | null
  estado: EstadoEquipo
  ubicacion: string
  departamento: string
  observaciones: string | null
  created_at: string
  updated_at: string
}

export type Componente = {
  id: string
  equipo_id: string
  tipo: TipoComponente
  marca: string | null
  modelo: string | null
  numero_serie: string | null
  placa: string | null
  created_at: string
  updated_at: string
}

export type EquipoCompleto = Equipo & {
  componentes: Componente[]
}

export type EstadoEquipo = 
  | 'Operativo'
  | 'Disponible'
  | 'No Operativo'
  | 'En Reparación'
  | 'En Mantenimiento'

export type TipoComponente = 
  | 'CPU'
  | 'Monitor'
  | 'Teclado'
  | 'Mouse'

export const ESTADOS_EQUIPO: EstadoEquipo[] = [
  'Operativo',
  'Disponible',
  'No Operativo',
  'En Reparación',
  'En Mantenimiento',
]

export const TIPOS_COMPONENTE: TipoComponente[] = [
  'CPU',
  'Monitor',
  'Teclado',
  'Mouse',
]

