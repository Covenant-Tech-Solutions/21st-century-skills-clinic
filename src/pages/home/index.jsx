"use client"
import dynamic from 'next/dynamic'
import { useSelector, useDispatch } from 'react-redux'
import { t } from 'i18next'
import { FaRegCopy, FaWhatsapp, FaFacebook } from 'react-icons/fa'
import { FaXTwitter, FaTelegram } from "react-icons/fa6"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ContestPlayApi } from 'src/store/actions/campaign'
import { useRouter } from 'next/router'

const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const HomeComp = dynamic(() => import('src/components/Static-Pages/HomeComp'), { ssr: false })

const Home = () => {
  const userData = useSelector(state => state.User.data)
  const inviteCode = userData?.refer_code || 'your-invite-code'
  const [livecontest, setLiveContest] = useState([])
  const dispatch = useDispatch()
  const router = useRouter()

  const copyToClipboard = () => {
    navigator.clipboard.writeText('Join me on BrainBank lets play, learn and earn. You can cashout your coins for real money.  Signup now with this: https://brainbank.builton.top/auth/sign-up?ref='+inviteCode)
    alert(t('Invite code copied to clipboard!'))
  }

  console.log('User Data:', userData);

  useEffect(() => {
    ContestPlayApi(
      response => {
        console.log('Contest Data:', response.live_contest?.data)
        setLiveContest(response.live_contest?.data || [])
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  const playBtn = (contestid, entrycoin) => {
    if (Number(entrycoin) > Number(userData?.coins)) {
      alert(t("You don't have enough coins"))
      return false
    }
    router.push({ pathname: '/contest-play/contest-play-board' })
  }

  return (
    <Layout>
      <div className="home-container">
        {userData && (
          <div className="user-stats-card">
            <div className="card-row">
              <div className="card">
                <h3>{t('Total Score')}</h3>
                <p>{userData?.userProfileStatics.all_time_score || 0}</p>
              </div>
              <div className="card">
                <h3>{t('Global Rank')}</h3>
                <p>{userData?.userProfileStatics.all_time_rank || 'N/A'}</p>
              </div>
            </div>
            <div className="card">
              <h3>{t('Total Coins')}</h3>
              <p>{userData?.coins || 0}</p>
            </div>
            <div className="card">
              <h3>{t('Invite Friends')}</h3>
              <div className="invite-icons">
                <a href={`https://api.whatsapp.com/send?text=Join me on BrainBank lets play, learn and earn. You can cashout your coins for real money.  Signup now with this: https://brainbank.builton.top/auth/sign-up?ref=${inviteCode}`} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp size={20} />
                </a>
                <a href={`https://twitter.com/intent/tweet?text=Join%20me%20on%20BrainBank%20lets%20play,%20learn%20and%20earn.%20You%20can%20cashout%20your%20coins%20for%20real%20money.%20%20Signup%20here:https://brainbank.builton.top/auth/sign-up?ref=${inviteCode}`} target="_blank" rel="noopener noreferrer">
                  <FaXTwitter size={20} />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=https://brainbank.builton.top/auth/sign-up?ref=${inviteCode}`} target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={20} />
                </a>
                <FaRegCopy size={20} onClick={copyToClipboard} style={{ cursor: 'pointer' }} />
              </div>
            </div>
            <div className="card">
              <h3>{t('Join Community')}</h3>
              <div className="community-icons">
                <a href="https://t.me/joinbrainbank" target="_blank" rel="noopener noreferrer">
                  <FaTelegram size={20} />
                </a>
                <a href="https://chat.whatsapp.com/Li8q1QajPnhLMw6TsMpj6M" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
            <div className="card">
              <h3>{t('Live Contests')}</h3>
              <div className="live-contests">
                {livecontest.map((contest, index) => (
                  <div key={index} className="contest-card">
                    <h4>{contest.name}</h4>
                    <p>{contest.description}</p>
                    <p><strong>{t('Start Date')}:</strong> {contest.start_date}</p>
                    <p><strong>{t('End Date')}:</strong> {contest.end_date}</p>
                    <p><strong>{t('Entry Coin')}:</strong> {contest.entry}</p>
                    <p><strong>{t('Participants')}:</strong> {contest.participants}</p>
                    <button onClick={() => playBtn(contest.id, contest.entry_coin)}>{t('Play Now')}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {(!userData) ? <HomeComp /> : <div></div>}
      </div>
      <style jsx>{`
        .home-container {
          padding: 5px;
          background: linear-gradient(175deg, #090029 0%, #090029 100%);
          color: #fff;
        }
        .user-stats-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        .card-row {
          display: flex;
          gap: 15px;
        }
        .card {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          padding: 15px;
          text-align: center;
          flex: 1;
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-8px);
        }
        .card h3 {
          margin-bottom: 8px;
          font-size: 1.0rem;
        }
        .card p {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .invite-icons, .community-icons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }
        .invite-icons a, .community-icons a {
          color: #fff;
          background: rgba(0, 0, 0, 0.2);
          padding: 8px;
          border-radius: 50%;
          transition: background 0.3s ease;
        }
        .invite-icons a:hover, .community-icons a:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        .live-contests {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contest-card {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 10px;
          text-align: left;
        }
        .contest-card h4 {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
        }
        .contest-card p {
          margin: 0 0 10px 0;
          font-size: 1rem;
        }
        .contest-card button {
          background: #ff4081;
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .contest-card button:hover {
          background: #e73370;
        }
        a {
          color: #fff;
          text-decoration: underline;
        }
      `}</style>
    </Layout>
  )
}

export default Home
