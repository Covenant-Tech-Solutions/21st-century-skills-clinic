"use client"
// ShareMenu.js
import React from 'react';
import { Modal } from 'antd';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    XIcon,
    WhatsappShareButton,
    WhatsappIcon,
} from 'react-share';
import { t } from 'i18next';

const ShareMenu = ({ currentUrl, shouldGenerateRoomCode, appName,  showModal, hideModal, entryFee, categoryName }) => {
  
    const shareButtons = (
        <>
            <FacebookShareButton
                url={currentUrl}
                title={`Dive into the ultimate quiz battle showdown on Brain Bank, Join the squad using code: ${shouldGenerateRoomCode} Category : ${categoryName}, Just ${entryFee} Coins to play—let's crush it!`}
                hashtag={appName}
            >
                <FacebookIcon size={30} round /> {''} {t('Facebook')}
            </FacebookShareButton>
            <TwitterShareButton
                url={currentUrl}
                title={`Dive into the ultimate quiz battle showdown on Brain Bank, Join the squad using code: ${shouldGenerateRoomCode} Category : ${categoryName}, Just ${entryFee} Coins to play—let's crush it!`}
            >
                <XIcon size={30} round /> {''} {t('Twitter')}
            </TwitterShareButton>
            <WhatsappShareButton
                url={currentUrl}
                title={`Dive into the ultimate quiz battle showdown on Brain Bank, Join the squad using code: ${shouldGenerateRoomCode} Category : ${categoryName}, Just ${entryFee} Coins to play—let's crush it!`}
                hashtag={appName}
            >
                <WhatsappIcon size={30} round /> {''} {t('Whatsapp')}
            </WhatsappShareButton>
        </>
    );

    return (
        <>

            <Modal
                size="small"
                centered
                title={t("share-room-code")}
                visible={showModal}
                onOk={hideModal}
                onCancel={hideModal}
                footer={null}
                width="300px"
            >
                <div id="share-buttons-container" className='d-flex gap-5 align-center justify-center'>
                    {shareButtons}
                </div>
            </Modal>
        </>
    );
};

export default ShareMenu;
