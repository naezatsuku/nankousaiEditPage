"use client"
import { useState, useEffect } from "react"
import { getFoodData } from "../introduction/get_food";
import Loading from "../global/parts/loading";
import { MdOutlineRestaurant } from "react-icons/md";
import { KaiseiDecol } from "@/fonts";
import { supabase } from "@/lib/supabaseClient";

const kaiseiDecol = KaiseiDecol

type foods = {
    menu:string,
    value:number,
    type:string
}

type Props = {
    name:string
}
type rowData ={
    id:number;
    className:string;
    information:Array<foods>
}

export default function EditFood(
    {name}:Props
) {
    const [data, setData] = useState<Array<foods>>()
    const [editData,setEditData] = useState<Array<foods>>()
    useEffect(() => {
        const getData = async () => {
            
            const result = await getFoodData(name)
            console.log(result);
            if(result == null || result == "failed") {
                console.log("failed")
                return
            }
            
            setData(result)
            setEditData(result)
        }

        getData();
    },[])
    const handleEditData = (index: number, field: "menu" | "value" | "type", newValue: string | number) => {
        console.log("hello");

        if (editData==undefined || editData[index] == undefined) {
          window.alert("error");
          return;
        }
    
        const updated = [...editData]; 
        updated[index] = {
          ...updated[index],           
          [field]: newValue            
        };
    
        console.log(updated);
        setEditData(updated);
        setData(updated); 
    };  
    const updateData = async ()=>{
        const target = editData;
        console.log(target);
        const {data,error} = await supabase.from("food").update({information:target}).eq("className",name).select();
        console.log(name,data,error); 
        window.location.reload();
    }
    const handleDelete = (deleteIndex: number) => {
        if(editData==undefined){return};
        const updated = [...editData].filter((_, index) => index !== deleteIndex);
        setEditData(updated);
        setData(updated)
    };
    const addData = async ()=>{
        const data:foods = {menu:"",value:0,type:""}
        if(editData==undefined){
            
            setData([data]);
            setEditData([data]);
            return
        }
        const update =[...editData,data];
        setData(update);
        setEditData(update)
    }

    return (
        <div className="w-full">
            
            {data? <div className="w-full">
                <div className="px-3 py-4 border-1 border-gray-300 backdrop-blur-lg rounded-2xl">
                <div className="flex text-[10vw] lg:text-5xl items-center text-orange-400 justify-center mb-[4vw] lg:mb-8">
                    <MdOutlineRestaurant className="relative top-[0.5vw] lg:top-0"></MdOutlineRestaurant>
                    <p className={`${kaiseiDecol.className} ml-[0.5vw]`}>メニューを編集</p>
                </div>
                
                {data.map((value, index) => (
                    <div key={index} className="w-full  lg:mx-auto border-2 shadow-md border-gray-200 h-[18vw] mb-[5vw] p-2 lg:max-h-24 lg:mb-8">
                        <div className="border-2 h-full border-orange-300 flex items-center  text-[5vw] lg:text-3xl text-gray-500">
                            <button
                              onClick={() => handleDelete(index)}
                              className="text-[4vw] lg:text-xl px-2 py-2 text-red-400 hover:text-red-600 rounded-full bg-gray-100  shrink-0  hover:scale-105 transition duration-300 ease-in-out"
                            >
                              ❌
                            </button>
                          <input
                            type="text"
                            value={value.menu}
                            onChange={(e) => handleEditData(index, "menu", e.target.value)}
                            className="dynamic-text hover:text-orange-400 ml-[2vw] flex-grow min-w-0 max-w-[70vw] sm:max-w-[60vw] md:max-w-[50vw] lg:max-w-[500px] lg:ml-6  bg-transparent outline-none text-inherit  border-b-[1px] border-transparent hover:border-orange-400  transition duration-300 ease-in-out"

                          />
                          
                            <select
                              value={value.type}
                              onChange={(e) => handleEditData(index, "type", e.target.value)}
                              className="appearance-none m-[1vw] w-[8vw] h-[8vw] lg:w-[40px] lg:h-[40px] p-0 flex items-center justify-center text-center bg-orange-100 outline-none text-black  font-bold border border-transparent hover:border-orange-400 focus:border-orange-500 transition duration-300 ease-in-out text-[5vw] lg:text-2xl rounded-md"
                            >
                                <option value="◎">◎</option>
                                <option value="○">○</option>
                                <option value="△">△</option>
                                <option value="✕">✕</option>
                            </select>
                          
                          <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={String(value.value)}
                            onChange={(e) => {
                                const input = e.target.value;
                                const parsed = input === "" ? "" : Number(input);
                                handleEditData(index, "value", parsed);
                            }}

                            className="hover:text-orange-400 mr-[2vw] w-[10vw] lg:w-[80px] text-right bg-transparent outline-none text-inherit appearance-none border-b border-transparent hover:border-orange-400 focus:border-orange-500 transition duration-300 ease-in-out"

                          />
                          <span className="mr-[2vw]">円</span>
                          

                        </div>
                    </div>
                ))}
                <div className="flex flex-wrap justify-center gap-[2vw] text-center text-[4vw] lg:text-2xl text-gray-600">
                  <span className="flex items-center gap-[1vw]">
                    <span className="w-[6vw] lg:w-[30px] h-[6vw] lg:h-[30px] flex items-center justify-center bg-orange-100 rounded-md">◎</span>
                    <span>在庫あり</span>
                  </span>
                  <span className="flex items-center gap-[1vw]">
                    <span className="w-[6vw] lg:w-[30px] h-[6vw] lg:h-[30px] flex items-center justify-center bg-orange-100 rounded-md">○</span>
                    <span>6割くらい</span>
                  </span>
                  <span className="flex items-center gap-[1vw]">
                    <span className="w-[6vw] lg:w-[30px] h-[6vw] lg:h-[30px] flex items-center justify-center bg-orange-100 rounded-md">△</span>
                    <span>3割くらい</span>
                  </span>
                  <span className="flex items-center gap-[1vw]">
                    <span className="w-[6vw] lg:w-[30px] h-[6vw] lg:h-[30px] flex items-center justify-center bg-orange-100 rounded-md">✕</span>
                    <span>在庫なし</span>
                  </span>
                </div>
                <button onClick={addData} className="flex mx-auto px-4 py-2 mt-4 bg-gradient-to-r from-sky-200 via-sky-300 to-sky-500 hover:from-sky-400 hover:to-sky-300 backdrop-blur-md  text-white text-[3.5vw] lg:text-base font-normal rounded shadow-md transition duration-300 ease-in-out">メニューを追加</button>
                </div>
                
                <button onClick={()=>{
                    if(window.confirm("メニューを更新しますか？")){
                        updateData()
                    }
                }} className="flex mx-auto px-4 py-2 mt-4 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-300 backdrop-blur-md  text-white text-[3.5vw] lg:text-base font-normal rounded shadow-md transition duration-300 ease-in-out">メニューを更新</button>
            </div> : <div className="pt-[10vw]">
                <Loading></Loading>
            </div> }
        </div>
    )
}