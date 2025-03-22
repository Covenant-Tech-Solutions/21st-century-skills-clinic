'use client'
import React, { useEffect, useState } from 'react'
import ScrollToTop from 'src/components/Common/ScrollToTop'
import IntroSlider from 'src/components/Home/IntroSlider/IntroSlider'
import { getAndUpdateBookmarkData, isLogin } from 'src/utils'
import Features from 'src/components/Home/Features/Features'
import Process from 'src/components/Home/Process/Process'
import ChooseUs from 'src/components/Home/WhyChooseUs/ChooseUs'
import { gethomeWebSettingsApi } from 'src/store/actions/campaign'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { useSelector } from 'react-redux'
import { selectHome } from 'src/store/reducers/homeSlice'


const HomeComp = () => {
    // const selectcurrentLanguage = useSelector(selectCurrentLanguage)
    const selectHomeData = useSelector(selectHome)
    useEffect(() => {
        if (isLogin()) {
            getAndUpdateBookmarkData()
        }
    }, [])

    return (
        <main className='main'>
            <IntroSlider />
            {selectHomeData?.data?.section_1_mode === "1" ?
                <ChooseUs homeSettings={selectHomeData?.data} isLoading={selectHomeData?.loading}/>
                : null}
            {selectHomeData?.data?.section_2_mode === "1" ?
                <Features homeSettings={selectHomeData?.data} isLoading={selectHomeData?.loading} />
                : null}
            {selectHomeData?.data?.section_3_mode === "1" ?
                <Process homeSettings={selectHomeData?.data} isLoading={selectHomeData?.loading} />
                : null}
            <ScrollToTop />
        </main>
    )
}

export default HomeComp
