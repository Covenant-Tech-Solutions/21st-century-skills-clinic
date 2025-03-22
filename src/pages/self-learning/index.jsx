'use client'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { isValidSlug, scrollhandler } from 'src/utils'
import { t } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
    UserCoinScoreApi,
    categoriesApi,
    getusercoinsApi,
    unlockpremiumcateApi
} from 'src/store/actions/campaign'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import excla from 'src/assets/images/exclamation.svg'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import c1 from "src/assets/images/c1.svg"
const MySwal = withReactContent(Swal)
import { FiChevronRight } from 'react-icons/fi'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { Loadtempdata, reviewAnswerShowSuccess } from 'src/store/reducers/tempDataSlice'

const SelfLearning = () => {
    const dispatch = useDispatch()
    const [category, setCategory] = useState({ all: '', selected: '' })
    const [loading, setLoading] = useState(true)
    const selectcurrentLanguage = useSelector(selectCurrentLanguage)

    const router = useRouter();

    const getAllData = () => {
        setCategory([])

        // categories api
        categoriesApi(
            1,
            1,
            response => {
                let categories = response.data
                // Filter the categories based on has_unlocked and is_premium
                // const filteredCategories = categories.filter((category) => {
                //     return category?.is_premium === "0";
                // });
                setCategory({
                    ...category,
                    all: categories,
                });

                setLoading(false)
            },
            error => {
                setCategory("")
                setLoading(false)
                toast.error(t('No Data found'))
            }
        )
    }

    //handle category
    const handleChangeCategory = data => {
        // this is for premium category only
        if (data.has_unlocked === '0' && data.is_premium === '1') {
            getusercoinsApi(
                res => {
                    if (Number(data.coins) > Number(res.data.coins)) {
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
                            confirmButtonText: `use ${data.coins} coins`,
                            allowOutsideClick: false
                        }).then(result => {
                            if (result.isConfirmed) {
                                unlockpremiumcateApi(
                                    data.id,
                                    '',
                                    res => {
                                        getAllData()
                                        UserCoinScoreApi(
                                            '-' + data.coins,
                                            null,
                                            null,
                                            'Self Learning Premium Categories',
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
                },
                err => {
                    console.log(err)
                }
            )

        } else {
            if (data.no_of !== '0') {
                const slug = data.slug;
                if (isValidSlug(slug)) {
                    router.push({
                        pathname: `/self-learning/sub-categories/${data.slug}`
                    })
                }
            } else {
                Loadtempdata(data)
                const slug = data.slug;
                if (isValidSlug(slug)) {
                    router.push({
                        pathname: `/self-learning/selection/${data.slug}`, query: {
                            catslug: data.slug,
                            isSubcategory: 0,
                            is_play: data?.is_play
                        }
                    })
                }

            }
        }
        //mobile device scroll handle
        scrollhandler(500)
    }

    //truncate text
    const truncate = txtlength => (txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength)

    useEffect(() => {
        getAllData()
        dispatch(reviewAnswerShowSuccess(false))
    }, [selectcurrentLanguage])

    return (
        <Layout>
            <Breadcrumb showBreadcrumb={true} title={t('Self Learning')} content={t('Home')} allgames={t('all-games')} contentTwo="" />
            <div className='quizplay mb-5'>
                <div className='container'>
                    <div className='row morphisam mb-5'>
                        <div className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12'>
                            <div className='left-sec'>
                                {/* left category sec*/}
                                <div className='bottom__left'>
                                    <div className='bottom__cat__box'>
                                        <ul className='inner__Cat__box'>
                                            {loading ? (
                                                <div className='text-center'>
                                                    <Skeleton count={5} />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="row">
                                                        {category.all ? (
                                                            category.all.map((data, key) => {
                                                                const imageToShow = data.has_unlocked === '0' && data.is_premium === '1'
                                                                return (
                                                                    <>
                                                                        <div className="col-sm-12 col-md-6 col-lg-4">
                                                                            {/* <Link href={`/quiz-zone/${data.slug}`} > */}
                                                                            <li className='d-flex' key={key} onClick={e => handleChangeCategory(data)}>
                                                                                <div
                                                                                    className={`w-100 button ${category.selected && category.selected.id === data.id
                                                                                        ? 'active-one'
                                                                                        : 'unactive-one'
                                                                                        }`}
                                                                                >
                                                                                    <div className="box_innerData">
                                                                                        <span className='Box__icon'>
                                                                                            <img src={data.image ? data.image : `${excla.src}`} alt='image' />
                                                                                        </span>
                                                                                        <div className="boxDetails">
                                                                                            <p className='Box__text '>{truncate(data.category_name)}</p>
                                                                                            {data?.no_of !== '0' && data?.no_of !== "" ? (
                                                                                                <p className='box_totQues'>{t('sub categories')} : {data?.no_of}</p>
                                                                                            ) : null}
                                                                                        </div>
                                                                                        <span className='rightArrow'>
                                                                                            <FiChevronRight />
                                                                                        </span>

                                                                                    </div>

                                                                                    <div className="boxFooterData">
                                                                                        {/* <span className='footerText'>Total Levels: {data.maxlevel}</span> */}
                                                                                        <span className='footerText'>
                                                                                            {
                                                                                                data.no_of_que <= 1 ? t("Question") : t("Questions")
                                                                                            } : {data.no_of_que}
                                                                                        </span>
                                                                                        {imageToShow ? (
                                                                                            <img className='ms-2' src={c1.src} alt='premium' width={30} height={30} />
                                                                                        ) : (
                                                                                            ''
                                                                                        )}
                                                                                    </div>

                                                                                </div>
                                                                            </li>
                                                                            {/* </Link> */}
                                                                        </div>
                                                                    </>
                                                                )
                                                            })
                                                        ) : (
                                                            <div className='text-center'>
                                                                <p className='text-dark'>{t('No Category Data Found')}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </ul>
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
