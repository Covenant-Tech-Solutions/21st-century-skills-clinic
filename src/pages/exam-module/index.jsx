"use client"
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { getexamModuleApi, setExammoduleresultApi } from 'src/store/actions/campaign'
import Skeleton from 'react-loading-skeleton'
import { examCompletedata, Loadtempdata, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { Modal } from 'antd'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import gk from 'src/assets/images/Gk.svg'
import errorimg from "src/assets/images/error.svg"
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })


const ExamModule = ({ t }) => {

  const demoValue = process.env.NEXT_PUBLIC_DEMO === 'true';

  const [key, setKey] = useState('Today')

  const [loading, setLoading] = useState(true)

  const [todayData, setTodaydata] = useState([])

  const [completeData, setCompleteData] = useState([])

  const [popupCompleteData, setPopupCompleteData] = useState([])

  const [notificationmodal, setNotificationModal] = useState(false)

  const [ExamCompleteModal, setExamCompleteModalModal] = useState(false)

  const examKeyRef = useRef(null)

  const [examData, setExamData] = useState('')

  const [isChecked, setIsChecked] = useState(false)

  const selecttempData = useSelector(selecttempdata)

  const allQuestionData = useSelector(examCompletedata)

  const navigate = useRouter()

  //all data render
  const getAllData = () => {
    setLoading(true)

    // today data get
    getexamModuleApi(
      1,
      0,
      10,
      response => {
        let todayallData = response.data
        setLoading(false)
        const filteredArray = todayallData.filter(obj => obj.exam_status !== '3')
        setTodaydata(filteredArray)
      },
      error => {
        console.log(error)
        setLoading(false)
      }
    )

    // completed data get
    getexamModuleApi(
      2,
      0,
      50,
      response => {
        let completeallData = response.data
        setCompleteData(completeallData)
        setLoading(false)
      },
      error => {
        // console.log(error);
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    getAllData()
  }, [selectCurrentLanguage])

  // questions screen
  const QuestionScreen = data => {
    setExamData(data.exam_key)
    Loadtempdata(data)
    setNotificationModal(true)
  }

  // popup handle validation
  const handleSubmit = e => {
    e.preventDefault()
    // Compare the input value with the API data
    if (examData && examData == examKeyRef.current.value) {
      if (isChecked) {
        navigate.push('/exam-module/exam-module-play')
      } else {
        toast.error(t('Please agree to the exam rules'))
      }
    } else {
      toast.error(t('Invalid exam key'))
    }

    setExammoduleresultApi(
      Number(selecttempData.id),
      '',
      '',
      '',
      1,
      '',
      resposne => {
        // console.log(resposne);
      },
      error => {
        console.log(error)
      }
    )
  }

  // duration minute
  const durationMinutes = minute => {
    let durationInSeconds = minute * 60
    let hours = Math.floor(durationInSeconds / 3600)
    let minutes = Math.floor((durationInSeconds % 3600) / 60)
    let seconds = durationInSeconds % 60
    return `${hours}:${minutes}:${seconds} hh:mm:ss`
  }

  // duration seconds in minutes and hours
  const durationsecondstominutes = minute => {
    let hours = Math.floor(minute / 3600)
    let minutes = Math.floor((minute % 3600) / 60)
    let seconds = minute % 60
    return `${hours}:${minutes}:${seconds} hh:mm:ss`
  }

  const convertMinutesToDaysHoursMinutes = (minutes) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = minutes % 60;

    let result = '';

    if (days > 0) {
      result += `${days}d `;
    }

    if (hours > 0 || (days === 0 && hours === 0)) {
      result += `${hours}h `;
    }

    result += `${remainingMinutes}m`;

    return result.trim();
  };

  // complete popup data
  const Completepopup = (e, data) => {
    e.preventDefault()
    setExamCompleteModalModal(true)


    // Convert data object to array of key-value pairs
    const dataEntries = Object.entries(data)

    // Convert statistics property to array of objects
    // const statistics = dataEntries.reduce((acc, [key, value]) => {
    //   if (key ==='statistics') {
    //     return [...acc,...value]
    //   } else {
    //     return acc
    //   }
    // }, [])

    // console.log(statistics)


    // Convert answers property to array of objects
    const newdata = dataEntries.reduce((acc, [key, value]) => {
      if (key === 'statistics') {
        try {
          value = value && value.replace(/'/g, '"')
          value = value && value.replace(/,\s*]/, ']')
          value = JSON.parse(value)
        } catch (error) {
          console.error('Error parsing statistics:', error)
          // Handle the error or provide a default value for value
        }
      }
      return { ...acc, [key]: value }
    }, {})

    setPopupCompleteData([newdata])
  }

  const totals = popupCompleteData.reduce((acc, data) => {
    data.statistics.forEach(stat => {
      acc.totalQuestions += parseInt(stat.correct_answer) + parseInt(stat.incorrect);
      acc.totalCorrect += parseInt(stat.correct_answer);
      acc.totalIncorrect += parseInt(stat.incorrect);
    });
    return acc;
  }, { totalQuestions: 0, totalCorrect: 0, totalIncorrect: 0 });

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate(); // gets the day as a number (1-31)
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()]; // getMonth() returns a zero-based index
    const year = date.getFullYear(); // gets the full year (e.g., 2024)

    return `${day} ${month} ${year}`;
  }

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} title={t('Exam')} content={t('Home')} allgames={t('all-games')} contentTwo="" />
      <div className='SelfLearning ExamModule contestPlay mb-5'>
        <div className='container'>
          <div className='row  morphisam mb-5'>
            <div className='col-md-12 col-sm-12 col-12 col-lg-12 mx-auto my-5 my-md-0'>
              <Tabs id='fill-tab-example' activeKey={key} onSelect={k => setKey(k)} fill className='mb-3'>
                <Tab eventKey='Today' title={t('Today')}>
                  <>
                    <div className="row today-exam">
                      {loading ? (
                        <div className='text-center'>
                          <Skeleton count={5} />
                        </div>
                      ) : todayData?.length > 0 ? (
                        todayData.map((data, index) => {
                          const duration = convertMinutesToDaysHoursMinutes(data.duration)
                          const parts = data.date.split('-')
                          const newDateStr = parts.reverse().join('-')
                          return (
                            <>
                              <div className="col-xxl-4 col-lg-6" key={index}>

                                <div className='today_box' onClick={() => QuestionScreen(data)}>
                                  <div className="card">
                                    <div className="cardInnerData">
                                      <span className='Box__icon'>
                                        <img src={`${gk.src}`} alt='image' />
                                        <div className="cardDetails">
                                          <p className='cardText '>{data.title}</p>
                                          <div className="cardSubDetails">
                                            <p className='CardQues'> {newDateStr}</p>
                                            <div className='subdetails_separator'></div>
                                            <p className='CardQues'> {duration}</p>
                                          </div>
                                        </div>
                                      </span>
                                      <span className='examTotMarks'> {data.total_marks} {t('Marks')}</span>
                                    </div>
                                  </div>

                                </div>
                              </div>

                            </>
                          )
                        })
                      ) : (
                        <div className='error_content'>
                          <img src={errorimg.src} title='wrteam' className='error_img' />
                          <h6 className='text-center '>{t('No exam for today')}</h6>
                        </div>
                      )}
                    </div>
                  </>
                </Tab>
                <Tab eventKey='Completed' title={t('Completed')}>
                  <>
                    <div className="row">

                      {loading ? (
                        <div className='text-center'>
                          <Skeleton count={5} />
                        </div>
                      ) : completeData?.length > 0 ? (
                        completeData.map((data, index) => {
                          const partscom = data.date.split('-')
                          const newDateStrcom = partscom.reverse().join('-')
                          return (
                            <>
                              <div className="col-xxl-4 col-lg-6">

                                <div className='today_box' key={index} onClick={e => Completepopup(e, data)}>
                                  <div className="card">
                                    <div className="cardInnerData complteCardInnerData">
                                      <span className='Box__icon'>
                                        <img src={`${gk.src}`} alt='image' />
                                        <div className="cardDetails">
                                          <p className='cardText '>{data.title}</p>
                                          <div className="cardSubDetails">
                                            <p className='CardQues'> {newDateStrcom}</p>
                                          </div>
                                        </div>
                                      </span>
                                      <span className='examTotMarks'> {data.total_marks} {t('Marks')}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </>
                          )
                        })
                      ) : (
                        <div className='error_content'>
                          <img src={errorimg.src} title='wrteam' className='error_img' />
                          <h6 className='text-center '>{t('Have not completed any exam yet')}</h6>
                        </div>
                      )}
                    </div>
                  </>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Modal
        centered
        visible={notificationmodal}
        onOk={() => setNotificationModal(false)}
        onCancel={() => setNotificationModal(false)}
        footer={null}
        className='custom_modal_notify self-modal'
      >
        <div className='custom_checkbox d-flex flex-wrap align-items-center mt-4'>
          <div className="d-flex flex-column justify-content-center gap-1 m-auto align-items-center">

            <span className='text-center' style={{
              color: '#090029',
              fontSize: '24px',
              fontFamily: "Lato",
              fontWeight: '700'
            }}>{t("Enter in Exam")}</span>
            <span className='text-center mb-4' style={{
              color: '#090029',
              fontSize: '20px',
              fontFamily: "Lato",
              fontWeight: '400'
            }}>{t("Please enter the Exam Key")}</span>
          </div>
          <form onSubmit={e => handleSubmit(e)}>
            <input
              type='number'
              className='form-control'
              placeholder='Enter exam key'
              required
              min='0'
              ref={examKeyRef}
              defaultValue={demoValue ? '1234' : ''}
            />
            <hr />
            <div style={{ background: 'white', borderRadius: '16px', padding: '10px 4px' }}>
              <p className='text-center' style={{ color: '#090029', fontWeight: '600' }}>{t('Exam Rules')}</p>
              <ul>
                <li>{t('I will not copy and give this exam with honesty')}</li>
                <li>{t('If you lock your phone then exam will complete automatically')}</li>
                <li>
                  {t(
                    "If you minimize application or open other application and don't come back to application with in 5 seconds then exam will complete automatically"
                  )}
                </li>
                <li>{t('Screen recording is prohibited')}</li>
                <li>{t('In Android screenshot capturing is prohibited')}</li>
                <li>{t('In ios, if you take screenshot then rules will violate and it will inform to examinator')}</li>
              </ul>
            </div>

            <hr />
            <div className='d-flex align-items-center justify-content-center'>
              <label className=' d-flex align-items-center text-center justify-content-center' style={{ color: '#090029', fontWeight: '600' }}>
                <input type='checkbox' onChange={e => setIsChecked(e.target.checked)} className='me-2' />
                {t('I agree with Exam Rules')}
              </label>
            </div>
            <div className='text-center mt-4'>
              <button type='submit' className='btn btn-primary'>
                {t('Start Exam')}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* complete data */}
      <Modal
        centered
        visible={ExamCompleteModal}
        onOk={() => setExamCompleteModalModal(false)}
        onCancel={() => setExamCompleteModalModal(false)}
        footer={null}
        className='exammodal custom_modal_notify self-modal'
      >
        {/* <div className="custom_checkbox completeDataModal mt-4">
          <div className="result_title">
            <h3>{t("Exam Result")}</h3>
          </div>
          <div className="result_marks_data">
            {popupCompleteData && popupCompleteData.map((data, index) => {
              const duration = durationMinutes(data.duration);
              const totalduration = durationsecondstominutes(data.total_duration);
              return (
                <div key={index}>
                  <div className="inner_data">
                    <p>{t("Obtained Marks")} :</p> <span className="result_Data">{data.obtained_marks + "/" + data.total_marks}</span>
                  </div>
                  <div className="inner_data">
                    <p>{t("Exam Duration")} :</p> <span className="result_Data">{duration}</span>
                  </div>
                  <div className="inner_data">
                    <p>{t("Completed In")} :</p> <span className="result_Data">{totalduration}</span>
                  </div>
                </div>
              )


            })}

          </div>
          <hr />
          <div className="total_questions mb-4">
            <h6>{t("Total Questions")}</h6>
            <div className="inner_total_data">
              <div className="inner_questions">
                <div>
                  <p>{t("Total")}<br />{t("Questions")}</p>
                </div>
                <div className="bottom_data">
                  <span className="inner_total">{allQuestionData && allQuestionData.totalQuestions}</span>
                </div>
              </div>
              <div className="correct_inner_questions">
                <div>
                  <p>{t("Correct")}<br />{t("Questions")}</p>
                </div>
                <div className="bottom_data_two">
                  <span className="inner_total">{allQuestionData && allQuestionData.Correctanswer}</span>
                </div>
              </div>
              <div className="incorrect_inner_questions">
                <div>
                  <p>{t("Incorrect")}<br />{t("Questions")}</p>
                </div>
                <div className="bottom_data_three">
                  <span className="inner_total">{allQuestionData && allQuestionData.InCorrectanswer}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="total_questions">
            {popupCompleteData && popupCompleteData.map((data, index) => {
              return (
                data.statistics && data.statistics.map((elem, index) => {
                  return (
                    <div key={index}>
                      <h6>{elem.mark}{" "}{t("Mark Questions")}</h6>
                      <div className="inner_total_data mb-4">
                        <div className="inner_questions">
                          <div>
                            <p>{t("Total")}<br />{t("Questions")}</p>
                          </div>
                          <div className="bottom_data">
                            <span className="inner_total">{elem.correct_answer + elem.incorrect}</span>
                          </div>
                        </div>
                        <div className="correct_inner_questions">
                          <div>
                            <p>{t("Correct")}<br />{t("Questions")}</p>
                          </div>
                          <div className="bottom_data_two">
                            <span className="inner_total">{elem.correct_answer}</span>
                          </div>
                        </div>
                        <div className="incorrect_inner_questions">
                          <div>
                            <p>{t("Incorrect")}<br />{t("Questions")}</p>
                          </div>
                          <div className="bottom_data_three">
                            <span className="inner_total">{elem.incorrect}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )

            })}

          </div>
        </div> */}

        <div className='exm_model_cont'>
          <h1 className='exm_res_head'>Exam Result</h1>

          {popupCompleteData && popupCompleteData.map((data, index) => {
            return (
              <>
                <p className='exm_date'>{formatDate(data.date)}</p>
                <p className='exm_dep'>{data.title}</p>
                <h1 className='obt_marks'>Obtained Marks : {data.obtained_marks + "/" + data.total_marks}</h1>
                <div className='exm_content'>
                  <div className='total_que'>
                    <p>Total Question</p>
                    <p>[ {totals.totalQuestions} Que ]</p>
                  </div>
                  <div className='correct_incorrect'>
                    <div className="correctAnswers">
                      <p>{totals.totalCorrect}</p>
                      <p>Correct Answer</p>
                    </div>
                    <div className='incorrectAnswers'>
                      <p>{totals.totalIncorrect}</p>
                      <p>Incorrect Answer</p>
                    </div>
                  </div>
                </div>
                {
                  data.statistics.map((item) => (
                    <div className="correct_incorrect_wrapper">
                      <div className='all_que_head'>
                        <p>All Question {item.mark} Marks</p>
                        <p>[ {parseInt(item.correct_answer) + parseInt(item.incorrect)} Que ]</p>
                      </div>
                      <div className="correctIncorrect_card">
                        <div className='correct_incorrect'>
                          <div className="correctAnswers">
                            <p>{item.correct_answer}</p>
                            <p>Correct Answer</p>
                            <div className='correct_border'></div>
                          </div>
                          <div className='correct_incorrect_separator'></div>
                          <div className='incorrectAnswers'>
                            <p>{item.incorrect}</p>
                            <p>Incorrect Answer</p>
                            <div className='incorrct_border'></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </>
            )
          })}
        </div>
      </Modal>
    </Layout>
  )
}

export default withTranslation()(ExamModule)
