"use client"

import dynamic from "next/dynamic"
const Statatics = dynamic(() => import('src/components/Profile/Statatics'), { ssr: false })

const Index = () => {
  return (
    <div>
      <Statatics/>
    </div>
  )
}

export default Index