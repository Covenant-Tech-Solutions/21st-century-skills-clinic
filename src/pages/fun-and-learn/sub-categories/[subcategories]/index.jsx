"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import {
    UserCoinScoreApi,
    getusercoinsApi,
    subcategoriesApi,
    unlockpremiumcateApi
} from 'src/store/actions/campaign'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import FunandLearnSubCatSlider from 'src/components/Quiz/Fun_and_Learn/FunandLearnSubCatSlider'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { isValidSlug } from 'src/utils'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const MySwal = withReactContent(Swal)

const Fun_and_Learn = ({ t }) => {

    const [subCategory, setsubCategory] = useState({ all: '', selected: '' })

    const [subloading, setSubLoading] = useState(true)

    const router = useRouter();

    const cateSlug = router.query.subcategories;

    const getAllData = () => {
        setsubCategory([])
        if (cateSlug) {
            // subcategory api
            subcategoriesApi(
                cateSlug,
                '',
                response => {
                    let subcategories = response.data
                    setsubCategory({
                        all: subcategories,
                        selected: subcategories[0]
                    })
                    setSubLoading(false)
                },
                error => {
                    console.log(error)
                    setSubLoading(false)
                }
            )
        }


    }

    //handle subcatgory
    const handleChangeSubCategory = subcategory_data => {
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
                                        '-' + subcategory_data?.coins,
                                        null,
                                        null,
                                        'fun and learn Premium Subcategories',
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
            const slug = subcategory_data.slug;
            if (isValidSlug(slug)) {
                router.push({
                    pathname: `/fun-and-learn/fun-data/${subcategory_data.slug}`, query: {
                        catid: subcategory_data.id,
                        subcatid: subcategory_data.id,
                        isSubcategory: 1
                    }
                })
            }
        }

    }

    useEffect(() => {
        if (!router.isReady) return;
        getAllData();
    }, [router.isReady, selectCurrentLanguage]);

    return (
        <Layout>
            <Breadcrumb showBreadcrumb={true} title={t('Fun and Learn')} content={t("Home")} contentTwo={subCategory?.selected?.category_name} contentThree="" />
            <div className='funandlearn mb-5'>
                <div className='container'>
                    <div className='row morphisam mb-5'>
                        {/* sub category middle sec */}
                        <div className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12'>
                            <div className='right-sec'>
                                <FunandLearnSubCatSlider
                                    data={subCategory?.all}
                                    selected={subCategory.selected}
                                    onClick={handleChangeSubCategory}
                                    subloading={subloading}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default withTranslation()(Fun_and_Learn)
