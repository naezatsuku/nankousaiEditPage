"use server"

import { serverClient } from "@/supabase/server"

export async function getEditEventDetails(name:string) {
    const supabase = await serverClient()

    const {data:event} = await supabase.from('contents').select(`*` );

    

    const allEvents = event

    if(allEvents == null) {
        
        return "failed"
    }

    const newContent = allEvents?.find((value) => (
        value.className == name
    ))

     //console.log(newContent)

    const {data:detail} = await supabase.from('introduction').select(`title, content`).eq("className", name)
    
    let details:any = []

    if(detail == null) {
        if(newContent != null) {
            details = [{title:"何か", content:"テキストテキスト"}]     
        } else {
            return "failed"
        }
    } else {
        details = detail
    }

    const newEvent = newContent
    
    if(!newEvent.time){
        newEvent.time=["終日開催"]
    }
    if(newContent.time == null) {   
        newEvent.time = ["終日開催"] 
    } else {
        newEvent.time = newEvent.time;
    }
   
    let tags:Array<string> = []
    
    if(!newEvent?.genre){
        
    }else{
        tags = newEvent.genre;
    }
    newEvent.tags = tags
    
    // console.log(tags)
    //ここにURLを作る新しく作ったimgにそれを保存これは背景のがぞうのURLです
    if(newEvent.imageBackURL){
            const filePath = newEvent.imageBackURL;
            const version = newEvent.imageVersion;
            const {data}= supabase
            .storage
            .from("class-img")
            .getPublicUrl(filePath)
            const url = `${data.publicUrl}?v=${version}`;
            newEvent.img=url;
            console.log(newEvent.img)
        }else{
            newEvent.img= "/NOIMAGE.png";
        }

    const result = {
        event:newEvent, detail:details
    }
    
    return result
}
