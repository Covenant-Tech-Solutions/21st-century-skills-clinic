"use client"
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import QuestionSlider from 'src/components/Quiz/SelfLearning/QuestionSlider'
import TimerSlider from 'src/components/Quiz/SelfLearning/TimerSlider'
import { Loadtempdata } from 'src/store/reducers/tempDataSlice'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const SelfLearning = () => {

  // questions
  const [totalquestions, setTotalQuestions] = useState({
    selected: ''
  })

  //timer
  const [timerseconds, setTimerseconds] = useState({
    selected: ''
  })

  // active elenment for questions
  const [activeIndex, setActiveIndex] = useState(0)

  // active element for timer
  const [timeractiveIndex, setTimerActiveIndex] = useState(0)

  const router = useRouter()

  // questionsclick
  const handleQuestionsClick = selecteddata => {
    setActiveIndex(selecteddata)
    setTotalQuestions({ ...totalquestions, selected: selecteddata })
  }

  // timerclick
  const handleTimerClick = selecteddata => {
    setTimerActiveIndex(selecteddata)
    setTimerseconds({ ...timerseconds, selected: selecteddata })
  }

  //start
  const handleStart = () => {
    if (!totalquestions.selected) {
      toast.error(t('Please select Number of Questions'))
    } else if (!timerseconds.selected) {
      toast.error(t('Please select Number of Timer'))
    } else {
      router.push({ pathname: `/self-learning/self-learning-play` })

      let data = {
        category_id: router.query.catslug,
        subcategory_id: router.query.isSubcategory !== "0" ? router.query.subcatslug : "",
        limit: totalquestions.selected,
        timer: timerseconds.selected
      }
      Loadtempdata(data)
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);

  return (
    <Layout>
      <div className='section_data'>
        <Breadcrumb showBreadcrumb={true} title={t('Self Learning')} />
        <div className='SelfLearning  mb-5'>
          <div className='container'>
            <div className='row morphisam mb-5'>

              {/* questions */}
              <div className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12'>
                <div className='right-sec'>
                  {/* questions slider */}
                  <div className='que_num'>

                    <QuestionSlider onClick={handleQuestionsClick} activeIndex={activeIndex} />
                  </div>
                  <div className="timer">

                    {/* timer slider */}
                    <TimerSlider onClick={handleTimerClick} timeractiveIndex={timeractiveIndex} />
                  </div>
                </div>
              </div>

              {/* Start button */}
              <div className='row'>
                <div className='start_button justify-content-center align-items-center d-flex'>
                  <button className='btn btn-primary' onClick={() => handleStart()}>
                    {t('Let`s Start')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(SelfLearning)
