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
const page = () => {
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
          <p className="text-lg font-semibold text-gray-800">編集権限の変更</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              各生徒に編集権限の付与または剥奪ができます。
            </p>
          </div>
          </Link>  
          
        </div>
        <div className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:"/admin/users"}}>
          <p className="text-lg font-semibold text-gray-800">管理者の変更</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              管理者の追加・変更・削除が可能です
            </p>
          </div>
          </Link>  
          
        </div>

  </div>
    </div>
  )
}

export default page