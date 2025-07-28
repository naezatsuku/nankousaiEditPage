'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ExplanationProfile from '@/app/components/auth/ExplanationProfile'
import UserProfileCard from '@/components/UserProfileCard'
import { supabase } from '@/lib/supabaseClient'

type UserProfile = {
  name: string
  class_id: string
  role: string
  email: string
}

export default function CompleteProfile() {
  const router = useRouter()

  const [name, setName] = useState<string>('')
  const [schoolType, setSchoolType] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [classGroup, setClassGroup] = useState<string>('')
  const [seatNumber, setSeatNumber] = useState<string>('')
  const [class_id, setClass_id] = useState<string>('')
  const [data, setData] = useState<UserProfile | null>(null)

  // schoolType～seatNumber が揃ったら class_id をリアルタイム生成
  useEffect(() => {
    if (schoolType && grade && classGroup && seatNumber) {
      setClass_id(
        `${schoolType}${grade}年${classGroup}組${seatNumber}番`
      )
    } else {
      setClass_id('')
    }
  }, [schoolType, grade, classGroup, seatNumber])
  const fetchProfile = async (user_id: string) => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single()
    return profile
  }

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: sessionRes } = await supabase.auth.getSession()
    const user = sessionRes.session?.user

    if (!user) {
      alert('ログインが消えました')
      return router.push('/login')
    }
    const targetData = { name, class_id }

    const { error } = await supabase
      .from('user_profiles')
      .update(targetData)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
      alert('更新に失敗しました')
    } else {
      alert('プロフィール登録が完了しました')
      router.push('/')
    }
  }

  // 初期読み込み：セッション確認 & プロファイル取得 or INSERT
  useEffect(() => {
    const init = async () => {
      const { data: sessionRes } = await supabase.auth.getSession()
      const user = sessionRes.session?.user

      if (!user) {
        alert('セッションが切れました')
        return router.push('/login')
      }

      const profile = await fetchProfile(user.id)
      console.log('取得したプロファイル:', profile)

      if (profile) {
        setData(profile as UserProfile)
        setName(profile.name)

        //class_idをパース
        const m = profile.class_id.match(
          /(高校|中学)(\d+)年(\d+)組(\d+)番/
        )
        if (m) {
          setSchoolType(m[1])
          setGrade(m[2])
          setClassGroup(m[3])
          setSeatNumber(m[4])
        }
      } else {
        //なければINSERT
        const { data: insRes, error: insErr } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            role: 'editor',
          })
          .select()

        if (insErr || !insRes?.length) {
          console.error(insErr)
          alert('プロフィール作成に失敗しました')
          return
        }

        const newProfile = insRes[0]
        setData({
          name: '',
          class_id: '',
          role: newProfile.role,
          email: newProfile.email,
        })
      }
    }

    init()
  }, [router])

  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw] lg:pt-[min(15vw,80px)]">
      <ExplanationProfile />

      <main className="p-6 max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-xl border border-slate-300 overflow-hidden">
          <div className="bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a] p-4">
            <h1 className="text-2xl font-bold text-white">
              プロフィール登録
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
            {/* 名前入力 */}
            <div>
              <label
                htmlFor="name"
                className="block font-medium text-gray-800 mb-1"
              >
                名前
              </label>
              <input
                id="name"
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* クラス／席番号入力 */}
            <div>
              <span className="block font-medium text-gray-800 mb-1">
                所属クラス・出席番号
              </span>

              <div className="flex space-x-2">
                <select
                  id="schoolType"
                  className="border px-3 py-2 rounded bg-white flex-shrink-0"
                  value={schoolType}
                  onChange={(e) => setSchoolType(e.target.value)}
                  required
                >
                  <option value=""  disabled>学校</option>
                  <option value="高校">高校</option>
                  <option value="中学">中学</option>
                </select>

                <input
                  id="grade"
                  type="number"
                  min={1}
                  max={3}
                  placeholder="学年"
                  className="w-20 border px-3 py-2 rounded"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />

                <input
                  id="classGroup"
                  type="number"
                  min={1}
                  placeholder="組"
                  className="w-20 border px-3 py-2 rounded"
                  value={classGroup}
                  onChange={(e) => setClassGroup(e.target.value)}
                  required
                />

                <input
                  id="seatNumber"
                  type="number"
                  min={1}
                  placeholder="番"
                  className="w-20 border px-3 py-2 rounded"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  required
                />
              </div>

              <p className="mt-2 text-sm italic text-gray-500">
                {class_id || '例：高校1年1組1番'}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="mb-4 py-2 px-8 bg-green-500 text-white font-semibold rounded-md hover:bg-green-300 transition duration-300 hover:scale-105"
              >
                送信
              </button>
            </div>
          </form>
        </div>

        <UserProfileCard
          name={data?.name ?? name}
          classId={data?.class_id ?? class_id}
          email={data?.email ?? ''}
          role={data?.role ?? ''}
        />
      </main>
    </div>
  )
}