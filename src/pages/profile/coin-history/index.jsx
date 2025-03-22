"use client"
import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { getTrackerDataApi } from 'src/store/actions/campaign'
import { withTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import Skeleton from 'react-loading-skeleton'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { Tab, Tabs } from 'react-bootstrap'
import Layout from 'src/components/Layout/Layout'
import LeftTabProfile from 'src/components/Profile/LeftTabProfile'
import FormattedNumberData from 'src/components/FormatNumber/FormatedNumberData'

const CoinHistory = () => {
  // state
  const [allData, setAllData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [loseData, setLoseData] = useState([]);
  const [total, setTotal] = useState(0);
  const [incometotal, setInocmetotal] = useState(0)
  const [losetotal, setLosetotal] = useState(0)
  const [allCurrentPage, setAllCurrentPage] = useState(0);
  const [incomeCurrentPage, setIncomeCurrentPage] = useState(0);
  const [loseCurrentPage, setLoseCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true)
  const dataPerPage = 10; // number of posts per page
  const [activeTab, setActiveTab] = useState('all');

  const handlePageChange = (selectedPage, eventKey) => {
    switch (eventKey) {
      case 'all':
        setAllCurrentPage(selectedPage.selected);
        break;
      case 'income':
        setIncomeCurrentPage(selectedPage.selected);
        break;
      case 'lose':
        setLoseCurrentPage(selectedPage.selected);
        break;
      default:
        break;
    }
  };


  const fetchAllData = () => {
    getTrackerDataApi(
      allCurrentPage * dataPerPage,
      dataPerPage,
      '',
      response => {
        setAllData(response.data);
        setTotal(response.total);
        setIsLoading(false);
      },
      error => {
        if (error === "102") {
          setTotal(0); // Set total to 0
          setIsLoading(false);
        }
      }
    );
  };


  const fetchIncomeData = () => {
    getTrackerDataApi(
      incomeCurrentPage * dataPerPage,
      dataPerPage,
      '1',
      response => {
        setIncomeData(response.data);
        setInocmetotal(response.total);
        setIsLoading(false);
      },
      error => {
        if (error === "102") {
          setInocmetotal(0); // Set total to 0
          setIsLoading(false);
        }
      }
    );
  };

  const fetchLoseData = () => {
    getTrackerDataApi(
      loseCurrentPage * dataPerPage,
      dataPerPage,
      '2',
      response => {
        setLoseData(response.data);
        setLosetotal(response.total);
        setIsLoading(false);
      },
      error => {
        if (error === "102") {
          setLosetotal(0); // Set total to 0
          setIsLoading(false);
        }

      }
    );
  };

  useEffect(() => {
    fetchAllData();
  }, [allCurrentPage]);

  useEffect(() => {
    fetchIncomeData();
  }, [incomeCurrentPage]);

  useEffect(() => {
    fetchLoseData();
  }, [loseCurrentPage]);

  // render data of points based on status and welcome bonus with type check
  const renderPoints = data => {
    const pointsValue = parseFloat(data.points);

    if (activeTab === 'income' || data.type === 'welcomeBonus') {
      return (
        <p className='plus'>
          +<FormattedNumberData value={pointsValue} />
        </p>
      );
    } else if (activeTab === 'income' || data.status === '0') {
      return (
        <p className='plus'>
          +<FormattedNumberData value={pointsValue} />
        </p>
      );
    } else {
      return (
        <p className='minus'>
          <FormattedNumberData value={pointsValue} />
        </p>
      );
    }
  };

  // render date in correct format
  const renderDate = data => {
    const getDateFormat = data.date.split('-')
    const newDateFormat = getDateFormat.reverse().join('-')
    return newDateFormat
  }

  return (
    <Layout>
      <section className='Profile__Sec mt-1 coinhistory'>
        <div className='container'>

          <div className='morphism morphisam'>
            <div className='row pro-card position-relative'>
              <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                <div className='card px-4 bottom__card_sec'>
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className='contentDiv col-xl-9 col-lg-4 col-md-12 col-12 pt-2'>
                <div className="card">
                  <Tabs
                    id='fill-tab-example'
                    activeKey={activeTab}
                    onSelect={(eventKey) => {
                      setActiveTab(eventKey);
                      switch (eventKey) {
                        case 'all':
                          fetchAllData();
                          break;
                        case 'income':
                          fetchIncomeData();
                          break;
                        case 'lose':
                          fetchLoseData();
                          break;
                        default:
                          break;
                      }
                    }}
                    fill
                    className='mb-3'
                  >
                    <Tab eventKey='all' title={t('All')}>
                      {isLoading ? (
                        // Show skeleton loading
                        <div className='col-12'>
                          <Skeleton height={20} count={5} />
                        </div>
                      ) : allData?.length > 0 ? (
                        allData.map((data, index) => (
                          <div className='col-md-12 col-12' key={index}>
                            <div className='coin_data'>
                              <div className='inner_data'>
                                <div className='title'>
                                  <p>
                                    <strong>{t(data.type)}</strong>
                                  </p>
                                  {/* <span>{renderDate(data)}</span> */}
                                </div>
                                <div className='points'>
                                  <span className='date'>{renderDate(data)}</span>
                                  <span>{renderPoints(data)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show "No data found" message
                        <div className='col-12'>
                          <p className='text-center'>{t('No Data Found')}</p>
                        </div>
                      )}
                    </Tab>
                    <Tab eventKey='income' title={t('income')}>
                      {isLoading ? (
                        // Show skeleton loading
                        <div className='col-12'>
                          <Skeleton height={20} count={5} />
                        </div>
                      ) : incomeData?.length > 0 ? (
                        incomeData.map((data, index) => (
                          <div className='col-md-12 col-12' key={index}>
                            <div className='coin_data'>
                              <div className='inner_data'>
                                <div className='title'>
                                  <p>
                                    <strong>{t(data.type)}</strong>
                                  </p>
                                  {/* <span>{renderDate(data)}</span> */}
                                </div>
                                <div className='points'>
                                  <span className='date'>{renderDate(data)}</span>
                                  <span>{renderPoints(data)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show "No data found" message
                        <div className='col-12'>
                          <p className='text-center'>
                            {t('No Data Found')}</p>
                        </div>
                      )}
                    </Tab>
                    <Tab eventKey='lose' title={t('lose')}>
                      {isLoading ? (
                        // Show skeleton loading
                        <div className='col-12'>
                          <Skeleton height={20} count={5} />
                        </div>
                      ) : loseData?.length > 0 ? (
                        loseData.map((data, index) => (
                          <div className='col-md-12 col-12' key={index}>
                            <div className='coin_data'>
                              <div className='inner_data'>
                                <div className='title'>
                                  <p>
                                    <strong>{t(data.type)}</strong>
                                  </p>
                                  {/* <span>{renderDate(data)}</span> */}
                                </div>
                                <div className='points'>
                                  <span className='date'>{renderDate(data)}</span>
                                  <span>{renderPoints(data)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show "No data found" message
                        <div className='col-12'>
                          <p className='text-center'>{t('No Data Found')}</p>
                        </div>
                      )}
                    </Tab>
                  </Tabs>
                  {activeTab === "all" && total > 9 ? (
                    <ReactPaginate
                      initialPage={allCurrentPage}
                      previousLabel={<FaArrowLeft />}
                      nextLabel={<FaArrowRight />}
                      pageCount={Math.ceil(total / dataPerPage)}
                      onPageChange={(selectedPage) => handlePageChange(selectedPage, activeTab)}
                      containerClassName={'pagination'}
                      previousLinkClassName={'pagination__link'}
                      nextLinkClassName={'pagination__link'}
                      disabledClassName={'pagination__link--disabled'}
                      activeClassName={'pagination__link--active'}
                    />
                  ) : null}

                  {activeTab === "income" && incometotal > 9 ? (
                    <ReactPaginate
                      initialPage={incomeCurrentPage}
                      previousLabel={<FaArrowLeft />}
                      nextLabel={<FaArrowRight />}
                      pageCount={Math.ceil(incometotal / dataPerPage)}
                      onPageChange={(selectedPage) => handlePageChange(selectedPage, activeTab)}
                      containerClassName={'pagination'}
                      previousLinkClassName={'pagination__link'}
                      nextLinkClassName={'pagination__link'}
                      disabledClassName={'pagination__link--disabled'}
                      activeClassName={'pagination__link--active'}
                    />
                  ) : null}

                  {activeTab === "lose" && losetotal > 9 ? (
                    <ReactPaginate
                      initialPage={loseCurrentPage}
                      previousLabel={<FaArrowLeft />}
                      nextLabel={<FaArrowRight />}
                      pageCount={Math.ceil(losetotal / dataPerPage)}
                      onPageChange={(selectedPage) => handlePageChange(selectedPage, activeTab)}
                      containerClassName={'pagination'}
                      previousLinkClassName={'pagination__link'}
                      nextLinkClassName={'pagination__link'}
                      disabledClassName={'pagination__link--disabled'}
                      activeClassName={'pagination__link--active'}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default withTranslation()(CoinHistory)
