"use client"
import React, { useState, useRef } from 'react'
import { FaEnvelope, FaLock, FaMobileAlt } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Form, Button } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { checkUserExist, register } from 'src/store/reducers/userSlice'
import FirebaseData from 'src/utils/Firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BsEyeSlash, BsEye } from 'react-icons/bs'
import NewUser from 'src/components/Common/NewUser.jsx'
import { t } from 'i18next'
import { withTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import { handleFirebaseAuthError } from 'src/utils'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Login = () => {
    const [loading, setLoading] = useState(false)

    const [newUserScreen, setNewUserScreen] = useState(false)

    const [type, setType] = useState('password')

    const [Icon, setIcon] = useState(<BsEyeSlash />)

    const { auth, googleProvider } = FirebaseData()

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

    const emailRef = useRef()

    const passwordRef = useRef()

    const router = useRouter()

    // signin
    const signin = async (email, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    //email signin
    const handleSignin = async e => {
        e.preventDefault()
        setLoading(true)
        const email = emailRef.current.value
        const password = passwordRef.current.value
        try {
            let userdata = await signin(email, password)
            setProfile(userdata.user)
            setProfile(values => ({ ...values, auth_type: 'email' }))
            if (userdata.user.emailVerified) {
                checkUserExist(
                    userdata.user.uid,
                    response => {
                        let firebase_id = userdata.user.uid
                        let phone = null
                        let image_url = userdata.user.photoURL
                        let name = null
                        let fcm_id = null
                        let friends_code = null
                        register(
                            firebase_id,
                            'email',
                            name,
                            email,
                            image_url,
                            phone,
                            fcm_id,
                            friends_code,
                            success => {
                                setNewUserScreen(false)
                                toast.success(t('Successfully Login'))
                                if (response.message === '131') {
                                    //If new User then show the Update Profile Screen
                                    setNewUserScreen(true)
                                } else {
                                    router.push('/all-games')
                                }
                            },
                            error => {
                                toast.error(error)
                            }
                        )
                        setLoading(false)
                    },
                    error => {
                        console.log('onerror', error)
                    }
                )
            } else {
                toast.error(t('Please Verify your Email First'))
                setLoading(false)
            }
        } catch (error) {
            handleFirebaseAuthError(error.code)
            setLoading(false)
        }
    }

    //google sign in
    const signInWithGoogle = async (e) => {
        e.preventDefault();

        try {
            const response = await auth.signInWithPopup(googleProvider);
            const { user } = response;

            setProfile(user);
            setProfile((values) => ({
                ...values,
                auth_type: 'gmail',
            }));

            const {
                uid: firebase_id,
                email,
                phoneNumber: phone,
                photoURL: image_url,
            } = user;
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
                (success) => {
                    setLoading(false);
                    toast.success(t('Successfully Login'));

                    if (response.additionalUserInfo.isNewUser) {
                        setNewUserScreen(true); // If new User, show the Update Profile Screen
                    } else {
                        router.push('/all-games');
                    }
                },
                (error) => {
                    toast.error(t('Please Try again'));
                }
            );
        } catch (error) {
            handleFirebaseAuthError(error.code)
            setLoading(false);
        }
    };

    // show password
    const handletoggle = () => {
        if (type === 'password') {
            setIcon(<BsEye />)
            setType('text')
        } else {
            setIcon(<BsEyeSlash />)
            setType('password')
        }
    }
    return (
        <Layout>
            <div className='loginform wrapper mt-1'>
                {!newUserScreen ? (
                    <div className='custom-container glassmorcontain'>
                        <div className='row morphisam'>
                            <div className='col-12 border-line position-relative'>
                                <div className='inner__login__form outerline'>
                                    <h3 className='mb-2 text-capitalize '>{t('Login')}</h3>

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

                                    <Form onSubmit={e => handleSignin(e)}>
                                        <Form.Group className='mb-3 position-relative d-inline-block w-100' controlId='formBasicEmail'>
                                            <Form.Control
                                                type='email'
                                                placeholder={t('Enter Your Email')}
                                                className='inputelem'
                                                ref={emailRef}
                                                required={true}
                                            />
                                            <span className='emailicon'>
                                                <FaEnvelope />
                                            </span>
                                        </Form.Group>
                                        <Form.Group className='position-relative d-inline-block w-100' controlId='formBasicPassword'>
                                            <Form.Control
                                                type={type}
                                                placeholder={t('Enter Your Password')}
                                                className='inputelem'
                                                ref={passwordRef}
                                                required={true}
                                            />
                                            <span className='emailicon2'>
                                                <FaLock />
                                            </span>
                                            <span onClick={handletoggle} className='password_icon'>
                                                {Icon}
                                            </span>
                                        </Form.Group>
                                        <div className='text-end text-small mb-3 resetpassword'>
                                            <small>
                                                <Link href={'/auth/reset-password'}>{t('Forgot Password')} ?</Link>
                                            </small>
                                        </div>
                                        <Button variant='primary w-100 mb-3' className='submit_login' type='submit' disabled={loading}>
                                            {loading ? t('Please Wait') : t('Login')}
                                        </Button>
                                    </Form>
                                    <p className='text-center'>
                                        {t('Dont have account')}&nbsp;
                                        <span>
                                            <Link href='/auth/sign-up' replace className='text-dark auth-signup'>
                                                {t('Sign Up')}
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

export default withTranslation()(Login)