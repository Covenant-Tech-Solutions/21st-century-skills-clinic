'use client'
import React from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { withTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dropdownIcon from '../../../public/images/dropdown_icon.svg'
import Image from 'next/image'
const NavBar = ({ t }) => {
  const router = useRouter()

  const isActive = to => {
    return router.pathname === to
  }

  return (
    <nav className='site-main-menu'>
      <ul>
        {/* <li>
          <Link href='/' className={isActive('/') ? 'navbar__link--active' : ''}>
            <span className='menu-text'>{t('Home')}</span>
          </Link>
        </li> */}
        <li>
          <Link href='/all-games' className={isActive('/all-games') ? 'navbar__link--active' : ''}>
            <span className='menu-text'>{t('Play & Earn')}</span>
          </Link>
        </li>
        <li>
          <Link href='/instruction' className={isActive('/instruction') ? 'navbar__link--active' : ''}>
            <span className='menu-text'>{t('Instructions')}</span>
          </Link>
        </li>
        <li className='has-children'>
          <Link href=''>
            <span className='menu-text'>{t('More')} <Image src={dropdownIcon} alt="Dropdown Icon" width={10} height={10} /> </span>
          </Link>
          <span className='menu-toggle'>
            <i className=''>
              <FaAngleDown />
            </i>
          </span>
          <ul className='sub-menu'>
            <li>
              <Link href='/contact-us' className={isActive('/contact-us') ? 'navbar__link--active' : ''}>
                <span className='menu-text'>{t('Contact Us')}</span>
              </Link>
            </li>
            <li>
              <Link href='/about-us' className={isActive('/about-us') ? 'navbar__link--active' : ''}>
                <span className='menu-text'>{t('about-us')}</span>
              </Link>
            </li>
            <li>
              <Link href='/terms-conditions' className={isActive('/terms-conditions') ? 'navbar__link--active' : ''}>
                <span className='menu-text'>{t('Terms and Conditions')}</span>
              </Link>
            </li>
            <li>
              <Link href='/privacy-policy' className={isActive('/privacy-policy') ? 'navbar__link--active' : ''}>
                <span className='menu-text'>{t('Privacy Policy')}</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default withTranslation()(NavBar)
