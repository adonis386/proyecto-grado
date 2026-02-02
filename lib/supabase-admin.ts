/**
 * Cliente Supabase con Service Role - SOLO uso en servidor (API routes).
 * Tiene permisos de administrador para crear usuarios, etc.
 * NUNCA exponer SUPABASE_SERVICE_ROLE_KEY al cliente.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!serviceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY no está configurada. La creación de usuarios no funcionará.')
}

export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null
