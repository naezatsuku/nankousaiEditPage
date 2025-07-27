"use client"
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {motion, useAnimate} from "framer-motion"
import { div } from 'framer-motion/client'
import ScrollContainer from 'react-indiana-drag-scroll'
import { KaiseiDecol } from '@/fonts'
import Link from "next/link";
import { skeleton, toBase64 } from '@/components/global/skeleton'
import { IoTimeOutline } from 'react-icons/io5'
import { MdOutlinePlace } from 'react-icons/md'
import Image from "next/image";
const kaiseiDecol = KaiseiDecol;

type content = {
    name:string;
    place:string;
    time:Array<string>;
    comment:string;
    title:string;
    available:boolean;
    img:string;
    types:Array<string>;
    tags:Array<string>;
}

const Page = () => {
  const [profile,setProfile] = useState({
    name:"",
    class_id:"",
    role:""
  })
  const [classDatasMap,setClassDatasMap] = useState<Array<any>>([]);
  //ここで各クラスのデータを整形する。これはnankousai71プロジェクトのget_event.tsxからコピー
  const formulateClassData = async ()=>{
    const {data:events} = await supabase.from('contents').select(`*` );
    

    const allEvents = events;
    console.log(allEvents)
    const eventData = []; 
    for(let i = 0; i < allEvents!.length; i++) {
        const item = allEvents![i]
        let tags:Array<string> = []
        let types:Array<string> = []
        
        const keyword = ["高校", "中学"] 
        for(let i = 0; i < keyword.length; i++) {
            if(item.className.includes(keyword[i])) {
                tags.push(keyword[i])
            }
        }
    
        if(item.className.includes("組")) {
            tags.push(item.className.slice(0, -2))
        }
        if(item.className.includes("高校3年")) {
                tags.push("フード")
        }

        if(item.type.includes("展示")) {
            tags.push("展示")
        }
        types.push(item.type);
        const genres = item.genre;
        if(!genres || genres.length == 0){
            types.push("ジャンル未指定");
            
        }else{
            console.log(item.className,item.genre)
            tags = [...tags,...item.genre];
            types = [...types,...item.genre];
    }
        if(!item.time){
            item.time = ["終日開催"]
        }else{
            item.time = item.time;
        }
 

        item.types = [...new Set(types)]
        item.tags = [...new Set(tags)]
        if(item.imageURL){
            const filePath = item.imageURL;
            const version = item.imageVersion;
            const {data}= supabase
            .storage
            .from("class-img")
            .getPublicUrl(filePath)
            const url = `${data.publicUrl}?v=${version}`;
            item.img=url;
        }else{
            item.img= null;
        }
        
        
        const {type,language, genre, create_at, ...newItem} = item

        eventData.push(newItem)
    }


    console.log("eventDataから",eventData);
    return eventData;
  }
  const router = useRouter();
    useEffect(()=>{
      const userAuth = async ()=>{
        const {data:sessionData} = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if(!user){
          console.log("user情報がない");
          return router.push("/login")
        }
        
        const { data } = await supabase
        .from('user_profiles')
        .select('name, class_id, role')
        .eq('user_id', user.id)
        .single()

        if (data) setProfile(data)

      }
    
      const getData = async ()=>{
        const classDatas = await formulateClassData();
        const new_classDatas = classDatas;
        //console.log(contents);
        const compare = (a:any,b:any) => {
            if(a.className > b.className) {
                return 1;
            } else {
                return -1
            }
    }

        new_classDatas.sort(compare);
        setClassDatasMap(new_classDatas);
      }
      userAuth()
      getData()

    },[router])
    
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
        {id:"j-2", name:"中学2年", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"j-3", name:"中学3年", color:"from-sky-400 via-blue-400 to-indigo-400"},
        {id:"h-1", name:"高校1年", color:"from-yellow-300 to-amber-400"},
        {id:"h-2", name:"高校2年", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"h-3", name:"高校3年", color:"from-sky-400 via-blue-400 to-indigo-400" },
        {id:"other", name:"その他", color:"from-sky-600 to-sky-200"},
        {id:"unclassifiedJ", name:"ジャンル未指定", color:"from-gray-400 to-gray-200"},
        {id:"unclassifiedT", name:"タイプ未指定", color:"from-gray-400 to-white-200 "}
    ]
    const [targetDiv, animateCard] = useAnimate();
    const [notfound, setNotfound] = useState(false)

    const params = useSearchParams();
    const type = params.get("type")?.toString();
    const types:Array<string> =[]; 
    let newTag:Array<{id:string, name:string, color:string}> = [];

    if(type!= undefined){
        
        types.push(type);

        const find_tag = Tags.find((value)=>value.name==type);
        if(find_tag){
            newTag.push(find_tag);
            const others = Tags.filter((value)=>value.name != type);
            others.forEach((value)=>newTag.push(value))
        }
    }else{
        newTag = Tags;
    }
    const [allTags,setAllTags] = useState<Array<{id:string,name:string,color:string}>>(newTag);

    const [selected, setSelected] = useState<Array<string>>(types)
    
    //tagに対応するカードをセット
    const selectCard = (newData:Array<string>) => {
        
        if(newData.length == 0) {
            console.log("タグ無し")
            return classDatasMap;
        } else {
            const find_tag = (item:any) => {
                const tags = item.tags
                for(let i =0; i < tags.length; i++) {
                    if(newData.includes(tags[i])) {
                        return true
                    }
                }
    
                return false
            }
    
            const found = classDatasMap.filter(find_tag)
    
            return found
        }
    }
    //typeからtagを取得
    //initContentをけし、UseEffectで管理
    const [selected_card, setSelectCard] = useState<Array<any>>([]);
    useEffect(() => {
        if (classDatasMap.length > 0) {
            const filtered = selectCard(selected);
            setSelectCard(filtered);
            setNotfound(filtered.length === 0);
            }
        }, [classDatasMap, selected]);


    const clearTag = () => {
        const newArray:any = []
        setSelected(newArray)
        const selectedCard = selectCard(newArray)
        setSelectCard(selectedCard)
        animateCard(targetDiv.current, {y:[10, 0], opacity:[0, 1]}, {ease:"easeOut", duration:0.8, times:[0.001, 0.6]})
    }
    const tagButtonChange = (e:any) => {
        // let nullOrNot = false
        let newData:Array<string> = []

        if(e.target.checked) {
            const newArray = selected
            newArray.push(e.target.value)
            setSelected(newArray)
            newData = newArray 
            // console.log(newData) 
        } else {
            const newArray =selected.filter((tag:any) => tag != e.target.value)//どんどん絞っていっている。
            // if(newArray.length ==0) {
            //     nullOrNot = true
            // } 
            setSelected(newArray)
            newData = newArray
            // console.log(newData)
        }
        // alert(selected[0])

        const selectedData = selectCard(newData)//falseが帰ってくるときはnewData
    
        setSelectCard(selectedData)
        
         //console.log("取得展示数："+selectedData.length)
        if(selectedData.length == 0) {
            setNotfound(true)
        } else {
            setNotfound(false)
        }
        //?
        animateCard(targetDiv.current, {y:[10, 0], opacity:[0, 1]}, {ease:"easeOut", duration:0.8, times:[0.001, 0.6]})
    } 
    const miniTagClicked = (e:string) => {
        if (!Tags.some(item => item.name === e)) {
          console.log("オリジナルタグです", e);
          return //いずれクラスオリジナルのみ表示させるかな
        }

        const newArray = [e]
        const find_tag = Tags.find((value) => value.name == e)
        const otherTags = Tags.filter(value => value.name != e)
        const newTagArray:any = [ find_tag, ...otherTags]

        setAllTags(newTagArray)
        setSelected(newArray)
        const selectedCard = selectCard(newArray)
        setSelectCard(selectedCard)
        animateCard(targetDiv.current, {y:[10, 0], opacity:[0, 1]}, {ease:"easeOut", duration:0.8, times:[0.001, 0.6]})
    }
    const find_cardIndex = (target:content) => {
        if (selected_card.includes(target) == false) {
            
            return 0
        }
        const index = selected_card.findIndex((item:any) => item == target)
        
        return index
    }
    const setTextColor = (e:any) => {
        let result = ""


        if(e.includes("フード")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-orange-400 via-orange-400 to-yellow-400"
            return result
        }
        
        if(e.includes("ライブ")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-purple-300 via-fuchsia-400 to-pink-400"
            return result
        }

        if(e.includes("パフォーマンス")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-blue-500 via-sky-300 to-sky-200"
            return result
        }

        if(e.includes("アトラクション")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-red-300 via-purple-400 to-blue-500"
            return result
        }

        if(e.includes("体験")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-green-500 via-teal-400 to-cyan-500"
            return result
        }

        if(e.includes("休憩")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-cyan-500 to-yellow-300"
            return result
        }

        if(e.includes("PTA")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-yellow-400 via-lime-400 to-green-400"
            return result
        }

        if(e.includes("クラス展示") || e.includes("部活動展示")){
            result = "bg-gradient-to-br bg-clip-text text-transparent from-blue-500 via-indigo-500 to-purple-500"
            return result
        }

        if(result == "") {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-sky-600 to-sky-100 "
        } 

        return result
    }
    const text_size = (length:number) => {
        if(length < 10) {
            return "text-[5vw]"
        } else if (length < 18) {
            return "text-[4.5vw]"
        } else {
            return "text-[4vw]"
        }
    }

    //ここから下はcss用
    const variant_tag = {
        selected:{bottom:"0.7vw" },
        notSelected:{bottom:0}
    }
    const variant_tag_bg = {
        selected:{opacity:0},
        notoSelected:{opacity:1},
    }
  return (
    <div className="pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
        <div>
            <ScrollContainer>
                <div className='flex mt-[5vw] lg:mt-8 lg:mx-6'>
                    {allTags.map((value:any)=>(
                        <motion.div key = {value.id} 
                        className={`flex-shrink-0 drop-shadow-lg relative  cursor-pointer  rounded-lg mx-[2vw] lg:mx-3 bg-gradient-to-br p-[0.5%] ${value.color} h-[10vw] lg:h-12 lg:p-[2px] inline-block ` } 
                        variants={variant_tag}
                        animate={selected.includes(value.name) == true ? "selected" : "notoSelected"} 
                        transition={{ease:"easeInOut", duration:0.1}}>    
                            <input 
                                    id={value.id}
                                    value={value.name} 
                                    type="checkbox"
                                    onChange={tagButtonChange}
                                    checked={selected.includes(value.name)}
                                    className="hidden"
                                />
                                <label 
                                    htmlFor={value.id}
                                    className={`text-[4vw] lg:text-lg
                                    font-medium cursor-pointer flex h-full relative`}
                                >
                                    <motion.div variants={variant_tag_bg}
                                     animate={selected.includes(value.name) == true ? "selected" : "notoSelected"} transition={{ease:"easeOut", duration:0.1}} className={`z-0 bg-white absolute rounded-md h-full w-full `}></motion.div>
                                    <p className={`px-[4vw] lg:px-6 my-auto  z-[5]
                                     ${selected.includes(value.name) == true && "text-white font-light"} bg-gradient-to-br text-transparent bg-clip-text ${value.color} `}>
                                        {value.name}
                                    </p>
                                </label>
                        </motion.div>
                    ))}
                </div>
            </ScrollContainer>
            <div className="w-full flex">
                    <p className="cursor-pointer inline-block mx-auto drop-shadow px-[4vw] py-[1vw] rounded-lg bg-slate-100 text-[2.5vw] text-gray-500 mt-[4vw] lg:text-base lg:mt-8 lg:py-1 lg:px-10" onClick={() => {clearTag()}}>選択済みのタグをクリア</p>
                </div>
        </div>
        {/* <div>
                {selected.map((value) => (
                    <p>{value}</p>
                ))}
            </div> */}
        <motion.div className={`  bg-white pb-[10vw] lg:flex flex-wrap justify-around`} ref={targetDiv}>
                {notfound == true && 
                    <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{ease:"easeOut", duration:0.4}} className="w-full h-[35vw] flex">
                        <p className={`${kaiseiDecol.className} m-auto text-[7vw] bg-gradient-to-br from-fuchsia-500 via-purple-400 to-sky-400 bg-clip-text text-transparent `}>・・・該当なし・・・</p>
                    </motion.div>
                }

                {selected_card.map((value:any, index:number) => (
                    
                    <motion.div  key={find_cardIndex(value)} className="w-full max-w-full h-[36vw] mt-[8vw] mx-[4vw]  lg:mt-10 bg-slate-100  flex justify-between p-[0.2vw] opacity-90 drop-shadow rounded-lg lg:w-[47%] lg:max-w-[580px] lg:h-auto lg:mx-0 lg:aspect-[2.4/1] lg:mb-4 lg:p-[1px]"
                    initial={{y:20, opacity:0}} animate={selected_card.includes(value)? {y:0, opacity:1} : {y:20, opacity:0}} transition={{ease:"easeOut", duration:0.4, delay:find_cardIndex(value) * 0.05}}>
                        <div className="w-full h-full rounded-md bg-white flex">
                            <div className="flex-grow rounded-l-md pl-[2vw] pr-[1vw] my-[2vw] flex flex-col justify-around lg:my-3 lg:pl-4 lg:pr-2">
                                {/* <Link href={{pathname:"/event/introduction", query:{name:value.name}}} className="relative lg:hidden" replace>
                                    <motion.div onHoverStart={e => setHover(value.name)} onHoverEnd={e => setHover("")}>
                                        <p className={`${setTextColor(value.tags)} pl-[0.5vw] text-[2.5vw] lg:text-xs lg:pl-0 font-normal`}>{value.name}</p>
                                        <p className={`${setTextColor(value.tags)} font-medium  mb-[2.5%] lg:mt-1 lg:mb-0 lg:text-xl ${value.title.length < 11 ? "text-[4.8vw] mt-[1%]" : "text-[4vw] mt-[1.2%]"} leading-[130%]`}>{value.title}</p>
                                    </motion.div> 
                                </Link> */}
                                <Link href={{pathname:"/viewer/introduction", query:{name:value.className}}} className="">
                                    <p className={`${setTextColor(value.tags)} pl-[0.5vw] text-[2.5vw] lg:text-xs xl:text-lg lg:pl-0 font-normal`}>{value.className}</p>
                                </Link>
                                <Link href={{pathname:"/viewer/introduction", query:{name:value.className}}} className="">
                                    <p className={`${setTextColor(value.tags)} font-medium ${text_size(value.title.length)} bottom-[0.5vw] lg:mb-0 lg:text-2xl xl:text-3xl lg:h-[120%] relative lg:bottom-1
                                    `}>{value.title}</p>
                                </Link>
                                <div className='font-medium text-[2.5vw] leading-[160%] lg:text-sm flex text-nowrap '>
                                    <span>現在の待ち時間??分</span>
                                </div>
                                <div>
                                    <span className={`font-medium text-[2.5vw] leading-[160%] lg:text-sm flex text-nowrap `}>前回比??分</span>
                                </div>
                                
                                <div className="text-[2.5vw] leading-[160%] lg:text-sm flex text-nowrap ">
                                    <p className="flex items-center">
                                        <MdOutlinePlace className="translate-y-[2%] mr-[0.5%]"/>
                                        {value.place}    
                                    </p>
                                    <p className="flex items-center mx-4">
                                        <IoTimeOutline className=" translate-y-[7%] mr-[0.5%]" />
                                        {value.time[0]} {value.time.length > 1 && ` ...`}
                                    </p>
                                    
                                </div>
                                
                                    <div>
                                    <ScrollContainer vertical={false} className={`w-full flex flex-nowrap overflow-x-auto lg:my-0 `}>
                                        {value.types.map((type:string, idx:number) => (
                                    <div
                                        key={`${type}-${idx}`}
                                        className={`w-1/3 flex-shrink-0 mr-[5%] aspect-[3.3/1] bg-gradient-to-br ${
                                          Tags.find((item) => item.name === type)?.color ??
                                          "bg-gradient-to-r from-pink-500 to-pink-300"
                                        }  text-white  rounded-md flex items-center justify-center opacity-90 cursor-pointer active:scale-95 transition-transform duration-200 hover:opacity-100`}
                                        onClick={() => miniTagClicked(type)}
                                    >
                                        <p className="m-auto text-[2vw] lg:text-xs text-gray-50 font-medium">{type}</p>
                                    </div>
                                  ))}
                                    </ScrollContainer>
                                  

                                </div>
                                
                                
                            </div>
                            <Link href={{pathname:"/viewer/introduction", query:{name:value.className}}} replace>
                                <div className="h-full aspect-square border-l-2 border-gray-50">
                                    {value.img==null ?
                                        <Image placeholder={`data:image/svg+xml;base64,${toBase64(skeleton(128, 160))}`} src={"/1725741490270.jpg"} alt="展示イラスト" width={1000} height={1000} className=" h-full w-full rounded-r-md object-cover"></Image >
                                    :
                                        <Image placeholder={`data:image/svg+xml;base64,${toBase64(skeleton(128, 160))}`} src={value.img} alt="展示イラスト" width={1000} height={1000} className=" h-full w-full rounded-r-md object-cover"></Image >
                                    }
                                    
                                </div>
                            </Link>
                            
                        </div>
                        
                    </motion.div>
                ))}
                <div className="hidden lg:flex mx-[4vw] h-1 mt-[8vw] lg:mt-10  justify-between p-[0.2vw] opacity-90 drop-shadow rounded-lg lg:w-[47%] lg:max-w-[580px] lg:h-auto lg:mx-0  lg:mb-4 lg:p-[1px]"></div>
                <div className="hidden 2xl:flex mx-[4vw] h-1 mt-[8vw] lg:mt-10  justify-between p-[0.2vw] opacity-90 drop-shadow rounded-lg lg:w-[47%] lg:max-w-[580px] lg:h-auto lg:mx-0 lg:mb-4 lg:p-[1px]"></div>
            </motion.div>
    </div>
  )
}

export default Page