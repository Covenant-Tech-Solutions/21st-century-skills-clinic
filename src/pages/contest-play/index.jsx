"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { t } from 'i18next'
import { ContestPlayApi, UserCoinScoreApi } from 'src/store/actions/campaign'
import { LoadcontestLeaderboard, Loadtempdata, reviewAnswerShowSuccess } from 'src/store/reducers/tempDataSlice'
import { useRouter } from 'next/navigation'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import Past from 'src/components/Quiz/ContestPlay/Past'
import Live from 'src/components/Quiz/ContestPlay/Live'
import Upcoming from 'src/components/Quiz/ContestPlay/Upcoming'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const ContestPlay = () => {

  const dispatch = useDispatch()
  //states
  const [livecontest, setLiveContest] = useState()

  const [pastcontest, setPastContest] = useState()

  const [upcoming, setUpComing] = useState()

  const navigate = useRouter()

  // store data get
  const userData = useSelector((state) => state.User);

  const AllData = () => {
    ContestPlayApi(
      response => {
        let liveData = response.live_contest.data
        setLiveContest(liveData)

        let pastData = response.past_contest.data
        setPastContest(pastData)

        let upcomingData = response.upcoming_contest.data
        setUpComing(upcomingData)
      },
      error => {
        console.log(error)
      }
    )
  }

  //live play btn
  const playBtn = (contestid, entrycoin) => {
    if (Number(entrycoin) > Number(userData?.data?.coins)) {
      toast.error("you dont have enough coins")
      return false;
    }
    navigate.push({ pathname: '/contest-play/contest-play-board' })
    let data = { contest_id: contestid, entry_coin: entrycoin }
    Loadtempdata(data)
    UserCoinScoreApi(
      '-' + entrycoin,
      null,
      null,
      'Contest Entry Point',
      '1',
      response => {
        updateUserDataInfo(response.data)
      },
      error => {
        console.log(error)
      }
    )
  }

  //past leaderboard btn
  const LeaderBoard = contest_id => {
    navigate.push({ pathname: '/contest-play/contest-leaderboard' })
    let data = { past_id: contest_id }
    LoadcontestLeaderboard(data)
  }

  useEffect(() => {
    AllData()
    dispatch(reviewAnswerShowSuccess(false))
  }, [selectCurrentLanguage])

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} title={t('Contest Play')} content={t('Home')} allgames={t('all-games')} contentTwo="" />
      <div className='contestPlay mb-5'>
        <div className='container'>
          <div className='row morphisam mb-5'>
            <div className='col-md-12 col-12'>
              <div className='contest_tab_contest'>
                <Tabs defaultActiveKey='live' id='fill-tab-example' fill>
                  <Tab eventKey='past' title={t('Finished')}>
                    <Past data={pastcontest} LeaderBoard={LeaderBoard} />
                  </Tab>
                  <Tab eventKey='live' title={t('Ongoing')}>
                    <Live data={livecontest} playBtn={playBtn} />
                  </Tab>
                  <Tab eventKey='upcoming' title={t('Upcoming')}>
                    <Upcoming data={upcoming} />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ContestPlay
