"use client"
import { t } from 'i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from 'src/components/Common/Breadcrumb'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const LatextReviewAnswer = dynamic(() => import('src/components/Common/LatextReviewAnswer'), { ssr: false })
import { questionsData } from 'src/store/reducers/tempDataSlice'

const Index = () => {

    const navigate = useRouter()

    const questions = useSelector(questionsData)

    const handleReviewAnswerBack = () => {
        navigate.push("/self-learning/result")
    }

    return (
        <Layout>
            <Breadcrumb title={t('Self Learning')} content="" contentTwo="" />
            <div className='dashboard selflearnig-play'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <LatextReviewAnswer
                                    reportquestions={true}
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