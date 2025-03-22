import dynamic from 'next/dynamic'
const GroupBattle = dynamic(() => import('src/components/Quiz/GroupBattle/GroupBattle'), { ssr: false })
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Index = () => {
  return (
    <Layout>
      <GroupBattle />
    </Layout>
  )
}

export default Index