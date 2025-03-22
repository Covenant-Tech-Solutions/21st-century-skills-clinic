"use client"
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";


const Logo = ({ image,setIsActive }) => {
    return (
        <div className="header-logo">
            <Link href="/" onClick={() => setIsActive(false)}>
                <img className="dark-logo" src={image} alt=" Logo" />
            </Link>
        </div>
    );
};

Logo.propTypes = {
    image: PropTypes.string,
};

export default Logo;
