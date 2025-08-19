import { supabase } from '@/lib/supabaseClient'
import React, { useEffect, useState } from 'react'
type Data ={
    id:number,
    className:string,
    teacherEmail:string,
    EmailChangeRequest:boolean,
    requestEmail:string,
    fixed:boolean,
}
type EditData = {
    EmailChangeRequest:boolean,
    requestEmail:string,
}
const PageInner = ({data}:{data:Data}) => {
    const [reqEmail,setReqEmail] = useState<string>("");
    const [changeReq,setChangeReq] = useState<boolean>(false);
    const [editData,setEditData] = useState<EditData>()
    useEffect(()=>{
      setChangeReq(data.EmailChangeRequest);
      setReqEmail(data.requestEmail);
    },[data])
    const handleSubmit = async (e: React.FormEvent)=>{
      e.preventDefault()
      if(data.fixed == true){
        return alert("現在メールアドレスの変更は、南高祭の管理者により禁止されています")
      }
      const targetData = {
        EmailChangeRequest:changeReq,
        requestEmail:reqEmail
      }
      const {data:fetchedData,error} = await supabase.from("introduction").update(targetData).eq("id",data.id).select()
      if(error || !fetchedData){
         return alert("更新されませんでした")
      }
      const formatedData = fetchedData[0] as EditData
      console.log(formatedData);
      alert("更新に成功しました");
      //window.location.reload();
    }
  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
            <main className="p-6 max-w-md mx-auto">
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border-1 border-slate-300">
                    <div className="bg-gradient-to-br from-[#05a8bd] via-[#05bd92] to-[#f3e50a] p-4">
                        <h1 className="text-xl font-bold text-white">先生への更新先メールアドレスの変更</h1>
                    </div>
{data && 
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-gray-800">
                <span className="font-medium">クラス</span>
                <span>{data.className}</span>
              </div>
              <div className="flex flex-col gap-2 text-gray-800">
                <span className="font-medium">現在のメール</span>
                <span className=''>{data.teacherEmail}</span>
              </div>
              {(data.EmailChangeRequest && data.fixed==false) &&
                <>
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium text-red-400">すでにリクエスト済みです</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">希望メールアドレス</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>{data.requestEmail ?? "なし"}</span>
                </div>
                </>
              }
              {data.fixed==true && 
              <div className="flex flex-col gap-2 text-gray-800">
                <span className="font-medium">現在メールアドレスの変更は、南高祭の管理者により禁止されています</span>
              </div>
              }
              {/*form */}
              {data.fixed==false &&
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changeReq}
                      onChange={(e) => setChangeReq(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-gray-800">メールアドレスの変更を申請する</span>
                  </label>
                  {(changeReq) && (
                    <div>
                      <label htmlFor="desiredClass" className="block text-gray-700 mb-1">
                        希望メールアドレス
                      </label>
                      <input
                        id="email"
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={reqEmail ? reqEmail : ""}
                        onChange={(e) => setReqEmail(e.target.value)}
                        required
                      />
                      <div className="flex justify-center mt-2">
                        <button
                          type="submit"
                          className="mb-4 py-2 px-8 bg-green-500 text-white font-semibold rounded-md hover:bg-green-300 transition duration-300 hover:scale-105"
                        >
                          送信
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              }
              
            </div>
            }
                </div>
            </main>

    </div>
  )
}

export default PageInner