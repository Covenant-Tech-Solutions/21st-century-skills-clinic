import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from 'src/components/SEO/Meta'
import ContactUs from 'src/components/Static-Pages/ContactUs'

const Contact_us = ({ t }) => {

  return (
    <React.Fragment>
      <Meta />
      <ContactUs />
    </React.Fragment>
  )
}
export default withTranslation()(Contact_us)
