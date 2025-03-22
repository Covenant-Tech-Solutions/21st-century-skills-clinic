'use client'
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'
import { FaRegBell } from 'react-icons/fa'
import { withTranslation, useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Tooltip } from 'react-tooltip'
import { IoExitOutline } from 'react-icons/io5'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  loadLanguages,
  selectCurrentLanguage,
  selectLanguages,
  setCurrentLanguage
} from 'src/store/reducers/languageSlice'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import FirebaseData from 'src/utils/Firebase'
import { imgError, isLogin } from 'src/utils'
import { logout } from 'src/store/reducers/userSlice'
import img6 from "../../../public/images/profileimages/6.svg"
import warningImg from '../../assets/images/logout.svg'
import noNotificationImg from '../../assets/images/notification.svg'
import { websettingsData } from 'src/store/reducers/webSettings'
import { loadNotification, notifiationTotal, notificationData, updateTotal } from 'src/store/reducers/notificationSlice'
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getNotificationsApi } from 'src/utils/api'
import useSWR from 'swr'
import { notificationApi } from 'src/hooks/notificationsApi'
import moment from 'moment'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { tabItems as profileTabItems } from 'src/components/Profile/LeftTabProfile'

const MySwal = withReactContent(Swal)

const TopHeader = ({ t }) => {

  const dispatch = useDispatch()

  const { auth } = FirebaseData()

  const router = useRouter()

  const { i18n } = useTranslation()

  const languages = useSelector(selectLanguages)

  const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE

  const selectcurrentLanguage = useSelector(selectCurrentLanguage)

  // store data get

  const websettingsdata = useSelector(websettingsData);

  const userData = useSelector(state => state.User)

  const notification = useSelector(notificationData)

  const notificationtotal = useSelector(notifiationTotal)

  const systemconfig = useSelector(sysConfigdata)

  //notification
  const [notificationmodal, setNotificationModal] = useState(false)

  const [logoutModal, setLogoutModal] = useState(false)

  const [guestlogout, setGuestLogout] = useState(false)

  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  // language change
  const languageChange = async (name, code, id) => {
    setCurrentLanguage(name, code, id)
    await i18n.changeLanguage(code)
  }

  useEffect(() => {
    if (websettingsdata && websettingsdata?.rtl_support === "1") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [websettingsdata?.rtl_support]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
        }
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      })
    }
  }

  //api render
  useEffect(() => {
    if (router.pathname === "/") {
      loadLanguages(
        '',
        response => {
          if (selectcurrentLanguage.code == null) {
            let index = response.data.filter(data => {
              if (data.code == defaultLanguage) {
                return { code: data.code, name: data.name, id: data.id }
              }
            })
            setCurrentLanguage(index[0].language, index[0].code, index[0].id)
          }
        },
        error => {
          toast.error(error)
        }
      )
    }
  }, [router,selectcurrentLanguage])

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (isLogin()) {
      if (router.pathname === "/" || router.pathname === "/all-games") {
        loadNotification({
          order: "DESC", offset: offset, limit: limit, onSuccess: (res) => {
            let response = res.total
            dispatch(updateTotal(response))
          }, onError: (error) => {
            if (error === "102") {
              dispatch(updateTotal(0))
            }
            console.log(error)
          }
        })
      }
    }
  }, [limit])

  // const isFetchNotif = router.pathname === "/" || router.pathname === "/all-games"
  // const fetchNotifications = async () => {
  //   try {
  //     console.log('hi')
  //     const res = await notificationApi.getNotificationsApi('DESC', offset, limit)
  //     const response = res.total
  //     dispatch(updateTotal(response))
  //   } catch (error) {

  //     if (error === "102") {
  //       dispatch(updateTotal(0))
  //     }
  //     console.log(error);
  //     throw error;
  //   }
  // }

  // const { data: notificationsData, error: notificationError } = useSWR(isFetchNotif ? ['notifications', limit] : null, fetchNotifications, {
  //   refreshInterval: 0,
  //   revalidateOnMount: true,
  //   revalidateOnFocus: false,
  // });


  // sign out
  const handleSignout = () => {
    setLogoutModal(true)

  }

  const handleConfirmLogout = () => {
    logout()
    auth.signOut()
    router.push('/')
    setLogoutModal(false)
  }

  // check user data for username
  let userName = ''

  const checkUserData = userData => {
    if (userData?.data && userData?.data?.name != '') {
      return (userName = userData?.data?.name)
    } else if (userData?.data && userData?.data?.email != '') {
      return (userName = userData?.data?.email)
    } else {
      return (userName = userData?.data?.mobile)
    }
  }

  // guest logout
  const guestLogout = e => {
    e.preventDefault()
    setGuestLogout(true)
    router.push('/auth/login')
  }

  // profile image logout
  const profileGuest = e => {
    e.preventDefault()
    MySwal.fire({
      text: t('To access this feature you need to Login!!'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: t('Cancel'),
      customClass: {
        confirmButton: 'Swal-confirm-buttons',
        cancelButton: "Swal-cancel-buttons"
      },
      confirmButtonText: t("Login"),
      allowOutsideClick: false
    }).then(result => {
      if (result.isConfirmed) {
        guestLogout(e)
      }
    })
  }

  // notification tooltip leave on mouse
  const handleMouseLeave = () => {
    const tooltipElement = document.querySelector('[data-tooltip-id="custom-my-tooltip"]')
    if (tooltipElement) {
      tooltipElement.removeAttribute('data-tooltip-content')
    }
  }

  // notification tooltip enter on mouse
  const handleMouserEnter = () => {
    const tooltipElement = document.querySelector('[data-tooltip-id="custom-my-tooltip"]')
    if (tooltipElement) {
      tooltipElement.setAttribute('data-tooltip-content', `${t('Notification')}`)
    }
  }

  const menu = (
    <Menu>
      {languages && languages.map((data) => (
        <Menu.Item key={data.id} onClick={() => languageChange(data.language, data.code, data.id)}>
          {data.language}
        </Menu.Item>
      ))}
    </Menu>
  );

  const tabItems = profileTabItems ? profileTabItems.map(item => ({
    ...item,
    action: item.action ? item.action : () => router.push(item.path)
  })) : [];

  const profileMenu = (
    <Menu>
      <Menu.Item onClick={() => router.push('/profile')}>
        {t('Profile')}
      </Menu.Item>
      <Menu.Item onClick={handleSignout}>
        {t('Logout')}
      </Menu.Item>
      {tabItems.map((item, index) => (
        item.condition !== false && (
          <Menu.Item key={index} onClick={item.action}>
            {t(item.label)}
          </Menu.Item>
        )
      ))}
    </Menu>
  );

  const handleMoreNotifications = (e) => {
    e.preventDefault()
    setOffset((prevOffset) => prevOffset + limit);
    setLimit((prevLimit) => prevLimit + 10);

  }
  return (
    <React.Fragment>
      <div className='small__top__header'>
        <div className="container">
          <div className='row justify-content-between align-items-center'>
            <div className='col-md-6 col-12'>
              {systemconfig && systemconfig.language_mode === '1' && router.pathname === "/" ? (
                <div className='dropdown__language'>
                  <Dropdown trigger={['hover']} overlay={menu} >
                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                      {selectcurrentLanguage && selectcurrentLanguage.name
                        ? selectcurrentLanguage.name
                        : 'Select Language'}
                      <DownOutlined />
                    </a>
                  </Dropdown>
                </div>
              ) : (
                ''
              )}
            </div>

            <div className='col-md-6 col-12'>
              <div className='top_header_right'>
                <div className='login__sign__form'>
                  {isLogin() && checkUserData(userData) ? (
                    <Dropdown trigger={['hover']} overlay={profileMenu} >
                      <a className="dropdown__login profile_dropdown" onClick={(e) => e.preventDefault()}>
                        {`${t('hello')} ${userName}`}
                        <DownOutlined />
                      </a>
                    </Dropdown>
                  ) : (
                    <div>
                      {!guestlogout ? (
                        <div className='right_guest_profile'>
                          <img
                            className='profile_image'
                            onClick={e => profileGuest(e)}
                            src={img6.src}
                            alt='profile'
                          />
                          <button id='dropdown-basic-button' className='btn btn-primary dropdown__login'>{`${t('Hello Guest')}`}</button>
                          <button className='btn btn-primary custom_button_right ms-2' onClick={e => guestLogout(e)}>
                            <IoExitOutline />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>
                            <Link href='/auth/login' className='login'>
                              {t('Login')}
                            </Link>
                          </span>
                          <span>
                            <Link href='/auth/sign-up' className='signup'>
                              {t('Sign Up')}
                            </Link>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className='notification'>
                  {isLogin() ? (
                    <Button
                      className='notify_btn btn-primary'
                      onClick={() => setNotificationModal(true)}
                      onMouseEnter={handleMouserEnter}
                      onMouseLeave={handleMouseLeave}
                      data-tooltip-id='custom-my-tooltip'
                    >
                      <span className='notification_badges'>{notification ? notification?.data?.length : '0'}</span>
                      <FaRegBell />
                    </Button>
                  ) : (
                    ''
                  )}
                  <Modal
                    title={t('Notification')}
                    width={800}
                    centered
                    visible={notificationmodal}
                    onOk={() => setNotificationModal(false)}
                    onCancel={() => setNotificationModal(false)}
                    footer={null}
                    className='custom_modal_notify notification'
                  >
                    {notification?.data?.length ? (
                      notification?.data.map((data, key) => {
                        return (
                          <div key={key} className='outer_noti'>
                            <img
                              className='noti_image'
                              src={data.image ? data.image : '/images/user.svg'}
                              alt='notication'
                              id='image'
                              onError={imgError}
                            />
                            <div className='noti_desc'>
                              <p className='noti_title'>{data.title}</p>
                              <p>{data.message}</p>
                              <span>{data.date_sent}</span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="noDataDiv">
                        <img src={noNotificationImg.src} alt="" />
                        {/* <h5 className='text-center text-black-50'>
                        {t('No Data found')}</h5> */}
                      </div>
                    )}
                    {notificationtotal && notificationtotal > 10 ? (
                      <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={(e) => handleMoreNotifications(e)}>
                          {t("More")}
                        </button>
                      </div>
                    ) : null}
                  </Modal>
                </div>
                <div className="darkmode ps-2">
                  <ThemeToggle />
                </div>
                {showInstallPrompt && (
                  <Button className='install-btn' onClick={handleInstallClick}>
                    {t('Install App')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id='custom-my-tooltip' />
      <Modal
        maskClosable={false}
        centered
        visible={logoutModal}
        onOk={() => setLogoutModal(false)}
        onCancel={() => {
          setLogoutModal(false)
        }}
        footer={null}
        className='logoutModal'
      >
        <div className="logoutWrapper">
          <span><img src={warningImg.src} alt="" /></span>
          <span className='headline'>{t("Logout!")}</span>
          <span className='confirmMsg'>{t("Are you sure you want to")}</span>
        </div>

        <div className="logoutBtns">
          <span className='yes' onClick={handleConfirmLogout}>{t("Yes,Logout")}</span>
          <span className='no' onClick={() => setLogoutModal(false)}>{t("Keep Login")}</span>
        </div>
      </Modal>
    </React.Fragment>
  )
}
export default withTranslation()(TopHeader)
