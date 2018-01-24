import React from 'react'
import { connect } from 'react-redux'
import { fromUser } from 'store/selectors'
import { PagePopup } from 'components'
import { modalShow, resourceCreateRequest } from 'store/actions'


const PagePopupContainer = props => <PagePopup {...props} />

export default connect(
  state => ({
    currentUser: fromUser.getUser(state),
  }),
  dispatch => ({
    showLoginModal: () => dispatch(modalShow('loginModal')),
    saveAnnotation: data => dispatch(resourceCreateRequest('annotations', data)),
  })
)(PagePopupContainer)
