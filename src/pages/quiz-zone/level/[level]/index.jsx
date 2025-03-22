'use client'
import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { t } from 'i18next'
import { useSelector } from 'react-redux'
import { levelDataApi } from 'src/store/actions/campaign'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import UnlockLevel from 'src/components/Quiz/QuizZone/UnlockLevel'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Level = () => {
  const [level, setLevel] = useState([])
  const [levelloading, setLevelLoading] = useState(true)
  const selectcurrentLanguage = useSelector(selectCurrentLanguage)

  const router = useRouter();


  const getAllData = () => {
    setLevel([])

    if (router.query.isSubcategory == 0) {
      // level data api
      levelDataApi(
        router.query.catid,
        "",
        response => {
          let level = response.data
          setLevel(level)
          setLevelLoading(false)
        },
        error => {
          setLevel("")
          setLevelLoading(false)
          toast.error(error.message);
        }
      )
    } else {
      levelDataApi(
        router.query.catid,
        router.query.subcatid,
        response => {
          let level = response.data
          setLevel(level)
          setLevelLoading(false)
        },
        error => {
          setLevel("")
          setLevelLoading(false)
          toast.error(error.message);
        }
      )
    }
  }


  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectcurrentLanguage]);

  return (
    <Layout>

      <Breadcrumb showBreadcrumb={true} title={t('Quiz Zone')} content={t('Home')} contentTwo={level?.category?.category_name} contentThree={level?.subcategory?.subcategory_name} />
      <div className='quizplay mb-5'>
        <div className='container'>
          <div className='row morphisam mb-5'>

            {/* sub category middle sec */}
            <div className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12'>
              <div className='row custom_row'>
                <UnlockLevel
                  count={level?.max_level}
                  category={level?.category?.id}
                  subcategory={level?.subcategory?.id}
                  unlockedLevel={level?.level}
                  levelLoading={levelloading}
                  levelslug={router.query.level}
                  level={level}
                  isPlay={router?.query?.is_play}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(Level)
