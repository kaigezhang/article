import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Icon, Row, Col } from 'antd'
import { Navbar, PageFooter } from 'components'

import './index.less'

const {
  Header,
  Content,
  Footer,
} = Layout


const DefaultLayout = ({
  children,
  footer,
}) => {
  return (
    <Layout>
      <Header style={{
 position: 'fixed', width: '100%', padding: '0px 100px',
}}
      >
        <Navbar />
      </Header>

      <Content style={{ marginTop: 64 }}>
        <Row>
          <Col span={20} offset={2}>
            { children }
          </Col>
        </Row>

      </Content>
      <Footer>
        { footer || (
          <PageFooter
            links={[{
              title: '首页',
              href: '/',
            }, {
              title: '服务条款',
              href: '/service',
            }, {
              title: '隐私保护',
              href: '/protect',
            }]}
            copyright={
              <div>
                Copyright <Icon type="copyright" /> 2017 xueshu.io
              </div>
            }
          />
        )
        }
      </Footer>
    </Layout>
  )
}

DefaultLayout.propTypes = {
  footer: PropTypes.node,
  children: PropTypes.any,
}

export default DefaultLayout
