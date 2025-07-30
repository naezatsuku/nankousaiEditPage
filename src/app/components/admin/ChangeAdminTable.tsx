'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type UserProfile = {
  user_id: string
  name: string
  class_id: string
  role: string
  email: string | null
  requestEdit: boolean | null
  requestTargetClass: string | null
  TargetEditClass: string | null
  created_at: string | null
  updated_at: string | null
}

const ChangeAdminTable: React.FC = () => {
  // 分割されたクラスID用 state
  const [schoolType, setSchoolType] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [classGroup, setClassGroup] = useState<string>('')
  const [seatNumber, setSeatNumber] = useState<string>('')
  const [classId, setClassId] = useState<string>('')

  // その他の state
  const [userName, setUserName] = useState<string>('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [newRole, setNewRole] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // schoolType～seatNumber が揃ったら classId を自動組み立て
  useEffect(() => {
    if (schoolType && grade && classGroup && seatNumber) {
      setClassId(`${schoolType}${grade}年${classGroup}組${seatNumber}番`)
    } else {
      setClassId('')
    }
  }, [schoolType, grade, classGroup, seatNumber])

  // Supabase から一件取得
  const fetchData = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('class_id', classId)
      .eq('name', userName)
      .single()
    setLoading(false)

    if (fetchError || !data) {
      setError('ユーザーが見つかりませんでした')
      setProfile(null)
      return
    }

    const formatted = data as UserProfile
    setProfile(formatted)
    setNewRole(formatted.role)
  }
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setProfile(null)

    if (!classId || !userName) {
      setError('クラスと名前を入力してください')
      return
    }

    await fetchData()
  }
  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('user_id', profile.user_id)
    setSaving(false)

    if (updateError) {
      setError('保存に失敗しました')
      return
    }

    alert('役職を更新しました')
    await fetchData()
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800 mb-1">
            クラスを選択
          </label>
          <div className="flex space-x-2">
            <select
              id="schoolType"
              className="flex-shrink-0 border px-3 py-2 rounded bg-white"
              value={schoolType}
              onChange={(e) => setSchoolType(e.target.value)}
              required
            >
              <option value="" disabled>選択</option>
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
          <p className="mt-1 text-sm italic text-gray-500">
            {classId || '例：高校1年1組1番'}
          </p>
        </div>

        {/* 名前入力 */}
        <div>
          <label
            htmlFor="userName"
            className="block font-medium text-gray-800 mb-1"
          >
            名前
          </label>
          <input
            id="userName"
            type="text"
            placeholder="名前を入力"
            className="w-full px-3 py-2 border rounded"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full px-4 py-2 rounded
            bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a]
            text-white font-medium
            hover:opacity-90 transition
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? '検索中…' : '検索'}
        </button>
      </form>

      {/* エラーメッセージ */}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* プロファイル詳細・ロール更新 */}
      {profile && (
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a]" />
          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold">{profile.name}</h3>
            <p>クラス：{profile.class_id}</p>
            <p>現在の役職：{profile.role}</p>

            <div className="flex items-center gap-3">
              <label className="whitespace-nowrap">新しい役職：</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              >
                <option value="" disabled>
                  役職を選択
                </option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
                <option value="timer">timer（待ち時間のみ更新）</option>
                <option value="band">band（高校軽音楽部）</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`
                mt-2 w-full px-4 py-2 rounded
                bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a]
                text-white font-medium
                hover:opacity-90 transition
                ${saving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {saving ? '保存中…' : '変更を保存'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChangeAdminTable