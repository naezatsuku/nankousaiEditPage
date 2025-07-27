"use client"
import { supabase } from '@/lib/supabaseClient'
import React from 'react'

export default function page(){
  const handleLogin = async ()=>{
    const redirectUrl = window.location.origin
    await supabase.auth.signInWithOAuth({"provider":"google",options:{redirectTo:`${redirectUrl}/auth/callback`}})
  }
  const checkSession=async()=>{
    const {data:session,error:err} = await supabase.auth.getSession(); 
    console.log("session",session,"error",err)

  }
   return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">ログイン</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 shadow"
      >
        Googleでログイン
      </button>
      <button
        onClick={checkSession}
        className="bg-gray-200 text-black px-4 py-2 rounded shadow"
      >
        セッション確認
      </button>
    </main>
  )

}

