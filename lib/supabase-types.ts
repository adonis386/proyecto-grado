// Tipos para el sistema de inventario de dispositivos IT

export type Dispositivo = {
  id: string
  nombre: string
  descripcion: string | null
  categoria_id: string
  marca: string | null
  modelo: string | null
  numero_serie: string | null
  estado: EstadoDispositivo
  ubicacion: string | null
  fecha_adquisicion: string | null
  proveedor: string | null
  numero_factura: string | null
  garantia_meses: number | null
  fecha_vencimiento_garantia: string | null
  asignado_a: string | null
  departamento: string
  especificaciones: any | null
  observaciones: string | null
  imagen_url: string | null
  created_at: string
  updated_at: string
}

export type DispositivoConCategoria = Dispositivo & {
  categorias: {
    nombre: string
  }
}

export type Categoria = {
  id: string
  nombre: string
  descripcion: string | null
  created_at: string
}

export type EstadoDispositivo = 
  | 'Disponible'
  | 'En Uso'
  | 'En Reparación'
  | 'En Mantenimiento'
  | 'Dado de Baja'
  | 'En Garantía'

export const ESTADOS_DISPOSITIVO: EstadoDispositivo[] = [
  'Disponible',
  'En Uso',
  'En Reparación',
  'En Mantenimiento',
  'Dado de Baja',
  'En Garantía',
]

export const CATEGORIAS_IT = [
  'Computadoras de Escritorio',
  'Laptops',
  'Servidores',
  'Equipos de Red',
  'Almacenamiento',
  'Periféricos',
  'Equipos de Videoconferencia',
  'UPS y Energía',
  'Telefonía IP',
  'Equipos Móviles',
  'Componentes',
  'Otros Equipos',
]

