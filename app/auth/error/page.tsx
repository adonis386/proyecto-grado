'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Error desconocido'
  const errorDescription = searchParams.get('error_description') || 'Hubo un problema con la autenticación'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-inn-light via-white to-inn-secondary/10 px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Image src="/logo.png" alt="INN Logo" fill className="object-contain" />
          </div>

          {/* Ícono de error */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Error de Autenticación
          </h1>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium mb-2">
              {error}
            </p>
            <p className="text-sm text-red-600">
              {errorDescription}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="btn-primary w-full inline-block"
            >
              Volver a Iniciar Sesión
            </Link>
            <Link
              href="/login"
              className="btn-secondary w-full inline-block"
            >
              Intentar Registrarse de Nuevo
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 INN - Proyecto de Grado
        </p>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}

