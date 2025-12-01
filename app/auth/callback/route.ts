import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Si hay un error, redirigir a la página de error
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?error=${error}&error_description=${error_description || ''}`, requestUrl.origin)
    )
  }

  // Si hay un código, significa que la confirmación fue exitosa
  if (code) {
    // Redirigir a la página de confirmación exitosa
    return NextResponse.redirect(new URL('/auth/confirmed', requestUrl.origin))
  }

  // Si no hay código ni error, redirigir al login
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}

