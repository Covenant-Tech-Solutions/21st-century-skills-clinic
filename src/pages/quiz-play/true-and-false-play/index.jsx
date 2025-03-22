"use client"
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { trueandfalsequestionsApi, UserCoinScoreApi } from 'src/store/actions/campaign'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { useRouter } from 'next/router'
import { resultTempDataSuccess, reviewAnswerShowSuccess } from 'src/store/reducers/tempDataSlice'
import dynamic from 'next/dynamic'
import TrueandFalseQuestions from 'src/components/Quiz/TrueandFalse/TrueandFalseQuestions'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const TrueandFalsePlay = ({ t }) => {
  //questions
  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  //location
  const navigate = useRouter()

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = Number(systemconfig?.true_false_quiz_in_seconds)

  const dispatch = useDispatch()

  useEffect(() => {
    getTrueandFalseQuestions()
    dispatch(reviewAnswerShowSuccess(false))
  }, [])

  //api
  const getTrueandFalseQuestions = () => {
    trueandfalsequestionsApi(
      2,
      response => {
        if (response.data && !response.data.error) {
          let questions = response.data.map((data) => {

            let question = data.question

            let note = data?.note

            return {
              ...data,
              note: note,
              question: question,
              selected_answer: "",
              isAnswered: false,
            };
          });
          setQuestions(questions)
        }
      },
      error => {
        toast.error(t('No Questions Found'))
        navigate.push('/all-games')
      }
    )
  }

  //answer option click
  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }

  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: coins,
      quizScore: quizScore,
      showQuestions: true,
      reviewAnswer: true,
      playAgain: true,
      nextlevel: false,
      question: questions,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/quiz-play/true-and-false-play/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('True & False')} content="" contentTwo="" />
      <div className='true_and_false dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                {(() => {
                  if (questions && questions?.length >= 0) {
                    return (
                      <TrueandFalseQuestions
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
                        onQuestionEnd={onQuestionEnd}
                      />
                    )
                  } else {
                    return (
                      <div className='text-center text-white'>
                        <p>{'No Questions Found'}</p>
                      </div>
                    )
                  }
                })()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(TrueandFalsePlay)
