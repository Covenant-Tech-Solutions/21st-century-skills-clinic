import cryptoJs from "crypto-js";
import { store } from "../store/store";
import { getbookmarkApi } from "../store/actions/campaign";
import { Loadbookmarkdata } from "../store/reducers/bookmarkSlice";
import { useEffect, useRef } from "react";
import DOMPurify from 'dompurify';
import toast from "react-hot-toast";
// -----------------global functions-----------------------------

// getSiblings, getClosest, slideUp, slideDown, slideToggle :- mobile navigation and navbar for header
export const getSiblings = function (elem) {
    let siblings = [];
    let sibling = elem.parentNode.firstChild;
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

export const getClosest = function (elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;
};

export const slideUp = (element, duration = 500) => {
    return new Promise(function (resolve) {
        element.style.height = element.offsetHeight + "px";
        element.style.transitionProperty = `height, margin, padding`;
        element.style.transitionDuration = duration + "ms";
        // element.offsetHeight;
        element.style.overflow = "hidden";
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        window.setTimeout(function () {
            element.style.display = "none";
            element.style.removeProperty("height");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("overflow");
            element.style.removeProperty("transition-duration");
            element.style.removeProperty("transition-property");
            resolve(false);
        }, duration);
    });
}

export const slideDown = (element, duration = 500) => {
    return new Promise(function () {
        element.style.removeProperty("display");
        let display = window.getComputedStyle(element).display;

        if (display === "none") display = "block";

        element.style.display = display;
        let height = element.offsetHeight;
        element.style.overflow = "hidden";
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        // element.offsetHeight;
        element.style.transitionProperty = `height, margin, padding`;
        element.style.transitionDuration = duration + "ms";
        element.style.height = height + "px";
        element.style.removeProperty("padding-top");
        element.style.removeProperty("padding-bottom");
        element.style.removeProperty("margin-top");
        element.style.removeProperty("margin-bottom");
        window.setTimeout(function () {
            element.style.removeProperty("height");
            element.style.removeProperty("overflow");
            element.style.removeProperty("transition-duration");
            element.style.removeProperty("transition-property");
        }, duration);
    });
}

export const slideToggle = (element, duration = 500) => {
    if (window.getComputedStyle(element).display === "none") {
        return slideDown(element, duration);
    } else {
        return slideUp(element, duration);
    }
}


// is login user check
export const isLogin = () => {
    let user = store.getState().User
    if (user) {
        try {
            // user = JSON.parse(user);
            if (user.data.api_token) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
    return false;
}

// decrypt answer wont show inspect element
export const decryptAnswer = (encrypted_json_string, key) => {
    let obj_json = encrypted_json_string;
    let encrypted = obj_json.ciphertext;
    let iv = cryptoJs.enc.Hex.parse(obj_json.iv);
    key += "0000";
    key = cryptoJs.enc.Utf8.parse(key);
    try {
        let decrypted = cryptoJs.AES.decrypt(encrypted, key, {
            iv: iv,
        }).toString(cryptoJs.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.log(error);
    }
}

//calculate coins
export const calculateCoins = async (score, totalQuestions) => {

    //This method will determine how much coins will user get after
    //completing the quiz
    //if percentage is more than maxCoinsWinningPercentage then user will earn maxWinningCoins
    //
    //if percentage is less than maxCoinsWinningPercentage
    //coin value will deduct from maxWinning coins
    //earned coins = (maxWinningCoins - ((maxCoinsWinningPercentage - percentage)/ 10))
    //For example: if percentage is 70 then user will
    //earn 3 coins if maxWinningCoins is 4
    const systemconfig = store.getState().Settings.systemConfig

    let percentage = (score * 100) / totalQuestions; // 400/5 = 80
    let earnedCoins = 0;
    if (percentage >= Number(systemconfig.minimum_coins_winning_percentage)) {
        //80 >= 70
        // console.log("earnedCoins",earnedCoins)
        earnedCoins = systemconfig.maximum_winning_coins; // 4
        // console.log("systemconfig.maximum_winning_coins",systemconfig.maximum_winning_coins)
    } else {
        // console.log("earnedCoins",earnedCoins)
        //80 < 70
        earnedCoins = Math.round(systemconfig.maximum_winning_coins - (Number(systemconfig.minimum_coins_winning_percentage) - percentage) / 10); // 4 - (70 - 60) / 10 => 34/10 => 3
        // console.log("earnedCoins",earnedCoins)
        // console.log("earnedCoins",systemconfig.maximum_winning_coins,Number(systemconfig.minimum_coins_winning_percentage),percentage)
    }
    if (earnedCoins < 0) {
        earnedCoins = 0;
    }
    // console.log("earnedCoins",earnedCoins)

    return earnedCoins;
}

//calculate score
export const calculateScore = async (score, totalQuestions, correctTypeQuizScore, incorrectTypeQuizScore) => {
    const correctAnswer = score;
    // console.log("correctAnswer",correctAnswer)

    const incorrectAnswer = totalQuestions - correctAnswer;
    // console.log("incorrectAnswer",totalQuestions,incorrectAnswer)

    const correctAnswerScore = correctAnswer * Number(correctTypeQuizScore)
    // console.log("correctAnswerScore",correctAnswerScore, Number(correctTypeQuizScore),typeof(Number(correctTypeQuizScore)))

    const incorrectAnswerScore = incorrectAnswer * Number(incorrectTypeQuizScore)
    // console.log("incorrectAnswerScore",incorrectAnswerScore, Number(incorrectTypeQuizScore),typeof(Number(incorrectTypeQuizScore)))

    const finalScore = correctAnswerScore - incorrectAnswerScore;
    // console.log("finalScore",finalScore)

    return finalScore;
}

// load bookmark data
export const getAndUpdateBookmarkData = (type) => {
    getbookmarkApi(type, (response) => {
        Loadbookmarkdata(response.data)
    }, (error) => {
        // console.log(error);
    })
}

// get bookmark data
export const getBookmarkData = () => {
    let alldata = store.getState().Bookmark.data;
    if (alldata) {
        return alldata;
    }
    return false;
}

// delete bookmarkdata
export const deleteBookmarkData = (bookmark_id) => {
    let alldata = store.getState().Bookmark.data;
    if (alldata) {
        alldata = Object.values(alldata).filter((bookmark) => {
            return bookmark.id !== bookmark_id;
        });
        Loadbookmarkdata(alldata)
    }
    return false;
}

// delete bookmark data by questionsid
export const deleteBookmarkByQuestionID = (question_id) => {
    let alldata = store.getState().Bookmark.data;
    if (alldata) {
        alldata = Object.values(alldata).filter((bookmark) => {
            return bookmark.question_id !== question_id;
        });
        Loadbookmarkdata(alldata)
        return alldata;
    }
    return false;
}

//scrollhandler in mobile device
export const scrollhandler = (top) => {
    const scrollTohowItWorks = () =>
        window.scroll({
            top: top,
            left: 0,
            behavior: "smooth",
        });
    if (window.innerWidth <= 600) {
        scrollTohowItWorks();
    }
    return false;
}

// server image error
export const imgError = (e) => {
    e.target.src = "/images/user.svg"
}

export const playAudio = (audioSrc) => {
    const audio = new Audio(audioSrc);
    audio.play();
};

// audio quiz 
export const audioPlay = (selected_option, currentQuestion_Answer) => {
    const systemconfig = store && store.getState().Settings.systemConfig
    const userData = store && store.getState().User
    const decryptedAnswer = decryptAnswer(currentQuestion_Answer, userData?.data?.firebase_id)

    if (systemconfig && systemconfig.answer_mode === '1') {
        if (decryptedAnswer === selected_option) {
            playAudio('../../../../assets/audio/right.mp3')
        } else {
            playAudio('../../../../assets/audio/wrong.mp3')
        }
    }

    if (systemconfig && systemconfig.answer_mode === '2') {
        playAudio('../../../../assets/audio/click.mp3')
    }

    if (systemconfig && systemconfig.answer_mode === '3') {
        if (decryptedAnswer === selected_option) {
            playAudio('../../../../assets/audio/right.mp3')
        } else {
            playAudio('../../../../assets/audio/wrong.mp3')
        }
    }
}

export const audioPlayGuessthework = (selected_option, currentQuestion_Answer) => {
    const systemconfig = store && store.getState().Settings.systemConfig
    const userData = store && store.getState().User
    const decryptedAnswer = decryptAnswer(currentQuestion_Answer, userData?.data?.firebase_id).toUpperCase().replaceAll(/\s/g, '')

    if (systemconfig && systemconfig.answer_mode === '1') {
        if (decryptedAnswer === selected_option) {
            playAudio('../../../../assets/audio/right.mp3')
        } else {
            playAudio('../../../../assets/audio/wrong.mp3')
        }
    }

    if (systemconfig && systemconfig.answer_mode === '2') {
        playAudio('../../../../assets/audio/click.mp3')
    }

    if (systemconfig && systemconfig.answer_mode === '3') {
        if (decryptedAnswer === selected_option) {
            playAudio('../../../../assets/audio/right.mp3')
        } else {
            playAudio('../../../../assets/audio/wrong.mp3')
        }
    }
}


// option answer status check
export const showAnswerStatusClass = (option, currentQuestion_is_Answered, currentQuestion_Answer, currentQuestion_selected_answer) => {
    // this is old logic 
    // if (questions[currentQuestion].isAnswered) {
    //   if (systemconfig && systemconfig.answer_mode === '1') {
    //     let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
    //     if (decryptedAnswer === option) {
    //       return 'bg-success'
    //     } else if (questions[currentQuestion].selected_answer === option) {
    //       return 'bg-danger'
    //     }
    //   } else if (questions[currentQuestion].selected_answer === option) {
    //     return 'bg-dark'
    //   } else {
    //     return false
    //   }
    // } else {
    //   return false
    // 

    const systemconfig = store && store.getState().Settings.systemConfig
    const userData = store && store.getState().User
    const decryptedAnswer = decryptAnswer(currentQuestion_Answer, userData?.data?.firebase_id)

    if (currentQuestion_is_Answered) {

        // show correctness answer
        if (systemconfig && systemconfig.answer_mode === '1') {
            if (currentQuestion_selected_answer === option) {
                if (decryptedAnswer === option) {
                    return 'bg-success'
                } else {
                    return 'bg-danger'
                }
            } else {
                return false
            }
        }

        // show incorrect answer
        if (systemconfig && systemconfig.answer_mode === '2') {
            if (currentQuestion_selected_answer === option) {
                return 'bg-theme'
            } else {
                return false
            }
        }

        // // show correct answer and incorrect answer
        if (systemconfig && systemconfig.answer_mode === '3') {
            if (decryptedAnswer === option) {
                return 'bg-success'
            } else if (currentQuestion_selected_answer === option) {
                return 'bg-danger'
            }
        } else {
            return false
        }

    } else {
        return false
    }
}

// roomCode generater
export const roomCodeGenerator = (type) => {
    const systemconfig = store && store.getState().Settings.systemConfig;
    const numbers = "1234567890";
    const letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
    const number_with_letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";

    const getRandomCharacter = (characters) => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters.charAt(randomIndex);
    };

    const generateRoomCode = (characters) => {
        let roomCode = "";
        for (let i = 0; i < 6; i++) {
            roomCode += getRandomCharacter(characters);
        }
        return roomCode;
    };

    let characters;

    if (type === "onevsone") {
        if (systemconfig.battle_mode_one_code_char === "2") {
            characters = letters;
        } else if (systemconfig.battle_mode_one_code_char === "3") {
            characters = number_with_letters;
        } else {
            characters = numbers;
        }
    } else if (type === "groupbattle") {
        if (systemconfig.battle_mode_group_code_char === "2") {
            characters = letters;
        } else if (systemconfig.battle_mode_group_code_char === "3") {
            characters = number_with_letters;
        } else {
            characters = numbers;
        }
    } else {
        return false;
    }

    return generateRoomCode(characters);
};

export const truncate = (text, maxLength) => {
    // Check if text is undefined or null
    if (!text) {
        return ""; // or handle the case as per your requirement
    }

    // If the text length is less than or equal to maxLength, return the original text
    if (text.length <= maxLength) {
        return text;
    } else {
        // Otherwise, truncate the text to maxLength characters and append ellipsis
        return text.slice(0, maxLength) + "...";
    }
}

export const isValidSlug = (slug) => {
    return slug && slug.trim() !== '';
};

export const RenderHtmlContent = ({ htmlContent }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Sanitize HTML content
        const sanitizedHtml = DOMPurify && DOMPurify.sanitize(htmlContent);

        // Set the sanitized HTML content
        containerRef.current.innerHTML = sanitizedHtml;

        // Trigger MathJax typesetting
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, containerRef.current]);
    }, [htmlContent]);

    return <div ref={containerRef} />;
};

