'use client'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadWebSettingsDataApi, websettingsData } from 'src/store/reducers/webSettings'
import { settingsLoaded, sysConfigdata, systemconfigApi } from "src/store/reducers/settingsSlice";
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { RiseLoader } from 'react-spinners'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Suspense } from 'react';
import Link from 'next/link'
import Meta from '../SEO/Meta';
import { homeUpdateLanguage, loadHome } from 'src/store/reducers/homeSlice';
import { FaBrain, FaGamepad, FaTachometerAlt, FaWallet } from 'react-icons/fa';

const TopHeader = dynamic(() => import('../NavBar/TopHeader'), { ssr: false })
const Header = dynamic(() => import('./Header'), { ssr: false })
const Footer = dynamic(() => import('./Footer'), { ssr: false })

const Layout = ({ children }) => {

  const { i18n } = useTranslation()

  const router = useRouter()

  const [redirect, setRedirect] = useState(false)
  const [isPlayingGame, setIsPlayingGame] = useState(false)

  const selectcurrentLanguage = useSelector(selectCurrentLanguage)

  const webSettings = useSelector(websettingsData)

  const dispatch = useDispatch();


  useEffect(() => {
    loadHome({
      onSuccess: response => {
        dispatch(homeUpdateLanguage(selectcurrentLanguage.id))
      },
      onError: error => {
        dispatch(homeUpdateLanguage(""))
        console.log(error)
      }
    })

  }, [selectcurrentLanguage])

  // all settings data
  useEffect(() => {

    settingsLoaded("")

    LoadWebSettingsDataApi(
      () => { },
      () => { }
    )

    systemconfigApi(
      success => { },
      error => {
        console.log(error)
      }
    )

    i18n.changeLanguage(selectcurrentLanguage.code)

  }, [])

  

  // Maintainance Mode
  const getsysData = useSelector(sysConfigdata)

  useEffect(() => {
    if (getsysData && getsysData.app_maintenance === '1') {
      setRedirect(true)
    } else {
      setRedirect(false)
    }
  }, [getsysData?.app_maintenance])

  // loader
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

  // Function to handle navigation to maintenance page
  const handleMaintenanceRedirect = () => {
    router.push('/maintenance')
  }

  useEffect(() => {
    if (redirect) {
      handleMaintenanceRedirect() // Trigger the navigation outside the JSX
    }
  }, [redirect])

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', webSettings && webSettings?.primary_color)
    document.documentElement.style.setProperty('--secondary-color', webSettings && webSettings?.footer_color)
  }, [webSettings])

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url.includes('/game')) {
        setIsPlayingGame(true)
      } else {
        setIsPlayingGame(false)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  if (typeof window === 'undefined') {
    return null
  }

  return (
    typeof webSettings === 'object' ?
      <>
        <Meta />

        <TopHeader />
        <Header />
        {children}
        <Footer />
        {!isPlayingGame && (
          <div className="bottom-nav">
            <Link href="/all-games">
              <FaBrain size={24} />
              <br />
              <span>Earn</span>
            </Link>
            <Link href="/home">
              <FaTachometerAlt size={24} />
              <br />
              <span>Home</span>
            </Link>
            <Link href='/profile/wallet'>
                <FaWallet size={24} />
                <br />
                <span>Wallet</span>
            </Link>
          </div>
        )}
        <style jsx>{`
          .bottom-nav {
            position: fixed;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: space-around;
            background: var(--primary-color);
            padding: 10px 0;
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;
            z-index: 999 !important;
          }
          .bottom-nav a {
            color: #fff;
            text-align: center;
            text-decoration: none;
            flex: 1;
          }
          .bottom-nav a span {
            display: block;
            font-size: 0.75rem;
          }
        `}</style>
      </>
      : <Suspense fallback>
        <div className='loader' style={loaderstyles.loader}>
          <RiseLoader className='inner_loader' style={loaderstyles.img} />
        </div>
      </Suspense>
  )
}
export default Layout
