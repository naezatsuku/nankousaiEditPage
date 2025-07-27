"use client" 
import { useState, useEffect } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { MdMusicNote } from "react-icons/md";
import Loading from "../global/parts/loading";
import { FaMusic } from "react-icons/fa6";
import { GoClockFill } from "react-icons/go";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { motion } from "framer-motion";
import Image from "next/image" 
import { edit_getBandData } from "./edit_getband";
import { randomUUID, UUID } from "crypto";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
type band_type = {
    name:string,
    time:string,
    comment:string,
    available:boolean
}
type band_time ={
    date:string,
    time:string;
}
type new_data = {
    id:UUID;
    name:string,
    time:Array<band_time>,
    comment:string,
    available:boolean,
    imgURL:string,
    updated:boolean;
}

export default function EditKeion() {
    console.log("軽音楽部だよ")
    const [data, setData] = useState<Array<new_data>>()
    const [editData,setEditData] = useState<Array<new_data>>();
    const [preData,setPreData] = useState<Array<new_data>>();
    const [deleted,setDeleted] = useState<UUID[]>([]);
    const [imageMap, setImageMap] = useState<{ id: UUID; file: File }[]>([]);
    const [num, setNum] = useState(0)
    const [imageList,setImageList] = useState<Array<any>>();
    
    useEffect(() => {
        const getData = async () => {
            const result = await edit_getBandData()
            console.log(result);
            if(result == null || result == "failed") {
                console.log("failed")
                return
            }
            setData(result)
            setEditData(result)
        }

        getData();
        const fetchImageList =async ()=>{
            const {data:imageList} = await supabase.storage.from("band-img").list("",{limit:100,offset:0})
            if(imageList){
                setImageList(imageList);
            }
        }
        const getPreData = async ()=>{
            const {data:band} = await supabase.from('band').select(`*` );
            if(band == null) {
                console.log("failed")
                return
            }
            console.log("pre",band);
            setPreData(band);
        }
        getPreData();
        fetchImageList();
        
    },[])

    const variants = {
        open:{
            height:"auto"
        },
        close: {
            height:0
        }
    }

    const view_variants ={
        open:{
            display:"none"
        },
        close: {
            display:"block"
        }
    }
    

    
    const numCon = (e: React.MouseEvent, index: number) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
        
      // フォーム要素ならトグルしない
      if (["input", "textarea", "button", "select","label"].includes(tag)) return;
        
      setNum((prev) => (prev === index + 1 ? 0 : index + 1));
    };

    const handleSubmit = async () => {
        const target = editData?.filter((item) => item.updated);
         //ここで削除されたバンドを反映
        await Promise.all(
            deleted.map(async (id) => {
                if(!preData?.find((item)=>item.id==id))return
                const { error } = await supabase.from("band").delete().eq("id", id);
                if (error) window.alert(`${id} の削除に失敗`);
            })
        );
        if (!target || target.length === 0) {
            if (deleted.length > 0) {
                window.alert("データの削除のみ行われました");
                return window.location.reload();
                 
                
            }
                return window.alert("なんの変更もありません");
        }
        if(!preData){
           const getPreData = async ()=>{
            const {data:band} = await supabase.from('band').select(`*` );
            if(band == null) {
                console.log("failed")
                return
            }
            setPreData(band);
        }
        getPreData();
        }
       
        
        const targetData = target?.filter((item)=>preData?.some((pre)=>pre.id == item.id));
        const createdData = target?.filter((item)=>!preData?.some((pre)=>pre.id == item.id));
        console.log("追加対象",createdData);



        console.log("更新対象:", targetData);
        // Storage リスト取得（未取得時）
        if (!imageList) {
            const { data: images, error } = await supabase.storage
              .from("band-img")
              .list("", { limit: 100, offset: 0 });
            if (!images) return window.alert("error ストレージからリストを取得できませんでした。");
            setImageList(images);
        }
        //ここはtargetDataのupdate
        console.log(preData);
        const sendData =[];
        for (const band of targetData) {
            const image = imageMap.find((img) => img.id === band.id);

            const predata = preData?.find((data=>data.id == band.id));
            let preImgPath = predata?.imgURL;

            //imageが変更されているか/変更されてるときのみ、画像を更新かつ、更新した画像のパスをpreImgPathに保存
            if (image){
            const preRecord = preData?.find((record)=>record.id === band.id);

            const imageurl =preRecord?.imgURL;
            
            if (imageurl && !imageurl.includes("NOIMAGE") ) {
                const exists = imageList?.some((file) => file.name === imageurl);
                const uploadOp = exists
                  ? supabase.storage.from("band-img").update(imageurl, image.file)
                  : supabase.storage.from("band-img").upload(imageurl, image.file);
                const { error } = await uploadOp;
                if (error) console.error(`${band.name}の画像処理失敗:`, error);

                preImgPath = imageurl;

            } else {
                const imgURLName = uuidv4();
                const { error: uploadError } = await supabase.storage
                  .from("band-img")
                  .update(imgURLName, image.file);

                if (uploadError) {
                  window.alert(`${band.name}の画像のアップロードに失敗しました。`);
                  continue;
                }
              
                preImgPath = imgURLName;
            }
            }
            
            const imgURL = preImgPath;

            console.log(preImgPath);
            sendData.push({
                id:band.id,
                name:band.name,
                comment:band.comment,
                time:band.time,
                imgURL:imgURL,
                imageVersion:new Date().toISOString()
            })

        }

        console.log("更新されるデータ",sendData);
        const result = await Promise.all(
            sendData.map(async (payload)=>{
                const {id, ...updateValues} = payload;
                const {data:send,error} = await supabase.from("band").update(updateValues).eq("id",id).select()
                if (error) {
                    console.error(`${id} の更新失敗:`, error);
                    return error;
                }else{
                    return send[0];
                }

            })
            

        )
        console.log("更新されたデータ成功",result);
        //ここはcretedDataのinsert
        if (createdData && createdData.length > 0) {
            const result =[]
            for (const band of createdData) {
                const image = imageMap.find((img) => img.id === band.id);
                let imgURL = "NOIMAGE";
                
                if (image) {
                    const imgURLName = uuidv4();
                    const { error: uploadError } = await supabase.storage
                    .from("band-img")
                    .update(imgURLName, image.file);
                    
                    if (uploadError) {
                        console.error(`${band.name}の画像アップロード失敗:`, uploadError);
                        window.alert(`${band.name} の画像アップロードに失敗しました。`);
                        continue;
                    }
                  
                    imgURL = imgURLName;
                }
              
                const { data: inserted, error: insertError } = await supabase
                    .from("band")
                    .insert({
                        name: band.name,
                        comment: band.comment,
                        time: band.time,
                        imgURL,
                        imageVersion: new Date().toISOString(),
                    })
                    .select();
                
                if (insertError) {
                    
                    window.alert(`${band.name} の作成に失敗しました`);
                    result.push(insertError);
                } else {
                    
                    result.push(inserted);
                }

            }
            console.log(result);
        }        

        window.alert(`データの編集が更新されました。`)
        window.location.reload();
    };
    



    return(
        <div className="w-full px-[5vw] sm:px-0 lg:px-6 lg:pb-8">
            {editData? 
                <div className="w-[90%] mx-auto lg:w-[70%]">
                {editData.map((value, index) => (
                    <motion.div initial={{opacity:0.9, scale:1}} whileHover={{opacity:1, scale:1.02}} transition={{ease:"easeInOut", duration:0.2}}  key={index} className="cursor-pointer rounded-xl my-[5vw] lg:my-12 shadow-sm drop-shadow-sm border-2 bg-white border-slate-100 " onClick={(e) => numCon(e, index)}
>
                        <div key={value.id}>
                            <div className="flex justify-between">
                            {value.time?.[0] ? (
                              <div className="flex items-center gap-[1vw]">
                                <span className="pr-[1vw]">{value.time[0].date}</span>
                                <GoClockFill className="relative top-[0.12vw] scale-90 text-purple-400" />
                                <span>{value.time[0].time}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">ライブ情報を入力してください</span>
                            )}
                            
                                
                                    <button
                                        onClick={(e)=>{
                                            if (!window.confirm("本当にこのバンドを削除しますか？元に戻せません！")) return;
                                            const updated = [...editData];
                                            const target_uuid = value.id;
                                            setDeleted((prev)=>[...prev,target_uuid]);                                        
                                            updated.splice(index,1);
                                            setEditData(updated);
                                            
                                        }}
                                        className="bg-red-100 border-none rounded-full font-medium py-1 px-2 mx-[3vw] my-[2vw] lg:my-4 lg:mx-6 text-sm  flex items-center hover:shadow-md hover:scale-105  transition duration-300"    
                            >このバンドを削除</button>
                                
                            </div>
                            
                            
                            
                            
                        <div className="flex  items-center justify-end italic bg-gradient-to-br from-fuchsia-500  to-sky-400 bg-clip-text text-transparent text-[6vw] lg:text-4xl pt-[1.5vw] pb-[2vw] pr-[5%] lg:pt-4 lg:pb-5">
                                <MdMusicNote className="mr-[1vw] relative top-[0.1vw] text-purple-400 rotate-6"></MdMusicNote>
                                <p>{value.name}</p>
                            </div>
                            <motion.div className="" animate={num == index + 1 ? "open": "close"} variants={view_variants} >
                                <p className="flex text-[2.5vw] lg:text-2xl  items-center absolute bottom-[10%] left-[3%] opacity-65">
                                <MdKeyboardDoubleArrowLeft className="translate-y-1.5"></MdKeyboardDoubleArrowLeft>
                                view more
                            </p>
                            </motion.div>
                            
                        </div>
                        
                        <motion.div className="w-[95%] mx-auto mb-1.5 opacity-85 rounded-lg border-2 border-slate-100 overflow-hidden" animate={num == index + 1 ? "open": "close"} variants={variants}>   
                            <div className="mx-4">
                                <div className="flex justify-center items-center italic text-gray-800 text-[6vw] lg:text-4xl pt-[1.5vw] pb-[2vw] pr-[5%] lg:pt-4 lg:pb-5">
                                    
                                    <input type="text"
                                        value={editData[index].name}
                                        onChange={(e)=>{
                                            const newEdit = [...editData!];
                                            newEdit[index].name = e.target.value;
                                            newEdit[index].updated = true;
                                            setEditData(newEdit);
                                        }}
                                    className="ml-[2vw] px-3 py-[0.4vw] w-[45vw] lg:w-[30vw] text-[4vw] lg:text-3xl font-semibold  bg-white border border-purple-300 rounded-md shadow-sm text-center tracking-tight focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 hover:opacity-70 hover:border-b-1 hover:border-b-black"
                                     />
                                </div>
                            </div>
                            <div className="mx-4 px-2 py-2 rounded-xl bg-slate-300">
                                {editData.filter((e) => (e.id == value.id))
                                .flatMap((contents)=>
                                    contents.time.map((content,n)=>(
                                        <div key={`${contents.id}-${n}`} className="block">
                                        <p className={`text-[3.5vw] font-medium tracking-tight text-slate-500  bg-white px-[3vw] py-[0.2vw] rounded-full  inline-block  text-left  my-[0.7vw] translate-y-[0%]     lg:text-lg  `}>
                                            Live{n+1}         
                                        </p>
                                        {/* ここで編集 */}
                                        <div>
                                        {/* 月の入力 */}
                                        <input
                                          type="number"
                                          min={1}
                                          max={12}
                                          value={content.date.split("/")[0]}
                                          onChange={(e) => {
                                            const newEdit = [...editData!];
                                            newEdit[index].updated = true;
                                            const day = content.date.split("/")[1] || "";
                                            newEdit[index].time[n].date = `${e.target.value}/${day}`;
                                            setEditData(newEdit);
                                          }}
                                          className="w-10 lg:w-10 px-3 py-2 mr-1 rounded-md border-none text-center text-purple-700 bg-white shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 ease-in-out text-[3.5vw] lg:text-lg"
                                          placeholder="月"
                                        />
                                      
                                        {/* 区切り表示 */}
                                        <span className="text-[4vw] lg:text-xl text-black font-bold">/</span>
                                      
                                        {/* 日の入力 */}
                                        <input
                                          type="number"
                                          min={1}
                                          max={31}
                                          value={content.date.split("/")[1]}
                                          onChange={(e) => {
                                            const newEdit = [...editData!];
                                            newEdit[index].updated = true;
                                            const month = content.date.split("/")[0] || "";
                                            newEdit[index].time[n].date = `${month}/${e.target.value}`;
                                            setEditData(newEdit);
                                          }}
                                          className="w-10 lg:w-10 px-3 py-2 mx-1 rounded-md border-none text-center text-purple-700 bg-white shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 ease-in-out text-[3.5vw] lg:text-lg"
                                          placeholder="日"
                                        />


                                        {/* 時間編集 */}
                                        <input
                                            type="text"
                                            value={content.time.split("~")[0]}
                                            onChange={(e) => {
                                              const newEdit = [...editData!];
                                              const endTime = content.time.split("~")[1] || "";
                                              newEdit[index].time[n].time = `${e.target.value}~${endTime}`;
                                              newEdit[index].updated = true;
                                              setEditData(newEdit);
                                            }}
                                            className="w-[18vw] lg:w-28 px-3 py-2 mx-1 rounded-md border-none text-center text-purple-700 bg-white shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 ease-in-out text-[3.5vw] lg:text-lg"
                                          />

                                          {/* 区切り */}
                                          <span className="text-[4vw] lg:text-xl text-black font-bold">~</span>
                                        
                                          {/* 終了時間 */}
                                          <input
                                            type="text"
                                            value={content.time.split("~")[1]}
                                            onChange={(e) => {
                                              const newEdit = [...editData!];
                                              const startTime = content.time.split("~")[0] || "";
                                              newEdit[index].updated = true;
                                              newEdit[index].time[n].time = `${startTime}~${e.target.value}`;
                                              setEditData(newEdit);
                                            }}
                                            className="w-[18vw] lg:w-28 px-3 py-2 mx-1 rounded-md border-none text-center text-purple-700 bg-white shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 ease-in-out text-[3.5vw] lg:text-lg"
                                          />
                                        </div>
                                    </div>
                                        
                                    ))
                                )
                            }
                            <button onClick={(e)=>{
                                const newEdit = [...editData];
                                newEdit[index].updated = true;
                                newEdit[index].time.push({date: "9/1",time: "0:00~0:00"})
                                setEditData(newEdit)
                            }}
                                className="bg-green-100 px-2 py-1 mt-4 mr-1 text-base font-medium tracking-tight rounded-full shadow-md hover:shadow-xl focus:outline-none  transition duration-300 ease-in-out "
                            >
                                時間を追加
                            </button>
                            <button onClick={(e)=>{
                                const newEdit = [...editData];
                                newEdit[index].updated = true;
                                newEdit[index].time.pop()
                                setEditData(newEdit)
                            }}
                                className="bg-red-100 px-2 py-1 mt-4 mx-1 text-base font-medium tracking-tight rounded-full shadow-md hover:shadow-xl focus:outline-none  transition duration-300 ease-in-out "
                            >
                                時間を削除
                            </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
                              <textarea
                              placeholder="ここに紹介"
                                value={editData[index].comment}
                                onChange={(e) => {
                                  const newEdit = [...editData!];
                                  newEdit[index].comment = e.target.value;
                                  newEdit[index].updated = true;
                                  setEditData(newEdit);
                                }}
                                className="whitespace-pre-wrap resize-none min-h-[10rem] text-blue-600 ml-[2vw] mr-[3vw] my-[3vw] text-[4vw] lg:text-2xl font-light tracking-[-0.01rem] opacity-80 leading-[160%] text-left w-full px-2 rounded-md border border-slate-300"

                              />


                              <div className="relative overflow-hidden  mr-[3vw]   lg:mr-6 rounded-xl shadow-lg group w-full sm:w-[40%] aspect-square">
                              <Image
                                src={value.imgURL && !value.imgURL.includes("NOIMAGE") ? value.imgURL : "/NOIMAGE.png"}
                                alt="バンド画像"
                                fill
                                sizes="(max-width: 640px) 100vw, 30vw"
                                className="object-cover "
                              />
                              
                              


                              
                            </div>
                                
                            </div>
                                <div className="flex justify-center mb-2">
                                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md cursor-pointer hover:bg-cyan-600 transition">
                                        画像ファイルを選択
                                        <input type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e)=>{
                                            const file = e.target.files?.[0];
                                            if(!file) return;
                                            const objUrl = URL.createObjectURL(file);
                                            const updated = [...editData];
                                            updated[index].imgURL = objUrl;
                                            updated[index].updated = true;
                                            setEditData(updated);
                                            setImageMap((prev) => {
                                              const next = [...prev.filter((i) => i.id !== value.id)];
                                              next.push({ id: value.id, file });
                                              return next;
                                            });

                                }}
                              />
                                    </label>

                              </div>



                        </motion.div>   
                    </motion.div>
                ))}
                
                
                <div className="flex justify-center my-2  ">
                    <button
                        className="py-2 px-3 bg-green-100 text-center rounded-full shadow-md hover:scale-105 transition duration-300"
                        onClick={()=>{
                            const data = {
                                available:true,
                                comment:"バンド紹介を編集",
                                id:uuidv4() as UUID,
                                imageVersion:"now",
                                imgURL:"/NOIMAGE",
                                name:"バンド名を変更",
                                time:[{date: '9/1', time: '00:00~00:00'}],
                                updated:true,
                            }
                            setEditData((prev) => (prev ? [...prev, data] : [data]));

                        }}
                    >バンドを追加</button>
                </div>
                <div className="flex justify-center my-2  ">
                    <button
                        className="py-2 px-3 bg-orange-100 text-center rounded-full shadow-md hover:scale-105 transition duration-300"
                        onClick={()=>{
                            if(window.confirm("バンド情報の一覧を更新しますか")){
                                handleSubmit()
                            }
                            }}
                    >バンド情報一覧の更新</button>
                </div>
            </div>
            :
            <div className="pt-[10vw]">
                    <Loading></Loading>
                    {/* <p className={`text-[5vw] ${kaiseiDecol.className} text-center bg-gradient-to-br from-fuchsia-500 via-purple-400 to-sky-400 bg-clip-text text-transparent`}>・・・読み込み中・・・</p> */}
            </div>}  
        </div>
    )
}

