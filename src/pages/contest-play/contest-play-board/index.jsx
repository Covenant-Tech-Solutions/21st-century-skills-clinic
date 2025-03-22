"use client"
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { resultTempDataSuccess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { contestQuestionsApi } from 'src/store/actions/campaign'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import ContestPlayQuestions from 'src/components/Quiz/ContestPlay/ContestPlayQuestions'

const ContestPlayBoard = () => {

  let getData = useSelector(selecttempdata)

  const navigate = useRouter()

  const dispatch = useDispatch()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.contest_id)
    }
  }, [])

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = parseInt(systemconfig.quiz_zone_duration)

  const getNewQuestions = contest_id => {
    contestQuestionsApi(
      contest_id,
      response => {
        let questions = response.data.map(data => {
          return {
            ...data,
            selected_answer: '',
            isAnswered: false
          }
        })
        setQuestions(questions)
      },
      error => {
        toast.error(t('No Questions Found'))
        navigate.push('/all-games')
        console.log(error)
      }
    )
  }

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }

  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: coins,
      quizScore: quizScore,
      playAgain: false,
      nextlevel: false
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/contest-play/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('Contest PlayBoard')} content="" contentTwo="" />
      <div className='funandlearnplay dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <>
                  {(() => {
                    if (questions && questions?.length >= 0) {
                      return (
                        <ContestPlayQuestions
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
                </>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(ContestPlayBoard)
