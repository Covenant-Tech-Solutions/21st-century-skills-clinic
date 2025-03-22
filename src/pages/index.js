import Meta from 'src/components/SEO/Meta'
import dynamic from 'next/dynamic'
const Home = dynamic(() => import('./home'), { ssr: false })
const Index = () => {
  return (
    <div>
      <Meta />
      <Home />
    </div>
  )
}

export default Index
