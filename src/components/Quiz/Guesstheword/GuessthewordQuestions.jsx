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
  audioPlay,
  audioPlayGuessthework
} from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { settingsData, sysConfigdata } from 'src/store/reducers/settingsSlice'
import {
  getusercoinsApi,
  setBadgesApi,
  setbookmarkApi,
  setQuizCategoriesApi,
  UserCoinScoreApi,
  UserStatisticsApi
} from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import Skeleton from 'react-loading-skeleton'
import { badgesData, LoadNewBadgesData } from 'src/store/reducers/badgesSlice'
import { LoadQuizZoneCompletedata, percentageSuccess, questionsDataSuceess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { useRouter } from 'next/navigation'
import rightTickIcon from '../../../assets/images/check-circle-score-screen.svg'
import crossIcon from '../../../assets/images/x-circle-score-screen.svg'

const GuessthewordQuestions = ({
  t,
  questions: data,
  timerSeconds,
  onOptionClick,
  onQuestionEnd,
  showBookmark,
}) => {
  const [questions, setQuestions] = useState(data)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [corrAns, setCorrAns] = useState(0)
  const [inCorrAns, setInCorrAns] = useState(0)
  const child = useRef(null)
  const scroll = useRef(null)

  // start of logic guess the word
  const [random, setRandom] = useState()
  const [input, setInput] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }, [loading])

  // store data get
  const userData = useSelector(state => state.User)

  const systemconfig = useSelector(sysConfigdata)

  const dispatch = useDispatch()

  const Score = useRef(0)

  const guess_the_word_max_winning_coin = systemconfig?.guess_the_word_max_winning_coin

  const guess_the_word_max_hints_counter = systemconfig?.guess_the_word_max_hints

  let getData = useSelector(selecttempdata)

  const Badges = useSelector(badgesData)

  const super_sonicBadge = Badges?.data?.find(badge => badge?.type === 'super_sonic');

  const super_sonic_status = super_sonicBadge && super_sonicBadge?.status

  const super_sonic_coin = super_sonicBadge && super_sonicBadge?.badge_reward

  const btndisabled = false

  const navigate = useRouter()

  const answer = questions[currentQuestion].answer
    ? decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
    : ''

  //suffle answer
  const shuffle = arr => {
    for (let i = arr?.length - 1; i > 0; i--) {
      let temp = arr[i]
      let j = Math.floor(Math.random() * (i + 1))
      arr[i] = arr[j]
      arr[j] = temp
    }
    return arr
  }

  useEffect(() => {
    setRandom(
      shuffle(
        answer
          .toUpperCase()
          .replace(/\s/g, '')
          .split('')
          .map((val, i) => {
            return { value: val, ansIndex: i }
          })
      )
    )

    setInput(
      answer
        .toUpperCase()
        .replace(/\s/g, '')
        .split('')
        .map(() => {
          return { value: '', index: null }
        })
    )
  }, [answer])

  //array to string convert
  const arrtostr = () => {
    let str = input.map(obj => {
      return obj.value
    })
    let newstr = str.join('')
    return newstr
  }

  //focus input
  const useActiveElement = () => {
    const [active, setActive] = useState(document.activeElement)
    const handleFocusIn = e => {
      setActive(document.activeElement)
    }
    useEffect(() => {
      document.addEventListener('focusin', handleFocusIn)
      return () => {
        document.removeEventListener('focusin', handleFocusIn)
      }
    }, [])
    return active
  }

  //focus states and input states
  const focusedElement = useActiveElement()
  // console.log("hello",focusedElement)
  const [actIndex, setActIndex] = useState(0)
  const [news, setNew] = useState(false)
  const [hintDisabled, setHintDisabled] = useState(1)
  const coninsUpdate = userData && userData?.data?.coins

  //focus useeffect
  useEffect(() => {
    if (focusedElement) {
      focusedElement.value
      const val = parseInt(focusedElement.getAttribute('data-index'))
      if (!isNaN(val) && val !== null) {
        setActIndex(val)
      }
    }
  }, [focusedElement])

  useEffect(() => {
    if (actIndex < 0) {
      setActIndex(0)
    }
    if (actIndex > answer?.length) {
      setActIndex(answer?.length - 1)
    }
    if (document.querySelector(`[data-index="${actIndex}"]`) != null) {
      document.querySelector(`[data-index="${actIndex}"]`).focus()
    }
  }, [actIndex])

  // input field data
  const inputfield = () => {
    setNew(prevState => false)
  }

  // button data
  const buttonAnswer = (e, item, btnId) => {
    if (input === null) {
      return
    }
    let newVal = input
    if (newVal[actIndex].value !== '') {
      document.getElementById(`btn-${newVal[actIndex].index}`).disabled = false
    }
    newVal[actIndex].value = item

    newVal[actIndex].index = btnId
    document.getElementById(`btn-${btnId}`).disabled = true
    const index = actIndex
    setActIndex(index + 1)
    setInput(prevState => [...newVal])
    setNew(prevState => true)
  }

  // back button input clear 
  const backinputclear = e => {
    e.preventDefault()
    let newVal = input
    if (news) {
      newVal[actIndex - 1].value = ''
      const buttonElement = document.getElementById(`btn-${newVal[actIndex - 1].index}`)
      if (buttonElement) {
        buttonElement.disabled = false
      }
      setNew(prevState => false)
      newVal[actIndex - 1].value = ''
    } else {
      const buttonElement = document.getElementById(`btn-${newVal[actIndex].index}`)
      if (buttonElement) {
        buttonElement.disabled = false
      }
      newVal[actIndex].value = ''
    }
    setActIndex(prevState => prevState - 1)
    setInput(prevState => [...newVal])
  }

  //random number for hint
  function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }

  // handle hints
  const handleHints = e => {
    let coins = guess_the_word_max_winning_coin && Number(guess_the_word_max_winning_coin)
    if (coninsUpdate === '0') {
      toast.error(t('you dont have enough coins'))
      return false
    }
    if (userData?.data?.coins < coins) {
      toast.error(t("You Don't have enough coins"))
      return false
    }

    let enabledBtnId = new Array()
    random.map((item, i) => {
      if (document.getElementById(`input-${i}`).value === '') {
        enabledBtnId.push(i)
      }
    })
    let ind = null
    if (enabledBtnId?.length != 0) {
      ind = shuffle(enabledBtnId)[0]
    }
    random.map((val, i) => {
      if (val.ansIndex == ind) {
        if (!document.getElementById(`btn-${i}`).disabled) {
          val.ansIndex, document.getElementById(`btn-${i}`).innerText
          let newVal = input
          newVal[val.ansIndex].value = document.getElementById(`btn-${i}`).innerText
          newVal[val.ansIndex].index = i
          const index = val.ansIndex
          document.getElementById(`btn-${i}`).disabled = true
          setActIndex(index + 1)
          setInput(prevState => [...newVal])
          setNew(prevState => true)

          // button disabled
          setHintDisabled(hintDisabled + 1)
          e.currentTarget.disabled = hintDisabled >= Number(guess_the_word_max_hints_counter) ? true : false

          if (userData?.data?.coins < coins) {
            toast.error(t("You Don't have enough coins"))
            return false
          }
          let status = 1
          UserCoinScoreApi(
            '-' + coins,
            null,
            null,
            'Used Guesstheword Hint',
            status,
            response => {
              updateUserDataInfo(response.data)
            },
            error => {
              Swal.fire(t('OOps'), t('Please Try again'), 'error')
              console.log(error)
            }
          )
        }
      }
    })
  }

  //clear all input
  const clearallInput = () => {
    let v = input
    v = v.map(obj => {
      if (obj.index !== null) {
        document.getElementById(`btn-${obj.index}`).disabled = false
      }
      return { ...obj, value: '' }
    })
    setInput(prevState => v)
    setActIndex(0)
  }

  //check answer on submit
  const handleSubmit = () => {
    let inputstr = arrtostr()
    setHintDisabled(0)
    document.getElementById('hntBtn').disabled = false
    clearallInput()
    guessthewordCheck(inputstr)
  }

  // end of logic guess the word

  setTimeout(() => {
    setQuestions(data)
  }, 500)

  const setNextQuestion = async () => {
    const nextQuestion = currentQuestion + 1

    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion)
      child.current.resetTimer()
      clearallInput()
    } else {
      let coins = null
      let userScore = null
      let result_score = Score.current;
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

      userScore = await calculateScore(result_score, questions?.length, systemconfig?.guess_the_word_correct_answer_credit_score, systemconfig?.guess_the_word_wrong_answer_deduct_score)
      // console.log("userScore",userScore,result_score,questions?.length,systemconfig?.guess_the_word_correct_answer_credit_score,systemconfig?.guess_the_word_wrong_answer_deduct_score)
      let status = '0'

      if (percentage >= Number(systemconfig.quiz_winning_percentage)) {
        // console.log("questions",Score.current, questions?.length)
        coins = await calculateCoins(Score.current, questions?.length)
        if (getData.is_play === "0") {
          UserCoinScoreApi(
            coins,
            userScore,
            null,
            'GuesstheWord Quiz Win',
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
            'GuesstheWord Quiz Win',
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
      await onQuestionEnd(coins, userScore)

      // set quiz categories
      if (getData.is_play === '0') {
        if (getData.maincat_id && getData.id) {
          setQuizCategoriesApi(
            3,
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
            3,
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

  //guesstheword answer click
  const guessthewordCheck = selected_option => {
    let { id, answer } = questions[currentQuestion]

    let decryptedAnswer = decryptAnswer(answer, userData?.data?.firebase_id).toUpperCase().replaceAll(/\s/g, '')
    let result_score = Score.current
    if (decryptedAnswer === selected_option) {
      result_score++;
      Score.current = result_score
      setCorrAns(corrAns + 1)
      toast.success(t('correct-answer'))
    } else {
      toast.error(t('incorrect-answer'))
      setInCorrAns(inCorrAns + 1)
    }

    // this for only audio
    const currentIndex = currentQuestion;

    const currentQuestionq = questions[currentIndex];

    audioPlayGuessthework(selected_option, currentQuestionq.answer)

    let seconds = child.current.getTimerSeconds()

    let update_questions = questions.map(data => {
      return data.id === id
        ? { ...data, selected_answer: selected_option, isAnswered: true, timer_seconds: seconds }
        : data
    })

    checktotalQuestion(update_questions)
    setQuestions(update_questions)
    setTimeout(() => {
      setNextQuestion()
    }, 1000)

    dispatch(percentageSuccess(result_score))
    onOptionClick(update_questions, result_score)
    dispatch(questionsDataSuceess(update_questions));

  }

  const handleBookmarkClick = (question_id, isBookmarked) => {
    let type = 3
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

  // super sonic badge logic
  const checktotalQuestion = update_question => {
    if (questions?.length < 5) {
      return
    }
    const allTimerSeconds = update_question
      .map(quizDataObj => quizDataObj.timer_seconds)
      .filter(timerSeconds => timerSeconds <= 20)
    if (super_sonic_status === '0' && allTimerSeconds?.length == 5) {
      setBadgesApi(
        'super_sonic',
        (res) => {
          LoadNewBadgesData('super_sonic', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            super_sonic_coin,
            null,
            null,
            t('super sonic badge reward'),
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
  // for update correct and incorrect ans in redux 
  useEffect(() => {

    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;

    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect)

  }, [corrAns, inCorrAns])
  return (
    <>
      <div className='dashboardPlayUppDiv selfLearnQuestionsUpperDiv guessWordQuestionsUpperDiv text-end p-2 pb-0'>
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
          <div className="p-2 pb-0">
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
      </div>
      <div className='questions guessthewordque' ref={scroll}>
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
          <p className='question-text pt-4'>{questions[currentQuestion].question}</p>
        </div>

        {questions[currentQuestion].image ? (
          <div className='imagedash'>
            <img src={questions[currentQuestion].image} onError={imgError} alt='' />
          </div>
        ) : (
          ''
        )}

        {loading ? (
          <div className='text-center'>
            <Skeleton count={5} />
          </div>
        ) : (
          <>
            {/* {showAnswers ? ( */}
            <div className='guess_the_word_comp'>
              <span className='input_box'>
                {random &&
                  random.map((data, index) => {
                    return (
                      <input
                        key={index}
                        data-index={index}
                        type='text'
                        value={input[index].value}
                        id={`input-${index}`}
                        onClick={() => inputfield()}
                        className='custom_input'
                        readOnly
                      />
                    )
                  })}
              </span>
              <div className='col-md-12 col-12 button_area my-4'>
                <ul>
                  {random ? (
                    random.map((item, i) => {
                      return (
                        <li key={i}>
                          <button
                            className='btn btn-primary buttondata'
                            id={`btn-${i}`}
                            onClick={e => buttonAnswer(e, item.value, i)}
                          >
                            {item.value}
                          </button>
                        </li>
                      )
                    })
                  ) : (
                    <div className='text-center'>
                      <Skeleton count={5} />
                    </div>
                  )}
                </ul>
              </div>
              <div className='divider'>
                <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
              </div>
              <div className='bottom_button dashoptions mb-4 guessTheWordOtions'>
                <div className='clear_input'>
                  <button className='btn btn-primary' onClick={e => backinputclear(e)}>
                    {t("Back")}
                  </button>
                </div>
                <div className='hint_button'>
                  <button
                    id='hntBtn'
                    className='btn btn-primary'
                    disabled={btndisabled ? true : false}
                    onClick={e => handleHints(e)}
                  >
                    {t('Hint')}
                  </button>
                </div>
                <div className='submit_button'>
                  <button className='btn btn-primary' onClick={() => handleSubmit()}>
                    {t('Submit')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

GuessthewordQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired
}

GuessthewordQuestions.defaultProps = {
  showBookmark: true
}

export default withTranslation()(GuessthewordQuestions)
