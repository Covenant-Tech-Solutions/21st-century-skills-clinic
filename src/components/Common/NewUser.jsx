"use client"
import { useEffect, useRef, useState } from "react";
import { imgError } from "src/utils";
import { Switch } from "antd";
import { FaCamera, FaUserCircle } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Navigation } from "swiper/modules";
import profileImages from "src/assets/json/profileImages";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";
import { register, updateProfileApi } from "src/store/reducers/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { t } from 'i18next'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const NewUser = ({ profile, setProfile }) => {

    const [swiper, setSwiper] = useState();

    const navigationPrevRef = useRef(null);

    const [showReferCode, setShowReferCode] = useState(false);

    const userData = useSelector((state) => state.User);

    const navigationNextRef = useRef(null);

    const router = useRouter();

    // dummy profile update
    const dummyProfileImage = (e) => {
        e.preventDefault();
        const fileName = e.target.getAttribute("data-file");
        const url = `${window.location.origin}/images/profileimages/${fileName}`;

        fetch(url).then(async (response) => {
            const contentType = response.headers.get("content-type");
            const blob = await response.blob();
            const file = new File([blob], fileName, { contentType });
            // access file here
            updateProfileApi(
                file,
                (success) => {
                    toast.success("successfully updated");
                },
                (error) => {
                    toast.error(error);
                }
            );
        });
    };

    // new user form submit
    const formSubmit = (e) => {
        e.preventDefault();
        let firebase_id = profile.uid;
        let email = profile.email;
        let phone = profile.phoneNumber ? profile.phoneNumber : null;
        let image_url = profile.photoURL ? profile.photoURL : null;
        let name = profile.name;
        let fcm_id = null;
        let friends_code = profile.friends_code;
        register(
            firebase_id,
            "mobile",
            name,
            email,
            image_url,
            phone,
            fcm_id,
            friends_code,
            (success) => {
                router.push("/all-games");
            },
            (error) => {
                toast.error(error);
            }
        );
        if (profile.image) {
            updateProfileApi(profile.image);
        }
    };

    // handle image change
    const handleImageChange = (e) => {
        e.preventDefault();
        updateProfileApi(e.target.files[0]);
    };

    // set input field data
    const handleChange = (event) => {
        const field_name = event.target.name;
        const field_value = event.target.value;
        setProfile((values) => ({ ...values, [field_name]: field_value }));
    };

    // refer code
    const changeReferCodeCheckbox = () => {
        let state = !showReferCode;
        setShowReferCode(state);
    };

    const swiperOption = {
        loop: false,
        speed: 750,
        spaceBetween: 20,
        slidesPerView: 4,
        breakpoints: {
            0: {
                slidesPerView: 3.5,
            },
            1200: {
                slidesPerView: 4,
            },
        },
        autoplay: false,
    };

    useEffect(() => {
        if (swiper) {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    }, [swiper]);

    useEffect(() => {
        const ref = localStorage.getItem('ref');
        if (ref) {
            setProfile((values) => ({ ...values, friends_code: ref }));
        }
    }, []);

    return (
        <>
            <div className="Profile__Sec">
                <div className="custom-container">
                    <div className="row morphism">
                        <form onSubmit={formSubmit}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row card main__profile d-flex justify-content-center align-items-center">
                                        <h2 className="text-center title pb-3">{t("user_settings")}</h2>
                                        <p className="text-center">{t("upload_your_photo")}</p>
                                        <div className="prop__image">
                                            <img src={userData?.data && userData?.data?.profile ? userData?.data?.profile : "../../../public/images/user.svg"} alt="profile" id="user_profile" onError={imgError} />
                                            <div className="select__profile">
                                                <input type="file" name="profile" id="file" onChange={handleImageChange} />
                                                <label htmlFor="file">
                                                    {" "}
                                                    <em>
                                                        <FaCamera />
                                                    </em>
                                                </label>
                                                <input type="text" className="form-control" placeholder="Upload File" id="file1" name="myfile" disabled hidden />
                                            </div>
                                        </div>

                                        {/* dummy image slider */}
                                        <div className="dummy_image_slider">
                                            <div className="d-flex select_profile justify-content-center">
                                                <span className="line"></span>
                                                <h6 className="py-4">{t("Select Profile Photo")}</h6>
                                                <span className="line"></span>
                                            </div>
                                            <Swiper
                                                onSwiper={setSwiper}
                                                {...swiperOption}
                                                navigation={{
                                                    prevEl: navigationPrevRef.current,
                                                    nextEl: navigationNextRef.current,
                                                }}
                                                modules={[Navigation]}
                                            // style={{ marginLeft: "80px", marginRight: "80px", position: "unset" }}
                                            >
                                                {profileImages &&
                                                    profileImages.map((elem, key) => {
                                                        return (
                                                            <SwiperSlide key={key}>
                                                                <div className="pt-2 image_section">
                                                                    <img src={elem.img} alt="profile" onClick={(e) => dummyProfileImage(e)} data-file={elem.img.split("/").pop()} />
                                                                </div>
                                                            </SwiperSlide>
                                                        );
                                                    })}
                                            </Swiper>
                                            <div ref={navigationPrevRef} className="previous">
                                                <BsArrowLeftShort color="" />
                                            </div>
                                            <div ref={navigationNextRef} className="next">
                                                <BsArrowRightShort />
                                            </div>
                                        </div>

                                        <div className="card p-4 bottom__card_sec">
                                            <label htmlFor="fullName">
                                                <input type="text" name="name" id="fullName" placeholder={t("Enter Your Name")} defaultValue={profile.name} onChange={handleChange} required />
                                                <i>
                                                    <FaUserCircle />
                                                </i>
                                            </label>

                                            <div className="switch_data">
                                                <p>{t("do_you_have_refer_code")}</p>
                                                <Switch className="switch_button" checked={showReferCode} onChange={changeReferCodeCheckbox} />
                                            </div>

                                            {showReferCode ? (
                                                <div className="col-md-12 col-12">
                                                    <label htmlFor="mobilenumber">
                                                        <input type="text" name="friends_code" id="friends_code" placeholder={t("Refer Code")} defaultValue={profile.friends_code} onChange={handleChange} required />
                                                        <i>
                                                            <AiOutlineUsergroupAdd />
                                                        </i>
                                                    </label>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            <button className="btn btn-primary text-capitalize" type="submit" value="submit" name="submit" id="mc-embedded-subscribe">
                                                {t("Submit")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewUser;
