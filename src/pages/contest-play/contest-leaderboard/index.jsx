"use client"
import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { withTranslation } from 'react-i18next'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { ContestLeaderboardApi, UserCoinScoreApi, getusercoinsApi, setBadgesApi } from 'src/store/actions/campaign'
import { contestleaderboard } from 'src/store/reducers/tempDataSlice'
import { useSelector } from 'react-redux'
import { imgError } from 'src/utils'
import ResizeObserver from 'resize-observer-polyfill'
import dynamic from 'next/dynamic'
import { LoadNewBadgesData, badgesData } from 'src/store/reducers/badgesSlice'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import FormattedNumberData from 'src/components/FormatNumber/FormatedNumberData'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const ContestLeaderBoard = ({ t }) => {

  const Badges = useSelector(badgesData)

  const most_wanted_winnerBadge = Badges?.data?.find(badge => badge?.type === 'most_wanted_winner');

  const most_wanted_winner_status = most_wanted_winnerBadge && most_wanted_winnerBadge?.status

  const most_wanted_winner_coin = most_wanted_winnerBadge && most_wanted_winnerBadge?.badge_reward

  let getData = useSelector(contestleaderboard)

  const [contestBadge, setContestBadges] = useState([])

  const [leaderBoard, setLeaderBoard] = useState({
    myRank: '',
    data: '',
    total: ''
  })
  const [showleaderboard, setShowleaderboard] = useState()
  const [getWidthData, setWidthData] = useState('')
  const columns = [
    {
      name: t('Rank'),
      selector: row => {
        const value = row.user_rank
        return typeof value === 'string' ? parseInt(value, 10) : value
      },
      sortable: false
    },
    {
      name: t('Profile'),
      selector: row =>
        row.profile ? (
          <div className='leaderboard-profile'>
            <img src={row.profile} className='w-100' alt={row.name} onError={imgError}></img>
          </div>
        ) : (
          <div className='leaderboard-profile'>
            <img src='/images/user.svg' className='w-25' alt={row.name}></img>
          </div>
        ),
      sortable: false
    },
    {
      name: t('Player'),
      selector: row => `${row.name}`,
      sortable: false
    },
    {
      name: t('Score'),
      selector: row => <FormattedNumberData value={(row.score)} />
    }
  ]

  useEffect(() => {
    ContestLeaderboardApi(
      getData.past_id,
      response => {
        setTableData(response, response.total)
        setContestBadges(response.my_rank)
      },
      error => {
        toast.error('No Data Found')
        console.log(error)
      }
    )
  }, [])

  const mostWantedWinner = () => {
    if (most_wanted_winner_status === '0' && contestBadge.user_rank === '1') {
      setBadgesApi(
        'most_wanted_winner',
        (res) => {
          LoadNewBadgesData('most_wanted_winner', '1')
          toast.success(t(res?.data?.notification_body))
          const status = 0
          UserCoinScoreApi(
            most_wanted_winner_coin,
            null,
            null,
            t('most wanted badge reward'),
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

  const setTableData = (data, total) => {
    setLeaderBoard({ myRank: data.my_rank, data: data.data, total: total })
  }
  const checkLeaderboardData = () => {
    const otherUsersRank = leaderBoard?.data;
    if (otherUsersRank && otherUsersRank?.length > 0) {
      setShowleaderboard(true);
    } else {
      setShowleaderboard(false);
    }
  };

  useEffect(() => {
    checkLeaderboardData();
  }, [leaderBoard]);

  useEffect(() => {
  }, [showleaderboard, leaderBoard, getWidthData]);

  useEffect(()=>{
    mostWantedWinner()
  },[])


  const shouldSliceData = getWidthData >= 768;
  const myElementRef = useRef(null);

  useEffect(() => {
    const observeElement = myElementRef.current;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        setWidthData(newWidth);
      }
    });

    // Make sure observeElement is a valid DOM element before observing
    if (observeElement instanceof Element) {
      resizeObserver?.observe(observeElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [getWidthData]);


  return (
    <Layout>
      <div ref={myElementRef}>
        <Breadcrumb title={t('Contest LeaderBoard')} content="" contentTwo="" />

        <div className='LeaderBoard'>
          <div className='container'>
            <div className='row morphisam'>


              {showleaderboard &&
                <div className='col-md-12 col-12 col-lg-12'>
                  <div className='row top_3_Cardwrapper'>
                    <ul className='first_three_data row'>
                      {/* third winner */}
                      {leaderBoard.data &&
                        leaderBoard.data.slice(2, 3).map((data, index) => {
                          return (
                            <>
                              <div className='col-lg-4 col-md-4 col-12 thirdDataCard' key={index}>
                                <li className='third_data' >
                                  <div className='Leaf_img'>

                                    <img className='data_profile' src={data.profile} alt='third' onError={imgError} />

                                  </div>

                                  <h5 className='data_nam'>{data.name}</h5>
                                  <p className='data_score'>{data.score}</p>
                                  <span className='data_rank'>{t("3")}</span>
                                </li>
                              </div>
                            </>
                          )
                        })}

                      {/* first winner */}
                      {leaderBoard.data &&
                        leaderBoard.data.slice(0, 1).map((data, index) => {
                          return (
                            <>
                              <div className='col-lg-4 col-md-4 col-12 firstDataCard'>
                                <li className='first_data' key={index}>
                                  <div className='Leaf_img'>
                                  
                                    <img className='data_profile' src={data.profile} alt='first' onError={imgError} />

                                  </div>
                                  <h5 className='data_nam'>{data.name}</h5>
                                  <p className='data_score'>{data.score}</p>
                                  <span className='data_rank'>{t("1")}</span>
                                </li>
                              </div>
                            </>
                          )
                        })}

                      {/* second winner */}
                      {leaderBoard.data &&
                        leaderBoard.data.slice(1, 2).map((data, index) => {
                          return (
                            <>
                              <div className='col-lg-4 col-md-4 col-12 secondDataCard'>
                                <li className='second_data' key={index}>
                                  <div className='Leaf_img'>

                                    <img className='data_profile' src={data.profile} alt='second' onError={imgError} />

                                  </div>
                                  <h5 className='data_nam'>{data.name}</h5>
                                  <p className='data_score'>{data.score}</p>
                                  <span className='data_rank'>{t("2")}</span>
                                </li>
                              </div>
                            </>
                          )
                        })}
                    </ul>

                  </div>
                </div>
              }



              <div className='table_content mt-3' >
                <DataTable
                  title=''
                  columns={columns}
                  data={shouldSliceData ? (leaderBoard && leaderBoard.data.slice(3)) : (leaderBoard && leaderBoard.data)}
                  pagination={false}
                  highlightOnHover
                  paginationServer
                  noDataComponent={t("There are no records to display")}
                  paginationTotalRows={leaderBoard && leaderBoard.total}
                  paginationComponentOptions={{
                    noRowsPerPage: true
                  }}
                  className='dt-center'
                />
                {/* my rank show */}
                <table className='my_rank_bottom'>
                  <thead>
                    <tr>
                      <th>{t('My Rank')} </th>
                      <th>{t('Profile')}</th>
                      <th>{t('Player')}</th>
                      <th>{t('Score')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='innerrank all_com'>
                        <strong>{leaderBoard.myRank.user_rank}</strong>
                      </td>
                      <td className='profile all_com'>
                        <img src={leaderBoard.myRank.profile} alt='Profile' onError={imgError} />
                      </td>
                      <td className='player all_com'>
                        <strong>{leaderBoard.myRank.name || leaderBoard.myRank.email}</strong>
                      </td>
                      <td className='score all_com'>
                        <strong>{leaderBoard.myRank.score}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(ContestLeaderBoard)
