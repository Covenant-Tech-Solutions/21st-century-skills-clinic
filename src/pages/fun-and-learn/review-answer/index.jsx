"use client"
import { t } from 'i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from 'src/components/Common/Breadcrumb'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const ReviewAnswer = dynamic(() => import('src/components/Common/ReviewAnswer'), { ssr: false })
import { questionsData } from 'src/store/reducers/tempDataSlice'

const Index = () => {

    const navigate = useRouter()

    const questions = useSelector(questionsData)

    const handleReviewAnswerBack = () => {
        navigate.push("/fun-and-learn/result")
    }

    return (
        <Layout>
            <Breadcrumb title={t('Quiz Play')} content="" contentTwo="" />
            <div className='dashboard'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <ReviewAnswer
                                    reportquestions={false}
                                    reviewlevel={false}
                                    questions={questions}
                                    showLevel={false}
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