"use client"
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import ShowScore from 'src/components/Common/ShowScore'
import { t } from 'i18next'
import { getQuizEndData, selectPercentage, selectResultTempData } from 'src/store/reducers/tempDataSlice'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const DailyQuizDashboard = () => {

    const navigate = useRouter()

    const showScore = useSelector(selectResultTempData);

    const percentageScore = useSelector(selectPercentage)

    const resultScore = useSelector(getQuizEndData)

    const goBack = () => {
        navigate.push('/all-games')
    }

    return (
        <Layout>
            <Breadcrumb title={t('Daily Quiz')} content="" contentTwo="" />
            <div className='dashboard'>
                <div className='container'>
                    <div className='row'>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <ShowScore
                                    score={percentageScore}
                                    totalQuestions={showScore.totalQuestions}
                                    goBack={goBack}
                                    showQuestions={showScore.showQuestions}
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

export default withTranslation()(DailyQuizDashboard)
