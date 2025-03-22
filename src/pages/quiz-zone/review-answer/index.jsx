"use client"
import { t } from 'i18next'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { questionsData } from 'src/store/reducers/tempDataSlice'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const LatextReviewAnswer = dynamic(() => import('src/components/Common/LatextReviewAnswer'), { ssr: false })

const Index = () => {

  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push("/quiz-zone/result")
  }

  return (

    <Layout>
      <Breadcrumb title={t('Quiz Play')} content="" contentTwo="" />
      <div className='dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <LatextReviewAnswer
                  showLevel={true}
                  reviewlevel={true}
                  reportquestions={true}
                  questions={questions}
                  goBack={handleReviewAnswerBack}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>

  )
}

export default Index