const ERROR_CODES = {
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Invalid password',
    'auth/email-already-in-use': 'Email already in use',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'User account has been disabled',
    'auth/too-many-requests': 'Too many requests, try again later',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/internal-error': 'Internal error occurred'
  };
  
  // Error handling function
export const handleFirebaseAuthError = (errorCode) => {
    // Check if the error code exists in the global ERROR_CODES object
    if (ERROR_CODES.hasOwnProperty(errorCode)) {
      // If the error code exists, log the corresponding error message
      toast.error(ERROR_CODES[errorCode]);
    //   console.error(ERROR_CODES[errorCode]);
    } else {
      // If the error code is not found, log a generic error message
      toast.error(`Unknown error occurred: ${errorCode}`);
    //   console.error(`Unknown error occurred: ${errorCode}`);
    }
  
    // Optionally, you can add additional logic here to handle the error
    // For example, display an error message to the user, redirect to an error page, etc.
  }


// message list of battle
export const messageList = () => {
    const messageListData = [
        'Hello..!!',
        'How are you..?',
        'Fine..!!',
        'Have a nice day..',
        'Well played',
        'What a performance..!!',
        'Thanks..',
        'Welcome..',
        'Merry Christmas',
        'Happy new year',
        'Happy Diwali',
        'Good night',
        'Hurry Up',
        'Dudeeee',
    ];
    return messageListData;
}