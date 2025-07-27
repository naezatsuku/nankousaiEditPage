'use client'

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
            return router.push("/viewer")
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
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">プロフィール登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            名前
          </label>
          <input
            id="name"
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="classId" className="block text-sm font-medium">
            クラス番号
          </label>
          <input
            id="classId"
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={class_id}
            onChange={(e) => setClass_id(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          登録する
        </button>
      </form>
      <UserProfileCard
        name={data?.name ?? name}
        classId={data?.class_id ?? class_id}
        email={data?.email ?? ""}
        role={data?.role ?? ""}
  />

    </main>
  )

}

export default CompleteProfile