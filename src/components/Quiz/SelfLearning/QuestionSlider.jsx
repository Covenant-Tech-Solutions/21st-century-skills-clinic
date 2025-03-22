import React, { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sysConfigdata } from "src/store/reducers/settingsSlice";
import { Select } from 'antd';

const QuestionSlider = ({ t, onClick, activeIndex }) => {

  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const toggleShowAllQuestions = () => {
    setShowAllQuestions(!showAllQuestions);
  };

  const systemconfig = useSelector(sysConfigdata);

  const self_challange_max_questions = Number(systemconfig.self_challenge_max_questions);

  const limit = self_challange_max_questions;

  let arr = [];
  if (limit >= 5) {

    for (let i = 0; i <= limit; i++) {
      if (i % 5 == 0) {
        if (i != 0) {
          arr.push(i)
        }
      }
    }
  } else {
    arr.push(limit)
  }

  const questionOptions = arr.map((data) => ({
    value: data,
    label: `${data} ${t("Questions")}`
  }));

  const timeOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${t("Minutes")}`
  }));

  return (
    <Fragment>
      <div className="subcat__slider__context">
        <div className="container">
          <div className="row">
            {/* Select number of questions */}
            <div className="cat__Box">
              <div className="sub_cat_title">
                <p className="text-capitalize text-center font-weight-bold font-smaller subcat__p">
                  {t("Select Number of Questions")}
                </p>
              </div>
              <div className="dropdown-container">
                <Select
                  options={questionOptions}
                  onChange={onClick}
                  className="custom-dropdown"
                  placeholder={t("Select Number of Questions")}
                />
              </div>
            </div>            
          </div>
        </div>
      </div>
      <style jsx>{`
        .dropdown-container {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
        .custom-dropdown {
          width: 100%;
          max-width: 300px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Fragment>
  );
};

export default withTranslation()(QuestionSlider);
