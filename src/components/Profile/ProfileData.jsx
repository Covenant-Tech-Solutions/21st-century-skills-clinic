"use client"
import React, { useEffect, useCallback, useRef, useState } from 'react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaMobileAlt,
  FaPhoneAlt,
  FaPlus,
  FaRegUser,
} from 'react-icons/fa'

import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import {
  getUserProfilestatisticsApi,
  getUserStatisticsDataApi,
  updateProfileApi,
  updateProfileDataApi,
  updateUserDataInfo
} from 'src/store/reducers/userSlice'
import { useSelector } from 'react-redux'
import { UserCoinScoreApi, getusercoinsApi, setBadgesApi } from 'src/store/actions/campaign'
import { imgError } from 'src/utils'
import { badgesData, LoadNewBadgesData } from 'src/store/reducers/badgesSlice'

import profileImages from 'src/assets/json/profileImages'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/effect-fade'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Breadcrumb from 'src/components/Common/Breadcrumb'

// import required modules
import { Navigation } from 'swiper/modules'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { t } from 'i18next'
import LeftTabProfile from './LeftTabProfile'


const ProfileData = () => {

  const demoValue = process.env.NEXT_PUBLIC_DEMO === 'true';

  const userData = useSelector(state => state?.User)

  const systemconfig = useSelector(sysConfigdata);

  const [showBookMark, setShowBookMark] = useState(false);

  const [profile, setProfile] = useState({
    name: userData?.data?.name ? userData?.data?.name : "",
    email: userData?.data?.email ? userData?.data?.email : "",
    mobile: userData?.data?.mobile ? userData?.data?.mobile : ""
  })

  const Badges = useSelector(badgesData)

  const big_thingBadge = Badges?.data?.find(badge => badge?.type === 'big_thing');

  const eliteBadge = Badges?.data?.find(badge => badge?.type === 'elite');

  const big_thing_status = big_thingBadge && big_thingBadge?.status

  const big_thing_coin = big_thingBadge && big_thingBadge?.badge_reward

  const elite_status = eliteBadge && eliteBadge?.status

  const elite_coin = eliteBadge && eliteBadge?.badge_reward

  const userMobile = userData?.data?.mobile || '';

  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    // console.log("test")
    if (!sliderRef.current) return;

    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  // user profile data get and statics
  useEffect(() => {
    getUserProfilestatisticsApi(
      // userData?.data?.id,
      success => { },
      error => {
        // toast.error(error)
      }
    )

    getUserStatisticsDataApi(
      success => { },
      error => {
        // toast.error(error);
      }
    )
  }, [])

  // dummy profile update
  const dummyProfileImage = e => {
    e.preventDefault()
    const fileName = e.target.getAttribute('data-file')
    const url = `${window.location.origin}/images/profileimages/${fileName}`
    fetch(url).then(async response => {
      const contentType = response.headers.get('content-type')
      const blob = await response.blob()
      const file = new File([blob], fileName, { contentType })
      if (demoValue) {
        toast.error(t('Profile update is not allowed in demo version.'));
      } else {
        updateProfileApi(
          file,
          success => {
            toast.success('Successfully updated')
          },
          error => {
            toast.error(error)
          }
        )

      }
    })
  }

  // onchange name and mobile
  const handleChange = event => {
    const field_name = event.target.name
    const field_value = event.target.value
    if (field_name === 'mobile' && event.target.value?.length > 16) {
      event.target.value = field_value.slice(0, event.target.maxLength)
      return false
    }
    setProfile(values => ({ ...values, [field_name]: field_value }))
  }

  const validateForm = () => {
    if (!profile.name || !profile.mobile || !profile.email) {
      toast.error(t('Please fill in all details'));
      return false;
    }
    return true;
  };

  // update profile data
  const updateProfileData = () => {
    if (demoValue) {
      toast.error(t('Profile update is not allowed in demo version.'));
    } else {
      updateProfileDataApi(
        profile.email,
        profile.name,
        profile.mobile,
        success => {
          toast.success('Successfully updated');
          updateUserDataInfo({ email: profile.email })
        },
        error => {
          console.log(error)
          toast.error(error);
        }
      );
    }
  };

  // form submit
  const formSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      updateProfileData();
    }
  };


  // // update profile image
  const handleImageChange = e => {
    e.preventDefault()
    if (demoValue) {
      toast.error(t('Profile update is not allowed in demo version.'))
    } else {
      updateProfileApi(
        e.target.files[0],
        success => {
          toast.success('Successfully updated')
        },
        error => {
          if (error == "107") {
            toast.error("File not supported! Please select proper image type")
          }
        }
      )

    }
  }

  // one big think badges
  useEffect(() => {
    let totalQuestion = userData?.data && userData?.data?.userStatics.correct_answers
    if (big_thing_status === '0' && totalQuestion == 5000) {
      setBadgesApi(
        'big_thing',
        (res) => {
          LoadNewBadgesData('big_thing', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            big_thing_coin,
            null,
            null,
            t('big thing badge reward'),
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
  }, [])

  // elite badge
  useEffect(() => {
    let totalUserCoins = userData?.data && userData?.data?.userProfileStatics.coins
    if (elite_status === '0' && totalUserCoins == 5000) {
      setBadgesApi(
        'elite',
        (res) => {
          LoadNewBadgesData('elite', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            elite_coin,
            null,
            null,
            t('elite badge reward'),
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
  }, [])

  const swiperOption = {
    loop: true,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: {
      0: {
        slidesPerView: 4.5
      },

      768: {
        slidesPerView: 4.5
      },

      992: {
        slidesPerView: 4.5
      },
      1200: {
        slidesPerView: 5
      }
    },
    autoplay: false
  }

  // check if the quiz mode are unable or not
  const checkBookmarData = () => {
    if (systemconfig.quiz_zone_mode !== '1' && systemconfig.guess_the_word_question !== '1' && systemconfig.audio_mode_question !== '1' && systemconfig.maths_quiz_mode !== '1') {
      toast.error('No Bookmark Questions Found')
      setShowBookMark(false)
    } else {
      setShowBookMark(true)

    }
  }

  useEffect(() => {
    checkBookmarData()
  }, [showBookMark])
  return (
    <>
      <Breadcrumb title={t('Profile')} content="" contentTwo="" />

      <div className='Profile__Sec'>
        <div className='container px-1'>
          <div className='morphism'>
            <div className='row pro-card position-relative'>
              <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                <div className='card px-4 bottom__card_sec'>
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className='contentDiv col-xl-9 col-lg-4 col-md-12 col-12'>
                <form onSubmit={formSubmit} className='main-form-profile'>
                  {/* Content based on active tab */}

                  <div className='row  main__profile d-flex justify-content-center align-items-center'>
                    <div className='prop__image justify-content-center'>
                      <img
                        src={userData?.data && userData?.data?.profile ? userData?.data?.profile : '/images/user.svg'}
                        alt='profile'
                        id='user_profile'
                        onError={imgError}
                      />
                      <div className='select__profile'>
                        <input type='file' name='profile' id='file' onChange={handleImageChange} />
                        <label htmlFor='file'>
                          {' '}
                          <em>
                            <FaPlus />
                          </em>
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          placeholder={t('Upload File')}
                          id='file1'
                          name='myfile'
                          disabled
                          hidden
                        />
                      </div>
                    </div>
                    <div className='prop__title justify-content-center'>
                      <h3>{userData?.data && userData?.data?.name}</h3>
                    </div>
                    {userData?.data && userData?.data?.type === "gmail" ? (
                      <div className='email__id justify-content-center'>
                        <span>
                          <i>
                            <FaEnvelope />
                          </i>
                          <p>{userData?.data?.email}</p>
                        </span>
                      </div>
                    ) : (
                      <div className='mobile__number justify-content-center'>
                        <span>
                          <i>
                            <FaPhoneAlt />
                          </i>
                          <p>{userData?.data?.mobile}</p>
                        </span>
                      </div>
                    )}

                    <p className='orText'>{t('OR Select Avtar')}</p>
                    {/* dummy image slider */}
                    <div className='dummy_image_slider'>
                      {/* <div className='d-flex select_profile justify-content-center'>
                          <h6 className='pt-2'>{t('Select Profile Photo')}</h6>
                        </div> */}
                      <Swiper ref={sliderRef} modules={[Navigation]} {...swiperOption}>
                        {profileImages &&
                          profileImages.map((elem, key) => {
                            // console.log("elem",elem)
                            return (
                              <SwiperSlide key={key}>
                                <div className='pt-2 image_section'>
                                  <img
                                    src={elem.img}
                                    alt='profile'
                                    onClick={e => dummyProfileImage(e)}
                                    data-file={elem.img.split('/').pop()}
                                  />
                                </div>
                              </SwiperSlide>
                            )
                          })}
                      </Swiper>
                      <div className="dummySliderBtns">
                        <div className="swiper-button-prev" onClick={handlePrev} >
                          <span><FaChevronLeft color='white' size={42} /></span>
                        </div>
                        <div className="swiper-button-next" onClick={handleNext}>
                          <span><FaChevronRight color='white' size={42} /></span>
                        </div>
                      </div>


                    </div>
                    <div className='card p-4 bottom__card_sec'>
                      <div className='row'>
                        <div className='col-md-6 col-12'>
                          <label htmlFor='fullName'>
                            <input
                              type='text'
                              name='name'
                              id='fullName'
                              placeholder={t('Enter Your Name')}
                              defaultValue={userData?.data && userData?.data?.name}
                              onChange={handleChange}
                              required
                            />
                            <i className='custom-icon'>
                              <FaRegUser />
                            </i>
                          </label>
                        </div>
                        <div className='col-md-6 col-12'>
                          {userData?.data && userData?.data?.type === "gmail" ? (
                            <label htmlFor='mobilenumber'>
                              <input
                                type='tel'
                                name='mobile'
                                id='mobilenumber'
                                className='mobile'
                                placeholder={t('Enter Your Mobile Number')}
                                defaultValue={userMobile}
                                onChange={handleChange}
                                min='0'
                                onWheel={event => event.currentTarget.blur()}
                              />

                              <i className='custom-icon'>
                                <FaMobileAlt />
                              </i>
                            </label>
                          ) : (
                            <label htmlFor='email'>
                              <input
                                type='text'
                                name='email'
                                id='email'
                                className='mobile'
                                placeholder={t('Enter Your Email')}
                                defaultValue={userData?.data && userData?.data?.email}
                                onChange={handleChange}
                                min='0'
                                onWheel={event => event.currentTarget.blur()}
                              />

                              <i className='custom-icon'>
                                <FaEnvelope />
                              </i>
                            </label>
                          )}
                        </div>
                      </div>
                      <button
                        className='btn btn-primary text-capitalize mt-4'
                        type='submit'
                        value='submit'
                        name='submit'
                        id='mc-embedded-subscribe'
                      >
                        {t('Update')}
                      </button>
                    </div>

                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>

  )
}
export default withTranslation()(ProfileData)
