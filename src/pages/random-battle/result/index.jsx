"use client"
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ShowScore from 'src/components/Quiz/RandomBattle/ShowScore'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { settingsData } from 'src/store/reducers/settingsSlice'
import { UserCoinScoreApi } from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { reviewAnswerShowData, reviewAnswerShowSuccess, selectResultTempData } from 'src/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from 'i18next'

const MySwal = withReactContent(Swal)

const RandomPlay = () => {

    const dispatch = useDispatch()

    const reviewAnserShow = useSelector(reviewAnswerShowData)

    const navigate = useRouter()

    const selectdata = useSelector(settingsData)

    const showScore = useSelector(selectResultTempData);

    const review_answers_deduct_coin = selectdata && selectdata.filter((item) => item.type == "review_answers_deduct_coin");

    // store data get
    const userData = useSelector(state => state.User)

    const handleReviewAnswers = () => {
        let coins = review_answers_deduct_coin && Number(review_answers_deduct_coin[0]?.message);
        if (!reviewAnserShow) {
            if (userData?.data?.coins < coins) {
                toast.error(t("You Don't have enough coins"));
                return false;
            }
        }


        MySwal.fire({
            title: t("Are you sure"),
            text: !reviewAnserShow ? review_answers_deduct_coin && Number(review_answers_deduct_coin[0]?.message) + " " + t("Coins will be deducted from your account") : null,
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
                        "Random Battle Review Answer",
                        status,
                        (response) => {
                            updateUserDataInfo(response.data);
                            navigate.push("/random-battle/review-answer")
                            dispatch(reviewAnswerShowSuccess(true))
                        },
                        (error) => {
                            Swal.fire(t("OOps"), t("Please Try again"), "error");
                            console.log(error);
                        }
                    );
                } else {
                    navigate.push("/random-battle/review-answer")
                }
            }
        });

    };

    const goBack = () => {
        navigate.push('/random-battle')
    }

    return (
        <Layout>
            <Breadcrumb title={t('1 vs 1 Battle')} content="" contentTwo="" />
            <div className='funandlearnplay dashboard battlerandom'>
                <div className='container'>
                    <div className='row '>
                        <div className='morphisam'>
                            <div className='whitebackground pt-3'>
                                <>
                                    <ShowScore
                                        score={showScore.score}
                                        totalQuestions={showScore.totalQuestions}
                                        onReviewAnswersClick={handleReviewAnswers}
                                        goBack={goBack}
                                        quizScore={showScore.quizScore}
                                        reviewAnswer={true}
                                        coins={showScore.coins}
                                    />
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default withTranslation()(RandomPlay)
