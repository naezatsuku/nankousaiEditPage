'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const LogoutPage = () => {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/')
    }

    logout()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">ログアウト中...</p>
    </div>
  )
}

export default LogoutPage