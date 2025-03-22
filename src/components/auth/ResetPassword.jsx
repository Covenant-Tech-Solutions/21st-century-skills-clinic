"use client"
import React, { useRef, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FaEnvelope } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import FirebaseData from 'src/utils/Firebase'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { t } from 'i18next'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const ResetPassword = () => {

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const emailRef = useRef()

  const { auth } = FirebaseData()

  // auth password reset
  const passwordReset = async email => {
    let promise = await new Promise(function (resolve, reject) {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          resolve(`Password Reset Email sent to ${email}`)
        })
        .catch(error => {
          reject(error)
        })
    })

    return promise
  }

  // calling auth password reset
  const handlePasswordReset = e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const email = emailRef.current.value
    passwordReset(email)
      .then(msg => {
        setMessage(msg)
        setLoading(false)
      })
      .catch(error => {
        toast.error(error.message)
        setLoading(false)
      })
  }

  return (
    <Layout>
      <div className='ResetPassword wrapper loginform mt-1'>
        <div className='custom-container glassmorcontain'>
          <div className='row morphisam'>
            <div className='col-12 border-line position-relative'>
              <div className='inner__login__form outerline'>
                <h3 className='mb-4'>{t('Forgot Password')}?</h3>
                <p>{t('send link to get account')}</p>

                <Form onSubmit={e => handlePasswordReset(e)}>
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
                  <Button variant='primary w-100 mb-3' className='email_send' type='submit' disabled={loading}>
                    {loading ? t('Please Wait') : t('Send')}
                  </Button>
                  {message && <p>{message}</p>}
                  <div className='sign__up'>
                    <p className=''>
                      <span>
                        <Link href={'/auth/login'}> {t('Back to Login')}</Link>
                      </span>
                    </p>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(ResetPassword)
