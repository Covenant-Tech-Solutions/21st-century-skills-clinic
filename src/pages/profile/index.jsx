import dynamic from 'next/dynamic'

const Profile = dynamic(() => import('src/components/Profile/ProfileData'), { ssr: false })
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const Index = () => {
  return (
    <Layout><Profile /></Layout>
  )
}

export default Index