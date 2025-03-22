import dynamic from 'next/dynamic'
import Meta from 'src/components/SEO/Meta'
const OtpVerify = dynamic(() => import('src/components/auth/OtpVerify'), { ssr: false })

const Index = () => {
  return (
    <>
         <Meta />
      <OtpVerify />
    </>
  )
}

export default Index
