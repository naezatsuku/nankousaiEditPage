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
          window.alert("loginしてください");
          return router.push("/login")
        }
        if(user){
          const profile = await handleUserProfiles(user.id);
          console.log(profile);
          try{
            const role = profile.role;
            const additionalRoles:string[] = [...profile.additionalRole];
            
            if( role == "admin" && additionalRoles.includes("owner")){
               setRole("owner");
            }
          }catch(e){
            alert("ownerではありません")
            return router.push("/admin")
          }
          
        }   
      }
        
        handleAuth();
        
    },[loading,session,router])
    
  return (
    <div>
      <div>
        {role === undefined ? (
          <Loading />
        ) : role === "owner" ? (
          <div>{children}</div>
        ) : null}
      </div>
    </div>
  )
}

export default AdminLayout