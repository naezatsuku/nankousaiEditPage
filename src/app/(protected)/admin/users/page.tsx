"use client"
import ExplanationUsers from '@/app/components/admin/ExplanationUsers'
import UsersTable from '@/app/components/admin/usersTable'
import BackTo from '@/components/global/back_button'
import React from 'react'

const Users = () => {
  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white flex flex-col items-center px-6 md:px-12 lg:px-20">
        <title>ユーザー一覧です。</title>

        <h1 className="text-2xl font-bold text-gray-800 mb-10 mt-4">ユーザー一覧です</h1>
        <ExplanationUsers></ExplanationUsers>
        <UsersTable></UsersTable>
        <BackTo link="/admin" name="管理者ホーム"></BackTo>
    </div>
  )
}

export default Users