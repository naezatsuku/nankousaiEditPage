"use client"
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link'
import React, { useEffect, useReducer, useState } from 'react'
type FormState = {
    EventVisible:{available:boolean,comment:string,id:number},
}
type Action =
| {type:"SET_VISIBLE";payload:{available:boolean}}
| {type:"SET_VISIBLE_ID";payload:{id:number}}
| {type:"SET_VISIBLE_COMMENT";payload:string}
type SectionKey = keyof FormState;
const Page = () => {
    const initialState ={
        EventVisible:{available:false,comment:"",id:0}
    }
    function reducer(state:FormState,action:Action):FormState {
        switch(action.type) {
            case "SET_VISIBLE":
                return {...state,EventVisible:{...state.EventVisible,available:action.payload.available}}
            case "SET_VISIBLE_ID":
                return {...state,EventVisible:{...state.EventVisible,id:action.payload.id}}
            case "SET_VISIBLE_COMMENT":
                return {...state,EventVisible:{...state.EventVisible,comment:action.payload}}
        }
    }
    const [state,dispatch] = useReducer(reducer,initialState);

    useEffect(()=>{
        const fetch = async () =>{
            const {data,error} = await supabase.from("others").select("id,data,DATANAME");
            if(!data || data?.length == 0 || error) return 
            
            data.map((value)=>{
                if(value.DATANAME == "EventVisible"){
                    dispatch({type:"SET_VISIBLE",payload:{available:value.data.available}});
                    dispatch({type:"SET_VISIBLE_ID",payload:{id:value.id}})
                    dispatch({type:"SET_VISIBLE_COMMENT",payload:value.data.comment})
                }
            })
            
        }
        fetch();
    },[])
    const handleUpdate = async ()=>{
        if(!window.confirm("このデータはサイト全体に影響します。更新しますか？")) return
        const keys:SectionKey[] = Object.keys(state) as SectionKey[];
        keys.forEach(async (key)=>{
            const value = state[key];
            const {id,...tarData} = value;
            
            const {data,error} = await supabase.from("others").update({data:tarData}).eq("id",id).select();
            if(error){
                console.log(data,error)
            }else{
                console.log("成功");
                alert("成功しました")
            }
        })
    }
  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white flex flex-col items-center px-6 md:px-12 lg:px-20">
      

      <h1 className="text-2xl font-bold text-gray-800 mb-10 mt-4">ようこそ管理者ページへ</h1>

      <div className="flex flex-col w-full max-w-xl gap-6 ">
        <div className='grid [grid-template-columns:4fr_1fr] border border-slate-300 shadow-md rounded-lg p-3 '>
            <div className='flex justify-start'>
                イベント一覧を表示する
            </div>
            <div className='flex justify-center'>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" 
                  checked={state.EventVisible.available} 
                  onChange={(e)=>{dispatch({type:"SET_VISIBLE",payload:{available:e.target.checked}})}}
                  className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-400 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>

            </div>
        </div>
                <div className='grid [grid-template-columns:2fr_4fr] border border-slate-300 shadow-md rounded-lg p-3 '>
            <div className='flex justify-start'>
                非公開中の表示文章
            </div>
            <div className='flex justify-start w-full'>
                <textarea  className='w-full px-1 text-end' 
                value={state.EventVisible.comment}
                onChange={(e)=>dispatch({type:"SET_VISIBLE_COMMENT",payload:e.target.value})}
                />

            </div>
        </div>
        <div className='flex justify-center   '>
            <button 
            onClick={()=>handleUpdate()}
            className='py-2 px-3 bg-green-300 rounded-lg text-lg hover:opacity-80 transition-all duration-300 hover:scale-105'>
                更新
            </button>
        </div>
      </div>
    </div>
  )
}

export default Page