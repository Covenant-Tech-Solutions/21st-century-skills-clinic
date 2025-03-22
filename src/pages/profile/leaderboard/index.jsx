"use client"
import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { withTranslation } from 'react-i18next'
import { DailyLeaderBoardApi, GlobleLeaderBoardApi, MonthlyLeaderBoardApi } from 'src/store/actions/campaign'
import { imgError } from 'src/utils'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
import FormattedNumberData from 'src/components/FormatNumber/FormatedNumberData'
import { t } from 'i18next'
import LeftTabProfile from 'src/components/Profile/LeftTabProfile'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const LeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState({ my_rank: '', other_users_rank: '', total: '' })
  // const [topRankData,setTopRankData] = useState([]);
  const [category, setCategory] = useState('Daily')
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [showleaderboard, setShowleaderboard] = useState()
  const [getWidthData, setWidthData] = useState('')
  const [topRankers, setTopRankers] = useState([]);
  const myElementRef = useRef(null);


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

  const getDailyLeaderBoard = (offset, limit) => {
    DailyLeaderBoardApi(
      offset,
      limit,
      response => {
        setTopRankers(response?.data?.top_three_ranks)
        setTableData(response.data, response?.data?.my_rank, response.data.other_users_rank, response.total)
      },
      error => {
        console.log(error)
      }
    )
  }

  const getMonthlyLeaderBoard = (offset, limit) => {
    MonthlyLeaderBoardApi(
      offset,
      limit,
      response => {
        setTopRankers(response?.data.top_three_ranks)
        setTableData(response.data, response.data.my_rank, response.data.other_users_rank, response.total)
      },
      error => {
        console.log(error)
      }
    )
  }

  const getGlobleLeaderBoard = (offset, limit) => {
    GlobleLeaderBoardApi(
      offset,
      limit,
      response => {
        setTopRankers(response?.data?.top_three_ranks)
        setTableData(response.data, response.data.my_rank, response.data.other_users_rank, response.total)
      },
      error => {
        console.log(error)
      }
    )
  }

  const fetchData = (category, limit, offset) => {
    limit = limit ? limit : 10
    offset = offset ? offset : 0
    if (category === 'Daily') {

      getDailyLeaderBoard(offset, limit)
    } else if (category === 'Monthly') {
      getMonthlyLeaderBoard(offset, limit)
    } else {
      getGlobleLeaderBoard(offset, limit)
    }
  }

  const checkLeaderboardData = () => {
    const otherUsersRank = leaderBoard?.other_users_rank;
    if (otherUsersRank && otherUsersRank?.length > 0) {
      setShowleaderboard(true);
    } else {
      setShowleaderboard(false);
    }
  };




  const handleCategoryChange = (category) => {
    setCategory(category)
    setLimit(10)
    setOffset(0)
    fetchData(category, limit, offset)
  }


  const changePage = page => {
    let offset = limit * page - limit
    fetchData(category, limit, offset)
  }


  useEffect(() => {
    checkLeaderboardData();
  }, [leaderBoard]);



  const shouldSliceData = getWidthData >= 768;

  useEffect(() => {
    const observeElement = myElementRef.current;

    if (observeElement) {
      // Create a new ResizeObserver
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          // Access the new width of the observed element
          const newWidth = entry.contentRect.width;
          setWidthData(newWidth)
        }
      });

      // Start observing the element
      resizeObserver.observe(observeElement);

      // Cleanup function to disconnect the observer when the component unmounts
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [shouldSliceData]);


  useEffect(() => {
  }, [showleaderboard, leaderBoard, getWidthData]);

  useEffect(() => {
    getDailyLeaderBoard(0, 10)
  }, [])

  const setTableData = (totaldata, myRank, otherusers_rank, allData) => {
    const topThreeRanks = totaldata.top_three_ranks;
    const filteredOtherUsersRank = totaldata.other_users_rank.filter(user => ![1, 2, 3].includes((user.user_rank, 10))).concat(topThreeRanks.slice(3)) // Append users starting from index 4
    setLeaderBoard({
      my_rank: myRank,
      other_users_rank: !shouldSliceData ? otherusers_rank : filteredOtherUsersRank,
      total: allData,
    });
  };


  return (
    <div ref={myElementRef}>
      <Layout>
        <Breadcrumb title={t('LeaderBoard')} content="" contentTwo="" />
        <div className='Profile__Sec'>
          <div className='container'>
            <div className='morphism'>
              <div className='row pro-card position-relative'>
                <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                  <div className='card px-4 bottom__card_sec'>
                    <LeftTabProfile />
                  </div>
                </div>
                <div className='contentDiv bg-transparent p-0 col-xl-9 col-lg-4 col-md-12 col-12'>
                  <div className={showleaderboard === true ? "LeaderBoard" : "noLeaderboardData"}>
                    <div className='container'>
                      <div className='row morphisam'>
                        {showleaderboard &&
                          <div className='col-md-12 col-12 col-lg-12'>
                            <div className='row top_3_Cardwrapper'>
                              <ul className='first_three_data row'>
                                {/* third winner */}
                                {topRankers &&
                                  topRankers.slice(2, 3).map((data, index) => {
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
                                {topRankers &&
                                  topRankers.slice(0, 1).map((data, index) => {
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
                                {topRankers &&
                                  topRankers.slice(1, 2).map((data, index) => {
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
                        <div className='col-md-12 col-12 col-lg-12'>
                          <div className='table_content mt-3'>

                            <div className='row two_content_data'>
                              <div className='col-sm-4 col-4 col-md-4 col-lg-4 sortBy'>
                                <span className={`sortByData ${category === 'Global' ? 'activeTab' : ''}`} onClick={() => handleCategoryChange('Global')}>{t("All Time")}</span>
                              </div>
                              <div className='col-sm-4 col-4 col-md-4 col-lg-4 sortBy'>
                                <span className={`sortByData ${category === 'Monthly' ? 'activeTab' : ''}`} onClick={() => handleCategoryChange('Monthly')}>{t("Monthly")}</span>
                              </div>
                              <div className='col-sm-4 col-4 col-md-4 col-lg-4 sortBy'>
                                <span className={`sortByData ${category === 'Daily' ? 'activeTab' : ''}`} onClick={() => handleCategoryChange('Daily')}>{t("Today")}</span>
                              </div>
                            </div>
                          </div>


                          <DataTable
                            title=''
                            columns={columns}
                            data={leaderBoard && leaderBoard.other_users_rank}
                            pagination
                            highlightOnHover
                            paginationServer
                            noDataComponent={t("There are no records to display")}
                            paginationTotalRows={leaderBoard && leaderBoard?.total}
                            paginationPerPage={limit}
                            paginationComponentOptions={{
                              noRowsPerPage: true
                            }}
                            className='dt-center rankTableData'
                            onChangePage={page => changePage(page)}
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
                                  <strong>{leaderBoard.my_rank.user_rank}</strong>
                                </td>
                                <td className='profile all_com'>
                                  <img src={leaderBoard.my_rank.profile} alt='Profile' onError={imgError} />
                                </td>
                                <td className='player all_com'>
                                  <strong>{leaderBoard.my_rank.name || leaderBoard.my_rank.email}</strong>
                                </td>
                                <td className='score all_com'>
                                  <strong><FormattedNumberData value={leaderBoard.my_rank.score} />
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>

  )
}
export default withTranslation()(LeaderBoard)
