'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

import { supabase } from '@/lib/supabaseClient'
import PageInner from './PageInner'
import WayBackTo from '@/components/global/wayBack_button'
type data ={
    id:number,
    className:string,
    teacherEmail:string,
    EmailChangeRequest:boolean,
    requestEmail:string,
    fixed:boolean,
}
const Page = () => {
    const params = useSearchParams();
    const name = params.get("name") ?? null
    
    const router = useRouter();
    const [data,setData] = useState<data>();
    useEffect(()=>{
        if(!name){
            alert("不正なアクセス")
            return router.back();
        }
        const fetch = async ()=>{
            const {data:intro,error} = await supabase.from("introduction").select("className,id,teacherEmail,EmailChangeRequest,requestEmail,fixed").eq("className",name);
            if(error || !intro){
                alert("erorr")
                return router.back();
            }
            //console.log(intro)
            setData(intro[0]);
        }
        fetch()
    },[name,router])
    return (
    <>
        {data ? 
        <Suspense>
            <PageInner data = {data}/>
        </Suspense>
            :
        <div className="pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
            該当するページがありません
        </div>
        }
        <WayBackTo name='前回のページに'/>
        
    </>
        
        
    )
}

export default Page