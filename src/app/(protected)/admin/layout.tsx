"use client"
import Loading from '@/components/global/parts/loading';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AdminLayout = ({children}:{children:React.ReactNode}) => {
  const [role,setRole] = useState<string>();

    const handleUserProfiles = async (user_id:string)=>{
      const {data:profile,error} = await supabase.from("user_profiles").select(`*`).eq("user_id",user_id).single();
      return profile
    }
  
    const {session , loading} = useSession();
    const router = useRouter();
    useEffect(()=>{
      const handleAuth = async ()=>{
        const user = session?.user;
        console.log(user);
        if(!user && !loading){
          return window.alert("loginしてください");
        }
        if(user){
          const profile = await handleUserProfiles(user.id);
          console.log(profile);
          const role = profile.role;
          if(role != "admin"){
            window.alert("あなたは管理者ではありません。");
            return router.push("/");
          }else{
            console.log("adminです");
          }
        }
      }
        
        handleAuth();
        
    },[loading,session,router])
    
  return (
    <div>
        {role == "admin" ? <div>
          <Loading></Loading>
        </div>:
        <div>
          {children}
        </div>}
    </div>
  )
}

export default AdminLayout