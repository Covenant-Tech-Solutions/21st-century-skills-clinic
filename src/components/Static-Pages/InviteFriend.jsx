"use client"
import React, { useRef, useState } from 'react'
import { FaRegCopy, FaWhatsapp, FaFacebook } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import giftImg from 'src/assets/images/img.svg'
import dynamic from 'next/dynamic'
import LeftTabProfile from '../Profile/LeftTabProfile';
import { LoadNewBadgesData, badgesData } from 'src/store/reducers/badgesSlice';
import { UserCoinScoreApi, getusercoinsApi, setBadgesApi } from 'src/store/actions/campaign';
import toast from 'react-hot-toast';
import { updateUserDataInfo } from 'src/store/reducers/userSlice';
import { t } from 'i18next';
import { ImageToSvg } from '../ImageToSvg/ImageToSvg';
import { sysConfigdata } from 'src/store/reducers/settingsSlice';
import coinimg from "src/assets/images/coin.svg"
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })


const Invite_friends = () => {

    const clickCount = useRef(0)

    const Badges = useSelector(badgesData)

    const sharing_caringBadge = Badges?.data?.find(badge => badge?.type === 'sharing_caring');

    const sharing_caring_status = sharing_caringBadge && sharing_caringBadge?.status

    const systemconfig = useSelector(sysConfigdata);

    // refer_coin

    const [copyState, setCopyState] = useState(0)

    const userData = useSelector(state => state.User)

    const clickToCopy = event => {
        event.preventDefault()
        if (navigator.clipboard !== undefined) {
            //Chrome
            navigator.clipboard.writeText(userData?.data && userData?.data?.refer_code).then(
                function () { },
                function (err) { }
            )
        } else if (window.clipboardData) {
            // Internet Explorer
            window.clipboardData.setData('Text', userData?.data && userData?.data?.refer_code)
        }

        setCopyState(1)
        setTimeout(() => {
            setCopyState(0)
        }, 1000)
    }

    // share social media and sharing caring badge
    const shareAppButton = e => {
        e.preventDefault()
        clickCount.current++
        if (sharing_caring_status === '0' && clickCount.current == 50) {
            setBadgesApi(
                'sharing_caring',
                (res) => {
                    LoadNewBadgesData('sharing_caring', '1')
                    toast.success(t(res?.data?.notification_body))
                    const status = 0
                    UserCoinScoreApi(
                        sharing_caring_coin,
                        null,
                        null,
                        t('sharing caring badge reward'),
                        status,
                        response => {
                            getusercoinsApi(
                                responseData => {
                                    updateUserDataInfo(responseData.data)
                                },
                                error => {
                                    console.log(error)
                                }
                            )
                        },
                        error => {
                            console.log(error)
                        }
                    )
                },
                error => {
                    console.log(error)
                }
            )
        }
    }
    return (
        <Layout>
            <div className='Profile__Sec mt-1 Invite__friends'>
                <div className='container'>
                    <div className="morphism morphisam">
                        <div className='row pro-card position-relative'>
                            <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                                <div className='card px-4 bottom__card_sec'>
                                    {/* Tab headers */}
                                    <LeftTabProfile />
                                </div>
                            </div>
                            <div className='contentDiv col-xl-9 col-lg-4 col-md-12 col-12 pt-2'>
                                <div className='row card'>
                                    <div className='col-lg-12 col-md-12 col-12 border_line justify-content-center align-items-center d-flex flex-column text-center'>
                                        <div className='refer_earn_title'>
                                            <h3>
                                                <b className='headline'> {t('refer-earn')}</b>
                                            </h3>

                                            <div className="giftImg">
                                                <img src={giftImg.src} alt="" />
                                                {/* <ImageToSvg imageUrl={giftImg.src} className="custom-svg" /> */}
                                            </div>

                                            <div className="getCoinsDiv">
                                                <span> <img src={coinimg.src} alt="" /> {systemconfig.refer_coin} </span>
                                                <span>{t("Get Free Coin")}</span>
                                            </div>

                                            <p className='referPara'>{t('Refer and Earn Text')}</p>

                                            <div className="referCodeWrapper">
                                                <span>
                                                    <b>{t('Your Referral Code')}</b>
                                                </span>
                                                <div className='copy__referal'>
                                                    <span className='referCode'>{userData && userData?.data?.refer_code}</span>
                                                    <button className='btn-primary'>
                                                        <span className='icon1'>
                                                            <Link
                                                                href={''}
                                                                onClick={event => {
                                                                    clickToCopy(event)
                                                                }}
                                                            >
                                                                {' '}
                                                                <i>
                                                                    <FaRegCopy />
                                                                </i>

                                                            </Link>
                                                        </span>
                                                    </button>
                                                </div>
                                                <span>{t('send-to-friend')}</span>
                                            </div>

                                        </div>


                                        <div className='invite__now'>
                                            <p>
                                                <b>{t('Invite Now')}</b>
                                            </p>
                                            <ul className='social__icons'>
                                                <li>
                                                    <a
                                                        href={'https://api.whatsapp.com/send?text=Join me on BrainBank lets play, learn and earn. You can cashout your coins for real money.  Signup now with this: https://brainbank.builton.top/auth/sign-up?ref=' + userData?.data?.refer_code}
                                                        target='_blank'
                                                        rel='noreferrer'
                                                    >
                                                        <i>
                                                            <FaWhatsapp />
                                                        </i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href={'https://twitter.com/intent/tweet?text=Join me on BrainBank lets play, learn and earn. You can cashout your coins for real money.  Signup here:https://brainbank.builton.top/auth/sign-up?ref=' + userData?.data?.refer_code}
                                                        target='_blank'
                                                        rel='noreferrer'
                                                    >
                                                        <i>
                                                            <FaXTwitter />
                                                        </i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href={
                                                            'http://www.facebook.com/sharer.php?u=' +
                                                            window.location.protocol +
                                                            '//' +
                                                            window.location.hostname +
                                                            '&quote=Join me on BrainBank lets play, learn and earn. You can cashout your coins for real money.  Signup here: https://brainbank.builton.top/auth/sign-up?ref=' +
                                                            userData?.data?.refer_code
                                                        }
                                                        target='_blank'
                                                        rel='noreferrer'
                                                    >
                                                        <i>
                                                            <FaFacebook />
                                                        </i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default withTranslation()(Invite_friends)
