"use client"
import ChangeTimerTables from '@/app/components/admin/ChangeTimerTables'
import ExplanationChangeTimer from '@/app/components/admin/ExplanationChangeTimer'
import BackTo from '@/components/global/back_button'
import React from 'react'

const changeEditor = () => {
    
  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white flex flex-col items-center px-6 md:px-12 lg:px-20">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-10 mt-4">待ち時間更新の権限の変更・剥奪</h1>
        <ExplanationChangeTimer></ExplanationChangeTimer>
        <ChangeTimerTables></ChangeTimerTables>
        <BackTo link='/admin' name='管理者ホーム'></BackTo>
    </div>
  )
}

export default changeEditor
