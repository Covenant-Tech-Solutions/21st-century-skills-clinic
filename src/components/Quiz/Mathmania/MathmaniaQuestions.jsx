import React, { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import Bookmark from 'src/components/Common/Bookmark'
import { withTranslation } from 'react-i18next'
import Timer from "src/components/Common/Timer";
import {
  decryptAnswer,
  calculateScore,
  calculateCoins,
  getAndUpdateBookmarkData,
  deleteBookmarkByQuestionID,
  imgError,
  showAnswerStatusClass,
  audioPlay
} from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { setbookmarkApi, setQuizCategoriesApi, UserCoinScoreApi, UserStatisticsApi } from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { LoadQuizZoneCompletedata, percentageSuccess, questionsDataSuceess, resultTempDataSuccess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import rightTickIcon from '../../../assets/images/check-circle-score-screen.svg'
import crossIcon from '../../../assets/images/x-circle-score-screen.svg'
import { useRouter } from 'next/router'
import { t } from 'i18next'

const MathmaniaQuestions = ({
  questions: data,
  timerSeconds,
  onOptionClick,
  showBookmark,
}) => {
  const [questions, setQuestions] = useState(data)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [corrAns, setCorrAns] = useState(0)
  const [inCorrAns, setInCorrAns] = useState(0)
  const child = useRef(null)
  const scroll = useRef(null)

  const Score = useRef(0)

  const systemconfig = useSelector(sysConfigdata)

  const dispatch = useDispatch();

  const router = useRouter()

  // store data get
  const userData = useSelector(state => state.User)

  let getData = useSelector(selecttempdata)

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
      userScore = await calculateScore(result_score, questions?.length, systemconfig?.maths_quiz_correct_answer_credit_score, systemconfig?.maths_quiz_wrong_answer_deduct_score)
      let status = '0'
      if (percentage >= Number(systemconfig.quiz_winning_percentage)) {
        coins = await calculateCoins(Score.current, questions?.length)
        if (getData.is_play === "0") {
          UserCoinScoreApi(
            coins,
            userScore,
            null,
            'Math Mania Quiz Win',
            status,
            response => {
              updateUserDataInfo(response.data)
            },
            error => {
              console.log(error)
            }
          )
        }
      } else {
        if (getData.is_play === "0") {
          UserCoinScoreApi(
            null,
            userScore,
            null,
            'Math Mania Quiz lose',
            status,
            response => {
              updateUserDataInfo(response.data)
            },
            error => {
              console.log(error)
            }
          )
        }
      }
      // setTimeout(async () => {
      await onQuestionEnd(coins, userScore)
      // }, 2000)
      // set quiz categories
      if (getData.is_play === '0') {
        if (getData.maincat_id && getData.id) {
          setQuizCategoriesApi(
            5,
            getData.maincat_id,
            getData.id,
            '',
            success => { },
            error => {
              console.log(error)
            }
          )
        } else {
          setQuizCategoriesApi(
            5,
            getData.id,
            '',
            '',
            success => { },
            error => {
              console.log(error)
            }
          )
        }
      }
    }
  }

  const onQuestionEnd = async (coins, userScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: coins,
      quizScore: userScore,
    };
    dispatch(resultTempDataSuccess(tempData));
    await router.push("/math-mania/result")
  }


  // button option answer check
  const handleAnswerOptionClick = async selected_option => {
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
      setTimeout(async () => {
        await setNextQuestion()
      }, 1000)
      dispatch(percentageSuccess(result_score))
      onOptionClick(update_questions, result_score)
      dispatch(questionsDataSuceess(update_questions));
    }
  }

  // option answer status check
  const setAnswerStatusClass = option => {
    const currentIndex = currentQuestion;
    const currentQuestionq = questions[currentIndex];
    const color = showAnswerStatusClass(option, currentQuestionq.isAnswered, currentQuestionq.answer, currentQuestionq.selected_answer)
    return color
  }

  const handleBookmarkClick = (question_id, isBookmarked) => {
    let type = 5
    let bookmark = '0'

    if (isBookmarked) bookmark = '1'
    else bookmark = '0'

    return setbookmarkApi(
      question_id,
      bookmark,
      type,
      response => {
        if (response.error) {
          toast.error(t('Cannot Remove Question from Bookmark'))
          return false
        } else {
          if (isBookmarked) {
            getAndUpdateBookmarkData(type)
          } else {
            deleteBookmarkByQuestionID(question_id)
          }
          return true
        }
      },
      error => {
        console.error(error)
      }
    )
  }

  const onTimerExpire = () => {
    setNextQuestion()
    setInCorrAns(inCorrAns + 1)

  }
  useEffect(() => {
    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;
    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect)
  }, [corrAns, inCorrAns])

  return (
    <React.Fragment>
      <div className='dashboardPlayUppDiv funLearnQuestionsUpperDiv text-end p-2 pb-0'>

        <div className="leftSec">
          <div className="coins">
            <span>{t("Coins")} : {userData?.data?.coins}</span>
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
          {showBookmark ? (
            <Bookmark
              id={questions[currentQuestion].id}
              isBookmarked={questions[currentQuestion].isBookmarked ? questions[currentQuestion].isBookmarked : false}
              onClick={handleBookmarkClick}
            />
          ) : (
            ''
          )}
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

            <div>
            </div>
          </div>
        </div>


        <div className='content__text'>
          <p className='question-text pt-4'>{questions[currentQuestion].question}</p>
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
                    {questions[currentQuestion].probability_a ? (
                      <div className='col text-end'>{questions[currentQuestion].probability_a}</div>
                    ) : (
                      ''
                    )}
                  </div>
                </button>
              </div>
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
                    {questions[currentQuestion].probability_b ? (
                      <div className='col text-end'>{questions[currentQuestion].probability_b}</div>
                    ) : (
                      ''
                    )}
                  </div>
                </button>
              </div>
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
                        {questions[currentQuestion].probability_c ? (
                          <div className='col text-end'>{questions[currentQuestion].probability_c}</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </button>
                  </div>
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
                        {questions[currentQuestion].probability_d ? (
                          <div className='col text-end'>{questions[currentQuestion].probability_d}</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </button>
                  </div>
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
                          {questions[currentQuestion].probability_e ? (
                            <div className='col' style={{ textAlign: 'right' }}>
                              {questions[currentQuestion].probability_e}
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </button>
                    </div>
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
        {/* <div className='divider'>
          <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
        </div> */}

      </div>
    </React.Fragment>
  )
}

MathmaniaQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired
}

MathmaniaQuestions.defaultProps = {
  showBookmark: true
}

export default withTranslation()(MathmaniaQuestions)
