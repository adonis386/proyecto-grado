// Tipos para el módulo de Empleados - Modelo de Negocios INN

export type Empleado = {
  id: string
  user_id: string | null
  nombre_completo: string
  cargo: string | null
  email: string | null
  telefono: string | null
  direccion_ip: string | null
  acceso_internet: boolean
  acceso_llamadas: boolean
  rack: string | null
  departamento: string
  rol: RolEmpleado
  activo: boolean
  observaciones: string | null
  created_at: string
  updated_at: string
}

export type RolEmpleado =
  | 'Administrador'
  | 'Técnico'
  | 'Gerente'
  | 'Empleado'

export const ROLES_EMPLEADO: RolEmpleado[] = [
  'Empleado',
  'Técnico',
  'Gerente',
  'Administrador',
]
