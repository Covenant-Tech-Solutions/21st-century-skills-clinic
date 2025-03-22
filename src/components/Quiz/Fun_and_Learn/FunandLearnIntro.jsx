import React from 'react'
import { withTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Loadtempdata } from 'src/store/reducers/tempDataSlice'

const FunandLearnIntro = ({ data, t, }) => {
  const router = useRouter()

  const handleSubcategory = subdata => {
    Loadtempdata(subdata)
    router.push({
      pathname: `/fun-and-learn/fun-data/${subdata.id}/fun-and-learn-play`,
      query: {
        fun_learn_id: subdata.id,
      }
    })
  }

  return (
    <div className='subcatintro__sec funLevelsWrapper'>
      <div onClick={() => handleSubcategory(data)}>
        <div className={`card spandiv`}>
          <div className='card__name m-auto funLevels'>
            <p className='text-center m-auto d-block dataTitle'>{data.title}</p>
            <p className='text-center m-auto d-block fun_learn_hide'>
              {t('Questions')} : {data.no_of_que}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withTranslation()(FunandLearnIntro)
