import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import 'react-circular-progressbar/dist/styles.css';
import { useSelector } from 'react-redux';
import { groupbattledata } from 'src/store/reducers/groupbattleSlice';
import { imgError } from 'src/utils';
import { UserCoinScoreApi, getusercoinsApi } from 'src/store/actions/campaign';
import { updateUserDataInfo } from 'src/store/reducers/userSlice';
import { useRouter } from 'next/router';
import rightTickIcon from '../../../assets/images/check-circle-score-screen.svg';
import crossIcon from '../../../assets/images/x-circle-score-screen.svg';

const GroupBattleScore = ({ t, totalQuestions }) => {
  const navigate = useRouter();

  // store data get
  const userData = useSelector(state => state.User);
  const groupBattledata = useSelector(groupbattledata);

  const goToHome = () => {
    navigate.push('/');
  };

  // fetch data from local storage
  let user1correctanswer = groupBattledata.user1CorrectAnswer;
  let user2correctanswer = groupBattledata.user2CorrectAnswer;
  let user3correctanswer = groupBattledata.user3CorrectAnswer;
  let user4correctanswer = groupBattledata.user4CorrectAnswer;

  let user1name = groupBattledata.user1name;
  let user2name = groupBattledata.user2name;
  let user3name = groupBattledata.user3name;
  let user4name = groupBattledata.user4name;

  let user1uid = groupBattledata.user1uid;
  let user2uid = groupBattledata.user2uid;
  let user3uid = groupBattledata.user3uid;
  let user4uid = groupBattledata.user4uid;

  let user1image = groupBattledata.user1image;
  let user2image = groupBattledata.user2image;
  let user3image = groupBattledata.user3image;
  let user4image = groupBattledata.user4image;

  let entryFee = groupBattledata.entryFee;

  // user data
  const alluseranswer = [user1correctanswer, user2correctanswer, user3correctanswer, user4correctanswer];

  const alluid = [user1uid, user2uid, user3uid, user4uid];


  // find max number
  const max = Math.max(...alluseranswer);

  let maxIndices = [];

  for (let i = 0; i < alluseranswer?.length; i++) {
    if (alluseranswer[i] === max) {
      maxIndices.push(i);
    }
  }

  // Find the user IDs of all users with the max number of correct answers
  const usersWithMax = [];
  for (const index of maxIndices) {
    usersWithMax.push(alluid[index]);
  }

  // max user index
  const index = alluseranswer.indexOf(max);

  let winAmount = entryFee * (groupBattledata.totalusers / maxIndices?.length);

  useEffect(() => {
    if (usersWithMax.includes(userData?.data?.id) && entryFee > 0) {
      // Winner logic
      const status = 0;
      UserCoinScoreApi(
        Math.floor(winAmount),
        null,
        null,
        t('Won Battle'),
        status,
        response => {
          getusercoinsApi(
            responseData => {
              updateUserDataInfo(responseData.data);
            },
            error => {
              console.log(error);
            }
          );
        },
        error => {
          console.log(error);
        }
      );
    }
  }, []);

  // all data store in array object
  let allData = [
    {
      uid: user1uid,
      image: user1image,
      name: user1name,
      correctAnswer: user1correctanswer,
    },
    {
      uid: user2uid,
      image: user2image,
      name: user2name,
      correctAnswer: user2correctanswer,
    },
    {
      uid: user3uid,
      image: user3image,
      name: user3name,
      correctAnswer: user3correctanswer,
    },
    {
      uid: user4uid,
      image: user4image,
      name: user4name,
      correctAnswer: user4correctanswer,
    },
  ];

  // // find the index of the winner
  // const winnerIndex = allData.findIndex(elem => elem.correctAnswer === max);

  // find the index of the winner with a non-empty name
  const winnerIndex = allData.findIndex(elem => elem.correctAnswer === max && elem.name !== '');

  // exclude the winner from allData
  // const remainingData = [...allData.slice(0, winnerIndex), ...allData.slice(winnerIndex + 1)];



  // // exclude the winner and users with empty names from allData
  const remainingData = allData.filter(elem => elem.name !== '' && elem.correctAnswer !== max);


  // sort remainingData based on correctAnswer in descending order
  remainingData.sort((a, b) => b.correctAnswer - a.correctAnswer);

  return (
    <React.Fragment>
      <div className="my-4 row d-flex align-items-center">
        {(() => {
          if (maxIndices?.length === 1) {
            if (userData?.data?.id === alluid[index]) {
              return (
                <div className="result_data">
                  <p>{t('Congratulations')}</p>
                  <h3>{t('Winner')}</h3>
                </div>
              );
            } else {
              return (
                <div className="result_data">
                  <p>{t('Good luck next time')}</p>
                  <h3>{t('You Lose')}</h3>
                </div>
              );
            }
          } else if (maxIndices?.length >= 2) {
            return (
              <div className="result_data">
                <h3>{t('Tie')}</h3>
              </div>
            );
          }
        })()}

        <div className="user_data group_battle tieMoreThanTwoWrapper">
          {(() => {
            if (maxIndices?.length === 1) {
              return (
                <>
                  <div className="rank1">
                    {/* winner */}
                    <div className="login_winner">
                      <img
                        src={allData[winnerIndex].image}
                        alt="user"
                        className="showscore-userprofile"
                        onError={e => imgError(e)}
                      />
                      <p>{allData[winnerIndex].name}</p>
                      <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                        <span className="rightAns">
                          <img src={rightTickIcon.src} alt="" />
                          {allData[winnerIndex].correctAnswer}
                        </span>
                        <span className="wrongAns">
                          <img src={crossIcon.src} alt="" />
                          {totalQuestions - allData[winnerIndex].correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="otherPlayersRanksWrapper">
                    {/* loser */}
                    <div className="opponet_loser group_battle_loser">
                      {remainingData.map((elem, i) =>
                        elem.uid !== '' ? (
                          <div className="group_data" key={elem.uid}>
                            <div className="d-flex align-items-center justify-content-start otherplayesProfileWrapper">
                              <img src={elem.image} alt="user" className="showscore-userprofile" onError={imgError} />
                              <p>{elem.name}</p>
                            </div>
                            <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                              <span className="rightAns">
                                <img src={rightTickIcon.src} alt="" />
                                {elem.correctAnswer}
                              </span>
                              <span className="wrongAns">
                                <img src={crossIcon.src} alt="" />
                                {totalQuestions - elem.correctAnswer}
                              </span>
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </>
              );
            } else if (maxIndices?.length > 1) {
              const filteredData = allData.filter(elem => elem.name !== '');

              // Sort filteredData based on correctAnswer in descending order
              const sortedData = filteredData.sort((a, b) => b.correctAnswer - a.correctAnswer);

              // Tie between more than two users
              return (
                <>
                  {sortedData.map((elem, i) => (
                    <div className="group_data" key={elem.uid}>
                      <div className="d-flex align-items-center justify-content-start otherplayesProfileWrapper">
                        <img src={elem.image} alt="user" className="showscore-userprofile" onError={imgError} />
                        <p>{elem.name}</p>
                      </div>
                      <div className="rightWrongAnsDiv scoreRightWrongAnsDiv">
                        <span className="rightAns">
                          <img src={rightTickIcon.src} alt="" />
                          {elem.correctAnswer}
                        </span>
                        <span className="wrongAns">
                          <img src={crossIcon.src} alt="" />
                          {totalQuestions - elem.correctAnswer}
                        </span>
                      </div>
                    </div>
                  ))}
                </>

              );
            }
          })()}
        </div>
      </div>

      <div className="dashoptions row text-center">
        <div className="skip__questions col-12 col-sm-6 col-md-2 custom-dash">
          <button className="btn btn-primary" onClick={goToHome}>
            {t('Home')}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

GroupBattleScore.propTypes = {
  coins: PropTypes.number.isRequired,
};

export default withTranslation()(GroupBattleScore);
