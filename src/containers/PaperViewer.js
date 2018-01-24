import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PaperViewer } from 'components'
import { Spin } from 'antd'
import { fromResource, fromEntities } from 'store/selectors'
import {
  resourceDetailReadRequest,
  resourceCreateRequest,
} from 'store/actions'
import { resourceSubListReadRequest } from '../store/resource/actions'


class PaperViewerContainer extends PureComponent {
  static propTypes = {
    getPaper: PropTypes.func,
    saveSelectors: PropTypes.func,
    getAnnotations: PropTypes.func,
    getFile: PropTypes.func,
    paperId: PropTypes.string,
    paper: PropTypes.object,
    file: PropTypes.any,
    annotations: PropTypes.arrayOf(PropTypes.any),
  }
  componentWillMount() {
    this.getPaper()
  }

  async getPaper() {
    const { paperId } = this.props
    await this.props.getPaper(paperId)
    await this.props.getAnnotations(paperId, null)
  }

  render() {
    const {
      paper, annotations, saveSelectors, getFile, file, paperId,
    } = this.props

    console.log(annotations, 'annotations')
    return paper ? (
      <PaperViewer
        paper={paper}
        paperId={paperId}
        getFile={getFile}
        file={file}
        annotations={annotations}
        saveSelectors={saveSelectors}
      />
    ) : <Spin size="large" />
  }
}

// const PaperViewerContainer = props => <PaperViewer {...props} />

const mapStateToProps = state => ({
  paper: fromResource.getDetail(state, 'papers'),
  annotations: fromEntities.getList(
    state, 'annotations',
    fromResource.getList(state, 'annotations')
  ),
  file: fromResource.getDetail(state, 'files'),
})


const mapDispatchToProps = dispatch => ({
  getPaper: paperId => dispatch(resourceDetailReadRequest('papers', paperId)),
  getAnnotations: (paperId, params) => dispatch(resourceSubListReadRequest('annotations', `papers/${paperId}`, params)),
  saveSelectors: data => dispatch(resourceCreateRequest('annotations', data)),
  getFile: filename => dispatch(resourceDetailReadRequest('files', filename)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PaperViewerContainer)
