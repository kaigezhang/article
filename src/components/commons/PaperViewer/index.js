import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { PdfReader } from 'components'
// import { Spin } from 'antd'


class PaperViewer extends PureComponent {
  constructor(props) {
    super(props)
    this.getFile = this.getFile.bind(this)
  }

  componentDidMount() {
    this.getFile()
  }
  getFile() {
    const { paper, getFile } = this.props
    getFile(paper.paper.filename)
  }

  render() {
    const {
      paper, annotations, saveSelectors, file, paperId
    } = this.props

    return (
      <PdfReader
        file={file}
        paperId={paperId}
        filename={paper.filename}
        annotations={annotations}
        saveSelectors={saveSelectors}
      />
    )
  }
}

PaperViewer.propTypes = {
  paper: PropTypes.object,
  file: PropTypes.any,
  getFile: PropTypes.func,
  annotations: PropTypes.arrayOf(PropTypes.any),
  saveSelectors: PropTypes.func,
  paperId: PropTypes.string,
}

export default PaperViewer
