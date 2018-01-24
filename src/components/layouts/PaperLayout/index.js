import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Row, Col } from 'antd'
import { Navbar } from 'components'

import './index.less'

const {
  Header,
  Content,
} = Layout


const PaperLayout = ({
  children,
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
    </Layout>
  )
}

PaperLayout.propTypes = {
  children: PropTypes.any,
}

export default PaperLayout
