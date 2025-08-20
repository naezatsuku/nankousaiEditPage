import React, { Suspense } from 'react'
import PageContainer from './PageContainer'

const page = () => {
  return (
    <Suspense>
        <PageContainer />
    </Suspense>
  )
}

export default page