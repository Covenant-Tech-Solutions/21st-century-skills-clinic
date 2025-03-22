"use client"
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import SelfLearningQuestions from 'src/components/Quiz/SelfLearning/SelfLearningQuestions'
import { useSelector } from 'react-redux'
import { selfQuestionsApi } from 'src/store/actions/campaign'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { selecttempdata } from 'src/store/reducers/tempDataSlice'
import { useRef } from "react";
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'
import DOMPurify from 'dompurify'

const SelfLearningplay = () => {

  let getData = useSelector(selecttempdata)

  const TIMER_SECONDS = getData.timer * 60

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.category_id, getData.subcategory_id, getData.limit)
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

  const getNewQuestions = (category_id, subcategory_id, limit) => {
    selfQuestionsApi(
      category_id,
      subcategory_id,
      limit,
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
        // navigate.push("/all-games");
        console.log(error);
      }
    );
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }


  return (
    <Layout>
      <Breadcrumb title={t('Self Learning')} content="" contentTwo="" />
      <div className='dashboard selflearnig-play'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                {(() => {
                  if (questions && questions?.length >= 0) {
                    return (
                      <SelfLearningQuestions
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
                        showQuestions={true}
                        showBookmark={false}
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
export default withTranslation()(SelfLearningplay)
