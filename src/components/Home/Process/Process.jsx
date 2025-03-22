"use client"
import titleline from '../../../assets/images/title-line.svg'
import workline from "../../../assets/images/lightline.svg"
import { withTranslation } from 'react-i18next'
import { truncate } from 'src/utils'

const Process = (props) => {
  return (
    <>
      {!props.isLoading ? (
        <section className='work-process-one'>
          <div className='shape2'>
            <img src={workline.src} alt="line" />
          </div>
          <div className='container'>
            <div className='row'>
              <div className='title'>
                <h2>
                  {props?.homeSettings?.section3_heading}
                </h2>
                <div className='image'>
                  <img src={titleline.src} alt='line' />
                </div>
              </div>
            </div>
            <div className='row filter-layout masonary-layout mt-1'>
              <div className='col-xl-3 col-lg-3 col-md-6 wow fadeInLeft animated'>
                <div className='work-process-one__single'>
                  <div className='work-process-one__single-icon'>
                    <div className='inner'>
                      <img src={props?.homeSettings?.section3_image1} className='image' />
                    </div>
                    <div className='count-box counted'></div>
                  </div>

                  <div className='work-process-one__single-content text-center'>
                    <h2>
                      <a>
                        {truncate(props?.homeSettings?.section3_title1,19)}
                      </a>
                    </h2>
                    <p>{truncate(props?.homeSettings?.section3_desc1,72)}</p>
                  </div>
                </div>
              </div>

              <div className='col-xl-3 col-lg-3 col-md-6 wow fadeInLeft animated'>
                <div className='work-process-one__single style2 mt100'>
                  <div className='work-process-one__single-icon'>
                    <div className='inner'>
                      <img src={props?.homeSettings?.section3_image2} />
                    </div>
                    <div className='count-box counted'></div>
                  </div>

                  <div className='work-process-one__single-content text-center'>
                    <h2>
                      <a>
                        {truncate(props?.homeSettings?.section3_title2,19)}
                      </a>
                    </h2>
                    <p>{truncate(props?.homeSettings?.section3_desc2,72)}</p>
                  </div>
                </div>
              </div>

              <div className='col-xl-3 col-lg-3 col-md-6 wow fadeInRight animated'>
                <div className='work-process-one__single mt50'>
                  <div className='work-process-one__single-icon'>
                    <div className='inner'>
                      <img src={props?.homeSettings?.section3_image3} />
                    </div>
                    <div className='count-box counted'></div>
                  </div>

                  <div className='work-process-one__single-content text-center'>
                    <h2>
                      <a>
                        {truncate(props?.homeSettings?.section3_title3,19)}
                      </a>
                    </h2>
                    <p>{truncate(props?.homeSettings?.section3_desc3,72)}</p>
                  </div>
                </div>
              </div>

              <div className='col-xl-3 col-lg-3 col-md-6 wow fadeInRight animated'>
                <div className='work-process-one__single style2'>
                  <div className='work-process-one__single-icon'>
                    <div className='inner'>
                      <img src={props?.homeSettings?.section3_image4} />
                    </div>
                    <div className='count-box counted'></div>
                  </div>

                  <div className='work-process-one__single-content text-center'>
                    <h2>
                      <a>
                        {truncate(props?.homeSettings?.section3_title4,19)}

                      </a>
                    </h2>
                    <p>
                      {truncate(props?.homeSettings?.section3_desc4,72)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default withTranslation()(Process)