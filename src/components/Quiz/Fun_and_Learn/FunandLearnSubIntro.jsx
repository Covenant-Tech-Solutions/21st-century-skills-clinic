import { withTranslation } from "react-i18next";
import c1 from "src/assets/images/c1.svg"
import excla from 'src/assets/images/exclamation.svg'
const FunandLearnSubIntro = ({ data, t }) => {
  const imageToShow = data.has_unlocked === "0" && data.is_premium === "1";

  return (
    <div className="subcatintro__sec">
      <div className={`card spandiv `}>
        <div className="cardInnerData">
          <span className='Box__icon'>
            <img src={data.image ? data.image : `${excla.src}`} alt='image' />
          </span>
          <div className="cardDetails">
            <p className='cardText '>{data.subcategory_name}</p>
            <div className="cardSubDetails">
              <p className='CardQues'> {t("Questions")} : {data.no_of_que}</p>
              {imageToShow ? (
                <img
                  src={c1.src}
                  alt="premium"
                  width={30}
                  height={30}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(FunandLearnSubIntro);
