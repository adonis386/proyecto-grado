import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * POST: Cambiar contraseña de un usuario (por Admin/Gerente).
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, newPassword } = body

    if (!userId || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'userId y newPassword (mínimo 6 caracteres) son requeridos' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY no configurada' },
        { status: 500 }
      )
    }

    // Verificar que quien llama es Admin o Gerente
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }

    const { data: empleado } = await supabase
      .from('empleados')
      .select('rol')
      .eq('user_id', user.id)
      .single()

    const rolActual = empleado?.rol ?? null
    if (rolActual !== 'Administrador' && rolActual !== 'Gerente') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Contraseña actualizada' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 })
  }
}
