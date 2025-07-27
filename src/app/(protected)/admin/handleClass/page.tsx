import ExplanationHandleClass from '@/app/components/admin/ExplanationHandleClass'
import HandleClass from '@/app/components/admin/HandleClass'
import React from 'react'


const Page = () => {
  return (
    <div className='pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]'>
        <ExplanationHandleClass></ExplanationHandleClass>
        <HandleClass></HandleClass>
    </div>
  )
}

export default Page