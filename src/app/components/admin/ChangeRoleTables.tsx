'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type UserProfile = {
  user_id: string
  name: string
  class_id: string
  role: string
  requestEdit: boolean | null
  requestTargetClass: string | null
  TargetEditClass: string | null
  email: string
  created_at: string | null
  updated_at: string | null
}

// テーブル行用の拡張型
type EditableRow = UserProfile & {
  newRole: string
  newTargetEditClass: string
}

const ChangeRoleTables: React.FC = () => {
  const [rows, setRows] = useState<EditableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [classNames,setClassNames] = useState<string[]>();
  // データ取得
  const fetchData = async () => {
    setLoading(true)
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('request_edit', true)

    if (error) {
      alert('データの取得に失敗しました')
      setLoading(false)
      return
    }
    const profilesData = profiles.filter((item)=> item.role !="admin")
    // 各行に編集用フィールドを追加
    const editable = profilesData.map((p) => ({
      ...p,
      newRole: p.role,
      newTargetEditClass: p.TargetEditClass ?? '',
    }))
    setRows(editable)
    setLoading(false)
  }
  const compare = (a: string, b: string) => a.localeCompare(b)

  const getClassNames = async () => {
    const { data, error } = await supabase
      .from('contents')
      .select('className')
    if (error || !data) {
      alert('データの取得に失敗しました')
      return
    }
    setClassNames(data.map((r) => r.className).sort(compare))
  }
  useEffect(() => {
    fetchData();
    getClassNames();
  }, [])

  // 編集ハンドラ
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

  const handleSave = async () => {
    setSaving(true)
    
    const modified = rows.filter(
      (r) =>
        r.newRole !== r.role ||
        r.newTargetEditClass !== (r.TargetEditClass ?? '')
    )
    if (modified.length === 0) {
      alert('変更された行がありません')
      setSaving(false)
      return
    }

    // Promise.all で並列更新
    const updates = modified.map((r) =>
      supabase
        .from('user_profiles')
        .update({
          role: r.newRole,
          TargetEditClass: r.newTargetEditClass,
          request_edit: false, // リクエストフラグをリセット
        })
        .eq('user_id', r.user_id)
    )
    const results = await Promise.all(updates)
    const hasError = results.some((res) => res.error)
    if (hasError) {
      alert('更新中にエラーが発生しました')
    } else {
      alert('変更を保存しました')
      fetchData()
    }
    setSaving(false)
  }

  if (loading) return <div>Loading...</div>
  const getRowColorClass = (role: string) => {
    switch (role) {
        case 'admin':
          return 'bg-red-50';
        case 'editor':
          return 'bg-blue-50';
        case 'viewer':
          return 'bg-gray-50';
        default:
          return '';
    }
    };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">編集リクエスト対応</h2>
      <table className="w-full table-fixed border-collapse text-sm divide-y-2 divide-gray-700">
        <thead className="bg-gray-100">
          <tr className='divide-x divide-gray-300'>
            <th className="p-2 w-2/12 text-center align-middle">名前</th>
            <th className="p-2 w-2/12 text-center align-middle">クラス</th>
            <th className="p-2 w-2/12 text-center align-middle">現在の権限</th>
            <th className="p-2 w-2/12 text-center align-middle">新しい権限</th>
            <th className="p-2 w-2/12 text-center align-middle">リクエストクラス</th>
            <th className="p-2 w-2/12 text-center align-middle">割当クラス</th>
          </tr>
        </thead>
        <tbody className='divide-y-2 divide-gray-700'>
          {rows.map((r) => (
            <tr key={r.user_id} className={`divide-x divide-gray-300 ${getRowColorClass(r.role)}`}>
              <td className="p-2 w-2/12 text-center align-middle">{r.name}</td>
              <td className="p-2 w-2/12 text-center align-middle">{r.class_id}</td>
              <td className="p-2 w-2/12 text-center align-middle">{r.role}</td>
              <td className="p-2 w-2/12 text-center align-middle">
                <select
                  value={r.newRole}
                  onChange={(e) =>
                    updateRow(r.user_id, 'newRole', e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-center align-middle"
                >
                  <option value="editor ">editor</option>
                  <option value="viewer ">viewer</option>
                </select>
              </td>
              <td className="p-2 w-2/12 text-center align-middle">{r.requestTargetClass ?? 'なし'}</td>
              <td className="p-2 w-2/12 text-center align-middle">
              <select
                  value={r.newRole}
                  onChange={(e) =>
                    updateRow(r.user_id, 'newTargetEditClass', e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-center align-middle"
                >
                  {classNames?.map((value:string,index)=>(
                    <option value={value} key={index}>{value}</option>
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

export default ChangeRoleTables