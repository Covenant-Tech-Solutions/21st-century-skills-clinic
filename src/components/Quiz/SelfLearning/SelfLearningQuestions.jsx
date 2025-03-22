import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Timer from "src/components/Common/Timer";
import { Modal, Button } from "antd";
import { decryptAnswer, imgError } from "src/utils";
import { FaArrowsAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "src/store/reducers/settingsSlice";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import Bookmark from "src/components/Common/Bookmark";
import { setbookmarkApi } from 'src/store/actions/campaign'
import { LoadQuizZoneCompletedata, percentageSuccess, questionsDataSuceess, resultTempDataSuccess } from "src/store/reducers/tempDataSlice";
import { useRouter } from "next/router";


function SelfLearningQuestions({ t, questions: data, timerSeconds, onOptionClick, showBookmark }) {

    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [corrAns, setCorrAns] = useState(0)
    const [inCorrAns, setInCorrAns] = useState(0)
    const child = useRef(null);
    const scroll = useRef(null);
    const [disablePrev, setDisablePrev] = useState(true);
    const [disableNext, setDisableNext] = useState(false);
    const [update_questions, setUpdate_questions] = useState(data);
    const [notificationmodal, setNotificationModal] = useState(false);
    const [score, setScore] = useState(0);
    const systemconfig = useSelector(sysConfigdata);

    const dispatch = useDispatch()

    const navigate = useRouter()


    // store data get
    const userData = useSelector((state) => state.User);

    setTimeout(() => {
        setQuestions(data);
    }, 500);

    // button option answer check
    const handleAnswerOptionClick = (selected_option) => {
        let { id } = questions[currentQuestion];
        let update_questions = questions.map((data) => {
            return data.id === id ? { ...data, selected_answer: selected_option, isAnswered: true } : data;
        });
        setUpdate_questions(update_questions);

        if (questions[currentQuestion].selected_answer) setQuestions(update_questions);

        onOptionClick(update_questions);
        dispatch(questionsDataSuceess(update_questions));
    };

    // option answer status check
    const setAnswerStatusClass = (option) => {
        if (questions[currentQuestion].isAnswered) {
            if (systemconfig && systemconfig.answer_mode === "1") {
            }
            if (questions[currentQuestion].selected_answer === option) {
                return "bg-theme";
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    const onSubmit = async () => {
        // let result_score = Score.current;
        let result_score = score;
        update_questions.map((data) => {
            let selectedAnswer = data.selected_answer;
            let decryptedAnswer = decryptAnswer(data.answer, userData?.data?.firebase_id);
            if (decryptedAnswer === selectedAnswer) {
                result_score++;
                setScore(result_score);
                setCorrAns(result_score)
                setInCorrAns(update_questions.length - result_score)

                // LoadQuizZoneCompletedata(result_score, update_questions.length - result_score)
                LoadQuizZoneCompletedata(result_score, update_questions.length - result_score)
            }
        });
        dispatch(percentageSuccess(result_score))
        onOptionClick(questions, result_score);

        await onQuestionEnd()
        
    };

    const onQuestionEnd = async () => {
        const tempData = {
          totalQuestions: update_questions?.length,
          showQuestions: true,
          reviewAnswer: false,
        };
        // Dispatch the action with the data
        dispatch(resultTempDataSuccess(tempData));
        await navigate.push("/self-learning/result")
      }

    const onTimerExpire = () => {
        onSubmit();
        setInCorrAns(inCorrAns + 1)

    };

    const previousQuestion = () => {
        const prevQuestion = currentQuestion - 1;
        if (prevQuestion >= 0) {
            if (prevQuestion > 0) {
                setDisablePrev(false);
            } else {
                setDisablePrev(true);
            }
            setDisableNext(false);
            setCurrentQuestion(prevQuestion);
        }
    };

    const nextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions?.length) {
            if (nextQuestion + 1 === questions?.length) {
                setDisableNext(true);
            } else {
                setDisableNext(false);
            }
            setDisablePrev(false);
            setCurrentQuestion(nextQuestion);
        }
    };

    // pagination
    const handlePagination = (index) => {
        setCurrentQuestion(index);
    };

    const handleBookmarkClick = (question_id, isBookmarked) => {
        let type = 1
        let bookmark = '0'

        if (isBookmarked) bookmark = '1'
        else bookmark = '0'

        return setbookmarkApi(
            question_id,
            bookmark,
            type,
            response => {
                if (response.error) {
                    toast.error(t('Cannot Remove Question from Bookmark'))
                    return false
                } else {
                    if (isBookmarked) {
                        getAndUpdateBookmarkData(type)
                    } else {
                        deleteBookmarkByQuestionID(question_id)
                    }
                    return true
                }
            },
            error => {
                console.error(error)
            }
        )
    }


    return (
        <React.Fragment>
            <div className='dashboardPlayUppDiv funLearnQuestionsUpperDiv selfLearnQuestionsUpperDiv text-end p-2 pb-0'>
                <div className="leftSec">
                    <div className="coins">
                        <span>{t("Coins")} : {userData?.data?.coins}</span>
                    </div>

                    {/* <div className="rightWrongAnsDiv">
                        <span className='rightAns'>
                            <img src={rightTickIcon.src} alt="" />{corrAns}
                        </span>

                        <span className='wrongAns'>
                            <img src={crossIcon.src} alt="" />{inCorrAns}</span>
                    </div> */}
                </div>

                <div className="rightSec">
                    <div className="rightWrongAnsDiv correctIncorrect">
                        <span className='rightAns'>
                            {currentQuestion + 1} - {questions?.length}</span>
                    </div>
                    <div className="p-2 pb-0">
                        {showBookmark ? (
                            <Bookmark
                                id={questions[currentQuestion].id}
                                isBookmarked={questions[currentQuestion].isBookmarked ? questions[currentQuestion].isBookmarked : false}
                                onClick={handleBookmarkClick}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>

            <div className="questions selflearnigque" ref={scroll}>
                <div className="timerWrapper">
                    <div className="inner__headerdash">
                        {questions && questions[0]["id"] !== "" ? <Timer ref={child} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} /> : ""}
                    </div>
                </div>


                <div className="content__text">
                    <p className="question-text pt-4">{questions[currentQuestion].question}</p>
                </div>

                {questions[currentQuestion].image ? (
                    <div className="imagedash">
                        <img src={questions[currentQuestion].image} onError={imgError} alt="" />
                    </div>
                ) : (
                    ""
                )}

                {/* {/ options /} */}
                <div className="row optionsWrapper">
                    {questions[currentQuestion].optiona ? (
                        <div className="col-md-6 col-12">
                            <div className="inner__questions">
                                <button className={`btn button__ui w-100 ${setAnswerStatusClass("a")}`} onClick={(e) => handleAnswerOptionClick("a")}>
                                    <div className="row">
                                        <div className="col">{questions[currentQuestion].optiona}</div>
                                        {questions[currentQuestion].probability_a ? <div className="col text-end">{questions[currentQuestion].probability_a}</div> : ""}
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {questions[currentQuestion].optionb ? (
                        <div className="col-md-6 col-12">
                            <div className="inner__questions">
                                <button className={`btn button__ui w-100 ${setAnswerStatusClass("b")}`} onClick={(e) => handleAnswerOptionClick("b")}>
                                    <div className="row">
                                        <div className="col">{questions[currentQuestion].optionb}</div>
                                        {questions[currentQuestion].probability_b ? <div className="col text-end">{questions[currentQuestion].probability_b}</div> : ""}
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {questions[currentQuestion].question_type === "1" ? (
                        <>
                            {questions[currentQuestion].optionc ? (
                                <div className="col-md-6 col-12">
                                    <div className="inner__questions">
                                        <button className={`btn button__ui w-100 ${setAnswerStatusClass("c")}`} onClick={(e) => handleAnswerOptionClick("c")}>
                                            <div className="row">
                                                <div className="col">{questions[currentQuestion].optionc}</div>
                                                {questions[currentQuestion].probability_c ? <div className="col text-end">{questions[currentQuestion].probability_c}</div> : ""}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {questions[currentQuestion].optiond ? (
                                <div className="col-md-6 col-12">
                                    <div className="inner__questions">
                                        <button className={`btn button__ui w-100 ${setAnswerStatusClass("d")}`} onClick={(e) => handleAnswerOptionClick("d")}>
                                            <div className="row">
                                                <div className="col">{questions[currentQuestion].optiond}</div>
                                                {questions[currentQuestion].probability_d ? <div className="col text-end">{questions[currentQuestion].probability_d}</div> : ""}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {systemconfig && systemconfig.option_e_mode && questions[currentQuestion].optione ? (
                                <div className="row d-flex justify-content-center mob_resp_e">
                                    <div className="col-md-6 col-12">
                                        <div className="inner__questions">
                                            <button className={`btn button__ui w-100 ${setAnswerStatusClass("e")}`} onClick={(e) => handleAnswerOptionClick("e")}>
                                                <div className="row">
                                                    <div className="col">{questions[currentQuestion].optione}</div>
                                                    {questions[currentQuestion].probability_e ? (
                                                        <div className="col" style={{ textAlign: "right" }}>
                                                            {questions[currentQuestion].probability_e}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </>
                    ) : (
                        ""
                    )}
                </div>

                <div className='divider'>
                    <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
                </div>

                <div className="dashoptions selfLearnLifelines">
                    <div className="fifty__fifty">
                        <button className="btn btn-primary" onClick={previousQuestion} disabled={disablePrev}>
                            {/* <span className='lifelineText'>{t("Previous Question")}</span> */}
                            <span className='lifelineIcon'> <RiArrowLeftDoubleLine size={25} /></span>
                        </button>
                    </div>
                    {/* {/ pagination /} */}

                    <div className="notification self-learning-pagination">
                        <Button className="notify_btn btn-primary" onClick={() => setNotificationModal(true)}>
                            {/* <span className='lifelineText'>{t("View Question Dashboard")}</span> */}
                            <span className='lifelineIcon'> <FaArrowsAlt /></span>
                        </Button>

                        <Modal centered visible={notificationmodal} onOk={() => setNotificationModal(false)} onCancel={() => setNotificationModal(false)} footer={null} className="custom_modal_notify self-modal">
                            <div className={`que_pagination ${questions?.length > 50 ? 'questions-scrollbar' : ''}`}>
                                {questions?.map((que_data, index) => {
                                    return (
                                        <div className="que_content" key={index}>
                                            <p className="d-none">{que_data.id}</p>

                                            <p className={`que_box ${update_questions && update_questions[index]?.isAnswered ? "bg-green" : "bg-dark"}`} onClick={() => handlePagination(index)}>
                                                {index + 1}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="selfAttemptModal">

                                {/* <div className='divider'>
                                    <span className='dividerlines'><img src={questionIcon.src} alt="" /></span>
                                </div> */}
                            </div>
                            <hr />
                            <p>{t("Color Code")}</p>
                            {/* {/ check and unchecked /} */}
                            <div className="custom_checkbox d-flex flex-wrap align-items-center">
                                <input type="radio" name="" className="tick me-2" checked readOnly /> {t("Attended Question")}
                                <input type="radio" name="" className="untick ms-3 me-2" disabled readOnly /> {t("Un-Attempted")}
                            </div>
                        </Modal>
                    </div>
                    <div className="skip__questions">
                        <button className="btn btn-primary" onClick={nextQuestion} disabled={disableNext}>
                            {/* <span className='lifelineText'>{t("Next Question")}</span> */}
                            <span className='lifelineIcon'> <RiArrowRightDoubleLine size={25} /></span>
                        </button>
                    </div>

                    <div className="resettimer">
                        <button className="btn btn-primary" onClick={onSubmit}>
                            {t("Submit")}
                        </button>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
}

SelfLearningQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

SelfLearningQuestions.defaultProps = {
    showBookmark: true,
};

export default withTranslation()(SelfLearningQuestions);
