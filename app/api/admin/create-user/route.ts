import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * POST: Crear usuario en Auth y vincular con empleado.
 * Solo Admin y Gerente pueden llamar esta API.
 * El cliente debe enviar el access_token en el header Authorization.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 })
    }

    const body = await request.json()
    const { email, password, empleadoId, empleadoData, rol } = body

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email y contraseña (mínimo 6 caracteres) son requeridos' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY no configurada. Revisa las variables de entorno.' },
        { status: 500 }
      )
    }

    // Verificar token y obtener user_id
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }

    const { data: empleado } = await supabase
      .from('empleados')
      .select('rol')
      .eq('user_id', user.id)
      .single()

    const rolActual = empleado?.rol ?? null
    if (rolActual !== 'Administrador' && rolActual !== 'Gerente') {
      return NextResponse.json({ error: 'Sin permisos. Solo Admin y Gerente pueden crear usuarios.' }, { status: 403 })
    }

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // No requiere confirmación por email
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 400 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
    }

    // Si hay empleadoId: actualizar empleado existente con user_id
    if (empleadoId) {
      const { error: updateError } = await supabaseAdmin
        .from('empleados')
        .update({
          user_id: userId,
          ...(rol && { rol }),
        })
        .eq('id', empleadoId)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, userId, message: 'Usuario creado y empleado vinculado' })
    }

    // Si hay empleadoData: crear nuevo empleado
    if (empleadoData) {
      const { error: insertError } = await supabaseAdmin
        .from('empleados')
        .insert([
          {
            ...empleadoData,
            user_id: userId,
            rol: rol || empleadoData.rol || 'Empleado',
            activo: true,
          },
        ])

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, userId, message: 'Usuario y empleado creados' })
    }

    return NextResponse.json({ error: 'Se requiere empleadoId o empleadoData' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 })
  }
}
