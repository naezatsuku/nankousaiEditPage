import { supabase } from '@/lib/supabaseClient';
import React, { useEffect, useState } from 'react'
type Row = {
  id:number,
  className:string,
  teacherEmail:string,//現在のemail
  EmailChangeRequest:boolean,
  requestEmail:string//リクエストされたEmail
  fixed:boolean;
}
type EditedData = {
  id:number,
  className:string,
  teacherEmail:string,//現在のemail
  EmailChangeRequest:boolean,
  requestEmail:string//リクエストされたEmail
  fixed:boolean;
}
const ChangeEmail = () => {
  const [rows,setData] = useState<Row[]>([]);
  const [editedData,setEditedData] = useState<EditedData[]>([])
  useEffect(()=>{
    const fetch = async ()=>{
      const {data:classes,error} = await supabase.from("introduction").select("id,className,teacherEmail,EmailChangeRequest,requestEmail,fixed");
      const tmp = classes as Row[];
      const sorted = tmp.sort((a, b) => a.className.localeCompare(b.className));
      console.log(sorted);
      setData(sorted);
    }
    fetch()
  },[])
  const setFixed = (id:number,fixed:boolean)=>{
    const target = rows.find(item =>item.id ==id);
    if(!target) return
    setEditedData((prev)=>{
      const exists = prev.find((item)=>item.id == id);
      if(exists) {
        return prev.map(item=>item.id == id ? {...item,fixed}:item)
      }else{
        return [...prev,{...target,fixed}]
      }
    })
  }
  const setTeacherEmail = (id:number,targetEmail:string)=>{
    const target = rows.find(item =>item.id ==id);
    if(!target) return
    setEditedData((prev)=>{
      const exists = prev.find((item)=>item.id == id);
      console.log(prev)
      if(exists) {
        return prev.map(item=>item.id == id ? {...item,teacherEmail:targetEmail}:item)
      }else{
        return [...prev,{...target,teacherEmail:targetEmail}]
      }
    })
  }
  const updateRow = async ()=>{
    const newData = editedData.map((item)=>({
      ...item,
      EmailChangeRequest: false 
    }));
    console.log(newData)
    try{
      const promises = newData.map(item =>
      supabase
        .from("introduction")
        .update(item)
        .eq("id", item.id) 
    );

      const results = await Promise.all(promises);
      alert("正常に更新されました");
        const fetch = async ()=>{
        const {data:classes,error} = await supabase.from("introduction").select("id,className,teacherEmail,EmailChangeRequest,requestEmail,fixed");
        const tmp = classes as Row[];
        const sorted = tmp.sort((a, b) => a.className.localeCompare(b.className));
        console.log(sorted);
        setData(sorted);
      }
      fetch()
    }catch(error){
      alert("errorが発生しました")
    }
    
    
  }
  const setRowBG = (req:boolean,fixed:boolean) =>{
    if(fixed){
      return "bg-red-200"
    }else{
      if(req){
        return "bg-green-200"
      }else{
        return "bg-white"
      }
    }
  }
  return (
    <div className="max-w-9xl mx-auto p-6">
      <h2 className={`text-2xl font-bold mb-4 text-center `}>先生への通知メールを変更</h2>
      <button
      onClick={()=>updateRow()}>click</button>
      <table className="w-full table-fixed border-collapse text-sm divide-y-2 divide-gray-700">
        <thead className="bg-gray-100">
          <tr className="divide-x divide-gray-300">
            <th className="p-2 w-1/12 text-center">クラス名</th>
            <th className="p-2 w-2/12 text-center">現在のメール</th>
            <th className="p-2 w-2/12 text-center">リクエストされたメール</th>
            <th className="p-2 w-2/12 text-center">変更されたメール</th>
            <th className="p-2 w-1/12 text-center">固定</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-700">
          {
          rows.map((r,i)=>(
            <tr
              key={r.id}
              className={`divide-x divide-gray-300 ${setRowBG(r.EmailChangeRequest,r.fixed)}`}
            >
              <td className="p-2 w-1/12 text-center">{r.className}</td>
              <td className="p-2 w-2/12 text-center">{r.teacherEmail}</td>
              <td className="p-2 w-2/12 text-center">{r.requestEmail}</td>
              <td className="p-2 w-2/12 text-center">
                {r.fixed == false ?
                <input type="text" className='w-full h-full  border-1 rounded text-center' value={r.teacherEmail || ""} 
                onChange={(e)=>{
                  const newEmail = e.target.value;
                    setData(prev=>
                      prev.map(item=>
                        item.id == r.id ? {...item,teacherEmail:newEmail} : item
                      )

                    )
                  setTeacherEmail(r.id,e.target.value)}}/>
                :
                <div className='w-full h-full  border-1 border-slate-500 rounded '>固定中</div>
                }
              </td>
              <td className="p-2 w-1/12 text-center ">
                <input type='checkbox'
                  checked={r.fixed}
                  onChange={(e)=>{
                    const newFixed = e.target.checked;
                    setData(prev=>
                      prev.map(item=>
                        item.id == r.id ? {...item,fixed:newFixed} : item
                      )

                    )
                    setFixed(r.id,e.target.checked)}}
                >
                  
                </input>
              </td>
            </tr>
          ))
          
          }
        </tbody>
      </table>

      <div className="mt-6 text-right">
        
      </div>
    </div>
  )
}

export default ChangeEmail