'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type UserProfile = {
  user_id: string
  name: string
  class_id: string
  role: string
  request_edit: boolean | null
  RequestTimer:boolean | null
  requestTargetClass: string | null
  TargetEditClass: string | null
  email: string
  created_at: string | null
  updated_at: string | null
}

type EditableRow = UserProfile & {
  newRole: string
  newTargetEditClass: string
  markedComplete: boolean
}

const ChangeTimerTables: React.FC = () => {
  const [rows, setRows] = useState<EditableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [classNames, setClassNames] = useState<string[]>()

  // 初回データ取得
  const fetchData = async () => {
    setLoading(true)
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('RequestTimer', true)

    if (error) {
      alert('データの取得に失敗しました')
      setLoading(false)
      return
    }
    const editable = profiles
      .filter((p) => p.role !== 'admin' && p.role !== 'editor')
      .map((p) => ({
        ...p,
        newRole: p.role,
        newTargetEditClass: p.TargetEditClass ?? '',
        markedComplete: false,
      }))
    setRows(editable)
    setLoading(false)
  }

  const getClassNames = async () => {
    const { data, error } = await supabase
      .from('contents')
      .select('className')
    if (error || !data) {
      alert('クラス名の取得に失敗しました')
      return
    }
    setClassNames(data.map((r) => r.className).sort((a, b) => a.localeCompare(b)))
  }

  useEffect(() => {
    fetchData()
    getClassNames()
  }, [])

  // 行内の編集フィールド更新
  const updateRow = (
    user_id: string,
    field: 'newRole' | 'newTargetEditClass',
    value: string
  ) => {
    setRows((prev) =>
      prev.map((r) =>
        r.user_id === user_id
          ? { ...r, [field]: value }
          : r
      )
    )
  }

  
  const toggleComplete = (user_id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.user_id === user_id
          ? { ...r, markedComplete: !r.markedComplete }
          : r
      )
    )
  }

  const handleSave = async () => {
  setSaving(true)

  const toUpdate = rows.filter((r) =>
    r.markedComplete ||
    r.newRole !== r.role ||
    r.newTargetEditClass !== (r.TargetEditClass ?? '')
  )

  if (toUpdate.length === 0) {
    alert('変更された行がありません')
    setSaving(false)
    return
  }

  //update
  const updates = toUpdate.map((r) => {
    const payload: Partial<UserProfile> = {
      RequestTimer: false,
    }
    if (r.newRole !== r.role) {
      payload.role = r.newRole
    }
    if (r.newTargetEditClass !== (r.TargetEditClass ?? '')) {
      payload.TargetEditClass = r.newTargetEditClass
    }
    return supabase
      .from('user_profiles')
      .update(payload)
      .eq('user_id', r.user_id)
  })

  const results = await Promise.all(updates)
  if (results.some((res) => res.error)) {
    alert('更新中にエラーが発生しました')
  } else {
    alert('変更を保存しました')
    fetchData()  // 再取得して最新状態に
  }

  setSaving(false)
  }

  if (loading) return <div>Loading...</div>

  const getRowColorClass = (role: string) => {
    switch (role) {
      case 'timer':
        return 'bg-blue-50'
      case 'viewer':
        return 'bg-gray-50'
      default:
        return ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">待ち時間リクエスト対応</h2>
      <table className="w-full table-fixed border-collapse text-sm divide-y-2 divide-gray-700">
        <thead className="bg-gray-100">
          <tr className="divide-x divide-gray-300">
            {/* ← 追加 */}
            <th className="p-2 w-2/12 text-center">リクエスト取り下げ</th>
            <th className="p-2 w-2/12 text-center">名前</th>
            <th className="p-2 w-2/12 text-center">クラス</th>
            <th className="p-2 w-2/12 text-center">現在の権限</th>
            <th className="p-2 w-2/12 text-center">新しい権限</th>
            <th className="p-2 w-2/12 text-center">リクエストクラス</th>
            <th className="p-2 w-2/12 text-center">割当クラス</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-700">
          {rows.map((r) => (
            <tr
              key={r.user_id}
              className={`divide-x divide-gray-300 ${getRowColorClass(r.role)}`}
            >
              <td className="p-2 w-1/12 text-center">
                <input
                  type="checkbox"
                  checked={r.markedComplete}
                  onChange={() => toggleComplete(r.user_id)}
                />
              </td>

              <td className="p-2 w-2/12 text-center">{r.name}</td>
              <td className="p-2 w-2/12 text-center">{r.class_id}</td>
              <td className="p-2 w-2/12 text-center">{r.role}</td>
              <td className="p-2 w-2/12 text-center">
                <select
                  value={r.newRole}
                  onChange={(e) =>
                    updateRow(r.user_id, 'newRole', e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-center"
                >
                  <option value="viewer">viewer</option>
                  <option value="timer">timer</option>
                </select>
              </td>
              <td className="p-2 w-2/12 text-center">
                {r.requestTargetClass ?? 'なし'}
              </td>
              <td className="p-2 w-2/12 text-center">
                <select
                  value={r.newTargetEditClass}
                  onChange={(e) =>
                    updateRow(
                      r.user_id,
                      'newTargetEditClass',
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-center"
                >
                  {classNames?.map((value, idx) => (
                    <option value={value} key={idx}>
                      {value}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            px-4 py-2 rounded
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
  )
}

export default ChangeTimerTables