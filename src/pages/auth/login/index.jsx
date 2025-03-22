import dynamic from 'next/dynamic'
import Meta from 'src/components/SEO/Meta'
const Login = dynamic(() => import('src/components/auth/Login'), { ssr: false })

const Index = () => {
  return (
    <>
      <Meta />
      <Login />
    </>
  )
}
export default Index
