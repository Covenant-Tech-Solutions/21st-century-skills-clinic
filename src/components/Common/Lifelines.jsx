"use client"
import React, { useState } from 'react'
import { FaRegClock } from 'react-icons/fa'
import { RiArrowRightDoubleLine } from 'react-icons/ri'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { UserCoinScoreApi } from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { TbUsers } from "react-icons/tb";


const Lifelines = ({
  handleFiftFifty,
  handleAudiencePoll,
  handleResetTime,
  handleSkipQuestion,
  t,
  showFiftyFifty,
  audiencepoll,
  currentquestions,
  totalQuestions
}) => {

  const [status, setStatus] = useState({
    fifty_fifty: false,
    audience_poll: false,
    reset_time: false,
    skip_question: false
  })


  // store data get
  const userData = useSelector(state => state.User)

  const systemconfig = useSelector(sysConfigdata);

  const lifeline_deduct_coin = systemconfig?.quiz_zone_lifeline_deduct_coin

  const lifeLineClick = type => {
    let update
    if (type === 'Fifty Fifty') {
      if (currentquestions.audeincePoll) {
        toast.error(t('cantUseFiftyFiftyAfterPoll'));
        return false;
      }
      if (!status.fifty_fifty) {
        if (checkIfUserhasCoins() && handleFiftFifty()) {
          if (deductCoins()) {
            update = { ...status, fifty_fifty: true }
            setStatus(update)
          }
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    } else if (type === 'Audience Poll') {
      if (currentquestions.fiftyUsed) {
        toast.error(t('cantUsePollAfterFiftyFifty'))
        return
      }
      if (!status.audience_poll) {
        if (deductCoins()) {
          update = { ...status, audience_poll: true }
          handleAudiencePoll()
          setStatus(update)
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    } else if (type === 'Reset Time') {
      if (!status.reset_time) {
        if (deductCoins()) {
          update = { ...status, reset_time: true }
          handleResetTime()
          setStatus(update)
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    } else if (type === 'Skip Question') {
      if (!status.skip_question) {
        if (deductCoins()) {
          update = { ...status, skip_question: true }
          handleSkipQuestion()
          setStatus(update)
        }
      } else {
        toast.error(t('lifeline_already_used'))
      }
    }
  }

  const deductCoins = () => {
    if (checkIfUserhasCoins()) {
      let coins = '-' + (Number(lifeline_deduct_coin) ? Number(lifeline_deduct_coin) : 0)
      UserCoinScoreApi(
        coins,
        null,
        null,
        'Used Hint Lifeline',
        '1',
        response => {
          updateUserDataInfo(response.data)
        },
        error => {
          console.log(error)
        }
      )
      return true
    } else {
      return false
    }
  }

  const checkIfUserhasCoins = () => {
    if (userData?.data?.coins < (Number(lifeline_deduct_coin) ? Number(lifeline_deduct_coin) : 0)) {
      toast.error(t("You Don't have enough coins"))
      return false
    } else {
      return true
    }
  }
  return (
    <div className='dashoptions row'>
      {showFiftyFifty ? (
        <div
          className='fifty__fifty col-12 col-sm-12 col-md-2 custom-life-btn'
        >
          <button
            className={`btn btn-primary fiftybtn py-2 ${status.fifty_fifty && 'bg-secondary'}`}
            onClick={() => lifeLineClick('Fifty Fifty')}
          >
            50/50
          </button>
        </div>
      ) : (
        ''
      )}

      {audiencepoll ? (
        <div
          className='audience__poll col-12 col-sm-12 col-md-2 custom-life-btn'
        >
          <button
            className={`btn btn-primary p-2 ${status.audience_poll && 'bg-secondary'}`}
            onClick={() => lifeLineClick('Audience Poll')}
          >

            <span className='lifelineIcon'> <TbUsers /></span>
          </button>
        </div>
      ) : (
        ''
      )}
      <div
        className='resettimer col-12 col-sm-12 col-md-2 custom-life-btn'>
        <button
          className={`btn btn-primary p-2 ${status.reset_time && 'bg-secondary'}`}
          onClick={() => lifeLineClick('Reset Time')}
        >

          <span className='lifelineIcon'><FaRegClock /></span>
        </button>
      </div>
      {totalQuestions > 1 && (
        <div className='skip__questions col-12 col-sm-12 col-md-2 custom-life-btn'>
          <button
            className={`btn btn-primary p-2 ${status.skip_question && 'bg-secondary'}`}
            onClick={() => lifeLineClick('Skip Question')}
          >
            <span className='lifelineIcon'> <RiArrowRightDoubleLine size={25} /></span>
          </button>
        </div>
      )}
    </div>
  )
}
Lifelines.propTypes = {
  handleFiftFifty: PropTypes.func.isRequired,
  handleAudiencePoll: PropTypes.func.isRequired,
  handleResetTime: PropTypes.func.isRequired,
  handleSkipQuestion: PropTypes.func.isRequired
}
export default withTranslation()(Lifelines)
