'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function EmailConfirmedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Countdown para redirigir automáticamente
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-inn-light via-white to-inn-secondary/10 px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Image src="/logo.png" alt="INN Logo" fill className="object-contain" />
          </div>

          {/* Ícono de éxito */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Email Confirmado! ✅
          </h1>

          <p className="text-gray-600 mb-6">
            Tu correo electrónico ha sido verificado exitosamente.
            Ya puedes iniciar sesión en el sistema de inventario INN.
          </p>

          <div className="bg-inn-light border-2 border-inn-primary rounded-lg p-4 mb-6">
            <p className="text-sm text-inn-dark font-medium">
              Serás redirigido automáticamente en {countdown} segundos...
            </p>
          </div>

          <Link
            href="/login"
            className="btn-primary w-full inline-block"
          >
            Ir a Iniciar Sesión Ahora
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 INN - Proyecto de Grado
        </p>
      </div>
    </div>
  )
}

