"use client"
import React from 'react'
import { Accordion } from 'react-bootstrap'
import titleline from '../../assets/images/title-line.svg'
import { t } from 'i18next'

const FAQS = ({faqsData}) => {
    return (
        <div>
            <section className='faqs'>
                <div className='container'>
                    <div className='row'>
                        <div className='head_title'>
                            <h2>{t("faq")}</h2>
                            <div className='image'>
                                <img src={titleline.src} alt='line' />
                            </div>
                        </div>
                    </div>
                    <div className='faqWrapper'>
                        <div className='row'>
                            <div className="faq-body">

                                <Accordion defaultActiveKey="2">
                                    {faqsData && faqsData.map((faq, index) => {
                                        return (
                                            <div className="col-sm-12 col-md-12 col-lg-12" key={index}>
                                                <Accordion.Item eventKey={index} >
                                                    <Accordion.Header>{faq.question} </Accordion.Header>
                                                    <Accordion.Body>
                                                        {faq.ans}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </div>
                                        )
                                    })}
                                </Accordion>

                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default FAQS
