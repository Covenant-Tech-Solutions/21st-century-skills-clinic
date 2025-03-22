import userSettingIcon from 'src/assets/images/Usersetting.svg'
import bookmarkIcon from 'src/assets/images/bookmark.svg'
import statisticsIcon from 'src/assets/images/Statistics.svg'
import badgesIcon from 'src/assets/images/badges.svg'
import leaderboardIcon from 'src/assets/images/leaderboard.svg'
import walletIcon from 'src/assets/images/Wallet.svg'
import inviteIcon from 'src/assets/images/invitedfriend.svg'
import coinIcon from 'src/assets/images/Coinhistory.svg'
import { t } from "i18next";
import { useRouter } from "next/router";
import { sysConfigdata } from "src/store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { Modal } from 'antd'
import { useState } from 'react'
import FirebaseData from 'src/utils/Firebase'
import { deleteuserAccountApi } from 'src/store/actions/campaign'
import Swal from 'sweetalert2'
import { logout } from 'src/store/reducers/userSlice'
import warningImg from 'src/assets/images/logout.svg'
import deleteAccImg from 'src/assets/images/deleteAcc.svg'
import logouttabImg from "src/assets/images/logout-tab.svg"
import DeleteImg from "src/assets/images/Delete.svg"

const LeftTabProfile = () => {

    const demoValue = process.env.NEXT_PUBLIC_DEMO === 'true';

    const systemconfig = useSelector(sysConfigdata);

    const router = useRouter();

    const { auth } = FirebaseData()

    const [logoutModal, setLogoutModal] = useState(false)

    const [deleteAccModal, setDeleteAccModal] = useState(false)

    const path = router.pathname

    // sign out
    const handleSignout = e => {
        e.preventDefault()
        setLogoutModal(true)
    }


    const handleConfirmLogout = () => {
        logout()
        auth.signOut()
        router.push('/')
        setLogoutModal(false)
    }

    const handleConfirmDeleteAcc = () => {
        deleteuserAccountApi({
            onSuccess: () => {
                Swal.fire(t('Deleted'), t('Account Deleted Successfully!'), 'success')
                // Current signed-in user to delete
                const firebaseUser = auth.currentUser
                firebaseUser
                    .delete()
                    .then(() => {
                        // User deleted.
                    })
                    .catch(error => {
                        console.log(error)
                    })
                logout()
                auth.signOut()
                router.push('/')
                setDeleteAccModal(false)
            },
            onError: (error) => {
                if (demoValue) {
                    Swal.fire(t('OOps'), t('Not allowed in demo version'))
                } else {
                    Swal.fire(t('OOps'), t('Please Try again'), 'error')
                }
            }
        })
    }

    // delete user account
    const deleteAccountClick = e => {
        e.preventDefault()
        setDeleteAccModal(true)
    }

    const tabItems = [
        { path: '/profile', icon: userSettingIcon, label: 'Profile' },
        { path: '/profile/statistics', icon: statisticsIcon, label: 'Statistics' },
        { path: '/profile/bookmark', icon: bookmarkIcon, label: 'Bookmark' },
        { path: '/profile/badges', icon: badgesIcon, label: 'Badges' },
        { path: '/profile/leaderboard', icon: leaderboardIcon, label: 'LeaderBoard' },
        { path: '/profile/coin-history', icon: coinIcon, label: 'Coin History' },
        { path: '/profile/wallet', icon: walletIcon, label: 'Wallet', condition: systemconfig?.payment_mode === "1" },
        { path: '/profile/invite-friends', icon: inviteIcon, label: 'Invite Friends' },
        { path: '/logout', icon: logouttabImg, label: 'logout-account', action: handleSignout },
        { path: '/delete-account', icon: DeleteImg, label: 'Delete Account', action: deleteAccountClick }
    ];

    return (
        <>

            < div className='tab-headers' >
                {tabItems.map((item, index) => (
                    item.condition !== false && (
                        <div key={index} className={`tab-header ${path === item.path ? 'active' : ''}`} onClick={() => item.action ? item.action() : router.push(item.path)}>
                            <span>
                                <img src={item.icon.src} alt={item.label} className='profileTabIcon' />
                            </span>
                            <span>{t(item.label)}</span>
                        </div>
                    )
                ))}
            </div >

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

            <Modal
                maskClosable={false}
                centered
                visible={deleteAccModal}
                onOk={() => setDeleteAccModal(false)}
                onCancel={() => {
                    setDeleteAccModal(false)
                }}
                footer={null}
                className='logoutModal'
            >
                <div className="logoutWrapper">
                    <span><img src={deleteAccImg.src} alt="" /></span>
                    <span className='headline'>{t("Delete Account")}</span>
                    <span className='confirmMsg'>{t("Are you sure you want to delete account")}</span>
                </div>

                <div className="logoutBtns">
                    <span className='yes' onClick={handleConfirmDeleteAcc}>{t("Yes,Delete")}</span>
                    <span className='no' onClick={() => setDeleteAccModal(false)}>{t("Keep Account")}</span>
                </div>
            </Modal>

        </>
    )
}

export default LeftTabProfile