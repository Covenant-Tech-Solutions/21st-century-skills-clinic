"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { settingsData, sysConfigdata } from 'src/store/reducers/settingsSlice'
import { RandomQuestionsApi } from 'src/store/actions/campaign'
import { resultTempDataSuccess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import { groupbattledata } from 'src/store/reducers/groupbattleSlice'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'
const RandomQuestions = dynamic(() => import('src/components/Quiz/RandomBattle/RandomQuestions'), {
  ssr: false
})

const RandomPlay = () => {

  const navigate = useRouter()

  let getData = useSelector(selecttempdata)

  const dispatch = useDispatch()

  const groupBattledata = useSelector(groupbattledata)

  let user2uid = groupBattledata?.user2uid

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = Number(systemconfig?.battle_mode_random_in_seconds)

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.room_id, getData.category_id, getData.destroy_match)
    }
  }, [])

  const getNewQuestions = (match_id, category, destroy_match) => {
    if (systemconfig.battle_random_category_mode == "1") {
      RandomQuestionsApi(
        match_id,
        category,
        destroy_match,
        (response) => {
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
        },
        (error) => {
          toast.error(t("No Questions Found"));
          navigate.push("/all-games");
          console.log(error);
        }
      );
    } else {
      RandomQuestionsApi(
        match_id,
        "",
        destroy_match,
        (response) => {
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
        },
        (error) => {
          toast.error(t("No Questions Found"));
          navigate.push("/all-games");
          console.log(error);
        }
      );
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }

  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: user2uid !== "000" ? coins : null, //this condition is only for bot play 
      quizScore: quizScore,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/random-battle/result")
  }


  return (
    <Layout>
      <Breadcrumb title={t('1 vs 1 Battle')} content="" contentTwo="" />
      <div className='funandlearnplay dashboard battlerandom'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <>
                  {(() => {
                    if (questions && questions?.length > 0 && questions[0]?.id !== '') {
                      return (
                        <RandomQuestions
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAnswerOptionClick}
                          onQuestionEnd={onQuestionEnd}
                          showQuestions={true}
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
export default withTranslation()(RandomPlay)
