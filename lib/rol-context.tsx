'use client'

import { createContext, useContext } from 'react'
import { useRol } from './use-rol'

type RolContextType = {
  isStaff: boolean
  canManageEmpleados: boolean
  rol: 'Administrador' | 'Técnico' | 'Gerente' | 'Empleado' | null
  loading: boolean
}

const RolContext = createContext<RolContextType | null>(null)

export function RolProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId: string | undefined
}) {
  const value = useRol(userId)
  return <RolContext.Provider value={value}>{children}</RolContext.Provider>
}

export function useRolContext() {
  const ctx = useContext(RolContext)
  return ctx ?? {
    isStaff: true,
    canManageEmpleados: true,
    rol: null,
    loading: false,
  }
}
