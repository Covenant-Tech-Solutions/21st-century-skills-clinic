import dynamic from 'next/dynamic'
const RandomBattle = dynamic(() => import('src/components/Quiz/RandomBattle/RandomBattle'), { ssr: false })
const Index = () => {
  return (
    <><RandomBattle /></>
  )
}

export default Index