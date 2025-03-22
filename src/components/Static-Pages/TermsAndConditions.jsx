"use client"
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { settingsData } from 'src/store/reducers/settingsSlice'
import { useSelector } from 'react-redux'
import purify from 'dompurify'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const TermAndConditions = ({ t }) => {
    const selectdata = useSelector(settingsData)

    const appdata = selectdata && selectdata.filter(item => item.type === 'terms_conditions')

    const data = appdata && appdata[0]?.message

    return (
        <Layout>
            <Breadcrumb title={t('Terms and Conditions')} content="" contentTwo="" />
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
export default withTranslation()(TermAndConditions)
