import React from 'react'
import { connect } from 'react-redux'
import { ProfilePage } from 'components'
import { push } from 'react-router-redux'

const ProfilePageContainer = props => <ProfilePage {...props} />

export default connect(null, dispatch => ({
  redirect: path => dispatch(push(path)),
}))(ProfilePageContainer)
