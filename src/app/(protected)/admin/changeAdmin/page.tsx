"use client"
import ChangeAdminTable from '@/app/components/admin/ChangeAdminTable'
import ExplanationEditAdmin from '@/app/components/admin/ExplanationEditAdmin'
import BackTo from '@/app/components/global/back_button'
import React from 'react'

const ChangeAdmin = () => {
  return (
    <div className='pt-[min(15vw,80px)] h-screen bg-white flex flex-col items-center px-6 md:px-12 lg:px-20'>
        <ExplanationEditAdmin></ExplanationEditAdmin>
        <ChangeAdminTable></ChangeAdminTable>
        <BackTo link='/admin' name="管理者ホーム"></BackTo>
    </div>
  )
}

export default ChangeAdmin