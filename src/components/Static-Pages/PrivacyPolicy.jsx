"use client"
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { settingsData } from 'src/store/reducers/settingsSlice'
import purify from 'dompurify'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const PrivacyPolicy = () => {
    const selectdata = useSelector(settingsData)

    const appdata = selectdata && selectdata.filter(item => item.type === 'privacy_policy')

    const data = appdata && appdata[0]?.message

    return (
        <Layout>
            <Breadcrumb title={t('Privacy Policy')} content="" contentTwo="" />
            <div className='Instruction'>
                <div className='container'>
                    <div className='row morphisam'>
                        {data ? (
                            <div className='col-12 ' dangerouslySetInnerHTML={{ __html: purify.sanitize(data) }}></div>
                        ) : (
                            <div className='text-center text-white'>
                                <Skeleton count={5} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default withTranslation()(PrivacyPolicy)
