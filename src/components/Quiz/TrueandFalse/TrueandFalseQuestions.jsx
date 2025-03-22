"use client"
import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import ProgressBar from 'react-bootstrap/ProgressBar';

import {
  decryptAnswer,
  calculateScore,
  calculateCoins,
  imgError,
  showAnswerStatusClass,
  audioPlay
} from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import {
  UserCoinScoreApi,
  UserStatisticsApi,
} from 'src/store/actions/campaign'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import rightTickIcon from 'src/assets/images/check-circle-score-screen.svg'
import crossIcon from 'src/assets/images/x-circle-score-screen.svg'
import { LoadQuizZoneCompletedata, percentageSuccess, questionsDataSuceess } from 'src/store/reducers/tempDataSlice'
import Timer from 'src/components/Common/Timer';


const TrueandFalseQuestions = ({
  t,
  questions: data,
  timerSeconds,
  onOptionClick,
  onQuestionEnd,
}) => {
  const [questions, setQuestions] = useState(data)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [corrAns, setCorrAns] = useState(0)
  const [inCorrAns, setInCorrAns] = useState(0)
  const child = useRef(null)
  const scroll = useRef(null)

  const systemconfig = useSelector(sysConfigdata)

  const dispatch = useDispatch()

  const Score = useRef(0)

  // store data get
  const userData = useSelector(state => state.User)

  const [answeredQuestions, setAnsweredQuestions] = useState({})

  const addAnsweredQuestion = item => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true })
  }

  setTimeout(() => {
    setQuestions(data)
  }, 500)

  const setNextQuestion = async () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion)
      child.current.resetTimer()
    } else {
      let coins = null
      let userScore = null
      let result_score = Score.current
      let percentage = (100 * result_score) / questions?.length
      UserStatisticsApi(
        questions?.length,
        result_score,
        questions[currentQuestion].category,
        percentage,
        response => { },
        error => {
          console.log(error)
        }
      )
      userScore = await calculateScore(result_score, questions?.length, systemconfig?.true_false_quiz_correct_answer_credit_score, systemconfig?.true_false_quiz_wrong_answer_deduct_score)
      // console.log("userscore",userScore)
      let status = '0'
      if (percentage >= Number(systemconfig.quiz_winning_percentage)) {
        coins = await calculateCoins(Score.current, questions?.length)
          UserCoinScoreApi(
            coins,
            userScore,
            null,
            'True and False Win',
            status,
            response => {
              updateUserDataInfo(response.data)
            },
            error => {
              console.log(error)
            }
          )
      } else {
        UserCoinScoreApi(
          null,
          userScore,
          null,
          'True and False Win',
          status,
          response => {
            updateUserDataInfo(response.data)
          },
          error => {
            console.log(error)
          }
        )
      }
      await onQuestionEnd(coins, userScore)

    }
  }

  // button option answer check
  const handleAnswerOptionClick = selected_option => {
    if (!answeredQuestions.hasOwnProperty(currentQuestion)) {
      addAnsweredQuestion(currentQuestion)

      let { id, answer } = questions[currentQuestion]

      let decryptedAnswer = decryptAnswer(answer, userData?.data?.firebase_id)
      let result_score = Score.current
      if (decryptedAnswer === selected_option) {
        result_score++
        Score.current = result_score
        setCorrAns(corrAns + 1)
      } else {
        setInCorrAns(inCorrAns + 1)
      }

      // this for only audio
      const currentIndex = currentQuestion;

      const currentQuestionq = questions[currentIndex];

      audioPlay(selected_option, currentQuestionq.answer)

      let update_questions = questions.map(data => {
        return data.id === id ? { ...data, selected_answer: selected_option, isAnswered: true } : data
      })
      setQuestions(update_questions)
      setTimeout(() => {
        setNextQuestion()
      }, 1000)
      dispatch(percentageSuccess(result_score))
      onOptionClick(update_questions, result_score)
      dispatch(questionsDataSuceess(update_questions));
    }
  }
  useEffect(() => {

    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;

    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect)

  }, [corrAns, inCorrAns])

  // option answer status check
  const setAnswerStatusClass = option => {
    const currentIndex = currentQuestion;
    const currentQuestionq = questions[currentIndex];
    const color = showAnswerStatusClass(option, currentQuestionq.isAnswered, currentQuestionq.answer, currentQuestionq.selected_answer)
    return color
  }

  const onTimerExpire = () => {
    setNextQuestion()
    setInCorrAns(inCorrAns + 1)

  }


  return (
    <>
      <div className='dashboardPlayUppDiv text-end p-2 pb-0'>

        <div className="leftSec">
          <div className="coins">
            <span>{t("Coins")} : {userData && userData?.data?.coins}</span>
          </div>

          <div className="rightWrongAnsDiv">
            <span className='rightAns'>
              <img src={rightTickIcon.src} alt="" />
              {corrAns}
            </span>

            <span className='wrongAns'>
              <img src={crossIcon.src} alt="" />
              {inCorrAns}
            </span>
          </div>
        </div>

        <div className="rightSec">
          <div className="rightWrongAnsDiv correctIncorrect">
            <span className='rightAns'>
              {currentQuestion + 1} - {questions?.length}</span>
          </div>
        </div>

      </div>
      <div className='questions' ref={scroll}>
        <div className="timerWrapper">

          <div className='inner__headerdash'>
            <div className='inner__headerdash'>
              {questions && questions[0]['id'] !== '' ? (
                <Timer ref={child} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>


        <div className='content__text'>
          <p className='question-text'>{questions[currentQuestion].question}</p>
        </div>

        {questions[currentQuestion].image ? (
          <div className='imagedash'>
            <img src={questions[currentQuestion].image} onError={imgError} alt='' />
          </div>
        ) : (
          ''
        )}

        {/* options */}
        <div className='row optionsWrapper'>
          {questions[currentQuestion].optiona ? (
            <div className='col-md-6 col-12'>
              <div className='inner__questions'>
                <button
                  className={`btn button__ui w-100 ${setAnswerStatusClass('a')}`}
                  onClick={e => handleAnswerOptionClick('a')}
                >
                  <div className='row'>
                    <div className='col'>{questions[currentQuestion].optiona}</div>

                  </div>
                </button>
              </div>
              {questions[currentQuestion].probability_a ? (
                <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_a}
                  <div className="progressBarWrapper">
                    <ProgressBar now={questions[currentQuestion].probability_a.replace('%', '')} visuallyHidden />;
                  </div></div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
          {questions[currentQuestion].optionb ? (
            <div className='col-md-6 col-12'>
              <div className='inner__questions'>
                <button
                  className={`btn button__ui w-100 ${setAnswerStatusClass('b')}`}
                  onClick={e => handleAnswerOptionClick('b')}
                >
                  <div className='row'>
                    <div className='col'>{questions[currentQuestion].optionb}</div>

                  </div>
                </button>

              </div>
              {questions[currentQuestion].probability_b ? (
                <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_b}
                  <div className="progressBarWrapper">
                    <ProgressBar now={questions[currentQuestion].probability_b.replace('%', '')} visuallyHidden />;
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
          {questions[currentQuestion].question_type === '1' ? (
            <>
              {questions[currentQuestion].optionc ? (
                <div className='col-md-6 col-12'>
                  <div className='inner__questions'>
                    <button
                      className={`btn button__ui w-100 ${setAnswerStatusClass('c')}`}
                      onClick={e => handleAnswerOptionClick('c')}
                    >
                      <div className='row'>
                        <div className='col'>{questions[currentQuestion].optionc}</div>

                      </div>
                    </button>
                  </div>
                  {questions[currentQuestion].probability_c ? (
                    <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_c}
                      <div className="progressBarWrapper">
                        <ProgressBar now={questions[currentQuestion].probability_c.replace('%', '')} visuallyHidden />;
                      </div></div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
              {questions[currentQuestion].optiond ? (
                <div className='col-md-6 col-12'>
                  <div className='inner__questions'>
                    <button
                      className={`btn button__ui w-100 ${setAnswerStatusClass('d')}`}
                      onClick={e => handleAnswerOptionClick('d')}
                    >
                      <div className='row'>
                        <div className='col'>{questions[currentQuestion].optiond}</div>

                      </div>
                    </button>

                  </div>
                  {questions[currentQuestion].probability_d ? (
                    <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_d}
                      <div className="progressBarWrapper">
                        <ProgressBar now={questions[currentQuestion].probability_d.replace('%', '')} visuallyHidden />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}

              {systemconfig && systemconfig.option_e_mode && questions[currentQuestion].optione ? (
                <div className='row d-flex justify-content-center mob_resp_e'>
                  <div className='col-md-6 col-12'>
                    <div className='inner__questions'>
                      <button
                        className={`btn button__ui w-100 ${setAnswerStatusClass('e')}`}
                        onClick={e => handleAnswerOptionClick('e')}
                      >
                        <div className='row'>
                          <div className='col'>{questions[currentQuestion].optione}</div>

                        </div>
                      </button>
                    </div>
                    {questions[currentQuestion].probability_e ? (
                      <div className='col' style={{ textAlign: 'right' }}>
                        {questions[currentQuestion].probability_e}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

TrueandFalseQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired
}

TrueandFalseQuestions.defaultProps = {
  showLifeLine: true,
  showBookmark: true
}

export default withTranslation()(TrueandFalseQuestions)
