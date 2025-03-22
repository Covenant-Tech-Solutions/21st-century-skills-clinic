import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { badgesData, Loadbadgedata, LoadNewBadgesData } from 'src/store/reducers/badgesSlice'
import Skeleton from 'react-loading-skeleton'
import { UserCoinScoreApi, getuserbadgesApi, getusercoinsApi, setBadgesApi } from 'src/store/actions/campaign'
import toast from 'react-hot-toast'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import Layout from 'src/components/Layout/Layout'
import LeftTabProfile from 'src/components/Profile/LeftTabProfile'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'

const Badges = () => {
  const badgesdata = useSelector(badgesData)

  const power_eliteBadge = badgesdata?.data?.find(badge => badge?.type === 'power_elite');

  const power_elite_status = power_eliteBadge && power_eliteBadge?.status

  const power_elite_coin = power_eliteBadge && power_eliteBadge?.badge_reward

  const userData = useSelector(state => state.User)

  const selectcurrentLanguage = useSelector(selectCurrentLanguage)

  // const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [showMore, setShowMore] = useState(false);
  const [visibleBadges, setVisibleBadges] = useState(6);

  useEffect(() => {
    setIsLoading(false)
  }, [])

  // power elite badge
  useEffect(() => {
    const dataFiltered = Object.values(badgesdata.data).filter(badge => badge.status === '1')
    const dataFilteredLength = dataFiltered?.length
    if (power_elite_status === '0' && dataFilteredLength == 10) {
      setBadgesApi(
        'power_elite',
        (res) => {
          LoadNewBadgesData('power_elite', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            power_elite_coin,
            null,
            null,
            t('power elite badge reward'),
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

  useEffect(()=>{
    if (userData?.data) {
      getuserbadgesApi({
        onSuccess: (res) => {
          let data = res.data
          Loadbadgedata(data)
        },
        onError: (err) => {
          console.log(err)
        }
      })
    }
  },[selectcurrentLanguage])

  const handleShowMore = () => {
    setShowMore(!showMore);
    setVisibleBadges(showMore ? 6 : Object.values(badgesdata.data)?.length);
  };

  return (
    <Layout>
      <section className='Profile__Sec 1 badges'>
        <div className='container'>
          <div className="morphism ">
            <div className='row pro-card position-relative'>
              <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                <div className='card px-4 bottom__card_sec'>
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className='contentDiv col-xl-9 col-lg-4 col-md-12 col-12 pt-2'>
                <div className="badges">
                  <div className="row card">
                    {isLoading ? (
                      // Show skeleton loading when data is being fetched
                      <div className='col-12 '>
                        <Skeleton height={20} count={5} />
                      </div>
                    ) : (
                      // Show data if available
                      badgesdata.data &&
                      [
                        ...Object.values(badgesdata.data).filter(data => data.status === '1'),
                        ...Object.values(badgesdata.data).filter(data => data.status === '0')
                      ].slice(0, visibleBadges).map((data, index) => (
                        <div className='col-md-12 col-12' key={index}>
                          <div className='badges_data' data-tooltip-id='my-tooltip' data-tooltip-content={`${data.badge_note}`}>
                            <div className='inner_image'>
                              {data.status === '0' ? (
                                <span className='dummy_background' />
                              ) : (
                                <span className='dummy_background_color' />
                              )}
                              <img src={data.badge_icon} alt='badges' />
                              {/* <span className='counter_badge'>{data.badge_reward}</span> */}
                            </div>
                            <div className="badgesDataContent">
                              <span className='label'>{(data.badge_label)}</span>
                              <span className='note'>{(data.badge_note)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div className="col-12 text-center mt-3">
                      <span onClick={handleShowMore} style={{ color: '#090029', fontFamily: 'Lato', fontWeight: '600', fontSize: '18px', cursor: 'pointer' }}>
                        {showMore ? t('Show Less') : t('Show More')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* <Tooltip id='my-tooltip' /> */}
      </section>
    </Layout>
  )
}

export default withTranslation()(Badges)
