import React, { Fragment } from 'react'
import Skeleton from 'react-loading-skeleton'
import toast from 'react-hot-toast'
import { t } from 'i18next'
import { Loadtempdata, } from 'src/store/reducers/tempDataSlice'
import { useRouter } from 'next/navigation'
import errorimg from "src/assets/images/error.svg"
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const UnlockLevel = data => {

  const router = useRouter()
  const handleLockClick = () => {
    toast.error(t('This Level is Locked. Play previous levels to unlock'))
  }


  const handleLoadData = alldata => {
    router.push(`/quiz-zone/level/${data.levelslug}/dashboard-play`)
    Loadtempdata(alldata)
  }

  const currentLevel = data.level.level - 1

  return (
    <Fragment>
      {data.levelLoading ? (
        <div className='text-center'>
          <Skeleton count={5} />
        </div>
      ) : (
        <>
          {data.count > 0 ? (
            Array.from(Array(parseInt(data.count)), (e, i) => {
              const isLevelPlayed = currentLevel >= i + 1;
              return (
                <div className='custom-col-xxl col-xl-3 col-lg-3 col-md-3 col-12' key={i + 1}>
                  {(() => {
                    if ((Number(data.unlockedLevel)) >= i + 1) {
                      let alldata = {
                        category: data?.level?.category && data?.level?.category?.id,
                        subcategory: data?.level?.subcategory && data?.level?.subcategory?.id,
                        level: i + 1,
                        unlockedLevel: data.unlockedLevel,
                        maxLevel: data?.level?.max_level,
                        isPlay: data?.isPlay
                      }
                      return (
                        <div onClick={() => handleLoadData(alldata)}>
                          <div className={`unlock__levels__card mt-3`}>
                            <div className={`card ${isLevelPlayed ? 'levelPlayed' : ''}`}>
                              <div className="cardData">

                                <div>
                                  <span className='cardLevel'>
                                    {t("level")} : {i + 1}
                                  </span>
                                  {
                                    isLevelPlayed ? <span className='levelPlayedIcon'><IoMdCheckmarkCircleOutline /></span> : ""
                                  }

                                </div>
                                <span className='cardLevelQues'>
                                  {
                                    data?.level?.level_data[i]?.no_of_ques <= 1 ? t("Question") : t("Questions")
                                  } : {data?.level?.level_data[i]?.no_of_ques}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div className='unlock__levels__card  lock__levels__card mt-3'>
                          <div className='card' onClick={handleLockClick}>
                            <div className="cardData">
                              <span className='cardLevel'>
                                {t("level")} : {i + 1}
                              </span>
                              <span className='cardLevelQues'>
                                {
                                  data?.level?.level_data[i]?.no_of_ques <= 1 ? t("Question") : t("Questions")
                                } : {data?.level?.level_data[i]?.no_of_ques}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })()}
                </div>
              )
            })
          ) : (
            <div className='text-center mt-4 commonerror'>
              <img src={errorimg.src} title='wrteam' className='error_img' />
              <p>{t('No Levels Data Found')}</p>
            </div>
          )}
        </>
      )}
    </Fragment>
  )
}
export default UnlockLevel
