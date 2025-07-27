'use client'

import React from 'react'

type Props = {
  name: string
  classId: string
  email: string
  role: string
}

const UserProfileCard = ({ name, classId, email, role }: Props) => {
  return (
    <section className="mt-8 p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">ユーザー情報</h2>
      <ul className="space-y-2 text-gray-700 text-base">
        <li><span className="font-medium">名前:</span> {name}</li>
        <li><span className="font-medium">クラス番号:</span> {classId}</li>
        <li><span className="font-medium">メールアドレス:</span> {email}</li>
        <li><span className="font-medium">ロール:</span> {role}</li>
      </ul>
    </section>
  )
}

export default UserProfileCard