"use client"
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import GuessthewordQuestions from 'src/components/Quiz/Guesstheword/GuessthewordQuestions.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { resultTempDataSuccess } from 'src/store/reducers/tempDataSlice'
import { guessthewordApi } from 'src/store/actions/campaign'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { useRouter } from 'next/router'
import { getBookmarkData } from 'src/utils'
import { t } from 'i18next'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Guessthewordplay = () => {

  const router = useRouter()

  const dispatch = useDispatch()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const systemconfig = useSelector(sysConfigdata)

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.isSubcategory !== '0') {
      getNewQuestions('subcategory', router.query.subcategory_id)
    } else {
      getNewQuestions('category', router.query.category_id)
    }
  }, [router.isReady]);

  const TIMER_SECONDS = Number(systemconfig.guess_the_word_seconds)

  const getNewQuestions = (type, type_id) => {

    guessthewordApi(
      type,
      type_id,
      response => {
        let bookmark = getBookmarkData()
        let questions_ids = Object.keys(bookmark).map(index => {
          return bookmark[index].question_id
        })
        let questions = response.data.map(data => {
          let isBookmark = false
          if (questions_ids.indexOf(data.id) >= 0) {
            isBookmark = true
          } else {
            isBookmark = false
          }
          return {
            ...data,
            isBookmarked: isBookmark,
            selected_answer: '',
            isAnswered: false
          }
        })
        setQuestions(questions)
      },
      error => {
        toast.error(t('No Questions Found'))
        // navigate.push('/')
        console.log(error)
      }
    )
  }

  const handleAnswerOptionClick = async (questions) => {
    setQuestions(questions)
  }

  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: coins,
      quizScore: quizScore,
      question: questions,
      playAgain: false,
      nextlevel: false
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));

    router.push({
      pathname: `/guess-the-word/result`,
    });

  };



  return (
    <Layout>
      <Breadcrumb title={t('Guess the word')} content="" contentTwo="" />
      <div className='funandlearnplay dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <>
                  {(() => {
                    if (questions && questions?.length >= 0) {
                      return (
                        <GuessthewordQuestions
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAnswerOptionClick}
                          onQuestionEnd={onQuestionEnd}
                          showQuestions={false}
                          showLifeLine={false}
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
                </>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(Guessthewordplay)
