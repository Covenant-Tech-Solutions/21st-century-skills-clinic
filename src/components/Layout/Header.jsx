"use client"
import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { websettingsData } from "src/store/reducers/webSettings";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import FirebaseData from "../../utils/Firebase";
import { logout, updateUserDataInfo } from "src/store/reducers/userSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getusercoinsApi } from "src/store/actions/campaign";
import { selectCurrentLanguage } from "src/store/reducers/languageSlice";
import { loadUserCoinApi } from "src/store/reducers/userCoinsSlice";
const Sidebar = dynamic(() => import('../NavBar/Sidebar'), { ssr: false })
const NavBar = dynamic(() => import('../NavBar/NavBar'), { ssr: false })
const Logo = dynamic(() => import('../Logo/Logo'), { ssr: false })
const MySwal = withReactContent(Swal)

const Header = () => {

    const [isActive, setIsActive] = useState(false);

    const router = useRouter()
    const [scroll, setScroll] = useState(0);
    const [headerTop, setHeaderTop] = useState(0);
    const [stickylogo, setStickyLogo] = useState(false);
    const selectcurrentLanguage = useSelector(selectCurrentLanguage)

    // logo
    const websettingsdata = useSelector(websettingsData);

    useEffect(() => {
        const header = document.querySelector(".header-section");
        setHeaderTop(header.offsetTop);
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScroll = () => {
        setScroll(window.scrollY)
        if (window.scrollY > 20) {
            setStickyLogo(true)
        } else {
            setStickyLogo(false)
        }
    };

    const userData = useSelector(state => state.User)
    // sticky logo
    const stickylogoimage = websettingsdata && websettingsdata.sticky_header_logo;

    // logo
    const logoimage = websettingsdata && websettingsdata.header_logo;

    const { auth } = FirebaseData()

    const TOKEN_EXPIRED = '129'

    const handleLogout = async () => {
        logout()
        await auth.signOut()
        await router.push('/auth/login')
    }

    useEffect(() => {
        if (userData && userData?.isLogin === true) {
            loadUserCoinApi({
                onSuccess: (responseData) => {
                    updateUserDataInfo(responseData?.data)
                },
                onError: (error) => {
                    console.log(error)
                }
            })
        }
    }, [userData])
    

    if (userData && userData?.isLogin === true) {
        // if same user login in other brower then its logout
        axios.interceptors.response.use(function (response) {
            // Check if response.data.message is defined
            if (response.data && response.data.message) {
                if (response.data.message === TOKEN_EXPIRED) {
                    MySwal.fire({
                        text: ("Your session has expired. Please log in again."),
                        icon: "warning",
                        showCancelButton: false,
                        customClass: {
                            confirmButton: 'Swal-confirm-buttons',
                            cancelButton: "Swal-cancel-buttons"
                        },
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            handleLogout();
                        }
                    });
                    return Promise.reject(new Error("Session expired"));
                }
            }
            // Handle other cases here if needed

            // Return the response for further processing
            return response;
        }, function (error) {
            // Handle request errors here if needed
            return Promise.reject(error);
        });
    }

    useEffect(() => {
    }, [selectcurrentLanguage])

    return (
        <Fragment>
            <div className={`header-section header-transparent sticky-header section ${scroll > headerTop ? "is-sticky" : ""}`}>
                <div className="header-inner">
                    <div className="container position-relative">
                        <div className="row justify-content-between align-items-center">
                            <div className="col-xl-2 col-auto order-0">
                                {stickylogo ?
                                    <Logo image={stickylogoimage} isActive={isActive} setIsActive={setIsActive} />
                                    :
                                    <Logo image={logoimage} isActive={isActive} setIsActive={setIsActive} />
                                }
                            </div>
                            <div className="col-auto col-xl d-flex align-items-center justify-content-xl-center justify-content-end order-2 order-xl-1">
                                <div className="menu-column-area d-none d-xl-block position-static">
                                    <NavBar />
                                </div>

                                <div className="header-mobile-menu-toggle d-xl-none ml-sm-2">
                                    <button
                                        onClick={() => setIsActive(true)}
                                        className="tp-menu-toggle toggle"
                                    >
                                        <i className="icon-top"></i>
                                        <i className="icon-middle"></i>
                                        <i className="icon-bottom"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* side bar start */}
            <Sidebar isActive={isActive} setIsActive={setIsActive} image={logoimage} />
            {/* side bar end */}
        </Fragment>
    );
};

export default Header;
