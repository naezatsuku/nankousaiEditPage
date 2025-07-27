"use client"

import Image from "next/image"
import { MdOutlinePlace } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import NotReady from "../global/parts/notReady";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KaiseiDecol } from "@/fonts";
import { HowToPay } from "@/components/introduction/atentions"
import SadouClub from "@/components/introduction/sadou_club";
import Pranetarium_tiket from "@/components/introduction/atentions";
import { CookingClubNotice } from "@/components/introduction/atentions";
import { Cafe_trash } from "@/components/introduction/atentions";
import { supabase } from "@/lib/supabaseClient";
import { FaSave } from "react-icons/fa"; 
import EditFood from "./edit_foods";
import EditKeion from "./edit_Keion";
import { v4 as uuidv4 } from "uuid";
const kaiseiDecol = KaiseiDecol

type eventData = {
    event:{
        img: string;
        title:string,
        comment:string,
        place:string,
        time:Array<string>,
        type:string,
        tags:Array<string>,
        available:boolean,
        imageBackURL: string,
        imageURL: string,
        imageVersion:string,
        [key: string]: any;
    },
    detail:Array<{
        title:string,
        content:string
    }>,
    name:string
}

type detail = Array<{
    title:string,
    content:string
}>

export default function ShowDetails (
    {event, detail, name}:eventData
) { 
    const baseTagList=[
        {id:"food", name:"フード", color:"from-orange-400 via-orange-400 to-yellow-400"}, 
        {id:"act", name:"体験", color:"from-green-300 via-teal-400 to-cyan-500"},
        {id:"live", name:"ライブ", color:"from-purple-300 via-fuchsia-400 to-pink-400"},
        {id:"perform", name:"パフォーマンス", color:"from-blue-400 via-sky-300 to-sky-200"},
        {id:"attraction", name:"アトラクション", color:"from-red-200 via-purple-400 to-blue-500"},
        {id:"shopping", name:"ショッピング", color:"from-red-200 to-purple-400"},
        {id:"horror", name:"ホラー", color:"from-red-500 to-rose-300"},
        {id:"rest", name:"休憩", color:"from-cyan-500 to-yellow-300"},
        {id:"other", name:"その他", color:"from-sky-600 to-sky-200"},
    ]
    const [imageBackFile, setImageBackFile] = useState<File | null>(null);
    const [imageFrontFile, setImageFrontFile] = useState<File | null>(null);
    const [previmageBackUrl,setPrevimageBackUrl] = useState<string | undefined>(undefined)
    const [previmageFrontUrl,setPrevimageFrontUrl] = useState<string | undefined>(undefined)
    const [previewBackUrl,setPreviewBackUrl] = useState<string | undefined>(undefined)
    const [previewFrontUrl,setPreviewFrontUrl] = useState<string | undefined>(undefined)
    //編集のinput要素の内容を保存
    const [informationTitle,setInformationTitle] = useState<string>("");
    const [informationContent,setInformationContent] = useState<string>("");
    const [eventTitle,setEventTitle] = useState<string>("");
    const [eventPlace,setEventPlace] = useState<string>("");
    const [eventComment,setEventComment] = useState<string>("")
    const [eventTag,setEventTag] = useState<Array<string>>([]);
    const [eventTypeTag,setEventTypeTag] = useState(event.type? event.type : "クラス展示");
    const [eventTime,setEventTime] = useState<Array<string>>([""])
    const [newTagName, setNewTagName] = useState("");
    const [canBeChoosenTag, setCanBeChoosenTag] = useState(baseTagList);
    const [date, setDate] = useState(false) 
    useEffect(()=>{
        handlePrevCustomTag();
        imageUrl(name)
        setEventTitle(event.title);
        setInformationTitle(detail[0].title);
        setInformationContent(detail[0].content);
        setEventPlace(event.place);
        setEventComment(event.comment);
        setEventTime(event.time);
        const allTags = event.tags;
        if(allTags.includes("null")){
            const update = allTags.filter(t=>t != "null");
            event.tags=update;
            setEventTag(update);
        }else{
            setEventTag(allTags);
        }
        
    },[])
    if(detail.length == 0){
        return (
            <>
                introductionページが存在していません。管理者に問い合わせてください。
            </>
        )
    }
    
    //アップロードされた画像のUrlを作成
    const handlePreviewBackUrl = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(!file) return;
        setPreviewBackUrl(URL.createObjectURL(file));
        setImageBackFile(file)
    }
    const handlePreviewFrontUrl = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(!file) return;
        setPreviewFrontUrl(URL.createObjectURL(file))
        setImageFrontFile(file)
    }

    //カードの画像（ロンド）と背景画像のurl取得
    const imageUrl = async (name:string)=>{
        if(name){
            const fileImgBackPath = event.imageBackURL;
            const fileImgFrontPath = event.imageURL
            const version = event.imageVersion;
            const imageBackURL = supabase.storage
              .from("class-img")
              .getPublicUrl(fileImgBackPath).data.publicUrl;

            const imageFrontURL = supabase.storage
              .from("class-img")
              .getPublicUrl(fileImgFrontPath).data.publicUrl;
            console.log(imageBackURL,imageFrontURL);
            setPrevimageBackUrl(`${imageBackURL}?v=${version}`);
            setPrevimageFrontUrl(`${imageFrontURL}?v=${version}`)
        }else{
            
        }
    }
    const handleUpdateAllImages = async () => {
        const version =new Date().toISOString();
        event.imageVersion = String(version);
        const uploads = [
          { file: imageBackFile, path: `${event.imageBackURL}`, key: "imageBackURL"},
          { file: imageFrontFile, path: `${event.imageURL}`, key: "imageURL"}
        ];
        for (const { file, path, key } of uploads) {
            let imgPath = path;
            
            const version = new Date().toISOString();
            //pathによって処理を変える。
            if (!file) continue;
            if(path && path != "NOIMAGE"){
                const { error } = await supabase.storage.from("class-img").update(path, file);
                if (error) {
                    console.log(error)
                    console.error(`Upload failed (${key}):`, error.message);
                    window.alert(`画像の更新に失敗しました(${key}):`)
                    return;
                }
              }else{
                const imgURLName = uuidv4();
                const {error:uploadError} = await supabase.storage.from("class-img").upload(imgURLName,file);
                if (uploadError) {
                  window.alert(`${key}の画像のアップロードに失敗しました。`);
                  return;
                }
                imgPath = imgURLName;

              }
            const updates:Record<string,any> ={
                imageVersion:version,
                [key]:imgPath
            }
            const {error:uploadError}=await supabase.from("contents").update(updates).eq("className",name)
            if(uploadError){
                console.error(uploadError.message);
                window.alert(`画像の更新に失敗しました（${key}）`);
                continue;

            }
            console.log("event[key] BEFORE:", event[key]);
            console.log("path BEFORE:", path);
            console.log(imgPath)
        }
          };

    //クラス展示かフードか部活動展示か  
    const typeTag =[
        {id:"class", name:"クラス展示", color:"from-blue-500 via-indigo-500 to-purple-500"},  
        {id:"club", name:"部活動展示", color:"from-blue-500 via-indigo-500 to-purple-500"},
        {id:"pta", name:"PTA", color:"from-yellow-300 via-lime-400 to-green-400"},
        {id:"cafe", name:"食堂", color:"from-orange-400 via-orange-400 to-yellow-400"},
    ]
    //生徒が決められるtag編集できる
    
    console.log()

    const handleAddCustomTag = () => {
      if (!newTagName.trim()) return;

      const customTag = {
        id: "custom", 
        name: newTagName.trim(),
        color: "from-purple-400 to-purple-600", 
      };

      setCanBeChoosenTag((prev) => {
        const filtered = prev.filter(tag => tag.id !== "custom");
        return [...filtered, customTag];
      });

      setNewTagName("");
    };



    

    
    
    const handlePrevCustomTag = ()=>{
        const customTagName = event.tags.filter((tagName)=>{
        return !baseTagList.some(tag=>tag.name == tagName);
    })
    if(customTagName.length==0){
        return
    }
    const customTag = {
        id: "custom", 
        name: customTagName[0],
        color: "from-purple-400 to-purple-600", 
      };
    console.log(customTag);
    setCanBeChoosenTag([...baseTagList,customTag])
    }
    

    
    
    const handleInformationTitleChange = (newTitle:string)=>{
        const update = newTitle;
        
        setInformationTitle(update);
    }
    const handleInformationContentChange = (newContent:string)=>{
        const update = newContent;
        
        
        setInformationContent(update);
    }
    const handleEventTitle = (newContent:string)=>{
        const update = newContent;
        
        
        setEventTitle(update);
    }
    const handleEventPlace = (newContent:string)=>{
        const update = newContent;
        setEventPlace(update);
    }
    const handleEventComment = (newContent:string)=>{
        const update = newContent;
        setEventComment(update);
    }
    const handleEventTime = (newContent:string)=>{
        const update = [newContent];
        setEventTime(update);
    }
    const handleEventTag = (name:string)=>{
        setEventTag(prev=>prev.includes(name) ? prev.filter(t => t!=name) : [...prev,name])
    }
    const handleEventTypeTag = (name:string)=>{
        setEventTypeTag(name);
    }

    const handleEventTimeChange = (index: number, value: string) => {
      setEventTime((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    };

const addEventTime = () => {
      setEventTime((prev) => [...prev, ""]);
    };

const removeEventTime = (index: number) => {
      setEventTime((prev) => prev.filter((_, i) => i !== index));
    };
    //データベースで更新する。
    const upDateData = async ()=>{
        const targetClass = name;
        const detailDatas ={
            title:informationTitle,
            content:informationContent
        }
        const eventDatas = {
            title:eventTitle,
            time:eventTime,
            place:eventPlace,
            comment:eventComment,
            type:eventTypeTag,
            genre:eventTag
        }
        console.log(name,detailDatas,eventDatas);
        const {data:informationData,error:informationError} = await supabase.from("introduction").update(detailDatas).eq("className",targetClass).select();
        const {data:eventData,error:eventError} = await supabase.from("contents").update(eventDatas).eq("className",targetClass).select();
        console.log(eventData,eventError);
        let  message ="";
        if(informationError){
            message = message+"informationErrorです"
        }
        if(eventError){
            message +="eventErrorです" 
        }
        if(!informationError&&!eventError){
            window.alert("成功しました")
        }else{
            window.alert(message);
        }
        console.log(informationData,eventData)
        window.location.reload();
    }

    
    console.log(event);
    const onMenuClicked = () => {
        if(date == false) {
            setDate(true)
        } else {
            setDate(false)
        }
    }



    const variants = {
        hidden:{
            height:0
        },
        menu:{
            height:"auto"
        },
        close:{
            rotate:0
        },
        open:{
            rotate:"180deg"
        }
    }

    const Tags = [
        {id:"tenji", name:"展示", color:"from-blue-500 via-indigo-500 to-purple-500"},
        {id:"food", name:"フード", color:"from-orange-400 via-orange-400 to-yellow-400"},
        {id:"class", name:"クラス展示", color:"from-blue-500 via-indigo-500 to-purple-500"},
        {id:"club", name:"部活動展示", color:"from-blue-500 via-indigo-500 to-purple-500"},
        {id:"junior", name:"中学", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"high", name:"高校", color:"from-sky-400 via-blue-400 to-indigo-400"},
        {id:"act", name:"体験", color:"from-green-300 via-teal-400 to-cyan-500"},
        {id:"live", name:"ライブ", color:"from-purple-300 via-fuchsia-400 to-pink-400"},
        {id:"perform", name:"パフォーマンス", color:"from-blue-400 via-sky-300 to-sky-200"},
        {id:"attraction", name:"アトラクション", color:"from-red-200 via-purple-400 to-blue-500"},
        {id:"shopping", name:"ショッピング", color:"from-red-200 to-purple-400"},
        {id:"horror", name:"ホラー", color:"from-red-500 to-rose-300"},
        {id:"cafe", name:"食堂", color:"from-orange-400 via-orange-400 to-yellow-400"},
        {id:"pta", name:"PTA", color:"from-yellow-300 via-lime-400 to-green-400"},
        {id:"rest", name:"休憩", color:"from-cyan-500 to-yellow-300"},
        {id:"j-1", name:"中学1年", color:" from-yellow-300  to-amber-400"},
        {id:"j-2", name:"中学2年", color:"from-sky-400 via-blue-400 to-indigo-400"},
        {id:"j-3", name:"中学3年", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"h-1", name:"高校1年", color:"from-sky-400 via-blue-400 to-indigo-400"},
        {id:"h-2", name:"高校2年", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"h-3", name:"高校3年", color:"from-yellow-300 to-amber-400"},
        {id:"other", name:"その他", color:"from-sky-600 to-sky-200"},
    ]
    
    
    const foodClass=[
        {name:"高校3年1組"},
        {name:"高校3年2組"},
        {name:"高校3年3組"},
        {name:"高校3年4組"},
        {name:"高校3年5組"}

    ]
    let img_tag = null
    //nameはクラス名
    if(!foodClass.some(n=>n.name == name)){
        img_tag = event.img;
    }else{
        if(event.tags.includes("フード")){
            img_tag = "/burger-2762431_1920.jpg"
        } else {
            img_tag = "/AdobeStock_335757173.jpeg"
        }
    }

    const newDetails:detail = []

    for(let i = 0; i < detail.length; i++) {
        if(detail[i].content.includes("テキスト") == false) {
            newDetails.push(detail[i])
        }
    }
    
    //テーマによって色を変える
    const setTextColor = (e:any, type:string) => {
        let result = ""

        if(e.includes("クラス展示") || e.includes("部活動展示")){
            result = " from-blue-500 via-indigo-500 to-purple-500"
        }

        if(e.includes("PTA")) {
            result = "from-yellow-300 via-lime-400 to-green-400"
        }

        if(e.includes("フード")) {
            result = "from-orange-400 via-orange-400 to-yellow-400"
        }
        
        if(e.includes("ライブ")) {
            result = "from-purple-300 via-fuchsia-400 to-pink-400"
        }

        if(e.includes("パフォーマンス")) {
            result = " from-blue-400 via-sky-300 to-sky-200"
        }

        if(e.includes("体験")) {
            result = " from-green-300 via-teal-400 to-cyan-500"
        }

        if(e.includes("アトラクション")) {
            result = "from-red-300 via-purple-400 to-blue-500"
        }

        if(e.includes("休憩")) {
            result = "from-cyan-500 to-yellow-300"
        }

        if(type == "bg") {
            if(result == "") {
                result = "bg-gradient-to-br from-sky-600 to-sky-100 "
            } else {
                result += " bg-gradient-to-br"
            }
        } else if(type == "text") {
            if(result == "") {
                result = "bg-gradient-to-br bg-clip-text text-transparent from-sky-600 to-sky-100 "
            } else {
                result += " bg-gradient-to-br bg-clip-text text-transparent "
            }
        } else if (type === "inputText") {
            result = "text-[#00b2b5]  hover:text-[#01e1e5] caret-[#01e1e5]";
        }


        return result
    }
 
    return(
        <div className="mt-[min(15vw,80px)]  md:mt-[13vw]  lg:mt-[min(15vw,80px)] bg-white min-h-screen z-0 ">
            <div className="w-full h-[35vw] lg:h-60 relative">
                <div className=" z-0 inset-0 absolute">
                    <Image src={img_tag || "/NOIMAGE.png"} alt="ヘッダー画像" fill priority className="object-cover object-center z-0 opacity-95 brightness-90"></Image>
                </div>
                <div className="w-auto h-full absolute z-[6] flex ">
                    <p className={`${kaiseiDecol.className} pl-[3vw] my-auto text-[10vw] lg:text-7xl text-white font-bold`}>{name}</p>
                </div>
            </div>
            <div className="max-w-[1100px] lg:mx-auto pb-[20vw] lg:pb-[5vw] bg-white lg:px-4 lg:shadow-md ">
                <div className="pt-[6vw] px-[3vw] lg:pt-2 lg:px-6">
                  <p className={`
                    text-[3.5vw] font-medium tracking-tight text-white px-[3vw] py-[0.2vw]
                    rounded-full inline-block text-left my-[0.7vw] translate-y-[0%]
                    ${setTextColor(event.tags, "bg")}
                    lg:text-lg lg:px-8 lg:py-1 lg:mt-6 lg:mb-2
                  `}>
                    タイトル
                  </p>
                
                  <div>
                    <input
                            type="text"
                            placeholder={event.title}
                            value={eventTitle}
                            onChange={(e) => handleEventTitle(e.target.value)}
                            className={`
                              text-[8vw] font-bold leading-[140%] lg:leading-[125%] tracking-tight text-left
                              ${kaiseiDecol.className}
                              ${setTextColor(event.tags, "inputText")} lg:text-7xl
                              hover:underline hover:opacity-100 opacity-80
                              border-b border-[#00b2b5] focus:border-[#01e1e5]
                              outline-none bg-transparent
                              transition duration-200
                                            `}
                    />
                  </div>
                </div>
                <div className="mx-[3.5vw] mt-[4vw] text-[4.5vw] lg:text-3xl lg:mx-6 lg:mt-8 leading-[160%] text-slate-500 ">
                    <p className="flex items-center mb-[1vw] lg:mb-3">
                        <MdOutlinePlace className="translate-y-[5%] mr-[0.5%]"/>
                        <input type="text"
                            value={eventPlace}
                            onChange={(e)=>{handleEventPlace(e.target.value)}}
                            placeholder={event.place}
                            className="
                                outline-none bg-transparent
                                hover:underline hover:opacity-100 opacity-80
                                border-b border-[#00b2b5] focus:border-[#01e1e5]
                                caret-[#01e1e5] transition duration-200
                                        "
                        />    
                    </p>
                    <div className="flex items-center">
                        <button
                          onClick={addEventTime}
                          className="mt-4 px-4 py-1 bg-[#00b2b5] text-white rounded hover:bg-[#01e1e5] transition"
                        >
                          ＋ 時間を追加
                        </button>
                    </div>
                    <div className="flex items-left flex-col gap-4">                     
                      {eventTime.map((timeValue, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <IoTimeOutline className="translate-y-[7%] mr-1" />
                            <input
                              type="text"
                              value={timeValue}
                              onChange={(e) => handleEventTimeChange(index, e.target.value)}
                              className="outline-none bg-transparent border-b border-[#00b2b5] focus:border-[#01e1e5] caret-[#01e1e5] opacity-80 hover:opacity-100 transition duration-200"
                            />
                            <button
                              onClick={() => removeEventTime(index)}
                              className="text-red-500 hover:text-red-700 text-xl"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>

                    {event.time.length > 1 && <motion.div variants={variants} animate={date==true ? "menu" : "hidden"} className="mt-[2vw] lg:mt-4  rounded-lg w-full overflow-hidden ">
                        {event.time.map((value, index) => (
                            <div key={index} className="flex items-center   mb-[3vw] ml-[10vw] lg:mb-8">
                                <p className="w-[20vw] text-[4vw] lg:text-3xl">第{index + 1}回</p>
                                <p className="w-[50vw] text-center  text-[5vw] lg:text-4xl">{value}</p>
                            </div>
                        ))}
                    </motion.div>}
                    
                </div>
                <div className="w-full my-[7vw] px-12 lg:my-10">
                        <div className={`text-[3.5vw] lg:text-2xl tracking-tight text-slate-500 text-center ${kaiseiDecol.className}`}>
                <input
                  type="text"
                  value={eventComment}
                  onChange={(e) => handleEventComment(e.target.value)}
                  placeholder={event.comment}
                  className="
                    text-center font-bold outline-none bg-transparent
                    hover:underline hover:opacity-100 opacity-80
                    border-b border-[#00b2b5] focus:border-[#01e1e5]
                    caret-[#01e1e5] transition duration-200
                  "
                />
                </div>          
                </div>
                {name == "プラネタリウム" &&
                    <div className="w-full px-[4vw] mb-[15vw] lg:px-6 lg:mb-6 lg:w-[80%] lg:mx-auto">
                        <Pranetarium_tiket></Pranetarium_tiket>
                    </div>
                }
                {name == "茶道部" &&
                    <div className="w-full px-[4vw]  lg:px-5 pb-[3vw] lg:pb-14">
                        <SadouClub></SadouClub>
                    </div>
                }
                {name == "高校軽音楽部" &&
                    <EditKeion></EditKeion>
                }
                {event.tags.includes("高校3年") && 
                    <div className="w-full px-[4vw] lg:px-6 mb-[10vw] lg:mb-14 lg:w-[80%] lg:mx-auto">
                        <HowToPay></HowToPay>
                    </div>
                }
                {name == "高校料理部" && 
                    <div className="w-full px-[4vw] lg:px-6 mb-[10vw] lg:mb-14 lg:w-[80%] lg:mx-auto">
                        <CookingClubNotice></CookingClubNotice>
                    </div>
                }
                {name == "食堂" && 
                    <div className="w-full px-[4vw] lg:px-6 mb-[10vw] lg:mb-14 lg:w-[80%] lg:mx-auto">
                        <Cafe_trash></Cafe_trash>
                    </div>
                }
                {event.tags.includes("フード") &&
                    <div className="w-full px-[4vw] lg:px-6 mb-[15vw] lg:w-[80%] lg:mx-auto lg:mb-6">
                        <EditFood name={name}></EditFood>
                    </div>
                    
                }
                {event.available == true ?
                <div>
                    
                    <div className="w-auto">
                    {newDetails.map((value) => (
                        <div key={value.title} className="mb-[12vw] mt-[7vw] mx-[4vw] lg:mx-8 lg:mb-14 lg:my-10">
                            <div className="flex shadow-slate-100 shadow-md">
                                <div className=" w-[2vw] lg:w-4 bg-gradient-to-b from-[#01e1e5] to-[#039fa2]"></div>
                                <input 
                                value={informationTitle}
                                type="text"
                                className={`${kaiseiDecol.className} text-[#00b2b5]text-[7vw] lg:text-4xl lg:ml-6 lg:py-4 ml-[2vw] py-[1vw]bg-gradient-to-b from-[#01e1e5] to-[#009294] font-bold outline-none bg-transparent hover:underline focus:ring-2 focus:ring-[#01e1e5]hover:opacity-100 opacity-80`}
                                onChange={(e)=>handleInformationTitleChange(e.target.value)}
                                placeholder={value.title}
                                ></input>
                            </div>
                            <textarea 
                            value={informationContent}
                            onChange={(e)=>{handleInformationContentChange(e.target.value)}}
                            placeholder={value.content}
                            className="h-[calc(1.5em*6)] w-[90vw] lg:w-[80%] ml-[2vw] mr-[3vw] my-[3vw]  text-[4vw] lg:ml-4 lg:mr-6 lg:text-2xl lg:my-5  lg:leading-[150%] leading-[160%] text-[#00b2b5] font-light tracking-[-0.01rem] opacity-80 text-justify resize-none outline-none bg-transparent placeholder-[#00b2b5] hover:opacity-100 transition duration-150 ">

                            </textarea>
                        </div>
                    ))}
                    <table className="w-full table-auto border-collapse text-[#00b2b5] text-sm lg:text-base">
                        <thead>
                          <tr className="border-b border-[#00b2b5]">
                            <th className="text-left px-4 py-2">項目</th>
                            <th className="text-left px-4 py-2">変更前</th>
                            <th className="text-left px-4 py-2">変更後</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-[#00b2b5]/30">
                            <td className="px-4 py-2">タイトル</td>
                            <td className="px-4 py-2">{event.title}</td>
                            <td className="px-4 py-2">{eventTitle}</td>
                          </tr>
                          <tr className="border-b border-[#00b2b5]/30">
                            <td className="px-4 py-2">開催期間</td>
                            <td className="px-4 py-2">{event.time}</td>
                            <td className="px-4 py-2">{eventTime}</td>
                          </tr>
                           <tr className="border-b border-[#00b2b5]/30">
                            <td className="px-4 py-2">開催場所</td>
                            <td className="px-4 py-2">{event.place}</td>
                            <td className="px-4 py-2">{eventPlace}</td>
                          </tr>
                          <tr className="border-b border-[#00b2b5]/30">
                            <td className="px-4 py-2">キャッチコピー</td>
                            <td className="px-4 py-2">{detail[0].title}</td>
                            <td className="px-4 py-2">{informationTitle}</td>
                          </tr>
                          <tr className="border-b border-[#00b2b5]/30 ">
                            <td className="px-4 py-2">内容</td>
                            <td className="px-4 py-2 max-w-[20vw] whitespace-pre-wrap break-words text-[#00b2b5] text-sm lg:text-base leading-relaxed">{detail[0].content}</td>
                            <td className="px-4 py-2 max-w-[20vw] whitespace-pre-wrap break-words text-[#00b2b5] text-sm lg:text-base leading-relaxed">
                                {informationContent}
                            </td>
                          </tr>
                          <tr className="border-b border-[#00b2b5]/30 ">
                            <td className="px-4 py-2">展示タイプ</td>
                            <td className="px-4 py-2">{event.type}</td>
                            <td className="px-4 py-2 max-w-[20vw]  text-[#00b2b5] text-sm lg:text-base leading-relaxed">
                                {eventTypeTag}
                            </td>
                          </tr>
                          <tr className="border-b border-[#00b2b5]/30">
                            <td className="px-4 py-2">タグ</td>
                            <td className="px-4 py-2">{event.tags.map((value,index)=>(
                                value!="null" ? <span key={index}>{value} </span> :null
                                ))}
                            </td>
                            <td className="px-4 py-2 whitespace-normal break-words">
                                <div className="flex flex-wrap gap-2 max-w-[20vw]">
                                    {eventTag.map((value,index)=>(
                                        value!="null" ? <span key={index} className="bg-[#01e1e5]/10 text-[#01e1e5] px-2 py-1 rounded-full text-sm">{value} </span> :null
                                    ))}
                                </div>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="mb-[12vw] mt-[7vw] mx-[4vw] lg:mx-8 lg:mb-14 lg:my-10">
                    <div className="flex justify-center items-center text-lg text-gray-700 font-medium">タイプを編集</div>
                    <div className="flex flex-wrap gap-2">
                        {typeTag.map((tag)=>{
                            const isSelected = eventTypeTag.includes(tag.name);
                            return (
                                <button key={tag.id}
                                onClick={()=>{handleEventTypeTag(tag.name)}}
                                className={`px-4 py-1 rounded-sm text-white text-sm font-medium bg-gradient-to-r ${tag.color}
                                 ${isSelected ? "ring-2 ring-[#01e1e5]" : "opacity-70 hover:opacity-100"} transition duration-150`}
                                >
                                    {tag.name}
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex justify-center items-center text-lg text-gray-700 font-medium">タグを編集</div>
                    <div className="flex flex-wrap gap-2">
                        {canBeChoosenTag.map((tag)=>{
                            const isSelected = eventTag.includes(tag.name);
                            return (
                                <button key={tag.id}
                                onClick={()=>{handleEventTag(tag.name)}}
                                className={`px-4 py-1 rounded-sm text-white text-sm font-medium bg-gradient-to-r ${tag.color}
                                 ${isSelected ? "ring-2 ring-[#01e1e5]" : "opacity-70 hover:opacity-100"} transition duration-150`}
                                >
                                    {tag.name}
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex gap-2 mt-4 ">
                      <input
                        
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e)=>e.key === "Enter" && handleAddCustomTag()}
                        placeholder="新しいタグ名"
                        className="px-3 py-1 border border-teal-500 rounded-md outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        onClick={handleAddCustomTag}
                        className="px-4 py-1 bg-teal-500 text-white rounded-md hover:bg-cyan-500"
                      >
                        ＋ 追加
                      </button>
                        {canBeChoosenTag.some(t => t.id === "custom") && (
                            <p className="text-sm text-gray-500 mt-2">※現在のカスタムタグは上書きされます</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 justify-center mt-4 p-4 rounded-xl shadow-lg bg-gradient-to-br from-teal-100 via-sky-200 to-blue-200 bg-opacity-30 backdrop-blur-md">
                      {/* 背景画像 */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-b-2">クラス背景（廊下）</div>
                        <img src={previmageBackUrl} alt="背景画像" className="md:w-[20vw] sm:max-w-[80vw] rounded-lg shadow-md " />
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md cursor-pointer hover:bg-cyan-600 transition">
                            画像ファイルを選択
                            <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePreviewBackUrl}
                        />
                        </label>
                        {previewBackUrl && <div>
                            <div className="flex justify-center">変更後</div>
                            <img src={previewBackUrl} alt="プレビュー" className="md:w-[20vw] sm:w-[80vw] rounded-lg shadow-md" />
                        </div>}
                      </div>

                      {/* フロント側の画像 */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="border-b-2">ロンドのクラス写真</div>
                        <img src={previmageFrontUrl} alt="タイトル画像" className="md:w-[20vw] sm:w-[80vw] rounded-lg shadow-md" />
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md cursor-pointer hover:bg-cyan-600 transition">
                            画像ファイルを選択
                            <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePreviewFrontUrl}
                        />
                        </label>
                        
                        {previewFrontUrl && 
                        <div>
                            <div className="flex justify-center">変更後</div>
                            <img src={previewFrontUrl} alt="プレビュー" className="md:w-[20vw] sm:w-[80vw] rounded-lg shadow-md" />
                        </div>
                        }
                      </div>
                      

                    </div>
                        <div className="flex justify-center mt-4">
                        <button
                        onClick={handleUpdateAllImages}
                        className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-md hover:opacity-90 transition"
                      >
                        画像を更新する
                      </button>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        onClick={upDateData}>
                        <FaSave className="w-5 h-5" />保存する
                    </button>
                    </div>
                    
                    </div>
                </div>
                : <div className="py-[15vw] my-[5vw] rounded-lg bg-slate-50 mx-[4vw] lg:mx-6 lg:py-16 lg:my-0">
                    <NotReady></NotReady>
                </div>
                }
                
                
                
                <div className="my-[5vw] lg:mt-14 lg:mb-0 lg:pb-14 rounded-lg  lg:mx-6">
                    <p className={`my-[3vw] ${kaiseiDecol.className} text-[5vw] text-[darkturquoise] text-center lg:text-4xl lg:py-8 lg:my-0`}>・・・関連タグ・・・</p>
                    <div className=" flex flex-wrap mx-[3vw] justify-start lg:mx-4 "> 
                        <div className={`my-[2vw] w-[25vw] aspect-[3/1] bg-gradient-to-br from-red-400 to-red-600 rounded-md flex mx-[2vw] opacity-90 lg:ml-0 lg:mr-6 lg:max-w-[10.5rem] lg:mb-6 lg:mt-0`}>
                            <p className="m-auto  text-[3vw] lg:text-lg text-gray-50 font-medium">編集中</p>
                        </div>
                    </div>

                </div>
            </div> 
        </div>
    )
}



