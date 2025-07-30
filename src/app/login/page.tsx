'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      setMessage('メール送信に失敗しました。再度お試しください。')
    } else {
      setMessage('メールを送信しました。受信箱をご確認ください。')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-6">メールでログイン</h1>
      <input
        type="email"
        placeholder="your@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border px-3 py-2 mb-4 w-64"
      />
      <button
        onClick={handleSendLink}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        リンクを送信
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </main>
  )
}