// hooks/useSession.ts
'use client'
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const useSession = () => {
  const [session, setSession] = useState<null |Session>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
  }, [])

  return { session, loading }
}