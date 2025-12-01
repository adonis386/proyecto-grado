'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-inn-light to-white">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image src="/logo.png" alt="INN Logo" fill className="object-contain" />
          </div>
          <p className="text-inn-primary text-xl font-semibold">Cargando...</p>
        </div>
      </div>
    )
  }

  return null
}

