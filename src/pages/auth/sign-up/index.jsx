import dynamic from 'next/dynamic'
import Meta from 'src/components/SEO/Meta'
const Signup = dynamic(() => import('src/components/auth/Signup'), { ssr: false })

const Index = () => {

  return (
    <>
         <Meta />
      <Signup />
    </>
  )
}
export default Index
