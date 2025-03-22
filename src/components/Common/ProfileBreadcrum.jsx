"use client"
import React from 'react'

const ProfileBreadcrum = ({ title }) => {
    return (
        <div className='profileBreadcrumb'>
            <h1 className='text-center mb-4' style={{ color: '#090029', fontFamily: 'Lato', fontSize: '40px', fontWeight: '800' }}>{title}</h1>
        </div>
    )
}

export default ProfileBreadcrum
