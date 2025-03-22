"use client"
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { easeQuadInOut } from 'd3-ease'
import AnimatedProgressProvider from 'src/utils/AnimatedProgressProvider'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { imgError } from 'src/utils'
import { useRouter } from 'next/navigation'
import Web3 from 'web3'
import rightTickIcon from '../../assets/images/check-circle-score-screen.svg'
import crossIcon from '../../assets/images/x-circle-score-screen.svg'
import { getQuizEndData } from 'src/store/reducers/tempDataSlice'
import { websettingsData } from 'src/store/reducers/webSettings'

function ShowScore({
  t,
  score,
  totalQuestions,
  onPlayAgainClick,
  onReviewAnswersClick,
  onNextLevelClick,
  coins,
  showCoinandScore,
  quizScore,
  currentLevel,
  maxLevel,
  reviewAnswer,
  playAgain,
  nextlevel,
  goBack,
  subCategoryName
}) {
  const navigate = useRouter()
  const percentage = (score * 100) / totalQuestions

  const websettingsdata = useSelector(websettingsData)

  const themecolor = websettingsdata && websettingsdata?.primary_color

  // store data get
  const userData = useSelector(state => state.User)

  const quizEndData = useSelector(getQuizEndData)
  const systemconfig = useSelector(sysConfigdata)
  const goToHome = () => {
    navigate.push('/')
  }

  let newdata = Math.round(percentage)

  const handleClaimSkillPoint = async () => {
    if (localStorage.getItem('walletAddress')) {
      alert(t('Wallet already connected!'))
      return
    }

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const accounts = await web3.eth.getAccounts()
        const walletAddress = accounts[0]

        const message = `BrainBank wants you to claim ${score} skill points for ${subCategoryName}.`
        const signature = await web3.eth.personal.sign(message, walletAddress, '')

        localStorage.setItem('walletAddress', walletAddress)
        alert(t('Wallet connected and skill points claimed successfully!'))
        console.log('Wallet Address:', walletAddress)
        console.log('Signature:', signature)
      } else {
        alert(t('No blockchain wallet detected. Please install MetaMask or another wallet.'))
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert(t('Failed to connect wallet. Please try again.'))
    }
  }

  return (
    <React.Fragment>
      <div className='my-4 row d-flex align-items-center scoreUpperDiv'>
        <div className='col-md-2 col-4 coin_score_screen score-section  text-center bold'>
          <div className='d-inline-block'>
            <AnimatedProgressProvider
              valueStart={0}
              valueEnd={percentage}
              duration={0.2}
              easingFunction={easeQuadInOut}
            >
              {value => {
                return (
                  <CircularProgressbarWithChildren
                    value={newdata}
                    strokeWidth={5}
                    styles={buildStyles({
                      pathTransition: 'none',
                      textColor: themecolor,
                      trailColor: '#f5f5f8',
                      pathColor:
                        percentage >= Number(systemconfig.quiz_winning_percentage) ? '#15ad5a' : themecolor
                    })}
                  >
                    <img
                      src={userData?.data && userData?.data?.profile ? userData?.data?.profile : '/images/user.svg'}
                      alt='user'
                      className='showscore-userprofile'
                      onError={imgError}
                    />
                  </CircularProgressbarWithChildren>
                )
              }}
            </AnimatedProgressProvider>
          </div>
        </div>

        <div className='score-section  text-center bold scoreText'>
          {percentage >= Number(systemconfig.quiz_winning_percentage) ? (
            <>
              <div className='col-4 col-md-2 right_wrong_screen text-center percent_value'>
                <h1 className='winlos percentage'>{newdata}%</h1>
              </div>
              <h4 className='winlos'>
                <b>{t(`Wow, Fantastic Job!`)} <span>{t(`${userData?.data && userData?.data?.name}`)}</span></b>
              </h4>
              <h5>{t(`you've achieved mastery`)}</h5>
            </>
          ) : (
            <>
              <h4 className='winlos losText'>
                <b>{t(`Good Effort!`)} <span>{t(`${userData?.data && userData?.data?.name}`)}</span></b>
              </h4>
              <h5>{t(`Keep Learning`)}</h5>

              <span className='percentage'>{newdata} %</span>
            </>
          )}
        </div>
      </div>

      <div className='my-4 align-items-center d-flex scoreCenterDiv'>
        {showCoinandScore ? (
          <>
            {coins ? (
              <div className="getCoins">
                <span className='numbr'>+ {coins ? coins : '0'}</span>
                <span className='text'>{t("Coins")}</span>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="rightWrongAnsDiv">
          <span className='rightAns'>
            <img src={rightTickIcon.src} alt="" />
            {quizEndData?.Correctanswer}
          </span>

          <span className='wrongAns'>
            <img src={crossIcon.src} alt="" />
            {quizEndData?.InCorrectanswer}
          </span>
        </div>

        {showCoinandScore ? (
          <>
            {quizScore ? (
              <div className="getCoins">
                <span className='numbr'>{quizScore ? quizScore : '0'}</span>
                <span className='text'>{t("Score")}</span>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div className='dashoptions showScoreOptions row text-center'>
        {percentage >= Number(systemconfig.quiz_winning_percentage) && maxLevel !== String(currentLevel) ? (
          nextlevel ? (
            <div className='fifty__fifty col-12 col-sm-6 col-md-3 custom-dash'>
              <button className='btn btn-primary' onClick={onNextLevelClick}>
                {t('Next Level')}
              </button>
            </div>
          ) : (
            ''
          )
        ) : playAgain ? (
          <div className='fifty__fifty col-12 col-sm-6 col-md-3 custom-dash'>
            <button className='btn btn-primary' onClick={onPlayAgainClick}>
              {t('Play Again')}
            </button>
          </div>
        ) : (
          ''
        )}

        {reviewAnswer ? (
          <div className='audience__poll col-12 col-sm-6 col-md-3 custom-dash'>
            <button className='btn btn-primary' onClick={onReviewAnswersClick}>
              {t('Review Answers')}
            </button>
          </div>
        ) : (
          ''
        )}
        <div className='resettimer col-12 col-sm-6 col-md-3 custom-dash'>
          <button className='btn btn-primary' onClick={goBack}>
            {t('Back')}
          </button>
        </div>
        <div className='skip__questions col-12 col-sm-6 col-md-3 custom-dash'>
          <button className='btn btn-primary' onClick={goToHome}>
            {t('Home')}
          </button>
        </div>
      </div>

      <div className='claim-skill-point-container text-center mt-4'>
        <button className='btn btn-skill-point' onClick={handleClaimSkillPoint}>
          {t('Claim Skill Point')}
        </button>
      </div>

      <style jsx>{`
        .btn-skill-point {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .btn-skill-point:hover {
          background-color: #0056b3;
        }
      `}</style>
    </React.Fragment>
  )
}

ShowScore.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  quizScore: PropTypes.number.isRequired,
  subCategoryName: PropTypes.string.isRequired
}

export default withTranslation()(ShowScore)
