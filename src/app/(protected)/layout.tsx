"use client"
import Header from '@/components/global/header';
import { LoadingLayout } from '@/components/global/parts/loading_layout';
import { useSession } from '@/hooks/useSession';
import { div } from 'framer-motion/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ProtectedLayout = ({children}:{children:React.ReactNode}) => {
     const {session , loading} = useSession();
    const router = useRouter();
    useEffect(()=>{
        if(!session && !loading){
        return router.push("/login")
    }
        console.log(session,loading);
    },[loading,session,router])
    
  return (
    <div>
            <div className="fixed top-0 left-0 z-[9999]">
              <LoadingLayout></LoadingLayout>
            </div> 
            <div className="w-full fixed top-0 left-0 z-40">
              <Header></Header>
            </div>
            <div className="z-0">
              {/* <div className="relative">
                <div className="w-full h-full bg-white absolute -z-10"></div>
                <div className="z-0">
                  {children}
                </div>
              </div> */}
              {children}
            </div>
            
        </div>
    
  ) 
}

export default ProtectedLayout