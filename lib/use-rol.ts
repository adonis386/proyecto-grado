'use client'

import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export type RolUsuario = 'Administrador' | 'Técnico' | 'Gerente' | 'Empleado' | null

/**
 * Hook para obtener el rol del usuario actual desde la tabla empleados.
 * Si no tiene empleado vinculado, retorna null (se considera staff por compatibilidad en RLS).
 */
export function useRol(userId: string | undefined) {
  const [rol, setRol] = useState<RolUsuario>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setRol(null)
      setLoading(false)
      return
    }

    async function loadRol() {
      try {
        const { data } = await supabase
          .from('empleados')
          .select('rol')
          .eq('user_id', userId)
          .eq('activo', true)
          .single()
        setRol((data?.rol as RolUsuario) ?? null)
      } catch {
        setRol(null)
      } finally {
        setLoading(false)
      }
    }

    loadRol()
  }, [userId])

  // Si rol es null (sin empleado vinculado), se considera acceso completo (compatibilidad)
  const isStaff = rol === null || rol === 'Administrador' || rol === 'Técnico' || rol === 'Gerente'
  const canManageEmpleados = rol === null || rol === 'Administrador' || rol === 'Gerente'

  return { rol, isStaff, canManageEmpleados, loading }
}
