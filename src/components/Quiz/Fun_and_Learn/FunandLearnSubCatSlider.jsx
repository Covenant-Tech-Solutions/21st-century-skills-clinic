import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { t } from "i18next";
import FunandLearnSubIntro from "./FunandLearnSubIntro";
import errorimg from "src/assets/images/error.svg"


const FunandLearnSubCatSlider = (data) => {
    return (
        <>
            <div className="quizplay subcat__slider__context subCatWrapper">
                <div className="container">
                    <div className="row">
                        <div className="quizplay-slider ">
                            {data.subloading ? (
                                <div className="text-center">
                                    <Skeleton count={5} />
                                </div>
                            ) : (
                                <>
                                    {data ? (
                                        <div className="row mt-4">
                                            {data &&
                                                data.data.map((subcat, key) => {
                                                    return (
                                                        <div className="col-md-3 col-12" key={key} onClick={() => data.onClick(subcat)}>
                                                            <FunandLearnSubIntro data={subcat} />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <div className="text-center mt-4 commonerror">
                                            <img src={errorimg.src} title="wrteam" className="error_img" />
                                            <p>{t("No Subcategories Data Found")}</p>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default withTranslation()(FunandLearnSubCatSlider);
