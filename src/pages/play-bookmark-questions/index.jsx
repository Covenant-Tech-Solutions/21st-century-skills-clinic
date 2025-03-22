"use client"
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { getbookmarkApi } from 'src/store/actions/campaign'
import { useRouter } from 'next/navigation'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import Question from 'src/components/Common/Question'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const BookmarkPlay = ({ t }) => {
  const navigate = useRouter()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const [showBackButton, setShowBackButton] = useState(false)

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = parseInt(systemconfig.quiz_zone_duration)

  useEffect(() => {
    getNewQuestions()
  }, [])

  // bookmark api
  const getNewQuestions = () => {
    getbookmarkApi(
      1,
      response => {
        let questions = response.data.map(data => ({
          ...data,
          isBookmarked: false,
          selected_answer: '',
          isAnswered: false
        }))
        setQuestions(questions)
        if (questions?.length === 0) {
          toast.error(t('No Data Found'))
          navigate.push('/')
        }
      },
      error => {
        toast.error(t('No Questions Found'))
        console.log(error)
      }
    )
  }

  //answer option click
  const handleAnswerOptionClick = (questions, score) => {
    setQuestions(questions)
  }

  //back button question end
  const onQuestionEnd = () => {
    setShowBackButton(true)
  }

  //go back button
  const goBack = () => {
    navigate.push('/profile/bookmark')
  }

  return (
    <Layout>
      <Breadcrumb title={t('BookmarkPlay')} content="" contentTwo="" />
      <div className='dashboard'>
        <div className='container'>
          <div className='row morphisam'>
            <div className='whitebackground'>
              {(() => {
                if (showBackButton) {
                  return (
                    <div className='dashoptions'>
                      <div className='resettimer'>
                        <button className='btn' onClick={goBack}>
                          {t('Back')}
                        </button>
                      </div>
                    </div>
                  )
                } else {
                  return questions && questions?.length > 0 ? (
                    <Question
                      questions={questions}
                      timerSeconds={TIMER_SECONDS}
                      onOptionClick={handleAnswerOptionClick}
                      onQuestionEnd={onQuestionEnd}
                      showLifeLine={false}
                      showBookmark={false}
                    />
                  ) : (
                    <div className='text-center text-white'>
                      <Skeleton count={5} />
                    </div>
                  )
                }
              })()}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(BookmarkPlay)
