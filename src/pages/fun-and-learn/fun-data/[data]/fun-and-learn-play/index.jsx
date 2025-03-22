"use client"
import { useEffect, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { funandlearnquestionsApi } from 'src/store/actions/campaign'
import FunandLearnQuestions from 'src/components/Quiz/Fun_and_Learn/FunandLearnQuestions'
import { useRouter } from 'next/router'
import { resultTempDataSuccess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { t } from 'i18next'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const FunandLearnPlay = () => {

  let getData = useSelector(selecttempdata)

  console.log({getData});

  const navigate = useRouter()

  const dispatch = useDispatch()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const [detail, setDetail] = useState(true)

  // store data get
  const systemconfig = useSelector(sysConfigdata)

  const timerseconds = Number(systemconfig.fun_and_learn_time_in_seconds)

  const TIMER_SECONDS = timerseconds

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.id)
    }
  }, [])

  const getNewQuestions = fun_n_learn_id => {
    funandlearnquestionsApi(
      fun_n_learn_id,
      response => {
        let questions = response.data.map(data => {
          return {
            ...data,
            selected_answer: '',
            isAnswered: false
          }
        })
        setQuestions(questions)
      },
      error => {
        toast.error(t('No Questions Found'))
        // router.push('/all-games')
        console.log(error)
      }
    )
  }

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }




  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: coins,
      quizScore: quizScore,
      playAgain: false,
      nextlevel: false
    };



    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/fun-and-learn/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('Fun and Learn Play')} content="" contentTwo="" />
      <div className='funandlearnplay dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              {detail ? (
                <div className='text-center my-5 funLearnTextData'>
                  <h2 className='funLearntitle'>{getData?.title}</h2>
                  <iframe width="100%" height="280" src={getData?.content_data} title={getData?.title} frameborder="0" autoplay allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                  {/* <iframe width="420" height="315"
                      src={getData?.content_data}>
                  </iframe> */}
                  {/* <div dangerouslySetInnerHTML={{ __html: getData && getData?.content_data }}></div> */}
                  <div
                    className='fun__title text-center pb-3 mt-3'
                    dangerouslySetInnerHTML={{ __html: getData && getData?.detail }}
                  ></div>                  
                  <button className='btn btn-primary playBtn' onClick={e => setDetail(false)}>
                    {t('Start Quiz')}
                  </button>
                </div>
              ) : (
                <div className='whitebackground pt-3'>
                  {(() => {
                    if (questions && questions?.length >= 0) {
                      return (
                        <FunandLearnQuestions
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAnswerOptionClick}
                          onQuestionEnd={onQuestionEnd}
                          showQuestions={false}
                          showLifeLine={false}
                          showGuesstheword={false}
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
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(FunandLearnPlay)
