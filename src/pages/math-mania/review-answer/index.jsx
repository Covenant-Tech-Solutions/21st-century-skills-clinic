"use client"
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { questionsData } from 'src/store/reducers/tempDataSlice'
import Mathmaniareviewanswer from 'src/components/Quiz/Mathmania/Mathmaniareviewanswer'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const MathmaniaPlay = () => {

    const navigate = useRouter()

    const questions = useSelector(questionsData)

    const handleReviewAnswerBack = () => {
        navigate.push("/math-mania/result")
    }

    return (
        <Layout>
            <Breadcrumb title={t('MathmaniaPlay')} content="" contentTwo="" />
            <div className='funandlearnplay MathmaniaPlay dashboard'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <Mathmaniareviewanswer
                                    reportquestions={false}
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
export default withTranslation()(MathmaniaPlay)
