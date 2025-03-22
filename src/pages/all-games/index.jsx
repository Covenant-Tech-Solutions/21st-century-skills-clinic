'use client'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { t } from 'i18next'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { websettingsData } from 'src/store/reducers/webSettings'
import { battleDataClear } from 'src/store/reducers/groupbattleSlice'
import { FiArrowLeft } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'
import { FaCheckCircle } from 'react-icons/fa'

const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Quizplay = () => {
  const router = useRouter()
  const systemconfig = useSelector(sysConfigdata)
  const websettingsdata = useSelector(websettingsData)
  const [data, setData] = useState([
    {
      id: 0,
      image: websettingsdata?.quiz_zone_icon,
      quizname: 'Open Earning',
      quizDesc: 'Select any category of your choice to play & earn',
      url: '/quiz-zone',
      quizzonehide: '1'
    },
    {
      id: 1,
      image: websettingsdata?.daily_quiz_icon,
      quizname: 'Daily Earning',
      quizDesc: 'Daily opportunity to play and earn.',
      url: '/quiz-play/daily-quiz-dashboard',
      dailyquizhide: '1'
    },
    {
      id: 2,
      image: websettingsdata?.true_false_icon,
      quizname: 'True or False',
      quizDesc: 'No long things, just answer true or false and earn.',
      url: '/quiz-play/true-and-false-play',
      truefalsehide: '1'
    },
    {
      id: 3,
      image: websettingsdata?.fun_learn_icon,
      quizname: 'Learn & Earn',
      quizDesc: "Learn Something Specific, Play & Earn",
      url: '/fun-and-learn',
      funandlearnhide: '1'
    },
    {
      id: 4,
      image: websettingsdata?.guess_the_word_icon,
      quizname: 'Mind Games',
      quizDesc: 'Unravel mysteries to earn',
      url: '/guess-the-word',
      guessthewordhide: '1'
    },
    {
      id: 5,
      image: websettingsdata?.self_challange_icon,
      quizname: 'Brain Training',
      quizDesc: 'Challenge Yourself, Improve Your Brain Functions',
      url: '/self-learning',
      selfchallengehide: '1'
    },
    {
      id: 6,
      image: websettingsdata?.contest_play_icon,
      quizname: 'Niche Contests',
      quizDesc: 'Live & hot contests for specific niches with massive earnings for top winners',
      url: '/contest-play',
      contestplayhide: '1'
    },
    {
      id: 7,
      image: websettingsdata?.one_one_battle_icon,
      quizname: '1 v/s 1 Battle',
      quizDesc: 'Battle one on one with a human or bot, Win and carry the bounty!',
      url: '/random-battle',
      battlequizhide: '1'
    },
    {
      id: 8,
      image: websettingsdata?.group_battle_icon,
      quizname: 'Group Battle',
      quizDesc: `Play with friends to determine the best brain. Winner takes all.`,
      url: '/group-battle',
      groupplayhide: '1'
    },
    {
      id: 9,
      image: websettingsdata?.audio_question_icon,
      quizname: 'Listen & Earn',
      quizDesc: 'Listen, Deduce, Answer & Earn.',
      url: '/audio-questions',
      audioQuestionshide: '1'
    },
    {
      id: 10,
      image: websettingsdata?.math_mania_icon,
      quizname: 'Calculation Game',
      quizDesc: 'Challenge Your Mind. Solve to Earn.',
      url: '/math-mania',
      mathQuestionshide: '1'
    },
    {
      id: 11,
      image: websettingsdata?.exam_icon,
      quizname: 'Exams Style',
      quizDesc: 'Prove your knowledge on selected topics and earn.',
      url: '/exam-module',
      examQuestionshide: '1'
    },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [showGames, setShowGames] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [loadingSteps, setLoadingSteps] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [metrics, setMetrics] = useState({
    futureDemand: 0,
    skillRelevance: 0,
    globalOpportunities: 0,
    globalInterest: 0,
    skilledWorkforce: 0,
    availableJobs: 0
  })
  const [subscriptions, setSubscriptions] = useState({
    skillsAlerts: false,
    jobsAlerts: false,
    trendShifts: false,
    communityEngagements: false
  })

  const redirectdata = data => {
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      router.push('/auth/login')
      toast.error('Please Login first')
      return
    }
    if (!data.disabled) {
      router.push(data.url)
    }
  }

  const handleSearchSubmit = e => {
    e.preventDefault()
    if (searchTerm.trim() === '') {
      toast.error('Please enter a career or topic of interest')
      return
    }
    localStorage.setItem('searchTerm', searchTerm)
    generateRandomMetrics()
    simulateLoadingSteps()
  }

  const generateRandomMetrics = () => {
    setMetrics({
      futureDemand: Math.floor(Math.random() * 101),
      skillRelevance: Math.floor(Math.random() * 101),
      globalOpportunities: Math.floor(Math.random() * 101),
      globalInterest: Math.floor(Math.random() * 101),
      skilledWorkforce: Math.floor(Math.random() * 1001) + 500, // Random number between 500 and 1500
      availableJobs: Math.floor(Math.random() * 501) + 100 // Random number between 100 and 600
    })
  }

  const simulateLoadingSteps = () => {
    setLoadingSteps(true)
    const steps = ['Loading...', 'Auditing...', 'Preparing...', 'Ready!']
    let stepIndex = 0

    const interval = setInterval(() => {
      setLoadingMessage(steps[stepIndex])
      stepIndex++

      if (stepIndex === steps.length) {
        clearInterval(interval)
        setLoadingSteps(false)
        setShowReport(true)
      }
    }, 1000)
  }

  const handleSubscriptionChange = e => {
    const { name, checked } = e.target
    setSubscriptions(prev => ({ ...prev, [name]: checked }))
  }

  const handleContinue = () => {
    setShowReport(false)
    setShowGames(true)
  }

  const handleBack = () => {
    setShowReport(false)
  }

  useEffect(() => {
    battleDataClear()
  }, [])

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} title={t('all-games')} content={t('Home')} contentTwo={t('all-games')} />
      <div className='Quizzone mt-1 mb-3'>
        <div className='container'>
          {!showGames && !showReport && !loadingSteps ? (
            <div className='search-container'>
              <h2 className='text-center'>{t('Your current or future career interest?')}</h2>
              <form onSubmit={handleSearchSubmit} className='search-form'>
                <input
                  type='text'
                  className='search-input'
                  placeholder={t('Accounting , Engineering, Data Scientist, etc.')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <button type='submit' className='search-button'>
                  {t('Continue')}
                </button>
              </form>
            </div>
          ) : loadingSteps ? (
            <div className='loading-container'>
              <h2 className='text-center'>{loadingMessage}</h2>
              <div className='loader'></div>
            </div>
          ) : showReport ? (
            <div className='report-container'>
              <button className='back-button' onClick={handleBack}>
                <FiArrowLeft /> {t('Back')}
              </button>
              <h2 className='text-center'>{t('Career Audit for')} {searchTerm}</h2>
              <div className='mockup-report'>
                <ul className='action-bullets'>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <span>{t('Future Demand Score')}: <span className='pill'>{metrics.futureDemand}%</span></span>
                    <Tooltip id='tooltip-future-demand'>
                      {t('This score is based on projected industry growth and demand.')} <a href='#'>{t('Read More')}</a>
                    </Tooltip>
                  </li>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <span>{t('Skill Relevance Score')}: <span className='pill'>{metrics.skillRelevance}%</span></span>
                    <Tooltip id='tooltip-skill-relevance'>
                      {t('This score evaluates the alignment of skills with industry needs.')} <a href='#'>{t('Read More')}</a>
                    </Tooltip>
                  </li>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <span>{t('Global Opportunities Score')}: <span className='pill'>{metrics.globalOpportunities}%</span></span>
                    <Tooltip id='tooltip-global-opportunities'>
                      {t('This score reflects the availability of opportunities worldwide.')} <a href='#'>{t('Read More')}</a>
                    </Tooltip>
                  </li>
                </ul>
                <h3>{t('Workforce Statistics')}</h3>
                <ul className='action-bullets'>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <span>{t('Global Interest Index')}: <span className='pill'>{metrics.globalInterest}/100</span></span>
                    <Tooltip id='tooltip-global-interest'>
                      {t('This metric shows the global interest in this career based on search trends.')} <a href='#'>{t('Read More')}</a>
                    </Tooltip>
                  </li>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <span>{t('Skilled Workforce')}: <span className='pill'>{metrics.skilledWorkforce}+</span></span>
                    <Tooltip id='tooltip-skilled-workforce'>
                      {t('This metric represents the percentage of skilled professionals in this field.')} <a href='#'>{t('Read More')}</a>
                    </Tooltip>
                  </li>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <span>{t('Available Jobs')}: <span className='pill'>{metrics.availableJobs}+</span></span>
                    <Tooltip id='tooltip-available-jobs'>
                      {t('This metric indicates the number of job openings in this career globally.')} <a href='#'>{t('Read More')}</a>
                    </Tooltip>
                  </li>
                </ul>
              </div>
              <div className='topic-interests'>
                <h3>{t('Topic Interests')}</h3>
                <ul className='action-bullets'>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <a href={`https://www.coursera.org/search?query=${searchTerm}`} target='_blank' rel='noopener noreferrer'>
                      {t('Learn')} {searchTerm} {t('on Coursera')}
                    </a>
                  </li>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <a href={`https://www.udemy.com/courses/search/?q=${searchTerm}`} target='_blank' rel='noopener noreferrer'>
                      {t('Explore')} {searchTerm} {t('courses on Udemy')}
                    </a>
                  </li>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <a href={`https://www.edx.org/search?q=${searchTerm}`} target='_blank' rel='noopener noreferrer'>
                      {t('Discover')} {searchTerm} {t('programs on edX')}
                    </a>
                  </li>
                  <li>
                    <FaCheckCircle className='bullet-icon' />
                    <a href={`https://www.linkedin.com/learning/search?keywords=${searchTerm}`} target='_blank' rel='noopener noreferrer'>
                      {t('Advance your skills in')} {searchTerm} {t('on LinkedIn Learning')}
                    </a>
                  </li>
                </ul>
              </div>
              <div className='subscriptions'>
                <h3>{t('Subscribe to Updates')}</h3>
                <ul className='action-bullets'>
                  <li>
                    {/* <FaCheckCircle className='bullet-icon' /> */}
                    <label>
                      <input
                        type='checkbox'
                        name='skillsAlerts'
                        checked={subscriptions.skillsAlerts}
                        onChange={handleSubscriptionChange}
                      />
                      {t('Emerging skills alerts in')} {searchTerm}
                    </label>
                  </li>
                  <li>
                    {/* <FaCheckCircle className='bullet-icon' /> */}
                    <label>
                      <input
                        type='checkbox'
                        name='jobsAlerts'
                        checked={subscriptions.jobsAlerts}
                        onChange={handleSubscriptionChange}
                      />
                      {t('Related Jobs and opportunities alerts in')} {searchTerm}
                    </label>
                  </li>
                  <li>
                    {/* <FaCheckCircle className='bullet-icon' /> */}
                    <label>
                      <input
                        type='checkbox'
                        name='trendShifts'
                        checked={subscriptions.trendShifts}
                        onChange={handleSubscriptionChange}
                      />
                      {t('Trend shifts alerts in')} {searchTerm}
                    </label>
                  </li>
                  <li>
                    {/* <FaCheckCircle className='bullet-icon' /> */}
                    <label>
                      <input
                        type='checkbox'
                        name='communityEngagements'
                        checked={subscriptions.communityEngagements}
                        onChange={handleSubscriptionChange}
                      />
                      {t('Community engagements in')} {searchTerm}
                    </label>
                  </li>
                </ul>
              </div>
              <div className='continue-button-container'>
                <button className='continue-button' onClick={handleContinue}>
                  {t('Continue')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className='text-center'>{t(`Secure Your ${searchTerm} future!`)}</h2>
              {data?.length === 0 ? (
                <p className="text-center">{t("noquiz")} </p>
              ) : (
                <ul className='row justify-content-center'>
                  {data.map(quiz => (
                    <li
                      onClick={() => redirectdata(quiz)}
                      className='col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6 small__div'
                      key={quiz.id}
                    >
                      <div className='inner__Quizzone'>
                        <div className='card'>
                          <div className='card__icon'>
                            <img src={quiz.image} alt='icon' />
                          </div>
                          <div className='title__card'>
                            <h5 className='inner__title gameTitle'>{t(quiz.quizname)}</h5>
                            <span className='inner__desc gameDesc'>{t(quiz.quizDesc)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .search-container {
          text-align: center;
          margin-top: 50px;
        }
        .search-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }
        .search-input {
          width: 100%;
          max-width: 600px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        .search-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }
        .search-button:hover {
          background-color: #0056b3;
        }
        .loading-container {
          text-align: center;
          margin-top: 50px;
        }
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #007bff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .report-container {
          margin-top: 30px;
        }
        .back-button {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .mockup-report {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .mockup-report ul {
          list-style: none;
          padding: 0;
        }
        .mockup-report li {
          margin-bottom: 10px;
          font-size: 16px;
        }
        .pill {
          display: inline-block;
          background-color: #007bff;
          color: #fff;
          padding: 5px 10px;
          border-radius: 20px;
          margin-left: 10px;
          font-size: 14px;
        }
        .topic-interests {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .topic-interests ul {
          list-style: none;
          padding: 0;
        }
        .topic-interests li {
          margin-bottom: 10px;
        }
        .topic-interests a {
          color: #007bff;
          text-decoration: none;
        }
        .topic-interests a:hover {
          text-decoration: underline;
        }
        .subscriptions {
          margin-bottom: 20px;
        }
        .subscriptions label {
          display: block;
          margin-bottom: 10px;
        }
        .continue-button-container {
          text-align: center;
        }
        .continue-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 16px;
        }
        .continue-button:hover {
          background-color: #0056b3;
        }
        .action-bullets {
          list-style: none;
          padding: 0;
        }
        .action-bullets li {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .bullet-icon {
          color: #28a745;
          margin-right: 10px;
        }
      `}</style>
    </Layout>
  )
}

export default withTranslation()(Quizplay)
