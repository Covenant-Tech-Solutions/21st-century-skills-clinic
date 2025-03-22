import dynamic from 'next/dynamic'
import Meta from 'src/components/SEO/Meta'
const ResetPassword = dynamic(() => import('src/components/auth/ResetPassword'), { ssr: false })

const Index = () => {
  return (
    <>
         <Meta />
      <ResetPassword />
    </>
  )
}

export default Index
