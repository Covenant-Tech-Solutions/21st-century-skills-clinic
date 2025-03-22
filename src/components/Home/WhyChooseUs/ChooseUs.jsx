"use client"
import { truncate } from 'src/utils'
import titleline from '../../../assets/images/title-line.svg'
import { withTranslation } from 'react-i18next'

const ChooseUs = (props) => {
  const data = [
    {
      id: '1',
      image: props?.homeSettings?.section1_image1,
      title: props?.homeSettings?.section1_title1,
      desc: props?.homeSettings?.section1_desc1
    },
    {
      id: '2',
      image: props?.homeSettings?.section1_image2,
      title: props?.homeSettings?.section1_title2,
      desc: props?.homeSettings?.section1_desc2
    },
    {
      id: '3',
      image: props?.homeSettings?.section1_image3,
      title: props?.homeSettings?.section1_title3,
      desc: props?.homeSettings?.section1_desc3
    }
  ]

  return (
    <>
      {!props.isLoading ? (
        <section className='choose_us'>
          <div className='container'>
            <div className='row'>
              <div className='head_title'>
                <h2>{props?.homeSettings?.section1_heading}</h2>
                <div className='image'>
                  <img src={titleline.src} alt='line' />
                </div>
              </div>
            </div>
            <div className='choose_us_inner'>
              <div className='row'>
                {data && data.map((elem, index) => (
                  <div className='col-md-4' key={index}>
                    <div className='inner_data'>
                      <div className='image'>
                        <img src={elem.image} alt='line' />
                      </div>
                      <div className='title'>
                        <h3>{truncate(elem.title,19)}</h3>
                      </div>
                      <div className='desc'>
                        <p>{truncate(elem.desc,115)}</p>
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

export default withTranslation()(ChooseUs)
