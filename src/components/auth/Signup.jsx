"use client"
import React, { useRef, useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FaMobileAlt, FaEnvelope, FaLock } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { register } from 'src/store/reducers/userSlice'
import FirebaseData from 'src/utils/Firebase'
import 'swiper/css/effect-fade'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsEyeSlash, BsEye } from 'react-icons/bs'
import NewUser from 'src/components/Common/NewUser'
import dynamic from 'next/dynamic'
import { t } from 'i18next'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const SignUp = () => {
  const [loading, setLoading] = useState(false)
  const [newUserScreen, setNewUserScreen] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    email: '',
    profile: '',
    all_time_rank: '',
    all_time_score: '',
    coins: '',
    friends_code: ''
  })

  const [type, setType] = useState("password");

  const [Icon, setIcon] = useState(<BsEyeSlash />);

  const emailRef = useRef()

  const passwordRef = useRef()

  const router = useRouter()

  const { auth, googleProvider } = FirebaseData()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      localStorage.setItem('ref', ref);
    } else {
      localStorage.setItem('ref', 'qPyy2');
    }
  }, []);

  //signup
  const signup = async (email, password) => {
    let promise = await new Promise(function (resolve, reject) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          userCredential.user.sendEmailVerification()
          toast.success(t('Email sent! Please check Email'))
          resolve(userCredential)
          auth.signOut()
        })
        .catch(error => reject(error))
    })
    return promise
  }

  //email signin
  const handleSignup = e => {
    e.preventDefault()
    setLoading(true)
    const email = emailRef.current.value
    const password = passwordRef.current.value
    signup(email, password)
      .then(response => {
        setLoading(false)
        router.push('/')
      })
      .catch(err => {
        toast.error(err.message)
        setLoading(false)
      })
  }

  //google sign in
  const signInWithGoogle = async (e) => {
    e.preventDefault();

    try {
      const response = await auth.signInWithPopup(googleProvider);
      const { user, additionalUserInfo } = response;

      setProfile(user);
      setProfile((values) => ({ ...values, auth_type: 'gmail' }));

      if (additionalUserInfo.isNewUser) {
        // If new User, show the Update Profile Screen
        setNewUserScreen(true);
      } else {
        const { uid: firebase_id, email, phoneNumber: phone, photoURL: image_url } = user;
        const name = null;
        const fcm_id = null;
        const friends_code = null;

        register(
          firebase_id,
          'gmail',
          name,
          email,
          image_url,
          phone,
          fcm_id,
          friends_code,
          () => {
            setLoading(false);
            toast.success(t('Successfully Login'));
            router.push('/all-games');
          },
          () => {
            toast.error(t('Please Try again'));
          }
        );
      }

      setLoading(false);
    } catch (error) {
      handleFirebaseAuthError(error.code)
      setLoading(false);
    }
  };

  // show password
  const handletoggle = () => {
    if (type === "password") {
      setIcon(<BsEye />);
      setType("text");
    } else {
      setIcon(<BsEyeSlash />);
      setType("password");
    }
  };

  return (
    <Layout>
      <div className='signup wrapper loginform mt-1'>
        {!newUserScreen ? (
          <div className='custom-container glassmorcontain'>
            <div className='row morphisam'>
              <div className='col-12 border-line position-relative'>
                <div className='inner__login__form outerline'>
                  <h3 className='mb-4 text-capitalize '>{t('Sign Up')}</h3>

                  <div className='social__icons'>
                    <ul>
                      <li>
                        <button className='social__icons_btn' onClick={signInWithGoogle}>
                          <FcGoogle /> {t("Login with Google")}
                        </button>
                      </li>
                      <li>
                        <button
                          className='social__icons_btn'
                          onClick={() => {
                            router.push('/auth/otp-verify')
                          }}
                        >
                          <FaMobileAlt /> {t("Login with Phone")}
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className='continue'>
                    <span className='line'></span>
                    <p>{t("Or continue with Email")}</p>
                    <span className='line'></span>
                  </div>
                  <Form onSubmit={e => handleSignup(e)}>
                    <Form.Group className='mb-3 position-relative d-inline-block w-100' controlId='formBasicEmail'>
                      <Form.Control
                        type='email'
                        placeholder={t('Enter Your Email')}
                        className='inputelem'
                        required={true}
                        ref={emailRef}
                      />
                      <span className='emailicon'>
                        <FaEnvelope />
                      </span>
                    </Form.Group>
                    <Form.Group className='mb-3 position-relative d-inline-block w-100' controlId='formBasicPassword'>
                      <Form.Control
                        type={type}
                        placeholder={t('Enter Your Password')}
                        className='inputelem'
                        required={true}
                        ref={passwordRef}
                      />
                      <span className='emailicon2'>
                        <FaLock />
                      </span>
                      <span onClick={handletoggle} className="password_icon">
                        {Icon}
                      </span>
                    </Form.Group>
                    <div className='sign__up'>
                      <small className='text-center'>
                        <input type="checkbox" className='checkbox' name="agree" id="agree" required />
                        {t('user agreement message')}&nbsp;
                        <u>
                          <Link className='conditions' href='/terms-conditions'>
                            {t('Terms and Conditions')}
                          </Link>
                        </u>
                        &nbsp;&&nbsp;
                        <u>
                          <Link className='conditions' href='/privacy-policy'>
                            {t('Privacy Policy')}
                          </Link>
                        </u>
                      </small>
                    </div>
                    <Button variant='primary w-100 my-3' className='submit_login' type='submit' disabled={loading}>
                      {loading ? t('Please Wait') : t('Create Account')}
                    </Button>

                  </Form>
                  <p className='text-center'>
                    {t('Already have an account')}
                    <span>
                      <Link href={'/auth/login'} replace className='text-dark auth-signup'>
                        &nbsp;{t('Login')}
                      </Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NewUser profile={profile} setProfile={setProfile} />
        )}
      </div>
    </Layout>
  )
}
export default withTranslation()(SignUp)
