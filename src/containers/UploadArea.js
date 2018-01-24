import React from 'react'
import { connect } from 'react-redux'
import { fromUser, fromModal } from 'store/selectors'
import { modalShow, modalHide } from 'store/actions'
import { UploadArea } from 'components'

const UploadAreaContainer = props => <UploadArea {...props} />

const mapStateToProps = state => ({
  user: fromUser.getUser(state),
  uploadModalVisible: fromModal.isOpen(state, 'uploadModal'),
})

const mapDispatchToProps = dispatch => ({
  showUploadModal: () => dispatch(modalShow('uploadModal')),
  hideUploadModal: () => dispatch(modalHide('uploadModal')),
})
export default connect(mapStateToProps, mapDispatchToProps)(UploadAreaContainer)
