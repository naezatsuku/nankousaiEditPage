"use client"

import Image from "next/image"
import { MdOutlinePlace } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import NotReady from "../global/parts/notReady";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KaiseiDecol } from "@/fonts";
import { FaAngleDown } from "react-icons/fa";
import Keion from "@/components/introduction/Keion";
import { HowToPay } from "@/components/introduction/atentions"
import GetFood from "@/components/introduction/show_foods";
import SadouClub from "@/components/introduction/sadou_club";
import Pranetarium_tiket from "@/components/introduction/atentions";
import { CookingClubNotice } from "@/components/introduction/atentions";
import { Cafe_trash } from "@/components/introduction/atentions";
import { button, u } from "framer-motion/client";
import { supabase } from "@/lib/supabaseClient";

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
        available:boolean
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
    console.log()
    //編集のinput要素の内容を保存
    const [informationTitle,setInformationTitle] = useState<string>("");
    const [informationContent,setInformationContent] = useState<string>("");
    const [eventTitle,setEventTitle] = useState<string>("");
    const [eventPlace,setEventPlace] = useState<string>("");
    const [eventComment,setEventComment] = useState<string>("")
    const [eventTag,setEventTag] = useState<Array<string>>([]);
    const [eventTime,setEventTime] = useState<Array<string>>()
    useEffect(()=>{

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
            genre:eventTag
        }
        console.log(name,detailDatas,eventDatas);
        const {data:informationData,error:informationError} = await supabase.from("introduction").update(detailDatas).eq("className",targetClass).select();
        const {data:eventData,error:eventError} = await supabase.from("contents").update(eventDatas).eq("className",targetClass).select();
        console.log(eventError);
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
        window.location.reload();
    }

    const [date, setDate] = useState(false)
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
        <div className="mt-[min(15vw,80px)]  md:mt-[13vw]  lg:mt-[min(15vw,80px)] bg-white min-h-screen">
            <div className="w-full h-[35vw] lg:h-60 relative">
                <Image src={img_tag || "/noimage.png"} alt="ヘッダー画像" fill priority className="object-cover object-center z-0 opacity-95 brightness-90"></Image>
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
                      <IoTimeOutline className="translate-y-[7%] mr-[0.5%]" />
                      <input
                        type="text"
                        value={eventTime?.[0] ?? ""}          // 初期値
                        onChange={(e) => handleEventTime(e.target.value)}
                        className="
                                outline-none bg-transparent
                                hover:underline hover:opacity-100 opacity-80
                                border-b border-[#00b2b5] focus:border-[#01e1e5]
                                caret-[#01e1e5] transition duration-200
                                        "
                      />
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
                    <Keion></Keion>
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
                        <GetFood name={name}></GetFood>
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
                            <td className="px-4 py-2">{detail[0].content}</td>
                            <td className="px-4 py-2 max-w-[20vw] whitespace-pre-wrap break-words text-[#00b2b5] text-sm lg:text-base leading-relaxed">
                                {informationContent}
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
                    
                </div>
                : <div className="py-[15vw] my-[5vw] rounded-lg bg-slate-50 mx-[4vw] lg:mx-6 lg:py-16 lg:my-0">
                    <NotReady></NotReady>
                </div>
                }
                
                <div>
                    <div>タグを編集</div>
                    <div className="flex flex-wrap gap-2">
                        {Tags.map((tag)=>{
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
                    <button onClick={upDateData}>
                        データを保存
                    </button>
                </div>
                
                <div className="my-[5vw] lg:mt-14 lg:mb-0 lg:pb-14 rounded-lg  lg:mx-6">
                    <p className={`my-[3vw] ${kaiseiDecol.className} text-[5vw] text-[darkturquoise] text-center lg:text-4xl lg:py-8 lg:my-0`}>・・・関連タグ・・・</p>
                    <div className=" flex flex-wrap mx-[3vw] justify-start lg:mx-4 ">
                        {eventTag.map((value) => (
                            <Link key={value} href={{pathname:"/viewer", query:{type:value} }}>
                                <div className={`my-[2vw] w-[25vw] aspect-[3/1] bg-gradient-to-br ${Tags.find((item) => (item.name == value))?.color} rounded-md flex mx-[2vw] opacity-90 lg:ml-0 lg:mr-6 lg:max-w-[10.5rem] lg:mb-6 lg:mt-0`}>
                                    <p className="m-auto  text-[3vw] lg:text-lg text-gray-50 font-medium">{value}</p>
                                </div>
                            </Link>    
                        ))} 
                    </div>

                </div>
            </div> 
        </div>
    )
}