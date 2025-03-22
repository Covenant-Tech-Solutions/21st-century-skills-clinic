import React, { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sysConfigdata } from "src/store/reducers/settingsSlice";

const TimerSlider = ({ onClick, t, timeractiveIndex }) => {

  const systemconfig = useSelector(sysConfigdata);

  let self_challange_max_minutes = Number(systemconfig?.self_challenge_max_minutes);
  const limit = self_challange_max_minutes;
  let arr = [];

  if (limit >= 3) {
    for (let i = 0; i <= limit; i++) {
      if (i % 3 == 0 && i != 0) {
        arr.push(i);
      }
    }

  }else{
    arr.push(limit)
  }
  


  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const toggleShowAllQuestions = () => {
    setShowAllQuestions(!showAllQuestions);
  };
  return (
    <Fragment>
      <div className="subcat__slider__context">
        <div className="container">
          <div className="row">

            {/* Select time period slider */}
            <div className="cat__Box text-center">
              <div className="sub_cat_title">
                <p className="text-capitalize font-weight-bold font-smaller subcat__p">
                  {t("Select Time Period in Minutes")}
                </p>
              </div>
              <div className="sub_cat_title1">
                <p
                  className="text-capitalize font-weight-bold font-smaller subcat__p"
                  onClick={toggleShowAllQuestions}
                  style={{ cursor: "pointer" }}
                >
                  {arr.length >= 8 ? <>
                    {showAllQuestions ? t("See Less") : t("See More")}
                  </>
                    : null}
                </p>
              </div>
            </div>

            <div className="quizplay-slider">
              {showAllQuestions ? (
                <div className="row">
                  {arr.map((data, key) => (
                    <div onClick={() => onClick(data)} key={key} className={`col-sm-6 col-md-6 col-lg-3 subcatintro__sec selfLearnNumWrapper ${timeractiveIndex === data ? "activeEle" : "unactiveEle"}`}>
                        <div className={`card spandiv `}>
                          <div className="card__name m-auto">
                            <p className="text-center m-auto d-block number">
                              {data}
                            </p>
                            <p className="text-center m-auto d-block numText">
                              {t("Minutes")}
                            </p>
                          </div>
                        </div>
                      </div>
                    
                  ))}
                </div>

              ) : (
                <div className="row">
                  {arr.slice(0, 8).map((data, key) => (
                    <div className="col-6" key={key}>

                      <div onClick={() => onClick(data)} className={`subcatintro__sec selfLearnNumWrapper ${timeractiveIndex === data ? "activeEle" : "unactiveEle"}`}>
                        <div className={`card spandiv `}>
                          <div className="card__name m-auto">
                            <p className="text-center m-auto d-block number">
                              {data}
                            </p>
                            <p className="text-center m-auto d-block numText">
                              {t("Minutes")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(TimerSlider);
