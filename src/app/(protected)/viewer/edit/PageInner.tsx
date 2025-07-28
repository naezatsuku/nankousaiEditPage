'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import EditDetails from '@/components/edit/EditDetails'
import BackTo from '@/components/global/back_button'
import Loading from '@/components/global/parts/loading'
import NotFound from '@/components/global/parts/notFound'
import { getEditEventDetails } from './action'
import { supabase } from '@/lib/supabaseClient'
type eventData = { event:{ 
    id:number
    className:string,
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
    imageVersion:string }, 
    detail:Array<{ title:string, content:string }> }

export default function PageInner() {
  const [data, setData] = useState<eventData>()
  const params = useSearchParams()
  const name = params.get("name") ?? ""
  const router = useRouter()
  
  useEffect(() => {
    if (!name) return
    const getData = async () => {
      const result = await getEditEventDetails(name)
      if (!result || result === "failed") return
      setData(result)
    }
    getData()
  }, [name])
  useEffect(()=>{
    if(!data || !router){return}
    const handleSessionCheck = async () => {
          const { data: sessionData } = await supabase.auth.getSession()
          const user = sessionData.session?.user
          console.log(user?.id)
          if (!user) {
            router.push('/login')
            return
          }
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
          if (error || !profile?.name || !profile?.class_id) {
            console.log('プロフィール未登録または不完全', error)
            router.push('/auth/profile') 
            return
          }
          if(profile.role == "admin"){
            return console.log("adminなのでどのクラスも編集可")
          }else if(profile.role == "editor" || profile.role == "band"){
            const pTarget = profile.TargetEditClass;
            if(pTarget == data?.event.className){
              return console.log("編集担当とクラスが一致")
            }else{
              if(window.confirm("担当クラスのみしか編集できません。担当クラスを変更しますか")){
                return router.push("/auth/editRequest")
              }else{
                data?.event.className ?  router.push(`/viewer/introduction?name=${data.event.className}`) : router.push("/viewer")
                return
              }
            }
          }else{
            alert(`あなたの役職は${profile.role}です。編集権限がありません`)
            data?.event.className ?  router.push(`/viewer/introduction?name=${data.event.className}`) : router.push("/viewer")
            return
          }
        }
    
        handleSessionCheck()
  },[data,router])
  if (!name) return <NotFound text="クラスページにもとる" link="/viewer/introduction" />

  return data ? (
    <>
      <EditDetails event={data.event} detail={data.detail} name={name} />
      <BackTo link={`/viewer/introduction?name=${name}`} name={name} />
    </>
  ) : (
    <div className="pt-[35vw] lg:pt-24"><Loading /></div>
  )
}