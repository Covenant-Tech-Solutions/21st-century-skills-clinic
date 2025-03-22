"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { getfunandlearnApi } from 'src/store/actions/campaign'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { useRouter } from 'next/router'
import FunandLearnSlider from 'src/components/Quiz/Fun_and_Learn/FunandLearnSlider'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Fun_and_Learn = ({ t }) => {
  const [funandlearn, setFunandLearn] = useState({ all: '', selected: '' })


  const router = useRouter();

  const [funandlearningloading, setfunandlearnLoading] = useState(true)

  const getAllData = () => {
    setFunandLearn([])

    if (router.query.isSubcategory === "0") {
      // subcategory api
      getfunandlearnApi(
        'category',
        router.query.catid,
        response => {
          let funandlearn_data = response.data
          setFunandLearn({
            all: funandlearn_data,
            selected: funandlearn_data[0]
          })
          // console.log(funandlearn)
          setfunandlearnLoading(false)
        },
        error => {
          setfunandlearnLoading(false)
          console.log(error)
          toast.error(t('No Data found'))
        }
      )
    } else {
      getfunandlearnApi(
        'subcategory',
        router.query.catid,
        response => {
          let funandlearn_data = response.data
          setFunandLearn({
            all: funandlearn_data,
            selected: funandlearn_data[0]
          })
          setfunandlearnLoading(false)
          // console.log(funandlearn)
        },
        error => {
          setfunandlearnLoading(false)
          console.log(error)
          setFunandLearn("")
          toast.error(t('No Data found'))
        }
      )
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectCurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} title={t('Fun and Learn')} content={t('Home')} contentTwo={funandlearn?.selected?.category_name} contentThree={funandlearn?.selected?.subcategory_name} contentFour="" />
      <div className='funandlearn mb-5'>
        <div className='container'>
          <div className='row morphisam mb-5'>
            <div className='col-12'>
              <div className='bottom_card'>
                <FunandLearnSlider
                  data={funandlearn.all}
                  selected={funandlearn.selected}
                  funandlearningloading={funandlearningloading}
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
