"use client"
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import GroupBattleScore from 'src/components/Quiz/GroupBattle/GroupBattleScore'
import { selectResultTempData } from 'src/store/reducers/tempDataSlice'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const GroupPlay = () => {

    const showScore = useSelector(selectResultTempData);

    return (
        <Layout>
            <Breadcrumb title={t('Group Battle')} content={t('')} contentTwo="" />
            <div className='funandlearnplay dashboard battlerandom'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <>
                                    <GroupBattleScore
                                        totalQuestions={showScore.totalQuestions}
                                    />
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default withTranslation()(GroupPlay)
