"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { resultTempDataSuccess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { getexamModuleQuestionsApi } from 'src/store/actions/campaign'
import { useRouter } from 'next/router'
import ExamQuestion from 'src/components/Quiz/Exammodule/ExamQuestion'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const ExamModulePlay = () => {

  let getData = useSelector(selecttempdata)

  const navigate = useRouter()

  const TIMER_SECONDS = Number(getData.duration * 60)

  const [questions, setQuestions] = useState([{ id: '' }])

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.id)
    }
  }, [])

  const getNewQuestions = id => {
    getexamModuleQuestionsApi(
      id,
      response => {
        let questions = response.data.map(data => {

          let question = data.question

          let note = data?.note

          return {
            ...data,
            note: note,
            question: question,
            selected_answer: '',
            isAnswered: false
          }
        })
        const arrangedQuestions = arrangeQuestions(questions);
        setQuestions(arrangedQuestions)
      },
      error => {
        toast.error(t('No Questions Found'))
        navigate.push('/all-games')
      }
    )
  }

  const arrangeQuestions = (questions) => {
    const arrangedQuestions = [];
    const marks = [...new Set(questions.map(q => q.marks))].sort((a, b) => a - b);

    for (const questionMark of marks) {
      const filteredQuestions = questions.filter(q => q.marks === questionMark);
      arrangedQuestions.push(...filteredQuestions);
    }

    return arrangedQuestions;
  };

  const handleAnswerOptionClick = (questions, score) => {
    setQuestions(questions)
  }


  return (
    <Layout>
      <Breadcrumb title={t('Exam Module')} content="" contentTwo="" />
      <div className='dashboard selflearnig-play'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                {(() => {
                  if (questions && questions?.length >= 0) {
                    return (
                      <ExamQuestion
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
                        showQuestions={true}
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
export default withTranslation()(ExamModulePlay)
