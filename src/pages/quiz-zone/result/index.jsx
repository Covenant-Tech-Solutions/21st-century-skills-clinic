"use client"
import { t } from "i18next";
import { Breadcrumb } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ShowScore from "src/components/Common/ShowScore"
import { getQuizEndData, reviewAnswerShowData, reviewAnswerShowSuccess, selectPercentage, selectQuizZonePercentage, selectResultTempData, selecttempdata, updateTempdata } from "src/store/reducers/tempDataSlice";
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { sysConfigdata } from "src/store/reducers/settingsSlice";
import { updateUserDataInfo } from "src/store/reducers/userSlice";
import { UserCoinScoreApi } from "src/store/actions/campaign";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })


const MySwal = withReactContent(Swal)

const Index = () => {

    const navigate = useRouter()

    const dispatch = useDispatch()

    const reviewAnserShow = useSelector(reviewAnswerShowData)

    const showscreenornot = useSelector(selectQuizZonePercentage)

    const percentageScore = useSelector(selectPercentage)

    const showScore = useSelector(selectResultTempData);

    const resultScore = useSelector(getQuizEndData)

    const systemconfig = useSelector(sysConfigdata)

    const review_answers_deduct_coin =  Number(systemconfig?.review_answers_deduct_coin)

    const userData = useSelector(state => state.User)

    let getData = useSelector(selecttempdata)

    const playAgain = () => {
        navigate.push(`/quiz-zone/level/${showScore.querylevel}/dashboard-play`)
    }

    const nextLevel = () => {
        let temp_level = getData.level + 1
        updateTempdata(temp_level)
        navigate.push(`/quiz-zone/level/${showScore.querylevel}/dashboard-play`)
    }

    const handleReviewAnswers = () => {
        let coins = review_answers_deduct_coin;

        if (!reviewAnserShow) {
            if (userData?.data?.coins < coins) {
                toast.error(t("You Don't have enough coins"));
                return false;
            }
        }

        MySwal.fire({
            title: t("Are you sure"),
            text: !reviewAnserShow ? review_answers_deduct_coin  + " " + t("Coins will be deducted from your account") : null,
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: t("Continue"),
            cancelButtonText: t("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                if (!reviewAnserShow) {
                    let status = 1;
                    UserCoinScoreApi(
                        "-" + coins,
                        null,
                        null,
                        "Quiz Zone Review Answers",
                        status,
                        (response) => {
                            updateUserDataInfo(response.data);
                            navigate.push("/quiz-zone/review-answer")
                            dispatch(reviewAnswerShowSuccess(true))
                        },
                        (error) => {
                            Swal.fire(t("OOps"), t("Please Try again"), "error");
                            console.log(error);
                        }
                    );
                }else {
                    navigate.push("/quiz-zone/review-answer")
                }
            }
        });
    };

    const goBack = () => {
        navigate.push('/quiz-zone')
    }

    return (
        <Layout>
            <Breadcrumb title={t('Quiz Play')} content="" contentTwo="" />
            <div className='dashboard'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <ShowScore
                                    showCoinandScore={showscreenornot}
                                    score={percentageScore}
                                    totalQuestions={showScore.totalQuestions}
                                    onPlayAgainClick={playAgain}
                                    onReviewAnswersClick={handleReviewAnswers}
                                    onNextLevelClick={nextLevel}
                                    goBack={goBack}
                                    coins={showScore.coins}
                                    quizScore={showScore.quizScore}
                                    currentLevel={showScore.currentLevel}
                                    maxLevel={showScore.maxLevel}
                                    showQuestions={showScore.showQuestions}
                                    reviewAnswer={showScore.reviewAnswer}
                                    playAgain={showScore.playAgain}
                                    nextlevel={showScore.nextlevel}
                                    corrAns={resultScore.Correctanswer}
                                    inCorrAns={resultScore.InCorrectanswer}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )


}

export default Index