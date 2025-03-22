import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from 'src/components/SEO/Meta'
import Instructions from 'src/components/Static-Pages/Instructions'

const Instruction = ({ t }) => {

  return (
    <React.Fragment>
      <Meta />
      <Instructions />
    </React.Fragment>
  )
}

export default withTranslation()(Instruction)
