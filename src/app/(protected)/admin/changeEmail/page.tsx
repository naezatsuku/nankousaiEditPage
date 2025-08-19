"use client"
import ChangeEmail from '@/app/components/admin/ChangeEmail'
import ExplanationChangeEmail from '@/app/components/admin/ExplanationChangeEmail'

import BackTo from '@/components/global/back_button'
import React from 'react'

const changeEditor = () => {
    
  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white flex flex-col items-center px-6 md:px-12 lg:px-20">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-10 mt-4">編集権限の変更・剥奪</h1>
        <ExplanationChangeEmail/>
        <ChangeEmail />
        <BackTo link='/admin' name='管理者ホーム'></BackTo>
    </div>
  )
}

export default changeEditor
