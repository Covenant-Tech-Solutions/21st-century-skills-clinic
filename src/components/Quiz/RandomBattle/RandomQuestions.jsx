import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import Timer from "src/components/Common/Timer";
import { decryptAnswer, calculateScore, imgError, showAnswerStatusClass, audioPlay, messageList } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { getusercoinsApi, setBadgesApi, UserCoinScoreApi, UserStatisticsApi } from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { groupbattledata, LoadGroupBattleData } from 'src/store/reducers/groupbattleSlice'
import toast from 'react-hot-toast'
import { badgesData, LoadNewBadgesData } from 'src/store/reducers/badgesSlice'
import FirebaseData from 'src/utils/Firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router'
import rightTickIcon from 'src/assets/images/check-circle-score-screen.svg'
import Bookmark from "src/components/Common/Bookmark";
import { percentageSuccess, questionsDataSuceess } from 'src/store/reducers/tempDataSlice';
import { t } from 'i18next';


const MySwal = withReactContent(Swal)

const RandomQuestions = ({ questions: data, timerSeconds, onOptionClick, onQuestionEnd, showBookmark }) => {
  const [questions, setQuestions] = useState(data)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [playwithrobot, setPlaywithrobot] = useState(false)

  const [battleUserData, setBattleUserData] = useState([])

  const dispatch = useDispatch()

  const navigate = useRouter()

  const Score = useRef(0)

  const user1timer = useRef(null)

  const user2timer = useRef(null)

  const scroll = useRef(null)

  const { db } = FirebaseData()

  // store data get
  const userData = useSelector(state => state.User)

  const systemconfig = useSelector(sysConfigdata)

  const groupBattledata = useSelector(groupbattledata)

  const Badges = useSelector(badgesData)

  const combat_winnerBadge = Badges?.data?.find(badge => badge?.type === 'combat_winner');

  const ultimate_playerBadge = Badges?.data?.find(badge => badge?.type === 'ultimate_player');

  const combat_winner_status = combat_winnerBadge && combat_winnerBadge?.status

  const combat_winner_coin = combat_winnerBadge && combat_winnerBadge?.badge_reward

  const ultimate_status = ultimate_playerBadge && ultimate_playerBadge?.status

  const ultimate_player_coin = ultimate_playerBadge && ultimate_playerBadge?.badge_reward

  const [answeredQuestions, setAnsweredQuestions] = useState({})

  const addAnsweredQuestion = item => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true })
  }

  //firestore adding answer in doc
  let battleRoomDocumentId = groupBattledata.roomID

  // delete battle room
  const deleteBattleRoom = async documentId => {
    try {
      await db.collection('battleRoom').doc(documentId).delete()
    } catch (error) {
      toast.error(error)
    }
  }

  // combat winner
  const combatWinner = () => {
    if (combat_winner_status === '0') {
      // console.log("hello",user1uid,userData?.data?.id, user1point, user2point)
      if (groupBattledata.user1uid === userData?.data?.id && groupBattledata.user1point > groupBattledata.user2point) {
        setBadgesApi(
          'combat_winner',
          (res) => {
            LoadNewBadgesData('combat_winner', '1')
            toast.success(t(res?.data?.notification_body))
            const status = 0
            UserCoinScoreApi(
              combat_winner_coin,
              null,
              null,
              t('combat badge reward'),
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
      } else if (
        userData?.data?.id === groupBattledata.user2uid &&
        groupBattledata.user1point < groupBattledata.user2point
      ) {
        setBadgesApi(
          'combat_winner',
          (res) => {
            LoadNewBadgesData('combat_winner', '1')
            toast.success(t(res?.data?.notification_body))
            const status = 0
            UserCoinScoreApi(
              combat_winner_coin,
              null,
              null,
              t('combat badge reward'),
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
    }
  }

  //if user's points is same as highest points
  const ultimatePlayer = () => {
    const badgeEarnPoints = (Number(systemconfig?.battle_mode_random_quickest_correct_answer_extra_score) + Number(systemconfig?.battle_mode_random_correct_answer_credit_score)) * questions?.length
    const currentUserPoint =
      groupBattledata.user1uid === userData?.data?.id ? groupBattledata.user1point : groupBattledata.user2point
    if (currentUserPoint === badgeEarnPoints && ultimate_status === '0') {
      setBadgesApi(
        'ultimate_player',
        (res) => {
          LoadNewBadgesData('ultimate_player', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            ultimate_player_coin,
            null,
            null,
            t('ultimate badge reward'),
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
  }

  // next questions
  const setNextQuestion = async () => {
    const nextQuestion = currentQuestion + 1

    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      let coins = null
      let userScore = null
      let result_score = Score.current
      let percentage = (100 * result_score) / questions?.length
      UserStatisticsApi(
        questions?.length,
        result_score,
        questions[currentQuestion].category,
        percentage,
        response => { },
        error => {
          console.log(error)
        }
      )

      userScore = await calculateScore(result_score, questions?.length, systemconfig?.battle_mode_random_correct_answer_credit_score, systemconfig?.battle_mode_random_wrong_answer_deduct_score)
      await onQuestionEnd(coins, userScore)
      combatWinner()
      ultimatePlayer()
      deleteBattleRoom(battleRoomDocumentId)
    }
  }

  // button option answer check
  const handleAnswerOptionClick = async selected_option => {
    if (!answeredQuestions.hasOwnProperty(currentQuestion)) {
      addAnsweredQuestion(currentQuestion)

      let { id, answer } = questions[currentQuestion]

      let decryptedAnswer = decryptAnswer(answer, userData?.data?.firebase_id)

      let result_score = Score.current

      if (decryptedAnswer === selected_option) {
        result_score++
        Score.current = result_score
      }
       
      // this for only audio
      const currentIndex = currentQuestion;

      const currentQuestionq = questions[currentIndex];

      audioPlay(selected_option,currentQuestionq.answer)

      let update_questions = questions.map(data => {
        return data.id === id ? { ...data, selected_answer: selected_option, isAnswered: true } : data
      })

      setQuestions(update_questions)

      submitAnswer(selected_option)

      dispatch(percentageSuccess(result_score))

      onOptionClick(update_questions, result_score)

      dispatch(questionsDataSuceess(update_questions));
    }
  }

  // auto robot submit answer
  const autoRobotClick = async () => {
    let { id, answer, question_type } = questions[currentQuestion]

    let options = []

    if (question_type === '1') {
      options.push('a', 'b', 'c', 'd')
    } else if (question_type === '2') {
      options.push('a', 'b')
    } else if (systemconfig && systemconfig.option_e_mode && questions[currentQuestion].optione) {
      options.push('a', 'b', 'c', 'd', 'e')
    }

    const randomIdx = Math.floor(Math.random() * options?.length)
    const submittedAnswer = options[randomIdx]
    robotsubmitAnswer(submittedAnswer)
  }

  // robot submitAnser
  const robotsubmitAnswer = selected_option => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let user2ans = battleroom.user2.answers

          // answer push
          user2ans.push(selected_option)

          db.collection('battleRoom').doc(battleRoomDocumentId).update({
            'user2.answers': user2ans
          })

          // // anseerCheck
          answercheckSnapshot()

          // point
          checkRobotpoints(selected_option)

          // check correct answer
          checkRobotCorrectAnswers(selected_option)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // point check
  const checkRobotCorrectAnswers = option => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let user2name = battleroom.user2.name

          let user2image = battleroom.user2.profileUrl

          let user2correct = battleroom.user2.correctAnswers

          let user2uid = battleroom.user2.uid

          // store data in local storage to get in result screen
          LoadGroupBattleData('user2name', user2name)
          LoadGroupBattleData('user2image', user2image)
          LoadGroupBattleData('user2uid', user2uid)

          let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
          if (decryptedAnswer === option) {
            // correctanswer push
            db.collection('battleRoom')
              .doc(battleRoomDocumentId)
              .update({
                'user2.correctAnswers': user2correct + 1
              })
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // storing dataa of points in localstorage
  const localStorageData = (user1name, user2name, user1uid, user2uid, user1image, user2image) => {
    LoadGroupBattleData('user1name', user1name)
    LoadGroupBattleData('user2name', user2name)
    LoadGroupBattleData('user1image', user1image)
    LoadGroupBattleData('user2image', user2image)
    LoadGroupBattleData('user1uid', user1uid)
    LoadGroupBattleData('user2uid', user2uid)
  }

  const localStoragePoint = (user1point, user2point) => {
    LoadGroupBattleData('user1point', user1point)
    LoadGroupBattleData('user2point', user2point)
  }

  // submit answer
  const submitAnswer = selected_option => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let user1ans = battleroom.user1.answers

          let user2ans = battleroom.user2.answers

          // answer update in document
          if (userData?.data?.id === battleroom.user1.uid) {
            // answer push
            user1ans.push(selected_option)

            db.collection('battleRoom').doc(battleRoomDocumentId).update({
              'user1.answers': user1ans
            })
            if (playwithrobot) {
              autoRobotClick()
            }
          } else {
            // answer push
            user2ans.push(selected_option)

            db.collection('battleRoom').doc(battleRoomDocumentId).update({
              'user2.answers': user2ans
            })
          }

          // anseerCheck
          answercheckSnapshot()

          // point
          checkpoints(selected_option)

          // check correct answer
          checkCorrectAnswers(selected_option)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // point check
  const checkRobotpoints = option => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let totalseconds = timerSeconds

          let seconds = user1timer.current.getTimerSeconds()

          let finalScore = totalseconds - seconds

          let user2name = battleroom.user2.name

          let user2point = battleroom.user2.points

          let user2uid = battleroom.user2.uid

          let user2image = battleroom.user2.profileUrl

          LoadGroupBattleData('user2name', user2name)

          LoadGroupBattleData('user2image', user2image)

          LoadGroupBattleData('user2uid', user2uid)

          LoadGroupBattleData('user2point', user2point)

          let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)

          if (decryptedAnswer === option) {
            // point push
            if (finalScore < 2) {
              let totalpush = Number(systemconfig?.battle_mode_random_quickest_correct_answer_extra_score) + Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

              db.collection('battleRoom')
                .doc(battleRoomDocumentId)
                .update({
                  'user2.points': totalpush + user2point
                })
            } else if (finalScore === 3 || finalScore === 4) {
              let totalpush = Number(systemconfig?.battle_mode_random_second_quickest_correct_answer_extra_score) + Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

              db.collection('battleRoom')
                .doc(battleRoomDocumentId)
                .update({
                  'user2.points': totalpush + user2point
                })
            } else {
              let totalpush = Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

              db.collection('battleRoom')
                .doc(battleRoomDocumentId)
                .update({
                  'user2.points': totalpush + user2point
                })
            }
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // point check
  const checkpoints = option => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let totalseconds = timerSeconds

          let seconds = user1timer.current.getTimerSeconds()

          let finalScore = totalseconds - seconds

          let user1name = battleroom.user1.name

          let user2name = battleroom.user2.name

          let user1point = battleroom.user1.points

          let user2point = battleroom.user2.points

          let user1uid = battleroom.user1.uid

          let user2uid = battleroom.user2.uid

          let user1image = battleroom.user1.profileUrl

          let user2image = battleroom.user2.profileUrl

          // store data in local storage to get in result screen
          localStorageData(user1name, user2name, user1uid, user2uid, user1image, user2image)

          if (userData?.data?.id === battleroom.user1.uid) {
            let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
            if (decryptedAnswer === option) {
              // point push
              if (finalScore < 2) {
                let totalpush = Number(systemconfig?.battle_mode_random_quickest_correct_answer_extra_score) + Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

                db.collection('battleRoom')
                  .doc(battleRoomDocumentId)
                  .update({
                    'user1.points': totalpush + user1point
                  })
              } else if (finalScore === 3 || finalScore === 4) {
                let totalpush = Number(systemconfig?.battle_mode_random_second_quickest_correct_answer_extra_score) + Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

                db.collection('battleRoom')
                  .doc(battleRoomDocumentId)
                  .update({
                    'user1.points': totalpush + user1point
                  })
              } else {
                let totalpush = Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

                db.collection('battleRoom')
                  .doc(battleRoomDocumentId)
                  .update({
                    'user1.points': totalpush + user1point
                  })
              }
            }
          } else {
            let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
            if (decryptedAnswer === option) {
              // point push
              if (finalScore < 2) {
                let totalpush = Number(systemconfig?.battle_mode_random_quickest_correct_answer_extra_score) + Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

                db.collection('battleRoom')
                  .doc(battleRoomDocumentId)
                  .update({
                    'user2.points': totalpush + user2point
                  })
              } else if (finalScore === 3 || finalScore === 4) {
                let totalpush = Number(systemconfig?.battle_mode_random_second_quickest_correct_answer_extra_score) + Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

                db.collection('battleRoom')
                  .doc(battleRoomDocumentId)
                  .update({
                    'user2.points': totalpush + user2point
                  })
              } else {
                let totalpush = Number(systemconfig?.battle_mode_random_correct_answer_credit_score)

                db.collection('battleRoom')
                  .doc(battleRoomDocumentId)
                  .update({
                    'user2.points': totalpush + user2point
                  })
              }
            }
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // option answer status check
  const setAnswerStatusClass = option => {
    const currentIndex = currentQuestion;
    const currentQuestionq = questions[currentIndex];
    const color = showAnswerStatusClass(option, currentQuestionq.isAnswered, currentQuestionq.answer, currentQuestionq.selected_answer)
    return color
  }

  // on timer expire
  const onTimerExpire = () => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let user1ans = battleroom.user1.answers

          let user2ans = battleroom.user2.answers

          let playwithRobot = battleroom.playwithRobot

          if (userData?.data?.id === battleroom.user1.uid) {
            user1ans.push(-1)

            db.collection('battleRoom').doc(battleRoomDocumentId).update({
              'user1.answers': user1ans
            })
          } else {
            user2ans.push(-1)
            db.collection('battleRoom').doc(battleRoomDocumentId).update({
              'user2.answers': user2ans
            })
          }

          // ontime expire submit answer
          if (playwithRobot) {
            autoRobotClick()
          }

          // anseerCheck
          answercheckSnapshot()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  // answercheck snapshot
  const answercheckSnapshot = () => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef.onSnapshot(
      doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let useroneAnswerLength = battleroom.user1.answers?.length

          let usertwoAnswerLength = battleroom.user2.answers?.length

          let entryFee = battleroom.entryFee

          if (useroneAnswerLength != 0 || usertwoAnswerLength != 0) {
            if (useroneAnswerLength === usertwoAnswerLength) {
              setTimeout(() => {
                setNextQuestion()
              }, 1000)
              if (user1timer.current !== null && user2timer.current !== null) {
                user1timer.current.resetTimer()
                user2timer.current.resetTimer()
              }
            } else if (useroneAnswerLength > usertwoAnswerLength) {
              if (userData?.data?.id === battleroom.user1.uid) {
                if (user1timer.current !== null) {
                  user1timer.current.pauseTimer()
                }
              } else {
                if (user2timer.current !== null) {
                  user2timer.current.pauseTimer()
                }
              }
            } else if (useroneAnswerLength < usertwoAnswerLength) {
              if (userData?.data?.id === battleroom.user2.uid) {
                if (user1timer.current !== null) {
                  user1timer.current.pauseTimer()
                }
              } else {
                if (user2timer.current !== null) {
                  user2timer.current.pauseTimer()
                }
              }
            }
          }
        }
      },
      error => {
        console.log('err', error)
      }
    )
  }

  // point check
  const checkCorrectAnswers = option => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let user1name = battleroom.user1.name

          let user2name = battleroom.user2.name

          let user1image = battleroom.user1.profileUrl

          let user2image = battleroom.user2.profileUrl

          let user1correct = battleroom.user1.correctAnswers

          let user2correct = battleroom.user2.correctAnswers

          let user1uid = battleroom.user1.uid

          let user2uid = battleroom.user2.uid

          // store data in local storage to get in result screen
          LoadGroupBattleData('user1name', user1name)
          LoadGroupBattleData('user2name', user2name)
          LoadGroupBattleData('user1image', user1image)
          LoadGroupBattleData('user2image', user2image)
          LoadGroupBattleData('user1uid', user1uid)
          LoadGroupBattleData('user2uid', user2uid)

          if (userData?.data?.id === battleroom.user1.uid) {
            let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
            if (decryptedAnswer === option) {
              // correctanswer push
              db.collection('battleRoom')
                .doc(battleRoomDocumentId)
                .update({
                  'user1.correctAnswers': user1correct + 1
                })
            }
          } else if (userData?.data?.id === battleroom.user2.uid) {
            let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
            if (decryptedAnswer === option) {
              // correctanswer push
              db.collection('battleRoom')
                .doc(battleRoomDocumentId)
                .update({
                  'user2.correctAnswers': user2correct + 1
                })
            }
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  //answerlength check
  const SnapshotData = async () => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)
    let executed = false
    let TotalUserLength = false

    documentRef.onSnapshot(
      doc => {
        let navigatetoresult = true

        if (doc.exists) {
          let battleroom = doc.data()

          let user1point = battleroom.user1.points

          let entryFee = battleroom.entryFee

          LoadGroupBattleData('entryFee', entryFee)

          let user2point = battleroom.user2.points

          let userone = battleroom.user1

          let usertwo = battleroom.user2

          let user1uid = battleroom.user1.uid

          let user2uid = battleroom.user2.uid

          let user1correctanswer = userone.correctAnswers

          let playwithrobot = battleroom?.playwithRobot

          LoadGroupBattleData('user1CorrectAnswer', user1correctanswer)

          let user2correctanswer = usertwo.correctAnswers

          LoadGroupBattleData('user2CorrectAnswer', user2correctanswer)

          // this only for robot
          if (playwithrobot) {
            setPlaywithrobot(true)
          }

          // point update in localstorage
          localStoragePoint(user1point, user2point)

          let navigateUserData = []

          navigateUserData = [userone, usertwo]

          setBattleUserData([userone, usertwo])

          // if user length is less than 1
          const newUser = [userone, usertwo]

          const usersWithNonEmptyUid = newUser.filter(elem => elem.uid !== '')

          if (!TotalUserLength) {
            TotalUserLength = true
            LoadGroupBattleData('totalusers', usersWithNonEmptyUid?.length)
          }

          // here check if user enter the game coin deduct its first time check
          if (!executed) {
            executed = true
            newUser.forEach(obj => {
              if (userData?.data?.id === obj.uid && obj.uid !== '' && battleroom.entryFee > 0) {
                const status = 1
                // when play with robot coin not deducte if user id === 000
                if (user2uid !== "000") {
                  UserCoinScoreApi(
                    '-' + battleroom.entryFee,
                    null,
                    null,
                    t('Played Battle'),
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
                }
              }
            })
          }

          const usersuid = [user1uid, user2uid]

          const newArray = newUser.filter(obj => Object.keys(obj.uid)?.length > 0)

          // console.log("newarray",newArray,newArray?.length,usersuid.includes(userData?.data?.id))

          if (usersuid.includes(userData?.data?.id) && newArray?.length < 2) {
            MySwal.fire({
              title: t('Opponent has left the game!'),
              icon: 'warning',
              showCancelButton: false,
              customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
              confirmButtonText: t('ok')
            }).then(result => {
              if (result.isConfirmed) {
                navigate.push('/all-games')
                deleteBattleRoom(battleRoomDocumentId)
              }
            })
          }

          //checking if every user has given all question's answer
          navigateUserData.forEach(elem => {
            if (elem.uid != '') {
              // console.log("answer",elem.answers?.length, questions?.length)
              if (elem.answers?.length < questions?.length) {
                navigatetoresult = false
              }
            }
          })

          if (navigatetoresult) {
            // end screen
            onQuestionEnd()
            deleteBattleRoom(battleRoomDocumentId)
          }
        } else {
          if (navigatetoresult && questions?.length < currentQuestion) {
            navigate.push('/')
          } else {
            onQuestionEnd()
          }
        }
      },
      error => {
        console.log('err', error)
      }
    )
  }

  useEffect(() => {
    checkCorrectAnswers()
  }, [])

  useEffect(() => {
    SnapshotData()
    answercheckSnapshot()
    checkpoints()

    return () => {
      let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

      documentRef.onSnapshot(
        doc => {
          if (doc.exists) {
            let battleroom = doc.data()

            let user1uid = battleroom && battleroom.user1.uid

            let user2uid = battleroom && battleroom.user2.uid

            let roomid = doc.id

            if (user1uid == userData?.data?.id) {
              db.collection('battleRoom').doc(roomid).update({
                'user1.name': '',
                'user1.uid': '',
                'user1.profileUrl': ''
              })
            } else if (user2uid == userData?.data?.id) {
              db.collection('battleRoom').doc(roomid).update({
                'user2.name': '',
                'user2.uid': '',
                'user2.profileUrl': ''
              })
            }

            navigate.push('/all-games')
            deleteBattleRoom(roomid)
          }
        },
        error => {
          console.log('err', error)
        }
      )
    }
  }, [])

  const handleBookmarkClick = (question_id, isBookmarked) => {
    let type = 1
    let bookmark = '0'

    if (isBookmarked) bookmark = '1'
    else bookmark = '0'

    return setbookmarkApi(
      question_id,
      bookmark,
      type,
      response => {
        if (response.error) {
          toast.error(t('Cannot Remove Question from Bookmark'))
          return false
        } else {
          if (isBookmarked) {
            getAndUpdateBookmarkData(type)
          } else {
            deleteBookmarkByQuestionID(question_id)
          }
          return true
        }
      },
      error => {
        console.error(error)
      }
    )
  }

  // const addMessage = async (message, by, roomId, isTextMessage ) => {
  //   try {
  //     let documentreference = db.collection('messages').add({
  //       by: by,
  //       isTextMessage: isTextMessage,
  //       message: message,
  //       messageId: '',
  //       roomId: roomId,
  //       timestamp: Date.now()
  //     })

  //     return await documentreference
  //   } catch (error) {
  //     toast.error(error)
  //   }
  // }

  // const getUserLatestMessage = (userId, messageId) => {
  //   if (messageList.messageListData.length > 0) {
  //     const messagesByUser = messageList.messageListData.filter((element) => element.by === userId);

  //     if (messagesByUser.length === 0) {
  //       return { by: '', isTextMessage: false, message: '', messageId: '', roomId: '', timestamp: null };
  //     }

  //     if (messageId === null) {
  //       return messagesByUser[0];
  //     }

  //     return messagesByUser[0].messageId === messageId
  //       ? { by: '', isTextMessage: false, message: '', messageId: '', roomId: '', timestamp: null }
  //       : messagesByUser[0];
  //   }
  //   return { by: '', isTextMessage: false, message: '', messageId: '', roomId: '', timestamp: null };
  // };

  
  const loggedInUserData = battleUserData.find(item => item.uid === userData?.data?.id);


  return (
    <React.Fragment>
      <div className='dashboardPlayUppDiv funLearnQuestionsUpperDiv selfLearnQuestionsUpperDiv text-end p-2 pb-0'>
        <div className="leftSec">
          <div className="coins">
            <span>{t("Coins")} : {userData?.data?.coins}</span>
          </div>
        </div>

        <div className="rightSec">
          <div className="rightWrongAnsDiv correctIncorrect">
            <span className='rightAns'>
              {currentQuestion + 1} - {questions?.length}</span>
          </div>
          <div className="p-2 pb-0">
            {showBookmark ? (
              <Bookmark
                id={questions[currentQuestion].id}
                isBookmarked={questions[currentQuestion].isBookmarked ? questions[currentQuestion].isBookmarked : true}
                onClick={handleBookmarkClick}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <div className='questions battlequestion' ref={scroll}>
        <div className='content__text'>
          <p className='question-text pt-4'>{questions[currentQuestion].question}</p>
        </div>

        {questions[currentQuestion].image ? (
          <div className='imagedash'>
            <img src={questions[currentQuestion].image} onError={imgError} alt='' />
          </div>
        ) : (
          ''
        )}

        {/* options */}
        <div className='row optionsWrapper'>
          {questions[currentQuestion].optiona ? (
            <div className='col-md-6 col-12'>
              <div className='inner__questions'>
                <button
                  className={`btn button__ui w-100 ${setAnswerStatusClass('a')}`}
                  onClick={e => handleAnswerOptionClick('a')}
                >
                  <div className='row'>
                    <div className='col'>{questions[currentQuestion].optiona}</div>
                    {questions[currentQuestion].probability_a ? (
                      <div className='col text-end'>{questions[currentQuestion].probability_a}</div>
                    ) : (
                      ''
                    )}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
          {questions[currentQuestion].optionb ? (
            <div className='col-md-6 col-12'>
              <div className='inner__questions'>
                <button
                  className={`btn button__ui w-100 ${setAnswerStatusClass('b')}`}
                  onClick={e => handleAnswerOptionClick('b')}
                >
                  <div className='row'>
                    <div className='col'>{questions[currentQuestion].optionb}</div>
                    {questions[currentQuestion].probability_b ? (
                      <div className='col text-end'>{questions[currentQuestion].probability_b}</div>
                    ) : (
                      ''
                    )}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
          {questions[currentQuestion].question_type === '1' ? (
            <>
              {questions[currentQuestion].optionc ? (
                <div className='col-md-6 col-12'>
                  <div className='inner__questions'>
                    <button
                      className={`btn button__ui w-100 ${setAnswerStatusClass('c')}`}
                      onClick={e => handleAnswerOptionClick('c')}
                    >
                      <div className='row'>
                        <div className='col'>{questions[currentQuestion].optionc}</div>
                        {questions[currentQuestion].probability_c ? (
                          <div className='col text-end'>{questions[currentQuestion].probability_c}</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                ''
              )}
              {questions[currentQuestion].optiond ? (
                <div className='col-md-6 col-12'>
                  <div className='inner__questions'>
                    <button
                      className={`btn button__ui w-100 ${setAnswerStatusClass('d')}`}
                      onClick={e => handleAnswerOptionClick('d')}
                    >
                      <div className='row'>
                        <div className='col'>{questions[currentQuestion].optiond}</div>
                        {questions[currentQuestion].probability_d ? (
                          <div className='col text-end'>{questions[currentQuestion].probability_d}</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                ''
              )}
              {systemconfig && systemconfig.option_e_mode && questions[currentQuestion].optione ? (
                <div className='row d-flex justify-content-center mob_resp_e'>
                  <div className='col-md-6 col-12'>
                    <div className='inner__questions'>
                      <button
                        className={`btn button__ui w-100 ${setAnswerStatusClass('e')}`}
                        onClick={e => handleAnswerOptionClick('e')}
                      >
                        <div className='row'>
                          <div className='col'>{questions[currentQuestion].optione}</div>
                          {questions[currentQuestion].probability_e ? (
                            <div className='col' style={{ textAlign: 'right' }}>
                              {questions[currentQuestion].probability_e}
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
        </div>

        <div className='divider'>
          <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
        </div>

        {/* user1 */}
        <div className='user_data onevsone'>
          <div className='user_one mb-4'>
            {/* timer */}
            <div className='inner__headerdash'>
              {questions && questions[0]['id'] !== '' ? (
                <Timer ref={user1timer} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} />
              ) : (
                ''
              )}
            </div>
            {/* userinfo */}
            <div className='inner_user_data onevsonedetails'>
              <div className='username'>
                <p>{loggedInUserData?.name ? loggedInUserData?.name : "Waiting..."}</p>
              </div>
              <div className='userpoints'>
                <div className="rightWrongAnsDiv">
                  <span className='rightAns'>
                    <img src={rightTickIcon.src} alt="" />
                    {loggedInUserData?.correctAnswers ? loggedInUserData?.correctAnswers : 0} / <span>{questions?.length}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='user_two mb-4'>
            {/* timer */}
            <div className='inner__headerdash'>
              {questions && questions[0]['id'] !== '' ? (
                <Timer ref={user2timer} timerSeconds={timerSeconds} onTimerExpire={() => { }} />
              ) : (
                ''
              )}
            </div>
            {/* userinfo */}
            {battleUserData?.map(data => (
              data.uid !== userData?.data?.id &&
                data.uid !== '' ? (
                <>
                  <div className='inner_user_data'>
                    <div className='username'>
                      <p>{data.name ? data.name : 'Waiting...'}</p>
                    </div>
                    <div className='userpoints'>
                      <div className="rightWrongAnsDiv">
                        <span className='rightAns'>
                          <img src={rightTickIcon.src} alt="" />
                          {data.correctAnswers ? data.correctAnswers : 0} / <span>{questions?.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

RandomQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired
}

export default withTranslation()(RandomQuestions)
