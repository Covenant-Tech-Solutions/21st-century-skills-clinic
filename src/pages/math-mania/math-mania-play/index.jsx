"use client"
import React, { useEffect, useRef, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { getBookmarkData } from 'src/utils'
import { useSelector } from 'react-redux'
import { getmathQuestionsApi } from 'src/store/actions/campaign'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import MathmaniaQuestions from 'src/components/Quiz/Mathmania/MathmaniaQuestions'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'
import DOMPurify from 'dompurify'

const MathmaniaPlay = () => {

  const sysconfig = useSelector(sysConfigdata)

  const router = useRouter()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const TIMER_SECONDS = Number(sysconfig?.maths_quiz_seconds)

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.isSubcategory !== '0') {
      getNewQuestions('subcategory', router.query.subcatid)
    } else {
      getNewQuestions('category', router.query.catid)
    }

  }, [router.isReady]);

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


  const getNewQuestions = (type, type_id) => {
    getmathQuestionsApi(
      type,
      type_id,
      (response) => {
        let bookmark = getBookmarkData();
        let questions_ids = Object.keys(bookmark).map((index) => {
          return bookmark[index].question_id;
        });
        let questions = response.data.map((data) => {
          let isBookmark = false;
          if (questions_ids.indexOf(data.id) >= 0) {
            isBookmark = true;
          } else {
            isBookmark = false;
          }
          // let questionText = data.question ? data.question.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim() : "";

          // Use \n to represent line breaks in the data


          let question = data.question

          let note = data?.note


          return {
            ...data,

            note: note,
            question: question,
            isBookmarked: isBookmark,
            selected_answer: "",
            isAnswered: false,
          };
        });
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
      <Breadcrumb title={t('MathmaniaPlay')} content="" contentTwo="" />
      <div className='funandlearnplay MathmaniaPlay dashboard'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground pt-3'>
                {(() => {
                  if (questions && questions?.length >= 0) {
                    return (
                      <MathmaniaQuestions
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
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
export default withTranslation()(MathmaniaPlay)
