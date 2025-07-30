"use client"
import Header from '@/components/global/header'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div>
        <Header/>
        <div className="h-screen flex items-center justify-center">
            <div className="text-4xl font-semibold text-red-400 border-b-2 hover:scale-105 transition duration-300">
                <Link href={"https://nankousai-control-time.vercel.app/"}>待ち時間更新へ移動</Link>
            </div>
        </div>
    </div>
    

  )
}

export default Page