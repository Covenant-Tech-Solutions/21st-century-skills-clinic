"use client"
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import LatextReviewAnswer from 'src/components/Common/LatextReviewAnswer'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { questionsData } from 'src/store/reducers/tempDataSlice'

const Index = () => {

  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push("/quiz-play/true-and-false-play/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('Daily Quiz')} content="" contentTwo="" />
      <div className='dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <LatextReviewAnswer
                  showLevel={false}
                  reviewlevel={false}
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