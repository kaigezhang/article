import React from 'react'
import { connect } from 'react-redux'
import { LoginModal } from 'components'
import { fromModal } from 'store/selectors'
import { userLogin, userRegister, userLogout, modalShow, modalHide } from 'store/actions'

const LoginModalContainer = props => <LoginModal {...props} />

const mapStateToProps = state => ({
  loginModalVisible: fromModal.isOpen(state, 'loginModal'),
})

const mapDispatchToProps = dispatch => ({
  login: options => dispatch(userLogin.request(options)),
  logout: () => dispatch(userLogout()),
  register: options => dispatch(userRegister.request(options)),
  showLoginModal: () => dispatch(modalShow('loginModal')),
  hideLoginModal: () => dispatch(modalHide('loginModal')),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalContainer)
