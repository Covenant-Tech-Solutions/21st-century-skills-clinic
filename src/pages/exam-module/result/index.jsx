"use client"
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import ExamScore from 'src/components/Quiz/Exammodule/ExamScore'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'
import { getQuizEndData, selectPercentage, selectResultTempData } from 'src/store/reducers/tempDataSlice'
import { useSelector } from 'react-redux'

const ExamModulePlay = () => {

    const percentageScore = useSelector(selectPercentage)

    const showScore = useSelector(selectResultTempData);

    const resultScore = useSelector(getQuizEndData)

    return (
        <Layout>
            <Breadcrumb title={t('Exam Module')} content="" contentTwo="" />
            <div className='dashboard selflearnig-play'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <ExamScore
                                    score={percentageScore}
                                    totalQuestions={showScore.totalQuestions}
                                    coins={showScore.coins}
                                    quizScore={showScore.quizScore}
                                    showQuestions={true}
                                    corrAns={resultScore.Correctanswer}
                                    inCorrAns={resultScore.InCorrectanswer}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default withTranslation()(ExamModulePlay)
