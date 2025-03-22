"use client"
import { useEffect, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { dailyQuizApi, getusercoinsApi, setBadgesApi, UserCoinScoreApi } from "src/store/actions/campaign";
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { badgesData, LoadNewBadgesData } from 'src/store/reducers/badgesSlice'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import DailyQuizQuestions from 'src/components/Quiz/DailyQuiz/DailyQuizQuestions'
import { reviewAnswerShowSuccess } from 'src/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'

const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const DailyQuizDashboard = ({ t }) => {

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const systemconfig = useSelector(sysConfigdata)

  const dispatch = useDispatch()

  const navigate = useRouter()

  const Badges = useSelector(badgesData)

  const thirstyBadge = Badges?.data?.find(badge => badge?.type === 'thirsty');

  const thirsty_status = thirstyBadge && thirstyBadge?.status

  const thirsty_coin = thirstyBadge && thirstyBadge?.badge_reward

  let timerseconds = parseInt(systemconfig.quiz_zone_duration);

  const TIMER_SECONDS = timerseconds;

  useEffect(() => {
    getNewQuestions()
    dispatch(reviewAnswerShowSuccess(false))
  }, [])

  const getNewQuestions = () => {
    dailyQuizApi(
      (response) => {
        if (response.data && !response.data.error) {
          let questions = response.data.map((data) => {

            let question = data.question

            let note = data?.note

            return {
              ...data,
              note: note,
              question: question,
              selected_answer: "",
              isAnswered: false,
            };
          });
          // console.log("que",questions)
          setQuestions(questions);
        }
      },
      (error) => {
        if (error === "112") {
          toast.error(t("You have Already Taken Today's Quiz"));
          navigate.push('/all-games')
          return false;
        }

        if (error === "102") {
          toast.error(t("No Questions Available For Today"));
          navigate.push("/all-games");

          return false;;
        }

      }
    );
  };




  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }


  useEffect(() => {
    if (thirsty_status === '0') {
      setBadgesApi(
        'thirsty',
        (res) => {
          LoadNewBadgesData('thirsty', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            thirsty_coin,
            null,
            null,
            t('thirsty badge reward'),
            status,
            response => {
              getusercoinsApi(
                responseData => {
                  updateUserDataInfo(responseData.data)
                },
                error => {
                  console.log(error)
                }
              )
            },
            error => {
              console.log(error)
            }
          )
        },
        error => {
          console.log(error)
        }
      )
    }
  }, [])



  return (
    <Layout>
      <Breadcrumb title={t('Daily Quiz')} content="" contentTwo="" />
      <div className='dashboard'>
        <div className='container'>
          <div className='row'>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                {(() => {
                  if (questions && questions?.length >= 0) {
                    return (
                      <DailyQuizQuestions
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
                        showQuestions={true}
                        showLifeLine={true}
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
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(DailyQuizDashboard)
