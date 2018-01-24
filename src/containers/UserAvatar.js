import React from 'react'
import { connect } from 'react-redux'
import { UserAvatar } from 'components'
import { fromUser } from 'store/selectors'

const UserAvatarContainer = props => <UserAvatar {...props} />

const mapStateToProps = state => ({
  currentUser: fromUser.getUser(state),
})

export default connect(mapStateToProps)(UserAvatarContainer)
