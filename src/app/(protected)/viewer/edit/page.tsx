"use client"

import { Suspense, useEffect } from "react"


import { KaiseiDecol } from "@/fonts";
import PageInner from "./PageInner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const kaiseiDecol = KaiseiDecol
export default function Page() {
    const router = useRouter()
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
          if(profile.role != "admin" && profile.role != "editor"){
            return router.push('/auth/editRequest')
          }
          return console.log(profile.role)
        }
    
        handleSessionCheck()
      }, [router])
    return(
        
        <div className="h-screen bg-white">
            <Suspense>
                <PageInner></PageInner>
            </Suspense>
            
        </div>
        
        
    )
}