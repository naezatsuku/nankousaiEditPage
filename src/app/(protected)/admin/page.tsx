"use client"
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
type user_profile = {
  user_id: string;
  name: string;
  class_id: string;
  role: string;
  requestEdit: boolean | null;
  requestTargetClass: string | null;
  TargetEditClass: string | null;
  email: string;
  created_at: string | null;
  updated_at: string | null;
};
const Page = () => {
  const [data, setData] = useState<user_profile[]>();
  const fetchData = async () => {
          const { data: profiles, error } = await supabase
              .from('user_profiles')
              .select('*');
          if (error) {
              return window.alert('errorが発生しました');
          }
          if (profiles) {
              setData(profiles);
          }
      };
  useEffect(()=>{
    fetchData();
  },[])

  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white flex flex-col items-center px-6 md:px-12 lg:px-20">
      <title>ようこそ管理者ページへ</title>

      <h1 className="text-2xl font-bold text-gray-800 mb-10 mt-4">ようこそ管理者ページへ</h1>

      <div className="flex flex-col w-full max-w-xl gap-6">
        <div className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:"/admin/users"}}>
          <p className="text-lg font-semibold text-gray-800">ログイン一覧</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              ユーザー（生徒）一覧が見れます。
            </p>
            
          </div>
          </Link>  
          
        </div>
        <div className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:"/admin/changeEditor"}}>
          <p className="text-lg font-semibold text-gray-800">「展示」の編集権限の変更</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              各生徒に「展示」の編集権限の付与または剥奪ができます。この権限には時間の更新も含まれます
            </p>
          </div>
          </Link>  
          
        </div>
        <div className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:"/admin/changeTimer"}}>
          <p className="text-lg font-semibold text-gray-800">「待ち時間」の更新権限の変更</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              生徒に「待ち時間」の更新の権限を与えます。この権限には展示の編集権限は含まれません
            </p>
          </div>
          </Link>  
          
        </div>
        <div className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:"/admin/changeEmail"}}>
          <p className="text-lg font-semibold text-gray-800">通知メールアドレスの変更</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              各展示を編集した時に、先生へ通知が行きます。そのときの先生のメールアドレスを変更できます
            </p>
          </div>
          </Link>  
          
        </div>
        <div className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:"/admin/changeAdmin"}}>
          <p className="text-lg font-semibold text-gray-800">管理者の変更</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              管理者の追加・変更・削除が可能です
            </p>
          </div>
          </Link>  
          
        </div>
        <div className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:"/admin/handleClass"}}>
          <p className="text-lg font-semibold text-gray-800">展示の出店状況を編集</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              展示を新しく追加したり、展示を削除したりすることが可能です。
            </p>
          </div>
          </Link>  
          
        </div>
        
  </div>
    </div>
  )
}

export default Page