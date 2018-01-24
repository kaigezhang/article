import React from 'react'
import { connect } from 'react-redux'
import { UserButton } from 'components'
import { fromUser, fromModal } from 'store/selectors'
import { userLogin, userRegister, userLogout, modalShow, modalHide } from 'store/actions'
import { push } from 'react-router-redux'

const UserButtonContainer = props => <UserButton {...props} />

const mapStateToProps = state => ({
  user: fromUser.getUser(state),
  isLoggedIn: fromUser.getAuth(state),
  loginModalVisible: fromModal.isOpen(state, 'loginModal'),
})

const mapDispatchToProps = dispatch => ({
  login: options => dispatch(userLogin.request(options)),
  logout: () => dispatch(userLogout()),
  register: options => dispatch(userRegister.request(options)),
  showLoginModal: () => dispatch(modalShow('loginModal')),
  hideLoginModal: () => dispatch(modalHide('loginModal')),
  redirect: path => dispatch(push(path)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserButtonContainer)
