'use client'
import React, { useState } from 'react'
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
  const [classId, setClassId] = useState('')
  const [userName, setUserName] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [newRole, setNewRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // クラスIDと名前で一件だけ取得
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setProfile(null)
    if (!classId || !userName) {
      setError('クラスと名前を入力してください')
      return
    }
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('class_id', classId)
      .eq('name', userName)
      .single()
    const formatedData = data as UserProfile
    setLoading(false)
    if (fetchError) {
      setError('ユーザーが見つかりませんでした')
      return
    }
    setProfile(formatedData)
    setNewRole(formatedData.role)
  }

  // ロール更新
  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        role: newRole,
      })
      .eq('user_id', profile.user_id)

    setSaving(false)
    if (updateError) {
      setError('保存に失敗しました')
      return
    }
    alert('役職を更新しました')
    // 必要なら再フェッチ
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* 検索フォーム */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="例:高校1年1組"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="名前を入力"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`
            px-4 py-2 rounded
            bg-gradient-to-br
              from-[#05a8bd]
              via-[#05bd92]
              to-[#f3e50a]
            text-white font-medium
            hover:opacity-90 transition
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? '検索中…' : '検索'}
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {/* プロファイルカード */}
      {profile && (
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 上部グラデーションバー */}
          <div className="h-2 bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a]" />

          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold">{profile.name}</h3>
            <p>クラス：{profile.class_id}</p>
            <p>現在の役職：{profile.role}</p>

            {/* 役職変更セレクト */}
            <div className="flex items-center gap-3">
              <label className="whitespace-nowrap">新しい役職：</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              >
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>
            </div>

            {/* 保存ボタン */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`
                mt-2 w-full px-4 py-2 rounded
                bg-gradient-to-br
                  from-[#05a8bd]
                  via-[#05bd92]
                  to-[#f3e50a]
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