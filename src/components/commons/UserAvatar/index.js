import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'

const UserAvatar = ({ currentUser, size }) => (
  <Avatar src={currentUser.image} size={size} style={{ cursor: 'pointer', background: '#7bc8e6' }}>
    { currentUser.image ? '' : currentUser.username }
  </Avatar>
)

export default UserAvatar

UserAvatar.propTypes = {
  size: PropTypes.any,
  currentUser: PropTypes.any,
}
