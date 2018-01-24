import React from 'react'
import PropTypes from 'prop-types'
import { PaperViewer } from 'containers'
import { PaperLayout } from 'components'

const PaperPage = ({
  match,
}) => {
  const { paperId } = match.params
  return (
    <PaperLayout>
      <PaperViewer
        paperId={paperId}
      />
    </PaperLayout>
  )
}

PaperPage.propTypes = {
  match: PropTypes.any,
}

export default PaperPage

