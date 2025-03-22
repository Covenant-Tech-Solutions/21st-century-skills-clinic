"use client"
import { withTranslation } from 'react-i18next'
import GuessthewordReviewAnswer from 'src/components/Quiz/Guesstheword/GuessthewordReviewAnswer.jsx'
import { useSelector } from 'react-redux'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { useRouter } from 'next/router'
import { questionsData } from 'src/store/reducers/tempDataSlice'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })


const Guessthewordplay = ({ t }) => {

  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push("/guess-the-word/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('Guess the word')} content="" contentTwo="" />
      <div className='funandlearnplay dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <GuessthewordReviewAnswer questions={questions} goBack={handleReviewAnswerBack} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(Guessthewordplay)
