"use client"
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { getUserProfilestatisticsApi, getUserStatisticsDataApi, updateUserDataInfo } from 'src/store/reducers/userSlice'
import { useSelector } from 'react-redux'
import { UserCoinScoreApi, getusercoinsApi, setBadgesApi, getbattlestaticticsApi } from 'src/store/actions/campaign'
import { badgesData, LoadNewBadgesData } from 'src/store/reducers/badgesSlice'
import { Progress, Tooltip } from 'antd';
import 'react-circular-progressbar/dist/styles.css';
import StatisticsPieChartCanvas from 'src/components/Common/StatisticsPieChartCanvas'
import { imgError } from 'src/utils'
import LeftTabProfile from 'src/components/Profile/LeftTabProfile'
import Layout from 'src/components/Layout/Layout'
import { t } from 'i18next'
import { useRouter } from 'next/router'


const Statistics = () => {

  const router = useRouter()

  const userData = useSelector(state => state.User)

  const Badges = useSelector(badgesData)

  const big_thingBadge = Badges?.data?.find(badge => badge?.type === 'big_thing');

  const eliteBadge = Badges?.data?.find(badge => badge?.type === 'elite');

  const big_thing_status = big_thingBadge && big_thingBadge?.status

  const big_thing_coin = big_thingBadge && big_thingBadge?.badge_reward

  const elite_status = eliteBadge && eliteBadge?.status

  const elite_coin = eliteBadge && eliteBadge?.badge_reward

  const [battleStatisticsResult, setBattleStatisticsResult] = useState([])

  // website link

  // user profile data get and statics
  useEffect(() => {
    getUserProfilestatisticsApi(
      // userData?.data?.id,
      success => { },
      error => {
        // toast.error(error)
      }
    )

    getUserStatisticsDataApi(
      success => { },
      error => {
        // toast.error(error);
      }
    )
  }, [])

  // one big think badges
  useEffect(() => {
    let totalQuestion = userData?.data && userData?.data?.userStatics.correct_answers
    if (big_thing_status === '0' && totalQuestion == 5000) {
      setBadgesApi(
        'big_thing',
        (res) => {
          LoadNewBadgesData('big_thing', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            big_thing_coin,
            null,
            null,
            t('big thing badge reward'),
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
  }, [])

  // elite badge
  useEffect(() => {
    let totalUserCoins = userData?.data && userData?.data?.userProfileStatics.coins
    if (elite_status === '0' && totalUserCoins == 5000) {
      setBadgesApi(
        'elite',
        (res) => {
          LoadNewBadgesData('elite', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            elite_coin,
            null,
            null,
            t('elite badge reward'),
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
  }, [])

  // get battleStatistics api call
  useEffect(() => {
    getbattlestaticticsApi(
      '',
      '',
      '',
      '',
      response => {
        setBattleStatisticsResult(response.myreport)
        // console.log("battleStatisticsResult[0]", battleStatisticsResult[0])
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  const correctAnswers = userData?.data?.userStatics.correct_answers;
  const incorrectAnswers = parseInt(userData?.data?.userStatics.questions_answered) -
    parseInt(userData?.data?.userStatics.correct_answers);

  const totalQuestions = userData?.data?.userStatics.questions_answered
  const correctPercentage = (correctAnswers / totalQuestions) * 100;
  const incorrectPercentage = (incorrectAnswers / totalQuestions) * 100;

  const wonBattles = battleStatisticsResult && battleStatisticsResult[0] ? parseInt(battleStatisticsResult[0].Victories) || 0 : 0;
  const drawBattles = battleStatisticsResult && battleStatisticsResult[0] ? parseInt(battleStatisticsResult[0].Drawn) || 0 : 0;
  const lostBattles = battleStatisticsResult && battleStatisticsResult[0] ? parseInt(battleStatisticsResult[0].Loose) || 0 : 0;
  

  // Calculate the total battles
  const totalBattles = wonBattles + drawBattles + lostBattles;

  // Calculate percentages for each category
  const wonPercentage = (wonBattles / totalBattles) * 100;
  const drawPercentage = (drawBattles / totalBattles) * 100;
  const lostPercentage = (lostBattles / totalBattles) * 100;

  const values = [
    { no: wonPercentage, arcColor: '#15ad5a' },
    { no: drawPercentage, arcColor: '#ffcc00' },
    { no: lostPercentage, arcColor: '#800080' },
  ];


  return (
    <Layout>
      <div className='Profile__Sec 1 statistics'>
        <div className='container px-1'>
          <div className='morphism'>
            <div className='row pro-card position-relative'>
              <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                <div className='card px-4 bottom__card_sec'>
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className='contentDiv col-xl-9 col-lg-4 col-md-12 col-12 '>
                <div className="row m-0">
                  {/* question details */}
                  <div className='col-md-6 col-12'>
                    <div className='questions_details morphism'>
                      <p className='questions_details_title'>{t('Questions Details')}</p>
                      <div className="questionsDetials">
                        <div className="progressBar">
                          <div className='antDProgressBarWrapper'>
                            <Tooltip>
                              <Progress success={{
                                percent: incorrectPercentage
                              }} type="circle"
                              />
                            </Tooltip>
                            <div className='totAttemptQues'>
                              <span className='badge badge-pill custom_badge'>
                                {userData?.data?.userStatics.questions_answered}</span>
                              <span className='attempted'> {t('Attempted')}</span>
                            </div>

                          </div>


                        </div>
                        <div className="corrIncorrWrapper">
                          <span className='corr'>  {t('Correct')} <span>{userData?.data &&
                            (userData?.data?.userStatics.correct_answers ? userData?.data?.userStatics.correct_answers : '0')}</span></span>
                          <span className='inCorr'> {t('Incorrect')} <span>{userData?.data &&
                            (parseInt(userData?.data?.userStatics.questions_answered) -
                              parseInt(userData?.data?.userStatics.correct_answers)
                              ? parseInt(userData?.data?.userStatics.questions_answered) -
                              parseInt(userData?.data?.userStatics.correct_answers)
                              : '0')}</span></span>
                        </div>
                      </div>

                    </div>
                  </div>


                  {/*battle statistics */}
                  <div className='col-md-6 col-12'>
                    <div className='quiz_details questions_details morphism'>
                      <p className='quiz_details_title'>{t('Battle Statistics')}</p>
                      <div className="questionsDetials">

                        <StatisticsPieChartCanvas width={120} height={120} values={values} strokeWidth={8} totalBattles={totalBattles} />

                        {/* </div> */}
                        <div className="corrIncorrWrapper">
                          <span className='corr won'>  {t('Won')} <span>{battleStatisticsResult && battleStatisticsResult.map((ele) => {
                            return <span>{ele.Victories}</span>
                          })}</span></span>
                          <span className='inCorr drow'> {t('Draw')} <span>{battleStatisticsResult && battleStatisticsResult.map((ele) => {
                            return <span>{ele.Drawn}</span>
                          })}</span></span>
                          <span className='inCorr lost'> {t('Lost')} <span>{battleStatisticsResult && battleStatisticsResult.map((ele) => {
                            return <span>{ele.Loose}</span>
                          })}</span></span>
                        </div>
                      </div>

                    </div>
                  </div>
                  {/* quiz details */}
                  <div className='col-md-6 col-12'>
                    <div className='quiz_details morphism'>
                      <p className='quiz_details_title'>{t('Quiz Details')}</p>
                      <div className="rankDiv">
                        <span className='m-auto'>
                          <img src={userData?.data?.profile} alt="" onError={imgError} className='userProfile' />
                        </span>

                      </div>

                      <div className="pointScreen">
                        <div className="rankDiv">
                          <span className='rankText'> {t('Rank')}</span>
                          <span className='rankNum'> {userData?.data && userData?.data?.userProfileStatics.all_time_rank}</span>
                        </div>
                        <div className="innerDiv">
                          <span>{t('Coins')}</span>
                          <span className='boldText'>{userData?.data && userData?.data?.userProfileStatics.coins}</span>
                        </div>
                        <div className="innerDiv">
                          <span>{t('Score')}</span>
                          <span className='boldText'> {userData?.data && userData?.data?.userProfileStatics.all_time_score}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                  {/* collected badges */}
                  <div className='col-md-6 col-12 statisticsBadges'>
                    <div className='questions_details morphism badges battle_statistics_badges '>
                      <p className='questions_details_title mb-0'>{t('Collected Badges')}</p>
                      <ul className='questions_details_inner badgesImgWrapper mb-0 pb-0'>
                        {Badges.data && Badges.data?.length > 0 ? (
                          [...Object.values(Badges.data).filter(data => data.status === '1')]
                            .slice(0, 3)
                            .map((data, index) => (
                              <li className='col-md-4 justify-content-center' key={index}>
                                <div
                                  className='badges_data'
                                  data-tooltip-id='my-tooltip'
                                  data-tooltip-content={`${data.badge_note}`}
                                >
                                  <div className='inner_image'>
                                    <span className='dummy_background_color' />
                                    <img src={data.badge_icon} alt='badges' />
                                  </div>
                                  <p className='mb-0 pb-0 badges_name'>{data.badge_label}</p>
                                </div>
                              </li>
                            ))
                        ) : (
                          <div className='no_badges'>

                            <span>{t("No Badges Founds")}</span>
                          </div>
                        )}
                      </ul>
                      <hr className='mt-0 mb-2' />
                      <p className='mb-0 view_all text-center text-dark fw-bolder ' onClick={() => router.push("/profile/badges")}>{t('View All')}</p>
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
export default withTranslation()(Statistics)
