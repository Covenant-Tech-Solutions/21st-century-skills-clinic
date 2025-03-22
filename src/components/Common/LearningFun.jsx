"use client"
import React from 'react'
import titleline from '../../assets/images/title-line.svg'

const LearningFun = ({ img, learingFunData }) => {
    return (
        <div>
            <section className='learning_fun container'>
                <div className='row'>
                    <div className='head_title'>
                        <h2>{t("learningtitle")}</h2>
                        <div className='image'>
                            <img src={titleline.src} alt='line' />
                        </div>
                    </div>
                </div>
                <div className='learning_fun_inner'>
                    <div className='row'>
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="leftSec">
                                <img src={img.src} alt="" />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="rightSec">
                                {
                                    learingFunData.map((data) => {
                                        return (
                                            <div key={data.id}>
                                                <div className="learningFunPara">
                                                    <p>{data.topPara}</p>
                                                </div>
                                                <div className="descListItems">
                                                    <li className='listItems'>
                                                        {data.list1}
                                                    </li>
                                                    <li className='listItems'>
                                                        {data.list2}
                                                    </li>
                                                    <li className='listItems'>
                                                        {data.list3}
                                                    </li>
                                                    <li className='listItems'>
                                                        {data.list4}
                                                    </li>
                                                    <li className='listItems'>
                                                        {data.list5}
                                                    </li>
                                                    <p className='conclusion'>
                                                        {data.bottomPara}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default LearningFun
