'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Content = {
  id: number
  className: string
  type: string,
  TimeVisible:boolean
}

type Row = Content & { hasIntro: boolean; hasFood: boolean }

// デフォルトデータ
const DEFAULT_INTRO = {
  title: '仮のタイトル',
  content: '仮のコンテンツ',
}
const DEFAULT_FOOD_INFO = [
  { menu: '仮', type: '○', value: 100 },
]
const TYPE_OPTIONS = [
  { value: '',  label: "展示タイプを選択", disabled: true },
  { value: 'クラス展示', label: 'クラス展示' },
  { value: '部活動展示', label: '部活動展示' },
  { value: 'PTA', label: 'PTA' },
  { value: '食堂', label: '食堂'},
]
const HandleClass: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [newClassName, setNewClassName] = useState('')
  const [newType, setNewType] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    setErr(null)

    // contents
    const { data: contentsData, error: cError } = await supabase
      .from('contents')
      .select('id, className, type,TimeVisible')
    if (cError) {
      console.error(cError)
      
      setErr('contents の取得に失敗')
      setLoading(false)
      return
    }
    const contents = (contentsData as Content[]) || []

    // introduction
    const { data: introData } = await supabase
      .from('introduction')
      .select('className')
    const introSet = new Set(
      (introData as { className: string }[] || []).map((i) => i.className)
    )

    // food
    const { data: foodData } = await supabase
      .from('food')
      .select('className')
    const foodSet = new Set(
      (foodData as { className: string }[] || []).map((f) => f.className)
    )

    const merged: Row[] = contents.map((c) => ({
      ...c,
      hasIntro: introSet.has(c.className),
      hasFood: foodSet.has(c.className),
    }))
    merged.sort((a, b) => a.className.localeCompare(b.className))
    setRows(merged)
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])


  const handleAddContent = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newClassName.trim() || !newType.trim()) {
      alert('クラス名とタイプを両方入力してください')
      return 
    }
    const check = rows.filter((item)=>item.className == newClassName);
    console.log(check);
    if(check.length != 0){
      return window.alert("すでに同じ名前の展示が存在しています")
    }
    const { data, error } = await supabase
      .from('contents')
      .insert({ className: newClassName, type: newType })
      .select('id')
      .single()
    if (!data ||error) {
      alert(`${error.message}`)
      alert('contents の追加に失敗しました')
      console.error(error)
      return
    }

    const newRow: Row = {
      id: data.id,
      className: newClassName,
      type: newType,
      hasIntro: false,
      hasFood: false,
      TimeVisible:false
    }
    setRows((prev) =>
      [...prev, newRow].sort((a, b) => a.className.localeCompare(b.className))
    )
    setNewClassName('')
    setNewType('')
    window.alert("追加に成功しました");
    window.location.reload()
  }

  //Introduction追加
  const handleAddIntro = async (className: string) => {
    if (rows.find((r) => r.className === className)?.hasIntro) return

    const { error } = await supabase
      .from('introduction')
      .insert({
        className,
        title: DEFAULT_INTRO.title,
        content: DEFAULT_INTRO.content,
      })
    if (error) {
      alert('Introduction の追加に失敗しました')
      console.error(error)
      return
    }
    setRows((prev) =>
      prev.map((r) =>
        r.className === className ? { ...r, hasIntro: true } : r
      )
    )
  }

  //Food追加
  const handleAddFood = async (className: string) => {
    if (rows.find((r) => r.className === className)?.hasFood) return

    const { error } = await supabase
      .from('food')
      .insert({ className, information: DEFAULT_FOOD_INFO })
    if (error) {
      alert('Food の追加に失敗しました')
      console.error(error)
      return
    }
    setRows((prev) =>
      prev.map((r) =>
        r.className === className ? { ...r, hasFood: true } : r
      )
    )
  }

  //contents削除
  const handleDelete = async (id: number) => {
    if (!confirm('本当にこのクラスを削除しますか？')) return
    const { error } = await supabase.from('contents').delete().eq('id', id)
    if (error) {
      alert('削除に失敗しました')
      console.error(error)
      return
    }
    setRows((prev) => prev.filter((r) => r.id !== id))
  }
  //待ち時間表示非表示
  const handleTimeVisible = async (id:number,state:boolean) => {
       const { error } = await supabase.from('contents').update({TimeVisible:state}).eq('id', id)
    setRows((prev) => 
      prev.map((r)=>{
        return r.id ==id ? {...r,TimeVisible:state} :r
      })
    )
  }
  if (loading) return <div>Loading…</div>
  if (err) return <div className="text-red-600">{err}</div>

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-2">
      <form
        onSubmit={handleAddContent}
        className="lg:flex items-end space-x-4 bg-gray-50 p-4 rounded"
      >
        <div>
          <label className="block mb-1 text-sm">クラス名</label>
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="border p-2 rounded w-48"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">タイプ</label>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="border p-2 rounded"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 lg:mt-0 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          クラスを追加
        </button>
      </form>

      <div className="overflow-x-auto h-screen">
        <table className="table-fixed w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr className="divide-x divide-gray-300">
              <th className="p-3 text-center">クラス</th>
              <th className="p-3 text-center hidden lg:block">タイプ</th>
              <th className="p-2 text-center">詳細ページ</th>
              <th className="p-2 text-center">フードメニュー</th>
              <th className="p-3 text-center">削除</th>
              <th className="p-3 text-center">待ち時間</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.id} className="divide-x divide-gray-300">
                <td className="p-3 text-center">{r.className}</td>
                <td className="p-3 text-center hidden lg:block">{r.type}</td>
                <td
                  className={`p-2 text-center rounded-sm ${
                    r.hasIntro
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {r.hasIntro ? (
                    'あり'
                  ) : (
                    <button
                      onClick={() => handleAddIntro(r.className)}
                      className="underline text-blue-600"
                    >
                      追加
                    </button>
                  )}
                </td>
                <td
                  className={`p-2 text-center rounded-sm ${
                    r.hasFood
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {r.hasFood ? (
                    'あり'
                  ) : (
                    <button
                      onClick={() => handleAddFood(r.className)}
                      className="underline text-blue-600"
                    >
                      追加
                    </button>
                  )}
                </td>
                <td className="p-3 flex- text-center space-x-2">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    削除
                  </button>
                  
                </td>
                <td className="p-3 flex- text-center space-x-2">
                  <div className='flex justify-center'>
                  <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" 
                      checked={r.TimeVisible} 
                      onChange={(e)=>handleTimeVisible(r.id,e.target.checked)}
                      className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-400 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HandleClass