"use client"
import ShowDetails from "@/components/introduction/showDetails"
import { useSearchParams } from "next/navigation"

import { useEffect } from "react"
import { useState } from "react"
import BackTo from "@/components/global/back_button"
import Loading from "@/components/global/parts/loading"
import NotFound from "@/components/global/parts/notFound"

import { KaiseiDecol } from "@/fonts";
import Link from "next/link"
import EditDetails from "@/components/edit/EditDetails";
import { getEditEventDetails } from "./action"

const kaiseiDecol = KaiseiDecol

type eventData = {
    event:{
        img:string
        title:string,
        comment:string,
        place:string,
        time:Array<string>,
        type:string,
        tags:Array<string>,
        available:boolean,
        imageBackURL: string,
        imageURL: string,
        imageVersion:string
    },
    detail:Array<{
        title:string,
        content:string
    }>
}

export default function Page() {
    const [data, setData] = useState<eventData>()

    const params = useSearchParams()
    const name = params.get("name")?.toString()
    
    useEffect(() => {
        if(name == undefined) {
            return
        }
        console.log("hello")
        const getData = async () => {
            
            const result = await getEditEventDetails(name);
            console.log(result);
            if(result == null || result == "failed") {
                return
            }
            setData(result)
        }
        
        getData()
    },[name])

    const jsonLd = {
        "@context": "http://schema.org",
        "@type": "Event",
        "name": "南高祭",
        "startDate": "2024-09-07T09:30",
        "location": {
          "@type": "Place",
          "name": "横浜市立南高等学校・附属中学校",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "神奈川県",
            "addressLocality": "横浜市",
            "streetAddress": "港南区東永谷2丁目1-1"
              }
        },
        "description": `${name}のイベントの詳細を確認できます。( ˙ ˙ *)`,
        "image": [
          "https://drive.google.com/file/d/137obuAzNIB6r-501h6D0-6SoFgLnqXd3/view?usp=drive_link"
        ],
      };

    return(
        <div className="h-screen bg-white">
            {name?
            <div className="w-full">
                <title>{name} | 第71回南高祭・展示の部2024</title>
                {data? 
                <div>
                    <EditDetails event={data.event} detail={data.detail} name={name}></EditDetails>
                    <BackTo link={`/viewer/introduction?name=${name}`} name={name}></BackTo>
                    
                </div>  
                :
                <div className="pt-[35vw] lg:pt-24 ">
                    <Loading></Loading>
                    {/* <p className={`text-[5vw] ${kaiseiDecol.className} text-center bg-gradient-to-br from-fuchsia-500 via-purple-400 to-sky-400 bg-clip-text text-transparent`}>・・・読み込み中・・・</p> */}
                </div>
                
                }
            </div>
            : <NotFound text="クラスページにもとる" link={`/viewer/introduction?name=${name}`}></NotFound>
            }
            
        </div>
    )
}