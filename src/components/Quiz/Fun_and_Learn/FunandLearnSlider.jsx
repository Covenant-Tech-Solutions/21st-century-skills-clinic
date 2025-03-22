import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import FunandLearnIntro from './FunandLearnIntro'
import { t } from 'i18next'
import errorimg from "src/assets/images/error.svg"

const FunandLearnSlider = data => {

  return (
    <>
      <div className='subcat__slider__context mt-1'>
        <div className='container'>
          <div className='quizplay-slider row'>
            {data.funandlearningloading ? (
              <div className='text-center'>
                <Skeleton count={5} />
              </div>
            ) : (
              <>
                {data.data ? (
                  <>
                    {data.data?.length > 0 &&
                      data.data.map((Fundata, key) => {
                        return (
                          <div className='col-md-3 col-12' key={key}>
                            <FunandLearnIntro
                              categoryall={data.categoryall}
                              subcategoryall={data.subcategoryall}
                              data={Fundata}

                              funandlearn={Fundata.id}
                            />
                          </div>
                        )
                      })}
                  </>
                ) : (
                  <div className='text-center mt-4 commonerror'>
                    <img src={errorimg.src} title='wrteam' className='error_img' />
                    <p>{t('No Data found')}</p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
export default withTranslation()(FunandLearnSlider)
