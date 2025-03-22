import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { easeQuadInOut } from 'd3-ease'
import AnimatedProgressProvider from 'src/utils/AnimatedProgressProvider'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { imgError } from 'src/utils'
import { examCompletedata, getexamsetQuiz, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { setExammoduleresultApi } from 'src/store/actions/campaign'
import { useRouter } from 'next/navigation'
import rightTickIcon from '../../../assets/images/check-circle-score-screen.svg'
import crossIcon from '../../../assets/images/x-circle-score-screen.svg'
import { websettingsData } from 'src/store/reducers/webSettings'

const ExamScore = ({ t, score, totalQuestions }) => {

  const navigate = useRouter()

  const percentage = (score * 100) / totalQuestions

  // store data get
  const userData = useSelector(state => state.User)

  const websettingsdata = useSelector(websettingsData);

  const themecolor = websettingsdata && websettingsdata?.primary_color

  const examData = useSelector(examCompletedata)

  const systemconfig = useSelector(sysConfigdata)

  let getData = useSelector(selecttempdata)

  const examsetquiz = useSelector(getexamsetQuiz)

  const goToHome = () => {
    navigate.push('/')
  }

  const goBack = () => {
    navigate.push('/exam-module')
  }

  useEffect(() => {
    setExammoduleresultApi(
      Number(getData.id),
      examsetquiz.remianingtimer,
      examsetquiz.totalmarks,
      examsetquiz.statistics,
      1,
      '',
      resposne => {
        // console.log(resposne);
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  let newdata = Math.round(percentage)

  return (
    <>

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
                <b>{t(`Great Job!`)} <span>{t(`${userData?.data && userData?.data?.name}`)}</span></b>
              </h4>
              <h5>{t(`Getting Closer to mastery!keep going!`)}</h5>
            </>
          ) : (
            <>
              <h4 className='winlos losText'>
                <b>{t(`Good Effort!`)} <span>{t(`${userData?.data && userData?.data?.name}`)}</span></b>
              </h4>
              <h5>{t(`Getting Closer to mastery!keep going!`)}</h5>
              <span className='percentage'>{newdata} %</span>
            </>
          )}
        </div>

      </div>

      <div className='my-4 align-items-center d-flex scoreCenterDiv'>
        <div className="getCoins">
          <span className='numbr'>{examsetquiz.totalmarks + ' / ' + getData.total_marks}</span>
          <span className='text'>{t("Marks")}</span>
        </div>

        <div className="rightWrongAnsDiv">
          <span className='rightAns'>
            <img src={rightTickIcon.src} alt="" />
            {examData?.Correctanswer}
          </span>

          <span className='wrongAns'>
            <img src={crossIcon.src} alt="" />
            {examData?.InCorrectanswer}
          </span>
        </div>
      </div>
      <div className='dashoptions row text-center'>
        <div className='resettimer col-12 col-sm-6 col-md-2 custom-dash'>
          <button className='btn btn-primary' onClick={goBack}>
            {t('Back')}
          </button>
        </div>
        <div className='skip__questions col-12 col-sm-6 col-md-2 custom-dash'>
          <button className='btn btn-primary' onClick={goToHome}>
            {t('Home')}
          </button>
        </div>
      </div>
    </>
  )
}

ExamScore.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  quizScore: PropTypes.number.isRequired
}
export default withTranslation()(ExamScore)
