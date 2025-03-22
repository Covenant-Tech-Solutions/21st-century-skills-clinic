"use client"
import React, { useEffect, useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { imgError } from 'src/utils'
import { Form } from 'react-bootstrap'
import { Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { categoriesApi } from 'src/store/actions/campaign'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { groupbattledata, LoadGroupBattleData, loadShowScoreData } from 'src/store/reducers/groupbattleSlice'
import { Loadtempdata, playwithFrienddata, reviewAnswerShowSuccess } from 'src/store/reducers/tempDataSlice'
import FirebaseData from 'src/utils/Firebase'
import { useRouter } from 'next/navigation'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import Timer from 'src/components/Common/Timer'
import dynamic from 'next/dynamic'
import vsimg from "src/assets/images/vs.svg"
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const RandomBattle = () => {
  // store data get
  const userData = useSelector(state => state.User)

  const dispatch = useDispatch()

  const selectcurrentLanguage = useSelector(selectCurrentLanguage)

  const groupBattledata = useSelector(groupbattledata)

  const systemconfig = useSelector(sysConfigdata)

  const [category, setCategory] = useState({
    all: '',
    selected: '',
    category_name: ""
  })

  const random_battle_entry_coin = systemconfig?.battle_mode_random_entry_coin

  const bot_image = systemconfig && systemconfig.bot_image

  const [loading, setLoading] = useState(true)

  const [showbattle, setShowBattle] = useState(false)

  const [retrymodal, setretryModal] = useState(false)

  const [showTimer, setShowTimer] = useState(false)

  const [oldtimer, setOldTimer] = useState(false)

  // userdata
  const [userdata, setUserdata] = useState({
    userName: '',
    profile: ''
  })

  const coninsUpdate = userData && Number(userData?.data?.coins)

  const child = useRef(null)

  const navigate = useRouter()

  const { db, firebase } = FirebaseData()

  let languageid = selectcurrentLanguage.id

  let category_selected = systemconfig && systemconfig.battle_mode_random_category == '1' ? category.selected : ''

  let username = userData?.data?.name || userData?.data?.email || userData?.data?.mobile

  let userprofile = userData?.data?.profile ? userData?.data?.profile : ''

  let useruid = userData?.data?.id

  // coins
  let entrycoins = random_battle_entry_coin && Number(random_battle_entry_coin)

  let timerseconds = Number(systemconfig?.battle_mode_random_search_duration)


  // get category data
  const getAllData = () => {
    categoriesApi(
      1,
      2,
      response => {
        let categoires = response.data
        // Filter the categories based on has_unlocked and is_premium
        const filteredCategories = categoires.filter(category => {
          return category.is_premium === '0'
        })
        setCategory({
          ...category,
          all: filteredCategories,
          selected: filteredCategories[0].id,
          category_name: filteredCategories[0].category_name
        })
        setLoading(false)
      },
      error => {
        setLoading(false)
        console.log(error)
      }
    )
  }

  // select category
  const handleSelectCategory = e => {
    const index = e.target.selectedIndex
    const el = e.target.childNodes[index]
    let cat_id = el.getAttribute('id')
    let cat_name = el.getAttribute('name')
    setCategory({ ...category, selected: cat_id, category_name: cat_name })
  }

  // database collection with bot
  const createBattleRoomWithBot = async (
    categoryId,
    name,
    profileUrl,
    uid,
    roomCode,
    roomType,
    entryFee,
    questionlanguageId
  ) => {
    try {
      let documentreference = db.collection('battleRoom').add({
        categoryId: categoryId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: uid,
        entryFee: entryFee ? entryFee : 0,
        languageId: questionlanguageId,
        readyToPlay: false,
        roomCode: roomCode ? roomCode : '',
        playwithRobot: true,
        user1: {
          answers: [],
          name: name,
          points: 0,
          profileUrl: profileUrl,
          uid: uid,
          correctAnswers: 0
        },
        user2: {
          answers: [],
          name: t('botName'),
          points: 0,
          profileUrl: bot_image,
          uid: '000',
          correctAnswers: 0
        }
      })

      return await documentreference
    } catch (error) {
      toast.error(error)
    }
  }

  // database collection
  const createBattleRoom = async (
    categoryId,
    name,
    profileUrl,
    uid,
    roomCode,
    roomType,
    entryFee,
    questionlanguageId
  ) => {
    try {

      let documentreference = db.collection('battleRoom').add({
        categoryId: categoryId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: uid,
        entryFee: entryFee ? entryFee : 0,
        languageId: questionlanguageId,
        categoryName: category?.category_name,
        readyToPlay: false,
        roomCode: roomCode ? roomCode : '',
        user1: {
          answers: [],
          name: name,
          points: 0,
          profileUrl: profileUrl,
          uid: uid,
          correctAnswers: 0
        },
        user2: {
          answers: [],
          name: '',
          points: 0,
          profileUrl: '',
          uid: '',
          correctAnswers: 0
        }
      })


      return await documentreference
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  // delete battle room
  const deleteBattleRoom = async documentId => {
    try {
      await db.collection('battleRoom').doc(documentId).delete()
    } catch (error) {
      toast.error(error)
    }
  }

  // find room
  const searchBattleRoom = async (languageId, categoryId) => {
    try {
      let userfind = await db
        .collection('battleRoom')
        .where('languageId', '==', languageId)
        .where('categoryId', '==', categoryId)
        .where('roomCode', '==', '')
        .where('user2.uid', '==', '')
        .get()

      let userfinddata = userfind.docs

      let index = userfinddata.findIndex(elem => {
        return elem.data().createdBy == useruid
      })

      if (index !== -1) {
        deleteBattleRoom(userfinddata[index].id)
        userfinddata.splice(userfinddata?.length, index)
      }

      return userfinddata
    } catch (err) {
      toast.error('Error getting document', err)
      console.log(err)
    }
  }

  // join battle room
  const joinBattleRoom = async (name, profileUrl, uid, battleRoomDocumentId) => {
    try {
      let documentRef = (await db.collection('battleRoom').doc(battleRoomDocumentId).get()).ref

      return db.runTransaction(async transaction => {
        let document = await transaction.get(documentRef)

        let userdetails = document.data()

        let user2 = userdetails.user2

        LoadGroupBattleData('totalusers', 2)

        if (user2.uid === '') {
          transaction.update(documentRef, {
            'user2.name': name,
            'user2.uid': uid,
            'user2.profileUrl': profileUrl
          })

          return false
        }

        return true
      })
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
  }

  // join battle room with bot
  const joinBattleRoomWithBot = async (name, profileUrl, uid, battleRoomDocumentId) => {
    try {
      let documentRef = (await db.collection('battleRoom').doc(battleRoomDocumentId).get()).ref

      return db.runTransaction(async transaction => {
        let document = await transaction.get(documentRef)

        let userdetails = document.data()

        let user2 = userdetails.user2

        LoadGroupBattleData('totalusers', 2)

        if (user2.uid === '') {
          transaction.update(documentRef, {
            'user2.name': name,
            'user2.uid': uid,
            'user2.profileUrl': profileUrl
          })

          return false
        }

        return true
      })
    } catch (error) {
      toast.error(error)
      // console.log(error)
    }
  }

  // waiting seconds before match start
  const seconduserfound = () => {
    let roomid = groupBattledata.roomID

    navigate.push({ pathname: '/random-battle/random-play' })

    let data = {
      category_id: category_selected,
      room_id: roomid,
      destroy_match: '0'
    }

    Loadtempdata(data)
  }

  // // redirect question screen
  const TimerScreen = () => {
    setOldTimer(false)
    setShowTimer(true)
    // readytoplaytimer.current.startTimer();
  }

  // time expire
  const onTimerExpire = () => {
    let roomid = groupBattledata.roomID
    deleteBattleRoom(roomid)
    setretryModal(true)
  }

  // subsscribebattle room
  const subscribeToBattleRoom = battleRoomDocumentId => {
    let documentRef = db.collection('battleRoom').doc(battleRoomDocumentId)

    documentRef.onSnapshot(
      { includeMetadataChanges: true },
      doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let userNotfound = battleroom.user2.uid

          if (userNotfound !== '') {
            setShowBattle(true)
            TimerScreen()
          } else {
            setOldTimer(true)
          }

          // for user1
          if (userData?.data?.id === battleroom.user1.uid) {
            setUserdata({ ...userdata, userName: battleroom.user2.name, profile: battleroom.user2.profileUrl })
          } else {
            setUserdata({ ...userdata, userName: battleroom.user1.name, profile: battleroom.user1.profileUrl })
          }
        }
      },
      error => {
        console.log('err', error)
      }
    )
  }

  // snapshot listner
  useEffect(() => {
    subscribeToBattleRoom()
  }, [])

  //create room for battle
  const createRoom = async () => {
    // battleroom joiing state

    if (coninsUpdate === '0' && coninsUpdate < 0) {
      setShowBattle(false)
      return
    }

    // coins deduction
    if (userData?.data?.coins < entrycoins) {
      toast.error(t('You dont have enough coins'))
      return false
    }

    let roomCode = ''

    let data = await createBattleRoom(
      category_selected,
      username,
      userprofile,
      useruid,
      roomCode,
      'public',
      entrycoins,
      languageid,
    )

    return data.id
  }

  //create room for battle with bot
  const createRoomWithBot = async () => {
    // battleroom joiing state

    if (coninsUpdate === '0' && coninsUpdate < 0) {
      setShowBattle(false)
      return
    }

    // coins deduction
    if (userData?.data?.coins < entrycoins) {
      toast.error(t('You dont have enough coins'))
      return false
    }

    let roomCode = ''

    let data = await createBattleRoomWithBot(
      category_selected,
      username,
      userprofile,
      useruid,
      roomCode,
      'public',
      entrycoins,
      languageid
    )

    return data.id
  }

  // search room
  const searchRoom = async () => {
    if (coninsUpdate === '0' && coninsUpdate < 0) {
      setShowBattle(false)
      return
    }

    // coins deduction
    if (userData?.data?.coins <= entrycoins) {
      toast.error(t('You dont have enough coins'))
      return false
    }

    try {
      let documents = await searchBattleRoom(languageid, category_selected, username, userprofile, useruid)

      let roomdocid

      if (documents?.length !== 0) {
        let room = documents[Math.floor(Math.random() * documents?.length)]

        roomdocid = room.id

        let searchAgain = await joinBattleRoom(username, userprofile, useruid, roomdocid)
        if (searchAgain) {
          searchRoom(languageid, category_selected, username, userprofile, useruid)
        } else {
          subscribeToBattleRoom(roomdocid)
        }
      } else {
        roomdocid = await createRoom()
        // createRoom();
      }
      setShowBattle(true)
      subscribeToBattleRoom(roomdocid)
      LoadGroupBattleData('roomid', roomdocid)
    } catch (error) {
      toast.error(error)
    }
  }

  // search room wit bot
  const searchRoomWithBot = async () => {
    if (coninsUpdate === '0' && coninsUpdate < 0) {
      setShowBattle(false)
      return
    }

    try {
      let documents = await searchBattleRoom(languageid, category_selected, username, userprofile, useruid)

      let roomdocid

      if (documents?.length !== 0) {
        let room = documents[Math.floor(Math.random() * documents?.length)]

        roomdocid = room.id

        let searchAgain = await joinBattleRoomWithBot(username, userprofile, useruid, roomdocid)
        if (searchAgain) {
          searchRoomWithBot(languageid, category_selected, username, userprofile, useruid)
        } else {
          subscribeToBattleRoom(roomdocid)
        }
      } else {
        roomdocid = await createRoomWithBot()
      }
      setShowBattle(true)
      subscribeToBattleRoom(roomdocid)
      LoadGroupBattleData('roomid', roomdocid)
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
  }

  // retry play
  const retryPlay = () => {
    setretryModal(false)
    child.current.resetTimer()
    searchRoom()
    loadShowScoreData(false)
  }

  const retryPlaybot = () => {
    setretryModal(false)
    child.current.resetTimer()
    searchRoomWithBot()
    loadShowScoreData(true)
  }

  const PlaywithFriend = () => {
    navigate.push({ pathname: '/random-battle/play-with-friend-battle' })
    let data = {
      category_id: category_selected,
      language_id: languageid
    }
    playwithFrienddata(data)
  }

  useEffect(() => {
    getAllData()
    dispatch(reviewAnswerShowSuccess(false))
  }, [selectCurrentLanguage])

  const onBackScreen = () => {
    navigate.push('/all-games')
  }

  return (
    <Layout>
      <Breadcrumb title={t('1 vs 1 Battle')} content="" contentTwo="" />
      <div className='SelfLearning battlequiz my-5'>
        <div className='container'>
          <div className='row morphisam'>
            {/* battle screen */}
            {showbattle ? (
              <div className='col-md-8 col-12 mx-auto'>
                <div className='randomplayer'>
                  <div className='main_screen'>
                    <div className='timer text-center'>
                      {oldtimer ? <Timer ref={child} timerSeconds={timerseconds} onTimerExpire={onTimerExpire} /> : ''}

                      {showTimer ? (
                        <>
                          <Timer ref={child} timerSeconds={3} onTimerExpire={seconduserfound} />
                          <p className='text-dark'>{t('Lets Get Started')}</p>
                        </>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className='inner_Screen onevsonescreen'>
                      <div className='user_profile'>
                        <img src={userData?.data?.profile} alt='wrteam' onError={imgError} />
                        <p className='mt-3 text-dark'>
                          {userData?.data?.name || userData?.data?.email || userData?.data?.mobile}
                        </p>
                      </div>
                      <div className='vs_image'>
                        <img src={vsimg.src} alt='versus' />
                      </div>
                      <div className='opponent_image'>
                        <img
                          src={typeof userdata.profile === 'undefined' ? '' : userdata.profile}
                          alt='wrteam'
                          onError={imgError}
                        />
                        <p className='mt-3 text-dark'>
                          {typeof userdata.userName === 'undefined' ? 'waiting...' : userdata.userName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
              {systemconfig?.battle_mode_random === "1" ?
                <div className='col-md-12 col-lg-6 col-12'>
                  <div className='left_content'>
                    <div className='left-sec right_content'>
                      <h3 className=' mb-3 leftSecTite'>{t('Random Battle')}</h3>
                      <hr />
                      <div className='two_header_content d-flex flex-wrap align-items-center mb-3 mt-4'>
                        <div className='random_fees '>
                          <p>
                            {t('Entry Fees')}:{' '}
                            <span>
                              {entrycoins} {''}
                              {t('Coins')}
                            </span>
                          </p>
                        </div>
                        <div className='random_current_coins'>
                          <p>
                            {t('Current Coins')}:
                            <span>
                              {coninsUpdate} {t("Coins")}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className='bottom__cat__box'>
                        {(() => {
                          if (systemconfig && systemconfig.battle_mode_random_category == '1') {
                            return (
                              <div className="seleterWrapper">
                                <Form.Select
                                  aria-label='Default select example'
                                  size='lg'
                                  className='selectform'
                                  onChange={e => handleSelectCategory(e)}
                                >
                                  {loading ? (
                                    <option>{t('Loading...')}</option>
                                  ) : (
                                    <>
                                      {category.all ? (
                                        category.all.map((cat_data, key) => {
                                          // console.log("",cat_data)
                                          const { category_name } = cat_data
                                          return (
                                            <option key={key} name={cat_data.category_name} value={cat_data.key} id={cat_data.id} no_of={cat_data.no_of}>
                                              {category_name}
                                            </option>
                                          )
                                        })
                                      ) : (
                                        <option>{t('No Category Data Found')}</option>
                                      )}
                                    </>
                                  )}
                                </Form.Select>
                              </div>
                            )
                          }
                        })()}
                        <div className='random_play'>
                          <button type='submit' className='btn btn-primary' onClick={() => searchRoom()}>
                            {t('play-now')}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                : null
              }
              {systemconfig?.battle_mode_one === "1" ?
                <div className='col-md-12 col-lg-6 col-12'>
                  <div className='left_content'>
                    <div className='left-sec right_content'>
                      <h3 className=' mb-3 leftSecTite'>{t('play-with-friend')}</h3>
                      <hr />
                      <div className='two_header_content d-flex flex-wrap align-items-center mb-3 mt-4'>
                        <div className='playFrdPara'>
                          <p>{t("playFrdPara")}</p>
                        </div>
                      </div>
                      <div className='bottom__cat__box'>
                        <div className='random_play'>
                          <button className='btn btn-primary' onClick={() => PlaywithFriend(true)}>
                            {t('Play With Friend')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                : null}
              </>
            )}
          </div>
        </div>
      </div>

      {/* retry modal */}
      <Modal
        centered
        maskClosable={false}
        visible={retrymodal}
        onOk={() => setretryModal(false)}
        onCancel={() => {
          onBackScreen()
          setretryModal(false)
        }}
        footer={null}
        className='custom_modal_notify retry-modal'
      >
        {retrymodal ? (
          <>
            <div className='nouser d-flex justify-content-center align-items-center flex-column'>
              <h5 className=' text-center'>
                {t("No opponent detected. Retry or play against a bot.")} <br></br>
              </h5>
              <button className='btn btn-primary mt-2' onClick={() => retryPlaybot()}>
                {t("Play With bot")}
              </button>
              <button className='btn btn-primary mt-2' onClick={() => retryPlay()}>
                {t('Retry')}
              </button>
            </div>
          </>
        ) : (
          ''
        )}
      </Modal>
    </Layout>
  )
}

export default withTranslation()(RandomBattle)
