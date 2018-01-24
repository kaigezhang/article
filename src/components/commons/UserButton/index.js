import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Icon, Menu, Avatar } from 'antd'
import { Redirect } from 'react-router-dom'
import { LoginModal } from 'containers'
import './index.less'


const UserButton = ({
  isLoggedIn,
  user,
  showLoginModal,
  logout,
  redirect,
}) => {
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'logout':
        logout()
        break
      case 'profile':
        redirect(`/@${user.username}`)
        break
      case 'settings':
        redirect('/setting')
        break
      default:
        break
    }
  }
  const menu = (
    <Menu className="menu" onClick={handleMenuClick}>
      <Menu.Item key="profile"><Icon type="user" />个人中心</Menu.Item>
      <Menu.Item key="setting"><Icon type="setting" />设置</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <div>
      {
        isLoggedIn ?
          <Dropdown
            overlay={menu}
            triggle={['click']}
          >
            <a className="ant-dropdown-link" href="#">
              <Avatar style={{ verticalAlign: 'middle', marginRight: 12 }} size="large">
                {user.username}
              </Avatar>
              { user.username } <Icon type="down" />
            </a>
          </Dropdown> :
          <Button
            type="primary"
            icon="login"
            size="small"
            onClick={showLoginModal}
          >
            注册或登录
          </Button>
      }
      <LoginModal />
    </div>
  )
}

UserButton.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func,
  register: PropTypes.func,
  showLoginModal: PropTypes.func,
  redirect: PropTypes.func,
}

export default UserButton
