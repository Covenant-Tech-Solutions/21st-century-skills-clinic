import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from 'src/components/SEO/Meta'
import TermsAndConditions from 'src/components/Static-Pages/TermsAndConditions'

const TermAndConditions = ({ t }) => {

  return (
    <React.Fragment>
      <Meta />
      <TermsAndConditions />
    </React.Fragment>
  )
}
export default withTranslation()(TermAndConditions)
