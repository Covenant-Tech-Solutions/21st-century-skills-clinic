"use client"
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { withTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Modal, Tabs } from 'antd'
import { Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { categoriesApi, createMultiRoomApi } from 'src/store/actions/campaign'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { settingsData, sysConfigdata } from 'src/store/reducers/settingsSlice'
import { battleDataClear, groupbattledata, LoadGroupBattleData } from 'src/store/reducers/groupbattleSlice'
import { Loadtempdata } from 'src/store/reducers/tempDataSlice'
import { imgError, roomCodeGenerator } from 'src/utils/index'
import { websettingsData } from 'src/store/reducers/webSettings'
import { useRouter } from 'next/router'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { IoShareSocialOutline } from "react-icons/io5";
import ShareMenu from 'src/components/Common/ShareMenu'
import coinimg from "src/assets/images/coin.svg"
import FirebaseData from 'src/utils/Firebase'
import vsimg from "src/assets/images/vs.svg"
import { t } from 'i18next'


const GroupBattle = () => {

  const MySwal = withReactContent(Swal)

  // store data get
  const userData = useSelector(state => state.User)

  const systemconfig = useSelector(sysConfigdata)

  const groupBattledata = useSelector(groupbattledata)

  const websettingsdata = useSelector(websettingsData)

  const selectdata = useSelector(settingsData)

  const appdata = selectdata && selectdata.filter(item => item.type == 'app_name')

  // website link
  const web_link_footer = websettingsdata && websettingsdata.web_link_footer

  const appName = appdata && appdata?.length > 0 ? appdata[0].message : ''

  const [battleUserData, setBattleUserData] = useState([])

  const TabPane = Tabs.TabPane

  const [category, setCategory] = useState({
    all: '',
    selected: '',
    category_name: ""
  })

  let playerremove = useRef(false)

  const [loading, setLoading] = useState(true)

  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const [shouldGenerateRoomCode, setShouldGenerateRoomCode] = useState(false)

  const [selectedCoins, setSelectedCoins] = useState({ all: '', selected: '' })

  const [playwithfriends, setPlaywithfriends] = useState(false)

  const [joinuserpopup, setJoinUserPopup] = useState(false)

  const [inputCode, setInputCode] = useState('')

  const [showStart, setShowStart] = useState(false)

  const [dociddelete, setDocidDelete] = useState(false)

  const [activeTab, setActiveTab] = useState('1');

  const battle_mode_group_entry_coin_data = systemconfig && systemconfig?.battle_mode_group_entry_coin

  const [createdByroom, setCreatedByRoom] = useState()

  const { db, firebase } = FirebaseData()

  const inputRef = useRef()

  const navigate = useRouter()

  const [modalVisible, setModalVisible] = useState(false);

  const currentUrl = process.env.NEXT_PUBLIC_APP_WEB_URL + navigate.asPath;

  let category_selected = category.selected

  let username = userData?.data?.name || userData?.data?.email || userData?.data?.mobile

  let userprofile = userData?.data?.profile ? userData?.data?.profile : ''

  let useruid = userData?.data?.id

  let usercoins = userData && userData?.data?.coins

  let selectedcoins = Number(selectedCoins.selected)

  let inputText = useRef(null)

  let roomiddata = groupBattledata.roomID

  let owner = useRef({
    readyplay: null,
    ownerID: null,
    roomid: null
  })

  // language mode

  // get category data
  const getAllData = () => {
    categoriesApi(
      1,
      3,
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
        console.log(error)
      }
    )
  }

  // database collection
  const createBattleRoom = async (categoryId, name, profileUrl, uid, roomCode, roomType, entryFee) => {
    try {
      let documentreference = db.collection('multiUserBattleRoom').add({
        categoryId: categoryId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: uid,
        entryFee: entryFee ? entryFee : 0,
        readyToPlay: false,
        categoryName: category?.category_name,
        roomCode: roomCode ? roomCode : '',
        user1: {
          answers: [],
          correctAnswers: 0,
          name: name,
          profileUrl: profileUrl,
          uid: uid
        },
        user2: {
          answers: [],
          correctAnswers: 0,
          name: '',
          profileUrl: '',
          uid: ''
        },
        user3: {
          answers: [],
          correctAnswers: 0,
          name: '',
          profileUrl: '',
          uid: ''
        },
        user4: {
          answers: [],
          correctAnswers: 0,
          name: '',
          profileUrl: '',
          uid: ''
        }
      })

      // created id by user to check for result screen
      LoadGroupBattleData('createdby', uid)
      setShowStart(true)

      return await documentreference
    } catch (error) {
      toast.error(error)
    }
  }

  // delete battle room
  const deleteBattleRoom = async documentId => {
    try {
      await db.collection('multiUserBattleRoom').doc(documentId).delete()
    } catch (error) {
      toast.error(error)
    }
  }

  // find room
  const searchBattleRoom = async categoryId => {
    try {
      let userfind = await db
        .collection('multiUserBattleRoom')
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
    }
  }

  // search room
  const searchRoom = async () => {
    let inputCoincheck = inputText.current.value
    let usercoins = userData?.data?.coins

    if (selectedCoins.selected === "") {
      toast.error("Please select coins and enter value in numeric value")
      return
    }

    if (Number(inputCoincheck) > Number(usercoins)) {
      toast.error(t('you dont have enough coins'))
      return
    }

    try {
      let documents = await searchBattleRoom(category_selected)

      let roomdocid

      if (documents?.length !== 0) {
        let room = documents

        roomdocid = room.id
      } else {
        roomdocid = await createRoom()
      }

      LoadGroupBattleData('roomid', roomdocid)
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
  }

  // redirect question screen
  const questionScreen = (roomCode, roomid) => {
    navigate.push('/group-battle/group-play')
    let data = {
      roomCode: roomCode,
      roomid: roomid
    }
    Loadtempdata(data)
  }

  // room code generator
  const randomFixedInteger = length => {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    ).toString()
  }

  //create room for battle
  const createRoom = async () => {
    // battleroom joiing state

    if (usercoins < 0 || usercoins === '0') {
      toast.error(t('you dont have enough coins'))
      return
    }

    let roomCode = ''

    //genarate room code
    roomCode = roomCodeGenerator("groupbattle")

    setShouldGenerateRoomCode(roomCode)

    LoadGroupBattleData('roomCode', roomCode)

    // pass room code in sql database for fetching questions
    createRoommulti(roomCode)

    let data = await createBattleRoom(
      systemconfig.battle_group_category_mode == '1' ? category_selected : '',
      username,
      userprofile,
      useruid,
      roomCode,
      'public',
      selectedcoins
    )
    // popup user found with friend
    setPlaywithfriends(true)

    return data.id
  }

  // joinroom
  const joinRoom = async (name, profile, usernameid, roomcode, coin) => {
    try {
      if (!roomcode) {
        setIsButtonClicked(false)
        setJoinUserPopup(false)
        toast.error(t('please enter a room code'))
      } else {
        let result = await joinBattleRoomFrd(name, profile, usernameid, roomcode, coin)
        if (typeof result === 'undefined') {
          setIsButtonClicked(false)
          setJoinUserPopup(false)
          toast.error(t('room code is not valid'))
        } else {
          setJoinUserPopup(true)
          LoadGroupBattleData('roomid', result.id)
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }

  // get userroom
  const getMultiUserBattleRoom = async roomcode => {
    try {
      let typeBattle = await db.collection('multiUserBattleRoom').where('roomCode', '==', roomcode).get()
      return typeBattle
    } catch (e) {
      console.log('error', e)
    }
  }

  // joinBattleRoomFrd
  const joinBattleRoomFrd = async (name, profile, usernameid, roomcode, coin) => {
    try {
      // check roomcode is valid or not
      let mulituserbattle = await getMultiUserBattleRoom(roomcode)

      // // game started code
      if (mulituserbattle.docs[0].data().readyToPlay) {
        toast.success('Game Started')
      }

      // // not enough coins
      if (mulituserbattle.docs[0].data().entryFee > coin) {
        toast.error(t('Not enough coins'))
        return
      }

      //user2 update
      let docRef = mulituserbattle.docs[0].ref

      return db.runTransaction(async transaction => {
        let doc = await transaction.get(docRef)

        if (!doc.exists) {
          toast.error('Document does not exist!')
        }

        let userdetails = doc.data()

        let user2 = userdetails.user2

        let user3 = userdetails.user3

        let user4 = userdetails.user4

        if (user2.uid === '') {
          transaction.update(docRef, {
            'user2.name': name,
            'user2.uid': usernameid,
            'user2.profileUrl': profile
          })
        } else if (user3.uid === '') {
          transaction.update(docRef, {
            'user3.name': name,
            'user3.uid': usernameid,
            'user3.profileUrl': profile
          })
        } else if (user4.uid === '') {
          transaction.update(docRef, {
            'user4.name': name,
            'user4.uid': usernameid,
            'user4.profileUrl': profile
          })
        } else {
          toast.error(t('room is full'))
        }

        return doc
      })

      //
    } catch (e) {
      console.log('error', e)
    }
  }

  // coins data
  const coinsdata = [
    { id: '1', num: battle_mode_group_entry_coin_data },
    { id: '2', num: battle_mode_group_entry_coin_data * 2 },
    { id: '3', num: battle_mode_group_entry_coin_data * 3 },
    { id: '4', num: battle_mode_group_entry_coin_data * 4 }
  ]

  // selected coins data
  const selectedCoinsdata = data => {
    setSelectedCoins({ ...selectedCoins, selected: data.num })
    inputText.current.value = ''
  }

  // inputfeild data
  const handlechange = e => {
    setInputCode(e.target.value)
  }

  // start button
  const startGame = e => {
    let roomid = groupBattledata.roomID

    let docRef = db.collection('multiUserBattleRoom').doc(roomid)

    return db.runTransaction(async transaction => {
      let doc = await transaction.get(docRef)
      if (!doc.exists) {
        toast.error('Document does not exist!')
      }

      let userdetails = doc.data()

      let user2 = userdetails.user2

      let user3 = userdetails.user3

      let user4 = userdetails.user4

      if (user2.uid !== '' || user3.uid !== '' || user4.uid !== '') {
        transaction.update(docRef, {
          readyToPlay: true
        })
      } else {
        toast.error(t('Player is not join yet'))
      }
      return doc
    })
  }

  // get id from localstorage for start button
  let createdby = groupBattledata.createdBy

  // select category
  const handleSelectCategory = e => {
    const index = e.target.selectedIndex
    const el = e.target.childNodes[index]
    let cat_id = el.getAttribute('id')
    let cat_name = el.getAttribute('name')
    setCategory({ ...category, selected: cat_id, category_name: cat_name })
  }

  // pass room code in sql database for fetching questions
  const createRoommulti = roomCode => {
    createMultiRoomApi(
      roomCode,
      'public',
      category.selected ? category.selected : '',
      '10',
      resposne => { },
      error => {
        console.log(error)
      }
    )
  }

  useEffect(() => {
    let documentRef = db.collection('multiUserBattleRoom').doc(roomiddata)
    // console.log("document",documentRef)
    let unsubscribe = documentRef.onSnapshot(
      { includeMetadataChanges: true },
      doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          // state set doc id
          setDocidDelete(doc.id)

          let roomid = doc.id

          let user1 = battleroom.user1

          let user2 = battleroom.user2

          let user3 = battleroom.user3

          let user4 = battleroom.user4

          let user1uid = battleroom.user1.uid
          let user2uid = battleroom.user2.uid

          let user3uid = battleroom.user3.uid

          let user4uid = battleroom.user4.uid

          let readytoplay = battleroom.readyToPlay

          // filter user data

          // if user id is equal to login id then remove id
          if (userData?.data?.id === user1uid) {
            setBattleUserData([user2, user3, user4])
          }

          if (userData?.data?.id === user2uid) {
            setBattleUserData([user1, user3, user4])
          }

          if (userData?.data?.id === user3uid) {
            setBattleUserData([user1, user2, user4])
          }

          if (userData?.data?.id === user4uid) {
            setBattleUserData([user1, user2, user3])
          }

          // check ready to play
          let check = battleroom.readyToPlay

          //room code
          let roomCode = battleroom.roomCode

          // question screen
          if (check) {
            questionScreen(roomCode, roomid)
          }

          let createdby = battleroom.createdBy

          // state popup of create and join room
          if (useruid == createdby) {
            setJoinUserPopup(false)
            setPlaywithfriends(true)
          } else {
            setJoinUserPopup(true)
            setPlaywithfriends(false)
          }

          // LoadGroupBattleData("createdby", createdby);

          owner.current.ownerID = createdby

          owner.current.readyplay = readytoplay

          // delete room by owner on click cancel button
          setCreatedByRoom(createdby)

          if (user2uid === '') {
            owner.current.ownerID = null
            setJoinUserPopup(false)
          }

          const newUser = [user1, user2, user3, user4]

          newUser.forEach(elem => {
            if (elem.obj === '') {
              playerremove.current = true
            }
          })
        } else {
          if (owner.current.readyplay == false && owner.current.ownerID !== null) {
            if (useruid !== owner.current.ownerID) {
              MySwal.fire({
                text: t('Room is deleted by owner')
              }).then(result => {
                if (result.isConfirmed) {
                  navigate.push('/all-games')
                  return false
                }
              })
            }
          }
        }
      },
      error => {
        console.log('err', error)
      }
    )

    let alluserArray = [
      groupBattledata.user1uid,
      groupBattledata.user2uid,
      groupBattledata.user3uid,
      groupBattledata.user4uid
    ]
    for (let i = 0; i < alluserArray?.length; i++) {
      const elem = alluserArray[i]
      if (userData?.data?.id == elem && playerremove) {
        navigate.push('/all-games') // Navigate to the desired page

        unsubscribe()
        // LoadGroupBattleData("roomid", "");
        break // Break the loop after calling the cleanup function
      }
    }

    return () => {
      // Cleanup function
      unsubscribe()
      // LoadGroupBattleData("roomid", "");
    }
  }, [groupBattledata, userData?.data?.id, playerremove])

  // oncancel creater room popup delete room
  const onCancelbuttondeleteBattleRoom = async documentId => {
    let documentRef = db.collection('multiUserBattleRoom').doc(documentId)

    documentRef.onSnapshot(
      { includeMetadataChanges: true },
      doc => {
        if (doc.exists) {
          let battleroom = doc.data()

          let roomid = doc.id

          let createdby = battleroom.createdBy

          if (useruid == createdby) {
            MySwal.fire({
              text: t('Room is deleted')
            })
            deleteBattleRoom(roomid)
            battleDataClear()
          }
        }
      },
      error => {
        console.log('err', error)
      }
    )
  }

  // on cancel join user button
  const onCanceljoinButton = async roomId => {
    try {
      setJoinUserPopup(false)
      const documentRef = db.collection('multiUserBattleRoom').doc(roomId)
      const battleroomSnapshot = await documentRef.get()

      if (battleroomSnapshot.exists) {
        const battleroom = battleroomSnapshot.data()
        const { user2, user3, user4 } = battleroom
        const { uid: user2uid } = user2
        const { uid: user3uid } = user3
        const { uid: user4uid } = user4

        if (user2uid === useruid) {
          await documentRef.update({
            'user2.name': '',
            'user2.uid': '',
            'user2.profileUrl': ''
          })
        } else if (user3uid === useruid) {
          await documentRef.update({
            'user3.name': '',
            'user3.uid': '',
            'user3.profileUrl': ''
          })
        } else if (user4uid === useruid) {
          await documentRef.update({
            'user4.name': '',
            'user4.uid': '',
            'user4.profileUrl': ''
          })
        }
      }

      navigate.push('/all-games')
    } catch (error) {
      console.log('Error:', error)
    }
  }

  useEffect(() => {
    setSelectedCoins({ ...selectedCoins, selected: coinsdata[0].num })
    // pass room code in sql database for fetching questions
    createRoommulti()
  }, [])

  useEffect(() => {
    getAllData()
  }, [selectCurrentLanguage])

  const handleJoinButtonClick = () => {
    setIsButtonClicked(true)
    joinRoom(username, userprofile, useruid, inputCode, usercoins)
  }

  // share room code popUp handlers
  const handleSharePopup = () => {
    setModalVisible(true)
  }
  const closeSharePopup = () => {
    // const sharePopup = document.getElementById('sharePopup');
    // sharePopup.style.display = 'none'
    setModalVisible(false)

  }

  const handleBatlleFeesChange = (e) => {
    // toast.error(e.target.value)
    e.preventDefault();

    const inputValue = e.target.value;

    // Check if the input is a valid number or an empty string
    if (/^\d+$/.test(inputValue) || inputValue === '') {

      // Check if the numeric value is greater than zero
      if (e.target.value >= 0) {
        // Update state or perform other actions
        // (e.g., setSelectedCoins or handle other logic)
        setSelectedCoins({ ...selectedCoins, selected: e.target.value });
      } else {
        // Show an error message for non-positive values
        setSelectedCoins({ ...selectedCoins, selected: 0 });
      }
    } else {
      // Show an error message for invalid input
      toast.error("Please Enter Numeric Values");
    }

  }

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <>
      <Breadcrumb title={t('Group Battle')} content={t('')} contentTwo="" />
      <div className='SelfLearning battlequiz my-5'>
        <div className='container'>
          <div className="playFrndWrapper">

            <div className='row morphisam'>
              <div className='col-md-12  col-xl-12 col-xxl-12 col-12 '>
                <h2 className='text-center tabTitle'>
                  {activeTab === '1' ? t("create-group-battle") : t("join-group-battle")}
                </h2>
                <Tabs defaultActiveKey='1' activeKey={activeTab} onChange={handleTabChange}>

                  <TabPane tab={t('Create Room')} key='1' >
                    {/* category select */}
                    {(() => {
                      if (systemconfig.battle_mode_group_category === '1') {
                        return (
                          <div className='bottom__cat__box playFrndSelecter'>
                            <h3 className='text-center'>{t('Select a Category')}</h3>
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
                                          <option key={key} value={cat_data.key} id={cat_data.id} no_of={cat_data.no_of} name={cat_data.category_name}>
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
                          </div>
                        )
                      }
                    })()}

                    <div className='inner_content d-flex align-items-center flex-wrap'>
                      <span >
                        {t("Entry Fee")}:
                      </span>
                      <ul className='coins_deduct groupCoinsDeduct d-flex ps-0 align-items-center my-3'>
                        {coinsdata.map((data, idx) => {
                          return (
                            <li key={idx} className={`list-unstyled ${data.num == selectedcoins ? 'active-one' : 'unactive-one'}`} onClick={e => selectedCoinsdata(data)}>
                              <img src={coinimg.src} alt='coin' />

                              <span>
                                {data.num}
                              </span>
                            </li>
                          )
                        })}
                        <div className='input_coins'>
                          <input
                            type='number'
                            placeholder='00'
                            min='0'
                            value={selectedCoins.selected}
                            onChange={(e) => handleBatlleFeesChange(e)}
                            ref={inputText}
                          />
                        </div>
                      </ul>

                    </div>

                    {/* coins */}
                    <div className='total_coins my-4 ml-0'>
                      <h5 className=' text-center '>
                        {t('Current Coins')} : {userData?.data?.coins < 0 ? 0 : userData?.data?.coins}
                      </h5>
                    </div>

                    {/* create room */}
                    <div className='create_room'>
                      <button className='btn btn-primary' onClick={() => searchRoom()}>
                        {t('Create Room')}
                      </button>
                    </div>
                  </TabPane>
                  <TabPane tab={t('Join Room')} key='2' className='groupBattleTab'>
                    <h5 className=' mb-4 text-center'>{t('Enter room code here')}</h5>
                    <div className='join_room_code'>
                      <input
                        type='text'
                        placeholder={t('Enter Code')}
                        onChange={e => handlechange(e)}
                        className='join_input'
                        min='0'
                        ref={inputRef}
                      />
                    </div>
                    <div className='join_btn mt-4'>
                      <button className='btn btn-primary' onClick={handleJoinButtonClick} disabled={isButtonClicked}>
                        {' '}
                        {t('Join Room')}
                      </button>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>

        </div>
      </div>


      <Modal
        maskClosable={false}
        centered
        visible={playwithfriends}
        onOk={() => setPlaywithfriends(false)}
        onCancel={() => {
          setPlaywithfriends(false)
          onCancelbuttondeleteBattleRoom(dociddelete)
        }}
        footer={null}
        className='custom_modal_notify retry-modal playwithfriend'
      >
        {playwithfriends ? (
          <>
            <div className='randomplayer'>
              <div className='main_screen'>
                <h3 className='text-center headlineText'>
                  {t('play-with-friend')}
                </h3>
                <div className='room_code_screen'>
                  <h3>
                    {shouldGenerateRoomCode}
                  </h3>
                  {process.env.NEXT_PUBLIC_SEO === "true" ? <>
                    <span className='shareIcon' onClick={handleSharePopup}>
                      <IoShareSocialOutline />
                    </span>
                    <p>{t('share-room-code-friends')}</p>
                  </> : null}
                </div>

                <div className='share' id='sharePopup'>
                  {modalVisible &&
                    <ShareMenu
                      currentUrl={currentUrl}
                      shouldGenerateRoomCode={shouldGenerateRoomCode}
                      appName={appName}
                      showModal={modalVisible}
                      hideModal={() => setModalVisible(false)}
                      entryFee={selectedCoins?.selected}
                      categoryName={category?.category_name}
                    />
                  }
                </div>

                <div className='inner_Screen'>
                  <div className='user_profile'>
                    <img src={userData?.data?.profile} alt='wrteam' onError={imgError} />
                    <p className='mt-3 userName'>{userData?.data?.name || userData?.data?.email || userData?.data?.mobile}</p>
                    <span className='createJoinSpan'>{t("Creator")}</span>
                  </div>
                  {battleUserData?.map((data, index) => {
                    return (
                      <>

                        <div className='opponent_image' key={index}>
                          <img src={data.profileUrl} alt='wrteam' onError={imgError} />
                          <p className='mt-3 userName'>{data.name ? data.name : t("Waiting")}</p>
                          <span className='createJoinSpan'>{t("Joiner")}</span>
                        </div>
                      </>
                    )
                  })}
                </div>
                {(() => {
                  if (userData?.data?.id == createdby) {
                    return (
                      <>
                        {showStart ? (
                          <div className='start_game'>
                            <button className='btn btn-primary' onClick={e => startGame(e)}>
                              {t('Start Game')}
                            </button>
                          </div>
                        ) : null}
                      </>
                    )
                  }
                })()}
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </Modal>

      {/* join user popup */}
      {joinuserpopup ? (
        <Modal
          centered
          maskClosable={false}
          keyboard={false}
          visible={joinuserpopup}
          onOk={() => setJoinUserPopup(false)}
          onCancel={() => {
            setJoinUserPopup(false)
            onCanceljoinButton(roomiddata)
          }}
          footer={null}
          className='custom_modal_notify retry-modal playwithfriend'
        >
          <>
            <div className='randomplayer'>
              <div className='main_screen'>
                <div className='inner_Screen'>
                  <div className='user_profile'>
                    <img src={userData?.data?.profile} alt='wrteam' onError={imgError} />
                    <p className='mt-3'>{userData?.data?.name || userData?.data?.email || userData?.data?.mobile}</p>
                  </div>
                  {battleUserData?.map((data, index) => {
                    return (
                      <>
                        <div className='vs_image'>
                          <img src={vsimg.src} alt='versus' height={100} width={50} />
                        </div>
                        <div className='opponent_image' key={index}>
                          <img src={data.profileUrl} alt='wrteam' onError={imgError} />
                          <p className='mt-3'>{data.name ? data.name : t("Waiting")}</p>
                        </div>
                      </>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        </Modal>
      ) : (
        ''
      )}
    </>
  )
}

export default withTranslation()(GroupBattle)
