'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import EditDetails from '@/components/edit/EditDetails'
import BackTo from '@/components/global/back_button'
import Loading from '@/components/global/parts/loading'
import NotFound from '@/components/global/parts/notFound'
import { getEditEventDetails } from './action'
type eventData = { event:{ img:string
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

  useEffect(() => {
    if (!name) return
    const getData = async () => {
      const result = await getEditEventDetails(name)
      if (!result || result === "failed") return
      setData(result)
    }
    getData()
  }, [name])

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