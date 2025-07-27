'use client'

import ExplanationProfile from '@/app/components/auth/ExplanationProfile'
import UserProfileCard from '@/components/UserProfileCard'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type UserProfile = {
  name: string
  class_id: string
  role: string
  email:string
}


const CompleteProfile = () => {
    const [class_id,setClass_id] = useState<string>("");
    const [name,setName] = useState<string>("");
    const [data,setData] = useState<UserProfile | null>(null);
    const router = useRouter()
    
  const handleData = async (user_id: string) => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single()
    return profile
  }
  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    const {data:sessionData} = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if(!user){
        window.alert("ログインが消えました");
        return router.push("/login");
    }else{
        const targetData = {class_id,name};
        console.log(targetData);
        const {error} = await supabase
        .from("user_profiles")
        .update(targetData)
        .eq("user_id",user.id);

        if(error){
            window.alert("失敗しました");
            console.log(error);
        }else{
            window.alert("プロフィール登録が完了しました");
            return router.push("/")
        }
  }}
  useEffect(() => {
    const handleSessionCheck = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if (!user) {
        
        console.log('sessionError')
        window.alert("ログインセッションが切れました")
        router.push('/login')
        return
      }

      const profile = await handleData(user.id)
      console.log('取得したプロファイル:', profile)
      if (profile) {
        
        if(class_id){setClass_id(profile.class_id)}
        if(name){setName(profile.name)}
        const targetData = profile as UserProfile;
        setData(targetData);
        setClass_id(targetData.class_id);
        setName(targetData.name);
        } else {
            console.log('プロフィールが見つかりません新しくinsertを行います');
            const userId = user.id;
            const userEmail = user.email;
            console.log(userId,userEmail)
            const {data:requestData,error:requestError} = await supabase.from("user_profiles").insert({user_id:userId,email:userEmail,role:"editor"}).select()
            console.log("results",requestData,requestError);
            if(requestError){
              window.alert("エラーが発生しましたリロードして再度試してください");
              return
            }
            const resultData ={
              name: "",
              class_id:"",
              role: requestData[0].role,
              email:requestData[0].email
            }
            console.log(requestData)
            setData(resultData)           
        }

    }

    handleSessionCheck()
  }, [router])

  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
      <ExplanationProfile></ExplanationProfile>
      <main className="p-6 max-w-md mx-auto">
      <div className='bg-white shadow-xl rounded-xl overflow-hidden border-1 border-slate-300'>
        <div className="bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a] p-4">
              <h1 className="text-2xl font-bold text-white">プロフィール登録</h1>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="px-6 py-4 space-y-4">
          <div className="flex justify-between text-gray-800">
                <span className="font-medium">名前</span>
          </div>
          <div className="flex justify-between text-gray-800">
            <input
            id="name"
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          </div>
          
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex justify-between text-gray-800">
            <span className="font-medium">所属クラス、出席番号</span>
          </div>
          <div className="flex justify-between text-gray-800">
            <input
            id="classId"
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={class_id}
            onChange={(e) => setClass_id(e.target.value)}
            required
          />
          </div>
          
        </div>
        <div className=' flex w-full justify-center'>
          <button
          type="submit"
          className="mb-4 py-2 px-8 bg-green-500 text-white font-semibold  rounded-md hover:bg-green-300 transition duration-300 hover:scale-103"
        >
          送信
        </button>
        </div>
        
      </form>
      </div>
      
      <UserProfileCard
        name={data?.name ?? name}
        classId={data?.class_id ?? class_id}
        email={data?.email ?? ""}
        role={data?.role ?? ""}
  />

    </main>
    </div>
    
  )

}

export default CompleteProfile