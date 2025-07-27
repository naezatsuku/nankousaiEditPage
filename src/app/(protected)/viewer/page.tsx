import { Suspense } from 'react'
import PageInner from './InnerPage'
import Loading from '@/components/global/parts/loading'

export default function Page() {
  return (
    <div className="h-screen bg-white">
      <Suspense fallback={<div className="pt-[35vw] lg:pt-24"><Loading /></div>}>
        <PageInner />
      </Suspense>
    </div>
  )
}
