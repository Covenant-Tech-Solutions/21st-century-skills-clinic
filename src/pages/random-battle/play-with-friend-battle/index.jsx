import dynamic from 'next/dynamic'
const PlayWithFriendBattle = dynamic(() => import('src/components/Quiz/RandomBattle/PlayWithFriendBattle'), { ssr: false })
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Index = () => {
  return (
    <Layout><PlayWithFriendBattle /></Layout>
  )
}

export default Index