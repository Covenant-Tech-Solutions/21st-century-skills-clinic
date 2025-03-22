"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { subcategoriesApi } from 'src/store/actions/campaign'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { isValidSlug, scrollhandler } from 'src/utils'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import errorimg from "src/assets/images/error.svg"
import excla from 'src/assets/images/exclamation.svg'
import premium from "src/assets/images/c1.svg"
import { FiChevronRight } from 'react-icons/fi'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import toast from 'react-hot-toast'
import { t } from 'i18next'
import { Loadtempdata } from 'src/store/reducers/tempDataSlice'

const SelfLearning = () => {

  const router = useRouter()

  const cateSlug = router.query.subcategories;

  const [subloading, setSubLoading] = useState(true)

  // subcategory
  const [subcategory, setsubcategory] = useState({
    all: '',
    selected: ''
  })

  // all data
  const getAllData = () => {
    if (cateSlug) {
      subcategoriesApi(
        cateSlug,
        '',
        response => {

          let subCategories = response.data
          const filteredSubCategories = subCategories.filter((subCategories) => {
            return subCategories.is_premium === "0";
          });
          setsubcategory({
            all: filteredSubCategories?.length > 0 ? filteredSubCategories : null,
          })


          setSubLoading(false)
        },
        error => {
          console.log(error)
        }
      )
    } else {
      toast.error(t("No Data found"));
    }
  }

  //handle subcatgory
  const handleChangeSubCategory = subcategory_data => {
    setSubLoading(false)

    // this is for premium subcategory only
    if (subcategory_data.has_unlocked === '0' && subcategory_data.is_premium === '1') {
      getusercoinsApi(res => {
        if (Number(subcategory_data.coins) > Number(res.data.coins)) {
          MySwal.fire({
            text: t("You Don't have enough coins"),
            icon: 'warning',
            showCancelButton: false,
            customClass: {
              confirmButton: 'Swal-confirm-buttons',
              cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: `OK`,
            allowOutsideClick: false
          })
        } else {
          MySwal.fire({
            text: t('Your deducted coins will be doubled if you pass this quiz..'),
            icon: 'warning',
            showCancelButton: true,
            customClass: {
              confirmButton: 'Swal-confirm-buttons',
              cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: `use ${subcategory_data.coins} coins`,
            allowOutsideClick: false
          }).then(result => {
            if (result.isConfirmed) {
              unlockpremiumcateApi(
                subcategory_data.maincat_id,
                subcategory_data.id,
                res => {
                  getAllData()
                  UserCoinScoreApi(
                    '-' + subcategory_data.coins,
                    null,
                    null,
                    'self learning Premium Subcategories',
                    '1',
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
                err => console.log(err)
              )
            }
          })
        }
      })
    } else {
      Loadtempdata(subcategory_data)
      const slug = subcategory_data.slug;
      if (isValidSlug(slug)) {
        router.push({
          pathname: `/self-learning/selection/${subcategory_data.slug}`,
          query: {
            catslug: cateSlug,
            subcatslug: subcategory_data.slug
          }
        })
      }
    }


    scrollhandler(700)
  }

  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectCurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t('Self Learning')}
        content={t('Home')}
        contentTwo={subcategory?.all && subcategory.all?.length > 0 ? subcategory.all[0].category_name : ""}
      />
      <div className='quizplay quizplay mb-5'>
        <div className='container'>
          <div className='row morphisam mb-5'>
            {/* sub category middle sec */}
            <div className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12'>
              <div className='right-sec'>
                <div className='subcat__slider__context'>
                  <div className='quizplay-slider'>
                    {subloading ? (
                      <div className='text-center'>
                        <Skeleton count={5} />
                      </div>
                    ) : (
                      <div className="row">
                        <>
                          {subcategory.all ? (
                            subcategory.all?.length > 0 &&
                            subcategory.all.map((d, key) => {
                              return (
                                <div className="col-sm-12 col-md-6 col-lg-4" onClick={(e) => handleChangeSubCategory(d)}>
                                  <div className="subcatintro__sec">
                                    {/* {console.log(d)} */}
                                    <div className={`card spandiv`} >
                                      <div className="cardInnerData">
                                        <span className='Box__icon'>
                                        <img src={d.image ? d.image : `${excla.src}`} alt='image' />
                                        </span>
                                        <div className="cardDetails">
                                          <p className='cardText '>{d.subcategory_name}</p>
                                          <div className="cardSubDetails">

                                            <p className='CardQues'>
                                              {
                                                d.no_of_que <= 1 ? t("Question") : t("Questions")
                                              } : {d.no_of_que}
                                            </p>
                                            <div className="premium">
                                              {d.has_unlocked === '0' && d.is_premium === '1' ? (
                                                <Image src={premium} width={30} height={30} alt="premium" />
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                        <span className='rightArrow'>
                                          <FiChevronRight />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <div className='text-center mt-4 commonerror'>
                              <img src={errorimg.src} title='wrteam' className='error_img' />
                              <p>{t('No Subcategories Data Found')}</p>
                            </div>
                          )}
                        </>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(SelfLearning)
