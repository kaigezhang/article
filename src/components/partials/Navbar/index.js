import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Menu, Icon } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { UserButton } from 'containers'

import './index.less'

class Navbar extends PureComponent {
  constructor(props) {
    super(props)
    const { path } = this.props.match
    this.state = {
      current: path,
    }
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    })
  }
  render() {
    return (
      <Row>
        <Col span={20} offset={2}>
          <div className="nav">
            <div className="nav-header">
              <a href="/">
                <Icon type="message" />&nbsp;&nbsp;xueshu.io
              </a>
            </div>
            <div className="nav-item">
              <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
                id="nav"
              >
                <Menu.Item key="/">
                  <Link to="/">
                    <Icon type="home" />
                    主页
                  </Link>
                </Menu.Item>
              </Menu>
            </div>
            <div style={{ float: 'right' }}>
              <UserButton />
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}


Navbar.propTypes = {
  match: PropTypes.object,
}


export default withRouter(Navbar)
