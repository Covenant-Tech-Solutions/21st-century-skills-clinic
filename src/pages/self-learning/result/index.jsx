"use client"
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { UserCoinScoreApi } from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import { useRouter } from 'next/navigation'
import { getQuizEndData, reviewAnswerShowData, reviewAnswerShowSuccess, selectPercentage, selectResultTempData } from 'src/store/reducers/tempDataSlice'
import SelfLearningShowScore from 'src/components/Quiz/SelfLearning/SelfLearningShowScore'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const MySwal = withReactContent(Swal)

const SelfLearningplay = () => {

    const dispatch = useDispatch()

    const reviewAnserShow = useSelector(reviewAnswerShowData)

    const percentageScore = useSelector(selectPercentage)

    const resultScore = useSelector(getQuizEndData)

    const showScore = useSelector(selectResultTempData);

    const systemconfig = useSelector(sysConfigdata)

    const review_answers_deduct_coin =  Number(systemconfig?.review_answers_deduct_coin)

    const navigate = useRouter()


    // store data get
    const userData = useSelector(state => state.User)

    const handleReviewAnswers = () => {
        let coins = review_answers_deduct_coin
        if (!reviewAnserShow) {
            if (userData?.data?.coins < coins) {
                toast.error(t("You Don't have enough coins"));
                return false;
            }
        }

        MySwal.fire({
            title: t("Are you sure"),
            text: !reviewAnserShow ? review_answers_deduct_coin + " " + t("Coins will be deducted from your account") : null,
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
                        "SelfLearning Review Answer",
                        status,
                        (response) => {
                            updateUserDataInfo(response.data);
                            navigate.push("/self-learning/review-answer")
                            dispatch(reviewAnswerShowSuccess(true))
                        },
                        (error) => {
                            Swal.fire(t("OOps"), t("Please Try again"), "error");
                            console.log(error);
                        }
                    );
                } else {
                    navigate.push("/self-learning/review-answer")
                }
            }
        });

    };

    const goBack = () => {
        navigate.push('/self-learning')
    }

    return (
        <Layout>
            <Breadcrumb title={t('Self Learning')} content="" contentTwo="" />
            <div className='dashboard selflearnig-play'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <SelfLearningShowScore
                                    showCoinandScore={true}
                                    score={percentageScore}
                                    totalQuestions={showScore.totalQuestions}
                                    onReviewAnswersClick={handleReviewAnswers}
                                    goBack={goBack}
                                    coins={showScore.coins}
                                    quizScore={showScore.quizScore}
                                    showQuestions={true}
                                    reviewAnswer={false}
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
export default withTranslation()(SelfLearningplay)
