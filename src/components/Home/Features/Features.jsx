"use client"
import titleline from '../../../assets/images/title-line.svg'
import { withTranslation } from 'react-i18next'
import { t } from 'i18next'
import { truncate } from 'src/utils'

const Features = (props) => {

  const data = [
    {
      id: '1',
      image: props?.homeSettings?.section2_image1,
      title: props?.homeSettings?.section2_title1,
      desc: props?.homeSettings?.section2_desc1
    },
    {
      id: '2',
      image: props?.homeSettings?.section2_image2,
      title: props?.homeSettings?.section2_title2,
      desc: props?.homeSettings?.section2_desc2
    },
    {
      id: '3',
      image: props?.homeSettings?.section2_image3,
      title: props?.homeSettings?.section2_title3,
      desc: props?.homeSettings?.section2_desc3
    },
    {
      id: '4',
      image: props?.homeSettings?.section2_image4,
      title: props?.homeSettings?.section2_title4,
      desc: props?.homeSettings?.section2_desc4
    }
  ]
  return (
    <>
      {!props.isLoading ? (
        <section className='feature'>
          <div className='container'>
            <div className='row'>
              <div className='head_title'>
                <h2>{props?.homeSettings?.section2_heading}</h2>
                <div className='image'>
                  <img src={titleline.src} alt='line' />
                </div>
              </div>
            </div>
            <div className='feature_inner'>
              <div className='row'>
                {data && data.map((elem, index) => (
                  <div className='col-md-6' key={index}>
                    <div className='inner_data'>
                      <div className='left_sec'>
                        <div className='image'>
                          <img src={elem.image} alt='line' />
                        </div>
                      </div>
                      <div className='right_sec'>
                        <div className='title'>
                          <h3>{truncate(elem.title,19)}</h3>
                        </div>
                        <div className='desc'>
                          <p>{truncate(elem.desc,115)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default withTranslation()(Features)