"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { QuestionsByRoomIdApi } from 'src/store/actions/campaign'
import { resultTempDataSuccess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { useRouter } from 'next/router'
import { useRef } from "react";
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'
import DOMPurify from 'dompurify'
const GroupQuestions = dynamic(() => import('src/components/Quiz/GroupBattle/GroupQuestions'), {
  ssr: false
})

const GroupPlay = () => {

  const navigate = useRouter()

  const dispatch = useDispatch()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  let getData = useSelector(selecttempdata)

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = Number(systemconfig?.battle_mode_group_in_seconds)

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.roomCode)
    }
  }, [])

  const RenderHtmlContent = ({ htmlContent }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      // Sanitize HTML content
      const sanitizedHtml = DOMPurify && DOMPurify.sanitize(htmlContent);

      // Set the sanitized HTML content
      containerRef.current.innerHTML = sanitizedHtml;

      // Trigger MathJax typesetting
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, containerRef.current]);
    }, [htmlContent]);

    return <div ref={containerRef} />
  }

  const getNewQuestions = (match_id) => {
    QuestionsByRoomIdApi(
      match_id,
      (response) => {
        let questions = response.data.map((data) => {




          // Use \n to represent line breaks in the data


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
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }

  const onQuestionEnd = async () => {
    const tempData = {
      totalQuestions: questions?.length,
      question: questions,
    };
    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/group-battle/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('Group Battle')} content={t('')} contentTwo="" />
      <div className='funandlearnplay dashboard battlerandom'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                <>
                  {(() => {
                    if (questions && questions?.length > 0 && questions[0]?.id !== '') {
                      return (
                        <GroupQuestions
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAnswerOptionClick}
                          onQuestionEnd={onQuestionEnd}
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
export default withTranslation()(GroupPlay)
