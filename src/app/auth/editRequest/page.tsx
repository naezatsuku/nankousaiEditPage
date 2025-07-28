"use client"
import ExplanationRequestEdit from '@/app/components/auth/ExplanationRequestEdit'
import UserProfileCard from '@/components/UserProfileCard'
import { supabase } from '@/lib/supabaseClient'
import { UUID } from 'crypto'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
type UserProfile = {
  user_id:UUID
  name: string
  class_id: string
  role: string
  email:string
  TargetEditClass:string,
  request_edit:boolean,
  requestTargetClass:string,

}
const EditRequest = () => {
    const [data,setData] = useState<UserProfile | null>();
    const [request,setRequest] = useState<boolean>(false);
    const [requestClass,setRequestClass] = useState<string>("");
    const [classNames,setClassNames] =  useState<string[]>()
    const router = useRouter();
    let compare = (a:any,b:any) => {
        if(a > b) {
            return 1;
        } else {
            return -1
        }
        }
    useEffect(()=>{
      const handleFetch = async () => {
            const { data: sessionData } = await supabase.auth.getSession()
            const user = sessionData.session?.user
        
            if (!user) {
              
              console.log('sessionError')
              window.alert("ログインセッションが切れました")
              router.push('/login')
              return
            }
            const user_id = user.id;
            const {data:profiles,error} = await supabase.from("user_profiles").select("*").eq("user_id",user_id);
            
            if(!profiles || error){
              window.alert("あなたのアカウント情報が見つかりませんでした")
              return router.push("/auth/profiles");
            }
            const profile = profiles[0] as UserProfile;
            //console.log(profile);
            setData(profile);
            setRequest(profile.request_edit);
            setRequestClass(profile.TargetEditClass);
            console.log(profile)
      
          }
      const getClassNames = async ()=>{
        const {data:classDatas,error} = await supabase.from("contents").select("*");
        if(!classDatas || error){
          return window.alert("データの取得に失敗しました");
        }
        const classNames = classDatas.map(({ className }) => className);
        classNames.sort(compare);
        setClassNames(classNames);
        
      }
      
      handleFetch()
      getClassNames()
    },[])
    const handleSubmit = async (e:React.FormEvent)=>{
      e.preventDefault();
      const date = new Date().toISOString()
      const sendData ={
        request_edit:request,
        requestTargetClass:requestClass,
        updated_at : date
      }
      //console.log(sendData);
      console.log(data?.user_id)
      const {error} = await supabase.from("user_profiles").update(sendData).eq("user_id",data?.user_id);
      if(error){
        window.alert("更新に失敗")
      }else{
        window.alert("更新に成功")
      }
      return window.location.reload();
    }
    return (
      <div className="pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
        <ExplanationRequestEdit></ExplanationRequestEdit>
        <main className="p-6 max-w-md mx-auto">
          
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border-1 border-slate-300">
            {/* ヘッダー */}
            <div className="bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a] p-4">
              <h1 className="text-2xl font-bold text-white">プロフィール登録</h1>
            </div>

            {/* プロフィール情報 */}
            {data && 
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-gray-800">
                <span className="font-medium">名前</span>
                <span>{data.name}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span className="font-medium">所属クラス</span>
                <span>{data.class_id}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span className="font-medium">役職</span>
                <span>{data.role}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span className="font-medium">現在の担当クラス</span>
                <span>{data.TargetEditClass ?? "なし"}</span>
              </div>
              {data.request_edit &&
              <>
              <div className="flex justify-between text-gray-800">
                <span className="font-medium text-red-400">すでにリクエスト済みです</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span className="font-medium">希望担当クラス</span>
                <span>{data.requestTargetClass ?? "なし"}</span>
              </div>
              </>
              
              
              }
              {/* フォーム */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={request}
                    onChange={(e) => setRequest(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-800">編集権限をリクエスト</span>
                </label>
        
                {request && (
                  <div>
                    <label htmlFor="desiredClass" className="block text-gray-700 mb-1">
                      編集したいクラス
                    </label>
                    <select
                      id="desiredClass"
                      value={requestClass ?? ""}
                      onChange={e => setRequestClass(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      <option value="" disabled>
                        クラスを選択
                      </option>
                      {classNames?.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>

                  </div>
                )}
    
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-300 transition duration-300 hover:scale-103"
                >
                  送信
                </button>
              </form>
            </div>
            }
          </div>
        </main>
      </div>
        
    )
}

export default EditRequest