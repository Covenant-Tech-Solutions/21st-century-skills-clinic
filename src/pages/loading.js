'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { RiseLoader } from 'react-spinners'

const Loading = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const loaderstyles = {
    loader: {
      textAlign: 'center',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    },
    img: {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  }

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return loading ? (
    <div>
      <div className='loader' style={loaderstyles.loader}>
        <RiseLoader className='inner_loader' style={loaderstyles.img} />
      </div>
    </div>
  ) : null
}

export default Loading
