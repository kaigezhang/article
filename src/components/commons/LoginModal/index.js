import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Modal, Tabs } from 'antd'
import Login from './Login'
import Register from './Register'
import './index.less'


const { TabPane } = Tabs

class LoginModal extends PureComponent {
  onTabChange(key) {
    console.log(key)
  }

  render() {
    const {
      loginModalVisible, hideLoginModal, login, register,
    } = this.props
    return (
      <Modal
        title={null}
        width={500}
        visible={loginModalVisible}
        footer={null}
        onCancel={hideLoginModal}
      >
        <Tabs className="tabs" defaultActiveKey="1" onChange={this.onTabChange}>
          <TabPane tab="登录" key="1">
            <Login login={login} hideLoginModal={hideLoginModal} />
          </TabPane>
          <TabPane tab="注册" key="2">
            <Register register={register} hideLoginModal={hideLoginModal} />
          </TabPane>
        </Tabs>

      </Modal>
    )
  }
}

LoginModal.propTypes = {
  login: PropTypes.func,
  register: PropTypes.func,
  loginModalVisible: PropTypes.bool,
  hideLoginModal: PropTypes.func,
  handleLogin: PropTypes.func,
}

export default LoginModal
