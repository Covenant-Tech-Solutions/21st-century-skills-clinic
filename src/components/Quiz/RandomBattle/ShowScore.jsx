import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'
import { battleDataClear, groupbattledata } from 'src/store/reducers/groupbattleSlice'
import { imgError } from 'src/utils'
import { UserCoinScoreApi, getusercoinsApi, setBadgesApi, setbattlestaticticsApi } from 'src/store/actions/campaign'
import { badgesData, LoadNewBadgesData } from 'src/store/reducers/badgesSlice'
import toast from 'react-hot-toast'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { useRouter } from 'next/navigation'
// import vsImg from '../../../assets/images/versus.svg'
import vsImg from '../../../assets/images/versus.svg'
import showScoreVsImg from '../../../assets/images/versus.svg'
import rightTickIcon from '../../../assets/images/check-circle-score-screen.svg'
import crossIcon from '../../../assets/images/x-circle-score-screen.svg'
import AnimatedProgressProvider from 'src/utils/AnimatedProgressProvider'
import { easeQuadInOut } from 'd3-ease'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { systemconfigApi } from 'src/store/reducers/settingsSlice'
import winnerBadge from '../../../assets/images/won bedge.svg'


const ShowScore = ({ t, score, totalQuestions, onReviewAnswersClick, reviewAnswer, goBack }) => {

  const [perValue, setPerValue] = useState(0)

  const navigate = useRouter()

  const percentage = (score * 100) / totalQuestions


  const goToHome = () => {
    navigate.push('/')
  }

  // store data get
  const userData = useSelector(state => state.User)

  const groupBattledata = useSelector(groupbattledata)


  const badgesdata = useSelector(badgesData)

  const quiz_warriorBadge = badgesdata?.data?.find(badge => badge?.type === 'quiz_warrior');

  const quiz_warrior_status = quiz_warriorBadge && quiz_warriorBadge?.status

  const quiz_warrior_coin = quiz_warriorBadge && quiz_warriorBadge?.badge_reward

  let user1point = groupBattledata.user1point
  let user1CorrectAnswer = groupBattledata.user1CorrectAnswer
  let user2CorrectAnswer = groupBattledata.user2CorrectAnswer
  let user2point = groupBattledata.user2point
  let user1name = groupBattledata.user1name
  let user2name = groupBattledata.user2name
  let user1uid = groupBattledata.user1uid
  let user2uid = groupBattledata.user2uid
  let user1image = groupBattledata.user1image
  let user2image = groupBattledata.user2image
  let entryFee = groupBattledata.entryFee

  // winner id
  const comparePointsAndRetrieveUserIDs = () => {
    if (user1point > user2point) {
      // user1point is greater than user2point
      return user1uid
    } else if (user2point > user1point) {
      // user2point is greater than user1point
      return user2uid
    } else {
      // user1point and user2point are equal
      return 0
    }
  }

  // login user
  const user2IdGet = () => {
    if (userData?.data?.id == user1uid) {
      return user2uid
    } else {
      return user1uid
    }
  }

  let counter = 0

  // quiz warrior badge
  const checkCondition = (userData, user1uid, user1point, user2point) => {
    if (userData?.data?.id === user1uid && user1point > user2point) {
      counter++
      if (quiz_warrior_status === '0' && counter === 3) {
        setBadgesApi(
          'quiz_warrior',
          (res) => {
            LoadNewBadgesData('quiz_warrior', '1')
            toast.success(t(res?.data?.notification_body))
            const status = 0
            UserCoinScoreApi(
              quiz_warrior_coin,
              null,
              null,
              t('quiz warrior badge reward'),
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
    } else if (userData?.data?.id === user2uid && user2point > user1point) {
      counter++
      if (quiz_warrior_status === '0' && counter === 3) {
        setBadgesApi(
          'quiz_warrior',
          (res) => {
            LoadNewBadgesData('quiz_warrior', '1')
            toast.success(t(res?.data?.notification_body))
            const status = 0
            UserCoinScoreApi(
              quiz_warrior_coin,
              null,
              null,
              t('quiz warrior badge reward'),
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
    } else {
      counter = 0
    }
  }

  useEffect(() => {
    checkCondition(userData, user1uid, user1point, user2point)
  }, [])

  // set battle statistics api
  useEffect(() => {
    let compareBattledata = comparePointsAndRetrieveUserIDs()
    let user2uidData = user2IdGet()
    setbattlestaticticsApi(userData?.data?.id, user2uidData, compareBattledata, compareBattledata ? 0 : 1)
  }, [])

  const alluseranswer = [user1point, user2point]

  const alluid = [user1uid, user2uid]

  // find max number
  const max = Math.max(...alluseranswer)

  let maxIndices = []

  for (let i = 0; i < alluseranswer?.length; i++) {
    if (alluseranswer[i] === max) {
      maxIndices.push(i)
    }
  }

  // Find the user IDs of all users with the max number of correct answers
  const usersWithMax = []
  for (const index of maxIndices) {
    usersWithMax.push(alluid[index])
  }

  let winAmount = entryFee * (groupBattledata.totalusers / maxIndices?.length)

  useEffect(() => {
    if (!groupBattledata.showScore && usersWithMax.includes(userData?.data?.id) && entryFee > 0) {
      // Winner logic
      const status = 0
      UserCoinScoreApi(
        Math.floor(winAmount),
        null,
        null,
        t('Won Battle'),
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
    }
  }, [])

  return (
    <React.Fragment>
      <div className='my-4 row d-flex align-items-center'>
        {(() => {
          if (userData?.data?.id == user1uid && user1point > user2point) {
            return (
              <>
                <div className='result_data'>
                  <p>{t('Victory')}</p>
                  <h3>{t('Congratulations')}</h3>
                  {entryFee > 0 && user2uid !== "000" ?
                    <div className="wonCoin">
                      <span>{t(`You Won ${winAmount} Coins`)}</span>
                    </div>
                    : null}
                </div>
              </>
            )
          } else if (userData?.data?.id == user1uid && user1point < user2point) {
            return (
              <div className='result_data'>
                <p>{t('Defeat')}</p>
                <h3>{t('Better Luck Next Time')}</h3>
                {entryFee > 0 && user2uid !== "000" ?
                  <div className="wonCoin loseCoin">
                    <span>{t(`You Lose ${entryFee} Coins`)}</span>
                  </div>
                  : null}

              </div>
            )
          } else if (userData?.data?.id == user2uid && user1point > user2point) {
            return (
              <div className='result_data'>
                <p>{t('Defeat')}</p>
                <h3>{t('Better Luck Next Time')}</h3>

                {entryFee > 0 && user2uid !== "000" ?
                  <div className="wonCoin loseCoin">
                    <span>{t(`You Lose ${entryFee} Coins`)}</span>
                  </div>
                  : null}
              </div>
            )
          } else if (userData?.data?.id == user2uid && user1point < user2point) {
            return (
              <div className='result_data'>
                <p>{t('Victory')}</p>
                <h3>{t('Congratulations')}</h3>
                {entryFee > 0 && user2uid !== "000" ?
                  <div className="wonCoin">
                    <span>{t(`You Won ${winAmount} Coins`)}</span>
                  </div>
                  : null}

              </div>
            )
          } else if (user1point == user2point) {
            return (
              <div className='result_data'>
                <h3>{t('Tie')}</h3>
              </div>
            )
          }
        })()}

        {(() => {
          if (user1point > user2point) {
            return (
              <div className='user_data onevsone'>
                <div className='login_winner'>
                  <div className="profileWrapper">
                    <img
                      src={user1image ? user1image : '/images/user.svg'}
                      alt='user'
                      className='showscore-userprofile'
                      onError={imgError}
                    />
                    <img src={winnerBadge.src} alt="winnerBadge" className='wonbadge' />

                  </div>

                  <p>{user1name}</p>

                  <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                    <span className='rightAns'>
                      <img src={rightTickIcon.src} alt="" />{user1CorrectAnswer}
                    </span>

                    <span className='wrongAns'>
                      <img src={crossIcon.src} alt="" />{totalQuestions - user1CorrectAnswer}</span>
                  </div>
                  <p> {t("Score")}: {user1point}</p>
                </div>

                {/* vs */}
                <div className='versus_screen'>
                  <img src={vsImg.src} alt='versus' />
                </div>

                <div className='opponet_loser'>
                  <div className="profileWrapper">

                    <img
                      src={user2image ? user2image : '/images/user.svg'}
                      alt='user'
                      className='showscore-userprofile'
                      onError={imgError}
                    />

                  </div>

                  <p>{user2name}</p>

                  <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                    <span className='rightAns'>
                      <img src={rightTickIcon.src} alt="" />{user2CorrectAnswer}
                    </span>

                    <span className='wrongAns'>
                      <img src={crossIcon.src} alt="" />{totalQuestions - user2CorrectAnswer}</span>
                  </div>

                  <p> {t("Score")}: {user2point}</p>




                </div>
              </div>
            )
          } else if (user1point < user2point) {
            return (
              <div className='user_data onevsone'>
                <div className='login_winner'>
                  <div className="profileWrapper">

                    <img
                      src={user2image ? user2image : '/images/user.svg'}
                      alt='user'
                      className='showscore-userprofile'
                      onError={imgError}
                    />
                    <img src={winnerBadge.src} alt="winnerBadge" className='wonbadge' />

                  </div>

                  <p>{user2name}</p>

                  <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                    <span className='rightAns'>
                      <img src={rightTickIcon.src} alt="" />{user2CorrectAnswer}
                    </span>

                    <span className='wrongAns'>
                      <img src={crossIcon.src} alt="" />{totalQuestions - user2CorrectAnswer}</span>
                  </div>

                  <p> {t("Score")}: {user2point}</p>

                </div>

                {/* vs */}
                <div className='versus_screen'>
                  <img src={showScoreVsImg.src} alt='versus' />
                </div>

                <div className='opponet_loser'>
                  <div className="profileWrapper">

                    <img
                      src={user1image ? user1image : '/images/user.svg'}
                      alt='user'
                      className='showscore-userprofile'
                      onError={imgError}
                    />

                  </div>

                  <p>{user1name}</p>

                  <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                    <span className='rightAns'>
                      <img src={rightTickIcon.src} alt="" />{user1CorrectAnswer}
                    </span>

                    <span className='wrongAns'>
                      <img src={crossIcon.src} alt="" />{totalQuestions - user1CorrectAnswer}</span>
                  </div>

                  <p> {t("Score")}: {user1point}</p>

                </div>
              </div>
            )
          } else if (user1point == user2point) {
            return (
              <div className='user_data onevsone'>
                <div className='login_winner'>
                  <div className="profileWrapper">

                    <img
                      src={user1image ? user1image : '/images/user.svg'}
                      alt='user'
                      className='showscore-userprofile'
                      onError={imgError}
                    />

                  </div>


                  <p>{user1name}</p>

                  <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                    <span className='rightAns'>
                      <img src={rightTickIcon.src} alt="" />{user1CorrectAnswer}
                    </span>

                    <span className='wrongAns'>
                      <img src={crossIcon.src} alt="" />{totalQuestions - user1CorrectAnswer}</span>
                  </div>

                  <p> {t("Score")}: {user1point}</p>

                </div>

                {/* vs */}
                <div className='versus_screen'>
                  <img src={showScoreVsImg.src} alt='versus' />
                </div>

                <div className='opponet_loser'>
                  <div className="profileWrapper">

                    <img
                      src={user2image ? user2image : '/images/user.svg'}
                      alt='user'
                      className='showscore-userprofile'
                      onError={imgError}
                    />

                  </div>

                  <p>{user2name}</p>


                  <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                    <span className='rightAns'>
                      <img src={rightTickIcon.src} alt="" />{user2CorrectAnswer}
                    </span>

                    <span className='wrongAns'>
                      <img src={crossIcon.src} alt="" />{totalQuestions - user2CorrectAnswer}</span>
                  </div>

                  <p> {t("Score")}: {user2point}</p>

                </div>
              </div>
            )
          }
        })()}
      </div>

      <div className='dashoptions row text-center'>
        {reviewAnswer ? (
          <div className='audience__poll col-12 col-sm-6 col-md-4 col-lg-4 custom-dash'>
            <button className='btn btn-primary' onClick={onReviewAnswersClick}>
              {t('Review Answers')}
            </button>
          </div>
        ) : (
          ''
        )}
        <div className='resettimer col-12 col-sm-6 col-md-4 col-lg-4 custom-dash'>
          <button className='btn btn-primary' onClick={goBack}>
            {t('Back')}
          </button>
        </div>
        <div className='skip__questions col-12 col-sm-6 col-md-4 col-lg-4 custom-dash'>
          <button className='btn btn-primary' onClick={goToHome}>
            {t('Home')}
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

ShowScore.propTypes = {
  coins: PropTypes.number.isRequired
}
export default withTranslation()(ShowScore)
