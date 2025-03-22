"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb.jsx'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ShowScore from 'src/components/Common/ShowScore.jsx'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getQuizEndData, reviewAnswerShowData, reviewAnswerShowSuccess, selectPercentage, selectResultTempData, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { UserCoinScoreApi } from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { settingsData, sysConfigdata } from 'src/store/reducers/settingsSlice'
import { useRouter } from 'next/router.js'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const MySwal = withReactContent(Swal)

const AudioQuestionsPlay = () => {

  const dispatch = useDispatch()

  const reviewAnserShow = useSelector(reviewAnswerShowData)

  let getData = useSelector(selecttempdata)

  const selectdata = useSelector(settingsData)

  const percentageScore = useSelector(selectPercentage)

  const resultScore = useSelector(getQuizEndData)

  const showScore = useSelector(selectResultTempData);

  const systemconfig = useSelector(sysConfigdata)

  const review_answers_deduct_coin = Number(systemconfig?.review_answers_deduct_coin)

  const router = useRouter()

  const [showCoinandScore, setShowCoinScore] = useState(false)

  useEffect(() => {
    if (getData.is_play === "0") {
      setShowCoinScore(true)
    }
  }, [])

  // store data get

  const userData = useSelector(state => state.User)

  const handleReviewAnswers = () => {
    let coins = review_answers_deduct_coin;
    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t("You Don't have enough coins"));
        return false;
      }
    }

    MySwal.fire({
      title: t("Are you sure"),
      text: !reviewAnserShow ? review_answers_deduct_coin + " " + t("Coins will be deducted from your account") : null,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: 'Swal-confirm-buttons',
        cancelButton: "Swal-cancel-buttons"
    },
      confirmButtonText: t("Continue"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (!reviewAnserShow) {
          let status = 1;
          UserCoinScoreApi("-" + coins, null, null, "Audio Quiz Review Answer", status, (response) => {
            updateUserDataInfo(response.data)
            router.push('/audio-questions/review-answer')
            dispatch(reviewAnswerShowSuccess(true))
          }, (error) => {
            Swal.fire(t("OOps"), t("Please Try again"), "error");
            console.log(error);
          })
        } else {
          router.push('/audio-questions/review-answer')
        }
      }
    });

  };

  const goBack = () => {
    router.push('/audio-questions')
  }


  return (
    <Layout>
      <Breadcrumb title={t('AudioQuestionsPlay')} content="" contentTwo="" />
      <div className='funandlearnplay AudioQuestionsPlay dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <ShowScore
                  showCoinandScore={showCoinandScore}
                  score={percentageScore}
                  totalQuestions={showScore.totalQuestions}
                  onReviewAnswersClick={handleReviewAnswers}
                  goBack={goBack}
                  quizScore={showScore.quizScore}
                  showQuestions={true}
                  reviewAnswer={true}
                  coins={showScore.coins}
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
export default withTranslation()(AudioQuestionsPlay)
