'use client'
import React, { useEffect, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { useTranslation, withTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux'
import { IoExitOutline } from 'react-icons/io5'
import Link from 'next/link'
import { selectCurrentLanguage, selectLanguages, setCurrentLanguage } from 'src/store/reducers/languageSlice'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import FirebaseData from 'src/utils/Firebase'
import menu_data from './menu-data'
import { useRouter } from 'next/navigation'
import { getClosest, getSiblings, imgError, isLogin, slideToggle, slideUp } from 'src/utils'
import img6 from "../../../../public/images/profileimages/6.svg"
import { Modal, Button } from 'antd'
import { FaRegBell } from 'react-icons/fa'
import noNotificationImg from '../../../assets/images/notification.svg'
import { logout } from 'src/store/reducers/userSlice'
import { notificationData } from 'src/store/reducers/notificationSlice'
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const MySwal = withReactContent(Swal)

const MobileMenus = ({ t, setIsActive }) => {
  const navigate = useRouter()
  const [navTitle, setNavTitle] = useState('')
  const [notificationmodal, setNotificationModal] = useState(false)
  //openMobileMenu
  const openMobileMenu = menu => {
    if (navTitle === menu) {
      setNavTitle('')
    } else {
      setNavTitle(menu)
    }
  }

  const firebase = FirebaseData()
  const { i18n } = useTranslation()

  const userData = useSelector(state => state.User)
  const languages = useSelector(selectLanguages)
  const systemconfig = useSelector(sysConfigdata)
  const selectcurrentLanguage = useSelector(selectCurrentLanguage)
  const [guestlogout, setGuestLogout] = useState(false)
  const notification = useSelector(notificationData)

  const handleSignout = () => {
    MySwal.fire({
      title: t('Logout!'),
      text: t('Are you sure'),
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'Swal-confirm-buttons',
        cancelButton: "Swal-cancel-buttons"
      },
      confirmButtonText: t('Logout')
    }).then(result => {
      if (result.isConfirmed) {
        logout()
        firebase.auth.signOut()
        navigate.push('/')
      }
    })
  }

  const onClickHandler = e => {
    // clickOutside(noClose)
    const target = e.currentTarget
    const parentEl = target.parentElement
    if (parentEl?.classList.contains('menu-toggle') || target.classList.contains('menu-toggle')) {
      const element = target.classList.contains('icon') ? parentEl : target
      const parent = getClosest(element, 'li')
      const childNodes = parent.childNodes
      const parentSiblings = getSiblings(parent)
      parentSiblings.forEach(sibling => {
        const sibChildNodes = sibling.childNodes
        sibChildNodes.forEach(child => {
          if (child.nodeName === 'UL') {
            slideUp(child, 1000)
          }
        })
      })
      childNodes.forEach(child => {
        if (child.nodeName === 'UL') {
          slideToggle(child, 1000)
        }
      })
    }
  }

  const languageChange = async (name, code, id) => {
    setCurrentLanguage(name, code, id)
    await i18n.changeLanguage(code)
  }

  // initial username
  let userName = ''

  const checkUserData = userData => {
    if (userData?.data && userData?.data?.name !== '') {
      return (userName = userData?.data?.name)
    } else if (userData?.data && userData?.data?.email !== '') {
      return (userName = userData?.data?.email)
    } else {
      return (userName = userData?.data?.mobile)
    }
  }

  // guest logout
  const guestLogout = e => {
    e.preventDefault()
    setGuestLogout(true)
    navigate.push('/auth/login')
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


  const menu = (
    <Menu>
      {languages && languages.map((data) => (
        <Menu.Item key={data.id} onClick={() => {languageChange(data.language, data.code, data.id); setIsActive(false)}}>
          {data.language}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <nav className='mean-nav site-mobile-menu'>
        <ul>

          <li className='has-children'>
            <div className='mobile_notification'>


              {systemconfig && systemconfig.language_mode === '1' ? (
                <div className='dropdown__language'>
                  <Dropdown overlay={menu} className='mobile-sidebar-dropdwon'>
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
              <div className='notification'>
                {isLogin() ? (
                  <Button
                    className='notify_btn btn-primary'
                    onClick={() => { setNotificationModal(true); setIsActive(false) }}
                    data-tooltip-id='custom-my-tooltip'
                  >
                    <span className='notification_badges'>{notification ? notification?.length : '0'}</span>
                    <FaRegBell />
                  </Button>
                ) : (
                  ''
                )}
                <Modal
                  title={t('Notification')}
                  centered
                  visible={notificationmodal}
                  onOk={() => setNotificationModal(false)}
                  onCancel={() => setNotificationModal(false)}
                  footer={null}
                  className='custom_modal_notify'
                >
                  {notification?.length ? (
                    notification.map((data, key) => {
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
                </Modal>
              </div>
            </div>
          </li>



          {isLogin() && checkUserData(userData) ? (
            <ul>
            <li className='has-children'>
              <Link href=''>
                <span className='menu-text'>{t('Welcome ')}{userName}</span>
              </Link>
              {/* <span className='menu-toggle' onClick={e => onClickHandler(e)}>
                <i className=''>
                  <FaAngleDown />
                </i>
              </span>
              <ul className='sub-menu'>
                
              </ul> */}
            </li>
            <li className='has-children'>
                  <Link href='/profile' onClick={() => setIsActive(false)}>
                    <span className='menu-text'>{t('My Profile')}</span>
                  </Link>
            </li>   
            <li className='has-children'>
                  <Link href='/profile/statistics/' onClick={() => setIsActive(false)}>
                    <span className='menu-text'>{t('My Statistics')}</span>
                  </Link>
            </li>      
            <li className='has-children'>
              <Link href='/profile/leaderboard' onClick={() => setIsActive(false)}>
                <span className='menu-text'>{t('LeaderBoard')}</span>
              </Link>
            </li>
            <li className='has-children'>
              <Link href='/profile/coin-history' onClick={() => setIsActive(false)}>
                <span className='menu-text'>{t('Coin History')}</span>
              </Link>
            </li>
            <li className='has-children'>
              <Link href='/profile/wallet' onClick={() => setIsActive(false)}>
                <span className='menu-text'>{t('Wallet')}</span>
              </Link>
            </li>
            <li className='has-children'>
              <Link href='/profile/invite-friends' onClick={() => setIsActive(false)}>
                <span className='menu-text'>{t('Invite Friends')}</span>
              </Link>
            </li>
            <li className='has-children'>
              <Link href='/profile/badges' onClick={() => setIsActive(false)}>
                <span className='menu-text'>{t('Badges')}</span>
              </Link>
            </li>
            <li className='has-children'>
              <Link href='/profile/bookmark' onClick={() => setIsActive(false)}>
                <span className='menu-text'>{t('Bookmark')}</span>
              </Link>
            </li>
            <li className='has-children'>
              <Link
                href=''
                onClick={() => {
                  handleSignout()
                  setIsActive(false)
                }}
              >
                <span className='menu-text'>{t('Logout')}</span>
              </Link>
            </li>
            </ul>
          
          ) : (
            <>
              {!guestlogout ? (
               <li className='has-dropdown'>
               <div className='right_guest_profile mb-2'>
                  <img
                    className='profile_image mt-2'
                    onClick={e => {
                      profileGuest(e)
                      setIsActive(false)
                    }}
                    src={img6.src}
                    alt='profile'
                  />
                  <button
                    className='btn btn-primary mt-2'
                    onClick={e => {
                      profileGuest(e)
                      setIsActive(false)
                    }}
                  >{`${t('Hello Guest')}`}</button>
                  <button
                    className='btn btn-primary custom_button_right ms-2 mt-2'
                    onClick={e => {
                      guestLogout(e)
                      setIsActive(false)
                    }}
                  >
                    Login / Signup <IoExitOutline />
                  </button>
                </div>
                </li>
              ) : (
                <>
                  <li>
                    <Link href='/auth/login' onClick={() => setIsActive(false)}>
                      <span className='menu-text'>{t('Login')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href='/auth/sign-up' onClick={() => setIsActive(false)}>
                      <span className='menu-text'>{t('Sign Up')}</span>
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
          {menu_data.map((menu, i) => (
            <React.Fragment key={i}>
              {menu.has_dropdown && (
                <li className='has-dropdown'>
                  <Link href={menu.link}>{t(menu.title)}</Link>
                  <ul
                    className='submenu'
                    style={{
                      display: navTitle === menu.title ? 'block' : 'none'
                    }}
                  >
                    {menu.sub_menus.map((sub, i) => (
                      <li key={i}>
                        <Link href={sub.link} onClick={() => setIsActive(false)}>
                          {t(sub.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`mean-expand ${navTitle === menu.title ? 'mean-clicked' : ''}`}
                    onClick={() => openMobileMenu(menu.title)}
                    style={{ fontSize: '18px', cursor: 'pointer' }}
                  >
                    <FaAngleDown />
                  </a>
                </li>
              )}
              {!menu.has_dropdown && (
                <li>
                  <Link href={menu.link} onClick={() => setIsActive(false)}>
                    {t(menu.title)}
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        .mean-nav {
          padding: 0px;
          background: #fff;
          color: #333;
        }
        .mean-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .mean-nav ul li {
          margin-bottom: 10px;
        }
        .mean-nav ul li a {
          color: #333;
          text-decoration: none;
          display: block;
          padding: 10px;
          border-radius: 5px;
          transition: background 0.3s ease;
        }
        .mean-nav ul li a:hover {
          background: #f0f0f0;
        }
        .mean-nav .has-dropdown > a {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mean-nav .submenu {
          padding-left: 20px;
        }
        .mean-nav .submenu li {
          margin-bottom: 5px;
        }
        .mean-nav .submenu li a {
          padding: 8px;
        }
        .mean-nav .mean-expand {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f0f0f0;
          cursor: pointer;
        }
        .mean-nav .mean-expand.mean-clicked {
          background: #e0e0e0;
        }
        .mobile_notification {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .dropdown__language {
          flex: 1;
        }
        .notification {
          flex: 1;
          text-align: right;
        }
        .notification .notify_btn {
          position: relative;
        }
        .notification .notification_badges {
          position: absolute;
          top: -5px;
          right: -5px;
          background: red;
          color: #fff;
          border-radius: 50%;
          padding: 2px 5px;
          font-size: 12px;
        }
        .right_guest_profile {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .right_guest_profile .profile_image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-bottom: 10px;
        }
        .right_guest_profile .btn {
          width: 100%;
          text-align: center;
        }
      `}</style>
    </>
  )
}

export default withTranslation()(MobileMenus)
