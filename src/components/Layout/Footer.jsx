"use client"
import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sysConfigdata } from "src/store/reducers/settingsSlice";
import { websettingsData } from "src/store/reducers/webSettings";
import Link from "next/link";
import Logo from "../Logo/Logo";
import { t } from "i18next";
import appstoreimg from "src/assets/images/appstore.svg"
import palystoreimg from "src/assets/images/playstore.svg"
const Footer = () => {

    const systemconfig = useSelector(sysConfigdata)

    const appLink = systemconfig?.app_link

    const appiosLink = systemconfig?.ios_app_link

    const websettingsdata = useSelector(websettingsData);

    const SocialMedia = websettingsdata && websettingsdata.social_media;

    // footer logo
    const footer_logo = websettingsdata && websettingsdata.footer_logo;

    // company text
    const company_text = websettingsdata && websettingsdata.company_text;

    // address
    const address_text = websettingsdata && websettingsdata.address_text;

    // email
    const email_footer = websettingsdata && websettingsdata.email_footer;

    // phone number
    const phone_number_footer = websettingsdata && websettingsdata.phone_number_footer;

    // web link
    const web_link_footer = websettingsdata && websettingsdata.web_link_footer;

    // company name
    const company_name_footer = websettingsdata && websettingsdata.company_name_footer;

    return (
        <Fragment>
            <div className="footer_wrapper">
                {/* <div className="bottom_circle">
                    <img src={bottomcircle.src} alt="circle" />
                </div> */}
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-lg-3  col-12 footer_left">
                            {/* <div className="footer_logo">
                                <Logo image={footer_logo} />
                            </div> */}
                            {/* <div className="footer_left_text">
                                <p>{company_text}</p>
                            </div> */}
                            <div className="align-item-center flex-wrap">
                                {appLink ?
                                    <div className="playstore_img me-1">
                                        <Link href="" onClick={() => window.open(appLink, '_blank')}>
                                            <img src={palystoreimg.src} alt="playstore" />
                                        </Link>
                                    </div>
                                    : null}
                                {appiosLink ?
                                    // <div className="playstore_img iosimg">
                                    //     <Link href="" onClick={() => window.open(appiosLink, '_blank')}>
                                    //         <img src={appstoreimg.src} alt="ios" />
                                    //     </Link>
                                    // </div>
                                    null
                                    : null}
                            </div>
                        </div>
                        {/* <div className="col-md-6 col-lg-3  col-12 footer_left_second">
                            <div className="footer_title">
                                <h4 className="footer_heading">{t("Policy")}</h4>
                            </div>
                            <ul className="footer_policy">
                                <li className="footer_list">
                                    <Link href="/privacy-policy">{t("Privacy Policy")}</Link>
                                </li>
                                <li className="footer_list">
                                    <Link href="/terms-conditions">{t("Terms and Conditions")}</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6 col-lg-3  col-12 footer_right">
                            <div className="footer_title">
                                <h4 className="footer_heading">{t("Company")}</h4>
                            </div>
                            <ul className="footer_policy">
                                <li className="footer_list">
                                    <Link href="/about-us">{t("about-us")}</Link>
                                </li>
                                <li className="footer_list">
                                    <Link href="/contact-us">{t("Contact Us")}</Link>
                                </li>
                            </ul>
                        </div> */}
                        <div className="col-md-6 col-lg-3 col-12 footer_right">
                            <div className="footer_title">
                                <h4 className="footer_heading">{t("Connect With Us")}</h4>
                            </div>
                            {/* <ul className="footer_policy">
                                {address_text ?
                                    <li className="footer_list_address">{address_text}</li>
                                    : null}
                                {email_footer ?
                                    <li className="footer_list_email">
                                        <Link href={`mailto:${email_footer}`}>{email_footer}</Link>
                                    </li>
                                    : null}
                                {phone_number_footer ?
                                    <li className="footer_list_number">
                                        <Link href={`tel:${phone_number_footer}`}>{phone_number_footer}</Link>
                                    </li>
                                    : null}
                            </ul> */}
                            <ul className="footer_social">
                                {SocialMedia && SocialMedia.map((data) => (
                                    <li className="footer_social_list" key={data.id}>
                                        <Link href={`${data.link}`} target="_blank">
                                            <img src={data.icon} alt="social-media" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <hr />

                    {/* <div className="footer_copyright text-center">
                        <p>
                            {t("Copyright")} © {new Date().getFullYear()}
                            {" "}{t("Made By")}{" "}
                            <Link href={`${web_link_footer}`} target="_blank">
                                {company_name_footer}
                            </Link>
                        </p>
                    </div> */}
                </div>
            </div>
        </Fragment>
    );
};

export default withTranslation()(Footer);
