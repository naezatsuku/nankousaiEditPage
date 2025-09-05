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
  const cards = [
    {title:"ログイン一覧",description:"ユーザー（生徒）一覧が見れます。",link:"/admin/users"},
    {title:"「展示」の編集権限の変更",description:"各生徒に「展示」の編集権限の付与または剥奪ができます。この権限には時間の更新も含まれます",link:"/admin/changeEditor"},
    {title:"「待ち時間」の更新権限の変更",description:"生徒に「待ち時間」の更新の権限を与えます。この権限には展示の編集権限は含まれません",link:"/admin/changeTimer"},
    {title:"通知メールアドレスの変更",description:"各展示を編集した時に、先生へ通知が行きます。そのときの先生のメールアドレスを変更できます",link:"/admin/changeEmail"},
    {title:"管理者の変更",description:"管理者の追加・変更・削除が可能です",link:"/admin/changeAdmin"},
    {title:"展示の出店状況を編集",description:"展示を新しく追加したり、展示を削除したりすることが可能です。",link:"/admin/handleClass"},
    {title:"統括ページ",description:"サイトすべてを編集することができます（ownerのみ可）",link:"/admin/owner"},

  ]
  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white flex flex-col items-center px-6 md:px-12 lg:px-20">
      

      <h1 className="text-2xl font-bold text-gray-800 mb-10 mt-4">ようこそ管理者ページへ</h1>

      <div className="flex flex-col w-full max-w-xl gap-6">
        {cards.map((value,i)=>(
        <div key={i} className="group bg-gray-100 hover:bg-gray-200 rounded-xl shadow px-6 py-5 text-center transition-all duration-300 overflow-hidden w-full max-w-xl">
          <Link href={{pathname:value.link}}>
          <p className="text-lg font-semibold text-gray-800">{value.title}</p>

          <div className="mt-2 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
            <p className="text-sm text-gray-600">
              {value.description}
            </p>
            
          </div>
          </Link>  
          
        </div>
        ))}

      
  </div>
    </div>
  )
}

export default Page