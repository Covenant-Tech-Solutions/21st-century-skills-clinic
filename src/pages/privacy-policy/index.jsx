import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from 'src/components/SEO/Meta'
import PrivacyPolicyComp from 'src/components/Static-Pages/PrivacyPolicy'

const PrivacyPolicy = ({ t }) => {

  return (
    <React.Fragment>
      <Meta />
      <PrivacyPolicyComp />
    </React.Fragment>
  )
}
export default withTranslation()(PrivacyPolicy)
