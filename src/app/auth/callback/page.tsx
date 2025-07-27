"use client"
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'
import  { useEffect } from 'react'

const AuthCallBackPage = () => {
  const router = useRouter();
  useEffect(() => {
    const handleSessionCheck = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      console.log(user?.id)
      if (!user) {
        router.push('/login')
        return
      }
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (error || !profile?.name || !profile?.class_id) {
        console.log('プロフィール未登録または不完全', error)
        router.push('/auth/profile') 
        return
      }

      router.push('/')
    }

    handleSessionCheck()
  }, [router])


}

export default AuthCallBackPage